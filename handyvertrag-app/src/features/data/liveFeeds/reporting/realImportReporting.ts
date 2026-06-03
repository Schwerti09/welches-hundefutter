import { NormalizedOffer } from "../types";
import { FeedSchemaAnalysis } from "../analysis/feedAnalysisSystem";
import { NormalizationResult } from "../normalization/realNormalizationExecution";
import { ValidationFailure } from "../validation/realValidationPipeline";
import { EnrichmentResult } from "../enrichment/realEnrichmentPipeline";

export interface RealImportReport {
  reportId: string;
  feedId: string;
  executionTime: number;
  feedAnalysis: {
    totalRows: number;
    columns: string[];
    detectedFields: {
      pricingFields: string[];
      providerFields: string[];
      deviceFields: string[];
      affiliateLinkFields: string[];
      cashbackFields: string[];
      contractDurationFields: string[];
      dataVolumeFields: string[];
    };
  };
  providerBreakdown: Map<string, number>;
  deviceBreakdown: Map<string, number>;
  contractBreakdown: Map<string, number>;
  normalizationQuality: {
    totalOffers: number;
    normalizedProviders: number;
    normalizedContracts: number;
    normalizedDevices: number;
    normalizedStorage: number;
    normalizedColors: number;
    normalizedTariffs: number;
  };
  duplicateDetectionQuality: {
    totalOffers: number;
    totalMatches: number;
    totalGroups: number;
    averageConfidence: number;
    matchTypeBreakdown: { fuzzy: number; semantic: number; variant: number };
  };
  validationQuality: {
    totalOffers: number;
    validOffers: number;
    invalidOffers: number;
    failureBreakdown: Map<string, number>;
  };
  enrichmentQuality: {
    totalOffers: number;
    averageRecommendationScore: number;
    averageValueScore: number;
    averageCompatibilityScore: number;
    averageRecommendationSuitability: number;
    topSemanticTags: string[];
    topSegments: string[];
  };
  recommendationReadiness: {
    totalRecommendationClusters: number;
    clusterTypes: string[];
    topClusters: string[];
  };
  seoReadiness: {
    totalSEOClusters: number;
    totalEntities: number;
    totalInternalLinks: number;
    topEntities: string[];
  };
  scalabilityBottlenecks: string[];
  nextOptimizationRecommendations: string[];
  generatedAt: number;
}

export class RealImportReporting {
  private importReports: Map<string, RealImportReport> = new Map();

  generateImportReport(
    feedId: string,
    executionTime: number,
    feedAnalysis: FeedSchemaAnalysis,
    offers: NormalizedOffer[],
    normalizationResults: NormalizationResult[],
    duplicateReport: any,
    validationFailures: ValidationFailure[],
    enrichmentResults: EnrichmentResult[],
    recommendationClusters: any[],
    seoClusters: any[]
  ): RealImportReport {
    const providerBreakdown = this.calculateProviderBreakdown(offers);
    const deviceBreakdown = this.calculateDeviceBreakdown(offers);
    const contractBreakdown = this.calculateContractBreakdown(offers);

    const normalizationQuality = this.calculateNormalizationQuality(normalizationResults);
    const duplicateDetectionQuality = duplicateReport;
    const validationQuality = this.calculateValidationQuality(offers, validationFailures);
    const enrichmentQuality = this.calculateEnrichmentQuality(enrichmentResults);
    const recommendationReadiness = this.calculateRecommendationReadiness(recommendationClusters);
    const seoReadiness = this.calculateSEOReadiness(seoClusters);

    const scalabilityBottlenecks = this.identifyScalabilityBottlenecks(feedAnalysis, offers);
    const nextOptimizationRecommendations = this.generateOptimizationRecommendations(feedAnalysis, normalizationQuality, duplicateDetectionQuality, validationQuality);

    const report: RealImportReport = {
      reportId: `report-${feedId}-${Date.now()}`,
      feedId,
      executionTime,
      feedAnalysis: {
        totalRows: feedAnalysis.totalRows,
        columns: feedAnalysis.columns,
        detectedFields: feedAnalysis.detectedFields,
      },
      providerBreakdown,
      deviceBreakdown,
      contractBreakdown,
      normalizationQuality,
      duplicateDetectionQuality,
      validationQuality,
      enrichmentQuality,
      recommendationReadiness,
      seoReadiness,
      scalabilityBottlenecks,
      nextOptimizationRecommendations,
      generatedAt: Date.now(),
    };

    this.importReports.set(report.reportId, report);
    return report;
  }

