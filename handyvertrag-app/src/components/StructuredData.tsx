
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
    name: "BELLA – KI Hundefutter-Berater",
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
    name: "Das richtige Hundefutter in 60 Sekunden finden",
    description: "Schritt-für-Schritt: Wie BELLA das passende Hundefutter für Rasse, Alter und Allergien findet.",
    totalTime: "PT2M",
    step: [
      { "@type": "HowToStep", name: "Rasse & Größe angeben", text: "Nenne BELLA deine Hunderasse. BELLA kennt 54 Rassen mit typischen Ernährungsbedürfnissen.", position: 1 },
      { "@type": "HowToStep", name: "Alter & Aktivität eingeben", text: "Welpe, Adult oder Senior? Aktiver Arbeitshund oder Couch-Potato? Das bestimmt den Kalorienbedarf.", position: 2 },
      { "@type": "HowToStep", name: "Allergien & Unverträglichkeiten nennen", text: "Huhn, Rind, Weizen? BELLA filtert Allergene konsequent aus dem Katalog raus.", position: 3 },
      { "@type": "HowToStep", name: "Empfehlung erhalten & bestellen", text: "BELLA liefert 3 passende Futter mit Preis/kg, Tagesmenge und direktem Affiliate-Link zum Bestellen.", position: 4 },
    ],
  };
}

function buildProductSchema(_productId: string) {
  // Produkt-Schema wird künftig aus der DB (dog_foods) gespeist; aktuell ungenutzt.
  return null;
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
    question: "Welches Hundefutter ist das beste in Deutschland?",
    answer:
      "Es gibt kein universell bestes Hundefutter — es hängt von Rasse, Alter, Aktivität und Gesundheit ab. Wichtig sind: hoher Fleischanteil (>70 %), klare Deklaration, keine unnötigen Füllstoffe. BELLA findet aus über 8.000 Sorten das Passende für deinen Hund.",
  },
  {
    question: "Welches Hundefutter ist geeignet bei Allergie?",
    answer:
      "Bei Futterallergie hilft Monoprotein-Futter mit einer ungewöhnlichen Fleischquelle (Ente, Wild, Insekten) und ohne Getreide. Häufigste Allergene: Huhn, Rind, Weizen. BELLA filtert diese Allergene automatisch aus dem Katalog.",
  },
  {
    question: "Was kostet Hundefutter pro Monat?",
    answer:
      "Qualitätstrockenfutter kostet 4–12 €/kg, Nassfutter 5–20 €/kg. Ein 25-kg-Hund braucht ca. 400 g Trockenfutter/Tag = 60–150 €/Monat je nach Marke. BELLA zeigt dir die günstigsten Optionen aus dem Live-Katalog.",
  },
  {
    question: "Trockenfutter oder Nassfutter – was ist besser?",
    answer:
      "Beides hat Vor- und Nachteile. Trockenfutter: günstiger, zahngut, lange haltbar. Nassfutter: mehr Feuchtigkeit, schmackhafter. Optimal: Mischfütterung. BELLA empfiehlt basierend auf Alter und Gesundheit.",
  },
  {
    question: "Wie viel Futter braucht mein Hund pro Tag?",
    answer:
      "Faustregel Trockenfutter: 1,5–2,5 % des Körpergewichts täglich. 20-kg-Hund = ca. 300–500 g/Tag. Aktive Hunde mehr, Senioren weniger. BELLA berechnet die Tagesmenge individuell.",
  },
];
