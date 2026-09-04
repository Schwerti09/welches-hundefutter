import { describe, it, expect, vi, afterEach } from "vitest";
import { logError, logWarn } from "./log";

function capture(fn: () => void): string {
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});
  const spyW = vi.spyOn(console, "warn").mockImplementation(() => {});
  fn();
  const out = (spy.mock.calls[0]?.[0] ?? spyW.mock.calls[0]?.[0] ?? "") as string;
  return out;
}

afterEach(() => vi.restoreAllMocks());

describe("log — PII-Scrubbing (6.1)", () => {
  it("entfernt E-Mail-Adressen aus message + ctx", () => {
    const out = capture(() =>
      logError("test", new Error("failed for max@example.com"), { note: "ping bella@welches-hundefutter.today" }),
    );
    expect(out).not.toContain("@example.com");
    expect(out).not.toContain("welches-hundefutter.today");
    expect(out).toContain("[email]");
  });

  it("redacted verdächtige ctx-Keys komplett", () => {
    const out = capture(() =>
      logError("test", new Error("x"), { userEmail: "a@b.de", apiKey: "sk-123", dogName: "Bello", count: 3 }),
    );
    const parsed = JSON.parse(out);
    expect(parsed.ctx.userEmail).toBe("[redacted]");
    expect(parsed.ctx.apiKey).toBe("[redacted]");
    expect(parsed.ctx.dogName).toBe("[redacted]"); // "name" trifft die Regex
    expect(parsed.ctx.count).toBe(3);
  });

  it("maskiert Credentials in Connection-Strings", () => {
    const out = capture(() =>
      logError("db", new Error("connect postgresql://user:secretpw@ep-x.neon.tech/db failed")),
    );
    expect(out).not.toContain("secretpw");
    expect(out).toContain("//[redacted]@");
  });

  it("gültiges JSON mit level/scope/ts", () => {
    const out = capture(() => logWarn("scope-x", "just a string"));
    const p = JSON.parse(out);
    expect(p.level).toBe("warn");
    expect(p.scope).toBe("scope-x");
    expect(typeof p.ts).toBe("string");
  });

  it("kürzt tiefe/lange Strukturen", () => {
    const deep = { a: { b: { c: { d: { e: 1 } } } } };
    const out = capture(() => logError("s", new Error("e"), deep));
    expect(out.length).toBeLessThan(2000);
  });
});
