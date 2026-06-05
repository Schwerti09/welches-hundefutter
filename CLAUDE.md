# CLAUDE.md — welches-hundefutter.today (BELLA)

# CLAUDE.md — STAND-UPDATE (Evolution: Wachstumsphase)

> In `CLAUDE.md` einpflegen. Der Ist-Zustand hat sich grundlegend geändert: aus „Rettung" ist
> „Wachstum" geworden. Die alten Befunde A/B (toter Code, Frankenstein-Daten) sind **erledigt** —
> nicht löschen, aber als „✅ behoben" markieren, damit niemand auf veraltetem Ground-Truth arbeitet.

## §2 ersetzen — Neuer Ground Truth (geprüft, live)

**„Außen fertig, innen hohl" ist Geschichte.** Live verifiziert:

- ✅ **Befund A behoben** — ~18k Zeilen Architektur-Theater entfernt.
- ✅ **Befund B behoben** — `products.ts` (Handy-Frankenstein) abgelöst; Live-Seite rendert aus **Neon**.
- ✅ **Feeds live & frisch** — **8.442** echte Produkte aus AWIN (`a=615299`, 0 Platzhalter) + AdCell.
  Täglicher Cron (`.github/workflows/import-feeds.yml`, 05:00 UTC), reuse der verifizierten Scripts
  (kein TS-Port). `price_history` (Snapshot nur bei Änderung) + Lifecycle (`is_active`, erst nach
  >2 Tagen Abwesenheit) stehen. Import idempotent, 0 Fehler (vorher 23).
