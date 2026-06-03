import { NormalizedOffer, DuplicateMatch } from "../types";

export interface DuplicateGroup {
  groupId: string;
  canonicalOfferId: string;
  duplicateOfferIds: string[];
  matchType: "fuzzy" | "semantic" | "variant";
  confidence: number;
  createdAt: number;
}

export class RealDuplicateMatching {
  private duplicateMatches: Map<string, DuplicateMatch> = new Map();
  private duplicateGroups: Map<string, DuplicateGroup> = new Map();
  private offerIndex: Map<string, NormalizedOffer> = new Map();

  indexOffer(offer: NormalizedOffer): void {
    this.offerIndex.set(offer.normalizedOfferId, offer);
  }

  indexOffers(offers: NormalizedOffer[]): void {
    for (const offer of offers) {
      this.indexOffer(offer);
    }
  }

  findSameDeviceDuplicates(offer: NormalizedOffer, threshold: number = 0.9): DuplicateMatch[] {
    const matches: DuplicateMatch[] = [];

    for (const [offerId, existingOffer] of this.offerIndex) {
      if (offerId === offer.normalizedOfferId) continue;

      const confidence = this.calculateDeviceConfidence(offer, existingOffer);

      if (confidence >= threshold) {
        const match: DuplicateMatch = {
          matchId: `match-device-${offer.normalizedOfferId}-${offerId}`,
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

  findSameContractDuplicates(offer: NormalizedOffer, threshold: number = 0.9): DuplicateMatch[] {
    const matches: DuplicateMatch[] = [];

    for (const [offerId, existingOffer] of this.offerIndex) {
      if (offerId === offer.normalizedOfferId) continue;

      const confidence = this.calculateContractConfidence(offer, existingOffer);

      if (confidence >= threshold) {
        const match: DuplicateMatch = {
          matchId: `match-contract-${offer.normalizedOfferId}-${offerId}`,
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

  findSameProviderDuplicates(offer: NormalizedOffer, threshold: number = 0.9): DuplicateMatch[] {
    const matches: DuplicateMatch[] = [];

    for (const [offerId, existingOffer] of this.offerIndex) {
      if (offerId === offer.normalizedOfferId) continue;

      const confidence = this.calculateProviderConfidence(offer, existingOffer);

      if (confidence >= threshold) {
        const match: DuplicateMatch = {
          matchId: `match-provider-${offer.normalizedOfferId}-${offerId}`,
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

  findNearIdenticalOffers(offer: NormalizedOffer, threshold: number = 0.95): DuplicateMatch[] {
    const matches: DuplicateMatch[] = [];

    for (const [offerId, existingOffer] of this.offerIndex) {
      if (offerId === offer.normalizedOfferId) continue;

      const confidence = this.calculateOverallConfidence(offer, existingOffer);

      if (confidence >= threshold) {
        const match: DuplicateMatch = {
          matchId: `match-near-${offer.normalizedOfferId}-${offerId}`,
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

  createDuplicateGroups(threshold: number = 0.9): DuplicateGroup[] {
    const groups: DuplicateGroup[] = [];
    const processedOffers = new Set<string>();

    for (const [offerId, offer] of this.offerIndex) {
      if (processedOffers.has(offerId)) continue;

      const matches = this.findAllMatches(offer, threshold);
      if (matches.length > 0) {
        const group: DuplicateGroup = {
          groupId: `group-${offerId}-${Date.now()}`,
          canonicalOfferId: offerId,
          duplicateOfferIds: matches.map(m => m.matchedOfferId),
          matchType: matches[0].matchType,
          confidence: matches.reduce((sum, m) => sum + m.confidence, 0) / matches.length,
          createdAt: Date.now(),
        };

        groups.push(group);
        this.duplicateGroups.set(group.groupId, group);

        processedOffers.add(offerId);
        for (const match of matches) {
          processedOffers.add(match.matchedOfferId);
        }
      }
    }

    return groups;
  }

  findAllMatches(offer: NormalizedOffer, threshold: number = 0.9): DuplicateMatch[] {
    const deviceMatches = this.findSameDeviceDuplicates(offer, threshold);
    const contractMatches = this.findSameContractDuplicates(offer, threshold);
    const providerMatches = this.findSameProviderDuplicates(offer, threshold);
    const nearMatches = this.findNearIdenticalOffers(offer, threshold);

    return [...deviceMatches, ...contractMatches, ...providerMatches, ...nearMatches];
  }

  getDuplicateMatch(matchId: string): DuplicateMatch | undefined {
    return this.duplicateMatches.get(matchId);
  }

  getDuplicateMatchesByOffer(offerId: string): DuplicateMatch[] {
    return Array.from(this.duplicateMatches.values()).filter((m) => m.offerId === offerId);
  }

  getDuplicateGroup(groupId: string): DuplicateGroup | undefined {
    return this.duplicateGroups.get(groupId);
  }

  getAllDuplicateGroups(): DuplicateGroup[] {
    return Array.from(this.duplicateGroups.values());
  }

  getDuplicateReport(): {
    totalOffers: number;
    totalMatches: number;
    totalGroups: number;
    averageConfidence: number;
    matchTypeBreakdown: { fuzzy: number; semantic: number; variant: number };
  } {
    const matches = Array.from(this.duplicateMatches.values());
    const groups = Array.from(this.duplicateGroups.values());

    const matchTypeBreakdown = {
      fuzzy: matches.filter(m => m.matchType === "fuzzy").length,
      semantic: matches.filter(m => m.matchType === "semantic").length,
      variant: matches.filter(m => m.matchType === "variant").length,
    };

    const averageConfidence = matches.length > 0
      ? matches.reduce((sum, m) => sum + m.confidence, 0) / matches.length
      : 0;

    return {
      totalOffers: this.offerIndex.size,
      totalMatches: matches.length,
      totalGroups: groups.length,
      averageConfidence,
      matchTypeBreakdown,
    };
  }

  private calculateDeviceConfidence(offer1: NormalizedOffer, offer2: NormalizedOffer): number {
    const device1 = offer1.hundefutterName.toLowerCase();
    const device2 = offer2.hundefutterName.toLowerCase();

    if (device1 === device2) return 1.0;

    const similarity = this.calculateStringSimilarity(device1, device2);
    return similarity;
  }

  private calculateContractConfidence(offer1: NormalizedOffer, offer2: NormalizedOffer): number {
    const contract1 = offer1.contractName.toLowerCase();
    const contract2 = offer2.contractName.toLowerCase();

    if (contract1 === contract2) return 1.0;

    const similarity = this.calculateStringSimilarity(contract1, contract2);
    return similarity;
  }

  private calculateProviderConfidence(offer1: NormalizedOffer, offer2: NormalizedOffer): number {
    const provider1 = offer1.providerName.toLowerCase();
    const provider2 = offer2.providerName.toLowerCase();

    if (provider1 === provider2) return 1.0;

    const similarity = this.calculateStringSimilarity(provider1, provider2);
    return similarity;
  }

  private calculateOverallConfidence(offer1: NormalizedOffer, offer2: NormalizedOffer): number {
    const deviceConfidence = this.calculateDeviceConfidence(offer1, offer2);
    const contractConfidence = this.calculateContractConfidence(offer1, offer2);
    const providerConfidence = this.calculateProviderConfidence(offer1, offer2);

    return (deviceConfidence + contractConfidence + providerConfidence) / 3;
  }

  private calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = this.calculateEditDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private calculateEditDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i;
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j;
    }

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  }
}
