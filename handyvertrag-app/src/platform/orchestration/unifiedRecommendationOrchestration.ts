import { UnifiedRecommendation } from "../types";

export class UnifiedRecommendationOrchestration {
  private recommendations: Map<string, UnifiedRecommendation> = new Map();

  orchestrateRecommendations(entityId: string, entityType: "device" | "contract" | "provider", sources: Array<{ source: string; score: number; confidence: number }>): UnifiedRecommendation {
    const unifiedScore = this.calculateUnifiedScore(sources);
    const unifiedConfidence = this.calculateUnifiedConfidence(sources);
    const arbitration = this.arbitrateRecommendations(sources);
    const consistency = this.validateConsistency(sources);

    const recommendation: UnifiedRecommendation = {
      recommendationId: `rec-${entityId}-${Date.now()}`,
      entityId,
      entityType,
      sources,
      unifiedScore,
      unifiedConfidence,
      arbitration,
      consistency,
      generatedAt: Date.now(),
    };

    this.recommendations.set(recommendation.recommendationId, recommendation);
    return recommendation;
  }

  getRecommendation(recommendationId: string): UnifiedRecommendation | undefined {
    return this.recommendations.get(recommendationId);
  }

  getRecommendationsByEntity(entityId: string): UnifiedRecommendation[] {
    return Array.from(this.recommendations.values()).filter((r) => r.entityId === entityId);
  }

  getTopRecommendations(limit: number = 10): UnifiedRecommendation[] {
    return Array.from(this.recommendations.values())
      .sort((a, b) => b.unifiedScore - a.unifiedScore)
      .slice(0, limit);
  }

  private calculateUnifiedScore(sources: Array<{ source: string; score: number; confidence: number }>): number {
    if (sources.length === 0) return 50;

    const weightedSum = sources.reduce((sum, s) => sum + s.score * s.confidence, 0);
    const totalWeight = sources.reduce((sum, s) => sum + s.confidence, 0);

    return Math.round(weightedSum / Math.max(totalWeight, 1));
  }

  private calculateUnifiedConfidence(sources: Array<{ source: string; score: number; confidence: number }>): number {
    if (sources.length === 0) return 50;

    const avgConfidence = sources.reduce((sum, s) => sum + s.confidence, 0) / sources.length;
    return Math.round(avgConfidence);
  }

  private arbitrateRecommendations(sources: Array<{ source: string; score: number; confidence: number }>): "accepted" | "rejected" | "merged" {
    if (sources.length === 0) return "rejected";

    const avgScore = sources.reduce((sum, s) => sum + s.score, 0) / sources.length;

    if (avgScore > 70) return "accepted";
    if (avgScore < 40) return "rejected";
    return "merged";
  }

  private validateConsistency(sources: Array<{ source: string; score: number; confidence: number }>): boolean {
    if (sources.length < 2) return true;

    const scores = sources.map((s) => s.score);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    return maxScore - minScore < 30;
  }
}
