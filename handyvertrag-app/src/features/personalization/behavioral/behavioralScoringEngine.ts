import { UserProfile, PersonalizationScore } from "../types";

export class BehavioralScoringEngine {
  calculatePersonalizationScore(profile: UserProfile): PersonalizationScore {
    const userEngagementScore = this.calculateUserEngagementScore(profile);
    const purchaseIntentScore = this.calculatePurchaseIntentScore(profile);
    const recommendationConfidence = this.calculateRecommendationConfidence(profile);
    const conversionReadinessScore = this.calculateConversionReadinessScore(profile);
    const personalizationLevel = this.calculatePersonalizationLevel(profile);

    return {
      sessionId: profile.sessionId,
      userEngagementScore,
      purchaseIntentScore,
      recommendationConfidence,
      conversionReadinessScore,
      personalizationLevel,
      timestamp: Date.now(),
    };
  }

  private calculateUserEngagementScore(profile: UserProfile): number {
    const behavior = profile.sessionBehavior;
    const engagementDepth = behavior.engagementDepth;
    const comparisonInteractions = behavior.comparisonInteractions;
    const recommendationClicks = behavior.recommendationClicks;
    const aiInteractions = behavior.aiInteractions;
    const scrollDepth = behavior.scrollDepth;

    const depthScore = Math.min(engagementDepth, 100);
    const comparisonScore = Math.min(comparisonInteractions * 15, 30);
    const clickScore = Math.min(recommendationClicks * 10, 30);
    const aiScore = Math.min(aiInteractions * 20, 40);
    const scrollScore = Math.min(scrollDepth / 2, 20);

    return Math.round((depthScore * 0.3 + comparisonScore * 0.2 + clickScore * 0.2 + aiScore * 0.2 + scrollScore * 0.1));
  }

  private calculatePurchaseIntentScore(profile: UserProfile): number {
    const clickedRecommendations = profile.clickedRecommendations.length;
    const savedRecommendations = profile.recommendationHistory.saved.length;
    const viewedProducts = profile.viewedProducts.length;
    const comparisonInteractions = profile.sessionBehavior.comparisonInteractions;

    const clickScore = Math.min(clickedRecommendations * 20, 40);
    const saveScore = Math.min(savedRecommendations * 30, 30);
    const viewScore = Math.min(viewedProducts * 5, 15);
    const comparisonScore = Math.min(comparisonInteractions * 15, 15);

    return Math.round(clickScore + saveScore + viewScore + comparisonScore);
  }

  private calculateRecommendationConfidence(profile: UserProfile): number {
    const engagementScore = this.calculateUserEngagementScore(profile);
    const purchaseIntent = this.calculatePurchaseIntentScore(profile);
    const budgetFlexibility = profile.preferences.budget.flexible ? 10 : 0;
    const segmentCount = profile.preferences.segment.length;

    const engagementWeight = engagementScore * 0.4;
    const intentWeight = purchaseIntent * 0.4;
    const flexibilityWeight = budgetFlexibility;
    const segmentWeight = Math.min(segmentCount * 5, 10);

    return Math.round(engagementWeight + intentWeight + flexibilityWeight + segmentWeight);
  }

  private calculateConversionReadinessScore(profile: UserProfile): number {
    const purchaseIntent = this.calculatePurchaseIntentScore(profile);
    const engagementScore = this.calculateUserEngagementScore(profile);
    const savedCount = profile.recommendationHistory.saved.length;
    const budgetStability = profile.budgetEvolution.direction === "stable" ? 10 : 0;

    const intentWeight = purchaseIntent * 0.4;
    const engagementWeight = engagementScore * 0.3;
    const savedWeight = Math.min(savedCount * 25, 20);
    const stabilityWeight = budgetStability;

    return Math.round(intentWeight + engagementWeight + savedWeight + stabilityWeight);
  }

  private calculatePersonalizationLevel(profile: UserProfile): number {
    const viewedProducts = profile.viewedProducts.length;
    const clickedRecommendations = profile.clickedRecommendations.length;
    const providerAffinityCount = profile.providerAffinity.size;
    const budgetHistory = profile.budgetEvolution.history.length;

    const viewScore = Math.min(viewedProducts * 10, 30);
    const clickScore = Math.min(clickedRecommendations * 15, 30);
    const affinityScore = Math.min(providerAffinityCount * 10, 20);
    const historyScore = Math.min(budgetHistory * 5, 20);

    return Math.round(viewScore + clickScore + affinityScore + historyScore);
  }
}
