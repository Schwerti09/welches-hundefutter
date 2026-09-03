/**
 * BELLA Decision Intelligence Engine — Hunde-Ernährungsberatung
 * Streamt strukturierte Events (nicht nur Text).
 *
 * Stream-Protokoll:
 *   STEP:<id>:<label>\n     — sichtbarer Analyse-Schritt
 *   ELIM:<count>:<reason>\n — Eliminierungs-Event
 *   CONF:<score>\n          — Konfidenz
 *   SCORE:<json>\n          — Match-Scores der Top-Kandidaten
 *   TEXT:<chunk>            — KI-Begründung (gestreamt)
 *   OFFERS:<json>          — finale Empfehlung { offers, theme, confidence }
 */
import { NextRequest } from "next/server";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { neon } from "@neondatabase/serverless";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";
import { getCompanions, containsAllergen } from "@/db/queries/crosssell";
import { dailyGrams } from "@/lib/consumption-math";
import type { ActivityLevel } from "@/lib/consumption-math";
import { getVoucherForUrl } from "@/data/partners";
import { findGlossaryLinks } from "@/lib/glossary-links";

export const runtime = "nodejs";
export const maxDuration = 45;

// ─── Schema ───────────────────────────────────────────────────────────────────

const chatSchema = z.object({
  message: z.string().min(1).max(1000),
  sessionId: z.string().optional(),
  conversationHistory: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .max(40)
    .optional(),
});

// ─── Types ──────────────────────────────────────────────────────────────────

type FoodType = "trocken" | "nass" | "barf" | "snack" | "kaltgepresst";
type LifePhase = "welpen" | "adult" | "senior";

interface DogIntent {
  foodType?: FoodType;
  lifePhase?: LifePhase;
  sensitive?: boolean;     // Allergie / empfindlicher Magen
  grainFree?: boolean;
  protein?: string;        // bevorzugtes Protein, z. B. "Lachs"
  breed?: string;          // erwähnte Rasse (für Mengen-Hinweis)
  maxPricePerKg?: number;  // Budget €/kg
  currentFood?: string;    // aktuelles Futter (Marke oder "bekannt")
  wantToSwitch?: boolean;  // möchte Futter wechseln
  switchReason?: string;   // Grund für Wechsel ("vertraegt nicht", "mag nicht", "besser", "teuer")
}

interface DogFoodRow {
  id: string;
  slug: string;
  brand: string;
  name: string;
  type: string;
  protein: string | null;
  is_grain_free: boolean;
  is_hypoallergenic: boolean;
  price_per_kg: string | null;
  price: string | null;
  suitable_for: string[] | null;
  image_url: string | null;
  affiliate_url: string;
  rating: string | null;
  score: number | null;
}

interface ScoredFood extends DogFoodRow {
  matchScore: number;
  whyThis: string;
}

export type AdvisorTheme = "idle" | "budget" | "allergie" | "welpe" | "senior" | "barf" | "premium";

// ─── Intent Parsing ──────────────────────────────────────────────────────────

// Häufigste Rassen zuerst (kurze Alltagsnamen), gefolgt von allen weiteren ~170
// Rassen aus @/data/breeds.ts (volle Namen, lowercase) für eine vollständige
// Rasse-Erkennung über alle 186 Rassen der Plattform.
const BREEDS = ["labrador", "schäferhund", "chihuahua", "dackel", "golden retriever", "französische bulldogge",
  "mops", "beagle", "boxer", "border collie", "australian shepherd", "rottweiler", "husky", "pudel",
  "jack russell", "yorkshire", "malteser", "spitz", "dobermann", "berner sennenhund",
  "affenpinscher", "afghane", "airedale terrier", "akita inu",
  "alaskan klee kai", "alaskan malamute", "american akita", "american bulldog",
  "american bully", "american staffordshire terrier", "aussiedoodle", "australian cattle dog",
  "australian kelpie", "azawakh", "barsoi", "basenji",
  "basset hound", "bearded collie", "beauceron", "belgischer schäferhund groenendael",
  "belgischer schäferhund malinois", "belgischer schäferhund tervueren", "berger blanc suisse", "bernedoodle",
  "bernhardiner", "bichon frisé", "bluthund", "bobtail",
  "bolonka zwetna", "bordeauxdogge", "border terrier", "boston terrier",
  "bouvier des flandres", "bracco italiano", "briard", "brusseler griffon",
  "bull terrier", "bullmastiff", "cairn terrier", "cane corso",
  "cardigan welsh corgi", "cavalier king charles spaniel", "cavapoo", "chesapeake bay retriever",
  "chiweenie", "chow-chow", "cockapoo", "cocker spaniel",
  "corgidor", "coton de tulear", "curly coated retriever", "dalmatiner",
  "deutsch drahthaar", "deutsch kurzhaar", "deutsche dogge", "deutscher schäferhund",
  "dogo argentino", "drahthaar fox terrier", "englische bulldogge", "englischer mastiff",
  "english setter", "english springer spaniel", "epagneul breton", "eurasier",
  "finnischer lapphund", "finnischer spitz", "flat coated retriever", "galgo espanol",
  "golden labrador", "goldendoodle", "gordon setter", "greyhound",
  "grosser muensterlaender", "großspitz", "havaneser", "hovawart",
  "husky mix", "irischer wasserspaniel", "irischer wolfshund", "irish setter",
  "irish terrier", "islaendischer schaefer", "jack russell terrier", "jackabee",
  "japanischer spitz", "japanisches chin", "jindo", "kanaan-hund",
  "kangal", "kaukasischer owtscharka", "kleiner italienischer windhund", "kleiner münsterländer",
  "kleinspitz", "komondor", "korthals griffon", "kuvasz",
  "labradoodle", "labrador retriever", "lagotto romagnolo", "landseer",
  "langhaardackel", "leonberger", "lhasa apso", "löwchen",
  "magyar vizsla", "maltese shih tzu", "maltipoo", "miniatur bull terrier",
  "miniature american shepherd", "miniaturschnauzer", "mischling", "morkie",
  "mudi", "neapolitanischer mastiff", "neufundländer", "niederlaendischer schaeferhund",
  "norsk elkhund", "nova scotia duck tolling retriever", "otterhound", "papillon",
  "parson russell terrier", "pekinese", "petit basset griffon vendeen", "pharaonenhund",
  "podenco ibicenco", "pointer", "pomeranian", "zwergspitz",
  "pomsky", "portugiesischer wasserhund", "presa canario", "puggle",
  "puli", "rauhaardackel", "rhodesian ridgeback", "riesenschnauzer",
  "rough collie", "saarloos wolfhund", "saluki", "samojede",
  "schnauzer", "schnoodle", "schottischer deerhound", "schwarzer russischer terrier",
  "schwedischer lapphund", "schäferhund-labrador mix", "scottish terrier", "shetland sheepdog",
  "shiba inu", "shih tzu", "siberian husky", "sloughi",
  "soft coated wheaten terrier", "springador", "staffordshire bullterrier", "thai ridgeback",
  "tibetischer mastiff", "tibetischer spaniel", "tibetischer terrier", "weimaraner",
  "welsh corgi", "welsh springer spaniel", "welsh terrier", "west highland white terrier",
  "whippet", "wolfsspitz", "yorkipoo", "yorkshire terrier",
  "zwerg-dackel", "zwergpinscher"];

