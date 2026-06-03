import { ExecutiveDashboard, CompetitivenessScore, TrendDirection } from "../types";

export class ExecutiveMarketDashboardFoundation {
  private dashboard: ExecutiveDashboard | null = null;
  private competitivenessScores: Map<string, CompetitivenessScore> = new Map();

  setCompetitivenessScore(score: CompetitivenessScore): void {
    this.competitivenessScores.set(score.scoreId, score);
  }

  generateDashboard(): ExecutiveDashboard {
    const dashboard: ExecutiveDashboard = {
      dashboardId: `dashboard-${Date.now()}`,
      marketOverview: this.generateMarketOverview(),
      providerCompetitiveness: this.getProviderCompetitiveness(),
      recommendationPerformance: this.generateRecommendationPerformance(),
      pricingTrends: this.generatePricingTrends(),
      conversionIntelligence: this.generateConversionIntelligence(),
      seoAuthorityGrowth: this.generateSEOAuthorityGrowth(),
      generatedAt: Date.now(),
    };

    this.dashboard = dashboard;
    return dashboard;
  }

  getDashboard(): ExecutiveDashboard | null {
    return this.dashboard;
  }

  private generateMarketOverview(): ExecutiveDashboard["marketOverview"] {
    return {
      totalOffers: 1000,
      activeTrends: 15,
      marketConfidence: 75,
    };
  }

  private getProviderCompetitiveness(): CompetitivenessScore[] {
    return Array.from(this.competitivenessScores.values())
      .filter((s) => s.competitivenessType === "provider")
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }

  private generateRecommendationPerformance(): ExecutiveDashboard["recommendationPerformance"] {
    return {
      acceptanceRate: 65,
      conversionRate: 12,
      averageConfidence: 78,
    };
  }

  private generatePricingTrends(): Array<{ segment: string; trend: TrendDirection; change: number }> {
    return [
      { segment: "premium", trend: "up", change: 5 },
      { segment: "midrange", trend: "stable", change: 0 },
      { segment: "budget", trend: "down", change: -3 },
    ];
  }

  private generateConversionIntelligence(): ExecutiveDashboard["conversionIntelligence"] {
    return {
      totalConversions: 150,
      averageFunnelTime: 300,
      topConversionPath: "advisor → recommendation → conversion",
    };
  }

  private generateSEOAuthorityGrowth(): ExecutiveDashboard["seoAuthorityGrowth"] {
    return {
      authorityScore: 72,
      growth: 8,
      entities: 500,
    };
  }
}
