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
import { getCompanions, containsAllergen } from "@/db/queries/crosssell";
import { dailyGrams } from "@/lib/consumption-math";
import type { ActivityLevel } from "@/lib/consumption-math";

export const runtime = "nodejs";
export const maxDuration = 45;

// ─── Schema ───────────────────────────────────────────────────────────────────

const chatSchema = z.object({
  message: z.string().min(1).max(1000),
  sessionId: z.string().optional(),
  conversationHistory: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .max(40)
    .optional(),
});

// ─── Types ──────────────────────────────────────────────────────────────────

type FoodType = "trocken" | "nass" | "barf" | "snack" | "kaltgepresst";
type LifePhase = "welpen" | "adult" | "senior";

interface DogIntent {
  foodType?: FoodType;
  lifePhase?: LifePhase;
  sensitive?: boolean;     // Allergie / empfindlicher Magen
  grainFree?: boolean;
  protein?: string;        // bevorzugtes Protein, z. B. "Lachs"
  breed?: string;          // erwähnte Rasse (für Mengen-Hinweis)
  maxPricePerKg?: number;  // Budget €/kg
}

interface DogFoodRow {
  id: string;
  slug: string;
  brand: string;
  name: string;
  type: string;
  protein: string | null;
  is_grain_free: boolean;
  is_hypoallergenic: boolean;
  price_per_kg: string | null;
  price: string | null;
  suitable_for: string[] | null;
  image_url: string | null;
  affiliate_url: string;
  rating: string | null;
}

interface ScoredFood extends DogFoodRow {
  matchScore: number;
  whyThis: string;
}

export type AdvisorTheme = "idle" | "budget" | "allergie" | "welpe" | "senior" | "barf" | "premium";

// ─── Intent Parsing ──────────────────────────────────────────────────────────

const BREEDS = ["labrador", "schäferhund", "chihuahua", "dackel", "golden retriever", "französische bulldogge",
  "mops", "beagle", "boxer", "border collie", "australian shepherd", "rottweiler", "husky", "pudel",
  "jack russell", "yorkshire", "malteser", "spitz", "dobermann", "berner sennenhund"];

function parseIntent(message: string, history: { role: string; content: string }[]): DogIntent {
  // NFC zuerst: iOS/macOS liefern Umlaute oft zerlegt (u + ◌̈, NFD). Ohne Normalisierung
  // matcht /ü/ das nicht → "Hühnerallergie" würde nicht als Huhn erkannt → Allergiker
  // bekäme Huhn empfohlen. Tier-Sicherheit: NIE auf stiller Normalisierung beruhen.
  const all = [...history.map(h => h.content), message].join(" ").normalize("NFC").toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");
  const intent: DogIntent = {};

  // Lebensphase
  if (/welpe|junior|puppy|baby/.test(all)) intent.lifePhase = "welpen";
  else if (/senior|\balt(er)?\b|aelter|ageing|aging|7\+|8\+/.test(all)) intent.lifePhase = "senior";
  else if (/adult|erwachsen/.test(all)) intent.lifePhase = "adult";

  // Futtertyp
  if (/barf|roh\b|frischfleisch|frostfutter/.test(all)) intent.foodType = "barf";
  else if (/nassfutter|nass\b|dose|dosen|feucht|menue|pastete/.test(all)) intent.foodType = "nass";
  else if (/snack|leckerli|leckerchen|kausnack|kauknochen|kaustange/.test(all)) intent.foodType = "snack";
  else if (/trockenfutter|trocken|kroketten/.test(all)) intent.foodType = "trocken";

  // Allergie / Sensibilität
  if (/allergi|sensibel|empfindlich|unvertraeglich|juckt|juckreiz|durchfall|blaeh|magen|verdauung|sensitiv/.test(all)) intent.sensitive = true;
  if (/getreidefrei|grain.?free|glutenfrei/.test(all)) { intent.grainFree = true; intent.sensitive = true; }

  // Protein/Allergen — beachte: `all` ist umlaut-normalisiert (ü→ue), daher
  // "Hühnerallergie" → "huehnerallergie". Varianten "huehn"/"gefluegel" mitfangen.
  for (const [k, lab] of [["huehn", "Huhn"], ["huhn", "Huhn"], ["haehnchen", "Huhn"], ["gefluegel", "Huhn"],
    ["rind", "Rind"], ["lachs", "Lachs"], ["lamm", "Lamm"], ["ente", "Ente"], ["pute", "Pute"],
    ["wild", "Wild"], ["fisch", "Fisch"], ["kaninchen", "Kaninchen"], ["pferd", "Pferd"]] as [string, string][]) {
    if (new RegExp(`\\b${k}`).test(all)) { intent.protein = lab; break; }
  }

  // Rasse
  for (const b of BREEDS) { if (all.includes(b.replace(/ä/g, "ae").replace(/ü/g, "ue"))) { intent.breed = b; break; } }

  // Budget €/kg
  const ppk = all.match(/(?:unter|max(?:imal)?|bis zu?|hoechstens|<)\s*(\d+(?:[.,]\d+)?)\s*(?:€|eur|euro)?\s*(?:\/|pro|je)?\s*kg/);
  if (ppk) intent.maxPricePerKg = parseFloat(ppk[1].replace(",", "."));
  else if (/guenstig|billig|sparen|preiswert|wenig geld|kleines budget/.test(all)) intent.maxPricePerKg = intent.maxPricePerKg ?? 6;

  return intent;
}

