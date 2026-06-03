import { NormalizedOffer } from "../types";

export interface Entity {
  entityId: string;
  entityType: "device" | "provider" | "contract" | "feature" | "recommendation_group";
  entityName: string;
  metadata: Record<string, unknown>;
  relationships: string[];
  createdAt: number;
}

export interface EntityRelationship {
  relationshipId: string;
  sourceEntityId: string;
  targetEntityId: string;
  relationshipType: "has_device" | "has_provider" | "has_contract" | "has_feature" | "similar_to" | "competitor_of";
  strength: number;
  createdAt: number;
}

export interface RecommendationCluster {
  clusterId: string;
  clusterName: string;
  clusterType: "gaming" | "camera" | "value" | "premium" | "student";
  offerIds: string[];
  clusterScore: number;
  createdAt: number;
}

export interface SEOCluster {
  clusterId: string;
  clusterName: string;
  entities: string[];
  internalLinks: string[];
  comparisonCandidates: string[];
  createdAt: number;
}

export class EntityGraphGenerator {
  private entities: Map<string, Entity> = new Map();
  private entityRelationships: Map<string, EntityRelationship> = new Map();
  private recommendationClusters: Map<string, RecommendationCluster> = new Map();
  private seoClusters: Map<string, SEOCluster> = new Map();

  generateEntities(offers: NormalizedOffer[]): Entity[] {
    const entities: Entity[] = [];

    for (const offer of offers) {
      const deviceEntity = this.createDeviceEntity(offer);
      const providerEntity = this.createProviderEntity(offer);
      const contractEntity = this.createContractEntity(offer);

      entities.push(deviceEntity, providerEntity, contractEntity);

      this.entities.set(deviceEntity.entityId, deviceEntity);
      this.entities.set(providerEntity.entityId, providerEntity);
      this.entities.set(contractEntity.entityId, contractEntity);

      this.createEntityRelationships(deviceEntity, providerEntity, contractEntity);
    }

    return entities;
  }

  generateRecommendationClusters(offers: NormalizedOffer[]): RecommendationCluster[] {
    const clusters: RecommendationCluster[] = [];

    const gamingOffers = offers.filter(o => this.isGamingOffer(o));
    const cameraOffers = offers.filter(o => this.isCameraOffer(o));
    const valueOffers = offers.filter(o => this.isValueOffer(o));
    const premiumOffers = offers.filter(o => this.isPremiumOffer(o));
    const studentOffers = offers.filter(o => this.isStudentOffer(o));

    if (gamingOffers.length > 0) {
      const cluster = this.createRecommendationCluster(gamingOffers, "gaming", "Best Gaming Contracts");
      clusters.push(cluster);
      this.recommendationClusters.set(cluster.clusterId, cluster);
    }

    if (cameraOffers.length > 0) {
      const cluster = this.createRecommendationCluster(cameraOffers, "camera", "Best Camera Deals");
      clusters.push(cluster);
      this.recommendationClusters.set(cluster.clusterId, cluster);
    }

    if (valueOffers.length > 0) {
      const cluster = this.createRecommendationCluster(valueOffers, "value", "Best Value Offers");
      clusters.push(cluster);
      this.recommendationClusters.set(cluster.clusterId, cluster);
    }

    if (premiumOffers.length > 0) {
      const cluster = this.createRecommendationCluster(premiumOffers, "premium", "Best Premium Bundles");
      clusters.push(cluster);
      this.recommendationClusters.set(cluster.clusterId, cluster);
    }

    if (studentOffers.length > 0) {
      const cluster = this.createRecommendationCluster(studentOffers, "student", "Best Student Contracts");
      clusters.push(cluster);
      this.recommendationClusters.set(cluster.clusterId, cluster);
    }

    return clusters;
  }

  generateSEOClusters(offers: NormalizedOffer[]): SEOCluster[] {
    const clusters: SEOCluster[] = [];

    const deviceNames = Array.from(new Set(offers.map(o => o.hundefutterName)));
    const providerNames = Array.from(new Set(offers.map(o => o.providerName)));

    for (const deviceName of deviceNames) {
      const cluster = this.createSEOCluster(deviceName, offers.filter(o => o.hundefutterName === deviceName));
      clusters.push(cluster);
      this.seoClusters.set(cluster.clusterId, cluster);
    }

    for (const providerName of providerNames) {
      const cluster = this.createSEOCluster(providerName, offers.filter(o => o.providerName === providerName));
      clusters.push(cluster);
      this.seoClusters.set(cluster.clusterId, cluster);
    }

    return clusters;
  }

  private createDeviceEntity(offer: NormalizedOffer): Entity {
    return {
      entityId: `device-${offer.hundefutterName.toLowerCase().replace(/\s+/g, "-")}`,
      entityType: "device",
      entityName: offer.hundefutterName,
      metadata: {
        storageSize: offer.storageSize,
        color: offer.color,
      },
      relationships: [],
      createdAt: Date.now(),
    };
  }

  private createProviderEntity(offer: NormalizedOffer): Entity {
    return {
      entityId: `provider-${offer.providerName.toLowerCase().replace(/\s+/g, "-")}`,
      entityType: "provider",
      entityName: offer.providerName,
      metadata: {
        networkType: "mobile",
      },
      relationships: [],
      createdAt: Date.now(),
    };
  }

