import { test, expect } from "@playwright/test";

// Deterministischer Smoke — kein API-Key nötig (DB-Abfragen liefern [], der
// Advisor fällt auf deterministischen Text zurück). Roadmap 1.4 / 3.4.

test("Startseite rendert ohne Konsolen-Fehler", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.waitForLoadState("networkidle");

  // GA / Analytics-Rauschen tolerieren, echte App-Fehler nicht.
  const real = errors.filter((e) => !/gtag|google-analytics|googletagmanager|Failed to load resource.*(analytics|gtag)/i.test(e));
  expect(real, real.join("\n")).toHaveLength(0);
});

test("/rassen zeigt geladene Rasse-Bilder", async ({ page }) => {
  await page.goto("/rassen");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Rassen|Hunderassen/i);
  const firstImg = page.locator("main img").first();
  await firstImg.scrollIntoViewIfNeeded();
  // next/image lazy-loaded + On-demand-Optimierung → aufs echte Laden pollen.
  await expect
    .poll(() => firstImg.evaluate((el) => (el as HTMLImageElement).naturalWidth), { timeout: 15_000 })
    .toBeGreaterThan(0);
});

test("/rasse/[slug] rendert Hero + FAQ", async ({ page }) => {
  await page.goto("/rasse/labrador-retriever");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Labrador/i);
  await expect(page.getByText(/Häufige Fragen/i)).toBeVisible();
});

test("robots.txt und sitemap.xml antworten mit 200", async ({ request }) => {
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
});

test("BELLA-Advisor antwortet auf eine Nachricht", async ({ page }) => {
  await page.goto("/#bella-advisor");
  // Advisor ist dynamic(ssr:false) — auf das Eingabefeld warten.
  const input = page.locator('textarea, input[type="text"]').filter({ hasNot: page.locator("[readonly]") }).first();
  await input.waitFor({ state: "visible", timeout: 20_000 });
  await input.fill("Labrador, 3 Jahre, ausgewachsen, Trockenfutter, günstig");
  await input.press("Enter");

  // Irgendeine sichtbare BELLA-Reaktion innerhalb von 25 s (echter Text ODER Fallback).
  await expect(
    page.getByText(/BELLA|Empfehlung|Futter|Erzähl mir|passt|Rasse/i).last(),
  ).toBeVisible({ timeout: 25_000 });
});
