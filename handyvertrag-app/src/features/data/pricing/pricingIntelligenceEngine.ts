import { PricingHistory, CommerceOffer } from "../types";

export class PricingIntelligenceEngine {
  private pricingHistory: Map<string, PricingHistory> = new Map();
  private priceTrends: Map<string, "increasing" | "decreasing" | "stable"> = new Map();

  trackPriceChange(offerId: string, newPrice: number, source: string): void {
    const history = this.pricingHistory.get(offerId) || this.createEmptyHistory(offerId);

    history.priceHistory.push({
      price: newPrice,
      effectiveAt: Date.now(),
      source,
    });

    history.priceChanges++;
    history.lastPriceChangeAt = Date.now();

    // Update best historical price
    if (newPrice < history.bestHistoricalPrice || history.bestHistoricalPrice === 0) {
      history.bestHistoricalPrice = newPrice;
      history.bestHistoricalPriceAt = Date.now();
    }

    // Update price trend
    history.priceTrend = this.calculatePriceTrend(history.priceHistory);

    this.pricingHistory.set(offerId, history);
  }

  getPricingHistory(offerId: string): PricingHistory | undefined {
    return this.pricingHistory.get(offerId);
  }

  getBestHistoricalPrice(offerId: string): number | undefined {
    const history = this.pricingHistory.get(offerId);
    return history?.bestHistoricalPrice;
  }

  getCurrentPrice(offerId: string): number | undefined {
    const history = this.pricingHistory.get(offerId);
    if (!history || history.priceHistory.length === 0) return undefined;

    return history.priceHistory[history.priceHistory.length - 1].price;
  }

  getPriceTrend(offerId: string): "increasing" | "decreasing" | "stable" | undefined {
    return this.priceTrends.get(offerId);
  }

  detectPriceDrop(offerId: string, threshold: number = 10): boolean {
    const history = this.pricingHistory.get(offerId);
    if (!history || history.priceHistory.length < 2) return false;

    const currentPrice = history.priceHistory[history.priceHistory.length - 1].price;
    const previousPrice = history.priceHistory[history.priceHistory.length - 2].price;

    const dropPercentage = ((previousPrice - currentPrice) / previousPrice) * 100;
    return dropPercentage >= threshold;
  }

  detectGoodDeal(offerId: string, threshold: number = 15): boolean {
    const history = this.pricingHistory.get(offerId);
    if (!history) return false;

    const currentPrice = this.getCurrentPrice(offerId);
    if (!currentPrice) return false;

    const dropPercentage = ((history.bestHistoricalPrice - currentPrice) / history.bestHistoricalPrice) * 100;
    return dropPercentage >= threshold;
  }

  calculateProviderCompetitiveness(provider: string, allOffers: CommerceOffer[]): number {
    const providerOffers = allOffers.filter((o) => o.provider === provider);
    if (providerOffers.length === 0) return 50;

    const avgPrice = providerOffers.reduce((sum, o) => sum + o.monthlyPrice, 0) / providerOffers.length;
    const allAvgPrice = allOffers.reduce((sum, o) => sum + o.monthlyPrice, 0) / allOffers.length;

    if (avgPrice < allAvgPrice * 0.9) return 80;
    if (avgPrice < allAvgPrice * 0.95) return 70;
    if (avgPrice < allAvgPrice) return 60;

    return 50;
  }

  getSeasonalPricingTrends(segment: string): { trend: "up" | "down" | "stable"; change: number } {
    // Placeholder for seasonal pricing analysis
    return { trend: "stable", change: 0 };
  }

  evaluateDiscountQuality(discount: number, originalPrice: number): number {
    if (originalPrice === 0) return 0;

    const discountPercentage = (discount / originalPrice) * 100;

    if (discountPercentage > 20) return 90;
    if (discountPercentage > 15) return 80;
    if (discountPercentage > 10) return 70;
    if (discountPercentage > 5) return 60;

    return 50;
  }

  evaluateCashbackQuality(cashback: number, monthlyPrice: number): number {
    if (monthlyPrice === 0) return 0;

    const cashbackPercentage = (cashback / (monthlyPrice * 24)) * 100;

    if (cashbackPercentage > 20) return 90;
    if (cashbackPercentage > 15) return 80;
    if (cashbackPercentage > 10) return 70;
    if (cashbackPercentage > 5) return 60;

    return 50;
  }

  private createEmptyHistory(offerId: string): PricingHistory {
    return {
      offerId,
      priceHistory: [],
      bestHistoricalPrice: 0,
      bestHistoricalPriceAt: 0,
      priceChanges: 0,
      lastPriceChangeAt: 0,
      priceTrend: "stable",
    };
  }

  private calculatePriceTrend(history: Array<{ price: number; effectiveAt: number; source: string }>): "increasing" | "decreasing" | "stable" {
    if (history.length < 3) return "stable";

    const recent = history.slice(-3);
    const firstPrice = recent[0].price;
    const lastPrice = recent[recent.length - 1].price;

    if (lastPrice > firstPrice * 1.05) return "increasing";
    if (lastPrice < firstPrice * 0.95) return "decreasing";

    return "stable";
  }
}
