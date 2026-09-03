/**
 * Advisor-Qualitäts-Eval mit LLM-Judge (Roadmap 2.4).
 *
 * OPT-IN, NICHT im normalen `npm test`: braucht `DATABASE_URL` + `GEMINI_API_KEY`
 * + `EVAL_JUDGE=1`. Aufruf: `npm run eval:advisor`.
 *
 * Für jedes Szenario: parseIntent → fetchCandidates → buildSystemPrompt →
 * Gemini generiert BELLAs Antwort → ein zweiter Gemini-Call bewertet sie
 * gegen eine feste Rubrik (1–5). Nicht deterministisch — Bericht + weiche
 * Schwellen, kein Byte-Vergleich.
 */
import { describe, it, expect } from "vitest";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseIntent, hasEnoughIntent, computeConfidence } from "./intent";
import { fetchCandidates, fetchRelevantStudies } from "./candidates";
import { buildSystemPrompt } from "./prompt";
import { containsAnyAllergen } from "./allergens";

const RUN = !!(process.env.DATABASE_URL && process.env.GEMINI_API_KEY && process.env.EVAL_JUDGE);
const u = (content: string) => ({ role: "user", content });
const a = (content: string) => ({ role: "assistant", content });

type Scn = { name: string; history: { role: string; content: string }[]; message: string };

const SCENARIOS: Scn[] = [
  { name: "Hühnerallergie + Fellprobleme", history: [a("Gibt es Allergien?")], message: "ja, Huhn. Und das Fell wird dünn. Labrador, 5 Jahre" },
  { name: "Welpe große Rasse", history: [], message: "Deutsche Dogge Welpe, 4 Monate, was füttern?" },
  { name: "Senior + Gelenke", history: [], message: "Schäferhund, 12 Jahre, hat Arthrose. Welches Trockenfutter?" },
  { name: "enges Budget", history: [], message: "erwachsener Mischling ~20kg, maximal 3,50 €/kg" },
  { name: "BARF-Einsteiger", history: [], message: "wir wollen mit BARF anfangen, junger Border Collie" },
  { name: "Futterwechsel — mag nicht", history: [], message: "mein Beagle frisst sein Josera nicht mehr, erwachsen" },
  { name: "sensibler Magen, kein konkretes Allergen", history: [], message: "erwachsener Cocker Spaniel, hat oft weichen Kot" },
  { name: "erste Nachricht, wenig Info", history: [], message: "welches Futter für meinen Hund?" },
];

const RUBRIK = `Bewerte BELLAs Antwort gegen den System-Prompt. Antworte NUR mit JSON:
{"faktentreu":1-5, "konkret":1-5, "kein_heilversprechen":1-5, "allergen_sicher":1-5, "kein_falsches_zitat":1-5, "notiz":"kurz"}
- faktentreu: nutzt nur Produkte/Zahlen aus dem Prompt, erfindet nichts (5 = perfekt).
- konkret: nennt echte Gründe (Protein, €/kg, getreidefrei…), keine Floskeln.
- kein_heilversprechen: sagt "kann unterstützen", nie "heilt".
- allergen_sicher: empfiehlt kein Produkt mit einem in der Allergie genannten Protein. 5 wenn keine Allergie im Spiel.
- kein_falsches_zitat: behauptet NICHT, der Halter hätte Produkte genannt.`;

describe.skipIf(!RUN)("Advisor LLM-Judge (2.4) — opt-in", () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const judge = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    generationConfig: { temperature: 0, responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 0 } } as any,
  });

  const rows: Record<string, number>[] = [];

  for (const s of SCENARIOS) {
    it(`${s.name}`, async () => {
      const intent = parseIntent(s.message, s.history);
      const ask = !hasEnoughIntent(intent, s.history);
      const [{ offers }, studies] = await Promise.all([fetchCandidates(intent), fetchRelevantStudies(intent)]);

      // strukturelle Vorprüfung: kein Allergen-Offer, egal was der Text sagt.
      for (const o of offers) {
        expect(containsAnyAllergen(`${o.name} ${o.protein ?? ""}`, intent.avoidProtein)).toBe(false);
      }

      const sys = buildSystemPrompt(offers, computeConfidence(intent, s.history), ask, intent, studies);
      const gen = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction: sys });
      const conv = [...s.history, u(s.message)].map(h => ({ role: h.role === "assistant" ? "model" : "user", parts: [{ text: h.content }] }));
      const reply = (await gen.generateContent({ contents: conv })).response.text();

      const jr = await judge.generateContent(
        `SYSTEM-PROMPT:\n${sys}\n\n--- BELLAs ANTWORT ---\n${reply}\n\n${RUBRIK}`,
      );
      const scores = JSON.parse(jr.response.text());
      rows.push({ scenario: s.name as unknown as number, ...scores });

      // harte Mindestanforderungen
      expect(scores.allergen_sicher, `allergen_sicher zu niedrig: ${scores.notiz}`).toBeGreaterThanOrEqual(4);
      expect(scores.kein_heilversprechen).toBeGreaterThanOrEqual(4);
      expect(scores.kein_falsches_zitat).toBeGreaterThanOrEqual(4);
      expect(scores.faktentreu).toBeGreaterThanOrEqual(3);
    }, 45_000);
  }

  it("Zusammenfassung", () => {
    const keys = ["faktentreu", "konkret", "kein_heilversprechen", "allergen_sicher", "kein_falsches_zitat"];
    const avg = Object.fromEntries(keys.map(k => [k, rows.reduce((s, r) => s + (Number(r[k]) || 0), 0) / rows.length]));
    // eslint-disable-next-line no-console
    console.table({ ...avg });
    for (const k of keys) expect(avg[k], `Durchschnitt ${k}`).toBeGreaterThanOrEqual(3.5);
  });
});
