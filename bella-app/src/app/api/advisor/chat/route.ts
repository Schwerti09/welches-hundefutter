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
import { findGlossaryLinks } from "@/lib/glossary-links";
import { logError, logWarn } from "@/lib/log";
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
import { planModels } from "@/lib/advisor/models";
import type { ScoredFood } from "@/lib/advisor/scoring";
import { fetchCandidates, fetchRelevantStudies, type StudyCitation } from "@/lib/advisor/candidates";
import { buildSystemPrompt, fallbackQuestion, fallbackRecommend } from "@/lib/advisor/prompt";
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
      const plan = planModels(ask); // 2.2: schnell fragen / stark empfehlen

      // 2.3: Provider mit hartem Timeout, Fehler strukturiert loggen (nie still).
      const withTimeout = <T,>(pr: Promise<T>, ms: number, tag: string): Promise<T> => {
        let timer: ReturnType<typeof setTimeout>;
        return Promise.race([
          pr,
          new Promise<T>((_, rej) => { timer = setTimeout(() => rej(new Error(`${tag} timeout ${ms}ms`)), ms); }),
        ]).finally(() => clearTimeout(timer));
      };
      const providerErrors: string[] = [];

      if (geminiKey) {
        try {
          const genAI = new GoogleGenerativeAI(geminiKey);
          const model = genAI.getGenerativeModel({ model: plan.gemini.model, systemInstruction: sysPrompt });
          // thinkingBudget: 0 im Frage-Turn (kein Chain-of-Thought nötig), > 0 im
          // Empfehlungs-Turn (Produkte abwägen, Warnungen beachten). Gemini 2.5 Flash
          // verrechnet Thinking gegen maxOutputTokens → beim Empfehlen mehr Budget.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const genConfig: any = {
            temperature: 0.8,
            maxOutputTokens: plan.gemini.maxOutputTokens,
            thinkingConfig: { thinkingBudget: plan.gemini.thinkingBudget },
          };
          const chat = model.startChat({
            history: history.map(h => ({ role: h.role === "assistant" ? "model" : "user", parts: [{ text: h.content }] })),
            generationConfig: genConfig,
          });
          const result = await withTimeout(chat.sendMessageStream(message), plan.timeoutMs, "gemini");
          for await (const chunk of result.stream) { const t = chunk.text(); if (t) { fullText += t; emit(`TEXT:${t.replace(/\r?\n/g, "\\n")}`); } }
        } catch (e) {
          fullText = "";
          const msg = e instanceof Error ? e.message : String(e);
          providerErrors.push(`gemini(${plan.gemini.model}): ${msg}`);
          logError("advisor.gemini", e, { plan: plan.label, model: plan.gemini.model });
        }
      }
      if (!fullText && anthropicKey) {
        try {
          const anthropic = new Anthropic({ apiKey: anthropicKey });
          const msgs = [...history.map(h => ({ role: h.role as "user" | "assistant", content: h.content })), { role: "user" as const, content: message }];
          const resp = await withTimeout(
            anthropic.messages.create({ model: plan.anthropic.model, max_tokens: plan.anthropic.maxTokens, temperature: 0.8, system: sysPrompt, messages: msgs, stream: true }),
            plan.timeoutMs, "anthropic",
          );
          for await (const event of resp) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") { const t = event.delta.text; if (t) { fullText += t; emit(`TEXT:${t.replace(/\r?\n/g, "\\n")}`); } }
          }
        } catch (e) {
          fullText = "";
          const msg = e instanceof Error ? e.message : String(e);
          providerErrors.push(`anthropic(${plan.anthropic.model}): ${msg}`);
          logError("advisor.anthropic", e, { plan: plan.label, model: plan.anthropic.model });
        }
      }
      if (!fullText) {
        if (providerErrors.length) emit(`WARN:degraded`); // Client kann einen Retry-Hinweis zeigen
        logWarn("advisor.degraded", "beide Provider ohne Antwort → deterministischer Fallback", { providerErrors });
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
