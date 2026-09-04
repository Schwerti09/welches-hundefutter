import { defineConfig, devices } from "@playwright/test";

// E2E + visuelle Regression (Roadmap 1.4 / 3.4).
// NICHT im automatischen Gate — manuell laufen lassen:
//   ohne E2E_BASE_URL: baut nichts, startet `next start` gegen einen lokalen `npm run build`
//   mit  E2E_BASE_URL:  läuft gegen eine (Deploy-Preview-)URL, kein lokaler Server
// `CI` wird von Netlify-Builds/CI-Runnern gesetzt und nur für Stabilitäts-Defaults genutzt.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 30_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.02, animations: "disabled" },
  },
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npm run start -- -p 3000",
        port: 3000,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
