/**
 * First-Party-Analytics-Beacon (Roadmap 5.2).
 *
 * Anonym: keine Cookies, kein PII, keine IP-Speicherung. `sessionId` ist eine
 * client-seitig gewürfelte, kurzlebige Kennung (sessionStorage) nur zur
 * Funnel-Verkettung. Schlägt der DB-Write fehl (Migration noch nicht
 * eingespielt), antwortet die Route trotzdem 204 — ein Beacon darf den Client
 * nie stören.
 *
 * Läuft PARALLEL zu GA4 (2-Wochen-Übergang, siehe Roadmap 5.2). GA4 wird erst
 * in Teil 2 entfernt.
 */
import { NextRequest } from "next/server";
import { neon } from "@neondatabase/serverless";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const EVENT_NAMES = new Set([
  "pageview",
  "advisor_start",
  "advisor_offers",
  "affiliate_click",
  "refill_click",
  "alert_subscribe",
]);

const noContent = () => new Response(null, { status: 204 });

function str(v: unknown, max: number): string | null {
  return typeof v === "string" && v.length > 0 ? v.slice(0, max) : null;
}

function deviceClass(ua: string): "bot" | "mobile" | "desktop" {
  if (/bot|crawler|spider|crawling|headless/i.test(ua)) return "bot";
  if (/Mobi|Android|iPhone|iPad/i.test(ua)) return "mobile";
  return "desktop";
}

// props: nur flaches, PII-freies Objekt, klein gehalten
function safeProps(v: unknown): Record<string, unknown> | null {
  if (!v || typeof v !== "object" || Array.isArray(v)) return null;
  const out: Record<string, unknown> = {};
  let n = 0;
  for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
    if (n++ >= 12) break;
    if (/mail|name|phone|token|ip|address|user/i.test(k)) continue;
    if (typeof val === "string") out[k.slice(0, 40)] = val.slice(0, 120);
    else if (typeof val === "number" || typeof val === "boolean") out[k.slice(0, 40)] = val;
  }
  return Object.keys(out).length ? out : null;
}

export async function POST(req: NextRequest) {
  const limited = await checkRateLimit(req, "track", [{ limit: 120, windowMs: 60_000 }]);
  if (limited) return limited;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return noContent();
  }

  const name = str(body.name, 40);
  if (!name || !EVENT_NAMES.has(name)) return noContent();

  const url = process.env.DATABASE_URL;
  if (!url) return noContent();

  const path = str(body.path, 512);
  const ref = str(body.ref, 512);
  const sessionId = str(body.sessionId, 40)?.replace(/[^a-zA-Z0-9_-]/g, "") ?? null;
  const device = deviceClass(req.headers.get("user-agent") ?? "");
  const props = safeProps(body.props);

  try {
    const sql = neon(url);
    await sql`
      INSERT INTO events (name, path, ref, session_id, device, props)
      VALUES (${name}, ${path}, ${ref}, ${sessionId}, ${device}, ${props ? JSON.stringify(props) : null}::jsonb)
    `;
  } catch (e) {
    console.warn("[track] insert failed:", e instanceof Error ? e.message : String(e));
  }
  return noContent();
}
