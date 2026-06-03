"use client";

/**
 * HANSI User Intelligence Profile — Phase 1
 * Persistent localStorage profile that grows with every interaction.
 * Never resets between sessions. Users feel "HANSI knows me."
 */

export interface UserProfile {
  // Inferred preferences
  budget?: { min?: number; max?: number; currency: "EUR" };
  preferredNetwork?: string;
  preferredBrands?: string[];
  devicePreference?: "Apple" | "Samsung" | "Google" | "Xiaomi" | "Any";
  dataUsage?: "low" | "medium" | "high" | "unlimited";
  // Usage patterns (boolean flags from conversation)
  streaming?: boolean;
  gaming?: boolean;
  hotspot?: boolean;
  travel?: boolean;
  familySharing?: boolean;
  // Attitudes
  savingsPriority?: boolean;  // true = budget-first
  premiumPreference?: boolean; // true = quality-first
  contractFlexibility?: "rigid" | "flexible"; // 24mo vs month-to-month
  // Meta
  confidence: number;           // 0–100: how complete the profile is
  interactions: number;         // number of exchanges
  firstSeen: number;            // timestamp
  lastSeen: number;
  // History
  recommendedDevices: string[];  // names of devices shown
  clickedOffers: string[];       // device names where user clicked
  sessions: { ts: number; query: string; topDevice?: string }[];
  // Health score inputs
  currentContractCost?: number;  // if user told us
  satisfiedWithCurrent?: boolean;
}

const KEY = "hansi_profile_v2";

const DEFAULT: UserProfile = {
  confidence: 0,
  interactions: 0,
  firstSeen: Date.now(),
  lastSeen: Date.now(),
  recommendedDevices: [],
  clickedOffers: [],
  sessions: [],
};

export function loadProfile(): UserProfile {
  if (typeof window === "undefined") return { ...DEFAULT };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT };
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch { return { ...DEFAULT }; }
}

export function saveProfile(p: UserProfile): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* quota */ }
}

