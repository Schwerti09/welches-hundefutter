import { ProviderReliability, ProviderType } from "../types";

export class ProviderReliabilitySystem {
  private reliabilityScores: Map<string, ProviderReliability> = new Map();

  evaluateProvider(providerId: string, provider: ProviderType, metrics: ProviderMetrics): ProviderReliability {
    const reliability: ProviderReliability = {
      providerId,
      provider,
      updateFrequency: metrics.updateFrequency,
      dataQuality: this.calculateDataQuality(metrics),
      pricingReliability: this.calculatePricingReliability(metrics),
      offerConsistency: this.calculateOfferConsistency(metrics),
      availabilityAccuracy: this.calculateAvailabilityAccuracy(metrics),
      overallReliability: 0,
      lastEvaluatedAt: Date.now(),
    };

    reliability.overallReliability = this.calculateOverallReliability(reliability);

    this.reliabilityScores.set(providerId, reliability);
    return reliability;
  }

  getReliability(providerId: string): ProviderReliability | undefined {
    return this.reliabilityScores.get(providerId);
  }

  getMostReliableProviders(): ProviderReliability[] {
    return Array.from(this.reliabilityScores.values())
      .sort((a, b) => b.overallReliability - a.overallReliability);
  }

  private calculateDataQuality(metrics: ProviderMetrics): number {
    let score = 50;

    if (metrics.missingFields < 0.1) score += 20;
    if (metrics.invalidPricing < 0.05) score += 15;
    if (metrics.duplicateOffers < 0.05) score += 10;

    return Math.min(100, score);
  }

  private calculatePricingReliability(metrics: ProviderMetrics): number {
    let score = 50;

    if (metrics.priceAccuracy > 0.95) score += 25;
    if (metrics.priceChanges < 0.1) score += 15;

    return Math.min(100, score);
  }

  private calculateOfferConsistency(metrics: ProviderMetrics): number {
    let score = 50;

    if (metrics.offerStability > 0.9) score += 25;
    if (metrics.removedOffers < 0.1) score += 15;

    return Math.min(100, score);
  }

  private calculateAvailabilityAccuracy(metrics: ProviderMetrics): number {
    let score = 50;

    if (metrics.availabilityAccuracy > 0.95) score += 30;
    if (metrics.outdatedOffers < 0.1) score += 20;

    return Math.min(100, score);
  }

  private calculateOverallReliability(reliability: ProviderReliability): number {
    return Math.round(
      (reliability.dataQuality * 0.25 +
        reliability.pricingReliability * 0.25 +
        reliability.offerConsistency * 0.25 +
        reliability.availabilityAccuracy * 0.25)
    );
  }
}

export interface ProviderMetrics {
  updateFrequency: number;
  missingFields: number;
  invalidPricing: number;
  duplicateOffers: number;
  priceAccuracy: number;
  priceChanges: number;
  offerStability: number;
  removedOffers: number;
  availabilityAccuracy: number;
  outdatedOffers: number;
}
