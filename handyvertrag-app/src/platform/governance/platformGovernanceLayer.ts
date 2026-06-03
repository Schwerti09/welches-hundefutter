import { GovernancePolicy } from "../types";

export class PlatformGovernanceLayer {
  private policies: Map<string, GovernancePolicy> = new Map();

  registerRecommendationPolicy(name: string, rules: Array<{ rule: string; severity: "error" | "warning" | "info"; enabled: boolean }>): GovernancePolicy {
    return this.createPolicy("recommendation", name, rules);
  }

  registerRankingPolicy(name: string, rules: Array<{ rule: string; severity: "error" | "warning" | "info"; enabled: boolean }>): GovernancePolicy {
    return this.createPolicy("ranking", name, rules);
  }

  registerSEOSafetyPolicy(name: string, rules: Array<{ rule: string; severity: "error" | "warning" | "info"; enabled: boolean }>): GovernancePolicy {
    return this.createPolicy("seo_safety", name, rules);
  }

  registerAISafetyRule(name: string, rules: Array<{ rule: string; severity: "error" | "warning" | "info"; enabled: boolean }>): GovernancePolicy {
    return this.createPolicy("ai_safety", name, rules);
  }

  registerConsistencyRule(name: string, rules: Array<{ rule: string; severity: "error" | "warning" | "info"; enabled: boolean }>): GovernancePolicy {
    return this.createPolicy("consistency", name, rules);
  }

  registerEventValidationRule(name: string, rules: Array<{ rule: string; severity: "error" | "warning" | "info"; enabled: boolean }>): GovernancePolicy {
    return this.createPolicy("event_validation", name, rules);
  }

  validateAgainstPolicy(policyType: GovernancePolicy["policyType"], data: Record<string, unknown>): Array<{ rule: string; severity: "error" | "warning" | "info"; passed: boolean }> {
    const policies = this.getPoliciesByType(policyType);
    const results: Array<{ rule: string; severity: "error" | "warning" | "info"; passed: boolean }> = [];

    for (const policy of policies) {
      if (!policy.enabled) continue;

      for (const rule of policy.rules) {
        if (!rule.enabled) continue;

        const passed = this.validateRule(rule.rule, data);
        results.push({
          rule: rule.rule,
          severity: rule.severity,
          passed,
        });
      }
    }

    return results;
  }

  getPolicy(policyId: string): GovernancePolicy | undefined {
    return this.policies.get(policyId);
  }

  getPoliciesByType(policyType: GovernancePolicy["policyType"]): GovernancePolicy[] {
    return Array.from(this.policies.values()).filter((p) => p.policyType === policyType);
  }

  getEnabledPolicies(): GovernancePolicy[] {
    return Array.from(this.policies.values()).filter((p) => p.enabled);
  }

  enablePolicy(policyId: string): boolean {
    const policy = this.policies.get(policyId);
    if (!policy) return false;

    policy.enabled = true;
    return true;
  }

  disablePolicy(policyId: string): boolean {
    const policy = this.policies.get(policyId);
    if (!policy) return false;

    policy.enabled = false;
    return true;
  }

  enableRule(policyId: string, ruleIndex: number): boolean {
    const policy = this.policies.get(policyId);
    if (!policy || ruleIndex >= policy.rules.length) return false;

    policy.rules[ruleIndex].enabled = true;
    return true;
  }

  disableRule(policyId: string, ruleIndex: number): boolean {
    const policy = this.policies.get(policyId);
    if (!policy || ruleIndex >= policy.rules.length) return false;

    policy.rules[ruleIndex].enabled = false;
    return true;
  }

  private createPolicy(policyType: GovernancePolicy["policyType"], name: string, rules: Array<{ rule: string; severity: "error" | "warning" | "info"; enabled: boolean }>): GovernancePolicy {
    const policy: GovernancePolicy = {
      policyId: `policy-${policyType}-${name}-${Date.now()}`,
      policyType,
      name,
      rules,
      enabled: true,
    };

    this.policies.set(policy.policyId, policy);
    return policy;
  }

  private validateRule(rule: string, data: Record<string, unknown>): boolean {
    // Placeholder for rule validation
    return true;
  }
}
