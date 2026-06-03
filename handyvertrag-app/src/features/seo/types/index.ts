export type SEOEntityType = "device" | "provider" | "contract" | "feature" | "comparison" | "recommendation_group" | "user_intent" | "guide" | "category";

export interface SEOEntity {
  id: string;
  type: SEOEntityType;
  name: string;
  slug: string;
  canonicalUrl: string;
  metadata: SEOMetadata;
  semanticRelationships: SemanticRelationship[];
  relatedEntities: string[];
  topicCluster: string;
  recommendationCluster?: string;
  internalLinks: InternalLink[];
  createdAt: number;
  updatedAt: number;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonical?: string;
  hreflang?: Record<string, string>;
  structuredData?: Record<string, unknown>;
}

export interface SemanticRelationship {
  targetEntityId: string;
  relationshipType: "similar" | "related" | "parent" | "child" | "alternative" | "upgrade" | "downgrade" | "provider" | "brand" | "feature";
  strength: number; // 0-1
  context?: string;
}

export interface InternalLink {
  targetUrl: string;
  anchorText: string;
  relevanceScore: number;
  context?: string;
  linkType: "semantic" | "recommendation" | "topic" | "navigation" | "footer";
}

export interface TopicCluster {
  id: string;
  name: string;
  slug: string;
  authorityHubId: string;
  entityIds: string[];
  relatedClusters: string[];
  internalLinkingMap: Map<string, InternalLink[]>;
  topicScore: number; // 0-100
  createdAt: number;
}

export interface ProgrammaticPage {
  id: string;
  type: "device_contract" | "best_for" | "comparison" | "provider" | "recommendation" | "category_hub" | "intent_page";
  slug: string;
  canonicalUrl: string;
  entities: string[];
  template: string;
  contentBlocks: ContentBlock[];
  metadata: SEOMetadata;
  qualityScore: number;
  uniquenessScore: number;
  createdAt: number;
  updatedAt: number;
}

export interface ContentBlock {
  id: string;
  type: "recommendation" | "provider_insight" | "ai_advice" | "comparison_summary" | "pros_cons" | "faq" | "statistics" | "related_recommendations";
  title: string;
  content: string;
  entities: string[];
  dynamic: boolean;
  priority: number;
}

export interface EEATBlock {
  authorId: string;
  authorName: string;
  authorCredentials: string[];
  editorialReviewId: string;
  editorialReviewer: string;
  lastReviewedAt: number;
  factChecked: boolean;
  factCheckerId?: string;
  sources: Source[];
  lastUpdatedAt: number;
  updateFrequency: "daily" | "weekly" | "monthly" | "quarterly";
}

export interface Source {
  url: string;
  title: string;
  publishedAt: number;
  type: "official" | "news" | "study" | "expert";
}

export interface StructuredData {
  type: "Product" | "FAQ" | "Review" | "Comparison" | "Breadcrumb" | "Organization" | "Article" | "ItemList";
  data: Record<string, unknown>;
  context: string; // head, body, json-ld
}

export interface InternalLinkingScore {
  sourceEntityId: string;
  targetEntityId: string;
  semanticSimilarity: number;
  recommendationScore: number;
  topicScore: number;
  overallScore: number;
  anchorText: string;
  context: string;
}

export interface SEOQualityScore {
  entityId: string;
  contentQuality: number; // 0-100
  uniquenessScore: number; // 0-100
  semanticDepth: number; // 0-100
  eeatScore: number; // 0-100
  internalLinkingScore: number; // 0-100
  overallScore: number; // 0-100
  issues: QualityIssue[];
}

export interface QualityIssue {
  type: "thin_content" | "duplicate" | "low_uniqueness" | "missing_eeat" | "poor_linking" | "outdated";
  severity: "low" | "medium" | "high";
  message: string;
}

export interface SEOAnalytics {
  entityId: string;
  rankingPosition: number;
  clickThroughRate: number;
  engagementScore: number;
  entityPerformance: number;
  topicClusterPerformance: number;
  internalLinkClicks: number;
  recommendationClicks: number;
  timestamp: number;
}

export interface AIAnswerExtraction {
  entityId: string;
  question: string;
  answer: string;
  confidence: number;
  sources: string[];
  entities: string[];
  summary: string;
  citations: Citation[];
}

export interface Citation {
  entityId: string;
  entityType: SEOEntityType;
  relevance: number;
  context: string;
}

export interface SemanticKeywordCluster {
  id: string;
  primaryKeyword: string;
  relatedKeywords: string[];
  userIntents: string[];
  searchVolume?: number;
  difficulty?: number;
  opportunityScore: number;
  entities: string[];
}
