# Outreach-Generator — Setup & Nutzung

> Status: ergänzend (Tool-Doku). Kontext: `../BELLA_NEXT_LEVEL.md` Op 4.2 (Tierarzt-Review) + Off-Page.

Schreibt individuelle Erstkontakt-Mails an Tierärzte, Studienautor:innen und Blogger:innen.
**Du prüfst und sendest selbst, einzeln.** Kein Massenversand, kein Cron — bewusst.

## Warum kein Bulk-Versand?
Kalte Massenmails an Tierärzte/Wissenschaftler sind in DE rechtlich heikel (§ 7 UWG),
verbrennen deine Resend-Domain-Reputation (dann landen auch Preis-Alarme im Spam) und
wirken unpersönlich — genau der Vertrauensverlust, der den Backlink kostet. Der Generator
nimmt dir das Zeitfressende ab (Schreiben + Aufhänger), die Verantwortung bleibt bei dir.

## Env-Variablen (in Netlify setzen)
- `OUTREACH_TOKEN` — **neu.** Frei wählbares Geheimwort, schützt die Admin-Seite und die API.
  Ohne dieses Token sind `/api/outreach/*` komplett gesperrt (401).
- `GEMINI_API_KEY` — schon vorhanden (BELLA-Advisor). Wird zum Entwurf-Schreiben genutzt.
- `RESEND_API_KEY` + `EMAIL_FROM` — schon vorhanden (Preis-Alarme). Für den optionalen Versand.

## Nutzung
1. Öffne `/admin/outreach` (nicht verlinkt, `noindex`).
2. Token eintragen.
3. Empfängertyp wählen, Name + echten Aufhänger eingeben (je konkreter, desto besser).
   Beispiel-Aufhänger Tierarzt: „Praxis mit Schwerpunkt Ernährungsberatung, Artikel über
   Gelenkprobleme bei Großrassen auf der Praxis-Website."
4. **Entwurf generieren** → Mail erscheint, editierbar.
5. **Prüfen, einen Satz persönlich machen**, Empfänger-Mail eintragen.
6. Entweder **In Zwischenablage** (aus deinem eigenen Postfach senden — wirkt am persönlichsten)
   oder **Per Resend senden** (nach Sichtprüfung, genau ein Empfänger).

## Empfehlung
20 wirklich gute, individuelle Mails an einem Abend schlagen 500 automatische.
Aus deinem eigenen Postfach zu senden (Zwischenablage-Weg) wirkt oft am stärksten —
Resend-Versand nur, wenn du Volumen brauchst und die Antworten trotzdem persönlich verfolgst.
