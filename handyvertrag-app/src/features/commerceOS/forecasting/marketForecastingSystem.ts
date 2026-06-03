import { ForecastingData } from "../types";

export class MarketForecastingSystem {
  private forecasts: Map<string, ForecastingData> = new Map();

  forecastPriceMovement(entityId: string, predictions: Array<{ timestamp: number; predictedValue: number; confidence: number }>, model: string): ForecastingData {
    return this.createForecast("price", entityId, predictions, model);
  }

  forecastProviderCompetitiveness(providerId: string, predictions: Array<{ timestamp: number; predictedValue: number; confidence: number }>, model: string): ForecastingData {
    return this.createForecast("competitiveness", providerId, predictions, model);
  }

  forecastRecommendationTrends(entityId: string, predictions: Array<{ timestamp: number; predictedValue: number; confidence: number }>, model: string): ForecastingData {
    return this.createForecast("recommendation", entityId, predictions, model);
  }

  forecastContractPopularity(contractId: string, predictions: Array<{ timestamp: number; predictedValue: number; confidence: number }>, model: string): ForecastingData {
    return this.createForecast("contract_popularity", contractId, predictions, model);
  }

  forecastDeviceMomentum(deviceId: string, predictions: Array<{ timestamp: number; predictedValue: number; confidence: number }>, model: string): ForecastingData {
    return this.createForecast("device_momentum", deviceId, predictions, model);
  }

  forecastSeasonalTrends(season: string, predictions: Array<{ timestamp: number; predictedValue: number; confidence: number }>, model: string): ForecastingData {
    return this.createForecast("seasonal", season, predictions, model);
  }

  getForecast(forecastId: string): ForecastingData | undefined {
    return this.forecasts.get(forecastId);
  }

  getForecastsByType(forecastType: ForecastingData["forecastType"]): ForecastingData[] {
    return Array.from(this.forecasts.values()).filter((f) => f.forecastType === forecastType);
  }

  getForecastsByEntity(entityId: string): ForecastingData[] {
    return Array.from(this.forecasts.values()).filter((f) => f.entityId === entityId);
  }

  getActiveForecasts(): ForecastingData[] {
    const now = Date.now();
    return Array.from(this.forecasts.values()).filter((f) => f.predictions.some((p) => p.timestamp > now));
  }

  private createForecast(forecastType: ForecastingData["forecastType"], entityId: string, predictions: Array<{ timestamp: number; predictedValue: number; confidence: number }>, model: string): ForecastingData {
    const forecast: ForecastingData = {
      forecastId: `forecast-${forecastType}-${entityId}-${Date.now()}`,
      forecastType,
      entityId,
      predictions,
      model,
      accuracy: this.calculateAccuracy(predictions),
      generatedAt: Date.now(),
    };

    this.forecasts.set(forecast.forecastId, forecast);
    return forecast;
  }

  private calculateAccuracy(predictions: Array<{ timestamp: number; predictedValue: number; confidence: number }>): number {
    if (predictions.length === 0) return 50;

    const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;
    return Math.round(avgConfidence);
  }
}
