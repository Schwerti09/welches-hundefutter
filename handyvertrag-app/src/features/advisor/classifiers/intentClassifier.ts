import { IntentType, ClassifiedIntent, AdvisorUserProfile } from "../types";
import { UserProfileManager } from "../memory/userProfile";

export class IntentClassifier {
  private profileManager: UserProfileManager;

  constructor() {
    this.profileManager = new UserProfileManager();
  }

  classify(text: string): ClassifiedIntent {
    const lower = text.toLowerCase();
    let type: IntentType = "general_comparison";
    let confidence = 0.5;
    const extractedPreferences: Partial<AdvisorUserProfile> = {};

    // Budget-related intents
    if (lower.includes("günstig") || lower.includes("billig") || lower.includes("preiswert")) {
      type = "cheap_contract";
      confidence = 0.8;
      const budget = this.profileManager.extractBudgetFromText(text);
      if (budget) extractedPreferences.budgetRange = budget;
    }

    // Premium phone intent
    if (lower.includes("premium") || lower.includes("high-end") || lower.includes("top")) {
      type = "premium_phone";
      confidence = 0.75;
      const budget = this.profileManager.extractBudgetFromText(text);
      if (budget) extractedPreferences.budgetRange = budget;
    }

    // Gaming phone intent
    if (lower.includes("gaming") || lower.includes("spielen") || lower.includes("games")) {
      type = "gaming_phone";
      confidence = 0.85;
      extractedPreferences.gamingInterest = true;
    }

    // Camera phone intent
    if (lower.includes("kamera") || lower.includes("foto") || lower.includes("bild")) {
      type = "camera_phone";
      confidence = 0.8;
      extractedPreferences.cameraImportance = "high";
    }

    // Unlimited data intent
    if (lower.includes("unlimited") || lower.includes("unbegrenzt") || lower.includes("all data")) {
      type = "unlimited_data";
      confidence = 0.9;
      extractedPreferences.dataUsage = "unlimited";
    }

    // Refurbished interest
    if (lower.includes("refurbished") || lower.includes("gebraucht") || lower.includes("wiederaufbereitet")) {
      type = "refurbished_interest";
      confidence = 0.8;
      extractedPreferences.refurbishedOpenness = true;
    }

    // Business usage
    if (lower.includes("business") || lower.includes("geschäft") || lower.includes("arbeit")) {
      type = "business_usage";
      confidence = 0.75;
    }

    // Family plan
    if (lower.includes("familie") || lower.includes("family") || lower.includes("mehrere")) {
      type = "family_plan";
      confidence = 0.7;
    }

    // Upgrade advice
    if (lower.includes("upgrade") || lower.includes("wechsel") || lower.includes("neu")) {
      type = "upgrade_advice";
      confidence = 0.7;
    }

    // Extract brand preference
    const brand = this.profileManager.extractBrandFromText(text);
    if (brand) extractedPreferences.brandPreference = brand;

    // Extract data usage
    const dataUsage = this.profileManager.extractDataUsageFromText(text);
    if (dataUsage) extractedPreferences.dataUsage = dataUsage;

    // Extract provider preference
    const provider = this.profileManager.extractProviderPreference(text);
    if (provider) extractedPreferences.providerPreference = provider;

    return {
      type,
      confidence,
      extractedPreferences,
    };
  }

  classifyBatch(texts: string[]): ClassifiedIntent[] {
    return texts.map((text) => this.classify(text));
  }
}
