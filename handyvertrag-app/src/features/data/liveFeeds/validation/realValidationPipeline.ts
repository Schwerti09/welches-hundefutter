import { NormalizedOffer } from "../types";

export interface ValidationFailure {
  offerId: string;
  failureType: "broken_price" | "invalid_link" | "malformed_offer" | "missing_provider" | "impossible_data_plan" | "corrupted_row" | "empty_entity";
  severity: "critical" | "warning" | "info";
  message: string;
  timestamp: number;
}

export interface ValidationReport {
  reportId: string;
  totalOffers: number;
  validOffers: number;
  invalidOffers: number;
  failures: ValidationFailure[];
  failureBreakdown: Map<string, number>;
  qualityScore: number;
  generatedAt: number;
}

export class RealValidationPipeline {
  private validationReports: Map<string, ValidationReport> = new Map();
  private validationFailures: Map<string, ValidationFailure[]> = new Map();

  validateOffer(offer: NormalizedOffer): { valid: boolean; failures: ValidationFailure[] } {
    const failures: ValidationFailure[] = [];

    if (this.detectBrokenPrice(offer)) {
      failures.push({
        offerId: offer.normalizedOfferId,
        failureType: "broken_price",
        severity: "critical",
        message: "Invalid price detected",
        timestamp: Date.now(),
      });
    }

    if (this.detectInvalidLink(offer)) {
      failures.push({
        offerId: offer.normalizedOfferId,
        failureType: "invalid_link",
        severity: "critical",
        message: "Invalid affiliate link",
        timestamp: Date.now(),
      });
    }

    if (this.detectMalformedOffer(offer)) {
      failures.push({
        offerId: offer.normalizedOfferId,
        failureType: "malformed_offer",
        severity: "warning",
        message: "Malformed offer data",
        timestamp: Date.now(),
      });
    }

    if (this.detectMissingProvider(offer)) {
      failures.push({
        offerId: offer.normalizedOfferId,
        failureType: "missing_provider",
        severity: "critical",
        message: "Missing provider information",
        timestamp: Date.now(),
      });
    }

    if (this.detectImpossibleDataPlan(offer)) {
      failures.push({
        offerId: offer.normalizedOfferId,
        failureType: "impossible_data_plan",
        severity: "warning",
        message: "Impossible data plan detected",
        timestamp: Date.now(),
      });
    }

    if (this.detectEmptyEntity(offer)) {
      failures.push({
        offerId: offer.normalizedOfferId,
        failureType: "empty_entity",
        severity: "critical",
        message: "Empty entity detected",
        timestamp: Date.now(),
      });
    }

    return {
      valid: failures.length === 0,
      failures,
    };
  }

  validateOffers(offers: NormalizedOffer[]): ValidationReport {
    let validOffers = 0;
    let invalidOffers = 0;
    const allFailures: ValidationFailure[] = [];
    const failureBreakdown = new Map<string, number>();

    for (const offer of offers) {
      const validation = this.validateOffer(offer);

      if (validation.valid) {
        validOffers++;
      } else {
        invalidOffers++;
        allFailures.push(...validation.failures);

        for (const failure of validation.failures) {
          const count = failureBreakdown.get(failure.failureType) || 0;
          failureBreakdown.set(failure.failureType, count + 1);
        }

        this.validationFailures.set(offer.normalizedOfferId, validation.failures);
      }
    }

    const qualityScore = Math.round((validOffers / offers.length) * 100);

    const report: ValidationReport = {
      reportId: `report-${Date.now()}`,
      totalOffers: offers.length,
      validOffers,
      invalidOffers,
      failures: allFailures,
      failureBreakdown,
      qualityScore,
      generatedAt: Date.now(),
    };

    this.validationReports.set(report.reportId, report);
    return report;
  }

  detectBrokenPrice(offer: NormalizedOffer): boolean {
    if (offer.monthlyPrice < 0) return true;
    if (offer.monthlyPrice > 1000) return true;
    if (offer.oneTimePayment < 0) return true;
    if (offer.oneTimePayment > 5000) return true;
    return false;
  }

  detectInvalidLink(offer: NormalizedOffer): boolean {
    if (!offer.affiliateLink) return true;
    if (!offer.affiliateLink.startsWith("http://") && !offer.affiliateLink.startsWith("https://")) return true;
    return false;
  }

  detectMalformedOffer(offer: NormalizedOffer): boolean {
    if (!offer.contractName || offer.contractName === "Unknown Contract") return true;
    if (!offer.smartphoneName || offer.smartphoneName === "Unknown Smartphone") return true;
    return false;
  }

  detectMissingProvider(offer: NormalizedOffer): boolean {
    if (!offer.providerName || offer.providerName === "Unknown") return true;
    return false;
  }

  detectImpossibleDataPlan(offer: NormalizedOffer): boolean {
    // Placeholder for impossible data plan detection
    return false;
  }

  detectEmptyEntity(offer: NormalizedOffer): boolean {
    if (!offer.providerName && !offer.contractName && !offer.smartphoneName) return true;
    return false;
  }

  getValidationReport(reportId: string): ValidationReport | undefined {
    return this.validationReports.get(reportId);
  }

  getValidationFailures(offerId: string): ValidationFailure[] | undefined {
    return this.validationFailures.get(offerId);
  }

  getAllValidationFailures(): ValidationFailure[] {
    const allFailures: ValidationFailure[] = [];

    for (const failures of this.validationFailures.values()) {
      allFailures.push(...failures);
    }

    return allFailures;
  }

  getCriticalFailures(): ValidationFailure[] {
    return this.getAllValidationFailures().filter(f => f.severity === "critical");
  }

  getWarningFailures(): ValidationFailure[] {
    return this.getAllValidationFailures().filter(f => f.severity === "warning");
  }
}
