import { InternalLinkingScore, InternalLink } from "../types";

export class InternalLinkingEngine {
  calculateLinkScore(
    sourceEntityId: string,
    targetEntityId: string,
    sourceEntity: any,
    targetEntity: any
  ): InternalLinkingScore {
    const semanticSimilarity = this.calculateSemanticSimilarity(sourceEntity, targetEntity);
    const recommendationScore = this.calculateRecommendationScore(sourceEntity, targetEntity);
    const topicScore = this.calculateTopicScore(sourceEntity, targetEntity);
    const overallScore = (semanticSimilarity * 0.4 + recommendationScore * 0.3 + topicScore * 0.3) * 100;

    return {
      sourceEntityId,
      targetEntityId,
      semanticSimilarity: Math.round(semanticSimilarity * 100) / 100,
      recommendationScore: Math.round(recommendationScore * 100) / 100,
      topicScore: Math.round(topicScore * 100) / 100,
      overallScore: Math.round(overallScore * 100) / 100,
      anchorText: this.generateAnchorText(targetEntity),
      context: this.determineContext(sourceEntity, targetEntity),
    };
  }

  private calculateSemanticSimilarity(entity1: any, entity2: any): number {
    if (entity1.type === entity2.type) return 0.8;
    if (entity1.topicCluster === entity2.topicCluster) return 0.6;
    if (entity1.brand === entity2.brand) return 0.7;
    if (entity1.provider === entity2.provider) return 0.7;
    return 0.3;
  }

  private calculateRecommendationScore(entity1: any, entity2: any): number {
    if (entity1.relatedEntities?.includes(entity2.id)) return 0.9;
    if (entity1.semanticRelationships?.some((r: any) => r.targetEntityId === entity2.id)) return 0.85;
    return 0.4;
  }

  private calculateTopicScore(entity1: any, entity2: any): number {
    if (entity1.topicCluster === entity2.topicCluster) return 0.9;
    if (entity1.recommendationCluster === entity2.recommendationCluster) return 0.8;
    return 0.3;
  }

  private generateAnchorText(entity: any): string {
    if (entity.type === "device") return entity.name;
    if (entity.type === "provider") return `${entity.name} Verträge`;
    if (entity.type === "contract") return entity.name;
    if (entity.type === "comparison") return `Vergleich: ${entity.name}`;
    return entity.name;
  }

  private determineContext(sourceEntity: any, targetEntity: any): string {
    if (sourceEntity.type === "device" && targetEntity.type === "contract") {
      return "device-contract";
    }
    if (sourceEntity.type === "contract" && targetEntity.type === "device") {
      return "contract-device";
    }
    if (sourceEntity.type === "device" && targetEntity.type === "device") {
      return "device-device";
    }
    if (sourceEntity.type === "comparison") {
      return "comparison";
    }
    return "general";
  }

  generateInternalLinks(
    sourceEntity: any,
    allEntities: Map<string, any>,
    maxLinks: number = 5
  ): InternalLink[] {
    const scores: InternalLinkingScore[] = [];

    for (const [entityId, targetEntity] of allEntities) {
      if (entityId === sourceEntity.id) continue;

      const score = this.calculateLinkScore(sourceEntity.id, entityId, sourceEntity, targetEntity);
      scores.push(score);
    }

    const topScores = scores
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, maxLinks);

    return topScores.map((score) => ({
      targetUrl: allEntities.get(score.targetEntityId)?.canonicalUrl || "",
      anchorText: score.anchorText,
      relevanceScore: score.overallScore / 100,
      context: score.context,
      linkType: this.determineLinkType(score.context),
    }));
  }

  private determineLinkType(context: string): InternalLink["linkType"] {
    if (context === "comparison") return "semantic";
    if (context.includes("device") || context.includes("contract")) return "recommendation";
    return "semantic";
  }
}
