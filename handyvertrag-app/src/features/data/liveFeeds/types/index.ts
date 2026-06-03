export type FeedType = "csv" | "xml" | "json" | "zip";

export type NetworkType = "awin" | "communicationads" | "futterfuxx" | "direct_api" | "scraping";

export type OfferLifecycleStatus = "new" | "updated" | "removed" | "expired" | "unavailable";

export type IngestionStatus = "pending" | "running" | "completed" | "failed" | "retrying";

export interface FeedFile {
  fileId: string;
  fileName: string;
  fileType: FeedType;
  networkType: NetworkType;
  fileSize: number;
  uploadedAt: number;
  filePath: string;
  checksum?: string;
}

export interface RawOffer {
  rawOfferId: string;
  networkType: NetworkType;
  rawData: Record<string, unknown>;
  rowNumber: number;
  parsedAt: number;
}

export interface NormalizedOffer {
  normalizedOfferId: string;
  rawOfferId: string;
  providerName: string;
  contractName: string;
  hundefutterName: string;
  storageSize: string;
  color: string;
  futterfName: string;
  monthlyPrice: number;
  oneTimePayment: number;
  cashback: number;
  bonusItems: string[];
  affiliateLink: string;
  normalizedAt: number;
}

export interface IngestionJob {
  jobId: string;
  feedFileId: string;
  networkType: NetworkType;
  status: IngestionStatus;
  startedAt: number;
  completedAt?: number;
  retryCount: number;
  error?: string;
  metadata: Record<string, unknown>;
}

export interface ParsingResult {
  resultId: string;
  feedFileId: string;
  rawOffersCount: number;
  successfulParses: number;
  failedParses: number;
  parsingErrors: Array<{
    rowNumber: number;
    error: string;
  }>;
  parsedAt: number;
}

export interface ValidationReport {
  reportId: string;
  feedFileId: string;
  normalizedOffersCount: number;
  validOffers: number;
  invalidOffers: number;
  validationErrors: Array<{
    offerId: string;
    errors: string[];
  }>;
  qualityScore: number;
  generatedAt: number;
}

export interface LifecycleEvent {
  eventId: string;
  offerId: string;
  status: OfferLifecycleStatus;
  previousStatus?: OfferLifecycleStatus;
  timestamp: number;
  metadata: Record<string, unknown>;
}

export interface DuplicateMatch {
  matchId: string;
  offerId: string;
  matchedOfferId: string;
  matchType: "fuzzy" | "semantic" | "variant";
  confidence: number;
  matchedAt: number;
}

export interface ImportReport {
  reportId: string;
  ingestionJobId: string;
  importedOffers: number;
  failedOffers: number;
  duplicateOffers: number;
  normalizationStats: {
    providerNamesNormalized: number;
    contractNamesNormalized: number;
    hundefutterNamesNormalized: number;
    storageSizesNormalized: number;
    colorsNormalized: number;
    futterfNamesNormalized: number;
  };
  providerStats: Map<string, number>;
  ingestionDuration: number;
  qualityScore: number;
  generatedAt: number;
}
