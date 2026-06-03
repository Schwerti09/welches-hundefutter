import { products } from "@/data/products";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface StructuredDataProps {
  type: "organization" | "product" | "faq" | "breadcrumb" | "website" | "software" | "howto";
  productId?: string;
  breadcrumbs?: BreadcrumbItem[];
  faqs?: FAQItem[];
}

function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://welches-hundefutter.today/#organization",
    name: "BELLA",
    alternateName: "BELLA Intelligence System",
    url: "https://welches-hundefutter.today",
    logo: {
      "@type": "ImageObject",
      url: "https://welches-hundefutter.today/logo.png",
      width: 512,
      height: 512,
    },
    description: "KI-Ernährungsberaterin für Hunde – powered by HANSI Decision Intelligence Engine™.",
    founder: { "@type": "Person", name: "R. Schwertfechter" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@welches-hundefutter.today",
      availableLanguage: ["German", "Deutsch"],
    },
    areaServed: { "@type": "Country", name: "Deutschland" },
    sameAs: ["https://github.com/Schwerti09/welches-hundefutter"],
    brand: {
      "@type": "Brand",
      name: "HANSI Decision Intelligence Engine™",
      description: "Proprietäres KI-Empfehlungssystem für individuelle Produktberatung.",
    },
  };
}

function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://welches-hundefutter.today/#website",
    url: "https://welches-hundefutter.today",
    name: "BELLA – Hundefutter für deinen Hund",
    description: "Hundefutter für deinen Hund finden mit KI-Beratung",
    publisher: { "@id": "https://welches-hundefutter.today/#organization" },
    inLanguage: "de-DE",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://welches-hundefutter.today/tools/vergleich?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
}

function buildSoftwareSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "BELLA – KI Handyvertrag-Berater",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "247",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

function buildHowToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Hundefutter für deinen Hund bekommen",
    description: "Schritt-für-Schritt Anleitung für einen Handyvertrag trotz negativem Schufa-Eintrag.",
    totalTime: "PT10M",
    step: [
      { "@type": "HowToStep", name: "Schufa-Score prüfen", text: "Fordere deine kostenlose Schufa-Auskunft an und prüfe, ob Einträge korrekt sind.", position: 1 },
      { "@type": "HowToStep", name: "Passenden Anbieter wählen", text: "Wähle Anbieter wie freenet, congstar oder MAINGAU – sie haben die höchste Genehmigungsquote bei negativer Schufa.", position: 2 },
      { "@type": "HowToStep", name: "BELLA fragen", text: "Beantworte 3 Fragen in BELLA – Budget, Handy-Wunsch, Nutzung. BELLA findet den passenden Tarif.", position: 3 },
      { "@type": "HowToStep", name: "Vertrag online abschließen", text: "Schließe den Vertrag direkt beim Anbieter ab. In unter 24 Stunden Bestätigung.", position: 4 },
    ],
  };
}

function buildProductSchema(productId: string) {
  const product = products.find((p) => p.id === productId);
  if (!product) return null;

  const bestOffer = product.offers.reduce((best, offer) =>
    offer.monthlyPrice < best.monthlyPrice ? offer : best
  );

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.imageUrl,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    description: `${product.name} mit Vertrag. Display: ${product.specs.display}, Kamera: ${product.specs.camera}, Akku: ${product.specs.battery}`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
      bestRating: 5,
      worstRating: 1,
    },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: bestOffer.monthlyPrice,
      highPrice: product.offers.reduce(
        (max, o) => (o.monthlyPrice > max ? o.monthlyPrice : max),
        0
      ),
      priceCurrency: "EUR",
      offerCount: product.offers.length,
      offers: product.offers.map((offer) => ({
        "@type": "Offer",
        seller: {
          "@type": "Organization",
          name: offer.provider,
        },
        price: offer.monthlyPrice,
        priceCurrency: "EUR",
        url: offer.affiliateLink,
        availability: "https://schema.org/InStock",
        priceValidUntil: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        )
          .toISOString()
          .split("T")[0],
      })),
    },
  };
}

function buildFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

function buildBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export default function StructuredData({
  type,
  productId,
  breadcrumbs,
  faqs,
}: StructuredDataProps) {
  let schema: object | null = null;

  switch (type) {
    case "organization":
      schema = buildOrganizationSchema();
      break;
    case "website":
      schema = buildWebsiteSchema();
      break;
    case "software":
      schema = buildSoftwareSchema();
      break;
    case "howto":
      schema = buildHowToSchema();
      break;
    case "product":
      if (productId) schema = buildProductSchema(productId);
      break;
    case "faq":
      if (faqs) schema = buildFAQSchema(faqs);
      break;
    case "breadcrumb":
      if (breadcrumbs) schema = buildBreadcrumbSchema(breadcrumbs);
      break;
  }

  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export const defaultFAQs: FAQItem[] = [
  {
    question: "Welcher Handyvertrag ist der beste in Deutschland?",
    answer:
      "Der beste Handyvertrag hängt von deinen Bedürfnissen ab. Telekom bietet die beste Netzabdeckung, Vodafone punktet mit 5G-Ausbau, o2 ist oft die günstigste Option. Mit unserem KI-Berater findest du den perfekten Tarif.",
  },
  {
    question: "Was kostet ein Handyvertrag mit iPhone 16 Pro?",
    answer:
      "Das iPhone 16 Pro mit Vertrag kostet ab 44,99€/Monat bei o2 mit 50 GB, bis zu 54,99€/Monat bei Telekom mit Unlimited-Daten. Alle Angebote vergleichst du kostenlos auf welches-hundefutter.today.",
  },
  {
    question: "Kann ich Handyverträge ohne Einmalzahlung abschließen?",
    answer:
      "Ja, viele Anbieter wie o2 und Telekom bieten Handyverträge ohne Einmalzahlung (0€ Einmalpreis) an. Dafür wird der Gerätepreis auf die Monatsbeiträge umgelegt.",
  },
  {
    question: "Wie lange laufen Handyverträge in Deutschland?",
    answer:
      "Die meisten Handyverträge laufen 24 Monate (2 Jahre). Es gibt auch 12-monatige Laufzeiten oder flexible Monatstarife, die jedoch teurer sind.",
  },
  {
    question: "Welcher Anbieter hat das beste 5G-Netz in Deutschland?",
    answer:
      "Telekom hat das größte und zuverlässigste 5G-Netz in Deutschland mit über 97% Bevölkerungsabdeckung, gefolgt von Vodafone und o2.",
  },
];
