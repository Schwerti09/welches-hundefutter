export class AIPersonalizationLayer {
  private embeddings: Map<string, UserEmbedding> = new Map();
  private semanticProfiles: Map<string, SemanticUserProfile> = new Map();

  generateUserEmbedding(sessionId: string, profile: any): UserEmbedding {
    const embedding: UserEmbedding = {
      sessionId,
      vector: this.generateEmbeddingVector(profile),
      features: this.extractFeatures(profile),
      preferences: this.extractPreferences(profile),
      model: "default",
      timestamp: Date.now(),
    };

    this.embeddings.set(sessionId, embedding);
    return embedding;
  }

  generateSemanticUserProfile(sessionId: string, profile: any): SemanticUserProfile {
    const semanticProfile: SemanticUserProfile = {
      sessionId,
      interests: this.extractInterests(profile),
      intents: this.extractIntents(profile),
      affinities: this.extractAffinities(profile),
      behaviors: this.extractBehaviors(profile),
      confidence: this.calculateConfidence(profile),
      timestamp: Date.now(),
    };

    this.semanticProfiles.set(sessionId, semanticProfile);
    return semanticProfile;
  }

  findSimilarUsers(sessionId: string, limit: number = 10): Array<{ sessionId: string; similarity: number }> {
    const currentEmbedding = this.embeddings.get(sessionId);
    if (!currentEmbedding) return [];

    const similarities: Array<{ sessionId: string; similarity: number }> = [];

    for (const [otherSessionId, otherEmbedding] of this.embeddings) {
      if (otherSessionId === sessionId) continue;

      const similarity = this.cosineSimilarity(currentEmbedding.vector, otherEmbedding.vector);
      similarities.push({ sessionId: otherSessionId, similarity });
    }

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  generateVectorBasedRecommendations(sessionId: string, itemEmbeddings: Map<string, number[]>): Array<{ itemId: string; similarity: number }> {
    const userEmbedding = this.embeddings.get(sessionId);
    if (!userEmbedding) return [];

    const similarities: Array<{ itemId: string; similarity: number }> = [];

    for (const [itemId, itemVector] of itemEmbeddings) {
      const similarity = this.cosineSimilarity(userEmbedding.vector, itemVector);
      similarities.push({ itemId, similarity });
    }

    return similarities.sort((a, b) => b.similarity - a.similarity);
  }

  prepareForLLMPersonalization(sessionId: string, profile: any): LLMPersonalizationContext {
    const semanticProfile = this.semanticProfiles.get(sessionId);
    const embedding = this.embeddings.get(sessionId);

    return {
      sessionId,
      userProfile: profile,
      semanticProfile,
      userEmbedding: embedding,
      personalizationLevel: this.calculatePersonalizationLevel(profile),
      recommendedContext: this.generateRecommendedContext(profile),
      timestamp: Date.now(),
    };
  }

  private generateEmbeddingVector(profile: any): number[] {
    const vector: number[] = [];

    // Budget vector
    const budget = profile.preferences?.budget?.current || 50;
    vector.push(budget / 100);

    // Feature vectors
    const features = profile.preferences?.features || {};
    vector.push((features.camera || 50) / 100);
    vector.push((features.gaming || 50) / 100);
    vector.push((features.battery || 50) / 100);
    vector.push((features.performance || 50) / 100);

    // Affinity vectors
    const affinities = profile.affinities || {};
    vector.push((affinities.apple || 50) / 100);
    vector.push((affinities.samsung || 50) / 100);
    vector.push((affinities.premium || 50) / 100);
    vector.push((affinities.gaming || 50) / 100);

    // Engagement vector
    const engagement = profile.sessionBehavior?.engagementDepth || 0;
    vector.push(engagement / 100);

    return vector;
  }

  private extractFeatures(profile: any): string[] {
    const features: string[] = [];

    if (profile.preferences?.features?.camera > 70) features.push("camera-focused");
    if (profile.preferences?.features?.gaming > 70) features.push("gaming-focused");
    if (profile.preferences?.features?.battery > 70) features.push("battery-focused");
    if (profile.preferences?.features?.performance > 70) features.push("performance-focused");

    return features;
  }

  private extractPreferences(profile: any): string[] {
    const preferences: string[] = [];

    if (profile.preferences?.brand) preferences.push(...profile.preferences.brand);
    if (profile.preferences?.provider) preferences.push(...profile.preferences.provider);
    if (profile.preferences?.segment) preferences.push(...profile.preferences.segment);

    return preferences;
  }

  private extractInterests(profile: any): string[] {
    const interests: string[] = [];

    if (profile.sessionBehavior?.engagementDepth > 60) interests.push("high-engagement");
    if (profile.sessionBehavior?.comparisonInteractions > 2) interests.push("comparison-heavy");
    if (profile.sessionBehavior?.aiInteractions > 3) interests.push("ai-interactive");

    return interests;
  }

  private extractIntents(profile: any): string[] {
    const intents: string[] = [];

    if (profile.preferences?.segment?.includes("gaming")) intents.push("gaming-intent");
    if (profile.preferences?.segment?.includes("budget")) intents.push("budget-intent");
    if (profile.preferences?.segment?.includes("premium")) intents.push("premium-intent");

    return intents;
  }

  private extractAffinities(profile: any): Record<string, number> {
    return profile.affinities || {};
  }

  private extractBehaviors(profile: any): string[] {
    const behaviors: string[] = [];

    if (profile.budgetEvolution?.direction === "upgrading") behaviors.push("upgrading-behavior");
    if (profile.budgetEvolution?.direction === "downgrading") behaviors.push("downgrading-behavior");
    if (profile.recommendationHistory?.clicked?.length > 2) behaviors.push("click-heavy");

    return behaviors;
  }

  private calculateConfidence(profile: any): number {
    const engagement = profile.sessionBehavior?.engagementDepth || 0;
    const historyLength = profile.recommendationHistory?.viewed?.length || 0;

    return Math.min(0.3 + (engagement / 200) + (historyLength * 0.05), 0.95);
  }

  private calculatePersonalizationLevel(profile: any): number {
    const viewedProducts = profile.viewedProducts?.length || 0;
    const clickedRecommendations = profile.clickedRecommendations?.length || 0;
    const providerAffinityCount = profile.providerAffinity?.size || 0;

    return Math.min(50 + viewedProducts * 5 + clickedRecommendations * 10 + providerAffinityCount * 5, 100);
  }

  private generateRecommendedContext(profile: any): string {
    const segments = profile.preferences?.segment || [];
    const budget = profile.preferences?.budget?.current || 50;

    return `User segments: ${segments.join(", ")}. Budget: €${budget}. Engagement: ${profile.sessionBehavior?.engagementDepth || 0}`;
  }

  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));

    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    return dotProduct / (magnitude1 * magnitude2);
  }

  getUserEmbedding(sessionId: string): UserEmbedding | undefined {
    return this.embeddings.get(sessionId);
  }

  getSemanticProfile(sessionId: string): SemanticUserProfile | undefined {
    return this.semanticProfiles.get(sessionId);
  }
}

interface UserEmbedding {
  sessionId: string;
  vector: number[];
  features: string[];
  preferences: string[];
  model: string;
  timestamp: number;
}

interface SemanticUserProfile {
  sessionId: string;
  interests: string[];
  intents: string[];
  affinities: Record<string, number>;
  behaviors: string[];
  confidence: number;
  timestamp: number;
}

interface LLMPersonalizationContext {
  sessionId: string;
  userProfile: any;
  semanticProfile?: SemanticUserProfile;
  userEmbedding?: UserEmbedding;
  personalizationLevel: number;
  recommendedContext: string;
  timestamp: number;
}
