export type SignalType = "rising" | "falling" | "trending" | "price_drop" | "cashback_increase" | "volume_trend" | "premium_shift" | "budget_shift" | "demand_change";

export type TrendDirection = "up" | "down" | "stable";

export type TrendCategory = "device" | "provider" | "contract" | "intent" | "feature" | "segment";

export type CompetitivenessType = "provider" | "device" | "pricing" | "value" | "recommendation";

export type AutomationType = "trend_detection" | "recommendation_update" | "seo_opportunity" | "entity_enrichment" | "ranking_update" | "alerting";

export type InsightType = "market_momentum" | "provider_shift" | "pricing_shift" | "demand_shift" | "competitiveness_change" | "trend_emergence";

export interface MarketSignal {
  signalId: string;
  signalType: SignalType;
  entityId: string;
  entityType: "device" | "provider" | "contract";
  signalStrength: number;
  confidence: number;
  velocity: number;
  momentum: number;
  detectedAt: number;
  expiresAt: number;
  metadata: Record<string, unknown>;
}

export interface Trend {
  trendId: string;
  trendCategory: TrendCategory;
  entityId: string;
  entityName: string;
  direction: TrendDirection;
  confidence: number;
  growth: number;
  stability: number;
  predictionHorizon: number;
  detectedAt: number;
  updatedAt: number;
}

export interface Prediction {
  predictionId: string;
  predictionType: "user_intent" | "recommendation" | "upgrade_timing" | "demand_growth" | "price_movement" | "competitiveness";
  entityId: string;
  predictedValue: number;
  confidence: number;
  timeframe: number;
  factors: string[];
  generatedAt: number;
  expiresAt: number;
}

export interface OptimizationLoop {
  loopId: string;
  loopType: "ranking" | "recommendation" | "pricing" | "seo";
  entityId: string;
  currentScore: number;
  targetScore: number;
  iterations: number;
  converged: boolean;
  lastOptimizationAt: number;
  nextOptimizationAt: number;
}

export interface CompetitivenessScore {
  scoreId: string;
  competitivenessType: CompetitivenessType;
  entityId: string;
  entityName: string;
  score: number;
  rank: number;
  trend: TrendDirection;
  factors: Array<{
    factor: string;
    score: number;
    weight: number;
  }>;
  calculatedAt: number;
}

export interface ForecastingData {
  forecastId: string;
  forecastType: "price" | "competitiveness" | "recommendation" | "contract_popularity" | "device_momentum" | "seasonal";
  entityId: string;
  predictions: Array<{
    timestamp: number;
    predictedValue: number;
    confidence: number;
  }>;
  model: string;
  accuracy: number;
  generatedAt: number;
}

export interface IntelligenceInsight {
  insightId: string;
  insightType: InsightType;
  title: string;
  summary: string;
  aiReadySummary: string;
  seoBlock?: string;
  advisorInsight?: string;
  confidence: number;
  entities: string[];
  signals: string[];
  generatedAt: number;
  expiresAt: number;
}

export interface AutomationRule {
  ruleId: string;
  automationType: AutomationType;
  name: string;
  description: string;
  trigger: Record<string, unknown>;
  action: Record<string, unknown>;
  enabled: boolean;
  lastExecutedAt: number;
  executionCount: number;
}

export interface DemandHeatmap {
  heatmapId: string;
  demandType: "gaming" | "camera" | "budget" | "unlimited_data" | "provider" | "premium";
  segments: Array<{
    segment: string;
    demand: number;
    growth: number;
    velocity: number;
  }>;
  generatedAt: number;
}

export interface RecommendationFeedback {
  feedbackId: string;
  recommendationId: string;
  userId: string;
  action: "accepted" | "rejected" | "ignored" | "clicked" | "converted";
  timestamp: number;
  context: Record<string, unknown>;
}

export interface SEOIntelligenceFeedback {
  feedbackId: string;
  entityId: string;
  seoPerformance: number;
  recommendationPerformance: number;
  trendSignals: number;
  entityPerformance: number;
  conversionPerformance: number;
  generatedAt: number;
}

export interface CommerceMemory {
  memoryId: string;
  memoryType: "historical_trend" | "recommendation_evolution" | "provider_evolution" | "market_cycle" | "seasonal_shift" | "behavioral_evolution";
  entityId: string;
  data: Record<string, unknown>;
  timestamp: number;
  retentionUntil: number;
}

export interface SignalGraphNode {
  nodeId: string;
  nodeType: "device" | "provider" | "contract" | "trend" | "intent" | "conversion" | "pricing" | "ranking";
  entityId: string;
  strength: number;
  relationships: Array<{
    targetNodeId: string;
    relationshipType: string;
    strength: number;
  }>;
}

export interface ExecutiveDashboard {
  dashboardId: string;
  marketOverview: {
    totalOffers: number;
    activeTrends: number;
    marketConfidence: number;
  };
  providerCompetitiveness: CompetitivenessScore[];
  recommendationPerformance: {
    acceptanceRate: number;
    conversionRate: number;
    averageConfidence: number;
  };
  pricingTrends: Array<{
    segment: string;
    trend: TrendDirection;
    change: number;
  }>;
  conversionIntelligence: {
    totalConversions: number;
    averageFunnelTime: number;
    topConversionPath: string;
  };
  seoAuthorityGrowth: {
    authorityScore: number;
    growth: number;
    entities: number;
  };
  generatedAt: number;
}
