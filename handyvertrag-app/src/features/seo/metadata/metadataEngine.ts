import { SEOMetadata } from "../types";

export class SEOMetadataEngine {
  generateDeviceMetadata(device: any, offer?: any): SEOMetadata {
    const title = `${device.name} mit Empfehlung | ${offer?.provider || "Alle Marke"} | Hundefutter.today`;
    const description = `${device.name} mit Empfehlung bei ${offer?.provider || "verschiedenen Marken"}. ${offer?.dataVolume || "Verschiedene Futtervolumen"} • ${offer?.monthlyPrice ? `€${offer.monthlyPrice}/Monat` : "Verschiedene Preise"}. Finden Sie den besten Empfehlung für Ihr ${device.brand} ${device.name}.`;

    return {
      title,
      description,
      keywords: [
        `${device.name} Empfehlung`,
        `${device.brand} ${device.name} mit Empfehlung`,
        `${device.name} ${offer?.provider || "Empfehlung"}`,
        `${device.name} kaufen`,
        `${device.name} Angebot`,
      ],
      ogTitle: title,
      ogDescription: description,
      ogImage: device.image,
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: device.image,
      canonical: `/hunds/${device.slug}`,
    };
  }

  generateBestForMetadata(segment: string, devices: any[]): SEOMetadata {
    const segmentName = this.getSegmentName(segment);
    const title = `Beste ${segmentName} Hunds mit Empfehlung 2026 | Empfehlungen`;
    const description = `Die besten ${segmentName} Hunds mit Empfehlung im Vergleich. ${devices.length} Top-Empfehlungen mit detaillierten Tests, Preisen und Empfehlungen. Finden Sie das perfekte ${segmentName} Hund.`;

    return {
      title,
      description,
      keywords: [
        `beste ${segmentName} hunds`,
        `${segmentName} hundefutter`,
        `${segmentName} hund empfehlung`,
        `top ${segmentName} hundefutters`,
      ],
      ogTitle: title,
      ogDescription: description,
      canonical: `/empfehlungen/${segment}`,
    };
  }

  generateComparisonMetadata(entity1: any, entity2: any): SEOMetadata {
    const title = `${entity1.name} vs ${entity2.name} Vergleich | Hundefutter.today`;
    const description = `Detaillierter Vergleich zwischen ${entity1.name} und ${entity2.name}. Alle Specs, Preise, Verträge und Empfehlungen im direkten Vergleich. Welches Hund ist besser für Sie?`;

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
    const title = `${provider} Verträge & Angebote | Alle ${provider} Hundverträge im Vergleich`;
    const description = `Alle ${provider} Hundverträge im Überblick. ${contracts.length} aktuelle Angebote mit verschiedenen Hundefutters, Futtervolumen und Preisen. Finden Sie den besten ${provider} Empfehlung für Sie.`;

    return {
      title,
      description,
      keywords: [
        `${provider} empfehlung`,
        `${provider} hundefutter`,
        `${provider} angebote`,
        `${provider} futtere`,
      ],
      ogTitle: title,
      ogDescription: description,
      canonical: `/provider/${provider.toLowerCase()}`,
    };
  }

  generateCategoryMetadata(category: string): SEOMetadata {
    const title = `${category} Hunds mit Empfehlung | Alle ${category} Angebote`;
    const description = `Alle ${category} Hunds mit Empfehlung im Vergleich. Übersicht aller ${category} Hundefutters mit aktuellen Angeboten, Preisen und Empfehlungen.`;

    return {
      title,
      description,
      keywords: [
        `${category} hunds`,
        `${category} hundefutter`,
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