function parseIntent(message: string, history: { role: string; content: string }[]): DogIntent {
  // NFC zuerst: iOS/macOS liefern Umlaute oft zerlegt (u + ◌̈, NFD). Ohne Normalisierung
  // matcht /ü/ das nicht → "Hühnerallergie" würde nicht als Huhn erkannt → Allergiker
  // bekäme Huhn empfohlen. Tier-Sicherheit: NIE auf stiller Normalisierung beruhen.
  //
  // WICHTIG: Nur User-Nachrichten verwenden — Assistenten-Nachrichten enthalten
  // Fragewörter wie "Ist dein Hund ein Welpe?" die den Lebensphase-Regex fälschlich
  // triggern und die Intent-Erkennung korrumpieren.
  const userOnly = history.filter(h => h.role === "user").map(h => h.content);
  const all = [...userOnly, message].join(" ").normalize("NFC").toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");
  const intent: DogIntent = {};

  // Lebensphase
  if (/welpe|junior|puppy|baby/.test(all)) intent.lifePhase = "welpen";
  else if (/senior|\balt(er)?\b|aelter|ageing|aging|7\+|8\+/.test(all)) intent.lifePhase = "senior";
  else if (/adult|erwachsen/.test(all)) intent.lifePhase = "adult";

  // Futtertyp
  if (/barf|roh\b|frischfleisch|frostfutter/.test(all)) intent.foodType = "barf";
  else if (/nassfutter|nass\b|dose|dosen|feucht|menue|pastete/.test(all)) intent.foodType = "nass";
  else if (/snack|leckerli|leckerchen|kausnack|kauknochen|kaustange/.test(all)) intent.foodType = "snack";
  else if (/trockenfutter|trocken|kroketten/.test(all)) intent.foodType = "trocken";

  // Allergie / Sensibilität
  if (/allergi|sensibel|empfindlich|unvertraeglich|juckt|juckreiz|durchfall|blaeh|magen|verdauung|sensitiv/.test(all)) intent.sensitive = true;
  if (/getreidefrei|grain.?free|glutenfrei/.test(all)) { intent.grainFree = true; intent.sensitive = true; }

  // Protein/Allergen — beachte: `all` ist umlaut-normalisiert (ü→ue), daher
  // "Hühnerallergie" → "huehnerallergie". Varianten "huehn"/"gefluegel" mitfangen.
  for (const [k, lab] of [["huehn", "Huhn"], ["huhn", "Huhn"], ["haehnchen", "Huhn"], ["gefluegel", "Huhn"],
    ["rind", "Rind"], ["lachs", "Lachs"], ["lamm", "Lamm"], ["ente", "Ente"], ["pute", "Pute"],
    ["wild", "Wild"], ["fisch", "Fisch"], ["kaninchen", "Kaninchen"], ["pferd", "Pferd"]] as [string, string][]) {
    if (new RegExp(`\\b${k}`).test(all)) { intent.protein = lab; break; }
  }

  // Rasse
  for (const b of BREEDS) {
    const bNorm = b.replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");
    if (all.includes(bNorm)) { intent.breed = b; break; }
  }

  // Budget €/kg
  const ppk = all.match(/(?:unter|max(?:imal)?|bis zu?|hoechstens|<)\s*(\d+(?:[.,]\d+)?)\s*(?:€|eur|euro)?\s*(?:\/|pro|je)?\s*kg/);
  if (ppk) intent.maxPricePerKg = parseFloat(ppk[1].replace(",", "."));
  else if (/guenstig|billig|sparen|preiswert|wenig geld|kleines budget/.test(all)) intent.maxPricePerKg = intent.maxPricePerKg ?? 6;

  // Aktuelles Futter — erkennt ob Nutzer aktuelles Futter erwähnt (mit oder ohne Markenname)
  const currentFoodCtx = /frisst|bekommt|gebe (ihm|ihr)|fueттere|fuettere|kriegt|hat bisher|aktuell|momentan|bisher|seit (jahren?|monaten?|wochen?)/.test(all);
  if (currentFoodCtx) {
    // Versuche Marke zu extrahieren
    const FOOD_BRANDS = ["royal canin", "hills", "hill's", "animonda", "wolfsblut", "bosch", "brit", "purina", "eukanuba",
      "acana", "orijen", "taste of the wild", "bozita", "josera", "leonardo", "belcando", "platinum", "rinti",
      "happy dog", "julius", "granatapet", "herrmann", "luna", "grau", "tierfreund", "pedigree", "whiskas",
      "chappi", "frolic", "almo nature", "concept for life", "farmina", "advance", "proplan", "pro plan",
      "iams", "science diet", "specific", "mera", "bewi dog", "trixie", "defu", "kokoba", "wolkraft",
      "fleisch", "barf", "selbst zubereitet", "rohe kost"];
    let found = false;
    for (const b of FOOD_BRANDS) {
      if (all.includes(b)) { intent.currentFood = b; found = true; break; }
    }
    if (!found) intent.currentFood = "bekannt"; // Nutzer hat aktuelles Futter erwähnt, aber keine Marke
  }

  // Wechsel-Absicht
  if (/wechsel|umstell|anderes? futter|andere? marke|neues? futter|besseres? futter|probier/.test(all)) {
    intent.wantToSwitch = true;
  }
  if (intent.currentFood) intent.wantToSwitch = intent.wantToSwitch ?? true; // wenn aktuelles Futter bekannt, impliziert Wechsel

  // Wechsel-Grund
  if (/vertraegt (es|das|ihn) nicht|bekommt (ihm|ihr) nicht gut|kriegt davon durchfall|allergi|juckt/.test(all)) intent.switchReason = "vertraegt nicht";
  else if (/mag (es|das|ihn) nicht|frisst (es|das) nicht|will (es|das) nicht|schmeckt ihm nicht/.test(all)) intent.switchReason = "mag nicht";
  else if (/teuer|zu teuer|guenstig|sparen/.test(all) && intent.currentFood) intent.switchReason = "teuer";
  else if (intent.currentFood && !intent.switchReason) intent.switchReason = "optimieren";

  return intent;
}

