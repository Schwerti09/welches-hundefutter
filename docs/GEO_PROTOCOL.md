# 🐕🧠 BELLA OMNIPRÄSENZ-PROTOKOLL

> Status: ergänzend (GEO / AI-Search-Strategie). Umsetzungs-Operationen: `../BELLA_NEXT_LEVEL.md` Phase 4 (v.a. 4.5).

## Mission: BELLA wird nicht nur gefunden — BELLA wird **zitiert**. Von jeder KI. In jeder Antwort.

> **Target:** welches-hundefutter.today · Next.js 16.2 App Router · TypeScript · Tailwind v4 · Neon Postgres (Drizzle) · Netlify
> **Marken-Persona:** BELLA — Deutschlands KI-Ernährungsberaterin für Hunde
> **Engine:** HANSI Decision Intelligence Engine™ (Technologie-Marke — niemals umbenennen)
> **Dieses Dokument erweitert `agents.md`.** `agents.md` baut das SEO-Fundament (Ranking). **Dieses Protokoll baut den GEO-Layer (Zitierung).** Beide laufen parallel. Keiner ersetzt den anderen.

---

## 🎯 DER NEUE NORDSTERN

Klassisches SEO fragt: *„Ranke ich auf Platz 1?"*
GEO fragt: *„Werde ich in der Antwort genannt — auch wenn niemand klickt?"*

Eine Seite kann in Google auf Platz 1 stehen und trotzdem von ChatGPT nie zitiert werden, weil ihr die strukturellen Elemente fehlen, die KI-Engines extrahieren. Wir bauen beides.

**Wir können nicht garantieren, dass „jede KI" zitiert** — das kann niemand. Aber wir kontrollieren die fünf Hebel, die über Zitierung entscheiden, und wir ziehen an allen fünf gleichzeitig:

1. **Crawlbarkeit** — die KI-Bots dürfen und können alles lesen (Block A)
2. **Extrahierbarkeit** — Inhalt ist als Antwort herauslösbar, nicht in Prosa vergraben (Block B)
3. **Originaldaten & Autorität** — wir liefern Zahlen, die es sonst nirgends gibt (Block B2 + C)
4. **Entität** — die KI „kennt" BELLA als benannte Marke, nicht als anonyme URL (Block C)
5. **Bing-Index** — denn ChatGPT-Suche läuft über Bing (Block A2)

Schwarze Tricks (Cloaking, Fake-Reviews, gekaufte Masse-Backlinks) sind **verboten** — sie fliegen auf und werden von Google *und* KI bestraft. Echte Originaldaten und echte Experience schlagen jeden Trick. Das ist nicht Vorsicht, das ist die effektivere Strategie.

---

## 0. SO FÜHRST DU DIESEN PLAN IN WINDSURF AUS (Claude + Cascade)

**Du bist Claude in Windsurf Cascade. Du bist Lead GEO-Engineer für BELLA.**

### 0.1 Einrichtung der Regel-Datei

Windsurf-Regeln haben ein Zeichenlimit pro Datei. Dieses Protokoll ist zu lang für eine einzelne Always-On-Regel. Deshalb:

1. Lege dieses Dokument ab als `docs/GEO_PROTOCOL.md` im Repo.
2. Erstelle `.windsurf/rules/geo-protocol.md` als **kurze Always-On-Regel** mit folgendem Inhalt:

```md
---
trigger: always_on
---
# BELLA GEO-Regel
Lies bei GEO-/SEO-/Content-/Schema-/Performance-Arbeit zuerst `docs/GEO_PROTOCOL.md`.
Nicht-verhandelbar (Kurzform):
- Jede Seite öffnet mit einer Direkt-Antwort in den ersten 40–60 Wörtern.
- Kein Claim ohne Zahl oder Quelle, wo möglich.
- Alle seriösen KI-Crawler sind erlaubt; Bytespider wird am Edge geblockt.
- Bing-Index ist Pflicht (ChatGPT-Suche = Bing).
- INP < 200 ms und LCP < 2,5 s im Feld, sonst kein Release.
- Nur echte Bewertungen/Reviews im Schema. Niemals erfundene Zahlen.
- Der BELLA-Datenreport ist das Herz und wird quartalsweise aktualisiert.
```

### 0.2 Cascade-Befehlskette (Kickoff)

```
Du bist Lead GEO-Engineer für BELLA (welches-hundefutter.today).
Stack: Next.js 16.2 App Router, TypeScript, Tailwind v4, Neon Postgres (Drizzle), Netlify.
agents.md (SEO-Fundament) ist umgesetzt. Jetzt baust du den GEO-Layer aus docs/GEO_PROTOCOL.md.

Arbeitsweise:
1. Nutze Planning-Mode für jeden Block. Zeig mir den Plan vor der Umsetzung.
2. Ein Block = ein Pull Request. Erst Akzeptanzkriterien erfüllen, dann nächster Block.
3. Vor jedem Merge: Schema validieren, Build grün, Lighthouse + CWV prüfen.
4. Reihenfolge laut „EXEKUTIONS-REIHENFOLGE" am Ende des Dokuments. Beginne mit BLOCK A.
5. Bei API-Details, die sich geändert haben könnten (z. B. Next.js 16.2 PPR-Flag),
   prüfe die offizielle Doku, bevor du implementierst. Rate nicht.

Keine Rückfragen zu Dingen, die im Protokoll stehen. Implementiere. Reihenfolge ist Befehl.
```

