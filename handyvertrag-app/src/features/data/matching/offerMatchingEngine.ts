import { CommerceOffer } from "../types";

export class OfferMatchingEngine {
  private entityMap: Map<string, string> = new Map();
  private variants: Map<string, string[]> = new Map();

  matchOffer(offer: CommerceOffer): string | null {
    const normalizedKey = this.generateKey(offer);
    const existingId = this.entityMap.get(normalizedKey);

    if (existingId) {
      return existingId;
    }

    // Try fuzzy matching
    const fuzzyMatch = this.findFuzzyMatch(offer);
    if (fuzzyMatch) {
      return fuzzyMatch;
    }

    // Try semantic matching
    const semanticMatch = this.findSemanticMatch(offer);
    if (semanticMatch) {
      return semanticMatch;
    }

    // Check for variant
    const variantMatch = this.findVariantMatch(offer);
    if (variantMatch) {
      return variantMatch;
    }

    return null;
  }

  registerMatch(originalId: string, normalizedId: string): void {
    this.entityMap.set(originalId, normalizedId);
  }

  registerVariant(baseId: string, variantId: string): void {
    const variants = this.variants.get(baseId) || [];
    if (!variants.includes(variantId)) {
      variants.push(variantId);
      this.variants.set(baseId, variants);
    }
  }

  detectDuplicate(offer: CommerceOffer, existingOffers: CommerceOffer[]): boolean {
    for (const existing of existingOffers) {
      if (this.isDuplicate(offer, existing)) {
        return true;
      }
    }
    return false;
  }

  detectVariant(offer: CommerceOffer, existingOffers: CommerceOffer[]): string | null {
    for (const existing of existingOffers) {
      if (this.isVariant(offer, existing)) {
        return existing.id;
      }
    }
    return null;
  }

  private generateKey(offer: CommerceOffer): string {
    const parts = [
      offer.deviceBrand.toLowerCase(),
      offer.deviceName.toLowerCase().replace(/\s+/g, "-"),
      offer.storage.toLowerCase().replace(/\s+/g, ""),
      offer.contractDuration.toString(),
    ];

    return parts.join("-");
  }

  private findFuzzyMatch(offer: CommerceOffer): string | null {
    // Placeholder for fuzzy matching logic
    return null;
  }

  private findSemanticMatch(offer: CommerceOffer): string | null {
    // Placeholder for semantic matching logic
    return null;
  }

  private findVariantMatch(offer: CommerceOffer): string | null {
    // Placeholder for variant matching logic
    return null;
  }

  private isDuplicate(offer1: CommerceOffer, offer2: CommerceOffer): boolean {
    return (
      offer1.deviceBrand === offer2.deviceBrand &&
      offer1.deviceName === offer2.deviceName &&
      offer1.storage === offer2.storage &&
      offer1.color === offer2.color &&
      offer1.contractDuration === offer2.contractDuration &&
      Math.abs(offer1.monthlyPrice - offer2.monthlyPrice) < 1
    );
  }

  private isVariant(offer1: CommerceOffer, offer2: CommerceOffer): boolean {
    const sameDevice = offer1.deviceBrand === offer2.deviceBrand && offer1.deviceName === offer2.deviceName;
    const differentStorage = offer1.storage !== offer2.storage;
    const differentColor = offer1.color !== offer2.color;

    return sameDevice && (differentStorage || differentColor);
  }

  getNormalizedId(originalId: string): string | undefined {
    return this.entityMap.get(originalId);
  }

  getVariants(baseId: string): string[] {
    return this.variants.get(baseId) || [];
  }
}
