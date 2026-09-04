/**
 * Strukturiertes Logging (Roadmap 6.1).
 *
 * Ein Ort für Fehler-/Warn-Logs: JSON-Zeile nach `console.error`/`console.warn`
 * (Netlify-Function- und Next-Server-Logs sind JSON-fähig → später per Log-Drain
 * oder Sentry auswertbar). PII wird vor dem Schreiben entfernt.
 *
 * Sentry-Anbindung folgt (6.1 Teil 2): dann hier — und nur hier — zusätzlich
 * `Sentry.captureException(err, { tags: { scope }, extra: safeCtx })` aufrufen,
 * sobald `process.env.SENTRY_DSN` gesetzt ist.
 */

type Ctx = Record<string, unknown>;

const EMAIL_RE = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const URL_CRED_RE = /\/\/[^/@\s:]+:[^/@\s]+@/g; // user:pass@host in Connection-Strings
const SECRET_KEY_RE = /mail|name|token|secret|key|password|pass|auth|ip|address|dsn|url/i;

function scrubString(s: string): string {
  // Credentials in Connection-Strings zuerst — sonst frisst die E-Mail-Regex das `pass@host`.
  return s.replace(URL_CRED_RE, "//[redacted]@").replace(EMAIL_RE, "[email]");
}

function scrub(v: unknown, depth = 0): unknown {
  if (v == null) return v;
  if (typeof v === "string") return scrubString(v.slice(0, 500));
  if (typeof v === "number" || typeof v === "boolean") return v;
  if (depth >= 3) return "[…]";
  if (Array.isArray(v)) return v.slice(0, 20).map((x) => scrub(x, depth + 1));
  if (typeof v === "object") {
    const out: Ctx = {};
    let n = 0;
    for (const [k, val] of Object.entries(v as Ctx)) {
      if (n++ >= 25) break;
      out[k] = SECRET_KEY_RE.test(k) ? "[redacted]" : scrub(val, depth + 1);
    }
    return out;
  }
  return String(v);
}

function errShape(err: unknown): Ctx {
  if (err instanceof Error) {
    return {
      name: err.name,
      message: scrubString(err.message),
      stack: err.stack ? scrubString(err.stack).split("\n").slice(0, 8).join("\n") : undefined,
    };
  }
  return { message: scrubString(String(err)) };
}

function emit(level: "error" | "warn", scope: string, err: unknown, ctx?: Ctx) {
  const line = JSON.stringify({
    level,
    scope,
    ts: new Date().toISOString(),
    ...errShape(err),
    ...(ctx ? { ctx: scrub(ctx) } : {}),
  });
  if (level === "error") console.error(line);
  else console.warn(line);
}

export function logError(scope: string, err: unknown, ctx?: Ctx): void {
  emit("error", scope, err, ctx);
}

export function logWarn(scope: string, err: unknown, ctx?: Ctx): void {
  emit("warn", scope, err, ctx);
}
