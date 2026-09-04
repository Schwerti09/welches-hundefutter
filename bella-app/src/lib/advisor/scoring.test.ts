import { describe, it, expect } from "vitest";
import { scoreFood, BELLA_SCORE_VERSION, type DogFoodRow } from "./scoring";

function food(over: Partial<DogFoodRow> = {}): DogFoodRow {
  return {
    id: "1", slug: "x", brand: "Marke", name: "Produkt", type: "trocken",
    protein: "Huhn", is_grain_free: false, is_hypoallergenic: false,
    price_per_kg: "5.00", price: null, suitable_for: null, image_url: null,
    affiliate_url: "https://x", rating: null, score: null, ...over,
  };
}

describe("scoreFood", () => {
  it("Score bleibt in [20, 99]", () => {
    const s = scoreFood(food({ price_per_kg: "99.00" }), { maxPricePerKg: 3 });
    expect(s.matchScore).toBeGreaterThanOrEqual(20);
    expect(s.matchScore).toBeLessThanOrEqual(99);
  });

  it("hypoallergen wird bei Sensibilität hoch gewichtet", () => {
    const withHypo = scoreFood(food({ is_hypoallergenic: true }), { sensitive: true });
    const without = scoreFood(food({ is_hypoallergenic: false }), { sensitive: true });
    expect(withHypo.matchScore).toBeGreaterThan(without.matchScore);
  });

  it("Preis über Budget zieht Punkte ab, günstig gibt Bonus", () => {
    const cheap = scoreFood(food({ price_per_kg: "3.00" }), { maxPricePerKg: 5 });
    const overBudget = scoreFood(food({ price_per_kg: "12.00" }), { maxPricePerKg: 5 });
    expect(cheap.matchScore).toBeGreaterThan(overBudget.matchScore);
  });

  it("passende Lebensphase erhöht Score und liefert eine Begründung", () => {
    const match = scoreFood(food({ suitable_for: ["welpen"] }), { lifePhase: "welpen" });
    expect(match.matchScore).toBeGreaterThan(scoreFood(food({ suitable_for: [] }), { lifePhase: "welpen" }).matchScore);
    expect(match.whyThis).toContain("welpen");
  });

  it("liefert immer eine whyThis-Erklärung", () => {
    expect(scoreFood(food(), {}).whyThis.length).toBeGreaterThan(0);
  });

  it("liefert strukturierte, nachvollziehbare reasons (AGENTS.md §13)", () => {
    const s = scoreFood(food({ suitable_for: ["welpen"] }), { lifePhase: "welpen", maxPricePerKg: 3 });
    const lifeStage = s.reasons.find(r => r.type === "life_stage");
    expect(lifeStage).toBeDefined();
    expect(lifeStage?.result).toBe("pass");
    const priceReason = s.reasons.find(r => r.type === "price");
    expect(priceReason?.result).toBe("penalty");
  });

  it("ist mit einer BELLA_SCORE_VERSION versioniert (AGENTS.md §57)", () => {
    expect(scoreFood(food(), {}).scoreVersion).toBe(BELLA_SCORE_VERSION);
  });
});
