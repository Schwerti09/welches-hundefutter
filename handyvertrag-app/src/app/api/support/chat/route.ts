/**
 * BELLA Support-Chat — vollautomatisierte FAQ-Beantwortung.
 * Kein Mensch im Loop. Bewusst getrennt vom Produkt-Berater (api/advisor/chat):
 * andere Aufgabe (Fragen zu Datenschutz, Funktionsweise, Reklamationen),
 * kein Streaming/Scoring-Overhead nötig.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 30;

const chatSchema = z.object({
  message: z.string().min(1).max(1000),
  conversationHistory: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .max(20)
    .optional(),
});

const SYSTEM_PROMPT = `Du bist BELLA, die KI-Support-Mitarbeiterin von welches-hundefutter.today.
Du beantwortest Support-Fragen vollautomatisiert — es gibt keinen menschlichen Support im Hintergrund.

FAKTEN ZUM UNTERNEHMEN:
- welches-hundefutter.today ist ein neutraler Vergleichs- und Beratungsdienst, kein Shop.
- Wir verkaufen nichts selbst. Jeder Kauf läuft über Affiliate-Links direkt beim jeweiligen Händler
  (z. B. über AWIN/AdCell-Partnerprogramme). Versand, Zahlung, Lieferung gehören dem Händler.
- Betreiber: Rolf Schwertfechter, Karklandsweg 1, 26553 Dornum, Deutschland.
- Kontakt für Themen, die du nicht klären kannst: support@welches-hundefutter.today

WICHTIGSTE REGEL — REKLAMATIONEN & PRODUKTPROBLEME:
Bei Fragen zu falscher Lieferung, beschädigter Ware, Rückgabe, Garantie, Rechnungen oder
Zahlungsproblemen: erkläre freundlich, aber klar, dass der Kauf beim Händler stattgefunden hat
und NUR der Händler (der Online-Shop, bei dem bestellt wurde) Reklamationen, Rückgaben oder
Erstattungen bearbeiten kann. Wir haben keinen Zugriff auf Bestellungen. Verweise auf die
Bestellbestätigung/den Kundenservice des Händlers.

WEITERE THEMEN, DIE DU BEANTWORTEST:
- Wie BELLA funktioniert (Fragen zum Hund → Empfehlung aus 11.000+ Produkten, Preisvergleich).
- Datenschutz: Hundeprofile sind opt-in, DSGVO-konform, jederzeit löschbar (Details: /datenschutz).
- Affiliate-Transparenz: Wir erhalten ggf. Provision, das beeinflusst nicht die Empfehlung (/affiliate).
- Allgemeine Hinweise zu Hundefutter — aber KEINE Tierarzt-Diagnosen oder Heilversprechen.
  Bei gesundheitlichen Problemen des Hundes: an einen Tierarzt verweisen.

STIL: Deutsch, Du-Form, kurz und konkret (2-5 Sätze), freundlich, keine Marketing-Floskeln.
Wenn eine Frage außerhalb deines Wissens liegt, sag das ehrlich und verweise auf
support@welches-hundefutter.today.`;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  const { message, conversationHistory = [] } = parsed.data;

  const geminiKey = process.env.GEMINI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const history = conversationHistory.slice(-10);

  if (geminiKey) {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction: SYSTEM_PROMPT });
      const chat = model.startChat({
        history: history.map((h) => ({ role: h.role === "assistant" ? "model" : "user", parts: [{ text: h.content }] })),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        generationConfig: { temperature: 0.6, maxOutputTokens: 700, thinkingConfig: { thinkingBudget: 0 } } as any,
      });
      const result = await chat.sendMessage(message);
      const reply = result.response.text();
      if (reply) return NextResponse.json({ reply });
    } catch {
      /* fällt durch zu Anthropic */
    }
  }

  if (anthropicKey) {
    try {
      const anthropic = new Anthropic({ apiKey: anthropicKey });
      const msgs = [...history.map((h) => ({ role: h.role as "user" | "assistant", content: h.content })), { role: "user" as const, content: message }];
      const resp = await anthropic.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 500,
        temperature: 0.6,
        system: SYSTEM_PROMPT,
        messages: msgs,
      });
      const reply = resp.content.find((c) => c.type === "text")?.text;
      if (reply) return NextResponse.json({ reply });
    } catch {
      /* fällt durch zu Fallback */
    }
  }

  return NextResponse.json({
    reply: "Sorry, gerade klappt die Verbindung nicht. Schreib uns direkt an support@welches-hundefutter.today — wir melden uns.",
  });
}
