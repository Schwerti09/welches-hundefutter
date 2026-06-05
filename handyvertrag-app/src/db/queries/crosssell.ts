// Cross-Selling-Matching: kuratierte Begleitprodukte NACH der Futter-Empfehlung.
// Gesetz: max. 2–3, jedes mit „warum", Relevanz vor Provision, Allergen-Ausschluss.
import { neon } from "@neondatabase/serverless";

export interface CompanionContext {
  issues: string[];        // z. B. ["haut","fell","gelenke","magen","zecken"]
  lifeStage: string[];     // ["welpen"|"adult"|"senior"]
  allergen: string | null; // bei Allergie: das auslösende Protein (z. B. "Huhn")
}

export interface Companion {
  slug: string; brand: string; name: string; category: string;
  price: number | null; imageUrl: string | null; affiliateUrl: string; reason: string;
}

interface Row {
  slug: string; brand: string; name: string; category: string; protein: string | null;
  companion_for: { issue?: string[]; lifeStage?: string[]; behavior?: string[] } | null;
  price: string | null; image_url: string | null; affiliate_url: string;
}

const REASON_BY_ISSUE: Record<string, string> = {
  haut: "für gesunde Haut", fell: "für ein glänzendes Fell", gelenke: "unterstützt die Gelenke",
  magen: "schonend für den Magen", verdauung: "gut für die Verdauung", zahn: "für gesunde Zähne",
  zecken: "natürlicher Zeckenschutz", parasiten: "gegen Zecken & Parasiten", stress: "zum Entspannen",
};
const CAT_LABEL: Record<string, string> = {
  snack: "Snack", nem_oel: "Ergänzung", gesundheit: "Gesundheit",
  zubehoer: "Zubehör", zeckenschutz: "Zeckenschutz", versicherung: "Versicherung",
};

export async function getCompanions(ctx: CompanionContext, limit = 3): Promise<Companion[]> {
  const url = process.env.DATABASE_URL;
  if (!url) return [];
  const issues = ctx.issues.length ? ctx.issues : ["__none__"];
  const lifeStage = ctx.lifeStage.length ? ctx.lifeStage : ["__none__"];
  const allergen = ctx.allergen ?? "__none__";
  try {
    const sql = neon(url);
    const res = await sql.query(
      `SELECT slug, brand, name, category, protein, companion_for, price, image_url, affiliate_url
       FROM cross_sell
       WHERE is_active = true AND affiliate_url <> '' AND name <> ''
         AND (protein IS NULL OR protein <> $3)
         AND (
           jsonb_exists_any(COALESCE(companion_for->'issue', '[]'::jsonb), $1::text[])
           OR jsonb_exists_any(COALESCE(companion_for->'lifeStage', '[]'::jsonb), $2::text[])
           OR jsonb_exists_any(COALESCE(companion_for->'behavior', '[]'::jsonb), $1::text[])
           OR category IN ('snack', 'zeckenschutz')
         )
       ORDER BY (price IS NULL) ASC, price ASC NULLS LAST
       LIMIT 120`,
      [issues, lifeStage, allergen]
    );
    const rows = ((res as unknown as { rows?: Row[] }).rows ?? (res as unknown as Row[])) || [];

    const scored = rows.map((o) => {
      const cf = o.companion_for ?? {};
      const issueHits = (cf.issue ?? []).filter((i) => ctx.issues.includes(i));
      const lifeHits = (cf.lifeStage ?? []).filter((l) => ctx.lifeStage.includes(l));
      const behaviorHits = cf.behavior ?? [];
      let score = issueHits.length * 10 + lifeHits.length * 4 + behaviorHits.length * 3;
      if (o.category === "zeckenschutz") score += 2;     // immer sinnvoll im Sommer
      if (o.category === "snack") score += 1;            // genereller Food-Begleiter
      // Begründung: konkretester Treffer zuerst
      let reason = "";
      if (issueHits.length) reason = REASON_BY_ISSUE[issueHits[0]] ?? "passend zu deinem Hund";
      else if (behaviorHits.includes("schlingt")) reason = "gegen zu schnelles Fressen";
      else if (o.category === "zeckenschutz") reason = "natürlicher Zeckenschutz ohne Chemie";
      else if (o.category === "snack") reason = ctx.allergen ? `als Belohnung — ohne ${ctx.allergen}` : "die passende Belohnung";
      else reason = "passend zu deinem Hund";
      return { o, score, reason };
    }).filter((x) => x.score > 0);

    scored.sort((a, b) => b.score - a.score || (Number(a.o.price ?? 999) - Number(b.o.price ?? 999)));

    // Kategorie-Vielfalt: max. 1 pro Kategorie → kein „3x Snack"
    const out: Companion[] = [];
    const usedCat = new Set<string>();
    for (const x of scored) {
      if (out.length >= limit) break;
      if (usedCat.has(x.o.category)) continue;
      usedCat.add(x.o.category);
      out.push({
        slug: x.o.slug, brand: x.o.brand, name: x.o.name, category: CAT_LABEL[x.o.category] ?? x.o.category,
        price: x.o.price != null ? parseFloat(x.o.price) : null, imageUrl: x.o.image_url,
        affiliateUrl: x.o.affiliate_url, reason: x.reason,
      });
    }
    return out;
  } catch {
    return [];
  }
}
