import type { Config } from "@netlify/functions";
import { runPriceAlerts } from "../../scripts/lib/run-price-alerts.mjs";

export default async () => {
  const dryRun = process.env.DRY_RUN === "1";
  const result = await runPriceAlerts({ dryRun });
  return new Response(JSON.stringify(result), {
    headers: { "content-type": "application/json" },
  });
};

export const config: Config = {
  schedule: "0 6 * * *",
};
