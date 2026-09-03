import { test, expect } from "@playwright/test";

// Visuelle Regression (Roadmap 3.4). Baselines werden im CI (Linux) erzeugt —
// lokal auf Windows weichen sie durch Font-Rendering ab. Läuft als eigener,
// NICHT-blockierender Workflow (.github/workflows/visual.yml).
//
// Dynamische Bereiche (Advisor, Live-Ticker) werden maskiert bzw. die Seite
// bekommt Zeit sich zu setzen.

const PAGES: { path: string; name: string }[] = [
  { path: "/", name: "home" },
  { path: "/rassen", name: "rassen" },
  { path: "/rasse/labrador-retriever", name: "rasse-labrador" },
  { path: "/dev/components", name: "dev-components" },
];

for (const p of PAGES) {
  test(`visual: ${p.name}`, async ({ page }) => {
    await page.goto(p.path);
    await page.waitForLoadState("networkidle");
    // Animationen/Bewegung beruhigen.
    await page.addStyleTag({ content: "*,*::before,*::after{animation:none!important;transition:none!important}" });
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot(`${p.name}.png`, {
      fullPage: true,
      mask: [
        page.locator("#bella-advisor"),
        page.locator('[class*="LiveStatusBar"], [class*="LiveProofTicker"], [class*="LiveIntel"]'),
      ],
    });
  });
}
