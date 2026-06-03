import { UserProfile, PersonalizationScore } from "../types";

export class PersonalizedUILayer {
  private uiAdaptations: Map<string, UIAdaptation> = new Map();

  generateUIAdaptation(sessionId: string, profile: UserProfile, score: PersonalizationScore): UIAdaptation {
    const adaptation: UIAdaptation = {
      sessionId,
      layoutStrategy: this.determineLayoutStrategy(profile),
      highlightStrategy: this.determineHighlightStrategy(profile),
      recommendationStrategy: this.determineRecommendationStrategy(profile),
      explanationStrategy: this.determineExplanationStrategy(profile),
      personalizationLevel: score.personalizationLevel,
      adaptations: this.generateAdaptations(profile),
      timestamp: Date.now(),
    };

    this.uiAdaptations.set(sessionId, adaptation);
    return adaptation;
  }

  private determineLayoutStrategy(profile: UserProfile): LayoutStrategy {
    const segments = profile.preferences.segment;
    const engagement = profile.sessionBehavior.engagementDepth;

    if (segments.includes("gaming")) return "gaming-focused";
    if (segments.includes("budget")) return "value-focused";
    if (segments.includes("premium")) return "premium-focused";
    if (segments.includes("photographers")) return "camera-focused";
    if (engagement > 70) return "comparison-focused";
    if (engagement < 30) return "onboarding-focused";

    return "balanced";
  }

  private determineHighlightStrategy(profile: UserProfile): HighlightStrategy {
    const features = profile.preferences.features;
    const maxFeature = Object.entries(features).reduce((max, [key, value]) => value > max.value ? { key, value } : max, { key: "", value: 0 });

    if (maxFeature.key === "gaming") return "highlight-gaming";
    if (maxFeature.key === "camera") return "highlight-camera";
    if (maxFeature.key === "battery") return "highlight-battery";
    if (maxFeature.key === "performance") return "highlight-performance";

    return "highlight-value";
  }

  private determineRecommendationStrategy(profile: UserProfile): RecommendationStrategy {
    const conversionReadiness = profile.sessionBehavior.engagementDepth;
    const budgetFlexibility = profile.preferences.budget.flexible;

    if (conversionReadiness > 70 && !budgetFlexibility) return "conversion-focused";
    if (conversionReadiness > 70 && budgetFlexibility) return "exploration-focused";
    if (conversionReadiness < 30) return "discovery-focused";
    if (profile.budgetEvolution.direction === "increasing") return "upgrade-focused";
    if (profile.budgetEvolution.direction === "decreasing") return "budget-focused";

    return "balanced";
  }

  private determineExplanationStrategy(profile: UserProfile): ExplanationStrategy {
    const engagement = profile.sessionBehavior.engagementDepth;
    const aiInteractions = profile.sessionBehavior.aiInteractions;

    if (aiInteractions > 3) return "ai-explained";
    if (engagement > 60) return "detailed-explained";
    if (engagement < 30) return "simple-explained";

    return "standard-explained";
  }

  private generateAdaptations(profile: UserProfile): Adaptation[] {
    const adaptations: Adaptation[] = [];

    // Gaming adaptation
    if (profile.preferences.segment.includes("gaming")) {
      adaptations.push({
        type: "highlight",
        target: "gaming-features",
        action: "emphasize",
      });
    }

    // Budget adaptation
    if (profile.preferences.budget.current < 40) {
      adaptations.push({
        type: "highlight",
        target: "value-explanations",
        action: "emphasize",
      });
    }

    // Traveler adaptation
    if (profile.preferences.segment.includes("travelers")) {
      adaptations.push({
        type: "highlight",
        target: "roaming-coverage",
        action: "emphasize",
      });
    }

    // Brand affinity adaptation
    if (profile.preferences.brand.length > 0) {
      adaptations.push({
        type: "reorder",
        target: "brand-preferred",
        action: "prioritize",
      });
    }

    // Provider affinity adaptation
    if (profile.providerAffinity.size > 0) {
      adaptations.push({
        type: "reorder",
        target: "provider-preferred",
        action: "prioritize",
      });
    }

    // High engagement adaptation
    if (profile.sessionBehavior.engagementDepth > 70) {
      adaptations.push({
        type: "add",
        target: "comparison-tools",
        action: "show",
      });
    }

    return adaptations;
  }

  getUIAdaptation(sessionId: string): UIAdaptation | undefined {
    return this.uiAdaptations.get(sessionId);
  }

  generatePersonalizedRecommendations(sessionId: string, profile: UserProfile, recommendations: any[]): PersonalizedRecommendation[] {
    const adaptations = this.getUIAdaptation(sessionId);
    const highlightStrategy = adaptations?.highlightStrategy || "highlight-value";

    return recommendations.map((rec, index) => ({
      ...rec,
      personalized: true,
      highlightReason: this.determineHighlightReason(rec, profile, highlightStrategy),
      personalizationScore: this.calculateRecommendationPersonalizationScore(rec, profile),
      displayOrder: this.calculateDisplayOrder(rec, profile, index),
    }));
  }

  private determineHighlightReason(rec: any, profile: UserProfile, highlightStrategy: string): string {
    if (highlightStrategy === "highlight-gaming" && rec.gamingScore > 80) {
      return "Exzellent für Gaming";
    }
    if (highlightStrategy === "highlight-camera" && rec.cameraScore > 80) {
      return "Top-Kamera";
    }
    if (highlightStrategy === "highlight-battery" && rec.batteryScore > 80) {
      return "Lange Akkulaufzeit";
    }
    if (highlightStrategy === "highlight-value" && rec.valueScore > 80) {
      return "Bestes Preis-Leistungs-Verhältnis";
    }

    return "Empfohlen";
  }

  private calculateRecommendationPersonalizationScore(rec: any, profile: UserProfile): number {
    let score = 50;

    if (profile.preferences.brand.includes(rec.brand)) score += 20;
    if (profile.providerAffinity.has(rec.provider)) score += 15;
    if (profile.viewedProducts.includes(rec.id)) score += 10;
    if (profile.clickedRecommendations.includes(rec.id)) score += 15;

    return Math.min(score, 100);
  }

  private calculateDisplayOrder(rec: any, profile: UserProfile, index: number): number {
    const personalizationScore = this.calculateRecommendationPersonalizationScore(rec, profile);
    return index - (personalizationScore / 20);
  }
}

interface UIAdaptation {
  sessionId: string;
  layoutStrategy: LayoutStrategy;
  highlightStrategy: HighlightStrategy;
  recommendationStrategy: RecommendationStrategy;
  explanationStrategy: ExplanationStrategy;
  personalizationLevel: number;
  adaptations: Adaptation[];
  timestamp: number;
}

type LayoutStrategy = "balanced" | "gaming-focused" | "value-focused" | "premium-focused" | "camera-focused" | "comparison-focused" | "onboarding-focused";
type HighlightStrategy = "highlight-value" | "highlight-gaming" | "highlight-camera" | "highlight-battery" | "highlight-performance";
type RecommendationStrategy = "balanced" | "conversion-focused" | "exploration-focused" | "discovery-focused" | "upgrade-focused" | "budget-focused";
type ExplanationStrategy = "standard-explained" | "detailed-explained" | "simple-explained" | "ai-explained";

interface Adaptation {
  type: "highlight" | "reorder" | "add" | "remove";
  target: string;
  action: "emphasize" | "prioritize" | "show" | "hide";
}

interface PersonalizedRecommendation {
  personalized: boolean;
  highlightReason: string;
  personalizationScore: number;
  displayOrder: number;
}
