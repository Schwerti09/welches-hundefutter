// BELLA Schicht 2 — Abmeldung (in jeder Mail verlinkt, jederzeit möglich).
import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const url = process.env.DATABASE_URL;
  const token = new URL(req.url).searchParams.get("token") || "";
  const to = (status: string) => NextResponse.redirect(new URL(`/preis-wecker?status=${status}`, req.url));
  if (!url || !token) return to("error");

  try {
    const sql = neon(url);
    const rows = await sql`UPDATE subscribers SET unsubscribed_at = now(), updated_at = now()
      WHERE unsubscribe_token = ${token} AND unsubscribed_at IS NULL RETURNING id`;
    // Wecker stilllegen, Datensparsamkeit
    if (rows[0]) await sql`UPDATE price_alerts SET is_active = false WHERE subscriber_id = ${rows[0].id}`;
    return to("unsubscribed");
  } catch (e) {
    console.error("[alerts/unsubscribe]", (e as Error).message);
    return to("error");
  }
}
