import { DemandHeatmap } from "../types";

export class UserDemandIntelligence {
  private heatmaps: Map<string, DemandHeatmap> = new Map();

  calculateGamingDemand(segments: Array<{ segment: string; demand: number; growth: number; velocity: number }>): DemandHeatmap {
    return this.createDemandHeatmap("gaming", segments);
  }

  calculateCameraDemand(segments: Array<{ segment: string; demand: number; growth: number; velocity: number }>): DemandHeatmap {
    return this.createDemandHeatmap("camera", segments);
  }

  calculateBudgetDemand(segments: Array<{ segment: string; demand: number; growth: number; velocity: number }>): DemandHeatmap {
    return this.createDemandHeatmap("budget", segments);
  }

  calculateUnlimitedDataDemand(segments: Array<{ segment: string; demand: number; growth: number; velocity: number }>): DemandHeatmap {
    return this.createDemandHeatmap("unlimited_data", segments);
  }

  calculateProviderDemand(segments: Array<{ segment: string; demand: number; growth: number; velocity: number }>): DemandHeatmap {
    return this.createDemandHeatmap("provider", segments);
  }

  calculatePremiumDemand(segments: Array<{ segment: string; demand: number; growth: number; velocity: number }>): DemandHeatmap {
    return this.createDemandHeatmap("premium", segments);
  }

  getDemandHeatmap(heatmapId: string): DemandHeatmap | undefined {
    return this.heatmaps.get(heatmapId);
  }

  getDemandHeatmapsByType(demandType: DemandHeatmap["demandType"]): DemandHeatmap[] {
    return Array.from(this.heatmaps.values()).filter((h) => h.demandType === demandType);
  }

  getHighestDemandSegments(demandType: DemandHeatmap["demandType"], limit: number = 5): Array<{ segment: string; demand: number; growth: number; velocity: number }> {
    const heatmap = this.getDemandHeatmapsByType(demandType)[0];
    if (!heatmap) return [];

    return heatmap.segments
      .sort((a, b) => b.demand - a.demand)
      .slice(0, limit);
  }

  getFastestGrowingSegments(demandType: DemandHeatmap["demandType"], limit: number = 5): Array<{ segment: string; demand: number; growth: number; velocity: number }> {
    const heatmap = this.getDemandHeatmapsByType(demandType)[0];
    if (!heatmap) return [];

    return heatmap.segments
      .sort((a, b) => b.growth - a.growth)
      .slice(0, limit);
  }

  private createDemandHeatmap(demandType: DemandHeatmap["demandType"], segments: Array<{ segment: string; demand: number; growth: number; velocity: number }>): DemandHeatmap {
    const heatmap: DemandHeatmap = {
      heatmapId: `heatmap-${demandType}-${Date.now()}`,
      demandType,
      segments,
      generatedAt: Date.now(),
    };

    this.heatmaps.set(heatmap.heatmapId, heatmap);
    return heatmap;
  }
}
