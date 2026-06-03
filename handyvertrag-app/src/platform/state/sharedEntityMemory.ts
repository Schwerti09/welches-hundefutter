export class SharedEntityMemory {
  private entityMemoryGraph: Map<string, EntityMemoryNode> = new Map();
  private entitySync: Map<string, SyncStatus> = new Map();

  createEntityNode(entityId: string, entityType: string, data: Record<string, unknown>): EntityMemoryNode {
    const node: EntityMemoryNode = {
      nodeId: `node-${entityId}`,
      entityId,
      entityType,
      data: {
        recommendation: null,
        market: null,
        seo: null,
        pricing: null,
        personalization: null,
        behavioral: null,
      },
      lastSync: Date.now(),
    };

    this.entityMemoryGraph.set(entityId, node);
    return node;
  }

  updateEntityRecommendationData(entityId: string, data: Record<string, unknown>): void {
    const node = this.entityMemoryGraph.get(entityId);
    if (!node) return;

    node.data.recommendation = data;
    node.lastSync = Date.now();
  }

  updateEntityMarketData(entityId: string, data: Record<string, unknown>): void {
    const node = this.entityMemoryGraph.get(entityId);
    if (!node) return;

    node.data.market = data;
    node.lastSync = Date.now();
  }

  updateEntitySEOData(entityId: string, data: Record<string, unknown>): void {
    const node = this.entityMemoryGraph.get(entityId);
    if (!node) return;

    node.data.seo = data;
    node.lastSync = Date.now();
  }

  updateEntityPricingData(entityId: string, data: Record<string, unknown>): void {
    const node = this.entityMemoryGraph.get(entityId);
    if (!node) return;

    node.data.pricing = data;
    node.lastSync = Date.now();
  }

  updateEntityPersonalizationData(entityId: string, data: Record<string, unknown>): void {
    const node = this.entityMemoryGraph.get(entityId);
    if (!node) return;

    node.data.personalization = data;
    node.lastSync = Date.now();
  }

  updateEntityBehavioralData(entityId: string, data: Record<string, unknown>): void {
    const node = this.entityMemoryGraph.get(entityId);
    if (!node) return;

    node.data.behavioral = data;
    node.lastSync = Date.now();
  }

  getEntityNode(entityId: string): EntityMemoryNode | undefined {
    return this.entityMemoryGraph.get(entityId);
  }

  getEntityRecommendationData(entityId: string): Record<string, unknown> | null {
    const node = this.entityMemoryGraph.get(entityId);
    return node?.data.recommendation || null;
  }

  getEntityMarketData(entityId: string): Record<string, unknown> | null {
    const node = this.entityMemoryGraph.get(entityId);
    return node?.data.market || null;
  }

  getEntitySEOData(entityId: string): Record<string, unknown> | null {
    const node = this.entityMemoryGraph.get(entityId);
    return node?.data.seo || null;
  }

  getEntityPricingData(entityId: string): Record<string, unknown> | null {
    const node = this.entityMemoryGraph.get(entityId);
    return node?.data.pricing || null;
  }

  getEntityPersonalizationData(entityId: string): Record<string, unknown> | null {
    const node = this.entityMemoryGraph.get(entityId);
    return node?.data.personalization || null;
  }

  getEntityBehavioralData(entityId: string): Record<string, unknown> | null {
    const node = this.entityMemoryGraph.get(entityId);
    return node?.data.behavioral || null;
  }

  syncEntity(entityId: string): SyncStatus {
    const status: SyncStatus = {
      syncId: `sync-${entityId}-${Date.now()}`,
      entityId,
      status: "syncing",
      startedAt: Date.now(),
    };

    this.entitySync.set(status.syncId, status);

    // Placeholder for sync logic

    status.status = "completed";
    status.completedAt = Date.now();

    return status;
  }

  getSyncStatus(syncId: string): SyncStatus | undefined {
    return this.entitySync.get(syncId);
  }

  getEntitySyncStatus(entityId: string): SyncStatus | undefined {
    for (const status of this.entitySync.values()) {
      if (status.entityId === entityId) {
        return status;
      }
    }
    return undefined;
  }
}

interface EntityMemoryNode {
  nodeId: string;
  entityId: string;
  entityType: string;
  data: {
    recommendation: Record<string, unknown> | null;
    market: Record<string, unknown> | null;
    seo: Record<string, unknown> | null;
    pricing: Record<string, unknown> | null;
    personalization: Record<string, unknown> | null;
    behavioral: Record<string, unknown> | null;
  };
  lastSync: number;
}

interface SyncStatus {
  syncId: string;
  entityId: string;
  status: "syncing" | "completed" | "failed";
  startedAt: number;
  completedAt?: number;
}
