# Interner-Link-Audit — 2026-09-04

Quelle: `http://localhost:3144` · Menge: 59 Money-/Hub-Seiten · Chrome (nav/header/footer) ausgeschlossen.

| URL | Money | raus | rein | Tiefe | Flags |
|---|:--:|--:|--:|--:|---|
| `/` |  | 197 | 58 | 0 | — |
| `/rassen` | € | 186 | 1 | ∞ | ⚠ dünn |
| `/hundefutter-test` | € | 7 | 2 | 2 | ⚠ dünn |
| `/vergleich` |  | 9 | 2 | 1 | — |
| `/tipps` |  | 15 | 14 | 3 | — |
| `/warum-bella` |  | 7 | 4 | 1 | — |
| `/hundefutter-marken` |  | 8 | 2 | 2 | — |
| `/tools/futter-finder` |  | 5 | 1 | ∞ | — |
| `/hochwertiges-hundefutter` |  | 9 | 0 | ∞ | 🚩 Orphan |
| `/problem/allergie` | € | 12 | 13 | 1 | — |
| `/problem/futtermittelunvertraeglichkeit` | € | 12 | 8 | 2 | — |
| `/problem/sensibler-magen` | € | 12 | 7 | 1 | — |
| `/problem/durchfall` | € | 12 | 3 | 2 | — |
| `/problem/uebergewicht` | € | 13 | 7 | 2 | — |
| `/problem/untergewicht` | € | 10 | 3 | 2 | — |
| `/problem/gelenkprobleme` | € | 11 | 4 | 2 | — |
| `/problem/arthrose` | € | 12 | 4 | 2 | — |
| `/problem/nierenprobleme` | € | 10 | 4 | 2 | — |
| `/problem/leberprobleme` | € | 10 | 3 | 3 | — |
| `/problem/diabetes` | € | 11 | 4 | 3 | — |
| `/problem/pankreatitis` | € | 11 | 6 | 2 | — |
| `/problem/haut-und-fell` | € | 11 | 6 | 2 | — |
| `/problem/zahnsteine` | € | 9 | 4 | 2 | — |
| `/futtertyp/trockenfutter` | € | 16 | 18 | 1 | — |
| `/futtertyp/nassfutter` | € | 16 | 19 | 1 | — |
| `/futtertyp/barf` | € | 16 | 14 | 1 | — |
| `/futtertyp/kaltgepresst` | € | 16 | 16 | 2 | — |
| `/futtertyp/getreidefrei` | € | 16 | 14 | 2 | — |
| `/futtertyp/hypoallergen` | € | 15 | 12 | 2 | — |
| `/futtertyp/monoprotein` | € | 16 | 14 | 2 | — |
| `/futtertyp/insekten` | € | 15 | 11 | 2 | — |
| `/futtertyp/vegetarisch` | € | 14 | 9 | 2 | — |
| `/futtertyp/vegan` | € | 14 | 9 | 2 | — |
| `/lebensphase/welpen` | € | 6 | 5 | 1 | — |
| `/lebensphase/junghund` | € | 6 | 3 | 2 | — |
| `/lebensphase/adult` | € | 6 | 3 | 2 | — |
| `/lebensphase/senior` | € | 6 | 8 | 1 | — |
| `/vergleich/barf-vs-trockenfutter` | € | 7 | 8 | 2 | — |
| `/vergleich/trockenfutter-vs-nassfutter` | € | 7 | 6 | 2 | — |
| `/vergleich/nassfutter-vs-barf` | € | 13 | 2 | 2 | ⚠ dünn |
| `/vergleich/kaltgepresst-vs-extrudiert` | € | 10 | 2 | 2 | ⚠ dünn |
| `/vergleich/monoprotein-vs-mehrkomponenten` | € | 10 | 6 | 2 | — |
| `/vergleich/getreidefrei-vs-mit-getreide` | € | 9 | 7 | 2 | — |
| `/vergleich/premium-vs-budget` | € | 11 | 7 | 2 | — |
| `/vergleich/insektenfutter-vs-huehnchen` | € | 10 | 6 | 2 | — |
| `/tipps/ernaehrung` |  | 97 | 2 | 3 | — |
| `/tipps/abnehmen` |  | 102 | 3 | 3 | — |
| `/tipps/diaet` |  | 101 | 1 | 4 | ⚠ tief |
| `/tipps/sport-bewegung` |  | 101 | 1 | 4 | ⚠ tief |
| `/tipps/gesundheit` |  | 102 | 2 | 4 | ⚠ tief |
| `/tipps/welpen` |  | 102 | 1 | 4 | ⚠ tief |
| `/tipps/senior-hund` |  | 102 | 3 | 3 | — |
| `/tipps/allergien` |  | 102 | 3 | 2 | — |
| `/tipps/fell-haut` |  | 102 | 2 | 3 | — |
| `/tipps/zaehne` |  | 102 | 2 | 3 | — |
| `/tipps/barf` |  | 102 | 1 | 4 | ⚠ tief |
| `/tipps/verdauung` |  | 102 | 4 | 2 | — |
| `/tipps/leckerlies` |  | 102 | 1 | 4 | ⚠ tief |
| `/tipps/hydration` |  | 102 | 1 | 4 | ⚠ tief |

