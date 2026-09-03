# Copilot / Agent Instructions — welches-hundefutter.today (BELLA)

Du arbeitest an **BELLA**, Deutschlands KI-Ernährungsberaterin für Hunde.
App-Code: `bella-app/` (Next.js 16 App Router · TypeScript · Tailwind v4 · Neon/Drizzle · Netlify).

**Lies zuerst:**
- `CLAUDE.md` (Root) — Ist-Zustand & harte Regeln (Ground Truth)
- `BELLA_NEXT_LEVEL.md` (Root) — die Roadmap; arbeite Operationen daraus ab
- `.claude/agents/` — Spezialisten-Flotte & Delegationslogik

**Harte Regeln (Kurzfassung, Details in `CLAUDE.md` §4):**
1. DB-first: neue Produktdaten aus Neon (`dog_foods`/`offers`), nie aus statischen Fakes.
2. Keine erfundenen Zahlen im UI. Keine medizinischen Heilversprechen („kann unterstützen", nicht „heilt").
3. Jeder Affiliate-Link `rel="sponsored"` + sichtbare Offenlegung.
4. Deutsch, Du-Form, Hundehalter-Sprache.
5. Allergen-Sicherheit: was ein Allergiker nie empfohlen bekommen darf, wird durch einen Test abgesichert.
6. `cd bella-app && npm run build` muss grün bleiben. Sobald vorhanden auch `npm run typecheck && npm run lint && npm test`.
7. Mobile-first; Core Web Vitals dürfen pro PR nicht schlechter werden.
8. Server Components by default; `"use client"` nur wenn nötig.
9. Keine neuen Excludes/Ignores in `tsconfig.json` / `eslint.config.mjs`.

Betroffene Doku im selben PR aktualisieren (`BELLA_NEXT_LEVEL.md` Fortschrittstabelle, `CLAUDE.md`, `ARCHITECTURE.md`).
