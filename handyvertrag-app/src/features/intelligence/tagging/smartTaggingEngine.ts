import { DeviceIntelligence, ContractIntelligence } from "../types";

export class SmartTaggingEngine {
  generateDeviceTags(intelligence: DeviceIntelligence): string[] {
    const tags: string[] = [];
    const { scores, classification } = intelligence;

    // Score-based tags
    if (scores.cameraScore > 90) tags.push("camera-champion");
    if (scores.cameraScore > 80) tags.push("excellent-camera");
    if (scores.batteryScore > 90) tags.push("battery-king");
    if (scores.batteryScore > 80) tags.push("excellent-battery");
    if (scores.gamingScore > 90) tags.push("gaming-powerhouse");
    if (scores.gamingScore > 80) tags.push("gaming-ready");
    if (scores.performanceScore > 90) tags.push("performance-elite");
    if (scores.performanceScore > 80) tags.push("high-performance");
    if (scores.valueScore > 90) tags.push("best-value");
    if (scores.valueScore > 80) tags.push("great-value");
    if (scores.longevityScore > 90) tags.push("long-lasting");
    if (scores.longevityScore > 80) tags.push("durable");

    // Classification-based tags
    if (classification === "premium") tags.push("premium-flagship");
    if (classification === "midrange") tags.push("midrange-value");
    if (classification === "budget") tags.push("budget-friendly");

    // Flagship status
    if (intelligence.flagshipStatus) tags.push("flagship");

    // Best-for tags
    intelligence.bestForLabels.forEach((label) => {
      tags.push(`best-for-${label}`);
    });

    return tags;
  }

  generateContractTags(intelligence: ContractIntelligence): string[] {
    const tags: string[] = [];
    const { scores, classification } = intelligence;

    // Score-based tags
    if (scores.valueScore > 90) tags.push("best-value-contract");
    if (scores.valueScore > 80) tags.push("great-value-contract");
    if (scores.dataValueRatio > 1.0) tags.push("data-generous");
    if (scores.dataValueRatio > 0.7) tags.push("good-data-value");
    if (scores.roamingFriendliness > 90) tags.push("roaming-excellent");
    if (scores.roamingFriendliness > 80) tags.push("roaming-friendly");
    if (scores.fiveGQuality > 90) tags.push("5g-excellent");
    if (scores.fiveGQuality > 80) tags.push("5g-ready");
    if (scores.providerReliability > 90) tags.push("reliable-network");
    if (scores.providerReliability > 80) tags.push("good-network");

    // Classification-based tags
    if (classification === "premium") tags.push("premium-contract");
    if (classification === "value") tags.push("value-contract");
    if (classification === "budget") tags.push("budget-contract");

    // Special classifications
    if (intelligence.unlimitedClassification) tags.push("unlimited-data");
    if (intelligence.budgetClassification) tags.push("budget-friendly");

    // Suitability tags
    if (intelligence.suitability.students > 80) tags.push("student-friendly");
    if (intelligence.suitability.business > 80) tags.push("business-friendly");
    if (intelligence.suitability.families > 80) tags.push("family-friendly");
    if (intelligence.suitability.travelers > 80) tags.push("traveler-friendly");

    return tags;
  }

  generateCombinedTags(deviceIntelligence: DeviceIntelligence, contractIntelligence: ContractIntelligence): string[] {
    const deviceTags = this.generateDeviceTags(deviceIntelligence);
    const contractTags = this.generateContractTags(contractIntelligence);
    const combinedTags: string[] = [...deviceTags, ...contractTags];

    // Combined tags
    if (deviceIntelligence.scores.valueScore > 80 && contractIntelligence.scores.valueScore > 80) {
      combinedTags.push("overall-best-value");
    }

    if (deviceIntelligence.scores.gamingScore > 80 && contractIntelligence.scores.dataValueRatio > 0.7) {
      combinedTags.push("gaming-bundle");
    }

    if (deviceIntelligence.scores.cameraScore > 80 && contractIntelligence.scores.roamingFriendliness > 80) {
      combinedTags.push("travel-photography");
    }

    return combinedTags;
  }
}
