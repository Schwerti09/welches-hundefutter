import { DeviceIntelligence, ContractIntelligence, CompatibilityScore } from "../types";

export class ExplanationIntelligence {
  generateDeepExplanation(
    deviceIntelligence: DeviceIntelligence,
    contractIntelligence: ContractIntelligence,
    compatibility: CompatibilityScore
  ): string[] {
    const explanation: string[] = [];

    // Device-based explanations
    if (deviceIntelligence.scores.gamingScore > 85) {
      explanation.push("Strong gaming performance for demanding games and apps");
    }

    if (deviceIntelligence.scores.cameraScore > 85) {
      explanation.push("Excellent camera system for professional-quality photos");
    }

    if (deviceIntelligence.scores.batteryScore > 85) {
      explanation.push("Outstanding battery life for all-day usage");
    }

    if (deviceIntelligence.scores.performanceScore > 85) {
      explanation.push("High-performance processor for smooth multitasking");
    }

    if (deviceIntelligence.scores.longevityScore > 85) {
      explanation.push("Long-lasting device with excellent durability");
    }

    // Contract-based explanations
    if (contractIntelligence.scores.valueScore > 85) {
      explanation.push("Excellent contract value with great benefits");
    }

    if (contractIntelligence.scores.dataValueRatio > 1.0) {
      explanation.push("Generous data volume for heavy usage");
    }

    if (contractIntelligence.scores.roamingFriendliness > 85) {
      explanation.push("Excellent roaming options for international travel");
    }

    if (contractIntelligence.scores.fiveGQuality > 85) {
      explanation.push("Superior 5G network quality for fast connectivity");
    }

    if (contractIntelligence.scores.providerReliability > 85) {
      explanation.push("Highly reliable provider network with excellent coverage");
    }

    // Compatibility-based explanations
    if (compatibility.recommendation === "recommended") {
      explanation.push("Perfect match between device capabilities and contract benefits");
    }

    if (compatibility.bonuses.length > 0) {
      explanation.push(`Additional benefits: ${compatibility.bonuses.join(", ")}`);
    }

    // Classification-based explanations
    if (deviceIntelligence.classification === "premium") {
      explanation.push("Premium flagship device with top-tier features");
    }

    if (contractIntelligence.classification === "premium") {
      explanation.push("Premium contract with comprehensive benefits");
    }

    // Best-for explanations
    deviceIntelligence.bestForLabels.forEach((label) => {
      switch (label) {
        case "gaming":
          explanation.push("Optimized for gaming enthusiasts");
          break;
        case "photographers":
          explanation.push("Ideal for photography enthusiasts");
          break;
        case "creators":
          explanation.push("Perfect for content creators");
          break;
        case "budget":
          explanation.push("Excellent choice for budget-conscious users");
          break;
        case "business":
          explanation.push("Suitable for business professionals");
          break;
        case "travelers":
          explanation.push("Great choice for frequent travelers");
          break;
      }
    });

    return explanation;
  }

  generateValueExplanation(
    deviceIntelligence: DeviceIntelligence,
    contractIntelligence: ContractIntelligence
  ): string {
    const deviceValue = deviceIntelligence.scores.valueScore;
    const contractValue = contractIntelligence.scores.valueScore;
    const combinedValue = (deviceValue + contractValue) / 2;

    if (combinedValue > 85) {
      return "Outstanding value combination with excellent hardware and contract benefits";
    } else if (combinedValue > 70) {
      return "Good value with balanced hardware and contract quality";
    } else if (combinedValue > 55) {
      return "Moderate value suitable for basic needs";
    } else {
      return "Basic value option for budget-conscious users";
    }
  }

  generateSuitabilityExplanation(
    deviceIntelligence: DeviceIntelligence,
    contractIntelligence: ContractIntelligence,
    segment: string
  ): string {
    const deviceSuitability = deviceIntelligence.bestForLabels.includes(segment as any);
    const contractSuitability = contractIntelligence.suitability[segment as keyof typeof contractIntelligence.suitability];

    if (deviceSuitability && contractSuitability > 80) {
      return `Perfect match for ${segment} users with excellent device and contract suitability`;
    } else if (deviceSuitability || contractSuitability > 80) {
      return `Good match for ${segment} users with partial suitability`;
    } else {
      return `Basic suitability for ${segment} users`;
    }
  }
}
