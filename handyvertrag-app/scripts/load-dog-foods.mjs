/**
 * CLI-Wrapper für scripts/lib/load-dog-foods.mjs — lädt scripts/dog_foods.json (Output von
 * parse-feeds.py) in Neon.
 *
 * Run:  DATABASE_URL="postgres://…" node scripts/load-dog-foods.mjs
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { loadDogFoods } from "./lib/load-dog-foods.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const records = JSON.parse(readFileSync(join(__dirname, "dog_foods.json"), "utf-8"));

loadDogFoods(records).catch((err) => {
  console.error("❌", err.message);
  process.exit(1);
});
