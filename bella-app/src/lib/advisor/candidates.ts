/**
 * DB-Abfragen für den Berater — aus route.ts ausgelagert (Roadmap 2A.8), damit
 * die Allergen-Eval sie direkt gegen Neon testen kann.
 *
 * `fetchCandidates` ist der sicherheitskritische Pfad: hier greift der harte
 * Allergen-Ausschluss (SQL + zweite Sicherung). Garantie CLAUDE.md §4a.
 */
import { neon } from "@neondatabase/serverless";
import type { DogIntent } from "./intent";
import { scoreFood, type DogFoodRow, type ScoredFood } from "./scoring";
import { allergenLikePatterns, containsAnyAllergen } from "./allergens";

export interface StudyCitation {
  slug: string;
  title: string;
  authors: string[];
  year: number;
  journal: string;
  bella_summary: string;
  evidence_strength: string;
  topic_hub: string;
}

export function intentToHubs(intent: DogIntent): string[] {
  const hubs: string[] = [];
  if (intent.sensitive || intent.avoidProtein?.length) hubs.push("allergien");
  if (intent.lifePhase === "welpen") hubs.push("welpen");
  if (intent.lifePhase === "senior") hubs.push("senioren");
  if (intent.foodType === "barf") hubs.push("barf");
  if (intent.maxPricePerKg && intent.maxPricePerKg <= 6) hubs.push("uebergewicht");
  // Kein Default-Hub mehr (2A.7): ohne konkrete Sorge zitiert BELLA keine Studie.
  return hubs;
}

export async function fetchRelevantStudies(intent: DogIntent): Promise<StudyCitation[]> {
  const url = process.env.DATABASE_URL;
  if (!url) return [];
  const hubs = intentToHubs(intent);
  if (!hubs.length) return []; // ohne konkrete Sorge keine Studie (2A.7)
  try {
    const sql = neon(url);
    const rows = await sql`
      SELECT slug, title, authors, year, journal, bella_summary, evidence_strength, topic_hub
      FROM studies
      WHERE topic_hub = ANY(${hubs})
        AND evidence_strength = 'hoch'
      ORDER BY year DESC
      LIMIT 1
    `;
    return rows as StudyCitation[];
  } catch {
    return [];
  }
}

