/**
 * Advisor-Eval — strukturell, deterministisch (Roadmap 2.4).
 * Kein LLM: prüft parseIntent + fetchCandidates gegen harte Constraints.
 * Läuft nur mit DATABASE_URL (CI-Secret) — sonst übersprungen.
 * Die Allergen-Fälle stehen separat in `allergen-eval.test.ts`.
 */
import { describe, it, expect } from "vitest";
import { parseIntent, hasEnoughIntent } from "./intent";
import { fetchCandidates } from "./candidates";

const RUN = !!process.env.DATABASE_URL;
const u = (content: string) => ({ role: "user", content });
const a = (content: string) => ({ role: "assistant", content });

describe.skipIf(!RUN)("Advisor-Eval strukturell (2.4)", () => {
  it("Budget: jedes Offer mit €/kg-Preis liegt im Budget", async () => {
    const intent = parseIntent("Labrador ausgewachsen, maximal 4 €/kg bitte", []);
    expect(intent.maxPricePerKg).toBe(4);
    const { offers } = await fetchCandidates(intent);
    for (const o of offers) {
      if (o.price_per_kg != null) {
        expect(parseFloat(o.price_per_kg), `${o.brand} ${o.name}`).toBeLessThanOrEqual(4);
      }
    }
  }, 25_000);

  it("Futtertyp BARF: jedes Offer ist type=barf", async () => {
    const intent = parseIntent("wir wollen barfen, Border Collie erwachsen", []);
    expect(intent.foodType).toBe("barf");
    const { offers } = await fetchCandidates(intent);
    for (const o of offers) expect(o.type, `${o.brand} ${o.name}`).toBe("barf");
  }, 25_000);

  it("Futtertyp Nass: jedes Offer ist type=nass", async () => {
    const intent = parseIntent("Nassfutter für meinen Mops, ausgewachsen", []);
    expect(intent.foodType).toBe("nass");
    const { offers } = await fetchCandidates(intent);
    for (const o of offers) expect(o.type).toBe("nass");
  }, 25_000);

  it("nie ein Snack als Hauptfutter-Empfehlung", async () => {
    const { offers } = await fetchCandidates(parseIntent("irgendwas gutes für meinen Hund, erwachsen", []));
    for (const o of offers) expect(o.type).not.toBe("snack");
  }, 25_000);

  it("Senior: kein reines Welpen-Produkt in den Offers", async () => {
    const intent = parseIntent("mein Labrador ist 11 Jahre alt, Senior", []);
    expect(intent.lifePhase).toBe("senior");
    const { offers } = await fetchCandidates(intent);
    for (const o of offers) {
      const sf = o.suitable_for ?? [];
      const welpenOnly = sf.includes("welpen") && !sf.some(x => x === "adult" || x === "senior");
      expect(welpenOnly, `${o.brand} ${o.name} (${sf.join("/")})`).toBe(false);
    }
  }, 25_000);

  it("Re-Query (relax) liefert nie WENIGER Sicherheit — nur weichere Filter", async () => {
    // Enges Budget + BARF → evtl. leer; relax lässt Budget/Typ fallen, Rest bleibt.
    const intent = parseIntent("BARF, aber maximal 2 €/kg, Chihuahua senior", []);
    const strict = await fetchCandidates(intent);
    const relaxed = await fetchCandidates(intent, { relax: true });
    expect(relaxed.offers.length).toBeGreaterThanOrEqual(strict.offers.length);
    for (const o of relaxed.offers) expect(o.type).not.toBe("snack");
  }, 30_000);

  it("Referenz: Standard-Anfrage liefert 1–3 Offers", async () => {
    const { offers } = await fetchCandidates(parseIntent("Trockenfutter für einen erwachsenen Beagle", []));
    expect(offers.length).toBeGreaterThan(0);
    expect(offers.length).toBeLessThanOrEqual(3);
  }, 25_000);
});

describe("Advisor-Eval: Gesprächslogik (ohne DB)", () => {
  it("erster Turn ohne Infos → nachfragen (ask)", () => {
    expect(hasEnoughIntent(parseIntent("Hallo", []), [])).toBe(false);
  });

  it("4 User-Turns → spätestens jetzt empfehlen", () => {
    const hist = [u("Labrador"), a("Wie alt?"), u("erwachsen"), a("Futter?"), u("trocken")];
    expect(hasEnoughIntent(parseIntent("günstig bitte", hist), hist)).toBe(true);
  });

  it("Rasse + Lebensphase + Allergen in einem Turn → genug für Empfehlung", () => {
    const i = parseIntent("Deutsche Dogge Welpe mit Hühnerallergie", []);
    expect(i.breedSlug).toBe("deutsche-dogge");
    expect(i.lifePhase).toBe("welpen");
    expect(i.avoidProtein).toEqual(["Huhn"]);
    expect(hasEnoughIntent(i, [])).toBe(true);
  });

  it("Wechselgrund 'mag nicht' wird erkannt", () => {
    const i = parseIntent("mein Hund frisst sein Trockenfutter nicht mehr, erwachsener Boxer", []);
    expect(i.switchReason).toBe("mag nicht");
    expect(i.currentFood).toBeTruthy();
  });
});
