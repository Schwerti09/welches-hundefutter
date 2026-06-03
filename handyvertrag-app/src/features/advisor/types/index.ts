export type BudgetRange = {
  min: number;
  max: number;
};

export type BrandPreference = "apple" | "samsung" | "google" | "xiaomi" | "none" | "any";

export type DataUsage = "low" | "medium" | "high" | "unlimited";

export type ImportanceLevel = "low" | "medium" | "high";

export type ProviderPreference = "telekom" | "vodafone" | "o2" | "none" | "any";

export type ContractDuration = 12 | 24 | 36;

export type AdvisorUserProfile = {
  budgetRange?: BudgetRange;
  brandPreference?: BrandPreference;
  dataUsage?: DataUsage;
  gamingInterest?: boolean;
  cameraImportance?: ImportanceLevel;
  batteryImportance?: ImportanceLevel;
  providerPreference?: ProviderPreference;
  contractDuration?: ContractDuration;
  refurbishedOpenness?: boolean;
  upgradeFrequency?: number; // months between upgrades
};

export type ConversationMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

export type ConversationState = {
  messages: ConversationMessage[];
  userProfile: AdvisorUserProfile;
  currentStep: AdvisorStep;
  confidence: number;
  lastRecommendation?: RecommendationResult;
};

export type AdvisorStep =
  | "initial"
  | "budget_question"
  | "brand_question"
  | "data_question"
  | "gaming_question"
  | "camera_question"
  | "battery_question"
  | "provider_question"
  | "duration_question"
  | "refurbished_question"
  | "recommendation"
  | "refinement"
  | "completed";

export type IntentType =
  | "cheap_contract"
  | "premium_phone"
  | "gaming_phone"
  | "camera_phone"
  | "unlimited_data"
  | "refurbished_interest"
  | "business_usage"
  | "family_plan"
  | "upgrade_advice"
  | "general_comparison";

export type ClassifiedIntent = {
  type: IntentType;
  confidence: number;
  extractedPreferences?: Partial<AdvisorUserProfile>;
};

export type RecommendationReason = {
  factor: string;
  value: string;
  importance: ImportanceLevel;
};

export type RecommendationScore = {
  productId: string;
  offerId: string;
  totalScore: number;
  budgetScore: number;
  featureScore: number;
  providerScore: number;
  dataScore: number;
  cameraScore: number;
  batteryScore: number;
  gamingScore: number;
  valueScore: number;
  confidence: number;
};

export type RecommendationResult = {
  products: {
    product: any;
    offer: any;
    score: RecommendationScore;
    reasons: RecommendationReason[];
  }[];
  userProfile: AdvisorUserProfile;
  confidence: number;
  nextQuestion?: string;
  nextStep?: AdvisorStep;
};

export type AdvisorEvent =
  | "advisor_started"
  | "advisor_question_answered"
  | "advisor_recommendation_shown"
  | "advisor_affiliate_clicked"
  | "advisor_refined"
  | "advisor_completed";

export type TrackingEvent = {
  event: AdvisorEvent;
  timestamp: number;
  userId?: string;
  sessionId: string;
  data?: Record<string, unknown>;
};
