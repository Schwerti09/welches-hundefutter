#!/usr/bin/env node
/**
 * Performance-Budget (Roadmap 6.2). Läuft am Ende von `npm run ci` (= Netlify-Build).
 *
 * Misst die **gzip-Größe des geteilten First-Load-JS** (die Chunks, die auf
 * JEDER Seite laden — `rootMainFiles` aus dem Build-Manifest) und vergleicht sie
 * mit `.bundle-budget.json`. Drüber → exit 1 → kein Deploy.
 *
 * Budget setzen/anheben: `.bundle-budget.json` committen mit
 *   { "sharedFirstLoadGzipKB": <zahl> }
 * Sinnvoll ist „aktueller Wert + ~10 %".
 */
import { readFileSync, existsSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, ".next/build-manifest.json");
const budgetPath = join(root, ".bundle-budget.json");

if (!existsSync(manifestPath)) {
  console.error("[bundle-size] .next/build-manifest.json fehlt — erst `next build` laufen lassen.");
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const files = (manifest.rootMainFiles ?? []).filter((f) => f.endsWith(".js"));

let gzipBytes = 0;
let rawBytes = 0;
for (const rel of files) {
  const abs = join(root, ".next", rel);
  if (!existsSync(abs)) continue;
  const buf = readFileSync(abs);
  rawBytes += statSync(abs).size;
  gzipBytes += gzipSync(buf, { level: 9 }).length;
}

const gzipKB = Math.round((gzipBytes / 1024) * 10) / 10;
const rawKB = Math.round(rawBytes / 1024);
console.log(`[bundle-size] geteiltes First-Load-JS: ${files.length} Chunks · ${rawKB} KB roh · ${gzipKB} KB gzip`);

if (!existsSync(budgetPath)) {
  const suggested = Math.ceil((gzipKB * 1.1) / 5) * 5;
  console.log(`[bundle-size] kein .bundle-budget.json — lege eins an mit { "sharedFirstLoadGzipKB": ${suggested} }`);
  process.exit(0);
}

const budget = JSON.parse(readFileSync(budgetPath, "utf8")).sharedFirstLoadGzipKB;
if (typeof budget !== "number") {
  console.error('[bundle-size] .bundle-budget.json braucht { "sharedFirstLoadGzipKB": <zahl> }');
  process.exit(1);
}

if (gzipKB > budget) {
  console.error(`[bundle-size] ❌ ÜBER BUDGET: ${gzipKB} KB > ${budget} KB. Bundle verkleinern oder Budget bewusst anheben.`);
  process.exit(1);
}
console.log(`[bundle-size] ✓ innerhalb Budget (${gzipKB} / ${budget} KB gzip)`);
