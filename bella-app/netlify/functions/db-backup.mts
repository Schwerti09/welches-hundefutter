import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { neon } from "@neondatabase/serverless";

/**
 * Wöchentlicher Logical-Backup-Job (Roadmap 6.4 Teil 2). Neons eingebautes
 * PITR/Branching ist der Primärschutz — dieser Job ist das zweite Netz für den
 * Fall „Neon-Account/Projekt komplett weg". Sichert nur die mutablen
 * User-Daten-Tabellen; Katalog (`dog_foods`/`offers`/`price_history`) und
 * Seed-Content (`studies`/`glossary_terms`/`topic_hubs`) sind aus Feeds bzw.
 * `src/data` regenerierbar und werden bewusst NICHT gesichert.
 *
 * Ablage: Netlify Blobs, ein NDJSON-Blob pro Tabelle unter
 * `backup/<YYYY-MM-DD>/<tabelle>.ndjson`. Retention: die letzten 8 Läufe.
 * Wiederherstellung: `scripts/db-restore-blobs.mjs`.
 */

const TABLES = [
  "dog_profiles",
  "subscribers",
  "price_alerts",
  "outcome_checks",
  "chat_logs",
  "events",
  "community_insights",
  "ai_visibility_checks",
] as const;

// Sicherheitsnetz gegen einen versehentlich riesigen Dump. Bei diesem
// Traffic-Niveau nie erreicht; wächst eine Tabelle darüber hinaus, braucht
// dieser Job Batching (OFFSET/Cursor) — dann hier bewusst nachziehen.
const MAX_ROWS_PER_TABLE = 100_000;
const KEEP_RUNS = 8;

export default async () => {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("[db-backup] DATABASE_URL fehlt");
    return new Response(JSON.stringify({ ok: false, error: "no db url" }), { status: 500 });
  }

  const sql = neon(dbUrl);
  const store = getStore("db-backups");
  const date = new Date().toISOString().slice(0, 10);
  const results: { table: string; rows: number; ok: boolean; error?: string }[] = [];

  for (const table of TABLES) {
    try {
      // Tabellennamen kommen aus der festen Allowlist oben, nicht aus Input —
      // die Interpolation ist hier unkritisch.
      const rows = (await sql.query(`SELECT * FROM ${table} LIMIT ${MAX_ROWS_PER_TABLE}`)) as
        | { rows?: Record<string, unknown>[] }
        | Record<string, unknown>[];
      const list = Array.isArray(rows) ? rows : (rows.rows ?? []);
      const ndjson = list.map((r) => JSON.stringify(r)).join("\n");
      await store.set(`backup/${date}/${table}.ndjson`, ndjson);
      results.push({ table, rows: list.length, ok: true });
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      console.error(`[db-backup] ${table} fehlgeschlagen: ${error}`);
      results.push({ table, rows: 0, ok: false, error });
    }
  }

  // Retention: alte Läufe (Datumsordner) über KEEP_RUNS hinaus wegräumen.
  let pruned = 0;
  try {
    const { blobs } = await store.list({ prefix: "backup/" });
    const dates = [...new Set(blobs.map((b) => b.key.split("/")[1]).filter(Boolean))].sort();
    const stale = dates.slice(0, Math.max(0, dates.length - KEEP_RUNS));
    for (const d of stale) {
      for (const b of blobs.filter((x) => x.key.startsWith(`backup/${d}/`))) {
        await store.delete(b.key);
        pruned++;
      }
    }
  } catch (e) {
    console.error(`[db-backup] Retention-Cleanup fehlgeschlagen: ${e instanceof Error ? e.message : String(e)}`);
  }

  const failed = results.filter((r) => !r.ok);
  const summary = { date, tables: results, pruned, ok: failed.length === 0 };
  if (failed.length) console.error("[db-backup] FAIL", JSON.stringify(summary));
  else console.log("[db-backup] OK", JSON.stringify(summary));

  return new Response(JSON.stringify(summary), {
    status: failed.length ? 500 : 200,
    headers: { "content-type": "application/json" },
  });
};

export const config: Config = {
  schedule: "15 3 * * 1", // wöchentlich Montag 03:15 UTC (vor import-feeds 05:00)
};
