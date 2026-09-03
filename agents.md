# Wegweiser

Dieses Repo hatte hier früher den HANSI→BELLA-Migrations-Blueprint. Die Migration ist
abgeschlossen. Aktuelle Orientierung:

| Was du suchst | Datei |
|---|---|
| **Roadmap** — was wir als Nächstes bauen, in welcher Reihenfolge, mit Akzeptanzkriterien | [`BELLA_NEXT_LEVEL.md`](./BELLA_NEXT_LEVEL.md) |
| **Alltag / Ground Truth** — Ist-Zustand, harte Regeln, Befehle | [`CLAUDE.md`](./CLAUDE.md) |
| **Agenten-Flotte** — 13 Spezialisten + Delegationslogik | [`.claude/agents/`](./.claude/agents/) |
| **Technischer Aufbau** | [`bella-app/ARCHITECTURE.md`](./bella-app/ARCHITECTURE.md) |
| **Futter-Pass-Schwungrad** (Moat, Phase 5) | [`FUTTERPASS.md`](./FUTTERPASS.md) |

App-Code liegt in [`bella-app/`](./bella-app/) (Next.js 16, App Router). Deploy: Netlify, automatisch bei Push auf `main`.
