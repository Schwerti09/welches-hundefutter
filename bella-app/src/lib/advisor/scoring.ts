/**
 * Passungs-Score Hund × Futter — deterministisch, im Code (nicht im LLM).
 * Aus src/app/api/advisor/chat/route.ts ausgelagert (Roadmap Op 1.4), damit testbar.
 * Verhalten unverändert. Der harte Allergen-Ausschluss passiert VOR dem Scoring
 * in route.ts (fetchCandidates), nicht hier.
 */

import type { DogIntent } from "./intent";

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
}

export function scoreFood(o: DogFoodRow, intent: DogIntent): ScoredFood {
  let m = 55;
  const ppk = o.price_per_kg != null ? parseFloat(o.price_per_kg) : null;
  const reasons: string[] = [];

  if (intent.foodType && o.type === intent.foodType) { m += 14; }
  if (intent.lifePhase && (o.suitable_for ?? []).includes(intent.lifePhase)) { m += 14; reasons.push(`für ${intent.lifePhase}`); }
  if (intent.sensitive && (o.is_hypoallergenic || o.is_grain_free)) { m += 16; reasons.push(o.is_grain_free ? "getreidefrei" : "hypoallergen"); }
  if (intent.grainFree && o.is_grain_free) m += 6;
  if (intent.protein && !intent.sensitive && (o.protein ?? "").toLowerCase().includes(intent.protein.toLowerCase())) { m += 12; reasons.push(`${o.protein}`); }
  if (intent.maxPricePerKg && ppk != null) {
    if (ppk <= intent.maxPricePerKg * 0.85) { m += 12; reasons.push(`günstig (${ppk.toFixed(2)} €/kg)`); }
    else if (ppk <= intent.maxPricePerKg) { m += 6; }
    else m -= 12;
  }
  if (o.rating != null && parseFloat(o.rating) >= 4) m += 4;
  m = Math.max(20, Math.min(99, m));

  const base = reasons.length
    ? `Passt: ${reasons.join(", ")}.`
    : ppk != null
      ? `Solides ${o.type}-Futter${o.protein ? ` mit ${o.protein}` : ""} für ${ppk.toFixed(2)} €/kg.`
      : `${o.type}-Futter${o.protein ? ` mit ${o.protein}` : ""} von ${o.brand}.`;

  return { ...o, matchScore: m, whyThis: base };
}
