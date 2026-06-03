import { UserProfile, AffinitySignal, AffinityScores } from "../types";

export class AffinityEngine {
  private signals: Map<string, AffinitySignal[]> = new Map();

  recordAffinitySignal(sessionId: string, signal: AffinitySignal): void {
    const sessionSignals = this.signals.get(sessionId) || [];
    sessionSignals.push(signal);
    this.signals.set(sessionId, sessionSignals);
  }

  calculateAffinityScores(sessionId: string, profile: UserProfile): AffinityScores {
    const signals = this.signals.get(sessionId) || [];
    const scores: AffinityScores = {
      apple: 50,
      samsung: 50,
      telekom: 50,
      vodafone: 50,
      o2: 50,
      premium: 50,
      gaming: 50,
      budget: 50,
      camera: 50,
      battery: 50,
    };

    for (const signal of signals) {
      const affinityType = signal.affinityType as keyof AffinityScores;
      if (affinityType in scores) {
        scores[affinityType] += signal.strength;
      }
    }

    // Normalize scores to 0-100
    for (const key in scores) {
      scores[key as keyof AffinityScores] = Math.max(0, Math.min(100, scores[key as keyof AffinityScores]));
    }

    return scores;
  }

  detectBrandAffinity(sessionId: string): { brand: string; affinity: number } | null {
    const signals = this.signals.get(sessionId) || [];
    const brandSignals = signals.filter((s) => s.entityType === "brand");

    if (brandSignals.length === 0) return null;

    const brandCounts = new Map<string, number>();
    for (const signal of brandSignals) {
      const count = brandCounts.get(signal.entityId) || 0;
      brandCounts.set(signal.entityId, count + signal.strength);
    }

    let maxBrand = "";
    let maxCount = 0;
    for (const [brand, count] of brandCounts) {
      if (count > maxCount) {
        maxBrand = brand;
        maxCount = count;
      }
    }

    return { brand: maxBrand, affinity: Math.min(maxCount, 100) };
  }

  detectProviderAffinity(sessionId: string): { provider: string; affinity: number } | null {
    const signals = this.signals.get(sessionId) || [];
    const providerSignals = signals.filter((s) => s.entityType === "provider");

    if (providerSignals.length === 0) return null;

    const providerCounts = new Map<string, number>();
    for (const signal of providerSignals) {
      const count = providerCounts.get(signal.entityId) || 0;
      providerCounts.set(signal.entityId, count + signal.strength);
    }

    let maxProvider = "";
    let maxCount = 0;
    for (const [provider, count] of providerCounts) {
      if (count > maxCount) {
        maxProvider = provider;
        maxCount = count;
      }
    }

    return { provider: maxProvider, affinity: Math.min(maxCount, 100) };
  }

  detectFeatureAffinity(sessionId: string): { feature: string; affinity: number }[] {
    const signals = this.signals.get(sessionId) || [];
    const featureSignals = signals.filter((s) => s.entityType === "feature");

    const featureAffinities: Array<{ feature: string; affinity: number }> = [];

    for (const signal of featureSignals) {
      const existing = featureAffinities.find((f) => f.feature === signal.entityId);
      if (existing) {
        existing.affinity += signal.strength;
      } else {
        featureAffinities.push({ feature: signal.entityId, affinity: signal.strength });
      }
    }

    return featureAffinities.map((f) => ({ ...f, affinity: Math.min(f.affinity, 100) }));
  }

  generateAffinityFromBehavior(sessionId: string, profile: UserProfile): AffinitySignal[] {
    const signals: AffinitySignal[] = [];

    // Brand affinity from viewed products
    for (const productId of profile.viewedProducts) {
      const brand = this.extractBrandFromId(productId);
      if (brand) {
        signals.push({
          entityType: "brand",
          entityId: brand,
          affinityType: brand === "apple" ? "apple" : brand === "samsung" ? "samsung" : "premium",
          strength: 10,
          source: "behavior",
          timestamp: Date.now(),
        });
      }
    }

    // Provider affinity from provider clicks
    for (const [provider, clicks] of profile.providerAffinity) {
      signals.push({
        entityType: "provider",
        entityId: provider,
        affinityType: provider === "telekom" ? "telekom" : provider === "vodafone" ? "vodafone" : "o2",
        strength: clicks,
        source: "behavior",
        timestamp: Date.now(),
      });
    }

    return signals;
  }

  private extractBrandFromId(entityId: string): string {
    if (entityId.includes("iphone") || entityId.includes("apple")) return "apple";
    if (entityId.includes("samsung") || entityId.includes("galaxy")) return "samsung";
    if (entityId.includes("google") || entityId.includes("pixel")) return "google";
    return "";
  }
}
