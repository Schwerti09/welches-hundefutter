/**
 * Zod-Schema für DogIntent — validiert die Ausgabe der LLM-Intent-Extraktion
 * (Roadmap Op 2.1), bevor sie mit dem Regex-Fast-Path gemerged wird.
 */
import { z } from "zod";

export const foodTypeSchema = z.enum(["trocken", "nass", "barf", "snack", "kaltgepresst"]);
export const lifePhaseSchema = z.enum(["welpen", "adult", "senior"]);

export const dogIntentSchema = z.object({
  foodType: foodTypeSchema.optional(),
  lifePhase: lifePhaseSchema.optional(),
  sensitive: z.boolean().optional(),
  grainFree: z.boolean().optional(),
  protein: z.string().max(40).optional(),
  breed: z.string().max(80).optional(),
  breedSlug: z.string().max(80).optional(),
  maxPricePerKg: z.number().positive().max(200).optional(),
  currentFood: z.string().max(80).optional(),
  wantToSwitch: z.boolean().optional(),
  switchReason: z.string().max(60).optional(),
}).strict();

export type DogIntentParsed = z.infer<typeof dogIntentSchema>;

/** Verträglich parsen: unbekannte Felder / falsche Typen werden verworfen, nie geworfen. */
export function coerceIntent(raw: unknown): Partial<DogIntentParsed> {
  if (!raw || typeof raw !== "object") return {};
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (v === null || v === undefined || v === "") continue;
    out[k] = v;
  }
  const res = dogIntentSchema.partial().safeParse(out);
  return res.success ? res.data : {};
}