- ✅ **KI-Berater** auf 8.442 echten Produkten (Allergie→getreidefrei, Welpe+Lachs, BARF…).
- ✅ **54 Rasse-Seiten** + „Finde deinen Hund"-Galerie mit echten Fotos.
- ✅ **Dunkles Premium-Theme**, echter Hund-Charakter.
- ✅ **Hygiene/Recht:** „500+" → „8.000+" überall synchron · Impressum entfrankensteint (TMG→DDG,
  „Diensteanbieter", Apple/Samsung-Hinweis raus) · Datenschutz inkl. KI-Abschnitt · kein On-Load-
  Tracking → kein Consent-Banner nötig.

**Offene Phase = Wachstum.** Das Fundament trägt. Jetzt zählt: Monetarisierungs-Tiefe + Audience +
Long-Tail-Skalierung — alles, was Platz 1 *hält*, nicht nur erreicht.

## §3 ergänzen — Die zwei Evolutions-Schichten

- **Schicht 1 — Begleit-Empfehlung** (`cross-sell-curator`): BELLA verkauft nach der Futter-Empfehlung
  kuratiert quer (Snacks, NEMs/Öle, Zubehör, **Versicherung** = Top-Provision). Gesetz: max. 2–3, immer
  mit „warum", Relevanz vor Provision. Datenmodell `category` + `companion_for`.
- **Schicht 2 — Preis-Alerts & eigene E-Mail-Audience** (`retention-growth`): nutzt die bisher
  ungenutzte `price_history`. „Soll BELLA Bescheid geben, wenn's günstiger wird?" → Double-Opt-in →
  Liste, die **nicht** von Google abhängt. Der eigentliche Burggraben.
- **Parallel-Track — Long-Tail-Scale-out** (`content-engineer` + `seo-strategist`): 14 Problem-Seiten,
  `/vergleich/[a]-vs-[b]` aus der DB, Futtertyp-Seiten, volle Sitemap. Das Rasse-Muster auf alles ausrollen.

## §5 ergänzen — Zwei neue Agenten in der Delegations-Tabelle

| Agent | Rolle (Auftrag) | Wann rufen |
|---|---|---|
| `cross-sell-curator` | Schicht 1: Begleit-Empfehlung, `companion_for`, Anti-Müll-Disziplin | Cross-Selling, Versicherung, Zubehör |
| `retention-growth` | Schicht 2: Preis-Alerts, DOI-E-Mail-Audience, Lifecycle | Wiederkehr, E-Mail, `price_history` nutzen |

**Neue Wachstums-Sequenz:** `cross-sell-curator` (Set jetzt, Email-Hook als Brücke) →
`retention-growth` (Alerts direkt dran) → **parallel** `content-engineer` + `seo-strategist` (Scale-out).
`feed-engineer` erweitert den Katalog um die Cross-Sell-Kategorien, `bella-advisor` integriert beide
Schichten kontextuell, `trust-compliance` gibt Versicherung + Double-Opt-in frei.

## §4 ergänzen — Eine neue harte Regel

9. **Kuratiert, nicht zugemüllt.** Cross-Sells max. 2–3 mit Begründung; Relevanz vor Provision;
   E-Mails Wert vor Frequenz; kein Versand ohne Double-Opt-in. Eine Bannerwand killt Trust → Ranking → Platz 1.

---

> Diese Datei wird von Claude Code automatisch geladen. Sie ist die **Single Source of Truth**
> für den Ist-Zustand und die Spielregeln. Agenten in `.claude/agents/` ergänzen sie.

---

## 1. Was wir bauen

**Das Check24 für Hundefutter** — eine KI-Beraterin (**BELLA**), die in ~60 Sekunden aus
einem Live-Katalog (AWIN-Feeds) das passende Futter für *diesen* Hund findet, mit
Preisvergleich und Cross-Selling (Snacks, Versicherung, Zubehör, alles für Hund + Halter).

- **Domain:** welches-hundefutter.today
- **Persona:** BELLA (Fork von HANSI / HandyvertragTrotzSchufa)
- **Ziel:** Platz 1 DACH für „welches hundefutter für meinen hund" (+ Cluster)
- **Stack:** Next.js 16 (App Router) · TS · Tailwind v4 · Neon Postgres (Drizzle) · Netlify · AWIN · Gemini 2.0 Flash + Claude Haiku 4.5

---

## 2. GROUND TRUTH — Ist-Zustand (ehrlich, geprüft)

Eine echte Code-Analyse ergab: Die Migration ist **an der Oberfläche fertig, im Kern hohl.**
Bevor irgendjemand „nur noch AWIN-Feeds einträgt", müssen drei harte Fakten verstanden sein:

### 🔴 Befund A — ~16.500 Zeilen toter Code (Architektur-Theater)
Diese Verzeichnisse sind **NIRGENDS** importiert (0 Referenzen aus `app/`, `components/`, `lib/`, `api/`):

| Verzeichnis | Dateien | Zeilen | Status |
|---|---:|---:|---|
| `src/features/data` (inkl. `liveFeeds/`) | 44 | 6.215 | tot |
| `src/features/personalization` | 16 | 2.947 | tot |
| `src/features/seo` | 15 | 2.782 | tot |
| `src/features/intelligence` | 13 | 1.592 | tot |
| `src/platform` | 14 | 1.625 | tot |
| `src/features/commerceOS` | 15 | 1.420 | tot |

Diese Klassen *klingen* mächtig (`MarketForecastingSystem`, `PredictiveRecommendationEngine`…),
**tun aber nichts**: Sie nehmen das Ergebnis als Input-Parameter entgegen und legen es in einer
`Map` ab. Beispiel `awinZIPExtractor.ts` enthält wörtlich `// Placeholder for ZIP extraction logic`
und „simuliert" das Entpacken, indem es den String `"datafeed.csv"` zurückgibt. **Es entpackt nichts.**

➡️ **Regel:** Kein Agent baut auf diesen Verzeichnissen auf. Sie werden gelöscht oder durch
echte Implementierungen ersetzt (siehe `platform-architect`).

### 🔴 Befund B — Die Live-Datenquelle ist Handy-Frankenstein
Die Seite rendert aus **`src/data/products.ts`** (33 Einträge) — und das ist noch die
**iPhone-16-Pro-Datenstruktur** mit Labels per Suchen-und-Ersetzen übermalt:
`specs.display = "6.3\" Super Retina XDR OLED"`, `chip = "Apple A18 Pro"`,
`dataVolume = "100 g"`, `contractDuration: 24`, Features wie `"Allnet-Flat"`, `"EU-Roaming"`.
Die Hero-Headline verspricht „8.000+ Futter", die Meta-Description „500+ Sorten" — real sind es 33 Fake-Items.

➡️ **Regel:** `products.ts` wird nicht geflickt, sondern **abgelöst**. Quelle der Wahrheit ist die DB.

### 🟢 Befund C — Das Fundament IST gut (darauf bauen wir)
- **DB-Schema** (`src/db/schema.ts`) ist korrekt hundefutter-förmig: `dog_foods`, `dog_breeds`,
  `health_issues`, `offers`, `affiliate_clicks`, `advisor_sessions`. **Sauber.**
- Es existiert ein **echter** Datenpfad parallel zum Theater: `scripts/parse-feeds.py`
  → `dog_foods.json` → `scripts/load-dog-foods.mjs` (echter Neon-Upsert by slug).
- Front-Marketing-Layer (Homepage, 24 Rasse-Stubs, Schema-Markup, Bella-UI) ist deployed & ordentlich.
- **Die Lücke:** Die Live-Seite liest `products.ts`, **nicht** die DB. Diese Brücke fehlt.

---

## 3. Die strategische Wette (wie wir Platz 1 holen)

Der DACH-SERP für „hundefutter test" gehört Editorial-Testseiten (hundeo.com, 1a-hundefutter.de,
hundefutter-tests.net). Die gewinnen über **EEAT** (echte Tests, transparente Score-Methodik) und
**Breite** (3.000+ Produkte). Sie sind aber **statisch**.

