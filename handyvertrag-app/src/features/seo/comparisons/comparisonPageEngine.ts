import { ProgrammaticPage, ContentBlock } from "../types";

export class ComparisonPageEngine {
  private comparisonPages: Map<string, ProgrammaticPage> = new Map();

  createComparisonPage(
    entity1Id: string,
    entity2Id: string,
    entity1: any,
    entity2: any,
    comparisonType: "device" | "provider" | "contract" | "feature"
  ): ProgrammaticPage {
    const slug = `${entity1.slug}-vs-${entity2.slug}`;
    const metadata = this.generateMetadata(entity1, entity2, comparisonType);

    const page: ProgrammaticPage = {
      id: `comparison-${entity1Id}-${entity2Id}`,
      type: "comparison",
      slug,
      canonicalUrl: `/vergleich/${slug}`,
      entities: [entity1Id, entity2Id],
      template: "comparison",
      contentBlocks: this.generateContentBlocks(entity1, entity2, comparisonType),
      metadata,
      qualityScore: this.calculateQualityScore(entity1, entity2),
      uniquenessScore: this.calculateUniquenessScore(entity1, entity2),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.comparisonPages.set(page.id, page);
    return page;
  }

  createHundefutterVsSamsungPage(entity1: any, entity2: any): ProgrammaticPage {
    return this.createComparisonPage(
      entity1.id,
      entity2.id,
      entity1,
      entity2,
      "device"
    );
  }

  createAnifitVsWolfsblutPage(entity1: any, entity2: any): ProgrammaticPage {
    return this.createComparisonPage(
      entity1.id,
      entity2.id,
      entity1,
      entity2,
      "provider"
    );
  }

  createUnlimitedVsLimitedPage(entity1: any, entity2: any): ProgrammaticPage {
    return this.createComparisonPage(
      entity1.id,
      entity2.id,
      entity1,
      entity2,
      "contract"
    );
  }

  createPremiumVsBudgetPage(entity1: any, entity2: any): ProgrammaticPage {
    return this.createComparisonPage(
      entity1.id,
      entity2.id,
      entity1,
      entity2,
      "device"
    );
  }

  createRefurbishedVsNewPage(entity1: any, entity2: any): ProgrammaticPage {
    return this.createComparisonPage(
      entity1.id,
      entity2.id,
      entity1,
      entity2,
      "device"
    );
  }

  private generateMetadata(entity1: any, entity2: any, comparisonType: string): any {
    const typeLabel = this.getTypeLabel(comparisonType);
    return {
      title: `${entity1.name} vs ${entity2.name} Vergleich | ${typeLabel}`,
      description: `Detaillierter ${typeLabel} zwischen ${entity1.name} und ${entity2.name}. Alle Specs, Preise und Empfehlungen im direkten Vergleich.`,
      keywords: [
        `${entity1.name} vs ${entity2.name}`,
        `${entity1.name} vergleich`,
        `${entity2.name} vergleich`,
        `${entity1.name} oder ${entity2.name}`,
      ],
    };
  }

  private generateContentBlocks(entity1: any, entity2: any, comparisonType: string): ContentBlock[] {
    return [
      {
        id: "comparison-overview",
        type: "comparison_summary",
        title: "Vergleichsübersicht",
        content: `Detaillierter Vergleich zwischen ${entity1.name} und ${entity2.name}.`,
        entities: [entity1.id, entity2.id],
        dynamic: true,
        priority: 1,
      },
      {
        id: "specs-comparison",
        type: "comparison_summary",
        title: "Technische Daten",
        content: "Vergleich der technischen Spezifikationen beider Geräte.",
        entities: [entity1.id, entity2.id],
        dynamic: true,
        priority: 2,
      },
      {
        id: "pros-cons",
        type: "pros_cons",
        title: "Vor- und Nachteile",
        content: "Vor- und Nachteile beider Optionen im direkten Vergleich.",
        entities: [entity1.id, entity2.id],
        dynamic: true,
        priority: 3,
      },
      {
        id: "price-comparison",
        type: "comparison_summary",
        title: "Preisvergleich",
        content: "Preisvergleich der verschiedenen Verträge und Optionen.",
        entities: [entity1.id, entity2.id],
        dynamic: true,
        priority: 4,
      },
      {
        id: "recommendation",
        type: "recommendation",
        title: "Unsere Empfehlung",
        content: "Basierend auf unserem Vergleich empfehlen wir...",
        entities: [entity1.id, entity2.id],
        dynamic: true,
        priority: 5,
      },
    ];
  }

  private calculateQualityScore(entity1: any, entity2: any): number {
    const hasSpecs = entity1.specs && entity2.specs;
    const hasPrices = entity1.price && entity2.price;
    const hasReviews = entity1.reviews && entity2.reviews;

    let score = 50;
    if (hasSpecs) score += 20;
    if (hasPrices) score += 20;
    if (hasReviews) score += 10;

    return score;
  }

  private calculateUniquenessScore(entity1: any, entity2: any): number {
    const brandDiff = entity1.brand !== entity2.brand;
    const priceDiff = Math.abs((entity1.price || 0) - (entity2.price || 0)) > 20;
    const specDiff = JSON.stringify(entity1.specs) !== JSON.stringify(entity2.specs);

    let score = 60;
    if (brandDiff) score += 15;
    if (priceDiff) score += 15;
    if (specDiff) score += 10;

    return score;
  }

  private getTypeLabel(comparisonType: string): string {
    const labels: Record<string, string> = {
      device: "Gerätevergleich",
      provider: "Markevergleich",
      contract: "Empfehlungsvergleich",
      feature: "Featurevergleich",
    };
    return labels[comparisonType] || "Vergleich";
  }

  getComparisonPage(pageId: string): ProgrammaticPage | undefined {
    return this.comparisonPages.get(pageId);
  }

  getAllComparisonPages(): ProgrammaticPage[] {
    return Array.from(this.comparisonPages.values());
  }
}
