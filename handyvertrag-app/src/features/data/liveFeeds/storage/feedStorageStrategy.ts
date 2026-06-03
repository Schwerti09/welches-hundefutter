import { FeedFile, RawOffer, NormalizedOffer, IngestionJob, ParsingResult, ValidationReport } from "../types";

export class FeedStorageStrategy {
  private rawFeedFiles: Map<string, FeedFile> = new Map();
  private parsedFeedData: Map<string, RawOffer[]> = new Map();
  private normalizedEntities: Map<string, NormalizedOffer[]> = new Map();
  private enrichedEntities: Map<string, NormalizedOffer[]> = new Map();
  private historicalSnapshots: Map<string, NormalizedOffer[]> = new Map();
  private failedImports: Map<string, Error> = new Map();

  storeRawFeedFile(feedFile: FeedFile): void {
    this.rawFeedFiles.set(feedFile.fileId, feedFile);
  }

  storeParsedFeedData(feedFileId: string, rawOffers: RawOffer[]): void {
    this.parsedFeedData.set(feedFileId, rawOffers);
  }

  storeNormalizedEntities(feedFileId: string, normalizedOffers: NormalizedOffer[]): void {
    this.normalizedEntities.set(feedFileId, normalizedOffers);
  }

  storeEnrichedEntities(feedFileId: string, enrichedOffers: NormalizedOffer[]): void {
    this.enrichedEntities.set(feedFileId, enrichedOffers);
  }

  storeHistoricalSnapshot(feedFileId: string, snapshot: NormalizedOffer[]): void {
    this.historicalSnapshots.set(`${feedFileId}-${Date.now()}`, snapshot);
  }

  storeFailedImport(feedFileId: string, error: Error): void {
    this.failedImports.set(feedFileId, error);
  }

  getRawFeedFile(fileId: string): FeedFile | undefined {
    return this.rawFeedFiles.get(fileId);
  }

  getParsedFeedData(feedFileId: string): RawOffer[] | undefined {
    return this.parsedFeedData.get(feedFileId);
  }

  getNormalizedEntities(feedFileId: string): NormalizedOffer[] | undefined {
    return this.normalizedEntities.get(feedFileId);
  }

  getEnrichedEntities(feedFileId: string): NormalizedOffer[] | undefined {
    return this.enrichedEntities.get(feedFileId);
  }

  getHistoricalSnapshots(feedFileId: string): NormalizedOffer[] {
    const snapshots: NormalizedOffer[] = [];

    for (const [key, snapshot] of this.historicalSnapshots) {
      if (key.startsWith(feedFileId)) {
        snapshots.push(...snapshot);
      }
    }

    return snapshots;
  }

  getFailedImport(feedFileId: string): Error | undefined {
    return this.failedImports.get(feedFileId);
  }

  deleteRawFeedFile(fileId: string): void {
    this.rawFeedFiles.delete(fileId);
  }

  deleteParsedFeedData(feedFileId: string): void {
    this.parsedFeedData.delete(feedFileId);
  }

  deleteNormalizedEntities(feedFileId: string): void {
    this.normalizedEntities.delete(feedFileId);
  }

  deleteEnrichedEntities(feedFileId: string): void {
    this.enrichedEntities.delete(feedFileId);
  }

  deleteHistoricalSnapshots(feedFileId: string): void {
    for (const key of this.historicalSnapshots.keys()) {
      if (key.startsWith(feedFileId)) {
        this.historicalSnapshots.delete(key);
      }
    }
  }

  deleteFailedImport(feedFileId: string): void {
    this.failedImports.delete(feedFileId);
  }
}