**Unsere uneinholbaren Wedges:**
1. **Echter konversationeller Berater** (Bella) — kein Konkurrent hat „erzähl von deinem Hund → personalisierte Auswahl". Das ist der Burggraben.
2. **Programmatic Personalisierung** — Rasse × Alter × Problem × Futtertyp als indexierbare Seiten.
3. **Transparente, verteidigbare Score-Methodik** (Fleischanteil, Deklaration, Zusammensetzung) — Pflicht für EEAT, sonst kein Trust.
4. **Live-Preise via AWIN-Feeds** — der echte „Check24"-Hebel + Cross-Selling.

---

## 4. Harte Regeln für ALLE Agenten

1. **DB-first.** Neue Daten kommen aus Neon (`dog_foods`/`offers`), nie aus `products.ts`.
2. **Kein totes Verzeichnis erweitern.** Erst `platform-architect` fragen, ob es lebt.
3. **Keine erfundenen Zahlen.** „8.000+" steht erst da, wenn 8.000 echte Datensätze in der DB sind. Sonst die echte Zahl.
4. **Keine medizinischen/tierärztlichen Heilversprechen.** „kann unterstützen", nicht „heilt". (siehe `trust-compliance`)
5. **Affiliate-Transparenz:** Jeder AWIN-Link `rel="sponsored"`, sichtbare Offenlegung. Pflicht.
6. **Deutsch, Du-Form, Hundehalter-Sprache.** Kein Marketing-Sprech, keine Floskeln.
7. **Build muss grün bleiben.** `cd handyvertrag-app && npm run build` vor jedem Push.
8. **Mobile-first.** > 70 % der Hundehalter suchen am Handy. Core Web Vitals sind Ranking-kritisch.

---

## 5. Agent-Flotte & Delegation

| Agent | Rolle (Auftrag) | Wann rufen |
|---|---|---|
| `bella-lead` | Orchestrator, Roadmap, zerlegt Aufgaben | Start jeder größeren Initiative |
| `platform-architect` | Toten Code töten, DB-Brücke bauen, Build-Integrität | Refactors, „warum ist X kaputt" |
| `feed-engineer` | Echte AWIN-Pipeline + Cross-Selling-Kategorien | Alles mit Feeds/Daten/Preisen |
| `bella-advisor` | Der Berater: Fragenflow, Scoring, Erklärungen, Prompt | Empfehlungslogik, Conversation |
| `content-engineer` | Der Content: Rasse-/Problem-/Futtertyp-Seiten, FAQ, Schema | Neue Seiten, Texte, Seed-Daten |
| `visual-designer` | Das Visuelle: Designsystem, Bella-Charakter, CRO, OG | UI, Komponenten, Conversion |
| `seo-strategist` | Pfad zu DACH #1: Cluster, interne Links, Technical SEO | Ranking, Keywords, Wettbewerb |
| `trust-compliance` | Recht (TMG/DSGVO), EEAT, Affiliate-Offenlegung, Health-Claims | Vor jedem Go-Live, rechtliche Texte |

**Standard-Reihenfolge für „mach es fertig":**
`platform-architect` (Fundament heilen) → `feed-engineer` (echte Daten) →
`bella-advisor` + `content-engineer` (Substanz) → `visual-designer` (Politur) →
`seo-strategist` (Distribution) → `trust-compliance` (Freigabe).

---

## 6. Befehle

```bash
cd handyvertrag-app
npm install
npm run dev            # lokal
npm run build          # MUSS grün sein vor Push
npm run lint

# Echter Datenpfad (nicht das liveFeeds-Theater):
python scripts/parse-feeds.py            # erzeugt dog_foods.json aus AWIN-Feeds
DATABASE_URL="postgres://…" node scripts/load-dog-foods.mjs   # upsert in Neon
```

`.env.local` nach `.env.example`: `DATABASE_URL`, `AWIN_*`, `GEMINI_API_KEY`, `ANTHROPIC_API_KEY`.