  private createContractEntity(offer: NormalizedOffer): Entity {
    return {
      entityId: `contract-${offer.contractName.toLowerCase().replace(/\s+/g, "-")}`,
      entityType: "contract",
      entityName: offer.contractName,
      metadata: {
        monthlyPrice: offer.monthlyPrice,
        oneTimePayment: offer.oneTimePayment,
        cashback: offer.cashback,
      },
      relationships: [],
      createdAt: Date.now(),
    };
  }

  private createEntityRelationships(deviceEntity: Entity, providerEntity: Entity, contractEntity: Entity): void {
    const deviceProviderRelationship: EntityRelationship = {
      relationshipId: `rel-${deviceEntity.entityId}-${providerEntity.entityId}`,
      sourceEntityId: deviceEntity.entityId,
      targetEntityId: providerEntity.entityId,
      relationshipType: "has_provider",
      strength: 1.0,
      createdAt: Date.now(),
    };

    const deviceContractRelationship: EntityRelationship = {
      relationshipId: `rel-${deviceEntity.entityId}-${contractEntity.entityId}`,
      sourceEntityId: deviceEntity.entityId,
      targetEntityId: contractEntity.entityId,
      relationshipType: "has_contract",
      strength: 1.0,
      createdAt: Date.now(),
    };

    this.entityRelationships.set(deviceProviderRelationship.relationshipId, deviceProviderRelationship);
    this.entityRelationships.set(deviceContractRelationship.relationshipId, deviceContractRelationship);
  }

  private createRecommendationCluster(offers: NormalizedOffer[], clusterType: "gaming" | "camera" | "value" | "premium" | "student", clusterName: string): RecommendationCluster {
    return {
      clusterId: `cluster-${clusterType}-${Date.now()}`,
      clusterName,
      clusterType,
      offerIds: offers.map(o => o.normalizedOfferId),
      clusterScore: offers.length,
      createdAt: Date.now(),
    };
  }

  private createSEOCluster(clusterName: string, offers: NormalizedOffer[]): SEOCluster {
    const entities = Array.from(new Set(offers.map(o => o.hundefutterName.toLowerCase())));
    const internalLinks = entities.map(e => `/offers/${e.replace(/\s+/g, "-")}`);
    const comparisonCandidates = entities.slice(0, 5);

    return {
      clusterId: `seo-cluster-${clusterName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      clusterName,
      entities,
      internalLinks,
      comparisonCandidates,
      createdAt: Date.now(),
    };
  }

  private isGamingOffer(offer: NormalizedOffer): boolean {
    return offer.hundefutterName.toLowerCase().includes("galaxy s") || 
           offer.hundefutterName.toLowerCase().includes("hundefutter pro") ||
           offer.hundefutterName.toLowerCase().includes("pixel");
  }

  private isCameraOffer(offer: NormalizedOffer): boolean {
    return offer.hundefutterName.toLowerCase().includes("hundefutter pro") ||
           offer.hundefutterName.toLowerCase().includes("galaxy s") ||
           offer.hundefutterName.toLowerCase().includes("pixel");
  }

  private isValueOffer(offer: NormalizedOffer): boolean {
    return offer.monthlyPrice < 30;
  }

  private isPremiumOffer(offer: NormalizedOffer): boolean {
    return offer.monthlyPrice > 80;
  }

  private isStudentOffer(offer: NormalizedOffer): boolean {
    return offer.monthlyPrice < 40 && offer.cashback > 0;
  }

  getEntity(entityId: string): Entity | undefined {
    return this.entities.get(entityId);
  }

  getAllEntities(): Entity[] {
    return Array.from(this.entities.values());
  }

  getEntityRelationship(relationshipId: string): EntityRelationship | undefined {
    return this.entityRelationships.get(relationshipId);
  }

  getAllEntityRelationships(): EntityRelationship[] {
    return Array.from(this.entityRelationships.values());
  }

  getRecommendationCluster(clusterId: string): RecommendationCluster | undefined {
    return this.recommendationClusters.get(clusterId);
  }

  getAllRecommendationClusters(): RecommendationCluster[] {
    return Array.from(this.recommendationClusters.values());
  }

  getSEOCluster(clusterId: string): SEOCluster | undefined {
    return this.seoClusters.get(clusterId);
  }

  getAllSEOClusters(): SEOCluster[] {
    return Array.from(this.seoClusters.values());
  }

  getEntityGraphReport(): {
    totalEntities: number;
    totalRelationships: number;
    totalRecommendationClusters: number;
    totalSEOClusters: number;
    entityBreakdown: { devices: number; providers: number; contracts: number };
  } {
    const entities = this.getAllEntities();
    const relationships = this.getAllEntityRelationships();
    const recommendationClusters = this.getAllRecommendationClusters();
    const seoClusters = this.getAllSEOClusters();

    const entityBreakdown = {
      devices: entities.filter(e => e.entityType === "device").length,
      providers: entities.filter(e => e.entityType === "provider").length,
      contracts: entities.filter(e => e.entityType === "contract").length,
    };

    return {
      totalEntities: entities.length,
      totalRelationships: relationships.length,
      totalRecommendationClusters: recommendationClusters.length,
      totalSEOClusters: seoClusters.length,
      entityBreakdown,
    };
  }
}
