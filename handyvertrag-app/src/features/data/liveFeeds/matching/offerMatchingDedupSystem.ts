import { NormalizedOffer, DuplicateMatch } from "../types";

export class OfferMatchingDedupSystem {
  private duplicateMatches: Map<string, DuplicateMatch> = new Map();
  private offerIndex: Map<string, NormalizedOffer> = new Map();

  indexOffer(offer: NormalizedOffer): void {
    this.offerIndex.set(offer.normalizedOfferId, offer);
  }

  indexOffers(offers: NormalizedOffer[]): void {
    for (const offer of offers) {
      this.indexOffer(offer);
    }
  }

  findFuzzyMatches(offer: NormalizedOffer, threshold: number = 0.8): DuplicateMatch[] {
    const matches: DuplicateMatch[] = [];

    for (const [offerId, existingOffer] of this.offerIndex) {
      if (offerId === offer.normalizedOfferId) continue;

      const confidence = this.calculateFuzzyConfidence(offer, existingOffer);

      if (confidence >= threshold) {
        const match: DuplicateMatch = {
          matchId: `match-fuzzy-${offer.normalizedOfferId}-${offerId}`,
          offerId: offer.normalizedOfferId,
          matchedOfferId: offerId,
          matchType: "fuzzy",
          confidence,
          matchedAt: Date.now(),
        };

        matches.push(match);
        this.duplicateMatches.set(match.matchId, match);
      }
    }

    return matches;
  }

  findSemanticMatches(offer: NormalizedOffer, threshold: number = 0.8): DuplicateMatch[] {
    const matches: DuplicateMatch[] = [];

    for (const [offerId, existingOffer] of this.offerIndex) {
      if (offerId === offer.normalizedOfferId) continue;

      const confidence = this.calculateSemanticConfidence(offer, existingOffer);

      if (confidence >= threshold) {
        const match: DuplicateMatch = {
          matchId: `match-semantic-${offer.normalizedOfferId}-${offerId}`,
          offerId: offer.normalizedOfferId,
          matchedOfferId: offerId,
          matchType: "semantic",
          confidence,
          matchedAt: Date.now(),
        };

        matches.push(match);
        this.duplicateMatches.set(match.matchId, match);
      }
    }

    return matches;
  }

  findVariantMatches(offer: NormalizedOffer, threshold: number = 0.8): DuplicateMatch[] {
    const matches: DuplicateMatch[] = [];

    for (const [offerId, existingOffer] of this.offerIndex) {
      if (offerId === offer.normalizedOfferId) continue;

      const confidence = this.calculateVariantConfidence(offer, existingOffer);

      if (confidence >= threshold) {
        const match: DuplicateMatch = {
          matchId: `match-variant-${offer.normalizedOfferId}-${offerId}`,
          offerId: offer.normalizedOfferId,
          matchedOfferId: offerId,
          matchType: "variant",
          confidence,
          matchedAt: Date.now(),
        };

        matches.push(match);
        this.duplicateMatches.set(match.matchId, match);
      }
    }

    return matches;
  }

  findAllMatches(offer: NormalizedOffer, threshold: number = 0.8): DuplicateMatch[] {
    const fuzzyMatches = this.findFuzzyMatches(offer, threshold);
    const semanticMatches = this.findSemanticMatches(offer, threshold);
    const variantMatches = this.findVariantMatches(offer, threshold);

    return [...fuzzyMatches, ...semanticMatches, ...variantMatches];
  }

  getDuplicateMatch(matchId: string): DuplicateMatch | undefined {
    return this.duplicateMatches.get(matchId);
  }

  getDuplicateMatchesByOffer(offerId: string): DuplicateMatch[] {
    return Array.from(this.duplicateMatches.values()).filter((m) => m.offerId === offerId);
  }

  private calculateFuzzyConfidence(offer1: NormalizedOffer, offer2: NormalizedOffer): number {
    // Placeholder for fuzzy confidence calculation
    return 0.5;
  }

  private calculateSemanticConfidence(offer1: NormalizedOffer, offer2: NormalizedOffer): number {
    // Placeholder for semantic confidence calculation
    return 0.5;
  }

  private calculateVariantConfidence(offer1: NormalizedOffer, offer2: NormalizedOffer): number {
    // Placeholder for variant confidence calculation
    return 0.5;
  }
}
