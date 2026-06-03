import { AdvisorUserProfile, RecommendationScore, BudgetRange } from "../types";
import { products } from "@/data/products";

export class ScoringEngine {
  private readonly WEIGHTS = {
    budget: 0.25,
    features: 0.20,
    provider: 0.15,
    data: 0.15,
    camera: 0.10,
    battery: 0.05,
    gaming: 0.05,
    value: 0.05,
  };

  scoreProduct(product: any, offer: any, profile: AdvisorUserProfile): RecommendationScore {
    const budgetScore = this.scoreBudget(offer.monthlyPrice, profile.budgetRange);
    const featureScore = this.scoreFeatures(product, profile);
    const providerScore = this.scoreProvider(offer.provider, profile.providerPreference);
    const dataScore = this.scoreData(offer.dataVolume, profile.dataUsage);
    const cameraScore = this.scoreCamera(product, profile.cameraImportance);
    const batteryScore = this.scoreBattery(product, profile.batteryImportance);
    const gamingScore = this.scoreGaming(product, profile.gamingInterest);
    const valueScore = this.scoreValue(offer.monthlyPrice, offer.dataVolume);

    const totalScore =
      budgetScore * this.WEIGHTS.budget +
      featureScore * this.WEIGHTS.features +
      providerScore * this.WEIGHTS.provider +
      dataScore * this.WEIGHTS.data +
      cameraScore * this.WEIGHTS.camera +
      batteryScore * this.WEIGHTS.battery +
      gamingScore * this.WEIGHTS.gaming +
      valueScore * this.WEIGHTS.value;

    const confidence = this.calculateConfidence(profile);

    return {
      productId: product.id,
      offerId: offer.id,
      totalScore: Math.round(totalScore * 100) / 100,
      budgetScore,
      featureScore,
      providerScore,
      dataScore,
      cameraScore,
      batteryScore,
      gamingScore,
      valueScore,
      confidence,
    };
  }

  scoreAllProducts(profile: AdvisorUserProfile): RecommendationScore[] {
    const scores: RecommendationScore[] = [];

    for (const product of products) {
      for (const offer of product.offers) {
        const score = this.scoreProduct(product, offer, profile);
        scores.push(score);
      }
    }

    return scores.sort((a, b) => b.totalScore - a.totalScore);
  }

  private scoreBudget(price: number, budgetRange?: BudgetRange): number {
    if (!budgetRange) return 0.5;

    if (price <= budgetRange.max && price >= budgetRange.min) {
      return 1.0;
    }

    if (price < budgetRange.min) {
      return 0.8;
    }

    if (price > budgetRange.max) {
      const overshoot = (price - budgetRange.max) / budgetRange.max;
      return Math.max(0, 1 - overshoot);
    }

    return 0.5;
  }

  private scoreFeatures(product: any, profile: AdvisorUserProfile): number {
    let score = 0.5;

    if (profile.brandPreference && profile.brandPreference !== "any" && profile.brandPreference !== "none") {
      const brandMatch = product.brand.toLowerCase() === profile.brandPreference;
      score += brandMatch ? 0.3 : -0.2;
    }

    return Math.max(0, Math.min(1, score));
  }

  private scoreProvider(provider: string, preference?: string): number {
    if (!preference || preference === "any" || preference === "none") {
      return 0.7;
    }

    const providerMatch = provider.toLowerCase() === preference.toLowerCase();
    return providerMatch ? 1.0 : 0.3;
  }

  private scoreData(dataVolume: string, preference?: string): number {
    if (!preference) return 0.5;

    const volumeNum = this.parseDataVolume(dataVolume);
    
    if (preference === "unlimited") {
      return volumeNum >= 50 ? 1.0 : 0.5;
    }

    if (preference === "high") {
      return volumeNum >= 30 ? 1.0 : volumeNum >= 20 ? 0.7 : 0.3;
    }

    if (preference === "medium") {
      return volumeNum >= 20 ? 1.0 : volumeNum >= 10 ? 0.7 : 0.5;
    }

    if (preference === "low") {
      return volumeNum <= 10 ? 1.0 : volumeNum <= 20 ? 0.7 : 0.3;
    }

    return 0.5;
  }

  private parseDataVolume(volume: string): number {
    const match = volume.match(/(\d+)\s*GB/);
    if (match) return parseInt(match[1], 10);
    return 0;
  }

  private scoreCamera(product: any, importance?: string): number {
    if (!importance || importance === "low") return 0.5;
    
    const productBrand = product.brand.toLowerCase();
    if (productBrand === "apple" || productBrand === "samsung") {
      return importance === "high" ? 1.0 : 0.8;
    }
    
    return 0.5;
  }

  private scoreBattery(product: any, importance?: string): number {
    if (!importance || importance === "low") return 0.5;
    
    const productBrand = product.brand.toLowerCase();
    if (productBrand === "samsung" || productBrand === "xiaomi") {
      return importance === "high" ? 1.0 : 0.8;
    }
    
    return 0.5;
  }

  private scoreGaming(product: any, interest?: boolean): number {
    if (!interest) return 0.5;
    
    const productBrand = product.brand.toLowerCase();
    if (productBrand === "samsung" || productBrand === "google") {
      return 1.0;
    }
    
    return 0.7;
  }

  private scoreValue(price: number, dataVolume: string): number {
    const volumeNum = this.parseDataVolume(dataVolume);
    if (volumeNum === 0) return 0.5;
    
    const value = volumeNum / price;
    
    if (value > 1.0) return 1.0;
    if (value > 0.5) return 0.8;
    if (value > 0.3) return 0.6;
    return 0.4;
  }

  private calculateConfidence(profile: AdvisorUserProfile): number {
    const fields = [
      profile.budgetRange,
      profile.dataUsage,
      profile.brandPreference,
      profile.providerPreference,
    ];
    
    const filled = fields.filter((f) => f !== undefined).length;
    return (filled / fields.length) * 100;
  }
}
