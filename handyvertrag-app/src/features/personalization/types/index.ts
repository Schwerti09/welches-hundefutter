export type BehavioralEventType = 
  | "view_product"
  | "click_recommendation"
  | "view_comparison"
  | "advisor_interaction"
  | "save_item"
  | "scroll_depth"
  | "provider_click"
  | "price_filter"
  | "feature_filter";

export interface BehavioralEvent {
  id: string;
  sessionId: string;
  type: BehavioralEventType;
  entityId: string;
  entityType: "device" | "contract" | "provider";
  timestamp: number;
  metadata: Record<string, unknown>;
}

export interface UserProfile {
  sessionId: string;
  preferences: UserPreferences;
  affinities: AffinityScores;
  sessionBehavior: SessionBehavior;
  recommendationHistory: RecommendationHistory;
  viewedProducts: string[];
  clickedRecommendations: string[];
  providerAffinity: Map<string, number>;
  budgetEvolution: BudgetEvolution;
  createdAt: number;
  updatedAt: number;
}

export interface UserPreferences {
  budget: {
    min: number;
    max: number;
    current: number;
    flexible: boolean;
  };
  brand: string[];
  provider: string[];
  features: {
    camera: number;
    gaming: number;
    battery: number;
    performance: number;
    storage: number;
  };
  segment: string[];
}

export interface AffinityScores {
  apple: number;
  samsung: number;
  telekom: number;
  vodafone: number;
  o2: number;
  premium: number;
  gaming: number;
  budget: number;
  camera: number;
  battery: number;
}

export interface SessionBehavior {
  engagementDepth: number;
  comparisonInteractions: number;
  recommendationClicks: number;
  aiInteractions: number;
  scrollDepth: number;
  timeOnPage: number;
  providerClicks: Map<string, number>;
}

export interface RecommendationHistory {
  viewed: string[];
  clicked: string[];
  ignored: string[];
  saved: string[];
  timestamps: Map<string, number>;
}

export interface BudgetEvolution {
  initial: number;
  current: number;
  history: Array<{ timestamp: number; budget: number }>;
  direction: "increasing" | "decreasing" | "stable";
}

export interface SessionMemory {
  sessionId: string;
  rememberedPreferences: UserPreferences;
  recommendationHistory: RecommendationHistory;
  viewedComparisons: string[];
  advisorConversations: string[];
  savedRecommendations: string[];
  abandonedSessions: string[];
  lastActivity: number;
}

export interface RankingWeights {
  budget: number;
  brand: number;
  provider: number;
  features: number;
  affinity: number;
  engagement: number;
  recommendationConfidence: number;
}

export interface RecommendationJourney {
  sessionId: string;
  journeyId: string;
  steps: JourneyStep[];
  currentStep: number;
  progression: "upgrading" | "downgrading" | "refining" | "stable";
  conversionProbability: number;
  createdAt: number;
  updatedAt: number;
}

export interface JourneyStep {
  stepId: string;
  entityId: string;
  entityType: "device" | "contract";
  action: "viewed" | "clicked" | "saved" | "compared";
  timestamp: number;
  metadata: Record<string, unknown>;
}

export interface PersonalizationScore {
  sessionId: string;
  userEngagementScore: number;
  purchaseIntentScore: number;
  recommendationConfidence: number;
  conversionReadinessScore: number;
  personalizationLevel: number;
  timestamp: number;
}

export interface ConversionPrediction {
  sessionId: string;
  likelyConverter: boolean;
  highIntentUser: boolean;
  comparisonHeavyUser: boolean;
  priceSensitiveUser: boolean;
  premiumBuyer: boolean;
  upgradeReadyUser: boolean;
  conversionConfidence: number;
  funnelStage: "awareness" | "consideration" | "decision" | "conversion";
  timestamp: number;
}

export interface AffinitySignal {
  entityType: "brand" | "provider" | "feature";
  entityId: string;
  affinityType: "apple" | "samsung" | "telekom" | "vodafone" | "o2" | "premium" | "gaming" | "budget" | "camera" | "battery";
  strength: number;
  source: "behavior" | "interaction" | "preference";
  timestamp: number;
}

export interface AdaptiveRankingScore {
  entityId: string;
  baseScore: number;
  personalizedScore: number;
  rankingWeights: RankingWeights;
  personalizationFactors: string[];
  confidence: number;
  timestamp: number;
}

export interface PrivacyConsent {
  sessionId: string;
  personalizationEnabled: boolean;
  trackingEnabled: boolean;
  aiRecommendationsEnabled: boolean;
  consentTimestamp: number;
  consentVersion: string;
}

export interface ExplainableRecommendation {
  entityId: string;
  recommendationReason: string;
  personalizationFactors: string[];
  confidence: number;
  alternativeReasons: string[];
}
