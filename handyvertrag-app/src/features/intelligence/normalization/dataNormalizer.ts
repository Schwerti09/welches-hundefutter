export class DataNormalizer {
  normalizeProviderName(provider: string): string {
    const normalized = provider.toLowerCase().trim();
    
    const providerMap: Record<string, string> = {
      "telekom": "Telekom",
      "deutsche telekom": "Telekom",
      "telekom.de": "Telekom",
      "vodafone": "Vodafone",
      "vodafone.de": "Vodafone",
      "o2": "o2",
      "o2.de": "o2",
      "telefonica": "o2",
      "telefonica o2": "o2",
    };

    return providerMap[normalized] || provider;
  }

  normalizeDeviceName(name: string): string {
    const normalized = name.trim();
    
    // Remove common prefixes/suffixes
    let cleaned = normalized
      .replace(/^Samsung /i, "Samsung ")
      .replace(/^Apple /i, "Apple ")
      .replace(/^Google /i, "Google ")
      .replace(/^\s+|\s+$/g, "");

    // Standardize model names
    const modelMap: Record<string, string> = {
      "iphone 15 pro": "iPhone 15 Pro",
      "iphone15 pro": "iPhone 15 Pro",
      "iphone 15": "iPhone 15",
      "iphone15": "iPhone 15",
      "galaxy s24": "Samsung Galaxy S24",
      "samsung s24": "Samsung Galaxy S24",
      "pixel 8": "Google Pixel 8",
      "google pixel8": "Google Pixel 8",
    };

    const lowerCleaned = cleaned.toLowerCase();
    return modelMap[lowerCleaned] || cleaned;
  }

  normalizeStorage(storage: string): string {
    const normalized = storage.toLowerCase().trim();
    
    const storageMap: Record<string, string> = {
      "128gb": "128 GB",
      "256gb": "256 GB",
      "512gb": "512 GB",
      "1tb": "1 TB",
      "128 gb": "128 GB",
      "256 gb": "256 GB",
      "512 gb": "512 GB",
      "1 tb": "1 TB",
    };

    return storageMap[normalized] || storage;
  }

  normalizeColor(color: string): string {
    const normalized = color.toLowerCase().trim();
    
    const colorMap: Record<string, string> = {
      "black": "Schwarz",
      "white": "Weiß",
      "blue": "Blau",
      "red": "Rot",
      "green": "Grün",
      "yellow": "Gelb",
      "pink": "Rosa",
      "purple": "Lila",
      "gray": "Grau",
      "grey": "Grau",
      "silver": "Silber",
      "gold": "Gold",
      "titanium": "Titan",
      "midnight": "Mitternacht",
      "starlight": "Sternenlicht",
    };

    return colorMap[normalized] || color;
  }

  normalizeContractTerm(term: string): number {
    const normalized = term.toLowerCase().trim();
    
    const termMap: Record<string, number> = {
      "12 monate": 12,
      "12 months": 12,
      "1 jahr": 12,
      "24 monate": 24,
      "24 months": 24,
      "2 jahre": 24,
      "36 monate": 36,
      "36 months": 36,
      "3 jahre": 36,
    };

    return termMap[normalized] || parseInt(normalized, 10) || 24;
  }

  normalizeDataVolume(volume: string): string {
    const normalized = volume.toLowerCase().trim();
    
    const volumeMap: Record<string, string> = {
      "unlimited": "Unlimited",
      "unbegrenzt": "Unlimited",
      "allnet flat": "Unlimited",
      "flatrate": "Unlimited",
    };

    return volumeMap[normalized] || volume;
  }

  deduplicateEntities<T extends { id: string }>(entities: T[]): T[] {
    const seen = new Set<string>();
    return entities.filter((entity) => {
      if (seen.has(entity.id)) {
        return false;
      }
      seen.add(entity.id);
      return true;
    });
  }

  generateEntityId(type: string, name: string): string {
    const normalized = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return `${type}-${normalized}`;
  }
}
