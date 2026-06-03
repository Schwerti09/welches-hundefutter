import { SuitabilitySegment, DeviceIntelligence, ContractIntelligence } from "../types";

export class BestForEngine {
  matchDeviceForSegment(deviceIntelligence: DeviceIntelligence, segment: SuitabilitySegment): number {
    const scores = deviceIntelligence.scores;
    const bestForLabels = deviceIntelligence.bestForLabels;

    if (bestForLabels.includes(segment)) {
      return 95;
    }

    switch (segment) {
      case "gaming":
        return scores.gamingScore;
      case "photographers":
        return scores.cameraScore;
      case "creators":
        return (scores.performanceScore + scores.cameraScore) / 2;
      case "budget":
        return scores.valueScore;
      case "business":
        return (scores.performanceScore + scores.longevityScore) / 2;
      case "travelers":
        return scores.batteryScore;
      case "families":
        return scores.valueScore;
      case "students":
        return scores.valueScore;
      default:
        return 50;
    }
  }

  matchContractForSegment(contractIntelligence: ContractIntelligence, segment: SuitabilitySegment): number {
    const suitability = contractIntelligence.suitability;

    switch (segment) {
      case "students":
        return suitability.students;
      case "business":
        return suitability.business;
      case "families":
        return suitability.families;
      case "travelers":
        return suitability.travelers;
      case "gaming":
        return contractIntelligence.scores.dataValueRatio > 0.7 ? 80 : 50;
      case "budget":
        return contractIntelligence.classification === "budget" ? 90 : 60;
      default:
        return 50;
    }
  }

  getBestDevicesForSegment(deviceIntelligences: DeviceIntelligence[], segment: SuitabilitySegment, limit: number = 5): Array<{ deviceId: string; score: number }> {
    const scored = deviceIntelligences.map((intelligence) => ({
      deviceId: intelligence.deviceId,
      score: this.matchDeviceForSegment(intelligence, segment),
    }));

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  getBestContractsForSegment(contractIntelligences: ContractIntelligence[], segment: SuitabilitySegment, limit: number = 5): Array<{ contractId: string; score: number }> {
    const scored = contractIntelligences.map((intelligence) => ({
      contractId: intelligence.contractId,
      score: this.matchContractForSegment(intelligence, segment),
    }));

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  getAllBestForSegments(deviceIntelligence: DeviceIntelligence): Record<SuitabilitySegment, number> {
    const segments: SuitabilitySegment[] = ["gaming", "students", "creators", "photographers", "budget", "business", "travelers", "families"];
    
    const results: Record<SuitabilitySegment, number> = {} as any;
    
    for (const segment of segments) {
      results[segment] = this.matchDeviceForSegment(deviceIntelligence, segment);
    }

    return results;
  }
}
