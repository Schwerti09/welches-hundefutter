import { OptimizationLoop } from "../types";

export class RealTimeRankingOptimization {
  private loops: Map<string, OptimizationLoop> = new Map();

  createRankingOptimizationLoop(entityId: string, initialScore: number, targetScore: number): OptimizationLoop {
    return this.createOptimizationLoop("ranking", entityId, initialScore, targetScore);
  }

  createRecommendationOptimizationLoop(entityId: string, initialScore: number, targetScore: number): OptimizationLoop {
    return this.createOptimizationLoop("recommendation", entityId, initialScore, targetScore);
  }

  createPricingOptimizationLoop(entityId: string, initialScore: number, targetScore: number): OptimizationLoop {
    return this.createOptimizationLoop("pricing", entityId, initialScore, targetScore);
  }

  createSEOOptimizationLoop(entityId: string, initialScore: number, targetScore: number): OptimizationLoop {
    return this.createOptimizationLoop("seo", entityId, initialScore, targetScore);
  }

  optimizeRanking(entityId: string, marketSignals: number[], conversionSignals: number[], pricingChanges: number[], userBehavior: number[]): OptimizationLoop {
    const loop = this.loops.get(entityId);
    if (!loop) {
      return this.createRankingOptimizationLoop(entityId, 50, 75);
    }

    const newScore = this.calculateOptimizedScore(marketSignals, conversionSignals, pricingChanges, userBehavior);
    loop.currentScore = newScore;
    loop.iterations++;
    loop.lastOptimizationAt = Date.now();
    loop.nextOptimizationAt = Date.now() + 60 * 60 * 1000;

    if (loop.currentScore >= loop.targetScore) {
      loop.converged = true;
    }

    return loop;
  }

  getOptimizationLoop(loopId: string): OptimizationLoop | undefined {
    return this.loops.get(loopId);
  }

  getOptimizationLoopsByType(loopType: OptimizationLoop["loopType"]): OptimizationLoop[] {
    return Array.from(this.loops.values()).filter((l) => l.loopType === loopType);
  }

  getConvergedLoops(): OptimizationLoop[] {
    return Array.from(this.loops.values()).filter((l) => l.converged);
  }

  getPendingOptimizations(): OptimizationLoop[] {
    const now = Date.now();
    return Array.from(this.loops.values()).filter((l) => !l.converged && l.nextOptimizationAt <= now);
  }

  private createOptimizationLoop(loopType: OptimizationLoop["loopType"], entityId: string, initialScore: number, targetScore: number): OptimizationLoop {
    const loop: OptimizationLoop = {
      loopId: `loop-${loopType}-${entityId}-${Date.now()}`,
      loopType,
      entityId,
      currentScore: initialScore,
      targetScore,
      iterations: 0,
      converged: false,
      lastOptimizationAt: Date.now(),
      nextOptimizationAt: Date.now() + 60 * 60 * 1000,
    };

    this.loops.set(loop.loopId, loop);
    return loop;
  }

  private calculateOptimizedScore(marketSignals: number[], conversionSignals: number[], pricingChanges: number[], userBehavior: number[]): number {
    const marketScore = marketSignals.length > 0 ? marketSignals.reduce((a, b) => a + b, 0) / marketSignals.length : 50;
    const conversionScore = conversionSignals.length > 0 ? conversionSignals.reduce((a, b) => a + b, 0) / conversionSignals.length : 50;
    const pricingScore = pricingChanges.length > 0 ? pricingChanges.reduce((a, b) => a + b, 0) / pricingChanges.length : 50;
    const behaviorScore = userBehavior.length > 0 ? userBehavior.reduce((a, b) => a + b, 0) / userBehavior.length : 50;

    return Math.round((marketScore * 0.25 + conversionScore * 0.35 + pricingScore * 0.2 + behaviorScore * 0.2));
  }
}
