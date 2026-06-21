"use client";

import { useEffect, useState } from "react";

function fmt(d: Date) {
  return d.toLocaleString("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LiveStatusBar({ countLabel }: { countLabel: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="max-w-4xl mx-auto w-full px-5 mb-4">
      <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
        {/* Live-Dot + Status */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">Live</span>
        </div>

        {/* Uhrzeit — nur wenn JS bereit */}
        <div className="flex-1 text-center">
          {now ? (
            <span className="text-xs sm:text-sm text-white/70 font-medium tabular-nums">
              {fmt(now)} Uhr
            </span>
          ) : (
            <span className="text-xs text-white/30">wird geladen…</span>
          )}
        </div>

        {/* Produkt-Zähler */}
        <div className="shrink-0 text-right hidden sm:block">
          <span className="text-xs text-white/60">
            <span className="text-white/80 font-semibold">{countLabel}</span> Sorten geprüft
          </span>
        </div>

        {/* Made in Germany */}
        <div className="shrink-0 hidden md:flex items-center gap-1.5 text-xs text-white/60 border-l border-white/10 pl-3">
          🇩🇪 <span>Made in Germany · KI-Power</span>
        </div>
      </div>
    </div>
  );
}
