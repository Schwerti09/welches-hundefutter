import { AdvisorUserProfile, RecommendationResult } from "../types";
import { ScoringEngine } from "../scoring/scoringEngine";
import { ExplanationGenerator } from "./explanationGenerator";
import { products } from "@/data/products";
import { QuestionEngine } from "../conversation/questionEngine";

export class RecommendationEngine {
  private scoringEngine: ScoringEngine;
  private explanationGenerator: ExplanationGenerator;
  private questionEngine: QuestionEngine;

  constructor() {
    this.scoringEngine = new ScoringEngine();
    this.explanationGenerator = new ExplanationGenerator();
    this.questionEngine = new QuestionEngine();
  }

  generateRecommendations(profile: AdvisorUserProfile): RecommendationResult {
    const scores = this.scoringEngine.scoreAllProducts(profile);
    const topScores = scores.slice(0, 3);

    const productsWithScores = topScores.map((score) => {
      const product = products.find((p) => p.id === score.productId);
      const offer = product?.offers.find((o) => o.id === score.offerId);

      if (!product || !offer) {
        return null;
      }

      const reasons = this.explanationGenerator.generateExplanation(score, product, offer);

      return {
        product,
        offer,
        score,
        reasons,
      };
    }).filter((item) => item !== null);

    const nextQuestion = this.questionEngine.getRefinementQuestion(profile) || undefined;

    const confidence = this.calculateOverallConfidence(profile);

    return {
      products: productsWithScores as any[],
      userProfile: profile,
      confidence,
      nextQuestion,
    };
  }

  private calculateOverallConfidence(profile: AdvisorUserProfile): number {
    const fields = [
      profile.budgetRange,
      profile.dataUsage,
      profile.brandPreference,
      profile.providerPreference,
      profile.gamingInterest,
      profile.cameraImportance,
    ];

    const filled = fields.filter((f) => f !== undefined).length;
    return (filled / fields.length) * 100;
  }
}
