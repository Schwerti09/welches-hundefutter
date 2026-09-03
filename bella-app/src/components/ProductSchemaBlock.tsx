interface FoodItem {
  name: string;
  brand: string;
  type: string;
  protein?: string | null;
  price_per_kg: string | null;
  affiliate_url: string;
  image_url?: string | null;
}

// Faktische Produktbeschreibung aus vorhandenen Feldern — keine erfundenen Claims.
function buildDescription(f: FoodItem): string {
  const typeLabel: Record<string, string> = {
    trocken: "Trockenfutter", nass: "Nassfutter", barf: "BARF", kaltgepresst: "kaltgepresstes Futter", snack: "Snack",
  };
  const parts = [`${f.brand} ${f.name}`, typeLabel[f.type] ?? f.type, "für Hunde"];
  if (f.protein) parts.push(`mit ${f.protein}`);
  if (f.price_per_kg) parts.push(`ab ${parseFloat(f.price_per_kg).toFixed(2).replace(".", ",")} €/kg`);
  return parts.join(", ") + ".";
}

export default function ProductSchemaBlock({ foods, listName }: { foods: FoodItem[]; listName: string }) {
  // Nur Produkte mit gültigem Bild ins Schema: ein Product OHNE image ist für
  // Google ungültig (Rich-Result-Fehler). Lieber weniger, aber valide Einträge.
  // Wurzelursache imageloser Produkte ist ein fehlendes image_url in der DB
  // (Feed-Import) — siehe Hinweis im Deploy-Report.
  const valid = foods.filter((f) => f.image_url && /^https?:\/\//.test(f.image_url));
  if (!valid.length) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    itemListElement: valid.map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: f.name,
        brand: { "@type": "Brand", name: f.brand },
        category: f.type,
        description: buildDescription(f),
        image: f.image_url,
        ...(f.price_per_kg
          ? {
              offers: {
                "@type": "Offer",
                price: parseFloat(f.price_per_kg).toFixed(2),
                priceCurrency: "EUR",
                availability: "https://schema.org/InStock",
                url: f.affiliate_url,
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  price: parseFloat(f.price_per_kg).toFixed(2),
                  priceCurrency: "EUR",
                  unitText: "KGM",
                },
              },
            }
          : {}),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
