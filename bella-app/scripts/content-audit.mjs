#!/usr/bin/env node
/**
 * Thin-Content-Audit (Roadmap 4.1).
 *
 * Holt gerenderte Seiten von einem laufenden Server und misst je URL:
 *   - sinnvolle Wortzahl im Hauptinhalt (ohne nav/header/footer/script/style)
 *   - interne Links im <main>
 *   - Template-Anteil: Zeilen, die zwei Geschwister-Seiten desselben Typs teilen
 *     (Boilerplate) ÷ Gesamtzeilen der Seite
 *   - <title>-Länge, ob <meta name="robots" ... noindex>
 *
 * Flag-Schwelle:  Wörter < 350  ODER  Template-Anteil > 70 %  (und indexierbar)
 *
 * Nutzung:
 *   node scripts/content-audit.mjs                       # gegen http://localhost:3000
 *   BASE=http://localhost:3127 node scripts/content-audit.mjs > report.md
 *
 * Bewusst ohne Abhängigkeiten (fetch + Regex). Kein Cheerio.
 */

const BASE = process.env.BASE || "http://localhost:3000";
const WORD_FLAG = 350;
const TEMPLATE_FLAG = 0.70;

// Je Typ 2–3 echte Slugs, damit der Template-Anteil aus Geschwistern berechenbar ist.
const GROUPS = {
  "rasse": ["/rasse/labrador-retriever", "/rasse/mops", "/rasse/deutscher-schaeferhund"],
  "problem": ["/problem/allergie", "/problem/uebergewicht", "/problem/gelenkprobleme"],
  "futtertyp": ["/futtertyp/trockenfutter", "/futtertyp/barf", "/futtertyp/getreidefrei"],
  "lebensphase": ["/lebensphase/welpen", "/lebensphase/senior", "/lebensphase/adult"],
  "vergleich": ["/vergleich/barf-vs-trockenfutter", "/vergleich/trockenfutter-vs-nassfutter", "/vergleich/premium-vs-budget"],
  "tipps-kategorie": ["/tipps/ernaehrung", "/tipps/gesundheit", "/tipps/allergien"],
  "tipps-artikel": ["/tipps/ernaehrung/fleisch-an-erster-stelle", "/tipps/ernaehrung/offene-deklaration-bevorzugen"],
  "glossar": ["/glossar/rct", "/glossar/meta-analyse", "/glossar/mikrobiom"],
  "stadt-gross": ["/stadt/berlin", "/stadt/hamburg", "/stadt/muenchen"],
  "stadt-klein": ["/stadt/albstadt", "/stadt/freudenstadt", "/stadt/immenstadt"],
};

// Die Seiten wrappen ihren Inhalt NICHT in <main> — der einzige <main> im HTML
// ist der Suspense-Fallback aus loading.tsx. Also: Chrome + Fallback + RSC-Skripte
// rausschneiden und den Rest des <body> messen.
function stripToMain(html) {
  let s = html;
  const body = s.match(/<body[\s\S]*<\/body>/i);
  s = body ? body[0] : s;
  s = s.replace(/<script[\s\S]*?<\/script>/gi, " ");
  s = s.replace(/<style[\s\S]*?<\/style>/gi, " ");
  s = s.replace(/<template[\s\S]*?<\/template>/gi, " ");
  s = s.replace(/<svg[\s\S]*?<\/svg>/gi, " ");
  s = s.replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");
  // loading.tsx-Fallback (enthält den Sentinel) entfernen
  s = s.replace(/<main[\s\S]*?<\/main>/gi, (m) => (m.includes(LOADING_SENTINEL) ? " " : m));
  // Seiten-Chrome (SiteHeader/SiteFooter) — grob per Tag
  s = s.replace(/<(nav|header|footer|aside)[\s\S]*?<\/\1>/gi, " ");
  return s;
}

