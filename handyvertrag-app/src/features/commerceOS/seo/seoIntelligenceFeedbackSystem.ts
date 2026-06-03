import { SEOIntelligenceFeedback } from "../types";

export class SEOIntelligenceFeedbackSystem {
  private feedback: Map<string, SEOIntelligenceFeedback> = new Map();

  calculateSEOIntelligenceFeedback(entityId: string, seoPerformance: number, recommendationPerformance: number, trendSignals: number, entityPerformance: number, conversionPerformance: number): SEOIntelligenceFeedback {
    const feedback: SEOIntelligenceFeedback = {
      feedbackId: `seo-feedback-${entityId}-${Date.now()}`,
      entityId,
      seoPerformance,
      recommendationPerformance,
      trendSignals,
      entityPerformance,
      conversionPerformance,
      generatedAt: Date.now(),
    };

    this.feedback.set(feedback.feedbackId, feedback);
    return feedback;
  }

  getSEOFeedback(feedbackId: string): SEOIntelligenceFeedback | undefined {
    return this.feedback.get(feedbackId);
  }

  getSEOFeedbackByEntity(entityId: string): SEOIntelligenceFeedback[] {
    return Array.from(this.feedback.values()).filter((f) => f.entityId === entityId);
  }

  calculateOverallSEOIntelligence(feedbackId: string): number {
    const feedback = this.feedback.get(feedbackId);
    if (!feedback) return 50;

    return Math.round(
      (feedback.seoPerformance * 0.3 +
        feedback.recommendationPerformance * 0.25 +
        feedback.trendSignals * 0.15 +
        feedback.entityPerformance * 0.15 +
        feedback.conversionPerformance * 0.15)
    );
  }

  detectSEOOpportunity(entityId: string): boolean {
    const feedbackList = this.getSEOFeedbackByEntity(entityId);
    if (feedbackList.length === 0) return false;

    const latestFeedback = feedbackList[feedbackList.length - 1];
    return latestFeedback.trendSignals > 70 && latestFeedback.entityPerformance < 60;
  }

  getTopSEOOpportunities(limit: number = 10): string[] {
    const opportunities: string[] = [];

    for (const feedback of this.feedback.values()) {
      if (this.detectSEOOpportunity(feedback.entityId)) {
        opportunities.push(feedback.entityId);
      }
    }

    return opportunities.slice(0, limit);
  }
}
