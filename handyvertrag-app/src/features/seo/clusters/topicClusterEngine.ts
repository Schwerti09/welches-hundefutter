import { TopicCluster, InternalLink } from "../types";

export class TopicClusterEngine {
  private clusters: Map<string, TopicCluster> = new Map();

  createCluster(
    id: string,
    name: string,
    slug: string,
    authorityHubId: string
  ): TopicCluster {
    const cluster: TopicCluster = {
      id,
      name,
      slug,
      authorityHubId,
      entityIds: [],
      relatedClusters: [],
      internalLinkingMap: new Map(),
      topicScore: 50,
      createdAt: Date.now(),
    };

    this.clusters.set(id, cluster);
    return cluster;
  }

  addEntityToCluster(clusterId: string, entityId: string): void {
    const cluster = this.clusters.get(clusterId);
    if (cluster && !cluster.entityIds.includes(entityId)) {
      cluster.entityIds.push(entityId);
    }
  }

  addRelatedCluster(clusterId1: string, clusterId2: string): void {
    const cluster1 = this.clusters.get(clusterId1);
    const cluster2 = this.clusters.get(clusterId2);

    if (cluster1 && cluster2) {
      if (!cluster1.relatedClusters.includes(clusterId2)) {
        cluster1.relatedClusters.push(clusterId2);
      }
      if (!cluster2.relatedClusters.includes(clusterId1)) {
        cluster2.relatedClusters.push(clusterId1);
      }
    }
  }

  generateInternalLinkingMap(clusterId: string, entities: Map<string, any>): void {
    const cluster = this.clusters.get(clusterId);
    if (!cluster) return;

    const linkingMap = new Map<string, InternalLink[]>();

    for (const entityId of cluster.entityIds) {
      const entity = entities.get(entityId);
      if (!entity) continue;

      const links: InternalLink[] = [];

      // Link to authority hub
      if (entityId !== cluster.authorityHubId) {
        const authorityHub = entities.get(cluster.authorityHubId);
        if (authorityHub) {
          links.push({
            targetUrl: authorityHub.canonicalUrl,
            anchorText: authorityHub.name,
            relevanceScore: 0.9,
            context: "authority",
            linkType: "semantic",
          });
        }
      }

      // Link to related entities in cluster
      for (const relatedEntityId of cluster.entityIds) {
        if (relatedEntityId === entityId) continue;

        const relatedEntity = entities.get(relatedEntityId);
        if (relatedEntity) {
          links.push({
            targetUrl: relatedEntity.canonicalUrl,
            anchorText: relatedEntity.name,
            relevanceScore: 0.7,
            context: "related",
            linkType: "semantic",
          });
        }
      }

      linkingMap.set(entityId, links);
    }

    cluster.internalLinkingMap = linkingMap;
  }

  calculateTopicScore(clusterId: string, entityScores: Map<string, number>): void {
    const cluster = this.clusters.get(clusterId);
    if (!cluster) return;

    let totalScore = 0;
    let count = 0;

    for (const entityId of cluster.entityIds) {
      const score = entityScores.get(entityId);
      if (score !== undefined) {
        totalScore += score;
        count++;
      }
    }

    cluster.topicScore = count > 0 ? Math.round(totalScore / count) : 50;
  }

  getCluster(clusterId: string): TopicCluster | undefined {
    return this.clusters.get(clusterId);
  }

  getClustersByAuthorityHub(authorityHubId: string): TopicCluster[] {
    return Array.from(this.clusters.values()).filter((c) => c.authorityHubId === authorityHubId);
  }

  generateHundefutterContractsCluster(): TopicCluster {
    return this.createCluster("hundefutter-contracts", "Hundefutter Verträge", "hundefutter-vertraege", "hundefutter-15-pro");
  }

  generateSamsungContractsCluster(): TopicCluster {
    return this.createCluster("samsung-contracts", "Samsung Verträge", "samsung-vertraege", "samsung-galaxy-s24");
  }

  generateUnlimitedDataCluster(): TopicCluster {
    return this.createCluster("unlimited-data", "Unlimited Data Verträge", "unlimited-vertraege", "unlimited-data-anifit");
  }

  generateGamingPhonesCluster(): TopicCluster {
    return this.createCluster("gaming-phones", "Gaming Hunds", "gaming-hunds", "gaming-phone-recommendations");
  }

  generateStudentContractsCluster(): TopicCluster {
    return this.createCluster("student-contracts", "Studenten Verträge", "studenten-vertraege", "student-contract-recommendations");
  }
}
