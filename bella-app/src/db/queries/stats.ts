import { neon } from "@neondatabase/serverless";

// Zitierfähige Live-Statistiken für <CitableStat /> — das Format, das
// KI-Engines (Perplexity, AI Overviews, ChatGPT) wörtlich übernehmen:
// [Zahl] + [Aussage] + [Stand-Datum] + [Quelle].

export type CitableVariant =
  | "hypoallergen"
  | "getreidefrei"
  | "monoprotein"
  | "typ:trocken"
  | "typ:nass"
  | "typ:barf"
  | "typ:kaltgepresst";

export interface CitableStatData {
  /** Vollständiger, zitierfähiger Satz (ohne Datum/Quelle). */
  sentence: string;
  /** Gesamtzahl analysierter Sorten (für den Quellen-Zusatz). */
  total: number;
}

const BASE = "is_active = true AND affiliate_url <> '' AND name <> ''";
const FOOD_TYPES = "type IN ('trocken','nass','barf','kaltgepresst')";

function db() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}

const fmtN = (n: number) => n.toLocaleString("de-DE");
const fmtPct = (n: number) => n.toFixed(1).replace(".", ",");
const fmtEur = (n: number) => n.toFixed(2).replace(".", ",");

export async function getCitableStat(variant: CitableVariant): Promise<CitableStatData | null> {
  const sql = db();
  if (!sql) return null;
  try {
    if (variant.startsWith("typ:")) {
      const typ = variant.slice(4);
      const label: Record<string, string> = {
        trocken: "Trockenfutter", nass: "Nassfutter", barf: "BARF-Produkte", kaltgepresst: "kaltgepresste Futter",
      };
      const r = await sql.query(
        `SELECT count(*)::int AS n,
           round(avg(price_per_kg)::numeric,2)::float AS avg_p,
           round(min(price_per_kg)::numeric,2)::float AS min_p,
           round(max(price_per_kg)::numeric,2)::float AS max_p
         FROM dog_foods
         WHERE ${BASE} AND type = $1 AND price_per_kg IS NOT NULL AND price_per_kg BETWEEN 0.5 AND 80`,
        [typ]
      );
      const row = (Array.isArray(r) ? r[0] : (r as { rows: Record<string, number>[] }).rows?.[0]) as
        | { n: number; avg_p: number; min_p: number; max_p: number }
        | undefined;
      if (!row || !row.n || row.n < 20) return null;
      return {
        sentence: `Der Durchschnittspreis von ${label[typ] ?? typ} liegt aktuell bei ${fmtEur(row.avg_p)} €/kg — über ${fmtN(row.n)} Sorten, Spanne ${fmtEur(row.min_p)}–${fmtEur(row.max_p)} €/kg.`,
        total: row.n,
      };
    }

    const flagCol: Record<string, { col: string; was: string }> = {
      hypoallergen: { col: "is_hypoallergenic", was: "als hypoallergen deklariert" },
      getreidefrei: { col: "is_grain_free", was: "getreidefrei" },
      monoprotein: { col: "is_monoprotein", was: "Monoprotein-Futter mit nur einer Proteinquelle" },
    };
    const f = flagCol[variant];
    if (!f) return null;
    const r = await sql.query(
      `SELECT count(*)::int AS total,
         count(*) FILTER (WHERE ${f.col}) ::int AS matching
       FROM dog_foods WHERE ${BASE} AND ${FOOD_TYPES}`
    );
    const row = (Array.isArray(r) ? r[0] : (r as { rows: Record<string, number>[] }).rows?.[0]) as
      | { total: number; matching: number }
      | undefined;
    if (!row || !row.total || row.total < 100) return null;
    const pct = (100 * row.matching) / row.total;
    return {
      sentence: `Von ${fmtN(row.total)} analysierten Hundefuttersorten sind nur ${fmtPct(pct)} % (${fmtN(row.matching)} Produkte) ${f.was}.`,
      total: row.total,
    };
  } catch {
    return null;
  }
}
