# CLAUDE.md — welches-hundefutter.today (BELLA)

> Diese Datei wird von Claude Code automatisch geladen. Sie ist die **Single Source of Truth**
> für den Ist-Zustand und die Spielregeln. Agenten in `.claude/agents/` ergänzen sie.
> **`BELLA_NEXT_LEVEL.md`** (Repo-Root) ist die Roadmap — nummerierte Operationen mit Akzeptanzkriterien.
> **`FUTTERPASS.md`** (Repo-Root) ist die Blaupause für das Futter-Pass-Schwungrad (Stufen 1–5).
> App-Code: **`bella-app/`** (Next.js 16, App Router). Technischer Aufbau: `bella-app/ARCHITECTURE.md`.

---

## 1. Was wir bauen

**Das Check24 für Hundefutter** — eine KI-Beraterin (**BELLA**), die in ~60 Sekunden aus
einem Live-Katalog (AWIN-Feeds) das passende Futter für *diesen* Hund findet, mit
Preisvergleich und Cross-Selling (Snacks, Versicherung, Zubehör, alles für Hund + Halter).

- **Domain:** welches-hundefutter.today
- **Persona:** BELLA (Fork von HANSI / HandyvertragTrotzSchufa)
- **Ziel:** Platz 1 DACH für „welches hundefutter für meinen hund" (+ Cluster)
- **Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TS · Tailwind v4 · Neon Postgres (Drizzle, versionierte Migrationen) · **Netlify** (Deploy **und** Qualitäts-Gate — kein GitHub Actions) · AWIN + AdCell · Gemini 2.5 Flash + Claude Haiku 4.5 / Sonnet · Vitest + Playwright

---

## 2. GROUND TRUTH — Ist-Zustand (Stand 2026-09-04)

**Das Fundament trägt. Phasen 0–2 erledigt, Phasen 3–5 laufen** — Detail + Fortschrittstabelle in `BELLA_NEXT_LEVEL.md` (36 nummerierte Operationen).

### ✅ Erledigt & live