  private calculateProviderBreakdown(offers: NormalizedOffer[]): Map<string, number> {
    const breakdown = new Map<string, number>();

    for (const offer of offers) {
      const count = breakdown.get(offer.providerName) || 0;
      breakdown.set(offer.providerName, count + 1);
    }

    return breakdown;
  }

  private calculateDeviceBreakdown(offers: NormalizedOffer[]): Map<string, number> {
    const breakdown = new Map<string, number>();

    for (const offer of offers) {
      const count = breakdown.get(offer.smartphoneName) || 0;
      breakdown.set(offer.smartphoneName, count + 1);
    }

    return breakdown;
  }

  private calculateContractBreakdown(offers: NormalizedOffer[]): Map<string, number> {
    const breakdown = new Map<string, number>();

    for (const offer of offers) {
      const count = breakdown.get(offer.contractName) || 0;
      breakdown.set(offer.contractName, count + 1);
    }

    return breakdown;
  }

  private calculateNormalizationQuality(normalizationResults: NormalizationResult[]): {
    totalOffers: number;
    normalizedProviders: number;
    normalizedContracts: number;
    normalizedDevices: number;
    normalizedStorage: number;
    normalizedColors: number;
    normalizedTariffs: number;
  } {
    const totalOffers = normalizationResults.length;
    const normalizedProviders = normalizationResults.filter(r => r.originalProvider !== r.normalizedProvider).length;
    const normalizedContracts = normalizationResults.filter(r => r.originalContract !== r.normalizedContract).length;
    const normalizedDevices = normalizationResults.filter(r => r.originalDevice !== r.normalizedDevice).length;
    const normalizedStorage = normalizationResults.filter(r => r.originalStorage !== r.normalizedStorage).length;
    const normalizedColors = normalizationResults.filter(r => r.originalColor !== r.normalizedColor).length;
    const normalizedTariffs = normalizationResults.filter(r => r.originalTariff !== r.normalizedTariff).length;

    return {
      totalOffers,
      normalizedProviders,
      normalizedContracts,
      normalizedDevices,
      normalizedStorage,
      normalizedColors,
      normalizedTariffs,
    };
  }

  private calculateValidationQuality(offers: NormalizedOffer[], validationFailures: ValidationFailure[]): {
    totalOffers: number;
    validOffers: number;
    invalidOffers: number;
    failureBreakdown: Map<string, number>;
  } {
    const totalOffers = offers.length;
    const invalidOffers = new Set(validationFailures.map(f => f.offerId)).size;
    const validOffers = totalOffers - invalidOffers;

    const failureBreakdown = new Map<string, number>();
    for (const failure of validationFailures) {
      const count = failureBreakdown.get(failure.failureType) || 0;
      failureBreakdown.set(failure.failureType, count + 1);
    }

    return {
      totalOffers,
      validOffers,
      invalidOffers,
      failureBreakdown,
    };
  }

  private calculateEnrichmentQuality(enrichmentResults: EnrichmentResult[]): {
    totalOffers: number;
    averageRecommendationScore: number;
    averageValueScore: number;
    averageCompatibilityScore: number;
    averageRecommendationSuitability: number;
    topSemanticTags: string[];
    topSegments: string[];
  } {
    if (enrichmentResults.length === 0) {
      return {
        totalOffers: 0,
        averageRecommendationScore: 0,
        averageValueScore: 0,
        averageCompatibilityScore: 0,
        averageRecommendationSuitability: 0,
        topSemanticTags: [],
        topSegments: [],
      };
    }

    const averageRecommendationScore = enrichmentResults.reduce((sum, r) => sum + r.recommendationScore, 0) / enrichmentResults.length;
    const averageValueScore = enrichmentResults.reduce((sum, r) => sum + r.valueScore, 0) / enrichmentResults.length;
    const averageCompatibilityScore = enrichmentResults.reduce((sum, r) => sum + r.compatibilityScore, 0) / enrichmentResults.length;
    const averageRecommendationSuitability = enrichmentResults.reduce((sum, r) => sum + r.recommendationSuitability, 0) / enrichmentResults.length;

    const tagCounts = new Map<string, number>();
    const segmentCounts = new Map<string, number>();

    for (const result of enrichmentResults) {
      for (const tag of result.semanticTags) {
        const count = tagCounts.get(tag) || 0;
        tagCounts.set(tag, count + 1);
      }

      for (const segment of result.segmentMatching) {
        const count = segmentCounts.get(segment) || 0;
        segmentCounts.set(segment, count + 1);
      }
    }

    const topSemanticTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);

