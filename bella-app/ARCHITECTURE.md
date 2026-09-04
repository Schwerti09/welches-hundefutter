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
05:00 UTC; manueller/lokaler Fallback: `scripts/parse-feeds.py` + `scripts/load-dog-foods.mjs`):

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

Ablauf pro Request (`src/lib/advisor/*` + `route.ts`):
1. **Intent** — `parseIntent()` (Regex-Fast-Path, 0 ms) über die **User**-Turns: Lebensphase,
   Futtertyp, `sensitive`, Wunsch-`protein`, **`avoidProtein[]`** (Allergene, getrennt vom Wunsch —
   siehe unten), Rasse (`matchBreed` aus `@/data/breeds.ts`), Budget, aktuelles Futter, Wechselgrund.
   Steht eine Empfehlung an **oder** ist der Fast-Path dünn: `extractIntentLLM()` (Gemini JSON-Modus,
   `responseSchema`, 4 s-Timeout, env-abschaltbar) ergänzt, `mergeIntent()` fügt sicher zusammen
   (`avoidProtein` = Vereinigung, `sensitive`/`grainFree` = ODER).
2. `hasEnoughIntent()` entscheidet: **nachfragen** (`ask`) oder **empfehlen**.
3. Bei Empfehlung: `fetchCandidates()` — SQL gegen `dog_foods`:
   - **🔴 Harter Allergen-Ausschluss** (`avoidProtein`): `WHERE` schließt jede Namensvariante
     (Huhn ⇒ Geflügel/Hähnchen/Chicken/…) in `protein` **und** `name` aus.
   - **Snack-Guard**: `type <> 'snack'`, keine Neben-Kategorien.
   - Weiche Filter (Typ/Budget), Soft-Scoring, `DISTINCT ON` je Name, Pool `LIMIT 120`,
     `scoreFood()`-Ranking, Marken-Vielfalt → Top 3.
   - **Re-Query** (`{ relax }`): 0 Treffer + weiche Kriterien → zweiter Versuch ohne Typ/Budget,
     Sicherheit bleibt hart.
   - **Zwei Safety-Assertions** (`containsAnyAllergen`): nach der Suche **und** direkt vor
     `emit(OFFERS)`. Garantie (CLAUDE.md §4a): kein `avoidProtein`-Produkt je in der Payload.
     Greift eine Assertion → `logChat`-Prefix `[SAFETY_BLOCKED]`.
   - Nichts Sicheres → leere Offers, Prompt-Modus „KEINE SICHERE EMPFEHLUNG MÖGLICH",
     **kein** Futter-Pass / Preis-Wecker.
