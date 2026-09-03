import type { Config } from "@netlify/functions";
import { runOutcomeChecks } from "../../scripts/lib/run-outcome-checks.mjs";

export default async () => {
  const dryRun = process.env.DRY_RUN === "1";
  const result = await runOutcomeChecks({ dryRun });
  return new Response(JSON.stringify(result), {
    headers: { "content-type": "application/json" },
  });
};

export const config: Config = {
  schedule: "0 7 * * *",
};
