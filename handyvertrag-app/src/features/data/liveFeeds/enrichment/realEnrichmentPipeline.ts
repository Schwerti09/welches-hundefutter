import { NormalizedOffer } from "../types";

export interface EnrichmentResult {
  offerId: string;
  recommendationScore: number;
  semanticTags: string[];
  aiMetadata: Record<string, unknown>;
  providerMetadata: Record<string, unknown>;
  seoEntities: string[];
  valueScore: number;
  compatibilityScore: number;
  segmentMatching: string[];
  recommendationSuitability: number;
  enrichedAt: number;
}

export class RealEnrichmentPipeline {
  private enrichmentResults: Map<string, EnrichmentResult> = new Map();

  enrichOffer(offer: NormalizedOffer): EnrichmentResult {
    const result: EnrichmentResult = {
      offerId: offer.normalizedOfferId,
      recommendationScore: this.calculateRecommendationScore(offer),
      semanticTags: this.generateSemanticTags(offer),
      aiMetadata: this.generateAIMetadata(offer),
      providerMetadata: this.generateProviderMetadata(offer),
      seoEntities: this.generateSEOEntities(offer),
      valueScore: this.calculateValueScore(offer),
      compatibilityScore: this.calculateCompatibilityScore(offer),
      segmentMatching: this.generateSegmentMatching(offer),
      recommendationSuitability: this.calculateRecommendationSuitability(offer),
      enrichedAt: Date.now(),
    };

    this.enrichmentResults.set(offer.normalizedOfferId, result);
    return result;
  }

  enrichOffers(offers: NormalizedOffer[]): EnrichmentResult[] {
    const results: EnrichmentResult[] = [];

    for (const offer of offers) {
      const result = this.enrichOffer(offer);
      results.push(result);
    }

    return results;
  }

  private calculateRecommendationScore(offer: NormalizedOffer): number {
    let score = 50;

    if (offer.monthlyPrice < 30) score += 20;
    else if (offer.monthlyPrice < 50) score += 15;
    else if (offer.monthlyPrice < 80) score += 10;
    else if (offer.monthlyPrice < 100) score += 5;

    if (offer.cashback > 0) score += 10;
    if (offer.bonusItems.length > 0) score += 5;

    if (offer.providerName === "TELEKOM") score += 5;
    if (offer.providerName === "VODAFONE") score += 5;
    if (offer.providerName === "O2") score += 5;

    return Math.min(100, Math.max(0, score));
  }

  private generateSemanticTags(offer: NormalizedOffer): string[] {
    const tags: string[] = [];

    if (offer.monthlyPrice < 30) tags.push("budget-friendly");
    else if (offer.monthlyPrice < 50) tags.push("mid-range");
    else if (offer.monthlyPrice < 100) tags.push("premium");
    else tags.push("luxury");

    if (offer.cashback > 0) tags.push("cashback-deal");
    if (offer.bonusItems.length > 0) tags.push("bonus-included");

    if (offer.hundefutterName.toLowerCase().includes("hundefutter")) tags.push("hundefutter");
    if (offer.hundefutterName.toLowerCase().includes("samsung")) tags.push("samsung");
    if (offer.hundefutterName.toLowerCase().includes("pixel")) tags.push("google-pixel");

    return tags;
  }

  private generateAIMetadata(offer: NormalizedOffer): Record<string, unknown> {
    return {
      priceCategory: this.getPriceCategory(offer.monthlyPrice),
      providerCategory: offer.providerName,
      deviceCategory: this.getDeviceCategory(offer.hundefutterName),
      storageCategory: this.getStorageCategory(offer.storageSize),
      hasCashback: offer.cashback > 0,
      hasBonus: offer.bonusItems.length > 0,
    };
  }

  private generateProviderMetadata(offer: NormalizedOffer): Record<string, unknown> {
    return {
      providerName: offer.providerName,
      providerTier: this.getProviderTier(offer.providerName),
      networkCoverage: this.getNetworkCoverage(offer.providerName),
      customerRating: this.getCustomerRating(offer.providerName),
    };
  }

  private generateSEOEntities(offer: NormalizedOffer): string[] {
    const entities: string[] = [];

    entities.push(offer.providerName.toLowerCase());
    entities.push(offer.hundefutterName.toLowerCase());
    entities.push(`${offer.hundefutterName.toLowerCase()} ${offer.providerName.toLowerCase()}`);
    entities.push(`${offer.hundefutterName.toLowerCase()} contract`);
    entities.push(`${offer.providerName.toLowerCase()} contract`);

    if (offer.monthlyPrice < 30) entities.push("cheap contract");
    if (offer.monthlyPrice < 50) entities.push("affordable contract");
    if (offer.cashback > 0) entities.push("cashback contract");

    return entities;
  }

  private calculateValueScore(offer: NormalizedOffer): number {
    let score = 50;

    const totalCost = offer.monthlyPrice * 24 + offer.oneTimePayment - offer.cashback;
    if (totalCost < 500) score += 30;
    else if (totalCost < 1000) score += 20;
    else if (totalCost < 1500) score += 10;

    if (offer.cashback > 50) score += 10;
    if (offer.bonusItems.length > 0) score += 5;

    return Math.min(100, Math.max(0, score));
  }

