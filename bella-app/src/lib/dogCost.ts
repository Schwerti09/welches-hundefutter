// Geteilte Kosten-Mathematik für Lebenszeit-Rechner & Rassen-Rangliste.
// Pure Funktionen, damit Tool und Presse-Seite exakt dieselben Zahlen liefern.
//
// Rechenkette (ehrlich, nachvollziehbar):
//   RER  = 70 × kg^0,75            (Resting Energy Requirement, NRC-Standard)
//   MER  = RER × Aktivitätsfaktor  (Maintenance Energy Requirement)
//   g/Tag = MER / (kcal_pro_kg / 1000)
//   €/Tag = g/Tag / 1000 × €/kg
//   €/Leben = €/Tag × 365,25 × Lebensjahre

export const AVG_KCAL_PER_KG_DRY = 3700; // wie consumption-math.ts (Kosten-Hook)
export const ACTIVITY_FACTOR = 1.6;      // erwachsener, normal aktiver Hund

interface BreedLike {
  size?: string;
  weightMin?: string | number;
  weightMax?: string | number;
  lifeExpectancy?: string | number;
}

const SIZE_WEIGHT: Record<string, number> = { klein: 7, mittel: 18, gross: 32, sehrgross: 55 };
const SIZE_LIFE: Record<string, number> = { klein: 15, mittel: 13, gross: 11, sehrgross: 9 };

function num(v: string | number | undefined): number | null {
  if (v == null) return null;
  const n = typeof v === "number" ? v : parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

/** Repräsentatives Gewicht: Mittel aus min/max, sonst Größenklasse. */
export function representativeWeight(breed: BreedLike): number {
  const lo = num(breed.weightMin);
  const hi = num(breed.weightMax);
  if (lo != null && hi != null) return (lo + hi) / 2;
  if (lo != null) return lo;
  if (hi != null) return hi;
  return SIZE_WEIGHT[breed.size ?? ""] ?? 18;
}

/** Lebenserwartung in Jahren: aus Daten, sonst Größenklasse. */
export function lifespanYears(breed: BreedLike): number {
  const le = num(breed.lifeExpectancy);
  if (le != null && le > 0) return le;
  return SIZE_LIFE[breed.size ?? ""] ?? 13;
}

/** Futtermenge pro Tag in Gramm. */
export function dailyGrams(weightKg: number, kcalPerKg = AVG_KCAL_PER_KG_DRY, activity = ACTIVITY_FACTOR): number {
  const rer = 70 * Math.pow(Math.max(0.5, weightKg), 0.75);
  const mer = rer * activity;
  return mer / (kcalPerKg / 1000);
}

/** Futterkosten pro Monat in Euro. */
export function monthlyFoodCost(weightKg: number, pricePerKg: number, kcalPerKg = AVG_KCAL_PER_KG_DRY, activity = ACTIVITY_FACTOR): number {
  const gPerDay = dailyGrams(weightKg, kcalPerKg, activity);
  const perDay = (gPerDay / 1000) * pricePerKg;
  return perDay * 30.44;
}

/** Futterkosten über das ganze Hundeleben in Euro. */
export function lifetimeFoodCost(weightKg: number, years: number, pricePerKg: number, kcalPerKg = AVG_KCAL_PER_KG_DRY, activity = ACTIVITY_FACTOR): number {
  const gPerDay = dailyGrams(weightKg, kcalPerKg, activity);
  const perDay = (gPerDay / 1000) * pricePerKg;
  return perDay * 365.25 * years;
}

/** Verbleibende Futterkosten ab einem aktuellen Alter. */
export function remainingFoodCost(weightKg: number, totalYears: number, currentAge: number, pricePerKg: number, kcalPerKg = AVG_KCAL_PER_KG_DRY, activity = ACTIVITY_FACTOR): number {
  const left = Math.max(0, totalYears - currentAge);
  return lifetimeFoodCost(weightKg, left, pricePerKg, kcalPerKg, activity);
}

export const fmtEur = (n: number): string =>
  Math.round(n).toLocaleString("de-DE");
