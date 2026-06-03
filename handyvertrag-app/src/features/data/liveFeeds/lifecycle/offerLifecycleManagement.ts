import { OfferLifecycleStatus, LifecycleEvent, NormalizedOffer } from "../types";

export class OfferLifecycleManagement {
  private lifecycleEvents: Map<string, LifecycleEvent> = new Map();
  private offerStatuses: Map<string, OfferLifecycleStatus> = new Map();
  private offerVersions: Map<string, number> = new Map();
  private historicalPricing: Map<string, Array<{ price: number; timestamp: number }>> = new Map();
  private priceChanges: Map<string, Array<{ from: number; to: number; timestamp: number }>> = new Map();

  trackNewlyImportedOffer(offer: NormalizedOffer): LifecycleEvent {
    return this.createLifecycleEvent(offer.normalizedOfferId, "new");
  }

  trackUpdatedOffer(offer: NormalizedOffer): LifecycleEvent {
    const previousStatus = this.offerStatuses.get(offer.normalizedOfferId);
    const event = this.createLifecycleEvent(offer.normalizedOfferId, "updated", previousStatus);

    this.trackPriceChange(offer);
    this.incrementOfferVersion(offer.normalizedOfferId);

    return event;
  }

  trackRemovedOffer(offer: NormalizedOffer): LifecycleEvent {
    const previousStatus = this.offerStatuses.get(offer.normalizedOfferId);
    return this.createLifecycleEvent(offer.normalizedOfferId, "removed", previousStatus);
  }

  trackExpiredOffer(offer: NormalizedOffer): LifecycleEvent {
    const previousStatus = this.offerStatuses.get(offer.normalizedOfferId);
    return this.createLifecycleEvent(offer.normalizedOfferId, "expired", previousStatus);
  }

  trackUnavailableOffer(offer: NormalizedOffer): LifecycleEvent {
    const previousStatus = this.offerStatuses.get(offer.normalizedOfferId);
    return this.createLifecycleEvent(offer.normalizedOfferId, "unavailable", previousStatus);
  }

  trackHistoricalPricing(offerId: string, price: number): void {
    const history = this.historicalPricing.get(offerId) || [];
    history.push({
      price,
      timestamp: Date.now(),
    });

    this.historicalPricing.set(offerId, history);
  }

  getHistoricalPricing(offerId: string): Array<{ price: number; timestamp: number }> {
    return this.historicalPricing.get(offerId) || [];
  }

  getOfferStatus(offerId: string): OfferLifecycleStatus | undefined {
    return this.offerStatuses.get(offerId);
  }

  getOfferVersion(offerId: string): number {
    return this.offerVersions.get(offerId) || 1;
  }

  getPriceChanges(offerId: string): Array<{ from: number; to: number; timestamp: number }> {
    return this.priceChanges.get(offerId) || [];
  }

  getLifecycleEvent(eventId: string): LifecycleEvent | undefined {
    return this.lifecycleEvents.get(eventId);
  }

  getLifecycleEventsByOffer(offerId: string): LifecycleEvent[] {
    return Array.from(this.lifecycleEvents.values()).filter((e) => e.offerId === offerId);
  }

  private createLifecycleEvent(offerId: string, status: OfferLifecycleStatus, previousStatus?: OfferLifecycleStatus): LifecycleEvent {
    const event: LifecycleEvent = {
      eventId: `event-${offerId}-${status}-${Date.now()}`,
      offerId,
      status,
      previousStatus,
      timestamp: Date.now(),
      metadata: {},
    };

    this.offerStatuses.set(offerId, status);
    this.lifecycleEvents.set(event.eventId, event);

    return event;
  }

  private trackPriceChange(offer: NormalizedOffer): void {
    const history = this.getHistoricalPricing(offer.normalizedOfferId);

    if (history.length > 0) {
      const lastPrice = history[history.length - 1].price;

      if (lastPrice !== offer.monthlyPrice) {
        const changes = this.priceChanges.get(offer.normalizedOfferId) || [];
        changes.push({
          from: lastPrice,
          to: offer.monthlyPrice,
          timestamp: Date.now(),
        });

        this.priceChanges.set(offer.normalizedOfferId, changes);
      }
    }

    this.trackHistoricalPricing(offer.normalizedOfferId, offer.monthlyPrice);
  }

  private incrementOfferVersion(offerId: string): void {
    const currentVersion = this.offerVersions.get(offerId) || 1;
    this.offerVersions.set(offerId, currentVersion + 1);
  }
}
