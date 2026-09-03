/**
 * Modell-Routing (Roadmap 2.2): schnell fragen, stark empfehlen.
 *
 * - Frage-Turn (`ask`): kurzer Acknowledgment + EINE Frage → schnell & günstig,
 *   kein Chain-of-Thought.
 * - Empfehlungs-Turn: 3 Produkte abwägen, Warnungen (⚠️ NIEDRIG / vage Proteinquelle)
 *   beachten, Allergie-sicher begründen → Gemini mit Thinking an, stärkerer
 *   Claude-Fallback.
 *
 * Alles per Env übersteuerbar (Kosten-/Qualitäts-Tuning ohne Deploy).
 */
const env = (k: string, d: string) => process.env[k]?.trim() || d;
const numEnv = (k: string, d: number) => {
  const v = Number(process.env[k]);
  return Number.isFinite(v) && v >= 0 ? v : d;
};

export interface ModelPlan {
  label: "ask" | "recommend";
  gemini: { model: string; maxOutputTokens: number; thinkingBudget: number };
  anthropic: { model: string; maxTokens: number };
  timeoutMs: number;
}

export function planModels(ask: boolean): ModelPlan {
  if (ask) {
    return {
      label: "ask",
      gemini: {
        model: env("ADVISOR_ASK_GEMINI_MODEL", "gemini-2.5-flash"),
        maxOutputTokens: 1024,
        thinkingBudget: numEnv("ADVISOR_ASK_THINKING", 0),
      },
      anthropic: { model: env("ADVISOR_ASK_CLAUDE_MODEL", "claude-haiku-4-5"), maxTokens: 1024 },
      timeoutMs: numEnv("ADVISOR_ASK_TIMEOUT_MS", 12_000),
    };
  }
  return {
    label: "recommend",
    gemini: {
      model: env("ADVISOR_REC_GEMINI_MODEL", "gemini-2.5-flash"),
      maxOutputTokens: 2048,
      thinkingBudget: numEnv("ADVISOR_REC_THINKING", 640),
    },
    anthropic: { model: env("ADVISOR_REC_CLAUDE_MODEL", "claude-sonnet-5"), maxTokens: 1536 },
    // Sequenzieller Worst-Case (Gemini-Timeout + Claude-Timeout) muss unter
    // route `maxDuration = 45` bleiben → 18s + 18s.
    timeoutMs: numEnv("ADVISOR_REC_TIMEOUT_MS", 18_000),
  };
}
