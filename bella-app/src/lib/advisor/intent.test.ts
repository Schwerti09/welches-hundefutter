import { describe, it, expect } from "vitest";
import { parseIntent, hasEnoughIntent, classifyTheme, computeConfidence } from "./intent";

const u = (content: string) => ({ role: "user", content });
const a = (content: string) => ({ role: "assistant", content });

describe("parseIntent — Allergen-Sicherheit (2A.1)", () => {
  it("'Hühnerallergie' -> avoidProtein=[Huhn], sensitive, NICHT protein", () => {
    const i = parseIntent("Mein Hund hat eine Hühnerallergie", []);
    expect(i.avoidProtein).toEqual(["Huhn"]);
    expect(i.sensitive).toBe(true);
    expect(i.protein).toBeUndefined();
  });

  it("NFD-zerlegte Umlaute (iOS): 'Hühnerallergie' -> avoidProtein=[Huhn]", () => {
    const i = parseIntent("Hühnerallergie", []);
    expect(i.avoidProtein).toEqual(["Huhn"]);
    expect(i.sensitive).toBe(true);
  });

  it("DER TRANSKRIPT-FALL: bloßes 'huhn' als Antwort auf die Allergiefrage", () => {
    const history = [
      u("Ich habe einen Deutscher Schäferhund, ca. 31 kg."),
      a("Wie alt ist er ungefähr – Welpe, ausgewachsen oder Senior?"),
      u("ausgewachsen"),
      a("Was frisst dein Schäferhund aktuell, und warum möchtest du wechseln?"),
      u("fell fällt aus"),
      a("Gibt es Allergien oder reagiert dein Schäferhund auf bestimmte Zutaten?"),
    ];
    const i = parseIntent("huhn", history);
    expect(i.avoidProtein).toEqual(["Huhn"]);
    expect(i.sensitive).toBe(true);
    expect(i.protein).toBeUndefined(); // NIE als Wunsch-Protein
    expect(i.lifePhase).toBe("adult");
    expect(i.breedSlug).toBe("deutscher-schaeferhund");
  });

  it("Symptom 'fell fällt aus' allein -> sensitive (noch kein Allergen)", () => {
    const i = parseIntent("fell fällt aus", []);
    expect(i.sensitive).toBe(true);
    expect(i.avoidProtein).toBeUndefined();
  });

  it("'ohne Rind bitte' -> avoidProtein=[Rind]", () => {
    expect(parseIntent("ich hätte gern was ohne Rind", []).avoidProtein).toEqual(["Rind"]);
  });

  it("'verträgt keinen Lachs' -> avoidProtein=[Lachs]", () => {
    expect(parseIntent("er verträgt keinen Lachs", []).avoidProtein).toEqual(["Lachs"]);
  });

  it("'allergisch gegen Huhn ... gegen Rind' -> beide gemieden", () => {
    const i = parseIntent("allergisch gegen Huhn und allergisch gegen Rind", []);
    expect(i.avoidProtein).toEqual(expect.arrayContaining(["Huhn", "Rind"]));
  });

  it("bloßes 'lachs' OHNE vorherige Allergiefrage bleibt Wunsch-Protein", () => {
    const i = parseIntent("am liebsten mit Lachs", []);
    expect(i.protein).toBe("Lachs");
    expect(i.avoidProtein).toBeUndefined();
  });

  it("Getreide-Allergie -> grainFree + sensitive", () => {
    const i = parseIntent("hat eine Getreideallergie", []);
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
      { lifePhase: "adult", foodType: "trocken", sensitive: true, avoidProtein: ["Huhn"], maxPricePerKg: 5, breed: "labrador", currentFood: "bosch", wantToSwitch: true },
      [{ content: "x" }, { content: "y" }, { content: "z" }, { content: "w" }, { content: "v" }],
    );
    expect(high).toBeGreaterThan(low);
    expect(high).toBeLessThanOrEqual(98);
  });
});
