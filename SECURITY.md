# Sicherheit

## Eine Schwachstelle melden

Wenn du ein Sicherheitsproblem in **welches-hundefutter.today** (BELLA) findest,
melde es bitte **nicht** über ein öffentliches GitHub-Issue.

**Kontakt:** `support@welches-hundefutter.today`
(Betreff mit `[Security]` beginnen)

Bitte gib an:
- betroffene URL / Endpoint / Datei
- Schritte zur Reproduktion (ein `curl`-Beispiel hilft sehr)
- mögliche Auswirkung
- optional: ein Vorschlag zur Behebung

Wir bestätigen den Eingang in der Regel innerhalb von **72 Stunden** und halten dich
über den Stand auf dem Laufenden.

## Umfang

Im Umfang:
- die Web-App unter `welches-hundefutter.today` und ihre API-Routen (`/api/*`)
- die Netlify Edge/Scheduled Functions in `bella-app/netlify/functions/`
- der Code in diesem Repository

Nicht im Umfang:
- Drittanbieter (Netlify, Neon, AWIN/AdCell, Google/Anthropic, Resend) — bitte
  direkt an den jeweiligen Anbieter melden
- Volumen-/Lasttests, automatisiertes Scannen mit hoher Frequenz
- Social Engineering, physischer Zugang
- fehlende „Best-Practice"-Header ohne konkrete Auswirkung

## Kein Bug-Bounty

Wir zahlen aktuell keine Prämien, sind aber für **verantwortungsvolle Offenlegung**
dankbar und nennen dich auf Wunsch in den Release-Notes.

## Was schon abgesichert ist (Kontext)

- CSP + `Cross-Origin-Opener-Policy` (`bella-app/next.config.ts`)
- Rate-Limit + Herkunfts-Prüfung auf den LLM-Routen und `/api/track`
- Allergen-Garantie im Berater: ein gemiedenes Protein landet nie in der
  Empfehlungs-Payload — per Test im Netlify-Build abgesichert
- keine Cookies / kein PII im First-Party-Analytics
- alle Secrets liegen in der Netlify-UI, nicht im Repo
