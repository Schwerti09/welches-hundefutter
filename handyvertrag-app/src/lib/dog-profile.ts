import { neon } from "@neondatabase/serverless";

export interface SharedDogProfile {
  id: string;
  name: string;
  breed_slug: string | null;
  birth_or_age: string | null;
  weight_kg: string | null;
  activity_level: string | null;
  allergies: string[] | null;
  health_flags: string[] | null;
  current_food_slug: string | null;
  est_daily_grams: number | null;
  est_bag_days: number | null;
  gender: string | null;
  photo_data: string | null;
  food_preferences: string | null;
  conditions: string | null;
  created_at: string | null;
}

export interface SharedDogFood {
  name: string;
  brand: string;
  type: string;
  price_per_kg: string | null;
  affiliate_url: string;
  is_grain_free: boolean;
  image_url: string | null;
}

export async function getSharedDogProfile(
  token: string
): Promise<{ profile: SharedDogProfile; food: SharedDogFood | null } | null> {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  try {
    const sql = neon(url);
    const rows = await sql`
      SELECT id, name, breed_slug, birth_or_age, weight_kg, activity_level,
             allergies, health_flags, current_food_slug, est_daily_grams, est_bag_days,
             gender, photo_data, food_preferences, conditions, created_at
      FROM dog_profiles
      WHERE share_token = ${token} AND share_enabled = true
      LIMIT 1`;
    if (!rows[0]) return null;
    const profile = rows[0] as unknown as SharedDogProfile;

    let food: SharedDogFood | null = null;
    if (profile.current_food_slug) {
      const f = await sql`
        SELECT name, brand, type, price_per_kg, affiliate_url, is_grain_free, image_url
        FROM dog_foods WHERE slug = ${profile.current_food_slug} AND is_active = true LIMIT 1`;
      food = (f[0] as unknown as SharedDogFood) ?? null;
    }
    return { profile, food };
  } catch {
    return null;
  }
}

/** Kartennummer im Pass-Stil aus der UUID, z.B. "BF-7K2P-9X4M". */
export function buildCardNumber(id: string): string {
  const clean = id.replace(/-/g, "").toUpperCase();
  return `BF-${clean.slice(0, 4)}-${clean.slice(4, 8)}`;
}
