"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  representativeWeight,
  lifespanYears,
  lifetimeFoodCost,
  monthlyFoodCost,
  remainingFoodCost,
  fmtEur,
} from "@/lib/dogCost";

export interface SlimBreed {
  slug: string;
  name: string;
  size?: string;
  weightMin?: string | number;
  weightMax?: string | number;
  lifeExpectancy?: string | number;
}

const POPULAR = [
  "labrador-retriever", "deutscher-schaeferhund", "golden-retriever",
  "franzoesische-bulldogge", "dackel", "chihuahua",
];

const SIZE_OPTIONS = [
  { key: "klein", label: "Klein", sub: "bis 10 kg", weight: 7, life: 15 },
  { key: "mittel", label: "Mittel", sub: "10–25 kg", weight: 18, life: 13 },
  { key: "gross", label: "Groß", sub: "25–45 kg", weight: 32, life: 11 },
  { key: "sehrgross", label: "Sehr groß", sub: "über 45 kg", weight: 55, life: 9 },
];

export default function LifetimeCostCalculator({
  breeds,
  avgPricePerKg,
}: {
  breeds: SlimBreed[];
  avgPricePerKg: number;
}) {
  const popular = useMemo(
    () => POPULAR.map((s) => breeds.find((b) => b.slug === s)).filter(Boolean) as SlimBreed[],
    [breeds]
  );

  const [selected, setSelected] = useState<SlimBreed | null>(popular[0] ?? breeds[0] ?? null);
  const [sizeKey, setSizeKey] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [weight, setWeight] = useState<number>(() =>
    popular[0] ? Math.round(representativeWeight(popular[0])) : 18
  );
  const [years, setYears] = useState<number>(() =>
    popular[0] ? lifespanYears(popular[0]) : 13
  );
  const [age, setAge] = useState<number>(0);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length === 0) {
      if (!searchFocused) return [];
      const popularSlugs = new Set(POPULAR);
      return [...breeds].filter((b) => !popularSlugs.has(b.slug)).sort((a, b) => a.name.localeCompare(b.name, "de"));
    }
    return breeds.filter((b) => b.name.toLowerCase().includes(q)).slice(0, 20);
  }, [query, breeds, searchFocused]);

  function pickBreed(b: SlimBreed) {
    setSelected(b);
    setSizeKey(null);
    setWeight(Math.round(representativeWeight(b)));
    setYears(lifespanYears(b));
    setAge(0);
    setQuery("");
  }

  function pickSize(opt: (typeof SIZE_OPTIONS)[number]) {
    setSelected(null);
    setSizeKey(opt.key);
    setWeight(opt.weight);
    setYears(opt.life);
    setAge(0);
    setQuery("");
  }

  const lifetime = lifetimeFoodCost(weight, years, avgPricePerKg);
  const monthly = monthlyFoodCost(weight, avgPricePerKg);
  const annual = monthly * 12;
  const remaining = age > 0 ? remainingFoodCost(weight, years, age, avgPricePerKg) : null;

  const label = selected ? selected.name : sizeKey ? SIZE_OPTIONS.find((s) => s.key === sizeKey)?.label + "er Hund" : "Hund";

  return (
    <div className="glass-strong rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto">
      {/* Rasse-Chips */}
      <p className="text-sm text-[var(--muted)] mb-3">Rasse wählen — die Zahl erscheint sofort:</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {popular.map((b) => (
          <button
            key={b.slug}
            onClick={() => pickBreed(b)}
            className={`text-sm px-4 py-2 rounded-full transition-colors ${
              selected?.slug === b.slug
                ? "bg-[var(--honey)] text-black font-semibold"
                : "glass hover:text-[var(--honey)]"
            }`}
          >
            {b.name.replace(" Retriever", "").replace("Deutscher ", "").replace("Französische ", "Franz. ")}
          </button>
        ))}
      </div>

      {/* Suche + Größen-Fallback */}
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            placeholder="Andere Rasse suchen…"
            className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-[var(--honey)]"
          />
          {searchResults.length > 0 && (
            <div className="absolute z-20 mt-1 w-full rounded-xl border border-white/10 bg-[#0d0d14] p-1 shadow-2xl max-h-64 overflow-y-auto">
              {searchResults.map((b) => (
                <button
                  key={b.slug}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pickBreed(b)}
                  className="block w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-white/[0.06] hover:text-[var(--honey)]"
                >
                  {b.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => pickSize(opt)}
              title={`Mischling / ${opt.label} (${opt.sub})`}
              className={`flex-1 text-xs px-2 py-2.5 rounded-xl transition-colors ${
                sizeKey === opt.key ? "bg-[var(--honey)] text-black font-semibold" : "glass hover:text-[var(--honey)]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gewichts-Slider */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-sm text-[var(--muted)] w-16">Gewicht</span>
        <input
          type="range"
          min={2}
          max={70}
          step={1}
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="flex-1 accent-[var(--honey)]"
        />
        <span className="text-sm font-semibold w-14 text-right">{weight} kg</span>
      </div>
      {/* Alters-Slider (optional) */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-[var(--muted)] w-16">Alter heute</span>
        <input
          type="range"
          min={0}
          max={years}
          step={1}
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          className="flex-1 accent-[var(--honey)]"
        />
        <span className="text-sm font-semibold w-14 text-right">{age === 0 ? "Welpe" : `${age} J.`}</span>
      </div>

      {/* Ergebnis */}
      <div className="rounded-2xl p-5 sm:p-6" style={{ background: "linear-gradient(135deg, rgba(240,167,60,0.14), rgba(255,138,76,0.10))" }}>
        <p className="text-xs uppercase tracking-wider text-[var(--honey)] mb-1">
          Futterkosten über das ganze Leben · {label}, {years} Jahre
        </p>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">ca. {fmtEur(lifetime)} €</span>
          <span className="text-[var(--muted)]">≈ {fmtEur(monthly)} €/Monat · {fmtEur(annual)} €/Jahr</span>
        </div>
        {remaining != null && (
          <p className="mt-3 text-sm">
            Ab heute kommen noch <strong className="text-[var(--honey)]">ca. {fmtEur(remaining)} €</strong> auf dich zu.
          </p>
        )}
        <p className="mt-3 text-xs text-[var(--muted)] leading-relaxed">
          Schätzung auf Basis von durchschnittlichem Trockenfutter ({avgPricePerKg.toFixed(2).replace(".", ",")} €/kg)
          und mittlerer Aktivität. <strong>Nur Futter</strong> — Tierarzt, Versicherung, Zubehör sind nicht eingerechnet.
        </p>
      </div>

      {/* Übergang in den Berater */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-[var(--muted)]">
          Welches Futter passt – und wo sparst du? In 3 Fragen herausfinden.
        </span>
        <Link href="/#bella-advisor" className="btn-primary rounded-xl px-5 py-2.5 text-sm font-semibold whitespace-nowrap">
          Passendes Futter finden →
        </Link>
      </div>
    </div>
  );
}
