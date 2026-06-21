// BELLA Schicht 2 — Preis-Wecker-Anmeldung (Double-Opt-in).
// KEIN Versand vor bestätigtem DOI. Consent (IP + UA + Zeit) wird geloggt (DE-Pflicht).
import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { randomBytes } from "node:crypto";
import { sendEmail, doiEmail, welcomeEmail, SITE_URL } from "@/lib/email";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const token = () => randomBytes(24).toString("hex");

export async function POST(req: NextRequest) {
  const url = process.env.DATABASE_URL;
  if (!url) return NextResponse.json({ ok: false, error: "no_db" }, { status: 500 });

  let body: { email?: string; foodSlug?: string; foodName?: string; dogProfile?: unknown; mode?: string; dogProfileId?: string; refillDueAt?: string; };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 }); }

  const email = (body.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });

  const foodSlug = (body.foodSlug || "").trim() || null;
  const sql = neon(url);

  // Aktuellen Preis als Baseline ziehen (falls Futter bekannt)
  let baseline: number | null = null;
  let foodName = (body.foodName || "").trim() || null;
  if (foodSlug) {
    try {
      const f = await sql`SELECT name, price_per_kg FROM dog_foods WHERE slug = ${foodSlug} LIMIT 1`;
      if (f[0]) { baseline = f[0].price_per_kg != null ? Number(f[0].price_per_kg) : null; foodName = foodName || f[0].name; }
    } catch { /* tolerieren */ }
  }

  const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "").split(",")[0].trim() || null;
  const ua = req.headers.get("user-agent")?.slice(0, 300) || null;
  const dogProfile = body.dogProfile && typeof body.dogProfile === "object" ? body.dogProfile : {};

  try {
    // Subscriber holen/anlegen. Bei früher abgemeldetem Konto: reaktivieren → frisches DOI.
    const existing = await sql`SELECT id, doi_confirmed_at, unsubscribed_at, unsubscribe_token FROM subscribers WHERE email = ${email} LIMIT 1`;
    let subId: string, confirmed: boolean, unsubToken: string, doiToken: string | null = null;

    if (existing[0]) {
      subId = existing[0].id;
      unsubToken = existing[0].unsubscribe_token;
      confirmed = !!existing[0].doi_confirmed_at && !existing[0].unsubscribed_at;
      if (existing[0].unsubscribed_at) {
        // Reaktivierung = neue Einwilligung erforderlich
        doiToken = token();
        confirmed = false;
        await sql`UPDATE subscribers SET unsubscribed_at = NULL, doi_confirmed_at = NULL, doi_token = ${doiToken},
                  consent_ip = ${ip}, consent_user_agent = ${ua}, dog_profile = ${JSON.stringify(dogProfile)}, updated_at = now()
                  WHERE id = ${subId}`;
      } else if (!confirmed) {
        // existiert, noch nicht bestätigt → bestehenden Token erneut nutzen
        const t = await sql`SELECT doi_token FROM subscribers WHERE id = ${subId}`;
        doiToken = t[0].doi_token;
        await sql`UPDATE subscribers SET consent_ip = ${ip}, consent_user_agent = ${ua}, updated_at = now() WHERE id = ${subId}`;
      }
    } else {
      doiToken = token(); unsubToken = token();
      const ins = await sql`INSERT INTO subscribers (email, doi_token, unsubscribe_token, consent_ip, consent_user_agent, dog_profile)
        VALUES (${email}, ${doiToken}, ${unsubToken}, ${ip}, ${ua}, ${JSON.stringify(dogProfile)}) RETURNING id`;
      subId = ins[0].id; confirmed = false;
    }

    // Wecker setzen (idempotent)
    const mode = body.mode === "refill" ? "refill" : "price";
    if (mode === "refill" && body.dogProfileId) {
      // Nachschub-Wecker: idempotent auf (subscriber_id, dog_profile_id)
      const existing = await sql`SELECT id FROM price_alerts WHERE subscriber_id = ${subId} AND dog_profile_id = ${body.dogProfileId} LIMIT 1`;
      const refillDue = body.refillDueAt ?? null;
      if (existing[0]) {
        await sql`UPDATE price_alerts SET food_slug = ${foodSlug}, food_name = ${foodName}, refill_due_at = ${refillDue}, is_active = true, mode = 'refill' WHERE id = ${existing[0].id}`;
      } else if (foodSlug) {
        await sql`INSERT INTO price_alerts (subscriber_id, food_slug, food_name, baseline_price_per_kg, mode, dog_profile_id, refill_due_at)
          VALUES (${subId}, ${foodSlug}, ${foodName}, ${baseline}, 'refill', ${body.dogProfileId}, ${refillDue})`;
      }
    } else if (foodSlug) {
      // Preis-Wecker: idempotent auf (subscriber_id, food_slug)
      await sql`INSERT INTO price_alerts (subscriber_id, food_slug, food_name, baseline_price_per_kg)
        VALUES (${subId}, ${foodSlug}, ${foodName}, ${baseline})
        ON CONFLICT (subscriber_id, food_slug) DO UPDATE SET
          food_name = EXCLUDED.food_name, baseline_price_per_kg = COALESCE(price_alerts.baseline_price_per_kg, EXCLUDED.baseline_price_per_kg),
          is_active = true`;
    }

    // Mail: unbestätigt → DOI; bestätigt → kurze Bestätigung des neuen Weckers
    if (!confirmed && doiToken) {
      const { subject, html, text } = doiEmail(`${SITE_URL}/api/alerts/confirm?token=${doiToken}`, foodName || undefined);
      await sendEmail({ to: email, subject, html, text });
      return NextResponse.json({ ok: true, status: "pending" });
    } else {
      const { subject, html, text } = welcomeEmail(`${SITE_URL}/api/alerts/unsubscribe?token=${unsubToken}`, foodName || undefined);
      await sendEmail({ to: email, subject, html, text });
      return NextResponse.json({ ok: true, status: "active" });
    }
  } catch (e) {
    console.error("[alerts/subscribe]", (e as Error).message);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}
