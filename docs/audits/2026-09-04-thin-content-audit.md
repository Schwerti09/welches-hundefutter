# Thin-Content-Audit — 2026-09-04

**Roadmap:** Operation 4.1 · **Tool:** `bella-app/scripts/content-audit.mjs`
(`npm run audit:content` gegen einen laufenden `next start`)

**Schwelle für ein Flag:** sinnvolle Wortzahl < 350 **oder** Template-Anteil > 70 %
— nur bei **indexierbaren** Seiten (`<meta name="robots">` ohne `noindex`).

Der Template-Anteil ist der Anteil der Sätze/Zeilen einer Seite, die wortgleich in
mindestens einer Geschwister-Seite desselben Typs vorkommen (Boilerplate-Messung).

---

## ⚠️ Messvorbehalt: lokal ohne `DATABASE_URL`

Dieser Lauf lief gegen `next start` **ohne** DB-Verbindung. Alle Seitentypen, deren
Hauptwert aus einer Live-DB-Abfrage stammt, sind dadurch **unterschätzt** oder liefern
`notFound()`:

| Typ | lokaler Effekt |
|---|---|
| `/glossar/[slug]` | `glossary_terms`-Query leer → **`notFound()`** → 5 Wörter, generischer Titel. Der Flag ist ein **False Positive** dieses Laufs. |
| `/lebensphase/[slug]` | Produkt-Tabelle (`neon(...)`) rendert leer → nur die redaktionelle Einleitung zählt. |
| `/futtertyp/[slug]` | dito — DB-Produktliste fehlt. |

**Pflicht-Folgeschritt:** Audit **einmal mit `DATABASE_URL`** (lokal via `.env.local`
oder im CI) neu laufen lassen und diesen Report ersetzen, bevor Index-Entscheidungen
für `glossar`/`lebensphase`/`futtertyp` final getroffen werden.

---

## Ergebnis (Stichprobe, 29 URLs über 10 Seitentypen)

| Typ | Wörter (Bereich) | Template | Bewertung |
|---|---|---|---|
| `rasse` | 560–657 | 27–39 % | ✅ gesund |
| `problem` | 457–492 | 23–26 % | ✅ gesund |
| `vergleich` | 512–645 | 10–16 % | ✅ gesund |
| `tipps-artikel` | 530–629 | 28–31 % | ✅ gesund |
| `tipps-kategorie` | 2500–3200 | 0 % | ✅ gesund — **aber 102 ausgehende interne Links** (Link-Verwässerung, s. u.) |
| `stadt` (≥ 100 k, indexiert) | 695–750 | 58–60 % | ✅ knapp unter Schwelle — ok, beobachten |
| `stadt` (< 100 k) | 741–780 | 60–77 % | ✅ bereits `noindex` (Doorway-Schutz greift) |
| `futtertyp` | 278–504 | 17–33 % | 🟡 2 von 3 Stichproben < 350 W — **DB-unterschätzt**, trotzdem dünn |
| `lebensphase` | 151–167 | 0 % | 🔴 redaktioneller Teil echt dünn (DB-Tabelle zusätzlich fehlend) |
| `glossar` | (n/a) | — | ⚪ lokal nicht messbar (kein DB) |

**8 / 29 geflaggt** — davon 3 (`glossar`) False Positives dieses Laufs.

---

## Entscheidungen je Bucket

### `rasse`, `problem`, `vergleich`, `tipps-artikel` — **keine Aktion**
Eigenständiger Wert klar gegeben (Portionsrechner, rasse-/problemspezifische Absätze,
FAQ, echte Vergleichslogik). Template-Anteil niedrig.

### `stadt/*` — **bereits gelöst, dokumentiert**
`src/app/stadt/[slug]/page.tsx` setzt `robots: { index: city.population >= 100000 }`.
`sitemap.ts` nimmt nur Städte ≥ 100 k auf. Verifiziert: kleine Städte liefern
`noindex` (Template 77 %), große bleiben knapp unter 60 %. **Keine Änderung**, aber:
- **Beobachten:** Großstadt-Seiten bei 58–60 % Template. Wenn Google-Sichtbarkeit
  ausbleibt → mehr echte Lokaldaten (Tierärzte-Dichte, lokale Futter-Läden, regionale
  Preis-Abweichung aus `price_history`) **oder** Schwelle auf ≥ 250 k anheben.

### `lebensphase/*` (4 Seiten) — **anreichern** (Enrichment, nicht `noindex`)
Zielkeywords sind stark (`welpenfutter`, `seniorfutter`, `junghund futter`).
`noindex` wäre falsch. Aufgabe (eigener Commit, `content-engineer`):
- redaktionellen Body von ~150 → ≥ 400 sinnvolle Wörter: Nährstoff-Zielwerte je
  Phase (Protein/Fett/Ca-P), typische Fehler, Umstellungs-Fahrplan, Portionslogik.
- Prüfen, warum die DB-Produkt-Tabelle serverseitig leer bleibt (Query-Fehler? nur
  im Client?). Der Produktblock muss serverseitig gerendert im HTML stehen.
- 3–6 kuratierte interne Links (→ passende Rassen, `/problem/*`, `/futtertyp/*`).

### `futtertyp/*` — **anreichern (leicht) + DB-Re-Audit**
`trockenfutter` / `barf` unter 350 W. Erst mit `DATABASE_URL` gegenmessen (Produkt-
tabelle zählt mit). Bleibt es dünn: je Typ 2–3 Absätze (Herstellung, Vor-/Nachteile,
für welchen Hund, Kostenrahmen aus DB) ergänzen.

### `tipps-kategorie/*` — **Link-Hygiene**
Inhaltlich reich (2500–3200 W), aber je Seite **102 interne Links** (die volle
100-Tipps-Liste + Nav). Empfehlung: Tipp-Liste auf der Kategorie-Seite auf die
Top 20–30 kürzen bzw. paginieren, Rest über Suche/Filter. Reduziert Link-Equity-
Verwässerung und Seitengewicht.

### `glossar/*` — **blockiert bis DB-Re-Audit**
Lokal nur `notFound()`. Mit DB neu messen. Erwartung: Einzelbegriff-Seiten
(`rct`, `epa`, `mct` …) sind knapp. Optionen dann: (a) je Begriff auf ≥ 200 W
mit Kontext/Studienbezug/Praxisrelevanz anreichern, oder (b) dünne Begriffe zu
Themen-Clustern zusammenlegen (`/glossar/studien-methodik` fasst `rct`,
`meta-analyse`, `in-vitro`, `in-vivo` …), Einzel-Slugs → 301.

### `sitemap.ts` — **1 Bereinigung offen (nach DB-Re-Audit)**
`GLOSSAR_SLUGS` (24) und `WISSENS_HUBS` (8) sind hartkodiert. Wenn der DB-Lauf
zeigt, dass einzelne Slugs `notFound()` liefern → aus der Sitemap nehmen bzw.
Sitemap aus der DB-Liste generieren statt aus der Konstante.

---

## Nächste Schritte (Reihenfolge)

1. **`DATABASE_URL` setzen, `npm run audit:content` erneut, diesen Report ersetzen.**
2. `lebensphase/*` anreichern (größter, klarster Hebel).
3. `futtertyp/*` gegenmessen, ggf. anreichern.
4. `glossar/*` Entscheidung (anreichern vs. Cluster-Merge) + Sitemap-Bereinigung.
5. `tipps-kategorie/*` Link-Kürzung.
6. Danach Operation 4.4 (interner Cluster-Graph) — baut auf den hier bestätigten
   „wertigen" Seiten auf.
