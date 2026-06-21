"use client";

import { useState } from "react";
import type { DogFood } from "@/lib/types";
import ScoreBadge from "@/components/ScoreBadge";

interface Props {
  byScore: DogFood[];
  byPrice: DogFood[];
  countLabel: string;
}

export default function TopFoodsTable({ byScore, byPrice, countLabel }: Props) {
  const [tab, setTab] = useState<"score" | "price">("score");
  const foods = tab === "score" ? byScore : byPrice;

  return (
    <section className="max-w-5xl mx-auto px-5 py-16 w-full">
      <h2 className="text-3xl font-black mb-2 text-center">
        Hundefutter im Preisvergleich — Top-Sorten
      </h2>
      <p className="text-[var(--muted)] text-center mb-6 text-sm">
        Aus {countLabel} echten Sorten im Live-Katalog · Affiliate-Links (rel=sponsored)
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => setTab("score")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            tab === "score" ? "btn-primary" : "border border-white/15 text-white/60 hover:bg-white/5"
          }`}
        >
          ⭐ Top nach BELLA-Score
        </button>
        <button
          type="button"
          onClick={() => setTab("price")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            tab === "price" ? "btn-primary" : "border border-white/15 text-white/60 hover:bg-white/5"
          }`}
        >
          💶 Günstigste
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.04]">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-white/70">Platz</th>
              <th className="text-left px-4 py-3 font-semibold text-white/70">Marke & Sorte</th>
              <th className="text-left px-4 py-3 font-semibold text-white/70 hidden sm:table-cell">Eignung</th>
              <th className="text-left px-4 py-3 font-semibold text-white/70">Preis/kg</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {foods.map((f, i) => (
              <tr key={f.id} className="bg-transparent hover:bg-white/[0.04] transition-colors">
                <td className="px-4 py-3 text-lg">{["🥇", "🥈", "🥉"][i] ?? i + 1}</td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-[var(--ink)] flex items-center gap-2 flex-wrap">
                    {f.brand}
                    {f.score != null && <ScoreBadge score={f.score} />}
                  </div>
                  <div className="text-xs text-[var(--muted)]">{f.name}</div>
                </td>
                <td className="px-4 py-3 text-[var(--muted)] hidden sm:table-cell">
                  <span className="capitalize">{f.foodType}</span>
                  {f.protein ? ` · ${f.protein}` : ""}
                  {f.grainFree ? " · getreidefrei" : ""}
                </td>
                <td className="px-4 py-3 font-semibold text-[var(--honey)] whitespace-nowrap">
                  {f.pricePerKg != null ? `${f.pricePerKg.toFixed(2)} €/kg` : "—"}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={f.affiliateUrl}
                    target="_blank"
                    rel="sponsored nofollow noopener noreferrer"
                    className="text-xs px-3 py-1.5 rounded-lg btn-primary whitespace-nowrap"
                  >
                    Ansehen →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
