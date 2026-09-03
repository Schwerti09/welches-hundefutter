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
- **Stack:** Next.js 16 (App Router) · React 18.3 (→ 19, Roadmap Op 1.1) · TS · Tailwind v4 · Neon Postgres (Drizzle) · Netlify · AWIN + AdCell · Gemini 2.5 Flash + Claude Haiku 4.5

---

## 2. GROUND TRUTH — Ist-Zustand (Stand 2026-09-03)

**Das Fundament trägt. Phase = Next Level** — siehe `BELLA_NEXT_LEVEL.md` (36 nummerierte Operationen).

### ✅ Erledigt & live

| Was | Detail |
|---|---|
| Migration HANSI→BELLA + toter Code | Abgeschlossen. App-Ordner heißt jetzt `bella-app/` (2026-09-03). Rest-Reste → Roadmap Op 0.2 |
| `products.ts` Handy-Frankenstein | Abgelöst; Seiten rendern aus **Neon** (`src/db/queries/*`) |
| über 11.000 Produkte | AWIN (`a=615299`) + AdCell, täglicher Cron via Netlify Scheduled Functions |
| `price_history` | Snapshot nur bei Änderung, Lifecycle (`is_active`) |
| KI-Berater (BELLA) | `/api/advisor/chat`, streamt, scort echte `dog_foods`, harter Allergen-Ausschluss, Futter-Pass-Anlage |
| 186 Rasse-Seiten | `/rasse/[slug]` — Portionsrechner, FAQ, Fütterungs-Absätze; Fotos **self-hosted** in `public/breeds/` (2026-09-03) |
| Programmatik | `/problem/*` (14), `/futtertyp/*`, `/lebensphase/*`, `/vergleich/*`, ~1.400 Tipps, Studien, Glossar |
| Schicht 1 — Cross-sell | Kuratierte Begleit-Empfehlung (max. 3, mit Begründung) |
| Schicht 2 — Preis-Wecker | DOI-E-Mail-Audience via `price_history`, `/preis-wecker` |
| Rechtshygiene | Impressum (DDG), Datenschutz inkl. KI, kein On-Load-Pixel |
| PageSpeed / Sticky-CTA | 2026-09-03: GA `lazyOnload`, `next/image` für Rasse-Fotos, mobiler CTA entschärft |

### 🔴 Offene Baustellen (Auszug — vollständig in `BELLA_NEXT_LEVEL.md`)

- **Fundament:** React 18 unter Next 16 (Op 1.1) · kein CSP/COOP (1.2) · kein API-Rate-Limit (1.3) · **null Tests** (1.4) · Schema-Drift via Laufzeit-DDL (1.5) · toter `src/lib/{environment,performance,state,…}` (0.2)
- **BELLA:** Regex-Intent + duplizierte Rassen-Liste (2.1) · pauschales Modell-Routing (2.2) · keine Eval-Suite (2.4)
- **Design:** nur Dark-Mode (3.1) · BELLA = Emoji (3.2) · kein OG-Bild pro Rasse (3.3) · `--font-inter` nie geladen (1.6)
- **Content:** Thin-Content-Risiko bei 1.400 Tipps + `/stadt/*` (4.1) · kein Tierarzt-Review (4.2)
- **Moat:** Futter-Pass-Schleife nicht geschlossen (5.1) · GA4 statt first-party (5.2) · Funnel ungemessen (5.3)

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
5. **Affiliate-Transparenz:** Jeder AWIN-Link `rel="sponsored"`, sichtbare Offenlegung. Pflicht.
6. **Deutsch, Du-Form, Hundehalter-Sprache.** Kein Marketing-Sprech, keine Floskeln.
7. **Build muss grün bleiben.** `cd bella-app && npm run build` vor jedem Push.
8. **Mobile-first.** > 70 % der Hundehalter suchen am Handy. Core Web Vitals sind Ranking-kritisch.
9. **Kuratiert, nicht zugemüllt.** Cross-Sells max. 2–3 mit Begründung; Relevanz vor Provision; E-Mails Wert vor Frequenz; kein Versand ohne Double-Opt-in.

---

## 5. Agent-Flotte & Delegation

| Agent | Rolle (Auftrag) | Wann rufen |
|---|---|---|
| `bella-lead` | Orchestrator, Roadmap, zerlegt Aufgaben | Start jeder größeren Initiative |
| `platform-architect` | DB-Integrität, Build-Gesundheit, Refactors | „warum ist X kaputt" |
| `feed-engineer` | Echte AWIN-Pipeline + Cross-Selling-Kategorien (Snacks, Versicherung) | Feeds/Daten/Preise |
| `bella-advisor` | Fragenflow, Scoring, Erklärungen, Prompt-Tuning | Empfehlungslogik, Conversation |
| `content-engineer` | Rasse-/Problem-/Futtertyp-Seiten, FAQ, Schema, Seed-Daten | Neue Seiten, Texte |
| `visual-designer` | Designsystem, BELLA-Charakter, CRO, OG-Images | UI, Komponenten, Conversion |
| `seo-strategist` | Pfad zu DACH #1: Cluster, interne Links, Technical SEO | Ranking, Keywords, Wettbewerb |
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
npm run build          # MUSS grün sein vor Push
npm run lint

# Feed-Pipeline (täglich via Cron, manuell auslösbar):
python scripts/parse-feeds.py            # erzeugt dog_foods.json aus AWIN-Feeds
DATABASE_URL="postgres://…" node scripts/load-dog-foods.mjs   # upsert in Neon
```

`.env.local` nach `.env.example`: `DATABASE_URL`, `AWIN_PUBLISHER_ID`, `AWIN_API_TOKEN`, `GEMINI_API_KEY`, `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `SITE_URL`.
