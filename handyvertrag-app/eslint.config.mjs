import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "src/features/**",
      "src/platform/**",
      "src/lib/data/**",
      "src/lib/environment/**",
      "src/lib/performance/**",
      "src/lib/rendering/fallback-rendering.tsx",
      "src/lib/state/**",
      "src/lib/validation/**",
      "scripts/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