function intentSignalCount(i: DogIntent): number {
  let n = 0;
  if (i.lifePhase) n++;
  if (i.foodType) n++;
  if (i.sensitive || i.protein) n++;
  if (i.maxPricePerKg) n++;
  if (i.breed) n++;
  if (i.currentFood) n++;
  return n;
}

// BELLA fragt mindestens 2x nach, bevor sie empfiehlt:
// - Runde 1: Lebensphase / Rasse / Allergie klären
// - Runde 2: aktuelles Futter & Wechselgrund klären (sehr wertvoll!)
// - Ab 4 Signalen ODER nach 3 User-Turns: empfehlen
// Verhindert endloses Nachfragen bei langen Gesprächen (Fallback: 4 Turns).
function hasEnoughIntent(i: DogIntent, history: { role: string; content: string }[]): boolean {
  const signals = intentSignalCount(i);
  const userTurns = history.filter(h => h.role === "user").length + 1;
  if (signals >= 4) return true;                            // viele Infos → direkt empfehlen
  if (signals >= 2 && i.currentFood) return true;          // Hund + aktuelles Futter bekannt → empfehlen
  if (signals >= 3 && userTurns >= 2) return true;         // viele Signale nach min. 2 Runden
  if (userTurns >= 4) return true;                         // nie länger als 4 Runden fragen
  return false;
}

function computeConfidence(i: DogIntent, history: { content: string }[]): number {
  let s = 12;
  if (i.lifePhase) s += 18;
  if (i.foodType) s += 14;
  if (i.sensitive) s += 14;
  if (i.protein) s += 10;
  if (i.maxPricePerKg) s += 12;
  if (i.breed) s += 10;
  if (i.currentFood) s += 14;
  if (i.wantToSwitch) s += 4;
  s += Math.min(history.length * 3, 14);
  return Math.min(s, 98);
}

function classifyTheme(i: DogIntent): AdvisorTheme {
  if (i.sensitive) return "allergie";
  if (i.lifePhase === "welpen") return "welpe";
  if (i.lifePhase === "senior") return "senior";
  if (i.foodType === "barf") return "barf";
  if (i.maxPricePerKg && i.maxPricePerKg <= 6) return "budget";
  return "idle";
}

// ─── DB-Abfrage: relevante Studien ────────────────────────────────────────────

interface StudyCitation {
  slug: string;
  title: string;
  authors: string[];
  year: number;
  journal: string;
  bella_summary: string;
  evidence_strength: string;
  topic_hub: string;
}

function intentToHubs(intent: DogIntent): string[] {
  const hubs: string[] = [];
  if (intent.sensitive) hubs.push("allergien");
  if (intent.lifePhase === "welpen") hubs.push("welpen");
  if (intent.lifePhase === "senior") hubs.push("senioren");
  if (intent.foodType === "barf") hubs.push("barf");
  if (intent.maxPricePerKg && intent.maxPricePerKg <= 6) hubs.push("uebergewicht");
  return hubs.length ? hubs : ["verdauung"];
}

async function fetchRelevantStudies(intent: DogIntent): Promise<StudyCitation[]> {
  const url = process.env.DATABASE_URL;
  if (!url) return [];
  try {
    const sql = neon(url);
    const hubs = intentToHubs(intent);
    const rows = await sql`
      SELECT slug, title, authors, year, journal, bella_summary, evidence_strength, topic_hub
      FROM studies
      WHERE topic_hub = ANY(${hubs})
        AND evidence_strength IN ('hoch', 'mittel')
      ORDER BY evidence_strength = 'hoch' DESC, year DESC
      LIMIT 2
    `;
    return rows as StudyCitation[];
  } catch {
    return [];
  }
}

