/**
 * BELLA Wirkungs-Tracker — fragt 3 Wochen nach einer Futter-Empfehlung nach,
 * ob es geholfen hat (bei Allergie/empfindlichem Magen etc.).
 * Run:  DATABASE_URL="postgres://…" node scripts/init-outcome-schema.mjs
 */
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) { console.error("❌ DATABASE_URL fehlt"); process.exit(1); }
const sql = neon(url);

await sql`CREATE TABLE IF NOT EXISTS outcome_checks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  dog_profile_id uuid NOT NULL,
  subscriber_id uuid,
  email text NOT NULL,
  dog_name text,
  food_slug text,
  food_name text,
  problem_tags text[],
  scheduled_at timestamptz NOT NULL,
  sent_at timestamptz,
  responded_at timestamptz,
  outcome text,
  comment text,
  response_token text NOT NULL UNIQUE,
  unsubscribe_token text,
  created_at timestamptz DEFAULT now()
)`;
await sql`CREATE INDEX IF NOT EXISTS outcome_checks_scheduled_idx ON outcome_checks(scheduled_at, sent_at)`;
await sql`CREATE INDEX IF NOT EXISTS outcome_checks_profile_idx ON outcome_checks(dog_profile_id)`;
await sql`CREATE INDEX IF NOT EXISTS outcome_checks_food_idx ON outcome_checks(food_slug)`;
await sql`CREATE INDEX IF NOT EXISTS outcome_checks_token_idx ON outcome_checks(response_token)`;

const t = await sql`SELECT count(*)::int n FROM outcome_checks`;
console.log("✅ outcome_checks bereit. Einträge:", t[0].n);
