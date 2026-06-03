import { FeedFile, IngestionJob, IngestionStatus, NetworkType } from "../types";

export class AWINFeedAdapter {
  private feedFiles: Map<string, FeedFile> = new Map();
  private ingestionJobs: Map<string, IngestionJob> = new Map();

  uploadFeedFile(fileName: string, filePath: string, fileSize: number): FeedFile {
    const feedFile: FeedFile = {
      fileId: `file-${fileName}-${Date.now()}`,
      fileName,
      fileType: "zip",
      networkType: "awin",
      fileSize,
      uploadedAt: Date.now(),
      filePath,
    };

    this.feedFiles.set(feedFile.fileId, feedFile);
    return feedFile;
  }

  createIngestionJob(feedFileId: string): IngestionJob {
    const feedFile = this.feedFiles.get(feedFileId);
    if (!feedFile) {
      throw new Error(`Feed file ${feedFileId} not found`);
    }

    const ingestionJob: IngestionJob = {
      jobId: `job-${feedFileId}-${Date.now()}`,
      feedFileId,
      networkType: feedFile.networkType,
      status: "pending",
      startedAt: 0,
      retryCount: 0,
      metadata: {},
    };

    this.ingestionJobs.set(ingestionJob.jobId, ingestionJob);
    return ingestionJob;
  }

  startIngestionJob(jobId: string): IngestionJob {
    const job = this.ingestionJobs.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    job.status = "running";
    job.startedAt = Date.now();

    return job;
  }

  completeIngestionJob(jobId: string): IngestionJob {
    const job = this.ingestionJobs.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    job.status = "completed";
    job.completedAt = Date.now();

    return job;
  }

  failIngestionJob(jobId: string, error: string): IngestionJob {
    const job = this.ingestionJobs.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    job.status = "failed";
    job.error = error;
    job.completedAt = Date.now();

    return job;
  }

  retryIngestionJob(jobId: string): IngestionJob {
    const job = this.ingestionJobs.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    job.status = "retrying";
    job.retryCount++;

    return job;
  }

  getFeedFile(fileId: string): FeedFile | undefined {
    return this.feedFiles.get(fileId);
  }

  getIngestionJob(jobId: string): IngestionJob | undefined {
    return this.ingestionJobs.get(jobId);
  }

  getIngestionJobsByStatus(status: IngestionStatus): IngestionJob[] {
    return Array.from(this.ingestionJobs.values()).filter((j) => j.status === status);
  }

  getIngestionJobsByNetwork(networkType: NetworkType): IngestionJob[] {
    return Array.from(this.ingestionJobs.values()).filter((j) => j.networkType === networkType);
  }
}
