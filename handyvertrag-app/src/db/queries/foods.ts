// DB-Brücke: echte Hundefutter aus Neon (dog_foods). Server-only.
// Ersetzt die alte Handy-Frankenstein-Quelle src/data/products.ts.
import { neon } from "@neondatabase/serverless";
import type { DogFood } from "@/lib/types";

interface Row {
  id: string; slug: string; brand: string; name: string; type: string;
  protein: string | null; is_grain_free: boolean; is_hypoallergenic: boolean;
  price_per_kg: string | null; price: string | null; suitable_for: string[] | null;
  image_url: string | null; affiliate_url: string; rating: string | null;
  score: number | null;
}

function rows(r: unknown): Row[] {
  return ((r as { rows?: Row[] }).rows ?? (r as Row[])) || [];
}

function toFood(o: Row): DogFood {
  return {
    id: String(o.id), slug: o.slug, brand: o.brand, name: o.name, foodType: o.type,
    protein: o.protein, grainFree: !!o.is_grain_free, hypoallergenic: !!o.is_hypoallergenic,
    pricePerKg: o.price_per_kg != null ? parseFloat(o.price_per_kg) : null,
    price: o.price != null ? parseFloat(o.price) : null,
    suitableFor: o.suitable_for ?? [], imageUrl: o.image_url,
    affiliateUrl: o.affiliate_url, rating: o.rating != null ? parseFloat(o.rating) : null,
    score: o.score != null ? Number(o.score) : null,
  };
}

const COLS = `id, slug, brand, name, type, protein, is_grain_free, is_hypoallergenic,
  price_per_kg, price, suitable_for, image_url, affiliate_url, rating, score`;
const NAME_KEY = "lower(regexp_replace(name, '[^a-zA-Z0-9]', '', 'g'))";
const BASE = "is_active = true AND affiliate_url <> '' AND name <> ''";

function db() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}

/** Anzahl aktiver Futter im Katalog (für ehrliche Zahlen, keine Fake-„8.000"). */
export async function getFoodCount(): Promise<number> {
  const sql = db();
  if (!sql) return 0;
  try {
    const r = await sql.query(`SELECT COUNT(*)::int c FROM dog_foods WHERE ${BASE}`);
    return rows(r)[0] ? Number((rows(r)[0] as unknown as { c: number }).c) : 0;
  } catch { return 0; }
}

/** Günstigste, dedupte Top-Sorten (echtes Futter mit €/kg) für die Startseite. */
export async function getTopFoods(limit = 7): Promise<DogFood[]> {
  const sql = db();
  if (!sql) return [];
  try {
    const r = await sql.query(
      `SELECT ${COLS} FROM (
         SELECT DISTINCT ON (${NAME_KEY}) ${COLS}
         FROM dog_foods
         WHERE ${BASE} AND price_per_kg BETWEEN 2 AND 60 AND type <> 'snack'
         ORDER BY ${NAME_KEY}, price_per_kg ASC
       ) d ORDER BY price_per_kg ASC LIMIT ${Math.max(1, Math.min(20, limit))}`
    );
    return rows(r).map(toFood);
  } catch { return []; }
}

/** Top-Sorten nach BELLA-Score (höchster Score zuerst, Restplätze nach Preis). */
export async function getTopFoodsByScore(limit = 7): Promise<DogFood[]> {
  const sql = db();
  if (!sql) return [];
  try {
    const r = await sql.query(
      `SELECT ${COLS} FROM (
         SELECT DISTINCT ON (${NAME_KEY}) ${COLS}
         FROM dog_foods
         WHERE ${BASE} AND price_per_kg BETWEEN 2 AND 60 AND type <> 'snack'
         ORDER BY ${NAME_KEY}, price_per_kg ASC
       ) d ORDER BY score DESC NULLS LAST, price_per_kg ASC LIMIT ${Math.max(1, Math.min(20, limit))}`
    );
    return rows(r).map(toFood);
  } catch { return []; }
}

/** Futter eines Typs (trocken/nass/barf …). */
export async function getFoodsByType(type: string, limit = 12): Promise<DogFood[]> {
  const sql = db();
  if (!sql) return [];
  try {
    const r = await sql.query(
      `SELECT ${COLS} FROM (
         SELECT DISTINCT ON (${NAME_KEY}) ${COLS}
         FROM dog_foods WHERE ${BASE} AND type = $1 AND price_per_kg BETWEEN 2 AND 60
         ORDER BY ${NAME_KEY}, price_per_kg ASC
       ) d ORDER BY price_per_kg ASC LIMIT ${Math.max(1, Math.min(30, limit))}`,
      [type]
    );
    return rows(r).map(toFood);
  } catch { return []; }
}

