# Runbook — Resend (Transaktions-E-Mail) einrichten

> Der **Code ist komplett** (`src/lib/email.ts`, alle Flows, Cron-Funktionen).
> Ohne `RESEND_API_KEY` wird nichts versendet, sondern nur geloggt
> (`[email:skipped no RESEND_API_KEY]`) — Dev/Build brechen nie.
> Hier fehlt nur die **Account-/DNS-Seite** + 2–3 Netlify-Env-Variablen.

## Was schon steht (kein Handlungsbedarf)

| Baustein | Datei |
|---|---|
| Versand-Helfer (Resend REST, ohne SDK) + Graceful-Degrade | `bella-app/src/lib/email.ts` |
| Templates: DOI, Welcome, Preis-Alarm, Magic-Link | `bella-app/src/lib/email.ts` |
| **Double-Opt-in**: `subscribe` → DOI-Mail, `confirm` → Welcome, `unsubscribe` | `src/app/api/alerts/*` |
| Consent-Nachweis (IP + UA + Zeit) in `subscribers` | DB-Spalten vorhanden |
| Profil-Magic-Link | `src/app/api/auth/magic`, `.../profile-link` |
| Preis-Wecker-Cron (sendet echte Preisstürze) | `netlify/functions/price-alerts.mts` |
| Outcome-Check-Cron | `netlify/functions/outcome-checks.mts` |
| Manuelles Outreach | `src/app/api/outreach/send` + `/admin/outreach` |
| Datenschutzerklärung nennt Resend als Auftragsverarbeiter | `src/app/datenschutz/page.tsx` |

Abmeldelink ist in jeder Mail; `unsubscribe` legt zusätzlich die Wecker still.

---

## Schritte

### 1. Resend-Account + API-Key
- [ ] Account auf resend.com anlegen.
- [ ] **API Keys → Create** → Berechtigung „Sending access", Name z. B. `bella-prod`.
      Key sofort kopieren (`re_…`), wird nur einmal gezeigt.

### 2. Absender-Domain verifizieren  ← der eigentliche Aufwand
**Empfehlung: eigene Subdomain** für Transaktionsmail — schützt die Reputation der
Root-Domain und vereinfacht DMARC.

- [ ] Resend → **Domains → Add Domain** → `send.welches-hundefutter.today`
      (oder direkt `welches-hundefutter.today`, wenn keine Subdomain gewünscht).
- [ ] Resend zeigt DNS-Records. Beim Domain-Registrar / DNS-Provider eintragen:
  - **SPF** (`TXT` auf der Mail-Domain): `v=spf1 include:amazonses.com ~all`
  - **DKIM** (3× `CNAME`, `resend._domainkey…` o. ä. — exakt aus Resend übernehmen)
  - **DMARC** (`TXT` auf `_dmarc.…`), Einstieg mild:
    `v=DMARC1; p=none; rua=mailto:dmarc@welches-hundefutter.today`
- [ ] In Resend **Verify** klicken. Propagation kann 15 min – wenige Stunden dauern.
      Status muss **„Verified"** sein, sonst landet alles im Spam / wird abgelehnt.

### 3. Netlify-Env setzen
Netlify → Site → **Environment variables**:

| Variable | Wert | Pflicht |
|---|---|---|
| `RESEND_API_KEY` | `re_…` aus Schritt 1 | ja |
| `EMAIL_FROM` | `BELLA <bella@send.welches-hundefutter.today>` — **Domain muss zur verifizierten passen** | ja (Default `bella@welches-hundefutter.today` ist sonst evtl. nicht verifiziert) |
| `SITE_URL` | `https://welches-hundefutter.today` | schon gesetzt |

> Für die Scheduled Functions (`price-alerts`, `outcome-checks`) gelten dieselben Vars —
> Netlify-Env greift für Build **und** Functions.

### 4. Deploy
- [ ] Neuen Deploy auslösen (leerer Commit oder Netlify „Trigger deploy"), damit
      Functions + SSR die neuen Env-Werte sehen.

### 5. End-to-End testen (Prod)
```bash
# DOI-Mail auslösen (echte Adresse eintragen):
curl -s -X POST https://welches-hundefutter.today/api/alerts/subscribe \
  -H 'content-type: application/json' \
  -d '{"email":"DEINE@ADRESSE.de","foodName":"Testfutter"}'
# → {"ok":true,"status":"pending"}  und eine „Bitte bestätige…"-Mail muss ankommen
```
- [ ] Mail kommt an (Posteingang, **nicht** Spam) — Absender, Logo, Button prüfen.
- [ ] Bestätigungs-Button → landet auf `…/preis-wecker?status=confirmed`, Welcome-Mail kommt.
- [ ] Abmeldelink in der Welcome-Mail → `…?status=unsubscribed`.
- [ ] Resend-Dashboard → **Logs**: 2 zugestellte Mails, `delivered`.
- [ ] Danach die Test-Zeile aus `subscribers` / `price_alerts` in Neon löschen
      (`where email = 'DEINE@ADRESSE.de'`).

### 6. Zustellbarkeit prüfen (einmalig)
- [ ] mail-tester.com: Test-Mail hinschicken, Ziel ≥ 8/10.
- [ ] Nach ein paar Tagen DMARC-Reports checken, dann ggf. `p=none` → `p=quarantine`.

---

## Bekannte Kleinigkeiten

- `.env.example` und die Code-Defaults nannten unterschiedliche From-Adressen
  (`hallo@` vs. `bella@`). Der **Netlify-Wert `EMAIL_FROM` ist maßgeblich** — dort die
  korrekte, zur verifizierten Domain passende Adresse eintragen.
- `run-price-alerts.mjs` / `run-outcome-checks.mjs` haben eigene `FROM`-Defaults
  (`bella@welches-hundefutter.today`) — auch die überschreibt `EMAIL_FROM`.
- Ohne verifizierte Domain schickt Resend nur an die **eigene** Account-Adresse
  (Test-Modus) — für echte Empfänger ist Schritt 2 zwingend.
