import { ExecutionMode, ExecutionJob } from "../types";

export class ProductionExecutionModes {
  private jobs: Map<string, ExecutionJob> = new Map();

  executeRealTime(jobType: string, operation: () => Record<string, unknown>): ExecutionJob {
    return this.executeJob(jobType, "real-time", operation);
  }

  executeAsync(jobType: string, operation: () => Record<string, unknown>): ExecutionJob {
    return this.executeJob(jobType, "async", operation);
  }

  executeBatch(jobType: string, operations: (() => Record<string, unknown>)[]): ExecutionJob {
    const job: ExecutionJob = {
      jobId: `job-${jobType}-${Date.now()}`,
      jobType,
      executionMode: "batch",
      status: "running",
      startedAt: Date.now(),
      retryCount: 0,
    };

    this.jobs.set(job.jobId, job);

    try {
      const results = operations.map((op) => op());
      job.result = { results };
      job.status = "completed";
      job.completedAt = Date.now();
    } catch (error) {
      job.error = error instanceof Error ? error.message : "Unknown error";
      job.status = "failed";
      job.completedAt = Date.now();
    }

    return job;
  }

  executeScheduled(jobType: string, schedule: number, operation: () => Record<string, unknown>): ExecutionJob {
    const job: ExecutionJob = {
      jobId: `job-${jobType}-${Date.now()}`,
      jobType,
      executionMode: "scheduled",
      status: "pending",
      startedAt: Date.now(),
      retryCount: 0,
    };

    this.jobs.set(job.jobId, job);

    setTimeout(() => {
      job.status = "running";
      job.startedAt = Date.now();

      try {
        job.result = operation();
        job.status = "completed";
        job.completedAt = Date.now();
      } catch (error) {
        job.error = error instanceof Error ? error.message : "Unknown error";
        job.status = "failed";
        job.completedAt = Date.now();
      }
    }, schedule);

    return job;
  }

  executeIncremental(jobType: string, operation: () => Record<string, unknown>): ExecutionJob {
    return this.executeJob(jobType, "incremental", operation);
  }

  getJob(jobId: string): ExecutionJob | undefined {
    return this.jobs.get(jobId);
  }

  getJobsByType(jobType: string): ExecutionJob[] {
    return Array.from(this.jobs.values()).filter((j) => j.jobType === jobType);
  }

  getJobsByExecutionMode(executionMode: ExecutionMode): ExecutionJob[] {
    return Array.from(this.jobs.values()).filter((j) => j.executionMode === executionMode);
  }

  getPendingJobs(): ExecutionJob[] {
    return Array.from(this.jobs.values()).filter((j) => j.status === "pending");
  }

  getRunningJobs(): ExecutionJob[] {
    return Array.from(this.jobs.values()).filter((j) => j.status === "running");
  }

  getCompletedJobs(): ExecutionJob[] {
    return Array.from(this.jobs.values()).filter((j) => j.status === "completed");
  }

  getFailedJobs(): ExecutionJob[] {
    return Array.from(this.jobs.values()).filter((j) => j.status === "failed");
  }

  retryJob(jobId: string): ExecutionJob | undefined {
    const job = this.jobs.get(jobId);
    if (!job || job.status !== "failed") return undefined;

    job.status = "pending";
    job.retryCount++;

    return job;
  }

  private executeJob(jobType: string, executionMode: ExecutionMode, operation: () => Record<string, unknown>): ExecutionJob {
    const job: ExecutionJob = {
      jobId: `job-${jobType}-${Date.now()}`,
      jobType,
      executionMode,
      status: "running",
      startedAt: Date.now(),
      retryCount: 0,
    };

    this.jobs.set(job.jobId, job);

    try {
      job.result = operation();
      job.status = "completed";
      job.completedAt = Date.now();
    } catch (error) {
      job.error = error instanceof Error ? error.message : "Unknown error";
      job.status = "failed";
      job.completedAt = Date.now();
    }

    return job;
  }
}
