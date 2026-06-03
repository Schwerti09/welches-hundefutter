import { ContentBlock } from "../types";

export class ContentBlockSystem {
  private blocks: Map<string, ContentBlock> = new Map();

  createRecommendationBlock(
    id: string,
    title: string,
    devices: any[],
    recommendations: any[]
  ): ContentBlock {
    const content = this.generateRecommendationContent(devices, recommendations);

    const block: ContentBlock = {
      id,
      type: "recommendation",
      title,
      content,
      entities: devices.map((d) => d.id),
      dynamic: true,
      priority: 1,
    };

    this.blocks.set(id, block);
    return block;
  }

  createProviderInsightBlock(
    id: string,
    provider: string,
    insights: string[]
  ): ContentBlock {
    const content = insights.join("\n\n");

    const block: ContentBlock = {
      id,
      type: "provider_insight",
      title: `${provider} Einblicke`,
      content,
      entities: [],
      dynamic: false,
      priority: 2,
    };

    this.blocks.set(id, block);
    return block;
  }

  createAIAdviceBlock(
    id: string,
    question: string,
    advice: string,
    context: string[]
  ): ContentBlock {
    const content = `${question}\n\n${advice}`;

    const block: ContentBlock = {
      id,
      type: "ai_advice",
      title: "KI-Empfehlung",
      content,
      entities: context,
      dynamic: true,
      priority: 3,
    };

    this.blocks.set(id, block);
    return block;
  }

  createComparisonSummaryBlock(
    id: string,
    entity1: any,
    entity2: any,
    comparison: any
  ): ContentBlock {
    const content = this.generateComparisonContent(entity1, entity2, comparison);

    const block: ContentBlock = {
      id,
      type: "comparison_summary",
      title: "Vergleichszusammenfassung",
      content,
      entities: [entity1.id, entity2.id],
      dynamic: true,
      priority: 2,
    };

    this.blocks.set(id, block);
    return block;
  }

  createProsConsBlock(
    id: string,
    entity1: any,
    entity2: any,
    pros: string[],
    cons: string[]
  ): ContentBlock {
    const content = this.generateProsConsContent(entity1, entity2, pros, cons);

    const block: ContentBlock = {
      id,
      type: "pros_cons",
      title: "Vor- und Nachteile",
      content,
      entities: [entity1.id, entity2.id],
      dynamic: true,
      priority: 3,
    };

    this.blocks.set(id, block);
    return block;
  }

  createFAQBlock(
    id: string,
    faqs: Array<{ question: string; answer: string }>
  ): ContentBlock {
    const content = faqs
      .map((faq) => `**${faq.question}**\n${faq.answer}`)
      .join("\n\n");

    const block: ContentBlock = {
      id,
      type: "faq",
      title: "Häufig gestellte Fragen",
      content,
      entities: [],
      dynamic: false,
      priority: 4,
    };

    this.blocks.set(id, block);
    return block;
  }

  createStatisticsBlock(
    id: string,
    statistics: Array<{ label: string; value: string; description?: string }>
  ): ContentBlock {
    const content = statistics
      .map((stat) => `**${stat.label}**: ${stat.value}${stat.description ? ` - ${stat.description}` : ""}`)
      .join("\n");

    const block: ContentBlock = {
      id,
      type: "statistics",
      title: "Statistiken",
      content,
      entities: [],
      dynamic: true,
      priority: 4,
    };

    this.blocks.set(id, block);
    return block;
  }

  createRelatedRecommendationsBlock(
    id: string,
    currentEntity: any,
    relatedEntities: any[]
  ): ContentBlock {
    const content = this.generateRelatedContent(currentEntity, relatedEntities);

    const block: ContentBlock = {
      id,
      type: "related_recommendations",
      title: "Ähnliche Empfehlungen",
      content,
      entities: relatedEntities.map((e) => e.id),
      dynamic: true,
      priority: 5,
    };

    this.blocks.set(id, block);
    return block;
  }

  private generateRecommendationContent(devices: any[], recommendations: any[]): string {
    return devices
      .map((device, index) => {
        const rec = recommendations[index];
        return `**${device.name}**: ${rec.reason} • €${rec.price}/Monat`;
      })
      .join("\n");
  }

  private generateComparisonContent(entity1: any, entity2: any, comparison: any): string {
    return `**${entity1.name}** vs **${entity2.name}**\n\n${comparison.summary}`;
  }

  private generateProsConsContent(
    entity1: any,
    entity2: any,
    pros: string[],
    cons: string[]
  ): string {
    return `**Vorteile**\n${pros.map((p) => `- ${p}`).join("\n")}\n\n**Nachteile**\n${cons.map((c) => `- ${c}`).join("\n")}`;
  }

  private generateRelatedContent(currentEntity: any, relatedEntities: any[]): string {
    return relatedEntities
      .map((entity) => `- ${entity.name}: ${entity.reason}`)
      .join("\n");
  }

  getBlock(blockId: string): ContentBlock | undefined {
    return this.blocks.get(blockId);
  }

  getAllBlocks(): ContentBlock[] {
    return Array.from(this.blocks.values());
  }

  getBlocksByType(type: ContentBlock["type"]): ContentBlock[] {
    return Array.from(this.blocks.values()).filter((block) => block.type === type);
  }
}
