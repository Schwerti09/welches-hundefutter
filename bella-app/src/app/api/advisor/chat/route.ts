/**
 * BELLA Decision Intelligence Engine — Hunde-Ernährungsberatung
 * Streamt strukturierte Events (nicht nur Text).
 *
 * Stream-Protokoll:
 *   STEP:<id>:<label>\n     — sichtbarer Analyse-Schritt
 *   ELIM:<count>:<reason>\n — Eliminierungs-Event
 *   CONF:<score>\n          — Konfidenz
 *   SCORE:<json>\n          — Match-Scores der Top-Kandidaten
 *   TEXT:<chunk>            — KI-Begründung (gestreamt)
 *   OFFERS:<json>          — finale Empfehlung { offers, theme, confidence }
 */
import { NextRequest } from "next/server";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { neon } from "@neondatabase/serverless";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";
import { getCompanions } from "@/db/queries/crosssell";
import { containsAnyAllergen } from "@/lib/advisor/allergens";
import { dailyGrams } from "@/lib/consumption-math";
import type { ActivityLevel } from "@/lib/consumption-math";
import { getVoucherForUrl } from "@/data/partners";
import { findGlossaryLinks } from "@/lib/glossary-links";
import {
  parseIntent,
  hasEnoughIntent,
  computeConfidence,
  classifyTheme,
  intentSignalCount,
} from "@/lib/advisor/intent";
import type { DogIntent, AdvisorTheme } from "@/lib/advisor/intent";
import { extractIntentLLM, llmIntentEnabled } from "@/lib/advisor/intent-llm";
import { mergeIntent } from "@/lib/advisor/merge";
import type { ScoredFood } from "@/lib/advisor/scoring";
import { fetchCandidates, fetchRelevantStudies, type StudyCitation } from "@/lib/advisor/candidates";
import { checkRateLimit, checkSameOrigin } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 45;

// Re-Export für bestehende Konsumenten (Verhalten unverändert, Roadmap Op 1.4).
export type { AdvisorTheme };

// ─── Schema ───────────────────────────────────────────────────────────────────

const chatSchema = z.object({
  message: z.string().min(1).max(1000),
  sessionId: z.string().optional(),
  conversationHistory: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .max(40)
    .optional(),
});

// Types + Intent-Parsing + Scoring ausgelagert: src/lib/advisor/{intent,scoring}.ts (Roadmap Op 1.4)

// ─── System-Prompt ────────────────────────────────────────────────────────────

