// Transactional magic-link sender for post-profile-creation email capture.
// No DOI required — sending the user a link TO THEIR OWN profile is not marketing.
import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { randomBytes } from "node:crypto";
import { sendEmail, magicLinkEmail, SITE_URL } from "@/lib/email";
import { scheduleOutcomeCheck } from "@/lib/outcome-tracker";

const token = () => randomBytes(24).toString("hex");

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return NextResponse.json({ ok: false }, { status: 500 });

  let email: string, shareToken: string, dogName: string | undefined;
  try {
    const body = await req.json();
    email = (body.email || "").trim().toLowerCase();
    shareToken = (body.shareToken || "").trim();
    dogName = body.dogName || undefined;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!EMAIL_RE.test(email) || !shareToken) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  try {
    const sql = neon(dbUrl);

    // Upsert unconfirmed subscriber so email exists in our system
    await sql`
      INSERT INTO subscribers (email, doi_token, unsubscribe_token, dog_profile)
      VALUES (${email}, ${token()}, ${token()}, ${dogName ?? null})
      ON CONFLICT (email) DO NOTHING
    `;

    const restoreUrl = `${SITE_URL}/mein-hund?restore=${shareToken}`;
    const tpl = magicLinkEmail(restoreUrl, dogName);

    await sendEmail({ to: email, subject: tpl.subject, html: tpl.html, text: tpl.text });

    // Wirkungs-Tracker: nur wenn die Empfehlung einen echten Problem-Kontext hatte
    // (Allergie/empfindlicher Magen) — sonst gibt's nichts Sinnvolles zu fragen.
    scheduleOutcomeCheck(dbUrl, { shareToken, email }).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[profile-link]", (e as Error).message);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
