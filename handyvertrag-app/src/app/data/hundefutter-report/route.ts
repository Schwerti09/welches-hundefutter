import { neon } from "@neondatabase/serverless";

export const revalidate = 86400; // täglich, passend zum Feed-Cron

async function buildReport() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  try {
    const sql = neon(url);
    const [meta, byType, composition, proteins] = await Promise.all([
      sql`SELECT count(*)::int AS total_snapshots, count(DISTINCT food_slug)::int AS distinct_products,
        min(recorded_at)::date::text AS first_snapshot, max(recorded_at)::date::text AS last_snapshot,
        round(avg(price_per_kg)::numeric,2)::float AS avg_price_all FROM price_history`,
      sql`SELECT type,
        round(avg(price_per_kg)::numeric,2)::float AS avg_price,
        round(min(price_per_kg)::numeric,2)::float AS min_price,
        round(max(price_per_kg)::numeric,2)::float AS max_price,
        count(*)::int AS product_count
        FROM dog_foods
        WHERE is_active = true AND price_per_kg IS NOT NULL AND price_per_kg > 0
          AND type IN ('trocken','nass','barf','kaltgepresst')
        GROUP BY type ORDER BY avg_price DESC`,
      sql`SELECT count(*)::int AS total,
        round(avg(meat_percentage) FILTER (WHERE meat_percentage IS NOT NULL)::numeric,1)::float AS avg_meat,
        round(100.0*count(*) FILTER (WHERE is_grain_free)/NULLIF(count(*),0),1)::float AS pct_grain_free,
        round(100.0*count(*) FILTER (WHERE is_monoprotein)/NULLIF(count(*),0),1)::float AS pct_monoprotein,
        round(100.0*count(*) FILTER (WHERE is_hypoallergenic)/NULLIF(count(*),0),1)::float AS pct_hypo
        FROM dog_foods WHERE is_active = true AND type IN ('trocken','nass','barf','kaltgepresst')`,
      sql`SELECT lower(trim(protein)) AS protein, count(*)::int AS n
        FROM dog_foods WHERE is_active = true AND type IN ('trocken','nass','barf','kaltgepresst')
          AND protein IS NOT NULL AND protein <> ''
        GROUP BY lower(trim(protein)) ORDER BY n DESC LIMIT 15`,
    ]);
    return {
      source: "welches-hundefutter.today",
      license: "CC-BY-4.0",
      generatedAt: new Date().toISOString(),
      meta: meta[0],
      byType,
      composition: composition[0],
      topProteins: proteins,
    };
  } catch {
    return null;
  }
}

function toCsv(byType: Array<Record<string, unknown>>): string {
  const head = "type,avg_price_per_kg,min_price_per_kg,max_price_per_kg,product_count";
  const rows = byType.map((r) =>
    [r.type, r.avg_price, r.min_price, r.max_price, r.product_count].join(",")
  );
  return [head, ...rows].join("\n");
}

export async function GET(request: Request) {
  const report = await buildReport();
  if (!report) {
    return new Response(JSON.stringify({ error: "data unavailable" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }
  const format = new URL(request.url).searchParams.get("format");
  if (format === "csv") {
    return new Response(toCsv(report.byType as Array<Record<string, unknown>>), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'inline; filename="bella-hundefutter-report-2026.csv"',
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      },
    });
  }
  return new Response(JSON.stringify(report, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
