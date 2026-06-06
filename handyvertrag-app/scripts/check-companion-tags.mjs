import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);

const rows = await sql.query(`
  SELECT
    category,
    COUNT(*)::int as total,
    COUNT(*) FILTER (WHERE companion_for IS NOT NULL AND companion_for != '{}')::int as with_tags,
    COUNT(*) FILTER (WHERE companion_for IS NULL OR companion_for = '{}')::int as without_tags
  FROM cross_sell WHERE is_active = true
  GROUP BY category ORDER BY total DESC
`);
const data = (rows.rows ?? rows);
console.log("\ncompanion_for-Abdeckung in cross_sell:\n");
console.log("Kategorie       | Total  | Mit Tags | Ohne Tags | Abdeckung");
console.log("----------------+--------+----------+-----------+-----------");
for (const x of data) {
  const pct = Math.round(x.with_tags / x.total * 100);
  console.log(`${x.category.padEnd(15)} | ${String(x.total).padEnd(6)} | ${String(x.with_tags).padEnd(8)} | ${String(x.without_tags).padEnd(9)} | ${pct}%`);
}

// Welche Issues sind am häufigsten gesetzt?
const issues = await sql.query(`
  SELECT issue_val, COUNT(*)::int as cnt
  FROM cross_sell, jsonb_array_elements_text(COALESCE(companion_for->'issue', '[]')) AS issue_val
  WHERE is_active = true
  GROUP BY issue_val ORDER BY cnt DESC LIMIT 15
`);
console.log("\nHäufigste companion_for.issue-Tags:");
for (const x of (issues.rows ?? issues)) {
  console.log(`  ${x.issue_val.padEnd(20)} ${x.cnt}`);
}
