/**
 * Notfall-Wiederherstellung aus den wöchentlichen Blob-Backups
 * (netlify/functions/db-backup.mts). Roadmap 6.4 Teil 2.
 *
 * Liest die NDJSON-Blobs eines Backup-Laufs und spielt sie per
 * INSERT ... ON CONFLICT (id) DO UPDATE zurück in die Ziel-DB. Idempotent:
 * ein zweiter Lauf überschreibt dieselben Zeilen mit demselben Inhalt.
 *
 * Voraussetzungen (ENV):
 *   DATABASE_URL          Ziel-DB (die neue/wiederhergestellte Neon-Instanz)
 *   NETLIFY_SITE_ID       Site-ID (Netlify → Site configuration → General)
 *   NETLIFY_API_TOKEN     Personal Access Token mit Zugriff auf die Site
 *
 * Aufruf:
 *   node scripts/db-restore-blobs.mjs --list
 *   node scripts/db-restore-blobs.mjs --date 2026-09-15
 *   node scripts/db-restore-blobs.mjs --date 2026-09-15 --table subscribers
 *   node scripts/db-restore-blobs.mjs --date 2026-09-15 --dry-run
 */
import { getStore } from "@netlify/blobs";
import { neon } from "@neondatabase/serverless";

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const val = (f) => {
  const i = args.indexOf(f);
  return i >= 0 ? args[i + 1] : undefined;
};

const dryRun = has("--dry-run");
const onlyTable = val("--table");
let date = val("--date");

function store() {
  const siteID = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_API_TOKEN;
  if (!siteID || !token) {
    console.error("NETLIFY_SITE_ID und NETLIFY_API_TOKEN müssen gesetzt sein.");
    process.exit(1);
  }
  return getStore({ name: "db-backups", siteID, token });
}

function db() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL fehlt.");
    process.exit(1);
  }
  return neon(url);
}

async function listRuns(s) {
  const { blobs } = await s.list({ prefix: "backup/" });
  const dates = [...new Set(blobs.map((b) => b.key.split("/")[1]).filter(Boolean))].sort();
  return { dates, blobs };
}

async function main() {
  const s = store();

  if (has("--list") || !date) {
    const { dates } = await listRuns(s);
    console.log("Verfügbare Backup-Läufe:");
    for (const d of dates) console.log("  " + d);
    if (!date) {
      console.log("\nMit --date <YYYY-MM-DD> einen Lauf wählen.");
      return;
    }
  }

  const { blobs } = await listRuns(s);
  let keys = blobs.map((b) => b.key).filter((k) => k.startsWith(`backup/${date}/`));
  if (onlyTable) keys = keys.filter((k) => k.endsWith(`/${onlyTable}.ndjson`));
  if (keys.length === 0) {
    console.error(`Keine Blobs für backup/${date}/${onlyTable ? onlyTable + ".ndjson" : "*"}`);
    process.exit(1);
  }

  const sql = db();
  let totalRows = 0;

  for (const key of keys.sort()) {
    const table = key.split("/").pop().replace(/\.ndjson$/, "");
    const text = await s.get(key);
    if (!text) { console.warn(`  ${table}: leer, übersprungen`); continue; }
    const rows = text.split("\n").filter(Boolean).map((l) => JSON.parse(l));
    if (rows.length === 0) { console.log(`  ${table}: 0 Zeilen`); continue; }

    const cols = Object.keys(rows[0]);
    if (!cols.includes("id")) {
      console.warn(`  ${table}: keine id-Spalte — übersprungen (manueller Restore nötig)`);
      continue;
    }
    const updatable = cols.filter((c) => c !== "id");

    if (dryRun) {
      console.log(`  [dry-run] ${table}: ${rows.length} Zeilen, Spalten: ${cols.join(", ")}`);
      totalRows += rows.length;
      continue;
    }

    let done = 0;
    for (const row of rows) {
      const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");
      const setClause = updatable.map((c) => `"${c}" = EXCLUDED."${c}"`).join(", ");
      const values = cols.map((c) => {
        const v = row[c];
        return v !== null && typeof v === "object" ? JSON.stringify(v) : v;
      });
      await sql.query(
        `INSERT INTO ${table} (${cols.map((c) => `"${c}"`).join(", ")})
         VALUES (${placeholders})
         ON CONFLICT (id) DO UPDATE SET ${setClause}`,
        values,
      );
      done++;
    }
    console.log(`  ${table}: ${done} Zeilen wiederhergestellt`);
    totalRows += done;
  }

  console.log(`\n${dryRun ? "[dry-run] " : ""}Fertig — ${totalRows} Zeilen aus backup/${date}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
