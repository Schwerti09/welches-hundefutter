import { ProviderType, FeedType, IngestionJob, ProviderFeed, CommerceOffer } from "../types";

export class ProviderIngestionSystem {
  private providers: Map<string, ProviderFeed> = new Map();
  private jobs: Map<string, IngestionJob> = new Map();
  private adapters: Map<ProviderType, ProviderAdapter> = new Map();

  registerProvider(feed: ProviderFeed): void {
    this.providers.set(feed.providerId, feed);
  }

  registerAdapter(provider: ProviderType, adapter: ProviderAdapter): void {
    this.adapters.set(provider, adapter);
  }

  async ingestProvider(providerId: string): Promise<IngestionJob> {
    const feed = this.providers.get(providerId);
    if (!feed) {
      throw new Error(`Provider ${providerId} not found`);
    }

    const adapter = this.adapters.get(feed.provider);
    if (!adapter) {
      throw new Error(`Adapter for provider ${feed.provider} not found`);
    }

    const job: IngestionJob = {
      jobId: `ingestion-${providerId}-${Date.now()}`,
      providerId,
      feedType: feed.feedType,
      status: "running",
      startedAt: Date.now(),
      recordsProcessed: 0,
      recordsSuccessful: 0,
      recordsFailed: 0,
      retryCount: 0,
    };

    this.jobs.set(job.jobId, job);

    try {
      const offers = await adapter.fetchOffers(feed);
      job.recordsProcessed = offers.length;

      for (const offer of offers) {
        try {
          const normalizedOffer = await this.normalizeOffer(offer);
          await this.storeOffer(normalizedOffer);
          job.recordsSuccessful++;
        } catch (error) {
          job.recordsFailed++;
        }
      }

      job.status = "completed";
      job.completedAt = Date.now();
    } catch (error) {
      job.status = "failed";
      job.error = error instanceof Error ? error.message : "Unknown error";
      job.completedAt = Date.now();
    }

    return job;
  }

  async ingestAllProviders(): Promise<IngestionJob[]> {
    const jobs: IngestionJob[] = [];

    for (const providerId of this.providers.keys()) {
      const job = await this.ingestProvider(providerId);
      jobs.push(job);
    }

    return jobs;
  }

  getJob(jobId: string): IngestionJob | undefined {
    return this.jobs.get(jobId);
  }

  getProviderFeed(providerId: string): ProviderFeed | undefined {
    return this.providers.get(providerId);
  }

  getAllProviders(): ProviderFeed[] {
    return Array.from(this.providers.values());
  }

  private async normalizeOffer(offer: any): Promise<CommerceOffer> {
    return {
      id: `${offer.providerId}-${offer.deviceId}-${Date.now()}`,
      provider: offer.provider,
      providerId: offer.providerId,
      deviceId: offer.deviceId,
      deviceName: this.normalizeDeviceName(offer.deviceName),
      deviceBrand: this.normalizeBrand(offer.brand),
      storage: this.normalizeStorage(offer.storage),
      color: this.normalizeColor(offer.color),
      monthlyPrice: this.normalizePrice(offer.monthlyPrice),
      oneTimeCost: this.normalizePrice(offer.oneTimeCost || 0),
      dataVolume: this.normalizeDataVolume(offer.dataVolume),
      dataVolumeGB: this.parseDataVolumeGB(offer.dataVolume),
      contractDuration: this.normalizeDuration(offer.contractDuration),
      affiliateLink: offer.affiliateLink,
      affiliateNetwork: offer.affiliateNetwork || "direct",
      trackingId: this.generateTrackingId(),
      campaignParams: offer.campaignParams || {},
      bonuses: offer.bonuses || [],
      cashback: offer.cashback || 0,
      availability: offer.availability !== false,
      status: "new",
      qualityScore: 50,
      normalizedAt: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  private async storeOffer(offer: CommerceOffer): Promise<void> {
    // Placeholder for storage logic
  }

  private normalizeDeviceName(name: string): string {
    return name.trim();
  }

  private normalizeBrand(brand: string): string {
    const brandMap: Record<string, string> = {
      "apple": "Apple",
      "samsung": "Samsung",
      "google": "Google",
      "xiaomi": "Xiaomi",
      "huawei": "Huawei",
      "oneplus": "OnePlus",
    };

    return brandMap[brand.toLowerCase()] || brand;
  }

  private normalizeStorage(storage: string): string {
    const storageMap: Record<string, string> = {
      "128gb": "128 GB",
      "256gb": "256 GB",
      "512gb": "512 GB",
      "1tb": "1 TB",
    };

    return storageMap[storage.toLowerCase()] || storage;
  }

  private normalizeColor(color: string): string {
    const colorMap: Record<string, string> = {
      "titan": "Titan",
      "silver": "Silver",
      "gold": "Gold",
      "black": "Black",
      "white": "White",
      "blue": "Blue",
    };

    return colorMap[color.toLowerCase()] || color;
  }

  private normalizePrice(price: number): number {
    return Math.round(price * 100) / 100;
  }

  private normalizeDataVolume(volume: string): string {
    const volumeMap: Record<string, string> = {
      "unlimited": "Unlimited",
      "flatrate": "Unlimited",
      "allnet": "Unlimited",
    };

    return volumeMap[volume.toLowerCase()] || volume;
  }

  private parseDataVolumeGB(volume: string): number {
    if (volume.toLowerCase() === "unlimited" || volume.toLowerCase() === "flatrate") {
      return 999;
    }

    const match = volume.match(/(\d+)\s*GB/);
    if (match) {
      return parseInt(match[1], 10);
    }

    return 0;
  }

  private normalizeDuration(duration: number): number {
    if (duration === 12) return 12;
    if (duration === 24) return 24;
    if (duration === 36) return 36;
    return 24;
  }

  private generateTrackingId(): string {
    return `trk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export interface ProviderAdapter {
  fetchOffers(feed: ProviderFeed): Promise<any[]>;
}

export class TelekomAdapter implements ProviderAdapter {
  async fetchOffers(feed: ProviderFeed): Promise<any[]> {
    // Placeholder for Telekom API integration
    return [];
  }
}

export class VodafoneAdapter implements ProviderAdapter {
  async fetchOffers(feed: ProviderFeed): Promise<any[]> {
    // Placeholder for Vodafone API integration
    return [];
  }
}

export class O2Adapter implements ProviderAdapter {
  async fetchOffers(feed: ProviderFeed): Promise<any[]> {
    // Placeholder for o2 API integration
    return [];
  }
}

export class CSVAdapter implements ProviderAdapter {
  async fetchOffers(feed: ProviderFeed): Promise<any[]> {
    // Placeholder for CSV feed integration
    return [];
  }
}

export class XMLAdapter implements ProviderAdapter {
  async fetchOffers(feed: ProviderFeed): Promise<any[]> {
    // Placeholder for XML feed integration
    return [];
  }
}

export class JSONAdapter implements ProviderAdapter {
  async fetchOffers(feed: ProviderFeed): Promise<any[]> {
    // Placeholder for JSON feed integration
    return [];
  }
}

export class ScrapingAdapter implements ProviderAdapter {
  async fetchOffers(feed: ProviderFeed): Promise<any[]> {
    // Placeholder for scraping integration
    return [];
  }
}
