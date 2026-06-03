import { Prediction } from "../types";

export class PredictiveRecommendationEngine {
  private predictions: Map<string, Prediction> = new Map();

  predictUserIntent(userId: string, predictedIntent: string, confidence: number, factors: string[]): Prediction {
    return this.createPrediction("user_intent", userId, confidence, 7 * 24 * 60 * 60 * 1000, factors, {
      predictedIntent,
    });
  }

  predictFutureRecommendation(userId: string, recommendedEntity: string, confidence: number, timeframe: number): Prediction {
    return this.createPrediction("recommendation", userId, confidence, timeframe, [recommendedEntity], {
      recommendedEntity,
    });
  }

  predictUpgradeTiming(userId: string, predictedMonths: number, confidence: number): Prediction {
    return this.createPrediction("upgrade_timing", userId, confidence, predictedMonths * 30 * 24 * 60 * 60 * 1000, ["upgrade_cycle"], {
      predictedMonths,
    });
  }

  predictSeasonalUpgradeTrend(season: string, predictedIncrease: number, confidence: number): Prediction {
    return this.createPrediction("demand_growth", season, confidence, 90 * 24 * 60 * 60 * 1000, ["seasonal", "upgrade"], {
      season,
      predictedIncrease,
    });
  }

  predictGamingDemandGrowth(predictedGrowth: number, confidence: number): Prediction {
    return this.createPrediction("demand_growth", "gaming", confidence, 30 * 24 * 60 * 60 * 1000, ["gaming", "demand"], {
      predictedGrowth,
    });
  }

  predictCameraPhoneDemandSpike(predictedSpike: number, confidence: number): Prediction {
    return this.createPrediction("demand_growth", "camera", confidence, 30 * 24 * 60 * 60 * 1000, ["camera", "demand"], {
      predictedSpike,
    });
  }

  getPrediction(predictionId: string): Prediction | undefined {
    return this.predictions.get(predictionId);
  }

  getPredictionsByType(predictionType: Prediction["predictionType"]): Prediction[] {
    return Array.from(this.predictions.values()).filter((p) => p.predictionType === predictionType);
  }

  getPredictionsByEntity(entityId: string): Prediction[] {
    return Array.from(this.predictions.values()).filter((p) => p.entityId === entityId);
  }

  getActivePredictions(): Prediction[] {
    const now = Date.now();
    return Array.from(this.predictions.values()).filter((p) => p.expiresAt > now);
  }

  private createPrediction(predictionType: Prediction["predictionType"], entityId: string, confidence: number, timeframe: number, factors: string[], metadata: Record<string, unknown>): Prediction {
    const prediction: Prediction = {
      predictionId: `prediction-${predictionType}-${entityId}-${Date.now()}`,
      predictionType,
      entityId,
      predictedValue: this.calculatePredictedValue(predictionType, metadata),
      confidence,
      timeframe,
      factors,
      generatedAt: Date.now(),
      expiresAt: Date.now() + timeframe,
    };

    this.predictions.set(prediction.predictionId, prediction);
    return prediction;
  }

  private calculatePredictedValue(predictionType: Prediction["predictionType"], metadata: Record<string, unknown>): number {
    switch (predictionType) {
      case "user_intent":
        return 1;
      case "recommendation":
        return 1;
      case "upgrade_timing":
        return metadata.predictedMonths as number || 12;
      case "demand_growth":
        return (metadata.predictedGrowth as number) || (metadata.predictedSpike as number) || (metadata.predictedIncrease as number) || 10;
      default:
        return 0;
    }
  }
}
