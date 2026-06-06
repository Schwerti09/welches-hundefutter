/**
 * Verbrauchsmathematik — deterministisch, kein LLM.
 * Orientierungswerte; immer mit Hinweis "Abweichungen je nach Hund / Tierarzt befragen".
 *
 * Formel: RER = 70 × kg^0.75  (Resting Energy Requirement in kcal/Tag)
 * MER = RER × Aktivitätsfaktor (Maintenance Energy Requirement)
 * Trockenfutter enthält ~3.500–4.000 kcal/kg → 3.700 als Mittelwert
 */

export type ActivityLevel = "niedrig" | "mittel" | "hoch" | "sehr_hoch";

const ACTIVITY_FACTOR: Record<ActivityLevel, number> = {
  niedrig: 1.2,  // Couch-Hund, Kastrat, Senior
  mittel: 1.6,   // normaler Adult
  hoch: 2.0,     // aktiver Hund, viel Auslauf
  sehr_hoch: 2.5, // Arbeitshund, Sport
};

const KCAL_PER_KG_DRY = 3700;  // kcal/kg Trockenfutter (Orientierungswert)

/** RER in kcal/Tag */
function rer(weightKg: number): number {
  return 70 * Math.pow(weightKg, 0.75);
}

/** Tagesration in Gramm Trockenfutter */
export function dailyGrams(weightKg: number, activity: ActivityLevel = "mittel"): number {
  const mer = rer(weightKg) * ACTIVITY_FACTOR[activity];
  return Math.round((mer / KCAL_PER_KG_DRY) * 1000);
}

/** Wie viele Tage hält ein Sack? */
export function bagDays(packageSizeG: number, gramsPerDay: number): number {
  if (gramsPerDay <= 0) return 0;
  return Math.floor(packageSizeG / gramsPerDay);
}

/** Kosten pro Monat in Euro */
export function monthlyEuro(gramsPerDay: number, pricePerKg: number): number {
  return parseFloat(((gramsPerDay / 1000) * 30 * pricePerKg).toFixed(2));
}

/** Wann ist der Sack leer (ab Kaufdatum)? */
export function refillDueAt(purchasedAt: Date, packageSizeG: number, gramsPerDay: number): Date {
  const days = bagDays(packageSizeG, gramsPerDay);
  const d = new Date(purchasedAt);
  d.setDate(d.getDate() + days);
  return d;
}

export interface ConsumptionEstimate {
  dailyGrams: number;
  bagDays: number;
  monthlyEuro: number | null;
  refillDueAt: Date | null;
}

/** Komplett-Berechnung für ein Hund×Futter-Paar. */
export function estimate(opts: {
  weightKg: number;
  activity?: ActivityLevel;
  packageSizeG?: number;
  pricePerKg?: number;
  lastPurchaseAt?: Date;
}): ConsumptionEstimate {
  const dg = dailyGrams(opts.weightKg, opts.activity ?? "mittel");
  const bd = opts.packageSizeG ? bagDays(opts.packageSizeG, dg) : 0;
  const me = opts.pricePerKg != null ? monthlyEuro(dg, opts.pricePerKg) : null;
  const rd = opts.lastPurchaseAt && opts.packageSizeG
    ? refillDueAt(opts.lastPurchaseAt, opts.packageSizeG, dg)
    : null;
  return { dailyGrams: dg, bagDays: bd, monthlyEuro: me, refillDueAt: rd };
}