4. `buildSystemPrompt()` — Katalog als *BELLAs Recherche* gerahmt (nicht „vom Halter genannt"),
   Allergie als Pflicht-Zeile, echte Produktdaten + max. 1 passende Studie (nur bei konkreter Sorge).
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
- **Client-JS:** below-the-fold via `next/dynamic`; GA4 (`gtag`) `lazyOnload`;
  Support-Widget + Exit-Intent via `DeferredExtras` (requestIdleCallback).
- **Motion:** nur `transform`/`opacity`-Animationen (composited); tote
  `background-position`-/`top`-Keyframes entfernt (`globals.css`); `prefers-reduced-motion`
  respektiert. `framer-motion` nur in 6 Komponenten (Audit offen, 3.5 Teil 2).
- **OG-Bilder:** `opengraph-image.tsx` je Seitentyp via `next/og` (`ImageResponse`).
  Rasse-Variante bettet das self-hostete Foto ein, on-demand (`generateStaticParams: []`,
  `revalidate` 24 h) — kein 186er-Prebuild. Gemeinsames Layout: `src/lib/og-image.tsx`.
- **Caching:** `_next/static/*` + statische Assets `max-age=31536000, immutable`
  (`netlify.toml` + `next.config.ts` headers).

## Querschnitts-Systeme

- **Design-Tokens** (`src/app/globals.css`): semantische Farb-Custom-Properties, `:root`
  = Dark, `:root[data-theme="light"|"dark"]` = Umschalter (`ThemeToggle`). `@theme inline`
  mappt sie in Tailwind. Live-Seite bleibt Dark bis zur site-weiten `bg-white/x`-Migration
  (3.1 Teil 2). Katalog + Poser: `/dev/components` (non-prod, `NEXT_PUBLIC_DEV_PAGES`).
- **Maskottchen** (`src/components/bella/BellaMascot.tsx`): reines Server-SVG, Posen
  `idle|sniff|found|hmm`, Token-Palette. Für OG existiert eine `<style>`-freie Satori-Variante
  in `og-image.tsx`.
- **Strukturierte Daten:** `<JsonLd data={…} />` (`src/components/JsonLd.tsx`) — einziger Weg,
  `<script type="application/ld+json">` auszugeben. `serializeJsonLd` escaped `<` → `<`
  (kein `</script>`-Ausbruch), nonce-fähig. Alle 21 früheren Handroll-Stellen migriert; Unit-Test.
- **Ehrliche Daten:** `src/lib/site-dates.ts` — `CONTENT_REVISED` (redaktionell, manuell)
  und `DATA_REFRESHED` = `BUILD_DATE` aus `src/lib/generated-build-date.ts`, geschrieben vom
  `prebuild`-Skript `scripts/gen-build-date.mjs` (`git log -1 --format=%cs`). Kein `new Date()`
  in `dateModified`. Sichtbares Signal: `AuthorBox` (29 Seiten) bzw. `<Freshness>`.
- **Interner Link-Graph:** `src/lib/linking/graph.ts` (kuratierte Themen-Cluster) +
  `<RelatedLinks>`. Aktuell für `/problem/[slug]` (14 Seiten, 0 Orphans). Prüftool
  `npm run audit:links` (Reports `docs/audits/`). Ebenso `npm run audit:content` (Thin-Content).
- **First-Party-Analytics:** `POST /api/track` (anonym, Event-Allowlist, kein Cookie/PII,
  Rate-Limit) → `events`-Tabelle. Client: `track()` (`src/lib/analytics.ts`) via `sendBeacon`,
  `PageTracker` in `layout.tsx` sendet `pageview`. Läuft **parallel zu GA4** (2-Wochen-Übergang);
  Migration `drizzle/0001_events_analytics.sql`.
- **KI-Suche:** `/llms.txt` (volle Wissensbasis, DB-generiert) + `/llms-full.txt` (20
  zitierfähige Q&A mit Quellen). `robots.ts` listet KI-Bots explizit.

---

## Deployment & Gate

- **Netlify**, `base = "bella-app"`, **`command = "npm run ci"`** (`typecheck` + `lint` +
  `test` + `build`), `publish = ".next"`, Node 22, `@netlify/plugin-nextjs`.
- **Der Build IST der Qualitäts-Gate.** Schlägt eine Stufe fehl → Build bricht ab → kein
  Deploy. **Kein GitHub Actions** (`.github/workflows/` ist entfernt). Für `main` und für
  Deploy Previews (PRs) gilt derselbe Gate; der Netlify-Commit-Status kann im Branch-Schutz
  als „required check" gesetzt werden.
- Die DB-gestützte Allergen-**Eval** (`src/lib/advisor/allergen-eval.test.ts`) läuft im Build
  mit, weil `DATABASE_URL` in den Netlify-Env-Variablen liegt.
- **Auto-Deploy** bei Push auf `main`. Preview-Deploy pro PR.
- **Edge Function** `block-bad-bots` auf `/*`.
- **Scheduled Functions** (`netlify/functions/*.mts`): `import-feeds` (05:00),
  `price-alerts` (06:00), `outcome-checks`, `ai-visibility` (Mo 07:00), **`health-check`
  (stündlicher Prod-Smoke der Kernrouten → Function-Log)**.
- **E2E/Visuell laufen NICHT im Build** (Browser im Build-Image zu fragil) — manuell:
  `E2E_BASE_URL=<preview-url> npm run test:e2e` bzw. `npm run test:visual` (Baselines unter
  `e2e/*-snapshots/`, im CI-Linux erzeugt).
- Env-Variablen in der Netlify-UI (DB, AI-Keys, AWIN-Feeds, `RESEND_API_KEY`,
  `CRON_SECRET`, `SITE_URL`). Template: `bella-app/.env.example`.

---

## Stand & offene Punkte (→ `../BELLA_NEXT_LEVEL.md`)

**Erledigt (Stand 2026-09-04) — Phasen 0–2 komplett:**
- **Fundament:** Netlify-Gate `npm run ci` + **118 Vitest** + Playwright-Smoke (0.4/1.4),
  React 19 (1.1), CSP „Weg B" + COOP (1.2), Rate-Limit + Origin-Check (1.3), versionierte
  Drizzle-Migrationen `0000`/`0001` (1.5), Inter-Font + ES2022 (1.6), toter Code raus (0.2),
  Doku entlügt (0.1), Ordner-Rename (0.0).
- **Advisor 2A (komplett) + 2.1–2.5:** `avoidProtein` hart, SQL-Ausschluss, Snack-Guard,
  Re-Query, zwei Safety-Assertions, ehrliche Leermeldung, Prompt-Framing, LLM-Intent im
  RECOMMEND, ehrliche Stream-Zahlen, Modell-Routing, Timeout+Fallback+`WARN:degraded`,
  strukturelle + LLM-Judge-Eval, **blockierende Allergen-Eval im Netlify-Build (2A.8)**.
- **Phase 3 (Teil 1):** Token-System + `ThemeToggle` (3.1), `BellaMascot` + 404/Loading (3.2),
  Rasse-OG mit Foto (3.3), Komponenten-Katalog + Playwright-Visual (3.4), tote Animationen
  raus (3.5).
- **Phase 4 (Teil 1):** Thin-Content-Audit-Tool + Report (4.1), interner Cluster-Graph
  Problem-Bucket (4.4), `/llms-full.txt` (4.5), **`<JsonLd>` — alle 21 Stellen (4.6)**,
  ehrliche `dateModified` überall (4.3).
- **Phase 5 (Teil 1):** First-Party-Event-Pipeline `events`/`/api/track`/`PageTracker` (5.2).

**Offen (jeweils „Teil 2"):** verteilter Rate-Limit-Store + `ai_usage` (1.3) · `strict-dynamic`
CSP + Nonce (1.2) · site-weite Token-Migration (3.1) · off-brand `BellaCharacter` + `🐕`-Sweep
(3.2) · OG-Layout problem/vergleich/Blog (3.3) · `framer-motion`-Audit (3.5) · Thin-Content
anreichern + Cluster-Graph ausweiten (4.1/4.4) · Tierarzt-Review (4.2, extern) · `events`
verdrahten + `/admin` + GA4 raus (5.2/5.3) · Futter-Pass-Nachschub (5.1) · Outcome-Checks (5.4)
· Error-Tracking + Perf-Budget (6.1/6.2).

**Grenze Allergen-Ausschluss:** `dog_foods` hat keine `ingredients`-Spalte → Prüfung über `protein` +
`name` + `category`, nicht auf Zutaten-Ebene (Feed-Pipeline-Thema).
