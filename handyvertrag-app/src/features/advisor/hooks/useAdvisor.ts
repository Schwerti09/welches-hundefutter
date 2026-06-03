"use client";

import { useState, useCallback } from "react";
import { AdvisorUserProfile, ConversationState, RecommendationResult } from "../types";

export function useAdvisor(sessionId: string) {
  const [state, setState] = useState<ConversationState | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const processMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch("/api/advisor/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          sessionId,
          state,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process message");
      }

      const data = await response.json();
      setState(data.state);
      setRecommendations(data.recommendations || null);
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [sessionId, state]);

  const refinePreferences = useCallback(async (updates: Partial<AdvisorUserProfile>) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/advisor/refine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          updates,
          sessionId,
          state,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to refine preferences");
      }

      const data = await response.json();
      setState(data.state);
      setRecommendations(data.recommendations || null);
    } catch (error) {
      console.error("Error refining preferences:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, state]);

  const reset = useCallback(() => {
    setState(null);
    setRecommendations(null);
  }, []);

  return {
    state,
    recommendations,
    isLoading,
    isTyping,
    processMessage,
    refinePreferences,
    reset,
  };
}
