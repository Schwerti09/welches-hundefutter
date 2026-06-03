import { ResilienceStatusEntry, ResilienceStatus } from "../types";

export class ResilienceFailureSystem {
  private resilienceStates: Map<string, ResilienceStatusEntry> = new Map();
  private fallbackStrategies: Map<string, () => unknown> = new Map();
  private retryStrategies: Map<string, (retryCount: number) => boolean> = new Map();

  registerComponent(component: string): ResilienceStatusEntry {
    const state: ResilienceStatusEntry = {
      stateId: `resilience-${component}-${Date.now()}`,
      component,
      state: "healthy",
      failureCount: 0,
      recoveryCount: 0,
      health: 100,
    };

    this.resilienceStates.set(component, state);
    return state;
  }

  recordFailure(component: string): void {
    const state = this.resilienceStates.get(component);
    if (!state) return;

    state.state = "failed";
    state.lastFailureAt = Date.now();
    state.failureCount++;
    state.health = Math.max(0, state.health - 20);

    this.executeFallback(component);
  }

  recordRecovery(component: string): void {
    const state = this.resilienceStates.get(component);
    if (!state) return;

    state.state = "healthy";
    state.lastRecoveryAt = Date.now();
    state.recoveryCount++;
    state.health = Math.min(100, state.health + 10);
  }

  recordDegraded(component: string): void {
    const state = this.resilienceStates.get(component);
    if (!state) return;

    state.state = "degraded";
    state.health = Math.max(0, state.health - 10);
  }

  registerFallbackStrategy(component: string, strategy: () => unknown): void {
    this.fallbackStrategies.set(component, strategy);
  }

  registerRetryStrategy(component: string, strategy: (retryCount: number) => boolean): void {
    this.retryStrategies.set(component, strategy);
  }

  executeFallback(component: string): unknown {
    const strategy = this.fallbackStrategies.get(component);
    if (!strategy) return null;

    return strategy();
  }

  shouldRetry(component: string, retryCount: number): boolean {
    const strategy = this.retryStrategies.get(component);
    if (!strategy) return false;

    return strategy(retryCount);
  }

  getResilienceState(component: string): ResilienceStatusEntry | undefined {
    return this.resilienceStates.get(component);
  }

  getHealthyComponents(): string[] {
    return Array.from(this.resilienceStates.values())
      .filter((s) => s.state === "healthy")
      .map((s) => s.component);
  }

  getDegradedComponents(): string[] {
    return Array.from(this.resilienceStates.values())
      .filter((s) => s.state === "degraded")
      .map((s) => s.component);
  }

  getFailedComponents(): string[] {
    return Array.from(this.resilienceStates.values())
      .filter((s) => s.state === "failed")
      .map((s) => s.component);
  }

  getRecoveringComponents(): string[] {
    return Array.from(this.resilienceStates.values())
      .filter((s) => s.state === "recovering")
      .map((s) => s.component);
  }

  getOverallHealth(): number {
    const states = Array.from(this.resilienceStates.values());
    if (states.length === 0) return 100;

    const totalHealth = states.reduce((sum, s) => sum + s.health, 0);
    return Math.round(totalHealth / states.length);
  }

  isDegradedMode(): boolean {
    const degraded = this.getDegradedComponents().length;
    const failed = this.getFailedComponents().length;
    const total = this.resilienceStates.size;

    if (total === 0) return false;

    return (degraded + failed) / total > 0.3;
  }
}
