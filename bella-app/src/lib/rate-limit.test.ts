import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { hit, checkRateLimit, checkSameOrigin, __resetRateLimit } from "./rate-limit";

beforeEach(() => __resetRateLimit());

const reqWith = (headers: Record<string, string>) =>
  new Request("https://welches-hundefutter.today/api/advisor/chat", { method: "POST", headers });

describe("hit — In-Memory-Fallback (kein Upstash konfiguriert)", () => {
  it("erlaubt bis zum Limit, blockt danach", async () => {
    const now = 1_000_000;
    for (let i = 0; i < 5; i++) expect((await hit("k", 5, 60_000, now)).ok).toBe(true);
    const blocked = await hit("k", 5, 60_000, now);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("Fenster läuft ab -> wieder frei", async () => {
    const t0 = 2_000_000;
    for (let i = 0; i < 5; i++) await hit("k2", 5, 1000, t0);
    expect((await hit("k2", 5, 1000, t0)).ok).toBe(false);
    expect((await hit("k2", 5, 1000, t0 + 1001)).ok).toBe(true);
  });

  it("verschiedene Keys stören sich nicht", async () => {
    const now = 3_000_000;
    for (let i = 0; i < 5; i++) await hit("a", 5, 60_000, now);
    expect((await hit("b", 5, 60_000, now)).ok).toBe(true);
  });
});

describe("checkRateLimit", () => {
  it("gibt 429 mit Retry-After zurück, wenn ein Fenster reißt", async () => {
    const r = reqWith({ "x-forwarded-for": "9.9.9.9" });
    let last: Response | null = null;
    for (let i = 0; i < 4; i++) last = await checkRateLimit(r, "test", [{ limit: 3, windowMs: 60_000 }]);
    expect(last).not.toBeNull();
    expect(last!.status).toBe(429);
    expect(last!.headers.get("Retry-After")).toBeTruthy();
    const body = await last!.json();
    expect(body.error).toBe("rate_limited");
  });

  it("trennt nach IP", async () => {
    for (let i = 0; i < 3; i++) await checkRateLimit(reqWith({ "x-forwarded-for": "1.1.1.1" }), "t2", [{ limit: 3, windowMs: 60_000 }]);
    expect(await checkRateLimit(reqWith({ "x-forwarded-for": "2.2.2.2" }), "t2", [{ limit: 3, windowMs: 60_000 }])).toBeNull();
  });
});

describe("hit — Upstash-Pfad (Pipeline-Antwort gemockt)", () => {
  const realFetch = global.fetch;
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV, UPSTASH_REDIS_REST_URL: "https://example.upstash.io", UPSTASH_REDIS_REST_TOKEN: "tok" };
  });
  afterEach(() => {
    global.fetch = realFetch;
    process.env = OLD_ENV;
  });

  it("erlaubt, wenn INCR unter dem Limit bleibt", async () => {
    global.fetch = (async () => new Response(JSON.stringify([{ result: 3 }, { result: 1 }]), { status: 200 })) as typeof fetch;
    const r = await hit("upstash-key", 5, 60_000);
    expect(r.ok).toBe(true);
  });

  it("blockt mit Retry-After aus PTTL, wenn INCR das Limit überschreitet", async () => {
    let call = 0;
    global.fetch = (async (url: string) => {
      call++;
      if (String(url).includes("/pipeline")) return new Response(JSON.stringify([{ result: 6 }, { result: 0 }]), { status: 200 });
      return new Response(JSON.stringify({ result: 12_345 }), { status: 200 });
    }) as typeof fetch;
    const r = await hit("upstash-key-2", 5, 60_000);
    expect(r.ok).toBe(false);
    expect(r.retryAfter).toBe(13); // ceil(12345/1000)
    expect(call).toBe(2);
  });

  it("fällt bei Upstash-Fehler auf den In-Memory-Store zurück, statt zu blocken", async () => {
    global.fetch = (async () => new Response("boom", { status: 500 })) as typeof fetch;
    const r = await hit("upstash-fallback-key", 5, 60_000);
    expect(r.ok).toBe(true); // erster Treffer im leeren In-Memory-Fallback
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
