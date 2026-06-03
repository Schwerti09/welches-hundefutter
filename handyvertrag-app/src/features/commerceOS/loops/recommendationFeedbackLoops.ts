import { RecommendationFeedback } from "../types";

export class RecommendationFeedbackLoops {
  private feedback: Map<string, RecommendationFeedback[]> = new Map();
  private feedbackHistory: Map<string, RecommendationFeedback[]> = new Map();

  trackAcceptedRecommendation(recommendationId: string, userId: string, context?: Record<string, unknown>): RecommendationFeedback {
    return this.createFeedback(recommendationId, userId, "accepted", context);
  }

  trackRejectedRecommendation(recommendationId: string, userId: string, context?: Record<string, unknown>): RecommendationFeedback {
    return this.createFeedback(recommendationId, userId, "rejected", context);
  }

  trackIgnoredRecommendation(recommendationId: string, userId: string, context?: Record<string, unknown>): RecommendationFeedback {
    return this.createFeedback(recommendationId, userId, "ignored", context);
  }

  trackClickedRecommendation(recommendationId: string, userId: string, context?: Record<string, unknown>): RecommendationFeedback {
    return this.createFeedback(recommendationId, userId, "clicked", context);
  }

  trackConvertedRecommendation(recommendationId: string, userId: string, context?: Record<string, unknown>): RecommendationFeedback {
    return this.createFeedback(recommendationId, userId, "converted", context);
  }

  getFeedbackForRecommendation(recommendationId: string): RecommendationFeedback[] {
    return this.feedback.get(recommendationId) || [];
  }

  getFeedbackForUser(userId: string): RecommendationFeedback[] {
    const allFeedback: RecommendationFeedback[] = [];

    for (const feedbackList of this.feedback.values()) {
      for (const feedback of feedbackList) {
        if (feedback.userId === userId) {
          allFeedback.push(feedback);
        }
      }
    }

    return allFeedback;
  }

  calculateRecommendationQualityScore(recommendationId: string): number {
    const feedbackList = this.getFeedbackForRecommendation(recommendationId);
    if (feedbackList.length === 0) return 50;

    const accepted = feedbackList.filter((f) => f.action === "accepted").length;
    const rejected = feedbackList.filter((f) => f.action === "rejected").length;
    const clicked = feedbackList.filter((f) => f.action === "clicked").length;
    const converted = feedbackList.filter((f) => f.action === "converted").length;

    const total = feedbackList.length;
    const score = Math.round(((accepted * 2 + clicked + converted * 3) / total) * 25);

    return Math.min(100, score);
  }

  calculateConversionRate(recommendationId: string): number {
    const feedbackList = this.getFeedbackForRecommendation(recommendationId);
    if (feedbackList.length === 0) return 0;

    const converted = feedbackList.filter((f) => f.action === "converted").length;
    return Math.round((converted / feedbackList.length) * 100);
  }

  calculateAcceptanceRate(recommendationId: string): number {
    const feedbackList = this.getFeedbackForRecommendation(recommendationId);
    if (feedbackList.length === 0) return 0;

    const accepted = feedbackList.filter((f) => f.action === "accepted").length;
    return Math.round((accepted / feedbackList.length) * 100);
  }

  private createFeedback(recommendationId: string, userId: string, action: RecommendationFeedback["action"], context?: Record<string, unknown>): RecommendationFeedback {
    const feedback: RecommendationFeedback = {
      feedbackId: `feedback-${recommendationId}-${userId}-${Date.now()}`,
      recommendationId,
      userId,
      action,
      timestamp: Date.now(),
      context: context || {},
    };

    const feedbackList = this.feedback.get(recommendationId) || [];
    feedbackList.push(feedback);
    this.feedback.set(recommendationId, feedbackList);

    const history = this.feedbackHistory.get(recommendationId) || [];
    history.push(feedback);
    this.feedbackHistory.set(recommendationId, history);

    return feedback;
  }
}
