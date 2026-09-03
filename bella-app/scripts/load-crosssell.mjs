/**
 * BELLA — lädt scripts/cross_sell.json in Neon (cross_sell) mit Lifecycle.
 * Begleitprodukte (Snacks/NEMs/Zubehör/Versicherung/Zeckenschutz) für den
 * kuratierten Quer-Verkauf nach der Futter-Empfehlung. companion_for = gemeinsame
 * Basis für Matching UND (Schicht 2) Preis-Alerts.
 *
 * Run:  DATABASE_URL="postgres://…" node scripts/load-crosssell.mjs
 */
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const url = process.env.DATABASE_URL;
if (!url) { console.error("❌ DATABASE_URL fehlt"); process.exit(1); }
const sql = neon(url);
const round2 = (n) => (n == null ? null : Math.round(Number(n) * 100) / 100);

const all = JSON.parse(readFileSync(join(__dirname, "cross_sell.json"), "utf-8"));
// Nur kuratier-fähiges: Snacks/Gesundheit/Zeckenschutz/Versicherung immer, generisches
// Zubehör nur mit companion_for (z. B. Schlecknapf). Random Leinen/Spielzeug = kein Begleiter.
const records = all.filter((r) =>
  r.category !== "zubehoer" || (r.companionFor && Object.keys(r.companionFor).length > 0)
);
console.log(`📥 ${records.length} kuratier-fähige Cross-Sells (von ${all.length}; generisches Zubehör gefiltert)`);

await sql`CREATE TABLE IF NOT EXISTS cross_sell (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL, brand text NOT NULL DEFAULT '', name text NOT NULL,
  category text NOT NULL, protein text, companion_for jsonb DEFAULT '{}'::jsonb,
  price numeric(8,2), image_url text, affiliate_network text, affiliate_url text NOT NULL,
  is_active boolean DEFAULT true, created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(), last_feed_update timestamp DEFAULT now()
)`;
await sql`CREATE INDEX IF NOT EXISTS cross_sell_cat_idx ON cross_sell(category)`;
await sql`CREATE INDEX IF NOT EXISTS cross_sell_active_idx ON cross_sell(is_active)`;

const runStart = new Date().toISOString();
let ok = 0, fail = 0;
const BATCH = 50;
const upsert = async (r, attempt = 0) => {
  try {
    await sql`INSERT INTO cross_sell
      (slug, brand, name, category, protein, companion_for, price, image_url, affiliate_network, affiliate_url, is_active, last_feed_update, updated_at)
      VALUES (${r.slug}, ${r.brand || ""}, ${r.name}, ${r.category}, ${r.protein ?? null},
        ${JSON.stringify(r.companionFor ?? {})}, ${round2(r.price)}, ${r.imageUrl ?? null},
        ${r.affiliateNetwork ?? null}, ${r.affiliateUrl}, true, now(), now())
      ON CONFLICT (slug) DO UPDATE SET
        price = EXCLUDED.price, affiliate_url = EXCLUDED.affiliate_url, image_url = EXCLUDED.image_url,
        category = EXCLUDED.category, protein = EXCLUDED.protein, companion_for = EXCLUDED.companion_for,
        is_active = true, last_feed_update = now(), updated_at = now()`;
    ok++;
  } catch (e) {
    if (attempt < 2) { await new Promise((res) => setTimeout(res, 300 * (attempt + 1))); return upsert(r, attempt + 1); }
    fail++; if (fail <= 5) console.error("  ✗", r.slug, String(e.message).slice(0, 70));
  }
};
for (let i = 0; i < records.length; i += BATCH) {
  await Promise.all(records.slice(i, i + BATCH).map((r) => upsert(r)));
  process.stdout.write(`\r  ${Math.min(i + BATCH, records.length)}/${records.length}…`);
}
void runStart;
const deact = await sql`UPDATE cross_sell SET is_active = false WHERE last_feed_update < now() - interval '2 days' AND is_active = true RETURNING slug`;
const rows = await sql`SELECT category, COUNT(*)::int c FROM cross_sell WHERE is_active = true GROUP BY category ORDER BY c DESC`;
console.log(`\n\n📊 CROSS-SELL-DIFF`);
console.log(`  ✅ verarbeitet: ${ok} (${fail} Fehler) | ⛔ deaktiviert: ${(deact.rows ?? deact).length}`);
console.log(`  Kategorien aktiv:`, Object.fromEntries((rows.rows ?? rows).map((r) => [r.category, r.c])));
