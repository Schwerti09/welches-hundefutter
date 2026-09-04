# BELLA — Deutschlands intelligentester KI-Berater für Hundefutter

> **11.000+ Sorten · 186 Rassen · Live-Preise täglich · 60 Sekunden bis zur perfekten Empfehlung**

[![Live](https://img.shields.io/badge/Live-welches--hundefutter.today-orange?style=flat-square)](https://welches-hundefutter.today)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react)](https://react.dev)
[![Tests](https://img.shields.io/badge/tests-118%20passing-brightgreen?style=flat-square&logo=vitest)](#qualität--sicherheit)
[![Gate](https://img.shields.io/badge/gate-npm%20run%20ci%20(Netlify)-00C7B7?style=flat-square&logo=netlify)](#qualität--sicherheit)

> **Stand 2026-09-04.** Aktive Umbau-Roadmap: [`../BELLA_NEXT_LEVEL.md`](../BELLA_NEXT_LEVEL.md).
> Phasen 0–2 erledigt, Phasen 3–5 laufen (jeweils „Teil 1" gebaut).
> **Advisor-Allergen-Härtung (Phase 2A) komplett** — `avoidProtein` als hartes Konzept,
> SQL-Ausschluss, Re-Query, zwei Safety-Assertions, ehrliche Leermeldung, **blockierende
> Eval im Netlify-Build** (`allergen-eval.test.ts` gegen Neon). Audit:
> [`../docs/audits/2026-09-03-bella-chat-audit.md`](../docs/audits/2026-09-03-bella-chat-audit.md).
> **Kein GitHub Actions** — Deploy und Gate laufen über Netlify (`npm run ci`).

---

## Was BELLA ist

BELLA ist keine Vergleichsseite. BELLA ist der **persönliche Ernährungsmanager für das ganze Hundeleben**.

Während Testportale statische Tabellen pflegen, kennt BELLA **deinen** Hund: Rasse, Alter, Gewicht, Allergien, Budget — und findet in 60 Sekunden aus einem live gepflegten Katalog von über 11.000 Produkten die drei besten Futter-Optionen mit tagesaktuellen Preisen.

Das ist der strukturelle Burggraben, den Check24 oder statische Testseiten nicht betreten können.

---

## Features

### KI-Beraterin BELLA (`/api/advisor/chat`)
- Adaptiver Gesprächs-Flow (fragt nur, was die Empfehlung ändert), streamt strukturierte
  Events (Analyse-Schritte, Scores, Text, Offers, Cross-Sell, Futter-Pass)
- **Intent-Erkennung:** Regex-Fast-Path (0 ms) + LLM-Ergänzung (Gemini JSON-Modus) bei
  natürlicher Sprache; sicher gemergt. Rasse-Erkennung aus `@/data/breeds.ts`
- Echtzeit-Auswahl aus dem Live-Katalog (Neon Postgres), deterministisches Scoring im Code
  (LLM formuliert, Code entscheidet)
- **Allergen-Sicherheit**: `avoidProtein` (getrennt vom Wunsch-Protein) wird auf SQL-Ebene
  ausgeschlossen; zwei Runtime-Assertions garantieren, dass kein solches Produkt in die
  `OFFERS`-Payload kommt; nichts Sicheres → ehrliche Leermeldung statt Notlösung.
  Abgesichert durch `src/lib/advisor/allergen-eval.test.ts` — läuft im Netlify-Build gegen Neon
  (`DATABASE_URL` ist Netlify-Env), rot = kein Deploy.
- Cross-Selling: kuratierte Begleitprodukte (max. 3, mit Begründung, Allergen-Ausschluss)
- BARF-Modus, Welpen-/Seniorfutter · Rasse-Autostart (Rasse-Seite → BELLA kennt den Hund)
- Rate-Limit + Origin-Check auf der Route

### Katalog & Preise
- 11.000+ Produkte aus AWIN + AdCell (täglicher Cron via Netlify Scheduled Functions)
- Preishistorie mit Snapshot-on-change (`is_active` Lifecycle)
- Preis-Wecker: Double-Opt-In E-Mail-Audience, Preisalert bei Änderung
- Durchschnittliche Kosten/kg nach Futtertyp, live berechnet

### Programmatic SEO
- 186 Rasse-Seiten (`/rasse/[slug]`) mit Galerie und BELLA-Autostart
- 14 Problem-Seiten (`/problem/[slug]`): Allergie, sensibler Magen, Übergewicht …
- Futtertyp-Seiten (`/futtertyp/[slug]`): Trocken, Nass, BARF, Monoprotein …
- Lebensphase-Seiten (`/lebensphase/[slug]`): Welpe, Adult, Senior
- Vergleichsseiten (`/vergleich/[a]-vs-[b]`)

### Tipps & Content
- 1.400+ Tipps-Artikel in 14 Kategorien (Ernährung, Gesundheit, BARF, Allergien, Fell, Zähne …)
- Volltext-Artikel mit Pexels-Fotos, ~1.000 Wörter, GEO-Protokoll, Schema.org
- Separate Detailseiten (`/tipps/[category]/[slug]`) mit OG-Image

### Lebenszeit-Kostenrechner
- Serverseitig berechnete Lebenszeit-Futterkosten für alle 186 Rassen
- Live aus echten Durchschnittspreisen — kein statisches Testportal kann das

---

## Tech Stack

| Layer | Technologie |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (ES2022) |
| Styling | Tailwind v4 · `next/font` (Inter, self-hosted) |
| KI | Gemini 2.5 Flash (Berater + Intent-JSON), Claude Haiku 4.5 (Fallback) |
| Datenbank | Neon Postgres + Drizzle ORM (`drizzle/`-Migrationen) |
| Feeds & Crons | AWIN (a=615299) + AdCell → Pipeline → Neon. **Netlify Scheduled Functions** (`netlify/functions/*.mts`): `import-feeds` (05:00), `price-alerts` (06:00), `ai-visibility` (Mo 07:00), `health-check` (stündlich) |
| Deployment + Gate | **Netlify** (`base = bella-app`, Node 22, `@netlify/plugin-nextjs`, Edge + ISR). Build-Command = `npm run ci` → schlägt typecheck/lint/test/build fehl, gibt es keinen Deploy. **Kein GitHub Actions.** |
| E-Mail | Resend (DOI Preis-Wecker, Outcome-Checks) |
| Tests | Vitest (118 Unit) + Playwright (Smoke `e2e/smoke.spec.ts`, Visual `e2e/visual.spec.ts` — beide manuell gegen eine URL, nicht im Gate) |
| Analytics | First-Party-Beacon `/api/track` + `events`-Tabelle (anonym, kein Cookie) — parallel zu GA4 im Übergang |
| Sicherheit | CSP „Weg B" + COOP, Rate-Limit + Origin-Check auf den LLM-Routen |
| Bilder | `next/image` · Rasse-Fotos self-hosted (`public/breeds/`) · generierte OG-Bilder (`opengraph-image.tsx`) |

---

## Performance

Lighthouse mobil (PageSpeed, 2026-09):

| Leistung | Barrierefreiheit | Best Practices | SEO |
|:---:|:---:|:---:|:---:|
| ~91 → Ziel 98 | 100 | 96 → Ziel 100 | 100 |

Hebel schon umgesetzt: self-hosted + `next/image`-optimierte Rasse-Fotos, GA `lazyOnload`,
below-fold-Komponenten via `next/dynamic` + Idle-Mount, `optimizeCss`, moderne Browserslist,
tote CSS-Animationen entfernt (Motion-Politur Teil 1). Rest in der Roadmap (Perf-Budget im
Netlify-Build 6.2, `framer-motion`-Audit 3.5 Teil 2, GA4-Ablösung 5.2 Teil 2).

---

## Qualität & Sicherheit

- **Gate = Netlify-Build.** Build-Command `npm run ci` = `typecheck` + `lint` + `test` +
  `build`. Läuft für `main` **und** für Deploy Previews (PRs). **Kein GitHub Actions.**
- **118 Unit-Tests** (Vitest) — Schwerpunkt Allergen-Sicherheit, Intent-Parsing, Scoring,
  Verbrauchsmathematik, Rate-Limit, `<JsonLd>`-Serialisierung. Die DB-gestützte Allergen-Eval
  (`allergen-eval.test.ts`) läuft im Netlify-Build gegen Neon mit; lokal ohne `DATABASE_URL`
  via `describe.skipIf` übersprungen.
- **Playwright-Smoke** (`e2e/smoke.spec.ts`, 5 Tests) + **Visual** (`e2e/visual.spec.ts`) —
  manuell gegen eine Deploy-Preview-URL (`E2E_BASE_URL=… npm run test:e2e`), Browser im
  Build-Image sind zu fragil für den Gate.
- **CSP „Weg B" + COOP** (`next.config.ts`), **Rate-Limit + Herkunftsprüfung** auf `/api/advisor/*`,
  `/api/support/chat`, `/api/track`.
- **Drizzle-Migrationen** (`bella-app/drizzle/`) — kein DDL im Request-Pfad.
- **SEO-Audit-Tools:** `npm run audit:content` (Thin-Content), `npm run audit:links`
  (Orphan-/Cluster-Check). Reports in `../docs/audits/`.
- Bekannte Baustellen + Reihenfolge: [`../BELLA_NEXT_LEVEL.md`](../BELLA_NEXT_LEVEL.md).

---

## Lokale Entwicklung

```bash
# Abhängigkeiten installieren
cd bella-app
npm install

# Umgebungsvariablen anlegen
cp .env.example .env.local
# Folgende Keys eintragen:
# DATABASE_URL        — Neon Postgres Connection String
# GEMINI_API_KEY      — Google AI Studio
# ANTHROPIC_API_KEY   — Anthropic (Fallback)
# AWIN_PUBLISHER_ID   — AWIN
# AWIN_API_TOKEN      — AWIN
# RESEND_API_KEY      — Resend (E-Mail)
# PEXELS_API_KEY      — Pexels (Bilder-Script)
# SITE_URL            — https://welches-hundefutter.today

# Dev-Server starten
npm run dev

# Der Gate — muss grün sein vor jedem Push (identisch zum Netlify-Build-Command)
npm run ci            # typecheck + lint + test + build

# Datenbank-Migrationen
npm run db:generate   # schema.ts → neue SQL-Migration in drizzle/
npm run db:migrate    # gegen $DATABASE_URL anwenden

# E2E / Visuell (nicht im Gate — gegen eine URL)
E2E_BASE_URL=https://deploy-preview-…--welches-hundefutter.netlify.app npm run test:e2e
npm run test:visual   # Screenshots; CI-Baselines liegen unter e2e/*-snapshots/

# SEO-Audits (gegen einen laufenden `next start`)
npm run audit:content
npm run audit:links
```

---

## Feed-Pipeline

```bash
# AWIN-Feeds herunterladen und verarbeiten
python scripts/parse-feeds.py

# Produkte in Neon upserten
DATABASE_URL="..." node scripts/load-dog-foods.mjs

# Pexels-Bilder für Tipps-Kategorien laden
PEXELS_API_KEY="..." node scripts/fetch-tip-images.mjs
```

Der Feed-Cron läuft täglich um 05:00 UTC als **Netlify Scheduled Function**
(`netlify/functions/import-feeds.mts`). Neue Produkte werden sofort aktiv, inaktive erhalten
`is_active = false` (kein Hard-Delete für Preishistorie). Die GitHub-Workflows dafür sind
entfernt — die `scripts/*` bleiben für manuelle/lokale Läufe.

---

## Architektur

```
welches-hundefutter/
└── bella-app/
    ├── src/
    │   ├── app/                  # Next.js App Router (Seiten, API-Routes)
    │   │   ├── api/advisor/      # BELLA Chat-API (Gemini + DB-Abfrage)
    │   │   ├── rasse/[slug]/     # 186 Rasse-Seiten
    │   │   ├── problem/[slug]/   # Problem-Seiten (Allergie, etc.)
    │   │   ├── tipps/            # 1.400+ Tipps-Artikel
    │   │   └── tools/            # Futter-Finder, Lebenszeit-Rechner
    │   │   ├── dev/components/   # Komponenten-Katalog (non-prod) für Design-QA
    │   │   ├── api/track/        # First-Party-Analytics-Beacon
    │   │   └── llms.txt, llms-full.txt   # KI-Suchmaschinen-Wissensbasis
    │   ├── components/           # BellaAdvisor, BellaMascot, JsonLd, RelatedLinks, PageTracker …
    │   ├── db/                   # Drizzle Schema (inkl. events) + Queries
    │   ├── data/                 # breeds.ts, problems.ts, tips/*.ts (statische Seed-Daten)
    │   └── lib/                  # advisor/*, linking/graph, analytics, site-dates, og-image …
    ├── drizzle/                  # versionierte SQL-Migrationen (0000_baseline, 0001_events_analytics)
    ├── e2e/                      # Playwright Smoke + Visual
    ├── netlify/functions/        # Scheduled Functions: import-feeds, price-alerts, ai-visibility, health-check
    └── scripts/                  # Feed-Pipeline, audit:content, audit:links, gen-build-date …
```

---

## Affiliate & Rechtliches

Alle externen Produktlinks tragen `rel="sponsored"` und sind sichtbar als Werbung gekennzeichnet. Keine Kaufempfehlung ohne Relevanzprüfung. Keine On-Load-Pixel. DSGVO-konform mit Double-Opt-In für E-Mail.

---

## Roadmap

- [ ] Futter-Pass: personalisiertes Hunde-Profil mit Nachschub-Wecker und Lebensphasen-Trigger
- [ ] Score-Transparenz: Fleischanteil-Methodik öffentlich einsehbar (EEAT)
- [ ] Vergleich-Matrix: beliebige Produkte gegenüberstellen
- [ ] AWIN-Cross-Sell-Kategorien: Snacks, Nahrungsergänzung, Versicherung, Zubehör
- [ ] Mobile App (PWA) mit Push-Alerts für Preis-Wecker

---

*BELLA — entwickelt in Deutschland. Für Hunde, die es verdienen.*
