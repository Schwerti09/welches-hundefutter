# BELLA — Deutschlands intelligentester KI-Berater für Hundefutter

> **11.000+ Sorten · 186 Rassen · Live-Preise täglich · 60 Sekunden bis zur perfekten Empfehlung**

[![Live](https://img.shields.io/badge/Live-welches--hundefutter.today-orange?style=flat-square)](https://welches-hundefutter.today)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react)](https://react.dev)
[![Tests](https://img.shields.io/badge/tests-90%20passing-brightgreen?style=flat-square&logo=vitest)](#qualität--sicherheit)
[![Deployed on Netlify](https://img.shields.io/badge/Deployed-Netlify-00C7B7?style=flat-square&logo=netlify)](https://netlify.com)

> **Stand 2026-09-03.** Aktive Umbau-Roadmap: [`../BELLA_NEXT_LEVEL.md`](../BELLA_NEXT_LEVEL.md).
> Der Advisor wird gerade gehärtet (Allergen-Sicherheit) — siehe [`../docs/audits/2026-09-03-bella-chat-audit.md`](../docs/audits/2026-09-03-bella-chat-audit.md) und Roadmap-Phase 2A.

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
- **Allergen-Sicherheit** (in Härtung, Roadmap 2A): gemiedene Proteine werden hart
  ausgeschlossen — Ziel: kein solches Produkt je in den Offers, per CI-Test abgesichert
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
| Feeds | AWIN Publisher API (a=615299) + AdCell → Python-Pipeline → Neon (Netlify Scheduled Functions) |
| Deployment | Netlify (`base = bella-app`, Node 22, `@netlify/plugin-nextjs`, Edge + ISR) |
| E-Mail | Resend (DOI Preis-Wecker, Outcome-Checks) |
| Tests | Vitest (Unit) — CI-Gate: typecheck + lint + test + build je PR |
| Sicherheit | CSP + COOP, Rate-Limit + Origin-Check auf den LLM-Routen |
| Bilder | `next/image` · Rasse-Fotos self-hosted (`public/breeds/`) · Pexels (Tipps) |

---

## Performance

Lighthouse mobil (PageSpeed, 2026-09):

| Leistung | Barrierefreiheit | Best Practices | SEO |
|:---:|:---:|:---:|:---:|
| ~91 → Ziel 98 | 100 | 96 → Ziel 100 | 100 |

Hebel schon umgesetzt: self-hosted + `next/image`-optimierte Rasse-Fotos, GA `lazyOnload`,
below-fold-Komponenten via `next/dynamic` + Idle-Mount, `optimizeCss`, moderne Browserslist.
Rest steht in der Roadmap (Perf-Budget im CI, Motion-Politur, first-party Analytics).

---

## Qualität & Sicherheit

- **CI-Gate** (`.github/workflows/ci.yml`): `typecheck` + `lint` + `test` + `build` bei jedem PR.
- **90 Unit-Tests** (Vitest) — Schwerpunkt Allergen-Sicherheit, Intent-Parsing, Scoring,
  Verbrauchsmathematik, Rate-Limit.
- **CSP + COOP** (`next.config.ts`), **Rate-Limit + Herkunftsprüfung** auf `/api/advisor/*`
  und `/api/support/chat`.
- **Drizzle-Migrationen** (`bella-app/drizzle/`) — kein DDL im Request-Pfad.
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

# Build prüfen (muss grün sein vor jedem Push)
npm run build
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

Der Feed-Cron läuft täglich um 05:00 UTC auf Netlify. Neue Produkte werden sofort aktiv, inaktive Produkte erhalten `is_active = false` (kein Hard-Delete für Preishistorie).

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
    │   ├── components/           # BellaAdvisor, BreedGallery, TopFoodsTable …
    │   ├── db/                   # Drizzle Schema + Queries
    │   ├── data/                 # breeds.ts, tips/*.ts (statische Seed-Daten)
    │   └── lib/                  # dogCost, breeds-slim, utils
    └── scripts/                  # Feed-Pipeline, Bilder-Download
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
