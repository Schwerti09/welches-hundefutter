"use client";
import { useState } from "react";

const FUTTERTYPEN = [
  { id: "trocken", label: "Trockenfutter", emoji: "🥣" },
  { id: "nass", label: "Nassfutter", emoji: "🍖" },
  { id: "barf", label: "BARF", emoji: "🥩" },
  { id: "kaltgepresst", label: "Kaltgepresst", emoji: "❄️" },
];

type FutterTyp = "trocken" | "nass" | "barf" | "kaltgepresst";

function getChangeDays(from: FutterTyp, to: FutterTyp, sensitive: boolean): number {
  if (from === to) return 0;
  const toBarf = to === "barf";
  const fromBarf = from === "barf";
  const base = toBarf || fromBarf ? 14 : 10;
  return sensitive ? base + 4 : base;
}

interface DayPlan {
  day: number | string;
  old: number;
  neu: number;
  note?: string;
}

function buildPlan(from: FutterTyp, to: FutterTyp, sensitive: boolean): DayPlan[] {
  const days = getChangeDays(from, to, sensitive);
  if (days === 0) return [];
  const steps = sensitive ? 5 : 4;
  const chunk = Math.floor(days / steps);
  const plan: DayPlan[] = [];

  for (let s = 0; s < steps; s++) {
    const startDay = s * chunk + 1;
    const endDay = s === steps - 1 ? days : (s + 1) * chunk;
    const neuPct = Math.round(((s + 1) / steps) * 100);
    const oldPct = 100 - neuPct;
    const label = startDay === endDay ? `Tag ${startDay}` : `Tag ${startDay}–${endDay}`;
    const note = s === 0
      ? "Beginne mit einem kleinen Anteil — beobachte Kot-Konsistenz und Appetit."
      : s === steps - 1
        ? "Volle Umstellung erreicht. 2 Wochen beobachten."
        : undefined;
    plan.push({ day: label, old: oldPct, neu: neuPct, note });
  }
  return plan;
}

export default function UmstellungsPlaner() {
  const [from, setFrom] = useState<FutterTyp | null>(null);
  const [to, setTo] = useState<FutterTyp | null>(null);
  const [sensitive, setSensitive] = useState(false);
  const [showPlan, setShowPlan] = useState(false);

  const plan = from && to ? buildPlan(from, to, sensitive) : [];
  const sameFutter = from === to && from !== null;

  function reset() {
    setFrom(null);
    setTo(null);
    setSensitive(false);
    setShowPlan(false);
  }

  if (showPlan && from && to) {
    const fromLabel = FUTTERTYPEN.find((f) => f.id === from)!;
    const toLabel = FUTTERTYPEN.find((f) => f.id === to)!;
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">📅 Umstellungsplan</h3>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              {fromLabel.emoji} {fromLabel.label} → {toLabel.emoji} {toLabel.label}
              {sensitive ? " · empfindlicher Hund" : ""}
            </p>
          </div>
          <button onClick={reset} className="text-xs text-[var(--muted)] hover:text-white transition-colors">
            Neu →
          </button>
        </div>

        {sameFutter ? (
          <p className="text-sm text-emerald-400 bg-emerald-900/20 rounded-xl p-4">
            ✅ Kein Wechsel nötig — du bleibst beim gleichen Futtertyp.
          </p>
        ) : (
          <div className="space-y-2">
            {plan.map((step) => (
              <div key={String(step.day)} className="bg-white/5 rounded-xl px-4 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-white/80">{step.day}</span>
                  <span className="text-xs text-[var(--muted)]">
                    {step.old}% alt · {step.neu}% neu
                  </span>
                </div>
                <div className="flex gap-1 h-2 rounded-full overflow-hidden">
                  <div className="bg-white/20 rounded-l-full transition-all" style={{ width: `${step.old}%` }} />
                  <div className="bg-[var(--honey)] rounded-r-full transition-all" style={{ width: `${step.neu}%` }} />
                </div>
                {step.note && (
                  <p className="text-[11px] text-[var(--muted)] mt-1.5">{step.note}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {!sameFutter && (
          <div className="text-xs text-[var(--muted)] bg-white/5 rounded-xl p-3 leading-relaxed">
            <strong className="text-white/60">Zeichen stopp:</strong> Erbrechen, wässriger Durchfall, Appetitlosigkeit → einen Schritt zurück, 2–3 Tage halten, dann vorsichtiger weiter.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
      <h3 className="font-bold text-white text-sm">🔄 Umstellungs-Planer</h3>

      <div>
        <p className="text-xs text-[var(--muted)] mb-2">Aktuelles Futter</p>
        <div className="grid grid-cols-2 gap-2">
          {FUTTERTYPEN.map((f) => (
            <button
              key={f.id}
              onClick={() => setFrom(f.id as FutterTyp)}
              className={`px-3 py-2 rounded-xl text-sm text-left border transition-all ${
                from === f.id
                  ? "border-[var(--honey)] bg-[var(--honey)]/10 text-white"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {f.emoji} {f.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-[var(--muted)] mb-2">Neues Futter</p>
        <div className="grid grid-cols-2 gap-2">
          {FUTTERTYPEN.map((f) => (
            <button
              key={f.id}
              onClick={() => setTo(f.id as FutterTyp)}
              className={`px-3 py-2 rounded-xl text-sm text-left border transition-all ${
                to === f.id
                  ? "border-[var(--honey)] bg-[var(--honey)]/10 text-white"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {f.emoji} {f.label}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={sensitive}
          onChange={(e) => setSensitive(e.target.checked)}
          className="w-4 h-4 accent-[var(--honey)]"
        />
        <span className="text-sm text-white/70">Empfindlicher Magen / Allergie-Hund</span>
      </label>

      <button
        disabled={!from || !to}
        onClick={() => setShowPlan(true)}
        className="w-full py-2.5 rounded-xl bg-[var(--honey)] text-[#08080c] font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all"
      >
        Plan anzeigen →
      </button>
      <p className="text-[11px] text-[var(--muted)]">Kein Login nötig — funktioniert sofort.</p>
    </div>
  );
}
