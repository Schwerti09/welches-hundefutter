import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authed(req: NextRequest): boolean {
  const token = process.env.OUTREACH_TOKEN;
  if (!token) return false;
  return req.headers.get("x-outreach-token") === token;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  let body: { to?: string; subject?: string; text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  const to = (body.to ?? "").trim();
  const subject = (body.subject ?? "").trim();
  const text = (body.text ?? "").trim();

  // Bewusst nur EIN Empfänger pro Request — kein Bulk-Versand.
  if (!to || !subject || !text) {
    return NextResponse.json({ error: "Empfänger, Betreff und Text sind erforderlich." }, { status: 400 });
  }
  if (to.includes(",") || to.includes(";") || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
    return NextResponse.json({ error: "Genau eine gültige Empfängeradresse — kein Bulk." }, { status: 400 });
  }

  const html = text
    .split("\n")
    .map((l) => (l.trim() ? `<p style="margin:0 0 12px">${escapeHtml(l)}</p>` : "<br>"))
    .join("");

  const res = await sendEmail({ to, subject, html, text });
  if (!res.ok) {
    return NextResponse.json(
      { error: res.skipped ? "RESEND_API_KEY fehlt — es wurde nichts gesendet." : res.error },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true, id: res.id });
}