export async function fetchCandidates(
  intent: DogIntent,
  opts: { relax?: boolean } = {},
): Promise<{ offers: ScoredFood[]; totalScanned: number; eliminated: number }> {
  const url = process.env.DATABASE_URL;
  if (!url) return { offers: [], totalScanned: 0, eliminated: 0 };
  const sql = neon(url);
  // `relax` (2A.3): weiche Kriterien fallen lassen (Futtertyp, Budget), Sicherheit
  // (Allergen-Ausschluss, Lebensphase, Snack-Guard) bleibt. Für die Re-Query, wenn
  // die erste Suche nichts Sicheres fand.
  const useFoodType = intent.foodType && !opts.relax;
  const useBudget = intent.maxPricePerKg && !opts.relax;

  // Nur Futtertyp + Budget hart filtern (genug Daten). Lebensphase, Allergie,
  // Protein sind dünn getaggt → weich über das Scoring (sonst leere Ergebnisse).
  const cond = ["is_active = true", "affiliate_url <> ''", "name <> ''"];
  const params: (string | number | string[])[] = [];
  let p = 1;

  // Hauptfutter-Empfehlung: nie ein Snack (Audit A8) und keine Neben-Kategorien.
  cond.push(`type <> 'snack'`);
  cond.push(`(category IS NULL OR category NOT IN ('snack','oel','nem','versicherung','zubehoer'))`);

  // 🔴 HARTER Allergen-Ausschluss auf SQL-Ebene (Roadmap 2A.2, CLAUDE.md §4a).
  // `avoidProtein` → alle Namensvarianten; kein Treffer in `protein` NOCH `name`.
  const avoidLike = allergenLikePatterns(intent.avoidProtein);
  if (avoidLike.length) {
    cond.push(`(protein IS NULL OR NOT (lower(protein) LIKE ANY($${p}::text[]))) AND NOT (lower(name) LIKE ANY($${p}::text[]))`);
    params.push(avoidLike);
    p++;
  }

  if (useFoodType) { cond.push(`type = $${p++}`); params.push(intent.foodType as string); }
  if (useBudget) { cond.push(`(price_per_kg IS NULL OR price_per_kg <= $${p++})`); params.push(intent.maxPricePerKg as number); }
  // Senior/Adult: Welpen-exklusive Produkte hart ausschließen. Produkte ohne suitable_for
  // (null = alle Lebensphase) bleiben drin. Gemischte Tags wie ['welpen','adult'] auch OK.
  if (intent.lifePhase === "senior" || intent.lifePhase === "adult") {
    cond.push(`NOT (suitable_for IS NOT NULL AND (suitable_for && ARRAY['welpen']::text[]) AND NOT (suitable_for && ARRAY['adult','senior']::text[]))`);
  }

  let totalScanned = 11000;
  try {
    const cnt = await sql.query(`SELECT COUNT(*)::int total FROM dog_foods WHERE ${cond.join(" AND ")}`, params);
    totalScanned = ((cnt as unknown as { rows?: { total: number }[] }).rows ?? (cnt as unknown as { total: number }[]))[0]?.total ?? 0;
  } catch { /* keep default */ }

  // Relevanz-Sortierung für die dünn getaggten Soft-Kriterien (boostet passende
  // Produkte in den Kandidaten-Pool, statt nur die billigsten zu nehmen).
  const orderParams = [...params];
  const relParts: string[] = [];
  if (intent.sensitive) relParts.push("(CASE WHEN (is_hypoallergenic OR is_grain_free) THEN 30 ELSE 0 END)");
  if (intent.lifePhase) { relParts.push(`(CASE WHEN suitable_for && ARRAY[$${p++}]::text[] THEN 22 ELSE 0 END)`); orderParams.push([intent.lifePhase]); }
  // Protein nur als PRÄFERENZ boosten, nicht wenn es das Allergen ist (sensitive)
  if (intent.protein && !intent.sensitive) { relParts.push(`(CASE WHEN protein ILIKE $${p++} THEN 16 ELSE 0 END)`); orderParams.push(`%${intent.protein}%`); }
  // Bare integer in ORDER BY = Spaltenposition → Relevanz nur anhängen, wenn vorhanden.
  const priceOrder = "(price_per_kg IS NULL) ASC, price_per_kg ASC NULLS LAST";
  const outerOrder = relParts.length ? `(${relParts.join(" + ")}) DESC, ${priceOrder}` : priceOrder;

  // Pro Produktname nur 1 Variante (günstigste), dann nach Relevanz + Preis/kg
  const nameKey = "lower(regexp_replace(name, '[^a-zA-Z0-9]', '', 'g'))";
  const rows = await sql.query(
    `SELECT * FROM (
       SELECT DISTINCT ON (${nameKey})
         id, slug, brand, name, type, protein, is_grain_free, is_hypoallergenic,
         price_per_kg, price, suitable_for, image_url, affiliate_url, rating, score
       FROM dog_foods WHERE ${cond.join(" AND ")}
       ORDER BY ${nameKey}, price_per_kg ASC NULLS LAST
     ) d ORDER BY ${outerOrder} LIMIT 120`,
    orderParams
  );
  const raw = ((rows as unknown as { rows?: DogFoodRow[] }).rows ?? (rows as unknown as DogFoodRow[])) || [];

  // Zweite Sicherung (der SQL-Filter oben ist die erste): namens-/protein-basiert
  // jedes gemiedene Protein raus. Ein Allergiker darf das NIE empfohlen bekommen.
  const safe = (intent.avoidProtein?.length)
    ? raw.filter(o => !containsAnyAllergen(`${o.name} ${o.protein ?? ""}`, intent.avoidProtein))
    : raw;

  const scored = safe.map(o => scoreFood(o, intent)).sort((a, b) => b.matchScore - a.matchScore);

  // Provider/Marken-Vielfalt: nicht 3x dieselbe Marke wenn vermeidbar
  const top: ScoredFood[] = [];
  const brands = new Set<string>();
  for (const o of scored) { if (top.length >= 3) break; if (!brands.has(o.brand.toLowerCase())) { top.push(o); brands.add(o.brand.toLowerCase()); } }
  for (const o of scored) { if (top.length >= 3) break; if (!top.includes(o)) top.push(o); }

  return { offers: top, totalScanned, eliminated: Math.max(0, totalScanned - top.length) };
}
