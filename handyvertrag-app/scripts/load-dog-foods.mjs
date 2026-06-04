/**
 * BELLA — lädt scripts/dog_foods.json in die Neon-Tabelle dog_foods (upsert by slug).
 *
 * Voraussetzung: zuerst `python scripts/parse-feeds.py` (erzeugt dog_foods.json).
 * Run:  DATABASE_URL="postgres://..." node scripts/load-dog-foods.mjs
 *       (oder lokal mit .env.local: node --env-file=.env.local scripts/load-dog-foods.mjs)
 */
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const url = process.env.DATABASE_URL;
if (!url) { console.error("❌ DATABASE_URL fehlt"); process.exit(1); }
const sql = neon(url);

const records = JSON.parse(readFileSync(join(__dirname, "dog_foods.json"), "utf-8"));
console.log(`📥 ${records.length} Produkte aus dog_foods.json`);

// Tabelle sicherstellen (falls drizzle-push noch nicht lief)
await sql`CREATE TABLE IF NOT EXISTS dog_foods (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  brand text NOT NULL DEFAULT '',
  name text NOT NULL,
  type text NOT NULL DEFAULT 'trocken',
  protein text NOT NULL DEFAULT '',
  is_monoprotein boolean DEFAULT false,
  is_grain_free boolean DEFAULT false,
  is_hypoallergenic boolean DEFAULT false,
  meat_percentage integer,
  price_per_kg numeric(8,2),
  price numeric(8,2),
  package_sizes text[],
  suitable_for text[],
  suitable_breeds text[],
  image_url text,
  rating numeric(3,1),
  review_count integer DEFAULT 0,
  affiliate_network text,
  affiliate_url text NOT NULL,
  commission_rate numeric(5,4),
  commission_flat numeric(8,2),
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  last_feed_update timestamp DEFAULT now()
)`;
await sql`ALTER TABLE dog_foods ADD COLUMN IF NOT EXISTS price numeric(8,2)`;
await sql`CREATE INDEX IF NOT EXISTS dog_foods_type_idx ON dog_foods(type)`;
await sql`CREATE INDEX IF NOT EXISTS dog_foods_ppk_idx ON dog_foods(price_per_kg)`;

let ok = 0, fail = 0;
const BATCH = 200;
for (let i = 0; i < records.length; i += BATCH) {
  const slice = records.slice(i, i + BATCH);
  await Promise.all(slice.map(async (r) => {
    try {
      await sql`INSERT INTO dog_foods
        (slug, brand, name, type, protein, is_grain_free, is_hypoallergenic,
         price_per_kg, price, suitable_for, image_url, affiliate_network, affiliate_url, last_feed_update)
        VALUES (${r.slug}, ${r.brand || ""}, ${r.name}, ${r.type || "trocken"},
         ${r.protein || ""}, ${!!r.isGrainFree}, ${!!r.isHypoallergenic},
         ${r.pricePerKg ?? null}, ${r.price ?? null}, ${r.suitableFor ?? []},
         ${r.imageUrl ?? null}, ${r.affiliateNetwork ?? null}, ${r.affiliateUrl}, now())
        ON CONFLICT (slug) DO UPDATE SET
          price_per_kg = EXCLUDED.price_per_kg, price = EXCLUDED.price,
          affiliate_url = EXCLUDED.affiliate_url, image_url = EXCLUDED.image_url,
          type = EXCLUDED.type, protein = EXCLUDED.protein,
          suitable_for = EXCLUDED.suitable_for, last_feed_update = now()`;
      ok++;
    } catch (e) { fail++; if (fail <= 3) console.error("  ✗", r.slug, String(e.message).slice(0, 80)); }
  }));
  process.stdout.write(`\r  ${Math.min(i + BATCH, records.length)}/${records.length}…`);
}
console.log(`\n✅ ${ok} geladen, ${fail} Fehler`);
const [{ c }] = await sql`SELECT COUNT(*) c FROM dog_foods`;
console.log(`📊 dog_foods enthält jetzt ${c} Produkte`);
