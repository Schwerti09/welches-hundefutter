// Pingt IndexNow (Bing & Co.) mit geänderten/Kern-URLs. Bricht den Import NIE ab.
const KEY = process.env.INDEXNOW_KEY;
const HOST = "welches-hundefutter.today";

if (!KEY) {
  console.log("[indexnow] kein INDEXNOW_KEY gesetzt – übersprungen.");
  process.exit(0);
}

// Optional: der Feed-Loader kann scripts/changed-urls.json schreiben (1 URL pro Eintrag).
// Fällt sonst auf einen kleinen, hochwertigen Kern-Satz zurück.
import { readFile } from "node:fs/promises";

const CORE = [
  `https://${HOST}/`,
  `https://${HOST}/analyse/preisindex-2026`,
  `https://${HOST}/analyse/methodik`,
  `https://${HOST}/deals`,
  `https://${HOST}/faq`,
];

let urlList = CORE;
try {
  const raw = await readFile(new URL("./changed-urls.json", import.meta.url), "utf8");
  const changed = JSON.parse(raw);
  if (Array.isArray(changed) && changed.length) {
    // IndexNow-Limit beachten: nicht spammen. Erst geänderte, dann Kern, dedupe, cap.
    urlList = [...new Set([...changed, ...CORE])].slice(0, 10000);
  }
} catch { /* keine changed-urls.json -> Kern-Satz */ }

try {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList,
    }),
  });
  console.log(`[indexnow] ${res.status} – ${urlList.length} URLs gemeldet.`);
} catch (e) {
  console.log("[indexnow] Ping fehlgeschlagen (ignoriert):", e?.message);
}
