import { getBrandsWithCounts } from "@/db/queries/foods";

export const revalidate = 86400;

export async function GET() {
  let brands;
  try {
    brands = await getBrandsWithCounts(1);
  } catch {
    return new Response(JSON.stringify({ error: "data unavailable" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const payload = {
    source: "welches-hundefutter.today",
    license: "CC-BY-4.0",
    description: "Alle Marken im Live-Katalog mit Produktzahlen und Score-Durchschnitt — täglich aktualisiert.",
    generatedAt: new Date().toISOString(),
    totalBrands: brands.length,
    fields: {
      brand: "Markenname",
      slug: "URL-Slug für /marke/[slug]",
      count: "Anzahl aktiver Produkte im Katalog",
      avgScore: "Durchschnittlicher BELLA-Score (0–100, null wenn noch kein Score)",
      minPricePerKg: "Günstigstes Produkt der Marke in €/kg",
      url: "Markenseite auf welches-hundefutter.today",
    },
    brands: brands.map((b) => ({
      brand: b.brand,
      slug: b.slug,
      count: b.count,
      avgScore: b.avgScore,
      minPricePerKg: b.minPricePerKg,
      url: `https://welches-hundefutter.today/marke/${b.slug}`,
    })),
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
