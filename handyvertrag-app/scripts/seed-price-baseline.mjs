/**
 * BELLA Schicht 2 — einmaliger Baseline-Snapshot in price_history.
 * Der Food-Import schreibt price_history nur bei Preisänderung; ohne einen ersten
 * Snapshot gäbe es keinen Vergleichswert. Dieses Script legt für jedes aktive Futter
 * mit Preis genau einen Startpunkt an (idempotent: überspringt Slugs, die schon einen haben).
 * Run:  DATABASE_URL="postgres://…" node scripts/seed-price-baseline.mjs
 */
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) { console.error("❌ DATABASE_URL fehlt"); process.exit(1); }
const sql = neon(url);

const foods = await sql`
  SELECT d.slug, d.price_per_kg, d.price
  FROM dog_foods d
  WHERE d.is_active = true AND d.price_per_kg IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM price_history p WHERE p.food_slug = d.slug)`;

console.log(`📸 Baseline für ${foods.length} Futter ohne Verlauf…`);
let ok = 0;
const BATCH = 100;
for (let i = 0; i < foods.length; i += BATCH) {
  await Promise.all(foods.slice(i, i + BATCH).map(async (f) => {
    try {
      await sql`INSERT INTO price_history (food_slug, price_per_kg, price)
                VALUES (${f.slug}, ${f.price_per_kg}, ${f.price})`;
      ok++;
    } catch { /* skip */ }
  }));
  process.stdout.write(`\r  ${Math.min(i + BATCH, foods.length)}/${foods.length}…`);
}
const tot = await sql`SELECT count(*)::int rows, count(DISTINCT food_slug)::int foods FROM price_history`;
console.log(`\n✅ Baseline gesetzt: ${ok} neue Snapshots. price_history jetzt: ${tot[0].rows} Zeilen / ${tot[0].foods} Futter.`);
