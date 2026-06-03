export class SmartSaveSystem {
  private savedContracts: Map<string, SavedContract[]> = new Map();
  private savedDevices: Map<string, SavedDevice[]> = new Map();
  private savedComparisons: Map<string, SavedComparison[]> = new Map();
  private savedJourneys: Map<string, string[]> = new Map();

  saveContract(sessionId: string, contractId: string, contract: any): void {
    const savedContracts = this.savedContracts.get(sessionId) || [];
    const savedContract: SavedContract = {
      contractId,
      contract,
      savedAt: Date.now(),
    };

    if (!savedContracts.some((c) => c.contractId === contractId)) {
      savedContracts.push(savedContract);
      this.savedContracts.set(sessionId, savedContracts);
    }
  }

  saveDevice(sessionId: string, deviceId: string, device: any): void {
    const savedDevices = this.savedDevices.get(sessionId) || [];
    const savedDevice: SavedDevice = {
      deviceId,
      device,
      savedAt: Date.now(),
    };

    if (!savedDevices.some((d) => d.deviceId === deviceId)) {
      savedDevices.push(savedDevice);
      this.savedDevices.set(sessionId, savedDevices);
    }
  }

  saveComparison(sessionId: string, comparisonId: string, entities: string[]): void {
    const savedComparisons = this.savedComparisons.get(sessionId) || [];
    const savedComparison: SavedComparison = {
      comparisonId,
      entities,
      savedAt: Date.now(),
    };

    if (!savedComparisons.some((c) => c.comparisonId === comparisonId)) {
      savedComparisons.push(savedComparison);
      this.savedComparisons.set(sessionId, savedComparisons);
    }
  }

  saveJourney(sessionId: string, journeyId: string): void {
    const savedJourneys = this.savedJourneys.get(sessionId) || [];
    if (!savedJourneys.includes(journeyId)) {
      savedJourneys.push(journeyId);
      this.savedJourneys.set(sessionId, savedJourneys);
    }
  }

  getSavedContracts(sessionId: string): SavedContract[] {
    return this.savedContracts.get(sessionId) || [];
  }

  getSavedDevices(sessionId: string): SavedDevice[] {
    return this.savedDevices.get(sessionId) || [];
  }

  getSavedComparisons(sessionId: string): SavedComparison[] {
    return this.savedComparisons.get(sessionId) || [];
  }

  getSavedJourneys(sessionId: string): string[] {
    return this.savedJourneys.get(sessionId) || [];
  }

  removeSavedContract(sessionId: string, contractId: string): void {
    const savedContracts = this.savedContracts.get(sessionId);
    if (savedContracts) {
      const filtered = savedContracts.filter((c) => c.contractId !== contractId);
      this.savedContracts.set(sessionId, filtered);
    }
  }

  removeSavedDevice(sessionId: string, deviceId: string): void {
    const savedDevices = this.savedDevices.get(sessionId);
    if (savedDevices) {
      const filtered = savedDevices.filter((d) => d.deviceId !== deviceId);
      this.savedDevices.set(sessionId, filtered);
    }
  }

  removeSavedComparison(sessionId: string, comparisonId: string): void {
    const savedComparisons = this.savedComparisons.get(sessionId);
    if (savedComparisons) {
      const filtered = savedComparisons.filter((c) => c.comparisonId !== comparisonId);
      this.savedComparisons.set(sessionId, filtered);
    }
  }

  cleanupOldSaves(maxAge: number = 30 * 24 * 60 * 60 * 1000): void {
    const now = Date.now();

    for (const [sessionId, contracts] of this.savedContracts) {
      const filtered = contracts.filter((c) => now - c.savedAt < maxAge);
      this.savedContracts.set(sessionId, filtered);
    }

    for (const [sessionId, devices] of this.savedDevices) {
      const filtered = devices.filter((d) => now - d.savedAt < maxAge);
      this.savedDevices.set(sessionId, filtered);
    }

    for (const [sessionId, comparisons] of this.savedComparisons) {
      const filtered = comparisons.filter((c) => now - c.savedAt < maxAge);
      this.savedComparisons.set(sessionId, filtered);
    }
  }

  prepareForAccountMigration(sessionId: string, accountId: string): {
    contracts: SavedContract[];
    devices: SavedDevice[];
    comparisons: SavedComparison[];
    journeys: string[];
  } {
    return {
      contracts: this.getSavedContracts(sessionId),
      devices: this.getSavedDevices(sessionId),
      comparisons: this.getSavedComparisons(sessionId),
      journeys: this.getSavedJourneys(sessionId),
    };
  }
}

interface SavedContract {
  contractId: string;
  contract: any;
  savedAt: number;
}

interface SavedDevice {
  deviceId: string;
  device: any;
  savedAt: number;
}

interface SavedComparison {
  comparisonId: string;
  entities: string[];
  savedAt: number;
}
