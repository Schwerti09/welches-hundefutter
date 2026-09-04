# Runbook — Datenbank wiederherstellen (Neon)

> Roadmap 6.4. Ziel: Neon-Datenverlust ist überlebbar.
> **Primärer Schutz = Neons eingebaute Historie** (Point-in-Time-Restore /
> Branching). Kein `pg_dump`-Cron nötig, um „nur" zurückzuspringen.

## 0. Sofort-Einschätzung (2 Minuten)

| Frage | Wenn ja → |
|---|---|
| Ist die DB nur **langsam / nicht erreichbar**? | Kein Restore. Neon-Status prüfen, Netlify-Env `DATABASE_URL` prüfen, Function-Logs. |
| Ist eine **einzelne Tabelle** kaputt (falsches Update/Delete)? | Abschnitt **2** (Branch von vor dem Zeitpunkt, Tabelle rüberkopieren). |
| Ist die **ganze DB** weg / korrupt? | Abschnitt **3** (Branch zum Zeitpunkt „vorher" wird zur neuen Primär-DB). |
| Ist der **Neon-Account** weg? | Abschnitt **4** (Kaltstart aus den öffentlichen JSON-Exports + Feed-Pipeline). |

Retention-Fenster prüfen: Neon Console → Project → **Branches** → „History retention".
Free-Tier ≈ 7 Tage. Innerhalb dieses Fensters ist jeder Zeitpunkt wiederherstellbar.

---

## 1. Voraussetzungen

- Zugang zur **Neon Console** (console.neon.tech) für das Projekt der DB.
- Zugang zur **Netlify-UI** (Site → Environment variables), um `DATABASE_URL` zu setzen.
- Lokal: `bella-app/.env.local` mit einer gültigen `DATABASE_URL` (für Verifikation).

---

## 2. Eine Tabelle zurückholen (häufigster Fall)

1. Neon Console → **Branches → Create branch**.
   - „Create branch from": **Time** → Zeitpunkt **vor** dem Schaden wählen.
   - Name z. B. `rescue-2026-09-04`.
2. Connection-String dieses Branches kopieren (Console → Branch → Connection Details).
3. Betroffene Tabelle rüberkopieren — Beispiel `dog_profiles`:
   ```bash
   # in bella-app/, mit RESCUE_URL = Branch, PROD_URL = aktuelle Primär-DB
   node --env-file=.env.local -e '
     const { neon } = await import("@neondatabase/serverless");
     const src = neon(process.env.RESCUE_URL);
     const dst = neon(process.env.PROD_URL);
     const rows = await src`select * from dog_profiles`;
     console.log("Quelle:", rows.length, "Zeilen");
     // Vorher sichern:
     await dst`create table if not exists dog_profiles_bak as table dog_profiles`;
     // ... dann gezielt UPSERTen oder komplette Tabelle ersetzen (mit Bedacht!)
   '
   ```
   > Kein blindes `TRUNCATE` + `INSERT` ohne Backup-Kopie. Erst `*_bak`, dann tauschen.
4. Verifizieren (Zeilenzahl, Stichprobe), `*_bak` nach 1–2 Tagen löschen.

---

## 3. Ganze DB wiederherstellen

1. Neon Console → **Branches → Create branch from Time** → Zeitpunkt vor dem Schaden.
2. Diesen Branch zur **Primär-DB machen**: Neon Console → Branch → **Set as default**
   (oder den alten `main`-Branch umbenennen und den Rescue-Branch zu `main`).
3. **Netlify** → Environment variables → `DATABASE_URL` auf den Connection-String der
   neuen Primär-DB setzen → **Redeploy** auslösen (leerer Commit oder „Trigger deploy").
4. `bella-app/.env.local` lokal ebenfalls aktualisieren.
5. Rauchtest:
   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" https://welches-hundefutter.today/rassen   # 200
   curl -s https://welches-hundefutter.today/api/advisor/chat -X POST \
     -H 'content-type: application/json' -d '{"message":"Labrador, 5 Jahre"}' | head -c 200
   ```
   Der stündliche `health-check.mts` (Function-Log) sollte danach wieder „OK" melden.
6. Datenaktualität: der nächste Feed-Cron (`import-feeds.mts`, 05:00 UTC) frischt
   `dog_foods`/`offers` auf. Bei Eile manuell → siehe `feed-bootstrap.md`.

---

## 4. Neon-Account / Projekt komplett weg (Kaltstart)

Reihenfolge:

1. **Neue Neon-DB** anlegen (oder anderer Postgres-Provider mit gleichem Connection-String-Format).
2. **Schema** aufbauen:
   ```bash
   cd bella-app
   # .env.local mit der NEUEN DATABASE_URL
   npm run db:push          # drizzle-kit push: legt alle Tabellen aus src/db/schema.ts an
   ```
   > Achtung: `schema.ts` und die alte Prod-DB waren gedriftet (siehe Roadmap 1.5-Nachtrag).
   > `db:push` bildet den **schema.ts**-Stand ab. Zusatztabellen der alten DB
   > (`ai_visibility_checks`, `cross_sell`) ggf. per Hand ergänzen.
3. **Katalog** wieder befüllen → `feed-bootstrap.md`.
4. **Statische Inhalte** brauchen keine DB (Rassen/Problem/Tipps kommen aus `src/data/*`).
5. **Verlorene User-Daten** (`dog_profiles`, `subscribers`, `outcome_checks`, `events` …):
   ohne eigenes Backup **verloren**. Deshalb → Teil 2 unten.

---

## Teil 2 — noch offen: automatischer Logical-Backup-Job

`netlify/functions/db-backup.mts` (wöchentlich), reiner JS-Dump der **mutablen /
User-Daten-Tabellen** nach **Netlify Blobs** (`@netlify/blobs`):

```
dog_profiles, subscribers, price_alerts, outcome_checks, chat_logs, events,
community_insights, ai_visibility_checks
```

- pro Tabelle `select *` → NDJSON → `blobs.set("backup/<datum>/<tabelle>.ndjson", …)`
- Retention: die letzten ~8 Wochen behalten, ältere löschen
- Fehlschlag → `logError("db-backup", …)` (landet via `health-check`-Logik im Alert, sobald 6.1 Teil 2 steht)
- Restore-Skript `scripts/db-restore-blobs.mjs`: Blob lesen → `insert … on conflict do update`

**Nicht** gesichert werden müssen: `dog_foods`, `offers`, `price_history` (aus Feeds
regenerierbar), `studies`/`glossary_terms`/`topic_hubs` (aus `src/data` / Seeds).
