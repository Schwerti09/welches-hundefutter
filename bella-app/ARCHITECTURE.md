# Architektur — welches-hundefutter.today (BELLA)

> Status: SSOT (technischer Aufbau). Stand 2026-09-03.
> Roadmap: `../BELLA_NEXT_LEVEL.md` · Alltag: `../CLAUDE.md`

BELLA ist eine deutschsprachige KI-Ernährungsberatung + Preisvergleich für Hundefutter.
Eine Next.js-16-App (App Router, Turbopack) auf Netlify, mit Neon Postgres als Datenbank,
einem streamenden KI-Berater und programmatischer SEO über ~2.400 vorgerenderte Seiten.

---

## Überblick

```
                     ┌───────────────────────────────────────────────┐
   Nutzer ──────────▶│  Netlify Edge / CDN                            │
                     │  • statische SSG/ISR-Seiten (max-age immutable)│
                     │  • Next Image Optimization                     │
                     │  • Edge Function: block-bad-bots               │
                     └───────────────┬───────────────────────────────┘
                                     │
                     ┌───────────────▼───────────────────────────────┐
                     │  Next.js 16 App Router (@netlify/plugin-nextjs)│
                     │                                               │
                     │  Server Components (Default, SSG/ISR)          │
                     │   • /                     revalidate 3600      │
                     │   • /rasse/[slug]         generateStaticParams │
                     │   • /rassen /problem/* /futtertyp/* /vergleich/*│
                     │   • /tipps/* /studien/* /glossar/* /blog/*     │
                     │   • /hund/[share_token]   Futter-Pass-Steckbrief│
                     │   • sitemap.ts / robots.ts / llms.txt         │
                     │                                               │
                     │  Client Components ("use client")             │
                     │   • BellaAdvisor (Stream-Client)              │
                     │   • CostHook, BreedGallery, DogPassPopup, …   │
                     │                                               │
                     │  Route Handlers (/api/*, runtime nodejs)      │
                     │   • /api/advisor/chat   ← Kern, streamt       │
                     │   • /api/alerts/*       Preis-Wecker DOI      │
                     │   • /api/profiles /api/outcome/* /api/auth/*  │
                     │   • /api/vitals /api/support/chat /api/mcp    │
                     │   • /empfehlung/[slug]  Affiliate-Redirect + Klick-Log │
                     └───────┬───────────────────────────┬───────────┘
                             │                           │
              ┌──────────────▼─────────┐     ┌───────────▼────────────────┐
              │  Neon Postgres         │     │  LLM-Provider              │
              │  (Drizzle ORM,         │     │  • Gemini 2.5 Flash (primär)│
              │   @neondatabase/serverless)  │  • Claude Haiku 4.5 (Fallback)│
              │                        │     └────────────────────────────┘
              │  dog_foods, offers,    │
              │  price_history,        │     ┌────────────────────────────┐
              │  dog_breeds,           │     │  Netlify Scheduled Functions│
              │  health_issues,        │◀────│  • import-feeds  (täglich)  │
              │  dog_profiles,         │     │  • price-alerts             │
              │  subscribers,          │     │  • outcome-checks           │
              │  price_alerts,         │     │  • ai-visibility (wöchentl.)│
              │  outcome_checks,       │     └───────────▲────────────────┘
              │  studies, glossary_*,  │                 │
              │  community_insights,   │     ┌───────────┴────────────────┐
              │  advisor_sessions, …   │     │  AWIN / AdCell Produkt-Feeds│
              └────────────────────────┘     │  (XML/CSV → parse → upsert) │
                                             └────────────────────────────┘
```

---

## Datenpfad: Feeds → Katalog

Täglicher Cron (Netlify Scheduled Function `netlify/functions/import-feeds.mts`,
manueller Fallback: GitHub Workflow `import-feeds.yml`):

```
AWIN_FEED_URLS / ADCELL_FEED_URLS
        │
        ▼
scripts/parse-feeds.py         → normalisiert, dedupliziert, erkennt Typ/Protein,
        │                        rechnet €/kg, filtert Hundefutter → dog_foods.json
        ▼
scripts/load-dog-foods.mjs     → Upsert in Neon; Lifecycle (is_active),
                                 price_history-Snapshot nur bei Preisänderung
        │
        ▼
scripts/compute-scores.mjs     → BELLA-Score 0–100 (Fleischanteil, Deklaration, …)
        ▼
scripts/indexnow-ping.mjs      → Bing/Yandex IndexNow
```

Cross-Sell-Kategorien (`companion_for`, `category`) analog über `parse-crosssell.py` +
`load-crosssell.mjs`. Seed-Daten (Rassen, Probleme, Studien, Glossar) via `scripts/seed-*.ts`.

---

## KI-Berater: `/api/advisor/chat`

`runtime = "nodejs"`, `maxDuration = 45`. Antwortet als **Plain-Text-Stream mit
Zeilen-Protokoll** (kein JSON-Body), das der Client (`BellaAdvisor.tsx`) parst:

