import { Trend, TrendCategory, TrendDirection } from "../types";

export class TrendDetectionSystem {
  private trends: Map<string, Trend> = new Map();
  private trendHistory: Map<string, Trend[]> = new Map();

  detectTrendingPhone(deviceId: string, deviceName: string, direction: TrendDirection, growth: number): Trend {
    return this.createTrend("device", deviceId, deviceName, direction, growth, {
      deviceName,
    });
  }

  detectTrendingProvider(providerId: string, providerName: string, direction: TrendDirection, growth: number): Trend {
    return this.createTrend("provider", providerId, providerName, direction, growth, {
      providerName,
    });
  }

  detectTrendingContractType(contractType: string, direction: TrendDirection, growth: number): Trend {
    return this.createTrend("contract", contractType, contractType, direction, growth, {
      contractType,
    });
  }

  detectRisingUserIntent(intent: string, direction: TrendDirection, growth: number): Trend {
    return this.createTrend("intent", intent, intent, direction, growth, {
      intent,
    });
  }

  detectEmergingRecommendationCluster(clusterId: string, clusterName: string, direction: TrendDirection, growth: number): Trend {
    return this.createTrend("segment", clusterId, clusterName, direction, growth, {
      clusterName,
    });
  }

  detectMarketShift(shiftType: string, direction: TrendDirection, growth: number): Trend {
    return this.createTrend("feature", shiftType, shiftType, direction, growth, {
      shiftType,
    });
  }

  detectPricingShift(shiftType: string, direction: TrendDirection, growth: number): Trend {
    return this.createTrend("feature", shiftType, shiftType, direction, growth, {
      shiftType,
    });
  }

  getTrend(trendId: string): Trend | undefined {
    return this.trends.get(trendId);
  }

  getTrendsByCategory(category: TrendCategory): Trend[] {
    return Array.from(this.trends.values()).filter((t) => t.trendCategory === category);
  }

  getTrendsByDirection(direction: TrendDirection): Trend[] {
    return Array.from(this.trends.values()).filter((t) => t.direction === direction);
  }

  getActiveTrends(confidenceThreshold: number = 60): Trend[] {
    return Array.from(this.trends.values()).filter((t) => t.confidence >= confidenceThreshold);
  }

  getTrendHistory(entityId: string): Trend[] {
    return this.trendHistory.get(entityId) || [];
  }

  private createTrend(category: TrendCategory, entityId: string, entityName: string, direction: TrendDirection, growth: number, metadata: Record<string, unknown>): Trend {
    const trend: Trend = {
      trendId: `trend-${category}-${entityId}-${Date.now()}`,
      trendCategory: category,
      entityId,
      entityName,
      direction,
      confidence: this.calculateConfidence(direction, growth),
      growth,
      stability: this.calculateStability(growth),
      predictionHorizon: 30 * 24 * 60 * 60 * 1000,
      detectedAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.trends.set(trend.trendId, trend);

    const history = this.trendHistory.get(entityId) || [];
    history.push(trend);
    this.trendHistory.set(entityId, history);

    return trend;
  }

  private calculateConfidence(direction: TrendDirection, growth: number): number {
    let confidence = 50;

    if (Math.abs(growth) > 20) confidence += 20;
    if (Math.abs(growth) > 10) confidence += 15;
    if (Math.abs(growth) > 5) confidence += 10;

    return Math.min(100, confidence);
  }

  private calculateStability(growth: number): number {
    return Math.max(0, 100 - Math.abs(growth));
  }
}
