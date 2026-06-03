import { CompetitivenessScore, CompetitivenessType, TrendDirection } from "../types";

export class MarketCompetitivenessEngine {
  private scores: Map<string, CompetitivenessScore> = new Map();

  calculateProviderCompetitiveness(providerId: string, providerName: string, factors: CompetitivenessFactor[]): CompetitivenessScore {
    return this.createCompetitivenessScore("provider", providerId, providerName, factors);
  }

  calculateDeviceCompetitiveness(deviceId: string, deviceName: string, factors: CompetitivenessFactor[]): CompetitivenessScore {
    return this.createCompetitivenessScore("device", deviceId, deviceName, factors);
  }

  calculatePricingCompetitiveness(entityId: string, entityName: string, factors: CompetitivenessFactor[]): CompetitivenessScore {
    return this.createCompetitivenessScore("pricing", entityId, entityName, factors);
  }

  calculateValueCompetitiveness(entityId: string, entityName: string, factors: CompetitivenessFactor[]): CompetitivenessScore {
    return this.createCompetitivenessScore("value", entityId, entityName, factors);
  }

  calculateRecommendationCompetitiveness(entityId: string, entityName: string, factors: CompetitivenessFactor[]): CompetitivenessScore {
    return this.createCompetitivenessScore("recommendation", entityId, entityName, factors);
  }

  getCompetitivenessScore(scoreId: string): CompetitivenessScore | undefined {
    return this.scores.get(scoreId);
  }

  getCompetitivenessScoresByType(type: CompetitivenessType): CompetitivenessScore[] {
    return Array.from(this.scores.values()).filter((s) => s.competitivenessType === type);
  }

  getTopCompetitiveScores(type: CompetitivenessType, limit: number = 10): CompetitivenessScore[] {
    return this.getCompetitivenessScoresByType(type)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  private createCompetitivenessScore(type: CompetitivenessType, entityId: string, entityName: string, factors: CompetitivenessFactor[]): CompetitivenessScore {
    const score = this.calculateWeightedScore(factors);
    const trend = this.calculateTrend(factors);

    const competitivenessScore: CompetitivenessScore = {
      scoreId: `score-${type}-${entityId}-${Date.now()}`,
      competitivenessType: type,
      entityId,
      entityName,
      score,
      rank: 0,
      trend,
      factors,
      calculatedAt: Date.now(),
    };

    this.scores.set(competitivenessScore.scoreId, competitivenessScore);

    this.updateRanks(type);

    return competitivenessScore;
  }

  private calculateWeightedScore(factors: CompetitivenessFactor[]): number {
    let totalScore = 0;
    let totalWeight = 0;

    for (const factor of factors) {
      totalScore += factor.score * factor.weight;
      totalWeight += factor.weight;
    }

    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 50;
  }

  private calculateTrend(factors: CompetitivenessFactor[]): TrendDirection {
    const avgFactor = factors.reduce((sum, f) => sum + f.score, 0) / Math.max(factors.length, 1);

    if (avgFactor > 60) return "up";
    if (avgFactor < 40) return "down";
    return "stable";
  }

  private updateRanks(type: CompetitivenessType): void {
    const scores = this.getCompetitivenessScoresByType(type);
    scores.sort((a, b) => b.score - a.score);

    scores.forEach((score, index) => {
      score.rank = index + 1;
    });
  }
}

export interface CompetitivenessFactor {
  factor: string;
  score: number;
  weight: number;
}
