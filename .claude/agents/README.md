# 🐕 BELLA Agent-Flotte

Spezialisierte Claude-Code-Subagenten für welches-hundefutter.today. Jeder hat einen scharfen
Auftrag, eigenes Tool-Set und eingebautes Wissen über den **echten** Ist-Zustand des Repos
(siehe `../../CLAUDE.md`). Claude Code delegiert automatisch anhand der `description`, oder du
rufst explizit: *„Nutze den feed-engineer, um …"*.

## Die Flotte

| # | Agent | Rolle | Modell |
|---|---|---|---|
| 00 | **bella-lead** | Orchestrator — zerlegt Ziele, delegiert, nimmt ab | opus |
| 06 | **platform-architect** | Toten Code töten · DB-Brücke · Build-Integrität | opus |
| 04 | **feed-engineer** | Echte AWIN-Pipeline · Preisvergleich · Cross-Selling | sonnet |
| 01 | **bella-advisor** | Der Berater — Fragenflow, Scoring, Erklärungen | sonnet |
| 02 | **content-engineer** | Der Content — Rasse/Problem/Vergleich, Schema, EEAT | sonnet |
| 03 | **visual-designer** | Das Visuelle — Designsystem, Bella, CRO, CWV | sonnet |
| 05 | **seo-strategist** | Pfad zu DACH #1 — Cluster, interne Links, AI-Search | sonnet |
| 07 | **trust-compliance** | Recht (DSGVO/DDG) · Offenlegung · Health-Claims (Veto) | sonnet |

## Warum diese Aufteilung
Deine drei genannten Rollen sind direkt abgebildet: **der Berater** → `bella-advisor`,
**der Content** → `content-engineer`, **das Visuelle** → `visual-designer`. Die Analyse hat drei
weitere Pflicht-Rollen erzwungen, ohne die „Platz 1" nicht trägt:
- `platform-architect` — weil ~16.500 Zeilen toter Code und eine Handy-Frankenstein-Datenquelle
  erst weg/geheilt müssen, bevor irgendetwas Echtes darauf steht.
- `feed-engineer` — weil die vorhandene AWIN-„Pipeline" ein Placeholder ist, der nichts entpackt
  und nie in die DB schreibt. Ohne echte Feeds kein Check24.
- `seo-strategist` + `trust-compliance` — weil DACH-#1 gegen EEAT-starke Testseiten nur über
  Tiefe, Technik und Vertrauen (rechtlich + inhaltlich) geht.

## Empfohlene erste Mission

```
Nutze bella-lead. Ziel: welches-hundefutter.today produktionsreif und auf Kurs Platz 1 DACH.
Halte dich strikt an CLAUDE.md. Starte mit platform-architect (Fundament heilen: toten Code
entfernen, Live-Seite an Neon hängen), dann feed-engineer (echte AWIN-Daten). Zeig mir nach
jedem Arbeitspaket den Diff und den grünen Build, bevor du weitermachst.
```

## Reihenfolge (Abhängigkeiten)
`platform-architect` → `feed-engineer` → (`bella-advisor` ∥ `content-engineer`) →
`visual-designer` → `seo-strategist` → `trust-compliance` (Go-Live-Gate).

Fundament vor Substanz vor Politur vor Distribution vor Freigabe.
