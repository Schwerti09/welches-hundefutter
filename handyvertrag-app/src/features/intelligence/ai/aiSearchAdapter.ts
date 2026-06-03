import { SemanticSearchQuery, SemanticSearchResult, EmbeddingVector } from "../types";

export interface AIEmbeddingProvider {
  generateEmbedding(text: string): Promise<number[]>;
  generateBatchEmbeddings(texts: string[]): Promise<number[][]>;
}

export interface AISemanticSearchProvider {
  search(query: string, limit?: number): Promise<SemanticSearchResult[]>;
  searchWithFilters(query: SemanticSearchQuery): Promise<SemanticSearchResult[]>;
}

export class AISearchAdapter {
  private embeddingProvider?: AIEmbeddingProvider;
  private searchProvider?: AISemanticSearchProvider;
  private embeddings: Map<string, EmbeddingVector> = new Map();

  setEmbeddingProvider(provider: AIEmbeddingProvider): void {
    this.embeddingProvider = provider;
  }

  setSearchProvider(provider: AISemanticSearchProvider): void {
    this.searchProvider = provider;
  }

  async generateEntityEmbedding(entityId: string, text: string): Promise<void> {
    if (!this.embeddingProvider) {
      throw new Error("No embedding provider configured");
    }

    const vector = await this.embeddingProvider.generateEmbedding(text);
    this.embeddings.set(entityId, {
      entityId,
      vector,
      model: "default",
      timestamp: Date.now(),
    });
  }

  async generateBatchEntityEmbeddings(entities: Array<{ id: string; text: string }>): Promise<void> {
    if (!this.embeddingProvider) {
      throw new Error("No embedding provider configured");
    }

    const texts = entities.map((e) => e.text);
    const vectors = await this.embeddingProvider.generateBatchEmbeddings(texts);

    entities.forEach((entity, index) => {
      this.embeddings.set(entity.id, {
        entityId: entity.id,
        vector: vectors[index],
        model: "default",
        timestamp: Date.now(),
      });
    });
  }

  calculateSimilarity(entityId1: string, entityId2: string): number {
    const embedding1 = this.embeddings.get(entityId1);
    const embedding2 = this.embeddings.get(entityId2);

    if (!embedding1 || !embedding2) {
      return 0;
    }

    return this.cosineSimilarity(embedding1.vector, embedding2.vector);
  }

  async semanticSearch(query: string, limit: number = 10): Promise<SemanticSearchResult[]> {
    if (this.searchProvider) {
      return this.searchProvider.search(query, limit);
    }

    // Fallback: simple embedding-based search
    const queryEmbedding = await this.embeddingProvider?.generateEmbedding(query);
    if (!queryEmbedding) {
      return [];
    }

    const results: SemanticSearchResult[] = [];

    for (const [entityId, embedding] of this.embeddings) {
      const similarity = this.cosineSimilarity(queryEmbedding, embedding.vector);
      if (similarity > 0.5) {
        results.push({
          entityId,
          score: similarity,
          relevance: similarity,
          matchedFeatures: [],
        });
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));

    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    return dotProduct / (magnitude1 * magnitude2);
  }

  getEmbedding(entityId: string): EmbeddingVector | undefined {
    return this.embeddings.get(entityId);
  }

  hasEmbeddingProvider(): boolean {
    return this.embeddingProvider !== undefined;
  }

  hasSearchProvider(): boolean {
    return this.searchProvider !== undefined;
  }
}

export class OpenAIEmbeddingAdapter implements AIEmbeddingProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    console.log("[OpenAI] Generating embedding for:", text);
    return new Array(1536).fill(0); // Placeholder
  }

  async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
    console.log("[OpenAI] Generating batch embeddings for:", texts.length, "texts");
    return texts.map(() => new Array(1536).fill(0));
  }
}
