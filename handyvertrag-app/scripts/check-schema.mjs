import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
const r = await sql`SELECT birth_or_age, weight_kg, name FROM dog_profiles WHERE birth_or_age IS NOT NULL LIMIT 20`;
r.forEach(p => console.log(`"${p.birth_or_age}" | ${p.weight_kg}kg | ${p.name}`));
console.log(`\nTotal profiles: ${(await sql`SELECT count(*) FROM dog_profiles`)[0].count}`);
