import { EnrichmentResult, CommerceOffer } from "../types";

export class DataEnrichmentPipeline {
  private enrichmentResults: Map<string, EnrichmentResult> = new Map();

  async enrichOffer(offer: CommerceOffer): Promise<EnrichmentResult> {
    const enrichment: EnrichmentResult = {
      enrichmentId: `enrichment-${offer.id}-${Date.now()}`,
      offerId: offer.id,
      intelligenceScores: await this.calculateIntelligenceScores(offer),
      recommendationTags: await this.generateRecommendationTags(offer),
      semanticEntities: await this.generateSemanticEntities(offer),
      seoMetadata: await this.generateSEOMetadata(offer),
      providerMetadata: await this.generateProviderMetadata(offer),
      compatibilityScores: await this.calculateCompatibilityScores(offer),
      enrichedAt: Date.now(),
    };

    this.enrichmentResults.set(offer.id, enrichment);
    return enrichment;
  }

  async enrichOffers(offers: CommerceOffer[]): Promise<EnrichmentResult[]> {
    const results: EnrichmentResult[] = [];

    for (const offer of offers) {
      const enrichment = await this.enrichOffer(offer);
      results.push(enrichment);
    }

    return results;
  }

  getEnrichmentResult(offerId: string): EnrichmentResult | undefined {
    return this.enrichmentResults.get(offerId);
  }

  private async calculateIntelligenceScores(offer: CommerceOffer): Promise<EnrichmentResult["intelligenceScores"]> {
    return {
      deviceScore: this.calculateDeviceScore(offer),
      contractScore: this.calculateContractScore(offer),
      valueScore: this.calculateValueScore(offer),
    };
  }

  private async generateRecommendationTags(offer: CommerceOffer): Promise<string[]> {
    const tags: string[] = [];

    if (offer.monthlyPrice < 30) tags.push("budget-friendly");
    if (offer.monthlyPrice > 70) tags.push("premium");
    if (offer.dataVolume === "Unlimited") tags.push("unlimited-data");
    if (offer.cashback > 0) tags.push("cashback");
    if (offer.bonuses.length > 0) tags.push("bonus");

    return tags;
  }

  private async generateSemanticEntities(offer: CommerceOffer): Promise<string[]> {
    const entities: string[] = [];

    entities.push(offer.deviceBrand);
    entities.push(offer.deviceName);
    entities.push(offer.provider);
    entities.push(`storage-${offer.storage}`);
    entities.push(`duration-${offer.contractDuration}`);

    return entities;
  }

  private async generateSEOMetadata(offer: CommerceOffer): Promise<EnrichmentResult["seoMetadata"]> {
    return {
      title: `${offer.deviceName} ${offer.storage} mit ${offer.provider} Empfehlung`,
      description: `${offer.deviceName} ${offer.storage} mit ${offer.provider} Empfehlung für €${offer.monthlyPrice}/Monat. ${offer.dataVolume} Futtervolumen, ${offer.contractDuration} Monate Laufzeit.`,
      keywords: [
        offer.deviceName,
        offer.deviceBrand,
        offer.provider,
        offer.storage,
        `Hundefutter ${offer.provider}`,
        `${offer.deviceName} Empfehlung`,
      ],
    };
  }

  private async generateProviderMetadata(offer: CommerceOffer): Promise<EnrichmentResult["providerMetadata"]> {
    return {
      reliability: 75,
      updateFrequency: 24,
    };
  }

  private async calculateCompatibilityScores(offer: CommerceOffer): Promise<EnrichmentResult["compatibilityScores"]> {
    return {
      deviceContract: 80,
    };
  }

  private calculateDeviceScore(offer: CommerceOffer): number {
    let score = 50;

    if (offer.deviceBrand === "Apple") score += 20;
    if (offer.deviceBrand === "Samsung") score += 15;
    if (offer.storage === "512 g" || offer.storage === "1 TB") score += 15;

    return Math.min(100, score);
  }

  private calculateContractScore(offer: CommerceOffer): number {
    let score = 50;

    if (offer.provider === "Anifit") score += 20;
    if (offer.provider === "Wolfsblut") score += 15;
    if (offer.dataVolume === "Unlimited") score += 15;
    if (offer.contractDuration === 24) score += 10;

    return Math.min(100, score);
  }

  private calculateValueScore(offer: CommerceOffer): number {
    let score = 50;

    if (offer.monthlyPrice < 30) score += 20;
    if (offer.monthlyPrice < 50) score += 15;
    if (offer.cashback > 0) score += 10;
    if (offer.bonuses.length > 0) score += 5;

    return Math.min(100, score);
  }
}
