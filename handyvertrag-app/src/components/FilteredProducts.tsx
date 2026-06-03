"use client";

import { useState, useMemo } from "react";
import type { Product } from "@/data/products";
import { getBestOffer, getProviderColor } from "@/data/products";

interface FilteredProductsProps {
  products: Product[];
}

const PROVIDERS = ["Alle", "Telekom", "Vodafone", "o2"];
const BUDGETS = [
  { label: "Alle Preise", max: Infinity },
  { label: "bis 25 €/Monat", max: 25 },
  { label: "bis 35 €/Monat", max: 35 },
  { label: "bis 50 €/Monat", max: 50 },
];
const TAGS = [
  { label: "Alle", value: "alle" },
  { label: "Kamera", value: "kamera" },
  { label: "Gaming", value: "gaming" },
  { label: "Budget", value: "budget" },
  { label: "5G", value: "5g" },
  { label: "KI", value: "ki" },
];

export default function FilteredProducts({ products }: FilteredProductsProps) {
  const [provider, setProvider] = useState("Alle");
  const [budget, setBudget] = useState(Infinity);
  const [tag, setTag] = useState("alle");
  const [sort, setSort] = useState<"preis" | "bewertung">("bewertung");

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const best = getBestOffer(p);
      const providerMatch = provider === "Alle" || p.offers.some((o) => o.provider === provider);
      const budgetMatch = best.monthlyPrice <= budget;
      const tagMatch = tag === "alle" || p.tags.includes(tag);
      return providerMatch && budgetMatch && tagMatch;
    });

    if (sort === "preis") {
      list = list.sort((a, b) => getBestOffer(a).monthlyPrice - getBestOffer(b).monthlyPrice);
    } else {
      list = list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, provider, budget, tag, sort]);

  return (
    <div id="vergleich">
      {/* Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Provider filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 self-center font-medium">Netz:</span>
            {PROVIDERS.map((p) => (
              <button
                key={p}
                onClick={() => setProvider(p)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  provider === p
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-gray-200 hidden sm:block" />

          {/* Budget filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 self-center font-medium">Budget:</span>
            {BUDGETS.map((b) => (
              <button
                key={b.label}
                onClick={() => setBudget(b.max)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  budget === b.max
                    ? "bg-violet-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-gray-200 hidden sm:block" />

          {/* Sort */}
          <div className="flex gap-2 ml-auto">
            <span className="text-sm text-gray-500 self-center font-medium">Sortieren:</span>
            <button
              onClick={() => setSort("bewertung")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                sort === "bewertung" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Bewertung
            </button>
            <button
              onClick={() => setSort("preis")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                sort === "preis" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Preis
            </button>
          </div>
        </div>

        {/* Tag filter */}
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
          <span className="text-sm text-gray-500 self-center font-medium">Kategorie:</span>
          {TAGS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTag(t.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                tag === t.value
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        <span className="font-semibold text-gray-900">{filtered.length}</span> Angebote gefunden
      </p>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-medium">Keine Angebote für diese Filter gefunden.</p>
          <button
            onClick={() => { setProvider("Alle"); setBudget(Infinity); setTag("alle"); }}
            className="mt-4 text-blue-600 underline text-sm"
          >
            Filter zurücksetzen
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((product, i) => {
            const best = getBestOffer(product);
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm card-hover overflow-hidden group"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Header */}
                <div className="relative p-6 pb-4">
                  {product.badge && (
                    <span className={`absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full text-white ${
                      product.badge === "NEU" ? "bg-green-500" :
                      product.badge === "TOP" ? "bg-orange-500" :
                      product.badge === "DEAL" ? "bg-red-500" :
                      "bg-blue-500"
                    }`}>
                      {product.badge}
                    </span>
                  )}

                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <span className="text-2xl font-black text-gray-300">{product.brand[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 font-medium">{product.brand}</p>
                      <h3 className="font-bold text-gray-900 leading-tight">{product.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{product.rating} ({product.reviews.toLocaleString("de-DE")})</span>
                      </div>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-1.5 mt-4">
                    {[
                      { icon: "📱", label: product.specs.display.split(" ").slice(0, 2).join(" ") },
                      { icon: "📸", label: product.specs.camera.split("+")[0].trim() },
                      { icon: "🔋", label: product.specs.battery },
                      { icon: "💾", label: product.specs.storage.split("–")[0].trim() },
                    ].map((spec) => (
                      <div key={spec.icon} className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 rounded-lg px-2 py-1">
                        <span>{spec.icon}</span>
                        <span className="truncate">{spec.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best offer highlight */}
                <div className="mx-4 mb-4 bg-gradient-to-r from-blue-50 to-violet-50 rounded-xl p-3 border border-blue-100">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Ab</p>
                      <p className="text-2xl font-black text-blue-600">
                        {best.monthlyPrice.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €
                        <span className="text-sm font-normal text-gray-500">/Monat</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-white text-xs font-bold bg-gradient-to-r ${getProviderColor(best.provider)}`}>
                        {best.provider}
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">{best.dataVolume} Daten</p>
                    </div>
                  </div>
                  {best.cashback && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-green-700 font-medium">
                      <span>✓</span>
                      <span>{best.cashback} € Cashback</span>
                    </div>
                  )}
                </div>

                {/* Offers */}
                <div className="px-4 pb-4 space-y-2">
                  {product.offers.slice(0, 3).map((offer) => (
                    <a
                      key={offer.id}
                      href={offer.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group/offer"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-md text-white text-xs font-bold flex items-center justify-center bg-gradient-to-r ${getProviderColor(offer.provider)}`}>
                          {offer.provider[0]}
                        </span>
                        <div>
                          <p className="text-xs font-medium text-gray-700">{offer.provider}</p>
                          <p className="text-xs text-gray-400">{offer.dataVolume} · {offer.contractDuration} Mon.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {offer.highlight && (
                          <span className="text-xs text-orange-600 font-medium hidden sm:block">{offer.highlight}</span>
                        )}
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">{offer.monthlyPrice.toFixed(2)} €</p>
                        </div>
                        <svg className="w-4 h-4 text-gray-300 group-hover/offer:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>

                {/* CTA */}
                <div className="px-4 pb-4">
                  <a
                    href={best.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="block w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-center text-sm hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5"
                  >
                    Jetzt bestellen → {best.monthlyPrice.toFixed(2)} €/Monat
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
