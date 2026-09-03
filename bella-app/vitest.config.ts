import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  resolve: {
    alias: { "@": resolve(__dirname, "src") },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      include: ["src/lib/**", "src/db/queries/**"],
      exclude: ["src/lib/og-image.tsx", "**/*.test.ts"],
      reporter: ["text", "html"],
    },
  },
});
