import { PlatformEvent, EventType } from "../types";

export class UnifiedEventBus {
  private events: Map<string, PlatformEvent> = new Map();
  private eventSubscriptions: Map<EventType, Array<(event: PlatformEvent) => void>> = new Map();
  private eventDeduplication: Map<string, number> = new Map();

  publishAdvisorEvent(source: string, payload: Record<string, unknown>): PlatformEvent {
    return this.publishEvent("advisor", source, payload);
  }

  publishPersonalizationEvent(source: string, payload: Record<string, unknown>): PlatformEvent {
    return this.publishEvent("personalization", source, payload);
  }

  publishSEOEvent(source: string, payload: Record<string, unknown>): PlatformEvent {
    return this.publishEvent("seo", source, payload);
  }

  publishRecommendationEvent(source: string, payload: Record<string, unknown>): PlatformEvent {
    return this.publishEvent("recommendation", source, payload);
  }

  publishRankingEvent(source: string, payload: Record<string, unknown>): PlatformEvent {
    return this.publishEvent("ranking", source, payload);
  }

  publishPricingEvent(source: string, payload: Record<string, unknown>): PlatformEvent {
    return this.publishEvent("pricing", source, payload);
  }

  publishMarketEvent(source: string, payload: Record<string, unknown>): PlatformEvent {
    return this.publishEvent("market", source, payload);
  }

  publishConversionEvent(source: string, payload: Record<string, unknown>): PlatformEvent {
    return this.publishEvent("conversion", source, payload);
  }

  publishAffiliateEvent(source: string, payload: Record<string, unknown>): PlatformEvent {
    return this.publishEvent("affiliate", source, payload);
  }

  publishBehavioralEvent(source: string, payload: Record<string, unknown>): PlatformEvent {
    return this.publishEvent("behavioral", source, payload);
  }

  subscribeToEventType(eventType: EventType, callback: (event: PlatformEvent) => void): void {
    const subscriptions = this.eventSubscriptions.get(eventType) || [];
    subscriptions.push(callback);
    this.eventSubscriptions.set(eventType, subscriptions);
  }

  unsubscribeFromEventType(eventType: EventType, callback: (event: PlatformEvent) => void): void {
    const subscriptions = this.eventSubscriptions.get(eventType) || [];
    const filtered = subscriptions.filter((cb) => cb !== callback);
    this.eventSubscriptions.set(eventType, filtered);
  }

  getEvent(eventId: string): PlatformEvent | undefined {
    return this.events.get(eventId);
  }

  getEventsByType(eventType: EventType): PlatformEvent[] {
    return Array.from(this.events.values()).filter((e) => e.eventType === eventType);
  }

  getEventsBySource(source: string): PlatformEvent[] {
    return Array.from(this.events.values()).filter((e) => e.source === source);
  }

  getUnprocessedEvents(): PlatformEvent[] {
    return Array.from(this.events.values()).filter((e) => !e.processed);
  }

  private publishEvent(eventType: EventType, source: string, payload: Record<string, unknown>): PlatformEvent {
    const deduplicationKey = this.generateDeduplicationKey(eventType, source, payload);

    if (this.isDuplicate(deduplicationKey)) {
      return this.getExistingEvent(deduplicationKey)!;
    }

    const event: PlatformEvent = {
      eventId: `event-${eventType}-${source}-${Date.now()}`,
      eventType,
      source,
      payload,
      timestamp: Date.now(),
      processed: false,
      routing: [],
      deduplicationKey,
    };

    this.events.set(event.eventId, event);
    this.eventDeduplication.set(deduplicationKey, Date.now());

    this.routeEvent(event);

    return event;
  }

  private routeEvent(event: PlatformEvent): void {
    const subscriptions = this.eventSubscriptions.get(event.eventType) || [];

    for (const subscription of subscriptions) {
      subscription(event);
    }
  }

  private generateDeduplicationKey(eventType: EventType, source: string, payload: Record<string, unknown>): string {
    return `${eventType}-${source}-${JSON.stringify(payload)}`;
  }

  private isDuplicate(deduplicationKey: string): boolean {
    const timestamp = this.eventDeduplication.get(deduplicationKey);
    if (!timestamp) return false;

    const now = Date.now();
    const threshold = 60 * 1000;

    return now - timestamp < threshold;
  }

  private getExistingEvent(deduplicationKey: string): PlatformEvent | undefined {
    for (const event of this.events.values()) {
      if (event.deduplicationKey === deduplicationKey) {
        return event;
      }
    }
    return undefined;
  }
}
