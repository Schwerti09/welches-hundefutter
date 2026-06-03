import { CommerceMemory } from "../types";

export class AICommerceMemorySystem {
  private memory: Map<string, CommerceMemory> = new Map();

  storeHistoricalTrend(entityId: string, trendData: Record<string, unknown>, retentionUntil: number): CommerceMemory {
    return this.createMemory("historical_trend", entityId, trendData, retentionUntil);
  }

  storeRecommendationEvolution(entityId: string, evolutionData: Record<string, unknown>, retentionUntil: number): CommerceMemory {
    return this.createMemory("recommendation_evolution", entityId, evolutionData, retentionUntil);
  }

  storeProviderEvolution(entityId: string, evolutionData: Record<string, unknown>, retentionUntil: number): CommerceMemory {
    return this.createMemory("provider_evolution", entityId, evolutionData, retentionUntil);
  }

  storeMarketCycle(cycleId: string, cycleData: Record<string, unknown>, retentionUntil: number): CommerceMemory {
    return this.createMemory("market_cycle", cycleId, cycleData, retentionUntil);
  }

  storeSeasonalShift(season: string, shiftData: Record<string, unknown>, retentionUntil: number): CommerceMemory {
    return this.createMemory("seasonal_shift", season, shiftData, retentionUntil);
  }

  storeBehavioralEvolution(entityId: string, evolutionData: Record<string, unknown>, retentionUntil: number): CommerceMemory {
    return this.createMemory("behavioral_evolution", entityId, evolutionData, retentionUntil);
  }

  getMemory(memoryId: string): CommerceMemory | undefined {
    return this.memory.get(memoryId);
  }

  getMemoryByType(memoryType: CommerceMemory["memoryType"]): CommerceMemory[] {
    return Array.from(this.memory.values()).filter((m) => m.memoryType === memoryType);
  }

  getMemoryByEntity(entityId: string): CommerceMemory[] {
    return Array.from(this.memory.values()).filter((m) => m.entityId === entityId);
  }

  getActiveMemory(): CommerceMemory[] {
    const now = Date.now();
    return Array.from(this.memory.values()).filter((m) => m.retentionUntil > now);
  }

  cleanupExpiredMemory(): void {
    const now = Date.now();

    for (const [memoryId, memory] of this.memory) {
      if (memory.retentionUntil <= now) {
        this.memory.delete(memoryId);
      }
    }
  }

  private createMemory(memoryType: CommerceMemory["memoryType"], entityId: string, data: Record<string, unknown>, retentionUntil: number): CommerceMemory {
    const memory: CommerceMemory = {
      memoryId: `memory-${memoryType}-${entityId}-${Date.now()}`,
      memoryType,
      entityId,
      data,
      timestamp: Date.now(),
      retentionUntil,
    };

    this.memory.set(memory.memoryId, memory);
    return memory;
  }
}
