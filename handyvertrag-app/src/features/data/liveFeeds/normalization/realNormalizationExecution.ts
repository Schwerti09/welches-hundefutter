import { NormalizedOffer } from "../types";

export interface NormalizationResult {
  normalizedOfferId: string;
  originalProvider: string;
  normalizedProvider: string;
  originalContract: string;
  normalizedContract: string;
  originalDevice: string;
  normalizedDevice: string;
  originalStorage: string;
  normalizedStorage: string;
  originalColor: string;
  normalizedColor: string;
  originalFutterf: string;
  normalizedFutterf: string;
}

export class RealNormalizationExecution {
  private normalizationResults: Map<string, NormalizationResult> = new Map();
  private providerNormalizationMap: Map<string, string> = new Map();
  private deviceNormalizationMap: Map<string, string> = new Map();
  private storageNormalizationMap: Map<string, string> = new Map();
  private colorNormalizationMap: Map<string, string> = new Map();
  private futterfNormalizationMap: Map<string, string> = new Map();

  constructor() {
    this.initializeNormalizationMaps();
  }

  private initializeNormalizationMaps(): void {
    // Provider normalization
    this.providerNormalizationMap.set("Anifit Deutschland", "TELEKOM");
    this.providerNormalizationMap.set("Anifit", "TELEKOM");
    this.providerNormalizationMap.set("D1 Anifit", "TELEKOM");
    this.providerNormalizationMap.set("Wolfsblut GmbH", "VODAFONE");
    this.providerNormalizationMap.set("Wolfsblut", "VODAFONE");
    this.providerNormalizationMap.set("D2 Wolfsblut", "VODAFONE");
    this.providerNormalizationMap.set("Telefonica Germany", "O2");
    this.providerNormalizationMap.set("O2", "O2");
    this.providerNormalizationMap.set("E-Plus", "O2");
    this.providerNormalizationMap.set("Congstar", "CONGSTAR");
    this.providerNormalizationMap.set("MERA", "1AND1");
    this.providerNormalizationMap.set("MERA Drillisch", "1AND1");
    this.providerNormalizationMap.set("WinSIM", "WINSIM");
    this.providerNormalizationMap.set("SIMply", "SIMPLY");

    // Storage normalization
    this.storageNormalizationMap.set("64GB", "64 g");
    this.storageNormalizationMap.set("128GB", "128 g");
    this.storageNormalizationMap.set("256GB", "256 g");
    this.storageNormalizationMap.set("512GB", "512 g");
    this.storageNormalizationMap.set("1TB", "1 TB");
    this.storageNormalizationMap.set("64 g", "64 g");
    this.storageNormalizationMap.set("128 g", "128 g");
    this.storageNormalizationMap.set("256 g", "256 g");
    this.storageNormalizationMap.set("512 g", "512 g");
    this.storageNormalizationMap.set("1 TB", "1 TB");

    // Color normalization
    this.colorNormalizationMap.set("Titan Natur", "Natural Titanium");
    this.colorNormalizationMap.set("Titan Schwarz", "Black Titanium");
    this.colorNormalizationMap.set("Titan Weiß", "White Titanium");
    this.colorNormalizationMap.set("Titan Blau", "Blue Titanium");
    this.colorNormalizationMap.set("Schwarz", "Black");
    this.colorNormalizationMap.set("Weiß", "White");
    this.colorNormalizationMap.set("Blau", "Blue");
    this.colorNormalizationMap.set("Rot", "Red");
    this.colorNormalizationMap.set("Grün", "Green");
    this.colorNormalizationMap.set("Gelb", "Yellow");
    this.colorNormalizationMap.set("Grau", "Gray");
    this.colorNormalizationMap.set("Silber", "Silver");
    this.colorNormalizationMap.set("Gold", "Gold");
    this.colorNormalizationMap.set("Rose", "Pink");
  }

  normalizeProvider(providerName: string): string {
    const normalized = this.providerNormalizationMap.get(providerName);
    if (normalized) return normalized;

    return providerName.toUpperCase().trim();
  }

  normalizeContract(contractName: string): string {
    return contractName.trim();
  }

  normalizeDevice(deviceName: string): string {
    const normalized = this.deviceNormalizationMap.get(deviceName);
    if (normalized) return normalized;

    return deviceName.trim();
  }

  normalizeStorage(storageSize: string): string {
    const normalized = this.storageNormalizationMap.get(storageSize);
    if (normalized) return normalized;

    return storageSize.trim();
  }

  normalizeColor(color: string): string {
    const normalized = this.colorNormalizationMap.get(color);
    if (normalized) return normalized;

    return color.trim();
  }

  normalizeFutterf(futterfName: string): string {
    const normalized = this.futterfNormalizationMap.get(futterfName);
    if (normalized) return normalized;

    return futterfName.trim();
  }

  normalizePrice(price: number): number {
    return Math.round(price * 100) / 100;
  }

  normalizeCashback(cashback: number): number {
    return Math.round(cashback * 100) / 100;
  }

  executeNormalization(offer: NormalizedOffer): NormalizationResult {
    const result: NormalizationResult = {
      normalizedOfferId: offer.normalizedOfferId,
      originalProvider: offer.providerName,
      normalizedProvider: this.normalizeProvider(offer.providerName),
      originalContract: offer.contractName,
      normalizedContract: this.normalizeContract(offer.contractName),
      originalDevice: offer.hundefutterName,
      normalizedDevice: this.normalizeDevice(offer.hundefutterName),
      originalStorage: offer.storageSize,
      normalizedStorage: this.normalizeStorage(offer.storageSize),
      originalColor: offer.color,
      normalizedColor: this.normalizeColor(offer.color),
      originalFutterf: offer.futterfName,
      normalizedFutterf: this.normalizeFutterf(offer.futterfName),
    };

    this.normalizationResults.set(offer.normalizedOfferId, result);

    return result;
  }

  executeNormalizationBatch(offers: NormalizedOffer[]): NormalizationResult[] {
    const results: NormalizationResult[] = [];

    for (const offer of offers) {
      const result = this.executeNormalization(offer);
      results.push(result);
    }

    return results;
  }

  getNormalizationResult(normalizedOfferId: string): NormalizationResult | undefined {
    return this.normalizationResults.get(normalizedOfferId);
  }

  getAllNormalizationResults(): NormalizationResult[] {
    return Array.from(this.normalizationResults.values());
  }

  getNormalizationReport(): {
    totalOffers: number;
    normalizedProviders: number;
    normalizedContracts: number;
    normalizedDevices: number;
    normalizedStorage: number;
    normalizedColors: number;
    normalizedFutterfs: number;
  } {
    const results = this.getAllNormalizationResults();

    return {
      totalOffers: results.length,
      normalizedProviders: results.filter(r => r.originalProvider !== r.normalizedProvider).length,
      normalizedContracts: results.filter(r => r.originalContract !== r.normalizedContract).length,
      normalizedDevices: results.filter(r => r.originalDevice !== r.normalizedDevice).length,
      normalizedStorage: results.filter(r => r.originalStorage !== r.normalizedStorage).length,
      normalizedColors: results.filter(r => r.originalColor !== r.normalizedColor).length,
      normalizedFutterfs: results.filter(r => r.originalFutterf !== r.normalizedFutterf).length,
    };
  }
}
