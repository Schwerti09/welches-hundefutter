<!-- Kurz: WAS ändert sich und WARUM. Bezug zu BELLA_NEXT_LEVEL.md (Op-Nummer), falls vorhanden. -->

## Was & warum



## Checkliste

- [ ] `cd bella-app && npm run ci` grün (typecheck + lint + test + build) — das ist der Netlify-Build
- [ ] Betroffene Doku im selben PR aktualisiert (`CLAUDE.md` / `ARCHITECTURE.md` / READMEs / `BELLA_NEXT_LEVEL.md`-Fortschritt)
- [ ] Core Web Vitals nicht schlechter (kein Client-JS, das ein Server Component sein könnte)
- [ ] Bei Advisor-/Katalog-Änderungen: Allergen-Garantie steht (kein gemiedenes Protein in `OFFERS`)
- [ ] Bei Affiliate-Links: `rel="sponsored"` + sichtbare Offenlegung
- [ ] Keine neuen `tsconfig`/ESLint-Excludes, kein Laufzeit-DDL (`grep "CREATE TABLE" src` = 0)
- [ ] Keine Secrets im Diff (alles gehört in die Netlify-UI)

## Nachweis

<!-- Screenshot / curl-Ausgabe / Testlauf, der zeigt dass es funktioniert -->
