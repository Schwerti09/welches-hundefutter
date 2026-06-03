import { RelatedRecommendation, DeviceIntelligence } from "../types";

export class RelatedRecommendationsEngine {
  generateRelatedRecommendations(
    deviceId: string,
    allDevices: any[],
    allIntelligences: Map<string, DeviceIntelligence>
  ): RelatedRecommendation[] {
    const currentIntelligence = allIntelligences.get(deviceId);
    if (!currentIntelligence) return [];

    const recommendations: RelatedRecommendation[] = [];

    for (const device of allDevices) {
      if (device.id === deviceId) continue;

      const intelligence = allIntelligences.get(device.id);
      if (!intelligence) continue;

      // Similar devices
      const similarityScore = this.calculateSimilarity(currentIntelligence, intelligence);
      if (similarityScore > 0.7) {
        recommendations.push({
          entityId: device.id,
          relationType: "similar",
          score: similarityScore,
          reason: "Similar specifications and features",
        });
      }

      // Cheaper alternatives
      if (intelligence.scores.valueScore > currentIntelligence.scores.valueScore + 10) {
        recommendations.push({
          entityId: device.id,
          relationType: "cheaper",
          score: intelligence.scores.valueScore - currentIntelligence.scores.valueScore,
          reason: "Better value for money",
        });
      }

      // Better camera alternatives
      if (intelligence.scores.cameraScore > currentIntelligence.scores.cameraScore + 15) {
        recommendations.push({
          entityId: device.id,
          relationType: "better_camera",
          score: intelligence.scores.cameraScore - currentIntelligence.scores.cameraScore,
          reason: "Superior camera system",
        });
      }

      // Better gaming alternatives
      if (intelligence.scores.gamingScore > currentIntelligence.scores.gamingScore + 15) {
        recommendations.push({
          entityId: device.id,
          relationType: "better_gaming",
          score: intelligence.scores.gamingScore - currentIntelligence.scores.gamingScore,
          reason: "Better gaming performance",
        });
      }

      // Better value alternatives
      if (intelligence.scores.valueScore > currentIntelligence.scores.valueScore + 15) {
        recommendations.push({
          entityId: device.id,
          relationType: "better_value",
          score: intelligence.scores.valueScore - currentIntelligence.scores.valueScore,
          reason: "Better overall value",
        });
      }

      // Upgrades
      if (intelligence.classification === "premium" && currentIntelligence.classification !== "premium") {
        recommendations.push({
          entityId: device.id,
          relationType: "upgrade",
          score: 20,
          reason: "Premium upgrade option",
        });
      }

      // Downgrades
      if (intelligence.classification === "budget" && currentIntelligence.classification !== "budget") {
        recommendations.push({
          entityId: device.id,
          relationType: "downgrade",
          score: 20,
          reason: "Budget-friendly alternative",
        });
      }
    }

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }

  private calculateSimilarity(intel1: DeviceIntelligence, intel2: DeviceIntelligence): number {
    const scoreDiff =
      Math.abs(intel1.scores.cameraScore - intel2.scores.cameraScore) +
      Math.abs(intel1.scores.performanceScore - intel2.scores.performanceScore) +
      Math.abs(intel1.scores.gamingScore - intel2.scores.gamingScore) +
      Math.abs(intel1.scores.batteryScore - intel2.scores.batteryScore);

    const maxDiff = 400;
    const similarity = 1 - scoreDiff / maxDiff;
    return Math.max(0, similarity);
  }
}