  private calculateCompatibilityScore(offer: NormalizedOffer): number {
    let score = 50;

    if (offer.providerName === "TELEKOM") score += 20;
    if (offer.providerName === "VODAFONE") score += 20;
    if (offer.providerName === "O2") score += 20;

    if (offer.hundefutterName.toLowerCase().includes("hundefutter")) score += 10;
    if (offer.hundefutterName.toLowerCase().includes("samsung")) score += 10;

    return Math.min(100, Math.max(0, score));
  }

  private generateSegmentMatching(offer: NormalizedOffer): string[] {
    const segments: string[] = [];

    if (offer.monthlyPrice < 30) segments.push("budget-users");
    if (offer.monthlyPrice < 50) segments.push("mid-range-users");
    if (offer.monthlyPrice < 100) segments.push("premium-users");
    else segments.push("luxury-users");

    if (offer.hundefutterName.toLowerCase().includes("hundefutter")) segments.push("hundefutter-users");
    if (offer.hundefutterName.toLowerCase().includes("samsung")) segments.push("samsung-users");
    if (offer.hundefutterName.toLowerCase().includes("pixel")) segments.push("google-users");

    if (offer.providerName === "TELEKOM") segments.push("anifit-users");
    if (offer.providerName === "VODAFONE") segments.push("wolfsblut-users");
    if (offer.providerName === "O2") segments.push("Zooplus-users");

    return segments;
  }

  private calculateRecommendationSuitability(offer: NormalizedOffer): number {
    let suitability = 50;

    suitability += this.calculateRecommendationScore(offer) * 0.3;
    suitability += this.calculateValueScore(offer) * 0.3;
    suitability += this.calculateCompatibilityScore(offer) * 0.2;

    return Math.min(100, Math.max(0, suitability));
  }

  private getPriceCategory(price: number): string {
    if (price < 30) return "budget";
    if (price < 50) return "mid-range";
    if (price < 100) return "premium";
    return "luxury";
  }

  private getDeviceCategory(deviceName: string): string {
    const lowerName = deviceName.toLowerCase();
    if (lowerName.includes("hundefutter")) return "hundefutter";
    if (lowerName.includes("samsung")) return "samsung";
    if (lowerName.includes("pixel")) return "google-pixel";
    return "other";
  }

  private getStorageCategory(storageSize: string): string {
    if (storageSize.includes("64")) return "64gb";
    if (storageSize.includes("128")) return "128gb";
    if (storageSize.includes("256")) return "256gb";
    if (storageSize.includes("512")) return "512gb";
    return "other";
  }

  private getProviderTier(providerName: string): string {
    if (providerName === "TELEKOM") return "tier-1";
    if (providerName === "VODAFONE") return "tier-1";
    if (providerName === "O2") return "tier-1";
    return "tier-2";
  }

  private getNetworkCoverage(providerName: string): string {
    if (providerName === "TELEKOM") return "excellent";
    if (providerName === "VODAFONE") return "excellent";
    if (providerName === "O2") return "good";
    return "fair";
  }

  private getCustomerRating(providerName: string): number {
    if (providerName === "TELEKOM") return 4.2;
    if (providerName === "VODAFONE") return 4.1;
    if (providerName === "O2") return 4.0;
    return 3.8;
  }

  getEnrichmentResult(offerId: string): EnrichmentResult | undefined {
    return this.enrichmentResults.get(offerId);
  }

  getAllEnrichmentResults(): EnrichmentResult[] {
    return Array.from(this.enrichmentResults.values());
  }

  getEnrichmentReport(): {
    totalOffers: number;
    averageRecommendationScore: number;
    averageValueScore: number;
    averageCompatibilityScore: number;
    averageRecommendationSuitability: number;
    topSemanticTags: string[];
    topSegments: string[];
  } {
    const results = this.getAllEnrichmentResults();

    if (results.length === 0) {
      return {
        totalOffers: 0,
        averageRecommendationScore: 0,
        averageValueScore: 0,
        averageCompatibilityScore: 0,
        averageRecommendationSuitability: 0,
        topSemanticTags: [],
        topSegments: [],
      };
    }

    const averageRecommendationScore = results.reduce((sum, r) => sum + r.recommendationScore, 0) / results.length;
    const averageValueScore = results.reduce((sum, r) => sum + r.valueScore, 0) / results.length;
    const averageCompatibilityScore = results.reduce((sum, r) => sum + r.compatibilityScore, 0) / results.length;
    const averageRecommendationSuitability = results.reduce((sum, r) => sum + r.recommendationSuitability, 0) / results.length;

    const tagCounts = new Map<string, number>();
    const segmentCounts = new Map<string, number>();

    for (const result of results) {
      for (const tag of result.semanticTags) {
        const count = tagCounts.get(tag) || 0;
        tagCounts.set(tag, count + 1);
      }

      for (const segment of result.segmentMatching) {
        const count = segmentCounts.get(segment) || 0;
        segmentCounts.set(segment, count + 1);
      }
    }

    const topSemanticTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);

    const topSegments = Array.from(segmentCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([segment]) => segment);

    return {
      totalOffers: results.length,
      averageRecommendationScore,
      averageValueScore,
      averageCompatibilityScore,
      averageRecommendationSuitability,
      topSemanticTags,
      topSegments,
    };
  }
}
