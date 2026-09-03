import { describe, it, expect } from "vitest";
import { dailyGrams, bagDays, monthlyEuro, refillDueAt, estimate } from "./consumption-math";

describe("dailyGrams", () => {
  it("liefert einen plausiblen Wert fuer einen 20-kg-Hund", () => {
    const g = dailyGrams(20, "mittel");
    expect(g).toBeGreaterThan(250);
    expect(g).toBeLessThan(320);
  });

  it("steigt monoton mit dem Gewicht", () => {
    expect(dailyGrams(40)).toBeGreaterThan(dailyGrams(20));
    expect(dailyGrams(20)).toBeGreaterThan(dailyGrams(5));
  });

  it("steigt monoton mit dem Aktivitaetslevel", () => {
    expect(dailyGrams(20, "sehr_hoch")).toBeGreaterThan(dailyGrams(20, "hoch"));
    expect(dailyGrams(20, "hoch")).toBeGreaterThan(dailyGrams(20, "mittel"));
    expect(dailyGrams(20, "mittel")).toBeGreaterThan(dailyGrams(20, "niedrig"));
  });
});

describe("bagDays", () => {
  it("12 kg Sack bei 300 g/Tag = 40 Tage", () => {
    expect(bagDays(12000, 300)).toBe(40);
  });
  it("0 g/Tag -> 0 (kein Division-durch-0)", () => {
    expect(bagDays(5000, 0)).toBe(0);
  });
});

describe("monthlyEuro", () => {
  it("300 g/Tag bei 3 EUR/kg = 27 EUR/Monat (30 Tage)", () => {
    expect(monthlyEuro(300, 3)).toBe(27);
  });
});

describe("refillDueAt", () => {
  it("addiert die Sack-Reichweite in Tagen aufs Kaufdatum", () => {
    const due = refillDueAt(new Date(2026, 2, 1), 12000, 300); // 1. Maerz + 40 Tage
    expect(due.getFullYear()).toBe(2026);
    expect(due.getMonth()).toBe(3); // April
    expect(due.getDate()).toBe(10);
  });
});

describe("estimate", () => {
  it("kombiniert alles; ohne Preis kein monthlyEuro", () => {
    const e = estimate({ weightKg: 15, packageSizeG: 4000 });
    expect(e.dailyGrams).toBeGreaterThan(0);
    expect(e.bagDays).toBeGreaterThan(0);
    expect(e.monthlyEuro).toBeNull();
    expect(e.refillDueAt).toBeNull();
  });
});
