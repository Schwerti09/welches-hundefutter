import { CompatibilityScore, DeviceIntelligence, ContractIntelligence } from "../types";

export class ContractDeviceMatchingEngine {
  calculateCompatibility(
    deviceIntelligence: DeviceIntelligence,
    contractIntelligence: ContractIntelligence
  ): CompatibilityScore {
    const penalties: string[] = [];
    const bonuses: string[] = [];

    let compatibilityScore = 100;

    // Premium device with weak contract penalty
    if (deviceIntelligence.classification === "premium" && contractIntelligence.classification === "budget") {
      compatibilityScore -= 20;
      penalties.push("Premium device paired with budget contract");
    }

    // Gaming device with low data penalty
    if (deviceIntelligence.scores.gamingScore > 80 && contractIntelligence.scores.dataValueRatio < 0.5) {
      compatibilityScore -= 25;
      penalties.push("Gaming device with low data volume");
    }

    // Traveler with poor roaming penalty
    if (deviceIntelligence.bestForLabels.includes("travelers") && contractIntelligence.scores.roamingFriendliness < 70) {
      compatibilityScore -= 20;
      penalties.push("Traveler-friendly device with poor roaming");
    }

    // Business user with unreliable network penalty
    if (deviceIntelligence.bestForLabels.includes("business") && contractIntelligence.scores.providerReliability < 80) {
      compatibilityScore -= 15;
      penalties.push("Business device with less reliable network");
    }

    // High value device with high value contract bonus
    if (deviceIntelligence.scores.valueScore > 80 && contractIntelligence.scores.valueScore > 80) {
      compatibilityScore += 15;
      bonuses.push("Excellent value combination");
    }

    // Premium device with premium contract bonus
    if (deviceIntelligence.classification === "premium" && contractIntelligence.classification === "premium") {
      compatibilityScore += 10;
      bonuses.push("Premium device with premium contract");
    }

    // Gaming device with high data bonus
    if (deviceIntelligence.scores.gamingScore > 80 && contractIntelligence.scores.dataValueRatio > 0.8) {
      compatibilityScore += 15;
      bonuses.push("Gaming device with generous data");
    }

    // Photographer with good roaming bonus
    if (deviceIntelligence.bestForLabels.includes("photographers") && contractIntelligence.scores.roamingFriendliness > 80) {
      compatibilityScore += 10;
      bonuses.push("Photographer device with excellent roaming");
    }

    // Clamp score
    compatibilityScore = Math.max(0, Math.min(100, compatibilityScore));

    // Determine recommendation
    let recommendation: "recommended" | "acceptable" | "not_recommended";
    if (compatibilityScore >= 80) {
      recommendation = "recommended";
    } else if (compatibilityScore >= 60) {
      recommendation = "acceptable";
    } else {
      recommendation = "not_recommended";
    }

    return {
      deviceId: deviceIntelligence.deviceId,
      contractId: contractIntelligence.contractId,
      compatibilityScore,
      penalties,
      bonuses,
      recommendation,
    };
  }

  findBestContractForDevice(
    deviceIntelligence: DeviceIntelligence,
    contractIntelligences: ContractIntelligence[]
  ): ContractIntelligence | null {
    let bestContract: ContractIntelligence | null = null;
    let bestScore = 0;

    for (const contractIntelligence of contractIntelligences) {
      const compatibility = this.calculateCompatibility(deviceIntelligence, contractIntelligence);
      if (compatibility.compatibilityScore > bestScore) {
        bestScore = compatibility.compatibilityScore;
        bestContract = contractIntelligence;
      }
    }

    return bestContract;
  }

  findBestDeviceForContract(
    contractIntelligence: ContractIntelligence,
    deviceIntelligences: DeviceIntelligence[]
  ): DeviceIntelligence | null {
    let bestDevice: DeviceIntelligence | null = null;
    let bestScore = 0;

    for (const deviceIntelligence of deviceIntelligences) {
      const compatibility = this.calculateCompatibility(deviceIntelligence, contractIntelligence);
      if (compatibility.compatibilityScore > bestScore) {
        bestScore = compatibility.compatibilityScore;
        bestDevice = deviceIntelligence;
      }
    }

    return bestDevice;
  }
}
