import { describe, it, expect } from "vitest";
import { coerceIntent } from "./schema";

describe("coerceIntent", () => {
  it("übernimmt gültige Felder inkl. avoidProtein", () => {
    const out = coerceIntent({
      lifePhase: "adult", sensitive: true, avoidProtein: ["Huhn", "Rind"],
      maxPricePerKg: 5, foo: "bar",
    });
    expect(out.lifePhase).toBe("adult");
    expect(out.sensitive).toBe(true);
    expect(out.avoidProtein).toEqual(["Huhn", "Rind"]);
    expect(out.maxPricePerKg).toBe(5);
    // @ts-expect-error unbekanntes Feld wird verworfen
    expect(out.foo).toBeUndefined();
  });

  it("verwirft null / leere Strings, wirft nie", () => {
    expect(coerceIntent({ protein: null, lifePhase: "", breed: undefined })).toEqual({});
    expect(coerceIntent("kaputt")).toEqual({});
    expect(coerceIntent(null)).toEqual({});
  });

  it("verwirft falsch getypte Werte statt zu werfen", () => {
    const out = coerceIntent({ maxPricePerKg: "viel", lifePhase: "greis" });
    expect(out).toEqual({});
  });
});
