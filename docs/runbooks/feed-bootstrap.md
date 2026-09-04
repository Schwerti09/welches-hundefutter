# Runbook — Katalog von Null aufbauen (Feed-Bootstrap)

> Roadmap 6.4. Wann? Nach einem DB-Kaltstart (`db-restore.md` Abschnitt 3/4),
> oder wenn `dog_foods`/`offers` leer/kaputt sind und der nächste Cron zu spät kommt.
>
> Der Katalog ist **immer regenerierbar** — er kommt komplett aus den AWIN-/AdCell-Feeds.
> Nichts davon muss gesichert werden.

## Was der tägliche Cron macht (Referenz)

`netlify/functions/import-feeds.mts` (05:00 UTC):
1. `parseFeeds()` — lädt die Feed-URLs, normalisiert, dedupliziert, erkennt
   Typ/Protein, rechnet €/kg, filtert auf Hundefutter.
2. `loadDogFoods()` — idempotenter Upsert nach Neon (`dog_foods` by slug),
   Lifecycle (`is_active`), `price_history`-Snapshot nur bei Preisänderung.
3. `pingIndexNow()` — meldet geänderte URLs an IndexNow (best effort).

## Manueller Voll-Bootstrap

Voraussetzungen: `bella-app/.env.local` mit `DATABASE_URL` (Ziel-DB) und den
Feed-Variablen (`AWIN_FEED_URLS`, `AWIN_FEED_URLS_EXTRA`, `ADCELL_FEED_URLS`,
`ADCELL_FEED_URLS_EXTRA`) — Werte aus der **Netlify-UI** kopieren.
Python 3.12 + Node 22.

```bash
cd bella-app

# 1) Feeds → scripts/dog_foods.json
python scripts/parse-feeds.py

# 2) dog_foods.json → Neon (Upsert, Lifecycle, price_history)
node --env-file=.env.local scripts/load-dog-foods.mjs

# 3) BELLA-Score für alle aktiven Produkte berechnen
node --env-file=.env.local scripts/compute-scores.mjs

# 4) Cross-Sell-Katalog (Snacks, Versicherung, Zubehör)
python scripts/parse-crosssell.py
node --env-file=.env.local scripts/load-crosssell.mjs

# 5) IndexNow anstoßen (optional)
node --env-file=.env.local scripts/indexnow-ping.mjs
```

Alternativ, wenn die Netlify-Umgebung intakt ist: einfach die Scheduled Function
manuell auslösen — Netlify UI → **Functions → import-feeds → Run** (oder den
Deploy neu triggern und bis 05:00 UTC warten).

## Verifikation

```bash
node --env-file=.env.local -e '
  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(process.env.DATABASE_URL);
  const a = await sql`select count(*)::int n from dog_foods where is_active`;
  const b = await sql`select count(*)::int n from dog_foods where score is not null`;
  const c = await sql`select count(*)::int n from price_history`;
  console.log("aktive dog_foods:", a[0].n, "| mit score:", b[0].n, "| price_history:", c[0].n);
'
curl -s "https://welches-hundefutter.today/api/advisor/chat" -X POST \
  -H 'content-type: application/json' -d '{"message":"Mops, erwachsen, Hühnerallergie"}' | head -c 300
```

Erwartung: mehrere Tausend aktive `dog_foods`, fast alle mit `score`, Advisor liefert
`OFFERS` **ohne** Huhn. Der stündliche `health-check.mts` sollte „OK" loggen.

## Häufige Stolpersteine

- **Feeds leer / 403:** die `*_FEED_URLS` in der Netlify-UI abgelaufen → im AWIN/AdCell-
  Konto neue Download-URLs ziehen, Netlify-Env aktualisieren.
- **`load-dog-foods` schreibt nichts:** `DATABASE_URL` zeigt auf die falsche DB, oder
  `DRY_RUN` steht auf `"true"`.
- **Scores bleiben `null`:** `compute-scores.mjs` vergessen (Schritt 3).
- **Schema-Fehler (`column … does not exist`):** Ziel-DB hat ein älteres Schema →
  `npm run db:push` (siehe `db-restore.md` Abschnitt 4).
