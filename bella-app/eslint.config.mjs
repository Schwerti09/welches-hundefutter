import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      "react/no-unescaped-entities": ["error", { forbid: [">", "}"] }],
    },
  },
  globalIgnores([
    // Standalone-Node-Utilities, eigener Kontext — nicht Teil des App-Lints.
    // (Roadmap Op 0.2: optional eigenes tsconfig.scripts.json)
    "scripts/**",
  ]),
]);
