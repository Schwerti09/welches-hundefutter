import { ProgrammaticPage, ContentBlock, SEOMetadata } from "../types";

export class ProgrammaticPageSystem {
  private pages: Map<string, ProgrammaticPage> = new Map();

  createDeviceContractPage(
    deviceId: string,
    contractId: string,
    device: any,
    contract: any
  ): ProgrammaticPage {
    const slug = `${device.slug}-mit-vertrag-${contract.provider.toLowerCase()}`;
    const metadata = this.generateDeviceContractMetadata(device, contract);

    const page: ProgrammaticPage = {
      id: `device-contract-${deviceId}-${contractId}`,
      type: "device_contract",
      slug,
      canonicalUrl: `/handys/${slug}`,
      entities: [deviceId, contractId],
      template: "device-contract",
      contentBlocks: this.generateDeviceContractBlocks(device, contract),
      metadata,
      qualityScore: 85,
      uniquenessScore: 90,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.pages.set(page.id, page);
    return page;
  }

  createBestForPage(
    segment: string,
    devices: any[]
  ): ProgrammaticPage {
    const slug = `beste-${segment}-handys-mit-vertrag`;
    const metadata = this.generateBestForMetadata(segment, devices);

    const page: ProgrammaticPage = {
      id: `best-for-${segment}`,
      type: "best_for",
      slug,
      canonicalUrl: `/empfehlungen/${slug}`,
      entities: devices.map((d) => d.id),
      template: "best-for",
      contentBlocks: this.generateBestForBlocks(segment, devices),
      metadata,
      qualityScore: 90,
      uniquenessScore: 95,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.pages.set(page.id, page);
    return page;
  }

  createComparisonPage(
    entity1Id: string,
    entity2Id: string,
    entity1: any,
    entity2: any
  ): ProgrammaticPage {
    const slug = `${entity1.slug}-vs-${entity2.slug}`;
    const metadata = this.generateComparisonMetadata(entity1, entity2);

    const page: ProgrammaticPage = {
      id: `comparison-${entity1Id}-${entity2Id}`,
      type: "comparison",
      slug,
      canonicalUrl: `/vergleich/${slug}`,
      entities: [entity1Id, entity2Id],
      template: "comparison",
      contentBlocks: this.generateComparisonBlocks(entity1, entity2),
      metadata,
      qualityScore: 88,
      uniquenessScore: 92,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.pages.set(page.id, page);
    return page;
  }

  createProviderPage(
    providerId: string,
    provider: string,
    contracts: any[]
  ): ProgrammaticPage {
    const slug = provider.toLowerCase();
    const metadata = this.generateProviderMetadata(provider, contracts);

    const page: ProgrammaticPage = {
      id: `provider-${providerId}`,
      type: "provider",
      slug,
      canonicalUrl: `/provider/${slug}`,
      entities: contracts.map((c) => c.id),
      template: "provider",
      contentBlocks: this.generateProviderBlocks(provider, contracts),
      metadata,
      qualityScore: 85,
      uniquenessScore: 88,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.pages.set(page.id, page);
    return page;
  }

  createCategoryHubPage(
    categoryId: string,
    category: string,
    devices: any[]
  ): ProgrammaticPage {
    const slug = category.toLowerCase();
    const metadata = this.generateCategoryMetadata(category);

    const page: ProgrammaticPage = {
      id: `category-${categoryId}`,
      type: "category_hub",
      slug,
      canonicalUrl: `/kategorie/${slug}`,
      entities: devices.map((d) => d.id),
      template: "category-hub",
      contentBlocks: this.generateCategoryBlocks(category, devices),
      metadata,
      qualityScore: 87,
      uniquenessScore: 90,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.pages.set(page.id, page);
    return page;
  }

  private generateDeviceContractBlocks(device: any, contract: any): ContentBlock[] {
    return [
      {
        id: "device-info",
        type: "recommendation",
        title: device.name,
        content: `${device.brand} ${device.name} mit Vertrag bei ${contract.provider}. ${contract.dataVolume} Datenvolumen für €${contract.monthlyPrice}/Monat.`,
        entities: [device.id, contract.id],
        dynamic: true,
        priority: 1,
      },
      {
        id: "provider-insight",
        type: "provider_insight",
        title: `${contract.provider} Vorteile`,
        content: `${contract.provider} bietet hervorragende Netzqualität und zuverlässigen Service.`,
        entities: [contract.id],
        dynamic: false,
        priority: 2,
      },
      {
        id: "ai-advice",
        type: "ai_advice",
        title: "KI-Empfehlung",
        content: "Basierend auf Ihren Präferenzen ist dieser Vertrag eine hervorragende Wahl.",
        entities: [device.id, contract.id],
        dynamic: true,
        priority: 3,
      },
    ];
  }

  private generateBestForBlocks(segment: string, devices: any[]): ContentBlock[] {
    return [
      {
        id: "recommendation-group",
        type: "recommendation",
        title: `Top ${segment} Empfehlungen`,
        content: `Die besten ${segment} Handys basierend auf KI-Analyse und Expertenbewertungen.`,
        entities: devices.map((d) => d.id),
        dynamic: true,
        priority: 1,
      },
      {
        id: "segment-explanation",
        type: "ai_advice",
        title: `Warum für ${segment}?`,
        content: `Diese Handys wurden speziell für ${segment} ausgewählt basierend auf Leistung, Preis und Features.`,
        entities: [],
        dynamic: false,
        priority: 2,
      },
    ];
  }

  private generateComparisonBlocks(entity1: any, entity2: any): ContentBlock[] {
    return [
      {
        id: "comparison-summary",
        type: "comparison_summary",
        title: "Vergleichsübersicht",
        content: `Detaillierter Vergleich zwischen ${entity1.name} und ${entity2.name}.`,
        entities: [entity1.id, entity2.id],
        dynamic: true,
        priority: 1,
      },
      {
        id: "pros-cons",
        type: "pros_cons",
        title: "Vor- und Nachteile",
        content: "Vor- und Nachteile beider Geräte im direkten Vergleich.",
        entities: [entity1.id, entity2.id],
        dynamic: true,
        priority: 2,
      },
    ];
  }

  private generateProviderBlocks(provider: string, contracts: any[]): ContentBlock[] {
    return [
      {
        id: "provider-overview",
        type: "provider_insight",
        title: `${provider} Übersicht`,
        content: `Alle ${provider} Verträge und Angebote im Überblick.`,
        entities: contracts.map((c) => c.id),
        dynamic: true,
        priority: 1,
      },
      {
        id: "provider-benefits",
        type: "ai_advice",
        title: `${provider} Vorteile`,
        content: `${provider} bietet exzellente Netzqualität und zuverlässigen Service.`,
        entities: [],
        dynamic: false,
        priority: 2,
      },
    ];
  }

  private generateCategoryBlocks(category: string, devices: any[]): ContentBlock[] {
    return [
      {
        id: "category-overview",
        type: "recommendation",
        title: `${category} Handys`,
        content: `Alle ${category} Handys mit Vertrag im Überblick.`,
        entities: devices.map((d) => d.id),
        dynamic: true,
        priority: 1,
      },
    ];
  }

  private generateDeviceContractMetadata(device: any, contract: any): SEOMetadata {
    return {
      title: `${device.name} mit Vertrag bei ${contract.provider}`,
      description: `${device.brand} ${device.name} mit Vertrag bei ${contract.provider}. ${contract.dataVolume} für €${contract.monthlyPrice}/Monat.`,
      keywords: [`${device.name} Vertrag`, `${contract.provider} Vertrag`, `${device.name} kaufen`],
      ogTitle: `${device.name} mit Vertrag`,
      ogDescription: `${device.brand} ${device.name} mit Vertrag bei ${contract.provider}`,
      canonical: `/handys/${device.slug}-mit-vertrag-${contract.provider.toLowerCase()}`,
    };
  }

  private generateBestForMetadata(segment: string, devices: any[]): SEOMetadata {
    return {
      title: `Beste ${segment} Handys mit Vertrag`,
      description: `Die besten ${segment} Handys mit Vertrag im Vergleich. ${devices.length} Top-Empfehlungen.`,
      keywords: [`beste ${segment} handys`, `${segment} handyvertrag`],
      ogTitle: `Beste ${segment} Handys`,
      ogDescription: `Top ${segment} Handys mit Vertrag`,
      canonical: `/empfehlungen/beste-${segment}-handys-mit-vertrag`,
    };
  }

  private generateComparisonMetadata(entity1: any, entity2: any): SEOMetadata {
    return {
      title: `${entity1.name} vs ${entity2.name} Vergleich`,
      description: `Detaillierter Vergleich zwischen ${entity1.name} und ${entity2.name}.`,
      keywords: [`${entity1.name} vs ${entity2.name}`, `${entity1.name} Vergleich`],
      ogTitle: `${entity1.name} vs ${entity2.name}`,
      ogDescription: `Vergleich: ${entity1.name} vs ${entity2.name}`,
      canonical: `/vergleich/${entity1.slug}-vs-${entity2.slug}`,
    };
  }

  private generateProviderMetadata(provider: string, contracts: any[]): SEOMetadata {
    return {
      title: `${provider} Verträge & Angebote`,
      description: `Alle ${provider} Handyverträge im Überblick. ${contracts.length} aktuelle Angebote.`,
      keywords: [`${provider} vertrag`, `${provider} handyvertrag`],
      ogTitle: `${provider} Verträge`,
      ogDescription: `Alle ${provider} Angebote`,
      canonical: `/provider/${provider.toLowerCase()}`,
    };
  }

  private generateCategoryMetadata(category: string): SEOMetadata {
    return {
      title: `${category} Handys mit Vertrag`,
      description: `Alle ${category} Handys mit Vertrag im Vergleich.`,
      keywords: [`${category} handys`, `${category} handyvertrag`],
      ogTitle: `${category} Handys`,
      ogDescription: `${category} Handys mit Vertrag`,
      canonical: `/kategorie/${category.toLowerCase()}`,
    };
  }

  getPage(pageId: string): ProgrammaticPage | undefined {
    return this.pages.get(pageId);
  }

  getAllPages(): ProgrammaticPage[] {
    return Array.from(this.pages.values());
  }
}
