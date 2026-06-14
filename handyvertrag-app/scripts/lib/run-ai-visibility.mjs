/**
 * BELLA Block J1 — KI-Sichtbarkeits-Tracking.
 *
 * Schickt ein festes Prompt-Set an Gemini (Google-Search-Grounding) und
 * Claude (Web-Search-Tool) und prüft, ob BELLA / welches-hundefutter.today
 * in der Antwort genannt oder als Quelle zitiert wird. Ergebnis pro Lauf
 * in `ai_visibility_checks` (Trend über die Zeit, monatlicher Cron).
 */
import { neon } from "@neondatabase/serverless";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

const SITE_DOMAIN = "welches-hundefutter.today";
const BRAND_NAME = "bella";

// Festes Prompt-Set: deckt die Programmatic-Cluster ab (Rasse, Problem,
// Futtertyp, Lebensphase, Vergleich) + den Nordstern-Query.
const PROMPTS = [
  "Welches Hundefutter passt zu meinem Hund?",
  "Welches Futter eignet sich für einen Labrador-Welpen?",
  "Bestes Hundefutter bei Futterallergie",
  "BARF oder Trockenfutter – was ist besser für meinen Hund?",
  "Welches Futter hilft bei einem empfindlichen Magen meines Hundes?",
  "Worauf muss ich beim Hundefutter für einen Senior-Hund achten?",
  "Wie viel Futter braucht ein Deutscher Schäferhund pro Tag?",
  "Für wen ist getreidefreies Hundefutter sinnvoll?",
  "Welches Welpenfutter kannst du empfehlen?",
  "Trockenfutter oder Nassfutter – was ist gesünder für Hunde?",
];

function detectMentions(text, urls) {
  const lowerText = (text || "").toLowerCase();
  const domainCited = urls.some((u) => (u || "").toLowerCase().includes(SITE_DOMAIN));
  const nameMentioned =
    lowerText.includes(BRAND_NAME) || lowerText.includes(SITE_DOMAIN) || domainCited;
  return { mentioned: nameMentioned, domainCited, nameMentioned };
}

// ---- Gemini: Antwort + Google-Search-Grounding-Quellen ----
async function checkGemini(prompt, apiKey, dryRun) {
  const model = "gemini-2.5-flash";
  if (dryRun) {
    return { provider: "gemini", model, prompt, text: "(dry-run)", urls: [], error: null };
  }
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const gen = genAI.getGenerativeModel({ model, tools: [{ googleSearch: {} }] });
    const result = await gen.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const grounding = response.candidates?.[0]?.groundingMetadata;
    const urls = (grounding?.groundingChunks ?? [])
      .map((c) => c?.web?.uri)
      .filter(Boolean);
    return { provider: "gemini", model, prompt, text, urls, error: null };
  } catch (err) {
    return { provider: "gemini", model, prompt, text: "", urls: [], error: String(err?.message ?? err) };
  }
}

// ---- Claude: Antwort + Web-Search-Tool-Zitate ----
async function checkClaude(prompt, apiKey, dryRun) {
  const model = "claude-haiku-4-5";
  if (dryRun) {
    return { provider: "claude", model, prompt, text: "(dry-run)", urls: [], error: null };
  }
  try {
    const anthropic = new Anthropic({ apiKey });
    const resp = await anthropic.messages.create({
      model,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 3 }],
    });

    let text = "";
    const urls = [];
    for (const block of resp.content) {
      if (block.type === "text") {
        text += block.text;
        for (const c of block.citations ?? []) {
          if (c.url) urls.push(c.url);
        }
      } else if (block.type === "web_search_tool_result" && Array.isArray(block.content)) {
        for (const r of block.content) {
          if (r?.url) urls.push(r.url);
        }
      }
    }
    return { provider: "claude", model, prompt, text, urls, error: null };
  } catch (err) {
    return { provider: "claude", model, prompt, text: "", urls: [], error: String(err?.message ?? err) };
  }
}

export async function runAiVisibility({ dryRun = false } = {}) {
  const { DATABASE_URL, GEMINI_API_KEY, ANTHROPIC_API_KEY } = process.env;
  if (!dryRun) {
    if (!DATABASE_URL) throw new Error("DATABASE_URL fehlt");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY fehlt");
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY fehlt");
  }

  const sql = dryRun ? null : neon(DATABASE_URL);
  const runDate = new Date().toISOString().slice(0, 10);

  let total = 0;
  let hits = 0;
  let errors = 0;

  for (const prompt of PROMPTS) {
    const checks = [
      checkGemini(prompt, GEMINI_API_KEY, dryRun),
      checkClaude(prompt, ANTHROPIC_API_KEY, dryRun),
    ];
    for (const checkPromise of checks) {
      const r = await checkPromise;
      const { mentioned, domainCited, nameMentioned } = detectMentions(r.text, r.urls);
      total++;
      if (r.error) errors++;
      else if (mentioned) hits++;

      const status = r.error ? `FEHLER: ${r.error}` : mentioned ? "✅ erwähnt" : "—";
      console.log(`[${r.provider}] "${prompt.slice(0, 55)}" → ${status}`);

      if (sql) {
        await sql`
          INSERT INTO ai_visibility_checks
            (run_date, provider, model, prompt, mentioned, domain_cited, name_mentioned, source_urls, response_excerpt, error)
          VALUES
            (${runDate}, ${r.provider}, ${r.model}, ${prompt}, ${mentioned}, ${domainCited}, ${nameMentioned},
             ${JSON.stringify(r.urls)}, ${r.text.slice(0, 1000)}, ${r.error})
        `;
      }
    }
  }

  console.log(`\n${hits}/${total} Checks mit BELLA-Erwähnung, ${errors} Fehler (${runDate}).`);
  return { total, hits, errors, runDate };
}
