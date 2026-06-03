import { CacheEntry, CacheStatus } from "../types";

export class PlatformCachingStrategy {
  private cache: Map<string, CacheEntry> = new Map();
  private invalidationRules: Map<string, (entry: CacheEntry) => boolean> = new Map();

  cacheRecommendation(entityId: string, data: Record<string, unknown>, ttl: number = 60 * 60 * 1000): CacheEntry {
    return this.createCacheEntry("recommendation", entityId, data, ttl);
  }

  cacheSEOEntity(entityId: string, data: Record<string, unknown>, ttl: number = 30 * 60 * 1000): CacheEntry {
    return this.createCacheEntry("seo", entityId, data, ttl);
  }

  cacheMarketSignal(entityId: string, data: Record<string, unknown>, ttl: number = 15 * 60 * 1000): CacheEntry {
    return this.createCacheEntry("market", entityId, data, ttl);
  }

  cachePricing(entityId: string, data: Record<string, unknown>, ttl: number = 30 * 60 * 1000): CacheEntry {
    return this.createCacheEntry("pricing", entityId, data, ttl);
  }

  cachePersonalization(userId: string, data: Record<string, unknown>, ttl: number = 24 * 60 * 60 * 1000): CacheEntry {
    return this.createCacheEntry("personalization", userId, data, ttl);
  }

  cacheTrend(entityId: string, data: Record<string, unknown>, ttl: number = 60 * 60 * 1000): CacheEntry {
    return this.createCacheEntry("trend", entityId, data, ttl);
  }

  getCache(cacheId: string): CacheEntry | undefined {
    const entry = this.cache.get(cacheId);
    if (!entry) return undefined;

    if (this.isExpired(entry)) {
      this.invalidateCache(cacheId);
      return undefined;
    }

    return entry;
  }

  getCacheByEntity(entityId: string): CacheEntry[] {
    return Array.from(this.cache.values()).filter((c) => c.entityId === entityId);
  }

  getCacheByType(cacheType: CacheEntry["cacheType"]): CacheEntry[] {
    return Array.from(this.cache.values()).filter((c) => c.cacheType === cacheType);
  }

  invalidateCache(cacheId: string): void {
    this.cache.delete(cacheId);
  }

  invalidateCacheByEntity(entityId: string): void {
    const entries = this.getCacheByEntity(entityId);
    for (const entry of entries) {
      this.invalidateCache(entry.cacheId);
    }
  }

  invalidateCacheByType(cacheType: CacheEntry["cacheType"]): void {
    const entries = this.getCacheByType(cacheType);
    for (const entry of entries) {
      this.invalidateCache(entry.cacheId);
    }
  }

  refreshCache(cacheId: string): void {
    const entry = this.cache.get(cacheId);
    if (!entry) return;

    entry.state = "refreshing";
    entry.lastRefreshedAt = Date.now();

    // Placeholder for cache refresh logic

    entry.state = "fresh";
  }

  cleanupExpiredCache(): void {
    const now = Date.now();

    for (const [cacheId, entry] of this.cache) {
      if (entry.expiresAt <= now) {
        this.invalidateCache(cacheId);
      }
    }
  }

  registerInvalidationRule(ruleId: string, rule: (entry: CacheEntry) => boolean): void {
    this.invalidationRules.set(ruleId, rule);
  }

  applyInvalidationRules(): void {
    for (const entry of this.cache.values()) {
      for (const rule of this.invalidationRules.values()) {
        if (rule(entry)) {
          this.invalidateCache(entry.cacheId);
        }
      }
    }
  }

  private createCacheEntry(cacheType: CacheEntry["cacheType"], entityId: string, data: Record<string, unknown>, ttl: number): CacheEntry {
    const entry: CacheEntry = {
      cacheId: `cache-${cacheType}-${entityId}-${Date.now()}`,
      cacheType,
      entityId,
      state: "fresh",
      createdAt: Date.now(),
      expiresAt: Date.now() + ttl,
      lastRefreshedAt: Date.now(),
    };

    this.cache.set(entry.cacheId, entry);
    return entry;
  }

  private isExpired(entry: CacheEntry): boolean {
    return entry.expiresAt <= Date.now();
  }
}
