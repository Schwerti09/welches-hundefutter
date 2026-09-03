/**
 * Allergen-Eval (Roadmap 2A.8) — blockierender CI-Test gegen die ECHTE Neon-DB.
 *
 * Garantie (CLAUDE.md §4a): kein gemiedenes Protein je in den Offers.
 * Läuft nur, wenn DATABASE_URL gesetzt ist (CI mit Secret) — lokal sonst übersprungen.
 * Kein LLM nötig: der Regex-Fast-Path (parseIntent) setzt avoidProtein für diese
 * Szenarien deterministisch; getestet wird der sicherheitskritische SQL-Pfad
 * (fetchCandidates) + die zweite Sicherung.
 */
import { describe, it, expect } from "vitest";
import { parseIntent } from "./intent";
import { fetchCandidates } from "./candidates";
import { containsAnyAllergen } from "./allergens";

const RUN = !!process.env.DATABASE_URL;

const u = (content: string) => ({ role: "user", content });
const a = (content: string) => ({ role: "assistant", content });

type Scenario = {
  name: string;
  history: { role: string; content: string }[];
  message: string;
  avoid: string[]; // erwartetes avoidProtein
};

const SCENARIOS: Scenario[] = [
  {
    name: "Schäferhund + bloßes 'huhn' als Antwort auf die Allergiefrage (der Bug)",
    history: [
      u("Ich habe einen Deutscher Schäferhund, ca. 31 kg."),
      a("Wie alt ist er – Welpe, ausgewachsen oder Senior?"),
      u("ausgewachsen"),
      u("fell fällt aus"),
      a("Gibt es Allergien oder reagiert dein Schäferhund auf bestimmte Zutaten?"),
    ],
    message: "huhn",
    avoid: ["Huhn"],
  },
  { name: "'ohne Rind' für einen Labrador", history: [], message: "ich brauche was ohne Rind für meinen Labrador, ausgewachsen", avoid: ["Rind"] },
  { name: "'verträgt keinen Lachs'", history: [a("Gibt es Allergien?")], message: "er verträgt keinen Lachs", avoid: ["Lachs"] },
  { name: "explizite Hühnerallergie", history: [], message: "mein Mops hat eine Hühnerallergie, ausgewachsen", avoid: ["Huhn"] },
  { name: "zwei Allergene: Huhn + Rind", history: [], message: "allergisch gegen Huhn und allergisch gegen Rind, senior", avoid: ["Huhn", "Rind"] },
  { name: "Folgeturn 'such was ohne huhn raus'", history: [u("labrador senior"), a("Hier drei Vorschläge …")], message: "such einfach was ohne huhn raus", avoid: ["Huhn"] },
];

describe.skipIf(!RUN)("Allergen-Eval gegen echte DB (2A.8)", () => {
  for (const s of SCENARIOS) {
    it(`${s.name} → kein gemiedenes Protein in den Offers`, async () => {
      const intent = parseIntent(s.message, s.history);
      expect(new Set(intent.avoidProtein ?? [])).toEqual(new Set(s.avoid));

      const check = (offers: { brand: string; name: string; protein: string | null; type: string }[]) => {
        for (const o of offers) {
          expect(
            containsAnyAllergen(`${o.name} ${o.protein ?? ""}`, intent.avoidProtein),
            `UNSICHER: ${o.brand} ${o.name} (protein=${o.protein}) — enthält ${intent.avoidProtein?.join("/")}`,
          ).toBe(false);
          expect(o.type, `Snack als Hauptfutter: ${o.name}`).not.toBe("snack");
        }
      };

      const { offers } = await fetchCandidates(intent);
      check(offers);

      // Re-Query-Pfad (2A.3): auch die gelockerte Suche muss sicher sein.
      const relaxed = await fetchCandidates(intent, { relax: true });
      check(relaxed.offers);
    }, 25_000);
  }

  it("Referenz: dieselbe Suche OHNE Allergie liefert Treffer (Katalog nicht leer)", async () => {
    const { offers } = await fetchCandidates(parseIntent("Labrador ausgewachsen Trockenfutter", []));
    expect(offers.length).toBeGreaterThan(0);
  }, 25_000);
});
