/**
 * Client-safe utilities
 * This file can be imported in both client and server components
 */

export function isClientSide(): boolean {
  return typeof window !== "undefined";
}

export function assertClientSide(): void {
  if (typeof window === "undefined") {
    throw new Error("This function can only be called on the client");
  }
}

export function safeLocalStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  if (typeof localStorage === "undefined") return null;
  return localStorage;
}

export function safeSessionStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  if (typeof sessionStorage === "undefined") return null;
  return sessionStorage;
}

export function safeWindow(): Window | null {
  if (typeof window === "undefined") return null;
  return window;
}

export function safeDocument(): Document | null {
  if (typeof window === "undefined") return null;
  if (typeof document === "undefined") return null;
  return document;
}

export function safeNavigator(): Navigator | null {
  if (typeof window === "undefined") return null;
  if (typeof navigator === "undefined") return null;
  return navigator;
}
