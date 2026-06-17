// Erstellt die community_insights-Tabelle (Meinungsnetz). Einmalig ausführen.
// Aufruf: DATABASE_URL="..." node scripts/migrate-meinungsnetz.mjs
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL fehlt"); process.exit(1); }

const sql = neon(url);

async function run() {
  console.log("🔧 Erstelle community_insights-Tabelle...");

  await sql`
    CREATE TABLE IF NOT EXISTS community_insights (
      id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      platform         TEXT NOT NULL,
      source_url       TEXT NOT NULL,
      author           TEXT,
      content_excerpt  TEXT NOT NULL,
      sentiment        TEXT NOT NULL,
      mentioned_brands TEXT[] DEFAULT '{}',
      mentioned_topics TEXT[] DEFAULT '{}',
      related_study_slugs  TEXT[] DEFAULT '{}',
      related_product_slugs TEXT[] DEFAULT '{}',
      upvotes          INTEGER,
      published_at     TIMESTAMPTZ,
      language         TEXT DEFAULT 'de',
      verified         BOOLEAN DEFAULT FALSE,
      created_at       TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS community_platform_idx  ON community_insights(platform)`;
  await sql`CREATE INDEX IF NOT EXISTS community_sentiment_idx ON community_insights(sentiment)`;
  await sql`CREATE INDEX IF NOT EXISTS community_topics_idx    ON community_insights USING GIN(mentioned_topics)`;
  await sql`CREATE INDEX IF NOT EXISTS community_brands_idx    ON community_insights USING GIN(mentioned_brands)`;

  console.log("✅ community_insights + Indizes erstellt");
  console.log("🎉 Migration fertig!");
}

run().catch((e) => { console.error(e); process.exit(1); });
