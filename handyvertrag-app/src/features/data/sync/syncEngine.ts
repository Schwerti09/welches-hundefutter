import { SyncType, SyncJob, IngestionStatus } from "../types";

export class SyncEngine {
  private syncJobs: Map<string, SyncJob> = new Map();
  private syncSchedule: Map<string, number> = new Map();

  scheduleSync(providerId: string, syncType: SyncType, interval: number): void {
    this.syncSchedule.set(providerId, interval);
  }

  async runSync(providerId: string, syncType: SyncType): Promise<SyncJob> {
    const job: SyncJob = {
      syncId: `sync-${providerId}-${Date.now()}`,
      syncType,
      providerId,
      status: "running",
      startedAt: Date.now(),
      recordsProcessed: 0,
      recordsSuccessful: 0,
      recordsFailed: 0,
      incrementalChanges: 0,
    };

    this.syncJobs.set(job.syncId, job);

    try {
      // Placeholder for sync logic
      job.status = "completed";
      job.completedAt = Date.now();
    } catch (error) {
      job.status = "failed";
      job.error = error instanceof Error ? error.message : "Unknown error";
      job.completedAt = Date.now();
    }

    return job;
  }

  async runScheduledSyncs(): Promise<SyncJob[]> {
    const jobs: SyncJob[] = [];

    for (const [providerId, interval] of this.syncSchedule) {
      const job = await this.runSync(providerId, "scheduled");
      jobs.push(job);
    }

    return jobs;
  }

  async runFullSync(): Promise<SyncJob[]> {
    const jobs: SyncJob[] = [];

    for (const providerId of this.syncSchedule.keys()) {
      const job = await this.runSync(providerId, "full");
      jobs.push(job);
    }

    return jobs;
  }

  async runIncrementalSync(providerId: string): Promise<SyncJob> {
    return this.runSync(providerId, "incremental");
  }

  getSyncJob(syncId: string): SyncJob | undefined {
    return this.syncJobs.get(syncId);
  }

  getFailedSyncs(): SyncJob[] {
    return Array.from(this.syncJobs.values()).filter((job) => job.status === "failed");
  }

  retryFailedSync(syncId: string): SyncJob | undefined {
    const job = this.syncJobs.get(syncId);
    if (!job || job.status !== "failed") return undefined;

    const retryJob: SyncJob = {
      ...job,
      syncId: `retry-${syncId}`,
      status: "running",
      startedAt: Date.now(),
      recordsProcessed: 0,
      recordsSuccessful: 0,
      recordsFailed: 0,
    };

    this.syncJobs.set(retryJob.syncId, retryJob);
    return retryJob;
  }

  getSyncSchedule(): Map<string, number> {
    return this.syncSchedule;
  }
}
