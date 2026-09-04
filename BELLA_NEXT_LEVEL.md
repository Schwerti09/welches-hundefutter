# 🐕 BELLA — NEXT LEVEL

> **Die eine Landkarte.** Ist-Zustand ehrlich, Zielbild scharf, dazwischen ein
> Operationsplan, den wir Stück für Stück abarbeiten.
>
> **Stichtag der Analyse:** 2026-09-03 · **Repo:** `welches-hundefutter` · **App:** `bella-app/`
> · **Live:** https://welches-hundefutter.today · **Deploy:** Netlify (auto on push `main`)
>
> Ground Truth für den Alltag bleibt `CLAUDE.md`. Dieses Dokument ist die *Roadmap*.
> Fleet: `.claude/agents/*.md`. Wenn dieses Dokument und ein anderes sich widersprechen,
> gewinnt dieses — und das andere wird korrigiert oder gelöscht (siehe **Operation 0.1**).

---

## Spielregeln für jede Operation

1. **Atomar.** Eine Operation = ein PR-großer, einzeln testbarer Schritt.
2. **Akzeptanzkriterien zuerst.** Erst wenn die Haken definiert sind, wird Code geschrieben.
3. **`cd bella-app && npm run build` muss grün bleiben.** Kein Push ohne grünen Build.
   Ab **Operation 0.4** zusätzlich: `npm run lint`, `npm run typecheck`, `npm test` grün.
4. **Keine erfundenen Zahlen. Keine Heilversprechen. Jeder Affiliate-Link `rel="sponsored"` + sichtbare Offenlegung.**
5. **Allergen-Sicherheit ist nicht verhandelbar.** Was ein Allergiker nie empfohlen bekommen darf,
   wird durch einen Test abgesichert, nicht durch Hoffnung.
6. **Mobile-first, Core Web Vitals sind Ranking-kritisch.** Kein Merge, der die Vitals verschlechtert.
7. Jede Operation trägt unten ein: **Ziel · Warum · Dateien · Vorgehen · Akzeptanz · Agent · Aufwand · Risiko · Abhängt von**.

Aufwand: **S** ≈ ½ Tag · **M** ≈ 1–2 Tage · **L** ≈ 3–5 Tage · **XL** ≈ >1 Woche / mehrere PRs.

---

# TEIL 1 — IST-ZUSTAND (geprüft, nicht behauptet)

Das Fundament trägt: 2.372 Seiten bauen grün, echte Neon-DB, echte Feed-Pipeline (Cron via
Netlify Scheduled Functions), streamender KI-Berater mit Intent-Parsing + Scoring +
Allergen-Ausschluss + Cross-Sell + Futter-Pass-Anlage, Preis-Historie, DOI-E-Mail-Audience,
Outcome-Checks, programmatische Rasse-/Problem-/Futtertyp-/Vergleichs-Seiten, `llms.txt`,
maschinenlesbarer Katalog. **Das ist viel und es ist echt.**

Was das „nächste Level" blockiert, sortiert nach Ebene:

## 1.1 Technik

| # | Befund | Beleg | Schwere |
|---|---|---|---|
| T1 | **React 18.3.1 unter Next 16.2.6.** Next 16 setzt React 19.2 voraus. Läuft, ist aber neben der unterstützten Basis — und lässt Actions, `useOptimistic`, `use()`, verbesserte Suspense/RSC-Semantik liegen. | `bella-app/package.json` | hoch |
| T2 | **Kein CSP, kein COOP** in `next.config.ts` oder `netlify.toml`. `ARCHITECTURE.md` behauptet „strict CSP with allowlist" — das ist unwahr. | `bella-app/next.config.ts`, `netlify.toml` | hoch |
| T3 | **Keine Middleware, kein Rate-Limiting.** `/api/advisor/chat` ruft Gemini **und** Claude, ungedrosselt und ohne Auth/Herkunftsprüfung → Kosten-/Missbrauchs-Exposition. `ARCHITECTURE.md` behauptet einen Proxy-Layer mit 60 req/min — existiert nicht. | `src/app/api/advisor/chat/route.ts`, kein `src/middleware.ts` | hoch |
| T4 | **Null automatisierte Tests.** ~120k Zeilen TS/TSX, Scoring, Allergen-Ausschluss, Verbrauchsmathematik, Feed-Parsing, Preis-Extraktion — kein Unit-Test, kein E2E. Höchstes Risiko im Repo. | kein `vitest.config.*` / `playwright.config.*` | hoch |
| T5 | **Schema-Drift als Nebenwirkung.** `logChat()` macht `CREATE TABLE IF NOT EXISTS` bei *jedem* Request. Keine committeten Drizzle-Migrationen; Schema wird per `drizzle-kit push` von Hand gepflegt. | `route.ts:518`, kein `drizzle/` Ordner | mittel |
| T6 | **Intent-Parsing = ~200 Zeilen handgeschriebene Regex** inkl. einer **duplizierten 180-Rassen-Liste** (der Kommentar gibt zu, dass es eine Kopie von `@/data/breeds.ts` ist). Brüchig, schwer zu erweitern, unmöglich sauber zu testen. | `src/app/api/advisor/chat/route.ts:87-211` | mittel |
| T7 | **Toter „Architektur-Theater"-Code lebt noch.** `src/lib/environment/*`, `src/lib/performance/*`, `src/lib/state/*`, `src/lib/validation/*`, `src/lib/rendering/*`, `src/lib/data/production-data-flow.ts` sind aus `tsconfig.json` **und** ESLint **ausgeschlossen** → werden nicht typgeprüft, nicht gelintet, von nichts importiert. | `tsconfig.json:40-52`, `eslint.config.mjs:13-23` | mittel |
| T8 | **`--font-inter` wird referenziert, aber nie gesetzt.** `globals.css` baut die Font-Stacks auf `var(--font-inter, …)`, es gibt kein `next/font`-Setup im Layout → die Seite rendert immer in System-Fonts. Design-Absicht ≠ Auslieferung. | `src/app/globals.css:27,33`, `src/app/layout.tsx` (kein `next/font`) | mittel |
| T9 | **`tsconfig` target `ES2017`** — unnötig alt, zwingt Downlevel-Transforms. | `tsconfig.json:3` | niedrig |
| T10 | **Zwei Env-Templates** mit unterschiedlichem Inhalt: `.env.example` (DB/AI/Netlify) und `env.example` (14 tote `NEXT_PUBLIC_*_ENABLED` Feature-Flags aus der HANSI-Zeit). Keine dokumentiert vollständig die echten Vars aus `CLAUDE.md` (`RESEND_API_KEY`, `SITE_URL`, `AWIN_FEED_URLS`, `CRON_SECRET`, …). | `bella-app/.env.example`, `bella-app/env.example` | niedrig |
| T11 | **CI prüft nichts.** 3 Workflows, alle nur `workflow_dispatch` (manuell). Kein PR-Gate für `build`/`lint`/`typecheck`/`test`. | `.github/workflows/*.yml` | mittel |
| T12 | **46 von 58 Komponenten sind `"use client"`** (79 %), mehrere sehr groß (`BellaAdvisor` 763, `BellaDecisionUI` 630, `BellaExperience` 452, `AnalysisStorm` 371). 6 ziehen `framer-motion`. Für eine „RSC-first"-Behauptung zu viel Client-JS. | `src/components/` | mittel |
| T13 | **`index.html` liegt lose im App-Root** — vom App Router ungenutzt, reiner Verwirrungsposten. | `bella-app/index.html` | niedrig |
| T14 | **Modell-Routing pauschal.** Frage-Turn und Empfehlungs-Turn nutzen dasselbe Modell (`gemini-2.5-flash`, Fallback `claude-haiku-4-5`). Der Empfehlungs-Turn (Qualität, EEAT) verdient ein stärkeres Modell; der Frage-Turn nicht. | `route.ts:585-616` | niedrig |

## 1.2 Design

| # | Befund | Schwere |
|---|---|---|
| D1 | **Nur ein Theme (Dark).** Kein `prefers-color-scheme`-Respekt, kein Light-Mode. 2026-Standard ist beides. | mittel |
| D2 | **Token-Schulden.** Honig-Farben (`rgba(240,167,60,…)`, `#f0a73c`, `#ff8a4c`) hart in Komponenten verstreut statt über semantische Tokens. `globals.css` hat CSS-Vars **und** `@theme inline` **und** Inline-Werte — drei Wahrheiten. | mittel |
| D3 | **`sheen`-Keyframe animiert `background-position`** (nicht GPU-composited) — `.text-sheen`, `.tile__sheen`, `.count-shimmer`. Lighthouse meldet „nicht zusammengesetzte Animation". | niedrig |
| D4 | **BELLA hat keinen Charakter.** Sie ist ein 🐕-Emoji auf Farbverlaufs-Kreis. `DEFINITION_OF_DONE.md` markiert eine echte Marke/Maskottchen als offen. Für Wiedererkennung + KI-Bildsuche eine verpasste Chance. | mittel |
| D5 | **Kein OG-Bild-System pro Rasse.** 8 statische `opengraph-image.tsx` existieren, aber die 186 Rasse-Seiten teilen sich das generische `/og-image.png`. `DEFINITION_OF_DONE.md` nennt „OG-Bilder pro Rasse" als offen. | mittel |
| D6 | **Kein Komponenten-Katalog, keine visuelle Regression.** Design-Änderungen sind Blindflug. | niedrig |
| D7 | **`--muted: #9a93a6` auf `#08080c`** ist grenzwertiger Kontrast (~4.7:1) für kleine Schrift — a11y-Audit nötig, bevor mehr Grautext dazukommt. | niedrig |

## 1.3 Content

| # | Befund | Schwere |
|---|---|---|
| C1 | **Skalierungs-Risiko.** 1.400+ Tipps-Artikel + 186 Rassen + 14 Probleme + Futtertyp/Lebensphase/Vergleich/Studien/Glossar/Blog. Google „Scaled Content Abuse" / Helpful-Content trifft dünne programmatische Seiten hart. Die `/rasse/[slug]`-Seite ist inhaltlich reich (Portionsrechner, FAQ, Fütterungs-Absätze) — die 1.400 Tipps müssen auf echten Eigenwert geprüft werden. | hoch |
| C2 | **Kein Tierarzt-Review.** `REVIEWER` ist leer, `reviewedBy`-Schema damit inaktiv. Der größte EEAT-Hebel für eine Gesundheits-nahe Affiliate-Seite. (Off-Page, aber Content-nah.) | hoch |
| C3 | **Aktualität nicht sichtbar.** Kein einheitliches „zuletzt geprüft am"-Signal über Seitentypen. | mittel |
| C4 | **Interne Verlinkung ad hoc.** Kein bewusster Themen-Cluster-Graph (Hub → Spoke → Sibling), der Autorität bündelt. | mittel |
| C5 | **GEO / AI-Search halb.** `llms.txt` + `catalog.json` da; `llms-full.txt`, Bot-Logging, Antwort-zuerst-Konsistenz über alle Seitentypen offen. | mittel |
| C6 | **JSON-LD 21× per `dangerouslySetInnerHTML`** ohne gemeinsamen Helfer → Schema-Fehler schleichen sich einzeln ein (GSC hatte schon einen `image`-Fehler). | niedrig |

## 1.4 Wachstum & Moat