function buildSystemPrompt(offers: ScoredFood[], confidence: number, ask: boolean, intent: DogIntent, studies: StudyCitation[] = []): string {
  const block = offers.length
    ? offers.map((o, i) => {
        const sf = Array.isArray(o.suitable_for) && o.suitable_for.length ? o.suitable_for.join("/") : "alle Lebensphase";
        const voucher = getVoucherForUrl(o.affiliate_url);
        const voucherNote = voucher
          ? ` · 🎁 GUTSCHEIN VERFÜGBAR bei ${voucher.shopName}: ${voucher.discount}${voucher.code ? ` (Code ${voucher.code})` : " (kein Code nötig, automatisch über den Link)"}`
          : "";
        const scoreNote = o.score != null ? ` · BELLA-Score ${o.score}/100${o.score < 40 ? " ⚠️ NIEDRIG" : ""}` : "";
        const vagueProtein = !o.protein || /tierisch|nebenerzeugnis/i.test(o.protein);
        return `[${i + 1}] ${o.brand} ${o.name} · Typ: ${o.type}${o.protein ? ` · Protein: ${o.protein}` : " · Protein: nicht klar benannt ⚠️"}` +
          `${o.price_per_kg ? ` · ${parseFloat(o.price_per_kg).toFixed(2)} €/kg` : o.price ? ` · ${parseFloat(o.price).toFixed(2)} €` : ""}` +
          `${o.is_grain_free ? " · getreidefrei" : ""}${o.is_hypoallergenic ? " · hypoallergen" : ""} · geeignet für: ${sf} · Match ${o.matchScore}%${scoreNote}${vagueProtein ? " · ⚠️ vage Proteinquelle" : ""}${voucherNote}`;
      }).join("\n")
    : "Noch keine Futter-Daten — weitere Infos über den Hund einholen.";

  const known: string[] = [];
  if (intent.breed) known.push(`Rasse: ${intent.breed}`);
  if (intent.lifePhase) known.push(`Lebensphase: ${intent.lifePhase}`);
  if (intent.avoidProtein?.length) known.push(`🚫 ALLERGIE — KEIN ${intent.avoidProtein.join(", KEIN ")} (Pflicht, nie brechen)`);
  else if (intent.sensitive) known.push(`empfindlich / möglicherweise Allergie${intent.protein ? ` (Wunsch: ${intent.protein})` : ""}`);
  if (intent.foodType) known.push(`Wunsch-Futtertyp: ${intent.foodType}`);
  if (intent.maxPricePerKg) known.push(`Budget: bis ${intent.maxPricePerKg} €/kg`);
  if (intent.currentFood && intent.currentFood !== "bekannt") known.push(`aktuelles Futter: ${intent.currentFood}`);
  else if (intent.currentFood === "bekannt") known.push("aktuelles Futter: erwähnt (ohne Marke)");
  if (intent.wantToSwitch && intent.switchReason) known.push(`Wechselgrund: ${intent.switchReason}`);

  // Was fehlt noch für eine gute Empfehlung?
  const missing: string[] = [];
  if (!intent.lifePhase) missing.push("Lebensphase (Welpe / ausgewachsen / Senior)");
  if (!intent.currentFood) missing.push("aktuelles Futter & warum sie wechseln möchten");
  if (!intent.sensitive && !intent.protein && !intent.avoidProtein?.length) missing.push("Allergien oder empfindlicher Magen");
  if (!intent.foodType) missing.push("gewünschter Futtertyp (Trocken / Nass / BARF)");

  const switchCtx = intent.wantToSwitch && intent.currentFood
    ? `\nKONTEXT FUTTERWECHSEL: Hund frisst aktuell "${intent.currentFood}", Grund: ${intent.switchReason ?? "unbekannt"}. Beziehe dich auf diesen Wechsel in der Empfehlung.`
    : "";

  const mode = ask
    ? `MODUS: GESPRÄCH / NACHFRAGEN (noch keine Empfehlung zeigen)

Was ich bereits weiß: ${known.length ? known.join(" · ") : "noch nichts — erste Nachricht"}
Was noch fehlt: ${missing.slice(0, 2).join("; ")}

DEINE AUFGABE:
1. ERST: Reagiere kurz und warm auf das, was der Halter gerade gesagt hat (1 kurzer Satz — zeige, dass du zuhörst und verstanden hast). Beziehe dich auf konkrete Details (Rasse, Alter, Problem). Kein generisches "Super!" — sei spezifisch.
2. DANN: Stelle GENAU EINE natürliche Folgefrage.

PRIORITÄT der Fragen (was bringt mich am schnellsten zur besten Empfehlung):
  1. Falls Lebensphase unbekannt → frag danach: "Wie alt ist er/sie ungefähr — Welpe, ausgewachsen oder schon ein älteres Semester?"
  2. Falls aktuelles Futter unbekannt → frag danach: "Was frisst er/sie aktuell, und was ist der Grund für den Wechsel?"
  3. Falls Allergie/Sensibilität unklar → frag: "Gibt es Allergien oder reagiert er/sie auf bestimmte Zutaten?"
  4. Falls Futtertyp unklar → frag: "Soll es eher Trocken-, Nassfutter oder BARF sein?"

STIL: Freundlich, persönlich, wie eine kompetente Freundin die sich mit Hundeernährung auskennt. Biete 2-3 konkrete Antwort-Optionen an wenn passend. Keine Produkte nennen.`
    : offers.length === 0
    ? `MODUS: KEINE SICHERE EMPFEHLUNG MÖGLICH

Was ich weiß: ${known.length ? known.join(" · ") : "allgemeine Anfrage"}${switchCtx}

Ich habe im Live-Katalog NICHTS Sicheres gefunden${intent.avoidProtein?.length ? ` ohne ${intent.avoidProtein.join(" & ")}` : ""}${intent.breed ? ` für einen ${intent.breed}` : ""}.

DEINE AUFGABE:
1. Sag das ehrlich und kurz — kein Drama, aber klar: du kannst gerade nichts Passendes empfehlen.
2. Empfiehl NICHTS. Nenne KEINE Produkte, erfinde nichts.
3. Biete konkret an, die Suche zu weiten: anderer Futtertyp (Nass / BARF / Trocken), größeres Budget, oder eine andere Proteinquelle als Ausgangspunkt.
4. Behaupte NIE, der Halter hätte dir Produkte genannt.

STIL: Warm, ehrlich, lösungsorientiert. 2-4 Sätze.`
    : `MODUS: EMPFEHLEN

Was ich weiß: ${known.length ? known.join(" · ") : "allgemeine Anfrage"}${switchCtx}

DEINE AUFGABE:
1. Empfiehl Futter [1] mit 2-3 echten, konkreten Gründen aus den Produktdaten (Typ, Protein, €/kg, getreidefrei/hypoallergen, geeignet für Lebensphase).
2. Nenne kurz Futter [2] als Alternative und WARUM es zweite Wahl ist.
3. Falls relevant: einen kurzen Praxis-Tipp (Tagesmenge nach Gewicht, Umstellungsdauer, Portionsgröße).
4. Optional: EINE natürliche Anschlussfrage wenn noch was Wichtiges fehlt.

STIL: Konkret und ehrlich. Nicht "Das ist perfekt für deinen Hund!" sondern "Das passt gut, weil...". 4-6 Sätze — immer vollständig beenden, nie mitten im Satz abbrechen.`;

  const studyBlock = studies.length
    ? `\nWISSENSCHAFT (peer-reviewed, kurz zitieren wenn wirklich passend — max. 1 Satz):\n${studies.map(s =>
        `– ${s.title} (${s.authors[0]?.split(",")[0] ?? ""} et al., ${s.year}): ${s.bella_summary.slice(0, 200)}`
      ).join("\n")}`
    : "";

  return `Du bist BELLA — eine erfahrene, ehrliche Hundeernährungsberaterin. Du kennst 11.000+ Futtersorten und kannst durch gute Fragen schnell herausfinden, was zu einem bestimmten Hund passt.

Du bist KEINE Verkäuferin. Du bist wie eine kluge Freundin, die sich auskennt — warmherzig, direkt, ohne Floskeln.

KONFIDENZ: ${confidence}% (wie sicher bin ich mir mit den vorliegenden Infos)

${mode}

KATALOG-AUSZUG, den ICH (BELLA) gerade im Live-Katalog gefunden habe.
Der Halter hat KEINE dieser Produkte genannt — es ist meine Recherche. NUR diese verwenden:
${block}
${studyBlock}

STRIKTE REGELN — nie brechen:
- "geeignet für: alle Lebensphase" = für Welpe, Adult UND Senior geeignet. NIE "Juniorprodukt" nennen.
- Nur die echten Produktdaten oben verwenden. Nie Marken, Preise oder Inhaltsstoffe erfinden.
- Der Katalog-Auszug ist MEINE Recherche. Behaupte NIE, der Halter hätte Produkte genannt oder "in Betracht gezogen". Ist nichts Passendes dabei → sag das und biete an, neu zu suchen.
${intent.avoidProtein?.length ? `- 🚫 ALLERGIE: KEIN ${intent.avoidProtein.join(", KEIN ")}. Empfiehl NIE ein Produkt, dessen Name oder Protein das enthält — auch nicht "zur Not". Lieber gar nichts empfehlen.\n` : "- Allergen-Sicherheit: Wenn Allergie auf X bekannt, empfehle NIE ein Produkt das X enthält.\n"}- Du duzt den Halter. Immer auf Deutsch antworten.
- Wenn du eine Studie zitierst: nur wenn sie wirklich zur Situation passt, nie aufgezwungen.
- Steht bei einem der Futter "🎁 GUTSCHEIN VERFÜGBAR" dabei: erwähne den Rabatt kurz und beiläufig (1 halber Satz), wenn du genau dieses Futter empfiehlst. Nie erfinden, nie für Futter ohne diesen Hinweis erwähnen.
- Du darfst und sollst NEIN sagen: Steht bei Futter [1] "⚠️ NIEDRIG" (Score <40) oder "⚠️ vage Proteinquelle", sag das offen — "Lass [1] lieber, der Score ist niedrig" oder "die Proteinquelle ist hier nicht klar benannt, das würde ich bei einem Allergiker nicht riskieren" — und empfiehl stattdessen [2] oder [3], wenn die besser sind. Erfinde NIEMALS eine Zutatenliste, die nicht in den Produktdaten steht — bewerte nur anhand von Score, Protein-Klarheit, getreidefrei/hypoallergen und Preis/kg.
${intent.breed ? `- Rasse "${intent.breed}" ist bekannt — beziehe dich darauf wenn sinnvoll (rassetypische Probleme, Größe, Lebenserwartung).\n` : ""}${intent.currentFood && intent.currentFood !== "bekannt" ? `- Aktuelles Futter "${intent.currentFood}" bekannt — beziehe dich bei der Empfehlung auf den Wechsel.\n` : ""}`;
}

