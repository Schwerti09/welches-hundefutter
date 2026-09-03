import { describe, it, expect } from "vitest";
import { issueToProblemSlug, issuesToProblemSlugs } from "./issue-to-problem";

describe("issueToProblemSlug", () => {
  it.each([
    ["Hüftdysplasie", "gelenkprobleme"],
    ["Ellenbogendysplasie", "gelenkprobleme"],
    ["Arthrose", "arthrose"],
    ["Futtermittelallergie", "allergie"],
    ["Übergewicht", "uebergewicht"],
    ["Zahnstein", "zahnsteine"],
    ["Niereninsuffizienz", "nierenprobleme"],
    ["chronischer Durchfall", "durchfall"],
  ])("%s -> %s", (input, expected) => {
    expect(issueToProblemSlug(input)).toBe(expected);
  });

  it("gibt null bei unbekanntem Thema", () => {
    expect(issueToProblemSlug("Schilddrüsenunterfunktion")).toBeNull();
  });

  it("ist robust gegen Mojibake-Umlaute", () => {
    expect(issueToProblemSlug("HÃ¼ftdysplasie")).toBe("gelenkprobleme");
  });
});

describe("issuesToProblemSlugs", () => {
  it("dedupliziert und behaelt die Reihenfolge", () => {
    expect(issuesToProblemSlugs(["Arthrose", "arthrose", "Allergie", "Kupierohr"]))
      .toEqual(["arthrose", "allergie"]);
  });
});
