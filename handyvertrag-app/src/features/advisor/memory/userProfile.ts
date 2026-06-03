import { AdvisorUserProfile, BudgetRange, BrandPreference, DataUsage, ImportanceLevel, ProviderPreference, ContractDuration } from "../types";

export class UserProfileManager {
  private profile: AdvisorUserProfile = {};

  updateProfile(updates: Partial<AdvisorUserProfile>): void {
    this.profile = { ...this.profile, ...updates };
  }

  getProfile(): AdvisorUserProfile {
    return { ...this.profile };
  }

  resetProfile(): void {
    this.profile = {};
  }

  hasSufficientInfo(): boolean {
    const required = [
      this.profile.budgetRange,
      this.profile.dataUsage,
    ];
    return required.every((field) => field !== undefined);
  }

  getCompletionPercentage(): number {
    const fields = [
      this.profile.budgetRange,
      this.profile.brandPreference,
      this.profile.dataUsage,
      this.profile.gamingInterest,
      this.profile.cameraImportance,
      this.profile.batteryImportance,
      this.profile.providerPreference,
      this.profile.contractDuration,
      this.profile.refurbishedOpenness,
    ];
    const filled = fields.filter((f) => f !== undefined).length;
    return (filled / fields.length) * 100;
  }

  extractBudgetFromText(text: string): BudgetRange | undefined {
    const budgetMatch = text.match(/(\d+)\s*€?\s*-\s*(\d+)\s*€?/i);
    if (budgetMatch) {
      return {
        min: parseInt(budgetMatch[1], 10),
        max: parseInt(budgetMatch[2], 10),
      };
    }

    const singleMatch = text.match(/(?:unter|bis|max)\s*(\d+)\s*€?/i);
    if (singleMatch) {
      const max = parseInt(singleMatch[1], 10);
      return { min: 0, max };
    }

    const minMatch = text.match(/(?:ab|min)\s*(\d+)\s*€?/i);
    if (minMatch) {
      const min = parseInt(minMatch[1], 10);
      return { min, max: 1000 };
    }

    return undefined;
  }

  extractBrandFromText(text: string): BrandPreference | undefined {
    const lower = text.toLowerCase();
    if (lower.includes("iphone") || lower.includes("apple")) {
      return "apple";
    }
    if (lower.includes("samsung") || lower.includes("galaxy")) {
      return "samsung";
    }
    if (lower.includes("pixel") || lower.includes("google")) {
      return "google";
    }
    if (lower.includes("xiaomi")) {
      return "xiaomi";
    }
    return undefined;
  }

  extractDataUsageFromText(text: string): DataUsage | undefined {
    const lower = text.toLowerCase();
    if (lower.includes("unlimited") || lower.includes("unbegrenzt")) {
      return "unlimited";
    }
    if (lower.includes("viel") || lower.includes("viel daten")) {
      return "high";
    }
    if (lower.includes("wenig") || lower.includes("kaum")) {
      return "low";
    }
    if (lower.includes("mittel")) {
      return "medium";
    }
    return undefined;
  }

  extractGamingInterest(text: string): boolean | undefined {
    const lower = text.toLowerCase();
    if (lower.includes("gaming") || lower.includes("spielen") || lower.includes("games")) {
      return true;
    }
    if (lower.includes("kein gaming") || lower.includes("nicht spielen")) {
      return false;
    }
    return undefined;
  }

  extractCameraImportance(text: string): ImportanceLevel | undefined {
    const lower = text.toLowerCase();
    if (lower.includes("wichtig") && lower.includes("kamera")) {
      return "high";
    }
    if (lower.includes("fotos") && (lower.includes("viel") || lower.includes("oft"))) {
      return "high";
    }
    if (lower.includes("egal") && lower.includes("kamera")) {
      return "low";
    }
    return undefined;
  }

  extractProviderPreference(text: string): ProviderPreference | undefined {
    const lower = text.toLowerCase();
    if (lower.includes("telekom")) {
      return "telekom";
    }
    if (lower.includes("vodafone")) {
      return "vodafone";
    }
    if (lower.includes("o2")) {
      return "o2";
    }
    if (lower.includes("egal") || lower.includes("keine präferenz")) {
      return "any";
    }
    return undefined;
  }
}
