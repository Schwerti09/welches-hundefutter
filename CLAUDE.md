# CLAUDE.md — welches-hundefutter.today (BELLA)

> Diese Datei wird von Claude Code automatisch geladen. Sie ist die **Single Source of Truth**
> für den Ist-Zustand und die Spielregeln. Agenten in `.claude/agents/` ergänzen sie.
> **`FUTTERPASS.md`** (Repo-Root) ist die Blaupause für das Futter-Pass-Schwungrad (Stufen 1–5) — muss ebenfalls gelesen werden.

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

## 2. GROUND TRUTH — Ist-Zustand (geprüft, Stand 2026-06-05)

**Das Fundament trägt. Phase = Wachstum.**

### ✅ Erledigt & live

| Was | Detail |
|---|---|
| ~18k Zeilen toter Code | Architektur-Theater entfernt (0 Importe, Build grün) |
| `products.ts` Handy-Frankenstein | Abgelöst; Live-Seite liest aus **Neon** |
| 8.442 echte Produkte | AWIN (`a=615299`) + AdCell, täglicher Cron 05:00 UTC |
| `price_history` | Snapshot nur bei Änderung, Lifecycle (`is_active`) |
| KI-Berater (BELLA) | Auf echten Produkten; Allergie→getreidefrei, Welpe+Lachs, BARF |
| 54 Rasse-Seiten | `/rasse/[slug]` + Galerie mit echten Fotos |
| Schicht 1 — Cross-sell | Kuratierte Begleit-Empfehlung (max. 3, mit Begründung) |
| Schicht 2 — Preis-Wecker | DOI-E-Mail-Audience via `price_history`, `/preis-wecker` |
| Hero „lebende BELLA" | Aurora + Bento-Universum + Schnüffel-Scan |
| Rechtshygiene | Impressum (DDG), Datenschutz inkl. KI, kein On-Load-Pixel |
| Legacy-Routen gelöscht | berlin, hamburg, duesseldorf, frankfurt, koeln, leipzig, muenchen, stuttgart, stadt, anbieter, handy, contract-tuev |
| deals/page.tsx | Echte dog_foods-DB-Abfrage, BELLA-Branding |
| StructuredData | HowTo + FAQs korrekt auf Hundefutter |

### 🔵 Nächste Wachstums-Tracks

| Track | Was | Agent |
|---|---|---|
| Long-Tail SEO | 14 Problem-Seiten `/problem/[slug]`, Futtertyp-Seiten `/futtertyp/[slug]`, `/vergleich/[a]-vs-[b]` | `content-engineer` + `seo-strategist` |
| Katalog-Breite | Cross-Sell-Kategorien: Snacks, NEMs/Öle, Zubehör, Versicherung | `feed-engineer` |
| Konversion | OG-Bilder pro Rasse, Social-Proof, Score-Transparenz sichtbar machen | `visual-designer` |

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

1. **DB-first.** Neue Daten kommen aus Neon (`dog_foods`/`offers`), nie aus `products.ts`.
2. **Kein totes Verzeichnis erweitern.** Kein `src/features/`, `src/platform/` — gelöscht.
3. **Keine erfundenen Zahlen.** „8.000+" steht da, weil 8.442 echte Datensätze in der DB sind.
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