| Was | Detail |
|---|---|
| Migration HANSI→BELLA + toter Code | Abgeschlossen. App-Ordner heißt `bella-app/`. |
| `products.ts` Handy-Frankenstein | Abgelöst; Seiten rendern aus **Neon** (`src/db/queries/*`) |
| über 11.000 Produkte | AWIN (`a=615299`) + AdCell, **täglicher Cron via Netlify Scheduled Functions** (`netlify/functions/*.mts`) |
| `price_history` | Snapshot nur bei Änderung, Lifecycle (`is_active`) |
| KI-Berater (BELLA) | `/api/advisor/chat`, streamt; refaktoriert in `src/lib/advisor/*`; Modell-Routing (ask→Flash/Haiku, recommend→Flash+thinking/Sonnet); Timeout + Fallback-Kette + `WARN:degraded` |
| **Advisor-Allergen-Härtung (Phase 2A, komplett)** | `avoidProtein` als hartes Konzept, SQL-Ausschluss + `LIKE ANY`, Snack-Guard, Re-Query bei 0 Offers, **zwei Safety-Assertions** (kein gemiedenes Protein je in `OFFERS`), ehrliche „keine sichere Empfehlung"-Meldung. Blockierende Eval `src/lib/advisor/allergen-eval.test.ts` (läuft im Netlify-Build gegen Neon). Audit: `docs/audits/2026-09-03-bella-chat-audit.md` |
| Fundament (Phase 0/1) | React 19 · CSP „Weg B" + COOP · In-Memory-Rate-Limit · versionierte Drizzle-Migrationen (`drizzle/0000_baseline`, `0001_events_analytics`) · `--font-inter` self-hosted · **118 Vitest** + **Playwright-Smoke** (`e2e/smoke.spec.ts`, 5 Tests) |
| 186 Rasse-Seiten | `/rasse/[slug]` — Portionsrechner, FAQ, Fütterungs-Absätze; Fotos **self-hosted** in `public/breeds/`; **eigenes OG-Bild** (`opengraph-image.tsx`, Foto + Name + BELLA-Marke, on-demand) |
| Programmatik | `/problem/*` (14), `/futtertyp/*`, `/lebensphase/*`, `/vergleich/*`, ~1.400 Tipps, Studien, Glossar, `/stadt/*` (Doorway-`noindex` < 100k Einw.) |
| **Design-System (Phase 3, Teil 1)** | Semantische Farb-Tokens + `[data-theme]` Light/Dark + `ThemeToggle` (nicht-brechend, auf `/dev/components`) · kanonisches `BellaMascot` (SVG, 4 Posen, server-safe) · echte `not-found.tsx`/`loading.tsx` · tote CSS-Animationen entfernt · Komponenten-Katalog `/dev/components` + Playwright-Visual (`e2e/visual.spec.ts`, manuell) |
| **Content/EEAT (Phase 4, Teil 1)** | `<JsonLd>` (getestet, XSS-hart) ersetzt **alle 21** handgerollten Blöcke · `dateModified` überall ehrlich (`CONTENT_REVISED` / `BUILD_DATE` aus `prebuild`, kein `new Date()`) · interner Cluster-Graph (`src/lib/linking/graph.ts` + `<RelatedLinks>`, Problem-Cluster: 0 Orphans) · `/llms-full.txt` (20 zitierfähige Kernantworten) · Audit-Tools `npm run audit:content` / `audit:links` (Reports in `docs/audits/`) |
| **First-Party-Analytics (Phase 5, Teil 1)** | `events`-Tabelle **live in Neon**, sammelt echten Traffic. 4/5 Events verdrahtet: `pageview`, `advisor_start`, `advisor_offers`, `affiliate_click`, `alert_subscribe` (`refill_click` wartet auf 5.1). **Parallel zu GA4** (2-Wochen-Übergang). |
| Schicht 1/2 — Cross-sell + Preis-Wecker | Kuratierte Begleit-Empfehlung (max. 3) · DOI-E-Mail-Audience via `price_history`, `/preis-wecker` |
| Rechtshygiene | Impressum (DDG), Datenschutz inkl. KI, kein On-Load-Pixel |
| **Betrieb (Phase 6, Teil 1)** | Deploy + Gate über **Netlify** (`npm run ci` inkl. Bundle-Budget `check:bundle`); stündl. Prod-Smoke `health-check.mts`; `src/lib/log.ts` (PII-Scrub) + `error.tsx`/`global-error.tsx`; `SECURITY.md`/`CODEOWNERS`/PR-Template; Runbooks `docs/runbooks/*` |

### 🔴 Offene Baustellen (Auszug — vollständig in `BELLA_NEXT_LEVEL.md`)

- **Fundament-Reste:** `strict-dynamic`-CSP + Nonce (1.2). Rate-Limit (1.3) läuft jetzt verteilt über Upstash (Fallback: In-Memory) — `UPSTASH_REDIS_REST_URL`/`_TOKEN` in Netlify noch zu setzen. `ai_usage`-Logging ✅ live.
- **Design Teil 2:** site-weite Migration `bg-white/x`→Tokens + `@media (prefers-color-scheme)` aktivieren (3.1) · off-brand `BellaCharacter` ablösen + `🐕`-CTA-Sweep (3.2) · OG-Layout für problem/vergleich/Blog (3.3) · `framer-motion`-Audit + View Transitions (3.5).
- **Content Teil 2:** Thin-Content anreichern — `lebensphase/*`, `futtertyp/*`, `glossar/*` (4.1) · Cluster-Graph auf futtertyp/vergleich/rasse ausweiten (4.4) · „Antwort-zuerst"-Absätze + `CitableStat` breiter (4.5) · **Tierarzt-Review** (4.2, extern blockiert).
- **Moat:** Futter-Pass-Schleife (5.1) **war bereits komplett gebaut** — Profil, Verbrauchsmathematik, Nachschub-/Lebensphasen-Wecker, teilbarer Steckbrief, alle 7 Funnel-Events (5.3) live, inkl. `refill_click`/`lifecycle_click`. `/admin/analytics`-Dashboard zeigt Funnel + KI-Kosten + Outcome-Trichter (5.4, intern — noch n=0). Offen: 2-Wochen-Parallelbetrieb GA4↔First-Party beobachten, dann GA4 raus; öffentliche Outcome-Stats brauchen erst echte Fallzahl + eine Tag-Taxonomie-Korrektur.
- **Betrieb Teil 2:** Sentry-DSN + Alerts (6.1) · Lighthouse post-deploy (6.2) · `npm audit fix` + `audit:deps` blockierend (6.3) · Restore-Drill real durchspielen + `db-backup.mts` (6.4).

