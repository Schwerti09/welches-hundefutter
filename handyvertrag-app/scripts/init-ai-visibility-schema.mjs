/**
 * BELLA Block J1 — KI-Sichtbarkeits-Tracking: Schema.
 * Speichert pro Lauf, ob BELLA/welches-hundefutter.today in KI-Antworten
 * (Gemini, Claude, mit Web-Suche/Grounding) erwähnt oder zitiert wird.
 * Run:  DATABASE_URL="postgres://…" node scripts/init-ai-visibility-schema.mjs
 */
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) { console.error("❌ DATABASE_URL fehlt"); process.exit(1); }
const sql = neon(url);

await sql`CREATE TABLE IF NOT EXISTS ai_visibility_checks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  run_date date NOT NULL,
  provider text NOT NULL,
  model text NOT NULL,
  prompt text NOT NULL,
  mentioned boolean NOT NULL DEFAULT false,
  domain_cited boolean NOT NULL DEFAULT false,
  name_mentioned boolean NOT NULL DEFAULT false,
  source_urls jsonb DEFAULT '[]'::jsonb,
  response_excerpt text,
  error text,
  created_at timestamptz DEFAULT now()
)`;

await sql`CREATE INDEX IF NOT EXISTS ai_visibility_run_date_idx ON ai_visibility_checks(run_date)`;
await sql`CREATE INDEX IF NOT EXISTS ai_visibility_provider_idx ON ai_visibility_checks(provider)`;

console.log("✅ ai_visibility_checks angelegt.");
