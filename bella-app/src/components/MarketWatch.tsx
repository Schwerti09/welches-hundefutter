"use client";

import { useState } from "react";

const INSIGHTS = [
  "8 von 10 Haltern zahlen für Füllstoffe, die ihr Hund nicht braucht.",
  "Anifit führt 2026 bei Bio-Anteil und Deklarationsklarheit.",
  "Hunde mit ähnlichem Profil zeigen weniger Allergien bei Monoprotein.",
  "Preis-Wecker nutzen: bis 20 % beim Futterpreis sparen.",
  "Die meisten Halter unterschätzen den Fleischgehalt ihres Futters.",
  "Monoprotein lohnt sich — aber nur bei echter Überempfindlichkeit.",
  "Günstigstes Qualitäts-Trockenfutter ab 2,50 €/kg verfügbar.",
  "Regelmäßiger Sortenwechsel stärkt das Mikrobiom laut Studien.",
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
              <span className="text-[10px] font-black text-white/75 uppercase tracking-widest">Market Watch</span>
              {active && <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-medium animate-pulse">AKTIV</span>}
            </div>
            <p className="text-[11px] text-white/75 leading-snug">
              {active
                ? "BELLA beobachtet den Futtermarkt für dich. Bei Preisrückgang oder neuen Treffern meldest du dich."
                : "BELLA überwacht den Futtermarkt — bei besseren Preisen oder Empfehlungen wirst du informiert."}
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
          <p className="text-[10px] text-white/65 uppercase tracking-wide mb-1">Marktintelligenz</p>
          <p className="text-[11px] text-white/70 leading-snug">
            <span className="text-amber-400/80 mr-1">◆</span>
            {INSIGHTS[insightIdx]}
          </p>
        </div>
      </div>
    </div>
  );
}
