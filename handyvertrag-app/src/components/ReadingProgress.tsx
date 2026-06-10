"use client";

import { useEffect, useState } from "react";

/**
 * Dünner Lesefortschritts-Balken am oberen Rand, der sich beim Scrollen füllt.
 * Premium-Detail für lange Artikel — rein clientseitig, ohne Layout-Einfluss.
 */
export default function ReadingProgress({ accent = "#f0a73c" }: { accent?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollable = el.scrollHeight - el.clientHeight;
      setProgress(scrollable > 0 ? Math.min(100, (el.scrollTop / scrollable) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent" aria-hidden>
      <div
        className="h-full transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${accent}, #ff8a4c)` }}
      />
    </div>
  );
}
