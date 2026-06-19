# BELLA — Deutschlands intelligentester KI-Berater für Hundefutter

> **11.000+ Sorten · 186 Rassen · Live-Preise täglich · 60 Sekunden bis zur perfekten Empfehlung**

[![Live](https://img.shields.io/badge/Live-welches--hundefutter.today-orange?style=flat-square)](https://welches-hundefutter.today)
[![Lighthouse Performance](https://img.shields.io/badge/Lighthouse-4×100-brightgreen?style=flat-square)](#performance)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Deployed on Netlify](https://img.shields.io/badge/Deployed-Netlify-00C7B7?style=flat-square&logo=netlify)](https://netlify.com)

---

## Was BELLA ist

BELLA ist keine Vergleichsseite. BELLA ist der **persönliche Ernährungsmanager für das ganze Hundeleben**.

Während Testportale statische Tabellen pflegen, kennt BELLA **deinen** Hund: Rasse, Alter, Gewicht, Allergien, Budget — und findet in 60 Sekunden aus einem live gepflegten Katalog von über 11.000 Produkten die drei besten Futter-Optionen mit tagesaktuellen Preisen.

Das ist der strukturelle Burggraben, den Check24 oder statische Testseiten nicht betreten können.

---

## Features

### KI-Beraterin BELLA
- Konversationeller 5-Fragen-Flow (Rasse → Alter → Gewicht → Probleme → Budget)
- Echtzeit-Auswahl aus dem Live-Katalog (Neon Postgres, täglich aktualisiert)
- Allergie-Logik: Monoprotein, getreidefrei, hypoallergen
- Cross-Selling: passende Snacks, Nahrungsergänzung, Versicherung
- BARF-Modus, Welpenfutter, Seniorfutter
- Rasse-Autostart: Rasse-Seite öffnen → BELLA kennt den Hund bereits

### Katalog & Preise
- 11.000+ Produkte aus AWIN-Feeds (täglicher Cron, 05:00 UTC)
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
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind v4 |
| KI | Gemini 2.0 Flash (Berater), Claude Haiku 4.5 (Fallback) |
| Datenbank | Neon Postgres + Drizzle ORM |
| Feeds | AWIN Publisher API (a=615299), AdCell |
| Deployment | Netlify (Edge Functions + ISR) |
| E-Mail | Resend (DOI Preis-Wecker) |
| Analytics | Web Vitals, Google Analytics |
| Bilder | Pexels API (Tipps), dog.ceo API (Rassen-Galerie) |

---

## Performance

Lighthouse-Score (Mobil + Desktop):

| Leistung | Barrierefreiheit | Best Practices | SEO | Agentisches Browsing |
|:---:|:---:|:---:|:---:|:---:|
| 100 | 100 | 100 | 100 | 3/3 |

Erreicht durch: Text-basierter LCP (~1,2s), `optimizeCss: true`, moderne Browserslist (Chrome 96+), kein ungenutzter Third-Party-Preconnect, Tailwind-Purge.

---

## Lokale Entwicklung

```bash
# Abhängigkeiten installieren
cd handyvertrag-app
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
└── handyvertrag-app/
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
