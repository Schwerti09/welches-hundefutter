import { UserProfile, UserPreferences } from "../types";

export class IntentEvolutionSystem {
  private intentHistory: Map<string, IntentState[]> = new Map();

  trackIntentState(sessionId: string, currentState: IntentState): void {
    const history = this.intentHistory.get(sessionId) || [];
    history.push(currentState);
    this.intentHistory.set(sessionId, history);
  }

  detectIntentEvolution(sessionId: string, profile: UserProfile): IntentEvolution {
    const history = this.intentHistory.get(sessionId) || [];
    if (history.length < 2) {
      return {
        type: "stable",
        confidence: 0.5,
        changes: [],
      };
    }

    const previous = history[history.length - 2];
    const current = history[history.length - 1];

    const changes: IntentChange[] = [];

    // Budget evolution
    if (Math.abs(current.budget - previous.budget) > 10) {
      changes.push({
        type: "budget",
        from: previous.budget,
        to: current.budget,
        direction: current.budget > previous.budget ? "increasing" : "decreasing",
      });
    }

    // Feature priority evolution
    const featureChanges = this.detectFeatureChanges(previous.featurePriorities, current.featurePriorities);
    changes.push(...featureChanges);

    // Brand evolution
    const brandChanges = this.detectBrandChanges(previous.brandPreference, current.brandPreference);
    changes.push(...brandChanges);

    // Provider evolution
    const providerChanges = this.detectProviderChanges(previous.providerPreference, current.providerPreference);
    changes.push(...providerChanges);

    const evolutionType = this.determineEvolutionType(changes);
    const confidence = this.calculateEvolutionConfidence(changes);

    return {
      type: evolutionType,
      confidence,
      changes,
    };
  }

  getCurrentIntentState(sessionId: string, profile: UserProfile): IntentState {
    return {
      budget: profile.preferences.budget.current,
      featurePriorities: profile.preferences.features,
      brandPreference: profile.preferences.brand,
      providerPreference: profile.preferences.provider,
      segment: profile.preferences.segment,
      confidence: this.calculateIntentConfidence(profile),
      timestamp: Date.now(),
    };
  }

  predictNextIntent(sessionId: string): IntentPrediction | null {
    const history = this.intentHistory.get(sessionId);
    if (!history || history.length < 3) {
      return null;
    }

    const recent = history.slice(-3);
    const budgetTrend = this.detectBudgetTrend(recent);
    const featureTrend = this.detectFeatureTrend(recent);

    return {
      likelyBudget: this.predictBudget(budgetTrend, recent[recent.length - 1].budget),
      likelyFeatures: featureTrend,
      confidence: 0.6,
    };
  }

  private detectFeatureChanges(previous: Record<string, number>, current: Record<string, number>): IntentChange[] {
    const changes: IntentChange[] = [];

    for (const feature in current) {
      const diff = current[feature] - previous[feature];
      if (Math.abs(diff) > 20) {
        changes.push({
          type: "feature",
          feature,
          from: previous[feature],
          to: current[feature],
          direction: diff > 0 ? "increasing" : "decreasing",
        });
      }
    }

    return changes;
  }

  private detectBrandChanges(previous: string[], current: string[]): IntentChange[] {
    const changes: IntentChange[] = [];

    const added = current.filter((b) => !previous.includes(b));
    const removed = previous.filter((b) => !current.includes(b));

    if (added.length > 0) {
      changes.push({
        type: "brand",
        from: previous.join(", "),
        to: current.join(", "),
        direction: "added",
      });
    }

    if (removed.length > 0) {
      changes.push({
        type: "brand",
        from: previous.join(", "),
        to: current.join(", "),
        direction: "removed",
      });
    }

    return changes;
  }

  private detectProviderChanges(previous: string[], current: string[]): IntentChange[] {
    const changes: IntentChange[] = [];

    const added = current.filter((p) => !previous.includes(p));
    const removed = previous.filter((p) => !current.includes(p));

    if (added.length > 0) {
      changes.push({
        type: "provider",
        from: previous.join(", "),
        to: current.join(", "),
        direction: "added",
      });
    }

    if (removed.length > 0) {
      changes.push({
        type: "provider",
        from: previous.join(", "),
        to: current.join(", "),
        direction: "removed",
      });
    }

    return changes;
  }

  private determineEvolutionType(changes: IntentChange[]): IntentEvolution["type"] {
    if (changes.length === 0) return "stable";
    if (changes.some((c) => c.type === "budget" && c.direction === "increasing")) return "upgrading";
    if (changes.some((c) => c.type === "budget" && c.direction === "decreasing")) return "downgrading";
    if (changes.some((c) => c.type === "feature")) return "refining";
    return "evolving";
  }

  private calculateEvolutionConfidence(changes: IntentChange[]): number {
    return Math.min(0.5 + changes.length * 0.1, 0.95);
  }

  private calculateIntentConfidence(profile: UserProfile): number {
    const engagementScore = profile.sessionBehavior.engagementDepth;
    const recommendationHistory = profile.recommendationHistory;
    const clickedCount = recommendationHistory.clicked.length;
    const viewedCount = recommendationHistory.viewed.length;

    if (viewedCount === 0) return 0.3;
    if (clickedCount === 0) return 0.5;

    const clickRatio = clickedCount / viewedCount;
    return Math.min(0.5 + clickRatio * 0.3 + engagementScore / 200, 0.95);
  }

  private detectBudgetTrend(history: IntentState[]): "increasing" | "decreasing" | "stable" {
    const budgets = history.map((h) => h.budget);
    const first = budgets[0];
    const last = budgets[budgets.length - 1];

    if (last > first + 10) return "increasing";
    if (last < first - 10) return "decreasing";
    return "stable";
  }

  private detectFeatureTrend(history: IntentState[]): Record<string, number> {
    const featureTrend: Record<string, number> = {};

    const features = Object.keys(history[0].featurePriorities);
    for (const feature of features) {
      const values = history.map((h) => h.featurePriorities[feature]);
      const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
      const trend = values[values.length - 1] - values[0];
      featureTrend[feature] = trend;
    }

    return featureTrend;
  }

  private predictBudget(trend: "increasing" | "decreasing" | "stable", currentBudget: number): number {
    if (trend === "increasing") return currentBudget + 10;
    if (trend === "decreasing") return currentBudget - 10;
    return currentBudget;
  }
}

interface IntentState {
  budget: number;
  featurePriorities: Record<string, number>;
  brandPreference: string[];
  providerPreference: string[];
  segment: string[];
  confidence: number;
  timestamp: number;
}

interface IntentEvolution {
  type: "stable" | "upgrading" | "downgrading" | "refining" | "evolving";
  confidence: number;
  changes: IntentChange[];
}

interface IntentChange {
  type: "budget" | "feature" | "brand" | "provider";
  from: number | string;
  to: number | string;
  direction?: "increasing" | "decreasing" | "added" | "removed";
  feature?: string;
}

interface IntentPrediction {
  likelyBudget: number;
  likelyFeatures: Record<string, number>;
  confidence: number;
}
