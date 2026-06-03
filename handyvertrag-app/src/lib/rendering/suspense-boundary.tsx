"use client";

import React, { Component, ReactNode } from "react";

interface SuspenseBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface SuspenseBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Suspense Boundary Component
 * Provides error boundaries and loading states for React Suspense
 */
export class SuspenseBoundary extends Component<SuspenseBoundaryProps, SuspenseBoundaryState> {
  constructor(props: SuspenseBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error): SuspenseBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to production logger
    if (typeof window !== "undefined") {
      console.error("Suspense Boundary Error:", error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.errorFallback || (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">An error occurred while rendering this component.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Loading State Component
 * Provides a loading state for Suspense boundaries
 */
export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

/**
 * Fallback Component
 * Provides a fallback state when components fail to load
 */
export function FallbackComponent({ message = "Unable to load content" }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
