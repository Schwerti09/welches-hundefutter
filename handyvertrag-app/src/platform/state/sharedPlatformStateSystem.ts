import { PlatformState } from "../types";

export class SharedPlatformStateSystem {
  private states: Map<string, PlatformState> = new Map();

  setEntityMemory(entityId: string, data: Record<string, unknown>): PlatformState {
    return this.createState("entity_memory", entityId, data);
  }

  setRecommendationMemory(entityId: string, data: Record<string, unknown>): PlatformState {
    return this.createState("recommendation_memory", entityId, data);
  }

  setUserIntelligence(userId: string, data: Record<string, unknown>): PlatformState {
    return this.createState("user_intelligence", userId, data);
  }

  setSessionIntelligence(sessionId: string, data: Record<string, unknown>): PlatformState {
    return this.createState("session_intelligence", sessionId, data);
  }

  setMarketIntelligence(data: Record<string, unknown>): PlatformState {
    return this.createState("market_intelligence", "market", data);
  }

  setPricingIntelligence(data: Record<string, unknown>): PlatformState {
    return this.createState("pricing_intelligence", "pricing", data);
  }

  getState(stateId: string): PlatformState | undefined {
    return this.states.get(stateId);
  }

  getStateByType(stateType: PlatformState["stateType"]): PlatformState[] {
    return Array.from(this.states.values()).filter((s) => s.stateType === stateType);
  }

  getStateByEntity(entityId: string): PlatformState[] {
    return Array.from(this.states.values()).filter((s) => s.entityId === entityId);
  }

  getLatestStateByEntity(entityId: string): PlatformState | undefined {
    const states = this.getStateByEntity(entityId);
    if (states.length === 0) return undefined;

    return states.sort((a, b) => b.lastUpdated - a.lastUpdated)[0];
  }

  private createState(stateType: PlatformState["stateType"], entityId: string, data: Record<string, unknown>): PlatformState {
    const existingState = this.getLatestStateByEntity(entityId);
    const version = existingState ? existingState.version + 1 : 1;

    const state: PlatformState = {
      stateId: `state-${stateType}-${entityId}-${Date.now()}`,
      stateType,
      entityId,
      data,
      version,
      lastUpdated: Date.now(),
    };

    this.states.set(state.stateId, state);
    return state;
  }
}