export function clearProfile(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

/**
 * Learn from a user message + detected intent.
 * Called after every exchange so profile continuously improves.
 */
export function learnFromInteraction(
  profile: UserProfile,
  message: string,
  intent: {
    maxBudget?: number; provider?: string; brand?: string;
    deviceKeyword?: string; unlimited?: boolean; has5g?: boolean;
    useCase?: string; premium?: boolean; minData?: number;
  },
  topDevice?: string,
): UserProfile {
  const p = { ...profile };
  p.interactions = (p.interactions ?? 0) + 1;
  p.lastSeen = Date.now();

  const m = message.toLowerCase();

  // Budget
  if (intent.maxBudget) {
    if (!p.budget) p.budget = { currency: "EUR" };
    p.budget.max = intent.maxBudget;
    if (intent.maxBudget <= 25) p.savingsPriority = true;
  }

  // Network
  if (intent.provider && intent.provider !== p.preferredNetwork) {
    p.preferredNetwork = intent.provider;
  }

  // Brand
  if (intent.brand) {
    if (!p.preferredBrands) p.preferredBrands = [];
    if (!p.preferredBrands.includes(intent.brand)) {
      p.preferredBrands = [intent.brand, ...p.preferredBrands].slice(0, 3);
    }
    if (intent.brand === "Apple") p.devicePreference = "Apple";
    else if (intent.brand === "Samsung") p.devicePreference = "Samsung";
    else if (intent.brand === "Google") p.devicePreference = "Google";
  }

  // Data usage
  if (intent.unlimited) p.dataUsage = "unlimited";
  else if (intent.minData && intent.minData >= 50) p.dataUsage = "high";
  else if (intent.minData && intent.minData >= 20) p.dataUsage = "medium";

  // Use case flags
  if (intent.useCase === "gaming") p.gaming = true;
  if (intent.useCase === "camera") { /* brand preference noted */ }
  if (intent.useCase === "student") p.savingsPriority = true;
  if (intent.premium) p.premiumPreference = true;

  // Keyword-based detection
  if (m.includes("stream") || m.includes("netflix") || m.includes("youtube")) p.streaming = true;
  if (m.includes("hotspot") || m.includes("tethering")) p.hotspot = true;
  if (m.includes("reise") || m.includes("urlaub") || m.includes("ausland")) p.travel = true;
  if (m.includes("familie") || m.includes("mehrere")) p.familySharing = true;
  if (m.includes("günstig") || m.includes("sparen") || m.includes("billig")) p.savingsPriority = true;
  if (m.includes("bestes") || m.includes("premium") || m.includes("top")) p.premiumPreference = true;
  if (m.includes("monatlich kündbar") || m.includes("ohne bindung")) p.contractFlexibility = "flexible";

  // Session log (for timeline)
  const session = { ts: Date.now(), query: message.slice(0, 80), topDevice };
  p.sessions = [session, ...(p.sessions ?? [])].slice(0, 20);

  // Track shown devices
  if (topDevice && !p.recommendedDevices.includes(topDevice)) {
    p.recommendedDevices = [topDevice, ...p.recommendedDevices].slice(0, 10);
  }

  // Recompute confidence
  p.confidence = computeConfidence(p);

  return p;
}

export function computeConfidence(p: UserProfile): number {
  let score = 0;
  if (p.budget?.max) score += 22;
  if (p.preferredNetwork) score += 18;
  if (p.preferredBrands?.length) score += 14;
  if (p.dataUsage) score += 12;
  if (p.streaming !== undefined || p.gaming !== undefined) score += 8;
  if (p.savingsPriority !== undefined || p.premiumPreference !== undefined) score += 8;
  if (p.devicePreference) score += 10;
  if ((p.interactions ?? 0) >= 5) score += 5;
  if (p.hotspot !== undefined) score += 3;
  return Math.min(score, 98);
}

/** Compute the Mobile Optimization Health Score (Phase 3) */
export function computeHealthScore(p: UserProfile): {
  score: number;
  improvements: { text: string; points: number }[];
} {
  let score = 40; // base
  const improvements: { text: string; points: number }[] = [];

  // Network quality contribution
  if (p.preferredNetwork === "Telekom") score += 15;
  else if (p.preferredNetwork === "Vodafone") score += 12;
  else if (p.preferredNetwork) score += 8;
  else improvements.push({ text: "Netz auswählen für präzisere Analyse", points: 10 });

  // Budget awareness
  if (p.budget?.max) {
    if (p.budget.max <= 25) score += 10;
    else if (p.budget.max <= 40) score += 12;
    else score += 8;
  } else {
    improvements.push({ text: "Budget angeben für bessere Empfehlungen", points: 8 });
  }

  // Usage clarity
  if (p.dataUsage) score += 10;
  else improvements.push({ text: "Datenverbrauch klären — 87% zahlen zu viel", points: 7 });

  // Profile completeness bonus
  if ((p.interactions ?? 0) >= 3) score += 5;
  if ((p.interactions ?? 0) >= 8) score += 5;
  else improvements.push({ text: "Mehr Gespräche → schärferes Profil", points: 5 });

  // Recommendations received
  if (p.recommendedDevices.length >= 1) score += 5;

  // Savings orientation
  if (p.savingsPriority && p.budget?.max && p.budget.max > 30) {
    improvements.push({ text: "Budget senken — dein Profil legt Sparpotenzial nahe", points: 7 });
  }

  score = Math.min(98, Math.max(30, score));

  return { score, improvements: improvements.slice(0, 3) };
}

/** Profile label for display */
export function profileLabel(p: UserProfile): string {
  if (p.confidence < 15) return "Noch kein Profil";
  if (p.confidence < 30) return "Basis-Profil";
  if (p.confidence < 55) return "Teilprofil";
  if (p.confidence < 75) return "Gutes Profil";
  if (p.confidence < 90) return "Starkes Profil";
  return "Präzises Profil";
}
