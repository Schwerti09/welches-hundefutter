#!/usr/bin/env node
/**
 * Interner-Link-Audit (Roadmap 4.4).
 *
 * Crawlt die Money- + Hub-Seiten eines laufenden Servers und misst je URL:
 *   - kontextuelle interne Links (im Inhalt, OHNE nav/header/footer-Chrome)
 *   - eingehende kontextuelle Links von anderen Seiten der Menge
 *   - Klick-Tiefe von "/" (BFS über kontextuelle Links)
 *
 * Flags:
 *   🚩 Orphan     — 0 kontextuelle eingehende Links
 *   ⚠ dünn        — < 3 kontextuelle eingehende Links (Money-Seite)
 *   ⚠ Sackgasse   — < 3 kontextuelle ausgehende Links
 *   ⚠ tief        — Klick-Tiefe von "/" > 3
 *
 * Nutzung:  BASE=http://localhost:3000 node scripts/link-audit.mjs
 */

const BASE = process.env.BASE || "http://localhost:3000";
const LOADING_SENTINEL = "BELLA schnüffelt";

const PROBLEME = [
  "allergie", "futtermittelunvertraeglichkeit", "sensibler-magen", "durchfall",
  "uebergewicht", "untergewicht", "gelenkprobleme", "arthrose", "nierenprobleme",
  "leberprobleme", "diabetes", "pankreatitis", "haut-und-fell", "zahnsteine",
];
const FUTTERTYPEN = [
  "trockenfutter", "nassfutter", "barf", "kaltgepresst", "getreidefrei",
  "hypoallergen", "monoprotein", "insekten", "vegetarisch", "vegan",
];
const LEBENSPHASEN = ["welpen", "junghund", "adult", "senior"];
const VERGLEICHE = [
  "barf-vs-trockenfutter", "trockenfutter-vs-nassfutter", "nassfutter-vs-barf",
  "kaltgepresst-vs-extrudiert", "monoprotein-vs-mehrkomponenten",
  "getreidefrei-vs-mit-getreide", "premium-vs-budget", "insektenfutter-vs-huehnchen",
];
const TIPP_KATS = [
  "ernaehrung", "abnehmen", "diaet", "sport-bewegung", "gesundheit", "welpen",
  "senior-hund", "allergien", "fell-haut", "zaehne", "barf", "verdauung",
  "leckerlies", "hydration",
];
const STATIC = [
  "/", "/rassen", "/hundefutter-test", "/vergleich", "/tipps", "/warum-bella",
  "/hundefutter-marken", "/tools/futter-finder", "/hochwertiges-hundefutter",
];

const URLS = [
  ...STATIC,
  ...PROBLEME.map((s) => `/problem/${s}`),
  ...FUTTERTYPEN.map((s) => `/futtertyp/${s}`),
  ...LEBENSPHASEN.map((s) => `/lebensphase/${s}`),
  ...VERGLEICHE.map((s) => `/vergleich/${s}`),
  ...TIPP_KATS.map((s) => `/tipps/${s}`),
];

// „Money-Seiten" — die sollen ≥ 3 kontextuelle eingehende Links haben.
const MONEY = new Set([
  ...PROBLEME.map((s) => `/problem/${s}`),
  ...FUTTERTYPEN.map((s) => `/futtertyp/${s}`),
  ...LEBENSPHASEN.map((s) => `/lebensphase/${s}`),
  ...VERGLEICHE.map((s) => `/vergleich/${s}`),
  "/hundefutter-test", "/rassen",
]);

function stripChrome(html) {
  let s = html;
  const body = s.match(/<body[\s\S]*<\/body>/i);
  s = body ? body[0] : s;
  s = s.replace(/<script[\s\S]*?<\/script>/gi, " ");
  s = s.replace(/<style[\s\S]*?<\/style>/gi, " ");
  s = s.replace(/<template[\s\S]*?<\/template>/gi, " ");
  s = s.replace(/<main[\s\S]*?<\/main>/gi, (m) => (m.includes(LOADING_SENTINEL) ? " " : m));
  s = s.replace(/<(nav|header|footer|aside)[\s\S]*?<\/\1>/gi, " ");
  return s;
}

