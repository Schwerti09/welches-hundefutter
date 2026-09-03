// Klick-Moment-Helfer: Wie lange reicht die empfohlene Packung für genau diesen Hund?
// Sackgröße aus dem Produktnamen, Reichweite aus dem (schon berechneten) Tagesbedarf.
// Nur Synthese aus echten Werten — keine erfundenen Zahlen.

/** Sackgröße aus dem Produktnamen lesen, in kg. Erkennt "15 kg", "1,5 kg", "400 g", "12kg". */
export function parsePackKg(name: string | undefined): number | null {
  if (!name) return null;
  const kg = name.match(/(\d+(?:[.,]\d+)?)\s*kg\b/i);
  if (kg) {
    const v = parseFloat(kg[1].replace(",", "."));
    if (v > 0) return v;
  }
  const g = name.match(/(\d+(?:[.,]\d+)?)\s*g\b/i);
  if (g) {
    const v = parseFloat(g[1].replace(",", "."));
    if (v > 0) return v / 1000;
  }
  return null;
}

/**
 * Reichweite einer Packung in Wochen. Bevorzugt den bereits berechneten Tagesbedarf
 * (dailyGrams); fällt sonst auf monthlyPrice/pricePerKg zurück. Gibt null zurück,
 * wenn nichts Sinnvolles ableitbar ist (z. B. einzelne Nassfutter-Dose < 1 Woche).
 */
export function packReachWeeks(args: {
  packKg: number;
  dailyGrams?: number | null;
  pricePerKg?: number | null;
  monthlyPrice?: number | null;
}): number | null {
  const { packKg, dailyGrams, pricePerKg, monthlyPrice } = args;
  let gramsPerDay: number | null = null;
  if (dailyGrams && dailyGrams > 0) {
    gramsPerDay = dailyGrams;
  } else if (pricePerKg && pricePerKg > 0 && monthlyPrice && monthlyPrice > 0) {
    gramsPerDay = ((monthlyPrice / pricePerKg) * 1000) / 30.44;
  }
  if (!gramsPerDay || gramsPerDay <= 0) return null;
  const weeks = Math.round((packKg * 1000) / gramsPerDay / 7);
  return weeks > 0 ? weeks : null;
}

export function fmtKg(kg: number): string {
  return (Number.isInteger(kg) ? String(kg) : kg.toFixed(1).replace(".", ",")) + " kg";
}
