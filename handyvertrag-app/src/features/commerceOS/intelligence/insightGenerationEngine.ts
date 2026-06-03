import { IntelligenceInsight, InsightType } from "../types";

export class InsightGenerationEngine {
  private insights: Map<string, IntelligenceInsight> = new Map();

  generateMarketMomentumInsight(momentum: string, confidence: number, entities: string[]): IntelligenceInsight {
    return this.createInsight("market_momentum", `Market Momentum: ${momentum}`, `The market is showing ${momentum} momentum.`, `Market showing ${momentum} momentum with ${confidence}% confidence.`, undefined, `Market momentum indicates ${momentum}.`, confidence, entities);
  }

  generateProviderShiftInsight(provider: string, shift: string, confidence: number): IntelligenceInsight {
    return this.createInsight("provider_shift", `Provider Shift: ${provider}`, `${provider} is experiencing ${shift} in market position.`, `${provider} showing ${shift} with ${confidence}% confidence.`, undefined, `${provider} is ${shift}.`, confidence, [provider]);
  }

  generatePricingShiftInsight(shift: string, confidence: number, entities: string[]): IntelligenceInsight {
    return this.createInsight("pricing_shift", `Pricing Shift: ${shift}`, `Pricing is shifting ${shift} across the market.`, `Pricing showing ${shift} with ${confidence}% confidence.`, undefined, `Pricing is ${shift}.`, confidence, entities);
  }

  generateDemandShiftInsight(demandType: string, shift: string, confidence: number): IntelligenceInsight {
    return this.createInsight("demand_shift", `Demand Shift: ${demandType}`, `Demand for ${demandType} is ${shift}.`, `${demandType} demand ${shift} with ${confidence}% confidence.`, undefined, `${demandType} demand is ${shift}.`, confidence, [demandType]);
  }

  generateCompetitivenessChangeInsight(entity: string, change: string, confidence: number): IntelligenceInsight {
    return this.createInsight("competitiveness_change", `Competitiveness Change: ${entity}`, `${entity} competitiveness is ${change}.`, `${entity} competitiveness ${change} with ${confidence}% confidence.`, undefined, `${entity} competitiveness ${change}.`, confidence, [entity]);
  }

  generateTrendEmergenceInsight(trend: string, confidence: number, entities: string[]): IntelligenceInsight {
    return this.createInsight("trend_emergence", `Trend Emergence: ${trend}`, `New trend emerging: ${trend}.`, `${trend} emerging with ${confidence}% confidence.`, undefined, `${trend} is emerging.`, confidence, entities);
  }

  getInsight(insightId: string): IntelligenceInsight | undefined {
    return this.insights.get(insightId);
  }

  getInsightsByType(type: InsightType): IntelligenceInsight[] {
    return Array.from(this.insights.values()).filter((i) => i.insightType === type);
  }

  getActiveInsights(): IntelligenceInsight[] {
    const now = Date.now();
    return Array.from(this.insights.values()).filter((i) => i.expiresAt > now);
  }

  getInsightsForSEO(): IntelligenceInsight[] {
    return Array.from(this.insights.values()).filter((i) => i.seoBlock);
  }

  getInsightsForAdvisor(): IntelligenceInsight[] {
    return Array.from(this.insights.values()).filter((i) => i.advisorInsight);
  }

  private createInsight(type: InsightType, title: string, summary: string, aiReadySummary: string, seoBlock: string | undefined, advisorInsight: string | undefined, confidence: number, entities: string[]): IntelligenceInsight {
    const insight: IntelligenceInsight = {
      insightId: `insight-${type}-${Date.now()}`,
      insightType: type,
      title,
      summary,
      aiReadySummary,
      seoBlock,
      advisorInsight,
      confidence,
      entities,
      signals: [],
      generatedAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };

    this.insights.set(insight.insightId, insight);
    return insight;
  }
}
