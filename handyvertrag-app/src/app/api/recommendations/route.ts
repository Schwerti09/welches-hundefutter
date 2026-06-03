import { NextRequest, NextResponse } from "next/server";
import { products } from "@/data/products";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "6"), 20);
  const offset = parseInt(searchParams.get("offset") ?? "0");

  const recommendations = products.slice(offset, offset + limit).map((product) => ({
    ...product,
    bestOffer: product.offers.reduce((best, offer) =>
      offer.monthlyPrice < best.monthlyPrice ? offer : best
    ),
  }));

  return NextResponse.json({
    recommendations,
    total: products.length,
    limit,
    offset,
  });
}
