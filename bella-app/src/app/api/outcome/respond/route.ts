// Ein-Klick-Antwort aus der Wirkungs-Tracker-Mail — kein Login, GET-Link aus der
// E-Mail selbst. Idempotent: nur die ERSTE Antwort pro Token wird gespeichert,
// damit Mail-Sicherheits-Scanner (die alle Links in einer Mail vorab crawlen)
// nicht versehentlich die echte Antwort des Nutzers überschreiben.
import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";

const VALID_OUTCOMES = new Set(["besser", "gleich", "schlechter"]);

export async function GET(req: NextRequest) {
  const dbUrl = process.env.DATABASE_URL;
  const siteUrl = process.env.SITE_URL || "https://welches-hundefutter.today";
  const { searchParams } = new URL(req.url);
  const token = (searchParams.get("token") || "").trim();
  const outcome = (searchParams.get("outcome") || "").trim();

  if (!dbUrl || !token || !VALID_OUTCOMES.has(outcome)) {
    return NextResponse.redirect(`${siteUrl}/feedback-danke?status=invalid`);
  }

  try {
    const sql = neon(dbUrl);
    const [row] = await sql`
      SELECT id, responded_at FROM outcome_checks WHERE response_token = ${token} LIMIT 1
    `;
    if (!row) return NextResponse.redirect(`${siteUrl}/feedback-danke?status=invalid`);

    if (!row.responded_at) {
      await sql`UPDATE outcome_checks SET outcome = ${outcome}, responded_at = now() WHERE id = ${row.id}`;
    }
    return NextResponse.redirect(`${siteUrl}/feedback-danke?status=ok&outcome=${outcome}`);
  } catch (e) {
    console.error("[outcome-respond]", (e as Error).message);
    return NextResponse.redirect(`${siteUrl}/feedback-danke?status=error`);
  }
}