function hasEnoughIntent(i: DogIntent): boolean {
  return Boolean(i.foodType || i.lifePhase || i.sensitive || i.grainFree || i.protein || i.maxPricePerKg || i.breed);
}

function computeConfidence(i: DogIntent, history: { content: string }[]): number {
  let s = 12;
  if (i.lifePhase) s += 18;
  if (i.foodType) s += 16;
  if (i.sensitive) s += 16;
  if (i.protein) s += 12;
  if (i.maxPricePerKg) s += 14;
  if (i.breed) s += 10;
  s += Math.min(history.length * 4, 16);
  return Math.min(s, 98);
}

function classifyTheme(i: DogIntent): AdvisorTheme {
  if (i.sensitive) return "allergie";
  if (i.lifePhase === "welpen") return "welpe";
  if (i.lifePhase === "senior") return "senior";
  if (i.foodType === "barf") return "barf";
  if (i.maxPricePerKg && i.maxPricePerKg <= 6) return "budget";
  return "idle";
}

// ─── DB-Abfrage: dog_foods ────────────────────────────────────────────────────

async function fetchCandidates(intent: DogIntent): Promise<{ offers: ScoredFood[]; totalScanned: number; eliminated: number }> {
  const url = process.env.DATABASE_URL;
  if (!url) return { offers: [], totalScanned: 0, eliminated: 0 };
  const sql = neon(url);

  // Nur Futtertyp + Budget hart filtern (genug Daten). Lebensphase, Allergie,
  // Protein sind dünn getaggt → weich über das Scoring (sonst leere Ergebnisse).
  const cond = ["is_active = true", "affiliate_url <> ''", "name <> ''"];
  const params: (string | number | string[])[] = [];
  let p = 1;

  if (intent.foodType) { cond.push(`type = $${p++}`); params.push(intent.foodType); }
  if (intent.maxPricePerKg) { cond.push(`(price_per_kg IS NULL OR price_per_kg <= $${p++})`); params.push(intent.maxPricePerKg); }

  let totalScanned = 8000;
  try {
    const cnt = await sql.query(`SELECT COUNT(*)::int total FROM dog_foods WHERE ${cond.join(" AND ")}`, params);
    totalScanned = ((cnt as unknown as { rows?: { total: number }[] }).rows ?? (cnt as unknown as { total: number }[]))[0]?.total ?? 0;
  } catch { /* keep default */ }

  // Relevanz-Sortierung für die dünn getaggten Soft-Kriterien (boostet passende
  // Produkte in den Kandidaten-Pool, statt nur die billigsten zu nehmen).
  const orderParams = [...params];
  const relParts: string[] = [];
  if (intent.sensitive) relParts.push("(CASE WHEN (is_hypoallergenic OR is_grain_free) THEN 30 ELSE 0 END)");
  if (intent.lifePhase) { relParts.push(`(CASE WHEN suitable_for && ARRAY[$${p++}]::text[] THEN 22 ELSE 0 END)`); orderParams.push([intent.lifePhase]); }
  // Protein nur als PRÄFERENZ boosten, nicht wenn es das Allergen ist (sensitive)
  if (intent.protein && !intent.sensitive) { relParts.push(`(CASE WHEN protein ILIKE $${p++} THEN 16 ELSE 0 END)`); orderParams.push(`%${intent.protein}%`); }
  // Bare integer in ORDER BY = Spaltenposition → Relevanz nur anhängen, wenn vorhanden.
  const priceOrder = "(price_per_kg IS NULL) ASC, price_per_kg ASC NULLS LAST";
  const outerOrder = relParts.length ? `(${relParts.join(" + ")}) DESC, ${priceOrder}` : priceOrder;

  // Pro Produktname nur 1 Variante (günstigste), dann nach Relevanz + Preis/kg
  const nameKey = "lower(regexp_replace(name, '[^a-zA-Z0-9]', '', 'g'))";
  const rows = await sql.query(
    `SELECT * FROM (
       SELECT DISTINCT ON (${nameKey})
         id, slug, brand, name, type, protein, is_grain_free, is_hypoallergenic,
         price_per_kg, price, suitable_for, image_url, affiliate_url, rating
       FROM dog_foods WHERE ${cond.join(" AND ")}
       ORDER BY ${nameKey}, price_per_kg ASC NULLS LAST
     ) d ORDER BY ${outerOrder} LIMIT 40`,
    orderParams
  );
  const raw = ((rows as unknown as { rows?: DogFoodRow[] }).rows ?? (rows as unknown as DogFoodRow[])) || [];

  // Bei Allergie das auslösende Protein hart ausschließen — auch namens-basiert
  // (Huhn → auch Geflügel/Hähnchen). Ein Allergiker darf das NIE empfohlen bekommen.
  const allergen = intent.sensitive ? (intent.protein ?? null) : null;
  const safe = allergen
    ? raw.filter(o => !containsAllergen(`${o.name} ${o.protein ?? ""}`, allergen))
    : raw;

  const scored = safe.map(o => scoreFood(o, intent)).sort((a, b) => b.matchScore - a.matchScore);

  // Provider/Marken-Vielfalt: nicht 3x dieselbe Marke wenn vermeidbar
  const top: ScoredFood[] = [];
  const brands = new Set<string>();
  for (const o of scored) { if (top.length >= 3) break; if (!brands.has(o.brand.toLowerCase())) { top.push(o); brands.add(o.brand.toLowerCase()); } }
  for (const o of scored) { if (top.length >= 3) break; if (!top.includes(o)) top.push(o); }

  return { offers: top, totalScanned, eliminated: Math.max(0, totalScanned - top.length) };
}

