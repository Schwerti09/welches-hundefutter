import { SemanticKeywordCluster } from "../types";

export class ContentIntelligence {
  private keywordClusters: Map<string, SemanticKeywordCluster> = new Map();
  private userIntents: Map<string, string[]> = new Map();
  private relatedQuestions: Map<string, string[]> = new Map();

  createKeywordCluster(
    id: string,
    primaryKeyword: string,
    relatedKeywords: string[],
    userIntents: string[],
    entities: string[]
  ): SemanticKeywordCluster {
    const cluster: SemanticKeywordCluster = {
      id,
      primaryKeyword,
      relatedKeywords,
      userIntents,
      entities,
      opportunityScore: this.calculateOpportunityScore(relatedKeywords, userIntents),
    };

    this.keywordClusters.set(id, cluster);
    return cluster;
  }

  addUserIntent(topic: string, intents: string[]): void {
    this.userIntents.set(topic, intents);
  }

  addRelatedQuestions(topic: string, questions: string[]): void {
    this.relatedQuestions.set(topic, questions);
  }

  calculateOpportunityScore(relatedKeywords: string[], userIntents: string[]): number {
    const keywordScore = Math.min(100, relatedKeywords.length * 10);
    const intentScore = Math.min(100, userIntents.length * 15);
    return Math.round((keywordScore + intentScore) / 2);
  }

  generateiPhoneContractCluster(): SemanticKeywordCluster {
    return this.createKeywordCluster(
      "iphone-contract",
      "iPhone mit Vertrag",
      [
        "iPhone Vertrag",
        "iPhone kaufen",
        "iPhone Angebot",
        "iPhone 15 Vertrag",
        "iPhone 15 Pro Vertrag",
        "Apple iPhone Vertrag",
      ],
      [
        "transactional",
        "informational",
        "commercial",
      ],
      ["iphone-15", "iphone-15-pro", "iphone-15-pro-max"]
    );
  }

  generateSamsungContractCluster(): SemanticKeywordCluster {
    return this.createKeywordCluster(
      "samsung-contract",
      "Samsung mit Vertrag",
      [
        "Samsung Vertrag",
        "Samsung kaufen",
        "Samsung Angebot",
        "Galaxy S24 Vertrag",
        "Samsung Galaxy Vertrag",
      ],
      [
        "transactional",
        "informational",
        "commercial",
      ],
      ["samsung-galaxy-s24", "samsung-galaxy-s24-ultra"]
    );
  }

  generateUnlimitedDataContractCluster(): SemanticKeywordCluster {
    return this.createKeywordCluster(
      "unlimited-data",
      "Unlimited Data Vertrag",
      [
        "Unlimited Vertrag",
        "Unbegrenzt Vertrag",
        "Allnet Flat",
        "Flatrate Vertrag",
        "Unlimited Data",
      ],
      [
        "transactional",
        "commercial",
      ],
      ["unlimited-telekom", "unlimited-vodafone", "unlimited-o2"]
    );
  }

  getKeywordCluster(clusterId: string): SemanticKeywordCluster | undefined {
    return this.keywordClusters.get(clusterId);
  }

  getUserIntents(topic: string): string[] {
    return this.userIntents.get(topic) || [];
  }

  getRelatedQuestions(topic: string): string[] {
    return this.relatedQuestions.get(topic) || [];
  }

  mapSearchJourney(topic: string): Array<{ step: string; intent: string }> {
    const intents = this.getUserIntents(topic);
    const questions = this.getRelatedQuestions(topic);

    const journey: Array<{ step: string; intent: string }> = [];

    if (intents.includes("informational")) {
      journey.push({ step: "awareness", intent: "informational" });
    }

    if (intents.includes("commercial")) {
      journey.push({ step: "consideration", intent: "commercial" });
    }

    if (intents.includes("transactional")) {
      journey.push({ step: "decision", intent: "transactional" });
    }

    return journey;
  }

  identifyContentGaps(currentContent: string[], targetKeywords: string[]): string[] {
    const gaps: string[] = [];

    for (const keyword of targetKeywords) {
      if (!currentContent.some((content) => content.toLowerCase().includes(keyword.toLowerCase()))) {
        gaps.push(keyword);
      }
    }

    return gaps;
  }
}
