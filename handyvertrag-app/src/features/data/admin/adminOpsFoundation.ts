import { AdminMonitoring, IngestionJob, SyncJob, ValidationReport, ProviderReliability } from "../types";

export class AdminOpsFoundation {
  private monitoring: AdminMonitoring | null = null;
  private ingestionJobs: Map<string, IngestionJob> = new Map();
  private syncJobs: Map<string, SyncJob> = new Map();
  private validationReports: Map<string, ValidationReport> = new Map();
  private providerReliability: Map<string, ProviderReliability> = new Map();

  trackIngestionJob(job: IngestionJob): void {
    this.ingestionJobs.set(job.jobId, job);
  }

  trackSyncJob(job: SyncJob): void {
    this.syncJobs.set(job.syncId, job);
  }

  trackValidationReport(report: ValidationReport): void {
    this.validationReports.set(report.reportId, report);
  }

  trackProviderReliability(reliability: ProviderReliability): void {
    this.providerReliability.set(reliability.providerId, reliability);
  }

  generateMonitoring(): AdminMonitoring {
    const monitoring: AdminMonitoring = {
      monitoringId: `monitoring-${Date.now()}`,
      ingestionStatus: this.getIngestionStatus(),
      syncStatus: this.getSyncStatus(),
      failedImports: this.getFailedImports(),
      qualityReports: this.getQualityReports(),
      providerHealth: this.getProviderHealth(),
      generatedAt: Date.now(),
    };

    this.monitoring = monitoring;
    return monitoring;
  }

  getMonitoring(): AdminMonitoring | null {
    return this.monitoring;
  }

  getIngestionJob(jobId: string): IngestionJob | undefined {
    return this.ingestionJobs.get(jobId);
  }

  getSyncJob(syncId: string): SyncJob | undefined {
    return this.syncJobs.get(syncId);
  }

  getValidationReport(reportId: string): ValidationReport | undefined {
    return this.validationReports.get(reportId);
  }

  getProviderReliability(providerId: string): ProviderReliability | undefined {
    return this.providerReliability.get(providerId);
  }

  private getIngestionStatus(): AdminMonitoring["ingestionStatus"] {
    const status: AdminMonitoring["ingestionStatus"] = [];

    for (const job of this.ingestionJobs.values()) {
      status.push({
        providerId: job.providerId,
        status: job.status,
        lastSyncAt: job.startedAt,
        recordsProcessed: job.recordsProcessed,
      });
    }

    return status;
  }

  private getSyncStatus(): AdminMonitoring["syncStatus"] {
    const status: AdminMonitoring["syncStatus"] = [];

    for (const job of this.syncJobs.values()) {
      const progress = job.recordsProcessed / Math.max(job.recordsProcessed + job.recordsFailed, 1) * 100;
      status.push({
        syncId: job.syncId,
        status: job.status,
        startedAt: job.startedAt,
        progress: Math.round(progress),
      });
    }

    return status;
  }

  private getFailedImports(): AdminMonitoring["failedImports"] {
    const failed: AdminMonitoring["failedImports"] = [];

    for (const job of this.ingestionJobs.values()) {
      if (job.status === "failed") {
        failed.push({
          jobId: job.jobId,
          providerId: job.providerId,
          error: job.error || "Unknown error",
          failedAt: job.completedAt || Date.now(),
        });
      }
    }

    return failed;
  }

  private getQualityReports(): AdminMonitoring["qualityReports"] {
    const reports: AdminMonitoring["qualityReports"] = [];

    for (const report of this.validationReports.values()) {
      reports.push({
        reportId: report.reportId,
        providerId: report.providerId,
        qualityScore: report.qualityScore,
        generatedAt: report.generatedAt,
      });
    }

    return reports;
  }

  private getProviderHealth(): AdminMonitoring["providerHealth"] {
    const health: AdminMonitoring["providerHealth"] = [];

    for (const reliability of this.providerReliability.values()) {
      let healthStatus: "healthy" | "degraded" | "unhealthy" = "healthy";

      if (reliability.overallReliability < 50) healthStatus = "unhealthy";
      else if (reliability.overallReliability < 70) healthStatus = "degraded";

      health.push({
        providerId: reliability.providerId,
        health: healthStatus,
        lastSyncAt: reliability.lastEvaluatedAt,
        qualityScore: reliability.overallReliability,
      });
    }

    return health;
  }
}
