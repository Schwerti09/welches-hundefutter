import { NetworkType, NormalizedOffer } from "../types";

export interface NetworkAdapter {
  networkType: NetworkType;
  extractFeed(filePath: string): Promise<NormalizedOffer[]>;
  normalizeOffer(offer: NormalizedOffer): NormalizedOffer;
}

export class NetworkAbstractionLayer {
  private adapters: Map<NetworkType, NetworkAdapter> = new Map();

  registerAdapter(adapter: NetworkAdapter): void {
    this.adapters.set(adapter.networkType, adapter);
  }

  getAdapter(networkType: NetworkType): NetworkAdapter | undefined {
    return this.adapters.get(networkType);
  }

  async extractFeed(networkType: NetworkType, filePath: string): Promise<NormalizedOffer[]> {
    const adapter = this.adapters.get(networkType);
    if (!adapter) {
      throw new Error(`No adapter found for network type ${networkType}`);
    }

    return adapter.extractFeed(filePath);
  }

  normalizeOffer(networkType: NetworkType, offer: NormalizedOffer): NormalizedOffer {
    const adapter = this.adapters.get(networkType);
    if (!adapter) {
      throw new Error(`No adapter found for network type ${networkType}`);
    }

    return adapter.normalizeOffer(offer);
  }

  getRegisteredNetworks(): NetworkType[] {
    return Array.from(this.adapters.keys());
  }
}
