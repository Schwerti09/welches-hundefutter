/**
 * BELLA Feed-Parser (Node-Port von scripts/parse-feeds.py) — liest AWIN- + AdCell-Feeds,
 * filtert HUNDE-FUTTER (kein Zubehör, keine Katze), normalisiert auf das dog_foods-Schema.
 *
 * Feeds kommen aus AWIN_FEED_URLS / ADCELL_FEED_URLS (kommagetrennt) — Cron/Netlify-Function.
 * Ohne diese Env-Vars: lokaler Fallback auf Dateien in ~/Downloads (manuelle Runs).
 */
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import { parse } from "csv-parse/sync";

// ── Filter-Heuristiken ───────────────────────────────────────────────────────
const FOOD_RE = /futter|nahrung|men[üu]\b|trockenfutter|nassfutter|kausnack|kauknochen|kaustange|kauartikel|leckerli|leckerchen|trainingssnack|barf|frostfutter|frischfleisch|dose|dosen|nass\b|trocken\b|kroketten|flocken|alleinfutter|erg[äa]nzungsfutter/i;
// Futter-Unterkategorien bei Mischshops (z.B. "Hund > BARF > Fertigbarf") — Pflege/Ergänzung ausgeschlossen
const FOOD_SUBCAT_RE = /^(BARF|Nassfutter|Trockenfutter|Snacks|Schonend gegart)/i;
const ACCESSORY_RE = /beutel|tasche|pocket|napf|leine|halsband|geschirr|spielzeug|\bball\b|decke|k[öo]rbchen|kissen|b[üu]rste|\bkamm\b|shampoo|mantel|jacke|schuhe|pfote(?:n)?schutz|transportbox|\bbox\b|eimer|zaun|gitter|clicker|pfeife|markierungs|kotbeutel|handschuh|h[üu]rde|tunnel|g[üu]rtel|rucksack|tragetasche|buch|dvd/i;
const DOG_RE = /hund|dog|welpe|barf|doggy/i;
const OTHER_PET_RE = /katz|\bcat\b|nager|kaninchen.?stall|vogel|\bfisch.?tank|aquarium|pferd|reit/i;

function isDogFood(title, cat, merchantIsDog = false) {
  const blob = `${title} ${cat}`.toLowerCase();
  if (ACCESSORY_RE.test(blob)) return false;
  if (OTHER_PET_RE.test(blob) && !DOG_RE.test(blob)) return false;
  if (!(merchantIsDog || DOG_RE.test(blob))) return false;
  return FOOD_RE.test(blob);
}

function inferType(t) {
  t = t.toLowerCase();
  if (/kausnack|kauknochen|kaustange|kauartikel|leckerli|trainingssnack|\bsnack|knochen|kn[öo]chelchen|sticks?\b|h[üu]lse|ohren|ziemer|smoothie|hundeeis/.test(t)) return "snack";
  if (/barf|frostfutter|frischfleisch|\broh\b/.test(t)) return "barf";
  if (/nassfutter|nass-|\bdose|dosen|frischebeutel|men[üu]\b|feucht|pastete|schonend gegart|frischemen/.test(t)) return "nass";
  if (/kaltgepresst/.test(t)) return "kaltgepresst";
  if (/trockenfutter|trocken|kroketten|flocken/.test(t)) return "trocken";
  return "trocken";
}

const PROTEINS = [
  ["h[äa]hnchen", "Huhn"], ["huhn", "Huhn"], ["h[üu]hn", "Huhn"], ["rind", "Rind"], ["lachs", "Lachs"], ["lamm", "Lamm"],
  ["ente", "Ente"], ["pute", "Pute"], ["truthahn", "Pute"], ["wild", "Wild"], ["kaninchen", "Kaninchen"],
  ["pferd", "Pferd"], ["ziege", "Ziege"], ["insekt", "Insekt"], ["fisch", "Fisch"], ["strauss", "Strauß"],
];
function inferProtein(t) {
  t = (t || "").toLowerCase();
  for (const [k, lab] of PROTEINS) {
    if (new RegExp(k).test(t)) return lab;
  }
  return null;
}

function suitableFor(t) {
  t = (t || "").toLowerCase();
  const s = [];
  if (/welpe|junior|puppy/.test(t)) s.push("welpen");
  if (/senior|\balt\b|ageing|aging|7\+|8\+/.test(t)) s.push("senior");
  if (/adult|erwachsen/.test(t)) s.push("adult");
  if (/allergie|sensitiv|hypoallergen|getreidefrei|grain.?free|monoprotein|magen/.test(t)) s.push("allergie");
  return s.length ? s : ["adult"];
}

