import { AffiliateNetwork, AffiliateTracking } from "../types";

export class AffiliateInfrastructure {
  private tracking: Map<string, AffiliateTracking> = new Map();
  private networks: Map<AffiliateNetwork, AffiliateNetworkConfig> = new Map();

  registerNetwork(network: AffiliateNetwork, config: AffiliateNetworkConfig): void {
    this.networks.set(network, config);
  }

  generateTrackingId(offerId: string): string {
    return `trk-${offerId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  generateDeepLink(offerId: string, affiliateNetwork: AffiliateNetwork, campaignParams?: Record<string, string>): string {
    const tracking = this.tracking.get(offerId);
    if (!tracking) return "";

    const config = this.networks.get(affiliateNetwork);
    if (!config) return tracking.clickUrl;

    let deepLink = config.baseUrl + tracking.clickUrl;

    // Add tracking ID
    deepLink += `${deepLink.includes("?") ? "&" : "?"}tracking_id=${tracking.trackingId}`;

    // Add campaign parameters
    if (campaignParams) {
      for (const [key, value] of Object.entries(campaignParams)) {
        deepLink += `&${key}=${encodeURIComponent(value)}`;
      }
    }

    return deepLink;
  }

  trackClick(offerId: string): void {
    const tracking = this.tracking.get(offerId);
    if (tracking) {
      tracking.clicks++;
      tracking.lastClickAt = Date.now();
    }
  }

  trackConversion(offerId: string, revenue: number): void {
    const tracking = this.tracking.get(offerId);
    if (tracking) {
      tracking.conversions++;
      tracking.revenue += revenue;
      tracking.lastConversionAt = Date.now();
    }
  }

  createTracking(offerId: string, affiliateNetwork: AffiliateNetwork, clickUrl: string, deepLink: string, campaignParams?: Record<string, string>): AffiliateTracking {
    const tracking: AffiliateTracking = {
      trackingId: this.generateTrackingId(offerId),
      offerId,
      affiliateNetwork,
      clickUrl,
      deepLink,
      campaignParams: campaignParams || {},
      clicks: 0,
      conversions: 0,
      revenue: 0,
      lastClickAt: 0,
      lastConversionAt: 0,
    };

    this.tracking.set(offerId, tracking);
    return tracking;
  }

  getTracking(offerId: string): AffiliateTracking | undefined {
    return this.tracking.get(offerId);
  }

  getNetworkConfig(network: AffiliateNetwork): AffiliateNetworkConfig | undefined {
    return this.networks.get(network);
  }

  getClickStats(offerId: string): { clicks: number; conversions: number; revenue: number } {
    const tracking = this.tracking.get(offerId);
    if (!tracking) return { clicks: 0, conversions: 0, revenue: 0 };

    return {
      clicks: tracking.clicks,
      conversions: tracking.conversions,
      revenue: tracking.revenue,
    };
  }
}

export interface AffiliateNetworkConfig {
  baseUrl: string;
  trackingParam: string;
  fallbackTracking?: string;
}
