# 🐕 BELLA Agent-Flotte

> Status: SSOT für die Flotte. Ground Truth = `../../CLAUDE.md`. Roadmap = `../../BELLA_NEXT_LEVEL.md`.
> Stand 2026-09-04.

**Phase: Next Level.** Fundament trägt (~2.373 Seiten grün, echte Neon-DB, Feed-Pipeline
+ Crons via **Netlify Scheduled Functions**, streamender KI-Berater mit vollständiger
Allergen-Härtung, programmatische Seiten live). **Deploy und Qualitäts-Gate laufen über
Netlify** (`npm run ci` = typecheck + lint + test + build) — **kein GitHub Actions**.
Phasen 0–2 der Roadmap sind erledigt, Phasen 3–5 laufen (jeweils „Teil 1" gebaut). Was
als Nächstes ansteht, steht als nummerierte Operationen in `BELLA_NEXT_LEVEL.md`.

## Die 13 Spezialisten

| # | Datei | Agent | Rolle | Modell |
|---|---|---|---|---|
| 00 | `00-orchestrator.md` | **bella-lead** | Orchestrator — zerlegt, delegiert, nimmt gegen Akzeptanzkriterien ab | opus |
| 01 | `01-bella-advisor.md` | **bella-advisor** | Der Berater — Fragenflow, Scoring, Allergen-Sicherheit, Prompt, `/api/advisor/*` | sonnet |
| 02 | `02-content-engineer.md` | **content-engineer** | Rasse-/Problem-/Futtertyp-/Vergleichs-Seiten, FAQ, Seed-Daten, Schema | sonnet |
| 03 | `03-visual-designer.md` | **visual-designer** | Designsystem, BELLA-Charakter, CRO, OG-Bilder, Core Web Vitals | sonnet |
| 04 | `04-feed-engineer.md` | **feed-engineer** | AWIN/AdCell-Pipeline + Cross-Sell-Katalog (Snacks, Versicherung, Zubehör) | sonnet |
| 05 | `05-seo-strategist.md` | **seo-strategist** | Pfad zu DACH #1 — Cluster, interne Links, Technical SEO, AI-Search | sonnet |
| 06 | `06-architect.md` | **platform-architect** | DB-Integrität, Build-/Gate-Gesundheit (`npm run ci`), Refactors, Sicherheit, Tests, Netlify-Build | opus |
| 07 | `07-trust-compliance.md` | **trust-compliance** | DSGVO/DDG, EEAT, Affiliate-Offenlegung, Health-Claims (Veto-Recht) | sonnet |
| 08 | `08-cross-sell-curator.md` | **cross-sell-curator** | Begleit-Empfehlung, `companion_for`, Anti-Müll-Disziplin | sonnet |
| 09 | `09-retention-growth.md` | **retention-growth** | Preis-Alerts, DOI-E-Mail-Audience, Lifecycle-Mails | sonnet |
| 10 | `10-experience-architect.md` | **experience-architect** | Der „lebende" BELLA-Moment — Hero, Motion, Interaktions-Erlebnis | sonnet |
| 11 | `11-lifecycle-architect.md` | **lifecycle-architect** | Futter-Pass-Schwungrad (`FUTTERPASS.md`): `dog_profiles`, Nachschub-Wecker | sonnet |
| 12 | `12-conversion-analyst.md` | **conversion-analyst** | Funnel Seite→Profil→Klick→Nachschub messen, Signale zurückspielen | sonnet |

## Delegationslogik (Kurzform — Details in `../../CLAUDE.md` §5)

- **Kaputt / Refactor / Build / Sicherheit / Tests / Netlify-Gate** → `platform-architect`
- **Feeds, Preise, Produktdaten, Cross-Sell-Kategorien** → `feed-engineer`
- **Empfehlungslogik, Dialog, Scoring, Prompt** → `bella-advisor`
- **Neue Seiten, Texte, Seed-Daten, Schema** → `content-engineer`
- **Designsystem, Komponenten, OG-Bilder, CRO** → `visual-designer` (+ `experience-architect` für den Hero-Moment)
- **Ranking, Cluster, interne Links, AI-Search** → `seo-strategist`
- **Recht, DSGVO/DDG, Offenlegung, Health-Claims** → `trust-compliance` (Veto vor jedem Go-Live)
- **Wiederkehr, E-Mail, Nachschub** → `retention-growth` + `lifecycle-architect`
- **Conversion messen & optimieren** → `conversion-analyst`

## Standard-Sequenz „nächste Operation"

`bella-lead` liest `BELLA_NEXT_LEVEL.md`, nimmt die nächste offene Operation, prüft
`Abhängt von`, delegiert an den genannten Agent, nimmt gegen die `Akzeptanz`-Haken ab,
hakt die Operation in der Fortschrittstabelle ab und aktualisiert die betroffene Doku
im selben Commit (`CLAUDE.md`, `ARCHITECTURE.md`, READMEs). Ein Commit/PR = eine Operation.
`npm run ci` grün (das ist der Netlify-Build-Command), sonst kein Deploy.
