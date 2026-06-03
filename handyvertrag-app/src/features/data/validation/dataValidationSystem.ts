import { ValidationReport, ValidationIssue, CommerceOffer, ValidationSeverity } from "../types";

export class DataValidationSystem {
  private reports: Map<string, ValidationReport> = new Map();

  validateOffer(offer: CommerceOffer): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Check for broken offers
    if (!offer.affiliateLink || offer.affiliateLink.length === 0) {
      issues.push({
        offerId: offer.id,
        severity: "error",
        type: "broken",
        message: "Missing affiliate link",
        field: "affiliateLink",
      });
    }

    // Check for invalid pricing
    if (offer.monthlyPrice <= 0 || offer.monthlyPrice > 200) {
      issues.push({
        offerId: offer.id,
        severity: "error",
        type: "invalid_pricing",
        message: "Invalid monthly price",
        field: "monthlyPrice",
        expected: "0 < price <= 200",
        actual: offer.monthlyPrice.toString(),
      });
    }

    // Check for missing fields
    if (!offer.deviceName || offer.deviceName.length === 0) {
      issues.push({
        offerId: offer.id,
        severity: "error",
        type: "missing_field",
        message: "Missing device name",
        field: "deviceName",
      });
    }

    if (!offer.storage || offer.storage.length === 0) {
      issues.push({
        offerId: offer.id,
        severity: "error",
        type: "missing_field",
        message: "Missing storage",
        field: "storage",
      });
    }

    // Check for inconsistent data
    if (offer.contractDuration !== 12 && offer.contractDuration !== 24 && offer.contractDuration !== 36) {
      issues.push({
        offerId: offer.id,
        severity: "warning",
        type: "inconsistent",
        message: "Unusual contract duration",
        field: "contractDuration",
        expected: "12, 24, or 36",
        actual: offer.contractDuration.toString(),
      });
    }

    return issues;
  }

  validateOffers(offers: CommerceOffer[], providerId: string): ValidationReport {
    const report: ValidationReport = {
      reportId: `report-${providerId}-${Date.now()}`,
      jobId: `validation-${Date.now()}`,
      providerId,
      totalOffers: offers.length,
      validOffers: 0,
      invalidOffers: 0,
      brokenOffers: 0,
      duplicateOffers: 0,
      outdatedOffers: 0,
      qualityScore: 0,
      issues: [],
      generatedAt: Date.now(),
    };

    for (const offer of offers) {
      const issues = this.validateOffer(offer);
      report.issues.push(...issues);

      if (issues.length === 0) {
        report.validOffers++;
      } else {
        report.invalidOffers++;

        if (issues.some((i) => i.type === "broken")) {
          report.brokenOffers++;
        }
      }
    }

    // Calculate quality score
    report.qualityScore = this.calculateQualityScore(report);

    this.reports.set(report.reportId, report);
    return report;
  }

  detectDuplicates(offers: CommerceOffer[]): Array<{ offerId: string; duplicateOf: string }> {
    const duplicates: Array<{ offerId: string; duplicateOf: string }> = [];
    const seen = new Map<string, string>();

    for (const offer of offers) {
      const key = this.generateKey(offer);
      const existing = seen.get(key);

      if (existing) {
        duplicates.push({ offerId: offer.id, duplicateOf: existing });
      } else {
        seen.set(key, offer.id);
      }
    }

    return duplicates;
  }

  detectOutdated(offers: CommerceOffer[], thresholdDays: number = 30): string[] {
    const outdated: string[] = [];
    const threshold = Date.now() - thresholdDays * 24 * 60 * 60 * 1000;

    for (const offer of offers) {
      if (offer.updatedAt < threshold) {
        outdated.push(offer.id);
      }
    }

    return outdated;
  }

  generateQualityScore(offer: CommerceOffer): number {
    let score = 100;

    if (!offer.affiliateLink) score -= 30;
    if (offer.monthlyPrice <= 0 || offer.monthlyPrice > 200) score -= 20;
    if (!offer.deviceName) score -= 20;
    if (!offer.storage) score -= 15;
    if (offer.contractDuration !== 12 && offer.contractDuration !== 24 && offer.contractDuration !== 36) score -= 10;
    if (!offer.availability) score -= 5;

    return Math.max(0, score);
  }

  getReport(reportId: string): ValidationReport | undefined {
    return this.reports.get(reportId);
  }

  private generateKey(offer: CommerceOffer): string {
    return `${offer.deviceBrand}-${offer.deviceName}-${offer.storage}-${offer.contractDuration}`;
  }

  private calculateQualityScore(report: ValidationReport): number {
    if (report.totalOffers === 0) return 0;

    const validRatio = report.validOffers / report.totalOffers;
    return Math.round(validRatio * 100);
  }
}
