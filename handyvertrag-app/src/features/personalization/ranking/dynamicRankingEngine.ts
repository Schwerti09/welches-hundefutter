import { UserProfile, RankingWeights, AdaptiveRankingScore } from "../types";

export class DynamicRankingEngine {
  private rankingHistory: Map<string, AdaptiveRankingScore[]> = new Map();

  calculateDynamicRanking(
    sessionId: string,
    entityId: string,
    baseScore: number,
    profile: UserProfile,
    context: RankingContext
  ): AdaptiveRankingScore {
    const weights = this.calculateDynamicWeights(sessionId, profile, context);
    const personalizedScore = this.applyWeights(baseScore, weights, profile, context);
    const personalizationFactors = this.determineFactors(profile, context);
    const confidence = this.calculateConfidence(personalizedScore, profile, context);

    const ranking: AdaptiveRankingScore = {
      entityId,
      baseScore,
      personalizedScore,
      rankingWeights: weights,
      personalizationFactors,
      confidence,
      timestamp: Date.now(),
    };

    // Store in history
    const history = this.rankingHistory.get(sessionId) || [];
    history.push(ranking);
    this.rankingHistory.set(sessionId, history);

    return ranking;
  }

  calculateDynamicWeights(sessionId: string, profile: UserProfile, context: RankingContext): RankingWeights {
    const baseWeights: RankingWeights = {
      budget: 0.2,
      brand: 0.15,
      provider: 0.15,
      features: 0.2,
      affinity: 0.15,
      engagement: 0.1,
      recommendationConfidence: 0.05,
    };

    // Adjust based on context
    if (context.userIntent === "budget") {
      baseWeights.budget += 0.1;
      baseWeights.features -= 0.05;
      baseWeights.affinity -= 0.05;
    }

    if (context.userIntent === "gaming") {
      baseWeights.features += 0.1;
      baseWeights.budget -= 0.05;
      baseWeights.brand += 0.05;
    }

    if (context.userIntent === "premium") {
      baseWeights.brand += 0.1;
      baseWeights.features += 0.05;
      baseWeights.budget -= 0.1;
      baseWeights.affinity += 0.05;
    }

    // Adjust based on engagement
    if (profile.sessionBehavior.engagementDepth > 70) {
      baseWeights.affinity += 0.05;
      baseWeights.recommendationConfidence += 0.03;
      baseWeights.budget -= 0.04;
    }

    // Adjust based on recommendation history
    const clickRatio = profile.clickedRecommendations.length / Math.max(profile.viewedProducts.length, 1);
    if (clickRatio > 0.5) {
      baseWeights.recommendationConfidence += 0.05;
      baseWeights.affinity += 0.03;
    }

    // Normalize weights
    const total = Object.values(baseWeights).reduce((sum, w) => sum + w, 0);
    for (const key in baseWeights) {
      baseWeights[key as keyof RankingWeights] /= total;
    }

    return baseWeights;
  }

  private applyWeights(baseScore: number, weights: RankingWeights, profile: UserProfile, context: RankingContext): number {
    let score = baseScore;

    // Budget weight
    const budgetScore = this.calculateBudgetScore(profile, context);
    score += budgetScore * weights.budget;

    // Brand weight
    const brandScore = this.calculateBrandScore(profile, context);
    score += brandScore * weights.brand;

    // Provider weight
    const providerScore = this.calculateProviderScore(profile, context);
    score += providerScore * weights.provider;

    // Features weight
    const featureScore = this.calculateFeatureScore(profile, context);
    score += featureScore * weights.features;

    // Affinity weight
    const affinityScore = this.calculateAffinityScore(profile, context);
    score += affinityScore * weights.affinity;

    // Engagement weight
    const engagementScore = this.calculateEngagementScore(profile);
    score += engagementScore * weights.engagement;

    // Confidence weight
    const confidenceScore = this.calculateConfidenceScore(profile);
    score += confidenceScore * weights.recommendationConfidence;

    return Math.max(0, Math.min(100, score));
  }

