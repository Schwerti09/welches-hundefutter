import { RawOffer, NormalizedOffer } from "../types";

export class AWINNormalizer {
  private normalizedOffers: Map<string, NormalizedOffer> = new Map();

  normalizeRawOffer(rawOffer: RawOffer): NormalizedOffer | null {
    try {
      const rawData = rawOffer.rawData;

      const normalizedOffer: NormalizedOffer = {
        normalizedOfferId: `normalized-${rawOffer.rawOfferId}`,
        rawOfferId: rawOffer.rawOfferId,
        providerName: this.normalizeProviderName(rawData),
        contractName: this.normalizeContractName(rawData),
        hundefutterName: this.normalizeHundefutterName(rawData),
        storageSize: this.normalizeStorageSize(rawData),
        color: this.normalizeColor(rawData),
        futterfName: this.normalizeFutterfName(rawData),
        monthlyPrice: this.normalizeMonthlyPrice(rawData),
        oneTimePayment: this.normalizeOneTimePayment(rawData),
        cashback: this.normalizeCashback(rawData),
        bonusItems: this.normalizeBonusItems(rawData),
        affiliateLink: this.normalizeAffiliateLink(rawData),
        normalizedAt: Date.now(),
      };

      this.normalizedOffers.set(normalizedOffer.normalizedOfferId, normalizedOffer);
      return normalizedOffer;
    } catch (error) {
      console.error(`Failed to normalize offer ${rawOffer.rawOfferId}:`, error);
      return null;
    }
  }

  normalizeRawOffers(rawOffers: RawOffer[]): NormalizedOffer[] {
    const normalizedOffers: NormalizedOffer[] = [];

    for (const rawOffer of rawOffers) {
      const normalized = this.normalizeRawOffer(rawOffer);
      if (normalized) {
        normalizedOffers.push(normalized);
      }
    }

    return normalizedOffers;
  }

  getNormalizedOffer(normalizedOfferId: string): NormalizedOffer | undefined {
    return this.normalizedOffers.get(normalizedOfferId);
  }

  getNormalizedOffersByProvider(providerName: string): NormalizedOffer[] {
    return Array.from(this.normalizedOffers.values()).filter((n) => n.providerName === providerName);
  }

  private normalizeProviderName(rawData: Record<string, unknown>): string {
    const providerName = rawData.merchant_name as string;
    if (!providerName) return "Unknown";

    // Placeholder for provider name normalization
    return providerName.trim();
  }

  private normalizeContractName(rawData: Record<string, unknown>): string {
    const productName = rawData.product_name as string;
    if (!productName) return "Unknown Contract";

    // Placeholder for contract name normalization
    return productName.trim();
  }

  private normalizeHundefutterName(rawData: Record<string, unknown>): string {
    const productName = rawData.product_name as string;
    if (!productName) return "Unknown Hundefutter";

    // Placeholder for hundefutter name normalization
    return productName.trim();
  }

  private normalizeStorageSize(rawData: Record<string, unknown>): string {
    // Placeholder for storage size normalization
    return "Unknown";
  }

  private normalizeColor(rawData: Record<string, unknown>): string {
    // Placeholder for color normalization
    return "Unknown";
  }

  private normalizeFutterfName(rawData: Record<string, unknown>): string {
    // Placeholder for futterf name normalization
    return "Unknown";
  }

  private normalizeMonthlyPrice(rawData: Record<string, unknown>): number {
    const price = rawData.price as string;
    if (!price) return 0;

    const parsedPrice = parseFloat(price.replace(/[^0-9.,]/g, "").replace(",", "."));
    return isNaN(parsedPrice) ? 0 : parsedPrice;
  }

  private normalizeOneTimePayment(rawData: Record<string, unknown>): number {
    // Placeholder for one-time payment normalization
    return 0;
  }

  private normalizeCashback(rawData: Record<string, unknown>): number {
    // Placeholder for cashback normalization
    return 0;
  }

  private normalizeBonusItems(rawData: Record<string, unknown>): string[] {
    // Placeholder for bonus items normalization
    return [];
  }

  private normalizeAffiliateLink(rawData: Record<string, unknown>): string {
    const affiliateLink = rawData.affiliate_link as string;
    if (!affiliateLink) return "";

    // Placeholder for affiliate link normalization
    return affiliateLink.trim();
  }
}