function num(s) {
  if (!s) return null;
  s = String(s).trim();
  if (s.includes(",") && s.includes(".")) s = s.replaceAll(".", "").replaceAll(",", ".");
  else s = s.replaceAll(",", ".");
  const m = s.match(/-?\d+(?:\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}

function weightKg(t) {
  t = (t || "").toLowerCase();
  let m = t.match(/(\d+(?:[.,]\d+)?)\s*kg\b/);
  if (m) return parseFloat(m[1].replace(",", "."));
  m = t.match(/(\d+)\s*g\b/);
  if (m) return parseFloat(m[1]) / 1000;
  return null;
}

function slugify(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function cleanTitle(title) {
  if (title.includes("|")) {
    let parts = title.split("|").map((p) => p.trim());
    parts = parts.filter((p) => p && p.toLowerCase() !== "haustierkost");
    if (parts.length) return parts[0];
  }
  return title.trim();
}

function stripBrandChars(s) {
  return (s || "").replace(/^[®™,]+|[®™,]+$/g, "");
}

function smartOpen(buf) {
  if (buf.length >= 2 && buf[0] === 0x1f && buf[1] === 0x8b) buf = zlib.gunzipSync(buf);
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buf);
  } catch {
    return new TextDecoder("windows-1252").decode(buf);
  }
}

function add(out, rec) {
  if (!rec.affiliateUrl || !rec.name) return;
  if (!(rec.slug in out)) out[rec.slug] = rec;
}

function csvRows(content, delimiter) {
  return parse(content, { columns: true, delimiter, bom: true, skip_empty_lines: true, relax_column_count: true });
}

const GRAIN_FREE_RE = /getreidefrei|grain.?free/i;
const HYPOALLERGENIC_RE = /hypoallergen|sensitiv|monoprotein|allergie/i;

// Reine Hundefutter-Marken im AdCell-Netzwerk — Titel enthält oft kein Wort wie "Hund"
// (z.B. "Geflügel, Reis & Gemüse"), daher würde isDogFood() sie sonst verwerfen.
// Domain-Erkennung statt Modus-Parameter, damit das für ENV-URLs UND den lokalen
// Fallback gleich funktioniert, ohne das ENV-Variablen-Format ändern zu müssen.
const DOG_MERCHANT_DOMAINS = ["milo-mia.de", "salingo.de", "paulis-petfood.de"];
function isDogMerchantDeeplink(deeplink) {
  if (!deeplink) return false;
  try {
    const url = new URL(deeplink);
    const target = url.hostname.endsWith("adcell.com") ? url.searchParams.get("param0") : deeplink;
    if (!target) return false;
    const host = new URL(target).hostname.replace(/^www\./, "");
    return DOG_MERCHANT_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`));
  } catch {
    return false;
  }
}

/**
 * mode:
 * - "schecker": Hunde-Shop, Top-Kategorie muss Hundefutter/Hundesnacks sein + isDogFood
 * - "petfood_brand": reiner Tiernahrung-Hersteller (z.B. bosch) — alles unter Top-Kat "Hund" ist Futter
 * - "mixed_shop": Mischshop (z.B. Haustierkost) — nur Futter-Subkategorien (BARF/Nass/Trocken/Snacks)
 * - "default": generische Heuristik (isDogFood)
 */
function parseAwin(content, mode, out) {
  let n = 0;
  for (const row of csvRows(content, ",")) {
    const title = cleanTitle(row.product_name || "");
    const cat = row.merchant_category || "";
    const parts = cat.split(">").map((p) => p.trim());
    const top = parts[0] || "";
    const sub = parts[1] || "";

    if (mode === "schecker") {
      if (!isDogFood(title, cat, true)) continue;
      if (!["Hundefutter", "Hundesnacks"].includes(top)) continue;
    } else if (mode === "petfood_brand") {
      if (top !== "Hund") continue;
    } else if (mode === "mixed_shop") {
      if (!["Hund", "Hund & Katze"].includes(top)) continue;
      if (!FOOD_SUBCAT_RE.test(sub)) continue;
    } else {
      if (!isDogFood(title, cat)) continue;
    }

    const price = num(row.search_price);
    const wk = weightKg(title);
    const ppk = price && wk && wk > 0 ? Math.round((price / wk) * 100) / 100 : null;
    const brand = stripBrandChars(title ? title.split(/\s+/)[0] : "");
    add(out, {
      slug: slugify(`${brand}-${title}-${row.aw_product_id || ""}`),
      brand: brand || row.merchant_name || "",
      name: title.trim(),
      type: inferType(`${title} ${cat}`),
      protein: inferProtein(title),
      isGrainFree: GRAIN_FREE_RE.test(title),
      isHypoallergenic: HYPOALLERGENIC_RE.test(title),
      pricePerKg: ppk,
      price,
      suitableFor: suitableFor(`${title} ${cat}`),
      imageUrl: row.merchant_image_url || row.aw_image_url || null,
      affiliateNetwork: "awin",
      affiliateUrl: row.aw_deep_link || row.merchant_deep_link || "",
      source: row.merchant_name || "awin",
    });
    n++;
  }
  return n;
}

function parseAdcell(content, out) {
  let n = 0;
  for (const row of csvRows(content, ";")) {
    const title = row["Produkt-Titel"] || "";
    const cat = row["Produktkategorie"] || "";
    const dogMerchant = isDogMerchantDeeplink(row["Deeplink"]);
    if (!isDogFood(title, cat, dogMerchant)) continue;
    const price = num(row["Preis (Brutto)"]);
    const gpUnit = (row["Grundpreiseinheit"] || "").toLowerCase();
    let ppk = gpUnit.includes("kg") ? num(row["Grundpreis"]) : null;
    if (ppk == null) {
      const wk = weightKg(`${title} ${row["Inhalt"] || ""}`);
      ppk = price && wk && wk > 0 ? Math.round((price / wk) * 100) / 100 : null;
    }
    const brand = stripBrandChars(row["Hersteller"] || (title ? title.split(/\s+/)[0] : ""));
    add(out, {
      slug: slugify(`${brand}-${title}-${row["europäische Artikelnummer EAN"] || row["Anbieter Artikelnummer AAN"] || ""}`),
      brand,
      name: title.trim(),
      type: inferType(`${title} ${cat}`),
      protein: inferProtein(title),
      isGrainFree: GRAIN_FREE_RE.test(title),
      isHypoallergenic: HYPOALLERGENIC_RE.test(title),
      pricePerKg: ppk,
      price,
      suitableFor: suitableFor(`${title} ${cat}`),
      imageUrl: row["Produktbild-URL"] || row["Vorschaubild-URL"] || null,
      affiliateNetwork: "adcell",
      affiliateUrl: row["Deeplink"] || "",
      source: brand || "adcell",
    });
    n++;
  }
  return n;
}

/**
 * AWIN-Feed im Google-Shopping-Format (title/price/brand/image_link/aw_deep_link).
 * Wird für reine Snack-/Kauartikel-Shops genutzt (z.B. fidelis.dog).
 */
function parseAwinShopping(content, out) {
  let n = 0;
  for (const row of csvRows(content, ",")) {
    const title = row.title || "";
    const price = num(row.price);
    const wk = weightKg(title);
    const ppk = price && wk && wk > 0 ? Math.round((price / wk) * 100) / 100 : null;
    const brand = stripBrandChars(row.brand || (title ? title.split(/\s+/)[0] : ""));
    add(out, {
      slug: slugify(`${brand}-${title}-${row.gtin || row.mpn || ""}`),
      brand,
      name: title.trim(),
      type: inferType(title),
      protein: inferProtein(title),
      isGrainFree: GRAIN_FREE_RE.test(title),
      isHypoallergenic: HYPOALLERGENIC_RE.test(title),
      pricePerKg: ppk,
      price,
      suitableFor: suitableFor(title),
      imageUrl: row.image_link || null,
      affiliateNetwork: "awin",
      affiliateUrl: row.aw_deep_link || row.link || "",
      source: brand || "awin",
    });
    n++;
  }
  return n;
}

/**
 * AWIN liefert zwei unterschiedliche CSV-Layouts unter demselben "AWIN_FEED_URLS":
 * das Standard-Produktfeed (product_name/merchant_category/search_price) und das
 * Google-Shopping-Format (title/price/brand, z.B. Mera Tiernahrung). Header-Zeile
 * prüfen statt einen festen Modus zu erzwingen, sonst landen Shopping-Feeds als
 * 0-Treffer-Fehlschlag (Spalten existieren schlicht nicht).
 */
function detectAwinFormat(content) {
  const header = content.slice(0, content.indexOf("\n"));
  return header.includes("product_name") ? "default" : "shopping";
}

async function downloadFeed(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "BELLA-FeedBot/1.0" },
    signal: AbortSignal.timeout(120_000),
  });
  if (!res.ok) throw new Error(`Download fehlgeschlagen (${res.status}): ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

export async function parseFeeds() {
  const out = {};
  console.log("BELLA Feed-Parser (Node)");

  // AWIN_FEED_URLS/ADCELL_FEED_URLS sind in Netlify als "sensitive" markiert — der
  // bestehende Wert lässt sich nicht mehr auslesen (auch nicht per CLI/Dashboard für
  // den Account-Owner), Anhängen würde also blind den unbekannten Altwert riskieren.
  // Neue Feeds kommen stattdessen über _EXTRA-Variablen, die mit dem Hauptwert
  // zusammengeführt werden — nicht-destruktiv, alter Wert bleibt unberührt.
  const splitUrls = (v) => (v || "").split(",").map((s) => s.trim()).filter(Boolean);
  const awinUrls = [...splitUrls(process.env.AWIN_FEED_URLS), ...splitUrls(process.env.AWIN_FEED_URLS_EXTRA)];
  const adcellUrls = [...splitUrls(process.env.ADCELL_FEED_URLS), ...splitUrls(process.env.ADCELL_FEED_URLS_EXTRA)];

  if (awinUrls.length || adcellUrls.length) {
    for (const [i, url] of awinUrls.entries()) {
      console.log(`  ⬇ AWIN ${i}: ${url.slice(0, 70)}…`);
      const content = smartOpen(await downloadFeed(url));
      const format = detectAwinFormat(content);
      const n = format === "shopping" ? parseAwinShopping(content, out) : parseAwin(content, "default", out);
      console.log(`  AWIN feed ${i} [${format}]: ${n} Futter`);
    }
    for (const [i, url] of adcellUrls.entries()) {
      console.log(`  ⬇ AdCell ${i}: ${url.slice(0, 70)}…`);
      const content = smartOpen(await downloadFeed(url));
      console.log(`  AdCell feed ${i}: ${parseAdcell(content, out)} Futter`);
    }
  } else {
    // Lokaler Fallback für manuelle Runs (Feed-Dateien in ~/Downloads)
    const dl = process.env.FEED_DIR || path.join(homedir(), "Downloads");
    const AWIN_FEEDS = [
      [path.join(dl, "11703-23513-de_DE-Default.csv.gz"), "schecker"],
      [path.join(dl, "56633-107909-de_DE-Default.csv.gz"), "default"],
      [path.join(dl, "84955-99728-de_DE-Produktdatenfeed.csv.gz"), "petfood_brand"],
      [path.join(dl, "datafeed_615299 (24).csv.gz"), "mixed_shop"],
    ];
    const ADCELL_FEEDS = [
      "419197-66376.csv", "521034-66376.csv", "496158-66376.csv", "630262-66376.csv",
      "540252-66376.csv", "372544-66376.csv", "434708-66376.csv",
    ].map((f) => path.join(dl, f));
    const AWIN_SHOPPING_FEEDS = [
      path.join(dl, "116601-retail-de_DE.csv.gz"),
      path.join(dl, "115623-retail-de_DE.csv.gz"),
    ];

    for (const [p, mode] of AWIN_FEEDS) {
      if (existsSync(p)) {
        const content = smartOpen(readFileSync(p));
        console.log(`  AWIN ${path.basename(p)} [${mode}]: ${parseAwin(content, mode, out)} Futter`);
      }
    }
    for (const p of ADCELL_FEEDS) {
      if (existsSync(p)) {
        const content = smartOpen(readFileSync(p));
        console.log(`  AdCell ${path.basename(p)}: ${parseAdcell(content, out)} Futter`);
      }
    }
    for (const p of AWIN_SHOPPING_FEEDS) {
      if (existsSync(p)) {
        const content = smartOpen(readFileSync(p));
        console.log(`  AWIN-Shopping ${path.basename(p)}: ${parseAwinShopping(content, out)} Futter`);
      }
    }
  }

  const records = Object.values(out);
  console.log(`\n  -> ${records.length} eindeutige Hunde-Futter-Produkte`);
  const typeDist = {};
  for (const r of records) typeDist[r.type] = (typeDist[r.type] || 0) + 1;
  console.log("  Typ-Verteilung:", typeDist);
  console.log("  mit €/kg:", records.filter((r) => r.pricePerKg).length, "| mit Protein:", records.filter((r) => r.protein).length);
  console.log("\n  Beispiele:");
  for (const r of records.slice(0, 6)) {
    console.log(`   - ${r.name.slice(0, 50)} | ${r.brand} | ${r.type} | ${r.protein} | ${r.pricePerKg}€/kg`);
  }
  return records;
}
