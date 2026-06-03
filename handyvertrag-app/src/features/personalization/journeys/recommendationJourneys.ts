import { RecommendationJourney, JourneyStep } from "../types";

export class RecommendationJourneys {
  private journeys: Map<string, RecommendationJourney> = new Map();

  createJourney(sessionId: string): RecommendationJourney {
    const journey: RecommendationJourney = {
      sessionId,
      journeyId: `journey-${sessionId}-${Date.now()}`,
      steps: [],
      currentStep: 0,
      progression: "stable",
      conversionProbability: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.journeys.set(journey.journeyId, journey);
    return journey;
  }

  addStep(journeyId: string, step: JourneyStep): void {
    const journey = this.journeys.get(journeyId);
    if (journey) {
      journey.steps.push(step);
      journey.currentStep = journey.steps.length - 1;
      journey.updatedAt = Date.now();
      this.updateProgression(journey);
      this.calculateConversionProbability(journey);
    }
  }

  private updateProgression(journey: RecommendationJourney): void {
    if (journey.steps.length < 2) {
      journey.progression = "stable";
      return;
    }

    const previousStep = journey.steps[journey.steps.length - 2];
    const currentStep = journey.steps[journey.steps.length - 1];

    const previousPrice = this.extractPrice(previousStep);
    const currentPrice = this.extractPrice(currentStep);

    if (currentPrice > previousPrice * 1.2) {
      journey.progression = "upgrading";
    } else if (currentPrice < previousPrice * 0.8) {
      journey.progression = "downgrading";
    } else {
      journey.progression = "refining";
    }
  }

  private calculateConversionProbability(journey: RecommendationJourney): void {
    const steps = journey.steps;
    if (steps.length === 0) {
      journey.conversionProbability = 0;
      return;
    }

    let probability = 0.3;

    // Clicked steps increase probability
    const clickedSteps = steps.filter((s) => s.action === "clicked").length;
    probability += clickedSteps * 0.15;

    // Saved steps increase probability significantly
    const savedSteps = steps.filter((s) => s.action === "saved").length;
    probability += savedSteps * 0.25;

    // Compared steps increase probability
    const comparedSteps = steps.filter((s) => s.action === "compared").length;
    probability += comparedSteps * 0.1;

    // Progression type affects probability
    if (journey.progression === "upgrading") probability += 0.1;
    if (journey.progression === "refining") probability += 0.05;

    journey.conversionProbability = Math.min(probability, 0.95);
  }

  getJourney(journeyId: string): RecommendationJourney | undefined {
    return this.journeys.get(journeyId);
  }

  getJourneyBySession(sessionId: string): RecommendationJourney | undefined {
    for (const journey of this.journeys.values()) {
      if (journey.sessionId === sessionId) {
        return journey;
      }
    }
    return undefined;
  }

  getAllJourneys(): RecommendationJourney[] {
    return Array.from(this.journeys.values());
  }

  getHighConversionJourneys(threshold: number = 0.7): RecommendationJourney[] {
    return Array.from(this.journeys.values()).filter(
      (j) => j.conversionProbability >= threshold
    );
  }

  getJourneyStats(journeyId: string): JourneyStats | undefined {
    const journey = this.journeys.get(journeyId);
    if (!journey) return undefined;

    const steps = journey.steps;
    const viewed = steps.filter((s) => s.action === "viewed").length;
    const clicked = steps.filter((s) => s.action === "clicked").length;
    const saved = steps.filter((s) => s.action === "saved").length;
    const compared = steps.filter((s) => s.action === "compared").length;

    return {
      totalSteps: steps.length,
      viewed,
      clicked,
      saved,
      compared,
      progression: journey.progression,
      conversionProbability: journey.conversionProbability,
      duration: journey.updatedAt - journey.createdAt,
    };
  }

  private extractPrice(step: JourneyStep): number {
    const price = step.metadata.price as number || 0;
    return price;
  }
}

interface JourneyStats {
  totalSteps: number;
  viewed: number;
  clicked: number;
  saved: number;
  compared: number;
  progression: RecommendationJourney["progression"];
  conversionProbability: number;
  duration: number;
}