**1** Orphans · **4** dünne Money-Seiten (< 3 rein) · **0** Sackgassen (< 3 raus).


---

## Befund & Umsetzung (Teil 1 — Problem-Cluster)

**Ursache der Verwaisung:** `src/app/problem/[slug]/page.tsx` verlinkte mit
`PROBLEMS.filter(...).slice(0, 8)` — also immer die **ersten 8** aus dem Array.
Die hinteren Slugs (`leberprobleme`, `diabetes`, `pankreatitis`, `zahnsteine` …)
bekamen so 0–1 kontextuelle eingehende Links.

**Fix:** `src/lib/linking/graph.ts` (`PROBLEM_CLUSTER`) — kuratierte 4–7 verwandte
Seiten je Problem, gemischt (Geschwister-Problem + Futtertyp + Vergleich +
Tipp-Kategorie). `src/components/RelatedLinks.tsx` rendert sie. Jeder der 14
Problem-Slugs taucht jetzt in ≥ 3 anderen Listen auf.

**Ergebnis (`npm run audit:links`):**

| | vorher | nachher |
|---|--:|--:|
| Orphans (0 rein) | 2 | 1 |
| dünne Money-Seiten (< 3 rein) | 7 | 4 |
| `/problem/*` mit < 3 rein | 5 | **0** |
| `/problem/leberprobleme` rein | 0 | 3 |

Nebeneffekt: 8 von 14 `/tipps/*`-Kategorien bekommen jetzt kontextuelle
eingehende Links von den Problem-Seiten (vorher nur von `/tipps`).

## Offen (Teil 2)

| Flag | Seite(n) | Plan |
|---|---|---|
| 🚩 Orphan | `/hochwertiges-hundefutter` | Link aus `/hundefutter-test`, `/warum-bella`, `/futtertyp/*`-Cluster |
| ⚠ dünn | `/rassen` (1 rein, Tiefe ∞) | kontextueller Link aus `/`, `/problem/*` („betroffene Rassen"), `/lebensphase/*` |
| ⚠ dünn | `/hundefutter-test` (2) | aus `/warum-bella`, `/hundefutter-marken`, `/vergleich` |
| ⚠ dünn | `/vergleich/nassfutter-vs-barf`, `/vergleich/kaltgepresst-vs-extrudiert` (2) | `FUTTERTYP_CLUSTER` + `VERGLEICH_CLUSTER` in `graph.ts`, `<RelatedLinks>` in `/futtertyp/[slug]` + `/vergleich/[static]` |
| Tiefe ∞ | `/tipps/*`, `/tools/futter-finder` | kontextuelle Links aus Hub-Seiten statt nur Nav |

Danach: `<RelatedLinks>` auch in `/rasse/[slug]` (Rasse → typische Probleme +
Lebensphase + Futtertyp) und `/lebensphase/[slug]`.
