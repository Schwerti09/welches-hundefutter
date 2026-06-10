import { neon } from "@neondatabase/serverless";

export const revalidate = 86400; // täglich, passend zum Feed-Cron

interface CatalogRow {
  slug: string;
  brand: string;
  name: string;
  type: string;
  protein: string;
  price_per_kg: number | null;
  price: number | null;
  score: number | null;
  is_grain_free: boolean;
  is_hypoallergenic: boolean;
  suitable_for: string[] | null;
  image_url: string | null;
  affiliate_url: string;
  updated_at: string;
}

async function fetchCatalog(): Promise<CatalogRow[] | null> {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  try {
    const sql = neon(url);
    const rows = await sql`
      SELECT slug, brand, name, type, protein,
        price_per_kg::float8 AS price_per_kg, price::float8 AS price, score,
        is_grain_free, is_hypoallergenic, suitable_for, image_url, affiliate_url,
        updated_at::date::text AS updated_at
      FROM dog_foods
      WHERE is_active = true AND name <> '' AND affiliate_url <> ''
      ORDER BY score DESC NULLS LAST, slug ASC
    `;
    return (rows as unknown as CatalogRow[]) || [];
  } catch {
    return null;
  }
}

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(rows: CatalogRow[]): string {
  const head = "slug,brand,name,type,protein,price_per_kg,price,score,is_grain_free,is_hypoallergenic,image_url,affiliate_url,updated_at";
  const lines = rows.map((r) =>
    [
      r.slug, r.brand, r.name, r.type, r.protein, r.price_per_kg, r.price, r.score,
      r.is_grain_free, r.is_hypoallergenic, r.image_url, r.affiliate_url, r.updated_at,
    ].map(csvEscape).join(",")
  );
  return [head, ...lines].join("\n");
}

export async function GET(request: Request) {
  const rows = await fetchCatalog();
  if (!rows) {
    return new Response(JSON.stringify({ error: "data unavailable" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const headers = {
    "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
    "Access-Control-Allow-Origin": "*",
  };

  const format = new URL(request.url).searchParams.get("format");
  if (format === "csv") {
    return new Response(toCsv(rows), {
      headers: {
        ...headers,
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'inline; filename="bella-hundefutter-katalog.csv"',
      },
    });
  }

  const body = {
    source: "welches-hundefutter.today",
    license: "CC-BY-4.0",
    generatedAt: new Date().toISOString(),
    totalProducts: rows.length,
    disclosure:
      "Das Feld 'affiliate_url' enthält Partner-/Affiliate-Links (Werbung, § 5a UWG). " +
      "BELLA erhält bei Käufen über diese Links ggf. eine Provision, ohne Mehrkosten für dich.",
    fields: {
      slug: "Eindeutige Produkt-ID",
      brand: "Marke",
      name: "Produktname",
      type: "Futtertyp: trocken | nass | barf | kaltgepresst | snack",
      protein: "Hauptproteinquelle, falls deklariert (sonst leer)",
      price_per_kg: "Preis pro Kilogramm in EUR",
      price: "Gesamtpreis der Packung in EUR",
      score: "BELLA-Score 28-98 — Methodik: https://welches-hundefutter.today/analyse/methodik",
      is_grain_free: "Getreidefrei",
      is_hypoallergenic: "Hypoallergenes Rezept (Mono-/Insektenprotein o. Ä.)",
      suitable_for: "Empfohlene Lebensphasen/Eignungen",
      image_url: "Produktbild-URL",
      affiliate_url: "Partner-Link zum Angebot (siehe disclosure)",
      updated_at: "Letztes Preis-/Datenupdate (ISO-Datum)",
    },
    products: rows,
  };

  return new Response(JSON.stringify(body), {
    headers: {
      ...headers,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
