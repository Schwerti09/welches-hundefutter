import { describe, it, expect } from "vitest";
import { mergeIntent } from "./merge";
import type { DogIntent } from "./intent";

describe("mergeIntent", () => {
  it("Fast-Path gewinnt, LLM füllt Lücken", () => {
    const fast: DogIntent = { lifePhase: "senior" };
    const llm = { lifePhase: "adult" as const, foodType: "nass" as const, breed: "Beagle" };
    const m = mergeIntent(fast, llm);
    expect(m.lifePhase).toBe("senior"); // fast wins
    expect(m.foodType).toBe("nass"); // llm fills
    expect(m.breed).toBe("Beagle");
  });

  it("Sicherheit: sensitive ist ein ODER — geht nie verloren", () => {
    expect(mergeIntent({ sensitive: true }, {}).sensitive).toBe(true);
    expect(mergeIntent({}, { sensitive: true }).sensitive).toBe(true);
    expect(mergeIntent({ sensitive: false }, { sensitive: true }).sensitive).toBe(true);
  });

  it("Allergen: wenn sensitive gesetzt und nur LLM das Protein kennt, bleibt es erhalten", () => {
    const m = mergeIntent({ sensitive: true }, { protein: "Huhn" });
    expect(m.sensitive).toBe(true);
    expect(m.protein).toBe("Huhn");
  });

  it("Fast-Path-Protein hat Vorrang vor LLM-Protein", () => {
    expect(mergeIntent({ protein: "Rind" }, { protein: "Huhn" }).protein).toBe("Rind");
  });

  it("Budget: der strengere (niedrigere) Wert gewinnt", () => {
    expect(mergeIntent({ maxPricePerKg: 8 }, { maxPricePerKg: 5 }).maxPricePerKg).toBe(5);
    expect(mergeIntent({}, { maxPricePerKg: 7 }).maxPricePerKg).toBe(7);
  });

  it("currentFood impliziert wantToSwitch", () => {
    expect(mergeIntent({}, { currentFood: "bosch" }).wantToSwitch).toBe(true);
  });
});
