import { PerformanceMetrics } from "../types";

export class PerformanceOptimizationLayer {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private batchingEnabled: boolean = true;
  private lazyExecutionEnabled: boolean = true;
  private asyncProcessingEnabled: boolean = true;

  enableBatching(): void {
    this.batchingEnabled = true;
  }

  disableBatching(): void {
    this.batchingEnabled = false;
  }

  enableLazyExecution(): void {
    this.lazyExecutionEnabled = true;
  }

  disableLazyExecution(): void {
    this.lazyExecutionEnabled = false;
  }

  enableAsyncProcessing(): void {
    this.asyncProcessingEnabled = true;
  }

  disableAsyncProcessing(): void {
    this.asyncProcessingEnabled = false;
  }

  batchOperation<T>(operations: (() => T)[]): T[] {
    if (!this.batchingEnabled) {
      return operations.map((op) => op());
    }

    const results: T[] = [];
    for (const operation of operations) {
      results.push(operation());
    }

    return results;
  }

  lazyExecute<T>(operation: () => T): () => T {
    if (!this.lazyExecutionEnabled) {
      return operation;
    }

    let executed = false;
    let result: T;

    return () => {
      if (!executed) {
        result = operation();
        executed = true;
      }
      return result;
    };
  }

  asyncExecute<T>(operation: () => T): Promise<T> {
    if (!this.asyncProcessingEnabled) {
      return Promise.resolve(operation());
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(operation());
      }, 0);
    });
  }

  recordMetrics(component: string, metrics: PerformanceMetrics["metrics"]): void {
    const metricsEntry: PerformanceMetrics = {
      metricsId: `metrics-${component}-${Date.now()}`,
      component,
      metrics,
      timestamp: Date.now(),
    };

    this.metrics.set(metricsEntry.metricsId, metricsEntry);
  }

  getMetrics(component: string): PerformanceMetrics[] {
    return Array.from(this.metrics.values()).filter((m) => m.component === component);
  }

  getAverageExecutionTime(component: string): number {
    const metricsList = this.getMetrics(component);
    if (metricsList.length === 0) return 0;

    const totalTime = metricsList.reduce((sum, m) => sum + m.metrics.executionTime, 0);
    return Math.round(totalTime / metricsList.length);
  }

  getAverageCacheHitRate(component: string): number {
    const metricsList = this.getMetrics(component);
    if (metricsList.length === 0) return 0;

    const totalRate = metricsList.reduce((sum, m) => sum + m.metrics.cacheHitRate, 0);
    return Math.round(totalRate / metricsList.length);
  }

  getAverageThroughput(component: string): number {
    const metricsList = this.getMetrics(component);
    if (metricsList.length === 0) return 0;

    const totalThroughput = metricsList.reduce((sum, m) => sum + m.metrics.throughput, 0);
    return Math.round(totalThroughput / metricsList.length);
  }
}
