#!/usr/bin/env node
// Schreibt src/lib/generated-build-date.ts aus dem Datum des letzten Git-Commits.
// Läuft als `prebuild`. Wenn git nicht verfügbar ist (seltene Build-Umgebung),
// bleibt die eingecheckte Datei unverändert — kein harter Fehler.
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

let date;
try {
  date = execSync("git log -1 --format=%cs", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`unerwartetes Datumsformat: "${date}"`);
} catch (e) {
  console.warn(`[gen-build-date] git nicht nutzbar (${e.message}) — behalte eingechecktes Datum.`);
  process.exit(0);
}

const target = new URL("../src/lib/generated-build-date.ts", import.meta.url);
writeFileSync(
  target,
  `// AUTO-GENERIERT von scripts/gen-build-date.mjs (läuft als \`prebuild\`).\n` +
    `// Nicht manuell editieren — wird bei jedem Build aus dem letzten Git-Commit-Datum neu geschrieben.\n` +
    `export const BUILD_DATE = "${date}";\n`,
);
console.log(`[gen-build-date] BUILD_DATE = ${date}`);
