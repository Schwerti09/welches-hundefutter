/**
 * BELLA Futter-Pass — Hunde-Profil API.
 * POST /api/profiles  → anlegen / aktualisieren (upsert per share_token)
 * GET  /api/profiles?token=xxx → Profil für den öffentlichen Steckbrief
 */
import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { randomBytes } from "node:crypto";
import { dailyGrams, bagDays } from "@/lib/consumption-math";
import type { ActivityLevel } from "@/lib/consumption-math";

export const runtime = "nodejs";

function db() {
  const url = process.env.DATABASE_URL;
  return url ? neon(url) : null;
}

// GET — Steckbrief (token) oder Dashboard (id, kein share_enabled check)
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const token = searchParams.get("token");
  const id = searchParams.get("id");
  const full = searchParams.get("full") === "1";

  if (!token && !id) return NextResponse.json({ error: "token_or_id_missing" }, { status: 400 });
  const sql = db();
  if (!sql) return NextResponse.json({ error: "no_db" }, { status: 500 });

  try {
    const rows = token
      ? await sql`
          SELECT id, name, breed_slug, birth_or_age, weight_kg, activity_level,
                 allergies, health_flags, current_food_slug, current_package_g,
                 last_purchase_at, est_daily_grams, est_bag_days, share_token, share_enabled,
                 gender, photo_data
          FROM dog_profiles
          WHERE share_token = ${token} AND share_enabled = true
          LIMIT 1`
      : await sql`
          SELECT id, name, breed_slug, birth_or_age, weight_kg, activity_level,
                 allergies, health_flags, current_food_slug, current_package_g,
                 last_purchase_at, est_daily_grams, est_bag_days, share_token, share_enabled,
                 gender, photo_data
          FROM dog_profiles
          WHERE id = ${id!}
          LIMIT 1`;

    if (!rows[0]) return NextResponse.json({ error: "not_found" }, { status: 404 });
    const profile = rows[0];

    // Food lookup for dashboard (full=1)
    let food = null;
    if (full && profile.current_food_slug) {
      const f = await sql`
        SELECT name, brand, type, price_per_kg, affiliate_url, is_grain_free
        FROM dog_foods WHERE slug = ${profile.current_food_slug} AND is_active = true LIMIT 1`;
      food = f[0] ?? null;
    }

    return NextResponse.json({ profile, food, shareToken: profile.share_token });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

// POST — anlegen / updaten
export async function POST(req: NextRequest) {
  const sql = db();
  if (!sql) return NextResponse.json({ error: "no_db" }, { status: 500 });

  let body: {
    id?: string;
    name?: string;
    breedSlug?: string;
    birthOrAge?: string;
    weightKg?: number;
    activityLevel?: string;
    allergies?: string[];
    healthFlags?: string[];
    currentFoodSlug?: string;
    currentPackageG?: number;
    lastPurchaseAt?: string;
    shareEnabled?: boolean;
    subscriberId?: string;
    gender?: string;
    photoData?: string;
  };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad_json" }, { status: 400 }); }

  const name = (body.name || "").trim();

  // Partial update (lastPurchaseAt, gender, photo_data, name-only) — kein vollständiger Profil-Save
  if (body.id && !body.breedSlug && !body.weightKg) {
    try {
      const upd = await sql`
        UPDATE dog_profiles SET
          last_purchase_at = COALESCE(${body.lastPurchaseAt ?? null}::timestamptz, last_purchase_at),
          gender = COALESCE(${body.gender ?? null}, gender),
          photo_data = COALESCE(${body.photoData ?? null}, photo_data),
          name = CASE WHEN ${name || null} IS NOT NULL THEN ${name || null} ELSE name END,
          updated_at = now()
        WHERE id = ${body.id}
        RETURNING id, share_token, est_bag_days`;
      if (!upd[0]) return NextResponse.json({ error: "not_found" }, { status: 404 });
      // Refill-Wecker: refill_due_at neu setzen
      const existingBd = upd[0].est_bag_days as number | null;
      if (body.lastPurchaseAt && existingBd) {
        const refillDue = new Date(new Date(body.lastPurchaseAt).getTime() + existingBd * 86_400_000).toISOString();
        await sql`UPDATE price_alerts SET refill_due_at = ${refillDue} WHERE dog_profile_id = ${body.id} AND mode = 'refill' AND is_active = true`.catch(() => {});
      }
      return NextResponse.json({ ok: true, id: upd[0].id, shareToken: upd[0].share_token });
    } catch (e) {
      console.error("[api/profiles partial]", (e as Error).message);
      return NextResponse.json({ error: "server" }, { status: 500 });
    }
  }

  if (!name) return NextResponse.json({ error: "name_required" }, { status: 400 });

  // Verbrauchsmathematik berechnen (deterministisch)
  const wkg = body.weightKg && body.weightKg > 0 ? body.weightKg : null;
  const activity = (body.activityLevel as ActivityLevel) || "mittel";
  const dg = wkg ? dailyGrams(wkg, activity) : null;
  const bd = dg && body.currentPackageG ? bagDays(body.currentPackageG, dg) : null;

  try {
    let profileId: string;
    let shareToken: string;

    if (body.id) {
      // Full update
      const upd = await sql`
        UPDATE dog_profiles SET
          name = ${name},
          breed_slug = ${body.breedSlug ?? null},
          birth_or_age = ${body.birthOrAge ?? null},
          weight_kg = ${wkg},
          activity_level = ${body.activityLevel ?? null},
          allergies = ${body.allergies ?? null},
          health_flags = ${body.healthFlags ?? null},
          current_food_slug = ${body.currentFoodSlug ?? null},
          current_package_g = ${body.currentPackageG ?? null},
          last_purchase_at = ${body.lastPurchaseAt ?? null},
          est_daily_grams = ${dg},
          est_bag_days = ${bd},
          share_enabled = ${body.shareEnabled ?? false},
          gender = COALESCE(${body.gender ?? null}, gender),
          photo_data = COALESCE(${body.photoData ?? null}, photo_data),
          updated_at = now()
        WHERE id = ${body.id}
        RETURNING id, share_token`;
      if (!upd[0]) return NextResponse.json({ error: "not_found" }, { status: 404 });
      profileId = upd[0].id;
      shareToken = upd[0].share_token;

      // Refill-Wecker: refill_due_at neu berechnen wenn lastPurchaseAt gesetzt
      if (body.lastPurchaseAt && bd) {
        const refillDue = new Date(new Date(body.lastPurchaseAt).getTime() + bd * 86_400_000).toISOString();
        await sql`UPDATE price_alerts SET refill_due_at = ${refillDue} WHERE dog_profile_id = ${body.id} AND mode = 'refill' AND is_active = true`.catch(() => {});
      }
    } else {
      // Insert
      shareToken = randomBytes(18).toString("hex");
      const ins = await sql`
        INSERT INTO dog_profiles (
          name, breed_slug, birth_or_age, weight_kg, activity_level,
          allergies, health_flags, current_food_slug, current_package_g,
          last_purchase_at, est_daily_grams, est_bag_days,
          share_token, share_enabled, subscriber_id
        ) VALUES (
          ${name}, ${body.breedSlug ?? null}, ${body.birthOrAge ?? null},
          ${wkg}, ${body.activityLevel ?? null},
          ${body.allergies ?? null}, ${body.healthFlags ?? null},
          ${body.currentFoodSlug ?? null}, ${body.currentPackageG ?? null},
          ${body.lastPurchaseAt ?? null}, ${dg}, ${bd},
          ${shareToken}, ${body.shareEnabled ?? false},
          ${body.subscriberId ?? null}
        ) RETURNING id`;
      profileId = ins[0].id;
    }

    return NextResponse.json({
      ok: true,
      id: profileId,
      shareToken,
      estimate: dg ? { dailyGrams: dg, bagDays: bd } : null,
    });
  } catch (e) {
    console.error("[api/profiles]", (e as Error).message);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
