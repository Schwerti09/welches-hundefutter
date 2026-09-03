/**
 * Merge Regex-Fast-Path ⊕ LLM-Intent (Roadmap Op 2.1).
 *
 * Regeln:
 * - Der Fast-Path (deterministisch) gewinnt, wo er einen Wert hat.
 * - Der LLM-Pfad füllt nur Lücken.
 * - Sicherheitssignale werden NIE verloren: `sensitive` / `grainFree` sind ein
 *   ODER beider Quellen. Ein Allergie-Hinweis aus einer Quelle bleibt.
 */
import type { DogIntent } from "./intent";

export function mergeIntent(fast: DogIntent, llm: Partial<DogIntent>): DogIntent {
  const out: DogIntent = { ...llm, ...fast };

  // Sicherheit: OR statt Override.
  if (fast.sensitive || llm.sensitive) out.sensitive = true;
  if (fast.grainFree || llm.grainFree) out.grainFree = true;

  // Protein: Fast-Path zuerst (regex ist konservativ & allergen-bewusst),
  // sonst LLM. Wenn eine Seite ein Allergen kennt und sensitive gesetzt ist,
  // niemals auf undefined zurückfallen.
  out.protein = fast.protein ?? llm.protein;
  if (out.sensitive && !out.protein && llm.protein) out.protein = llm.protein;

  // Budget: der niedrigere (strengere) Wert gewinnt, wenn beide da sind.
  if (fast.maxPricePerKg != null && llm.maxPricePerKg != null) {
    out.maxPricePerKg = Math.min(fast.maxPricePerKg, llm.maxPricePerKg);
  } else {
    out.maxPricePerKg = fast.maxPricePerKg ?? llm.maxPricePerKg;
  }

  // wantToSwitch impliziert sich aus currentFood (wie im Fast-Path).
  if (out.currentFood && out.wantToSwitch == null) out.wantToSwitch = true;

  return out;
}
