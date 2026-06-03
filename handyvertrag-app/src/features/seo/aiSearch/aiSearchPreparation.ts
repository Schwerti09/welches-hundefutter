import { AIAnswerExtraction, Citation } from "../types";

export class AISearchPreparation {
  private answerExtractions: Map<string, AIAnswerExtraction> = new Map();

  createAnswerExtraction(
    entityId: string,
    question: string,
    answer: string,
    sources: string[],
    entities: string[]
  ): AIAnswerExtraction {
    const summary = this.generateSummary(answer);
    const citations = this.generateCitations(entities, sources);

    const extraction: AIAnswerExtraction = {
      entityId,
      question,
      answer,
      confidence: this.calculateConfidence(answer, sources),
      sources,
      entities,
      summary,
      citations,
    };

    this.answerExtractions.set(entityId, extraction);
    return extraction;
  }

  generateAIOverviewAnswer(entityId: string, content: string): string {
    // Generate concise answer for Google AI Overviews
    const sentences = content.split(". ");
    const overview = sentences.slice(0, 3).join(". ");
    return overview + ".";
  }

  generateConversationalAnswer(question: string, context: string[]): string {
    // Generate conversational-style answer
    const contextSummary = context.join(". ");
    return `Basierend auf unseren Daten: ${contextSummary}. ${question ? `Dies beantwortet Ihre Frage zu ${question}.` : ""}`;
  }

  generateSemanticSummary(content: string, maxLength: number = 200): string {
    // Generate semantic summary for AI search
    const sentences = content.split(". ");
    let summary = "";
    let length = 0;

    for (const sentence of sentences) {
      if (length + sentence.length > maxLength) break;
      summary += sentence + ". ";
      length += sentence.length;
    }

    return summary.trim();
  }

  generateStructuredAnswer(
    entityId: string,
    question: string,
    answer: string,
    structuredData: Record<string, unknown>
  ): string {
    // Generate structured answer for AI search engines
    const structuredPart = Object.entries(structuredData)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    return `${answer}\n\n${structuredPart}`;
  }

  prepareEntityForAISearch(entityId: string, entity: any): {
    summary: string;
    keyPoints: string[];
    entities: string[];
    citations: Citation[];
  } {
    const summary = this.generateSemanticSummary(entity.description || entity.name);
    const keyPoints = this.extractKeyPoints(entity);
    const entities = [entityId, ...(entity.relatedEntities || [])];
    const citations = this.generateCitations(entities, []);

    return {
      summary,
      keyPoints,
      entities,
      citations,
    };
  }

  prepareForGoogleAIOverview(entityId: string, content: string): {
    overview: string;
    keyFacts: string[];
    sources: string[];
  } {
    const overview = this.generateAIOverviewAnswer(entityId, content);
    const keyFacts = this.extractKeyFacts(content);
    const sources: string[] = [];

    return {
      overview,
      keyFacts,
      sources,
    };
  }

  prepareForConversationalSearch(
    question: string,
    context: string[]
  ): {
    answer: string;
    followUpQuestions: string[];
    relatedEntities: string[];
  } {
    const answer = this.generateConversationalAnswer(question, context);
    const followUpQuestions = this.generateFollowUpQuestions(question, context);
    const relatedEntities: string[] = [];

    return {
      answer,
      followUpQuestions,
      relatedEntities,
    };
  }

  private generateSummary(answer: string): string {
    const sentences = answer.split(". ");
    return sentences.slice(0, 2).join(". ") + ".";
  }

  private calculateConfidence(answer: string, sources: string[]): number {
    const hasAnswer = answer.length > 50;
    const hasSources = sources.length > 0;

    let confidence = 50;
    if (hasAnswer) confidence += 30;
    if (hasSources) confidence += 20;

    return confidence;
  }

  private generateCitations(entities: string[], sources: string[]): Citation[] {
    return entities.map((entityId) => ({
      entityId,
      entityType: "device" as const,
      relevance: 0.8,
      context: "related entity",
    }));
  }

  private extractKeyPoints(entity: any): string[] {
    const keyPoints: string[] = [];

    if (entity.name) keyPoints.push(`Name: ${entity.name}`);
    if (entity.brand) keyPoints.push(`Brand: ${entity.brand}`);
    if (entity.price) keyPoints.push(`Preis: €${entity.price}`);
    if (entity.specs) {
      Object.entries(entity.specs).forEach(([key, value]) => {
        keyPoints.push(`${key}: ${value}`);
      });
    }

    return keyPoints;
  }

  private extractKeyFacts(content: string): string[] {
    const sentences = content.split(". ");
    return sentences.slice(0, 5);
  }

  private generateFollowUpQuestions(question: string, context: string[]): string[] {
    const followUpQuestions: string[] = [];

    if (question.includes("Preis")) {
      followUpQuestions.push("Welche Marke bieten den besten Preis?");
      followUpQuestions.push("Gibt es günstigere Alternativen?");
    }

    if (question.includes("Empfehlung")) {
      followUpQuestions.push("Welche Empfehlungslaufzeiten sind verfügbar?");
      followUpQuestions.push("Gibt es unbegrenzte Futtervolumen?");
    }

    if (question.includes("Gaming")) {
      followUpQuestions.push("Welche Hunds haben die beste Gaming-Leistung?");
      followUpQuestions.push("Brauche ich viel Futtervolumen für Gaming?");
    }

    return followUpQuestions;
  }

  getAnswerExtraction(entityId: string): AIAnswerExtraction | undefined {
    return this.answerExtractions.get(entityId);
  }

  getAllAnswerExtractions(): AIAnswerExtraction[] {
    return Array.from(this.answerExtractions.values());
  }
}
