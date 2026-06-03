import { ConversationState, ConversationMessage, AdvisorStep, AdvisorUserProfile, RecommendationResult } from "../types";
import { UserProfileManager } from "./userProfile";

export class ConversationStateManager {
  private state: ConversationState;
  private sessionId: string;
  private profileManager: UserProfileManager;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.profileManager = new UserProfileManager();
    this.state = {
      messages: [],
      userProfile: {},
      currentStep: "initial",
      confidence: 0,
    };
  }

  addMessage(role: "user" | "assistant", content: string): void {
    const message: ConversationMessage = {
      id: `${this.sessionId}-${Date.now()}`,
      role,
      content,
      timestamp: Date.now(),
    };
    this.state.messages.push(message);
  }

  getMessages(): ConversationMessage[] {
    return [...this.state.messages];
  }

  getCurrentStep(): AdvisorStep {
    return this.state.currentStep;
  }

  setStep(step: AdvisorStep): void {
    this.state.currentStep = step;
  }

  getUserProfile(): AdvisorUserProfile {
    return this.profileManager.getProfile();
  }

  updateUserProfile(updates: Partial<AdvisorUserProfile>): void {
    this.profileManager.updateProfile(updates);
    this.state.userProfile = this.profileManager.getProfile();
  }

  getConfidence(): number {
    return this.state.confidence;
  }

  setConfidence(confidence: number): void {
    this.state.confidence = Math.max(0, Math.min(100, confidence));
  }

  getLastRecommendation() {
    return this.state.lastRecommendation;
  }

  setLastRecommendation(recommendation: RecommendationResult): void {
    this.state.lastRecommendation = recommendation;
  }

  getState(): ConversationState {
    return {
      messages: [...this.state.messages],
      userProfile: { ...this.state.userProfile },
      currentStep: this.state.currentStep,
      confidence: this.state.confidence,
      lastRecommendation: this.state.lastRecommendation,
    };
  }

  reset(): void {
    this.profileManager.resetProfile();
    this.state = {
      messages: [],
      userProfile: {},
      currentStep: "initial",
      confidence: 0,
    };
  }

  canRecommend(): boolean {
    return this.state.confidence >= 60 && this.profileManager.hasSufficientInfo();
  }

  getCompletionPercentage(): number {
    return this.profileManager.getCompletionPercentage();
  }
}
