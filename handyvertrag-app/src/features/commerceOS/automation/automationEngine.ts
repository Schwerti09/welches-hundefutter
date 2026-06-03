import { AutomationRule, AutomationType } from "../types";

export class AutomationEngine {
  private rules: Map<string, AutomationRule> = new Map();

  registerAutoTrendDetectionRule(trigger: Record<string, unknown>, action: Record<string, unknown>): AutomationRule {
    return this.createAutomationRule("trend_detection", "Auto Trend Detection", "Automatically detect market trends", trigger, action);
  }

  registerAutoRecommendationUpdateRule(trigger: Record<string, unknown>, action: Record<string, unknown>): AutomationRule {
    return this.createAutomationRule("recommendation_update", "Auto Recommendation Update", "Automatically update recommendations", trigger, action);
  }

  registerAutoSEOOpportunityRule(trigger: Record<string, unknown>, action: Record<string, unknown>): AutomationRule {
    return this.createAutomationRule("seo_opportunity", "Auto SEO Opportunity", "Automatically detect SEO opportunities", trigger, action);
  }

  registerAutoEntityEnrichmentRule(trigger: Record<string, unknown>, action: Record<string, unknown>): AutomationRule {
    return this.createAutomationRule("entity_enrichment", "Auto Entity Enrichment", "Automatically enrich entities", trigger, action);
  }

  registerAutoRankingUpdateRule(trigger: Record<string, unknown>, action: Record<string, unknown>): AutomationRule {
    return this.createAutomationRule("ranking_update", "Auto Ranking Update", "Automatically update rankings", trigger, action);
  }

  registerAutoAlertingRule(trigger: Record<string, unknown>, action: Record<string, unknown>): AutomationRule {
    return this.createAutomationRule("alerting", "Auto Alerting", "Automatically send alerts", trigger, action);
  }

  getAutomationRule(ruleId: string): AutomationRule | undefined {
    return this.rules.get(ruleId);
  }

  getAutomationRulesByType(type: AutomationType): AutomationRule[] {
    return Array.from(this.rules.values()).filter((r) => r.automationType === type);
  }

  getEnabledRules(): AutomationRule[] {
    return Array.from(this.rules.values()).filter((r) => r.enabled);
  }

  executeRule(ruleId: string): AutomationRule | undefined {
    const rule = this.rules.get(ruleId);
    if (!rule || !rule.enabled) return undefined;

    rule.lastExecutedAt = Date.now();
    rule.executionCount++;

    return rule;
  }

  enableRule(ruleId: string): boolean {
    const rule = this.rules.get(ruleId);
    if (!rule) return false;

    rule.enabled = true;
    return true;
  }

  disableRule(ruleId: string): boolean {
    const rule = this.rules.get(ruleId);
    if (!rule) return false;

    rule.enabled = false;
    return true;
  }

  private createAutomationRule(type: AutomationType, name: string, description: string, trigger: Record<string, unknown>, action: Record<string, unknown>): AutomationRule {
    const rule: AutomationRule = {
      ruleId: `rule-${type}-${Date.now()}`,
      automationType: type,
      name,
      description,
      trigger,
      action,
      enabled: true,
      lastExecutedAt: 0,
      executionCount: 0,
    };

    this.rules.set(rule.ruleId, rule);
    return rule;
  }
}
