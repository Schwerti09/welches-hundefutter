"use client";

import { useState } from "react";
import Link from "next/link";

interface TuevResult {
  grade: string;           // A, B, C, D, F
  gradeScore: number;      // 0-100
  monthlyOverpay: number;  // €/month too much
  yearlyOverpay: number;
  verdict: string;
  bestAlternative: { device: string; provider: string; tariff: string; price: number; saving: number } | null;
  weaknesses: string[];
  recommendation: string;
}

const GRADE_COLOR: Record<string, string> = {
  A: "text-emerald-400", B: "text-blue-400",
  C: "text-amber-400", D: "text-orange-400", F: "text-red-400",
};
const GRADE_BG: Record<string, string> = {
  A: "border-emerald-500/30 bg-emerald-500/5",
  B: "border-blue-500/30 bg-blue-500/5",
  C: "border-amber-500/30 bg-amber-500/5",
  D: "border-orange-500/30 bg-orange-500/5",
  F: "border-red-500/30 bg-red-500/5",
};

export default function ContractTuevPage() {
  const [provider, setProvider] = useState("");
  const [price, setPrice] = useState("");
  const [data, setData] = useState("");
  const [device, setDevice] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TuevResult | null>(null);

  const analyze = async () => {
    if (!provider || !price) return;
    setLoading(true);
    try {
      const res = await fetch("/api/contract-tuev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider, monthlyPrice: parseFloat(price),
          dataVolume: data || "unbekannt", device: device || "unbekannt",
        }),
      });
      const json = await res.json();
      setResult(json);
    } catch { /* */ } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#05060f] text-white">
      <header className="border-b border-white/5 px-5 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center"><span className="text-white font-black text-sm">H</span></div>
            <span className="font-bold text-sm">handyvertrag<span className="text-indigo-400">.today</span></span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-amber-400/15 text-amber-300 px-3 py-1 rounded-full font-bold tracking-wide">CONTRACT TÜV</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-12">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs mb-5">
            <span>🔍</span> Agent 9 — Contract Intelligence
          </div>
          <h1 className="text-4xl font-black mb-3">
            Zahlst du zu viel für<br />deinen <span className="text-amber-300">Handyvertrag?</span>
          </h1>
          <p className="text-white/55 text-lg leading-relaxed max-w-xl">
            HANSI analysiert deinen aktuellen Vertrag gegen den Markt.
            Erhältst du eine Vertragsnote und konkrete Ersparnis-Berechnung.
          </p>
        </div>

        {/* Input form */}
        <div className="bg-white/[0.04] rounded-2xl border border-white/8 p-6 mb-6">
          <h2 className="font-bold text-base mb-4 text-white/80">Dein aktueller Vertrag</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-wide mb-1.5 block">Anbieter *</label>
              <input value={provider} onChange={e => setProvider(e.target.value)}
                placeholder="z.B. Telekom, Vodafone, o2"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/50" />
            </div>
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-wide mb-1.5 block">Monatspreis € *</label>
              <input value={price} onChange={e => setPrice(e.target.value)} type="number" min="0" step="0.01"
                placeholder="z.B. 44.99"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/50" />
            </div>
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-wide mb-1.5 block">Datenvolumen</label>
              <input value={data} onChange={e => setData(e.target.value)}
                placeholder="z.B. 20 GB, Unlimited"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/50" />
            </div>
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-wide mb-1.5 block">Aktuelles Gerät</label>
              <input value={device} onChange={e => setDevice(e.target.value)}
                placeholder="z.B. iPhone 15, Galaxy S23"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/50" />
            </div>
          </div>
          <button onClick={analyze} disabled={!provider || !price || loading}
            className="mt-5 w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:shadow-lg hover:shadow-amber-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Vertrag wird analysiert…
              </span>
            ) : "Vertrag analysieren →"}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-4">
            {/* Grade */}
            <div className={`rounded-2xl border p-6 ${GRADE_BG[result.grade]}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[11px] text-white/40 uppercase tracking-widest mb-1">Vertragsnote</p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-6xl font-black ${GRADE_COLOR[result.grade]}`}>{result.grade}</span>
                    <span className="text-white/30 text-sm">{result.gradeScore}/100</span>
                  </div>
                </div>
                {result.monthlyOverpay > 0 && (
                  <div className="text-right">
                    <p className="text-[11px] text-white/40 mb-1">Mögliche Ersparnis</p>
                    <p className="text-2xl font-black text-emerald-400">
                      {result.monthlyOverpay.toFixed(2).replace(".", ",")} €<span className="text-sm font-normal text-white/30">/Mo.</span>
                    </p>
                    <p className="text-[11px] text-emerald-400/60">= {result.yearlyOverpay.toFixed(0)} €/Jahr</p>
                  </div>
                )}
              </div>
              <p className="text-sm text-white/70 leading-relaxed">{result.verdict}</p>
            </div>

            {/* Weaknesses */}
            {result.weaknesses.length > 0 && (
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                <p className="text-[11px] text-white/40 uppercase tracking-wide mb-3">Schwachstellen</p>
                <div className="space-y-2">
                  {result.weaknesses.map((w, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-white/65">
                      <span className="text-red-400/70 shrink-0 mt-0.5">✕</span>
                      {w}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Best alternative */}
            {result.bestAlternative && (
              <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-5">
                <p className="text-[11px] text-indigo-300/70 uppercase tracking-wide mb-3">Empfohlene Alternative</p>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-bold text-white">{result.bestAlternative.device}</p>
                    <p className="text-sm text-white/50">{result.bestAlternative.provider} · {result.bestAlternative.tariff}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-white">{result.bestAlternative.price.toFixed(2).replace(".", ",")} €<span className="text-sm font-normal text-white/30">/Mo.</span></p>
                    <p className="text-[11px] text-emerald-400">−{result.bestAlternative.saving.toFixed(2)} €/Mo.</p>
                  </div>
                </div>
                <p className="text-sm text-white/65 leading-relaxed">{result.recommendation}</p>
                <Link href="/" className="mt-3 block text-center py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-all">
                  HANSI fragen — detaillierte Analyse starten →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* How it works */}
        <div className="mt-10 text-center">
          <p className="text-white/25 text-xs">
            Analyse basiert auf {">"}6.000 tagesaktuellen Marktangeboten ·{" "}
            <Link href="/affiliate" className="underline hover:text-white/50">Affiliate-Hinweis</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
