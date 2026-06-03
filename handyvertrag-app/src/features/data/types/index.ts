export type ProviderType = 
  | "anifit"
  | "wolfsblut"
  | "Zooplus"
  | "sparhund"
  | "deinhund"
  | "logitel"
  | "mediamarkt"
  | "saturn"
  | "custom";

export type FeedType = "api" | "csv" | "xml" | "json" | "scraping";

export type OfferStatus = "new" | "active" | "updated" | "expiring" | "removed" | "unavailable";

export type IngestionStatus = "pending" | "running" | "completed" | "failed" | "retrying";

export type SyncType = "scheduled" | "incremental" | "full" | "manual";

export type ValidationSeverity = "error" | "warning" | "info";

export type AffiliateNetwork = "adcell" | "belboon" | "zanox" | "direct" | "custom";

export interface CommerceOffer {
  id: string;
  provider: string;
  providerId: string;
  deviceId: string;
  deviceName: string;
  deviceBrand: string;
  storage: string;
  color: string;
  monthlyPrice: number;
  oneTimeCost: number;
  dataVolume: string;
  dataVolumeGB: number;
  contractDuration: number;
  affiliateLink: string;
  affiliateNetwork: AffiliateNetwork;
  trackingId: string;
  campaignParams: Record<string, string>;
  bonuses: string[];
  cashback: number;
  availability: boolean;
  status: OfferStatus;
  qualityScore: number;
  normalizedAt: number;
  createdAt: number;
  updatedAt: number;
}

export interface ProviderFeed {
  providerId: string;
  provider: ProviderType;
  feedType: FeedType;
  feedUrl?: string;
  feedConfig: Record<string, unknown>;
  lastSyncAt: number;
  nextSyncAt: number;
  syncFrequency: number;
  active: boolean;
}

export interface IngestionJob {
  jobId: string;
  providerId: string;
  feedType: FeedType;
  status: IngestionStatus;
  startedAt: number;
  completedAt?: number;
  recordsProcessed: number;
  recordsSuccessful: number;
  recordsFailed: number;
  error?: string;
  retryCount: number;
}

export interface SyncJob {
  syncId: string;
  syncType: SyncType;
  providerId: string;
  status: IngestionStatus;
  startedAt: number;
  completedAt?: number;
  recordsProcessed: number;
  recordsSuccessful: number;
  recordsFailed: number;
  incrementalChanges: number;
  error?: string;
}

export interface ValidationReport {
  reportId: string;
  jobId: string;
  providerId: string;
  totalOffers: number;
  validOffers: number;
  invalidOffers: number;
  brokenOffers: number;
  duplicateOffers: number;
  outdatedOffers: number;
  qualityScore: number;
  issues: ValidationIssue[];
  generatedAt: number;
}

export interface ValidationIssue {
  offerId: string;
  severity: ValidationSeverity;
  type: "broken" | "invalid_pricing" | "missing_field" | "inconsistent" | "duplicate" | "outdated";
  message: string;
  field?: string;
  expected?: string;
  actual?: string;
}

export interface AffiliateTracking {
  trackingId: string;
  offerId: string;
  affiliateNetwork: AffiliateNetwork;
  clickUrl: string;
  deepLink: string;
  campaignParams: Record<string, string>;
  clicks: number;
  conversions: number;
  revenue: number;
  lastClickAt: number;
  lastConversionAt: number;
}

export interface PricingHistory {
  offerId: string;
  priceHistory: Array<{
    price: number;
    effectiveAt: number;
    source: string;
  }>;
  bestHistoricalPrice: number;
  bestHistoricalPriceAt: number;
  priceChanges: number;
  lastPriceChangeAt: number;
  priceTrend: "increasing" | "decreasing" | "stable";
}

export interface LifecycleEvent {
  eventId: string;
  offerId: string;
  eventType: OfferStatus;
  previousStatus?: OfferStatus;
  timestamp: number;
  metadata: Record<string, unknown>;
}

export interface EnrichmentResult {
  enrichmentId: string;
  offerId: string;
  intelligenceScores: {
    deviceScore: number;
    contractScore: number;
    valueScore: number;
  };
  recommendationTags: string[];
  semanticEntities: string[];
  seoMetadata: {
    title: string;
    description: string;
    keywords: string[];
  };
  providerMetadata: {
    reliability: number;
    updateFrequency: number;
  };
  compatibilityScores: {
    deviceContract: number;
  };
  enrichedAt: number;
}

export interface ProviderReliability {
  providerId: string;
  provider: ProviderType;
  updateFrequency: number;
  dataQuality: number;
  pricingReliability: number;
  offerConsistency: number;
  availabilityAccuracy: number;
  overallReliability: number;
  lastEvaluatedAt: number;
}

export interface MarketIntelligence {
  intelligenceId: string;
  generatedAt: number;
  trendingDevices: Array<{
    deviceId: string;
    deviceName: string;
    trend: "up" | "down" | "stable";
    change: number;
  }>;
  bestValueProviders: Array<{
    providerId: string;
    provider: string;
    valueScore: number;
  }>;
  marketPricingTrends: Array<{
    segment: string;
    trend: "up" | "down" | "stable";
    change: number;
  }>;
  premiumMarketEvolution: {
    avgPrice: number;
    priceTrend: "up" | "down" | "stable";
    marketShare: number;
  };
  budgetMarketEvolution: {
    avgPrice: number;
    priceTrend: "up" | "down" | "stable";
    marketShare: number;
  };
  contractCompetitiveness: Array<{
    providerId: string;
    competitiveness: number;
    rank: number;
  }>;
}

export interface AdminMonitoring {
  monitoringId: string;
  ingestionStatus: Array<{
    providerId: string;
    status: IngestionStatus;
    lastSyncAt: number;
    recordsProcessed: number;
  }>;
  syncStatus: Array<{
    syncId: string;
    status: IngestionStatus;
    startedAt: number;
    progress: number;
  }>;
  failedImports: Array<{
    jobId: string;
    providerId: string;
    error: string;
    failedAt: number;
  }>;
  qualityReports: Array<{
    reportId: string;
    providerId: string;
    qualityScore: number;
    generatedAt: number;
  }>;
  providerHealth: Array<{
    providerId: string;
    health: "healthy" | "degraded" | "unhealthy";
    lastSyncAt: number;
    qualityScore: number;
  }>;
  generatedAt: number;
}
