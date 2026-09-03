/**
 * CLI-Wrapper für scripts/lib/run-price-alerts.mjs.
 * Run:  DATABASE_URL=… RESEND_API_KEY=… node scripts/check-price-alerts.mjs [--dry-run]
 */
import { runPriceAlerts } from "./lib/run-price-alerts.mjs";

const dryRun = process.argv.includes("--dry-run") || process.env.DRY_RUN === "1";

runPriceAlerts({ dryRun }).catch((err) => {
  console.error("❌", err.message);
  process.exit(1);
});
