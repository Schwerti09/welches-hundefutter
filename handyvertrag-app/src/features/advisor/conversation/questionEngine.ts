import { AdvisorStep, AdvisorUserProfile } from "../types";

export class QuestionEngine {
  getNextQuestion(currentStep: AdvisorStep, profile: AdvisorUserProfile): {
    question: string;
    nextStep: AdvisorStep;
  } | null {
    if (currentStep === "initial") {
      return {
        question: "Wie hoch ist dein monatliches Budget für den Handyvertrag?",
        nextStep: "budget_question",
      };
    }

    if (currentStep === "budget_question" && !profile.brandPreference) {
      return {
        question: "Bevorzugst du eine bestimmte Marke (Apple, Samsung, Google, Xiaomi)?",
        nextStep: "brand_question",
      };
    }

    if (currentStep === "brand_question" && !profile.dataUsage) {
      return {
        question: "Wie viel Datenvolumen brauchst du pro Monat (wenig, mittel, viel, unbegrenzt)?",
        nextStep: "data_question",
      };
    }

    if (currentStep === "data_question" && profile.gamingInterest === undefined) {
      return {
        question: "Spielst du viel Games auf deinem Handy?",
        nextStep: "gaming_question",
      };
    }

    if (currentStep === "gaming_question" && !profile.cameraImportance) {
      return {
        question: "Wie wichtig ist dir eine gute Kamera?",
        nextStep: "camera_question",
      };
    }

    if (currentStep === "camera_question" && !profile.providerPreference) {
      return {
        question: "Bevorzugst du einen bestimmten Provider (Telekom, Vodafone, o2)?",
        nextStep: "provider_question",
      };
    }

    return null;
  }

  shouldRecommend(profile: AdvisorUserProfile): boolean {
    const required = [profile.budgetRange, profile.dataUsage];
    return required.every((field) => field !== undefined);
  }

  getRefinementQuestion(profile: AdvisorUserProfile): string | null {
    if (!profile.budgetRange) {
      return "Möchtest du dein Budget anpassen?";
    }
    if (!profile.dataUsage) {
      return "Möchtest du dein Datenvolumen ändern?";
    }
    if (!profile.brandPreference) {
      return "Möchtest du eine andere Marke in Betracht ziehen?";
    }
    return null;
  }
}