---

## 3. Die strategische Wette (wie wir Platz 1 holen)

Der DACH-SERP für „hundefutter test" gehört Editorial-Testseiten (hundeo.com, 1a-hundefutter.de,
hundefutter-tests.net). Die gewinnen über **EEAT** (echte Tests, transparente Score-Methodik) und
**Breite** (3.000+ Produkte). Sie sind aber **statisch**.

**Unsere uneinholbaren Wedges:**
1. **Echter konversationeller Berater** (BELLA) — kein Konkurrent hat „erzähl von deinem Hund → personalisierte Auswahl".
2. **Programmatic Personalisierung** — Rasse × Alter × Problem × Futtertyp als indexierbare Seiten.
3. **Transparente, verteidigbare Score-Methodik** (Fleischanteil, Deklaration, Zusammensetzung) — Pflicht für EEAT.
4. **Live-Preise via AWIN-Feeds** — der echte „Check24"-Hebel.
5. **Eigene E-Mail-Audience** (Preis-Wecker) — nicht von Google abhängig.

---

## 4. Harte Regeln für ALLE Agenten

1. **DB-first.** Neue Daten kommen aus Neon (`dog_foods`/`offers`), nie aus statischen Fakes.
2. **Kein totes Verzeichnis erweitern.** Kein `src/features/`, `src/platform/` — gelöscht.
3. **Keine erfundenen Zahlen.** „11.000+" steht da, weil so viele echte Datensätze in `dog_foods` sind. Ändert sich die DB, ändert sich die Zahl.
4. **Keine medizinischen/tierärztlichen Heilversprechen.** „kann unterstützen", nicht „heilt".
4a. **Allergen-Garantie (nicht verhandelbar).** Ein gemiedenes Protein darf **nie** in der `OFFERS:`-Payload landen. Im Zweifel NICHT empfehlen + ehrlich neu suchen. Abgesichert durch `src/lib/advisor/allergen-eval.test.ts` — läuft im Netlify-Build gegen Neon (`DATABASE_URL` ist Netlify-Env), scheitert der Test, scheitert der Deploy.
5. **Affiliate-Transparenz:** Jeder AWIN-Link `rel="sponsored"`, sichtbare Offenlegung. Pflicht.
6. **Deutsch, Du-Form, Hundehalter-Sprache.** Kein Marketing-Sprech, keine Floskeln.
7. **Gate muss grün bleiben.** `cd bella-app && npm run ci` (= `typecheck` + `lint` + `test` + `build`) vor jedem Push. Das ist derselbe Befehl, den Netlify als Build-Command ausführt — schlägt er fehl, gibt es keinen Deploy. **Kein GitHub Actions.**
8. **Mobile-first.** > 70 % der Hundehalter suchen am Handy. Core Web Vitals sind Ranking-kritisch.
9. **Kuratiert, nicht zugemüllt.** Cross-Sells max. 2–3 mit Begründung; Relevanz vor Provision; E-Mails Wert vor Frequenz; kein Versand ohne Double-Opt-in.

---

## 5. Agent-Flotte & Delegation (13 Spezialisten, `.claude/agents/`)

