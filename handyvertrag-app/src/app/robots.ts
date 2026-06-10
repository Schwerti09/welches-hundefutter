import { MetadataRoute } from "next";

const BASE = "https://welches-hundefutter.today";

// Alle seriösen KI-Crawler (Stand 2026): Such-/Retrieval- UND Trainings-Bots.
const AI_BOTS = [
  // OpenAI / ChatGPT
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  // Anthropic / Claude
  "ClaudeBot", "Claude-User", "Claude-SearchBot", "anthropic-ai",
  // Perplexity
  "PerplexityBot", "Perplexity-User",
  // Google (Gemini, AI Overviews, AI Mode)
  "Google-Extended", "Googlebot",
  // Microsoft (Bing/Copilot — versorgt auch die ChatGPT-Suche)
  "Bingbot",
  // Apple Intelligence
  "Applebot", "Applebot-Extended",
  // Amazon (Rufus/Alexa+)
  "Amazonbot",
  // weitere
  "CCBot", "Meta-ExternalAgent", "DuckAssistBot", "MistralAI-User", "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/", "/_next/", "/static/"] },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/" })),
      // Bytespider ignoriert robots.txt -> echter Block am Edge (block-bad-bots). Hier symbolisch.
      { userAgent: "Bytespider", disallow: "/" },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
