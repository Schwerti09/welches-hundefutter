import { describe, it, expect, beforeEach } from "vitest";
import { hit, checkRateLimit, checkSameOrigin, __resetRateLimit } from "./rate-limit";

beforeEach(() => __resetRateLimit());

const reqWith = (headers: Record<string, string>) =>
  new Request("https://welches-hundefutter.today/api/advisor/chat", { method: "POST", headers });

describe("hit — Sliding Window", () => {
  it("erlaubt bis zum Limit, blockt danach", () => {
    const now = 1_000_000;
    for (let i = 0; i < 5; i++) expect(hit("k", 5, 60_000, now).ok).toBe(true);
    const blocked = hit("k", 5, 60_000, now);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("Fenster läuft ab -> wieder frei", () => {
    const t0 = 2_000_000;
    for (let i = 0; i < 5; i++) hit("k2", 5, 1000, t0);
    expect(hit("k2", 5, 1000, t0).ok).toBe(false);
    expect(hit("k2", 5, 1000, t0 + 1001).ok).toBe(true);
  });

  it("verschiedene Keys stören sich nicht", () => {
    const now = 3_000_000;
    for (let i = 0; i < 5; i++) hit("a", 5, 60_000, now);
    expect(hit("b", 5, 60_000, now).ok).toBe(true);
  });
});

describe("checkRateLimit", () => {
  it("gibt 429 mit Retry-After zurück, wenn ein Fenster reißt", async () => {
    const r = reqWith({ "x-forwarded-for": "9.9.9.9" });
    let last: Response | null = null;
    for (let i = 0; i < 4; i++) last = checkRateLimit(r, "test", [{ limit: 3, windowMs: 60_000 }]);
    expect(last).not.toBeNull();
    expect(last!.status).toBe(429);
    expect(last!.headers.get("Retry-After")).toBeTruthy();
    const body = await last!.json();
    expect(body.error).toBe("rate_limited");
  });

  it("trennt nach IP", () => {
    for (let i = 0; i < 3; i++) checkRateLimit(reqWith({ "x-forwarded-for": "1.1.1.1" }), "t2", [{ limit: 3, windowMs: 60_000 }]);
    expect(checkRateLimit(reqWith({ "x-forwarded-for": "2.2.2.2" }), "t2", [{ limit: 3, windowMs: 60_000 }])).toBeNull();
  });
});

describe("checkSameOrigin", () => {
  it("erlaubt die eigene Domain", () => {
    expect(checkSameOrigin(reqWith({ origin: "https://welches-hundefutter.today" }))).toBeNull();
  });
  it("erlaubt localhost (Dev)", () => {
    expect(checkSameOrigin(reqWith({ origin: "http://localhost:3000" }))).toBeNull();
  });
  it("blockt fremde Origin mit 403", () => {
    const res = checkSameOrigin(reqWith({ origin: "https://evil.example" }));
    expect(res?.status).toBe(403);
  });
  it("lässt fehlenden Origin durch (curl / Server-zu-Server)", () => {
    expect(checkSameOrigin(reqWith({}))).toBeNull();
  });
  it("wertet Referer aus, wenn kein Origin da ist", () => {
    expect(checkSameOrigin(reqWith({ referer: "https://evil.example/page" }))?.status).toBe(403);
    expect(checkSameOrigin(reqWith({ referer: "https://welches-hundefutter.today/rassen" }))).toBeNull();
  });
});
