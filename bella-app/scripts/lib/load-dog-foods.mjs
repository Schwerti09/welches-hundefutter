/**
 * BELLA — lädt Produkt-Records in Neon (dog_foods) mit LIFECYCLE + PREIS-HISTORIE.
 *
 * Frische zuerst: Was im aktuellen Feed ist → is_active=true, last_feed_update=now().
 * Was NICHT mehr im Feed ist → is_active=false (nicht gelöscht). Preisverlauf bleibt.
 * Gibt am Ende den DIFF aus: neu / Preis geändert / rausgefallen (deaktiviert).
 */
import { neon } from "@neondatabase/serverless";

const round2 = (n) => (n == null ? null : Math.round(Number(n) * 100) / 100);

const computeScore = (r, ppk) => Math.max(28, Math.min(98,
  35
  + (r.protein ? 18 : 0)
  + (r.isGrainFree ? 12 : 0)
  + (r.isHypoallergenic ? 10 : 0)
  + (ppk >= 15 ? 15 : ppk >= 8 ? 10 : ppk >= 4 ? 5 : 0)
  + (["barf", "kaltgepresst"].includes(r.type) ? 8 : r.type === "nass" ? 4 : 0)
));

export async function loadDogFoods(records) {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL fehlt");
  const sql = neon(url);

  console.log(`📥 ${records.length} Produkte`);

  // ─── Schema sicherstellen ──────────────────────────────────────────────────
  await sql`CREATE TABLE IF NOT EXISTS dog_foods (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    slug text UNIQUE NOT NULL, brand text NOT NULL DEFAULT '', name text NOT NULL,
    type text NOT NULL DEFAULT 'trocken', protein text NOT NULL DEFAULT '',
    is_monoprotein boolean DEFAULT false, is_grain_free boolean DEFAULT false,
    is_hypoallergenic boolean DEFAULT false, meat_percentage integer,
    price_per_kg numeric(8,2), price numeric(8,2), package_sizes text[],
    suitable_for text[], suitable_breeds text[], image_url text,
    rating numeric(3,1), review_count integer DEFAULT 0, affiliate_network text,
    affiliate_url text NOT NULL, commission_rate numeric(5,4), commission_flat numeric(8,2),
    is_active boolean DEFAULT true, created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now(), last_feed_update timestamp DEFAULT now()
  )`;
  await sql`ALTER TABLE dog_foods ADD COLUMN IF NOT EXISTS price numeric(8,2)`;
  await sql`CREATE TABLE IF NOT EXISTS price_history (
    id serial PRIMARY KEY, food_slug text NOT NULL, price_per_kg numeric(8,2),
    price numeric(8,2), recorded_at timestamp DEFAULT now()
  )`;
  await sql`CREATE INDEX IF NOT EXISTS price_history_slug_idx ON price_history(food_slug, recorded_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS dog_foods_active_idx ON dog_foods(is_active)`;

  // ─── Snapshot VORHER (für Diff) ────────────────────────────────────────────
  const beforeRows = await sql`SELECT slug, price_per_kg, is_active FROM dog_foods`;
  const before = new Map((beforeRows.rows ?? beforeRows).map((r) => [r.slug, { ppk: r.price_per_kg == null ? null : Number(r.price_per_kg), active: r.is_active }]));

  // ─── Upsert (alle = aktiv, frisch) + Preis-Historie ────────────────────────
  let ok = 0, fail = 0, isNew = 0, changed = 0;
  const BATCH = 50;

  const upsertOne = async (r, attempt = 0) => {
    const ppk = round2(r.pricePerKg);
    const score = computeScore(r, ppk ?? 0);
    try {
      await sql`INSERT INTO dog_foods
        (slug, brand, name, type, protein, is_grain_free, is_hypoallergenic,
         price_per_kg, price, score, suitable_for, image_url, affiliate_network, affiliate_url,
         is_active, last_feed_update, updated_at)
        VALUES (${r.slug}, ${r.brand || ""}, ${r.name}, ${r.type || "trocken"},
         ${r.protein || ""}, ${!!r.isGrainFree}, ${!!r.isHypoallergenic},
         ${ppk}, ${round2(r.price)}, ${score}, ${r.suitableFor ?? []}, ${r.imageUrl ?? null},
         ${r.affiliateNetwork ?? null}, ${r.affiliateUrl}, true, now(), now())
        ON CONFLICT (slug) DO UPDATE SET
          price_per_kg = EXCLUDED.price_per_kg, price = EXCLUDED.price,
          score = EXCLUDED.score,
          affiliate_url = EXCLUDED.affiliate_url, image_url = EXCLUDED.image_url,
          type = EXCLUDED.type, protein = EXCLUDED.protein, suitable_for = EXCLUDED.suitable_for,
          is_grain_free = EXCLUDED.is_grain_free, is_hypoallergenic = EXCLUDED.is_hypoallergenic,
          is_active = true, last_feed_update = now(), updated_at = now()`;
      // Preis-Historie nur bei neuem/geändertem Preis (kein Rauschen)
      const prev = before.get(r.slug);
      if (!prev) isNew++;
      else if (prev.ppk !== ppk) changed++;
      if (!prev || prev.ppk !== ppk) {
        await sql`INSERT INTO price_history (food_slug, price_per_kg, price) VALUES (${r.slug}, ${ppk}, ${round2(r.price)})`;
      }
      ok++;
    } catch (e) {
      if (attempt < 2) { await new Promise((res) => setTimeout(res, 300 * (attempt + 1))); return upsertOne(r, attempt + 1); }
      fail++; if (fail <= 5) console.error("  ✗", r.slug, String(e.message).slice(0, 70));
    }
  };
  for (let i = 0; i < records.length; i += BATCH) {
    await Promise.all(records.slice(i, i + BATCH).map((r) => upsertOne(r)));
    process.stdout.write(`\r  ${Math.min(i + BATCH, records.length)}/${records.length}…`);
  }

  // ─── Lifecycle: nur was seit >2 Tagen nicht mehr im Feed war → inaktiv (transiente Fehler ausgenommen) ──
  const deact = await sql`UPDATE dog_foods SET is_active = false, updated_at = now()
    WHERE last_feed_update < now() - interval '2 days' AND is_active = true RETURNING slug`;
  const deactivated = (deact.rows ?? deact).length;

  // ─── DIFF ──────────────────────────────────────────────────────────────────
  const [{ c: activeCount }] = await sql`SELECT COUNT(*)::int c FROM dog_foods WHERE is_active = true`;
  console.log(`\n\n📊 IMPORT-DIFF`);
  console.log(`  ✅ verarbeitet:     ${ok} (${fail} Fehler)`);
  console.log(`  🆕 neu:             ${isNew}`);
  console.log(`  💶 Preis geändert:  ${changed}`);
  console.log(`  ⛔ rausgefallen→inaktiv: ${deactivated}`);
  console.log(`  📦 aktiv im Katalog: ${activeCount}`);

  return { ok, fail, isNew, changed, deactivated, activeCount };
}
