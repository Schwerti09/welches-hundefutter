/**
 * BELLA Futter-Pass — Schema-Drift-Fix + neue Tabellen.
 * Idempotent (IF NOT EXISTS / DO NOTHING). Sicher mehrfach ausführbar.
 *
 * Run: DATABASE_URL="postgres://…" node scripts/migrate-futter-pass.mjs
 */
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) { console.error("❌ DATABASE_URL fehlt"); process.exit(1); }
const sql = neon(url);

console.log("🔧 Schema-Drift-Fix + Futter-Pass-Migration starten...\n");

// ─── 1. dog_foods: fehlende Spalten ──────────────────────────────────────────
const foodCols = [
  "ALTER TABLE dog_foods ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true",
  "ALTER TABLE dog_foods ADD COLUMN IF NOT EXISTS price numeric(8,2)",
  "ALTER TABLE dog_foods ADD COLUMN IF NOT EXISTS score integer",
  "ALTER TABLE dog_foods ADD COLUMN IF NOT EXISTS category text",
  "ALTER TABLE dog_foods ADD COLUMN IF NOT EXISTS companion_for text[]",
];
for (const stmt of foodCols) {
  await sql.query(stmt);
}
console.log("✅ dog_foods: fehlende Spalten ergänzt");

// ─── 2. price_history (falls noch nicht vorhanden) ───────────────────────────
await sql`CREATE TABLE IF NOT EXISTS price_history (
  id serial PRIMARY KEY,
  food_slug text NOT NULL,
  price_per_kg numeric(8,2) NOT NULL,
  recorded_at timestamptz DEFAULT now()
)`;
await sql`CREATE INDEX IF NOT EXISTS price_history_slug_time_idx ON price_history(food_slug, recorded_at)`;
console.log("✅ price_history: ok");

// ─── 3. subscribers (falls noch nicht vorhanden) ─────────────────────────────
await sql`CREATE TABLE IF NOT EXISTS subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  doi_token text NOT NULL UNIQUE,
  doi_confirmed_at timestamptz,
  consent_ip text,
  consent_user_agent text,
  unsubscribe_token text NOT NULL UNIQUE,
  unsubscribed_at timestamptz,
  dog_profile jsonb DEFAULT '{}'::jsonb,
  source text DEFAULT 'advisor',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)`;
await sql`CREATE INDEX IF NOT EXISTS subscribers_doi_token_idx ON subscribers(doi_token)`;
await sql`CREATE INDEX IF NOT EXISTS subscribers_unsub_token_idx ON subscribers(unsubscribe_token)`;
console.log("✅ subscribers: ok");

// ─── 4. price_alerts: fehlende Spalten ergänzen ──────────────────────────────
await sql`CREATE TABLE IF NOT EXISTS price_alerts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id uuid NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  food_slug text NOT NULL,
  food_name text,
  baseline_price_per_kg numeric(8,2),
  target_price_per_kg numeric(8,2),
  last_notified_at timestamptz,
  last_notified_price numeric(8,2),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE (subscriber_id, food_slug)
)`;
const alertCols = [
  "ALTER TABLE price_alerts ADD COLUMN IF NOT EXISTS mode text NOT NULL DEFAULT 'price'",
  "ALTER TABLE price_alerts ADD COLUMN IF NOT EXISTS dog_profile_id uuid",
  "ALTER TABLE price_alerts ADD COLUMN IF NOT EXISTS refill_due_at timestamptz",
];
for (const stmt of alertCols) {
  await sql.query(stmt);
}
await sql`CREATE INDEX IF NOT EXISTS price_alerts_sub_food_idx ON price_alerts(subscriber_id, food_slug)`;
await sql`CREATE INDEX IF NOT EXISTS price_alerts_food_idx ON price_alerts(food_slug)`;
console.log("✅ price_alerts: ok (+ mode, refill_due_at, dog_profile_id)");

// ─── 5. dog_profiles (Futter-Pass Stufe 1) ───────────────────────────────────
await sql`CREATE TABLE IF NOT EXISTS dog_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id uuid,
  name text NOT NULL,
  breed_slug text,
  birth_or_age text,
  weight_kg numeric(5,1),
  activity_level text,
  allergies text[],
  health_flags text[],
  current_food_slug text,
  current_package_g integer,
  last_purchase_at timestamptz,
  est_daily_grams integer,
  est_bag_days integer,
  share_token text UNIQUE,
  share_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)`;
await sql`CREATE INDEX IF NOT EXISTS dog_profiles_subscriber_idx ON dog_profiles(subscriber_id)`;
await sql`CREATE INDEX IF NOT EXISTS dog_profiles_share_token_idx ON dog_profiles(share_token)`;
console.log("✅ dog_profiles: ok");

// ─── Zusammenfassung ─────────────────────────────────────────────────────────
const counts = await sql`SELECT
  (SELECT count(*)::int FROM subscribers)      AS subs,
  (SELECT count(*)::int FROM price_alerts)     AS alerts,
  (SELECT count(*)::int FROM dog_profiles)     AS profiles,
  (SELECT count(*)::int FROM price_history)    AS history`;
const c = counts[0];
console.log(`\n📊 subscribers: ${c.subs} | price_alerts: ${c.alerts} | dog_profiles: ${c.profiles} | price_history: ${c.history}`);
console.log("✅ Migration abgeschlossen.");
