/**
 * Production Data Flow
 * Defines how the frontend consumes data safely
 */

export interface NormalizedOffer {
  id: string;
  providerName: string;
  contractName: string;
  hundefutterName: string;
  storageSize: string;
  color: string;
  monthlyPrice: number;
  oneTimePayment: number;
  cashback: number;
  bonusItems: string[];
  affiliateLink: string;
}

export interface EnrichedOffer extends NormalizedOffer {
  recommendationScore: number;
  semanticTags: string[];
  aiMetadata: Record<string, unknown>;
  providerMetadata: Record<string, unknown>;
  seoEntities: string[];
  valueScore: number;
  compatibilityScore: number;
  segmentMatching: string[];
  recommendationSuitability: number;
}

export interface CachedRecommendationData {
  recommendations: EnrichedOffer[];
  timestamp: number;
  ttl: number;
}

export interface PreGeneratedSEOData {
  entities: string[];
  topicClusters: string[];
  internalLinks: string[];
  comparisonCandidates: string[];
  timestamp: number;
}

/**
 * Production Data Consumer
 * Safely consumes normalized, enriched, cached, and pre-generated data
 */
export class ProductionDataConsumer {
  private static instance: ProductionDataConsumer;
  private cache: Map<string, CachedRecommendationData> = new Map();
  private seoCache: Map<string, PreGeneratedSEOData> = new Map();

  private constructor() {}

  static getInstance(): ProductionDataConsumer {
    if (!ProductionDataConsumer.instance) {
      ProductionDataConsumer.instance = new ProductionDataConsumer();
    }
    return ProductionDataConsumer.instance;
  }

  /**
   * Get normalized offers from cache or API
   */
  async getNormalizedOffers(limit: number = 10, offset: number = 0): Promise<NormalizedOffer[]> {
    // Placeholder for actual data fetching
    // In production, this would:
    // 1. Check cache first
    // 2. If cache miss, fetch from API
    // 3. Cache the result
    return [];
  }

  /**
   * Get enriched offers from cache or API
   */
  async getEnrichedOffers(limit: number = 10, offset: number = 0): Promise<EnrichedOffer[]> {
    // Placeholder for actual data fetching
    // In production, this would:
    // 1. Check cache first
    // 2. If cache miss, fetch from API
    // 3. Cache the result
    return [];
  }

  /**
   * Get cached recommendation data
   */
  getCachedRecommendations(cacheKey: string): CachedRecommendationData | null {
    const cached = this.cache.get(cacheKey);
    if (!cached) return null;

    // Check if cache is expired
    if (Date.now() > cached.timestamp + cached.ttl) {
      this.cache.delete(cacheKey);
      return null;
    }

    return cached;
  }

  /**
   * Set cached recommendation data
   */
  setCachedRecommendations(cacheKey: string, data: CachedRecommendationData): void {
    this.cache.set(cacheKey, data);
  }

  /**
   * Get pre-generated SEO data
   */
  getPreGeneratedSEOData(seoKey: string): PreGeneratedSEOData | null {
    return this.seoCache.get(seoKey) || null;
  }

  /**
   * Set pre-generated SEO data
   */
  setPreGeneratedSEOData(seoKey: string, data: PreGeneratedSEOData): void {
    this.seoCache.set(seoKey, data);
  }

  /**
   * Clear all caches
   */
  clearAllCaches(): void {
    this.cache.clear();
    this.seoCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    recommendationCacheSize: number;
    seoCacheSize: number;
    totalCacheSize: number;
  } {
    return {
      recommendationCacheSize: this.cache.size,
      seoCacheSize: this.seoCache.size,
      totalCacheSize: this.cache.size + this.seoCache.size,
    };
  }
}

export const dataConsumer = ProductionDataConsumer.getInstance();
