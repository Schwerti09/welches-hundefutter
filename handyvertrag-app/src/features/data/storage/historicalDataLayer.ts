import { PricingHistory, LifecycleEvent, CommerceOffer } from "../types";

export class HistoricalDataLayer {
  private pricingHistory: Map<string, PricingHistory> = new Map();
  private offerHistory: Map<string, CommerceOffer[]> = new Map();
  private rankingHistory: Map<string, RankingHistoryEntry[]> = new Map();
  private recommendationHistory: Map<string, RecommendationHistoryEntry[]> = new Map();
  private providerChanges: Map<string, ProviderChange[]> = new Map();
  private valueEvolution: Map<string, ValueEvolutionEntry[]> = new Map();

  storePricingHistory(offerId: string, history: PricingHistory): void {
    this.pricingHistory.set(offerId, history);
  }

  getPricingHistory(offerId: string): PricingHistory | undefined {
    return this.pricingHistory.get(offerId);
  }

  storeOfferVersion(offerId: string, offer: CommerceOffer): void {
    const history = this.offerHistory.get(offerId) || [];
    history.push(offer);
    this.offerHistory.set(offerId, history);
  }

  getOfferHistory(offerId: string): CommerceOffer[] {
    return this.offerHistory.get(offerId) || [];
  }

  storeRankingEntry(offerId: string, entry: RankingHistoryEntry): void {
    const history = this.rankingHistory.get(offerId) || [];
    history.push(entry);
    this.rankingHistory.set(offerId, history);
  }

  getRankingHistory(offerId: string): RankingHistoryEntry[] {
    return this.rankingHistory.get(offerId) || [];
  }

  storeRecommendationEntry(offerId: string, entry: RecommendationHistoryEntry): void {
    const history = this.recommendationHistory.get(offerId) || [];
    history.push(entry);
    this.recommendationHistory.set(offerId, history);
  }

  getRecommendationHistory(offerId: string): RecommendationHistoryEntry[] {
    return this.recommendationHistory.get(offerId) || [];
  }

  storeProviderChange(providerId: string, change: ProviderChange): void {
    const history = this.providerChanges.get(providerId) || [];
    history.push(change);
    this.providerChanges.set(providerId, history);
  }

  getProviderChanges(providerId: string): ProviderChange[] {
    return this.providerChanges.get(providerId) || [];
  }

  storeValueEvolution(offerId: string, entry: ValueEvolutionEntry): void {
    const history = this.valueEvolution.get(offerId) || [];
    history.push(entry);
    this.valueEvolution.set(offerId, history);
  }

  getValueEvolution(offerId: string): ValueEvolutionEntry[] {
    return this.valueEvolution.get(offerId) || [];
  }

  cleanupOldHistory(maxAge: number = 365 * 24 * 60 * 60 * 1000): void {
    const now = Date.now();
    const threshold = now - maxAge;

    for (const [offerId, history] of this.offerHistory) {
      const filtered = history.filter((o) => o.createdAt > threshold);
      this.offerHistory.set(offerId, filtered);
    }

    for (const [offerId, history] of this.rankingHistory) {
      const filtered = history.filter((e) => e.timestamp > threshold);
      this.rankingHistory.set(offerId, filtered);
    }

    for (const [offerId, history] of this.recommendationHistory) {
      const filtered = history.filter((e) => e.timestamp > threshold);
      this.recommendationHistory.set(offerId, filtered);
    }

    for (const [providerId, history] of this.providerChanges) {
      const filtered = history.filter((c) => c.timestamp > threshold);
      this.providerChanges.set(providerId, filtered);
    }

    for (const [offerId, history] of this.valueEvolution) {
      const filtered = history.filter((e) => e.timestamp > threshold);
      this.valueEvolution.set(offerId, filtered);
    }
  }
}

export interface RankingHistoryEntry {
  rank: number;
  score: number;
  timestamp: number;
  category: string;
}

export interface RecommendationHistoryEntry {
  recommended: boolean;
  position: number;
  timestamp: number;
  context: string;
}

export interface ProviderChange {
  changeType: "pricing" | "offer" | "availability";
  description: string;
  timestamp: number;
}

export interface ValueEvolutionEntry {
  valueScore: number;
  price: number;
  timestamp: number;
}
