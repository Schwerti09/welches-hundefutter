/**
 * Leichtgewichtiges In-Memory-Rate-Limit für die teuren LLM-Routen.
 *
 * Bewusst simpel: eine Sliding-Window-Zählung pro IP im Modul-Scope. Auf einer
 * warmen Node-Serverless-Instanz (Netlify Functions) bleibt der Zustand über
 * Requests erhalten und bremst den häufigsten Missbrauch — ein Client, der die
 * Route hämmert — zuverlässig aus. Kein verteilter Zustand: nach Cold-Start /
 * über mehrere Instanzen ist die Zählung nicht global.
 *
 * Upgrade-Pfad (Roadmap Op 1.3, wenn Traffic es rechtfertigt): Upstash Redis
 * (atomares INCR) oder Netlify Blobs hinter derselben Signatur.
 */

type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

let lastSweep = 0;
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [k, v] of store) if (v.resetAt <= now) store.delete(k);
}

export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
  return xff.split(",")[0].trim() || "unknown";
}

/** true = erlaubt. retryAfter in Sekunden, wenn blockiert. */
export function hit(key: string, limit: number, windowMs: number, now = Date.now()): { ok: boolean; retryAfter: number } {
  sweep(now);
  const b = store.get(key);
  if (!b || b.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  b.count += 1;
  if (b.count > limit) return { ok: false, retryAfter: Math.max(1, Math.ceil((b.resetAt - now) / 1000)) };
  return { ok: true, retryAfter: 0 };
}

/**
 * Prüft ein oder mehrere Fenster. Gibt eine fertige 429-Response zurück, wenn
 * eines reißt — sonst null.
 */
export function checkRateLimit(
  req: Request,
  name: string,
  windows: { limit: number; windowMs: number }[],
): Response | null {
  const ip = clientIp(req);
  for (const w of windows) {
    const { ok, retryAfter } = hit(`${name}:${w.windowMs}:${ip}`, w.limit, w.windowMs);
    if (!ok) {
      return new Response(
        JSON.stringify({ error: "rate_limited", message: "Kurz zu schnell — versuch's gleich nochmal.", retryAfter }),
        { status: 429, headers: { "Content-Type": "application/json", "Retry-After": String(retryAfter) } },
      );
    }
  }
  return null;
}

const LOCAL_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"];

/**
 * Cross-Site-Schutz für State-changing Browser-Requests: kommt ein Origin/Referer
 * mit und passt NICHT zur eigenen Domain → 403. Fehlt der Header ganz (curl,
 * Server-zu-Server), wird durchgelassen — Ziel ist fremder Browser-Traffic.
 */
export function checkSameOrigin(req: Request): Response | null {
  const site = process.env.SITE_URL || "https://welches-hundefutter.today";
  let allowedOrigin: string;
  try {
    allowedOrigin = new URL(site).origin;
  } catch {
    allowedOrigin = "https://welches-hundefutter.today";
  }
  const allowed = new Set([allowedOrigin, ...LOCAL_ORIGINS]);

  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  let candidate: string | null = origin;
  if (!candidate && referer) {
    try { candidate = new URL(referer).origin; } catch { candidate = null; }
  }
  if (candidate && !allowed.has(candidate)) {
    return new Response(JSON.stringify({ error: "bad_origin" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  return null;
}

/** Nur für Tests: Zustand zurücksetzen. */
export function __resetRateLimit(): void {
  store.clear();
  lastSweep = 0;
}