function textOf(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function words(t) {
  return t ? t.split(/\s+/).filter((w) => /[a-zA-ZäöüÄÖÜß0-9]/.test(w)).length : 0;
}

function internalLinks(mainHtml) {
  const hrefs = [...mainHtml.matchAll(/<a\s[^>]*href="([^"]+)"/gi)].map((m) => m[1]);
  return hrefs.filter((h) => h.startsWith("/") && !h.startsWith("//")).length;
}

function robotsNoindex(html) {
  const m = html.match(/<meta\s+name="robots"\s+content="([^"]*)"/i);
  return m ? /noindex/i.test(m[1]) : false;
}

function titleOf(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].trim() : "";
}

// grobe Sentence-/Zeilen-Menge zum Vergleich zweier Geschwister
function shingles(text) {
  return new Set(
    text
      .split(/(?<=[.!?])\s+|\n+/)
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 25),
  );
}

// Loading-Sentinel aus loading.tsx — bei ISR-Kaltstart wird der Suspense-Fallback
// ausgeliefert, während die Seite regeneriert. Dann kurz warten und erneut holen.
const LOADING_SENTINEL = "BELLA schnüffelt";

async function fetchOnce(path) {
  const res = await fetch(BASE + path, { headers: { "user-agent": "bella-content-audit" } });
  return { status: res.status, html: await res.text() };
}

async function fetchPage(path) {
  let status = 0;
  let html = "";
  for (let attempt = 0; attempt < 5; attempt++) {
    ({ status, html } = await fetchOnce(path));
    const mainLen = (html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? "").length;
    if (!html.includes(LOADING_SENTINEL) && mainLen > 600) break;
    await new Promise((r) => setTimeout(r, 900));
  }
  const mainHtml = stripToMain(html);
  const text = textOf(mainHtml);
  return {
    path,
    status,
    title: titleOf(html),
    noindex: robotsNoindex(html),
    words: words(text),
    links: internalLinks(mainHtml),
    shingles: shingles(text),
  };
}

function templateRatio(pages) {
  // Anteil der Shingles einer Seite, die in MINDESTENS einer Geschwister-Seite vorkommen.
  return pages.map((p) => {
    const others = pages.filter((q) => q !== p);
    if (!p.shingles.size || !others.length) return 0;
    let shared = 0;
    for (const s of p.shingles) if (others.some((q) => q.shingles.has(s))) shared++;
    return shared / p.shingles.size;
  });
}

const md = [];
md.push(`# Thin-Content-Audit — ${new Date().toISOString().slice(0, 10)}`);
md.push("");
md.push(`Quelle: \`${BASE}\` · Schwelle: Wörter < ${WORD_FLAG} **oder** Template-Anteil > ${Math.round(TEMPLATE_FLAG * 100)} % (bei indexierbaren Seiten).`);
md.push("");
md.push("| Typ | URL | Status | Wörter | int. Links | Template | noindex | Titel | Flag |");
md.push("|---|---|--:|--:|--:|--:|:--:|---|:--:|");

let flagged = 0;
let total = 0;

for (const [type, paths] of Object.entries(GROUPS)) {
  let pages;
  try {
    pages = await Promise.all(paths.map(fetchPage));
  } catch (e) {
    md.push(`| ${type} | — | ERR | | | | | ${String(e.message).slice(0, 40)} | |`);
    continue;
  }
  const ratios = templateRatio(pages);
  pages.forEach((p, i) => {
    total++;
    const tmpl = ratios[i];
    const flag = !p.noindex && p.status === 200 && (p.words < WORD_FLAG || tmpl > TEMPLATE_FLAG);
    if (flag) flagged++;
    md.push(
      `| ${type} | \`${p.path}\` | ${p.status} | ${p.words} | ${p.links} | ${Math.round(tmpl * 100)} % | ${p.noindex ? "ja" : "—"} | ${p.title.slice(0, 46)} | ${flag ? "🚩" : "—"} |`,
    );
  });
}

md.push("");
md.push(`**${flagged} / ${total}** Stichproben-URLs geflaggt.`);
md.push("");
console.log(md.join("\n"));
process.exit(0);