    const topSegments = Array.from(segmentCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([segment]) => segment);

    return {
      totalOffers: enrichmentResults.length,
      averageRecommendationScore,
      averageValueScore,
      averageCompatibilityScore,
      averageRecommendationSuitability,
      topSemanticTags,
      topSegments,
    };
  }

  private calculateRecommendationReadiness(recommendationClusters: any[]): {
    totalRecommendationClusters: number;
    clusterTypes: string[];
    topClusters: string[];
  } {
    const clusterTypes = Array.from(new Set(recommendationClusters.map(c => c.clusterType)));
    const topClusters = recommendationClusters
      .sort((a, b) => b.clusterScore - a.clusterScore)
      .slice(0, 5)
      .map(c => c.clusterName);

    return {
      totalRecommendationClusters: recommendationClusters.length,
      clusterTypes,
      topClusters,
    };
  }

  private calculateSEOReadiness(seoClusters: any[]): {
    totalSEOClusters: number;
    totalEntities: number;
    totalInternalLinks: number;
    topEntities: string[];
  } {
    const totalEntities = seoClusters.reduce((sum, c) => sum + c.entities.length, 0);
    const totalInternalLinks = seoClusters.reduce((sum, c) => sum + c.internalLinks.length, 0);
    const topEntities = seoClusters
      .sort((a, b) => b.entities.length - a.entities.length)
      .slice(0, 5)
      .map(c => c.clusterName);

    return {
      totalSEOClusters: seoClusters.length,
      totalEntities,
      totalInternalLinks,
      topEntities,
    };
  }

  private identifyScalabilityBottlenecks(feedAnalysis: FeedSchemaAnalysis, offers: NormalizedOffer[]): string[] {
    const bottlenecks: string[] = [];

    if (feedAnalysis.totalRows > 100000) {
      bottlenecks.push("Large feed size - consider streaming processing");
    }

    if (feedAnalysis.detectedFields.pricingFields.length === 0) {
      bottlenecks.push("No pricing fields detected - manual mapping required");
    }

    if (feedAnalysis.detectedFields.providerFields.length === 0) {
      bottlenecks.push("No provider fields detected - manual mapping required");
    }

    if (offers.length > 10000) {
      bottlenecks.push("Large number of offers - consider chunked processing");
    }

    return bottlenecks;
  }

  private generateOptimizationRecommendations(feedAnalysis: FeedSchemaAnalysis, normalizationQuality: any, duplicateDetectionQuality: any, validationQuality: any): string[] {
    const recommendations: string[] = [];

    if (normalizationQuality.normalizedProviders > normalizationQuality.totalOffers * 0.5) {
      recommendations.push("Implement semantic normalization for provider names");
    }

    if (normalizationQuality.normalizedDevices > normalizationQuality.totalOffers * 0.5) {
      recommendations.push("Implement semantic normalization for device names");
    }

    if (duplicateDetectionQuality.totalMatches > duplicateDetectionQuality.totalOffers * 0.3) {
      recommendations.push("Improve duplicate detection algorithm to reduce false positives");
    }

    if (validationQuality.invalidOffers > validationQuality.totalOffers * 0.1) {
      recommendations.push("Investigate validation failures and improve data quality");
    }

    if (feedAnalysis.detectedFields.pricingFields.length === 0) {
      recommendations.push("Add manual pricing field mapping");
    }

    if (feedAnalysis.detectedFields.providerFields.length === 0) {
      recommendations.push("Add manual provider field mapping");
    }

    return recommendations;
  }

  getImportReport(reportId: string): RealImportReport | undefined {
    return this.importReports.get(reportId);
  }

  getAllImportReports(): RealImportReport[] {
    return Array.from(this.importReports.values());
  }

  getLatestImportReport(): RealImportReport | undefined {
    const reports = this.getAllImportReports();
    if (reports.length === 0) return undefined;

    return reports.sort((a, b) => b.generatedAt - a.generatedAt)[0];
  }
}
