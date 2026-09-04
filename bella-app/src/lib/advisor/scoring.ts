/**
 * Passungs-Score Hund × Futter — deterministisch, im Code (nicht im LLM).
 * Aus src/app/api/advisor/chat/route.ts ausgelagert (Roadmap Op 1.4), damit testbar.
 * Verhalten unverändert. Der harte Allergen-Ausschluss passiert VOR dem Scoring
 * in route.ts (fetchCandidates), nicht hier.
 */

import type { DogIntent } from "./intent";

// AGENTS.md §57: Score-Formel ist versioniert. Bei Änderung an den Gewichtungen
// unten muss diese Version erhöht und der Effekt auf golden cases geprüft werden.
export const BELLA_SCORE_VERSION = "v1";

// AGENTS.md §13: jede Empfehlung muss intern auf eine strukturierte Reason-Liste
// zurückführbar sein, nicht nur auf einen freien Text.
export interface ScoreReason {
  type: "food_type" | "life_stage" | "sensitivity" | "grain_free" | "protein" | "price" | "rating";
  result: "pass" | "penalty";
  label: string;
  evidence?: string | number;
}

export interface DogFoodRow {
  id: string;
  slug: string;
  brand: string;
  name: string;
  type: string;
  protein: string | null;
  is_grain_free: boolean;
  is_hypoallergenic: boolean;
  price_per_kg: string | null;
  price: string | null;
  suitable_for: string[] | null;
  image_url: string | null;
  affiliate_url: string;
  rating: string | null;
  score: number | null;
}

export interface ScoredFood extends DogFoodRow {
  matchScore: number;
  whyThis: string;
  reasons: ScoreReason[];
  scoreVersion: string;
}

export function scoreFood(o: DogFoodRow, intent: DogIntent): ScoredFood {
  let m = 55;
  const ppk = o.price_per_kg != null ? parseFloat(o.price_per_kg) : null;
  const reasons: ScoreReason[] = [];

  if (intent.foodType && o.type === intent.foodType) {
    m += 14;
    reasons.push({ type: "food_type", result: "pass", label: `Futterart ${intent.foodType}`, evidence: o.type });
  }
  if (intent.lifePhase && (o.suitable_for ?? []).includes(intent.lifePhase)) {
    m += 14;
    reasons.push({ type: "life_stage", result: "pass", label: `für ${intent.lifePhase}`, evidence: intent.lifePhase });
  }
  if (intent.sensitive && (o.is_hypoallergenic || o.is_grain_free)) {
    m += 16;
    reasons.push({
      type: "sensitivity", result: "pass",
      label: o.is_grain_free ? "getreidefrei" : "hypoallergen",
      evidence: o.is_grain_free ? "grain_free" : "hypoallergenic",
    });
  }
  if (intent.grainFree && o.is_grain_free) {
    m += 6;
    reasons.push({ type: "grain_free", result: "pass", label: "getreidefrei", evidence: "grain_free" });
  }
  if (intent.protein && !intent.sensitive && (o.protein ?? "").toLowerCase().includes(intent.protein.toLowerCase())) {
    m += 12;
    reasons.push({ type: "protein", result: "pass", label: `${o.protein}`, evidence: o.protein ?? undefined });
  }
  if (intent.maxPricePerKg && ppk != null) {
    if (ppk <= intent.maxPricePerKg * 0.85) {
      m += 12;
      reasons.push({ type: "price", result: "pass", label: `günstig (${ppk.toFixed(2)} €/kg)`, evidence: ppk });
    } else if (ppk <= intent.maxPricePerKg) {
      m += 6;
    } else {
      m -= 12;
      reasons.push({ type: "price", result: "penalty", label: `über Budget (${ppk.toFixed(2)} €/kg)`, evidence: ppk });
    }
  }
  if (o.rating != null && parseFloat(o.rating) >= 4) {
    m += 4;
    reasons.push({ type: "rating", result: "pass", label: `gut bewertet (${parseFloat(o.rating).toFixed(1)}★)`, evidence: o.rating });
  }
  m = Math.max(20, Math.min(99, m));

  const passLabels = reasons.filter(r => r.result === "pass").map(r => r.label);
  const base = passLabels.length
    ? `Passt: ${passLabels.join(", ")}.`
    : ppk != null
      ? `Solides ${o.type}-Futter${o.protein ? ` mit ${o.protein}` : ""} für ${ppk.toFixed(2)} €/kg.`
      : `${o.type}-Futter${o.protein ? ` mit ${o.protein}` : ""} von ${o.brand}.`;

  return { ...o, matchScore: m, whyThis: base, reasons, scoreVersion: BELLA_SCORE_VERSION };
}
