// Echte Hundefutter-Typen — KEINE Handy-Felder. Quelle der Wahrheit: Neon (dog_foods/offers).

export interface DogFood {
  id: string;
  slug: string;
  brand: string;
  name: string;
  /** 'trocken' | 'nass' | 'barf' | 'kaltgepresst' | 'snack' */
  foodType: string;
  protein: string | null;
  grainFree: boolean;
  hypoallergenic: boolean;
  pricePerKg: number | null;
  price: number | null;
  /** Lebensphasen/Eignung: 'welpen' | 'adult' | 'senior' | 'allergie' */
  suitableFor: string[];
  imageUrl: string | null;
  affiliateUrl: string;
  rating: number | null;
  /** BELLA-Score 0-100, siehe /analyse/methodik. null = noch nicht bewertet. */
  score: number | null;
}
