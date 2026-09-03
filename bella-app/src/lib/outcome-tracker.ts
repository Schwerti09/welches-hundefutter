import { randomBytes } from "node:crypto";
import { neon } from "@neondatabase/serverless";

const DAYS_UNTIL_FOLLOWUP = 21;
const token = () => randomBytes(20).toString("hex");

/**
 * Legt einen Wirkungs-Tracker-Eintrag an, NUR wenn das Hundeprofil einen echten
 * Problem-Kontext hat (Allergie/empfindlicher Magen/Gesundheitsthema) UND ein
 * aktuelles Futter bekannt ist — sonst gibt's nichts Sinnvolles zu fragen.
 * Idempotent: ein zweiter Aufruf für dasselbe Profil legt keinen zweiten Eintrag an.
 */
export async function scheduleOutcomeCheck(
  dbUrl: string,
  { shareToken, email }: { shareToken: string; email: string },
): Promise<void> {
  const sql = neon(dbUrl);
  const [profile] = await sql`
    SELECT id, name, allergies, health_flags, current_food_slug
    FROM dog_profiles WHERE share_token = ${shareToken} LIMIT 1
  `;
  if (!profile) return;

  const problemTags = [...(profile.allergies ?? []), ...(profile.health_flags ?? [])];
  if (problemTags.length === 0 || !profile.current_food_slug) return;

  const [existing] = await sql`
    SELECT id FROM outcome_checks WHERE dog_profile_id = ${profile.id} LIMIT 1
  `;
  if (existing) return;

  const [food] = await sql`SELECT name FROM dog_foods WHERE slug = ${profile.current_food_slug} LIMIT 1`;
  const [subscriber] = await sql`SELECT id FROM subscribers WHERE email = ${email} LIMIT 1`;

  const scheduledAt = new Date(Date.now() + DAYS_UNTIL_FOLLOWUP * 86_400_000);

  await sql`
    INSERT INTO outcome_checks (
      dog_profile_id, subscriber_id, email, dog_name, food_slug, food_name,
      problem_tags, scheduled_at, response_token
    ) VALUES (
      ${profile.id}, ${subscriber?.id ?? null}, ${email}, ${profile.name},
      ${profile.current_food_slug}, ${food?.name ?? null},
      ${problemTags}, ${scheduledAt.toISOString()}, ${token()}
    )
  `;
}
