import { UserProfile, UserPreferences, BehavioralEvent, AffinityScores, SessionBehavior, RecommendationHistory, BudgetEvolution } from "../types";

export class PersonalizationEngine {
  private profiles: Map<string, UserProfile> = new Map();
  private events: Map<string, BehavioralEvent[]> = new Map();

  createProfile(sessionId: string): UserProfile {
    const profile: UserProfile = {
      sessionId,
      preferences: this.getDefaultPreferences(),
      affinities: this.getDefaultAffinities(),
      sessionBehavior: this.getDefaultSessionBehavior(),
      recommendationHistory: this.getDefaultRecommendationHistory(),
      viewedProducts: [],
      clickedRecommendations: [],
      providerAffinity: new Map(),
      budgetEvolution: this.getDefaultBudgetEvolution(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.profiles.set(sessionId, profile);
    return profile;
  }

  trackEvent(event: BehavioralEvent): void {
    const sessionEvents = this.events.get(event.sessionId) || [];
    sessionEvents.push(event);
    this.events.set(event.sessionId, sessionEvents);

    const profile = this.profiles.get(event.sessionId);
    if (profile) {
      this.updateProfileFromEvent(profile, event);
      profile.updatedAt = Date.now();
    }
  }

  updatePreferences(sessionId: string, preferences: Partial<UserPreferences>): void {
    const profile = this.profiles.get(sessionId);
    if (profile) {
      profile.preferences = { ...profile.preferences, ...preferences };
      profile.updatedAt = Date.now();
    }
  }

  updateBudget(sessionId: string, newBudget: number): void {
    const profile = this.profiles.get(sessionId);
    if (profile) {
      profile.budgetEvolution.current = newBudget;
      profile.budgetEvolution.history.push({
        timestamp: Date.now(),
        budget: newBudget,
      });

      if (newBudget > profile.budgetEvolution.current) {
        profile.budgetEvolution.direction = "increasing";
      } else if (newBudget < profile.budgetEvolution.current) {
        profile.budgetEvolution.direction = "decreasing";
      } else {
        profile.budgetEvolution.direction = "stable";
      }

      profile.preferences.budget.current = newBudget;
      profile.updatedAt = Date.now();
    }
  }

  addViewedProduct(sessionId: string, productId: string): void {
    const profile = this.profiles.get(sessionId);
    if (profile) {
      if (!profile.viewedProducts.includes(productId)) {
        profile.viewedProducts.push(productId);
      }
      profile.updatedAt = Date.now();
    }
  }

  addClickedRecommendation(sessionId: string, recommendationId: string): void {
    const profile = this.profiles.get(sessionId);
    if (profile) {
      if (!profile.clickedRecommendations.includes(recommendationId)) {
        profile.clickedRecommendations.push(recommendationId);
      }
      profile.sessionBehavior.recommendationClicks++;
      profile.updatedAt = Date.now();
    }
  }

  updateProviderAffinity(sessionId: string, provider: string, affinity: number): void {
    const profile = this.profiles.get(sessionId);
    if (profile) {
      profile.providerAffinity.set(provider, affinity);
      profile.updatedAt = Date.now();
    }
  }

  getProfile(sessionId: string): UserProfile | undefined {
    return this.profiles.get(sessionId);
  }

  getEvents(sessionId: string): BehavioralEvent[] {
    return this.events.get(sessionId) || [];
  }

  private updateProfileFromEvent(profile: UserProfile, event: BehavioralEvent): void {
    switch (event.type) {
      case "view_product":
        if (!profile.viewedProducts.includes(event.entityId)) {
          profile.viewedProducts.push(event.entityId);
        }
        break;
      case "click_recommendation":
        if (!profile.clickedRecommendations.includes(event.entityId)) {
          profile.clickedRecommendations.push(event.entityId);
        }
        profile.sessionBehavior.recommendationClicks++;
        break;
      case "view_comparison":
        profile.sessionBehavior.comparisonInteractions++;
        break;
      case "advisor_interaction":
        profile.sessionBehavior.aiInteractions++;
        break;
      case "scroll_depth":
        const scrollDepth = event.metadata.scrollDepth as number || 0;
        profile.sessionBehavior.scrollDepth = Math.max(profile.sessionBehavior.scrollDepth, scrollDepth);
        break;
      case "provider_click":
        const provider = event.metadata.provider as string;
        const currentAffinity = profile.providerAffinity.get(provider) || 0;
        profile.providerAffinity.set(provider, currentAffinity + 10);
        break;
    }

    profile.sessionBehavior.engagementDepth = this.calculateEngagementDepth(profile.sessionBehavior);
  }

  private calculateEngagementDepth(behavior: SessionBehavior): number {
    const clickScore = behavior.recommendationClicks * 10;
    const comparisonScore = behavior.comparisonInteractions * 15;
    const aiScore = behavior.aiInteractions * 20;
    const scrollScore = Math.min(behavior.scrollDepth / 10, 50);

    return Math.min(clickScore + comparisonScore + aiScore + scrollScore, 100);
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      budget: {
        min: 0,
        max: 100,
        current: 50,
        flexible: true,
      },
      brand: [],
      provider: [],
      features: {
        camera: 50,
        gaming: 50,
        battery: 50,
        performance: 50,
        storage: 50,
      },
      segment: [],
    };
  }

  private getDefaultAffinities(): AffinityScores {
    return {
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
  }

  private getDefaultSessionBehavior(): SessionBehavior {
    return {
      engagementDepth: 0,
      comparisonInteractions: 0,
      recommendationClicks: 0,
      aiInteractions: 0,
      scrollDepth: 0,
      timeOnPage: 0,
      providerClicks: new Map(),
    };
  }

  private getDefaultRecommendationHistory(): RecommendationHistory {
    return {
      viewed: [],
      clicked: [],
      ignored: [],
      saved: [],
      timestamps: new Map(),
    };
  }

  private getDefaultBudgetEvolution(): BudgetEvolution {
    return {
      initial: 50,
      current: 50,
      history: [{ timestamp: Date.now(), budget: 50 }],
      direction: "stable",
    };
  }
}
