/**
 * Allergen-Ausschluss (Roadmap 2A, CLAUDE.md §4a).
 * Namens-basiert, weil `dog_foods.protein` oft NULL ist und es keine
 * `ingredients`-Spalte gibt. „Huhn" schließt Geflügel/Hähnchen/Chicken mit ein.
 * Ein Allergiker darf ein Produkt mit einem gemiedenen Protein NIE empfohlen bekommen.
 */

const VARIANTS: Record<string, string[]> = {
  Huhn: ["huhn", "hühn", "huehn", "hähnchen", "haehnchen", "geflügel", "gefluegel", "poulet", "chicken", "poultry", "hühner", "huehner"],
  Rind: ["rind", "beef", "rinder"],
  Lachs: ["lachs", "salmon"],
  Fisch: ["fisch", "fish", "lachs", "thunfisch", "salmon", "hering", "forelle", "seefisch"],
  Lamm: ["lamm", "lamb", "schaf"],
  Ente: ["ente", "duck", "enten"],
  Pute: ["pute", "truthahn", "turkey", "puten"],
  Wild: ["wild", "hirsch", "reh", "wildschwein", "venison"],
  Kaninchen: ["kaninchen", "rabbit", "hase"],
  Pferd: ["pferd", "horse", "pferde"],
  Insekt: ["insekt", "insect", "hermetia", "larve", "black soldier"],
  Schwein: ["schwein", "pork", "schweine"],
};

/** Suchbegriffe für ein Allergen (immer inkl. des Begriffs selbst, lowercase). */
export function allergenVariants(allergen: string | null | undefined): string[] {
  if (!allergen) return [];
  return VARIANTS[allergen] ?? [allergen.toLowerCase()];
}

/** Enthält `text` das gemiedene Protein (oder eine Variante)? */
export function containsAllergen(text: string, allergen: string | null | undefined): boolean {
  const v = allergenVariants(allergen);
  if (!v.length) return false;
  const t = text.toLowerCase();
  return v.some((x) => t.includes(x));
}

/** Enthält `text` IRGENDEINES der gemiedenen Proteine? */
export function containsAnyAllergen(text: string, avoidProtein: string[] | undefined): boolean {
  if (!avoidProtein?.length) return false;
  return avoidProtein.some((a) => containsAllergen(text, a));
}

/** SQL-`LIKE`-Muster (`%variante%`) für alle gemiedenen Proteine — für `LIKE ANY(...)`. */
export function allergenLikePatterns(avoidProtein: string[] | undefined): string[] {
  if (!avoidProtein?.length) return [];
  const out = new Set<string>();
  for (const a of avoidProtein) for (const v of allergenVariants(a)) out.add(`%${v}%`);
  return [...out];
}
