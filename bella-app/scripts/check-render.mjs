import { chromium } from "playwright";

const url = process.argv[2] || "https://welches-hundefutter.today";
const browser = await chromium.launch();
const page = await browser.newPage();

const errors = [];
const logs = [];
page.on("console", (m) => logs.push(`[${m.type()}] ${m.text()}`));
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
page.on("requestfailed", (r) => errors.push("REQFAIL: " + r.url() + " " + (r.failure()?.errorText || "")));

await page.goto(url, { waitUntil: "networkidle", timeout: 30000 }).catch((e) => errors.push("GOTO: " + e.message));
await page.waitForTimeout(3500);

const bodyText = (await page.locator("body").innerText().catch(() => "")).slice(0, 300);
const hasBella = await page.locator("text=Hi, ich bin").count().catch(() => 0);
const canvasCount = await page.locator("canvas").count().catch(() => 0);

console.log("=== URL:", url);
console.log("=== BODY TEXT:", JSON.stringify(bodyText));
console.log("=== 'Hi, ich bin' present:", hasBella);
console.log("=== canvas count:", canvasCount);
console.log("=== PAGE ERRORS:", errors.length ? errors.join("\n") : "NONE");
console.log("=== CONSOLE (last 15):");
console.log(logs.slice(-15).join("\n"));

await browser.close();
