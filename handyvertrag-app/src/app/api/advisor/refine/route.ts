import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const refineSchema = z.object({
  sessionId: z.string(),
  feedback: z.enum(["too_expensive", "wrong_brand", "need_more_data", "wrong_provider", "satisfied"]),
  currentRecommendationId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { feedback } = refineSchema.parse(body);

    const refinementMessages: Record<string, string> = {
      too_expensive: "Verstanden! Ich suche günstigere Optionen für dich. Was ist dein maximales Budget pro Monat?",
      wrong_brand: "Kein Problem! Welche Marke bevorzugst du? Apple, Samsung oder Google?",
      need_more_data: "Du brauchst mehr Datenvolumen? Ab welchem Volumen wärst du zufrieden?",
      wrong_provider: "Welchen Provider bevorzugst du – Telekom, Vodafone oder o2?",
      satisfied: "Super! Ich freue mich, dass ich helfen konnte. Viel Spaß mit deinem neuen Vertrag!",
    };

    return NextResponse.json({
      message: refinementMessages[feedback],
      refined: true,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
