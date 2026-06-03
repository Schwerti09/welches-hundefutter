export interface AIProvider {
  generateResponse(prompt: string): Promise<string>;
  classifyIntent(text: string): Promise<{ type: string; confidence: number }>;
}

export class AIAdapter {
  private provider?: AIProvider;

  setProvider(provider: AIProvider): void {
    this.provider = provider;
  }

  async generateResponse(prompt: string): Promise<string> {
    if (!this.provider) {
      throw new Error("No AI provider configured");
    }
    return this.provider.generateResponse(prompt);
  }

  async classifyIntent(text: string): Promise<{ type: string; confidence: number }> {
    if (!this.provider) {
      throw new Error("No AI provider configured");
    }
    return this.provider.classifyIntent(text);
  }

  isConfigured(): boolean {
    return this.provider !== undefined;
  }
}

export class OpenAIAdapter implements AIProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(prompt: string): Promise<string> {
    console.log("[OpenAI] Generating response for:", prompt);
    return "This is a placeholder for OpenAI integration.";
  }

  async classifyIntent(text: string): Promise<{ type: string; confidence: number }> {
    console.log("[OpenAI] Classifying intent for:", text);
    return { type: "general", confidence: 0.5 };
  }
}