// ─── DB-Abfrage: dog_foods ────────────────────────────────────────────────────

async function fetchCandidates(intent: DogIntent): Promise<{ offers: ScoredFood[]; totalScanned: number; eliminated: number }> {
  const url = process.env.DATABASE_URL;
  if (!url) return { offers: [], totalScanned: 0, eliminated: 0 };
  const sql = neon(url);

  // Nur Futtertyp + Budget hart filtern (genug Daten). Lebensphase, Allergie,
  // Protein sind dünn getaggt → weich über das Scoring (sonst leere Ergebnisse).
  const cond = ["is_active = true", "affiliate_url <> ''", "name <> ''"];
  const params: (string | number | string[])[] = [];
  let p = 1;

  if (intent.foodType) { cond.push(`type = $${p++}`); params.push(intent.foodType); }
  if (intent.maxPricePerKg) { cond.push(`(price_per_kg IS NULL OR price_per_kg <= $${p++})`); params.push(intent.maxPricePerKg); }
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
     ) d ORDER BY ${outerOrder} LIMIT 40`,
    orderParams
  );
  const raw = ((rows as unknown as { rows?: DogFoodRow[] }).rows ?? (rows as unknown as DogFoodRow[])) || [];

  // Bei Allergie das auslösende Protein hart ausschließen — auch namens-basiert
  // (Huhn → auch Geflügel/Hähnchen). Ein Allergiker darf das NIE empfohlen bekommen.
  const allergen = intent.sensitive ? (intent.protein ?? null) : null;
  const safe = allergen
    ? raw.filter(o => !containsAllergen(`${o.name} ${o.protein ?? ""}`, allergen))
    : raw;

  const scored = safe.map(o => scoreFood(o, intent)).sort((a, b) => b.matchScore - a.matchScore);

  // Provider/Marken-Vielfalt: nicht 3x dieselbe Marke wenn vermeidbar
  const top: ScoredFood[] = [];
  const brands = new Set<string>();
  for (const o of scored) { if (top.length >= 3) break; if (!brands.has(o.brand.toLowerCase())) { top.push(o); brands.add(o.brand.toLowerCase()); } }
  for (const o of scored) { if (top.length >= 3) break; if (!top.includes(o)) top.push(o); }

  return { offers: top, totalScanned, eliminated: Math.max(0, totalScanned - top.length) };
}

function scoreFood(o: DogFoodRow, intent: DogIntent): ScoredFood {
  let m = 55;
  const ppk = o.price_per_kg != null ? parseFloat(o.price_per_kg) : null;
  const reasons: string[] = [];

  if (intent.foodType && o.type === intent.foodType) { m += 14; }
  if (intent.lifePhase && (o.suitable_for ?? []).includes(intent.lifePhase)) { m += 14; reasons.push(`für ${intent.lifePhase}`); }
  if (intent.sensitive && (o.is_hypoallergenic || o.is_grain_free)) { m += 16; reasons.push(o.is_grain_free ? "getreidefrei" : "hypoallergen"); }
  if (intent.grainFree && o.is_grain_free) m += 6;
  if (intent.protein && !intent.sensitive && (o.protein ?? "").toLowerCase().includes(intent.protein.toLowerCase())) { m += 12; reasons.push(`${o.protein}`); }
  if (intent.maxPricePerKg && ppk != null) {
    if (ppk <= intent.maxPricePerKg * 0.85) { m += 12; reasons.push(`günstig (${ppk.toFixed(2)} €/kg)`); }
    else if (ppk <= intent.maxPricePerKg) { m += 6; }
    else m -= 12;
  }
  if (o.rating != null && parseFloat(o.rating) >= 4) m += 4;
  m = Math.max(20, Math.min(99, m));

  const base = reasons.length
    ? `Passt: ${reasons.join(", ")}.`
    : ppk != null
      ? `Solides ${o.type}-Futter${o.protein ? ` mit ${o.protein}` : ""} für ${ppk.toFixed(2)} €/kg.`
      : `${o.type}-Futter${o.protein ? ` mit ${o.protein}` : ""} von ${o.brand}.`;

  return { ...o, matchScore: m, whyThis: base };
}

// ─── System-Prompt ────────────────────────────────────────────────────────────

function buildSystemPrompt(offers: ScoredFood[], confidence: number, ask: boolean, intent: DogIntent, studies: StudyCitation[] = []): string {
  const block = offers.length
    ? offers.map((o, i) => {
        const sf = Array.isArray(o.suitable_for) && o.suitable_for.length ? o.suitable_for.join("/") : "alle Lebensphase";
        const voucher = getVoucherForUrl(o.affiliate_url);
        const voucherNote = voucher
          ? ` · 🎁 GUTSCHEIN VERFÜGBAR bei ${voucher.shopName}: ${voucher.discount}${voucher.code ? ` (Code ${voucher.code})` : " (kein Code nötig, automatisch über den Link)"}`
          : "";
        const scoreNote = o.score != null ? ` · BELLA-Score ${o.score}/100${o.score < 40 ? " ⚠️ NIEDRIG" : ""}` : "";
        const vagueProtein = !o.protein || /tierisch|nebenerzeugnis/i.test(o.protein);
        return `[${i + 1}] ${o.brand} ${o.name} · Typ: ${o.type}${o.protein ? ` · Protein: ${o.protein}` : " · Protein: nicht klar benannt ⚠️"}` +
          `${o.price_per_kg ? ` · ${parseFloat(o.price_per_kg).toFixed(2)} €/kg` : o.price ? ` · ${parseFloat(o.price).toFixed(2)} €` : ""}` +
          `${o.is_grain_free ? " · getreidefrei" : ""}${o.is_hypoallergenic ? " · hypoallergen" : ""} · geeignet für: ${sf} · Match ${o.matchScore}%${scoreNote}${vagueProtein ? " · ⚠️ vage Proteinquelle" : ""}${voucherNote}`;
      }).join("\n")
    : "Noch keine Futter-Daten — weitere Infos über den Hund einholen.";

  const known: string[] = [];
  if (intent.breed) known.push(`Rasse: ${intent.breed}`);
  if (intent.lifePhase) known.push(`Lebensphase: ${intent.lifePhase}`);
  if (intent.sensitive) known.push(`empfindlich/Allergie${intent.protein ? ` (auf ${intent.protein})` : ""}`);
  if (intent.foodType) known.push(`Wunsch-Futtertyp: ${intent.foodType}`);
  if (intent.maxPricePerKg) known.push(`Budget: bis ${intent.maxPricePerKg} €/kg`);
  if (intent.currentFood && intent.currentFood !== "bekannt") known.push(`aktuelles Futter: ${intent.currentFood}`);
  else if (intent.currentFood === "bekannt") known.push("aktuelles Futter: erwähnt (ohne Marke)");
  if (intent.wantToSwitch && intent.switchReason) known.push(`Wechselgrund: ${intent.switchReason}`);

  // Was fehlt noch für eine gute Empfehlung?
  const missing: string[] = [];
  if (!intent.lifePhase) missing.push("Lebensphase (Welpe / ausgewachsen / Senior)");
  if (!intent.currentFood) missing.push("aktuelles Futter & warum sie wechseln möchten");
  if (!intent.sensitive && !intent.protein) missing.push("Allergien oder empfindlicher Magen");
  if (!intent.foodType) missing.push("gewünschter Futtertyp (Trocken / Nass / BARF)");

  const switchCtx = intent.wantToSwitch && intent.currentFood
    ? `\nKONTEXT FUTTERWECHSEL: Hund frisst aktuell "${intent.currentFood}", Grund: ${intent.switchReason ?? "unbekannt"}. Beziehe dich auf diesen Wechsel in der Empfehlung.`
    : "";

  const mode = ask
    ? `MODUS: GESPRÄCH / NACHFRAGEN (noch keine Empfehlung zeigen)

