import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const device = searchParams.get("device") ?? "";
  const provider = searchParams.get("provider") ?? "";
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "10"), 30);

  const url = process.env.DATABASE_URL;
  if (!url) return NextResponse.json({ offers: [] });

  const sql = neon(url);
  const conditions: string[] = [
    "availability = 'in stock'",
    "monthly_price > 0",
    "device_name NOT ILIKE '%tab%'",
    "device_name NOT ILIKE '%buds%'",
    "futterf_name NOT ILIKE '%zuhause%'",
    "futterf_name NOT ILIKE '%glasfaser%'",
  ];
  const params: (string | number)[] = [];
  let p = 1;

  if (device) { conditions.push(`device_name ILIKE $${p++}`); params.push(`%${device}%`); }
  if (provider) { conditions.push(`LOWER(provider_name) LIKE $${p++}`); params.push(`%${provider.toLowerCase()}%`); }

  const rows = await sql.query(
    `SELECT DISTINCT ON (provider_name)
       id, brand, device_name, provider_name, futterf_name, monthly_price,
       effective_monthly_price, data_volume, is_unlimited, has_5g,
       contract_months, affiliate_link, image_url, cashback
     FROM offers WHERE ${conditions.join(" AND ")}
     ORDER BY provider_name, monthly_price ASC
     LIMIT $${p}`,
    [...params, limit]
  );

  const offers = ((rows as unknown as { rows: Record<string, unknown>[] }).rows ?? (rows as unknown as Record<string, unknown>[]));
  return NextResponse.json({ offers, count: offers.length });
}