| Präfix | Bedeutung |
|---|---|
| `STEP:<id>:<label>` | sichtbarer Analyse-Schritt |
| `CONF:<n>` | Konfidenz % |
| `ELIM:<count>:<grund>` | Eliminierungs-Event |
| `SCORE:<json>` | Match-Scores der Top-Kandidaten |
| `STUDY:<json>` | zitierte Studien |
| `TEXT:<chunk>` | gestreamte KI-Begründung (`\n` escaped) |
| `LINKS:<json>` | Glossar-Vertiefungslinks |
| `OFFERS:<json>` | finale Empfehlung `{ offers, theme, confidence }` |
| `COMPANIONS:<json>` | kuratierte Begleitprodukte (Schicht 1) |
| `PROFILE:<json>` | angelegter Futter-Pass (`dog_profiles`) inkl. `shareToken` |

Ablauf pro Request:
1. `parseIntent()` — regelbasiert (Regex) über die **User**-Turns: Lebensphase, Futtertyp,
   Sensibilität/Allergen, Protein, Rasse, Budget €/kg, aktuelles Futter, Wechselgrund.
   → **wird in Roadmap Op 2.1 durch LLM-Structured-Output + Fast-Path ersetzt.**
2. `hasEnoughIntent()` entscheidet: **nachfragen** (`ask`) oder **empfehlen**.
3. Bei Empfehlung: `fetchCandidates()` — SQL gegen `dog_foods` (Hard-Filter Typ/Budget,
   Soft-Scoring für dünn getaggte Kriterien), `DISTINCT ON` je Produktname, dann
   `scoreFood()`-Ranking, **harter Allergen-Ausschluss** (auch namensbasiert:
   Huhn ⇒ Geflügel/Hähnchen), Marken-Vielfalt → Top 3.
4. `buildSystemPrompt()` mit echten Produktdaten + optional passenden Studien.
5. LLM-Stream: **Gemini 2.5 Flash** (`thinkingBudget: 0`), Fallback **Claude Haiku 4.5**,
   Fallback deterministischer Text.
6. Non-blocking: `getCompanions()` (Cross-Sell), `dog_profiles`-Insert (Futter-Pass),
   `logChat()` (aktuell `CREATE TABLE IF NOT EXISTS` — Roadmap Op 1.5).

---

## Datenbank (Drizzle, `src/db/schema.ts`)

**Katalog:** `dog_foods` (Hauptkatalog, BELLA-Score, `companion_for`, `category`),
`offers` (Legacy, Rückwärtskompatibilität), `price_history` (Snapshot-on-change).
**Content:** `dog_breeds`, `health_issues`, `studies`, `topic_hubs`, `glossary_terms`,
`community_insights`.
**Nutzer/Wachstum:** `subscribers` (DOI), `price_alerts` (mode `price`|`refill`),
`dog_profiles` (Futter-Pass, `share_token`, Verbrauchsmathematik), `outcome_checks`
(3-Wochen-„hat's geholfen?"), `affiliate_clicks`, `advisor_sessions`.

Zugriff: `@neondatabase/serverless` (`neon()` HTTP) direkt in Server Components und
Route Handlers. Kein Connection-Pool nötig (serverless HTTP).

---

## Rendering & Performance

- **SSG + ISR:** die meisten Seiten `revalidate` (Home 3600, Rasse/Content 86400).
  `generateStaticParams` für alle `[slug]`-Routen.
- **Bilder:** `next/image` (AVIF/WebP), Rasse-Fotos self-hosted unter `public/breeds/`
  (`BreedImg`-Komponente mit Emoji-Fallback). Remote erlaubt: `images.dog.ceo`,
  `images.unsplash.com`.
- **Client-JS:** below-the-fold via `next/dynamic`; Analytics (`gtag`) `lazyOnload`;
  Support-Widget + Exit-Intent via `DeferredExtras` (requestIdleCallback).
- **Caching:** `_next/static/*` + statische Assets `max-age=31536000, immutable`
  (`netlify.toml` + `next.config.ts` headers).

---

## Deployment

- **Netlify**, `base = "bella-app"`, `command = "npm run build"`, `publish = ".next"`,
  Node 22, `@netlify/plugin-nextjs`.
- **Auto-Deploy** bei Push auf `main`. Preview-Deploy pro PR.
- **Edge Function** `block-bad-bots` auf `/*`.
- **Scheduled Functions** (`netlify/functions/*.mts`) für Feed-Import, Preis-Alerts,
  Outcome-Checks, KI-Sichtbarkeit.
- Env-Variablen in der Netlify-UI (DB, AI-Keys, AWIN-Feeds, `RESEND_API_KEY`,
  `CRON_SECRET`, `SITE_URL`). Template: `bella-app/.env.example` (Roadmap Op 0.3).

---

## Bekannte Lücken (→ `../BELLA_NEXT_LEVEL.md`)

- Kein CSP/COOP, keine API-Rate-Limits, keine Middleware (Op 1.2 / 1.3).
- Keine automatisierten Tests, kein CI-Gate (Op 0.4 / 1.4).
- React 18.3 unter Next 16 (Op 1.1). Schema-Drift via Laufzeit-DDL (Op 1.5).
- Intent-Parsing regelbasiert & mit duplizierter Rassen-Liste (Op 2.1).
- Toter `src/lib/{environment,performance,state,validation,rendering}`-Code, aus
  tsconfig/ESLint ausgeschlossen (Op 0.2). `--font-inter` referenziert, nie gesetzt (Op 1.6).
