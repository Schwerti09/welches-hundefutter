import { describe, it, expect } from "vitest";
import { matchBreed, BREED_INDEX_SIZE } from "./breed-match";

describe("matchBreed", () => {
  it("erkennt den kanonischen Namen und Slug", () => {
    expect(matchBreed("ich habe einen Labrador")).toEqual({ slug: "labrador-retriever", name: "Labrador Retriever" });
  });

  it("erkennt alternative Namen (Frenchie)", () => {
    const m = matchBreed("unser Frenchie hat Hautprobleme");
    expect(m?.slug).toBe("franzoesische-bulldogge");
  });

  it("bevorzugt den längeren Match (Australian Shepherd, nicht Shepherd)", () => {
    const m = matchBreed("Australian Shepherd, 2 Jahre");
    expect(m?.slug).toBe("australian-shepherd");
  });

  it("matcht auch mit deutschem Umlaut / Flexion", () => {
    expect(matchBreed("mein Schäferhund")?.slug).toContain("schaeferhund");
    expect(matchBreed("zwei Labradore")?.slug).toBe("labrador-retriever");
  });

  it("gibt null ohne Rasse", () => {
    expect(matchBreed("mein Hund ist ein Mischling vom Tierschutz")).toBeTruthy(); // "mischling" ist eine Rasse
    expect(matchBreed("einfach nur ein Hund")).toBeNull();
  });

  it("Index deckt alle ~185 Rassen ab (mind. so viele Einträge)", () => {
    expect(BREED_INDEX_SIZE).toBeGreaterThan(180);
  });
});