| Agent | Rolle (Auftrag) | Wann rufen |
|---|---|---|
| `bella-lead` | Orchestrator, Roadmap, zerlegt Aufgaben | Start jeder größeren Initiative |
| `platform-architect` | DB-Integrität, Build-Gesundheit, Refactors | „warum ist X kaputt" |
| `feed-engineer` | Echte AWIN-Pipeline + Cross-Selling-Kategorien (Snacks, Versicherung) | Feeds/Daten/Preise |
| `bella-advisor` | Fragenflow, Scoring, Erklärungen, Prompt-Tuning | Empfehlungslogik, Conversation |
| `content-engineer` | Rasse-/Problem-/Futtertyp-Seiten, FAQ, Schema, Seed-Daten | Neue Seiten, Texte |
| `visual-designer` | Designsystem, BELLA-Charakter, CRO, OG-Images | UI, Komponenten, Conversion |
| `experience-architect` | Signatur-Erlebnisschicht: Motion-Choreografie, lebende BELLA, View-Transitions, Scroll-Storytelling — baut auf `visual-designer` auf | „unvergesslich", nicht nur „sauber" |
| `seo-strategist` | Pfad zu DACH #1: Cluster, interne Links, Technical SEO, AI-Search | Ranking, Keywords, Wettbewerb |
| `trust-compliance` | Recht (DSGVO/DDG), EEAT, Affiliate-Offenlegung, Health-Claims | Vor jedem Go-Live |
| `cross-sell-curator` | Begleit-Empfehlung, `companion_for`, Anti-Müll-Disziplin | Cross-Selling, Versicherung, Zubehör |
| `retention-growth` | Preis-Alerts, DOI-E-Mail-Audience, Lifecycle-Mails | Wiederkehr, E-Mail, `price_history` nutzen |
| `lifecycle-architect` | **Futter-Pass-Schwungrad** (Stufen 1–5, `FUTTERPASS.md`): `dog_profiles`, Verbrauchsmathematik, Nachschub-Wecker, Lebensphasen-Trigger, teilbarer Steckbrief | Der Burggraben — wenn Einmal-Klick → wiederkehrender Umsatz |
| `conversion-analyst` | Funnel instrumentieren (Seite→Profil→Klick→Nachschub), Schleife schließen: Signale zurück in advisor/cross-sell/seo. Anonym, kein PII, kein Fremd-Pixel. | Skalierung: wenn Traffic kommt, Conversion messen + optimieren |

**Standard-Wachstums-Sequenz:**
`platform-architect` (Schema-Drift-Blocker zuerst!) → `lifecycle-architect` + `retention-growth` → **parallel**: `content-engineer` + `seo-strategist` → `visual-designer`

---

## 6. Befehle

```bash
cd bella-app
npm install
npm run dev            # lokal

npm run ci             # DER GATE: typecheck + lint + test + build (== Netlify-Build-Command)
npm run typecheck      # einzeln
npm run lint
npm run test           # Vitest (DB-/LLM-Evals via describe.skipIf ohne Keys übersprungen)
npm run build

# E2E / Visuell — NICHT im Gate, manuell gegen eine URL:
E2E_BASE_URL=https://deploy-preview-42--welches-hundefutter.netlify.app npm run test:e2e
npm run test:visual    # Screenshots, Baselines committen

# Datenbank (Drizzle, versionierte Migrationen):
npm run db:generate    # schema.ts → neue SQL-Migration in drizzle/
npm run db:migrate      # offene Migrationen gegen $DATABASE_URL anwenden

# SEO-/Content-Audits (gegen einen laufenden `next start`):
npm run audit:content  # Thin-Content-Report
npm run audit:links    # Interner-Link-/Orphan-Report

# Feed-Pipeline: täglich automatisch via netlify/functions/import-feeds.mts.
# Manuell/lokal (Fallback):
python scripts/parse-feeds.py
DATABASE_URL="postgres://…" node scripts/load-dog-foods.mjs
```

**Cron = Netlify Scheduled Functions** (`bella-app/netlify/functions/`): `import-feeds.mts`
(05:00), `price-alerts.mts` (06:00), `ai-visibility.mts` (Mo 07:00), `health-check.mts`
(stündlich). Kein GitHub Actions mehr.

**Env & Secrets:** lokal `.env.local` nach `.env.example`; für Produktion **alles in der
Netlify-UI** (*Site configuration → Environment variables*) — `DATABASE_URL`, `GEMINI_API_KEY`,
`ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `EMAIL_FROM`, `SITE_URL`, `AWIN_FEED_URLS*`,
`ADCELL_FEED_URLS*`, `INDEXNOW_KEY`, `PEXELS_API_KEY`, `OUTREACH_TOKEN`. **Keine GitHub Secrets.**
