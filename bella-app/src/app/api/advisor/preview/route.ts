import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const revalidate = 3600; // Cache 1h — same products for a while is fine

export interface PreviewProduct {
  name: string;
  brand: string;
  pricePerKg: number | null;
  imageUrl: string | null;
  type: string;
}

export async function GET() {
  const url = process.env.DATABASE_URL;
  if (!url) return NextResponse.json({ products: [] });
  try {
    const sql = neon(url);
    const rows = await sql`
      SELECT name, brand, price_per_kg, image_url, type
      FROM dog_foods
      WHERE is_active = true
        AND image_url IS NOT NULL
        AND image_url <> ''
        AND name <> ''
        AND type <> 'snack'
        AND price_per_kg BETWEEN 2 AND 20
      ORDER BY RANDOM()
      LIMIT 18
    `;
    const products: PreviewProduct[] = (rows as Array<{
      name: string; brand: string; price_per_kg: string | null; image_url: string | null; type: string;
    }>).map(r => ({
      name: r.name,
      brand: r.brand,
      pricePerKg: r.price_per_kg != null ? parseFloat(r.price_per_kg) : null,
      imageUrl: r.image_url,
      type: r.type,
    }));
    return NextResponse.json({ products }, { headers: { "Cache-Control": "public, max-age=3600" } });
  } catch {
    return NextResponse.json({ products: [] });
  }
}
