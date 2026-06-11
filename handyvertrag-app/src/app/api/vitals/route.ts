// BELLA Web-Vitals RUM (P5) — v1: nur Netlify-Function-Log, keine eigene Tabelle.
// Core Web Vitals sind ranking-relevant (CLAUDE.md Regel 8); diese Route sammelt
// echte Messwerte aus dem Feld als Basis für spätere Performance-Optimierung.
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface VitalPayload {
  name?: string;
  value?: number;
  rating?: string;
  id?: string;
  page?: string;
}

export async function POST(req: NextRequest) {
  let body: VitalPayload;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }

  if (typeof body.name !== "string" || typeof body.value !== "number") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  console.log("[web-vitals]", JSON.stringify({
    name: body.name,
    value: Math.round(body.value * 1000) / 1000,
    rating: body.rating ?? null,
    id: body.id ?? null,
    page: body.page ?? null,
  }));

  return NextResponse.json({ ok: true });
}
