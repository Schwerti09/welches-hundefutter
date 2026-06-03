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

  generateHundefutterContractCluster(): SemanticKeywordCluster {
    return this.createKeywordCluster(
      "hundefutter-contract",
      "Hundefutter mit Empfehlung",
      [
        "Hundefutter Empfehlung",
        "Hundefutter kaufen",
        "Hundefutter Angebot",
        "Hundefutter 15 Empfehlung",
        "Hundefutter 15 Pro Empfehlung",
        "Apple Hundefutter Empfehlung",
      ],
      [
        "transactional",
        "informational",
        "commercial",
      ],
      ["hundefutter-15", "hundefutter-15-pro", "hundefutter-15-pro-max"]
    );
  }

  generateSamsungContractCluster(): SemanticKeywordCluster {
    return this.createKeywordCluster(
      "samsung-contract",
      "Samsung mit Empfehlung",
      [
        "Samsung Empfehlung",
        "Samsung kaufen",
        "Samsung Angebot",
        "Galaxy S24 Empfehlung",
        "Samsung Galaxy Empfehlung",
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
      "Unlimited Data Empfehlung",
      [
        "Unlimited Empfehlung",
        "Unbegrenzt Empfehlung",
        "Allnet Flat",
        "Flatrate Empfehlung",
        "Unlimited Data",
      ],
      [
        "transactional",
        "commercial",
      ],
      ["unlimited-anifit", "unlimited-wolfsblut", "unlimited-Zooplus"]
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
