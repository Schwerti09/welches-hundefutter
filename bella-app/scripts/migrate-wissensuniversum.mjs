// Erstellt die 3 Wissensuniversum-Tabellen direkt per SQL (einmalig).
// Aufruf: DATABASE_URL="..." node scripts/migrate-wissensuniversum.mjs
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL fehlt"); process.exit(1); }

const sql = neon(url);

async function run() {
  console.log("🔧 Erstelle Wissensuniversum-Tabellen...");

  await sql`
    CREATE TABLE IF NOT EXISTS topic_hubs (
      id        SERIAL PRIMARY KEY,
      slug      TEXT UNIQUE NOT NULL,
      name      TEXT NOT NULL,
      description TEXT NOT NULL,
      icon      TEXT NOT NULL,
      study_count INTEGER DEFAULT 0,
      "order"   INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log("✅ topic_hubs");

  await sql`
    CREATE TABLE IF NOT EXISTS studies (
      id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug             TEXT UNIQUE NOT NULL,
      title            TEXT NOT NULL,
      authors          TEXT[] NOT NULL,
      year             INTEGER NOT NULL,
      journal          TEXT NOT NULL,
      doi              TEXT,
      pubmed_link      TEXT,
      study_design     TEXT NOT NULL,
      population       TEXT NOT NULL,
      methodology      TEXT NOT NULL,
      key_findings     TEXT NOT NULL,
      limitations      TEXT,
      bella_summary    TEXT NOT NULL,
      evidence_strength TEXT NOT NULL,
      tags             TEXT[] NOT NULL,
      topic_hub        TEXT NOT NULL,
      related_products TEXT[] DEFAULT '{}',
      created_at       TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS studies_hub_idx  ON studies(topic_hub)`;
  await sql`CREATE INDEX IF NOT EXISTS studies_year_idx ON studies(year)`;
  console.log("✅ studies");

  await sql`
    CREATE TABLE IF NOT EXISTS glossary_terms (
      id          SERIAL PRIMARY KEY,
      slug        TEXT UNIQUE NOT NULL,
      term        TEXT NOT NULL,
      definition  TEXT NOT NULL,
      explanation TEXT NOT NULL,
      category    TEXT NOT NULL,
      related_slugs TEXT[] DEFAULT '{}',
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log("✅ glossary_terms");

  console.log("🎉 Migration fertig!");
}

run().catch((e) => { console.error(e); process.exit(1); });
