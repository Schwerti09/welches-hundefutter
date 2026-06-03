"use client";

import { useEffect, useState, useRef } from "react";

// Smoothly animates a number toward a slowly-drifting live target.
function useLiveCounter(base: number, drift: number, decimals = 0) {
  const [val, setVal] = useState(base);
  const target = useRef(base);
  const current = useRef(base);

  useEffect(() => {
    const driftTimer = setInterval(() => {
      target.current = base + Math.floor(Math.random() * drift);
    }, 2600 + Math.random() * 1800);

    let raf = 0;
    const tick = () => {
      current.current += (target.current - current.current) * 0.06;
      setVal(current.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { clearInterval(driftTimer); cancelAnimationFrame(raf); };
  }, [base, drift]);

  return val.toLocaleString("de-DE", { maximumFractionDigits: decimals, minimumFractionDigits: decimals });
}

function MetricRow({ label, value, accent = false, check = false }: { label: string; value?: string; accent?: boolean; check?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-white/5 last:border-0">
      <span className="flex items-center gap-2 text-sm text-white/55">
        <span className={`text-xs ${accent ? "text-emerald-400" : "text-indigo-400"}`}>{check ? "✓" : "›"}</span>
        {label}
      </span>
      {value && (
        <span className={`font-mono font-semibold tabular-nums ${accent ? "text-emerald-300" : "text-white"}`}>
          {value}
        </span>
      )}
    </div>
  );
}

export default function LiveIntel() {
  const analyzed = useLiveCounter(14328, 60);
  const matched = useLiveCounter(212, 6);
  const filtered = useLiveCounter(14116, 55);

  return (
    <div className="glass-strong glow-border rounded-2xl p-5 w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] tracking-[0.25em] text-white/40 font-semibold uppercase">Live Intelligence</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-400/80 font-medium">aktiv</span>
        </span>
      </div>
      <MetricRow label="Verträge analysiert heute" value={analyzed} />
      <MetricRow label="Passende Empfehlungen gefunden" value={matched} accent />
      <MetricRow label="Verträge aussortiert" value={filtered} />
      <MetricRow label="Netzqualität ausgewertet" check accent />
      <MetricRow label="Preis-Leistungs-Modell aktiv" check accent />
    </div>
  );
}

const INSIGHTS = [
  "87 % zahlen für Futtervolumen, das sie nie nutzen.",
  "Die meisten Nutzer wählen das falsche Netz für ihren Wohnort.",
  "Durchschnittliche Ersparnis durch BELLA: 18 €/Monat.",
  "9 von 10 Verträgen sind teurer als nötig.",
  "Cashback-Aktionen machen oft 200 € Unterschied im Jahr.",
];

export function RotatingInsight() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % INSIGHTS.length), 4200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="h-6 overflow-hidden relative">
      {INSIGHTS.map((text, idx) => (
        <p
          key={idx}
          className="absolute inset-0 text-sm text-white/45 transition-all duration-700 flex items-center justify-center gap-2"
          style={{
            opacity: idx === i ? 1 : 0,
            transform: `translateY(${(idx - i) * 12}px)`,
          }}
        >
          <span className="text-amber-400/80">◆</span> {text}
        </p>
      ))}
    </div>
  );
}
