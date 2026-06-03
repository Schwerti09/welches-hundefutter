import { SEOMetadata } from "../types";

export class SEOMetadataEngine {
  generateDeviceMetadata(device: any, offer?: any): SEOMetadata {
    const title = `${device.name} mit Vertrag | ${offer?.provider || "Alle Anbieter"} | Handyvertrag.today`;
    const description = `${device.name} mit Vertrag bei ${offer?.provider || "verschiedenen Anbietern"}. ${offer?.dataVolume || "Verschiedene Datenvolumen"} • ${offer?.monthlyPrice ? `€${offer.monthlyPrice}/Monat` : "Verschiedene Preise"}. Finden Sie den besten Vertrag für Ihr ${device.brand} ${device.name}.`;

    return {
      title,
      description,
      keywords: [
        `${device.name} Vertrag`,
        `${device.brand} ${device.name} mit Vertrag`,
        `${device.name} ${offer?.provider || "Vertrag"}`,
        `${device.name} kaufen`,
        `${device.name} Angebot`,
      ],
      ogTitle: title,
      ogDescription: description,
      ogImage: device.image,
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: device.image,
      canonical: `/handys/${device.slug}`,
    };
  }

  generateBestForMetadata(segment: string, devices: any[]): SEOMetadata {
    const segmentName = this.getSegmentName(segment);
    const title = `Beste ${segmentName} Handys mit Vertrag 2026 | Empfehlungen`;
    const description = `Die besten ${segmentName} Handys mit Vertrag im Vergleich. ${devices.length} Top-Empfehlungen mit detaillierten Tests, Preisen und Empfehlungen. Finden Sie das perfekte ${segmentName} Handy.`;

    return {
      title,
      description,
      keywords: [
        `beste ${segmentName} handys`,
        `${segmentName} handyvertrag`,
        `${segmentName} handy empfehlung`,
        `top ${segmentName} smartphones`,
      ],
      ogTitle: title,
      ogDescription: description,
      canonical: `/empfehlungen/${segment}`,
    };
  }

  generateComparisonMetadata(entity1: any, entity2: any): SEOMetadata {
    const title = `${entity1.name} vs ${entity2.name} Vergleich | Handyvertrag.today`;
    const description = `Detaillierter Vergleich zwischen ${entity1.name} und ${entity2.name}. Alle Specs, Preise, Verträge und Empfehlungen im direkten Vergleich. Welches Handy ist besser für Sie?`;

    return {
      title,
      description,
      keywords: [
        `${entity1.name} vs ${entity2.name}`,
        `${entity1.name} vergleich`,
        `${entity2.name} vergleich`,
        `${entity1.name} oder ${entity2.name}`,
      ],
      ogTitle: title,
      ogDescription: description,
      canonical: `/vergleich/${entity1.slug}-vs-${entity2.slug}`,
    };
  }

  generateProviderMetadata(provider: string, contracts: any[]): SEOMetadata {
    const title = `${provider} Verträge & Angebote | Alle ${provider} Handyverträge im Vergleich`;
    const description = `Alle ${provider} Handyverträge im Überblick. ${contracts.length} aktuelle Angebote mit verschiedenen Smartphones, Datenvolumen und Preisen. Finden Sie den besten ${provider} Vertrag für Sie.`;

    return {
      title,
      description,
      keywords: [
        `${provider} vertrag`,
        `${provider} handyvertrag`,
        `${provider} angebote`,
        `${provider} tarife`,
      ],
      ogTitle: title,
      ogDescription: description,
      canonical: `/provider/${provider.toLowerCase()}`,
    };
  }

  generateCategoryMetadata(category: string): SEOMetadata {
    const title = `${category} Handys mit Vertrag | Alle ${category} Angebote`;
    const description = `Alle ${category} Handys mit Vertrag im Vergleich. Übersicht aller ${category} Smartphones mit aktuellen Angeboten, Preisen und Empfehlungen.`;

    return {
      title,
      description,
      keywords: [
        `${category} handys`,
        `${category} handyvertrag`,
        `${category} angebote`,
      ],
      ogTitle: title,
      ogDescription: description,
      canonical: `/kategorie/${category.toLowerCase()}`,
    };
  }

  generateCanonicalUrl(path: string, params?: Record<string, string>): string {
    let canonical = path;
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      canonical += `?${queryString}`;
    }
    return canonical;
  }

  generateHreflang(defaultUrl: string, languages: Record<string, string>): Record<string, string> {
    const hreflang: Record<string, string> = {
      "de-DE": defaultUrl,
      ...languages,
    };
    return hreflang;
  }

  private getSegmentName(segment: string): string {
    const segmentNames: Record<string, string> = {
      gaming: "Gaming",
      students: "Studenten",
      creators: "Content Creator",
      photographers: "Fotografen",
      budget: "Budget",
      business: "Business",
      travelers: "Reisende",
      families: "Familien",
    };
    return segmentNames[segment] || segment;
  }
}
