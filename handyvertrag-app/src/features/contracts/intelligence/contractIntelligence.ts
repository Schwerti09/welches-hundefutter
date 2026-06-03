import { ContractIntelligence, ContractScores, ContractClassification } from "../../intelligence/types";

export class ContractIntelligenceEngine {
  generateIntelligence(offer: any, product: any): ContractIntelligence {
    const scores = this.calculateScores(offer);
    const classification = this.classifyContract(scores, offer);
    const suitability = this.calculateSuitability(scores, offer);
    const semanticTags = this.generateSemanticTags(scores, offer);

    return {
      contractId: offer.id,
      scores,
      classification,
      unlimitedClassification: this.isUnlimited(offer),
      budgetClassification: this.isBudget(offer),
      suitability,
      semanticTags,
    };
  }

  private calculateScores(offer: any): ContractScores {
    // Value Score
    let valueScore = 50;
    const dataVolume = this.parseDataVolume(offer.dataVolume);
    const valueRatio = dataVolume / offer.monthlyPrice;
    
    if (valueRatio > 1.0) valueScore = 95;
    if (valueRatio > 0.7) valueScore = 85;
    if (valueRatio > 0.5) valueScore = 75;

    // Roaming Friendliness
    let roamingFriendliness = 70;
    if (offer.features.includes("Roaming EU")) roamingFriendliness = 90;

    // 5G Quality
    let fiveGQuality = 70;
    if (offer.features.includes("5G")) fiveGQuality = 85;

    // Provider Reliability
    let providerReliability = 70;
    const provider = offer.provider.toLowerCase();
    if (provider === "telekom") providerReliability = 95;
    if (provider === "vodafone") providerReliability = 85;
    if (provider === "o2") providerReliability = 75;

    return {
      valueScore,
      dataValueRatio: valueRatio,
      roamingFriendliness,
      fiveGQuality,
      providerReliability,
    };
  }

  private classifyContract(scores: ContractScores, offer: any): ContractClassification {
    if (scores.valueScore > 85 && offer.monthlyPrice > 45) return "premium";
    if (scores.valueScore > 70) return "value";
    return "budget";
  }

  private calculateSuitability(scores: ContractScores, offer: any): {
    students: number;
    business: number;
    families: number;
    travelers: number;
  } {
    const dataVolume = this.parseDataVolume(offer.dataVolume);

    return {
      students: scores.valueScore > 70 ? 80 : 50,
      business: scores.providerReliability > 80 ? 85 : 60,
      families: dataVolume > 30 ? 80 : 50,
      travelers: scores.roamingFriendliness > 80 ? 90 : 60,
    };
  }

  private generateSemanticTags(scores: ContractScores, offer: any): string[] {
    const tags: string[] = [];

    if (scores.valueScore > 85) tags.push("best-value");
    if (scores.dataValueRatio > 1.0) tags.push("data-generous");
    if (scores.roamingFriendliness > 85) tags.push("roaming-friendly");
    if (scores.fiveGQuality > 80) tags.push("5g-ready");
    if (scores.providerReliability > 85) tags.push("reliable-network");
    if (offer.monthlyPrice < 40) tags.push("budget-friendly");

    return tags;
  }

  private isUnlimited(offer: any): boolean {
    return offer.dataVolume.toLowerCase().includes("unlimited") || 
           offer.dataVolume.toLowerCase().includes("unbegrenzt");
  }

  private isBudget(offer: any): boolean {
    return offer.monthlyPrice < 40;
  }

  private parseDataVolume(volume: string): number {
    const match = volume.match(/(\d+)\s*GB/);
    if (match) return parseInt(match[1], 10);
    return 0;
  }
}
