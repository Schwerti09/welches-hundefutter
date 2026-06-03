import * as fs from "fs";
import * as path from "path";

export interface DebugOutput {
  normalizedOffers: unknown[];
  duplicateMatches: unknown[];
  validationFailures: unknown[];
  enrichmentOutput: unknown[];
  recommendationOutput: unknown[];
  entityGraph: unknown[];
  seoClusters: unknown[];
  generatedAt: number;
}

export class DebugOutputGenerator {
  private debugOutputPath: string;

  constructor(outputPath: string = "./debug-output") {
    this.debugOutputPath = outputPath;
    this.ensureOutputDirectory();
  }

  private ensureOutputDirectory(): void {
    if (!fs.existsSync(this.debugOutputPath)) {
      fs.mkdirSync(this.debugOutputPath, { recursive: true });
    }
  }

  generateDebugOutput(debugData: DebugOutput): string {
    const outputPath = path.join(this.debugOutputPath, `debug-output-${Date.now()}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(debugData, null, 2));
    return outputPath;
  }

  generateNormalizedJSON(normalizedOffers: unknown[]): string {
    const outputPath = path.join(this.debugOutputPath, `normalized-offers-${Date.now()}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(normalizedOffers, null, 2));
    return outputPath;
  }

  generateDuplicateMatchesJSON(duplicateMatches: unknown[]): string {
    const outputPath = path.join(this.debugOutputPath, `duplicate-matches-${Date.now()}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(duplicateMatches, null, 2));
    return outputPath;
  }

  generateValidationFailuresJSON(validationFailures: unknown[]): string {
    const outputPath = path.join(this.debugOutputPath, `validation-failures-${Date.now()}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(validationFailures, null, 2));
    return outputPath;
  }

  generateEnrichmentOutputJSON(enrichmentOutput: unknown[]): string {
    const outputPath = path.join(this.debugOutputPath, `enrichment-output-${Date.now()}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(enrichmentOutput, null, 2));
    return outputPath;
  }

  generateRecommendationOutputJSON(recommendationOutput: unknown[]): string {
    const outputPath = path.join(this.debugOutputPath, `recommendation-output-${Date.now()}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(recommendationOutput, null, 2));
    return outputPath;
  }

  generateEntityGraphJSON(entityGraph: unknown[]): string {
    const outputPath = path.join(this.debugOutputPath, `entity-graph-${Date.now()}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(entityGraph, null, 2));
    return outputPath;
  }

  generateSEOClustersJSON(seoClusters: unknown[]): string {
    const outputPath = path.join(this.debugOutputPath, `seo-clusters-${Date.now()}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(seoClusters, null, 2));
    return outputPath;
  }

  generateExecutionSummaryJSON(summary: unknown): string {
    const outputPath = path.join(this.debugOutputPath, `execution-summary-${Date.now()}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2));
    return outputPath;
  }

  getDebugOutputPath(): string {
    return this.debugOutputPath;
  }

  clearDebugOutput(): void {
    if (fs.existsSync(this.debugOutputPath)) {
      const files = fs.readdirSync(this.debugOutputPath);
      for (const file of files) {
        fs.unlinkSync(path.join(this.debugOutputPath, file));
      }
    }
  }
}
