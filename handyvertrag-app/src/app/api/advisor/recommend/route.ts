import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { products } from "@/data/products";

const recommendSchema = z.object({
  budget: z.number().optional(),
  brand: z.string().optional(),
  provider: z.string().optional(),
  dataVolume: z.string().optional(),
  useCase: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prefs = recommendSchema.parse(body);

    let scored = products.map((product) => {
      let score = 50;
      const bestOffer = product.offers.reduce((best, offer) =>
        offer.monthlyPrice < best.monthlyPrice ? offer : best
      );

      if (prefs.brand && product.brand.toLowerCase() === prefs.brand.toLowerCase()) score += 30;
      if (prefs.budget && bestOffer.monthlyPrice <= prefs.budget) score += 20;
      if (prefs.provider) {
        const hasProvider = product.offers.some(
          (o) => o.provider.toLowerCase() === prefs.provider!.toLowerCase()
        );
        if (hasProvider) score += 15;
      }

      return { product, bestOffer, score };
    });

    scored = scored.sort((a, b) => b.score - a.score).slice(0, 3);

    return NextResponse.json({
      recommendations: scored.map(({ product, bestOffer, score }) => ({
        id: product.id,
        name: product.name,
        brand: product.brand,
        rating: product.rating,
        bestOffer,
        score,
        confidence: Math.min(score / 100, 1),
      })),
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