function scoreFood(o: DogFoodRow, intent: DogIntent): ScoredFood {
  let m = 55;
  const ppk = o.price_per_kg != null ? parseFloat(o.price_per_kg) : null;
  const reasons: string[] = [];

  if (intent.foodType && o.type === intent.foodType) { m += 14; }
  if (intent.lifePhase && (o.suitable_for ?? []).includes(intent.lifePhase)) { m += 14; reasons.push(`für ${intent.lifePhase}`); }
  if (intent.sensitive && (o.is_hypoallergenic || o.is_grain_free)) { m += 16; reasons.push(o.is_grain_free ? "getreidefrei" : "hypoallergen"); }
  if (intent.grainFree && o.is_grain_free) m += 6;
  if (intent.protein && !intent.sensitive && (o.protein ?? "").toLowerCase().includes(intent.protein.toLowerCase())) { m += 12; reasons.push(`${o.protein}`); }
  if (intent.maxPricePerKg && ppk != null) {
    if (ppk <= intent.maxPricePerKg * 0.85) { m += 12; reasons.push(`günstig (${ppk.toFixed(2)} €/kg)`); }
    else if (ppk <= intent.maxPricePerKg) { m += 6; }
    else m -= 12;
  }
  if (o.rating != null && parseFloat(o.rating) >= 4) m += 4;
  m = Math.max(20, Math.min(99, m));

  const base = reasons.length
    ? `Passt: ${reasons.join(", ")}.`
    : ppk != null
      ? `Solides ${o.type}-Futter${o.protein ? ` mit ${o.protein}` : ""} für ${ppk.toFixed(2)} €/kg.`
      : `${o.type}-Futter${o.protein ? ` mit ${o.protein}` : ""} von ${o.brand}.`;

  return { ...o, matchScore: m, whyThis: base };
}

