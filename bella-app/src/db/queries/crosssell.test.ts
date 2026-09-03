import { describe, it, expect } from "vitest";
import { allergenVariants, containsAllergen } from "./crosssell";

// Allergen-Sicherheit ist tier-sicherheitsnah: ein Allergiker darf das
// ausloesende Protein NIE empfohlen bekommen — auch nicht namensbasiert.
describe("allergenVariants", () => {
  it("Huhn schliesst Gefluegel / Haehnchen / Chicken mit ein", () => {
    const v = allergenVariants("Huhn");
    expect(v).toContain("geflügel");
    expect(v).toContain("gefluegel");
    expect(v).toContain("hähnchen");
    expect(v).toContain("chicken");
  });

  it("null -> keine Varianten", () => {
    expect(allergenVariants(null)).toEqual([]);
  });

  it("unbekanntes Allergen -> Fallback auf den lowercase-Begriff", () => {
    expect(allergenVariants("Exotenfleisch")).toEqual(["exotenfleisch"]);
  });
});

describe("containsAllergen", () => {
  it("erkennt Huhn ueber 'Gefluegel' im Produktnamen", () => {
    expect(containsAllergen("Nassfutter Rind & Geflügel Menü", "Huhn")).toBe(true);
  });

  it("erkennt Huhn ueber 'Hähnchen'", () => {
    expect(containsAllergen("Adult Hähnchen mit Reis", "Huhn")).toBe(true);
  });

  it("gibt false bei sicherem Monoprotein zurueck", () => {
    expect(containsAllergen("Monoprotein Pferd pur", "Huhn")).toBe(false);
    expect(containsAllergen("Trockenfutter Kartoffel & Ente", "Huhn")).toBe(false);
  });

  it("ist case-insensitiv", () => {
    expect(containsAllergen("PFERD PUR", "Pferd")).toBe(true);
  });

  it("Fisch-Allergie faengt auch Lachs", () => {
    expect(containsAllergen("Adult Lachsöl Topping", "Fisch")).toBe(true);
  });

  it("kein Allergen gesetzt -> nie true", () => {
    expect(containsAllergen("irgendein Futter mit Huhn", null)).toBe(false);
  });
});
