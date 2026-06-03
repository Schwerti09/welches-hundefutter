import { ValueScoreExplanation } from "../types";

export class ValueScoringEngine {
  calculateBundleValue(
    devicePrice: number,
    contractPrice: number,
    dataVolume: number,
    deviceScores: any,
    contractScores: any
  ): ValueScoreExplanation {
    const weights = {
      hardwareQuality: 0.30,
      contractQuality: 0.25,
      dataValue: 0.20,
      providerQuality: 0.15,
      longTermValue: 0.10,
    };

    // Hardware Quality Score (based on device scores)
    const hardwareQuality = (deviceScores.cameraScore + deviceScores.performanceScore + deviceScores.longevityScore) / 3;

    // Contract Quality Score (based on contract scores)
    const contractQuality = (contractScores.valueScore + contractScores.roamingFriendliness + contractScores.fiveGQuality) / 3;

    // Data Value Score (GB per €)
    const dataValue = Math.min(100, (dataVolume / contractPrice) * 50);

    // Provider Quality Score
    const providerQuality = contractScores.providerReliability;

    // Long-term Value Score (lower monthly cost = better)
    const totalMonthlyCost = devicePrice + contractPrice;
    const longTermValue = Math.max(0, 100 - totalMonthlyCost);

    // Weighted total score
    const totalScore =
      hardwareQuality * weights.hardwareQuality +
      contractQuality * weights.contractQuality +
      dataValue * weights.dataValue +
      providerQuality * weights.providerQuality +
      longTermValue * weights.longTermValue;

    const explanation = this.generateExplanation({
      hardwareQuality,
      contractQuality,
      dataValue,
      providerQuality,
      longTermValue,
    });

    return {
      totalScore,
      breakdown: {
        hardwareQuality,
        contractQuality,
        dataValue,
        providerQuality,
        longTermValue,
      },
      weights,
      explanation,
    };
  }

  private generateExplanation(scores: Record<string, number>): string[] {
    const explanation: string[] = [];

    if (scores.hardwareQuality > 80) {
      explanation.push("High-quality hardware with excellent performance");
    } else if (scores.hardwareQuality > 60) {
      explanation.push("Good hardware quality");
    } else {
      explanation.push("Basic hardware quality");
    }

    if (scores.contractQuality > 80) {
      explanation.push("Excellent contract with great benefits");
    } else if (scores.contractQuality > 60) {
      explanation.push("Good contract quality");
    } else {
      explanation.push("Basic contract quality");
    }

    if (scores.dataValue > 80) {
      explanation.push("Outstanding data value");
    } else if (scores.dataValue > 60) {
      explanation.push("Good data value");
    } else {
      explanation.push("Limited data value");
    }

    if (scores.providerQuality > 80) {
      explanation.push("Reliable provider network");
    } else if (scores.providerQuality > 60) {
      explanation.push("Decent provider network");
    } else {
      explanation.push("Basic provider network");
    }

    if (scores.longTermValue > 80) {
      explanation.push("Excellent long-term value");
    } else if (scores.longTermValue > 60) {
      explanation.push("Good long-term value");
    } else {
      explanation.push("Higher long-term cost");
    }

    return explanation;
  }

  calculateRefurbishedSavings(originalPrice: number, refurbishedPrice: number): number {
    const savings = originalPrice - refurbishedPrice;
    const savingsPercentage = (savings / originalPrice) * 100;
    return Math.round(savingsPercentage);
  }

  calculateUpgradeValue(currentDevice: any, upgradeDevice: any): number {
    const currentScores = currentDevice.scores;
    const upgradeScores = upgradeDevice.scores;

    const improvement = {
      camera: upgradeScores.cameraScore - currentScores.cameraScore,
      performance: upgradeScores.performanceScore - currentScores.performanceScore,
      battery: upgradeScores.batteryScore - currentScores.batteryScore,
    };

    const totalImprovement = (improvement.camera + improvement.performance + improvement.battery) / 3;
    return Math.max(0, Math.min(100, totalImprovement));
  }
}
