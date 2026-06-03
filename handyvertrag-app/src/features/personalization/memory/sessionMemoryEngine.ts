import { SessionMemory, UserPreferences, RecommendationHistory } from "../types";

export class SessionMemoryEngine {
  private memories: Map<string, SessionMemory> = new Map();

  createMemory(sessionId: string): SessionMemory {
    const memory: SessionMemory = {
      sessionId,
      rememberedPreferences: this.getDefaultPreferences(),
      recommendationHistory: this.getDefaultHistory(),
      viewedComparisons: [],
      advisorConversations: [],
      savedRecommendations: [],
      abandonedSessions: [],
      lastActivity: Date.now(),
    };

    this.memories.set(sessionId, memory);
    return memory;
  }

  rememberPreference(sessionId: string, preferences: UserPreferences): void {
    const memory = this.memories.get(sessionId);
    if (memory) {
      memory.rememberedPreferences = preferences;
      memory.lastActivity = Date.now();
    }
  }

  addRecommendationToHistory(sessionId: string, recommendationId: string, action: "viewed" | "clicked" | "saved"): void {
    const memory = this.memories.get(sessionId);
    if (memory) {
      if (action === "viewed" && !memory.recommendationHistory.viewed.includes(recommendationId)) {
        memory.recommendationHistory.viewed.push(recommendationId);
      }
      if (action === "clicked" && !memory.recommendationHistory.clicked.includes(recommendationId)) {
        memory.recommendationHistory.clicked.push(recommendationId);
      }
      if (action === "saved" && !memory.recommendationHistory.saved.includes(recommendationId)) {
        memory.recommendationHistory.saved.push(recommendationId);
      }
      memory.recommendationHistory.timestamps.set(recommendationId, Date.now());
      memory.lastActivity = Date.now();
    }
  }

  addViewedComparison(sessionId: string, comparisonId: string): void {
    const memory = this.memories.get(sessionId);
    if (memory) {
      if (!memory.viewedComparisons.includes(comparisonId)) {
        memory.viewedComparisons.push(comparisonId);
      }
      memory.lastActivity = Date.now();
    }
  }

  addAdvisorConversation(sessionId: string, conversationId: string): void {
    const memory = this.memories.get(sessionId);
    if (memory) {
      if (!memory.advisorConversations.includes(conversationId)) {
        memory.advisorConversations.push(conversationId);
      }
      memory.lastActivity = Date.now();
    }
  }

  saveRecommendation(sessionId: string, recommendationId: string): void {
    const memory = this.memories.get(sessionId);
    if (memory) {
      if (!memory.savedRecommendations.includes(recommendationId)) {
        memory.savedRecommendations.push(recommendationId);
      }
      memory.lastActivity = Date.now();
    }
  }

  markSessionAsAbandoned(sessionId: string): void {
    const memory = this.memories.get(sessionId);
    if (memory) {
      memory.abandonedSessions.push(sessionId);
      memory.lastActivity = Date.now();
    }
  }

  getMemory(sessionId: string): SessionMemory | undefined {
    return this.memories.get(sessionId);
  }

  getRememberedPreferences(sessionId: string): UserPreferences | undefined {
    const memory = this.memories.get(sessionId);
    return memory?.rememberedPreferences;
  }

  getRecommendationHistory(sessionId: string): RecommendationHistory | undefined {
    const memory = this.memories.get(sessionId);
    return memory?.recommendationHistory;
  }

  cleanupOldMemories(maxAge: number = 7 * 24 * 60 * 60 * 1000): void {
    const now = Date.now();
    for (const [sessionId, memory] of this.memories) {
      if (now - memory.lastActivity > maxAge) {
        this.memories.delete(sessionId);
      }
    }
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      budget: {
        min: 0,
        max: 100,
        current: 50,
        flexible: true,
      },
      brand: [],
      provider: [],
      features: {
        camera: 50,
        gaming: 50,
        battery: 50,
        performance: 50,
        storage: 50,
      },
      segment: [],
    };
  }

  private getDefaultHistory(): RecommendationHistory {
    return {
      viewed: [],
      clicked: [],
      ignored: [],
      saved: [],
      timestamps: new Map(),
    };
  }
}