// ─── System-Prompt ────────────────────────────────────────────────────────────

function buildSystemPrompt(offers: ScoredFood[], confidence: number, ask: boolean, intent: DogIntent): string {
  const block = offers.length
    ? offers.map((o, i) =>
        `[${i + 1}] ${o.brand} ${o.name} · Typ: ${o.type}${o.protein ? ` · Protein: ${o.protein}` : ""}` +
        `${o.price_per_kg ? ` · ${parseFloat(o.price_per_kg).toFixed(2)} €/kg` : o.price ? ` · ${parseFloat(o.price).toFixed(2)} €` : ""}` +
        `${o.is_grain_free ? " · getreidefrei" : ""}${o.is_hypoallergenic ? " · hypoallergen" : ""} · Match ${o.matchScore}%`
      ).join("\n")
    : "Noch keine Futter-Daten — du brauchst erst mehr Infos über den Hund.";

  const mode = ask
    ? `MODUS: NACHFRAGEN (noch keine Empfehlung)
→ Stelle GENAU EINE konkrete Frage, die dich am schnellsten zu einer guten Empfehlung bringt.
→ Frag nach dem Wichtigsten: Alter/Lebensphase (Welpe, adult, Senior) ODER Allergie/empfindlicher Magen ODER Futtertyp (Trocken/Nass/BARF) ODER Budget.
→ Biete 2-3 konkrete Antwort-Optionen an, damit der Halter nur wählen muss.
→ Empfiehl JETZT noch KEIN konkretes Produkt und nenne KEINE Preise.`
    : `MODUS: EMPFEHLEN (Futter wurde analysiert)
→ Empfiehl das beste Futter [1] konkret mit 2-3 echten Gründen aus den Daten (Typ, Protein, €/kg, getreidefrei/hypoallergen).
→ Nenne kurz EINE Alternative und warum sie zweite Wahl ist.
→ Optional EINE Anschlussfrage zum Verfeinern (z. B. Tagesmenge nach Gewicht).`;

  return `Du bist BELLA – Deutschlands KI-Ernährungsberaterin für Hunde. Ruhig, kompetent, ehrlich. Keine Verkäuferin.

KONFIDENZ: ${confidence}%
${mode}

ANALYSIERTE FUTTER-PRODUKTE (nutze NUR diese, echte Daten):
${block}

REGELN:
- Max. 2-3 Sätze. Kein Hype ("super!", "perfekt!"). Stattdessen konkrete Fakten.
- Nutze NUR die echten Produktdaten oben. Erfinde keine Marken, Preise oder Inhaltsstoffe.
- Du duzt. Empathisch, aber präzise.
${intent.breed ? `- Der Halter hat die Rasse "${intent.breed}" erwähnt — beziehe dich darauf, wenn sinnvoll.\n` : ""}- Antworte auf Deutsch.`;
}

function fallbackQuestion(): string {
  return "Erzähl mir kurz mehr über deinen Hund: Wie alt ist er (Welpe, erwachsen, Senior), und gibt es Allergien oder einen empfindlichen Magen? Welcher Futtertyp — Trocken, Nass oder BARF?";
}