/** Empfohlenes Futter für eine Rasse (allergie-anfällig → verträglich vorsortiert). */
export async function getFoodsForBreed(allergyProne: boolean, limit = 6): Promise<DogFood[]> {
  const sql = db();
  if (!sql) return [];
  try {
    const bias = allergyProne ? "(CASE WHEN (is_hypoallergenic OR is_grain_free) THEN 1 ELSE 0 END) DESC, " : "";
    const r = await sql.query(
      `SELECT ${COLS} FROM (
         SELECT DISTINCT ON (${NAME_KEY}) ${COLS}
         FROM dog_foods WHERE ${BASE} AND price_per_kg BETWEEN 2 AND 60 AND type <> 'snack'
         ORDER BY ${NAME_KEY}, price_per_kg ASC
       ) d ORDER BY ${bias} price_per_kg ASC LIMIT ${Math.max(1, Math.min(12, limit))}`
    );
    return rows(r).map(toFood);
  } catch { return []; }
}

/** Durchschnittlicher €/kg-Preis für Trockenfutter (für den Kosten-Hook auf der Startseite). */
export async function getAvgPricePerKgDry(): Promise<number> {
  const sql = db();
  if (!sql) return 5.5;
  try {
    // Dedupliziert: pro Produktname nur der günstigste Preis (verhindert Verzerrung durch Kleinstpackungen).
    // Preisrange 2–25 €/kg schließt Ausreißer aus (Kleinstpackungen, Luxus-Nischenprodukte).
    const r = await sql.query(
      `SELECT AVG(min_price)::numeric(8,2) AS avg
       FROM (
         SELECT MIN(price_per_kg) AS min_price
         FROM dog_foods
         WHERE is_active = true AND type = 'trocken'
           AND price_per_kg IS NOT NULL AND price_per_kg BETWEEN 2 AND 25
         GROUP BY LOWER(TRIM(name))
       ) deduped`
    );
    const v = rows(r)[0] as unknown as { avg: string } | undefined;
    return v?.avg ? parseFloat(v.avg) : 5.5;
  } catch { return 5.5; }
}

export async function getFoodBySlug(slug: string): Promise<DogFood | null> {
  const sql = db();
  if (!sql) return null;
  try {
    const r = await sql.query(`SELECT ${COLS} FROM dog_foods WHERE slug = $1 AND ${BASE} LIMIT 1`, [slug]);
    const list = rows(r);
    return list[0] ? toFood(list[0]) : null;
  } catch { return null; }
}

export function brandToSlug(brand: string): string {
  return brand.toLowerCase().trim()
    .replace(/&/g, "und").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export interface BrandSummary {
  brand: string;
  slug: string;
  count: number;
  avgScore: number | null;
  minPricePerKg: number | null;
}

export async function getBrandsWithCounts(minProducts = 3): Promise<BrandSummary[]> {
  const sql = db();
  if (!sql) return [];
  try {
    const r = await sql.query(
      `SELECT brand, COUNT(*)::int AS count,
              ROUND(AVG(score))::int AS avg_score,
              ROUND(MIN(price_per_kg)::numeric, 2)::float8 AS min_ppk
       FROM dog_foods
       WHERE ${BASE} AND brand <> '' AND price_per_kg BETWEEN 2 AND 60
       GROUP BY brand
       HAVING COUNT(*) >= $1
       ORDER BY COUNT(*) DESC`,
      [minProducts]
    );
    return (rows(r) as unknown as Array<{ brand: string; count: number; avg_score: string | null; min_ppk: string | null }>)
      .map(row => ({
        brand: row.brand,
        slug: brandToSlug(row.brand),
        count: row.count,
        avgScore: row.avg_score != null ? Number(row.avg_score) : null,
        minPricePerKg: row.min_ppk != null ? parseFloat(row.min_ppk) : null,
      }));
  } catch { return []; }
}

export async function getFoodsByBrand(brand: string, limit = 40): Promise<DogFood[]> {
  const sql = db();
  if (!sql) return [];
  try {
    const r = await sql.query(
      `SELECT ${COLS} FROM (
         SELECT DISTINCT ON (${NAME_KEY}) ${COLS}
         FROM dog_foods
         WHERE ${BASE} AND brand = $1 AND price_per_kg BETWEEN 2 AND 60
         ORDER BY ${NAME_KEY}, price_per_kg ASC
       ) d ORDER BY score DESC NULLS LAST, price_per_kg ASC LIMIT $2`,
      [brand, Math.max(1, Math.min(60, limit))]
    );
    return rows(r).map(toFood);
  } catch { return []; }
}
