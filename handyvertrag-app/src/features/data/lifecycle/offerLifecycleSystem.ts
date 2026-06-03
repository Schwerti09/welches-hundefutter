import { OfferStatus, LifecycleEvent, CommerceOffer } from "../types";

export class OfferLifecycleSystem {
  private lifecycleEvents: Map<string, LifecycleEvent[]> = new Map();
  private offerVersions: Map<string, number> = new Map();

  trackLifecycleEvent(offerId: string, eventType: OfferStatus, previousStatus?: OfferStatus, metadata?: Record<string, unknown>): LifecycleEvent {
    const event: LifecycleEvent = {
      eventId: `event-${offerId}-${Date.now()}`,
      offerId,
      eventType,
      previousStatus,
      timestamp: Date.now(),
      metadata: metadata || {},
    };

    const events = this.lifecycleEvents.get(offerId) || [];
    events.push(event);
    this.lifecycleEvents.set(offerId, events);

    // Update version
    const currentVersion = this.offerVersions.get(offerId) || 0;
    this.offerVersions.set(offerId, currentVersion + 1);

    return event;
  }

  getLifecycleEvents(offerId: string): LifecycleEvent[] {
    return this.lifecycleEvents.get(offerId) || [];
  }

  getCurrentStatus(offerId: string): OfferStatus {
    const events = this.lifecycleEvents.get(offerId);
    if (!events || events.length === 0) return "new";

    return events[events.length - 1].eventType;
  }

  getVersion(offerId: string): number {
    return this.offerVersions.get(offerId) || 0;
  }

  updateOfferStatus(offer: CommerceOffer, newStatus: OfferStatus): CommerceOffer {
    const previousStatus = offer.status;
    offer.status = newStatus;
    offer.updatedAt = Date.now();

    this.trackLifecycleEvent(offer.id, newStatus, previousStatus);

    return offer;
  }

  markAsNew(offer: CommerceOffer): CommerceOffer {
    return this.updateOfferStatus(offer, "new");
  }

  markAsActive(offer: CommerceOffer): CommerceOffer {
    return this.updateOfferStatus(offer, "active");
  }

  markAsUpdated(offer: CommerceOffer): CommerceOffer {
    return this.updateOfferStatus(offer, "updated");
  }

  markAsExpiring(offer: CommerceOffer): CommerceOffer {
    return this.updateOfferStatus(offer, "expiring");
  }

  markAsRemoved(offer: CommerceOffer): CommerceOffer {
    return this.updateOfferStatus(offer, "removed");
  }

  markAsUnavailable(offer: CommerceOffer): CommerceOffer {
    return this.updateOfferStatus(offer, "unavailable");
  }

  getExpiringOffers(thresholdDays: number = 7): Array<{ offerId: string; expiresAt: number }> {
    const expiring: Array<{ offerId: string; expiresAt: number }> = [];
    const now = Date.now();
    const threshold = thresholdDays * 24 * 60 * 60 * 1000;

    for (const [offerId, events] of this.lifecycleEvents) {
      const expiringEvent = events.find((e) => e.eventType === "expiring");
      if (expiringEvent) {
        const timeUntilExpiry = expiringEvent.timestamp - now;
        if (timeUntilExpiry > 0 && timeUntilExpiry <= threshold) {
          expiring.push({ offerId, expiresAt: expiringEvent.timestamp });
        }
      }
    }

    return expiring.sort((a, b) => a.expiresAt - b.expiresAt);
  }

  getRemovedOffers(since: number): string[] {
    const removed: string[] = [];
    const threshold = Date.now() - since;

    for (const [offerId, events] of this.lifecycleEvents) {
      const removedEvent = events.find((e) => e.eventType === "removed");
      if (removedEvent && removedEvent.timestamp >= threshold) {
        removed.push(offerId);
      }
    }

    return removed;
  }

  getOfferHistory(offerId: string): LifecycleEvent[] {
    return this.lifecycleEvents.get(offerId) || [];
  }
}
