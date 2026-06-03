import { ImportReport } from "../types";

export class AdminImportReporting {
  private importReports: Map<string, ImportReport> = new Map();

  generateImportReport(ingestionJobId: string, importedOffers: number, failedOffers: number, duplicateOffers: number, normalizationStats: Map<string, number>, providerStats: Map<string, number>, ingestionDuration: number, qualityScore: number): ImportReport {
    const report: ImportReport = {
      reportId: `report-${ingestionJobId}-${Date.now()}`,
      ingestionJobId,
      importedOffers,
      failedOffers,
      duplicateOffers,
      normalizationStats: {
        providerNamesNormalized: normalizationStats.get("providerNamesNormalized") || 0,
        contractNamesNormalized: normalizationStats.get("contractNamesNormalized") || 0,
        smartphoneNamesNormalized: normalizationStats.get("smartphoneNamesNormalized") || 0,
        storageSizesNormalized: normalizationStats.get("storageSizesNormalized") || 0,
        colorsNormalized: normalizationStats.get("colorsNormalized") || 0,
        tariffNamesNormalized: normalizationStats.get("tariffNamesNormalized") || 0,
      },
      providerStats,
      ingestionDuration,
      qualityScore,
      generatedAt: Date.now(),
    };

    this.importReports.set(report.reportId, report);
    return report;
  }

  getImportReport(reportId: string): ImportReport | undefined {
    return this.importReports.get(reportId);
  }

  getImportReportsByJob(ingestionJobId: string): ImportReport[] {
    return Array.from(this.importReports.values()).filter((r) => r.ingestionJobId === ingestionJobId);
  }

  getLatestImportReport(ingestionJobId: string): ImportReport | undefined {
    const reports = this.getImportReportsByJob(ingestionJobId);
    if (reports.length === 0) return undefined;

    return reports.sort((a, b) => b.generatedAt - a.generatedAt)[0];
  }

  getAverageQualityScore(): number {
    const reports = Array.from(this.importReports.values());
    if (reports.length === 0) return 100;

    const totalQuality = reports.reduce((sum, r) => sum + r.qualityScore, 0);
    return Math.round(totalQuality / reports.length);
  }

  getAverageIngestionDuration(): number {
    const reports = Array.from(this.importReports.values());
    if (reports.length === 0) return 0;

    const totalDuration = reports.reduce((sum, r) => sum + r.ingestionDuration, 0);
    return Math.round(totalDuration / reports.length);
  }
}
