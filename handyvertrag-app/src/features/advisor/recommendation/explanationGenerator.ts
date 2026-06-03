import { RecommendationScore, RecommendationReason, ImportanceLevel } from "../types";

export class ExplanationGenerator {
  generateExplanation(score: RecommendationScore, product: any, offer: any): RecommendationReason[] {
    const reasons: RecommendationReason[] = [];

    if (score.budgetScore > 0.8) {
      reasons.push({
        factor: "Budget",
        value: `Preis von €${offer.monthlyPrice}/Monat passt zu deinem Budget`,
        importance: "high",
      });
    }

    if (score.featureScore > 0.8) {
      reasons.push({
        factor: "Features",
        value: `${product.brand} ${product.name} bietet starke Features`,
        importance: "high",
      });
    }

    if (score.providerScore > 0.8) {
      reasons.push({
        factor: "Provider",
        value: `${offer.provider} entspricht deiner Präferenz`,
        importance: "medium",
      });
    }

    if (score.dataScore > 0.8) {
      reasons.push({
        factor: "Daten",
        value: `${offer.dataVolume} Daten passen zu deinem Nutzungsverhalten`,
        importance: "high",
      });
    }

    if (score.cameraScore > 0.8) {
      reasons.push({
        factor: "Kamera",
        value: `Ausgezeichnete Kamera für deine Foto-Bedürfnisse`,
        importance: "medium",
      });
    }

    if (score.batteryScore > 0.8) {
      reasons.push({
        factor: "Akku",
        value: `Starke Batterielaufzeit für den ganzen Tag`,
        importance: "medium",
      });
    }

    if (score.gamingScore > 0.8) {
      reasons.push({
        factor: "Gaming",
        value: `Leistungsstark für Gaming und Apps`,
        importance: "medium",
      });
    }

    if (score.valueScore > 0.8) {
      reasons.push({
        factor: "Value",
        value: `Hervorragendes Preis-Leistungs-Verhältnis`,
        importance: "high",
      });
    }

    if (reasons.length === 0) {
      reasons.push({
        factor: "Allgemein",
        value: `Gute Option basierend auf deinen Präferenzen`,
        importance: "low",
      });
    }

    return reasons;
  }

  generateSummary(reasons: RecommendationReason[]): string {
    if (reasons.length === 0) {
      return "Diese Option basiert auf deinen angegebenen Präferenzen.";
    }

    const highImportance = reasons.filter((r) => r.importance === "high");
    if (highImportance.length > 0) {
      return `Empfohlen weil: ${highImportance.map((r) => r.value).join(", ")}`;
    }

    return `Empfohlen weil: ${reasons.map((r) => r.value).join(", ")}`;
  }
}
