# Drizzle-Migrationen

Quelle der Wahrheit fürs Schema: `../src/db/schema.ts`.
Generierte SQL-Migrationen liegen hier, versioniert und reviewbar.

## Befehle

```bash
npm run db:generate   # schema.ts -> neue Migration in drizzle/
npm run db:migrate    # offene Migrationen gegen $DATABASE_URL anwenden
npm run db:push       # schema.ts direkt in die DB pushen (Dev / schneller Prototyp)
```

## `0000_baseline.sql` — wichtig

Die **produktive Neon-DB existiert schon** und wurde bisher per `drizzle-kit push`
(ohne Migrations-Historie) gepflegt. `0000_baseline.sql` bildet den kompletten
Ist-Stand als `CREATE TABLE` ab.

**Gegen die bestehende Prod-DB NICHT blind `db:migrate` laufen lassen** — die Tabellen
sind schon da, plain `CREATE TABLE` würde scheitern. Einmalige Baseline-Übernahme:

```bash
# markiert 0000_baseline als angewendet, ohne die Statements auszuführen
# (Drizzle legt dafür __drizzle_migrations an):
DATABASE_URL=... npx drizzle-kit migrate --config drizzle.config.ts   # nur wenn DB leer
# ODER manuell: __drizzle_migrations-Zeile für 0000_baseline eintragen.
```

Für eine **frische** DB (lokal, Preview, Test) ist `db:migrate` der normale Weg.

Ab `0001_*` gilt: jede Schema-Änderung → `npm run db:generate` → SQL im selben PR committen.
Kein `CREATE TABLE` mehr im Request-Pfad (Roadmap Op 1.5).
