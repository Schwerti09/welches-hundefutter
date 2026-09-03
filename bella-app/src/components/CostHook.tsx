"use client";

import { useMemo, useState } from "react";
import { dailyGrams, monthlyEuro } from "@/lib/consumption-math";
import { useDogInfo } from "@/contexts/DogInfoContext";
import type { BreedSlim } from "@/lib/breeds-slim";

const POPULAR_BREEDS = [
  "Labrador Retriever",
  "Deutscher Schäferhund",
  "Golden Retriever",
  "Französische Bulldogge",
  "Dackel",
  "Chihuahua",
  "Border Collie",
  "Mops",
  "Australian Shepherd",
  "Jack Russell Terrier",
];

const SIZE_OPTIONS: { label: string; weightKg: number }[] = [
  { label: "Klein (≈ 7 kg)", weightKg: 7 },
  { label: "Mittel (≈ 18 kg)", weightKg: 18 },
  { label: "Groß (≈ 32 kg)", weightKg: 32 },
  { label: "Sehr groß (≈ 55 kg)", weightKg: 55 },
];

export default function CostHook({ breeds, avgPricePerKgDry, countLabel }: { breeds: BreedSlim[]; avgPricePerKgDry: number; countLabel: string }) {
  const { setDogInfo } = useDogInfo();
  const [weightKg, setWeightKg] = useState(18);
  const [breedName, setBreedName] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  const popularBreeds = useMemo(
    () => POPULAR_BREEDS.map((name) => breeds.find((b) => b.name === name)).filter((b): b is BreedSlim => !!b),
    [breeds]
  );

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length === 0) {
      if (!searchFocused) return [];
      // Beim Fokussieren ohne Eingabe: alle Rassen jenseits der Chips, alphabetisch, scrollbar.
      const popularNames = new Set(POPULAR_BREEDS);
      return [...breeds].filter((b) => !popularNames.has(b.name)).sort((a, b) => a.name.localeCompare(b.name, "de"));
    }
    return breeds.filter((b) => b.name.toLowerCase().includes(q)).slice(0, 20);
  }, [breeds, query, searchFocused]);

  const grams = dailyGrams(weightKg, "mittel");
  const perMonth = monthlyEuro(grams, avgPricePerKgDry);
  const perYear = Math.round(perMonth * 12);

  function selectBreed(b: BreedSlim) {
    setBreedName(b.name);
    setWeightKg(b.weightKg);
    setQuery("");
    setShowFallback(false);
  }

  function selectSize(weightKg: number) {
    setBreedName(null);
    setWeightKg(weightKg);
  }

  function handleCta() {
    setDogInfo({ breedName, weightKg, dailyGrams: grams });
    document.getElementById("bella-advisor")?.scrollIntoView({ behavior: "smooth" });
    // BELLA übernimmt direkt mit Rasse + Gewicht aus dem Kosten-Hook, statt dass
    // der Halter alles nochmal eintippen muss — fließender Übergang in den Chat.
    window.dispatchEvent(new CustomEvent("bella:dogIntro", { detail: { breedName, weightKg } }));
  }

  return (
    <section className="hero-glow relative px-4 sm:px-5 pt-10 pb-12 md:pt-14">
      <div className="max-w-2xl mx-auto">
        <span className="pill mb-4">🐕 In 10 Sekunden</span>
        <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.05] mb-3">
          Was kostet dein Hund? 🐕
        </h1>
        <p className="text-[var(--muted)] mb-6 max-w-lg">
          Rasse wählen (oder Gewicht einstellen) — BELLA rechnet live aus echten Preisen
          von {countLabel}+ Sorten, was Trockenfutter im Monat kostet.
        </p>

        {/* Popularitäts-Chips */}
        <div className="flex flex-wrap gap-2 mb-3">
          {popularBreeds.map((b) => (
            <button
              key={b.slug}
              onClick={() => selectBreed(b)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                breedName === b.name
                  ? "bg-[var(--honey)] text-[#1a1206] border-[var(--honey)] font-semibold"
                  : "border-white/15 text-[var(--ink)] hover:bg-white/5"
              }`}
            >
              {b.name}
            </button>
          ))}
          <button
            onClick={() => setShowFallback((s) => !s)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              showFallback ? "bg-white/10 border-white/25" : "border-white/15 text-[var(--muted)] hover:bg-white/5"
            }`}
          >
            🐾 Mischling / weiß ich nicht
          </button>
        </div>

        {showFallback && (
          <div className="flex flex-wrap gap-2 mb-3">
            {SIZE_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                onClick={() => selectSize(opt.weightKg)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  breedName === null && weightKg === opt.weightKg
                    ? "bg-[var(--honey)] text-[#1a1206] border-[var(--honey)] font-semibold"
                    : "border-white/15 text-[var(--ink)] hover:bg-white/5"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Suchfeld */}
        <div className="relative mb-5">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            placeholder="Oder Rasse suchen…"
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--honey)]"
          />
          {searchResults.length > 0 && (
            <div className="absolute z-20 mt-1 w-full glass-strong rounded-xl overflow-hidden max-h-64 overflow-y-auto shadow-xl">
              {searchResults.map((b) => (
                <button
                  key={b.slug}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectBreed(b)}
                  className="block w-full text-left px-4 py-2.5 text-sm text-[var(--ink)] hover:bg-white/10 transition-colors"
                >
                  {b.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Gewicht-Slider */}
        <div className="card p-5 mb-5">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="weight-slider" className="text-sm text-[var(--muted)]">
              Gewicht{breedName ? ` von ${breedName}` : ""}
            </label>
            <span className="text-sm font-semibold text-[var(--honey)]">{weightKg} kg</span>
          </div>
          <input
            id="weight-slider"
            type="range"
            min={1}
            max={80}
            step={1}
            value={weightKg}
            onChange={(e) => setWeightKg(Number(e.target.value))}
            className="w-full accent-[var(--honey)]"
          />
        </div>

        {/* Ergebnis */}
        <div className="card p-6 mb-5 text-center">
          <p className="text-4xl sm:text-5xl font-black text-accent">ca. {perMonth.toFixed(0)} €/Monat</p>
          <p className="text-[var(--muted)] mt-1">≈ {perYear} €/Jahr</p>
          <p className="text-xs text-[var(--muted)] mt-4 leading-relaxed">
            Orientierungswert für Trockenfutter (Ø {avgPricePerKgDry.toFixed(2)} €/kg, {countLabel}+ Sorten).
            Nass, BARF oder Premium-Futter können abweichen.
          </p>
        </div>

        <button onClick={handleCta} className="btn-primary w-full sm:w-auto px-6 py-3">
          Jetzt das passende Futter für {breedName ?? "deinen Hund"} finden →
        </button>
      </div>
    </section>
  );
}
