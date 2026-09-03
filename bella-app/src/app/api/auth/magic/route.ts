import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { sendEmail, magicLinkEmail, SITE_URL } from "@/lib/email";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ ok: false }, { status: 500 });

  let email: string;
  try {
    const body = await req.json();
    email = (body.email || "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Always return 200 — never reveal whether the email exists
  if (!EMAIL_RE.test(email)) return NextResponse.json({ ok: true });

  try {
    const sql = neon(dbUrl);

    // Find most recent confirmed dog_profile linked to this email
    const rows = await sql`
      SELECT dp.share_token, dp.name
      FROM dog_profiles dp
      JOIN price_alerts pa ON pa.dog_profile_id = dp.id
      JOIN subscribers s ON s.id = pa.subscriber_id
      WHERE s.email = ${email}
        AND s.doi_confirmed_at IS NOT NULL
        AND s.unsubscribed_at IS NULL
      ORDER BY dp.created_at DESC
      LIMIT 1
    `;

    if (rows.length === 0) {
      // No profile found — still return 200, no info leaked
      return NextResponse.json({ ok: true });
    }

    const { share_token: shareToken, name: dogName } = rows[0];
    const restoreUrl = `${SITE_URL}/mein-hund?restore=${shareToken}`;
    const tpl = magicLinkEmail(restoreUrl, dogName);

    await sendEmail({ to: email, subject: tpl.subject, html: tpl.html, text: tpl.text });
  } catch (e) {
    console.error("[magic-link]", (e as Error).message);
  }

  return NextResponse.json({ ok: true });
}
