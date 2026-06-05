// BELLA Schicht 2 — Double-Opt-in-Bestätigung. Erst ab hier ist Versand erlaubt.
import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { sendEmail, welcomeEmail, SITE_URL } from "@/lib/email";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const url = process.env.DATABASE_URL;
  const token = new URL(req.url).searchParams.get("token") || "";
  // Basis = SITE_URL (kanonische Domain), nicht req.url — sonst landet der Nutzer
  // aus der E-Mail auf der internen netlify.app-Preview-Domain.
  const to = (status: string) => NextResponse.redirect(new URL(`/preis-wecker?status=${status}`, SITE_URL));
  if (!url || !token) return to("error");

  try {
    const sql = neon(url);
    const rows = await sql`UPDATE subscribers
      SET doi_confirmed_at = COALESCE(doi_confirmed_at, now()), unsubscribed_at = NULL, updated_at = now()
      WHERE doi_token = ${token}
      RETURNING id, email, unsubscribe_token`;
    if (!rows[0]) return to("error");

    const a = await sql`SELECT food_name FROM price_alerts WHERE subscriber_id = ${rows[0].id} ORDER BY created_at DESC LIMIT 1`;
    const { subject, html, text } = welcomeEmail(
      `${SITE_URL}/api/alerts/unsubscribe?token=${rows[0].unsubscribe_token}`,
      a[0]?.food_name || undefined,
    );
    await sendEmail({ to: rows[0].email, subject, html, text });
    return to("confirmed");
  } catch (e) {
    console.error("[alerts/confirm]", (e as Error).message);
    return to("error");
  }
}
