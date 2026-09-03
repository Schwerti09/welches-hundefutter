"use client";
import { useState } from "react";

const FUTTERTYP = [
  { key: "trocken", label: "Trockenfutter", pct: 0.02, pricePerKg: 7 },
  { key: "nass",    label: "Nassfutter",    pct: 0.055, pricePerKg: 4.5 },
  { key: "barf",    label: "BARF",          pct: 0.025, pricePerKg: 6 },
  { key: "kalt",    label: "Kaltgepresst",  pct: 0.02,  pricePerKg: 9 },
] as const;

const AKTIVITAET = [
  { key: "niedrig", label: "Ruhig",       mult: 0.85 },
  { key: "normal",  label: "Normal aktiv",mult: 1.0  },
  { key: "hoch",    label: "Sehr aktiv",  mult: 1.2  },
  { key: "senior",  label: "Senior",      mult: 0.8  },
] as const;

export default function RationsRechner() {
  const [gewicht, setGewicht] = useState("");
  const [futtertyp, setFuttertyp] = useState("trocken");
  const [aktivitaet, setAktivitaet] = useState("normal");
  const [result, setResult] = useState<{ grammTag: number; euro: number } | null>(null);

  const berechnen = () => {
    const kg = parseFloat(gewicht.replace(",", "."));
    if (!kg || kg <= 0 || kg > 120) return;
    const typ = FUTTERTYP.find(f => f.key === futtertyp)!;
    const akt = AKTIVITAET.find(a => a.key === aktivitaet)!;
    const grammTag = Math.round(kg * typ.pct * akt.mult * 1000);
    const euro = Math.round((grammTag / 1000) * 30 * typ.pricePerKg);
    setResult({ grammTag, euro });
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">⚖️</span>
        <h3 className="font-bold text-base">Tagesration berechnen</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-[var(--muted)] mb-1.5 block">Gewicht deines Hundes (kg)</label>
          <input
            type="number"
            min="0.5" max="120" step="0.5"
            value={gewicht}
            onChange={e => { setGewicht(e.target.value); setResult(null); }}
            placeholder="z. B. 25"
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          />
        </div>

        <div>
          <label className="text-xs text-[var(--muted)] mb-1.5 block">Futtertyp</label>
          <div className="grid grid-cols-2 gap-2">
            {FUTTERTYP.map(f => (
              <button
                key={f.key}
                onClick={() => { setFuttertyp(f.key); setResult(null); }}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${futtertyp === f.key ? "bg-orange-500 text-white" : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-[var(--muted)] mb-1.5 block">Aktivitätslevel</label>
          <div className="grid grid-cols-2 gap-2">
            {AKTIVITAET.map(a => (
              <button
                key={a.key}
                onClick={() => { setAktivitaet(a.key); setResult(null); }}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${aktivitaet === a.key ? "bg-orange-500 text-white" : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"}`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={berechnen}
          disabled={!gewicht}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold disabled:opacity-40 transition-opacity"
        >
          Ration berechnen
        </button>

        {result && (
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="text-center p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <p className="text-2xl font-black text-[var(--honey)]">{result.grammTag} g</p>
              <p className="text-[11px] text-[var(--muted)] mt-1">pro Tag</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-2xl font-black text-white">~{result.euro} €</p>
              <p className="text-[11px] text-[var(--muted)] mt-1">pro Monat</p>
            </div>
            <p className="col-span-2 text-[10px] text-white/30 text-center">
              Richtwert · je nach Kaloriendichte des Futters ±20 % · Herstellerangabe beachten
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