function fallbackQuestion(): string {
  return "Erzähl mir ein bisschen mehr über deinen Hund: Wie alt ist er oder sie ungefähr (Welpe, ausgewachsen, Senior)? Und was frisst er aktuell — soll es ein Wechsel werden oder komplett neu?";
}

function fallbackRecommend(offers: ScoredFood[], intent?: DogIntent): string {
  if (!offers.length) {
    const ohne = intent?.avoidProtein?.length ? ` ohne ${intent.avoidProtein.join(" & ")}` : "";
    return `Ich hab im Katalog gerade nichts Sicheres${ohne} gefunden, das wirklich passt. Magst du einen anderen Futtertyp (Nass oder BARF) oder ein etwas größeres Budget zulassen? Dann suche ich neu.`;
  }
  const o = offers[0];
  const price = o.price_per_kg ? `${parseFloat(o.price_per_kg).toFixed(2)} €/kg` : o.price ? `${parseFloat(o.price).toFixed(2)} €` : "";
  return `Meine Empfehlung: ${o.brand} ${o.name} (${o.type}${price ? `, ${price}` : ""}). ${o.whyThis}`;
}

// ─── Logging (non-blocking) ───────────────────────────────────────────────────

async function logChat(entry: { sessionId: string; userMessage: string; bellaReply: string; offersShown: number; topFood: string | null; hadResults: boolean }) {
  const url = process.env.DATABASE_URL;
  if (!url) return;
  try {
    const sql = neon(url);
    // Schema: siehe src/db/schema.ts (chatLogs) + drizzle/-Migrationen. Kein DDL im Request-Pfad.
    await sql`INSERT INTO chat_logs (session_id,user_message,bella_reply,offers_shown,top_food,had_results)
      VALUES (${entry.sessionId},${entry.userMessage},${entry.bellaReply},${entry.offersShown},${entry.topFood},${entry.hadResults})`;
  } catch { /* never block */ }
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Missbrauchs-/Kostenschutz: zwei LLM-Calls pro Request. In-Memory pro Instanz (Roadmap Op 1.3).
  const limited = checkRateLimit(request, "advisor", [
    { limit: 15, windowMs: 60_000 },
    { limit: 150, windowMs: 60 * 60_000 },
  ]);
  if (limited) return limited;
  const badOrigin = checkSameOrigin(request);
  if (badOrigin) return badOrigin;

  let body: unknown;
  try { body = await request.json(); } catch { return new Response("Bad request", { status: 400 }); }

  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) return new Response("Invalid", { status: 400 });

  const { message, conversationHistory = [] } = parsed.data;

  // Fast-Path (Regex, 0 ms). LLM-Pfad (Gemini JSON, ~1 Call) ergänzen, wenn wir
  // gleich empfehlen (2A.6 — da zählt Genauigkeit am meisten) ODER der Fast-Path
  // dünn ist. Merge ist allergen-sicher (avoidProtein = Vereinigung).
  const fastIntent = parseIntent(message, conversationHistory);
  let intent: DogIntent = fastIntent;
  const aboutToRecommend = hasEnoughIntent(fastIntent, conversationHistory);
  if ((aboutToRecommend || intentSignalCount(fastIntent) < 3) && conversationHistory.length > 0 && llmIntentEnabled()) {
    const llm = await extractIntentLLM(message, conversationHistory);
    intent = mergeIntent(fastIntent, llm);
  }

  const confidence = computeConfidence(intent, conversationHistory);
  const theme = classifyTheme(intent);
  const ask = !hasEnoughIntent(intent, conversationHistory);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const emit = (line: string) => controller.enqueue(encoder.encode(line + "\n"));

      emit(`STEP:profile:Profil deines Hundes wird erstellt…`);
      emit(`CONF:${confidence}`);
      await new Promise(r => setTimeout(r, 120));

      let offers: ScoredFood[] = [];
      let relevantStudies: StudyCitation[] = [];
      let safetyBlocked = false;
      if (!ask) {
        emit(`STEP:scan:Futter-Katalog wird durchsucht…`);
        await new Promise(r => setTimeout(r, 100));
        const [result, studies] = await Promise.all([
          fetchCandidates(intent),
          fetchRelevantStudies(intent),
        ]);
        offers = result.offers;
        relevantStudies = studies;

        // 2A.3 Re-Query: nichts Sicheres gefunden, aber weiche Kriterien im Spiel →
        // ein zweiter Versuch ohne Futtertyp/Budget, Allergen-Ausschluss bleibt hart.
        if (offers.length === 0 && (intent.foodType || intent.maxPricePerKg)) {
          emit(`STEP:widen:Suche wird geweitet (Futtertyp/Budget gelockert)…`);
          const relaxed = await fetchCandidates(intent, { relax: true });
          offers = relaxed.offers;
        }

        // 🔴 SICHERHEITS-ASSERTION: kein gemiedenes Protein darf durchrutschen —
        // egal was oben schiefging (CLAUDE.md §4a).
        if (intent.avoidProtein?.length) {
          const before = offers.length;
          offers = offers.filter(o => !containsAnyAllergen(`${o.name} ${o.protein ?? ""}`, intent.avoidProtein));
          if (offers.length !== before) safetyBlocked = true;
        }

        emit(`STEP:load:${result.totalScanned} Futtersorten analysiert`);
        await new Promise(r => setTimeout(r, 80));
        emit(`STEP:elim:${result.eliminated} aussortiert`);
        await new Promise(r => setTimeout(r, 90));
        emit(`STEP:rank:${offers.length ? `Top ${offers.length} Futter bewertet` : "Nichts Sicheres gefunden"}`);
        if (offers.length) emit(`SCORE:${JSON.stringify(offers.map(o => ({ id: o.id, match: o.matchScore })))}`);
        if (relevantStudies.length) emit(`STUDY:${JSON.stringify(relevantStudies.map(s => ({ slug: s.slug, title: s.title, year: s.year, journal: s.journal, evidenceStrength: s.evidence_strength, topicHub: s.topic_hub })))}`);
        await new Promise(r => setTimeout(r, 80));
      } else {
        emit(`STEP:scan:Ich brauche noch ein paar Infos…`);
        await new Promise(r => setTimeout(r, 80));
      }

      emit(`STEP:reason:Antwort wird formuliert…`);

      // ── KI-Text ──
      let fullText = "";
      const sysPrompt = buildSystemPrompt(offers, confidence, ask, intent, relevantStudies);
      const history = conversationHistory.slice(-8);
      const geminiKey = process.env.GEMINI_API_KEY;
      const anthropicKey = process.env.ANTHROPIC_API_KEY;

      if (geminiKey) {
        try {
          const genAI = new GoogleGenerativeAI(geminiKey);
          const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction: sysPrompt });
          // maxOutputTokens 600→1200: Gemini 2.5 Flash verbraucht bei kurzen Antworten
          // teils Thinking-Tokens aus demselben Budget — bei 600 bricht die Antwort
          // mittendrin ab. 1200 gibt genug Raum für vollständige Empfehlungen.
          // thinkingBudget: 0 → Thinking deaktiviert: konversationelle Beratung braucht kein
          // Chain-of-Thought — spart Tokens und verhindert dass Thinking-Tokens das sichtbare
          // Output-Budget auffressen (Gemini 2.5 Flash verrechnet Thinking gegen maxOutputTokens).
          // maxOutputTokens 2048: Empfehlung + Kontext + Tipp + Folgefrage ~400-600 Tokens,
          // Frage mit Acknowledgment + Optionen ~200-300 Tokens — 2048 gibt sicheren Puffer.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const genConfig: any = { temperature: 0.8, maxOutputTokens: 2048, thinkingConfig: { thinkingBudget: 0 } };
          const chat = model.startChat({
            history: history.map(h => ({ role: h.role === "assistant" ? "model" : "user", parts: [{ text: h.content }] })),
            generationConfig: genConfig,
          });
          const result = await chat.sendMessageStream(message);
          for await (const chunk of result.stream) { const t = chunk.text(); if (t) { fullText += t; emit(`TEXT:${t.replace(/\r?\n/g, "\\n")}`); } }
        } catch { fullText = ""; }
      }
      if (!fullText && anthropicKey) {
        try {
          const anthropic = new Anthropic({ apiKey: anthropicKey });
          const msgs = [...history.map(h => ({ role: h.role as "user" | "assistant", content: h.content })), { role: "user" as const, content: message }];
          const resp = await anthropic.messages.create({ model: "claude-haiku-4-5", max_tokens: 1536, temperature: 0.8, system: sysPrompt, messages: msgs, stream: true });
          for await (const event of resp) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") { const t = event.delta.text; if (t) { fullText += t; emit(`TEXT:${t.replace(/\r?\n/g, "\\n")}`); } }
          }
        } catch { fullText = ""; }
      }
      if (!fullText) {
        fullText = ask ? fallbackQuestion() : fallbackRecommend(offers, intent);
        for (const w of fullText.split(" ")) { emit(`TEXT:${w.replace(/\r?\n/g, "\\n")} `); await new Promise(r => setTimeout(r, 25)); }
      }

      emit(`STEP:done:${ask ? "Frage bereit" : "Analyse abgeschlossen"}`);

      // ── Begriffserklärung → Vertiefungs-Link auf bestehende Ratgeber-Seiten ──
      const glossaryLinks = findGlossaryLinks(`${message} ${fullText}`, 2);
      if (glossaryLinks.length) emit(`LINKS:${JSON.stringify(glossaryLinks)}`);

      // 🔴 Letzte Verteidigungslinie vor dem Ausliefern: kein gemiedenes Protein
      // in der OFFERS-Payload. Was hier noch rausfliegt, wäre ein Bug oben.
      if (!ask && intent.avoidProtein?.length) {
        const before = offers.length;
        offers = offers.filter(o => !containsAnyAllergen(`${o.name} ${o.protein ?? ""}`, intent.avoidProtein));
        if (offers.length !== before) safetyBlocked = true;
      }

      const offerPayload = ask ? [] : offers.map(o => ({
        id: o.id,
        slug: o.slug,            // für Preis-Wecker (Schicht 2): keyed auf price_history.food_slug
        name: o.name,
        brand: o.brand,
        type: o.type,
        protein: o.protein,
        pricePerKg: o.price_per_kg != null ? parseFloat(o.price_per_kg) : null,
        price: o.price != null ? parseFloat(o.price) : null,
        suitableFor: o.suitable_for,
        rating: o.rating != null ? parseFloat(o.rating) : null,
        imageUrl: o.image_url,
        affiliateUrl: o.affiliate_url,
        whyThis: o.whyThis,
      }));

      emit(`OFFERS:${JSON.stringify({ offers: offerPayload, theme, confidence })}`);

      // ── Schicht 1: kuratierte Begleitprodukte (max. 3, je mit „warum", Allergen-Ausschluss) ──
      if (!ask && offers.length > 0) {
        const allText = [...conversationHistory.map(h => h.content), message].join(" ").toLowerCase();
        const jointBreed = /labrador|retriever|sch[äa]ferhund|berner|rottweiler|dogge|boxer|sennenhund/.test(allText);
        const issues: string[] = [];
        if (intent.sensitive) issues.push("haut", "fell", "magen", "verdauung");
        if (jointBreed || intent.lifePhase === "senior") issues.push("gelenke");
        if (/zahn|zahnstein|mundgeruch|dental/.test(allText)) issues.push("zahn");
        if (/stress|angst|beruhig|nervös/.test(allText)) issues.push("stress");
        if (/niere|nierenprobleme|renal/.test(allText)) issues.push("niere");
        if (/leber|leberprobleme/.test(allText)) issues.push("leber");
        if (/[üu]bergewicht|zu dick|dicke/.test(allText)) issues.push("uebergewicht");
        if (intent.lifePhase === "welpen") issues.push("spielen");
        try {
          const companions = await getCompanions({
            issues,
            lifeStage: intent.lifePhase ? [intent.lifePhase] : [],
            avoidProteins: intent.avoidProtein ?? [],
          }, 3);
          if (companions.length) emit(`COMPANIONS:${JSON.stringify({ companions })}`);
        } catch { /* Cross-Sell ist optional, nie blockierend */ }
      }

      // ── Futter-Pass: Profil anlegen (non-blocking, 500er nie sichtbar) ──
      // Futter-Pass nur für eine sichere, echte Hauptfutter-Empfehlung (2A.5).
      if (!ask && offers.length > 0 && offers[0].type !== "snack" && process.env.DATABASE_URL) {
        try {
          const allConv = [...conversationHistory.map(h => h.content), message].join(" ");
          // Hundename erkennen: "heißt Bello", "mein Hund Bello", "meine Hündin Luna"
          const nameMatch = allConv.match(/hei[ßs]t\s+([A-Za-zÀ-ž]{2,14})/u)
            || allConv.match(/(?:[Hh]und|[Hh]ündin|[Rr]üde|[Ww]elpe)[^A-Za-z]+([A-ZÀ-ž][a-zÀ-ž]{1,13})/u);
          // Stoppwörter: häufige groß geschriebene Wörter am Satzanfang/nach Komma, keine echten Namen.
          const NAME_STOPWORDS = new Set(["Er", "Sie", "Es", "Mein", "Meine", "Unser", "Unsere", "Der", "Die", "Das", "Und", "Aber", "Hat", "Ist", "War", "Frisst", "Wir", "Ich"]);
          const rawName = nameMatch?.[1] && !NAME_STOPWORDS.has(nameMatch[1]) ? nameMatch[1] : null;
          const breedName = intent.breed
            ? intent.breed.split(/[\s-]/)[0].replace(/^./, (c) => c.toUpperCase()) + "-Hund"
            : null;
          const dogName = rawName || breedName || "Bello";
          // Gewicht parsen: "15 kg", "15,5 kg", "15.5 kg"
          const allNorm = allConv.toLowerCase().normalize("NFC").replace(/ü/g, "ue").replace(/ä/g, "ae").replace(/ö/g, "oe");
          const wMatch = allNorm.match(/(\d+(?:[.,]\d+)?)\s*(?:kg|kilo)/);
          const weightKg = wMatch ? parseFloat(wMatch[1].replace(",", ".")) : null;
          // Alter: "3 jahre", "8 monate", "6 wochen" — sonst lifePhase als Fallback
          const ageRaw = allNorm.match(/\b(\d+)\s*(?:jahre?|monate?|wochen?)\b/);
          const lifePhaseFallback = intent.lifePhase === "welpen" ? "Welpe" : intent.lifePhase === "senior" ? "Senior" : null;
          const birthOrAge = ageRaw ? ageRaw[0].trim() : lifePhaseFallback;
          const actLevel: ActivityLevel = intent.lifePhase === "welpen" ? "niedrig" : intent.lifePhase === "senior" ? "niedrig" : "mittel";
          const dg = weightKg ? dailyGrams(weightKg, actLevel) : null;
          // Packungsgröße aus dem Produktnamen schätzen (z.B. "… 9 kg") für den Nachschub-Wecker.
          // Nur plausible Hauptfutter-Größen (≥ 0,5 kg) — sonst lieber keine Schätzung als eine falsche (2A.7).
          const pkgMatch = offers[0].name?.match(/(\d+(?:[.,]\d+)?)\s*kg\b/i);
          const packageKg = pkgMatch ? parseFloat(pkgMatch[1].replace(",", ".")) : null;
          const estBagDays = dg && packageKg && packageKg >= 0.5 ? Math.round((packageKg * 1000) / dg) : null;
          const shareToken = randomBytes(18).toString("hex");
          const profileSql = neon(process.env.DATABASE_URL);
          const [row] = await profileSql`
            INSERT INTO dog_profiles (
              name, breed_slug, weight_kg, activity_level, allergies, health_flags,
              current_food_slug, est_daily_grams, est_bag_days, share_token, share_enabled, birth_or_age
            ) VALUES (
              ${dogName},
              ${intent.breedSlug ?? (intent.breed ? intent.breed.toLowerCase().replace(/\s+/g, "-") : null)},
              ${weightKg ?? null},
              ${actLevel},
              ${intent.avoidProtein?.length ? intent.avoidProtein : null},
              ${intent.lifePhase ? [intent.lifePhase] : null},
              ${offers[0].slug ?? null},
              ${dg ?? null},
              ${estBagDays ?? null},
              ${shareToken},
              true,
              ${birthOrAge ?? null}
            ) RETURNING id, share_token`;
          const topPricePerKg = offers[0].price_per_kg != null ? parseFloat(offers[0].price_per_kg) : null;
          const monthlyEuro = dg && topPricePerKg ? parseFloat(((dg / 1000) * 30 * topPricePerKg).toFixed(2)) : null;
          emit(`PROFILE:${JSON.stringify({
            id: row.id, shareToken: row.share_token, name: dogName, dailyGrams: dg,
            currentFood: offers[0].name, foodSlug: offers[0].slug ?? null, affiliateUrl: offers[0].affiliate_url ?? null,
            pricePerKg: topPricePerKg, monthlyEuro, estBagDays,
          })}`);
        } catch { /* never block the stream */ }
      }

      controller.close();

      logChat({
        sessionId: parsed.data.sessionId ?? "anon",
        userMessage: message,
        bellaReply: `${safetyBlocked ? "[SAFETY_BLOCKED] " : ""}${fullText.trim()}`.slice(0, 2000),
        offersShown: offers.length, topFood: offers[0] ? `${offers[0].brand} ${offers[0].name}` : null,
        hadResults: offers.length > 0,
      });
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache, no-transform", "X-Accel-Buffering": "no" },
  });
}
