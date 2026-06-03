import { SignalGraphNode } from "../types";

export class CommerceSignalGraph {
  private nodes: Map<string, SignalGraphNode> = new Map();
  private relationships: Map<string, Array<{ targetNodeId: string; relationshipType: string; strength: number }>> = new Map();

  createDeviceNode(entityId: string, strength: number): SignalGraphNode {
    return this.createNode("device", entityId, strength);
  }

  createProviderNode(entityId: string, strength: number): SignalGraphNode {
    return this.createNode("provider", entityId, strength);
  }

  createContractNode(entityId: string, strength: number): SignalGraphNode {
    return this.createNode("contract", entityId, strength);
  }

  createTrendNode(entityId: string, strength: number): SignalGraphNode {
    return this.createNode("trend", entityId, strength);
  }

  createIntentNode(entityId: string, strength: number): SignalGraphNode {
    return this.createNode("intent", entityId, strength);
  }

  createConversionNode(entityId: string, strength: number): SignalGraphNode {
    return this.createNode("conversion", entityId, strength);
  }

  createPricingNode(entityId: string, strength: number): SignalGraphNode {
    return this.createNode("pricing", entityId, strength);
  }

  createRankingNode(entityId: string, strength: number): SignalGraphNode {
    return this.createNode("ranking", entityId, strength);
  }

  addRelationship(sourceNodeId: string, targetNodeId: string, relationshipType: string, strength: number): void {
    const sourceNode = this.nodes.get(sourceNodeId);
    if (!sourceNode) return;

    const relationship = { targetNodeId, relationshipType, strength };
    sourceNode.relationships.push(relationship);

    const relationships = this.relationships.get(sourceNodeId) || [];
    relationships.push(relationship);
    this.relationships.set(sourceNodeId, relationships);
  }

  getNode(nodeId: string): SignalGraphNode | undefined {
    return this.nodes.get(nodeId);
  }

  getNodesByType(nodeType: SignalGraphNode["nodeType"]): SignalGraphNode[] {
    return Array.from(this.nodes.values()).filter((n) => n.nodeType === nodeType);
  }

  getRelationships(nodeId: string): Array<{ targetNodeId: string; relationshipType: string; strength: number }> {
    return this.relationships.get(nodeId) || [];
  }

  getConnectedNodes(nodeId: string): SignalGraphNode[] {
    const relationships = this.getRelationships(nodeId);
    const connectedNodes: SignalGraphNode[] = [];

    for (const relationship of relationships) {
      const node = this.nodes.get(relationship.targetNodeId);
      if (node) {
        connectedNodes.push(node);
      }
    }

    return connectedNodes;
  }

  findShortestPath(sourceNodeId: string, targetNodeId: string): string[] | null {
    // Placeholder for shortest path algorithm
    return null;
  }

  calculateNodeInfluence(nodeId: string): number {
    const node = this.nodes.get(nodeId);
    if (!node) return 0;

    const relationships = this.getRelationships(nodeId);
    const totalStrength = relationships.reduce((sum, r) => sum + r.strength, 0);

    return Math.round(totalStrength / Math.max(relationships.length, 1));
  }

  private createNode(nodeType: SignalGraphNode["nodeType"], entityId: string, strength: number): SignalGraphNode {
    const node: SignalGraphNode = {
      nodeId: `node-${nodeType}-${entityId}`,
      nodeType,
      entityId,
      strength,
      relationships: [],
    };

    this.nodes.set(node.nodeId, node);
    return node;
  }
}
