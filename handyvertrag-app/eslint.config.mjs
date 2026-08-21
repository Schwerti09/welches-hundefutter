import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([
    "src/features/**",
    "src/platform/**",
    "src/lib/data/**",
    "src/lib/environment/**",
    "src/lib/performance/**",
    "src/lib/rendering/fallback-rendering.tsx",
    "src/lib/state/**",
    "src/lib/validation/**",
    "scripts/**",
  ]),
]);
