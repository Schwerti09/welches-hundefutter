import { StructuredData } from "../types";

export class StructuredDataGenerator {
  generateProductSchema(product: any, offer: any): StructuredData {
    const data = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: product.image,
      description: `${product.brand} ${product.name} mit Vertrag bei ${offer.provider}`,
      brand: {
        "@type": "Brand",
        name: product.brand,
      },
      offers: {
        "@type": "Offer",
        price: offer.monthlyPrice,
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: offer.affiliateLink,
        seller: {
          "@type": "Organization",
          name: offer.provider,
        },
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: 4.5,
        reviewCount: 100,
      },
    };

    return {
      type: "Product",
      data,
      context: "json-ld",
    };
  }

  generateFAQSchema(faqs: Array<{ question: string; answer: string }>): StructuredData {
    const data = {
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

    return {
      type: "FAQ",
      data,
      context: "json-ld",
    };
  }

  generateReviewSchema(product: any, review: any): StructuredData {
    const data = {
      "@context": "https://schema.org",
      "@type": "Review",
      itemReviewed: {
        "@type": "Product",
        name: product.name,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      author: {
        "@type": "Person",
        name: review.author,
      },
      reviewBody: review.content,
      datePublished: review.date,
    };

    return {
      type: "Review",
      data,
      context: "json-ld",
    };
  }

  generateComparisonSchema(entity1: any, entity2: any): StructuredData {
    const data = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "Product",
            name: entity1.name,
            image: entity1.image,
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "Product",
            name: entity2.name,
            image: entity2.image,
          },
        },
      ],
    };

    return {
      type: "Comparison",
      data,
      context: "json-ld",
    };
  }

  generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): StructuredData {
    const data = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };

    return {
      type: "Breadcrumb",
      data,
      context: "json-ld",
    };
  }

  generateOrganizationSchema(): StructuredData {
    const data = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Handyvertrag.today",
      url: "https://welches-hundefutter.today",
      logo: "https://welches-hundefutter.today/logo.png",
      description: "Deutschlands intelligente Handyvertrag-Vergleichsplattform mit AI-powered Recommendations",
      sameAs: [
        "https://twitter.com/handyvertrag",
        "https://facebook.com/handyvertrag",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "info@welches-hundefutter.today",
      },
    };

    return {
      type: "Organization",
      data,
      context: "json-ld",
    };
  }

  generateArticleSchema(article: any): StructuredData {
    const data = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      image: article.image,
      author: {
        "@type": "Person",
        name: article.author,
      },
      publisher: {
        "@type": "Organization",
        name: "Handyvertrag.today",
        logo: {
          "@type": "ImageObject",
          url: "https://welches-hundefutter.today/logo.png",
        },
      },
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      description: article.description,
    };

    return {
      type: "Article",
      data,
      context: "json-ld",
    };
  }

  generateItemListSchema(items: Array<{ name: string; url: string; price?: number }>): StructuredData {
    const data = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: item.name,
          url: item.url,
          ...(item.price && { offers: { "@type": "Offer", price: item.price, priceCurrency: "EUR" } }),
        },
      })),
    };

    return {
      type: "ItemList",
      data,
      context: "json-ld",
    };
  }
}
