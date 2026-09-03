"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

type Mode = "system" | "light" | "dark";
const KEY = "bella-theme";
const EVT = "bella-theme-change";

/**
 * Theme-Umschalter (Roadmap 3.1). Setzt `data-theme` auf <html>.
 * "system" entfernt das Attribut → CSS-Default (aktuell Dark) greift.
 *
 * Der gespeicherte Modus wird über `useSyncExternalStore` aus dem localStorage
 * gelesen — das ist das richtige Primitive dafür (kein setState-im-Effect,
 * kein Hydration-Mismatch: Server-Snapshot ist immer "system").
 * Persistenz defensiv (Private Mode / geblockter Storage → Fallback "system").
 */
export function applyTheme(mode: Mode) {
  const el = document.documentElement;
  if (mode === "system") el.removeAttribute("data-theme");
  else el.setAttribute("data-theme", mode);
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb); // andere Tabs
  window.addEventListener(EVT, cb); // gleicher Tab
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVT, cb);
  };
}

function readMode(): Mode {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    /* ignore */
  }
  return "system";
}

const serverMode = (): Mode => "system";

export default function ThemeToggle() {
  const mode = useSyncExternalStore(subscribe, readMode, serverMode);

  // DOM mit dem Modus synchron halten (DOM-Write, kein setState → lint-safe).
  useEffect(() => {
    applyTheme(mode);
  }, [mode]);

  const choose = useCallback((m: Mode) => {
    try {
      localStorage.setItem(KEY, m);
    } catch {
      /* ignore */
    }
    applyTheme(m);
    window.dispatchEvent(new Event(EVT));
  }, []);

  return (
    <div
      className="inline-flex rounded-xl border border-[var(--border)] p-1 text-xs"
      role="group"
      aria-label="Farbschema"
    >
      {(["system", "light", "dark"] as Mode[]).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => choose(m)}
          aria-pressed={mode === m}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            mode === m
              ? "bg-[var(--accent)] text-[var(--accent-ink)] font-semibold"
              : "text-[var(--text-muted)] hover:bg-[var(--surface)]"
          }`}
        >
          {m === "system" ? "System" : m === "light" ? "Hell" : "Dunkel"}
        </button>
      ))}
    </div>
  );
}
