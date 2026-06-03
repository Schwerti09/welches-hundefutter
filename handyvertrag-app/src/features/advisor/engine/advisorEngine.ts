import { ConversationStateManager } from "../memory/conversationState";
import { IntentClassifier } from "../classifiers/intentClassifier";
import { RecommendationEngine } from "../recommendation/recommendationEngine";
import { QuestionEngine } from "../conversation/questionEngine";
import { AdvisorUserProfile, ConversationState, RecommendationResult, ClassifiedIntent } from "../types";

export class AdvisorEngine {
  private conversationManager: ConversationStateManager;
  private intentClassifier: IntentClassifier;
  private recommendationEngine: RecommendationEngine;
  private questionEngine: QuestionEngine;
  private sessionId: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.conversationManager = new ConversationStateManager(sessionId);
    this.intentClassifier = new IntentClassifier();
    this.recommendationEngine = new RecommendationEngine();
    this.questionEngine = new QuestionEngine();
  }

  processUserMessage(message: string): {
    response: string;
    state: ConversationState;
    recommendations?: RecommendationResult;
  } {
    this.conversationManager.addMessage("user", message);

    const classifiedIntent = this.intentClassifier.classify(message);
    this.conversationManager.updateUserProfile(classifiedIntent.extractedPreferences || {});

    const profile = this.conversationManager.getUserProfile();
    const currentStep = this.conversationManager.getCurrentStep();

    const nextQuestion = this.questionEngine.getNextQuestion(currentStep, profile);
    const shouldRecommend = this.questionEngine.shouldRecommend(profile);

    let response: string;
    let recommendations: RecommendationResult | undefined;

    if (shouldRecommend && this.conversationManager.canRecommend()) {
      recommendations = this.recommendationEngine.generateRecommendations(profile);
      this.conversationManager.setLastRecommendation(recommendations);
      this.conversationManager.setConfidence(recommendations.confidence);
      this.conversationManager.setStep("recommendation");

      response = this.buildRecommendationResponse(recommendations);
    } else if (nextQuestion) {
      this.conversationManager.setStep(nextQuestion.nextStep);
      response = nextQuestion.question;
    } else {
      response = "Ich habe deine Präferenzen verstanden. Lass mich passende Angebote für dich finden.";
    }

    this.conversationManager.addMessage("assistant", response);

    return {
      response,
      state: this.conversationManager.getState(),
      recommendations,
    };
  }

  refinePreferences(updates: Partial<AdvisorUserProfile>): {
    response: string;
    state: ConversationState;
    recommendations?: RecommendationResult;
  } {
    this.conversationManager.updateUserProfile(updates);
    const profile = this.conversationManager.getUserProfile();

    const recommendations = this.recommendationEngine.generateRecommendations(profile);
    this.conversationManager.setLastRecommendation(recommendations);
    this.conversationManager.setConfidence(recommendations.confidence);
    this.conversationManager.setStep("recommendation");

    const response = this.buildRecommendationResponse(recommendations);
    this.conversationManager.addMessage("assistant", response);

    return {
      response,
      state: this.conversationManager.getState(),
      recommendations,
    };
  }

  private buildRecommendationResponse(recommendations: RecommendationResult): string {
    const topProduct = recommendations.products[0];
    if (!topProduct) {
      return "Ich konnte leider keine passenden Angebote finden. Versuche es mit anderen Präferenzen.";
    }

    const summary = `Basierend auf deinen Präferenzen empfehle ich dir den ${topProduct.product.brand} ${topProduct.product.name} mit ${topProduct.offer.provider} für €${topProduct.offer.monthlyPrice}/Monat.`;
    
    const reasons = topProduct.reasons
      .map((r) => r.value)
      .slice(0, 3)
      .join(", ");

    return `${summary} ${reasons}.`;
  }

  getState(): ConversationState {
    return this.conversationManager.getState();
  }

  reset(): void {
    this.conversationManager.reset();
  }
}
