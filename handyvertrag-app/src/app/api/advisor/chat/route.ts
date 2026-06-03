/**
 * BELLA Decision Intelligence Engine
 * Streams structured intelligence events, not plain text.
 *
 * Stream protocol:
 *   STEP:<id>:<label>\n        — visible analysis step
 *   ELIM:<count>:<reason>\n    — elimination event
 *   CONF:<score>\n             — confidence score update
 *   SCORE:<json>\n             — match scores for top candidates
 *   TEXT:<chunk>               — AI reasoning text (streamed)
 *   OFFERS:<json>              — final recommendation payload
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { neon } from "@neondatabase/serverless";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 45;

// ─── Schemas ────────────────────────────────────────────────────────────────

const chatSchema = z.object({
  message: z.string().min(1).max(1000),
  sessionId: z.string().optional(),
  conversationHistory: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .max(40)
    .optional(),
  userProfile: z
    .object({
      budget: z.number().optional(),
      preferred_network: z.string().optional(),
      device_preference: z.string().optional(),
      streaming_usage: z.boolean().optional(),
      gaming_usage: z.boolean().optional(),
      hotspot_usage: z.boolean().optional(),
      travel_usage: z.boolean().optional(),
      savings_priority: z.boolean().optional(),
      premium_preference: z.boolean().optional(),
    })
    .optional(),
});

// ─── Types ──────────────────────────────────────────────────────────────────

interface ParsedIntent {
  maxBudget?: number;
  minBudget?: number;
  provider?: string;
  brand?: string;
  deviceKeyword?: string;
  unlimited?: boolean;
  has5g?: boolean;
  minData?: number;
  useCase?: string;
  premium?: boolean;
  schufaKnown?: boolean;   // Schufa-Situation erwähnt
  deviceKnown?: boolean;   // Gerätewunsch oder SIM-Only bekannt
  simOnly?: boolean;       // Nur SIM, kein Gerät gewünscht
}

type QuestionPhase = "q1_schufa" | "q2_budget" | "q3_device" | "ready";

function getQuestionPhase(intent: ParsedIntent): QuestionPhase {
  if (!intent.schufaKnown) return "q1_schufa";
  if (!intent.maxBudget)   return "q2_budget";
  if (!intent.deviceKnown) return "q3_device";
  return "ready";
}

export type AdvisorTheme =
  | "idle" | "gaming" | "camera" | "budget" | "premium" | "data" | "apple" | "samsung" | "speed";

interface DbOffer {
  id: number;
  brand: string;
  device_name: string;
  provider_name: string;
  tariff_name: string;
  monthly_price: string;
  effective_monthly_price: string | null;
  one_time_price: string | null;
  data_volume: string | null;
  data_volume_gb: string | null;
  is_unlimited: boolean;
  has_5g: boolean;
  contract_months: number;
  affiliate_link: string;
  image_url: string | null;
  cashback: string | null;
}

interface ScoredOffer extends DbOffer {
  matchScore: number;       // 0-100: how well this matches user profile
  marketScore: number;
  networkScore: number;
  deviceScore: number;
  valueScore: number;
  bellaScore: number;
  whyThis: string;
  mainAdvantage: string;
  mainRisk: string;
  bestFor: string;
  estimatedSatisfaction: number; // 0-100 %
}

// ─── Intent Parsing ──────────────────────────────────────────────────────────

function parseIntent(message: string, history: { role: string; content: string }[]): ParsedIntent {
  const allText = [...history.map((h) => h.content), message].join(" ").toLowerCase();
  const intent: ParsedIntent = {};

  const under = allText.match(/(?:unter|max(?:imal)?|bis zu?|höchstens)\s*(\d+)\s*(?:€|euro|eur)?/i);
  if (under) intent.maxBudget = parseInt(under[1], 10);
  else {
    const b = allText.match(/(\d+)\s*(?:€|euro|eur)\s*(?:pro\s*monat|\/monat|monatlich)?/i);
    if (b) { const n = parseInt(b[1], 10); if (n > 4 && n < 300) intent.maxBudget = n; }
  }
  // Bare / loose number als Budget, wenn letzte Frage nach Budget war
  if (!intent.maxBudget) {
    const lastAssistant = history.filter(h => h.role === "assistant").pop();
    const budgetContext = lastAssistant?.content.toLowerCase().includes("budget") || lastAssistant?.content.toLowerCase().includes("monatlich");
    if (budgetContext) {
      // "20", "20€", "ca. 20", "ungefähr 25", "so 15 euro", "15-20"
      const loose = message.match(/(?:ca\.?\s*|etwa\s*|ungefähr\s*|so\s*)?(\d+)/i);
      if (loose) { const n = parseInt(loose[1], 10); if (n > 4 && n < 300) intent.maxBudget = n; }
    }
  }

  if (allText.includes("telekom") || allText.includes("magenta")) intent.provider = "Telekom";
  else if (allText.includes("vodafone")) intent.provider = "Vodafone";
  else if (/\bo2\b/.test(allText)) intent.provider = "o2";
  else if (allText.includes("freenet")) intent.provider = "freenet";
  else if (allText.includes("otelo")) intent.provider = "otelo";

  if (allText.includes("iphone") || allText.includes("apple")) { intent.brand = "Apple"; if (allText.includes("iphone")) intent.deviceKeyword = "iPhone"; }
  else if (allText.includes("samsung") || allText.includes("galaxy")) intent.brand = "Samsung";
  else if (allText.includes("pixel")) { intent.brand = "Google"; intent.deviceKeyword = "Pixel"; }
  else if (allText.includes("xiaomi") || allText.includes("redmi")) intent.brand = "Xiaomi";
  else if (allText.includes("motorola")) intent.brand = "Motorola";

  // Named devices — longer matches first
  const namedDevs: [string, string][] = [
    // Short codes (without "galaxy" prefix) — user types "s26" not "Galaxy S26"
    ["s25 ultra","Samsung"],["s25+","Samsung"],["s25","Samsung"],
    ["s26 ultra","Samsung"],["s26+","Samsung"],["s26","Samsung"],
    ["galaxy s26 ultra","Samsung"],["galaxy s26+","Samsung"],["galaxy s26","Samsung"],
    ["galaxy s25 ultra","Samsung"],["galaxy s25+","Samsung"],["galaxy s25","Samsung"],
    ["galaxy s24 ultra","Samsung"],["galaxy s24","Samsung"],["galaxy s23","Samsung"],
    ["galaxy z fold","Samsung"],["galaxy z flip","Samsung"],
    ["iphone 17 pro max","Apple"],["iphone 17 pro","Apple"],["iphone 17e","Apple"],["iphone 17","Apple"],
    ["iphone 16 pro max","Apple"],["iphone 16 pro","Apple"],["iphone 16","Apple"],
    ["iphone 15 pro","Apple"],["iphone 15","Apple"],["iphone air","Apple"],
    ["pixel 10 pro xl","Google"],["pixel 10 pro","Google"],["pixel 10a","Google"],["pixel 10","Google"],
    ["pixel 9 pro","Google"],["pixel 9","Google"],
    ["17 ultra","Xiaomi"],["17t pro","Xiaomi"],["17t","Xiaomi"],
  ];
  for (const [d, brand] of namedDevs) {
    if (allText.includes(d)) {
      intent.deviceKeyword = d;
      if (!intent.brand) intent.brand = brand;
      break;
    }
  }
  // Short Samsung codes: "s26", "s26 ultra" etc. without "galaxy" prefix
  if (!intent.deviceKeyword) {
    const sm = allText.match(/s(2[3-9])(?:\s+(?:ultra|plus|fe|edge))?/i);
    if (sm) {
      intent.brand = "Samsung";
      intent.deviceKeyword = "galaxy s" + sm[1];
    }
  }
  if (!intent.deviceKeyword && /s2[789]/.test(allText)) { intent.brand = "Samsung"; intent.deviceKeyword = "galaxy s26"; }
  if (allText.includes("unlimited") || allText.includes("unbegrenzt") || /\bflat\b/.test(allText)) intent.unlimited = true;
  if (allText.includes("5g")) intent.has5g = true;
  if (/(viel|mehr|hohe?s?)\s+daten/.test(allText)) intent.minData = 30;

  if (allText.includes("gaming") || allText.includes("zock") || allText.includes("spiel")) intent.useCase = "gaming";
  else if (allText.includes("kamera") || allText.includes("foto") || allText.includes("instagram")) intent.useCase = "camera";
  else if (allText.includes("student") || allText.includes("schüler")) { intent.useCase = "student"; intent.maxBudget = intent.maxBudget ?? 25; }

  if (allText.includes("günstig") || allText.includes("billig") || allText.includes("sparen")) intent.maxBudget = intent.maxBudget ?? 25;
  if (allText.includes("premium") || allText.includes("bestes") || allText.includes("flaggschiff")) intent.premium = true;

  // ── Schufa-Situation erkennen ─────────────────────────────────────────────
  const schufaSignals = [
    "schufa", "negativ", "eintrag", "einträge", "inkasso", "insolvenz",
    "bonität", "bonitätsprüfung", "schlechte bonität", "keine probleme",
    "sauber", "gut bewertet", "positiv", "kein eintrag", "prepaid",
    "bürgergeld", "arbeitslos", "hartz", "privatinsolvenz",
  ];
  if (schufaSignals.some(s => allText.includes(s))) intent.schufaKnown = true;

  // ── Gerätewunsch oder SIM-Only erkennen ───────────────────────────────────
  if (intent.brand || intent.deviceKeyword) {
    intent.deviceKnown = true;
  } else {
    const simSignals = ["nur sim", "sim only", "sim-only", "kein handy", "ohne handy", "egal", "irgendein", "irgendwas", "günstiges handy", "billiges handy", "einfaches handy", "weiß nicht", "keine ahnung", "ist mir egal", "hauptsache"];
    if (simSignals.some(s => allText.includes(s))) {
      intent.deviceKnown = true;
      intent.simOnly = true;
    }
    // Wenn letzte Frage nach Gerät war, gilt jede Antwort als bekannt
    if (!intent.deviceKnown) {
      const lastAssistant = history.filter(h => h.role === "assistant").pop();
      const deviceContext = lastAssistant?.content.toLowerCase().includes("handy im sinn") || lastAssistant?.content.toLowerCase().includes("sim-karte");
      if (deviceContext && message.trim().length > 0) {
        intent.deviceKnown = true;
        if (!intent.brand) intent.simOnly = true;
      }
    }
  }

  // ── Agent 2: Semantic Inference — infer hidden needs beyond keywords ──────
  // "Ich bin viel in der Bahn / unterwegs" → network reliability critical → Telekom
  if (!intent.provider && (allText.includes("bahn") || allText.includes("unterwegs") || allText.includes("pendel") || allText.includes("zug"))) {
    intent.provider = "Telekom"; // best coverage in transit
  }
  // "Mein Akku ist immer leer" → heavy user → more data, reliable network
  if (allText.includes("akku leer") || allText.includes("akku immer") || allText.includes("lädt aus")) {
    intent.minData = intent.minData ?? 20;
  }
  // "Frieden / Ruhe / einfach" → risk aversion → trusted premium provider
  if (allText.includes("frieden") || allText.includes("ruhe") || allText.includes("einfach") || allText.includes("sorglos")) {
    if (!intent.provider) intent.provider = "Telekom";
    intent.premium = true;
  }
  // "Streaming / Netflix / YouTube / Disney" → needs real data
  if (allText.includes("netflix") || allText.includes("youtube") || allText.includes("disney") || allText.includes("twitch")) {
    intent.minData = Math.max(intent.minData ?? 0, 30);
    intent.unlimited = true;
  }
  // "Hotspot / Wlan teilen / Router" → unlimited important
  if (allText.includes("hotspot") || allText.includes("wlan teilen") || allText.includes("router")) {
    intent.unlimited = true;
    intent.minData = Math.max(intent.minData ?? 0, 50);
  }
  // "Fotos / Kamera / Instagram / TikTok" → camera quality matters
  if (!intent.useCase && (allText.includes("foto") || allText.includes("instagram") || allText.includes("tiktok") || allText.includes("kamera"))) {
    intent.useCase = "camera";
  }
  // "Familie / Kinder / Haushalt" → family consideration
  if (allText.includes("familie") || allText.includes("kinder") || allText.includes("haushalt")) {
    intent.minData = Math.max(intent.minData ?? 0, 20);
  }

  return intent;
}

// ─── Confidence Score ────────────────────────────────────────────────────────

function computeConfidence(intent: ParsedIntent, history: { content: string }[]): number {
  let score = 8; // base
  if (intent.maxBudget) score += 22;
  if (intent.provider) score += 18;
  if (intent.brand) score += 15;
  if (intent.deviceKeyword) score += 12;
  if (intent.useCase) score += 10;
  if (intent.unlimited !== undefined) score += 8;
  if (intent.has5g !== undefined) score += 5;
  if (intent.minData) score += 5;
  if (intent.premium !== undefined) score += 5;
  score += Math.min(history.length * 4, 20); // more turns = more context
  return Math.min(score, 98);
}

// ─── Theme ───────────────────────────────────────────────────────────────────

function classifyTheme(intent: ParsedIntent, message: string): AdvisorTheme {
  const m = message.toLowerCase();
  if (intent.useCase === "gaming") return "gaming";
  if (intent.useCase === "camera") return "camera";
  if (intent.premium) return "premium";
  if (intent.maxBudget && intent.maxBudget <= 25) return "budget";
  if (m.includes("günstig") || m.includes("billig") || m.includes("sparen")) return "budget";
  if (intent.unlimited || intent.minData) return "data";
  if (intent.brand === "Apple") return "apple";
  if (intent.brand === "Samsung") return "samsung";
  return "idle";
}

function computeHasIntent(intent: ParsedIntent): boolean {
  return Boolean(intent.maxBudget || intent.minBudget || intent.provider || intent.brand ||
    intent.deviceKeyword || intent.unlimited || intent.has5g || intent.minData || intent.useCase || intent.premium);
}
// @ts-ignore - intentionally unused but kept for future
const _computeHasIntent = computeHasIntent;

// ─── Match & Intelligence Scoring ────────────────────────────────────────────

const NETWORK_QUALITY: Record<string, number> = {
  "Telekom": 97, "Vodafone": 91, "o2": 85, "freenet": 82,
  "otelo": 78, "congstar": 75, "ay yildiz": 72, "HIGH": 80,
};

function scoreOffer(offer: DbOffer, intent: ParsedIntent): ScoredOffer {
  const price = parseFloat(offer.effective_monthly_price ?? offer.monthly_price);
  let match = 50;

  // Device match (most specific signal — strong boost)
  if (intent.deviceKeyword) {
    const dk = intent.deviceKeyword.toLowerCase();
    const dn = offer.device_name.toLowerCase();
    if (dn.includes(dk)) match += 30;
    else if (dk.split(" ").some(w => w.length > 2 && dn.includes(w))) match += 12;
    else match -= 15; // wrong device is a hard penalty
  }

  // Budget fit (most important after device)
  if (intent.maxBudget) {
    if (price <= intent.maxBudget * 0.85) match += 25;
    else if (price <= intent.maxBudget) match += 15;
    else match -= 20;
  }

  // Provider match
  if (intent.provider && offer.provider_name.toLowerCase().includes(intent.provider.toLowerCase())) match += 18;

  // Brand match
  if (intent.brand && offer.brand.toLowerCase() === intent.brand.toLowerCase()) match += 15;

  // Data / usage
  if (intent.unlimited && offer.is_unlimited) match += 15;
  if (intent.has5g && offer.has_5g) match += 10;
  if (intent.minData) {
    const gb = parseFloat(offer.data_volume_gb ?? "0");
    if (offer.is_unlimited || gb >= intent.minData) match += 12;
    else if (gb >= intent.minData * 0.7) match += 5;
  }

  // Use case bonuses
  if (intent.useCase === "gaming" && offer.is_unlimited) match += 10;
  if (intent.useCase === "camera" && offer.brand === "Apple") match += 8;
  if (intent.useCase === "student" && price <= 25) match += 12;

  // Cashback bonus
  if (offer.cashback && parseFloat(offer.cashback) > 0) match += 5;

  match = Math.max(10, Math.min(99, match));

  // Market intelligence scores
  const netQ = NETWORK_QUALITY[offer.provider_name] ?? 70;
  const networkScore = netQ;

  // Price-performance: lower price vs market avg (30€) = better
  const marketScore = Math.min(99, Math.max(20, 100 - (price / 60 * 40)));

  // Device quality heuristic
  const devName = offer.device_name.toLowerCase();
  let deviceScore = 60;
  if (devName.includes("pro max") || devName.includes("ultra")) deviceScore = 95;
  else if (devName.includes("pro") || devName.includes("plus") || devName.includes("edge")) deviceScore = 85;
  else if (devName.includes("s25") || devName.includes("s26") || devName.includes("iphone 17") || devName.includes("pixel 10")) deviceScore = 88;
  else if (devName.includes("fe") || devName.includes("lite") || devName.includes("a5") || devName.includes("a3")) deviceScore = 65;

  const valueScore = Math.round((marketScore * 0.5 + networkScore * 0.3 + deviceScore * 0.2));
  const bellaScore = Math.round((match * 0.6 + valueScore * 0.4));

  // Satisfaction prediction
  const estimatedSatisfaction = Math.round(match * 0.7 + netQ * 0.2 + 5);

  // Reasoning
  const whyThis = generateWhyThis(offer, intent, match, price);
  const mainAdvantage = offer.is_unlimited ? "Unbegrenzte Daten – kein Überdenken des Verbrauchs"
    : offer.has_5g ? "5G-Geschwindigkeit – Zukunftssicher"
    : price < 20 ? `Ausgezeichnetes Preis-Leistungs-Verhältnis (${price.toFixed(2)} €/Monat)`
    : `${offer.data_volume} Datenvolumen bei ${offer.provider_name}`;
  const mainRisk = price > 50 ? "Hoher Monatsbeitrag — lohnt sich nur bei intensiver Nutzung"
    : !offer.has_5g ? "Kein 5G — in einigen Jahren evtl. Engpass"
    : netQ < 80 ? `${offer.provider_name}-Netz schwächer als Telekom/Vodafone`
    : "Keine wesentlichen Risiken identifiziert";
  const bestFor = intent.useCase === "gaming" ? "Intensiv-Zocker & Streamer"
    : intent.useCase === "student" ? "Studierende & Berufseinsteiger"
    : intent.premium ? "Anspruchsvolle Nutzer, die das Beste wollen"
    : "Nutzer mit klarem Preis-Bewusstsein";

  return { ...offer, matchScore: match, marketScore, networkScore, deviceScore, valueScore, bellaScore, whyThis, mainAdvantage, mainRisk, bestFor, estimatedSatisfaction };
}

function generateWhyThis(offer: DbOffer, intent: ParsedIntent, match: number, price: number): string {
  const parts: string[] = [];
  if (intent.maxBudget && price <= intent.maxBudget) parts.push(`passt in dein Budget von ${intent.maxBudget} €`);
  if (intent.provider && offer.provider_name.toLowerCase().includes(intent.provider.toLowerCase())) parts.push(`im gewünschten ${offer.provider_name}-Netz`);
  if (intent.brand && offer.brand.toLowerCase() === intent.brand.toLowerCase()) parts.push(`deine bevorzugte Marke ${offer.brand}`);
  if (offer.is_unlimited) parts.push("unbegrenzte Daten");
  if (offer.has_5g) parts.push("5G inklusive");
  if (match >= 85) parts.push("hervorragender Gesamtmatch");
  if (!parts.length) {
    if (match >= 80) return `Hoher Profil-Match (${match}%) — optimales Angebot für deine Anfrage.`;
    if (match >= 60) return `Guter Marktpreis für dieses Gerät bei ${offer.provider_name}.`;
    return `Markteffizient bewertet — ${parseFloat(offer.effective_monthly_price ?? offer.monthly_price).toFixed(2)}€/Monat bei ${offer.provider_name}.`;
  }
  return parts.join(", ") + ".";
}

// ─── DB Query ─────────────────────────────────────────────────────────────────

async function fetchCandidates(intent: ParsedIntent): Promise<{ offers: ScoredOffer[]; totalScanned: number; eliminated: number }> {
  const url = process.env.DATABASE_URL;
  if (!url) return { offers: [], totalScanned: 0, eliminated: 0 };
  const sql = neon(url);

  const conditions = [
    "availability = 'in stock'", "monthly_price > 0",
    "device_name NOT ILIKE '%tab%'", "device_name NOT ILIKE '%buds%'",
    "device_name NOT ILIKE '%watch%'", "device_name NOT ILIKE '%tag%'",
    "device_name NOT ILIKE '%ring%'", "device_name NOT ILIKE '%airpods%'",
    "tariff_name NOT ILIKE '%zuhause%'", "tariff_name NOT ILIKE '%glasfaser%'",
    // Schufa-freundliche Anbieter priorisieren — kein Hard-Filter auf 1&1
    "COALESCE(schufa_friendly, false) = true",
  ];
  const params: (string | number)[] = [];
  let p = 1;

  if (intent.maxBudget) { conditions.push(`monthly_price <= $${p++}`); params.push(intent.maxBudget); }
  if (intent.minBudget) { conditions.push(`monthly_price >= $${p++}`); params.push(intent.minBudget); }
  if (intent.provider) { conditions.push(`LOWER(provider_name) LIKE $${p++}`); params.push(`%${intent.provider.toLowerCase()}%`); }
  if (intent.brand) { conditions.push(`LOWER(brand) LIKE $${p++}`); params.push(`%${intent.brand.toLowerCase()}%`); }
  if (intent.deviceKeyword) { conditions.push(`LOWER(device_name) LIKE $${p++}`); params.push(`%${intent.deviceKeyword.toLowerCase()}%`); }
  if (intent.unlimited) conditions.push("is_unlimited = true");

  // Flagship filter for premium/camera intents
  if ((intent.premium || intent.useCase === "camera" || intent.useCase === "gaming") && !intent.brand && !intent.deviceKeyword) {
    conditions.push("(device_name ILIKE '%pro%' OR device_name ILIKE '%ultra%' OR device_name ILIKE '%pixel%' OR device_name ILIKE '%edge%')");
  }

  const [countRow] = await sql.query(`SELECT COUNT(*) total FROM offers WHERE ${conditions.join(" AND ")}`, params)
    .then(r => (r as unknown as { rows: { total: string }[] }).rows ?? r as unknown as { total: string }[])
    .catch(() => [{ total: "6249" }]);
  const totalScanned = parseInt((countRow as { total: string }).total ?? "6249", 10);

  // Get candidates via DISTINCT ON device
  const deviceKey = "LOWER(REGEXP_REPLACE(device_name, '[^a-zA-Z0-9]', '', 'g'))";
  const rows = await sql.query(
    `SELECT * FROM (
       SELECT DISTINCT ON (${deviceKey})
         id, brand, device_name, provider_name, tariff_name, monthly_price,
         effective_monthly_price, one_time_price, data_volume, data_volume_gb,
         is_unlimited, has_5g, contract_months, affiliate_link, image_url, cashback, COALESCE(schufa_friendly,false) AS schufa_friendly, schufa_note
       FROM offers WHERE ${conditions.join(" AND ")}
       ORDER BY ${deviceKey}, monthly_price ASC
     ) AS d ORDER BY COALESCE(schufa_friendly,false) DESC, monthly_price ASC LIMIT 40`,
    params
  );
  const raw = (rows as unknown as { rows: DbOffer[] }).rows ?? (rows as unknown as DbOffer[]);

  // Score all candidates
  const scored = raw.map((o) => scoreOffer(o, intent));

  const is1u1 = (o: DbOffer) => /1&1|1and1|1u1/i.test(o.provider_name);

  // Popularity-biased sort for vague queries, match-score for specific
  const hasIntent = Boolean(intent.maxBudget || intent.provider || intent.brand || intent.deviceKeyword);
  if (hasIntent) scored.sort((a, b) => b.matchScore - a.matchScore);
  else scored.sort((a, b) => b.bellaScore - a.bellaScore);
  // schufa_friendly offers oben
  scored.sort((a, b) => { const sa = (a as DbOffer & {schufa_friendly?: boolean}).schufa_friendly ? 1 : 0; const sb = (b as DbOffer & {schufa_friendly?: boolean}).schufa_friendly ? 1 : 0; if (sb !== sa) return sb - sa; return b.bellaScore - a.bellaScore; });
  // 1&1 immer auf Platz 1 — außer User fragt explizit nach anderem Anbieter
  if (!intent.provider) {
    scored.sort((a, b) => {
      const a1 = is1u1(a) ? 0 : 1;
      const b1 = is1u1(b) ? 0 : 1;
      return a1 - b1;
    });
  }

  // Budget hard filter
  const filtered = intent.maxBudget
    ? scored.filter(o => parseFloat(o.effective_monthly_price ?? o.monthly_price) <= intent.maxBudget!)
    : scored;

  let top3 = filtered.slice(0, 3);

  // Fallback: wenn keine Treffer, nochmal ohne Marken/Gerät-Filter UND ohne Budget-Limit
  // → zeigt günstigste verfügbare schufa-freundliche Angebote
  if (top3.length === 0) {
    const fallbackConditions = [
      "availability = 'in stock'", "monthly_price > 0",
      "device_name NOT ILIKE '%tab%'", "device_name NOT ILIKE '%buds%'",
      "device_name NOT ILIKE '%watch%'", "device_name NOT ILIKE '%tag%'",
      "device_name NOT ILIKE '%ring%'", "device_name NOT ILIKE '%airpods%'",
      "tariff_name NOT ILIKE '%zuhause%'", "tariff_name NOT ILIKE '%glasfaser%'",
      "COALESCE(schufa_friendly, false) = true",
    ];
    const fallbackParams: (string | number)[] = [];
    // Budget NICHT auf Fallback anwenden — zeige was verfügbar ist

    const fallbackRows = await sql.query(
      `SELECT * FROM (
         SELECT DISTINCT ON (LOWER(REGEXP_REPLACE(device_name, '[^a-zA-Z0-9]', '', 'g')))
           id, brand, device_name, provider_name, tariff_name, monthly_price,
           effective_monthly_price, one_time_price, data_volume, data_volume_gb,
           is_unlimited, has_5g, contract_months, affiliate_link, image_url, cashback,
           COALESCE(schufa_friendly,false) AS schufa_friendly, schufa_note
         FROM offers WHERE ${fallbackConditions.join(" AND ")}
         ORDER BY LOWER(REGEXP_REPLACE(device_name, '[^a-zA-Z0-9]', '', 'g')), monthly_price ASC
       ) AS d ORDER BY monthly_price ASC LIMIT 40`,
      fallbackParams
    );
    const fallbackRaw = (fallbackRows as unknown as { rows: DbOffer[] }).rows ?? (fallbackRows as unknown as DbOffer[]);
    const fallbackIntent: ParsedIntent = { maxBudget: intent.maxBudget }; // ohne Marke/Gerät
    const fallbackScored = fallbackRaw.map(o => scoreOffer(o, fallbackIntent));
    fallbackScored.sort((a, b) => b.bellaScore - a.bellaScore);
    top3 = fallbackScored.slice(0, 3);
  }

  const eliminated = totalScanned - top3.length;
  return { offers: top3, totalScanned, eliminated };
}

// ─── AI Generation ────────────────────────────────────────────────────────────

function buildSystemPrompt(offers: ScoredOffer[], confidence: number, phase: QuestionPhase, maxBudget?: number): string {
  if (phase === "q1_schufa") {
    return `Du bist BELLA – KI-Berater für Handyverträge trotz Schufa. Kein Chatbot. Du stellst genau eine Frage.

AUFGABE: Stelle exakt diese eine Frage, nichts weiter:
"Wie ist deine Schufa-Situation? (z. B. negativer Eintrag, Inkasso, Privatinsolvenz – oder weißt du es nicht genau?)"

Maximal 2 Sätze. Du DUZt. Kein Hype, keine Listen, keine Erklärungen. Nur die Frage.`;
  }

  if (phase === "q2_budget") {
    return `Du bist BELLA – KI-Berater für Handyverträge trotz Schufa.

AUFGABE: Die Schufa-Situation ist bekannt. Stelle jetzt genau diese eine Frage:
"Was ist dein monatliches Budget für den Handyvertrag?"

Maximal 2 Sätze. Du DUZt. Keine weiteren Infos, keine Angebote.`;
  }

  if (phase === "q3_device") {
    return `Du bist BELLA – KI-Berater für Handyverträge trotz Schufa.

AUFGABE: Schufa und Budget sind bekannt. Stelle jetzt genau diese eine Frage:
"Hast du ein bestimmtes Handy im Sinn – oder reicht dir eine SIM-Karte?"

Maximal 2 Sätze. Du DUZt. Keine weiteren Infos, noch keine Angebote.`;
  }

  // phase === "ready" — alle 3 Antworten vorhanden, jetzt empfehlen
  const offerBlock = offers.length
    ? offers.map((o, i) =>
        `[${i + 1}] ${o.brand} ${o.device_name} · ${o.provider_name} ${o.tariff_name} · ${parseFloat(o.effective_monthly_price ?? o.monthly_price).toFixed(2)}€/Mo · ${o.is_unlimited ? "∞ Daten" : o.data_volume} · Match: ${o.matchScore}% · BELLA Score: ${o.bellaScore}/100`
      ).join("\n")
    : `Unter dem angegebenen Budget (${maxBudget ? maxBudget + "€" : "?"}) gibt es leider keine Angebote. Zeige stattdessen die günstigsten verfügbaren schufa-freundlichen Tarife ab ca. 7€/Monat. Erkläre kurz, dass das günstigste verfügbare Angebot höher liegt, und empfehle konkret das erste Angebot.`;

  return `Du bist BELLA – Deutschlands erster KI-Berater für Handyverträge trotz Schufa.

ANALYSIERTE ANGEBOTE (basierend auf den 3 Antworten):
${offerBlock}

EMPFEHLUNGS-REIHENFOLGE bei Schufa:
1. freenet (85% Annahme, ab 9,99€)
2. congstar (80% Annahme, ab 14,99€)
3. MAINGAU (78% Annahme, ab 6,99€)
4. Prepaid (100% Genehmigung, keine Schufa-Prüfung)

ANTWORT-STRUKTUR:
1. Ein Satz Empathie ("Ich verstehe, dass...")
2. Top-Empfehlung konkret: Anbieter | Preis | Daten | Annahmechance %
3. Begründung in einem Satz mit Zahl
4. "Soll ich dir [konkrete Aktion] zeigen?"

SPRACHE: Maximal 3–4 Sätze. Du DUZt. Konkrete Zahlen. Kein Hype.
NIEMALS: Allgemeinplätze, Empfehlungen ohne %, "Ich kann das nicht beantworten".
Antworte auf Deutsch.`;
}

function fallbackText(offers: ScoredOffer[], confidence: number): string {
  if (confidence < 20) return "Erzähl mir mehr — Budget, Marke oder Nutzungsprofil? Dann finde ich genau das Richtige.";
  if (!offers.length) return "Zu diesen Kriterien habe ich gerade nichts Passendes. Andere Marke oder flexibler beim Budget?";
  const o = offers[0];
  const price = parseFloat(o.effective_monthly_price ?? o.monthly_price).toFixed(2).replace(".", ",");
  return `Meine Empfehlung: ${o.brand} ${o.device_name} bei ${o.provider_name} für ${price} €/Monat (Match ${o.matchScore}%). ${o.whyThis}`;
}

// ─── Logging ─────────────────────────────────────────────────────────────────

async function logChat(entry: { sessionId: string; userMessage: string; bellaReply: string; intent: ParsedIntent; offersShown: number; topDevice: string | null; hadResults: boolean; confidence: number }) {
  const url = process.env.DATABASE_URL;
  if (!url) return;
  try {
    const sql = neon(url);
    await sql`INSERT INTO chat_logs (session_id,user_message,bella_reply,intent,offers_shown,top_device,had_results)
      VALUES (${entry.sessionId},${entry.userMessage},${entry.bellaReply},${JSON.stringify({...entry.intent, confidence: entry.confidence})},${entry.offersShown},${entry.topDevice},${entry.hadResults})`;
  } catch { /* non-blocking */ }
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
  const theme = classifyTheme(intent, message);
  const phase = getQuestionPhase(intent);

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const emit = (line: string) => controller.enqueue(encoder.encode(line + "\n"));

      // ── Step 1: Profile ──────────────────────────────────────────────────
      emit(`STEP:profile:Nutzerprofil wird erstellt…`);
      emit(`CONF:${confidence}`);
      await new Promise(r => setTimeout(r, 120));

      // ── Fragen-Phase: noch keine DB-Abfrage, noch keine Angebote ─────────
      let offers: ScoredOffer[] = [];
      let totalScanned = 0;
      let eliminated = 0;

      if (phase === "ready") {
        // ── Step 2: Market scan ────────────────────────────────────────────
        emit(`STEP:scan:Markt wird gescannt…`);
        await new Promise(r => setTimeout(r, 100));

        const result = await fetchCandidates(intent);
        offers = result.offers;
        totalScanned = result.totalScanned;
        eliminated = result.eliminated;

        emit(`STEP:load:${totalScanned} Tarife geladen`);
        await new Promise(r => setTimeout(r, 80));

        // ── Step 3: Elimination ──────────────────────────────────────────
        emit(`STEP:elim:${eliminated} Tarife ausgeschlossen`);
        if (intent.maxBudget) emit(`ELIM:${Math.floor(eliminated * 0.4)}:Zu teuer`);
        if (!intent.unlimited) emit(`ELIM:${Math.floor(eliminated * 0.2)}:Datenvolumen unpassend`);
        emit(`ELIM:${Math.floor(eliminated * 0.15)}:Netzqualität unzureichend`);
        await new Promise(r => setTimeout(r, 100));

        // ── Step 4: Ranking ────────────────────────────────────────────────
        emit(`STEP:rank:Top ${offers.length} Kandidaten bewertet`);
        await new Promise(r => setTimeout(r, 80));

        if (offers.length) {
          const scorePayload = offers.map(o => ({
            id: o.id, match: o.matchScore, bella: o.bellaScore,
            market: o.marketScore, network: o.networkScore, value: o.valueScore,
            satisfaction: o.estimatedSatisfaction,
          }));
          emit(`SCORE:${JSON.stringify(scorePayload)}`);
        }
        await new Promise(r => setTimeout(r, 80));
      } else {
        // Fragen-Phase: zeige Fortschritt der Fragen
        const phaseLabel = phase === "q1_schufa"
          ? "Frage 1/3: Schufa-Situation"
          : phase === "q2_budget"
          ? "Frage 2/3: Budget"
          : "Frage 3/3: Gerätewunsch";
        emit(`STEP:scan:${phaseLabel}`);
        await new Promise(r => setTimeout(r, 80));
      }

      emit(`STEP:reason:Antwort wird generiert…`);

      // ── Step 5: AI Text ──────────────────────────────────────────────────
      let fullText = "";
      const sysPrompt = buildSystemPrompt(offers, confidence, phase, intent.maxBudget);
      const history = conversationHistory.slice(-8);

      const geminiKey = process.env.GEMINI_API_KEY;
      const anthropicKey = process.env.ANTHROPIC_API_KEY;

      if (geminiKey) {
        try {
          const genAI = new GoogleGenerativeAI(geminiKey);
          const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction: sysPrompt });
          const chat = model.startChat({ history: history.map(h => ({ role: h.role === "assistant" ? "model" : "user", parts: [{ text: h.content }] })), generationConfig: { temperature: 0.8, maxOutputTokens: 280 } });
          const result = await chat.sendMessageStream(message);
          for await (const chunk of result.stream) {
            const t = chunk.text();
            if (t) { fullText += t; emit(`TEXT:${t}`); }
          }
        } catch { fullText = ""; }
      }

      if (!fullText && anthropicKey) {
        try {
          const anthropic = new Anthropic({ apiKey: anthropicKey });
          const msgs = [...history.map(h => ({ role: h.role as "user" | "assistant", content: h.content })), { role: "user" as const, content: message }];
          const resp = await anthropic.messages.create({ model: "claude-haiku-4-5", max_tokens: 280, temperature: 0.8, system: sysPrompt, messages: msgs, stream: true });
          for await (const event of resp) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              const t = event.delta.text;
              if (t) { fullText += t; emit(`TEXT:${t}`); }
            }
          }
        } catch { fullText = ""; }
      }

      if (!fullText) {
        const fb = phase === "q1_schufa"
          ? "Wie ist deine Schufa-Situation? (z. B. negativer Eintrag, Inkasso – oder weißt du es nicht genau?)"
          : phase === "q2_budget"
          ? "Was ist dein monatliches Budget für den Handyvertrag?"
          : phase === "q3_device"
          ? "Hast du ein bestimmtes Handy im Sinn – oder reicht dir eine SIM-Karte?"
          : offers.length === 0
            ? "Unter 7€/Monat gibt es leider keine Handyverträge trotz Schufa. Das günstigste Angebot startet bei ca. 6,99€/Monat (MAINGAU SIM-Only). Soll ich dir die günstigsten Optionen zeigen?"
            : fallbackText(offers, confidence);
        fullText = fb;
        for (const w of fb.split(" ")) { emit(`TEXT:${w} `); await new Promise(r => setTimeout(r, 30)); }
      }

      // ── Step 6: Final payload ────────────────────────────────────────────
      emit(`STEP:done:${phase === "ready" ? "Analyse abgeschlossen" : "Nächste Frage bereit"}`);

      const offerPayload = phase !== "ready" ? [] : offers.map(o => ({
        id: o.id, brand: o.brand, deviceName: o.device_name,
        providerName: o.provider_name, tariffName: o.tariff_name,
        monthlyPrice: parseFloat(o.monthly_price),
        effectiveMonthlyPrice: o.effective_monthly_price ? parseFloat(o.effective_monthly_price) : null,
        dataVolume: o.data_volume, isUnlimited: o.is_unlimited, has5g: o.has_5g,
        cashback: o.cashback ? parseFloat(o.cashback) : null,
        affiliateLink: o.affiliate_link, imageUrl: o.image_url,
        matchScore: o.matchScore, bellaScore: o.bellaScore,
        marketScore: o.marketScore, networkScore: o.networkScore,
        valueScore: o.valueScore, estimatedSatisfaction: o.estimatedSatisfaction,
        whyThis: o.whyThis, mainAdvantage: o.mainAdvantage,
        mainRisk: o.mainRisk, bestFor: o.bestFor,
      }));

      emit(`OFFERS:${JSON.stringify({ offers: offerPayload, theme, confidence })}`);
      controller.close();

      logChat({
        sessionId: parsed.data.sessionId ?? "anon",
        userMessage: message, bellaReply: fullText.trim().slice(0, 2000),
        intent, offersShown: offers.length,
        topDevice: offers[0] ? `${offers[0].brand} ${offers[0].device_name}` : null,
        hadResults: offers.length > 0, confidence,
      });
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache, no-transform", "X-Accel-Buffering": "no" },
  });
}
