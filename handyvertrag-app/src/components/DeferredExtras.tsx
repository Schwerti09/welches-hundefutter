"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Nicht kritisch für den ersten Eindruck: Support-FAB + Exit-Intent.
// Werden aus dem Layout-Bundle herausgelöst und erst in einer Leerlaufphase
// nach dem Laden montiert → sie belasten Hydration & TBT nicht.
const SupportChatWidget = dynamic(() => import("./SupportChatWidget"), { ssr: false });
const ExitIntent = dynamic(() => import("./ExitIntent"), { ssr: false });

export default function DeferredExtras() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (typeof w.requestIdleCallback === "function") {
      idleId = w.requestIdleCallback(() => setReady(true), { timeout: 3000 });
    } else {
      timeoutId = setTimeout(() => setReady(true), 1500);
    }

    return () => {
      if (idleId && typeof w.cancelIdleCallback === "function") w.cancelIdleCallback(idleId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  if (!ready) return null;

  return (
    <>
      <ExitIntent />
      <SupportChatWidget />
    </>
  );
}
