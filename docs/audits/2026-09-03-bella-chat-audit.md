# Audit: BELLA-Chat / Advisor — 2026-09-03

> Status: Audit (Ist-Analyse). Behebung: `../../BELLA_NEXT_LEVEL.md` **Phase 2A**.
> Auslöser: Prod-Testgespräch — allergischer Hund bekam Huhn-Futter als Empfehlung,
> Karten nicht kaufbar. „Sonst kann keiner was kaufen."

## Zusammenfassung

Der Berater hat in einem realen Gespräch (Deutscher Schäferhund, 31 kg, ausgewachsen,
Fellprobleme, **Hühnerallergie**) **drei Huhn-haltige Produkte empfohlen** — darunter einen
**Snack** als Hauptfutter — jedes Karten-Label „Passt: Huhn". BELLAs Text erkannte die Allergie
korrekt und lehnte alle drei ab; die **Karten wurden trotzdem als kaufbare Affiliate-Links
gerendert**, ein Futter-Pass + Preis-Wecker wurde auf den Huhn-Snack angelegt.

Kernursache: **`sensitive` (Allergie-Flag) wurde nie gesetzt**, weil die Trigger-Regex
„fell fällt aus" und ein bloßes „huhn" (als Antwort auf die Allergiefrage) nicht erkennt.
Dadurch wurde „Huhn" als **Wunsch-Protein** interpretiert → im SQL **+16 geboostet**, im
Score **+12** mit Begründung „Passt: Huhn", und der **namensbasierte Allergen-Ausschluss lief
nicht** (`allergen = intent.sensitive ? intent.protein : null` → `null`).

## Befunde

### 🔴 KRITISCH — Allergen-Sicherheit (Tier + Vertrauen + Umsatz)