function normalize(href) {
  if (!href || !href.startsWith("/") || href.startsWith("//")) return null;
  let h = href.split("#")[0].split("?")[0];
  if (h.length > 1 && h.endsWith("/")) h = h.slice(0, -1);
  return h || "/";
}

function contextualLinks(html) {
  const chrome = stripChrome(html);
  const out = new Set();
  for (const m of chrome.matchAll(/<a\s[^>]*href="([^"]+)"/gi)) {
    const n = normalize(m[1]);
    if (n) out.add(n);
  }
  return out;
}

async function fetchPage(path) {
  let html = "";
  let status = 0;
  for (let a = 0; a < 5; a++) {
    const res = await fetch(BASE + path, { headers: { "user-agent": "bella-link-audit" } });
    status = res.status;
    html = await res.text();
    const mainLen = (html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? "").length;
    if (!html.includes(LOADING_SENTINEL) && (mainLen > 600 || status !== 200)) break;
    await new Promise((r) => setTimeout(r, 900));
  }
  return { path, status, links: status === 200 ? contextualLinks(html) : new Set() };
}

async function pool(items, size, fn) {
  const results = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (i < items.length) {
        const idx = i++;
        results[idx] = await fn(items[idx]);
      }
    }),
  );
  return results;
}

// 1) Warm-Pass: ISR-Seiten einmal anstoßen (Fallback ignorieren)
await pool(URLS, 8, (u) => fetch(BASE + u).then((r) => r.text()).catch(() => ""));
await new Promise((r) => setTimeout(r, 1500));

// 2) Mess-Pass
const pages = new Map();
for (const p of await pool(URLS, 8, fetchPage)) pages.set(p.path, p);

// eingehende Links (nur innerhalb der geprüften Menge)
const inbound = new Map(URLS.map((u) => [u, new Set()]));
for (const [from, p] of pages) {
  for (const to of p.links) {
    if (inbound.has(to) && to !== from) inbound.get(to).add(from);
  }
}

// Klick-Tiefe von "/" (BFS)
const depth = new Map([["/", 0]]);
let frontier = ["/"];
while (frontier.length) {
  const next = [];
  for (const cur of frontier) {
    const p = pages.get(cur);
    if (!p) continue;
    for (const to of p.links) {
      if (pages.has(to) && !depth.has(to)) {
        depth.set(to, depth.get(cur) + 1);
        next.push(to);
      }
    }
  }
  frontier = next;
}

const md = [];
md.push(`# Interner-Link-Audit — ${new Date().toISOString().slice(0, 10)}`);
md.push("");
md.push(`Quelle: \`${BASE}\` · Menge: ${URLS.length} Money-/Hub-Seiten · Chrome (nav/header/footer) ausgeschlossen.`);
md.push("");
md.push("| URL | Money | raus | rein | Tiefe | Flags |");
md.push("|---|:--:|--:|--:|--:|---|");

let orphans = 0;
let thin = 0;
let deadend = 0;
for (const u of URLS) {
  const p = pages.get(u);
  const out = p.status === 200 ? p.links.size : 0;
  const inC = inbound.get(u).size;
  const d = depth.has(u) ? depth.get(u) : "∞";
  const isMoney = MONEY.has(u);
  const flags = [];
  if (p.status !== 200) flags.push(`HTTP ${p.status}`);
  if (inC === 0 && u !== "/") { flags.push("🚩 Orphan"); orphans++; }
  else if (isMoney && inC < 3) { flags.push("⚠ dünn"); thin++; }
  if (out < 3 && p.status === 200) { flags.push("⚠ Sackgasse"); deadend++; }
  if (typeof d === "number" && d > 3) flags.push("⚠ tief");
  md.push(`| \`${u}\` | ${isMoney ? "€" : ""} | ${out} | ${inC} | ${d} | ${flags.join(", ") || "—"} |`);
}

md.push("");
md.push(`**${orphans}** Orphans · **${thin}** dünne Money-Seiten (< 3 rein) · **${deadend}** Sackgassen (< 3 raus).`);
md.push("");
console.log(md.join("\n"));
