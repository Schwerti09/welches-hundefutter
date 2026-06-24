/**
 * CLI-Wrapper für scripts/lib/run-outcome-checks.mjs.
 * Run:  DATABASE_URL=… RESEND_API_KEY=… node scripts/check-outcome-checks.mjs [--dry-run]
 */
import { runOutcomeChecks } from "./lib/run-outcome-checks.mjs";

const dryRun = process.argv.includes("--dry-run") || process.env.DRY_RUN === "1";

runOutcomeChecks({ dryRun }).catch((err) => {
  console.error("❌", err.message);
  process.exit(1);
});
