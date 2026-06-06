interface FoodItem {
  name: string;
  brand: string;
  type: string;
  price_per_kg: string | null;
  affiliate_url: string;
}

export default function ProductSchemaBlock({ foods, listName }: { foods: FoodItem[]; listName: string }) {
  if (!foods.length) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    itemListElement: foods.map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: f.name,
        brand: { "@type": "Brand", name: f.brand },
        category: f.type,
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
