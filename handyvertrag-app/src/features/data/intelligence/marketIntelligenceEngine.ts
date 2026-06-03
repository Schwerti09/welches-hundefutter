import { MarketIntelligence, CommerceOffer } from "../types";

export class MarketIntelligenceEngine {
  private intelligenceCache: Map<string, MarketIntelligence> = new Map();

  async generateMarketIntelligence(offers: CommerceOffer[]): Promise<MarketIntelligence> {
    const intelligence: MarketIntelligence = {
      intelligenceId: `intelligence-${Date.now()}`,
      generatedAt: Date.now(),
      trendingDevices: this.detectTrendingDevices(offers),
      bestValueProviders: this.calculateBestValueProviders(offers),
      marketPricingTrends: this.calculateMarketPricingTrends(offers),
      premiumMarketEvolution: this.calculatePremiumMarketEvolution(offers),
      budgetMarketEvolution: this.calculateBudgetMarketEvolution(offers),
      contractCompetitiveness: this.calculateContractCompetitiveness(offers),
    };

    this.intelligenceCache.set(intelligence.intelligenceId, intelligence);
    return intelligence;
  }

  getMarketIntelligence(intelligenceId: string): MarketIntelligence | undefined {
    return this.intelligenceCache.get(intelligenceId);
  }

  getLatestMarketIntelligence(): MarketIntelligence | undefined {
    const intelligences = Array.from(this.intelligenceCache.values());
    if (intelligences.length === 0) return undefined;

    return intelligences.sort((a, b) => b.generatedAt - a.generatedAt)[0];
  }

  private detectTrendingDevices(offers: CommerceOffer[]): MarketIntelligence["trendingDevices"] {
    const deviceCounts = new Map<string, number>();

    for (const offer of offers) {
      const deviceKey = `${offer.deviceBrand} ${offer.deviceName}`;
      const count = deviceCounts.get(deviceKey) || 0;
      deviceCounts.set(deviceKey, count + 1);
    }

    const trending: MarketIntelligence["trendingDevices"] = [];

    for (const [device, count] of deviceCounts) {
      trending.push({
        deviceId: device.toLowerCase().replace(/\s+/g, "-"),
        deviceName: device,
        trend: "up",
        change: count * 10,
      });
    }

    return trending.sort((a, b) => b.change - a.change).slice(0, 10);
  }

  private calculateBestValueProviders(offers: CommerceOffer[]): MarketIntelligence["bestValueProviders"] {
    const providerScores = new Map<string, number>();

    for (const offer of offers) {
      const score = this.calculateValueScore(offer);
      const currentScore = providerScores.get(offer.provider) || 0;
      providerScores.set(offer.provider, currentScore + score);
    }

    const bestValue: MarketIntelligence["bestValueProviders"] = [];

    for (const [provider, score] of providerScores) {
      const avgScore = score / offers.filter((o) => o.provider === provider).length;
      bestValue.push({
        providerId: provider.toLowerCase(),
        provider,
        valueScore: Math.round(avgScore),
      });
    }

    return bestValue.sort((a, b) => b.valueScore - a.valueScore);
  }

  private calculateMarketPricingTrends(offers: CommerceOffer[]): MarketIntelligence["marketPricingTrends"] {
    const segments = ["premium", "midrange", "budget"];
    const trends: MarketIntelligence["marketPricingTrends"] = [];

    for (const segment of segments) {
      const segmentOffers = this.getSegmentOffers(offers, segment);
      const avgPrice = segmentOffers.reduce((sum, o) => sum + o.monthlyPrice, 0) / Math.max(segmentOffers.length, 1);

      trends.push({
        segment,
        trend: "stable",
        change: avgPrice,
      });
    }

    return trends;
  }

  private calculatePremiumMarketEvolution(offers: CommerceOffer[]): MarketIntelligence["premiumMarketEvolution"] {
    const premiumOffers = offers.filter((o) => o.monthlyPrice > 70);
    const avgPrice = premiumOffers.reduce((sum, o) => sum + o.monthlyPrice, 0) / Math.max(premiumOffers.length, 1);
    const marketShare = premiumOffers.length / Math.max(offers.length, 1);

    return {
      avgPrice: Math.round(avgPrice),
      priceTrend: "stable",
      marketShare: Math.round(marketShare * 100),
    };
  }

  private calculateBudgetMarketEvolution(offers: CommerceOffer[]): MarketIntelligence["budgetMarketEvolution"] {
    const budgetOffers = offers.filter((o) => o.monthlyPrice < 40);
    const avgPrice = budgetOffers.reduce((sum, o) => sum + o.monthlyPrice, 0) / Math.max(budgetOffers.length, 1);
    const marketShare = budgetOffers.length / Math.max(offers.length, 1);

    return {
      avgPrice: Math.round(avgPrice),
      priceTrend: "stable",
      marketShare: Math.round(marketShare * 100),
    };
  }

  private calculateContractCompetitiveness(offers: CommerceOffer[]): MarketIntelligence["contractCompetitiveness"] {
    const providerScores = new Map<string, number>();

    for (const offer of offers) {
      const score = this.calculateCompetitivenessScore(offer);
      const currentScore = providerScores.get(offer.provider) || 0;
      providerScores.set(offer.provider, currentScore + score);
    }

    const competitiveness: MarketIntelligence["contractCompetitiveness"] = [];

    for (const [provider, score] of providerScores) {
      const avgScore = score / offers.filter((o) => o.provider === provider).length;
      competitiveness.push({
        providerId: provider.toLowerCase(),
        competitiveness: Math.round(avgScore),
        rank: 0,
      });
    }

    competitiveness.sort((a, b) => b.competitiveness - a.competitiveness);
    competitiveness.forEach((c, index) => (c.rank = index + 1));

    return competitiveness;
  }

  private getSegmentOffers(offers: CommerceOffer[], segment: string): CommerceOffer[] {
    switch (segment) {
      case "premium":
        return offers.filter((o) => o.monthlyPrice > 70);
      case "midrange":
        return offers.filter((o) => o.monthlyPrice >= 40 && o.monthlyPrice <= 70);
      case "budget":
        return offers.filter((o) => o.monthlyPrice < 40);
      default:
        return offers;
    }
  }

  private calculateValueScore(offer: CommerceOffer): number {
    let score = 50;

    if (offer.monthlyPrice < 30) score += 20;
    if (offer.monthlyPrice < 50) score += 15;
    if (offer.dataVolume === "Unlimited") score += 10;
    if (offer.cashback > 0) score += 5;

    return Math.min(100, score);
  }

  private calculateCompetitivenessScore(offer: CommerceOffer): number {
    let score = 50;

    if (offer.provider === "Anifit") score += 20;
    if (offer.provider === "Wolfsblut") score += 15;
    if (offer.dataVolume === "Unlimited") score += 10;
    if (offer.monthlyPrice < 50) score += 5;

    return Math.min(100, score);
  }
}
