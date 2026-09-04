// First-Party-Analytics-Client (Roadmap 5.2).
// Fire-and-forget, anonym, kein Cookie. `sessionId` lebt nur im sessionStorage.

export type EventName =
  | "pageview"
  | "advisor_start"
  | "advisor_offers"
  | "affiliate_click"
  | "refill_click"
  | "alert_subscribe";

const SID_KEY = "bella-sid";

function sessionId(): string {
  try {
    let s = sessionStorage.getItem(SID_KEY);
    if (!s) {
      s = (crypto.randomUUID?.() ?? String(Math.random()).slice(2)).replace(/-/g, "").slice(0, 24);
      sessionStorage.setItem(SID_KEY, s);
    }
    return s;
  } catch {
    return "anon";
  }
}

/** Interner Referrer-Pfad (nur wenn selbe Origin) — sonst undefined. */
function internalRef(): string | undefined {
  try {
    if (!document.referrer) return undefined;
    const u = new URL(document.referrer);
    return u.origin === location.origin ? u.pathname : undefined;
  } catch {
    return undefined;
  }
}

export function track(name: EventName, props?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify({
    name,
    path: location.pathname,
    ref: internalRef(),
    sessionId: sessionId(),
    props,
  });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
    } else {
      void fetch("/api/track", { method: "POST", body: payload, keepalive: true, headers: { "Content-Type": "application/json" } });
    }
  } catch {
    /* Analytics darf nie den Client stören */
  }
}
