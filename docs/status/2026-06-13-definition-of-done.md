# BELLA — Definition of Done (Stand: 13.06.2026)

> Status: Archiv (Zeitpunkt-Snapshot). Der noch offene Off-Page-Teil ist in `../../BELLA_NEXT_LEVEL.md` TEIL 3 „Off-Page" übernommen. Die projektweite Definition of Done steht dort in TEIL 6.

Ehrliche Gesamtdurchsicht aller Pläne (GEO-Protokoll A–J, DACH-Plan, Agents).
Kernsatz vorweg: **Der Code ist zu ~90 % fertig. Was zum „wirklich fertig" fehlt,
ist überwiegend KEIN Code mehr — sondern Off-Page-Arbeit, die kein Commit löst.**

---

## A) Fertig & solide (Haken dran)
- **Block A** (KI-Crawler-Zugriff, IndexNow, Bytespider-Block, alles im initialen HTML)
- **Block B** (Citation Engineering: Antwort-zuerst, Originaldaten-Report, zitierfähige Statistiken, Methodik/Transparenz)
- **Block D** (Speakable, konversationelle FAQs, HowTo-Portionsrechner)
- **Block H** (maschinenlesbares Produkt-Schema, `/data/catalog.json`)
- **Block I** (Article-Schema, E-E-A-T) — bis auf Tierarzt-Review (siehe C)
- **Block J1** (KI-Sichtbarkeits-Tracking, wöchentlich)
- **Entität** (Block C1): Organization + Person konsolidiert, 5 sameAs-Profile verdrahtet, HANSI-Leaks raus, Logo existiert
- **Header/Logo** (NEU, 13.06.): globaler Header mit Marke + Navigation — schließt das interne Verlinkungsloch
- **Produkt-`image`-Schema-Fehler** (GSC) defensiv gelöst
- **Block G — Core Web Vitals** (NEU, 13.06.): Lighthouse 100/100 erreicht
- **Futter-Pass-Steckbrief** (NEU, 13.06.): 404 auf `/hund/[share_token]` gefixt (Next-16-`params`-Promise)

## B) Code, der noch sinnvoll ist
1. **F2 — Bild-SEO**: sprechende Dateinamen + Alt-Texte im Maßstab. Modest, aber legitim.
2. **A3 (llms-full.txt) / A4 (Bot-Logging)**: nice-to-have, geringe Wirkung. Würde ich
   hintanstellen.

→ Hier ist nichts, was die Nadel allein bewegt. Wer „fertig" über mehr Code
definiert, optimiert ab hier Nachkommastellen.

## C) KEIN Code — das ist die eigentliche Ziellinie (und der Flaschenhals)
Diese vier entscheiden, ob du rankst und zitiert wirst. Keiner ist ein Commit.
1. **C4 — Digital PR über Originaldaten ⭐ (höchste Wirkung von allem, was noch offen ist).**
   Den Preisindex quartalsweise als fertige Pressemitteilung mit Grafik an Tier-Magazine,
   Lokalzeitungen, Pet-Blogger. Datenjournalismus ist die EINZIGE skalierbare Backlink-Quelle
   für eine Affiliate-Seite. Ohne erste echte Backlinks bleibt alles andere ein Auto ohne Sprit.
2. **C5 — Profil-Rückverlinkungen scharf machen.** Die 5 sameAs-Einträge sind im Code, aber
   zählen erst mit Rücklink: Pinterest-Claim bestätigen, Website-Feld bei LinkedIn/YouTube/X,
   LinkedIn-Anzeigename auf „Rolf Schwertfechter". (Details: ENTITY_BRIDGE.md)
3. **Tierarzt-Review (DACH 1.1 + entsperrt Block I `reviewedBy`).** Deine Outreach-Drafts
   liegen — noch nicht verschickt. Ein echter Tierarzt-Review ist doppelt wertvoll:
   E-E-A-T-Signal UND potenzieller Backlink/Erwähnung. Sobald `REVIEWER` echt befüllt ist,
   geht das `reviewedBy`-Schema scharf.
4. **F1 — echte Produktfotos ⭐.** Das Protokoll markiert das als Schlüssel-Differenzierer:
   eigene Fotos, die kein Konkurrent hat. Das ist physische Arbeit, kein Code — aber genau
   das, was KI-Bild- und Multimodal-Suche braucht.

## D) Bewusst zurückgestellt — NICHT anfassen, bis der Auslöser da ist
- **E2/E4** (AT/CH-Verfügbarkeit, CHF-Preise): erst wenn Feeds echte DACH-Daten liefern.
- **DACH Teil 3** (AT/CH-Content-Seiten): erst wenn ein AT-Anker existiert (z. B. Vetmeduni-Wien-Reviewer).
- **C2 (Wikidata)**: erst nach Presseerwähnungen — sonst wird der Eintrag gelöscht.
- **C3 (Reddit/Community)**: hohe Account-Ban-Gefahr, nur als echtes Community-Mitglied. Manuell.

---

## Wenn du nur DREI Dinge machst, dann diese:
1. **Preisindex-Pressepush starten** (C4) — der eine Hebel für die Futter-Keywords.
2. **Die 5 Profil-Rücklinks setzen** (C5) — heute machbar, schließt die Entität ab.
3. **Lighthouse-Report schicken** → Block G — der letzte große Code-Hebel.

Alles andere ist entweder fertig, bewusst geparkt, oder Feinschliff.
