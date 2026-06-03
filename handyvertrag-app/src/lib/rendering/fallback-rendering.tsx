"use client";

import React from "react";

/**
 * Fallback Rendering System
 * Provides fallback rendering when systems fail
 */

export interface FallbackRecommendation {
  id: string;
  title: string;
  description: string;
  price: string;
  provider: string;
}

export const FALLBACK_RECOMMENDATIONS: FallbackRecommendation[] = [
  {
    id: "fallback-1",
    title: "Telekom MagentaMobil L",
    description: "Unlimited data with premium support",
    price: "€29.99/month",
    provider: "Telekom",
  },
  {
    id: "fallback-2",
    title: "Vodafone Red L",
    description: "High-speed data with streaming benefits",
    price: "€27.99/month",
    provider: "Vodafone",
  },
  {
    id: "fallback-3",
    title: "O2 Free L",
    description: "Flexible data with international roaming",
    price: "€25.99/month",
    provider: "O2",
  },
];

export function FallbackRecommendationCard({ recommendation }: { recommendation: FallbackRecommendation }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-2">{recommendation.title}</h3>
      <p className="text-gray-600 mb-4">{recommendation.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-blue-600">{recommendation.price}</span>
        <span className="text-sm text-gray-500">{recommendation.provider}</span>
      </div>
    </div>
  );
}

export function FallbackRecommendationsList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {FALLBACK_RECOMMENDATIONS.map((recommendation) => (
        <FallbackRecommendationCard key={recommendation.id} recommendation={recommendation} />
      ))}
    </div>
  );
}

export function FallbackEntityList({ entities }: { entities: string[] }) {
  return (
    <div className="space-y-2">
      {entities.map((entity) => (
        <div key={entity} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <span className="text-gray-700">{entity}</span>
        </div>
      ))}
    </div>
  );
}

export function FallbackLoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading recommendations...</p>
      </div>
    </div>
  );
}

export function FallbackErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md">
        <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to load content</h2>
        <p className="text-gray-600 mb-4">{error.message || "An unexpected error occurred"}</p>
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export function withFallback<P extends object>(
  Component: React.ComponentType<P>,
  FallbackComponent: React.ComponentType<{ error?: Error }>
) {
  return function WithFallbackWrapper(props: P) {
    return (
      <React.Suspense fallback={<FallbackLoadingState />}>
        <Component {...props} />
      </React.Suspense>
    );
  };
}
