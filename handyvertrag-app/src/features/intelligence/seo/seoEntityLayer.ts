import { SemanticEntity } from "../types";

export class SEOEntityLayer {
  private entities: Map<string, SemanticEntity> = new Map();

  addEntity(entity: SemanticEntity): void {
    this.entities.set(entity.id, entity);
  }

  generateInternalLinks(entityId: string): Array<{ targetId: string; anchorText: string; relevance: number }> {
    const entity = this.entities.get(entityId);
    if (!entity) return [];

    const relatedEntities = entity.relatedEntities
      .map((id) => this.entities.get(id))
      .filter((e): e is SemanticEntity => e !== undefined);

    return relatedEntities.map((related) => ({
      targetId: related.id,
      anchorText: related.name,
      relevance: this.calculateRelevance(entity, related),
    }));
  }

  generateTopicClusters(): Map<string, string[]> {
    const clusters = new Map<string, string[]>();

    for (const entity of this.entities.values()) {
      if (entity.topicCluster) {
        const cluster = clusters.get(entity.topicCluster) || [];
        cluster.push(entity.id);
        clusters.set(entity.topicCluster, cluster);
      }
    }

    return clusters;
  }

  generateRecommendationClusters(): Map<string, string[]> {
    const clusters = new Map<string, string[]>();

    for (const entity of this.entities.values()) {
      if (entity.type === "device") {
        const metadata = entity.metadata as any;
        if (metadata.semanticTags) {
          for (const tag of metadata.semanticTags) {
            const cluster = clusters.get(tag) || [];
            cluster.push(entity.id);
            clusters.set(tag, cluster);
          }
        }
      }
    }

    return clusters;
  }

  generateDeviceRelationships(): Map<string, Array<{ targetId: string; relationship: string }>> {
    const relationships = new Map<string, Array<{ targetId: string; relationship: string }>>();

    for (const entity of this.entities.values()) {
      if (entity.type === "device") {
        const metadata = entity.metadata as any;
        const deviceRelationships: Array<{ targetId: string; relationship: string }> = [];

        // Brand relationships
        if (metadata.brand) {
          const brandEntities = this.getEntitiesByMetadata("brand", metadata.brand);
          for (const brandEntity of brandEntities) {
            if (brandEntity.id !== entity.id) {
              deviceRelationships.push({ targetId: brandEntity.id, relationship: "same-brand" });
            }
          }
        }

        // Classification relationships
        if (metadata.classification) {
          const classificationEntities = this.getEntitiesByMetadata("classification", metadata.classification);
          for (const classEntity of classificationEntities) {
            if (classEntity.id !== entity.id) {
              deviceRelationships.push({ targetId: classEntity.id, relationship: "same-class" });
            }
          }
        }

        relationships.set(entity.id, deviceRelationships);
      }
    }

    return relationships;
  }

  generateProviderRelationships(): Map<string, Array<{ targetId: string; relationship: string }>> {
    const relationships = new Map<string, Array<{ targetId: string; relationship: string }>>();

    for (const entity of this.entities.values()) {
      if (entity.type === "provider") {
        const providerRelationships: Array<{ targetId: string; relationship: string }> = [];

        // Find contracts from this provider
        for (const otherEntity of this.entities.values()) {
          if (otherEntity.type === "contract") {
            const metadata = otherEntity.metadata as any;
            if (metadata.provider === entity.name) {
              providerRelationships.push({ targetId: otherEntity.id, relationship: "offers-contract" });
            }
          }
        }

        relationships.set(entity.id, providerRelationships);
      }
    }

    return relationships;
  }

  private calculateRelevance(entity1: SemanticEntity, entity2: SemanticEntity): number {
    if (entity1.type === entity2.type) return 0.7;
    if (entity1.topicCluster === entity2.topicCluster) return 0.5;
    return 0.3;
  }

  private getEntitiesByMetadata(key: string, value: string): SemanticEntity[] {
    return Array.from(this.entities.values()).filter(
      (e) => e.metadata[key as string] === value
    );
  }
}