### 0.3 Memory anlegen

Lass Claude eine Windsurf-Memory mit den Nicht-verhandelbaren Punkten (siehe Ende) erstellen, damit sie über Sessions hinweg bestehen bleiben.

---

# BLOCK A — TECHNISCHES KI-FUNDAMENT

> Ziel: Jeder KI-Crawler darf alles lesen, kann alles lesen, und ChatGPT findet uns überhaupt erst (Bing). Ohne diesen Block ist alles Weitere wirkungslos.

## A1 — KI-CRAWLER VOLLZUGRIFF (`robots.ts`)

BELLA *will* von KI gefressen werden — Training **und** Retrieval. Wir blocken keine seriösen KI-Bots, wir laden sie ein. Stand 2026 sind das die relevanten User-Agents:

**Datei:** `src/app/robots.ts`

```ts
import { MetadataRoute } from 'next'

const BASE = 'https://welches-hundefutter.today'

// BELLA wird von KI gelesen. Alle seriösen KI-Crawler bekommen Vollzugriff.
const AI_BOTS = [
  // OpenAI / ChatGPT
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  // Anthropic / Claude
  'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai',
  // Perplexity
  'PerplexityBot', 'Perplexity-User',
  // Google (Gemini, AI Overviews, AI Mode)
  'Google-Extended', 'Googlebot',
  // Microsoft (Bing/Copilot — versorgt auch ChatGPT-Suche)
  'Bingbot',
  // Apple Intelligence
  'Applebot', 'Applebot-Extended',
  // Amazon (Rufus/Alexa+)
  'Amazonbot',
  // weitere
  'CCBot', 'Meta-ExternalAgent', 'DuckAssistBot', 'MistralAI-User', 'cohere-ai',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/', '/_next/'] },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: '/' })),
      // Bytespider ignoriert robots.txt -> hier nur symbolisch, echter Block am Edge (A1b)
      { userAgent: 'Bytespider', disallow: '/' },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  }
}
```

### A1b — Bytespider am Edge blocken (`netlify.toml`)

Bytespider (ByteDance/TikTok) ignoriert robots.txt nachweislich. Der einzige wirksame Block ist serverseitig:

```toml
[[edge_functions]]
  path = "/*"
  function = "block-bad-bots"
```

Edge-Function `netlify/edge-functions/block-bad-bots.ts`: prüft `user-agent` auf `Bytespider` (und ggf. weitere Aggressoren) → `403`. Alle freundlichen KI-Bots passieren.

**Akzeptanzkriterien A1:**
- `https://welches-hundefutter.today/robots.txt` liefert `200`, jeder KI-Bot hat eine `Allow`-Zeile.
- Kein versehentliches `Disallow: /` unter `Googlebot` oder `Bingbot` (würde die Seite deindexieren).
- Bytespider erhält `403` am Edge (mit curl + Fake-UA testen).

## A2 — BING-INDEX & INDEXNOW (NICHT VERHANDELBAR)

**ChatGPT-Suche läuft über den Bing-Index.** Wer nicht in Bing ist, kann von ChatGPT nicht zitiert werden — egal wie gut die Seite ist. Die meisten SEO-Teams vergessen das komplett. Das ist dein unfairer Vorteil.

1. **Bing Webmaster Tools** einrichten, Property verifizieren, `sitemap.xml` einreichen. (Import aus Google Search Console möglich.)
2. **IndexNow** aktivieren — pusht neue/geänderte URLs sofort an Bing & Co., statt auf den nächsten Crawl zu warten. Perfekt, weil BELLAs Preisdaten sich täglich ändern.

**Datei:** `public/<INDEXNOW_KEY>.txt` (Inhalt = der Key selbst, 32+ Hex-Zeichen)

**Datei:** `src/lib/indexnow.ts`

```ts
const KEY = process.env.INDEXNOW_KEY!
const HOST = 'welches-hundefutter.today'
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`

