import { describe, it, expect } from "vitest";
import { allergenVariants, containsAllergen, containsAnyAllergen, allergenLikePatterns } from "./allergens";

describe("allergenVariants", () => {
  it("Huhn deckt Geflügel / Hähnchen / Chicken / Poulet ab", () => {
    const v = allergenVariants("Huhn");
    for (const x of ["geflügel", "gefluegel", "hähnchen", "haehnchen", "chicken", "poulet", "poultry"]) {
      expect(v).toContain(x);
    }
  });
  it("unbekanntes Allergen -> lowercase-Fallback", () => {
    expect(allergenVariants("Strauß")).toEqual(["strauß"]);
  });
  it("null / undefined -> []", () => {
    expect(allergenVariants(null)).toEqual([]);
    expect(allergenVariants(undefined)).toEqual([]);
  });
});

describe("containsAllergen / containsAnyAllergen", () => {
  it("erkennt Huhn über 'Geflügel' im Produktnamen", () => {
    expect(containsAllergen("Adult Rind & Geflügel", "Huhn")).toBe(true);
  });
  it("containsAnyAllergen: mehrere gemiedene Proteine", () => {
    expect(containsAnyAllergen("Monoprotein Lachs", ["Huhn", "Rind"])).toBe(false);
    expect(containsAnyAllergen("Nassfutter mit Rind", ["Huhn", "Rind"])).toBe(true);
    expect(containsAnyAllergen("egal", [])).toBe(false);
    expect(containsAnyAllergen("egal", undefined)).toBe(false);
  });
});

describe("allergenLikePatterns", () => {
  it("baut %variante%-Muster für LIKE ANY", () => {
    const pats = allergenLikePatterns(["Huhn"]);
    expect(pats).toContain("%huhn%");
    expect(pats).toContain("%geflügel%");
    expect(pats.every((p) => p.startsWith("%") && p.endsWith("%"))).toBe(true);
  });
  it("dedupliziert über mehrere Allergene (Lachs ⊂ Fisch)", () => {
    const pats = allergenLikePatterns(["Lachs", "Fisch"]);
    expect(new Set(pats).size).toBe(pats.length);
    expect(pats).toContain("%lachs%");
  });
  it("leer / undefined -> []", () => {
    expect(allergenLikePatterns([])).toEqual([]);
    expect(allergenLikePatterns(undefined)).toEqual([]);
  });
});
