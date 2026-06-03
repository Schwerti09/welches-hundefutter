import { DeviceIntelligence, DeviceScores, DeviceClassification, SuitabilitySegment } from "../../intelligence/types";

export class DeviceIntelligenceEngine {
  generateIntelligence(product: any): DeviceIntelligence {
    const scores = this.calculateScores(product);
    const classification = this.classifyDevice(scores, product);
    const bestForLabels = this.generateBestForLabels(scores, product);
    const semanticTags = this.generateSemanticTags(scores, product);
    const aiRecommendationTags = this.generateAIRecommendationTags(scores, product);

    return {
      deviceId: product.id,
      scores,
      classification,
      bestForLabels,
      semanticTags,
      aiRecommendationTags,
      releaseYear: new Date().getFullYear(),
      flagshipStatus: classification === "premium",
    };
  }

  private calculateScores(product: any): DeviceScores {
    const brand = product.brand.toLowerCase();
    
    // Camera Score
    let cameraScore = 50;
    if (brand === "apple") cameraScore = 95;
    if (brand === "samsung") cameraScore = 90;
    if (brand === "google") cameraScore = 85;

    // Battery Score
    let batteryScore = 50;
    if (brand === "samsung") batteryScore = 90;
    if (brand === "xiaomi") batteryScore = 85;
    if (brand === "apple") batteryScore = 75;

    // Gaming Score
    let gamingScore = 50;
    if (brand === "samsung") gamingScore = 95;
    if (brand === "google") gamingScore = 90;
    if (brand === "apple") gamingScore = 70;

    // Performance Score
    let performanceScore = 50;
    if (brand === "apple") performanceScore = 95;
    if (brand === "samsung") performanceScore = 90;
    if (brand === "google") performanceScore = 85;

    // Value Score (based on average offer price)
    const avgPrice = this.getAveragePrice(product);
    let valueScore = 50;
    if (avgPrice < 40) valueScore = 90;
    if (avgPrice < 50) valueScore = 80;
    if (avgPrice < 60) valueScore = 70;

    // Longevity Score
    let longevityScore = 50;
    if (brand === "apple") longevityScore = 95;
    if (brand === "samsung") longevityScore = 85;
    if (brand === "google") longevityScore = 80;

    return {
      cameraScore,
      batteryScore,
      gamingScore,
      performanceScore,
      valueScore,
      longevityScore,
    };
  }

  private classifyDevice(scores: DeviceScores, product: any): DeviceClassification {
    const avgScore = (scores.cameraScore + scores.performanceScore + scores.gamingScore) / 3;
    const avgPrice = this.getAveragePrice(product);

    if (avgScore > 85 && avgPrice > 45) return "premium";
    if (avgScore > 70 && avgPrice > 35) return "midrange";
    return "budget";
  }

  private generateBestForLabels(scores: DeviceScores, product: any): SuitabilitySegment[] {
    const labels: SuitabilitySegment[] = [];

    if (scores.gamingScore > 85) labels.push("gaming");
    if (scores.cameraScore > 85) labels.push("photographers");
    if (scores.valueScore > 80) labels.push("budget");
    if (scores.performanceScore > 85) labels.push("creators");
    if (scores.batteryScore > 85) labels.push("travelers");

    return labels;
  }

  private generateSemanticTags(scores: DeviceScores, product: any): string[] {
    const tags: string[] = [];

    if (scores.cameraScore > 90) tags.push("camera-champion");
    if (scores.batteryScore > 85) tags.push("battery-excellent");
    if (scores.gamingScore > 90) tags.push("gaming-ready");
    if (scores.valueScore > 85) tags.push("best-value");
    if (scores.performanceScore > 90) tags.push("performance-king");
    if (scores.longevityScore > 90) tags.push("long-lasting");

    return tags;
  }

  private generateAIRecommendationTags(scores: DeviceScores, product: any): string[] {
    const tags: string[] = [];

    if (scores.cameraScore > 85) tags.push("excellent-camera");
    if (scores.gamingScore > 85) tags.push("strong-gaming");
    if (scores.valueScore > 80) tags.push("great-value");
    if (scores.performanceScore > 85) tags.push("high-performance");
    if (scores.batteryScore > 80) tags.push("good-battery");

    return tags;
  }

  private getAveragePrice(product: any): number {
    if (!product.offers || product.offers.length === 0) return 50;
    const total = product.offers.reduce((sum: number, offer: any) => sum + offer.monthlyPrice, 0);
    return total / product.offers.length;
  }
}
