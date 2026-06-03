import { SEOQualityScore, QualityIssue, ProgrammaticPage } from "../types";

export class ProgrammaticRulesEngine {
  private minContentLength = 300;
  private minUniquenessScore = 70;
  private minQualityScore = 60;

  validatePage(page: ProgrammaticPage): SEOQualityScore {
    const issues: QualityIssue[] = [];

    // Check content quality
    const contentQuality = this.checkContentQuality(page);
    if (contentQuality < 60) {
      issues.push({
        type: "thin_content",
        severity: "high",
        message: "Page has insufficient content quality",
      });
    }

    // Check uniqueness
    const uniquenessScore = this.checkUniqueness(page);
    if (uniquenessScore < this.minUniquenessScore) {
      issues.push({
        type: "low_uniqueness",
        severity: "medium",
        message: "Page lacks sufficient unique content",
      });
    }

    // Check semantic depth
    const semanticDepth = this.checkSemanticDepth(page);
    if (semanticDepth < 50) {
      issues.push({
        type: "thin_content",
        severity: "medium",
        message: "Page lacks semantic depth",
      });
    }

    // Check EEAT
    const eeatScore = this.checkEEAT(page);
    if (eeatScore < 50) {
      issues.push({
        type: "missing_eeat",
        severity: "medium",
        message: "Page lacks EEAT signals",
      });
    }

    // Check internal linking
    const internalLinkingScore = this.checkInternalLinking(page);
    if (internalLinkingScore < 50) {
      issues.push({
        type: "poor_linking",
        severity: "low",
        message: "Page has poor internal linking",
      });
    }

    // Check for duplicates
    const isDuplicate = this.checkForDuplicates(page);
    if (isDuplicate) {
      issues.push({
        type: "duplicate",
        severity: "high",
        message: "Page appears to be a duplicate",
      });
    }

    // Check for outdated content
    const isOutdated = this.checkIfOutdated(page);
    if (isOutdated) {
      issues.push({
        type: "outdated",
        severity: "medium",
        message: "Page content may be outdated",
      });
    }

    const overallScore = this.calculateOverallScore(
      contentQuality,
      uniquenessScore,
      semanticDepth,
      eeatScore,
      internalLinkingScore
    );

    return {
      entityId: page.id,
      contentQuality,
      uniquenessScore,
      semanticDepth,
      eeatScore,
      internalLinkingScore,
      overallScore,
      issues,
    };
  }

  shouldGeneratePage(page: ProgrammaticPage): boolean {
    const validation = this.validatePage(page);

    // Block pages with high severity issues
    const hasHighSeverityIssues = validation.issues.some(
      (issue) => issue.severity === "high"
    );

    if (hasHighSeverityIssues) {
      return false;
    }

    // Block pages with low overall score
    if (validation.overallScore < this.minQualityScore) {
      return false;
    }

    return true;
  }

  preventDuplicatePages(existingPages: ProgrammaticPage[], newPage: ProgrammaticPage): boolean {
    for (const existingPage of existingPages) {
      if (this.calculateSimilarity(existingPage, newPage) > 0.9) {
        return true; // Duplicate detected
      }
    }
    return false;
  }

  preventNearIdenticalPages(existingPages: ProgrammaticPage[], newPage: ProgrammaticPage): boolean {
    for (const existingPage of existingPages) {
      if (this.calculateSimilarity(existingPage, newPage) > 0.85) {
        return true; // Near-identical detected
      }
    }
    return false;
  }

  checkKeywordStuffing(content: string, keywords: string[]): boolean {
    const keywordCount = keywords.reduce((count, keyword) => {
      const regex = new RegExp(keyword.toLowerCase(), "gi");
      const matches = content.match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);

    const wordCount = content.split(/\s+/).length;
    const keywordDensity = keywordCount / wordCount;

    return keywordDensity > 0.05; // 5% threshold
  }

  private checkContentQuality(page: ProgrammaticPage): number {
    const totalContent = page.contentBlocks.reduce(
      (total, block) => total + block.content.length,
      0
    );

    if (totalContent < this.minContentLength) return 30;
    if (totalContent < 500) return 50;
    if (totalContent < 1000) return 70;
    return 90;
  }

  private checkUniqueness(page: ProgrammaticPage): number {
    return page.uniquenessScore;
  }

  private checkSemanticDepth(page: ProgrammaticPage): number {
    const entityCount = page.entities.length;
    const blockCount = page.contentBlocks.length;

    if (entityCount < 2) return 30;
    if (blockCount < 3) return 50;
    if (entityCount < 3 || blockCount < 5) return 70;
    return 90;
  }

  private checkEEAT(page: ProgrammaticPage): number {
    // Check for EEAT-related content blocks
    const hasAuthorInfo = page.contentBlocks.some((block) =>
      block.content.toLowerCase().includes("autor")
    );
    const hasReviewInfo = page.contentBlocks.some((block) =>
      block.content.toLowerCase().includes("review")
    );
    const hasSourceInfo = page.contentBlocks.some((block) =>
      block.content.toLowerCase().includes("quelle")
    );

    let score = 30;
    if (hasAuthorInfo) score += 25;
    if (hasReviewInfo) score += 25;
    if (hasSourceInfo) score += 20;

    return score;
  }

  private checkInternalLinking(page: ProgrammaticPage): number {
    // Check for internal links in content blocks
    const hasLinks = page.contentBlocks.some((block) =>
      block.content.includes("href=") || block.content.includes("[")
    );

    return hasLinks ? 80 : 40;
  }

  private checkForDuplicates(page: ProgrammaticPage): boolean {
    // Simplified duplicate check
    return page.uniquenessScore < 40;
  }

  private checkIfOutdated(page: ProgrammaticPage): boolean {
    const now = Date.now();
    const daysSinceUpdate = (now - page.updatedAt) / (1000 * 60 * 60 * 24);
    return daysSinceUpdate > 90; // 90 days threshold
  }

  private calculateOverallScore(
    contentQuality: number,
    uniquenessScore: number,
    semanticDepth: number,
    eeatScore: number,
    internalLinkingScore: number
  ): number {
    return Math.round(
      (contentQuality * 0.3 +
        uniquenessScore * 0.25 +
        semanticDepth * 0.2 +
        eeatScore * 0.15 +
        internalLinkingScore * 0.1)
    );
  }

  private calculateSimilarity(page1: ProgrammaticPage, page2: ProgrammaticPage): number {
    // Simplified similarity check based on entities
    const entityOverlap = page1.entities.filter((id) =>
      page2.entities.includes(id)
    ).length;

    const maxEntities = Math.max(page1.entities.length, page2.entities.length);
    return entityOverlap / maxEntities;
  }
}
