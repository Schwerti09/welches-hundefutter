import { SEOAnalytics } from "../types";

export class SEOAnalyticsFoundation {
  private analytics: Map<string, SEOAnalytics[]> = new Map();

  trackEntityPerformance(
    entityId: string,
    rankingPosition: number,
    clickThroughRate: number,
    engagementScore: number
  ): void {
    const entityAnalytics = this.analytics.get(entityId) || [];

    const analytics: SEOAnalytics = {
      entityId,
      rankingPosition,
      clickThroughRate,
      engagementScore,
      entityPerformance: this.calculateEntityPerformance(rankingPosition, clickThroughRate, engagementScore),
      topicClusterPerformance: 0, // Calculated separately
      internalLinkClicks: 0,
      recommendationClicks: 0,
      timestamp: Date.now(),
    };

    entityAnalytics.push(analytics);
    this.analytics.set(entityId, entityAnalytics);
  }

  trackTopicClusterPerformance(
    clusterId: string,
    entityIds: string[]
  ): number {
    let totalPerformance = 0;
    let count = 0;

    for (const entityId of entityIds) {
      const entityAnalytics = this.analytics.get(entityId);
      if (entityAnalytics && entityAnalytics.length > 0) {
        const latest = entityAnalytics[entityAnalytics.length - 1];
        totalPerformance += latest.entityPerformance;
        count++;
      }
    }

    const clusterPerformance = count > 0 ? totalPerformance / count : 0;

    // Update all entities in cluster with cluster performance
    for (const entityId of entityIds) {
      const entityAnalytics = this.analytics.get(entityId);
      if (entityAnalytics && entityAnalytics.length > 0) {
        entityAnalytics[entityAnalytics.length - 1].topicClusterPerformance = clusterPerformance;
      }
    }

    return clusterPerformance;
  }

  trackInternalLinkClick(entityId: string): void {
    const entityAnalytics = this.analytics.get(entityId);
    if (entityAnalytics && entityAnalytics.length > 0) {
      entityAnalytics[entityAnalytics.length - 1].internalLinkClicks++;
    }
  }

  trackRecommendationClick(entityId: string): void {
    const entityAnalytics = this.analytics.get(entityId);
    if (entityAnalytics && entityAnalytics.length > 0) {
      entityAnalytics[entityAnalytics.length - 1].recommendationClicks++;
    }
  }

  getEntityAnalytics(entityId: string): SEOAnalytics[] {
    return this.analytics.get(entityId) || [];
  }

  getLatestEntityAnalytics(entityId: string): SEOAnalytics | undefined {
    const entityAnalytics = this.analytics.get(entityId);
    return entityAnalytics && entityAnalytics.length > 0
      ? entityAnalytics[entityAnalytics.length - 1]
      : undefined;
  }

  getTopPerformingEntities(limit: number = 10): Array<{ entityId: string; performance: number }> {
    const performances: Array<{ entityId: string; performance: number }> = [];

    for (const [entityId, entityAnalytics] of this.analytics) {
      if (entityAnalytics.length > 0) {
        const latest = entityAnalytics[entityAnalytics.length - 1];
        performances.push({
          entityId,
          performance: latest.entityPerformance,
        });
      }
    }

    return performances
      .sort((a, b) => b.performance - a.performance)
      .slice(0, limit);
  }

  getWorstPerformingEntities(limit: number = 10): Array<{ entityId: string; performance: number }> {
    const performances: Array<{ entityId: string; performance: number }> = [];

    for (const [entityId, entityAnalytics] of this.analytics) {
      if (entityAnalytics.length > 0) {
        const latest = entityAnalytics[entityAnalytics.length - 1];
        performances.push({
          entityId,
          performance: latest.entityPerformance,
        });
      }
    }

    return performances
      .sort((a, b) => a.performance - b.performance)
      .slice(0, limit);
  }

  getAverageCTR(entityId: string): number {
    const entityAnalytics = this.analytics.get(entityId);
    if (!entityAnalytics || entityAnalytics.length === 0) return 0;

    const totalCTR = entityAnalytics.reduce((sum, a) => sum + a.clickThroughRate, 0);
    return totalCTR / entityAnalytics.length;
  }

  getAverageEngagement(entityId: string): number {
    const entityAnalytics = this.analytics.get(entityId);
    if (!entityAnalytics || entityAnalytics.length === 0) return 0;

    const totalEngagement = entityAnalytics.reduce((sum, a) => sum + a.engagementScore, 0);
    return totalEngagement / entityAnalytics.length;
  }

  getRankingTrend(entityId: string, days: number = 30): Array<{ date: number; position: number }> {
    const entityAnalytics = this.analytics.get(entityId);
    if (!entityAnalytics) return [];

    const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;
    const recentAnalytics = entityAnalytics.filter((a) => a.timestamp >= cutoffTime);

    return recentAnalytics.map((a) => ({
      date: a.timestamp,
      position: a.rankingPosition,
    }));
  }

  private calculateEntityPerformance(
    rankingPosition: number,
    clickThroughRate: number,
    engagementScore: number
  ): number {
    // Lower ranking position is better
    const rankingScore = Math.max(0, 100 - rankingPosition);
    const ctrScore = clickThroughRate * 100;
    const engagementScoreNormalized = engagementScore;

    return Math.round((rankingScore * 0.4 + ctrScore * 0.3 + engagementScoreNormalized * 0.3));
  }
}
