import { RawOffer, ParsingResult } from "../types";

export class AWINFeedParser {
  private rawOffers: Map<string, RawOffer> = new Map();
  private parsingResults: Map<string, ParsingResult> = new Map();

  parseCSVRow(row: Record<string, unknown>, rowNumber: number): RawOffer | null {
    try {
      const rawOffer: RawOffer = {
        rawOfferId: `raw-awin-${rowNumber}-${Date.now()}`,
        networkType: "awin",
        rawData: row,
        rowNumber,
        parsedAt: Date.now(),
      };

      this.rawOffers.set(rawOffer.rawOfferId, rawOffer);
      return rawOffer;
    } catch (error) {
      console.error(`Failed to parse row ${rowNumber}:`, error);
      return null;
    }
  }

  parseCSVRows(rows: Record<string, unknown>[]): ParsingResult {
    let successfulParses = 0;
    let failedParses = 0;
    const parsingErrors: Array<{ rowNumber: number; error: string }> = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const result = this.parseCSVRow(row, i + 1);

      if (result) {
        successfulParses++;
      } else {
        failedParses++;
        parsingErrors.push({
          rowNumber: i + 1,
          error: "Failed to parse row",
        });
      }
    }

    const parsingResult: ParsingResult = {
      resultId: `result-${Date.now()}`,
      feedFileId: "",
      rawOffersCount: rows.length,
      successfulParses,
      failedParses,
      parsingErrors,
      parsedAt: Date.now(),
    };

    this.parsingResults.set(parsingResult.resultId, parsingResult);
    return parsingResult;
  }

  getRawOffer(rawOfferId: string): RawOffer | undefined {
    return this.rawOffers.get(rawOfferId);
  }

  getRawOffersByNetwork(networkType: "awin"): RawOffer[] {
    return Array.from(this.rawOffers.values()).filter((r) => r.networkType === networkType);
  }

  getParsingResult(resultId: string): ParsingResult | undefined {
    return this.parsingResults.get(resultId);
  }
}
