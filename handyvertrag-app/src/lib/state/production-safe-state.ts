"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Production-Safe State Management
 * Prevents hydration state mismatch, stale SSR state, client/server divergence,
 * duplicated fetches, and infinite rerenders
 */

export function useProductionSafeState<T>(
  initialState: T | (() => T)
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialState);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const safeSetState = useCallback((value: T | ((prev: T) => T)) => {
    if (!isMounted.current) return;
    setState(value);
  }, []);

  return [state, safeSetState];
}

export function useHydrationSafeState<T>(
  initialState: T | (() => T),
  hydrationKey?: string
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [state, setState] = useState<T>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    setIsHydrated(true);
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const safeSetState = useCallback((value: T | ((prev: T) => T)) => {
    if (!isMounted.current) return;
    setState(value);
  }, []);

  return [state, safeSetState, isHydrated];
}

export function useDedupedFetch<T>(
  url: string,
  options?: RequestInit
): {
  data: T | null;
  error: Error | null;
  loading: boolean;
  refetch: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMounted = useRef(true);

  const fetchData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        ...options,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (isMounted.current) {
        setData(result);
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        if (isMounted.current) {
          setError(err);
        }
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      isMounted.current = false;
    };
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, loading, refetch };
}

export function useSafeAsyncEffect(
  effect: () => Promise<void>,
  dependencies: unknown[]
): void {
  const isMounted = useRef(true);

  useEffect(() => {
    let cancelled = false;

    const runEffect = async () => {
      try {
        await effect();
      } catch (error) {
        if (isMounted.current && !cancelled) {
          console.error("Async effect error:", error);
        }
      }
    };

    runEffect();

    return () => {
      cancelled = true;
      isMounted.current = false;
    };
  }, dependencies);
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastExecuted.current >= delay) {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return throttledValue;
}
