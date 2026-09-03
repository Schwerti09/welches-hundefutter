import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildOutreachPrompt, type OutreachInput } from "@/lib/outreach";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authed(req: NextRequest): boolean {
  const token = process.env.OUTREACH_TOKEN;
  if (!token) return false; // kein Token gesetzt → Endpunkt gesperrt
  return req.headers.get("x-outreach-token") === token;
}

export async function POST(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json({ error: "GEMINI_API_KEY fehlt" }, { status: 500 });

  let input: OutreachInput;
  try {
    input = (await req.json()) as OutreachInput;
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }
  if (!input?.type) return NextResponse.json({ error: "Empfängertyp fehlt" }, { status: 400 });

  const { system, user } = buildOutreachPrompt(input);

  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction: system });
    const result = await model.generateContent(user);
    const raw = result.response.text().replace(/```json|```/g, "").trim();
    try {
      const parsed = JSON.parse(raw) as { subject?: string; body?: string };
      return NextResponse.json({
        subject: parsed.subject ?? "",
        body: parsed.body ?? raw,
      });
    } catch {
      // Falls das Modell kein sauberes JSON liefert: Rohtext als Body zurückgeben.
      return NextResponse.json({ subject: "(Betreff bitte ergänzen)", body: raw });
    }
  } catch (e) {
    return NextResponse.json({ error: "Entwurf fehlgeschlagen: " + (e as Error).message }, { status: 500 });
  }
}
