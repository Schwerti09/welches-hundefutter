import { UserProfile, PrivacyConsent, ExplainableRecommendation } from "../types";

export class PrivacyTrustLayer {
  private consents: Map<string, PrivacyConsent> = new Map();
  private recommendationExplanations: Map<string, ExplainableRecommendation[]> = new Map();

  requestConsent(sessionId: string): PrivacyConsent {
    const consent: PrivacyConsent = {
      sessionId,
      personalizationEnabled: false,
      trackingEnabled: false,
      aiRecommendationsEnabled: false,
      consentTimestamp: Date.now(),
      consentVersion: "1.0",
    };

    this.consents.set(sessionId, consent);
    return consent;
  }

  updateConsent(sessionId: string, updates: Partial<PrivacyConsent>): PrivacyConsent {
    const consent = this.consents.get(sessionId);
    if (!consent) {
      return this.requestConsent(sessionId);
    }

    const updatedConsent = { ...consent, ...updates };
    this.consents.set(sessionId, updatedConsent);
    return updatedConsent;
  }

  hasConsent(sessionId: string, consentType: keyof PrivacyConsent): boolean {
    const consent = this.consents.get(sessionId);
    if (!consent) return false;

    return consent[consentType] as boolean;
  }

  generateExplainableRecommendation(
    sessionId: string,
    entityId: string,
    recommendationReason: string,
    profile: UserProfile
  ): ExplainableRecommendation {
    const personalizationFactors = this.determinePersonalizationFactors(profile);
    const confidence = this.calculateConfidence(profile);
    const alternativeReasons = this.generateAlternativeReasons(entityId, profile);

    const explanation: ExplainableRecommendation = {
      entityId,
      recommendationReason,
      personalizationFactors,
      confidence,
      alternativeReasons,
    };

    const explanations = this.recommendationExplanations.get(sessionId) || [];
    explanations.push(explanation);
    this.recommendationExplanations.set(sessionId, explanations);

    return explanation;
  }

  getExplanations(sessionId: string): ExplainableRecommendation[] {
    return this.recommendationExplanations.get(sessionId) || [];
  }

  getExplanation(sessionId: string, entityId: string): ExplainableRecommendation | undefined {
    const explanations = this.recommendationExplanations.get(sessionId);
    if (!explanations) return undefined;

    return explanations.find((e) => e.entityId === entityId);
  }

  isTrackingAllowed(sessionId: string): boolean {
    return this.hasConsent(sessionId, "trackingEnabled");
  }

  isPersonalizationAllowed(sessionId: string): boolean {
    return this.hasConsent(sessionId, "personalizationEnabled");
  }

  areAIRecommendationsAllowed(sessionId: string): boolean {
    return this.hasConsent(sessionId, "aiRecommendationsEnabled");
  }

  generateTransparencyReport(sessionId: string, profile: UserProfile): TransparencyReport {
    const consent = this.consents.get(sessionId);
    const explanations = this.recommendationExplanations.get(sessionId) || [];

    return {
      sessionId,
      personalizationEnabled: consent?.personalizationEnabled || false,
      trackingEnabled: consent?.trackingEnabled || false,
      aiRecommendationsEnabled: consent?.aiRecommendationsEnabled || false,
      consentTimestamp: consent?.consentTimestamp || 0,
      consentVersion: consent?.consentVersion || "",
      personalizationFactors: this.determinePersonalizationFactors(profile),
      recommendationCount: explanations.length,
      averageConfidence: this.calculateAverageConfidence(explanations),
      dataRetentionDays: 30,
      dataDeletionAvailable: true,
    };
  }

  deleteUserData(sessionId: string): boolean {
    this.consents.delete(sessionId);
    this.recommendationExplanations.delete(sessionId);
    return true;
  }

  private determinePersonalizationFactors(profile: UserProfile): string[] {
    const factors: string[] = [];

    if (profile.preferences.brand.length > 0) {
      factors.push(`Brand-Präferenz: ${profile.preferences.brand.join(", ")}`);
    }

    if (profile.preferences.provider.length > 0) {
      factors.push(`Provider-Präferenz: ${profile.preferences.provider.join(", ")}`);
    }

    if (profile.preferences.segment.length > 0) {
      factors.push(`Segment: ${profile.preferences.segment.join(", ")}`);
    }

    if (profile.sessionBehavior.engagementDepth > 50) {
      factors.push("Hohe Engagement-Tiefe");
    }

    if (profile.budgetEvolution.direction !== "stable") {
      factors.push(`Budget-Evolution: ${profile.budgetEvolution.direction}`);
    }

    return factors;
  }

  private calculateConfidence(profile: UserProfile): number {
    const engagement = profile.sessionBehavior.engagementDepth;
    const historyLength = profile.recommendationHistory.viewed.length;

    return Math.min(0.5 + (engagement / 200) + (historyLength * 0.05), 0.95);
  }

  private generateAlternativeReasons(entityId: string, profile: UserProfile): string[] {
    const alternatives: string[] = [];

    if (profile.preferences.budget.flexible) {
      alternatives.push("Alternativen mit höherem Budget verfügbar");
    }

    if (profile.preferences.brand.length > 0) {
      alternatives.push("Alternativen von anderen Marken verfügbar");
    }

    if (profile.providerAffinity.size > 0) {
      alternatives.push("Alternativen von anderen Providern verfügbar");
    }

    return alternatives;
  }

  private calculateAverageConfidence(explanations: ExplainableRecommendation[]): number {
    if (explanations.length === 0) return 0;

    const totalConfidence = explanations.reduce((sum, e) => sum + e.confidence, 0);
    return totalConfidence / explanations.length;
  }
}

interface TransparencyReport {
  sessionId: string;
  personalizationEnabled: boolean;
  trackingEnabled: boolean;
  aiRecommendationsEnabled: boolean;
  consentTimestamp: number;
  consentVersion: string;
  personalizationFactors: string[];
  recommendationCount: number;
  averageConfidence: number;
  dataRetentionDays: number;
  dataDeletionAvailable: boolean;
}