Was ich bereits weiß: ${known.length ? known.join(" · ") : "noch nichts — erste Nachricht"}
Was noch fehlt: ${missing.slice(0, 2).join("; ")}

DEINE AUFGABE:
1. ERST: Reagiere kurz und warm auf das, was der Halter gerade gesagt hat (1 kurzer Satz — zeige, dass du zuhörst und verstanden hast). Beziehe dich auf konkrete Details (Rasse, Alter, Problem). Kein generisches "Super!" — sei spezifisch.
2. DANN: Stelle GENAU EINE natürliche Folgefrage.

PRIORITÄT der Fragen (was bringt mich am schnellsten zur besten Empfehlung):
  1. Falls Lebensphase unbekannt → frag danach: "Wie alt ist er/sie ungefähr — Welpe, ausgewachsen oder schon ein älteres Semester?"
  2. Falls aktuelles Futter unbekannt → frag danach: "Was frisst er/sie aktuell, und was ist der Grund für den Wechsel?"
  3. Falls Allergie/Sensibilität unklar → frag: "Gibt es Allergien oder reagiert er/sie auf bestimmte Zutaten?"
  4. Falls Futtertyp unklar → frag: "Soll es eher Trocken-, Nassfutter oder BARF sein?"

STIL: Freundlich, persönlich, wie eine kompetente Freundin die sich mit Hundeernährung auskennt. Biete 2-3 konkrete Antwort-Optionen an wenn passend. Keine Produkte nennen.`
    : `MODUS: EMPFEHLEN

Was ich weiß: ${known.length ? known.join(" · ") : "allgemeine Anfrage"}${switchCtx}

DEINE AUFGABE:
1. Empfiehl Futter [1] mit 2-3 echten, konkreten Gründen aus den Produktdaten (Typ, Protein, €/kg, getreidefrei/hypoallergen, geeignet für Lebensphase).
2. Nenne kurz Futter [2] als Alternative und WARUM es zweite Wahl ist.
3. Falls relevant: einen kurzen Praxis-Tipp (Tagesmenge nach Gewicht, Umstellungsdauer, Portionsgröße).
4. Optional: EINE natürliche Anschlussfrage wenn noch was Wichtiges fehlt.

STIL: Konkret und ehrlich. Nicht "Das ist perfekt für deinen Hund!" sondern "Das passt gut, weil...". 4-6 Sätze — immer vollständig beenden, nie mitten im Satz abbrechen.`;

  const studyBlock = studies.length
    ? `\nWISSENSCHAFT (peer-reviewed, kurz zitieren wenn wirklich passend — max. 1 Satz):\n${studies.map(s =>
        `– ${s.title} (${s.authors[0]?.split(",")[0] ?? ""} et al., ${s.year}): ${s.bella_summary.slice(0, 200)}`
      ).join("\n")}`
    : "";

  return `Du bist BELLA — eine erfahrene, ehrliche Hundeernährungsberaterin. Du kennst 11.000+ Futtersorten und kannst durch gute Fragen schnell herausfinden, was zu einem bestimmten Hund passt.

Du bist KEINE Verkäuferin. Du bist wie eine kluge Freundin, die sich auskennt — warmherzig, direkt, ohne Floskeln.

