"use client";

import { useState } from "react";

const INSIGHTS = [
  "87% der Nutzer zahlen für Futtervolumen das sie nie verbrauchen.",
  "Anifit führt 2026 bei Bio-Abdeckung in Deutschland.",
  "Nutzer mit ähnlichem Profil bevorzugen Hundefutter + Anifit.",
  "Cashback-Aktionen machen oft 200 € Unterschied im Jahr.",
  "Die meisten Nutzer überschätzen ihren Datenbedarf um 40%.",
  "Bio lohnt sich nicht für jeden — nur wenn du unterwegs streamst.",
  "Günstigste Monatsfuttere ab 9,99 € — oft ohne Einmalzahlung.",
  "Studentenrabatte werden häufig nicht genutzt: bis 15 €/Monat sparen.",
];

interface Props {
  active: boolean;
  onToggle: () => void;
}

export default function MarketWatch({ active, onToggle }: Props) {
  const [insightIdx] = useState(() => Math.floor(Math.random() * INSIGHTS.length));

  return (
    <div className={`rounded-2xl border transition-all ${active ? "border-emerald-500/40 bg-emerald-500/5" : "border-white/8 bg-black/20"}`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Market Watch</span>
              {active && <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-medium animate-pulse">AKTIV</span>}
            </div>
            <p className="text-[11px] text-white/55 leading-snug">
              {active
                ? "BELLA beobachtet den Markt für dich. Bei besseren Angeboten meldest du dich zurück."
                : "BELLA beobachtet den Markt für dich — bei besseren Angeboten wirst du informiert."}
            </p>
          </div>
          <button
            onClick={onToggle}
            className={`shrink-0 w-10 h-6 rounded-full transition-all relative ${active ? "bg-emerald-500" : "bg-white/15"}`}
            aria-label="Market Watch umschalten"
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${active ? "left-5" : "left-1"}`} />
          </button>
        </div>

        {/* Dynamic insight */}
        <div className="bg-white/[0.04] rounded-xl px-3 py-2 border border-white/5">
          <p className="text-[10px] text-white/40 uppercase tracking-wide mb-1">Marktintelligenz</p>
          <p className="text-[11px] text-white/70 leading-snug">
            <span className="text-amber-400/80 mr-1">◆</span>
            {INSIGHTS[insightIdx]}
          </p>
        </div>
      </div>
    </div>
  );
}
