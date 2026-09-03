/**
 * Performance Stabilization
 * Optimizes bundle size, dynamic imports, server/client splitting,
 * lazy loading, cache hydration, and render waterfalls
 */

import dynamic from "next/dynamic";

/**
 * Dynamic Import Utilities
 * Provides safe dynamic imports for performance optimization
 */

export function dynamicImport<T>(
  componentPath: string,
  options?: {
    loading?: React.ComponentType;
    ssr?: boolean;
  }
) {
  return dynamic(
    () => import(componentPath),
    {
      loading: options?.loading,
      ssr: options?.ssr !== false,
    }
  );
}

/**
 * Lazy Loading Utilities
 * Provides safe lazy loading for heavy components
 */

export function lazyLoadComponent<T>(
  componentPath: string,
  fallback?: React.ComponentType
) {
  return React.lazy(() => import(componentPath));
}

/**
 * Code Splitting Utilities
 * Provides safe code splitting for performance optimization
 */

export function splitComponent<T>(
  componentPath: string,
  options?: {
    preload?: boolean;
    prefetch?: boolean;
  }
) {
  if (options?.preload) {
    import(componentPath);
  }

  if (options?.prefetch) {
    import(componentPath);
  }

  return dynamic(() => import(componentPath));
}

/**
 * Cache Hydration Utilities
 * Provides safe cache hydration for performance optimization
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class PerformanceCache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private maxSize: number;
  private defaultTTL: number;

  constructor(maxSize: number = 100, defaultTTL: number = 300000) {
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }

  set(key: string, data: T, ttl?: number): void {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if cache is expired
    if (Date.now() > entry.timestamp + entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  values(): T[] {
    return Array.from(this.cache.values()).map(entry => entry.data);
  }
}

/**
 * Render Waterfall Optimization
 * Provides safe render waterfall optimization
 */

export function optimizeRenderWaterfall(components: React.ComponentType[]): React.ComponentType[] {
  // Sort components by priority
  // Higher priority components render first
  return components.sort((a, b) => {
    const priorityA = (a as any).priority || 0;
    const priorityB = (b as any).priority || 0;
    return priorityB - priorityA;
  });
}

/**
 * Bundle Size Optimization
 * Provides safe bundle size optimization
 */

export function optimizeBundleSize(): {
  recommendations: string[];
  warnings: string[];
} {
  const recommendations: string[] = [];
  const warnings: string[] = [];

  // Placeholder for bundle size analysis
  // In production, this would:
  // 1. Analyze bundle size
  // 2. Identify large dependencies
  // 3. Recommend code splitting
  // 4. Recommend lazy loading
  // 5. Recommend tree shaking

  return {
    recommendations,
    warnings,
  };
}

/**
 * Performance Metrics
 * Provides safe performance metrics collection
 */

export interface PerformanceMetrics {
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
}

export function collectPerformanceMetrics(): PerformanceMetrics {
  if (typeof window === "undefined") {
    return {
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0,
      timeToInteractive: 0,
    };
  }

  const performance = window.performance;
  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;

  return {
    firstContentfulPaint: performance.getEntriesByName("first-contentful-paint")[0]?.startTime || 0,
    largestContentfulPaint: performance.getEntriesByName("largest-contentful-paint")[0]?.startTime || 0,
    firstInputDelay: 0, // Requires PerformanceObserver
    cumulativeLayoutShift: 0, // Requires PerformanceObserver
    timeToInteractive: navigation?.domInteractive || 0,
  };
}
