import { CommerceOffer } from "../types";

export class OfferNormalizationEngine {
  private entityMap: Map<string, string> = new Map();

  normalizeOffer(offer: any): CommerceOffer {
    const normalized: CommerceOffer = {
      id: this.generateId(offer),
      provider: this.normalizeProvider(offer.provider),
      providerId: this.normalizeProviderId(offer.providerId),
      deviceId: this.normalizeDeviceId(offer.deviceId),
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
      affiliateNetwork: this.normalizeAffiliateNetwork(offer.affiliateNetwork),
      trackingId: this.generateTrackingId(),
      campaignParams: offer.campaignParams || {},
      bonuses: this.normalizeBonuses(offer.bonuses),
      cashback: this.normalizeCashback(offer.cashback),
      availability: offer.availability !== false,
      status: "new",
      qualityScore: 50,
      normalizedAt: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.entityMap.set(normalized.id, normalized.id);
    return normalized;
  }

  normalizeProvider(provider: string): string {
    const providerMap: Record<string, string> = {
      "telekom": "Telekom",
      "telekom.de": "Telekom",
      "vodafone": "Vodafone",
      "vodafone.de": "Vodafone",
      "o2": "o2",
      "o2.de": "o2",
      "telefonica": "o2",
    };

    return providerMap[provider.toLowerCase()] || provider;
  }

  normalizeProviderId(providerId: string): string {
    return providerId.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  }

  normalizeDeviceId(deviceId: string): string {
    return deviceId.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  }

  normalizeDeviceName(name: string): string {
    let normalized = name.trim();

    // Remove common prefixes
    normalized = normalized.replace(/^(apple|samsung|google|xiaomi|huawei|oneplus)\s+/i, "");

    // Standardize model names
    normalized = normalized.replace(/iphone\s*/i, "iPhone ");
    normalized = normalized.replace(/galaxy\s*/i, "Galaxy ");
    normalized = normalized.replace(/pixel\s*/i, "Pixel ");

    return normalized;
  }

  normalizeBrand(brand: string): string {
    const brandMap: Record<string, string> = {
      "apple": "Apple",
      "samsung": "Samsung",
      "google": "Google",
      "xiaomi": "Xiaomi",
      "huawei": "Huawei",
      "oneplus": "OnePlus",
      "motorola": "Motorola",
      "nokia": "Nokia",
      "sony": "Sony",
    };

    return brandMap[brand.toLowerCase()] || brand;
  }

  normalizeStorage(storage: string): string {
    const storageMap: Record<string, string> = {
      "128gb": "128 GB",
      "256gb": "256 GB",
      "512gb": "512 GB",
      "1tb": "1 TB",
      "128 gb": "128 GB",
      "256 gb": "256 GB",
      "512 gb": "512 GB",
      "1 tb": "1 TB",
    };

    return storageMap[storage.toLowerCase().replace(/\s/g, "")] || storage;
  }

  normalizeColor(color: string): string {
    const colorMap: Record<string, string> = {
      "titan": "Titan",
      "titanium": "Titan",
      "silver": "Silver",
      "gold": "Gold",
      "black": "Black",
      "white": "White",
      "blue": "Blue",
      "midnight": "Midnight",
      "starlight": "Starlight",
      "natural": "Natural",
    };

    return colorMap[color.toLowerCase()] || color;
  }

  normalizePrice(price: number): number {
    return Math.round(price * 100) / 100;
  }

  normalizeDataVolume(volume: string): string {
    const volumeMap: Record<string, string> = {
      "unlimited": "Unlimited",
      "flatrate": "Unlimited",
      "allnet": "Unlimited",
      "allnet flat": "Unlimited",
      "flat": "Unlimited",
    };

    return volumeMap[volume.toLowerCase()] || volume;
  }

  parseDataVolumeGB(volume: string): number {
    if (volume.toLowerCase() === "unlimited" || volume.toLowerCase() === "flatrate") {
      return 999;
    }

    const match = volume.match(/(\d+)\s*GB/);
    if (match) {
      return parseInt(match[1], 10);
    }

    const match2 = volume.match(/(\d+)\s*TB/);
    if (match2) {
      return parseInt(match2[1], 10) * 1024;
    }

    return 0;
  }

  normalizeDuration(duration: number): number {
    if (duration === 12) return 12;
    if (duration === 24) return 24;
    if (duration === 36) return 36;
    if (duration === 48) return 48;
    return 24;
  }

  normalizeAffiliateNetwork(network: string): "adcell" | "belboon" | "zanox" | "direct" | "custom" {
    const networkMap: Record<string, "adcell" | "belboon" | "zanox" | "direct" | "custom"> = {
      "adcell": "adcell",
      "belboon": "belboon",
      "zanox": "zanox",
      "direct": "direct",
      "affiliate": "custom",
    };

    return networkMap[network?.toLowerCase()] || "direct";
  }

  normalizeBonuses(bonuses: string[]): string[] {
    if (!bonuses) return [];

    return bonuses.map((bonus) => {
      return bonus.trim();
    }).filter((bonus) => bonus.length > 0);
  }

  normalizeCashback(cashback: number): number {
    return Math.round(cashback * 100) / 100;
  }

  private generateId(offer: any): string {
    const parts = [
      this.normalizeProvider(offer.provider),
      this.normalizeDeviceId(offer.deviceId),
      this.normalizeStorage(offer.storage),
      this.normalizeDuration(offer.contractDuration),
    ];

    return parts.join("-").toLowerCase();
  }

  private generateTrackingId(): string {
    return `trk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getEntityId(originalId: string): string | undefined {
    return this.entityMap.get(originalId);
  }

  getAllNormalizedIds(): string[] {
    return Array.from(this.entityMap.values());
  }
}
