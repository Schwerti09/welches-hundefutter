/**
 * Lädt alle Rasse-Bilder von images.dog.ceo herunter und speichert
 * sie lokal in public/breeds/. Danach sind keine externen Bild-Requests
 * mehr nötig.
 *
 * Einmalig ausführen:
 *   node scripts/download-breed-images.mjs
 *
 * Oder nach Updates der breed-gallery.json:
 *   node scripts/download-breed-images.mjs --force
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import https from "https";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "public/breeds");
const GALLERY_PATH = resolve(ROOT, "src/data/breed-gallery.json");
const FORCE = process.argv.includes("--force");
const CONCURRENCY = 5;
const TIMEOUT_MS = 10000;

// public/breeds/ anlegen wenn nicht vorhanden
if (!existsSync(OUT_DIR)) {
  mkdirSync(OUT_DIR, { recursive: true });
  console.log(`📁 Ordner erstellt: public/breeds/`);
}

const gallery = JSON.parse(readFileSync(GALLERY_PATH, "utf-8"));
console.log(`🐾 ${gallery.length} Rassen in der Gallery`);

function getLocalPath(slug) {
  // Immer .jpg — passend zu den localImg-Pfaden in breed-gallery.json
  return `${OUT_DIR}/${slug}.jpg`;
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (existsSync(dest) && !FORCE) return resolve("skip");
    const chunks = [];
    const req = https.get(url, { timeout: TIMEOUT_MS }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        writeFileSync(dest, Buffer.concat(chunks));
        resolve("downloaded");
      });
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("timeout")); });
  });
}

// Batch-Download mit Concurrency-Limit
async function downloadAll() {
  let ok = 0, skipped = 0, failed = 0;
  const queue = [...gallery];

  async function worker() {
    while (queue.length > 0) {
      const b = queue.shift();
      const dest = getLocalPath(b.slug);
      try {
        const result = await downloadFile(b.img, dest);
        if (result === "skip") { skipped++; process.stdout.write("·"); }
        else { ok++; process.stdout.write("✓"); }
      } catch (e) {
        failed++;
        process.stdout.write("✗");
        console.error(`\n  FAIL: ${b.slug} — ${e.message}`);
      }
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  console.log(`\n\n✅ Fertig: ${ok} heruntergeladen, ${skipped} übersprungen, ${failed} fehlgeschlagen`);

  if (failed > 0) {
    console.log("⚠️  Fehlgeschlagene Bilder werden weiterhin von dog.ceo geladen (Fallback aktiv).");
  }
}

downloadAll().catch((e) => { console.error(e); process.exit(1); });
