# welches-hundefutter.today 🐕

**BELLA** — Deutschlands KI-Ernährungsberaterin für Hunde. Erzähl von deinem Hund,
BELLA findet in ~60 Sekunden aus einem live gepflegten Katalog (11.000+ Sorten,
tagesaktuelle Preise) das passende Futter — mit nachvollziehbarer Begründung.

**Live:** https://welches-hundefutter.today · **Deploy + Qualitäts-Gate:** Netlify (auto bei Push auf `main`; Build-Command `npm run ci` — **kein GitHub Actions**)

---

## Repo-Landkarte

| Datei | Rolle |
|---|---|
| [`bella-app/`](./bella-app/) | Die App — Next.js 16, App Router. Eigene [README](./bella-app/README.md). |
| [`BELLA_NEXT_LEVEL.md`](./BELLA_NEXT_LEVEL.md) | **Roadmap** — nummerierte Operationen mit Akzeptanzkriterien + Fortschritt. |
| [`CLAUDE.md`](./CLAUDE.md) | Alltags-SSOT: Ist-Zustand, harte Regeln, Befehle. |
| [`.claude/agents/`](./.claude/agents/) | Agenten-Flotte (13 Spezialisten) + Delegationslogik. |
| [`bella-app/ARCHITECTURE.md`](./bella-app/ARCHITECTURE.md) | Technischer Aufbau (Datenpfad, Advisor-Stream, Deploy). |
| [`FUTTERPASS.md`](./FUTTERPASS.md) | Blaupause Futter-Pass-Schwungrad (Moat, Roadmap-Phase 5). |
| [`docs/`](./docs/) | GEO-Protokoll, Audits, Status-Snapshots. |

---

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 ·
Neon Postgres + Drizzle (versionierte Migrationen) · **Netlify** (Deploy **und** Gate,
Scheduled Functions für Crons) · AWIN + AdCell · Gemini 2.5 Flash + Claude Haiku 4.5 / Sonnet ·
Vitest (118) + Playwright

---

## Schnellstart

```bash
git clone https://github.com/Schwerti09/welches-hundefutter.git
cd welches-hundefutter/bella-app
npm install
cp .env.example .env.local   # Werte eintragen (Neon, Gemini/Anthropic, Resend, AWIN-Feeds …)
npm run dev
```

**Der Gate** (identisch zum Netlify-Build-Command): `npm run ci`
= `typecheck` + `lint` + `test` + `build`. Schlägt er fehl, gibt es keinen Deploy.
E2E/Visuell laufen separat gegen eine URL: `E2E_BASE_URL=… npm run test:e2e`.

---

## Umfang (live)

- **KI-Berater** (`/api/advisor/chat`): adaptiver Flow, streamt strukturierte Events,
  Intent = Regex-Fast-Path + LLM-Ergänzung, deterministisches Scoring im Code.
- **~2.400 Seiten**: 186 Rasse-Seiten, 14 Problem-Seiten, Futtertyp / Lebensphase /
  Vergleich, ~1.400 Tipps-Artikel, Studien, Glossar, Blog.
- **Katalog & Preise**: 11.000+ Produkte, Preis-Historie, DOI-Preis-Wecker.
- **Futter-Pass**: `dog_profiles`, Verbrauchsmathematik, teilbarer Steckbrief.

---

## Affiliate-Partner (AWIN)

| Partner | Provision |
|---|---|
| Anifit | 30 € + 8 % recurring |
| Futalis | 40 € pro Lead |
| Bellfor | 30 € + 10 % recurring |
| Zooplus / Fressnapf | 5 % |

---

## Ziel

Platz 1 DACH für „welches hundefutter für meinen hund" (+ Cluster). Kein Vergleichsportal —
ein persönlicher Ernährungsmanager fürs ganze Hundeleben. Der Weg dahin: `BELLA_NEXT_LEVEL.md`.
