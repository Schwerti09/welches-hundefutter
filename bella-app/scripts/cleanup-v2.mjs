import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);

// Precise junk patterns. Z Fold / Z Flip are REAL phones — do NOT touch those.
const JUNK = [
  "%smarttag%", "%smart tag%", "galaxy ring", "%galaxy ring%",
  "%tracker%", "%stylus%", "%s pen%", "%s-pen%", "%pencil%",
  "%galaxy buds%", "%buds3%", "%buds 3%", "%buds2%", "%buds live%", "%buds fe%",
  "%flip cover%", "%clear case%", "%silicone case%", "%schutzh%",
  "%charger%", "%ladeger%", "%power adapter%", "%netzteil%",
  "%galaxy fit%", "%galaxy watch%", "%smart ring%",
];

async function main() {
  const [before] = await sql`SELECT COUNT(*)::int n FROM offers`;
  console.log("Vorher:", before.n);
  for (const pat of JUNK) {
    await sql`DELETE FROM offers WHERE device_name ILIKE ${pat}`;
  }
  const [after] = await sql`SELECT COUNT(*)::int n, COUNT(DISTINCT device_name)::int d FROM offers`;
  console.log("Nachher:", after.n, "Angebote ·", after.d, "Geräte");

  // verify cheapest are real phones now
  const cheap = await sql`SELECT DISTINCT device_name, MIN(monthly_price) mp FROM offers GROUP BY device_name ORDER BY mp ASC LIMIT 12`;
  console.log("\nGünstigste Geräte (sollten Hunds sein):");
  cheap.forEach(c => console.log(`  ${c.mp}€ ${c.device_name}`));

  // verify Z Fold/Flip survived
  const folds = await sql`SELECT DISTINCT device_name FROM offers WHERE device_name ILIKE '%fold%' OR device_name ILIKE '%flip%' LIMIT 8`;
  console.log("\nFaltbare (müssen erhalten bleiben):");
  folds.forEach(f => console.log("  " + f.device_name));
}
main().then(() => console.log("\n✓ Fertig")).catch(e => { console.error(e); process.exit(1); });
