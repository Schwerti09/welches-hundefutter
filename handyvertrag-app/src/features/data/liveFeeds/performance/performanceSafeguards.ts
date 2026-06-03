export interface PerformanceMetrics {
  totalOffers: number;
  processingTime: number;
  memoryUsage: number;
  chunkCount: number;
  averageChunkSize: number;
  streamProcessed: boolean;
  asyncProcessed: boolean;
  progressLogEntries: string[];
}

export class PerformanceSafeguards {
  private chunkSize: number = 1000;
  private streamingEnabled: boolean = true;
  private asyncEnabled: boolean = true;
  private memoryLimit: number = 500 * 1024 * 1024; // 500MB
  private progressLog: string[] = [];

  setChunkSize(size: number): void {
    this.chunkSize = size;
  }

  enableStreaming(): void {
    this.streamingEnabled = true;
  }

  disableStreaming(): void {
    this.streamingEnabled = false;
  }

  enableAsync(): void {
    this.asyncEnabled = true;
  }

  disableAsync(): void {
    this.asyncEnabled = false;
  }

  setMemoryLimit(limit: number): void {
    this.memoryLimit = limit;
  }

  chunkProcessing<T>(data: T[]): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < data.length; i += this.chunkSize) {
      chunks.push(data.slice(i, i + this.chunkSize));
    }
    return chunks;
  }

  streamingProcessing<T>(data: T[], processor: (chunk: T[]) => void): void {
    if (!this.streamingEnabled) {
      processor(data);
      return;
    }

    const chunks = this.chunkProcessing(data);
    for (let i = 0; i < chunks.length; i++) {
      this.logProgress(`Processing chunk ${i + 1}/${chunks.length}`);
      processor(chunks[i]);
    }
  }

  async asyncProcessing<T>(data: T[], processor: (chunk: T[]) => Promise<void>): Promise<void> {
    if (!this.asyncEnabled) {
      await processor(data);
      return;
    }

    const chunks = this.chunkProcessing(data);
    for (let i = 0; i < chunks.length; i++) {
      this.logProgress(`Async processing chunk ${i + 1}/${chunks.length}`);
      await processor(chunks[i]);
    }
  }

  checkMemoryUsage(): { safe: boolean; usage: number; limit: number } {
    const usage = process.memoryUsage().heapUsed;
    const safe = usage < this.memoryLimit;

    if (!safe) {
      this.logProgress(`Memory usage exceeded limit: ${usage} > ${this.memoryLimit}`);
    }

    return {
      safe,
      usage,
      limit: this.memoryLimit,
    };
  }

  logProgress(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    this.progressLog.push(logEntry);
    console.log(logEntry);
  }

  getProgressLog(): string[] {
    return this.progressLog;
  }

  clearProgressLog(): void {
    this.progressLog = [];
  }

  generatePerformanceMetrics(totalOffers: number, processingTime: number, chunkCount: number): PerformanceMetrics {
    const memoryUsage = process.memoryUsage().heapUsed;
    const averageChunkSize = chunkCount > 0 ? totalOffers / chunkCount : 0;

    return {
      totalOffers,
      processingTime,
      memoryUsage,
      chunkCount,
      averageChunkSize,
      streamProcessed: this.streamingEnabled,
      asyncProcessed: this.asyncEnabled,
      progressLogEntries: this.progressLog,
    };
  }
}
