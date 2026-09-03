// Pingt IndexNow (Bing & Co.) mit geänderten/Kern-URLs. Bricht den Import NIE ab.
const HOST = "welches-hundefutter.today";

const CORE = [
  `https://${HOST}/`,
  `https://${HOST}/analyse/preisindex-2026`,
  `https://${HOST}/analyse/methodik`,
  `https://${HOST}/deals`,
  `https://${HOST}/faq`,
];

export async function pingIndexNow(extraUrls = []) {
  const KEY = process.env.INDEXNOW_KEY;
  if (!KEY) {
    console.log("[indexnow] kein INDEXNOW_KEY gesetzt – übersprungen.");
    return;
  }

  // IndexNow-Limit beachten: nicht spammen. Erst geänderte, dann Kern, dedupe, cap.
  const urlList = extraUrls.length ? [...new Set([...extraUrls, ...CORE])].slice(0, 10000) : CORE;

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
}
