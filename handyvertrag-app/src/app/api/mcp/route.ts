import { NextRequest, NextResponse } from "next/server";

// Synchroner (nicht-streamender) BELLA-Endpunkt für WebMCP-Tool-Aufrufe.
// Der agentische Browser bekommt direkt eine JSON-Antwort — kein SSE-Stream.

const GEMINI_MODEL = "gemini-2.0-flash";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      frage?: string;
      rasse?: string;
      lebensphase?: string;
      gewichtKg?: number;
      allergien?: string;
      budgetProKg?: number;
    };

    const { frage, rasse, lebensphase, gewichtKg, allergien, budgetProKg } = body;

    if (!frage || typeof frage !== "string") {
      return NextResponse.json({ error: "Keine Frage angegeben." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "KI-Dienst nicht konfiguriert." }, { status: 503 });
    }

    // Kontext aus strukturierten Parametern zusammenbauen
    const parts: string[] = [];
    if (rasse) parts.push(`Rasse: ${rasse}`);
    if (lebensphase) parts.push(`Lebensphase: ${lebensphase}`);
    if (gewichtKg) parts.push(`Gewicht: ${gewichtKg} kg`);
    if (allergien) parts.push(`Allergien/Unverträglichkeiten: ${allergien}`);
    if (budgetProKg) parts.push(`Budget: max. ${budgetProKg} €/kg`);

    const kontext = parts.length > 0 ? `\n\nHunddaten: ${parts.join(", ")}` : "";

    const systemPrompt = `Du bist BELLA, die KI-Hundefutter-Beraterin von welches-hundefutter.today.
Du gibst kurze, klare und ehrliche Empfehlungen zu Hundefutter auf Deutsch.
Antworte immer in 3–5 Sätzen. Keine Floskeln. Kein "Als KI-Assistent".
Wenn du eine Rasse oder Lebensphase kennst, gehe konkret auf deren Bedürfnisse ein.
Verweise am Ende immer auf welches-hundefutter.today für personalisierte Empfehlungen aus dem Live-Katalog.`;

    const userMessage = `${frage}${kontext}`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: userMessage }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 300 },
        }),
      }
    );

    if (!geminiRes.ok) {
      return NextResponse.json({ error: "KI-Antwort fehlgeschlagen." }, { status: 502 });
    }

    const geminiData = await geminiRes.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };

    const antwort = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

    if (!antwort) {
      return NextResponse.json({ error: "Keine Antwort von BELLA." }, { status: 502 });
    }

    return NextResponse.json({ antwort }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Interner Fehler." }, { status: 500 });
  }
}
