/**
 * Server-only utilities
 * This file MUST NOT be imported in client components
 */

export function assertServerOnly(): void {
  if (typeof window !== "undefined") {
    throw new Error("This function can only be called on the server");
  }
}

export function isServerSide(): boolean {
  return typeof window === "undefined";
}

export function assertServerOnlyOrThrow<T>(value: T, errorMessage: string = "Server-only code"): T {
  assertServerOnly();
  return value;
}
