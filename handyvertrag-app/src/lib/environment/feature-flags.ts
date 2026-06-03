/**
 * Feature Flags for Production Deployment
 * These flags allow safe incremental rollout of features
 */

export const FEATURE_FLAGS = {
  // AI Systems
  AI_ADVISOR_ENABLED: process.env.NEXT_PUBLIC_AI_ADVISOR_ENABLED === "true",
  PERSONALIZATION_ENABLED: process.env.NEXT_PUBLIC_PERSONALIZATION_ENABLED === "true",
  
  // Commerce Systems
  RECOMMENDATION_ORCHESTRATION_ENABLED: process.env.NEXT_PUBLIC_RECOMMENDATION_ORCHESTRATION_ENABLED === "true",
  COMMERCE_OS_ENABLED: process.env.NEXT_PUBLIC_COMMERCE_OS_ENABLED === "true",
  
  // Intelligence Systems
  SEMANTIC_GRAPHS_ENABLED: process.env.NEXT_PUBLIC_SEMANTIC_GRAPHS_ENABLED === "true",
  SEO_INTELLIGENCE_ENABLED: process.env.NEXT_PUBLIC_SEO_INTELLIGENCE_ENABLED === "true",
  
  // Data Systems
  LIVE_FEED_INGESTION_ENABLED: process.env.NEXT_PUBLIC_LIVE_FEED_INGESTION_ENABLED === "true",
  REAL_TIME_DATA_ENABLED: process.env.NEXT_PUBLIC_REAL_TIME_DATA_ENABLED === "true",
  
  // UI Systems
  CHAT_UI_ENABLED: process.env.NEXT_PUBLIC_CHAT_UI_ENABLED === "true",
  COMPARISON_UI_ENABLED: process.env.NEXT_PUBLIC_COMPARISON_UI_ENABLED === "true",
  
  // Performance Systems
  STREAMING_RENDERING_ENABLED: process.env.NEXT_PUBLIC_STREAMING_RENDERING_ENABLED === "true",
  LAZY_LOADING_ENABLED: process.env.NEXT_PUBLIC_LAZY_LOADING_ENABLED === "true",
  
  // Debug Systems
  DEBUG_MODE_ENABLED: process.env.NEXT_PUBLIC_DEBUG_MODE_ENABLED === "true",
  PRODUCTION_LOGGING_ENABLED: process.env.NEXT_PUBLIC_PRODUCTION_LOGGING_ENABLED === "true",
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return FEATURE_FLAGS[flag];
}

export function getAllEnabledFeatures(): FeatureFlag[] {
  return Object.entries(FEATURE_FLAGS)
    .filter(([_, enabled]) => enabled)
    .map(([flag]) => flag as FeatureFlag);
}

export function getAllDisabledFeatures(): FeatureFlag[] {
  return Object.entries(FEATURE_FLAGS)
    .filter(([_, enabled]) => !enabled)
    .map(([flag]) => flag as FeatureFlag);
}
