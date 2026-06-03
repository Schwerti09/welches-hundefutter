export class DataStorageStrategy {
  private rawIngestionData: Map<string, any> = new Map();
  private normalizedEntities: Map<string, any> = new Map();
  private enrichedEntities: Map<string, any> = new Map();
  private historicalData: Map<string, any> = new Map();
  private analyticsData: Map<string, any> = new Map();
  private recommendationData: Map<string, any> = new Map();

  storeRawIngestionData(key: string, data: any): void {
    this.rawIngestionData.set(key, data);
  }

  getRawIngestionData(key: string): any | undefined {
    return this.rawIngestionData.get(key);
  }

  storeNormalizedEntity(key: string, entity: any): void {
    this.normalizedEntities.set(key, entity);
  }

  getNormalizedEntity(key: string): any | undefined {
    return this.normalizedEntities.get(key);
  }

  storeEnrichedEntity(key: string, entity: any): void {
    this.enrichedEntities.set(key, entity);
  }

  getEnrichedEntity(key: string): any | undefined {
    return this.enrichedEntities.get(key);
  }

  storeHistoricalData(key: string, data: any): void {
    this.historicalData.set(key, data);
  }

  getHistoricalData(key: string): any | undefined {
    return this.historicalData.get(key);
  }

  storeAnalyticsData(key: string, data: any): void {
    this.analyticsData.set(key, data);
  }

  getAnalyticsData(key: string): any | undefined {
    return this.analyticsData.get(key);
  }

  storeRecommendationData(key: string, data: any): void {
    this.recommendationData.set(key, data);
  }

  getRecommendationData(key: string): any | undefined {
    return this.recommendationData.get(key);
  }

  cleanupRawData(maxAge: number = 7 * 24 * 60 * 60 * 1000): void {
    const now = Date.now();
    const threshold = now - maxAge;

    for (const [key, data] of this.rawIngestionData) {
      if (data.ingestedAt < threshold) {
        this.rawIngestionData.delete(key);
      }
    }
  }

  cleanupHistoricalData(maxAge: number = 365 * 24 * 60 * 60 * 1000): void {
    const now = Date.now();
    const threshold = now - maxAge;

    for (const [key, data] of this.historicalData) {
      if (data.timestamp < threshold) {
        this.historicalData.delete(key);
      }
    }
  }

  getStorageStats(): {
    raw: number;
    normalized: number;
    enriched: number;
    historical: number;
    analytics: number;
    recommendation: number;
  } {
    return {
      raw: this.rawIngestionData.size,
      normalized: this.normalizedEntities.size,
      enriched: this.enrichedEntities.size,
      historical: this.historicalData.size,
      analytics: this.analyticsData.size,
      recommendation: this.recommendationData.size,
    };
  }
}