  private calculateBudgetScore(profile: UserProfile, context: RankingContext): number {
    const budget = profile.preferences.budget.current;
    const budgetFlexibility = profile.preferences.budget.flexible ? 10 : 0;

    if (context.userIntent === "budget" && budget < 50) return 15;
    if (context.userIntent === "premium" && budget > 70) return 15;

    return budgetFlexibility;
  }

  private calculateBrandScore(profile: UserProfile, context: RankingContext): number {
    const brandPreferences = profile.preferences.brand;
    if (brandPreferences.length === 0) return 0;

    if (context.userIntent === "premium" && brandPreferences.includes("apple")) return 20;
    if (context.userIntent === "gaming" && brandPreferences.includes("samsung")) return 15;

    return 10;
  }

  private calculateProviderScore(profile: UserProfile, context: RankingContext): number {
    const providerPreferences = profile.preferences.provider;
    if (providerPreferences.length === 0) return 0;

    const affinitySum = Array.from(profile.providerAffinity.values()).reduce((sum, a) => sum + a, 0);
    return Math.min(affinitySum / providerPreferences.length, 20);
  }

  private calculateFeatureScore(profile: UserProfile, context: RankingContext): number {
    const features = profile.preferences.features;

    if (context.userIntent === "gaming") return features.gaming / 5;
    if (context.userIntent === "camera") return features.camera / 5;
    if (context.userIntent === "battery") return features.battery / 5;

    return (features.camera + features.gaming + features.battery) / 15;
  }

  private calculateAffinityScore(profile: UserProfile, context: RankingContext): number {
    const affinities = profile.affinities;

    if (context.userIntent === "gaming") return affinities.gaming / 10;
    if (context.userIntent === "premium") return affinities.premium / 10;
    if (context.userIntent === "budget") return affinities.budget / 10;

    return (affinities.apple + affinities.samsung + affinities.premium) / 30;
  }

  private calculateEngagementScore(profile: UserProfile): number {
    return profile.sessionBehavior.engagementDepth / 10;
  }

  private calculateConfidenceScore(profile: UserProfile): number {
    const history = profile.recommendationHistory;
    const clickRatio = history.clicked.length / Math.max(history.viewed.length, 1);
    return clickRatio * 30;
  }

  private determineFactors(profile: UserProfile, context: RankingContext): string[] {
    const factors: string[] = [];

    if (context.userIntent) factors.push(`intent-${context.userIntent}`);
    if (profile.preferences.brand.length > 0) factors.push("brand-preference");
    if (profile.preferences.provider.length > 0) factors.push("provider-preference");
    if (profile.sessionBehavior.engagementDepth > 50) factors.push("high-engagement");
    if (profile.budgetEvolution.direction !== "stable") factors.push("budget-evolution");

    return factors;
  }

  private calculateConfidence(score: number, profile: UserProfile, context: RankingContext): number {
    const engagement = profile.sessionBehavior.engagementDepth / 100;
    const intentMatch = context.userIntent ? 0.2 : 0;
    const scoreStability = Math.abs(score - 50) / 100;

    return Math.min(0.5 + engagement * 0.3 + intentMatch + scoreStability * 0.2, 0.95);
  }

  getRankingHistory(sessionId: string): AdaptiveRankingScore[] {
    return this.rankingHistory.get(sessionId) || [];
  }

  getLatestRanking(sessionId: string, entityId: string): AdaptiveRankingScore | undefined {
    const history = this.rankingHistory.get(sessionId);
    if (!history) return undefined;

    return history.filter((r) => r.entityId === entityId).pop();
  }
}

interface RankingContext {
  userIntent?: "budget" | "gaming" | "premium" | "camera" | "battery";
  sessionStage?: "early" | "mid" | "late";
  recommendationContext?: string;
}
