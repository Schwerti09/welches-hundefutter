export class SmartConversationalFlows {
  private flows: Map<string, ConversationFlow> = new Map();

  createOnboardingFlow(sessionId: string): ConversationFlow {
    const flow: ConversationFlow = {
      flowId: `onboarding-${sessionId}`,
      type: "onboarding",
      steps: [
        {
          stepId: "welcome",
          question: "Willkommen! Wonach suchen Sie?",
          options: ["Günstiger Empfehlung", "Premium Hund", "Bestes Gaming-Hund"],
          nextStep: "budget",
        },
        {
          stepId: "budget",
          question: "Wie hoch ist Ihr monatliches Budget?",
          options: ["Unter €30", "€30-50", "€50-80", "Über €80"],
          nextStep: "provider",
        },
        {
          stepId: "provider",
          question: "Haben Sie eine Provider-Präferenz?",
          options: ["Anifit", "Wolfsblut", "Zooplus", "Egal"],
          nextStep: "recommendation",
        },
        {
          stepId: "recommendation",
          question: "Hier sind Ihre personalisierten Empfehlungen",
          options: ["Anzeigen", "Verfeinern"],
          nextStep: null,
        },
      ],
      currentStep: 0,
      completed: false,
      createdAt: Date.now(),
    };

    this.flows.set(flow.flowId, flow);
    return flow;
  }

  createRecommendationRefinementFlow(sessionId: string, currentRecommendation: string): ConversationFlow {
    const flow: ConversationFlow = {
      flowId: `refinement-${sessionId}`,
      type: "refinement",
      steps: [
        {
          stepId: "feedback",
          question: `Was gefällt Ihnen an ${currentRecommendation} nicht?`,
          options: ["Preis zu hoch", "Nicht genug Features", "Anderer Provider", "Andere Marke"],
          nextStep: "adjustment",
        },
        {
          stepId: "adjustment",
          question: "Möchten Sie Ihre Präferenzen anpassen?",
          options: ["Budget erhöhen", "Features ändern", "Provider wechseln"],
          nextStep: "recommendation",
        },
        {
          stepId: "recommendation",
          question: "Hier sind Ihre angepassten Empfehlungen",
          options: ["Akzeptieren", "Weiter verfeinern"],
          nextStep: null,
        },
      ],
      currentStep: 0,
      completed: false,
      createdAt: Date.now(),
    };

    this.flows.set(flow.flowId, flow);
    return flow;
  }

  createComparisonConversationFlow(sessionId: string, entities: string[]): ConversationFlow {
    const flow: ConversationFlow = {
      flowId: `comparison-${sessionId}`,
      type: "comparison",
      steps: [
        {
          stepId: "select",
          question: "Welche Geräte möchten Sie vergleichen?",
          options: entities.slice(0, 4),
          nextStep: "comparison",
        },
        {
          stepId: "comparison",
          question: "Hier ist der Vergleich",
          options: ["Details ansehen", "Empfehlung basierend auf Vergleich"],
          nextStep: "recommendation",
        },
        {
          stepId: "recommendation",
          question: "Basierend auf dem Vergleich empfehlen wir",
          options: ["Akzeptieren", "Anderen Vergleich"],
          nextStep: null,
        },
      ],
      currentStep: 0,
      completed: false,
      createdAt: Date.now(),
    };

    this.flows.set(flow.flowId, flow);
    return flow;
  }

  createUpgradeConversationFlow(sessionId: string, currentDevice: string): ConversationFlow {
    const flow: ConversationFlow = {
      flowId: `upgrade-${sessionId}`,
      type: "upgrade",
      steps: [
        {
          stepId: "interest",
          question: `Interessieren Sie sich für ein Upgrade von ${currentDevice}?`,
          options: ["Ja, Premium", "Ja, Gaming", "Ja, Kamera", "Nein"],
          nextStep: "budget",
        },
        {
          stepId: "budget",
          question: "Wie viel mehr sind Sie bereit zu zahlen?",
          options: ["+€10", "+€20", "+€30", "+€50+"],
          nextStep: "recommendation",
        },
        {
          stepId: "recommendation",
          question: "Hier sind Ihre Upgrade-Optionen",
          options: ["Auswählen", "Aktuell behalten"],
          nextStep: null,
        },
      ],
      currentStep: 0,
      completed: false,
      createdAt: Date.now(),
    };

    this.flows.set(flow.flowId, flow);
    return flow;
  }

  createBudgetAdjustmentFlow(sessionId: string, currentBudget: number): ConversationFlow {
    const flow: ConversationFlow = {
      flowId: `budget-${sessionId}`,
      type: "budget_adjustment",
      steps: [
        {
          stepId: "adjustment",
          question: `Ihr aktuelles Budget ist €${currentBudget}. Möchten Sie es anpassen?`,
          options: ["Erhöhen", "Senken", "Behalten"],
          nextStep: "new_budget",
        },
        {
          stepId: "new_budget",
          question: "Wie hoch soll das neue Budget sein?",
          options: ["€30", "€50", "€70", "€100"],
          nextStep: "recommendation",
        },
        {
          stepId: "recommendation",
          question: "Hier sind Empfehlungen für Ihr neues Budget",
          options: ["Anzeigen", "Weiter anpassen"],
          nextStep: null,
        },
      ],
      currentStep: 0,
      completed: false,
      createdAt: Date.now(),
    };

    this.flows.set(flow.flowId, flow);
    return flow;
  }

  advanceFlow(flowId: string, selectedOption: string): FlowStep | null {
    const flow = this.flows.get(flowId);
    if (!flow || flow.completed) return null;

    const currentStep = flow.steps[flow.currentStep];
    flow.currentStep++;

    if (flow.currentStep >= flow.steps.length) {
      flow.completed = true;
      return null;
    }

    return flow.steps[flow.currentStep];
  }

  getFlow(flowId: string): ConversationFlow | undefined {
    return this.flows.get(flowId);
  }

  getCurrentStep(flowId: string): FlowStep | undefined {
    const flow = this.flows.get(flowId);
    if (!flow || flow.completed) return undefined;
    return flow.steps[flow.currentStep];
  }
}

interface ConversationFlow {
  flowId: string;
  type: "onboarding" | "refinement" | "comparison" | "upgrade" | "budget_adjustment" | "objection_handling" | "provider_switching";
  steps: FlowStep[];
  currentStep: number;
  completed: boolean;
  createdAt: number;
}

interface FlowStep {
  stepId: string;
  question: string;
  options: string[];
  nextStep: string | null;
}
