import { UserProfile, RankingWeights, AdaptiveRankingScore } from "../types";

export class AdaptiveRecommendationEngine {
  private rankingWeights: Map<string, RankingWeights> = new Map();
  private learningHistory: Map<string, Array<{ entityId: string; score: number; accepted: boolean }>> = new Map();

  calculateAdaptiveRanking(sessionId: string, entityId: string, baseScore: number, profile: UserProfile): AdaptiveRankingScore {
    const weights = this.getRankingWeights(sessionId);
    const personalizedScore = this.applyPersonalizationWeights(baseScore, entityId, weights, profile);
    const personalizationFactors = this.determinePersonalizationFactors(entityId, profile);
    const confidence = this.calculateConfidence(personalizedScore, profile);

    return {
      entityId,
      baseScore,
      personalizedScore,
      rankingWeights: weights,
      personalizationFactors,
      confidence,
      timestamp: Date.now(),
    };
  }

  recordRecommendationFeedback(sessionId: string, entityId: string, score: number, accepted: boolean): void {
    const history = this.learningHistory.get(sessionId) || [];
    history.push({ entityId, score, accepted });
    this.learningHistory.set(sessionId, history);

    if (accepted) {
      this.reinforcePreferences(sessionId, entityId);
    } else {
      this.adjustWeights(sessionId, entityId);
    }
  }

  updateRankingWeights(sessionId: string, newWeights: Partial<RankingWeights>): void {
    const currentWeights = this.getRankingWeights(sessionId);
    const updatedWeights = { ...currentWeights, ...newWeights };
    this.rankingWeights.set(sessionId, updatedWeights);
  }

  private getRankingWeights(sessionId: string): RankingWeights {
    const existing = this.rankingWeights.get(sessionId);
    if (existing) return existing;

    const defaultWeights: RankingWeights = {
      budget: 0.2,
      brand: 0.15,
      provider: 0.15,
      features: 0.2,
      affinity: 0.15,
      engagement: 0.1,
      recommendationConfidence: 0.05,
    };

    this.rankingWeights.set(sessionId, defaultWeights);
    return defaultWeights;
  }

  private applyPersonalizationWeights(baseScore: number, entityId: string, weights: RankingWeights, profile: UserProfile): number {
    let personalizedScore = baseScore;

    // Budget adjustment
    const budgetScore = this.calculateBudgetScore(entityId, profile);
    personalizedScore += budgetScore * weights.budget;

    // Brand adjustment
    const brandScore = this.calculateBrandScore(entityId, profile);
    personalizedScore += brandScore * weights.brand;

    // Provider adjustment
    const providerScore = this.calculateProviderScore(entityId, profile);
    personalizedScore += providerScore * weights.provider;

    // Features adjustment
    const featureScore = this.calculateFeatureScore(entityId, profile);
    personalizedScore += featureScore * weights.features;

    // Affinity adjustment
    const affinityScore = this.calculateAffinityScore(entityId, profile);
    personalizedScore += affinityScore * weights.affinity;

    // Engagement adjustment
    const engagementScore = this.calculateEngagementScore(entityId, profile);
    personalizedScore += engagementScore * weights.engagement;

    // Confidence adjustment
    const confidenceScore = this.calculateConfidenceScore(entityId, profile);
    personalizedScore += confidenceScore * weights.recommendationConfidence;

    return Math.max(0, Math.min(100, personalizedScore));
  }

  private calculateBudgetScore(entityId: string, profile: UserProfile): number {
    const budget = profile.preferences.budget.current;
    const budgetRange = profile.preferences.budget.max - profile.preferences.budget.min;
    const budgetFlexibility = profile.preferences.budget.flexible ? 20 : 0;

    return budgetFlexibility;
  }

  private calculateBrandScore(entityId: string, profile: UserProfile): number {
    const brandPreferences = profile.preferences.brand;
    if (brandPreferences.length === 0) return 0;

    const entityBrand = this.extractBrandFromId(entityId);
    if (brandPreferences.includes(entityBrand)) return 15;
    return -5;
  }

  private calculateProviderScore(entityId: string, profile: UserProfile): number {
    const providerPreferences = profile.preferences.provider;
    const providerAffinity = profile.providerAffinity;

    if (providerPreferences.length === 0) return 0;

    const entityProvider = this.extractProviderFromId(entityId);
    const affinity = providerAffinity.get(entityProvider) || 0;

    if (providerPreferences.includes(entityProvider)) return affinity / 10;
    return 0;
  }

