import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
const rows = await sql`SELECT slug, brand, name FROM dog_foods WHERE brand ILIKE '%terra canis%' ORDER BY slug LIMIT 20`;
console.log(JSON.stringify(rows, null, 2));
