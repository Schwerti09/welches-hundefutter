import { SynchronizationEvent } from "../types";

export class CrossSystemIntelligenceSync {
  private syncEvents: Map<string, SynchronizationEvent> = new Map();
  private systemStates: Map<string, unknown> = new Map();

  syncPersonalizationToRecommendations(data: Record<string, unknown>): SynchronizationEvent {
    return this.createSyncEvent("intelligence", "personalization", "recommendations", data);
  }

  syncPersonalizationToAdvisor(data: Record<string, unknown>): SynchronizationEvent {
    return this.createSyncEvent("intelligence", "personalization", "advisor", data);
  }

  syncPersonalizationToSEO(data: Record<string, unknown>): SynchronizationEvent {
    return this.createSyncEvent("intelligence", "personalization", "seo", data);
  }

  syncRecommendationsToPersonalization(data: Record<string, unknown>): SynchronizationEvent {
    return this.createSyncEvent("intelligence", "recommendations", "personalization", data);
  }

  syncRecommendationsToAdvisor(data: Record<string, unknown>): SynchronizationEvent {
    return this.createSyncEvent("intelligence", "recommendations", "advisor", data);
  }

  syncRecommendationsToCommerceOS(data: Record<string, unknown>): SynchronizationEvent {
    return this.createSyncEvent("intelligence", "recommendations", "commerceOS", data);
  }

  syncAdvisorToPersonalization(data: Record<string, unknown>): SynchronizationEvent {
    return this.createSyncEvent("intelligence", "advisor", "personalization", data);
  }

  syncAdvisorToRecommendations(data: Record<string, unknown>): SynchronizationEvent {
    return this.createSyncEvent("intelligence", "advisor", "recommendations", data);
  }

  syncSEOToPersonalization(data: Record<string, unknown>): SynchronizationEvent {
    return this.createSyncEvent("intelligence", "seo", "personalization", data);
  }

  syncSEOToRecommendations(data: Record<string, unknown>): SynchronizationEvent {
    return this.createSyncEvent("intelligence", "seo", "recommendations", data);
  }

  syncCommerceOSToRecommendations(data: Record<string, unknown>): SynchronizationEvent {
    return this.createSyncEvent("intelligence", "commerceOS", "recommendations", data);
  }

  syncCommerceOSToPersonalization(data: Record<string, unknown>): SynchronizationEvent {
    return this.createSyncEvent("intelligence", "commerceOS", "personalization", data);
  }

  syncMarketIntelligenceToRecommendations(data: Record<string, unknown>): SynchronizationEvent {
    return this.createSyncEvent("intelligence", "market", "recommendations", data);
  }

  syncMarketIntelligenceToPersonalization(data: Record<string, unknown>): SynchronizationEvent {
    return this.createSyncEvent("intelligence", "market", "personalization", data);
  }

  getSyncEvent(eventId: string): SynchronizationEvent | undefined {
    return this.syncEvents.get(eventId);
  }

  getSyncEventsBySource(source: string): SynchronizationEvent[] {
    return Array.from(this.syncEvents.values()).filter((e) => e.source === source);
  }

  getSyncEventsByTarget(target: string): SynchronizationEvent[] {
    return Array.from(this.syncEvents.values()).filter((e) => e.target === target);
  }

  getPendingSyncEvents(): SynchronizationEvent[] {
    return Array.from(this.syncEvents.values()).filter((e) => e.status === "pending");
  }

  setSystemState(system: string, state: unknown): void {
    this.systemStates.set(system, state);
  }

  getSystemState(system: string): unknown | undefined {
    return this.systemStates.get(system);
  }

  private createSyncEvent(syncType: SynchronizationEvent["syncType"], source: string, target: string, data: Record<string, unknown>): SynchronizationEvent {
    const event: SynchronizationEvent = {
      eventId: `sync-${syncType}-${source}-${target}-${Date.now()}`,
      syncType,
      source,
      target,
      data,
      timestamp: Date.now(),
      status: "pending",
    };

    this.syncEvents.set(event.eventId, event);
    return event;
  }
}
