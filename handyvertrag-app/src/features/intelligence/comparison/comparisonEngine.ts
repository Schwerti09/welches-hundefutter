import { ComparisonResult } from "../types";

export class ComparisonEngine {
  compareDevices(device1: any, device2: any, intelligence1: any, intelligence2: any): ComparisonResult {
    const scores1 = intelligence1.scores;
    const scores2 = intelligence2.scores;

    const strengths1: string[] = [];
    const strengths2: string[] = [];
    const weaknesses1: string[] = [];
    const weaknesses2: string[] = [];

    // Camera comparison
    if (scores1.cameraScore > scores2.cameraScore + 10) {
      strengths1.push("Better camera");
      weaknesses2.push("Weaker camera");
    } else if (scores2.cameraScore > scores1.cameraScore + 10) {
      strengths2.push("Better camera");
      weaknesses1.push("Weaker camera");
    }

    // Battery comparison
    if (scores1.batteryScore > scores2.batteryScore + 10) {
      strengths1.push("Better battery life");
      weaknesses2.push("Shorter battery life");
    } else if (scores2.batteryScore > scores1.batteryScore + 10) {
      strengths2.push("Better battery life");
      weaknesses1.push("Shorter battery life");
    }

    // Gaming comparison
    if (scores1.gamingScore > scores2.gamingScore + 10) {
      strengths1.push("Better for gaming");
      weaknesses2.push("Less suitable for gaming");
    } else if (scores2.gamingScore > scores1.gamingScore + 10) {
      strengths2.push("Better for gaming");
      weaknesses1.push("Less suitable for gaming");
    }

    // Performance comparison
    if (scores1.performanceScore > scores2.performanceScore + 10) {
      strengths1.push("Higher performance");
      weaknesses2.push("Lower performance");
    } else if (scores2.performanceScore > scores1.performanceScore + 10) {
      strengths2.push("Higher performance");
      weaknesses1.push("Lower performance");
    }

    // Value comparison
    if (scores1.valueScore > scores2.valueScore + 10) {
      strengths1.push("Better value");
      weaknesses2.push("Lower value");
    } else if (scores2.valueScore > scores1.valueScore + 10) {
      strengths2.push("Better value");
      weaknesses1.push("Lower value");
    }

    const overallScore1 = this.calculateOverallScore(scores1);
    const overallScore2 = this.calculateOverallScore(scores2);

    return {
      entityId1: device1.id,
      entityId2: device2.id,
      strengths1,
      strengths2,
      weaknesses1,
      weaknesses2,
      recommendationWinner: overallScore1 > overallScore2 ? device1.id : device2.id,
      valueWinner: scores1.valueScore > scores2.valueScore ? device1.id : device2.id,
      gamingWinner: scores1.gamingScore > scores2.gamingScore ? device1.id : device2.id,
      cameraWinner: scores1.cameraScore > scores2.cameraScore ? device1.id : device2.id,
      overallScore1,
      overallScore2,
    };
  }

  compareContracts(contract1: any, contract2: any, intelligence1: any, intelligence2: any): ComparisonResult {
    const scores1 = intelligence1.scores;
    const scores2 = intelligence2.scores;

    const strengths1: string[] = [];
    const strengths2: string[] = [];
    const weaknesses1: string[] = [];
    const weaknesses2: string[] = [];

    // Value comparison
    if (scores1.valueScore > scores2.valueScore + 10) {
      strengths1.push("Better value");
      weaknesses2.push("Lower value");
    } else if (scores2.valueScore > scores1.valueScore + 10) {
      strengths2.push("Better value");
      weaknesses1.push("Lower value");
    }

    // Data value comparison
    if (scores1.dataValueRatio > scores2.dataValueRatio + 0.3) {
      strengths1.push("Better data value");
      weaknesses2.push("Lower data value");
    } else if (scores2.dataValueRatio > scores1.dataValueRatio + 0.3) {
      strengths2.push("Better data value");
      weaknesses1.push("Lower data value");
    }

    // Roaming comparison
    if (scores1.roamingFriendliness > scores2.roamingFriendliness + 10) {
      strengths1.push("Better roaming");
      weaknesses2.push("Poorer roaming");
    } else if (scores2.roamingFriendliness > scores1.roamingFriendliness + 10) {
      strengths2.push("Better roaming");
      weaknesses1.push("Poorer roaming");
    }

    // 5G comparison
    if (scores1.fiveGQuality > scores2.fiveGQuality + 10) {
      strengths1.push("Better 5G");
      weaknesses2.push("Weaker 5G");
    } else if (scores2.fiveGQuality > scores1.fiveGQuality + 10) {
      strengths2.push("Better 5G");
      weaknesses1.push("Weaker 5G");
    }

    // Provider reliability comparison
    if (scores1.providerReliability > scores2.providerReliability + 10) {
      strengths1.push("More reliable network");
      weaknesses2.push("Less reliable network");
    } else if (scores2.providerReliability > scores1.providerReliability + 10) {
      strengths2.push("More reliable network");
      weaknesses1.push("Less reliable network");
    }

    const overallScore1 = this.calculateContractOverallScore(scores1);
    const overallScore2 = this.calculateContractOverallScore(scores2);

    return {
      entityId1: contract1.id,
      entityId2: contract2.id,
      strengths1,
      strengths2,
      weaknesses1,
      weaknesses2,
      recommendationWinner: overallScore1 > overallScore2 ? contract1.id : contract2.id,
      valueWinner: scores1.valueScore > scores2.valueScore ? contract1.id : contract2.id,
      overallScore1,
      overallScore2,
    };
  }

  private calculateOverallScore(scores: any): number {
    return (scores.cameraScore + scores.batteryScore + scores.gamingScore + scores.performanceScore + scores.valueScore) / 5;
  }

  private calculateContractOverallScore(scores: any): number {
    return (scores.valueScore + scores.dataValueRatio * 50 + scores.roamingFriendliness + scores.fiveGQuality + scores.providerReliability) / 4;
  }
}
