import { NormalizedOffer } from "../types";

export class PerformanceOptimization {
  private streamingEnabled: boolean = true;
  private incrementalImportsEnabled: boolean = true;
  private chunkedProcessingEnabled: boolean = true;
  private asyncEnrichmentEnabled: boolean = true;
  private batchedNormalizationEnabled: boolean = true;

  enableStreaming(): void {
    this.streamingEnabled = true;
  }

  disableStreaming(): void {
    this.streamingEnabled = false;
  }

  enableIncrementalImports(): void {
    this.incrementalImportsEnabled = true;
  }

  disableIncrementalImports(): void {
    this.incrementalImportsEnabled = false;
  }

  enableChunkedProcessing(): void {
    this.chunkedProcessingEnabled = true;
  }

  disableChunkedProcessing(): void {
    this.chunkedProcessingEnabled = false;
  }

  enableAsyncEnrichment(): void {
    this.asyncEnrichmentEnabled = true;
  }

  disableAsyncEnrichment(): void {
    this.asyncEnrichmentEnabled = false;
  }

  enableBatchedNormalization(): void {
    this.batchedNormalizationEnabled = true;
  }

  disableBatchedNormalization(): void {
    this.batchedNormalizationEnabled = false;
  }

  streamingParse<T>(data: T[], chunkSize: number = 1000): T[][] {
    if (!this.streamingEnabled) {
      return [data];
    }

    const chunks: T[][] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }

    return chunks;
  }

  incrementalImport<T>(data: T[], batchSize: number = 1000): T[][] {
    if (!this.incrementalImportsEnabled) {
      return [data];
    }

    const batches: T[][] = [];
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }

    return batches;
  }

  chunkedProcessing<T>(data: T[], chunkSize: number = 1000): T[][] {
    if (!this.chunkedProcessingEnabled) {
      return [data];
    }

    const chunks: T[][] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }

    return chunks;
  }

  asyncEnrich<T>(operation: () => T): Promise<T> {
    if (!this.asyncEnrichmentEnabled) {
      return Promise.resolve(operation());
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(operation());
      }, 0);
    });
  }

  batchedNormalize<T>(data: T[], batchSize: number = 1000): T[][] {
    if (!this.batchedNormalizationEnabled) {
      return [data];
    }

    const batches: T[][] = [];
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }

    return batches;
  }
}
