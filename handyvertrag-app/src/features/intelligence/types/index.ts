export type DeviceClassification = "premium" | "midrange" | "budget";
export type ContractClassification = "premium" | "value" | "budget";
export type SuitabilitySegment = "gaming" | "students" | "creators" | "photographers" | "budget" | "business" | "travelers" | "families";

export interface DeviceScores {
  cameraScore: number; // 0-100
  batteryScore: number; // 0-100
  gamingScore: number; // 0-100
  performanceScore: number; // 0-100
  valueScore: number; // 0-100
  longevityScore: number; // 0-100
}

export interface DeviceIntelligence {
  deviceId: string;
  scores: DeviceScores;
  classification: DeviceClassification;
  bestForLabels: SuitabilitySegment[];
  semanticTags: string[];
  aiRecommendationTags: string[];
  releaseYear: number;
  flagshipStatus: boolean;
}

export interface ContractScores {
  valueScore: number; // 0-100
  dataValueRatio: number; // g per €
  roamingFriendliness: number; // 0-100
  fiveGQuality: number; // 0-100
  providerReliability: number; // 0-100
}

export interface ContractIntelligence {
  contractId: string;
  scores: ContractScores;
  classification: ContractClassification;
  unlimitedClassification: boolean;
  budgetClassification: boolean;
  suitability: {
    students: number; // 0-100
    business: number; // 0-100
    families: number; // 0-100
    travelers: number; // 0-100
  };
  semanticTags: string[];
}

export interface SemanticEntity {
  id: string;
  type: "device" | "contract" | "provider" | "feature" | "tag";
  name: string;
  slug: string;
  description?: string;
  metadata: Record<string, unknown>;
  relatedEntities: string[];
  topicCluster?: string;
}

export interface ComparisonResult {
  entityId1: string;
  entityId2: string;
  strengths1: string[];
  strengths2: string[];
  weaknesses1: string[];
  weaknesses2: string[];
  recommendationWinner: string;
  valueWinner: string;
  gamingWinner?: string;
  cameraWinner?: string;
  overallScore1: number;
  overallScore2: number;
}

export interface RelatedRecommendation {
  entityId: string;
  relationType: "similar" | "cheaper" | "better_camera" | "better_gaming" | "better_value" | "upgrade" | "downgrade";
  score: number;
  reason: string;
}

export interface CompatibilityScore {
  deviceId: string;
  contractId: string;
  compatibilityScore: number; // 0-100
  penalties: string[];
  bonuses: string[];
  recommendation: "recommended" | "acceptable" | "not_recommended";
}

export interface ValueScoreExplanation {
  totalScore: number;
  breakdown: {
    hardwareQuality: number;
    contractQuality: number;
    dataValue: number;
    providerQuality: number;
    longTermValue: number;
  };
  weights: {
    hardwareQuality: number;
    contractQuality: number;
    dataValue: number;
    providerQuality: number;
    longTermValue: number;
  };
  explanation: string[];
}

export interface EmbeddingVector {
  entityId: string;
  vector: number[];
  model: string;
  timestamp: number;
}

export interface SemanticSearchQuery {
  query: string;
  filters?: {
    classification?: DeviceClassification | ContractClassification;
    minScore?: number;
    maxPrice?: number;
    provider?: string;
  };
  limit?: number;
}

export interface SemanticSearchResult {
  entityId: string;
  score: number;
  relevance: number;
  matchedFeatures: string[];
}
