/**
 * Rate-Limit für die teuren LLM-/Tracking-Routen.
 *
 * Verteilt über Upstash Redis (REST API, atomares INCR), sobald
 * UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN gesetzt sind (Netlify-Env,
 * kostenloses Kontingent reicht für dieses Traffic-Niveau). Fester Zähler pro
 * Fenster: INCR + PEXPIRE ... NX (setzt die Ablaufzeit nur beim allerersten
 * Treffer im Fenster, verlängert sie bei weiteren Treffern nicht). Schlägt
 * Upstash fehl (Netzwerk, falscher Key, Kontingent) → nie den Nutzer blocken,
 * stattdessen auf den In-Memory-Fallback ausweichen statt die Anfrage platzen
 * zu lassen.
 *
 * Ohne diese Vars: der bisherige In-Memory-Fallback (Roadmap Op 1.3, Teil 1) —
 * eine Sliding-Window-Zählung pro IP im Modul-Scope. Bremst auf einer warmen
 * Node-Serverless-Instanz den häufigsten Missbrauch zuverlässig aus, zählt
 * aber nicht global über mehrere Instanzen/nach Cold-Start.
 */

type Bucket = { count: number; resetAt: number };
const memoryStore = new Map<string, Bucket>();

let lastSweep = 0;
function sweepMemory(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [k, v] of memoryStore) if (v.resetAt <= now) memoryStore.delete(k);
}

function memoryHit(key: string, limit: number, windowMs: number, now: number): { ok: boolean; retryAfter: number } {
  sweepMemory(now);
  const b = memoryStore.get(key);
  if (!b || b.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  b.count += 1;
  if (b.count > limit) return { ok: false, retryAfter: Math.max(1, Math.ceil((b.resetAt - now) / 1000)) };
  return { ok: true, retryAfter: 0 };
}

interface UpstashCommandResult { result: number; error?: string }

async function upstashHit(
  baseUrl: string, token: string, key: string, limit: number, windowMs: number,
): Promise<{ ok: boolean; retryAfter: number }> {
  const res = await fetch(`${baseUrl}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify([["INCR", key], ["PEXPIRE", key, windowMs, "NX"]]),
  });
  if (!res.ok) throw new Error(`upstash pipeline ${res.status}`);
  const results = (await res.json()) as UpstashCommandResult[];
  const count = results[0]?.result;
  if (typeof count !== "number") throw new Error("upstash: unerwartete Antwort");

  if (count <= limit) return { ok: true, retryAfter: 0 };

  const pttlRes = await fetch(`${baseUrl}/pttl/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const pttl = pttlRes.ok ? ((await pttlRes.json()) as UpstashCommandResult).result : windowMs;
  return { ok: false, retryAfter: Math.max(1, Math.ceil((pttl > 0 ? pttl : windowMs) / 1000)) };
}

export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
  return xff.split(",")[0].trim() || "unknown";
}

/** true = erlaubt. retryAfter in Sekunden, wenn blockiert. */
export async function hit(key: string, limit: number, windowMs: number, now = Date.now()): Promise<{ ok: boolean; retryAfter: number }> {
  const baseUrl = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (baseUrl && token) {
    try {
      return await upstashHit(baseUrl, token, key, limit, windowMs);
    } catch {
      return memoryHit(key, limit, windowMs, now);
    }
  }
  return memoryHit(key, limit, windowMs, now);
}

/**
 * Prüft ein oder mehrere Fenster. Gibt eine fertige 429-Response zurück, wenn
 * eines reißt — sonst null.
 */
export async function checkRateLimit(
  req: Request,
  name: string,
  windows: { limit: number; windowMs: number }[],
): Promise<Response | null> {
  const ip = clientIp(req);
  for (const w of windows) {
    const { ok, retryAfter } = await hit(`${name}:${w.windowMs}:${ip}`, w.limit, w.windowMs);
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
  memoryStore.clear();
  lastSweep = 0;
}
