"use client";

import { useState } from "react";

// Schicht 2 — Preis-Wecker-Hook nach der Empfehlung. Double-Opt-in:
// nach dem Absenden Hinweis „bestätige die E-Mail", erst dann ist der Wecker scharf.
export default function PriceAlertBox({ food }: { food: { slug?: string; name?: string; brand?: string; pricePerKg?: number | null } }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "pending" | "active" | "error">("idle");
  const [msg, setMsg] = useState("");

  if (!food?.slug) return null; // ohne slug kein Wecker
  const foodLabel = food.name || food.brand || "dieses Futter";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setStatus("error"); setMsg("Bitte gib eine gültige E-Mail-Adresse ein."); return; }
    setStatus("loading"); setMsg("");
    try {
      const r = await fetch("/api/alerts/subscribe", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), foodSlug: food.slug, foodName: food.name }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok) { setStatus(d.status === "active" ? "active" : "pending"); }
      else { setStatus("error"); setMsg(d.error === "invalid_email" ? "Bitte gib eine gültige E-Mail ein." : "Hat nicht geklappt — versuch es gleich nochmal."); }
    } catch { setStatus("error"); setMsg("Netzwerkfehler — versuch es gleich nochmal."); }
  }

  if (status === "pending" || status === "active") {
    return (
      <div className="mt-4 bg-emerald-500/[0.08] border border-emerald-500/25 rounded-2xl p-4 text-center">
        <p className="text-2xl mb-1">{status === "active" ? "✅" : "📬"}</p>
        <p className="text-emerald-200 text-sm font-semibold">
          {status === "active" ? "Dein Preis-Wecker ist aktiv!" : "Fast geschafft!"}
        </p>
        <p className="text-emerald-200/70 text-xs mt-1 leading-relaxed">
          {status === "active"
            ? `BELLA meldet sich, sobald ${foodLabel} echt günstiger wird.`
            : "Bestätige kurz die E-Mail in deinem Postfach — dann passt BELLA auf den Preis auf."}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-white/[0.04] border border-white/10 rounded-2xl p-4">
      <div className="flex items-start gap-2.5 mb-3">
        <span className="text-xl leading-none">🔔</span>
        <div>
          <p className="text-white text-sm font-semibold leading-snug">Soll BELLA Bescheid geben, wenn&apos;s günstiger wird?</p>
          <p className="text-white/45 text-xs mt-0.5 leading-relaxed">
            Ich behalte den Preis von <span className="text-white/70">{foodLabel}</span> im Auge und melde mich nur bei einem echten Tiefpreis.
          </p>
        </div>
      </div>
      <form onSubmit={submit} className="flex gap-2">
        <input
          type="email" inputMode="email" autoComplete="email" required
          value={email} onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
          placeholder="deine@email.de"
          className="flex-1 min-w-0 bg-black/30 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[rgba(240,167,60,0.5)]"
        />
        <button
          type="submit" disabled={status === "loading"}
          className="flex-shrink-0 bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-shadow disabled:opacity-60"
        >
          {status === "loading" ? "…" : "Wecker an"}
        </button>
      </form>
      {status === "error" && <p className="text-rose-300 text-xs mt-2">{msg}</p>}
      <p className="text-white/25 text-[10px] mt-2 leading-relaxed">
        Double-Opt-in · jederzeit abmeldbar · kein Spam · <a href="/datenschutz" className="underline hover:text-white/50">Datenschutz</a>
      </p>
    </div>
  );
}
