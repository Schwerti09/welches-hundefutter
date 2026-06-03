import { SEOEntity, SEOEntityType, SemanticRelationship, InternalLink, SEOMetadata } from "../types";

export class SEOEntityManager {
  private entities: Map<string, SEOEntity> = new Map();

  createDeviceEntity(
    id: string,
    name: string,
    slug: string,
    metadata: SEOMetadata,
    deviceIntelligence: any
  ): SEOEntity {
    const entity: SEOEntity = {
      id,
      type: "device",
      name,
      slug,
      canonicalUrl: `/hunds/${slug}`,
      metadata,
      semanticRelationships: [],
      relatedEntities: [],
      topicCluster: "hundefutters",
      internalLinks: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.entities.set(id, entity);
    return entity;
  }

  createProviderEntity(
    id: string,
    name: string,
    slug: string,
    metadata: SEOMetadata
  ): SEOEntity {
    const entity: SEOEntity = {
      id,
      type: "provider",
      name,
      slug,
      canonicalUrl: `/provider/${slug}`,
      metadata,
      semanticRelationships: [],
      relatedEntities: [],
      topicCluster: "providers",
      internalLinks: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.entities.set(id, entity);
    return entity;
  }

  createContractEntity(
    id: string,
    name: string,
    slug: string,
    metadata: SEOMetadata
  ): SEOEntity {
    const entity: SEOEntity = {
      id,
      type: "contract",
      name,
      slug,
      canonicalUrl: `/vertraege/${slug}`,
      metadata,
      semanticRelationships: [],
      relatedEntities: [],
      topicCluster: "contracts",
      internalLinks: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.entities.set(id, entity);
    return entity;
  }

  createComparisonEntity(
    id: string,
    name: string,
    slug: string,
    metadata: SEOMetadata,
    entityIds: string[]
  ): SEOEntity {
    const entity: SEOEntity = {
      id,
      type: "comparison",
      name,
      slug,
      canonicalUrl: `/vergleich/${slug}`,
      metadata,
      semanticRelationships: entityIds.map((entityId) => ({
        targetEntityId: entityId,
        relationshipType: "related",
        strength: 0.9,
      })),
      relatedEntities: entityIds,
      topicCluster: "comparisons",
      internalLinks: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.entities.set(id, entity);
    return entity;
  }

  createRecommendationGroupEntity(
    id: string,
    name: string,
    slug: string,
    metadata: SEOMetadata,
    entityIds: string[]
  ): SEOEntity {
    const entity: SEOEntity = {
      id,
      type: "recommendation_group",
      name,
      slug,
      canonicalUrl: `/empfehlungen/${slug}`,
      metadata,
      semanticRelationships: entityIds.map((entityId) => ({
        targetEntityId: entityId,
        relationshipType: "related",
        strength: 0.8,
      })),
      relatedEntities: entityIds,
      topicCluster: "recommendations",
      recommendationCluster: slug,
      internalLinks: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.entities.set(id, entity);
    return entity;
  }

  addSemanticRelationship(
    entityId1: string,
    entityId2: string,
    relationshipType: SemanticRelationship["relationshipType"],
    strength: number,
    context?: string
  ): void {
    const entity1 = this.entities.get(entityId1);
    const entity2 = this.entities.get(entityId2);

    if (entity1 && entity2) {
      entity1.semanticRelationships.push({
        targetEntityId: entityId2,
        relationshipType,
        strength,
        context,
      });

      if (!entity1.relatedEntities.includes(entityId2)) {
        entity1.relatedEntities.push(entityId2);
      }

      entity2.semanticRelationships.push({
        targetEntityId: entityId1,
        relationshipType: this.getInverseRelationship(relationshipType),
        strength,
        context,
      });

      if (!entity2.relatedEntities.includes(entityId1)) {
        entity2.relatedEntities.push(entityId1);
      }

      entity1.updatedAt = Date.now();
      entity2.updatedAt = Date.now();
    }
  }

  addInternalLink(
    entityId: string,
    targetUrl: string,
    anchorText: string,
    relevanceScore: number,
    linkType: InternalLink["linkType"],
    context?: string
  ): void {
    const entity = this.entities.get(entityId);
    if (entity) {
      entity.internalLinks.push({
        targetUrl,
        anchorText,
        relevanceScore,
        context,
        linkType,
      });
      entity.updatedAt = Date.now();
    }
  }

  getEntity(entityId: string): SEOEntity | undefined {
    return this.entities.get(entityId);
  }

  getEntitiesByType(type: SEOEntityType): SEOEntity[] {
    return Array.from(this.entities.values()).filter((e) => e.type === type);
  }

  getEntitiesByTopicCluster(topicCluster: string): SEOEntity[] {
    return Array.from(this.entities.values()).filter((e) => e.topicCluster === topicCluster);
  }

  getRelatedEntities(entityId: string): SEOEntity[] {
    const entity = this.entities.get(entityId);
    if (!entity) return [];

    return entity.relatedEntities
      .map((id) => this.entities.get(id))
      .filter((e): e is SEOEntity => e !== undefined);
  }

  updateEntityMetadata(entityId: string, metadata: Partial<SEOMetadata>): void {
    const entity = this.entities.get(entityId);
    if (entity) {
      entity.metadata = { ...entity.metadata, ...metadata };
      entity.updatedAt = Date.now();
    }
  }

  private getInverseRelationship(
    relationshipType: SemanticRelationship["relationshipType"]
  ): SemanticRelationship["relationshipType"] {
    const inverseMap: Record<SemanticRelationship["relationshipType"], SemanticRelationship["relationshipType"]> = {
      parent: "child",
      child: "parent",
      upgrade: "downgrade",
      downgrade: "upgrade",
      similar: "similar",
      related: "related",
      alternative: "alternative",
      provider: "brand",
      brand: "provider",
      feature: "feature",
    };

    return inverseMap[relationshipType] || "related";
  }
}
