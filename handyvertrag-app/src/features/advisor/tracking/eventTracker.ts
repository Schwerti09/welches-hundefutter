import { AdvisorEvent, TrackingEvent } from "../types";

export class EventTracker {
  private sessionId: string;
  private userId?: string;

  constructor(sessionId: string, userId?: string) {
    this.sessionId = sessionId;
    this.userId = userId;
  }

  track(event: AdvisorEvent, data?: Record<string, unknown>): void {
    const trackingEvent: TrackingEvent = {
      event,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
      data,
    };

    this.sendEvent(trackingEvent);
  }

  private sendEvent(event: TrackingEvent): void {
    console.log("[Advisor Event]", event);
  }

  trackAdvisorStarted(): void {
    this.track("advisor_started");
  }

  trackQuestionAnswered(question: string): void {
    this.track("advisor_question_answered", { question });
  }

  trackRecommendationShown(productCount: number): void {
    this.track("advisor_recommendation_shown", { productCount });
  }

  trackAffiliateClicked(productId: string, offerId: string): void {
    this.track("advisor_affiliate_clicked", { productId, offerId });
  }

  trackRefined(): void {
    this.track("advisor_refined");
  }

  trackCompleted(): void {
    this.track("advisor_completed");
  }
}
