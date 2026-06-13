import { BREEDS } from "@/data/breeds";

export interface BreedSlim {
  slug: string;
  name: string;
  size: string;
  weightKg: number;
}

const SIZE_FALLBACK_KG: Record<string, number> = {
  klein: 7,
  mittel: 18,
  gross: 32,
  sehrgross: 55,
};

/** Schlanke, serialisierbare Rassen-Liste für Client-Komponenten (Kosten-Hook). */
export function getBreedsSlim(): BreedSlim[] {
  return BREEDS.map((b) => {
    const min = b.weightMin != null ? parseFloat(String(b.weightMin)) : NaN;
    const max = b.weightMax != null ? parseFloat(String(b.weightMax)) : NaN;
    const weightKg = !isNaN(min) && !isNaN(max)
      ? Math.round((min + max) / 2)
      : SIZE_FALLBACK_KG[b.size] ?? 18;
    return { slug: b.slug, name: b.name, size: b.size, weightKg };
  });
}
