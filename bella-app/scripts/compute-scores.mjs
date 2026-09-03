/**
 * BELLA Futter-Score — berechnet score für alle aktiven dog_foods.
 *
 * Formel (0-98, EEAT-verteidigbar, dokumentiert in /analyse/methodik):
 *   35  Basis
 *  +18  Proteinquelle benannt (Huhn, Lachs, Rind, …)
 *  +12  Getreidefrei (is_grain_free)
 *  +10  Hypoallergen (is_hypoallergenic)
 *  +15  Preis ≥15 €/kg | +10 ≥8 | +5 ≥4  (Qualitätsstufe)
 *  + 8  Typ BARF / Kaltgepresst | +4 Nassfutter
 *
 * Run: DATABASE_URL="postgres://…" node scripts/compute-scores.mjs
 */
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) { console.error("❌ DATABASE_URL fehlt"); process.exit(1); }
const sql = neon(url);

console.log("🧮 Futter-Score berechnen…");

const raw = await sql.query(`
  UPDATE dog_foods SET score = GREATEST(28, LEAST(98,
    35
    + CASE WHEN protein <> '' AND protein IS NOT NULL THEN 18 ELSE 0 END
    + CASE WHEN is_grain_free  = true THEN 12 ELSE 0 END
    + CASE WHEN is_hypoallergenic = true THEN 10 ELSE 0 END
    + CASE WHEN price_per_kg >= 15 THEN 15
           WHEN price_per_kg >= 8  THEN 10
           WHEN price_per_kg >= 4  THEN  5
           ELSE 0 END
    + CASE WHEN type IN ('barf','kaltgepresst') THEN 8
           WHEN type = 'nass' THEN 4
           ELSE 0 END
  ))
  WHERE is_active = true
  RETURNING score
`, []);

const rows = (raw.rows ?? raw) ?? [];
const scores = rows.map(r => r.score);
const dist = { premium: 0, gut: 0, basis: 0 };
scores.forEach(s => {
  if (s >= 75) dist.premium++;
  else if (s >= 55) dist.gut++;
  else dist.basis++;
});

console.log(`✅ ${scores.length} Produkte bewertet`);
console.log(`   Premium (≥75): ${dist.premium} | Gut (55–74): ${dist.gut} | Basis (<55): ${dist.basis}`);
console.log(`   Min: ${Math.min(...scores)} | Max: ${Math.max(...scores)} | Ø: ${Math.round(scores.reduce((a,b)=>a+b,0)/scores.length)}`);
