export type ExecutionMode = "real-time" | "async" | "batch" | "scheduled" | "incremental";

export type PipelineStage = "ingestion" | "normalization" | "enrichment" | "scoring" | "recommendation" | "seo" | "personalization" | "ranking" | "trend" | "caching";

export type EventType = "advisor" | "personalization" | "seo" | "recommendation" | "ranking" | "pricing" | "market" | "conversion" | "affiliate" | "behavioral";

export type ConsistencyType = "recommendation" | "semantic" | "cross_system" | "integrity";

export type ResilienceStatus = "healthy" | "degraded" | "failed" | "recovering";

export type CacheStatus = "fresh" | "stale" | "invalid" | "refreshing";

export interface ExecutionPipeline {
  pipelineId: string;
  pipelineName: string;
  executionMode: ExecutionMode;
  stages: PipelineStage[];
  dependencies: string[];
  status: "pending" | "running" | "completed" | "failed" | "retrying";
  startedAt: number;
  completedAt?: number;
  retryCount: number;
  metadata: Record<string, unknown>;
}

export interface OrchestrationSignal {
  signalId: string;
  signalType: string;
  source: string;
  target: string;
  payload: Record<string, unknown>;
  timestamp: number;
  processed: boolean;
}

export interface UnifiedRecommendation {
  recommendationId: string;
  entityId: string;
  entityType: "device" | "contract" | "provider";
  sources: Array<{
    source: string;
    score: number;
    confidence: number;
  }>;
  unifiedScore: number;
  unifiedConfidence: number;
  arbitration: "accepted" | "rejected" | "merged";
  consistency: boolean;
  generatedAt: number;
}

export interface ConsistencyReport {
  reportId: string;
  consistencyType: ConsistencyType;
  entityId: string;
  violations: Array<{
    type: string;
    severity: "error" | "warning" | "info";
    message: string;
    source: string;
    target: string;
  }>;
  overallConsistency: boolean;
  generatedAt: number;
}

export interface SynchronizationEvent {
  eventId: string;
  syncType: "intelligence" | "recommendation" | "state" | "cache" | "entity";
  source: string;
  target: string;
  data: Record<string, unknown>;
  timestamp: number;
  status: "pending" | "syncing" | "completed" | "failed";
}

export interface CacheEntry {
  cacheId: string;
  cacheType: "recommendation" | "seo" | "market" | "pricing" | "personalization" | "trend";
  entityId: string;
  state: CacheStatus;
  createdAt: number;
  expiresAt: number;
  lastRefreshedAt: number;
}

export interface ExecutionJob {
  jobId: string;
  jobType: string;
  executionMode: ExecutionMode;
  status: "pending" | "running" | "completed" | "failed";
  startedAt: number;
  completedAt?: number;
  result?: Record<string, unknown>;
  error?: string;
  retryCount: number;
}

export interface ResilienceStatusEntry {
  stateId: string;
  component: string;
  state: ResilienceStatus;
  lastFailureAt?: number;
  lastRecoveryAt?: number;
  failureCount: number;
  recoveryCount: number;
  health: number;
}

export interface PlatformEvent {
  eventId: string;
  eventType: EventType;
  source: string;
  payload: Record<string, unknown>;
  timestamp: number;
  processed: boolean;
  routing: string[];
  deduplicationKey?: string;
}

export interface PlatformState {
  stateId: string;
  stateType: "entity_memory" | "recommendation_memory" | "user_intelligence" | "session_intelligence" | "market_intelligence" | "pricing_intelligence";
  entityId: string;
  data: Record<string, unknown>;
  version: number;
  lastUpdated: number;
}

export interface PerformanceMetrics {
  metricsId: string;
  component: string;
  metrics: {
    executionTime: number;
    memoryUsage: number;
    cacheHitRate: number;
    throughput: number;
  };
  timestamp: number;
}

export interface GovernancePolicy {
  policyId: string;
  policyType: "recommendation" | "ranking" | "seo_safety" | "ai_safety" | "consistency" | "event_validation";
  name: string;
  rules: Array<{
    rule: string;
    severity: "error" | "warning" | "info";
    enabled: boolean;
  }>;
  enabled: boolean;
}
