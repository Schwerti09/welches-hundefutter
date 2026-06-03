import { MarketSignal, SignalType } from "../types";

export class MarketSignalEngine {
  private signals: Map<string, MarketSignal> = new Map();
  private signalHistory: Map<string, MarketSignal[]> = new Map();

  detectRisingDevice(deviceId: string, deviceName: string, growth: number): MarketSignal {
    return this.createSignal("rising", deviceId, "device", {
      deviceName,
      growth,
    });
  }

  detectFallingDevice(deviceId: string, deviceName: string, decline: number): MarketSignal {
    return this.createSignal("falling", deviceId, "device", {
      deviceName,
      decline,
    });
  }

  detectTrendingProvider(providerId: string, providerName: string, momentum: number): MarketSignal {
    return this.createSignal("trending", providerId, "provider", {
      providerName,
      momentum,
    });
  }

  detectPriceDrop(entityId: string, entityType: "device" | "provider" | "contract", drop: number): MarketSignal {
    return this.createSignal("price_drop", entityId, entityType, {
      drop,
    });
  }

  detectCashbackIncrease(entityId: string, increase: number): MarketSignal {
    return this.createSignal("cashback_increase", entityId, "contract", {
      increase,
    });
  }

  detectDataVolumeTrend(trend: "increasing" | "decreasing", strength: number): MarketSignal {
    return this.createSignal("volume_trend", "data-volume", "contract", {
      trend,
      strength,
    });
  }

  detectPremiumMarketShift(direction: "up" | "down", magnitude: number): MarketSignal {
    return this.createSignal("premium_shift", "premium-market", "contract", {
      direction,
      magnitude,
    });
  }

  detectBudgetMarketShift(direction: "up" | "down", magnitude: number): MarketSignal {
    return this.createSignal("budget_shift", "budget-market", "contract", {
      direction,
      magnitude,
    });
  }

  detectUserDemandChange(demandType: string, change: number): MarketSignal {
    return this.createSignal("demand_change", demandType, "device", {
      demandType,
      change,
    });
  }

  getSignal(signalId: string): MarketSignal | undefined {
    return this.signals.get(signalId);
  }

  getSignalsByType(signalType: SignalType): MarketSignal[] {
    return Array.from(this.signals.values()).filter((s) => s.signalType === signalType);
  }

  getSignalsByEntity(entityId: string): MarketSignal[] {
    return Array.from(this.signals.values()).filter((s) => s.entityId === entityId);
  }

  getActiveSignals(threshold: number = 50): MarketSignal[] {
    return Array.from(this.signals.values()).filter((s) => s.confidence >= threshold);
  }

  getSignalHistory(entityId: string): MarketSignal[] {
    return this.signalHistory.get(entityId) || [];
  }

  private createSignal(signalType: SignalType, entityId: string, entityType: "device" | "provider" | "contract", metadata: Record<string, unknown>): MarketSignal {
    const signal: MarketSignal = {
      signalId: `signal-${signalType}-${entityId}-${Date.now()}`,
      signalType,
      entityId,
      entityType,
      signalStrength: this.calculateSignalStrength(signalType, metadata),
      confidence: this.calculateConfidence(signalType, metadata),
      velocity: this.calculateVelocity(signalType, metadata),
      momentum: this.calculateMomentum(signalType, metadata),
      detectedAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      metadata,
    };

    this.signals.set(signal.signalId, signal);

    const history = this.signalHistory.get(entityId) || [];
    history.push(signal);
    this.signalHistory.set(entityId, history);

    return signal;
  }

  private calculateSignalStrength(signalType: SignalType, metadata: Record<string, unknown>): number {
    let strength = 50;

    if (signalType === "price_drop" && metadata.drop) {
      strength = Math.min(100, 50 + (metadata.drop as number) * 2);
    }

    if (signalType === "cashback_increase" && metadata.increase) {
      strength = Math.min(100, 50 + (metadata.increase as number) * 2);
    }

    if (signalType === "trending" && metadata.momentum) {
      strength = Math.min(100, 50 + (metadata.momentum as number) * 2);
    }

    return strength;
  }

  private calculateConfidence(signalType: SignalType, metadata: Record<string, unknown>): number {
    return 70;
  }

  private calculateVelocity(signalType: SignalType, metadata: Record<string, unknown>): number {
    return 5;
  }

  private calculateMomentum(signalType: SignalType, metadata: Record<string, unknown>): number {
    return 10;
  }
}