| # | Befund | Schwere |
|---|---|---|
| G1 | **Futter-Pass-Schwungrad nur halb verdrahtet.** `dog_profiles` wird im Chat-Route angelegt (Verbrauchsmathematik, `est_bag_days`, Share-Token), aber die Schleife *Nachschub fällig → E-Mail → Re-Kauf* ist nicht geschlossen. Das ist der Burggraben (`FUTTERPASS.md`). | hoch |
| G2 | **GA4 (`gtag.js`) trotz „kein Fremd-Pixel"-Prinzip.** Es gibt bereits `/api/vitals` + `WebVitals` (first-party RUM). Analytics könnte komplett first-party werden — Prinzip-treu, DSGVO-leichter, schneller. | mittel |
| G3 | **Funnel nicht instrumentiert.** `conversion-analyst` ist definiert, aber Seite→Profil→Klick→Nachschub wird nicht durchgängig gemessen; die Signale fließen nicht zurück in Advisor/Cross-Sell/SEO. | mittel |
| G4 | **Outcome-Checks (3-Wochen-„hat's geholfen?") laufen, werden aber nirgends sichtbar** als Trust-Signal / aggregierte Aussage. Einziger Datenpunkt, den kein Vergleichsportal hat — ungenutzt. | mittel |
| G5 | **Kein Error-Tracking / kein strukturiertes Logging in Produktion.** Streams brechen still ab (`catch { fullText = "" }`), niemand erfährt es. | mittel |

## 1.5 Doku (Meta)

Der Verwirrungs-Stapel. Vieles ist historisch, widerspricht dem Code oder sich selbst:

| Datei | Zustand |
|---|---|
| `agents.md` (Root) | **Stale.** „BELLA BLUEPRINT — Migration HANSI→BELLA", Steps 1–16. Migration ist **fertig**. Verweist auf `/mnt/user-data/outputs/*`. |
| `.github/copilot-instructions.md` | **Stale.** Enthält denselben Migrations-Blueprint. |
| `bella-app/ARCHITECTURE.md` | **Komplett falsch.** Beschreibt Mobilfunkverträge, Städte-Seiten, `/hunds/[slug]`, `products.ts`, `src/features/`, `src/proxy.ts`. Nichts davon existiert. |
| `bella-app/AGENTS.md` · `Bella_AGENTS.md` · `Bella_DECISION_INTELLIGENCE_AGENTS.md` · `SEO_AGENTS.md` | Überlappend, teils redundant zur `.claude/agents/`-Flotte. |
| `bella-app/DEFINITION_OF_DONE.md` (13.06.) · `DEPLOYMENT_DEBUG_REPORT.md` · `OUTREACH_SETUP.md` · `docs/GEO_PROTOCOL.md` | Zeitpunkt-Snapshots, teils noch nützlich, aber nicht als SSOT markiert. |
| `.claude/agents/*.md` (13) + `README.md` | **Das gute System.** README sagt „10 Agenten", es sind 13 Dateien — leicht auseinander. |
| `CLAUDE.md` (Root) + `bella-app/CLAUDE.md` (`@AGENTS.md`) | Aktuell & korrekt. Bleibt SSOT für den Alltag. |
| `README.md` (Root) + `bella-app/README.md` | Beide brauchbar & aktuell. |

---

# TEIL 2 — ZIELBILD ("es rummst")

Messbar. Kein Vibe.

| Dimension | Heute | Ziel |
|---|---|---|
| **Stack** | React 18 / Next 16 (off-baseline), 0 Tests, kein CI-Gate | React 19 / Next 16, ≥ 60 % Kernlogik testabgedeckt, CI blockt roten `main` |
| **Sicherheit** | kein CSP, kein Rate-Limit | strikte CSP (Lighthouse „CSP effektiv") + COOP, `/api/*` rate-limited, Secrets nur server-seitig |
| **PageSpeed (mobil)** | Perf 91 · BP 96 (nach heutigem Fix) | **Perf ≥ 98 · BP 100 · A11y 100 · SEO 100**, gehalten durch Perf-Budget in CI |
| **BELLA-Qualität** | Regex-Intent, ein Modell, kein Eval | LLM-strukturierter Intent + Regex-Fast-Path, Modell-Routing (schnell fragen / stark empfehlen), **Eval-Suite mit ≥ 30 Szenarien** grün, Allergen-Sicherheit per Test |
| **Design** | 1 Theme, Token-Schulden, Emoji-BELLA | Light+Dark, ein Token-System, echtes BELLA-Maskottchen (SVG, mehrere Posen), OG-Bild pro Rasse |
| **Content/EEAT** | kein Vet-Review, Aktualität unsichtbar, Cluster ad hoc | Tierarzt-Review live (`reviewedBy` aktiv), „geprüft am" überall, bewusster Cluster-Graph, Thin-Content-Audit bestanden |
| **Moat** | Futter-Pass halb, GA4, kein Funnel | Nachschub-Schleife geschlossen (E-Mail → Re-Kauf), first-party Analytics, Funnel Seite→Profil→Klick→Nachschub durchgemessen |
| **Betrieb** | keine Fehler-Sicht | Error-Tracking + strukturierte Logs, Alerts bei Stream-/Feed-/Cron-Fehlern, `SECURITY.md` |
| **North Star** | — | **ORPV** (Affiliate-Umsatz / organische Besucher) messbar und steigend |

---

# TEIL 3 — DIE OPERATIONEN

> Reihenfolge = grob top-down. Innerhalb einer Phase parallelisierbar, außer bei `Abhängt von`.

## PHASE 0 — Aufräumen & Wahrheit

Bevor gebaut wird, muss das Repo aufhören zu lügen.

### ✅ Operation 0.0 — App-Ordner `handyvertrag-app` → `bella-app` — **ERLEDIGT (2026-09-03)**
`git mv`, `netlify.toml base`, `package.json name`, `.gitignore` ×2, `CLAUDE.md`,
`.claude/agents/{00,06}`, `README` angepasst. Legacy-Skript `migrate-from-hansi.sh` entfernt. Build grün.
(Die damals mitgezogenen `.github/workflows/*` sind seit 0.4 komplett entfernt — kein GitHub Actions.)
**Rest-Haken (Mensch):** in der Netlify-UI unter *Site configuration → Build & deploy → Build settings*
prüfen, dass „Base directory" leer ist oder auf `bella-app` steht (sonst überstimmt die UI `netlify.toml`).

### ✅ Operation 0.1 — Doku auf eine Wahrheit reduzieren — **ERLEDIGT (2026-09-03)**
Umgesetzt: `ARCHITECTURE.md` neu (echter Stand) · `agents.md` + `.github/copilot-instructions.md`
= Wegweiser/Constraints · `Bella_AGENTS.md`, `Bella_DECISION_INTELLIGENCE_AGENTS.md`, `SEO_AGENTS.md`,
`DEPLOYMENT_DEBUG_REPORT.md` gelöscht · `DEFINITION_OF_DONE.md` → `docs/status/` archiviert ·
`.claude/agents/README.md` auf 13 Agenten + aktuellen Stand · Realitäts-Update in `00/01/02/04/05/06`
(kein „totes Theater / products.ts / gefälschte Pipeline" mehr) · `CLAUDE.md` §2 Ground Truth aktualisiert ·
Status-Header auf verbleibende Strategie-Docs. Acceptance-Grep sauber.
<details><summary>ursprünglicher Plan</summary>

- **Ziel:** Ein Leser (Mensch oder Agent) findet in < 2 Minuten heraus, was stimmt.
- **Warum:** 8 teils widersprüchliche Strategiedokumente kosten jeden Onboarding-Versuch eine Stunde und verleiten Agenten zu falschen Annahmen (T2/T3 stehen als „erledigt" in `ARCHITECTURE.md`).
- **Dateien:** `agents.md`, `.github/copilot-instructions.md`, `bella-app/ARCHITECTURE.md`, `bella-app/{AGENTS,Bella_AGENTS,Bella_DECISION_INTELLIGENCE_AGENTS,SEO_AGENTS}.md`, `.claude/agents/README.md`, neu: `bella-app/ARCHITECTURE.md` (echt).
- **Vorgehen:**
  1. `bella-app/ARCHITECTURE.md` **löschen** und **neu schreiben** — echter Stand: App-Router-Seiten, Neon/Drizzle-Schema (aus `src/db/schema.ts`), Feed-Pipeline (Python `parse-feeds.py` → `load-dog-foods.mjs`, Netlify Scheduled Functions), KI-Route-Stream-Protokoll, Netlify-Deploy. Ein ASCII-Diagramm, das dem Code entspricht.
  2. `agents.md` (Root) **ersetzen** durch eine 15-Zeilen-Wegweiser-Datei: „Roadmap → `BELLA_NEXT_LEVEL.md`, Alltag → `CLAUDE.md`, Flotte → `.claude/agents/`."
  3. `.github/copilot-instructions.md` **ersetzen** durch dieselben Constraints wie in `CLAUDE.md` §4 + Verweis auf dieses Dokument. Keine Migrations-Steps mehr.
  4. `bella-app/{AGENTS,Bella_AGENTS,Bella_DECISION_INTELLIGENCE_AGENTS,SEO_AGENTS}.md`: Inhalt, der noch trägt, in `.claude/agents/`-Dateien einpflegen, dann **löschen**. `bella-app/CLAUDE.md` (`@AGENTS.md`) auf `@../CLAUDE.md` oder eigenen Kurzinhalt umstellen.
  5. `DEPLOYMENT_DEBUG_REPORT.md` löschen (Zeitpunkt-Artefakt). `DEFINITION_OF_DONE.md` → `docs/status/2026-06-13-definition-of-done.md` archivieren. `OUTREACH_SETUP.md`, `docs/GEO_PROTOCOL.md` nach `docs/` sortieren.
  6. `.claude/agents/README.md`: „10" → „13", Tabelle mit allen 13 Dateien synchronisieren.
- **Akzeptanz:** `grep -ri "handyvertrag\|mobilfunk\|schufa\|products.ts\|/hunds/" --include=*.md` = 0 relevante Treffer. Jede verbleibende `.md` hat oben eine Zeile „Status: SSOT | ergänzend | Archiv (Datum)". `README`-Badges stimmen.
- **Agent:** `content-engineer` (+ `platform-architect` fürs Architektur-Doc). **Aufwand:** M. **Risiko:** niedrig. **Abhängt von:** —
</details>

### ✅ Operation 0.2 — Toten Code entfernen — **ERLEDIGT (2026-09-03)**
`src/lib/{environment,performance,state,validation,rendering,data}` (12 Dateien, 0 externe Importe)
+ `scripts/production-test.ts` + `bella-app/index.html` gelöscht. `tsconfig.json` `exclude` → nur noch
`node_modules`, `drizzle.config.ts`, `scripts`. `eslint.config.mjs` `globalIgnores` → nur noch `scripts/**`.
`src/features/**` / `src/platform/**` waren reine tsconfig/ESLint-Geister (existierten nicht). typecheck + lint + build grün.
<details><summary>ursprünglicher Plan</summary>

- **Ziel:** Was nicht typgeprüft und von nichts importiert wird, ist weg.
- **Warum:** T7. Excludes in `tsconfig`/ESLint verstecken Code, der weder kompiliert noch gelintet wird — er kann jederzeit still brechen und verwirrt jeden Refactor.
- **Dateien:** `src/lib/environment/*`, `src/lib/performance/*`, `src/lib/state/*`, `src/lib/validation/*`, `src/lib/rendering/*`, `src/lib/data/production-data-flow.ts`, `tsconfig.json`, `eslint.config.mjs`, `bella-app/index.html`.
- **Vorgehen:**
  1. Pro Datei: `grep -rn "from ['\"].*<datei>" src` → wenn 0 Importe: löschen. Wenn Importe: erst entkoppeln.
  2. Excludes aus `tsconfig.json` (Zeilen 40–52 außer `node_modules`, `drizzle.config.ts`) und `eslint.config.mjs` `globalIgnores` (außer `scripts/**`) **entfernen** — jetzt muss alles Verbleibende typ- und lint-clean sein.
  3. `bella-app/index.html` löschen.
  4. `scripts/**` behalten, aber ein eigenes lockeres `tsconfig.scripts.json` geben statt komplett ignorieren (optional, S).
- **Akzeptanz:** `tsconfig.json` `exclude` = nur `["node_modules"]`. `npm run typecheck` grün über **alles**. `npm run lint` grün. Build grün. Bundle-Size First-Load-JS nicht gestiegen.
- **Agent:** `platform-architect`. **Aufwand:** M. **Risiko:** mittel (versteckte Importe). **Abhängt von:** —
- **Ergebnis:** `exclude` = `["node_modules","drizzle.config.ts","scripts"]` (die letzten beiden bewusst — Config + Standalone-Node-Utilities; `tsconfig.scripts.json` bleibt optional/offen).
</details>

### ✅ Operation 0.3 — Env-Templates konsolidieren — **ERLEDIGT (2026-09-03)**
`bella-app/env.example` (14 tote `NEXT_PUBLIC_*_ENABLED` aus der HANSI-Zeit — starben mit `feature-flags.ts`
in Op 0.2) gelöscht. `bella-app/.env.example` neu: nur die real im Code genutzten Vars
(DB, Gemini/Anthropic, Resend + `EMAIL_FROM` + `SITE_URL`, AWIN/AdCell-Feeds + `_EXTRA`, `FEED_DIR`,
`DRY_RUN`, `INDEXNOW_KEY`, `PEXELS_API_KEY`, `OUTREACH_TOKEN`), je mit Kommentar. Die alten
`NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` / `NETLIFY_*` waren nie im Code — raus.
<details><summary>ursprünglicher Plan</summary>

- **Ziel:** Eine `.env.example`, die jede echte Variable erklärt.
- **Dateien:** `bella-app/.env.example` (behalten, neu befüllen), `bella-app/env.example` (löschen).
- **Vorgehen:** Alle in Code + `netlify/functions/*` + `scripts/*` referenzierten `process.env.*` sammeln (`grep -rn "process.env." src netlify scripts`), jede mit 1-Zeilen-Kommentar + „required/optional" + „wo eintragen (Netlify UI)". Die 14 toten `NEXT_PUBLIC_*_ENABLED` streichen (nach Gegencheck `grep -rn "NEXT_PUBLIC_.*_ENABLED" src`). Hinweis: alle Secrets liegen in der Netlify-UI — es gibt keine GitHub Secrets mehr.
- **Akzeptanz:** `env.example` gelöscht. Jede `process.env`-Nutzung im Code taucht in `.env.example` auf. `README`/`CLAUDE.md`-Env-Absatz zeigt auf die eine Datei.
- **Agent:** `platform-architect`. **Aufwand:** S. **Risiko:** niedrig. **Abhängt von:** —
</details>

### ✅ Operation 0.4 — Qualitäts-Gate (Netlify statt GitHub Actions) — **ERLEDIGT (2026-09-04)**
**Kein GitHub Actions.** Der Gate ist der **Netlify-Build**: `netlify.toml` `command = "npm run ci"`
= `typecheck` + `lint` + `test` + `build`. Schlägt eine Stufe fehl, bricht der Build ab → **kein
Deploy**. Für `main` und für Deploy Previews (PRs) gilt derselbe Befehl. Die DB-Allergen-Eval
(2A.8) läuft automatisch mit, weil `DATABASE_URL` Netlify-Env ist. `.github/workflows/` ist
komplett entfernt (auch die drei manuellen Cron-Fallbacks — die echten Crons sind
`netlify/functions/*.mts`); zusätzlich `netlify/functions/health-check.mts` (stündlicher
Prod-Smoke). `package.json` Scripts: `ci`, `typecheck`, `test`, `test:e2e`, `test:visual`.
**Rest-Haken (Mensch):** in GitHub *Settings → Branches* für `main` den Netlify-Deploy-Preview-
Status als „required check" eintragen, damit ein roter Preview den Merge blockt.
<details><summary>ursprünglicher Plan (GitHub Actions — verworfen)</summary>

- **Ziel:** Roter Code kommt nicht nach `main`.
- **Warum:** T11. Heute schützt nur die Disziplin „ich hab lokal gebaut".
- **Dateien:** neu `.github/workflows/ci.yml`, `bella-app/package.json` (Scripts `typecheck`, `test`).
- **Vorgehen:**
  1. `package.json`: `"typecheck": "tsc --noEmit"`, `"test": "vitest run"` (nach 1.4), vorerst `"test": "echo no tests yet"`.
  2. `ci.yml`: on `pull_request` + `push: main`, Node 22, `npm ci`, dann `npm run typecheck && npm run lint && npm run build && npm test`. Cache `~/.npm` + `.next/cache`.
  3. Branch-Protection auf `main`: „require status checks" = `ci`.
  4. Concurrency-Group pro Branch (alte Läufe canceln).
- **Akzeptanz:** PR mit absichtlichem TS-Fehler wird rot geblockt. Grüner PR merged. Laufzeit < 8 min.
- **Agent:** `platform-architect`. **Aufwand:** S–M. **Risiko:** niedrig. **Abhängt von:** —
</details>

---

## PHASE 1 — Fundament modernisieren

### ✅ Operation 1.1 — React 19 Upgrade — **ERLEDIGT (2026-09-03, Preview bestätigt)**
`react`/`react-dom` → 19.2.8, `@types/react*` → 19. **Kein Codemod nötig** — `tsc --noEmit`
lief sofort mit **0 Fehlern** (Codebase nutzt keine `React.FC`/`JSX.Element`-Namespace-Altlasten,
`useRef`-Calls haben schon Argumente). `framer-motion@12.40` deklariert React 19 explizit im peer.
Build + Lint + 78 Tests grün. `reactStrictMode` bleibt an.
**Rest-Haken (Mensch):** einen Netlify-Preview-Deploy durchklicken — Advisor-Stream, DogPassPopup,
ExitIntent, SupportChat, Preis-Wecker-Formular, `/rassen`, ein `/rasse/[slug]` — auf React-19-
Konsolen-Warnings / Hydration-Fehler achten. Dann von 🟡 auf ✅.
<details><summary>ursprünglicher Plan</summary>

- **Ziel:** Auf die von Next 16 unterstützte Basis. React 19.2 + `react-dom` 19.2 + Typen.
- **Warum:** T1. Supportbasis, Bugfixes, und die Tür zu `useOptimistic`/`use()`/`<form>`-Actions für den Advisor- und Preis-Wecker-Flow.
- **Dateien:** `bella-app/package.json`, `@types/react*`, potentiell jede `"use client"`-Komponente mit veraltetem Pattern.
- **Vorgehen:**
  1. `npm i react@^19.2 react-dom@^19.2 && npm i -D @types/react@^19 @types/react-dom@^19`.
  2. `npx types-react-codemod@latest preset-19 ./src` (JSX-namespace, `ref`-as-prop, `useRef`-Argument-Pflicht).
  3. `framer-motion` → aktuelle `motion`-Version gegen React 19 prüfen; wo Animation trivial ist, gegen CSS (`@starting-style`, View Transitions) tauschen (siehe D3/1.x).
  4. Voller Klick-Test: Advisor-Stream, DogPassPopup, ExitIntent, SupportChat, Preis-Wecker-Formular, `/rassen`, ein `/rasse/[slug]`.
  5. `reactStrictMode` bleibt an — Doppel-Effekte-Regressionen fixen statt Strict-Mode aus.
- **Akzeptanz:** `npm run build` + `typecheck` + `lint` grün. Keine React-19-Konsolen-Warnings auf Home/`/rassen`/`/rasse/[slug]`/Advisor. Vitals nicht schlechter. Ein Preview-Deploy manuell durchgeklickt.
- **Agent:** `platform-architect`. **Aufwand:** M–L. **Risiko:** mittel. **Abhängt von:** 0.2, 0.4.
</details>

### ✅ Operation 1.2 — CSP + COOP — **WEG B ERLEDIGT (2026-09-03, Prod bestätigt)**
`next.config.ts`: `Content-Security-Policy` für `/(.*)` — `default-src 'self'`, `object-src 'none'`,
`base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'self'`, `frame-src 'none'`,
`upgrade-insecure-requests`; `script-src` + `style-src` mit `'unsafe-inline'` (Next/Tailwind);
`img-src 'self' data: blob: https:` (AWIN-Händler-Bilder); GA (`googletagmanager` / `*.google-analytics.com`)
in script/connect erlaubt. `Cross-Origin-Opener-Policy: same-origin-allow-popups`. Toter
`pagead2.googlesyndication.com`-Prefetch raus. Build grün, CSP-Header per `next start` + curl verifiziert.
**Offen (Folgeschritt):** `'strict-dynamic'` + Nonce/Hash für den Lighthouse-Audit „CSP wirksam gegen XSS"
— bewusst zurückgestellt, weil Nonce-Middleware die SSG-Seiten dynamisch machen würde.
<details><summary>ursprünglicher Plan</summary>

- **Ziel:** Lighthouse „CSP ist wirksam gegen XSS" bestanden, COOP gesetzt, keine `unsafe-inline`-Skripte.
- **Warum:** T2. Aktuell 0 CSP; `ARCHITECTURE.md` behauptet das Gegenteil.
- **Dateien:** neu `src/middleware.ts` (Nonce), `next.config.ts` (Header), `netlify.toml` (Fallback-Header), `layout.tsx` (Nonce an Inline-`<script type="application/ld+json">` + `GoogleAnalytics`/`WebVitals`).
- **Vorgehen:**
  1. Middleware erzeugt pro Request eine Nonce, setzt `Content-Security-Policy` mit `script-src 'self' 'nonce-…' 'strict-dynamic'; object-src 'none'; base-uri 'none'; frame-ancestors 'self'; …` und reicht sie via Header/`headers()` an RSC weiter.
  2. Alle 21 `dangerouslySetInnerHTML`-JSON-LD-Stellen auf einen `<JsonLd nonce>`-Helfer (siehe C6/4.6) umstellen.
  3. `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy: same-site`, `X-Frame-Options` → durch `frame-ancestors` ersetzt, aber als Legacy behalten.
  4. Prüfen, dass Netlify-Image-Optimierung, GA (lazyOnload) und `/api/vitals` weiter funktionieren; `report-uri`/`report-to` auf `/api/csp-report` (nur loggen).
  5. Trade-off bewerten: Nonce-Middleware macht Seiten dynamisch. Prüfen, ob eine **statische** CSP mit Hash-Liste für die wenigen Inline-Skripte reicht (bevorzugt, hält SSG). Wenn ja: dieser Weg.
- **Akzeptanz:** Lighthouse BP = 100, „CSP evaluiert" grün. `curl -I` zeigt CSP + COOP. Kein Funktionsbruch auf Home/Advisor/`/rassen`. SSG-Seitenzahl im Build unverändert (falls Hash-Weg) oder bewusst dokumentiert (falls Nonce-Weg).
- **Agent:** `platform-architect` + `trust-compliance` (Freigabe). **Aufwand:** M. **Risiko:** mittel (kann Seiten dynamisch machen / Skripte brechen). **Abhängt von:** 1.1 empfohlen.
- **Nach-Deploy prüfen:** Seite lädt normal (kein CSP-Block in der Konsole), GA feuert, Bilder laden. Lighthouse BP.
</details>

### 🟡 Operation 1.3 — Rate-Limit + Herkunftsprüfung — **GRUNDSCHUTZ LIVE (2026-09-03)**
Umgesetzt: `src/lib/rate-limit.ts` — In-Memory-Sliding-Window pro IP (Modul-Scope, hält auf warmer
Node-Instanz), zwei Fenster (15/min + ~150/h) auf `/api/advisor/chat` **und** `/api/support/chat`,
`429` mit `Retry-After`. `checkSameOrigin`: fremde `Origin`/`Referer` → `403`, fehlender Header
(curl/S2S) durchgelassen. 10 Unit-Tests. Ohne Redis, ohne neue Infra.
**Offen:** verteilter Store (Upstash Redis / Netlify Blobs) für globales Limit über Instanzen,
`ai_usage`-Kosten-Logging (Tokens/Modell), `AbortController`-Durchreichung. Kein `src/middleware.ts`
nötig gewesen — Limit sitzt in den Node-Route-Handlern (Edge-Middleware hätte keinen persistenten Zustand).
<details><summary>ursprünglicher Plan</summary>

- **Ziel:** `/api/advisor/chat` & andere teure Routen sind gegen Missbrauch/Kostenexplosion geschützt.
- **Warum:** T3. Zwei LLM-Calls pro Request, ungedrosselt, von überall.
- **Dateien:** `src/middleware.ts` (aus 1.2), neu `src/lib/rate-limit.ts`, `src/app/api/advisor/chat/route.ts`.
- **Vorgehen:**
  1. Rate-Limit pro IP: `/api/advisor/*` z.B. 20/min + 200/Tag, restliche `/api/*` 60/min. Speicher: Netlify-kompatibel — **Upstash Redis** (REST) oder Netlify Blobs; In-Memory als Dev-Fallback.
  2. `Origin`/`Referer`-Check gegen `SITE_URL` für POST-Routen; `429` mit `Retry-After` als JSON.
  3. Kurzes serverseitiges Kosten-Logging (Tokens/Modell) pro Advisor-Request in eine `ai_usage`-Tabelle (Migration, nicht `CREATE TABLE IF NOT EXISTS`).
  4. `maxDuration`/Abbruch: Client-`AbortController` serverseitig respektieren, Stream sauber schließen.
- **Akzeptanz:** 25 schnelle Requests → ab #21 `429`. Fremd-`Origin`-POST → `403`. `ai_usage` füllt sich. Normale Nutzung unbeeinträchtigt.
- **Agent:** `platform-architect`. **Aufwand:** M. **Risiko:** mittel (Redis-Abhängigkeit / false positives). **Abhängt von:** 1.2.
</details>

### ✅ Operation 1.4 — Test-Fundament — **ERLEDIGT (2026-09-04)**
Stand: **118 Vitest-Tests** + 2 DB-Evals (2A.8/2.4, `skipIf`) + 1 LLM-Judge-Eval (opt-in),
alle im **Netlify-Build** (`npm run ci`) blockierend. **5 Playwright-Smoke**
(`e2e/smoke.spec.ts`) + Visual (`e2e/visual.spec.ts`) laufen **manuell gegen eine URL**
(`E2E_BASE_URL=… npm run test:e2e`), nicht im Build. Vitest 3 + v8-Coverage,
`vitest.config.ts`, `test`/`test:watch`/`test:coverage` Scripts. Unit-Tests decken u. a. ab:
`containsAllergen`/`allergenVariants` (Allergen-Sicherheit),
`consumption-math`, `dogCost`, `issue-to-problem`, `glossary-links` — und `parseIntent` + `scoreFood`
+ `hasEnoughIntent`/`classifyTheme`/`computeConfidence` **nach Extraktion** aus `route.ts` in
`src/lib/advisor/{intent,scoring}.ts` (verbatim, Verhalten unverändert → macht Op 2.1 sicher).
**Offen:** Playwright-Smoke (Home / `/rassen` / ein `/rasse/[slug]` / Advisor-Happy-Path / robots+sitemap)
— eigener Schritt, weil es Browser-Download im CI braucht.
<details><summary>ursprünglicher Plan</summary>

- **Ziel:** Die gefährliche Logik ist abgedeckt, bevor sie umgebaut wird.
- **Warum:** T4. Allergen-Ausschluss ist tier-sicherheitsnah und hat null Netz.
- **Dateien:** neu `vitest.config.ts`, `playwright.config.ts`, `src/**/*.test.ts`, `e2e/*.spec.ts`, `package.json`.
- **Vorgehen — Unit zuerst (reine Funktionen):**
  - `parseIntent` — 20+ Fälle: „Hühnerallergie" → `protein: Huhn` + `sensitive`; NFD-Umlaute; Budget „unter 5€/kg"; Rasse-Erkennung; „Welpe" vs. „ist dein Hund ein Welpe?" (nur User-Turns).
  - `scoreFood` / Kandidaten-Ranking — Allergen wird **nie** in Top-3, Marken-Vielfalt, Budget-Penalty.
  - `containsAllergen` (`@/db/queries/crosssell`) — Huhn ⇒ Geflügel/Hähnchen.
  - `dailyGrams` / `monthlyEuro` (`consumption-math`) — bekannte RER-Werte.
  - `extractPricePerKg`, Slug-Generierung, `findGlossaryLinks`, `issueToProblemSlug`.
  - `getBreedsSlim`, Breed-Alias-Redirects.
- **Vorgehen — Playwright-Smoke (gegen `next build && next start`):**
  - Home rendert, kein Konsolen-Error. `/rassen` zeigt Bilder. Ein `/rasse/[slug]` rendert Hero + FAQ. Advisor: Nachricht senden → Stream kommt → am Ende `OFFERS`. `robots.txt`/`sitemap.xml` `200`.
- **Akzeptanz:** `npm test` grün, in `ci.yml` verdrahtet. Kernmodule aus 1.x haben Tests **vor** ihrem Umbau. Coverage-Report existiert (Ziel iterativ ≥ 60 % der `src/lib` + Advisor-Logik).
- **Agent:** `platform-architect` + `bella-advisor` (Advisor-Fälle). **Aufwand:** L. **Risiko:** niedrig. **Abhängt von:** 0.4.
</details>

### ✅ Operation 1.5 — Drizzle-Migrationen statt Laufzeit-DDL — **ERLEDIGT (2026-09-03)**
`CREATE TABLE IF NOT EXISTS chat_logs` (einziges Laufzeit-DDL im Repo) aus `route.ts` entfernt.
`chatLogs` als Drizzle-Tabelle in `schema.ts`. `drizzle/0000_baseline.sql` (16 Tabellen) + snapshot/journal
generiert. `drizzle/README.md` erklärt die Baseline-Situation (Prod-DB existiert schon → nicht blind
`migrate`). Scripts `db:generate` / `db:migrate` / `db:push`. `grep "CREATE TABLE" src` = 0.
<details><summary>ursprünglicher Plan</summary>

### Operation 1.5 — Drizzle-Migrationen statt Laufzeit-DDL
- **Ziel:** Schema-Änderungen sind versioniert und reviewbar.
- **Warum:** T5. `CREATE TABLE IF NOT EXISTS` im Request-Pfad ist eine Zeitbombe (Race, Latenz, stille Divergenz).
- **Dateien:** neu `bella-app/drizzle/` (SQL), `drizzle.config.ts`, `src/app/api/advisor/chat/route.ts` (`logChat`), evtl. weitere Routen mit demselben Muster (`grep -rn "CREATE TABLE IF NOT EXISTS" src`).
- **Vorgehen:**
  1. `chat_logs`, `ai_usage` (aus 1.3) als Drizzle-Tabellen ins `schema.ts`.
  2. `npx drizzle-kit generate` → SQL committen. Einmalig `drizzle-kit migrate` gegen Neon (oder GH-Action mit `DATABASE_URL`-Secret).
  3. Alle Laufzeit-DDL aus dem Code entfernen.
  4. Optional CI-Job: `drizzle-kit check` gegen die Migrationen (Drift-Detektor).
- **Akzeptanz:** `grep -rn "CREATE TABLE" src` = 0. `drizzle/`-Ordner mit nummerierten SQL-Files committet. Advisor-Logging funktioniert weiter.
- **Agent:** `platform-architect`. **Aufwand:** S–M. **Risiko:** niedrig. **Abhängt von:** —
</details>

### ✅ Operation 1.6 — Font-Bug + tsconfig — **ERLEDIGT (2026-09-03)**
`next/font/google` Inter (`variable: "--font-inter"`, `display: "swap"`, self-hosted zur Build-Zeit →
CSP-sicher) in `layout.tsx`, `className={inter.variable}` auf `<html>` — `globals.css` referenzierte
`--font-inter` schon, jetzt ist es gesetzt. `tsconfig.json` `target` → `ES2022`. typecheck + build grün.
<details><summary>ursprünglicher Plan</summary>

- **Ziel:** Die Seite rendert in der Font, die das Design meint; TS-Output ist modern.
- **Dateien:** `src/app/layout.tsx`, `src/app/globals.css`, `tsconfig.json`.
- **Vorgehen:**
  1. `next/font` (self-hosted, z.B. `next/font/google` Inter mit `display: "swap"`, `variable: "--font-inter"`) im `layout.tsx`, `className={inter.variable}` auf `<html>`. Alternativ bewusst auf System-Font-Stack committen und `var(--font-inter, …)` aus `globals.css` entfernen — aber nicht den Zwischenzustand lassen.
  2. `tsconfig.json`: `target` → `ES2022`, `lib` → `["dom","dom.iterable","ES2022"]`. Build + typecheck.
- **Akzeptanz:** DevTools „Computed → font-family" zeigt Inter (oder die bewusste Entscheidung ist im Code eindeutig). `target: "ES2022"`. Build/typecheck grün. LCP nicht schlechter (Font `swap` + Preload).
- **Agent:** `visual-designer` + `platform-architect`. **Aufwand:** S. **Risiko:** niedrig. **Abhängt von:** —
- **Nach-Deploy prüfen:** DevTools „Computed → font-family" auf welches-hundefutter.today zeigt „Inter"; LCP im PageSpeed nicht schlechter.
</details>

---

## PHASE 2 — BELLA-Intelligenz auf das nächste Level

### ✅ Operation 2.1 — Intent: Fast-Path + LLM-Ergänzung — **ERLEDIGT (2026-09-03)**
- **`src/lib/advisor/breed-match.ts`** — Rasse-Erkennung aus `@/data/breeds.ts` (Name +
  `alternativeNames` + slug-als-Worte, längster Match zuerst, + kleine Kurzform-Map für
  „Schäferhund/Retriever/…"). Die 180-Zeilen-Kopie in `intent.ts` ist **gelöscht**.
  `intent.breed` = kanonischer Name, neu `intent.breedSlug` → koppelt den Futter-Pass korrekt an `dog_breeds.slug`.
- **`src/lib/advisor/schema.ts`** — Zod-`dogIntentSchema` + `coerceIntent()` (verträgliches Parsen der LLM-Ausgabe).
- **`src/lib/advisor/intent-llm.ts`** — Gemini 2.5 Flash JSON-Modus (`responseSchema`), 4 s-Timeout,
  env-abschaltbar (`ADVISOR_LLM_INTENT=0`), jeder Fehler → `{}`.
- **`src/lib/advisor/merge.ts`** — `mergeIntent(fast, llm)`: Fast-Path gewinnt, LLM füllt Lücken,
  **`sensitive`/`grainFree` = ODER** (Sicherheitssignal geht nie verloren), Budget = strengerer Wert.
- **`route.ts`**: LLM-Pfad läuft **nur** wenn Fast-Path < 3 Signale **und** Verlauf vorhanden — sonst 0 Zusatz-Latenz.
- **+12 Tests** (`breed-match` 6, `merge` 6). Suite 90 grün. typecheck + lint + build grün.
- **Offen (→ Op 2.4):** Eval-Suite, die die LLM-Ergänzung gegen feste Szenarien misst; `ai_usage`-Logging (→ Op 1.3-Rest).
<details><summary>ursprünglicher Plan</summary>

- **Ziel:** Robuste, erweiterbare Intent-Erkennung; die 180-Rassen-Regex-Kopie stirbt.
- **Warum:** T6. Regex skaliert nicht auf natürliche Formulierungen und ist nicht sauber testbar.
- **Dateien:** `src/app/api/advisor/chat/route.ts`, neu `src/lib/advisor/intent.ts`, `src/lib/advisor/schema.ts` (Zod), Tests aus 1.4.
- **Vorgehen:**
  1. Zod-Schema `DogIntent` (Lebensphase, Futtertyp, sensitiv, Protein/Allergen, Rasse-Slug, Budget, aktuelles Futter, Wechselgrund, Konfidenz).
  2. **Fast-Path:** billige deterministische Regeln für die eindeutigen Fälle (Slug-Match gegen `@/data/breeds.ts` — **eine** Quelle —, „unter X €/kg", explizite Futtertyp-Wörter).
  3. **LLM-Path:** wenn Fast-Path unsicher, Gemini/Claude mit `responseSchema`/Tool-Use auf die letzten N Turns → strukturierter Intent. Kein Freitext.
  4. Merge Fast-Path ⊕ LLM, Konflikte zugunsten des sicheren Wertes (Allergie gewinnt).
  5. `BREEDS`-Array aus der Route **löschen**, aus `breeds.ts` ableiten.
- **Akzeptanz:** Alle `parseIntent`-Tests aus 1.4 grün + 10 neue „natürliche Sprache"-Fälle. Keine Rassen-Liste mehr in `route.ts`. Latenz-Budget: Fast-Path 0 ms, LLM-Path nur wenn nötig, gemessen in `ai_usage`.
- **Agent:** `bella-advisor`. **Aufwand:** L. **Risiko:** mittel (Latenz/Kosten). **Abhängt von:** 1.4, 1.3.
</details>

> ⚠️ **2.1 hat einen kritischen Fall NICHT gelöst.** Prod-Test 2026-09-03: allergischer Hund
> („huhn" als Antwort auf die Allergiefrage) bekam Huhn-Futter empfohlen, weil `sensitive` nie
> gesetzt wurde und „Huhn" als *Wunsch*-Protein geboostet wurde. Vollständiges Audit:
> `docs/audits/2026-09-03-bella-chat-audit.md`. **Phase 2A** behebt das — Vorrang vor 2.2 ff.

---

## PHASE 2A — ADVISOR-NOTFALL (Allergen-Sicherheit + „nichts kaufbar")

> Ausgelöst durch das Audit vom 2026-09-03. Jede Operation atomar, jede mit einem
> Eval-Szenario. **Nicht-verhandelbar: kein Produkt mit einem gemiedenen Protein darf je
> in der `OFFERS:`-Payload landen — abgesichert per blockierendem CI-Test.**

### ✅ Operation 2A.1 — Allergen `avoidProtein` — **ERLEDIGT (2026-09-03)**
`DogIntent.avoidProtein?: string[]` (getrennt von `protein`). `parseIntent`: `PROTEIN_KEYS` auf
Modul-Ebene (geteilt), Symptom-Trigger stark erweitert (`haut/fell/haarausfall/schuppen/hotspot/
pfoten lecken/ohrenentz/erbrech` → `sensitive`), `askedAboutAllergy` aus dem letzten Assistenten-Turn,
Allergen-Erkennung: explizite Meide-Phrasen (`ohne/kein X`, `allergisch gegen X`, `verträgt kein X`,
`X-allergie`) **+ bloßes Protein als Antwort auf die Allergiefrage**. Bei Treffer: `avoidProtein` gesetzt,
`sensitive=true`, Protein aus `protein` entfernt (`avoidProtein` gewinnt). `intentSignalCount` +
`computeConfidence` zählen `avoidProtein`. **Bonus-Fix:** „ausgewachsen" → `lifePhase: adult` (Regex kannte
nur `adult|erwachsen`). **+6 Tests inkl. exaktem Transkript-Fall.** Suite 96 grün.
<details><summary>ursprünglicher Plan</summary>

- **Ziel:** „Dieses Protein ist der Feind" ist ein von „Wunsch-Protein" getrenntes Feld.
- **Dateien:** `src/lib/advisor/intent.ts`, `intent.test.ts`.
- **Vorgehen:**
  1. `DogIntent`: neu `avoidProtein?: string[]` (Allergene). `protein` bleibt = *Präferenz*.
  2. `parseIntent`: Allergie-Kontext erkennen → `avoidProtein` + `sensitive`. Trigger stark erweitern:
     „ohne/kein X", „allergisch auf/gegen X", „verträgt kein X", „reagiert auf X", „unverträglich",
     **bloßes Protein, wenn der letzte Assistenten-Turn nach Allergien/Zutaten fragte**,
     Symptome (`fell`, `haut`, `haarausfall`, `schuppen`, `juckt`, `juckreiz`, `pfoten lecken`,
     `ohren(entzündung)`, `hotspot`, `durchfall`, `erbrechen`) → `sensitive`.
  3. Ein Protein nie gleichzeitig in `protein` **und** `avoidProtein` — `avoidProtein` gewinnt.
- **Akzeptanz:** Test mit der exakten Transkript-Sequenz: `avoidProtein` enthält „Huhn", `sensitive` true,
  `protein` enthält NICHT „Huhn". `intentSignalCount` zählt `avoidProtein` als Signal.
- **Agent:** `bella-advisor`. **Aufwand:** M. **Risiko:** niedrig. **Abhängt von:** —
</details>

### ✅ Operation 2A.2 — SQL-Hard-Ausschluss + Snack-Guard — **ERLEDIGT (2026-09-03)**
- **`src/lib/advisor/allergens.ts`** (neu): `allergenVariants` (erweitert), `containsAllergen`,
  `containsAnyAllergen(text, avoidProtein[])`, `allergenLikePatterns(avoidProtein[])` → `%variante%`.
  `crosssell.ts` re-exportiert die alten Namen (Import-Kompat).
- **`fetchCandidates`**: `type <> 'snack'` + `category NOT IN ('snack','oel','nem','versicherung','zubehoer')`.
  Bei `avoidProtein`: `WHERE (protein IS NULL OR NOT (lower(protein) LIKE ANY($p))) AND NOT (lower(name) LIKE ANY($p))`.
  Pool `LIMIT 40 → 120`. Post-Fetch-Filter jetzt über `containsAnyAllergen` + `avoidProtein`.
- **`getCompanions`**: `CompanionContext.allergen` → `avoidProteins: string[]`; SQL-`LIKE ANY`-Ausschluss;
  **`OR category IN ('snack','zeckenschutz')` entfernt** (Audit C7 — „Kettenanhänger" als Zeckenschutz).
- **`mergeIntent`**: `avoidProtein` = Vereinigung beider Quellen, kollidierendes Wunsch-Protein entfernt.
- **+10 Tests** (`allergens` 8, `merge` +2). Suite 106 grün. typecheck + lint + build grün.
- **Grenze:** kein Zutaten-Level (keine `ingredients`-Spalte) — Ausschluss über `protein` + `name` + `category`.
<details><summary>ursprünglicher Plan</summary>

- **Ziel:** Kein gemiedenes Protein kommt aus der DB zurück; kein Snack als Hauptfutter.
- **Dateien:** `src/app/api/advisor/chat/route.ts` (`fetchCandidates`), `src/db/queries/crosssell.ts`, `src/lib/advisor/allergens.ts` (aus `allergenVariants` extrahiert), Tests.
- **Vorgehen:**
  1. `fetchCandidates`: bei `avoidProtein.length` → `WHERE`-Bedingungen mit `allergenVariants`:
     `(protein IS NULL OR protein NOT ILIKE ALL(...))` **und** `name NOT ILIKE ALL(...)`.
  2. `AND type <> 'snack' AND category IS DISTINCT FROM 'snack'` für Hauptfutter.
  3. Den `protein ILIKE`-**Boost** deaktivieren, wenn dieses Protein in `avoidProtein` ist.
  4. Pool vor JS-Dedupe/Rank vergrößern (`LIMIT 40 → 120`), damit der Ausschluss nicht aushungert.
  5. Post-Fetch `containsAllergen` über `name + protein` bleibt als zweite Sicherung.
  6. Cross-Sell (`getCompanions`): `OR category IN ('snack','zeckenschutz')` streichen — nur echte
     `companion_for`-Treffer; Allergen-Ausschluss identisch.
- **Akzeptanz:** Unit-Test der SQL-Kondition-Bauer; Integrationstest (falls `DATABASE_URL` im CI):
  Query mit `avoidProtein:['Huhn']` liefert 0 Zeilen mit „huhn/hühn/hähnchen/geflügel/chicken/poultry"
  in `name`/`protein`; keine `type='snack'`.
- **Agent:** `bella-advisor` + `platform-architect`. **Aufwand:** M. **Risiko:** mittel (SQL). **Abhängt von:** 2A.1.
</details>

### ✅ Operation 2A.3 — Sicherheitsnetz — **ERLEDIGT (2026-09-03)**
- **`fetchCandidates(intent, { relax })`**: `relax` lässt Futtertyp + Budget fallen, hält Allergen-
  Ausschluss + Lebensphase + Snack-Guard. Stream: `offers.length === 0` + weiche Kriterien → **Re-Query**
  (`STEP:widen`).
- **Zwei Sicherheits-Assertions** (`intent.avoidProtein`): (1) direkt nach der Kandidatensuche,
  (2) **direkt vor `emit(OFFERS…)`** — jedes Offer mit einer Avoid-Protein-Variante in `name`/`protein`
  fliegt raus. Was hier greift, setzt `safetyBlocked` → `logChat` prefix `[SAFETY_BLOCKED]`.
- **Leere Offers**: neuer Prompt-Modus „KEINE SICHERE EMPFEHLUNG MÖGLICH" — sag es ehrlich, **empfiehl
  nichts**, biete Neu-Suche (Futtertyp/Budget/Protein) an, behaupte nie der Halter hätte Produkte genannt.
  `fallbackRecommend(offers, intent)` gibt bei 0 Offers die ehrliche „nichts Sicheres ohne {X}"-Antwort.
  Futter-Pass/Preis-Wecker sind schon über `offers.length > 0` gated → bei leer automatisch aus.
- **Bonus (2A.7)**: die erfundenen `ELIM:`-Splits (`* 0.4` „zu teuer", `* 0.25` „nicht allergikergeeignet")
  entfernt — nur noch echter `eliminated`-Count.
- typecheck + lint + build + 106 Tests grün.
<details><summary>ursprünglicher Plan</summary>

- **Ziel:** Sind alle Kandidaten unsicher → BELLA empfiehlt **nichts** und sucht ehrlich neu.
- **Dateien:** `route.ts` (Stream-Ablauf), `fallbackRecommend`, Tests.
- **Vorgehen:**
  1. Nach `fetchCandidates` + Ausschluss: bei `offers.length === 0` → **eine** Re-Query, die
     weiche Kriterien (Budget, `foodType`) fallen lässt, aber Allergen-Ausschluss + Lebensphase
     + Snack-Guard **behält**.
  2. Immer noch 0 → `OFFERS:` mit `[]` + spezifischer Text/Fallback:
     „Ich hab im Katalog gerade nichts Sicheres ohne {X} für einen {Rasse} gefunden. Anderer
     Futtertyp (Nass/BARF) oder größeres Budget?" — **kein** Futter-Pass, **kein** Preis-Wecker.
  3. **Assertion direkt vor `emit(OFFERS…)`**: kein Offer enthält ein `avoidProtein` (Variante).
     Bricht die Assertion → `offers = []` + Leermeldung, `logChat` markiert `safety_blocked`.
- **Akzeptanz:** Eval-Szenario „nur Huhn-Produkte im Pool" → leere Offers + ehrlicher Text, kein Profil.
- **Agent:** `bella-advisor`. **Aufwand:** M. **Risiko:** niedrig. **Abhängt von:** 2A.2.
</details>

### ✅ Operation 2A.4 — Prompt-Framing + Allergie-Signal — **ERLEDIGT (2026-09-03)**
`buildSystemPrompt`: `known` bei `avoidProtein` → „🚫 ALLERGIE — KEIN {X} (Pflicht, nie brechen)".
Produktblock-Kopf: „KATALOG-AUSZUG, den ICH (BELLA) gefunden habe. Der Halter hat KEINE dieser
Produkte genannt — es ist meine Recherche." Neue STRIKTE REGEL: nie behaupten der Halter hätte
Produkte genannt; bei `avoidProtein` eine harte, namentliche Verbots-Regel statt der generischen.
`missing` bezieht `avoidProtein` ein.
<details><summary>ursprünglicher Plan</summary>

- **Ziel:** Der Text-LLM weiß von der Allergie und behandelt den Katalog als *seine* Recherche.
- **Dateien:** `route.ts` `buildSystemPrompt`.
- **Vorgehen:**
  1. `known`: bei `avoidProtein.length` immer „**ALLERGIE — kein {X} (Pflicht)**".
  2. Produktblock-Kopf: „KATALOG-AUSZUG, den ICH gefunden habe (der Halter hat KEINE Produkte genannt)".
  3. Regel: „Passt keins → sag das klar, empfiehl NICHTS, biete Neu-Suche mit anderem Futtertyp/Budget an.
     Behaupte nie, der Halter hätte Produkte genannt."
- **Akzeptanz:** Eval: Antwort erwähnt nie „die Produkte, die du genannt hast"; bei Allergie steht
  das Verbot im Prompt (`known`).
- **Agent:** `bella-advisor`. **Aufwand:** S. **Risiko:** niedrig. **Abhängt von:** 2A.1.
</details>

### ✅ Operation 2A.5 — Futter-Pass nur für sichere Hauptfutter — **ERLEDIGT (2026-09-03)**
`route.ts` Profil-Insert: zusätzlich `offers[0].type !== "snack"` (neben dem schon vorhandenen
`offers.length > 0`-Gate → leere/unsichere Empfehlung erzeugt automatisch **kein** `PROFILE:` /
Preis-Wecker). `dog_profiles.allergies` wird jetzt aus `intent.avoidProtein` befüllt (Array),
nicht mehr aus `intent.sensitive && intent.protein` (das war mit dem Bug immer `null`).
- **Agent:** `bella-advisor` + `lifecycle-architect`. **Aufwand:** S. **Risiko:** niedrig. **Abhängt von:** 2A.3.

### ✅ Operation 2A.6 — LLM-Intent im RECOMMEND — **ERLEDIGT (2026-09-03)**
`route.ts` Gate: LLM-Pfad läuft, wenn `hasEnoughIntent(fastIntent)` (→ gleich Empfehlung) **oder**
`intentSignalCount < 3`. `intent-llm.ts`: `avoidProtein: string[]` im `responseSchema` + im System-Prompt
scharf getrennt (Allergie → `avoidProtein`, Vorliebe → `protein`, im Zweifel `avoidProtein`).
`schema.ts`: `avoidProtein` im Zod-Schema; `coerceIntent` kopiert nur bekannte Keys (kein `.strict()`-Reject
mehr bei Fremdfeldern). `mergeIntent` bildet die `avoidProtein`-Vereinigung (schon aus 2A.2). +3 Schema-Tests.
<details><summary>ursprünglicher Plan</summary>

- **Dateien:** `route.ts` (Gate), `src/lib/advisor/intent-llm.ts`, `src/lib/advisor/merge.ts`, Tests.
- **Vorgehen:**
  1. Gate: `extractIntentLLM` läuft, wenn `ask === false` **oder** `intentSignalCount < 3` (und `llmIntentEnabled()`).
  2. `intent-llm` Schema + Prompt: `avoidProtein: string[]` — „Allergen/Unverträglichkeit → avoidProtein, NICHT protein".
  3. `mergeIntent`: `avoidProtein` = Vereinigung beider Quellen; jedes `protein`, das in der
     gemergten `avoidProtein` steht, wird aus `protein` entfernt.
- **Akzeptanz:** `merge`-Tests für `avoidProtein`-Union + Protein-Bereinigung. Latenz: Empfehlungs-Turn
  + max. 1 zusätzlicher schneller LLM-Call (gemessen, sobald `ai_usage` da ist — Op 1.3-Rest).
- **Agent:** `bella-advisor`. **Aufwand:** M. **Risiko:** mittel (Latenz). **Abhängt von:** 2A.1.

### Operation 2A.7 — Ehrliche Zahlen im Stream
- **Dateien:** `route.ts` (`ELIM:`-Events, Packungsgröße, Studien-Block).
- **Vorgehen:** `ELIM:`-Splits (`* 0.4`, `* 0.25`) streichen — nur echten `eliminated`-Count zeigen.
  Packungsgröße nur anzeigen, wenn plausibel (Hauptfutter ≥ 0,5 kg). Studie nur zitieren, wenn
  `topic_hub` zur primären Sorge passt, max. 1, nie im „ask"-Turn.
- **Akzeptanz:** Kein erfundener Zahlensplit mehr im Protokoll; kein „0,1 kg-Packung"-Hinweis für Snacks.
- **Agent:** `bella-advisor` + `trust-compliance`. **Aufwand:** S. **Risiko:** niedrig. **Abhängt von:** —
</details>

**✅ Op 2A.7 erledigt (2026-09-03):** erfundene `ELIM:`-Splits raus (schon in 2A.3). `intentToHubs`
ohne Default-Hub → ohne konkrete Sorge zitiert BELLA **keine** Studie; `fetchRelevantStudies`
`LIMIT 2 → 1`, nur `evidence_strength = 'hoch'`. Packungs-Reichweite nur bei `packageKg ≥ 0,5`
(kein „0,1 kg"-Unsinn für Snacks — der Snack-Guard aus 2A.2 verhindert das ohnehin schon).

### ✅ Operation 2A.8 — Allergen-Eval (blockierend, echte DB) — **ERLEDIGT (2026-09-03), CI braucht Secret**
Weg **B** (echte Neon-DB, keine Fixtures). `fetchCandidates` + `fetchRelevantStudies` +
`intentToHubs` + `StudyCitation` aus `route.ts` → **`src/lib/advisor/candidates.ts`** ausgelagert
(route.ts orchestriert nur noch, importiert). Neu: **`src/lib/advisor/allergen-eval.test.ts`** —
`describe.skipIf(!DATABASE_URL)`, 6 Szenarien (der Transkript-Fall + „kein Rind" / „verträgt keinen Lachs" /
explizite Allergie / zwei Allergene / Folgeturn „ohne huhn") + Referenz-Test (Katalog nicht leer).
Assertion pro Offer: `containsAnyAllergen(name+protein, avoidProtein) === false`, `type !== 'snack'` —
für die normale **und** die `{ relax }`-Suche. Kein LLM nötig (Fast-Path setzt `avoidProtein` deterministisch).
Die Eval läuft im **Netlify-Build** mit, weil `DATABASE_URL` in den Netlify-Env-Variablen
liegt (`npm run ci` → `vitest run`). Ohne `DATABASE_URL` (z. B. lokal) werden die 7 Eval-Tests
via `describe.skipIf` übersprungen, der Rest läuft normal. **Kein GitHub-Actions-Secret nötig.**
<details><summary>ursprünglicher Plan</summary>

- **Dateien:** `eval/advisor/allergen/*.jsonl`, `eval/run.ts`, `package.json` (`eval:advisor`), `ci.yml`.
- **Vorgehen:** Szenarien: der Schäferhund+Huhn-Verlauf + ~10 Varianten („kein Rind", „verträgt
  Lachs nicht", „allergisch gegen Getreide", nur Symptome „juckt sich ständig", „ohne Huhn bitte").
  Assertions (strukturell, ohne LLM-Judge): `OFFERS`-Payload hat **0** Produkte mit Avoid-Protein-Variante
  in `name`/`protein`; `type` nie `snack`; nichts Sicheres → leere Offers + ehrlicher Text + kein `PROFILE:`.
  Als **blockierender** Teil von `npm run ci` (Netlify-Build) — `DATABASE_URL` ist Netlify-Env;
  ohne DB via `describe.skipIf` übersprungen. `npm run eval:advisor` ist der opt-in LLM-Judge-Lauf.
- **Akzeptanz:** Absichtlich gelockerter Filter → CI rot. Normalzustand grün. Läuft < 60 s.
- **Agent:** `bella-advisor` + `trust-compliance`. **Aufwand:** L. **Risiko:** niedrig. **Abhängt von:** 2A.1–2A.6.
</details>

### ✅ Operation 2A.9 — Doku + README — **ERLEDIGT (2026-09-03)**
`bella-app/ARCHITECTURE.md` Advisor-Ablauf komplett neu (Intent-Fast-Path + LLM, `avoidProtein`,
SQL-Ausschluss, Re-Query, zwei Safety-Assertions, Garantie), „Bekannte Lücken" → „Stand & offene Punkte".
`bella-app/README.md` Advisor-Abschnitt: Härtung nicht mehr „in Arbeit" sondern live beschrieben.
`CLAUDE.md` §2: 2A.1–2A.7 als erledigt, 2A.8 offen. (`CLAUDE.md` §4a Allergen-Garantie stand schon.)

<details><summary>ursprünglicher Plan</summary>

Op 2A.9 — Doku + README aktuell
- **Dateien:** `bella-app/README.md`, `bella-app/ARCHITECTURE.md`, `CLAUDE.md`, `.claude/agents/01-bella-advisor.md`.
- **Vorgehen:** Advisor-Abschnitt in README auf den echten Stand + die Sicherheits-Garantie
  („kein gemiedenes Protein je in den Offers, CI-abgesichert"). ARCHITECTURE: `avoidProtein`,
  SQL-Hard-Filter, Re-Query, Safety-Assert im Stream-Ablauf. `CLAUDE.md` §4/§2: Allergen-Garantie
  als harte Regel. Agent-Datei: `avoidProtein`, Safety-Gate, Eval-Pflicht.
- **Akzeptanz:** README behauptet nichts, was der Code nicht hält. `grep` „Allergie-Logik" in README zeigt
  die verifizierte Formulierung.
- **Agent:** `content-engineer`. **Aufwand:** S. **Risiko:** niedrig. **Abhängt von:** 2A.1–2A.8.
</details>

---

### ✅ Operation 2.2 — Modell-Routing — **ERLEDIGT (2026-09-03)**
`src/lib/advisor/models.ts` — `planModels(ask)`: **Frage-Turn** = `gemini-2.5-flash` (thinking 0) /
`claude-haiku-4-5`, kurzes Token-Budget, 12 s-Timeout. **Empfehlungs-Turn** = `gemini-2.5-flash`
mit **Thinking an** (`thinkingBudget 640` → Produkte abwägen, Warnungen beachten) / Fallback
**`claude-sonnet-5`**, 18 s-Timeout (Worst-Case 2× < `maxDuration 45`). Alles per Env übersteuerbar
(`ADVISOR_REC_GEMINI_MODEL`, `ADVISOR_REC_THINKING`, `ADVISOR_REC_CLAUDE_MODEL`, …) für Kosten-/
Qualitäts-Tuning ohne Deploy. `route.ts` nutzt `plan` statt hartkodierter Modelle.
- **Offen (→ 2.4):** Blind-Bewertung der Qualität, Latenz-/Kosten-Messung (`ai_usage`).
- **Agent:** `bella-advisor`. **Aufwand:** S–M. **Risiko:** niedrig–mittel (Kosten). **Abhängt von:** 1.3.

### 🟡 Operation 2.3 — Stream-Robustheit — **SERVER ERLEDIGT (2026-09-03), Client-Retry offen**
`route.ts`: **Timeout pro Provider** (`withTimeout` via `Promise.race`, aus `planModels`), jeder
Fehler → strukturiertes `console.error("[advisor] … failed", msg)` (Netlify-Function-Logs) statt
stillem `catch { "" }`. Bricht alles → `emit("WARN:degraded")` (der Client ignoriert es heute
gefahrlos, ist aber bereit für einen Retry-Hinweis) + `console.error` „beide Provider ohne Antwort".
Deterministischer Fallback-Text greift wie bisher — nie ein leerer Stream.
- **Offen:** Client-Retry-Chip in `BellaAdvisor.tsx` (763 Z. Client-Komponente), Client→Server
  `AbortController`, echtes Error-Tracking (→ 6.1).
- **Agent:** `bella-advisor` + `platform-architect`. **Aufwand:** M. **Risiko:** niedrig. **Abhängt von:** 6.1 (Tracking) — oder parallel mit `console.error`-Stub.

### ✅ Operation 2.4 — Advisor-Eval-Suite — **ERLEDIGT (2026-09-03)**
`buildSystemPrompt` + `fallbackQuestion`/`fallbackRecommend` → **`src/lib/advisor/prompt.ts`**
(pure move, damit die Eval den echten Prompt nutzt).
- **`advisor-eval.test.ts`** (strukturell, DB-gated, deterministisch → CI-blockierbar): Budget-Adherence
  (jedes €/kg-Offer ≤ Budget), Futtertyp (BARF/Nass → nur dieser `type`), Snack-Guard, Senior ohne
  Welpen-Only, Re-Query ≥ strict, Referenz 1–3 Offers · + Gesprächslogik ohne DB (ask/recommend-Entscheidung).
- **`advisor-judge.test.ts`** (opt-in, `npm run eval:advisor`, braucht `DATABASE_URL` + `GEMINI_API_KEY`
  + `EVAL_JUDGE=1`): 8 Szenarien → `parseIntent → fetchCandidates → buildSystemPrompt → Gemini` → zweiter
  Gemini-Call bewertet gegen Rubrik (faktentreu/konkret/kein_heilversprechen/allergen_sicher/kein_falsches_zitat,
  1–5). Harte Mindest + Ø ≥ 3,5. Strukturelle Allergen-Vorprüfung vor dem Judge.
- **`eval/scenarios.md`**: Katalog mit 35 Szenarien für Judge-Erweiterung + manuelle Prod-QA.
- **Bug gefunden & gefixt durch die Eval selbst:** „frisst sein Futter nicht" wurde nicht als
  Wechselgrund erkannt (Regex zu eng) · 3 starke Signale in Turn 1 lösten keine Empfehlung aus
  (`hasEnoughIntent`: `signals >= 3` statt `>= 3 && userTurns >= 2`).
- **Offen (nice-to-have):** nicht-blockierender CI-Job für den Judge mit PR-Kommentar.
- **Agent:** `bella-advisor` + `conversion-analyst`. **Aufwand:** L. **Risiko:** niedrig. **Abhängt von:** 1.4.

### ✅ Operation 2.5 — Allergen-Gate — **via Operation 2A.8 erledigt (2026-09-03)**
`src/lib/advisor/allergen-eval.test.ts` ist genau dieser Gate: blockierender Test gegen die
echte DB, 6 Szenarien, Assertion „kein `avoidProtein`-Produkt in den Offers, kein Snack" für die
normale **und** die `{ relax }`-Suche. Läuft im **Netlify-Build** (`npm run ci`), weil
`DATABASE_URL` Netlify-Env ist; lokal ohne DB via `describe.skipIf` übersprungen.
<details><summary>ursprünglicher Plan</summary>

- **Ziel:** Kein Deploy, wenn ein Allergiker-Szenario ein verbotenes Protein in den Offers hätte.
- **Dateien:** `eval/advisor/allergen/*.jsonl`, `ci.yml`.
- **Vorgehen:** Teilmenge von 2.4 nur für Allergene, als **blockierender** CI-Check. Deckt Namen-basierten Ausschluss ab (Huhn → „Hühnchen", „Geflügel", „Poulet", zusammengesetzte Produktnamen).
- **Akzeptanz:** Absichtlich gelockerter Filter → CI rot. Normalzustand grün.
- **Agent:** `trust-compliance` + `bella-advisor`. **Aufwand:** S (baut auf 2.4). **Risiko:** niedrig. **Abhängt von:** 2.4.
</details>

---

## PHASE 3 — Design auf das nächste Level

### Operation 3.1 — Ein Token-System (Light + Dark) — 🟡 **TEIL 1 ERLEDIGT (2026-09-03)**
- **Ziel:** Alle Farben/Abstände/Radien kommen aus benannten Tokens; die Seite respektiert `prefers-color-scheme` und hat einen Umschalter.
- **Warum:** D1/D2. Drei Farbwahrheiten + nur Dark = Wartungslast und aus der Zeit.
- **Dateien:** `src/app/globals.css`, neu `src/styles/tokens.css`, `src/lib/theme.ts`, `src/components/ThemeToggle.tsx`, ~8 Komponenten mit hartem Honig-Wert.
- **Vorgehen:**
  1. Semantische Tokens: `--surface`, `--surface-raised`, `--text`, `--text-muted`, `--accent`, `--accent-ink`, `--border`, `--focus` … je für Light und Dark unter `:root` / `:root[data-theme]` / `@media (prefers-color-scheme)`.
  2. `@theme inline` nur noch Tokens referenzieren, keine Rohwerte.
  3. `grep -rn "rgba(240,167,60\|#f0a73c\|#ff8a4c" src` → alle auf Tokens.
  4. `ThemeToggle` (System/Light/Dark, `localStorage`, kein FOUC via Inline-Script im `<head>`).
  5. Kontrast-Audit (D7): `--text-muted` in beiden Modi ≥ 4.5:1.
- **Akzeptanz:** `grep` nach Roh-Honig in `src` = 0. Lighthouse A11y = 100 in beiden Modi. Umschalter ohne Flash. Screenshots Light+Dark von Home/`/rassen`/`/rasse/[slug]`/Advisor.
- **Agent:** `visual-designer`. **Aufwand:** L. **Risiko:** mittel (visuelle Regressionen). **Abhängt von:** 3.4 (visuelle Regression) empfohlen.

**Was jetzt live ist (nicht-brechend — die Live-Seite bleibt byte-identisch Dark):**
- `globals.css`: semantische Token-Ebene ergänzt — `--surface`, `--surface-raised`, `--text`,
  `--text-muted`, `--border`, `--accent`, `--accent-ink`, `--focus`, `--honey-2`, `--amber-glow`,
  `color-scheme`. `:root` = volle Dark-Palette (unverändert). Volle **Light-Palette** unter
  `:root[data-theme="light"]` (bg `#faf7f2`, ink `#201a15`, muted `#6b6259` (4.7:1), honey `#c2650a`,
  accent-ink `#fff`), volle Dark-Neubestätigung unter `:root[data-theme="dark"]`. Jede Farbe hat
  ihren Wert direkt unter `:root` — nie nur im Override. `@theme inline` mappt alle neuen `--color-*`.
- `src/components/ThemeToggle.tsx` — System/Hell/Dunkel, `useSyncExternalStore` liest `localStorage`
  (`bella-theme`), setzt `data-theme` auf `<html>`, reagiert auf andere Tabs, `aria-pressed`.
- `/dev/components` nutzt jetzt durchgängig Tokens + zeigt den `ThemeToggle` + No-FOUC-Inline-Script
  → Light/Dark ist dort verifizierbar, ohne die Live-Seite anzufassen. Sichtbar in `npm run dev`
  oder mit `NEXT_PUBLIC_DEV_PAGES=1` (im Visual-Lauf beim Build gesetzt); Live (Netlify) → 404.
- Grün: `tsc` · `lint` (0 Fehler) · `build` · 113 Vitest.

**Bewusst NICHT gemacht (Teil 2 — eigener Schritt, braucht Linux-Visual-Baselines (`npm run test:visual`)):**
- **Kein** `@media (prefers-color-scheme: light)` — würde für Hell-Nutzer sofort greifen, aber
  ~40 Komponenten hängen noch an hart­codiertem `bg-white/x` · `text-white/x` · `border-white/x`
  · `from-[#08080c]` → die Seite sähe halb-kaputt aus.
- Site-weite Migration `bg-white/x`/`text-white/x`/Roh-Honig → Tokens (Akzeptanz „grep = 0").
- No-FOUC-Script + `ThemeToggle` in `layout.tsx` (aktuell nur `/dev/components`).
- Lighthouse-A11y-Audit Light-Modus, Screenshots Light+Dark der echten Seiten.

### Operation 3.2 — Echtes BELLA-Maskottchen — 🟡 **TEIL 1 ERLEDIGT (2026-09-03)**
- **Ziel:** Eine wiedererkennbare, eigene BELLA — SVG, 3–4 Posen (Idle, „schnüffelt/analysiert", „gefunden!", Fehler/„hm").
- **Warum:** D4. Marke + KI-Bildsuche + Conversion. Ein Emoji ist kein Asset.
- **Dateien:** neu `src/components/bella/BellaMascot.tsx` (+ SVG-Sprites), Einsatz in `BellaAdvisor`, Hero, `DogPassPopup`, 404, Loading-States.
- **Vorgehen:** Stil aufs Design-System (Honig/Dark, wenige Linien). Inline-SVG, `currentColor`/Token-fähig, `prefers-reduced-motion` respektiert. Optional 1 Lottie für den „Analyse"-Moment — nur wenn Budget < 15 KB gz.
- **Akzeptanz:** BELLA erscheint konsistent an ≥ 5 Stellen. Kein Emoji-🐕 mehr als Marken-Element (Deko-Emoji im Fließtext ok). Assets < 20 KB gesamt. Reduced-Motion sauber.
- **Agent:** `visual-designer`. **Aufwand:** L. **Risiko:** niedrig. **Abhängt von:** 3.1 (Tokens).

**Was jetzt live ist:**
- `src/components/bella/BellaMascot.tsx` — **kanonisches** Marken-Maskottchen. Reines SVG,
  KEIN `"use client"`, kein JS → server-renderbar. Posen `idle | sniff | found | hmm`
  (Ohren/Brauen/Mund + Accessoire: Duftspur / Funke / „?"). Honig-Token-Palette mit
  Fallback (Light + Dark), Idle-/Nasen-Animation nur bei `prefers-reduced-motion: no-preference`.
  ~1,8 KB gerendertes HTML pro Instanz. `title`→`role="img"`, sonst `aria-hidden`.
- **Neu: `src/app/not-found.tsx`** — echte, gebrandete 404 (`pose="hmm"`, CTA → Advisor + Start,
  Quick-Links). Vorher: Next-Default.
- **Neu: `src/app/loading.tsx`** — Route-Level-Ladezustand („BELLA schnüffelt …", `pose="sniff"`).
- `DogPassPopup` Avatar, `mein-hund` (Leerzustand + Profil-Avatar-Fallback), `hund/[share_token]`
  Avatar-Fallback → Maskottchen statt `🐕`.
- `/dev/components` zeigt alle 4 Posen. Grün: `tsc` · `lint` · `build` (2373 Seiten) · 113 Vitest.

**Bewusst NICHT gemacht (Teil 2):**
- **Off-brand `BellaCharacter.tsx`** (Indigo/Cyan/Pink-Auren `#6366f1`…) in `BellaExperience`,
  `BellaDecisionUI`, `BellaAdvisor` — auf Token-Palette umfärben ODER durch `BellaMascot`/`Bella`
  ersetzen. Das ist der sichtbarste D4-Verstoß, aber ein eigener visueller Eingriff mit Regressionsrisiko.
- `🐕` in ~40 CTA-Button-Labels (`🐕 BELLA fragen …`) über `src/app/**` — „Deko-Emoji im Fließtext",
  aber grenzwertig als Marken-Element; eigener Sweep.
- Optionales Lottie für den „Analyse"-Moment.
- Reduced-Motion-Screenshot-Prüfung im Visual-Lauf.

### Operation 3.3 — OG-Bild-System pro Rasse (und Kern-Seitentypen) — 🟡 **RASSE ERLEDIGT (2026-09-03)**
- **Ziel:** Jede `/rasse/[slug]` (und Problem/Vergleich/Blog) hat ein eigenes, generiertes Teilen-Bild.
- **Warum:** D5. 186 Rassen teilen sich ein generisches Bild → schwache Social/Chat-Vorschau.
- **Dateien:** neu `src/app/rasse/[slug]/opengraph-image.tsx` (+ analog problem/vergleich), `src/lib/og/*` (Layout-Bausteine), evtl. Rasse-Foto aus `public/breeds/` einbetten.
- **Vorgehen:** `ImageResponse` (Edge), Layout: Rasse-Foto + Name + „Futter-Empfehlung" + BELLA-Maskottchen + Domain. `size`/`contentType` export, `alt`. Fonts via `fetch` einer `.woff`.
- **Akzeptanz:** `/rasse/labrador-retriever/opengraph-image` liefert 1200×630 PNG mit Rasse-Foto + Name. Twitter/Slack/WhatsApp-Vorschau geprüft. Build-Zeit-Impact gemessen (ggf. on-demand statt prebuild).
- **Agent:** `visual-designer` + `content-engineer`. **Aufwand:** M. **Risiko:** mittel (Build-Zeit bei 186). **Abhängt von:** 3.2.

**Ausgangslage (war schon da):** `opengraph-image.tsx` existierte bereits für rasse/problem/
futtertyp/lebensphase/tipps + 2× vergleich — aber **text-only** (`src/lib/og-image.tsx` →
`buildOgImage`), ohne Foto, ohne Maskottchen. Die Roadmap-Prämisse „generisches Bild" war stale.

**Was jetzt live ist:**
- `src/lib/og-image.tsx` — `buildOgImage` nimmt optional `imageUrl` → Split-Layout (Text links,
  Foto-Spalte 430 px rechts mit weichem Verlauf). Statische **BELLA-Marke** (pures Inline-SVG,
  Satori-tauglich — kein `<style>`/Animation) ersetzt das „B"-Kästchen in **allen** OG-Bildern.
- `src/app/rasse/[slug]/opengraph-image.tsx` — bettet das self-hosted Rassefoto ein
  (`localImg` → `${SITE_URL}/breeds/…`, mit Remote-Fallback), Badge/Größen-Label/Name/Claim.
  Verifiziert: `/rasse/labrador-retriever/opengraph-image` → 200 `image/png` 1200×630 mit Foto;
  unbekannte Rasse → 200 text-only (kein 500).
- **Build-Zeit-Risiko gelöst:** `generateStaticParams: () => []` + `dynamicParams` + `revalidate=86400`
  → **kein** Prebuild von 186 Foto-OG-Bildern (Seitenzahl unverändert 2373), on-demand + 24 h Cache.
- `/dev/components` zeigt die Live-OG-Vorschau.

**Offen (Teil 2):** Foto/Maskottchen-Layout auch für `problem`/`vergleich`/Blog (aktuell text-only,
aber günstig & stabil — niedrige Prio). Font via `fetch(.woff)` statt System-Sans. Social-Debugger-
Check (Twitter/Slack/WhatsApp) nach Deploy.

### ✅ Operation 3.4 — Komponenten-Katalog + visuelle Regression — **ERLEDIGT (2026-09-03)**
- **`/dev/components`** (non-prod, `notFound()` in Prod, `noindex`): Farb-Tokens, Typo-Skala, Buttons/Pills,
  `.card`/`.glass`-Flächen, `BreedImg` inkl. Fallback, Advisor-Bubbles — die Baseline für 3.1/3.2/3.5.
- **Playwright** (`@playwright/test` + chromium): `playwright.config.ts` (eigener `next start`-webServer,
  `E2E_BASE_URL` überschreibbar). `e2e/smoke.spec.ts` — 5 Tests, **lokal grün** (Home ohne Konsolen-Fehler,
  `/rassen`-Bilder laden, `/rasse/[slug]` Hero+FAQ, robots/sitemap 200, Advisor antwortet). Scripts
  `test:e2e` / `test:visual`.
- **Update 2026-09-04 — kein GitHub Actions:** Playwright läuft nicht mehr im automatischen
  Gate (Browser im Netlify-Build zu fragil). Smoke + Visual sind **manuelle Läufe gegen eine
  Deploy-Preview-URL** (`E2E_BASE_URL=… npm run test:e2e` bzw. `npm run test:visual`). Der Gate
  selbst (`npm run ci`) enthält typecheck + lint + **Vitest** + build.
- **`e2e/visual.spec.ts`**: `toHaveScreenshot` für Home / `/rassen` / `/rasse/[slug]` /
  `/dev/components`. Linux-Baselines unter `e2e/visual.spec.ts-snapshots/` committen (Windows
  weicht durch Font-Rendering ab). `/dev/components` braucht `NEXT_PUBLIC_DEV_PAGES=1` beim Build.
<details><summary>ursprünglicher Plan</summary>

- **Ziel:** Design-Änderungen sind sichtbar bevor sie live gehen.
- **Dateien:** neu `.storybook/` **oder** eine schlanke `/dev/components`-Route (nur non-prod), Playwright-`toHaveScreenshot` für Kern-Screens.
- **Vorgehen:** Minimal-Katalog für Card, Button, Pill, Advisor-Bubble, FoodCard, BreedImg, Mascot, ThemeToggle. Playwright-Screenshots von Home/`/rassen`/`/rasse/[slug]`/Advisor in Light+Dark, Baseline committen, Diff im CI (nicht-blockierend).
- **Akzeptanz:** `npm run test:visual` erzeugt Diffs. Katalog rendert alle Kernkomponenten in beiden Themes.
- **Agent:** `visual-designer` + `platform-architect`. **Aufwand:** M. **Risiko:** niedrig. **Abhängt von:** 1.4.
</details>

### Operation 3.5 — Motion-Politur — 🟡 **TEIL 1 ERLEDIGT (2026-09-03)**
- **Ziel:** Alle Dauer-Animationen GPU-composited; `framer-motion` nur dort, wo es echten Mehrwert bringt.
- **Dateien:** `src/app/globals.css` (`sheen`), 6 `framer-motion`-Komponenten.
- **Vorgehen:** `sheen` von `background-position` auf `transform: translateX` einer Pseudo-Element-Ebene. `framer-motion`-Audit: triviale Fades/Slides → CSS `@starting-style` + `transition`; komplexe Sequenzen (AnalysisStorm) behalten. View Transitions API für Seitenwechsel prüfen.
- **Akzeptanz:** Lighthouse „nicht zusammengesetzte Animationen" = 0. `framer-motion`-Bundle-Anteil messbar kleiner. Kein sichtbarer Qualitätsverlust.
- **Agent:** `visual-designer`. **Aufwand:** M. **Risiko:** niedrig. **Abhängt von:** 1.1.

**Befund:** Die nicht-zusammengesetzten Animationen (`@keyframes sheen` = `background-position`;
`@keyframes scan-sweep` = `top`/Layout; `.spotlight` = `transition: background-position`) waren
**allesamt tot** — 0 Referenzen im `src` außerhalb `globals.css`. Der ganze „MEISTERWERK-HERO"-
Block (`.tile*`, `.scan*`, `.spotlight`, `.paw-canvas`, `.live-dot`, `.count-shimmer`, `.text-sheen`)
wurde nie gerendert. → Statt zu refactoren: **entfernt**. `globals.css` 257 → 217 Zeilen.
Behalten: `.aurora*`, `.caret`, `.reveal` (alle `transform`/`opacity`, composited, in Benutzung).
Reduced-Motion-Block entsprechend bereinigt. Verifiziert: Build grün, `/`, `/rassen`,
`/rasse/[slug]`, `/hundefutter-test` → 200, 113 Vitest.

**Offen (Teil 2):** `framer-motion`-Audit (6 Komponenten: `AnalysisStorm`, `BellaDecisionUI`,
`BellaExperience`, `MemoryTimeline`, `QuickStartCards`, `UserProfilePanel`) — triviale Fades/Slides
→ CSS, `AnalysisStorm` behalten; Bundle-Anteil messen. View Transitions API für Seitenwechsel.
Lighthouse-Gegenprobe „nicht zusammengesetzte Animationen = 0" nach Deploy.

---

## PHASE 4 — Content & EEAT auf das nächste Level

### Operation 4.1 — Thin-Content-Audit (programmatische Seiten) — 🟡 **TOOL + REPORT ERLEDIGT (2026-09-04)**
- **Ziel:** Jede indexierte Seite hat nachweisbaren Eigenwert; „Scaled Content Abuse"-Risiko raus.
- **Warum:** C1. 1.400+ Tipps + hunderte programmatische Seiten sind ein Google-Helpful-Content-Risiko.
- **Dateien:** neu `scripts/content-audit.mjs` (Report: URL, Wortzahl, Template-Anteil, interne Links, unique Fakten), Ziel-Seitentypen: `/tipps/*`, `/futtertyp/*`, `/lebensphase/*`, `/vergleich/*`, `/stadt/*`, `/glossar/*`.
- **Vorgehen:** Metriken je Seite; Schwellen definieren (z.B. < 350 sinnvolle Wörter **oder** > 70 % Template ⇒ Flag). Optionen pro Flag: anreichern (echte Daten aus DB/Portionsmathematik/Studien), zusammenlegen, oder `noindex` + aus Sitemap. `/stadt/*` (634 Seiten) besonders kritisch prüfen — hat eine Hundefutter-Stadtseite echten Wert?
- **Akzeptanz:** Report committet unter `docs/audits/`. Jede geflaggte Seite hat eine Entscheidung (anreichern/mergen/noindex) mit Umsetzung. Sitemap enthält nur „wertige" URLs.
- **Agent:** `seo-strategist` + `content-engineer`. **Aufwand:** L. **Risiko:** mittel (Index-Änderungen — schrittweise, mit GSC-Monitoring). **Abhängt von:** —

**Was jetzt live ist:**
- `bella-app/scripts/content-audit.mjs` + `npm run audit:content` — misst je URL sinnvolle
  Wortzahl (Chrome/RSC/Loading-Fallback rausgeschnitten), interne Links, Template-Anteil
  (geteilte Sätze zwischen Geschwister-Seiten), `noindex`, Titel. Flag: < 350 W **oder**
  > 70 % Template bei indexierbaren Seiten.
- `docs/audits/2026-09-04-thin-content-audit.md` — 29-URL-Stichprobe über 10 Typen, **Entscheidung
  je Bucket**:
  - ✅ `rasse` / `problem` / `vergleich` / `tipps-artikel` — gesund (460–660 W), keine Aktion.
  - ✅ `stadt/*` — Doorway-`noindex` (< 100 k Einw.) **verifiziert wirksam**; Großstädte bei
    58–60 % Template → beobachten.
  - 🔴 `lebensphase/*` (4) — redaktioneller Body ~150 W → **anreichern** (nicht `noindex`, starke Keywords).
  - 🟡 `futtertyp/*` — 2/3 unter 350 W (DB-Produkttabelle lokal nicht gerendert) → erst DB-Re-Audit, dann ggf. anreichern.
  - 🟡 `tipps-kategorie/*` — inhaltlich reich, aber **102 interne Links/Seite** → Liste kürzen/paginieren.
  - ⚪ `glossar/*` — lokal nur `notFound()` (kein `DATABASE_URL`) → **Re-Audit mit DB** Pflicht.

**Offen (Teil 2):** (1) `npm run audit:content` **mit `DATABASE_URL`** neu, Report ersetzen —
`glossar`/`lebensphase`/`futtertyp` sind ohne DB unterschätzt. (2) `lebensphase/*` anreichern.
(3) `futtertyp/*` gegenmessen. (4) `glossar/*` anreichern vs. Cluster-Merge + `sitemap.ts`
(`GLOSSAR_SLUGS`/`WISSENS_HUBS` aus DB statt Konstante). (5) `tipps-kategorie` Link-Kürzung.

### Operation 4.2 — Tierarzt-Review live schalten
- **Ziel:** `reviewedBy`-Schema aktiv, sichtbares „fachlich geprüft von …" auf den Gesundheits-nahen Seiten.
- **Warum:** C2. Größter EEAT-Hebel. Outreach-Drafts liegen schon (`OUTREACH_SETUP.md`).
- **Dateien:** `src/data/reviewer.ts` (echt befüllen), `src/components/ReviewedBadge.tsx`, `AuthorBox.tsx`, `StructuredData.tsx`.
- **Vorgehen (Code-Teil):** Sobald ein realer Reviewer zusagt: `REVIEWER` mit Name, Qualifikation, Profil-URL füllen; Badge auf `/rasse/*`, `/problem/*`, `/lebensphase/*`, Ratgeber; `reviewedBy` + `lastReviewed` ins Article-Schema. **Off-Page-Teil (Mensch):** Reviewer gewinnen — steht in Phase „Off-Page" unten.
- **Akzeptanz:** `REVIEWER !== null`, Badge sichtbar, Rich-Results-Test zeigt `reviewedBy`. Kein Fake — bis ein echter Reviewer da ist, bleibt es aus.
- **Agent:** `trust-compliance` + `content-engineer`. **Aufwand:** S (Code). **Risiko:** niedrig. **Abhängt von:** externem Reviewer.

### Operation 4.3 — Aktualitäts-Signal überall — 🟡 **KERN ERLEDIGT (2026-09-04)**
- **Ziel:** Jede Content-Seite zeigt „zuletzt geprüft/aktualisiert am" — konsistent, ehrlich, im Schema.
- **Dateien:** ein `<Freshness>`-Component, `dateModified` in allen Article/FAQ-Schemas, Datenquelle: echtes Git-/DB-Datum, nicht `new Date()`.
- **Akzeptanz:** Kein `dateModified: new Date().toISOString()` mehr (das lügt bei jedem Build). Sichtbares Datum auf `/rasse/*`, `/problem/*`, `/tipps/*`, Blog.
- **Agent:** `content-engineer`. **Aufwand:** S–M. **Risiko:** niedrig. **Abhängt von:** 4.6.

**Was jetzt live ist:**
- `scripts/gen-build-date.mjs` (`prebuild`) → schreibt `src/lib/generated-build-date.ts`
  mit `BUILD_DATE` aus `git log -1 --format=%cs` (= Deploy-Datum). Fällt still zurück,
  wenn git fehlt.
- `src/lib/site-dates.ts` — `CONTENT_REVISED` (`"2026-06-01"`, zentral bumpen bei echter
  Textüberarbeitung) + `DATA_REFRESHED` (= `BUILD_DATE`, für datengetriebene Seiten).
- **Akzeptanz erfüllt:** `grep "dateModified:.*new Date()" src` → **0**. Alle 15 Stellen
  migriert — Preis-/Marken-/Katalog-Seiten → `DATA_REFRESHED` (ehrlich, ändert sich je Deploy),
  Ratgeber → `CONTENT_REVISED`.
- `src/components/Freshness.tsx` — sichtbares `<time>`-Signal; als Referenz auf
  `/analyse/methodik` gesetzt.
- Sichtbares Datum auf `/rasse/*`, `/problem/*`, `/tipps/*`, Blog: **schon durch `AuthorBox`**
  („Letzte Prüfung: <time>", auf 29 Seiten).
- Grün: `tsc` · `lint` · `build` (prebuild läuft) · 118 Vitest.

**Offen (Teil 2):** `<Freshness>` breiter auf Tool-/Daten-Seiten ohne `AuthorBox`
(`/tools/*`, `/data/*`, `/widget`). `AuthorBox`-`reviewedAt` je Seitentyp aus einem
echten Datum speisen statt Default. `datePublished` bei `tipps`-Artikeln (aktuell hart
`"2025-01-01"`).

### Operation 4.4 — Interner Cluster-Graph — 🟡 **TOOL + PROBLEM-CLUSTER ERLEDIGT (2026-09-04)**
- **Ziel:** Bewusste Hub→Spoke→Sibling-Verlinkung, die Autorität auf die Money-Keywords bündelt.
- **Warum:** C4. Interne Links sind der stärkste Hebel, den wir allein kontrollieren.
- **Dateien:** neu `src/lib/linking/graph.ts` (Themen-Cluster-Definition), `<RelatedLinks>`-Component, Einsatz in `/rasse/*`, `/problem/*`, `/futtertyp/*`, `/vergleich/*`, `/tipps/*`, Blog.
- **Vorgehen:** Cluster definieren (z.B. „Allergie" = Hub `/problem/allergie` ↔ Spokes: getreidefrei-Futtertyp, Monoprotein, betroffene Rassen, relevante Studien, Vergleich getreidefrei-vs-mit-getreide). Jede Seite: 3–6 kuratierte kontextuelle Links + Breadcrumb. Orphan-Check-Skript.
- **Akzeptanz:** 0 verwaiste indexierbare Seiten (`scripts/link-audit.mjs`). Jede Money-Seite hat ≥ 3 eingehende kontextuelle interne Links. Klick-Tiefe von Home zu jeder Money-Seite ≤ 3.
- **Agent:** `seo-strategist`. **Aufwand:** L. **Risiko:** niedrig. **Abhängt von:** 4.1.

**Was jetzt live ist:**
- `scripts/link-audit.mjs` + `npm run audit:links` — crawlt 59 Money-/Hub-Seiten,
  misst kontextuelle (Chrome-freie) raus-/rein-Links + Klick-Tiefe von `/`. Flags:
  Orphan / dünn (< 3 rein) / Sackgasse (< 3 raus) / tief (> 3).
- `docs/audits/2026-09-04-internal-links-audit.md`.
- **Ursache gefunden:** `/problem/[slug]` verlinkte `PROBLEMS.slice(0, 8)` → hintere
  Slugs verwaist (`leberprobleme` = 0 rein).
- **Fix:** `src/lib/linking/graph.ts` (`PROBLEM_CLUSTER`, 14 kuratierte Listen à 4–7,
  gemischte Zieltypen) + `src/components/RelatedLinks.tsx`, eingesetzt in `/problem/[slug]`.
- **Ergebnis:** `/problem/*` mit < 3 rein: **5 → 0**. Gesamt Orphans 2 → 1, dünn 7 → 4.
  Nebeneffekt: 8/14 `/tipps/*`-Kategorien bekommen erstmals kontextuelle rein-Links.
- Grün: `tsc` · `lint` · `build` · 118 Vitest.

**Offen (Teil 2):** `FUTTERTYP_CLUSTER` + `VERGLEICH_CLUSTER` in `graph.ts`,
`<RelatedLinks>` in `/futtertyp/[slug]` · `/vergleich/[static]` · `/rasse/[slug]` ·
`/lebensphase/[slug]`. Restliche Flags: `/hochwertiges-hundefutter` (Orphan),
`/rassen` (1 rein, Tiefe ∞), `/hundefutter-test` (2), 2 dünne Vergleiche.
Breadcrumb-Konsistenz. `link-audit.mjs` auf `rasse`/`stadt`-Stichprobe erweitern.

### Operation 4.5 — GEO / AI-Search vervollständigen — 🟡 **llms-full.txt ERLEDIGT (2026-09-04)**
- **Ziel:** Für KI-Antwortmaschinen (ChatGPT, Perplexity, Google AI, Claude) maximal zitierfähig.
- **Dateien:** `src/app/llms.txt` → + `llms-full.txt`, „Antwort-zuerst"-Konsistenz-Check über Seitentypen, `robots.ts` (KI-Bots explizit), `bella_summary`-Felder in Studien nutzen.
- **Vorgehen:** `llms-full.txt` mit den 20 wichtigsten Antworten. Jede Money-Seite: erster Absatz = direkte Antwort in 2–3 Sätzen mit Originaldatum/-zahl. Zitierfähige Statistik-Bausteine (`CitableStat`) breiter einsetzen. Bot-Zugriffs-Logging (leichtgewichtig, first-party).
- **Akzeptanz:** `llms-full.txt` erreichbar. Stichprobe 10 Money-Seiten: Absatz 1 beantwortet die Titelfrage eigenständig. Perplexity/ChatGPT-Testfragen zitieren die Domain (manuell, dokumentiert).
- **Agent:** `seo-strategist`. **Aufwand:** M. **Risiko:** niedrig. **Abhängt von:** 4.3.

**Was jetzt live ist:**
- **`src/app/llms-full.txt/route.ts`** — „Answer Engine"-Datei: 20 Kernfragen mit
  direkter 2–3-Satz-Antwort, echter Zahl/Quelle (NRC/FEDIAF/WSAVA) und Zitat-Link je Frage.
  `text/plain`, ISR täglich, Live-Katalogzahl aus DB, Datum aus `DATA_REFRESHED`.
- `/llms.txt` verweist jetzt auf `/llms-full.txt` (llmstxt-Konvention, bidirektionale Discovery).
- `robots.ts` KI-Bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended …) — war schon explizit.
- Verifiziert: `/llms-full.txt` → 200 `text/plain`, 20 Q&A; Build grün, 118 Vitest.

**Offen (Teil 2):** „Antwort-zuerst"-Absatz (2–3 Sätze, eigenständig) als erster Absatz
auf den 10 wichtigsten Money-Seiten (`/problem/*`, `/futtertyp/*`, `/vergleich/*`) —
teils via `.bella-answer`-Selektor schon vorhanden, Konsistenz-Check offen. `CitableStat`
breiter (aktuell 2 Seiten). `bella_summary` aus Studien in `/studien/*` rendern. Leichtes
first-party Bot-Zugriffs-Logging. Perplexity/ChatGPT-Zitat-Stichprobe nach Deploy dokumentieren.

### Operation 4.6 — `<JsonLd>` + `<Freshness>` Schema-Helfer — ✅ **JsonLd ERLEDIGT (2026-09-04)**
- **Ziel:** Ein getesteter Weg, strukturierte Daten auszugeben.
- **Warum:** C6. 21 handgerollte `dangerouslySetInnerHTML` = 21 Fehlerquellen (GSC hatte schon eine).
- **Dateien:** neu `src/components/JsonLd.tsx` (nonce-fähig, typisiert), Migration aller 21 Stellen, Unit-Test „gültiges JSON, kein XSS".
- **Akzeptanz:** `grep -rn "application/ld\+json" src` nutzt nur noch `<JsonLd>`. Rich-Results-Test grün auf Home/`/rasse`/`/rassen`/FAQ/Blog. Nonce aus 1.2 greift.
- **Agent:** `content-engineer` + `platform-architect`. **Aufwand:** M. **Risiko:** niedrig. **Abhängt von:** 1.2.

**Was jetzt live ist:**
- `src/components/JsonLd.tsx` — `<JsonLd data={…} nonce?={…} />` + `serializeJsonLd()`.
  Härtung: `<` → `<` (kein `</script>`-Ausbruch), zirkuläre Refs werfen laut,
  `nonce`-Prop durchgereicht (greift sobald CSP `strict-dynamic` aus 1.2 steht).
- `src/components/JsonLd.test.ts` — 5 Tests: JSON-Roundtrip, `</script>`-Escape,
  Array-Input, `undefined`-Felder, zirkuläre Referenz.
- **Alle 21 handgerollten Stellen migriert** (17 Seiten + `StructuredData.tsx` +
  `ProductSchemaBlock.tsx`). `grep -rn "application/ld+json" src` → nur noch `JsonLd.tsx`.
- Verifiziert: `tsc` · `lint` · `build` · 118 Vitest · Laufzeit-Check (7 Seiten,
  alle `ld+json`-Blöcke parsen, Escaping aktiv).

**Offen:** `<Freshness>`-Component = Deliverable von **4.3** (nicht 4.6). Rich-Results-Test
grün = manuelle Prüfung nach Deploy. Nonce-Aktivierung hängt an 1.2 (CSP `strict-dynamic`).

---

## PHASE 5 — Wachstum & Moat schließen

### Operation 5.1 — Futter-Pass-Schleife schließen (Nachschub → E-Mail → Re-Kauf)
- **Ziel:** Aus dem Einmal-Klick wird wiederkehrender Umsatz. Der Burggraben (`FUTTERPASS.md`).
- **Warum:** G1. `dog_profiles` + `est_bag_days` werden angelegt, aber nichts passiert, wenn der Sack leer wird.
- **Dateien:** `netlify/functions/*` (neuer Scheduled Job „refill-due"), `src/lib/lifecycle.ts`, `src/lib/pack-reach.ts`, `src/lib/email.ts`, `priceAlerts` (mode `refill`), `/hund/[share_token]`.
- **Vorgehen:**
  1. Verbrauchsmathematik verfeinern: `est_daily_grams` × Packungsgröße → `refill_due_at`; Aktivität/Lebensphase einbeziehen.
  2. Scheduled Function: fällige Profile mit bestätigter DOI-E-Mail → „Bello ist in ~5 Tagen durch — hier nachbestellen" (Affiliate-Link zum zuletzt empfohlenen Futter, + 1 kuratierte Alternative/Preis-Check).
  3. Lebensphasen-Trigger: Welpe→Adult, Adult→Senior → „Zeit, das Futter anzupassen".
  4. `/hund/[share_token]`: Steckbrief zeigt Nachschub-Countdown + „jetzt nachbestellen".
  5. Frequenz-Disziplin: max. 1 Nachschub-Mail pro Zyklus, kein Spam (`last_notified_at`).
- **Akzeptanz:** Seed-Profil mit `refill_due_at` in 2 Tagen → nächster Function-Lauf schickt genau eine Mail mit korrektem Link. Lebensphasen-Trigger feuert einmalig. Opt-out in jeder Mail.
- **Agent:** `lifecycle-architect` + `retention-growth`. **Aufwand:** L. **Risiko:** mittel (E-Mail-Reputation, Frequenz). **Abhängt von:** 1.5, 6.1.

### Operation 5.2 — First-Party-Analytics statt GA4 — 🟡 **PIPELINE ERLEDIGT (2026-09-04)**
- **Ziel:** Analytics ohne Fremd-Pixel — prinzipientreu (`CLAUDE.md`: „kein On-Load-Pixel"), DSGVO-leichter, schneller.
- **Warum:** G2. GA4 widerspricht dem eigenen Prinzip und kostet PageSpeed/Consent-Komplexität.
- **Dateien:** `src/app/api/vitals/route.ts` → erweitern zu `/api/track`, `src/components/WebVitals.tsx`, neue `events`-Tabelle (Migration), `GoogleAnalytics.tsx` entfernen, `layout.tsx`.
- **Vorgehen:** Leichtes first-party Beacon (`navigator.sendBeacon`), anonym (kein Cookie, kein PII, IP nur gehasht/verworfen), Events: pageview, advisor_start, advisor_offers, affiliate_click, refill_click, alert_subscribe. Aggregat-Query für ein simples `/admin`-Dashboard. GA4 raus (oder hinter Consent, falls für ein spezifisches Signal nötig).
- **Akzeptanz:** `grep -rn "googletagmanager\|gtag" src` = 0 (oder bewusst hinter Consent). PageSpeed „Drittanbieter" ohne Google-Analytics-Eintrag. Events landen in DB, Dashboard zeigt Funnel.
- **Agent:** `conversion-analyst` + `trust-compliance`. **Aufwand:** M–L. **Risiko:** mittel (Datenkontinuität — Parallelbetrieb 2 Wochen). **Abhängt von:** 1.5.

**Was jetzt live ist (additiv, GA4 bleibt vorerst — 2-Wochen-Parallelbetrieb):**
- `events`-Tabelle in `schema.ts` + Migration **`drizzle/0001_events_analytics.sql`**
  (neue Tabelle, gefahrlos gegen Prod `db:migrate`-bar). Anonym: keine Cookies,
  kein PII, keine IP. `session_id` = kurzlebige sessionStorage-Kennung.
- **`src/app/api/track/route.ts`** — Beacon-Endpoint: Event-Allowlist (6 Namen),
  `props`-Sanitizing (flach, PII-Keys raus, gekappt), Rate-Limit, `device`-Grobklasse.
  Ohne `DATABASE_URL` oder bei Insert-Fehler → 204 (Client nie stören).
- `src/lib/analytics.ts` — `track(name, props?)` via `sendBeacon`, interner Referrer-Pfad.
- `src/components/PageTracker.tsx` (in `layout.tsx`) — `pageview` bei jedem Pfadwechsel.
- Verifiziert: `/api/track` → 204 für valide + ungültige + Müll-Payloads; GET → 405;
  GA4 weiter aktiv. Build grün, 118 Vitest.

**Offen (Teil 2):** Migration in Neon einspielen (`npm run db:migrate`, Mensch).
2 Wochen Parallelbetrieb beobachten. `advisor_start`/`advisor_offers`/`affiliate_click`/
`refill_click`/`alert_subscribe` an den echten Stellen verdrahten (überlappt mit 5.3).
`/admin`-Aggregat-Dashboard. Dann `GoogleAnalytics.tsx` + `googletagmanager`-Prefetch
entfernen → Akzeptanz `grep gtag = 0`.

### Operation 5.3 — Funnel-Instrumentierung Seite→Profil→Klick→Nachschub
- **Ziel:** Wir sehen, wo Nutzer abspringen, und die Signale fließen zurück in Advisor/Cross-Sell/SEO.
- **Dateien:** Events aus 5.2, `src/app/empfehlung/[slug]/route.ts` (Klick-Attribution), Advisor-Route (Offer-Impression), Auswertungs-Query.
- **Vorgehen:** Jede Stufe ein Event mit anonymer Session-Kette. Wochenreport: Conversion je Stufe, je Einstiegs-Seitentyp, je Advisor-Thema. Ableitungen: schwache Rasse-Seiten → `content-engineer`; Themen mit hoher Klick-, niedriger Nachschub-Rate → `lifecycle-architect`.
- **Akzeptanz:** Report `docs/reports/` wöchentlich (halb-automatisch). Mind. eine konkrete Optimierung pro Monat aus den Daten abgeleitet und umgesetzt.
- **Agent:** `conversion-analyst`. **Aufwand:** M. **Risiko:** niedrig. **Abhängt von:** 5.2.

### Operation 5.4 — Outcome-Checks sichtbar machen (Trust-Asset)
- **Ziel:** „Von 128 Haltern mit Allergie-Hund sagten 71 % nach 3 Wochen: besser." — das hat kein Vergleichsportal.
- **Warum:** G4. Die Daten entstehen bereits (`outcome_checks`), werden aber nicht genutzt.
- **Dateien:** Aggregat-Query, `<OutcomeStat>`-Component auf `/problem/*`, `/rasse/*`, `warum-bella`, Methodik-Seite; strikt als „Nutzererfahrung", nie medizinische Aussage (wie `REVIEWER`-Prinzip).
- **Akzeptanz:** Sichtbare, ehrlich gerundete Aggregatzahl mit n und Zeitraum, sobald n ≥ 30 pro Kategorie. Disclaimer „subjektive Halter-Rückmeldung, keine Studie". `trust-compliance`-Freigabe.
- **Agent:** `retention-growth` + `trust-compliance`. **Aufwand:** M. **Risiko:** mittel (Compliance-Formulierung). **Abhängt von:** —

---

## PHASE 6 — Betrieb & Vertrauen

### Operation 6.1 — Error-Tracking + strukturierte Logs
- **Ziel:** Wir erfahren von Fehlern, bevor der Nutzer mailt.
- **Vorarbeit (da):** `netlify/functions/health-check.mts` pingt stündlich die Kernrouten und
  loggt Fehlschläge (`console.error`) ins Function-Log. `not-found.tsx` existiert; `error.tsx`/
  `global-error.tsx` fehlen noch.
- **Dateien:** Sentry (oder OTEL zu einem Collector), Einbindung in `route.ts`-Catches,
  `netlify/functions/*` (inkl. `health-check` → echtes Alert statt nur Log), `error.tsx`/`global-error.tsx`.
- **Vorgehen:** Sentry (Next-SDK, Client+Server+Edge), Sampling, PII-Scrubbing (E-Mails, Hundenamen raus), Release-Tagging pro Deploy. Alerts: Stream-Fehlerrate, Feed-Import-Fehler, Cron-Fehlschlag, 5xx-Spike.
- **Akzeptanz:** Provozierter Fehler erscheint in Sentry mit Stacktrace + Release. Alert-Regeln aktiv. Kein PII in den Events (Stichprobe).
- **Agent:** `platform-architect`. **Aufwand:** M. **Risiko:** niedrig. **Abhängt von:** —

### Operation 6.2 — Performance-Budget im Build
- **Ziel:** Kein Deploy, der die Vitals oder die JS-Bundle-Size über die Schwelle drückt.
- **Dateien:** `netlify.toml` / `package.json` (`ci`-Kette erweitern), `size-limit` + `.size-limit.json`;
  optional ein Netlify-Build-Plugin, das Lighthouse gegen die Deploy-Preview-URL fährt (`onSuccess`).
- **Vorgehen:** `size-limit` auf den First-Load-JS-Bundle in `npm run ci` einhängen (Budget = Baseline
  + 10 %). Lighthouse-Check als Post-Deploy-Schritt (Netlify-Plugin oder `health-check`-Erweiterung)
  auf Home + `/rassen` + ein `/rasse/[slug]`: Perf ≥ 95 (Warn), TBT ≤ 200 ms, CLS ≤ 0.02.
- **Akzeptanz:** Ein Commit, der 100 KB JS hinzufügt, lässt `npm run ci` scheitern → kein Deploy.
  Lighthouse-Report im Netlify-Deploy-Log.
- **Agent:** `platform-architect` + `visual-designer`. **Aufwand:** M. **Risiko:** niedrig. **Abhängt von:** 0.4.

### Operation 6.3 — SECURITY.md, CODEOWNERS, PR-Template, Dependency-Updates
- **Ziel:** Repo-Hygiene wie ein Produkt, nicht wie ein Bastelprojekt.
- **Dateien:** neu `SECURITY.md`, `.github/CODEOWNERS`, `.github/pull_request_template.md`,
  `.github/dependabot.yml`. (`.github/` bleibt nur für diese passiven Meta-Dateien — **keine
  Workflows**.)
- **Vorgehen:** SECURITY.md (Kontakt, Scope, verantwortungsvolle Offenlegung). Dependabot
  wöchentlich, gruppiert, nur für **npm** (keine GH-Actions mehr). Alternativ `npm audit
  --audit-level=high` als weiche Stufe in `npm run ci`. PR-Template mit „`npm run ci` grün?
  Vitals? Offenlegung?"-Checkliste.
- **Akzeptanz:** Alle Dateien da. Erster Dependabot-PR durchläuft den Netlify-Deploy-Preview-Gate.
- **Agent:** `platform-architect` + `trust-compliance`. **Aufwand:** S. **Risiko:** niedrig. **Abhängt von:** 0.4.

### Operation 6.4 — Daten-Backup + Wiederherstellungs-Runbook
- **Ziel:** Neon-Datenverlust ist überlebbar; die Feed-Pipeline hat ein dokumentiertes „so bootstrappst du neu".
- **Dateien:** neu `docs/runbooks/db-restore.md`, `docs/runbooks/feed-bootstrap.md`, ggf. Scheduled Function „daily pg_dump → Netlify Blobs / S3".
- **Akzeptanz:** Ein Restore in eine Scratch-DB wurde einmal real durchgespielt und im Runbook protokolliert. Backup-Job läuft + alertet bei Fehlschlag.
- **Agent:** `platform-architect`. **Aufwand:** M. **Risiko:** niedrig. **Abhängt von:** 6.1.

---

## OFF-PAGE (kein Commit — aber ohne das rummst nichts)

Aus `DEFINITION_OF_DONE.md`, weiterhin gültig und weiterhin der eigentliche Flaschenhals:

1. **Digital PR über Originaldaten (C4).** Preisindex quartalsweise als fertige Pressemitteilung + Grafik an Tier-Magazine, Lokalzeitungen, Pet-Blogger. Die einzige skalierbare Backlink-Quelle für eine Affiliate-Seite.
2. **Tierarzt-Reviewer gewinnen** (entsperrt Operation 4.2).
3. **5 Profil-Rücklinks scharf machen** (Pinterest-Claim, Website-Feld bei LinkedIn/YouTube/X, LinkedIn-Name „Rolf Schwertfechter").
4. **Eigene Produktfotos (F1).** Physische Arbeit, aber der Schlüssel-Differenzierer für Multimodal-/KI-Bildsuche.
5. **AWIN-Programme:** Bewerbungen für weitere Partner (Terra Canis, Wolfsblut, MERA …) laufend nachziehen.

---

# TEIL 4 — REIHENFOLGE

```
Phase 0  ─ 0.1 Doku ┐
                    ├─ parallel ─ 0.2 Toter Code ─ 0.3 Env ─ 0.4 CI-Gate
                    ┘                                          │
Phase 1  ─ 1.4 Tests ◀──────────────────────────────────────┘
             │
             ├─ 1.1 React 19 ─┬─ 1.2 CSP/COOP ─ 1.3 Rate-Limit
             │                └─ 1.6 Font/tsconfig
             └─ 1.5 Migrationen
                        │
Phase 2  ─ 2.1 Intent-LLM ─ 2.2 Modell-Routing ─ 2.3 Stream-Robustheit
             └─ 2.4 Eval-Suite ─ 2.5 Allergen-Gate (blockierend)
                        │
Phase 3  ─ 3.4 Visuelle Regression ─ 3.1 Tokens/Light-Dark ─ 3.2 Maskottchen ─ 3.3 OG-Bilder ─ 3.5 Motion
                        │
Phase 4  ─ 4.1 Thin-Content-Audit ─ 4.6 JsonLd-Helfer ─ 4.3 Freshness ─ 4.4 Cluster-Graph ─ 4.5 GEO ─ (4.2 Vet: sobald Reviewer)
                        │
Phase 5  ─ 5.2 First-Party-Analytics ─ 5.3 Funnel ─ 5.1 Futter-Pass-Schleife ─ 5.4 Outcome sichtbar
                        │
Phase 6  ─ 6.1 Error-Tracking (früh ziehen!) ─ 6.2 Perf-Budget ─ 6.3 Repo-Hygiene ─ 6.4 Backup
```

**Wenn nur DREI Dinge als Nächstes:** `0.1` (Doku entlügen) → `0.4` (CI-Gate) → `1.4` (Tests). Danach ist alles andere sicher machbar.
**Frühzeitig vorziehen, quer zu den Phasen:** `6.1` (Error-Tracking) — je eher, desto mehr blinde Flecken verschwinden.

---

# TEIL 5 — DOKU-LANDKARTE (Soll-Zustand nach Operation 0.1)

| Datei | Rolle |
|---|---|
| `BELLA_NEXT_LEVEL.md` | **Roadmap-SSOT.** Dieses Dokument. Operationen, Reihenfolge, Akzeptanz. |
| `CLAUDE.md` (Root) | **Alltags-SSOT.** Ist-Zustand, harte Regeln, Befehle, Flotte. |
| `.claude/agents/*.md` + `README.md` | **Flotte.** 13 Spezialisten, Delegation. README auf 13 synchron. |
| `bella-app/ARCHITECTURE.md` | **Neu geschrieben.** Echter technischer Aufbau. |
| `README.md` (Root) + `bella-app/README.md` | Öffentliche/Entwickler-Einführung. |
| `FUTTERPASS.md` | Blaupause Futter-Pass-Schwungrad (Phase 5). |
| `docs/` | GEO-Protokoll, Audits, Reports, Runbooks, archivierte Status-Snapshots. |
| ~~`agents.md`~~ | → 15-Zeilen-Wegweiser auf die drei oben. |
| ~~`.github/copilot-instructions.md`~~ | → Constraints + Verweis, keine Migrations-Steps. |
| ~~`bella-app/{AGENTS,Bella_AGENTS,Bella_DECISION_INTELLIGENCE_AGENTS,SEO_AGENTS}.md`~~ | eingepflegt in `.claude/agents/`, dann gelöscht. |
| ~~`bella-app/DEPLOYMENT_DEBUG_REPORT.md`~~ | gelöscht (Zeitpunkt-Artefakt). |
| ~~`bella-app/DEFINITION_OF_DONE.md`~~ | → `docs/status/2026-06-13-…md` (Off-Page-Teil in TEIL 3 „Off-Page" übernommen). |

---

# TEIL 6 — DEFINITION OF DONE (projektweit, ab sofort)

Ein PR ist fertig, wenn **alle** zutreffen:

- [ ] `cd bella-app && npm run build` grün.
- [ ] `npm run typecheck` + `npm run lint` grün (keine neuen Excludes/Ignores).
- [ ] `npm test` grün; neue Logik hat Tests; berührte Kernlogik behält/gewinnt Tests.
- [ ] Keine erfundenen Zahlen im UI. Keine Heilversprechen. Deutsch, Du-Form.
- [ ] Jeder Affiliate-Link `rel="sponsored"` + sichtbare Offenlegung.
- [ ] Allergen-Sicherheit: kein Pfad, der einem Allergiker das verbotene Protein zeigt (Test deckt es ab).
- [ ] Core Web Vitals (mobil) nicht schlechter als vor dem PR; kein neuer Konsolen-Error.
- [ ] Betroffene Doku im selben PR aktualisiert (dieses Dokument, `CLAUDE.md`, `ARCHITECTURE.md`).
- [ ] Die zugehörige Operation hier abgehakt (`[x]` + Datum + Commit-SHA).

---

## Fortschritt

| Op | Titel | Status | Datum | Commit |
|---|---|---|---|---|
| 0.0 | App-Ordner → `bella-app` | ✅ erledigt | 2026-09-03 | eb02776 |
| 0.1 | Doku auf eine Wahrheit | ✅ erledigt | 2026-09-03 | _(dieser Batch)_ |
| 0.2 | Toten Code entfernen | ✅ erledigt | 2026-09-03 | _(dieser Batch)_ |
| 0.3 | Env-Templates | ✅ erledigt | 2026-09-03 | _(dieser Batch)_ |
| 0.4 | Qualitäts-Gate | ✅ Netlify-Build `npm run ci` (kein GitHub Actions); `.github/workflows/` entfernt; `health-check.mts` Cron. Branch-Protection = Mensch | 2026-09-04 | _(dieser Batch)_ |
| 1.1 | React 19 | ✅ live, Preview bestätigt | 2026-09-03 | 79383ce |
| 1.2 | CSP + COOP | ✅ Weg B live · strict-dynamic als Folge-Op | 2026-09-03 | 6b68152 |
| 1.3 | API Rate-Limit | 🟡 In-Memory-Limiter live · verteilter Store + ai_usage folgen | 2026-09-03 | _(dieser Batch)_ |
| 1.4 | Test-Fundament | ✅ 113 Vitest + 5 Playwright-Smoke + Evals | 2026-09-03 | _(dieser Batch)_ |
| 1.5 | Drizzle-Migrationen | ✅ erledigt | 2026-09-03 | _(dieser Batch)_ |
| 1.6 | Font-Bug + tsconfig | ✅ erledigt | 2026-09-03 | _(dieser Batch)_ |
| 2.1 | Intent-LLM | ✅ Grundgerüst · ⚠️ Allergen-Fall offen → Phase 2A | 2026-09-03 | 7aa3742 |
| **2A.1** | Allergen `avoidProtein` | ✅ erledigt | 2026-09-03 | _(dieser Batch)_ |
| **2A.2** | SQL-Hard-Ausschluss + Snack-Guard | ✅ erledigt | 2026-09-03 | _(dieser Batch)_ |
| **2A.3** | Sicherheitsnetz / Re-Query / Leermeldung | ✅ erledigt | 2026-09-03 | _(dieser Batch)_ |
| **2A.4** | Prompt-Framing + Allergie-Signal | ✅ erledigt | 2026-09-03 | _(dieser Batch)_ |
| **2A.5** | Futter-Pass nur für sichere Hauptfutter | ✅ erledigt | 2026-09-03 | _(dieser Batch)_ |
| **2A.6** | LLM-Intent im RECOMMEND immer | ✅ erledigt | 2026-09-03 | _(dieser Batch)_ |
| **2A.7** | Ehrliche Zahlen im Stream | ✅ erledigt | 2026-09-03 | _(dieser Batch)_ |
| **2A.8** | Eval-Suite Allergen (blockierend, echte DB) | ✅ erledigt | 2026-09-03 | _(dieser Batch)_ |
| **2A.9** | Doku + README | ✅ erledigt | 2026-09-03 | _(dieser Batch)_ |
| 2.2 | Modell-Routing | ✅ erledigt | 2026-09-03 | _(dieser Batch)_ |
| 2.3 | Stream-Robustheit | 🟡 Server (Timeout+Logging+WARN) · Client-Retry offen | 2026-09-03 | _(dieser Batch)_ |
| 2.4 | Advisor-Eval-Suite | ✅ strukturell + LLM-Judge (opt-in) | 2026-09-03 | _(dieser Batch)_ |
| 2.5 | Allergen-Gate | ✅ via 2A.8 (läuft im Netlify-Build, DATABASE_URL = Netlify-Env) | 2026-09-03 | 334a46b |
| 3.1 | Token-System Light/Dark | 🟡 Token-Ebene + `[data-theme]` Light/Dark + `ThemeToggle` live (nicht-brechend, auf `/dev/components`) · Teil 2: site-weite `bg-white/x`→Token-Migration + `@media (prefers-color-scheme)` offen | 2026-09-03 | _(dieser Batch)_ |
| 3.2 | BELLA-Maskottchen | 🟡 kanonisches `BellaMascot` (SVG, 4 Posen, server-safe) + echte 404/Loading + Popup/Avatar-Einsatz · Teil 2: off-brand `BellaCharacter` ablösen + `🐕`-CTA-Sweep offen | 2026-09-03 | _(dieser Batch)_ |
| 3.3 | OG-Bilder pro Rasse | 🟡 Rasse-OG mit Foto + BELLA-Marke, on-demand (kein 186er-Prebuild) · Teil 2: problem/vergleich/Blog-Layout + Custom-Font offen | 2026-09-03 | _(dieser Batch)_ |
| 3.4 | Komponenten-Katalog + VisReg | ✅ Katalog + Playwright Smoke/Visual (beide manuell gegen URL, nicht im Gate) | 2026-09-03 | _(dieser Batch)_ |
| 3.5 | Motion-Politur | 🟡 tote nicht-composited Animationen entfernt (`sheen`/`scan-sweep`/`spotlight` + toter Hero-Block, −40 Zeilen CSS) · Teil 2: `framer-motion`-Audit + View Transitions offen | 2026-09-03 | _(dieser Batch)_ |
| 4.1 | Thin-Content-Audit | 🟡 Tool (`audit:content`) + Report + Bucket-Entscheidungen · Teil 2: DB-Re-Audit + `lebensphase`/`futtertyp`/`glossar` anreichern | 2026-09-04 | _(dieser Batch)_ |
| 4.2 | Tierarzt-Review live | ⬜ blockiert (Reviewer) | | |
| 4.3 | Aktualitäts-Signal | 🟡 `new Date()` aus allen `dateModified` raus (`BUILD_DATE`/`CONTENT_REVISED`), `<Freshness>` + prebuild-Datum · Teil 2: `<Freshness>` breiter, `datePublished` fixen | 2026-09-04 | _(dieser Batch)_ |
| 4.4 | Interner Cluster-Graph | 🟡 `audit:links` + `graph.ts`/`RelatedLinks` + Problem-Cluster (14 Seiten, 0 Orphans) · Teil 2: futtertyp/vergleich/rasse/lebensphase-Cluster | 2026-09-04 | _(dieser Batch)_ |
| 4.5 | GEO / AI-Search | 🟡 `/llms-full.txt` (20 Q&A + Quellen) + `/llms.txt`-Querverweis · Teil 2: Antwort-zuerst-Absätze, `CitableStat` breiter, Studien-`bella_summary` | 2026-09-04 | _(dieser Batch)_ |
| 4.6 | JsonLd-Helfer | ✅ `<JsonLd>` + Test + alle 21 Stellen migriert (`<Freshness>` → 4.3) | 2026-09-04 | _(dieser Batch)_ |
| 5.1 | Futter-Pass-Schleife | ⬜ offen | | |
| 5.2 | First-Party-Analytics | 🟡 `events`-Tabelle + Migration `0001` + `/api/track` + `track()` + `PageTracker` (pageview) · Teil 2: Migration einspielen, Events verdrahten, `/admin`, GA4 raus | 2026-09-04 | _(dieser Batch)_ |
| 5.3 | Funnel-Instrumentierung | ⬜ offen | | |
| 5.4 | Outcome-Checks sichtbar | ⬜ offen | | |
| 6.1 | Error-Tracking | ⬜ offen | | |
| 6.2 | Performance-Budget im Build | ⬜ offen | | |
| 6.3 | Repo-Hygiene | ⬜ offen | | |
| 6.4 | Backup + Runbook | ⬜ offen | | |

_Zuletzt aktualisiert: 2026-09-03 — Phase 0 + 1 + 2 (inkl. Phase 2A) weitgehend durch; offen: 2.4 + Phasen 3–6._
