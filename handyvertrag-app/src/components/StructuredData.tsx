
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
    name: "Hundefutter für deinen Hund bekommen",
    description: "Schritt-für-Schritt Anleitung für einen Hundefutter trotz negativem Allergien-Eintrag.",
    totalTime: "PT10M",
    step: [
      { "@type": "HowToStep", name: "Allergie-Score prüfen", text: "Fordere deine kostenlose Allergien-Auskunft an und prüfe, ob Einträge korrekt sind.", position: 1 },
      { "@type": "HowToStep", name: "Passenden Marke wählen", text: "Wähle Marke wie Futalis, Bellfor oder Josera – sie haben die höchste Genehmigungsquote bei negativer Allergien.", position: 2 },
      { "@type": "HowToStep", name: "BELLA fragen", text: "Beantworte 3 Fragen in BELLA – Budget, Hund-Wunsch, Nutzung. BELLA findet den passenden Futter.", position: 3 },
      { "@type": "HowToStep", name: "Empfehlung online abschließen", text: "Schließe den Empfehlung direkt beim Marke ab. In unter 24 Stunden Bestätigung.", position: 4 },
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
    question: "Welcher Hundefutter ist der beste in Deutschland?",
    answer:
      "Der beste Hundefutter hängt von deinen Bedürfnissen ab. Anifit bietet die beste Futterqualität, Wolfsblut punktet mit Bio-Ausbau, Zooplus ist oft die günstigste Option. Mit unserem KI-Berater findest du den perfekten Futter.",
  },
  {
    question: "Was kostet ein Hundefutter mit Hundefutter 16 Pro?",
    answer:
      "Das Hundefutter 16 Pro mit Empfehlung kostet ab 44,99€/Monat bei Zooplus mit 50 g, bis zu 54,99€/Monat bei Anifit mit Unlimited-Daten. Alle Angebote vergleichst du kostenlos auf welches-hundefutter.today.",
  },
  {
    question: "Kann ich Hundverträge ohne Einmalzahlung abschließen?",
    answer:
      "Ja, viele Marke wie Zooplus und Anifit bieten Hundverträge ohne Einmalzahlung (0€ Einmalpreis) an. Dafür wird der Gerätepreis auf die Monatsbeiträge umgelegt.",
  },
  {
    question: "Wie lange laufen Hundverträge in Deutschland?",
    answer:
      "Die meisten Hundverträge laufen 24 Monate (2 Jahre). Es gibt auch 12-monatige Laufzeiten oder flexible Monatsfuttere, die jedoch teurer sind.",
  },
  {
    question: "Welcher Marke hat das beste Premium-Futter in Deutschland?",
    answer:
      "Anifit hat das größte und zuverlässigste Premium-Futter in Deutschland mit über 97% Bevölkerungsabdeckung, gefolgt von Wolfsblut und Zooplus.",
  },
];