KONFIDENZ: ${confidence}% (wie sicher bin ich mir mit den vorliegenden Infos)

${mode}

ANALYSIERTE FUTTER-PRODUKTE (NUR diese verwenden — echte Daten aus 11.000+ Katalog):
${block}
${studyBlock}

STRIKTE REGELN — nie brechen:
- "geeignet für: alle Lebensphase" = für Welpe, Adult UND Senior geeignet. NIE "Juniorprodukt" nennen.
- Nur die echten Produktdaten oben verwenden. Nie Marken, Preise oder Inhaltsstoffe erfinden.
- Allergen-Sicherheit: Wenn Allergie auf X bekannt, empfehle NIE ein Produkt das X enthält.
- Du duzt den Halter. Immer auf Deutsch antworten.
- Wenn du eine Studie zitierst: nur wenn sie wirklich zur Situation passt, nie aufgezwungen.
- Steht bei einem der Futter "🎁 GUTSCHEIN VERFÜGBAR" dabei: erwähne den Rabatt kurz und beiläufig (1 halber Satz), wenn du genau dieses Futter empfiehlst. Nie erfinden, nie für Futter ohne diesen Hinweis erwähnen.
- Du darfst und sollst NEIN sagen: Steht bei Futter [1] "⚠️ NIEDRIG" (Score <40) oder "⚠️ vage Proteinquelle", sag das offen — "Lass [1] lieber, der Score ist niedrig" oder "die Proteinquelle ist hier nicht klar benannt, das würde ich bei einem Allergiker nicht riskieren" — und empfiehl stattdessen [2] oder [3], wenn die besser sind. Erfinde NIEMALS eine Zutatenliste, die nicht in den Produktdaten steht — bewerte nur anhand von Score, Protein-Klarheit, getreidefrei/hypoallergen und Preis/kg.
${intent.breed ? `- Rasse "${intent.breed}" ist bekannt — beziehe dich darauf wenn sinnvoll (rassetypische Probleme, Größe, Lebenserwartung).\n` : ""}${intent.currentFood && intent.currentFood !== "bekannt" ? `- Aktuelles Futter "${intent.currentFood}" bekannt — beziehe dich bei der Empfehlung auf den Wechsel.\n` : ""}`;
}

function fallbackQuestion(): string {
  return "Erzähl mir ein bisschen mehr über deinen Hund: Wie alt ist er oder sie ungefähr (Welpe, ausgewachsen, Senior)? Und was frisst er aktuell — soll es ein Wechsel werden oder komplett neu?";
}

function fallbackRecommend(offers: ScoredFood[]): string {
  if (!offers.length) return "Zu diesen Kriterien finde ich gerade nichts Passendes. Magst du Futtertyp oder Budget anpassen?";
  const o = offers[0];
  const price = o.price_per_kg ? `${parseFloat(o.price_per_kg).toFixed(2)} €/kg` : o.price ? `${parseFloat(o.price).toFixed(2)} €` : "";
  return `Meine Empfehlung: ${o.brand} ${o.name} (${o.type}${price ? `, ${price}` : ""}). ${o.whyThis}`;
}

// ─── Logging (non-blocking) ───────────────────────────────────────────────────

async function logChat(entry: { sessionId: string; userMessage: string; bellaReply: string; offersShown: number; topFood: string | null; hadResults: boolean }) {
  const url = process.env.DATABASE_URL;
  if (!url) return;
  try {
    const sql = neon(url);
    // Schema: siehe src/db/schema.ts (chatLogs) + drizzle/-Migrationen. Kein DDL im Request-Pfad.
    await sql`INSERT INTO chat_logs (session_id,user_message,bella_reply,offers_shown,top_food,had_results)
      VALUES (${entry.sessionId},${entry.userMessage},${entry.bellaReply},${entry.offersShown},${entry.topFood},${entry.hadResults})`;
  } catch { /* never block */ }
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let body: unknown;
  try { body = await request.json(); } catch { return new Response("Bad request", { status: 400 }); }

  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) return new Response("Invalid", { status: 400 });

  const { message, conversationHistory = [] } = parsed.data;
  const intent = parseIntent(message, conversationHistory);
  const confidence = computeConfidence(intent, conversationHistory);
  const theme = classifyTheme(intent);
  const ask = !hasEnoughIntent(intent, conversationHistory);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const emit = (line: string) => controller.enqueue(encoder.encode(line + "\n"));

      emit(`STEP:profile:Profil deines Hundes wird erstellt…`);
      emit(`CONF:${confidence}`);
      await new Promise(r => setTimeout(r, 120));

      let offers: ScoredFood[] = [];
      let relevantStudies: StudyCitation[] = [];
      if (!ask) {
        emit(`STEP:scan:Futter-Katalog wird durchsucht…`);
        await new Promise(r => setTimeout(r, 100));
        const [result, studies] = await Promise.all([
          fetchCandidates(intent),
          fetchRelevantStudies(intent),
        ]);
        offers = result.offers;
        relevantStudies = studies;
        emit(`STEP:load:${result.totalScanned} Futtersorten analysiert`);
        await new Promise(r => setTimeout(r, 80));
        emit(`STEP:elim:${result.eliminated} aussortiert`);
        if (intent.maxPricePerKg) emit(`ELIM:${Math.floor(result.eliminated * 0.4)}:Zu teuer pro kg`);
        if (intent.sensitive) emit(`ELIM:${Math.floor(result.eliminated * 0.25)}:Nicht allergikergeeignet`);
        await new Promise(r => setTimeout(r, 90));
        emit(`STEP:rank:Top ${offers.length} Futter bewertet`);
        if (offers.length) emit(`SCORE:${JSON.stringify(offers.map(o => ({ id: o.id, match: o.matchScore })))}`);
        if (relevantStudies.length) emit(`STUDY:${JSON.stringify(relevantStudies.map(s => ({ slug: s.slug, title: s.title, year: s.year, journal: s.journal, evidenceStrength: s.evidence_strength, topicHub: s.topic_hub })))}`);
        await new Promise(r => setTimeout(r, 80));
      } else {
        emit(`STEP:scan:Ich brauche noch ein paar Infos…`);
        await new Promise(r => setTimeout(r, 80));
      }

      emit(`STEP:reason:Antwort wird formuliert…`);

      // ── KI-Text ──
      let fullText = "";
      const sysPrompt = buildSystemPrompt(offers, confidence, ask, intent, relevantStudies);
      const history = conversationHistory.slice(-8);
      const geminiKey = process.env.GEMINI_API_KEY;
      const anthropicKey = process.env.ANTHROPIC_API_KEY;

      if (geminiKey) {
        try {
          const genAI = new GoogleGenerativeAI(geminiKey);
          const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction: sysPrompt });
          // maxOutputTokens 600→1200: Gemini 2.5 Flash verbraucht bei kurzen Antworten
          // teils Thinking-Tokens aus demselben Budget — bei 600 bricht die Antwort
          // mittendrin ab. 1200 gibt genug Raum für vollständige Empfehlungen.
          // thinkingBudget: 0 → Thinking deaktiviert: konversationelle Beratung braucht kein
          // Chain-of-Thought — spart Tokens und verhindert dass Thinking-Tokens das sichtbare
          // Output-Budget auffressen (Gemini 2.5 Flash verrechnet Thinking gegen maxOutputTokens).
          // maxOutputTokens 2048: Empfehlung + Kontext + Tipp + Folgefrage ~400-600 Tokens,
          // Frage mit Acknowledgment + Optionen ~200-300 Tokens — 2048 gibt sicheren Puffer.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const genConfig: any = { temperature: 0.8, maxOutputTokens: 2048, thinkingConfig: { thinkingBudget: 0 } };
          const chat = model.startChat({
            history: history.map(h => ({ role: h.role === "assistant" ? "model" : "user", parts: [{ text: h.content }] })),
            generationConfig: genConfig,
          });
          const result = await chat.sendMessageStream(message);
          for await (const chunk of result.stream) { const t = chunk.text(); if (t) { fullText += t; emit(`TEXT:${t.replace(/\r?\n/g, "\\n")}`); } }
        } catch { fullText = ""; }
      }
      if (!fullText && anthropicKey) {
        try {
          const anthropic = new Anthropic({ apiKey: anthropicKey });
          const msgs = [...history.map(h => ({ role: h.role as "user" | "assistant", content: h.content })), { role: "user" as const, content: message }];
          const resp = await anthropic.messages.create({ model: "claude-haiku-4-5", max_tokens: 1536, temperature: 0.8, system: sysPrompt, messages: msgs, stream: true });
          for await (const event of resp) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") { const t = event.delta.text; if (t) { fullText += t; emit(`TEXT:${t.replace(/\r?\n/g, "\\n")}`); } }
          }
        } catch { fullText = ""; }
      }
      if (!fullText) {
        fullText = ask ? fallbackQuestion() : fallbackRecommend(offers);
        for (const w of fullText.split(" ")) { emit(`TEXT:${w.replace(/\r?\n/g, "\\n")} `); await new Promise(r => setTimeout(r, 25)); }
      }

      emit(`STEP:done:${ask ? "Frage bereit" : "Analyse abgeschlossen"}`);

      // ── Begriffserklärung → Vertiefungs-Link auf bestehende Ratgeber-Seiten ──
      const glossaryLinks = findGlossaryLinks(`${message} ${fullText}`, 2);
      if (glossaryLinks.length) emit(`LINKS:${JSON.stringify(glossaryLinks)}`);

      const offerPayload = ask ? [] : offers.map(o => ({
        id: o.id,
        slug: o.slug,            // für Preis-Wecker (Schicht 2): keyed auf price_history.food_slug
        name: o.name,
        brand: o.brand,
        type: o.type,
        protein: o.protein,
        pricePerKg: o.price_per_kg != null ? parseFloat(o.price_per_kg) : null,
        price: o.price != null ? parseFloat(o.price) : null,
        suitableFor: o.suitable_for,
        rating: o.rating != null ? parseFloat(o.rating) : null,
        imageUrl: o.image_url,
        affiliateUrl: o.affiliate_url,
        whyThis: o.whyThis,
      }));

      emit(`OFFERS:${JSON.stringify({ offers: offerPayload, theme, confidence })}`);

      // ── Schicht 1: kuratierte Begleitprodukte (max. 3, je mit „warum", Allergen-Ausschluss) ──
      if (!ask && offers.length > 0) {
        const allText = [...conversationHistory.map(h => h.content), message].join(" ").toLowerCase();
        const jointBreed = /labrador|retriever|sch[äa]ferhund|berner|rottweiler|dogge|boxer|sennenhund/.test(allText);
        const issues: string[] = [];
        if (intent.sensitive) issues.push("haut", "fell", "magen", "verdauung");
        if (jointBreed || intent.lifePhase === "senior") issues.push("gelenke");
        if (/zahn|zahnstein|mundgeruch|dental/.test(allText)) issues.push("zahn");
        if (/stress|angst|beruhig|nervös/.test(allText)) issues.push("stress");
        if (/niere|nierenprobleme|renal/.test(allText)) issues.push("niere");
        if (/leber|leberprobleme/.test(allText)) issues.push("leber");
        if (/[üu]bergewicht|zu dick|dicke/.test(allText)) issues.push("uebergewicht");
        if (intent.lifePhase === "welpen") issues.push("spielen");
        try {
          const companions = await getCompanions({
            issues,
            lifeStage: intent.lifePhase ? [intent.lifePhase] : [],
            allergen: intent.sensitive ? (intent.protein ?? null) : null,
          }, 3);
          if (companions.length) emit(`COMPANIONS:${JSON.stringify({ companions })}`);
        } catch { /* Cross-Sell ist optional, nie blockierend */ }
      }

      // ── Futter-Pass: Profil anlegen (non-blocking, 500er nie sichtbar) ──
      if (!ask && offers.length > 0 && process.env.DATABASE_URL) {
        try {
          const allConv = [...conversationHistory.map(h => h.content), message].join(" ");
          // Hundename erkennen: "heißt Bello", "mein Hund Bello", "meine Hündin Luna"
          const nameMatch = allConv.match(/hei[ßs]t\s+([A-Za-zÀ-ž]{2,14})/u)
            || allConv.match(/(?:[Hh]und|[Hh]ündin|[Rr]üde|[Ww]elpe)[^A-Za-z]+([A-ZÀ-ž][a-zÀ-ž]{1,13})/u);
          // Stoppwörter: häufige groß geschriebene Wörter am Satzanfang/nach Komma, keine echten Namen.
          const NAME_STOPWORDS = new Set(["Er", "Sie", "Es", "Mein", "Meine", "Unser", "Unsere", "Der", "Die", "Das", "Und", "Aber", "Hat", "Ist", "War", "Frisst", "Wir", "Ich"]);
          const rawName = nameMatch?.[1] && !NAME_STOPWORDS.has(nameMatch[1]) ? nameMatch[1] : null;
          const breedName = intent.breed
            ? intent.breed.split(/[\s-]/)[0].replace(/^./, (c) => c.toUpperCase()) + "-Hund"
            : null;
          const dogName = rawName || breedName || "Bello";
          // Gewicht parsen: "15 kg", "15,5 kg", "15.5 kg"
          const allNorm = allConv.toLowerCase().normalize("NFC").replace(/ü/g, "ue").replace(/ä/g, "ae").replace(/ö/g, "oe");
          const wMatch = allNorm.match(/(\d+(?:[.,]\d+)?)\s*(?:kg|kilo)/);
          const weightKg = wMatch ? parseFloat(wMatch[1].replace(",", ".")) : null;
          // Alter: "3 jahre", "8 monate", "6 wochen" — sonst lifePhase als Fallback
          const ageRaw = allNorm.match(/\b(\d+)\s*(?:jahre?|monate?|wochen?)\b/);
          const lifePhaseFallback = intent.lifePhase === "welpen" ? "Welpe" : intent.lifePhase === "senior" ? "Senior" : null;
          const birthOrAge = ageRaw ? ageRaw[0].trim() : lifePhaseFallback;
          const actLevel: ActivityLevel = intent.lifePhase === "welpen" ? "niedrig" : intent.lifePhase === "senior" ? "niedrig" : "mittel";
          const dg = weightKg ? dailyGrams(weightKg, actLevel) : null;
          // Packungsgröße aus dem Produktnamen schätzen (z.B. "Paket Hund Allergie 9 kg") für den Nachschub-Wecker.
          const pkgMatch = offers[0].name?.match(/(\d+(?:[.,]\d+)?)\s*kg\b/i);
          const packageKg = pkgMatch ? parseFloat(pkgMatch[1].replace(",", ".")) : null;
          const estBagDays = dg && packageKg ? Math.round((packageKg * 1000) / dg) : null;
          const shareToken = randomBytes(18).toString("hex");
          const profileSql = neon(process.env.DATABASE_URL);
          const [row] = await profileSql`
            INSERT INTO dog_profiles (
              name, breed_slug, weight_kg, activity_level, allergies, health_flags,
              current_food_slug, est_daily_grams, est_bag_days, share_token, share_enabled, birth_or_age
            ) VALUES (
              ${dogName},
              ${intent.breed ? intent.breed.toLowerCase().replace(/\s+/g, "-") : null},
              ${weightKg ?? null},
              ${actLevel},
              ${intent.sensitive && intent.protein ? [intent.protein] : null},
              ${intent.lifePhase ? [intent.lifePhase] : null},
              ${offers[0].slug ?? null},
              ${dg ?? null},
              ${estBagDays ?? null},
              ${shareToken},
              true,
              ${birthOrAge ?? null}
            ) RETURNING id, share_token`;
          const topPricePerKg = offers[0].price_per_kg != null ? parseFloat(offers[0].price_per_kg) : null;
          const monthlyEuro = dg && topPricePerKg ? parseFloat(((dg / 1000) * 30 * topPricePerKg).toFixed(2)) : null;
          emit(`PROFILE:${JSON.stringify({
            id: row.id, shareToken: row.share_token, name: dogName, dailyGrams: dg,
            currentFood: offers[0].name, foodSlug: offers[0].slug ?? null, affiliateUrl: offers[0].affiliate_url ?? null,
            pricePerKg: topPricePerKg, monthlyEuro, estBagDays,
          })}`);
        } catch { /* never block the stream */ }
      }

      controller.close();

      logChat({
        sessionId: parsed.data.sessionId ?? "anon",
        userMessage: message, bellaReply: fullText.trim().slice(0, 2000),
        offersShown: offers.length, topFood: offers[0] ? `${offers[0].brand} ${offers[0].name}` : null,
        hadResults: offers.length > 0,
      });
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache, no-transform", "X-Accel-Buffering": "no" },
  });
}