  private calculateFeatureScore(entityId: string, profile: UserProfile): number {
    const featurePriorities = profile.preferences.features;
    const entityFeatures = this.extractFeaturesFromId(entityId);

    let score = 0;
    for (const feature in entityFeatures) {
      const priority = featurePriorities[feature as keyof typeof featurePriorities] || 50;
      const entityFeatureValue = entityFeatures[feature as keyof typeof entityFeatures];
      score += (priority / 100) * entityFeatureValue;
    }

    return score;
  }

  private calculateAffinityScore(entityId: string, profile: UserProfile): number {
    const affinities = profile.affinities;
    const entityAffinity = this.extractAffinityFromId(entityId);

    return affinities[entityAffinity] || 0;
  }

  private calculateEngagementScore(entityId: string, profile: UserProfile): number {
    const engagementDepth = profile.sessionBehavior.engagementDepth;
    const viewed = profile.viewedProducts.includes(entityId);
    const clicked = profile.clickedRecommendations.includes(entityId);

    if (clicked) return 10;
    if (viewed) return 5;
    return engagementDepth / 10;
  }

  private calculateConfidenceScore(entityId: string, profile: UserProfile): number {
    const history = profile.recommendationHistory;
    const clicked = history.clicked.includes(entityId);
    const saved = history.saved.includes(entityId);

    if (saved) return 10;
    if (clicked) return 5;
    return 0;
  }

  private determinePersonalizationFactors(entityId: string, profile: UserProfile): string[] {
    const factors: string[] = [];

    if (profile.preferences.brand.length > 0) {
      factors.push("brand-preference");
    }
    if (profile.preferences.provider.length > 0) {
      factors.push("provider-preference");
    }
    if (profile.providerAffinity.size > 0) {
      factors.push("provider-affinity");
    }
    if (profile.sessionBehavior.engagementDepth > 50) {
      factors.push("high-engagement");
    }
    if (profile.budgetEvolution.direction !== "stable") {
      factors.push("budget-evolution");
    }

    return factors;
  }

  private calculateConfidence(personalizedScore: number, profile: UserProfile): number {
    const personalizationLevel = profile.sessionBehavior.engagementDepth / 100;
    const scoreStability = Math.abs(personalizedScore - 50) / 50;

    return Math.min(0.5 + personalizationLevel * 0.3 + scoreStability * 0.2, 0.95);
  }

  private reinforcePreferences(sessionId: string, entityId: string): void {
    const weights = this.getRankingWeights(sessionId);
    weights.affinity += 0.05;
    weights.recommendationConfidence += 0.02;
    this.rankingWeights.set(sessionId, weights);
  }

  private adjustWeights(sessionId: string, entityId: string): void {
    const weights = this.getRankingWeights(sessionId);
    weights.affinity = Math.max(0, weights.affinity - 0.02);
    this.rankingWeights.set(sessionId, weights);
  }

  private extractBrandFromId(entityId: string): string {
    if (entityId.includes("hundefutter") || entityId.includes("apple")) return "apple";
    if (entityId.includes("samsung") || entityId.includes("galaxy")) return "samsung";
    if (entityId.includes("google") || entityId.includes("pixel")) return "google";
    return "";
  }

  private extractProviderFromId(entityId: string): string {
    if (entityId.includes("anifit")) return "anifit";
    if (entityId.includes("wolfsblut")) return "wolfsblut";
    if (entityId.includes("Zooplus")) return "Zooplus";
    return "";
  }

  private extractFeaturesFromId(entityId: string): Record<string, number> {
    const features: Record<string, number> = {
      camera: 50,
      gaming: 50,
      battery: 50,
      performance: 50,
      storage: 50,
    };

    if (entityId.includes("gaming")) features.gaming = 80;
    if (entityId.includes("camera")) features.camera = 80;
    if (entityId.includes("battery")) features.battery = 80;

    return features;
  }

  private extractAffinityFromId(entityId: string): keyof UserProfile["affinities"] {
    if (entityId.includes("hundefutter") || entityId.includes("apple")) return "apple";
    if (entityId.includes("samsung")) return "samsung";
    if (entityId.includes("anifit")) return "anifit";
    if (entityId.includes("wolfsblut")) return "wolfsblut";
    if (entityId.includes("Zooplus")) return "Zooplus";
    if (entityId.includes("gaming")) return "gaming";
    if (entityId.includes("premium")) return "premium";
    if (entityId.includes("budget")) return "budget";
    return "premium";
  }
}
