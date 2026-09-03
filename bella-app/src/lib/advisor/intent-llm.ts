/**
 * LLM-gestützte Intent-Extraktion (Roadmap Op 2.1) — Gemini 2.5 Flash im
 * JSON-Modus (responseSchema). Ergänzt den Regex-Fast-Path bei natürlicher
 * Sprache, die die Regex nicht trifft.
 *
 * Defensiv: hartes Timeout, jeder Fehler → {} (nie werfen), env-abschaltbar
 * (ADVISOR_LLM_INTENT=0). Der Aufrufer merged mit `mergeIntent` — Sicherheits-
 * signale können dadurch nie verloren gehen.
 */
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import type { DogIntent } from "./intent";
import { coerceIntent } from "./schema";

const TIMEOUT_MS = 4000;

const RESPONSE_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    foodType: { type: SchemaType.STRING, enum: ["trocken", "nass", "barf", "snack", "kaltgepresst"], nullable: true },
    lifePhase: { type: SchemaType.STRING, enum: ["welpen", "adult", "senior"], nullable: true },
    sensitive: { type: SchemaType.BOOLEAN, nullable: true },
    grainFree: { type: SchemaType.BOOLEAN, nullable: true },
    protein: { type: SchemaType.STRING, nullable: true, description: "Genanntes Allergen ODER Wunsch-Protein, ein Wort: Huhn/Rind/Lachs/Lamm/Ente/Pute/Wild/Fisch/Kaninchen/Pferd" },
    currentFood: { type: SchemaType.STRING, nullable: true, description: "Marke des aktuellen Futters, oder 'bekannt' wenn erwähnt ohne Marke" },
    maxPricePerKg: { type: SchemaType.NUMBER, nullable: true, description: "genanntes Budget in Euro pro kg" },
    wantToSwitch: { type: SchemaType.BOOLEAN, nullable: true },
    switchReason: { type: SchemaType.STRING, nullable: true, enum: ["vertraegt nicht", "mag nicht", "teuer", "optimieren"] },
  },
} as const;

const SYSTEM = `Du extrahierst strukturierte Fakten über EINEN Hund aus einem Beratungsgespräch.
Nutze NUR, was der Halter (user) wirklich gesagt hat — nichts erraten, nichts aus BELLAs Rückfragen übernehmen.
"protein" NUR setzen, wenn ein konkretes Tier genannt wurde (als Allergie ODER Wunsch). Bei Allergie/Unverträglichkeit/empfindlichem Magen zusätzlich sensitive=true.
Unbekanntes Feld: weglassen bzw. null.`;

export function llmIntentEnabled(): boolean {
  return !!process.env.GEMINI_API_KEY && process.env.ADVISOR_LLM_INTENT !== "0";
}

export async function extractIntentLLM(
  message: string,
  history: { role: string; content: string }[],
): Promise<Partial<DogIntent>> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return {};

  const convo = [
    ...history.filter(h => h.role === "user").map(h => `Halter: ${h.content}`),
    `Halter: ${message}`,
  ].join("\n").slice(0, 4000);

  try {
    const genAI = new GoogleGenerativeAI(key);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const generationConfig: any = {
      temperature: 0,
      maxOutputTokens: 400,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
      thinkingConfig: { thinkingBudget: 0 },
    };
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM,
      generationConfig,
    });

    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    let text: string;
    try {
      const res = await model.generateContent(
        { contents: [{ role: "user", parts: [{ text: convo }] }] },
        { signal: ctrl.signal },
      );
      text = res.response.text();
    } finally {
      clearTimeout(t);
    }

    return coerceIntent(JSON.parse(text)) as Partial<DogIntent>;
  } catch {
    return {};
  }
}
