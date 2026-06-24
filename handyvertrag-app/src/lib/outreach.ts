// Outreach-Generator: baut den Prompt für eine KURZE, ehrlich personalisierte
// Erstkontakt-Mail. Das System schreibt den Entwurf — gesendet wird NUR nach
// menschlicher Sichtprüfung, einzeln. Keine erfundenen Fakten, nur echte Assets.

export type OutreachType = "tierarzt" | "studienautor" | "blogger";

export interface OutreachInput {
  type: OutreachType;
  recipientName: string;
  context: string;
}

const SITE = "welches-hundefutter.today";

const ASSETS = `- Lebenszeit-Kosten-Rechner & Rangliste aller 185 Hunderassen (eigene Datenauswertung aus täglich aktualisierten Live-Preisen)
- Transparente, quellenbasierte Ratgeber zu Allergien, Gelenken und Ernährung
- Live-Preisvergleich über mehr als 11.000 Hundefutter-Sorten
- Studien-/Quellendatenbank mit Einordnung der Evidenz`;

const AUDIENCE: Record<OutreachType, string> = {
  tierarzt: "eine Tierärztin/einen Tierarzt bzw. eine Tierarztpraxis",
  studienautor: "eine Wissenschaftlerin/einen Wissenschaftler im Bereich Tierernährung/Veterinärmedizin",
  blogger: "eine Hunde-Bloggerin/einen Hunde-Blogger oder Content-Creator",
};

export function buildOutreachPrompt(input: OutreachInput): { system: string; user: string } {
  const audience = AUDIENCE[input.type] ?? AUDIENCE.tierarzt;

  const system = `Du bist die seriöse, freundliche Redaktion von ${SITE}, einem unabhängigen, werbefinanzierten Ratgeber für Hundeernährung im DACH-Raum.
Du schreibst eine KURZE, ehrlich personalisierte Erstkontakt-E-Mail an ${audience}.

HARTE REGELN:
- Maximal etwa 120 Wörter. Kein Werbe-Sprech, keine Superlative, kein Druck, keine Dringlichkeit.
- Beginne mit einem KONKRETEN, echten Bezug auf die Person aus dem gegebenen Kontext — niemals generisch wie "ich bin auf Ihre Seite gestoßen".
- Biete einen klaren Mehrwert FÜR DEN EMPFÄNGER an (nützlich für deren Patientenbesitzer bzw. Leser), nicht für uns.
- Erfinde KEINE Fakten, Zahlen oder Studienergebnisse. Nutze ausschließlich die unten genannten echten Assets.
- Höfliche Sie-Anrede (bei Bloggern ist Du erlaubt, wenn der Kontext das nahelegt).
- Schließe mit genau EINEM höflichen Opt-out-Satz, etwa: "Falls für Sie nicht relevant, ignorieren Sie diese Mail bitte einfach — ich melde mich nicht erneut."
- Klinge wie ein echter Mensch, nicht wie eine Serienbrief-Vorlage. Keine Platzhalter.

UNSERE ECHTEN ASSETS (nur diese anbieten):
${ASSETS}

Gib AUSSCHLIESSLICH gültiges JSON zurück, ohne Markdown-Backticks, im Format:
{"subject":"...","body":"..."}
"body" ist reiner Text mit \\n als Zeilenumbruch, inklusive Anrede und Grußformel ("Viele Grüße\\nRolf Schwertfechter\\n${SITE}").`;

  const user = `Empfängertyp: ${audience}
Name/Anrede: ${input.recipientName || "(unbekannt — wähle eine neutrale, höfliche Anrede)"}
Echter Kontext/Aufhänger: ${input.context || "(kein spezifischer Kontext angegeben — bleibe dann ehrlich allgemeiner, aber konkret beim Mehrwert)"}

Schreibe die E-Mail.`;

  return { system, user };
}