export async function pingIndexNow(urls: string[]) {
  if (!urls.length) return
  await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls }),
  })
}
```

**Verdrahtung:** Bereits im täglichen Feed-Cron (**Netlify Scheduled Function**
`bella-app/netlify/functions/import-feeds.mts`, ruft `scripts/lib/indexnow-ping.mjs`) —
bei jeder Preis-/Produktänderung gehen die betroffenen URLs an IndexNow. Kein GitHub Actions.

**Akzeptanzkriterien A2:**
- Bing Webmaster zeigt die Sitemap als eingelesen.
- `/<KEY>.txt` liefert den Key als reinen Text.
- Feed-Cron ruft `pingIndexNow()` mit den geänderten URLs auf (Log prüfen).

## A3 — `llms.txt` + `llms-full.txt` (machen, aber nicht überbewerten)

**Ehrliche Einordnung:** Stand 2026 gibt es keinen belastbaren Beleg, dass `llms.txt` die KI-Retrieval messbar verbessert — die Crawler-Betreiber haben es größtenteils nicht bestätigt. Aber: die Kosten sind nahe null, es schadet nie, und es ist ein sauberes Inhaltsverzeichnis für Agenten. Also machen wir es — als Beilage, **niemals als Ersatz** für strukturierten Content (Block B). Nicht darauf verlassen.

- `public/llms.txt`: Kurzprofil + Links zu den wichtigsten Seiten (Basis ist schon in `agents.md` Operation 06 — übernehmen und um `/report`, `/methodik`, `/vergleich` ergänzen).
- `public/llms-full.txt`: Voll-Korpus der Kerninhalte als Markdown, **automatisch beim Build generiert** aus den Programmatic-Daten (Rassen, Probleme, FAQ, Report-Kennzahlen). Build-Skript `scripts/build-llms-full.ts` schreibt die Datei.

**Akzeptanzkriterien A3:** Beide Dateien `200`, `llms-full.txt` wird bei jedem Build neu erzeugt und enthält die aktuellen Report-Zahlen.

## A4 — KI-BOT-MONITORING (wer frisst uns wirklich?)

Du kannst Zitierung nur steuern, wenn du siehst, wer crawlt. Logge KI-Bot-Treffer.

- Leichtgewichtiges Logging in einer Edge-/Middleware-Schicht oder via Netlify-Logs: User-Agent gegen die `AI_BOTS`-Liste matchen → in eine Tabelle `crawler_hits` (Drizzle) schreiben: `userAgent`, `path`, `timestamp`.
- Dashboard-Query: Treffer pro Bot pro Woche.

**Akzeptanzkriterien A4:** Nach 7 Tagen sind reale Treffer von mindestens `GPTBot`, `ClaudeBot`, `PerplexityBot`, `OAI-SearchBot`, `Googlebot`, `Bingbot` sichtbar.

## A5 — ALLES IM INITIAL-HTML (kein JS-Gating)

Viele KI-Crawler rendern JavaScript schlecht oder gar nicht. **Jeder zitierfähige Inhalt muss serverseitig im ersten HTML stehen** (SSG/SSR via App Router + RSC). Keine Antworten, Tabellen, FAQ oder Daten, die erst clientseitig nachgeladen werden.

**Akzeptanzkriterien A5:** `curl -A "GPTBot" <url>` enthält die Direkt-Antwort, die Vergleichstabelle und die FAQ vollständig im Quelltext — ohne JS-Ausführung.

---

# BLOCK B — CITATION ENGINEERING (das Herzstück)

> Hier wird entschieden, ob du zitiert wirst. Princeton-Forschung zu GEO zeigt: **Statistiken einbauen, Quellen zitieren und prägnante Zitate** heben die KI-Sichtbarkeit am stärksten — um bis zu ~40 %. Keyword-Stuffing bringt nichts. Wir bauen jede Seite so, dass eine KI die Antwort sauber herauslösen und BELLA als Quelle nennen kann.

## B1 — ANTWORT-ZUERST-ARCHITEKTUR (BLUF)

Jede Seite (Programmatic + Artikel) öffnet mit:

1. **Direkt-Antwort, 40–60 Wörter**, in einer Box mit Klasse `.bella-answer`. Beantwortet die Suchfrage in einem Satzblock, eigenständig zitierfähig.
2. **„Das Wichtigste in Kürze" / Key-Takeaways**, 3–5 Bulletpoints mit harten Fakten, Klasse `.bella-tldr`.
3. **Dann erst** die Tiefe (1.500+ Wörter laut `agents.md`).

H2-Überschriften werden als **echte Fragen** formuliert (passend zum „Query-Fan-out": KI zerlegt eine Frage in Unterfragen und sucht für jede einzeln). Beispiel-Cluster für eine Rasse:
- „Welches Futter ist das beste für einen [Rasse]?"
- „Wie viel sollte ein [Rasse] pro Tag fressen?"
- „Welche Krankheiten hat der [Rasse] und welches Futter hilft?"
- „Trocken- oder Nassfutter für [Rasse]?"

Baue eine wiederverwendbare Komponente `AnswerBox` und `KeyTakeaways`, die in **jedes** Programmatic-Template eingesetzt wird.

**Akzeptanzkriterien B1:** Jede Programmatic-Seite hat `.bella-answer` (40–60 Wörter) und `.bella-tldr` ganz oben im HTML.

## B2 — DER ORIGINALDATEN-MOTOR ⭐ (die wichtigste Operation im ganzen Plan)

**KI zitiert Originaldaten am liebsten — Zahlen, die es sonst nirgends gibt.** Du hast bereits einen Katalog mit **tausenden** Hundefuttersorten *und* eine `price_history`-Tabelle. Das ist ein Datenschatz, den kein Konkurrent in der Nische hat. Wir verwandeln ihn in **den** Zitier-Magneten:

### „BELLA Hundefutter-Datenreport 2026"

Eine eigene Route `/report/hundefutter-2026` mit ausgewerteten Eigendaten, z. B.:
- Durchschnittlicher Fleischanteil über alle Sorten (und nach Preisklasse)
- Verteilung Preis/kg (Median, Spannweite, Top-/Flop-10)
- Anteil getreidefreier / monoprotein / hypoallergener Sorten
- Häufigkeit einzelner Allergene (Huhn, Rind, Weizen …) im Sortiment
- **Preisentwicklung** aus `price_history` (z. B. „Premium-Trockenfutter +X % in 12 Monaten")
- Zahlen pro Rasse/Lebensphase, sowee ableitbar

Aggregation als Drizzle-Queries in `src/lib/report.ts`, gecached und beim täglichen Cron neu berechnet.

**Jede Kennzahl bekommt einen eindeutigen, zitierfähigen Satz**, z. B.: „Über alle 4.000+ ausgewerteten Sorten liegt der durchschnittliche Fleischanteil bei XX % — Premium-Sorten erreichen YY %." Genau so eine Zeile landet in einer KI-Antwort, mit BELLA als Quelle.

Dazu (siehe Block H4) `Dataset`-Schema und ein **öffentlicher Download** als CSV + JSON unter `/data/hundefutter-2026.csv|json`. Datasets sind separat auffindbar und werden gern zitiert und verlinkt.

**Akzeptanzkriterien B2:**
- `/report/hundefutter-2026` live, jede Kennzahl als eigenständiger Aussagesatz + Tabelle.
- CSV + JSON downloadbar, `Dataset`-Schema validiert.
- Report wird quartalsweise aktualisiert (datum sichtbar + `dateModified`).

## B3 — STATISTIK-INJEKTION

Streue in jeden Artikel konkrete, belegte Zahlen — eigene (aus B2) und externe (mit Quelle: FEDIAF-Fütterungsrichtlinien, Bundesverband für Tiergesundheit, Studien). Vage Prosa raus, Zahlen rein. „Viel Fleisch" → „über 70 % Fleischanteil (Quelle: …)".

## B4 — ZITIERFÄHIGE KERNAUSSAGEN + EXPERTENZITATE

- Pro Abschnitt 1–2 kurze, deklarative „Lift-out"-Sätze, die eine KI **wörtlich** übernehmen kann.
- Echte, benannte Expertenzitate (Tierarzt, siehe Block I) als `<blockquote>` mit Attribution. „Quotation Addition" ist laut Forschung einer der stärksten Hebel.

## B5 — VERGLEICHSTABELLEN ALS MASCHINENLESBARE DATEN

KI liebt Tabellen für „beste X"-Fragen. Jede Vergleichstabelle:
- Konsistente Spalten (Marke/Sorte · Eignung · Preis/kg · Fleischanteil · Bewertung)
- Sauberes `<table>`-Markup (kein Div-Layout) im Initial-HTML
- Parallel als `Product`/`Offer`-Schema (Block H1)

## B6 — METHODIK- & TRANSPARENZSEITE (`/methodik`)

KI-Engines **bevorzugen Quellen, die ihre Methodik offenlegen** — und es ist ein starkes E-E-A-T-Signal. Eine öffentliche Seite „Wie BELLA bewertet":
- Bewertungskriterien & Gewichtung (Fleischanteil, Zusatzstoffe, Preis-Leistung, Eignung …)
- Datenherkunft (Feeds, Hersteller, Preisquellen, Aktualisierungs-Rhythmus)
- Unabhängigkeit + ehrliche **Affiliate-Offenlegung**
- Wer die Inhalte prüft (Tierarzt)

**Akzeptanzkriterien B6:** `/methodik` live, verlinkt aus Footer + jeder Vergleichs-/Test-Seite.

## B7 — FRISCHE ALS WAFFE

KI bevorzugt aktuelle Quellen. Du hast einen täglichen Feed-Cron — nutze ihn sichtbar:
- „Zuletzt aktualisiert: [Datum]" sichtbar auf jeder datengetriebenen Seite + `dateModified` im Schema.
- Tagesaktuelle Preise sind ein Moat, den statische Konkurrenten nicht haben → prominent machen („Preise von heute, [Datum]").

---

# BLOCK C — ENTITÄT & OFF-SITE-AUTORITÄT

> On-Site allein reicht nicht. KI-Zitate fließen überproportional zu **erkannten Entitäten** und zu wenigen Autoritätsquellen. Wikipedia macht grob die Hälfte der Top-Zitate von ChatGPT aus; Reddit wird massiv herangezogen. Wir sorgen dafür, dass KI BELLA als benannte Marke versteht und an den Orten findet, denen sie vertraut.

## C1 — ENTITÄT DEFINIEREN

- `Organization`- und `Person`-Schema (BELLA + Gründer) mit `sameAs` zu **allen** Profilen (Website, Social, YouTube, Trustpilot, Wikidata).
- Konsistenter Name/Beschreibung überall im Web (NAP-Konsistenz für Marken).

## C2 — WIKIDATA / WIKIPEDIA (realistisch)

- **Wikidata-Item** für die Marke und für den „Hundefutter-Datenreport" anlegen (niedrige Hürde, speist Knowledge Graphs).
- Wikipedia: hohe Relevanzhürde — kein Spam. Realistischer Weg: den Report als **zitierfähige Quelle** in thematisch passenden Artikeln platzieren (faktenbasiert, regelkonform), wenn er von Dritten aufgegriffen wird.

## C3 — REDDIT & COMMUNITY

KI zieht stark aus Reddit/Foren. Echte, hilfreiche Teilnahme (kein Spam) in r/Hunde, r/dogs (DE-Threads), gutefrage.net, Hundeforen. Der Datenreport ist von Natur aus teilbar und liefert Diskussionsstoff.

## C4 — DIGITAL PR ÜBER ORIGINALDATEN

Der Report ist dein verlinkbarer Aufhänger. Pitch an DACH-Tier-/Verbraucher-/News-Redaktionen („Studie: So viel Fleisch steckt wirklich im deutschen Hundefutter"). Datengetriebene PR bringt echte, redaktionelle Backlinks — die Sorte, die sowohl SEO als auch GEO stärkt. (Tier-1/2/3-Liste steht in `agents.md` Operation 14 — Report als Köder nutzen.)

## C5 — DRITTANBIETER-PROFILE & REVIEWS

Trustpilot · ProvenExpert · Google Business Profile. Konsistente Entitäts-Signale, echte Bewertungen. (Nur echte — siehe Compliance-Hinweis bei H1.)

## C6 — YOUTUBE / SHORT-FORM

Ein Kanal mit Fütterungs-/Vergleichsvideos. Google/Gemini flächen Video stark; Transkripte werden zitierfähig (siehe F6). Auch Pinterest als DACH-relevanter visueller Discovery-Kanal (F5).

---

# BLOCK D — VOICE & CONVERSATIONAL SEARCH

> Gesprochene und dialogische Anfragen sind länger, natürlicher und fragenförmig. Wir bedienen sie und markieren die Antwortblöcke als vorlesbar.

## D1 — `SpeakableSpecification`-Schema

Auf den Antwort-/TL;DR-Blöcken:

```ts
const speakable = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.bella-answer', '.bella-tldr'] },
}
```

## D2 — KONVERSATIONELLES LONG-TAIL (Query-Fan-out)

Content für natürliche Ganzsätze: „welches futter ist gut für einen labrador-welpen mit sensiblem magen". Mappe pro Hauptseite die wahrscheinlichen **Unterfragen** und beantworte sie als eigene H2/FAQ-Einträge.

## D3 — FAQ ÜBERALL (40–60-Wörter-Antworten)

Die Killer-FAQ aus `agents.md` Operation 12 auf **jede** Programmatic-Seite ausweiten (rassen-/problemspezifisch), jeweils mit `FAQPage`-Schema. Antworten exakt 40–60 Wörter (Featured-Snippet- und Voice-Format).

## D4 — POSITION-ZERO-FORMATE + `HowTo`

- Antwortboxen, Definitionsboxen.
- Schritt-für-Schritt-Inhalte (Futterumstellung, Futtermenge berechnen) mit `HowTo`-Schema.

## D5 — DEUTSCHE SPRACH-MUSTER + REGIONALE INTENTION

Gesprochene deutsche Frageformen abdecken; regionale/„in meiner Nähe"-Intention an Block E koppeln.

**Akzeptanzkriterien Block D:** `FAQPage` + `SpeakableSpecification` validiert auf allen Programmatic-Templates; `HowTo` auf den Anleitungs-Seiten.

---

# BLOCK E — GEO / LOKAL & DACH-OMNIPRÄSENZ

> „Hundefutter" ist kein deutsches Thema — es ist ein DACH-Thema. Österreich und Schweiz sind nahezu unbesetzt. Wir nehmen sie mit.

## E1 — `hreflang` de-DE / de-AT / de-CH (+ x-default)

In den `alternates.languages` der Metadata. Saubere Sprach-/Regionsvarianten, kein Duplicate-Content-Problem.

## E2 — REGIONALE INHALTE & VERFÜGBARKEIT

- Welche Händler liefern nach AT/CH, Versandbesonderheiten, regionale Marken.
- Preisunterschiede DE/AT/CH ausweisen.

## E3 — LOKALE ENTITÄTS-SIGNALE

`Organization.areaServed` = DACH (DE/AT/CH).

## E4 — WÄHRUNG & PREIS-LOKALISIERUNG

`Offer.priceCurrency` regionsabhängig (EUR/CHF). Preise pro Region korrekt im `Product`/`Offer`-Schema.

**Akzeptanzkriterien Block E:** `hreflang` für de-DE/de-AT/de-CH + x-default vorhanden; CH-Seiten zeigen CHF.

---

# BLOCK F — VISUELLE & MULTIMODALE DOMINANZ (Fotos, Bilder, Video)

> Multimodale KI „sieht" Bilder. Echte Fotos sind ein Experience-Signal, das Konkurrenten **nicht faken können** — und gleichzeitig einzigartige Bildsuche-Treffer. Hier holst du Vorsprung, den niemand in der Nische hat.

## F1 — ORIGINAL-FOTOGRAFIE-PIPELINE ⭐

Echte Fotos echter Hunde mit echtem Futter = echtes „Experience" (das erste E in E-E-A-T) und Authentizität, die multimodale Modelle erkennen. Konkurrenten nutzen Stock — du nutzt Realität.
- Sammeln/Shooten (eigene Hunde, Community-Einsendungen mit Rechten, Test-Situationen).
- Sauber benennen, organisieren, komprimieren, in den Bildpfad einpflegen.

## F2 — BILD-SEO IM MASSSTAB

- Beschreibende Dateinamen statt `IMG_1234.jpg`.
- Spezifische, keyword-bezogene Alt-Texte (programmatisch, aber konkret pro Bild).
- `ImageObject`-Schema (mit `caption`, `creator`, `license`).
- **Eigene Bild-Sitemap**.

## F3 — AVIF/WebP + `next/image`

`agents.md` Operation 09 fortführen: `images.formats = ['image/avif','image/webp']`, responsive `sizes`, Blur-Placeholder, reservierte Dimensionen (kein CLS), `priority` nur fürs Hero-Bild.

## F4 — DYNAMISCHE OG-BILDER PRO SEITE

Jede Programmatic-Seite bekommt eine eigene, gebrandete Vorschaukarte via `next/og`:

```ts
// src/app/rasse/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // gebrandete Karte rendern: Rasse + „Welches Futter?" + BELLA-Logo
  return new ImageResponse(/* JSX */ undefined as any, size)
}
```

(JSX-Inhalt: Rasse/Thema groß, BELLA-Branding, Kernzahl aus dem Report.)

## F5 — MULTIMODALE / VISUELLE SUCHE

- Strukturierte, hochwertige Produktbilder → Google Lens / Pinterest / multimodale LLMs.
- Pinterest als DACH-Discovery- und Backlink-Kanal (Report-Grafiken, Vergleichsbilder).
- Bild + Daten paaren, damit multimodale Modelle visuell „andocken" können.

## F6 — SHORT-FORM VIDEO

Fütterungs-/Vergleichsclips: hosten + **Transkript** + `VideoObject`-Schema; auf YouTube + eingebettet. Transkripte sind zitierfähiger Text.

**Akzeptanzkriterien Block F:** Jede Programmatic-Seite hat eigenes OG-Bild + mindestens ein Bild mit `ImageObject`-Schema und spezifischem Alt; Bild-Sitemap eingereicht.

---

# BLOCK G — SPEED AM LIMIT (Core Web Vitals 2026)

> Schnell ist nicht „nice to have" — langsame Seiten werden seltener gecrawlt, schlechter gerankt und in der Bedienung abgestraft. Ziel: alle CWV im **Feld** grün, nicht nur im Labor.

## G1 — Partial Prerendering (PPR)

Statische Shell sofort, dynamische Teile (Preise) gestreamt. **Exaktes Flag in der Next.js-16.2-Doku verifizieren** (historisch `experimental.ppr`), dann in `next.config.ts` setzen.

## G2 — INP < 200 ms (die CWV-Metrik, die jetzt zählt)

- Maximal Server Components, minimal Client Components.
- Schwere/Drittanbieter-JS deferren; Hydration klein halten.
- Keine blockierenden Handler auf der Hauptseite.

## G3 — LCP < 2,5 s (Ziel < 1,5 s)

`priority`-Hero-Bild, `preconnect` zu Bild-/Affiliate-Domains, Edge-Auslieferung.

## G4 — CLS ~ 0

Reservierte Bilddimensionen, `next/font` mit `font-display`, keine Layout-Sprünge.

## G5 — EDGE + CACHING

Auf Netlify Edge rendern; ISR/Segment-Caching nutzen; CDN voll ausreizen.

## G6 — JS-BUDGET + FONTS + DRITTANBIETER

`next/font` (subsetten), Analytics/Affiliate-Skripte async/deferred, totes JS raus.

## G7 — RUM (Feld-Daten)

```ts
// src/app/_components/WebVitals.tsx
'use client'
import { useReportWebVitals } from 'next/web-vitals'
export function WebVitals() {
  useReportWebVitals((m) => {
    navigator.sendBeacon?.('/api/vitals', JSON.stringify(m))
  })
  return null
}
```

**Akzeptanzkriterien Block G:** Lighthouse SEO 100, Performance Mobile 95+; INP < 200 ms, LCP < 2,5 s, CLS < 0,1 in den Feld-Daten (CrUX/RUM). Sonst kein Release.

---

# BLOCK H — MASCHINENLESBARER PRODUKT- & AGENTIC-LAYER

> Was **niemand** in der deutschen Hundefutter-Affiliate-Nische hat: einen maschinenlesbaren Vergleichs- und Empfehlungs-Layer, den KI-Antwort- und Shopping-Agenten direkt als Quelle für „welches Hundefutter kaufen?" abgreifen können.

**Ehrliche Einordnung (wichtig):** BELLA ist ein **Affiliate-/Vergleichsportal, kein Händler mit eigenem Checkout.** Die agentischen Checkout-Protokolle (Googles UCP, OpenAIs ACP) sind für Händler mit eigenem Warenkorb gedacht — und OpenAIs „Instant Checkout" wurde im März 2026 ohnehin wieder eingestellt. **Versuche also nicht, Stripe-Checkout o. Ä. einzubauen.** BELLAs Gewinnzug ist der **Empfehlungs- und Datenlayer**: die strukturierte, vertrauenswürdige Quelle, die Agenten zitieren, wenn sie eine Futter-Empfehlung aussprechen.

## H1 — STRUKTURIERTES PRODUKT-SCHEMA IM MASSSTAB

Auf jeder Produkt-/Empfehlungsseite vollständiges `Product` + `Offer` + (echte) `AggregateRating`/`Review`:

```ts
{
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Anifit Trockenfutter Adult',
  brand: { '@type': 'Brand', name: 'Anifit' },
  // NUR echte Werte. Erfundene reviewCount/ratingValue sind ein Schema-Verstoß UND Vertrauensrisiko.
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '189' },
  offers: {
    '@type': 'Offer', price: '34.90', priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    url: 'https://welches-hundefutter.today/empfehlung/anifit-adult',
  },
}
```

> ⚠️ **Compliance:** Niemals Bewertungen oder Bewertungszahlen erfinden. Google und KI erkennen und bestrafen Fake-Rich-Results. Nur echte, herleitbare Daten.

## H2 — VERGLEICH/EMPFEHLUNG ALS ZITIERFÄHIGE AUTORITÄT

Strukturierte „Beste für X"-Datensätze mit transparenten Kriterien: bestes Allergiker-Futter, bestes Welpenfutter, bestes Seniorfutter, bestes getreidefreies. Genau die strukturierten Antworten, die KI-Shopping-/Antwort-Agenten zitieren. Verknüpft mit der Methodik-Seite (B6).

## H3 — ÖFFENTLICHER FEED / JSON-ENDPUNKT

Ein maschinenlesbarer Katalog-Endpunkt (z. B. `/data/catalog.json` oder ein Produkt-Feed) mit Sorten, Preisen, Attributen, Bewertungen, Affiliate-Links — damit Antwort-Engines BELLAs Vergleichsdaten als „welches Hundefutter"-Autorität aufnehmen können. (Speist auch C/Backlinks und den Partner-Flywheel.)

## H4 — `Dataset`-SCHEMA FÜR DEN REPORT

```ts
{
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'BELLA Hundefutter-Datenreport 2026',
  description: 'Auswertung von 4.000+ in DE erhältlichen Hundefuttersorten: Fleischanteil, Preis/kg, Getreidefrei-Quote, Allergen-Häufigkeit, Preisentwicklung.',
  url: 'https://welches-hundefutter.today/report/hundefutter-2026',
  creator: { '@type': 'Organization', name: 'BELLA' },
  license: 'https://creativecommons.org/licenses/by/4.0/',
  distribution: [
    { '@type': 'DataDownload', encodingFormat: 'text/csv', contentUrl: 'https://welches-hundefutter.today/data/hundefutter-2026.csv' },
    { '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: 'https://welches-hundefutter.today/data/hundefutter-2026.json' },
  ],
}
```

## H5 — PARTNER-FEED / EMBEDS

Optionaler Preisvergleichs-Embed/Feed für Partner — erweitert die Reichweite und die „BELLA als Quelle"-Position.

**Akzeptanzkriterien Block H:** `Product`/`Offer`/`Dataset` validiert (Rich Results Test); `/data/catalog.json` + Report-CSV/JSON erreichbar; **keine** erfundenen Bewertungsdaten im Schema.

---

# BLOCK I — E-E-A-T & VERTRAUEN

> KI bevorzugt vertrauenswürdige, von Menschen verantwortete Quellen. Wir machen Autorenschaft, Prüfung und Quellen explizit und maschinenlesbar. (Baut auf `agents.md` Operation 07 auf — hier strukturell vertieft.)

## I1 — AUTOREN- & PRÜFER-ENTITÄTEN

Jeder Artikel: benannte:r Autor:in (`Person`-Schema, Bio, Foto, `sameAs`) **und** `reviewedBy` (Tierarzt mit Qualifikation). Sichtbarer Stempel „Tiermedizinisch geprüft von Dr. med. vet. [Name]".

## I2 — QUELLEN & ZITATE

Primärquellen verlinken (FEDIAF-Richtlinien, Bundesverband für Tiergesundheit, peer-reviewte Studien/PubMed). Quellenliste pro Artikel.

## I3 — TRANSPARENZ & UNABHÄNGIGKEIT

Affiliate-Offenlegung, Methodik (I → B6), Datenherkunft. Ehrlich = vertrauenswürdig = zitierfähig.

## I4 — ECHTE EXPERIENCE-SIGNALE

Eigene Fotos (Block F), echte Test-Notizen, „wir haben X Sorten ausgewertet" mit den Daten dahinter (B2). Experience ist das am schwersten zu fälschende Signal — und genau deshalb dein stärkstes.

**Akzeptanzkriterien Block I:** `author` + `reviewedBy` als Schema auf Artikeln; Quellenliste vorhanden; Affiliate-Disclosure sichtbar.

---

# BLOCK J — MESSEN & VERTEIDIGEN (KI-Sichtbarkeit)

> Zitierung ist ein fortlaufender Loop, kein einmaliges Abhaken. Was wir nicht messen, verlieren wir still.

## J1 — KI-SICHTBARKEIT TRACKEN

Festes Prompt-Set (z. B. „welches hundefutter für labrador", „bestes futter bei allergie", „welches welpenfutter") **monatlich** gegen ChatGPT, Perplexity, Gemini, Claude und Google AI Overviews prüfen: Wird BELLA genannt/zitiert? Entweder per Skript (Prompts absetzen, Antwort auf „welches-hundefutter.today"/„BELLA" parsen) oder mit spezialisierten Tools (Profound, Goose, LLMrefs, Writer).

## J2 — BING WEBMASTER + GSC

Index-Abdeckung, Queries, AI-Overview-Impressionen.

## J3 — KI-BOT-LOG-DASHBOARD

Aus A4: wer crawlt, wie oft, welche Seiten.

## J4 — WEB-VITALS-RUM-DASHBOARD

Aus G7: Feld-CWV im Blick.

## J5 — CITATION-DECAY-WACHE

Zitate verfallen. Verlorene Zitate erkennen → betroffenen Content auffrischen (Frische, Zahlen, Struktur). Der Loop schließt sich hier.

**KPI-Tafel:**

| Metrik | Ziel |
| --- | --- |
| Zitier-/Nennungsrate je KI-Plattform (Prompt-Set) | Monat für Monat steigend |
| KI-referrierte Sessions (GA4) | wachsend |
| Bing-Index-Abdeckung | nahezu 100 % der Seiten |
| CWV-Feld (INP/LCP/CLS) | alle grün |
| Originaldaten-Report-Backlinks | wachsend |
| KI-Bot-Treffer (GPTBot/ClaudeBot/PerplexityBot/OAI-SearchBot) | regelmäßig & steigend |

---

# ⚔️ EXEKUTIONS-REIHENFOLGE (für Claude in Windsurf)

Abhängigkeitssortiert. Ein Block = ein PR. Den Datenreport (B2) **früh** starten — er ist der Moat und braucht Vorlauf. Monitoring (J) **früh** aufsetzen, läuft dann dauerhaft.

```
1.  BLOCK A  — KI-Fundament (robots/Bing/IndexNow/llms/Logging/SSR)   ← zuerst, sonst wirkt nichts
2.  B2       — Originaldaten-Report STARTEN (Aggregation + Route + Download)  ← parallel, hat Vorlauf
3.  J (Setup)— Monitoring-Grundgerüst (Prompt-Set, Logs, RUM)
4.  BLOCK B  — Citation Engineering (B1, B3–B7) auf allen Templates
5.  BLOCK I  — E-E-A-T (Autor/Prüfer/Quellen/Transparenz)
6.  BLOCK H  — Maschinenlesbarer Produkt-/Daten-Layer (Schema + Feeds + Dataset)
7.  BLOCK D  — Voice & Conversational (FAQ/Speakable/HowTo überall)
8.  BLOCK F  — Visuelle & multimodale Dominanz (Fotos/OG/Bild-SEO/Video)
9.  BLOCK G  — Speed am Limit (PPR/INP/LCP/CLS/Edge/RUM)
10. BLOCK E  — DACH (hreflang/Regionen/Währung)
11. BLOCK C  — Entität & Off-Site (Wikidata/Reddit/Digital-PR) — fortlaufend
12. J (Loop) — Monitoring + Citation-Decay-Wache dauerhaft betreiben
```

---

# 🩸 NICHT-VERHANDELBAR (zusätzlich zu `agents.md`)

- Jede Seite öffnet mit einer Direkt-Antwort in den ersten 40–60 Wörtern (`.bella-answer`).
- Kein Claim ohne Zahl oder Quelle, wo es möglich ist.
- Kein Programmatic-Template ohne `FAQPage` + `SpeakableSpecification` (+ `Product` wo zutreffend).
- Alle seriösen KI-Crawler sind erlaubt; Bytespider wird am Edge geblockt.
- Bing-Index ist Pflicht — ChatGPT-Suche läuft über Bing.
- Der BELLA-Datenreport ist das Herz und wird quartalsweise aktualisiert.
- Nur **echte** Bewertungen/Reviews im Schema. Niemals erfundene Zahlen.
- Kein Bild ohne `ImageObject` + spezifischen, konkreten Alt-Text.
- INP < 200 ms und LCP < 2,5 s im **Feld** — sonst kein Release.
- Die `/methodik`-Seite ist öffentlich und ehrlich (inkl. Affiliate-Offenlegung).
- `llms.txt`/`llms-full.txt` aktuell halten — aber nie als Ersatz für echten, strukturierten Content behandeln.
- Kein Cloaking, keine Fake-Reviews, keine gekaufte Backlink-Masse. Es fliegt auf und kostet Rankings *und* Zitate.
- HANSI Decision Intelligence Engine™ bleibt als Technologie-Marke erhalten.

---

# 🧭 REALISTISCHE EINORDNUNG

„Von **jeder** KI zitiert werden" ist das Ziel — garantieren kann es niemand, denn die Engines entscheiden selbst und ändern ihre Logik laufend (nur ~11 % der Domains werden gleichzeitig von ChatGPT *und* Perplexity zitiert — Plattform-Logiken unterscheiden sich). Was wir vollständig kontrollieren: Crawlbarkeit, Struktur, Originaldaten, Entität, Bing-Index und Geschwindigkeit. Das ist der Hebel — und er ist groß.

Der größte, am wenigsten kopierbare Vorteil von BELLA ist **B2 (Originaldaten) + F1 (echte Fotos) + B6 (Transparenz)**. Tausende ausgewertete Sorten und tägliche Preis-Historie sind ein Datenschatz, den kein Nischen-Konkurrent hat. Daraus echte Zahlen, echte Bilder und eine offene Methodik zu machen — das ist es, was KI zitiert. Tricks vergehen; Originaldaten bleiben.

---

*BELLA Omnipräsenz-Protokoll v1 · welches-hundefutter.today · ergänzt agents.md · für Claude in Windsurf*
*Platz 1 ist eine Liste abgehakter Operationen. Zitiert zu werden ist die nächste.*
