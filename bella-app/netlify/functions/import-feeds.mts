import type { Config } from "@netlify/functions";
import { parseFeeds } from "../../scripts/lib/parse-feeds.mjs";
import { loadDogFoods } from "../../scripts/lib/load-dog-foods.mjs";
import { pingIndexNow } from "../../scripts/lib/indexnow-ping.mjs";

export default async () => {
  const products = await parseFeeds();
  const summary = await loadDogFoods(products);
  await pingIndexNow().catch(() => {});
  return new Response(JSON.stringify(summary), {
    headers: { "content-type": "application/json" },
  });
};

export const config: Config = {
  schedule: "0 5 * * *",
};
