import { describe, it, expect } from "vitest";
import { findGlossaryLinks } from "./glossary-links";

describe("findGlossaryLinks", () => {
  it("findet BARF", () => {
    expect(findGlossaryLinks("Ich will meinen Hund barfen — also BARF")).toEqual([
      { label: "Was ist BARF?", url: "/futtertyp/barf" },
    ]);
  });

  it("kappt bei max Treffern", () => {
    const out = findGlossaryLinks("hypoallergen und monoprotein bei allergie und durchfall", 2);
    expect(out).toHaveLength(2);
  });

  it("dedupliziert nach URL", () => {
    const out = findGlossaryLinks("allergie allergiker allergie", 5);
    expect(out).toHaveLength(1);
    expect(out[0].url).toBe("/problem/allergie");
  });

  it("gibt leeres Array ohne Treffer", () => {
    expect(findGlossaryLinks("hier steht nichts erkennbares")).toEqual([]);
  });
});
