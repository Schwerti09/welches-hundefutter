import { NormalizedOffer, ValidationReport } from "../types";

export class FeedValidationEngine {
  private validationReports: Map<string, ValidationReport> = new Map();

  validateOffer(offer: NormalizedOffer): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!offer.providerName || offer.providerName === "Unknown") {
      errors.push("Missing provider name");
    }

    if (!offer.contractName || offer.contractName === "Unknown Contract") {
      errors.push("Missing contract name");
    }

    if (offer.monthlyPrice < 0) {
      errors.push("Invalid monthly price");
    }

    if (offer.oneTimePayment < 0) {
      errors.push("Invalid one-time payment");
    }

    if (!offer.affiliateLink) {
      errors.push("Missing affiliate link");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  validateOffers(offers: NormalizedOffer[]): ValidationReport {
    let validOffers = 0;
    let invalidOffers = 0;
    const validationErrors: Array<{ offerId: string; errors: string[] }> = [];

    for (const offer of offers) {
      const validation = this.validateOffer(offer);

      if (validation.valid) {
        validOffers++;
      } else {
        invalidOffers++;
        validationErrors.push({
          offerId: offer.normalizedOfferId,
          errors: validation.errors,
        });
      }
    }

    const qualityScore = Math.round((validOffers / offers.length) * 100);

    const report: ValidationReport = {
      reportId: `report-${Date.now()}`,
      feedFileId: "",
      normalizedOffersCount: offers.length,
      validOffers,
      invalidOffers,
      validationErrors,
      qualityScore,
      generatedAt: Date.now(),
    };

    this.validationReports.set(report.reportId, report);
    return report;
  }

  detectInvalidPricing(offer: NormalizedOffer): boolean {
    // Placeholder for invalid pricing detection
    return offer.monthlyPrice < 0 || offer.oneTimePayment < 0;
  }

  detectBrokenAffiliateLink(offer: NormalizedOffer): boolean {
    // Placeholder for broken affiliate link detection
    return !offer.affiliateLink;
  }

  detectMalformedContract(offer: NormalizedOffer): boolean {
    // Placeholder for malformed contract detection
    return !offer.contractName || offer.contractName === "Unknown Contract";
  }

  detectImpossibleDataVolume(offer: NormalizedOffer): boolean {
    // Placeholder for impossible data volume detection
    return false;
  }

  detectMissingProvider(offer: NormalizedOffer): boolean {
    // Placeholder for missing provider detection
    return !offer.providerName || offer.providerName === "Unknown";
  }

  detectDuplicateRow(offer: NormalizedOffer, existingOffers: NormalizedOffer[]): boolean {
    // Placeholder for duplicate row detection
    return false;
  }

  detectOutdatedOffer(offer: NormalizedOffer): boolean {
    // Placeholder for outdated offer detection
    return false;
  }

  getValidationReport(reportId: string): ValidationReport | undefined {
    return this.validationReports.get(reportId);
  }
}