| # | Befund | Beleg |
|---|---|---|
| A1 | `parseIntent` setzt `sensitive` nie aus Allergie-Kontext. Trigger-Regex kennt nicht: „ohne/kein X", „reagiert auf X", „verträgt kein X", bloßes Protein als Antwort auf „welche Allergien?", Symptome (fell, haut, haarausfall, juckt, pfoten lecken, ohren, schuppen, hotspot). | `src/lib/advisor/intent.ts` Z. ~50, ~55 |
| A2 | Gefährliche Asymmetrie: `protein` **ohne** `sensitive` = *Wunsch* → Allergen wird **geboostet** (SQL `protein ILIKE` +16; `scoreFood` +12; Begründung „Passt: X"). Kein Feld für „dieses Protein ist der Feind" getrennt vom Wunsch-Protein. | `route.ts` `fetchCandidates` Z. 133–134; `scoring.ts` Z. ~40 |
| A3 | Namensbasierter Ausschluss läuft nur bei `intent.sensitive === true` **und** `intent.protein` gesetzt. Allergen bekannt, `sensitive` unset → **null Filterung**. | `route.ts` Z. 155–158 |
| A4 | Kein SQL-Hard-Filter für das Allergen — nur Post-Fetch `containsAllergen(name + protein)`. `protein` ist „oft NULL", `dog_foods` hat **keine `ingredients`-Spalte** → Produkte ohne Protein-Tag & ohne Allergen im Namen schlüpfen durch. | Schema `src/db/schema.ts`; `route.ts` Z. 157 |
| A5 | **Kein Netz, wenn alle Kandidaten unsicher sind.** Nach Ausschluss leeres `offers` → es wird trotzdem `OFFERS:` mit den (ungefilterten) Produkten emittiert; keine Re-Query, keine ehrliche Leermeldung. | `route.ts` Z. 336–358, 412–428 |
| A6 | Die `OFFERS:`-Karten werden **unabhängig vom LLM-Urteil** gerendert. BELLA-Text „kauf keins davon" + drei kaufbare Huhn-Karten gleichzeitig. | `route.ts` Z. 428 (immer emittiert) |
| A7 | Futter-Pass + Preis-Wecker werden für das unsichere Produkt angelegt (`current_food_slug` = Huhn-Snack). Nachschub-/Re-Kauf-Mails würden das Allergen pushen. | `route.ts` Z. 453–509 |
| A8 | **Snack als Hauptfutter empfohlen** („DOKAS Hundesnack Hühnchen"). `fetchCandidates` hat keinen `type <> 'snack'`-Guard (die Rasse-Seite schon). | `route.ts` `fetchCandidates` Z. 109–119 |
| A9 | `known`-Zeile im System-Prompt lässt die Allergie komplett weg, wenn `sensitive` false — der Text-LLM bekommt **kein** strukturiertes Allergie-Signal, nur rohe History. | `route.ts` Z. 192 |

### 🟠 HOCH — „keiner kann was kaufen" / Empfehlungsqualität

| # | Befund |
|---|---|
| B1 | LLM-Intent-Pfad-Gate (`intentSignalCount < 3`) greift genau im wichtigsten Fall nicht: Rasse + Lebensphase + (mis-getyptes) Protein = 3 Signale → LLM läuft nicht, der Regex-Fehler steht. |
| B2 | Prompt-Framing: DB-Ergebnisse als „ANALYSIERTE FUTTER-PRODUKTE" ohne Kontext → LLM sagt „die drei Produkte, die **du** mir genannt hast". Der Halter hat nichts genannt. |
| B3 | Keine Re-Query-Schleife. Ein Versuch; sind die 3 Kandidaten schlecht → Sackgasse, BELLA bittet den Halter, „Produkte zu nennen". |
| B4 | `fetchCandidates`: `DISTINCT ON (name) … ORDER BY price ASC` **innen**, `LIMIT 40`, Ausschluss **danach** in JS. Bei vielen Huhn-Produkten sind die billigsten 40 evtl. alle Huhn → man filtert sich auf 0. Ausschluss gehört in `WHERE` **oder** der Pool muss deutlich größer sein. |
| B5 | Symptome („fell fällt aus") werden nie zu `sensitive` + `healthFlags` → kein hypoallergen-Boost, kein passendes Cross-Sell. |

### 🟡 MITTEL — Robustheit / Ehrlichkeit

| # | Befund |
|---|---|
| C1 | `catch { fullText = "" }` auf beiden LLM-Calls — stille Fehler (bereits Roadmap Op 2.3). |
| C2 | `computeConfidence` zeigt hohe % trotz falschem Intent. |
| C3 | `ELIM:`-Events emittieren **erfundene** Zahlen (`eliminated * 0.4` „Zu teuer", `* 0.25` „Nicht allergikergeeignet") — Regel „keine erfundenen Zahlen". |
| C4 | Studien-Block zitiert dieselbe 2024-Studie auf **jeder** Empfehlung (3× im Transkript), unabhängig von Passung. |
| C5 | Packungsgrößen-Schätzung: „0,1 kg-Packung" für „70g x 12 Stk" — `pkgMatch` greift den falschen Wert, Unsinn wird dem Halter gezeigt. |
| C6 | `dog_profiles.allergies` = `intent.sensitive && intent.protein ? [intent.protein] : null` → mit dem Bug **null**, obwohl Hühnerallergie bekannt. |
| C7 | Cross-Sell-Query: `OR category IN ('snack','zeckenschutz')` → **jedes** Snack-/Zeckenschutz-Produkt qualifiziert als „Begleiter", egal ob relevant → „Kettenanhänger Verbinder" als „natürlicher Zeckenschutz". Mix aus Query-Logik + Datenmüll in `cross_sell`. |

### ⚪ NIEDRIG / Politur

- D1 Alles (Confidence, known, missing, theme) hängt an einem `intent`-Objekt, das still falsch sein kann.
- D2 `theme` in `OFFERS` kommt aus `classifyTheme` → auch vom kaputten `sensitive` abhängig.
- D3 „🏆 Stiftung Warentest" / „💬 Meinungen"-Badges auf jeder Karte, unabhängig von echten Daten.

## Abhängigkeit / Grenze

Echte **zutatenbasierte** Allergen-Erkennung braucht eine `ingredients`-Spalte in `dog_foods`
(Feed-Pipeline-Änderung, `feed-engineer`). Bis dahin: Ausschluss über `protein`-Feld + Produktname
+ `category`/`type` — plus die harte Regel „im Zweifel NICHT empfehlen".
