import { IngestionJob, IngestionStatus } from "../types";

export class ErrorHandlingResilience {
  private ingestionJobs: Map<string, IngestionJob> = new Map();
  private retryStrategies: Map<string, (retryCount: number) => boolean> = new Map();
  private fallbackParsers: Map<string, () => unknown> = new Map();

  handleMalformedZIP(jobId: string): IngestionJob {
    const job = this.ingestionJobs.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    job.status = "failed";
    job.error = "Malformed ZIP file";
    job.completedAt = Date.now();

    return job;
  }

  handleBrokenCSV(jobId: string): IngestionJob {
    const job = this.ingestionJobs.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    job.status = "failed";
    job.error = "Broken CSV file";
    job.completedAt = Date.now();

    return job;
  }

  handleEncodingFailure(jobId: string): IngestionJob {
    const job = this.ingestionJobs.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    job.status = "failed";
    job.error = "Encoding failure";
    job.completedAt = Date.now();

    return job;
  }

  handlePartialIngestionFailure(jobId: string): IngestionJob {
    const job = this.ingestionJobs.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    job.status = "failed";
    job.error = "Partial ingestion failure";
    job.completedAt = Date.now();

    return job;
  }

  handleCorruptedRow(jobId: string, rowNumber: number): void {
    // Placeholder for corrupted row handling
    console.error(`Corrupted row ${rowNumber} in job ${jobId}`);
  }

  registerRetryStrategy(jobId: string, strategy: (retryCount: number) => boolean): void {
    this.retryStrategies.set(jobId, strategy);
  }

  shouldRetry(jobId: string, retryCount: number): boolean {
    const strategy = this.retryStrategies.get(jobId);
    if (!strategy) return false;

    return strategy(retryCount);
  }

  registerFallbackParser(parserId: string, parser: () => unknown): void {
    this.fallbackParsers.set(parserId, parser);
  }

  executeFallbackParser(parserId: string): unknown {
    const parser = this.fallbackParsers.get(parserId);
    if (!parser) return null;

    return parser();
  }

  registerIngestionJob(job: IngestionJob): void {
    this.ingestionJobs.set(job.jobId, job);
  }

  getIngestionJob(jobId: string): IngestionJob | undefined {
    return this.ingestionJobs.get(jobId);
  }

  getIngestionJobsByStatus(status: IngestionStatus): IngestionJob[] {
    return Array.from(this.ingestionJobs.values()).filter((j) => j.status === status);
  }
}