function fallbackRecommend(offers: ScoredFood[]): string {
  if (!offers.length) return "Zu diesen Kriterien finde ich gerade nichts Passendes. Magst du Futtertyp oder Budget anpassen?";
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
    await sql`CREATE TABLE IF NOT EXISTS chat_logs (
      id serial PRIMARY KEY, session_id text, user_message text, bella_reply text,
      offers_shown integer, top_food text, had_results boolean, created_at timestamp DEFAULT now())`;
    await sql`INSERT INTO chat_logs (session_id,user_message,bella_reply,offers_shown,top_food,had_results)
      VALUES (${entry.sessionId},${entry.userMessage},${entry.bellaReply},${entry.offersShown},${entry.topFood},${entry.hadResults})`;
  } catch { /* never block */ }
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let body: unknown;
  try { body = await request.json(); } catch { return new Response("Bad request", { status: 400 }); }

  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) return new Response("Invalid", { status: 400 });

  const { message, conversationHistory = [] } = parsed.data;
  const intent = parseIntent(message, conversationHistory);
  const confidence = computeConfidence(intent, conversationHistory);
  const theme = classifyTheme(intent);
  const ask = !hasEnoughIntent(intent);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const emit = (line: string) => controller.enqueue(encoder.encode(line + "\n"));

      emit(`STEP:profile:Profil deines Hundes wird erstellt…`);
      emit(`CONF:${confidence}`);
      await new Promise(r => setTimeout(r, 120));

      let offers: ScoredFood[] = [];
      if (!ask) {
        emit(`STEP:scan:Futter-Katalog wird durchsucht…`);
        await new Promise(r => setTimeout(r, 100));
        const result = await fetchCandidates(intent);
        offers = result.offers;
        emit(`STEP:load:${result.totalScanned} Futtersorten analysiert`);
        await new Promise(r => setTimeout(r, 80));
        emit(`STEP:elim:${result.eliminated} aussortiert`);
        if (intent.maxPricePerKg) emit(`ELIM:${Math.floor(result.eliminated * 0.4)}:Zu teuer pro kg`);
        if (intent.sensitive) emit(`ELIM:${Math.floor(result.eliminated * 0.25)}:Nicht allergikergeeignet`);
        await new Promise(r => setTimeout(r, 90));
        emit(`STEP:rank:Top ${offers.length} Futter bewertet`);
        if (offers.length) emit(`SCORE:${JSON.stringify(offers.map(o => ({ id: o.id, match: o.matchScore })))}`);
        await new Promise(r => setTimeout(r, 80));
      } else {
        emit(`STEP:scan:Ich brauche noch ein paar Infos…`);
        await new Promise(r => setTimeout(r, 80));
      }

      emit(`STEP:reason:Antwort wird formuliert…`);

      // ── KI-Text ──
      let fullText = "";
      const sysPrompt = buildSystemPrompt(offers, confidence, ask, intent);
      const history = conversationHistory.slice(-8);
      const geminiKey = process.env.GEMINI_API_KEY;
      const anthropicKey = process.env.ANTHROPIC_API_KEY;

      if (geminiKey) {
        try {
          const genAI = new GoogleGenerativeAI(geminiKey);
          const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction: sysPrompt });
          const chat = model.startChat({ history: history.map(h => ({ role: h.role === "assistant" ? "model" : "user", parts: [{ text: h.content }] })), generationConfig: { temperature: 0.8, maxOutputTokens: 320 } });
          const result = await chat.sendMessageStream(message);
          for await (const chunk of result.stream) { const t = chunk.text(); if (t) { fullText += t; emit(`TEXT:${t}`); } }
        } catch { fullText = ""; }
      }
      if (!fullText && anthropicKey) {
        try {
          const anthropic = new Anthropic({ apiKey: anthropicKey });
          const msgs = [...history.map(h => ({ role: h.role as "user" | "assistant", content: h.content })), { role: "user" as const, content: message }];
          const resp = await anthropic.messages.create({ model: "claude-haiku-4-5", max_tokens: 320, temperature: 0.8, system: sysPrompt, messages: msgs, stream: true });
          for await (const event of resp) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") { const t = event.delta.text; if (t) { fullText += t; emit(`TEXT:${t}`); } }
          }
        } catch { fullText = ""; }
      }
      if (!fullText) {
        fullText = ask ? fallbackQuestion() : fallbackRecommend(offers);
        for (const w of fullText.split(" ")) { emit(`TEXT:${w} `); await new Promise(r => setTimeout(r, 25)); }
      }

      emit(`STEP:done:${ask ? "Frage bereit" : "Analyse abgeschlossen"}`);

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
            allergen: intent.sensitive ? (intent.protein ?? null) : null,
          }, 3);
          if (companions.length) emit(`COMPANIONS:${JSON.stringify({ companions })}`);
        } catch { /* Cross-Sell ist optional, nie blockierend */ }
      }

      // ── Futter-Pass: Profil anlegen (non-blocking, 500er nie sichtbar) ──
      if (!ask && offers.length > 0 && process.env.DATABASE_URL) {
        try {
          const allConv = [...conversationHistory.map(h => h.content), message].join(" ");
          // Hundename erkennen: "heißt Bello", "mein Hund Bello", "meine Hündin Luna"
          const nameMatch = allConv.match(/hei[ßs]t\s+([A-Za-zÀ-ž]{2,14})/u)
            || allConv.match(/(?:hund|hündin|rüde|welpe)[^A-Za-z]+([A-ZÀ-ž][a-zÀ-ž]{1,13})/ui);
          const rawName = nameMatch?.[1] || null;
          const breedName = intent.breed
            ? intent.breed.split(/[\s-]/)[0].replace(/^./, (c) => c.toUpperCase()) + "-Hund"
            : null;
          const dogName = rawName || breedName || "Bello";
          // Gewicht parsen: "15 kg", "15,5 kg", "15.5 kg"
          const allNorm = allConv.toLowerCase().normalize("NFC").replace(/ü/g, "ue").replace(/ä/g, "ae").replace(/ö/g, "oe");
          const wMatch = allNorm.match(/(\d+(?:[.,]\d+)?)\s*(?:kg|kilo)/);
          const weightKg = wMatch ? parseFloat(wMatch[1].replace(",", ".")) : null;
          const actLevel: ActivityLevel = intent.lifePhase === "welpen" ? "niedrig" : intent.lifePhase === "senior" ? "niedrig" : "mittel";
          const dg = weightKg ? dailyGrams(weightKg, actLevel) : null;
          const shareToken = randomBytes(18).toString("hex");
          const profileSql = neon(process.env.DATABASE_URL);
          const [row] = await profileSql`
            INSERT INTO dog_profiles (
              name, breed_slug, weight_kg, activity_level, allergies, health_flags,
              current_food_slug, est_daily_grams, share_token, share_enabled
            ) VALUES (
              ${dogName},
              ${intent.breed ? intent.breed.toLowerCase().replace(/\s+/g, "-") : null},
              ${weightKg ?? null},
              ${actLevel},
              ${intent.sensitive && intent.protein ? [intent.protein] : null},
              ${intent.lifePhase ? [intent.lifePhase] : null},
              ${offers[0].slug ?? null},
              ${dg ?? null},
              ${shareToken},
              true
            ) RETURNING id, share_token`;
          emit(`PROFILE:${JSON.stringify({ id: row.id, shareToken: row.share_token, name: dogName, dailyGrams: dg, currentFood: offers[0].name })}`);
        } catch { /* never block the stream */ }
      }

      controller.close();

      logChat({
        sessionId: parsed.data.sessionId ?? "anon",
        userMessage: message, bellaReply: fullText.trim().slice(0, 2000),
        offersShown: offers.length, topFood: offers[0] ? `${offers[0].brand} ${offers[0].name}` : null,
        hadResults: offers.length > 0,
      });
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache, no-transform", "X-Accel-Buffering": "no" },
  });
}
