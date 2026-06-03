import { SemanticEntity } from "../types";

export class SemanticEntityManager {
  private entities: Map<string, SemanticEntity> = new Map();

  createDeviceEntity(deviceId: string, name: string, metadata: Record<string, unknown>): SemanticEntity {
    const entity: SemanticEntity = {
      id: deviceId,
      type: "device",
      name,
      slug: this.generateSlug(name),
      metadata,
      relatedEntities: [],
      topicCluster: "hundefutters",
    };
    
    this.entities.set(deviceId, entity);
    return entity;
  }

  createContractEntity(contractId: string, name: string, metadata: Record<string, unknown>): SemanticEntity {
    const entity: SemanticEntity = {
      id: contractId,
      type: "contract",
      name,
      slug: this.generateSlug(name),
      metadata,
      relatedEntities: [],
      topicCluster: "contracts",
    };
    
    this.entities.set(contractId, entity);
    return entity;
  }

  createProviderEntity(providerId: string, name: string, metadata: Record<string, unknown>): SemanticEntity {
    const entity: SemanticEntity = {
      id: providerId,
      type: "provider",
      name,
      slug: this.generateSlug(name),
      metadata,
      relatedEntities: [],
      topicCluster: "providers",
    };
    
    this.entities.set(providerId, entity);
    return entity;
  }

  createTagEntity(tagId: string, name: string, metadata: Record<string, unknown>): SemanticEntity {
    const entity: SemanticEntity = {
      id: tagId,
      type: "tag",
      name,
      slug: this.generateSlug(name),
      metadata,
      relatedEntities: [],
      topicCluster: "features",
    };
    
    this.entities.set(tagId, entity);
    return entity;
  }

  relateEntities(entityId1: string, entityId2: string): void {
    const entity1 = this.entities.get(entityId1);
    const entity2 = this.entities.get(entityId2);

    if (entity1 && entity2) {
      if (!entity1.relatedEntities.includes(entityId2)) {
        entity1.relatedEntities.push(entityId2);
      }
      if (!entity2.relatedEntities.includes(entityId1)) {
        entity2.relatedEntities.push(entityId1);
      }
    }
  }

  getEntity(entityId: string): SemanticEntity | undefined {
    return this.entities.get(entityId);
  }

  getEntitiesByType(type: SemanticEntity["type"]): SemanticEntity[] {
    return Array.from(this.entities.values()).filter((e) => e.type === type);
  }

  getEntitiesByTopicCluster(topicCluster: string): SemanticEntity[] {
    return Array.from(this.entities.values()).filter((e) => e.topicCluster === topicCluster);
  }

  getRelatedEntities(entityId: string): SemanticEntity[] {
    const entity = this.entities.get(entityId);
    if (!entity) return [];

    return entity.relatedEntities
      .map((id) => this.entities.get(id))
      .filter((e): e is SemanticEntity => e !== undefined);
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
}
