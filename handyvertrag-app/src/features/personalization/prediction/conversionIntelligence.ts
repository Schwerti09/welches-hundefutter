import { UserProfile, ConversionPrediction } from "../types";

export class ConversionIntelligence {
  private predictions: Map<string, ConversionPrediction> = new Map();

  predictConversion(profile: UserProfile): ConversionPrediction {
    const likelyConverter = this.predictLikelyConverter(profile);
    const highIntentUser = this.predictHighIntentUser(profile);
    const comparisonHeavyUser = this.predictComparisonHeavyUser(profile);
    const priceSensitiveUser = this.predictPriceSensitiveUser(profile);
    const premiumBuyer = this.predictPremiumBuyer(profile);
    const upgradeReadyUser = this.predictUpgradeReadyUser(profile);
    const conversionConfidence = this.calculateConversionConfidence(profile);
    const funnelStage = this.estimateFunnelStage(profile);

    const prediction: ConversionPrediction = {
      sessionId: profile.sessionId,
      likelyConverter,
      highIntentUser,
      comparisonHeavyUser,
      priceSensitiveUser,
      premiumBuyer,
      upgradeReadyUser,
      conversionConfidence,
      funnelStage,
      timestamp: Date.now(),
    };

    this.predictions.set(profile.sessionId, prediction);
    return prediction;
  }

  private predictLikelyConverter(profile: UserProfile): boolean {
    const savedCount = profile.recommendationHistory.saved.length;
    const clickedCount = profile.clickedRecommendations.length;
    const engagementDepth = profile.sessionBehavior.engagementDepth;

    return savedCount > 0 || (clickedCount > 2 && engagementDepth > 60);
  }

  private predictHighIntentUser(profile: UserProfile): boolean {
    const comparisonInteractions = profile.sessionBehavior.comparisonInteractions;
    const aiInteractions = profile.sessionBehavior.aiInteractions;
    const engagementDepth = profile.sessionBehavior.engagementDepth;

    return comparisonInteractions > 2 || aiInteractions > 3 || engagementDepth > 70;
  }

  private predictComparisonHeavyUser(profile: UserProfile): boolean {
    const comparisonInteractions = profile.sessionBehavior.comparisonInteractions;
    const viewedComparisons = profile.viewedProducts.length;

    return comparisonInteractions > 3 || viewedComparisons > 5;
  }

  private predictPriceSensitiveUser(profile: UserProfile): boolean {
    const budget = profile.preferences.budget.current;
    const budgetFlexibility = profile.preferences.budget.flexible;
    const budgetDirection = profile.budgetEvolution.direction;

    return budget < 40 && !budgetFlexibility && budgetDirection === "decreasing";
  }

  private predictPremiumBuyer(profile: UserProfile): boolean {
    const budget = profile.preferences.budget.current;
    const premiumAffinity = profile.affinities.premium;
    const brandPreferences = profile.preferences.brand;

    return budget > 70 && premiumAffinity > 70 && brandPreferences.includes("apple");
  }

  private predictUpgradeReadyUser(profile: UserProfile): boolean {
    const engagementDepth = profile.sessionBehavior.engagementDepth;
    const viewedProducts = profile.viewedProducts.length;
    const budgetDirection = profile.budgetEvolution.direction;

    return engagementDepth > 60 && viewedProducts > 3 && budgetDirection === "increasing";
  }

  private calculateConversionConfidence(profile: UserProfile): number {
    let confidence = 0.3;

    const savedCount = profile.recommendationHistory.saved.length;
    const clickedCount = profile.clickedRecommendations.length;
    const engagementDepth = profile.sessionBehavior.engagementDepth;
    const comparisonInteractions = profile.sessionBehavior.comparisonInteractions;

    confidence += savedCount * 0.25;
    confidence += Math.min(clickedCount * 0.1, 0.3);
    confidence += engagementDepth / 200;
    confidence += comparisonInteractions * 0.05;

    return Math.min(confidence, 0.95);
  }

  private estimateFunnelStage(profile: UserProfile): ConversionPrediction["funnelStage"] {
    const viewedCount = profile.viewedProducts.length;
    const clickedCount = profile.clickedRecommendations.length;
    const savedCount = profile.recommendationHistory.saved.length;
    const engagementDepth = profile.sessionBehavior.engagementDepth;

    if (viewedCount === 0) return "awareness";
    if (clickedCount === 0 && viewedCount > 0) return "awareness";
    if (clickedCount > 0 && savedCount === 0 && engagementDepth < 50) return "consideration";
    if (clickedCount > 2 && engagementDepth > 60) return "decision";
    if (savedCount > 0) return "conversion";

    return "consideration";
  }

  getPrediction(sessionId: string): ConversionPrediction | undefined {
    return this.predictions.get(sessionId);
  }

  getAllPredictions(): ConversionPrediction[] {
    return Array.from(this.predictions.values());
  }

  getHighIntentUsers(threshold: number = 0.7): ConversionPrediction[] {
    return Array.from(this.predictions.values()).filter(
      (p) => p.conversionConfidence >= threshold
    );
  }

  getPremiumBuyers(): ConversionPrediction[] {
    return Array.from(this.predictions.values()).filter(
      (p) => p.premiumBuyer
    );
  }

  getUpgradeReadyUsers(): ConversionPrediction[] {
    return Array.from(this.predictions.values()).filter(
      (p) => p.upgradeReadyUser
    );
  }
}
