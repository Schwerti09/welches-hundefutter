import { describe, it, expect } from "vitest";
import {
  representativeWeight,
  lifespanYears,
  lifetimeFoodCost,
  remainingFoodCost,
  fmtEur,
} from "./dogCost";

describe("representativeWeight", () => {
  it("Mittel aus min/max", () => {
    expect(representativeWeight({ weightMin: 10, weightMax: 20 })).toBe(15);
  });
  it("parst String-Gewichte", () => {
    expect(representativeWeight({ weightMin: "8", weightMax: "12" })).toBe(10);
  });
  it("faellt auf die Groessenklasse zurueck", () => {
    expect(representativeWeight({ size: "gross" })).toBe(32);
  });
  it("Default 18 kg, wenn nichts bekannt", () => {
    expect(representativeWeight({})).toBe(18);
  });
});

describe("lifespanYears", () => {
  it("nimmt den Datenwert", () => {
    expect(lifespanYears({ lifeExpectancy: 12 })).toBe(12);
  });
  it("Groessenklasse: klein lebt laenger als sehrgross", () => {
    expect(lifespanYears({ size: "klein" })).toBeGreaterThan(lifespanYears({ size: "sehrgross" }));
  });
  it("Default 13", () => {
    expect(lifespanYears({})).toBe(13);
  });
});

describe("lifetimeFoodCost", () => {
  it("ist positiv und in plausibler Groessenordnung", () => {
    const c = lifetimeFoodCost(20, 12, 5);
    expect(c).toBeGreaterThan(4000);
    expect(c).toBeLessThan(9000);
  });
  it("skaliert linear mit den Jahren", () => {
    expect(lifetimeFoodCost(20, 12, 5)).toBeCloseTo(lifetimeFoodCost(20, 6, 5) * 2, 5);
  });
});

describe("remainingFoodCost", () => {
  it("0, wenn der Hund sein Lebensende erreicht/ueberschritten hat", () => {
    expect(remainingFoodCost(20, 12, 12, 5)).toBe(0);
    expect(remainingFoodCost(20, 12, 15, 5)).toBe(0);
  });
});

describe("fmtEur", () => {
  it("rundet und formatiert mit deutschem Tausenderpunkt", () => {
    expect(fmtEur(1234.7)).toBe("1.235");
  });
});
