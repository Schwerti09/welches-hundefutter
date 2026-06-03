import { ProgrammaticPage } from "../types";

export class BestForSEOSystem {
  private recommendationPages: Map<string, ProgrammaticPage> = new Map();

  createRecommendationPage(
    segment: string,
    devices: any[],
    filters: Record<string, unknown> = {}
  ): ProgrammaticPage {
    const slug = `beste-${segment}-handys-mit-vertrag`;
    const metadata = this.generateMetadata(segment, devices, filters);

    const page: ProgrammaticPage = {
      id: `best-for-${segment}`,
      type: "best_for",
      slug,
      canonicalUrl: `/empfehlungen/${slug}`,
      entities: devices.map((d) => d.id),
      template: "best-for",
      contentBlocks: this.generateContentBlocks(segment, devices),
      metadata,
      qualityScore: this.calculateQualityScore(devices),
      uniquenessScore: this.calculateUniquenessScore(segment, filters),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.recommendationPages.set(page.id, page);
    return page;
  }

  createGamingRecommendationPage(devices: any[]): ProgrammaticPage {
    return this.createRecommendationPage("gaming", devices, {
      minGamingScore: 80,
      minPerformanceScore: 80,
    });
  }

  createCameraRecommendationPage(devices: any[]): ProgrammaticPage {
    return this.createRecommendationPage("photographers", devices, {
      minCameraScore: 85,
    });
  }

  createStudentRecommendationPage(devices: any[]): ProgrammaticPage {
    return this.createRecommendationPage("students", devices, {
      maxValueScore: 70,
      maxPrice: 50,
    });
  }

  createBudgetRecommendationPage(devices: any[]): ProgrammaticPage {
    return this.createRecommendationPage("budget", devices, {
      maxPrice: 40,
      minValueScore: 80,
    });
  }

  createBusinessRecommendationPage(devices: any[]): ProgrammaticPage {
    return this.createRecommendationPage("business", devices, {
      minPerformanceScore: 85,
      minLongevityScore: 85,
      providerReliability: 90,
    });
  }

  private generateMetadata(segment: string, devices: any[], filters: Record<string, unknown>): any {
    const segmentName = this.getSegmentName(segment);
    return {
      title: `Beste ${segmentName} Handys mit Vertrag 2026`,
      description: `Die besten ${segmentName} Handys mit Vertrag im Vergleich. ${devices.length} Top-Empfehlungen mit detaillierten Tests und Preisen.`,
      keywords: [
        `beste ${segment} handys`,
        `${segment} handyvertrag`,
        `${segment} handy empfehlung`,
      ],
    };
  }

  private generateContentBlocks(segment: string, devices: any[]): any[] {
    return [
      {
        id: "recommendation-intro",
        type: "ai_advice",
        title: `${this.getSegmentName(segment)} Empfehlungen`,
        content: `Unsere KI-gestützten Empfehlungen für ${segment} basieren auf detaillierten Analysen von Leistung, Preis und Nutzerbedürfnissen.`,
        entities: devices.map((d) => d.id),
        dynamic: true,
        priority: 1,
      },
      {
        id: "recommendation-list",
        type: "recommendation",
        title: "Top Empfehlungen",
        content: `Die ${devices.length} besten ${segment} Handys im Detail.`,
        entities: devices.map((d) => d.id),
        dynamic: true,
        priority: 2,
      },
      {
        id: "segment-criteria",
        type: "ai_advice",
        title: "Auswahlkriterien",
        content: `Diese Handys wurden basierend auf spezifischen ${segment}-Kriterien ausgewählt.`,
        entities: [],
        dynamic: false,
        priority: 3,
      },
    ];
  }

  private calculateQualityScore(devices: any[]): number {
    if (devices.length === 0) return 0;
    if (devices.length < 3) return 60;
    if (devices.length < 5) return 80;
    return 90;
  }

  private calculateUniquenessScore(segment: string, filters: Record<string, unknown>): number {
    const filterCount = Object.keys(filters).length;
    return 70 + filterCount * 5;
  }

  private getSegmentName(segment: string): string {
    const names: Record<string, string> = {
      gaming: "Gaming",
      photographers: "Fotografen",
      students: "Studenten",
      budget: "Budget",
      business: "Business",
      travelers: "Reisende",
      families: "Familien",
      creators: "Content Creator",
    };
    return names[segment] || segment;
  }

  getRecommendationPage(pageId: string): ProgrammaticPage | undefined {
    return this.recommendationPages.get(pageId);
  }

  getAllRecommendationPages(): ProgrammaticPage[] {
    return Array.from(this.recommendationPages.values());
  }
}
