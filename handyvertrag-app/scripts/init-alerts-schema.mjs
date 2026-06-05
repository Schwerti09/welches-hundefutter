/**
 * BELLA Schicht 2 — Preis-Alerts & eigene E-Mail-Audience.
 * Legt subscribers (Double-Opt-in, Consent-Logging) + price_alerts an.
 * Run:  DATABASE_URL="postgres://…" node scripts/init-alerts-schema.mjs
 */
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) { console.error("❌ DATABASE_URL fehlt"); process.exit(1); }
const sql = neon(url);

// E-Mail-Audience. doi_confirmed_at = NULL → noch nicht bestätigt → KEIN Versand.
// Consent-Logging (IP + Zeit + UA) ist in DE Pflicht für Double-Opt-in.
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

// Ein Preis-Wecker pro (Abonnent × Futter). baseline = Preis bei Anmeldung,
// last_notified_* verhindert Spam (nur bei neuem echten Tief erneut melden).
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
await sql`CREATE INDEX IF NOT EXISTS price_alerts_food_idx ON price_alerts(food_slug)`;
await sql`CREATE INDEX IF NOT EXISTS price_alerts_sub_idx ON price_alerts(subscriber_id)`;

const t = await sql`SELECT
  (SELECT count(*)::int FROM subscribers) subs,
  (SELECT count(*)::int FROM price_alerts) alerts`;
console.log("✅ Schema bereit. subscribers:", t[0].subs, "| price_alerts:", t[0].alerts);
