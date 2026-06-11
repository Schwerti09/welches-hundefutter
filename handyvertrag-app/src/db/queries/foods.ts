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

export async function getFoodBySlug(slug: string): Promise<DogFood | null> {
  const sql = db();
  if (!sql) return null;
  try {
    const r = await sql.query(`SELECT ${COLS} FROM dog_foods WHERE slug = $1 AND ${BASE} LIMIT 1`, [slug]);
    const list = rows(r);
    return list[0] ? toFood(list[0]) : null;
  } catch { return null; }
}
