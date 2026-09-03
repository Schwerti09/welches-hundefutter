import { chromium } from "playwright";

const url = process.argv[2] || "http://localhost:3000";
const out = process.argv[3] || "shot.png";
const doChat = process.argv[4] === "chat";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: "networkidle", timeout: 30000 }).catch(() => {});
await page.waitForTimeout(3000);

if (doChat) {
  await page.locator("text=Beste Kamera").first().click().catch(() => {});
  await page.waitForTimeout(6000);
}

await page.screenshot({ path: out, fullPage: false });
console.log("saved", out);
await browser.close();
