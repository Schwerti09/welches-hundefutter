import { describe, it, expect } from "vitest";
import { parseIntent, hasEnoughIntent, classifyTheme, computeConfidence } from "./intent";

const u = (content: string) => ({ role: "user", content });

describe("parseIntent — Allergen-Sicherheit", () => {
  it("erkennt Hühnerallergie als Protein=Huhn + sensitive", () => {
    const i = parseIntent("Mein Hund hat eine Hühnerallergie", []);
    expect(i.protein).toBe("Huhn");
    expect(i.sensitive).toBe(true);
  });

  it("funktioniert auch mit NFD-zerlegten Umlauten (iOS)", () => {
    // "Hühnerallergie" mit kombinierendem Diaeresis (u + U+0308)
    const i = parseIntent("Hühnerallergie", []);
    expect(i.protein).toBe("Huhn");
    expect(i.sensitive).toBe(true);
  });

  it("Getreide-Wunsch impliziert sensitive", () => {
    const i = parseIntent("bitte getreidefrei", []);
    expect(i.grainFree).toBe(true);
    expect(i.sensitive).toBe(true);
  });
});

describe("parseIntent — Basics", () => {
  it("Budget: 'unter 5€/kg' -> 5", () => {
    expect(parseIntent("was unter 5€/kg", []).maxPricePerKg).toBe(5);
  });
  it("Budget: vage 'günstig' -> 6", () => {
    expect(parseIntent("hätte gern was günstiges", []).maxPricePerKg).toBe(6);
  });
  it("Lebensphase Welpe", () => {
    expect(parseIntent("noch ein Welpe", []).lifePhase).toBe("welpen");
  });
  it("Futtertyp BARF", () => {
    expect(parseIntent("wir barfen", []).foodType).toBe("barf");
  });
  it("Rasse Labrador", () => {
    expect(parseIntent("ein Labrador, 3 Jahre", []).breed).toBeTruthy();
  });
  it("aktuelles Futter + Wechselabsicht", () => {
    const i = parseIntent("er frisst aktuell Wolfsblut", []);
    expect(i.currentFood).toBe("wolfsblut");
    expect(i.wantToSwitch).toBe(true);
  });

  it("ignoriert Assistenten-Turns (kein Fehl-Trigger durch Rückfragen)", () => {
    const i = parseIntent("ja", [{ role: "assistant", content: "Ist dein Hund ein Welpe oder Senior?" }]);
    expect(i.lifePhase).toBeUndefined();
  });
});

describe("hasEnoughIntent", () => {
  it("false bei leerem Intent im ersten Turn", () => {
    expect(hasEnoughIntent({}, [])).toBe(false);
  });
  it("true ab 4 Signalen", () => {
    expect(hasEnoughIntent(
      { lifePhase: "adult", foodType: "trocken", sensitive: true, maxPricePerKg: 5 }, [],
    )).toBe(true);
  });
  it("true nach 4 User-Turns (Fallback, nie endlos fragen)", () => {
    expect(hasEnoughIntent({}, [u("a"), u("b"), u("c")])).toBe(true);
  });
});

describe("classifyTheme", () => {
  it.each([
    [{ sensitive: true }, "allergie"],
    [{ lifePhase: "welpen" as const }, "welpe"],
    [{ lifePhase: "senior" as const }, "senior"],
    [{ foodType: "barf" as const }, "barf"],
    [{ maxPricePerKg: 5 }, "budget"],
    [{}, "idle"],
  ])("%o -> %s", (intent, expected) => {
    expect(classifyTheme(intent)).toBe(expected);
  });
});

describe("computeConfidence", () => {
  it("steigt mit mehr Signalen, gedeckelt bei 98", () => {
    const low = computeConfidence({}, []);
    const high = computeConfidence(
      { lifePhase: "adult", foodType: "trocken", sensitive: true, protein: "Lachs", maxPricePerKg: 5, breed: "labrador", currentFood: "bosch", wantToSwitch: true },
      [{ content: "x" }, { content: "y" }, { content: "z" }, { content: "w" }, { content: "v" }],
    );
    expect(high).toBeGreaterThan(low);
    expect(high).toBeLessThanOrEqual(98);
  });
});
