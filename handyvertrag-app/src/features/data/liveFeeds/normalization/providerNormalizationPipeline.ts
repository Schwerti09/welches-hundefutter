import { NormalizedOffer } from "../types";

export class ProviderNormalizationPipeline {
  private normalizedOffers: Map<string, NormalizedOffer> = new Map();
  private normalizationStats: Map<string, number> = new Map();

  normalizeProviderName(providerName: string): string {
    // Placeholder for provider name normalization
    return providerName.trim();
  }

  normalizeContractName(contractName: string): string {
    // Placeholder for contract name normalization
    return contractName.trim();
  }

  normalizeSmartphoneName(smartphoneName: string): string {
    // Placeholder for smartphone name normalization
    return smartphoneName.trim();
  }

  normalizeStorageSize(storageSize: string): string {
    // Placeholder for storage size normalization
    return storageSize.trim();
  }

  normalizeColor(color: string): string {
    // Placeholder for color normalization
    return color.trim();
  }

  normalizeTariffName(tariffName: string): string {
    // Placeholder for tariff name normalization
    return tariffName.trim();
  }

  normalizeMonthlyPrice(monthlyPrice: number): number {
    // Placeholder for monthly price normalization
    return monthlyPrice;
  }

  normalizeOneTimePayment(oneTimePayment: number): number {
    // Placeholder for one-time payment normalization
    return oneTimePayment;
  }

  normalizeCashback(cashback: number): number {
    // Placeholder for cashback normalization
    return cashback;
  }

  normalizeBonusItems(bonusItems: string[]): string[] {
    // Placeholder for bonus items normalization
    return bonusItems;
  }

  normalizeOffer(offer: NormalizedOffer): NormalizedOffer {
    const normalized: NormalizedOffer = {
      ...offer,
      providerName: this.normalizeProviderName(offer.providerName),
      contractName: this.normalizeContractName(offer.contractName),
      smartphoneName: this.normalizeSmartphoneName(offer.smartphoneName),
      storageSize: this.normalizeStorageSize(offer.storageSize),
      color: this.normalizeColor(offer.color),
      tariffName: this.normalizeTariffName(offer.tariffName),
      monthlyPrice: this.normalizeMonthlyPrice(offer.monthlyPrice),
      oneTimePayment: this.normalizeOneTimePayment(offer.oneTimePayment),
      cashback: this.normalizeCashback(offer.cashback),
      bonusItems: this.normalizeBonusItems(offer.bonusItems),
    };

    this.normalizedOffers.set(normalized.normalizedOfferId, normalized);
    this.updateNormalizationStats();

    return normalized;
  }

  normalizeOffers(offers: NormalizedOffer[]): NormalizedOffer[] {
    const normalizedOffers: NormalizedOffer[] = [];

    for (const offer of offers) {
      const normalized = this.normalizeOffer(offer);
      normalizedOffers.push(normalized);
    }

    return normalizedOffers;
  }

  getNormalizedOffer(normalizedOfferId: string): NormalizedOffer | undefined {
    return this.normalizedOffers.get(normalizedOfferId);
  }

  getNormalizationStats(): Map<string, number> {
    return this.normalizationStats;
  }

  private updateNormalizationStats(): void {
    this.normalizationStats.set("providerNamesNormalized", this.normalizationStats.get("providerNamesNormalized") || 0 + 1);
    this.normalizationStats.set("contractNamesNormalized", this.normalizationStats.get("contractNamesNormalized") || 0 + 1);
    this.normalizationStats.set("smartphoneNamesNormalized", this.normalizationStats.get("smartphoneNamesNormalized") || 0 + 1);
    this.normalizationStats.set("storageSizesNormalized", this.normalizationStats.get("storageSizesNormalized") || 0 + 1);
    this.normalizationStats.set("colorsNormalized", this.normalizationStats.get("colorsNormalized") || 0 + 1);
    this.normalizationStats.set("tariffNamesNormalized", this.normalizationStats.get("tariffNamesNormalized") || 0 + 1);
  }
}
