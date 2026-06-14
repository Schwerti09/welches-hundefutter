/**
 * CLI-Wrapper für scripts/lib/indexnow-ping.mjs.
 * Run:  INDEXNOW_KEY=… node scripts/indexnow-ping.mjs
 */
import { readFile } from "node:fs/promises";
import { pingIndexNow } from "./lib/indexnow-ping.mjs";

let extraUrls = [];
try {
  const raw = await readFile(new URL("./changed-urls.json", import.meta.url), "utf8");
  const changed = JSON.parse(raw);
  if (Array.isArray(changed)) extraUrls = changed;
} catch { /* keine changed-urls.json -> Kern-Satz */ }

await pingIndexNow(extraUrls);
