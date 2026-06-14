/**
 * CLI-Wrapper für scripts/lib/run-ai-visibility.mjs.
 *
 * Run:
 *   DATABASE_URL="postgres://…" GEMINI_API_KEY="…" ANTHROPIC_API_KEY="…" \
 *     node scripts/check-ai-visibility.mjs
 *
 * --dry-run: keine echten API-Calls/DB-Writes, nur Kontrollfluss + Parsing testen.
 */
import { runAiVisibility } from "./lib/run-ai-visibility.mjs";

const dryRun = process.argv.includes("--dry-run");

runAiVisibility({ dryRun }).catch((err) => {
  console.error("❌", err.message);
  process.exit(1);
});
