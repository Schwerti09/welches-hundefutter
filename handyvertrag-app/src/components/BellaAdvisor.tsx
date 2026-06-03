"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

const Bella = dynamic(() => import("@/components/Bella"), { ssr: false });

interface Message {
  id: string;
  role: "bella" | "user";
  content: string;
  offers?: OfferCard[];
}

interface OfferCard {
  id: number;
  deviceName: string;
  brand: string;
  providerName: string;
  monthlyPrice: number;
  effectiveMonthlyPrice: number | null;
  dataVolume: string | null;
  isUnlimited: boolean;
  has5g: boolean;
  affiliateLink: string;
  imageUrl: string | null;
  tariffName: string;
  cashback: number | null;
}

type BellaMood = "idle" | "thinking" | "talking" | "happy" | "waving" | "excited";

const INTRO_MESSAGE: Message = {
  id: "0",
  role: "bella",
  content: "Hey! Ich bin BELLA, dein persönlicher Handyvertrag-Berater! 🎉\n\nIch finde dir in Sekunden den perfekten Vertrag aus über 20.000 echten Angeboten.\n\nSag mir einfach: Was suchst du?",
};

const QUICK_OPTIONS = [
  { label: "🎮 Gaming & viel Daten", msg: "Ich will viel Datenvolumen für Gaming" },
  { label: "💰 Günstigster Preis", msg: "Was ist das günstigste Angebot?" },
  { label: "📸 Beste Kamera", msg: "Ich suche ein Handy mit super Kamera" },
  { label: "📱 iPhone unter 50€", msg: "iPhone Vertrag unter 50 Euro monatlich" },
  { label: "🏆 Samsung + Telekom", msg: "Samsung mit Telekom Netz" },
  { label: "🎓 Student & Budget", msg: "Ich bin Student und suche günstiges Angebot" },
];

export default function BellaAdvisor() {
  const [messages, setMessages] = useState<Message[]>([INTRO_MESSAGE]);
  const [input, setInput] = useState("");
  const [mood, setMood] = useState<BellaMood>("waving");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).slice(2));
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMood("idle"), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setMood("thinking");

    try {
      const history = messages
        .filter(m => m.id !== "0")
        .map(m => ({ role: m.role === "bella" ? "assistant" : "user", content: m.content }));

      const res = await fetch("/api/advisor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, sessionId, conversationHistory: history }),
      });
      const data = await res.json();

      setMood(data.offers?.length > 0 ? "excited" : "happy");
      setTimeout(() => setMood("idle"), 3000);

      const bellaMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bella",
        content: data.reply ?? "Ich konnte keine passenden Angebote finden. Versuch es mit anderen Kriterien!",
        offers: data.offers,
      };
      setMessages(prev => [...prev, bellaMsg]);
    } catch {
      setMood("idle");
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "bella",
        content: "Ups, da ist was schiefgelaufen. Versuch es nochmal!",
      }]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading, sessionId]);

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">

        {/* ─── BELLA Column ──────────────────────────────── */}
        <div className="flex flex-col items-center gap-4">
          <Bella mood={mood} size={220} />

          {/* Mood label */}
          <div className="glass rounded-2xl px-4 py-2 text-center border border-white/10">
            <p className="text-white/80 text-sm font-medium">
              {mood === "thinking" ? "🤔 Ich denke nach..." :
               mood === "excited" ? "🎉 Perfekte Matches!" :
               mood === "happy" ? "😊 Gerne helfe ich!" :
               mood === "waving" ? "👋 Hallo!" :
               "💬 BELLA · KI-Berater"}
            </p>
          </div>

          {/* Stats */}
          <div className="glass rounded-2xl p-4 w-full border border-white/10 space-y-2">
            {[
              { icon: "📦", label: "Angebote", value: "20.000+" },
              { icon: "🏆", label: "Konversionsrate", value: "95%+" },
              { icon: "⚡", label: "Antwortzeit", value: "< 1 Sek." },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-white/50 text-xs">{s.icon} {s.label}</span>
                <span className="text-white font-bold text-sm">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Chat Column ───────────────────────────────── */}
        <div className="flex flex-col h-[680px] bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">

          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <div>
              <p className="text-white font-bold">BELLA – Dein persönlicher KI-Berater</p>
              <p className="text-white/40 text-xs">Findet den perfekten Vertrag aus 20.000+ Angeboten</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-3`}>
                {msg.role === "bella" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 text-xs font-black text-white shadow-lg">H</div>
                )}
                <div className="max-w-[80%] space-y-3">
                  <div className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-br-sm shadow-lg shadow-indigo-500/20"
                      : "bg-white/10 text-white rounded-bl-sm border border-white/10"
                  }`}>
                    {msg.content}
                  </div>

                  {/* Offer Cards */}
                  {msg.offers && msg.offers.length > 0 && (
                    <div className="space-y-2">
                      {msg.offers.map((offer, i) => (
                        <a
                          key={offer.id}
                          href={offer.affiliateLink}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="block bg-white/10 border border-white/15 rounded-2xl p-4 hover:bg-white/20 hover:border-indigo-400/50 transition-all group"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {i === 0 && (
                                <span className="text-xs bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                                  🏆 BESTE WAHL
                                </span>
                              )}
                              <span className="text-xs bg-white/10 text-white/70 px-2 py-0.5 rounded-full">
                                {offer.providerName}
                              </span>
                              {offer.isUnlimited && (
                                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">∞ Unlimited</span>
                              )}
                              {offer.has5g && (
                                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">5G</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-semibold text-sm">{offer.brand} {offer.deviceName}</p>
                              <p className="text-white/50 text-xs">{offer.tariffName} · {offer.dataVolume || "Daten"}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-black text-white">
                                {parseFloat(String(offer.effectiveMonthlyPrice || offer.monthlyPrice)).toFixed(2)} €
                              </p>
                              <p className="text-white/40 text-xs">/Monat</p>
                            </div>
                          </div>
                          {offer.cashback && parseFloat(String(offer.cashback)) > 0 && (
                            <p className="text-green-400 text-xs mt-2 font-medium">✓ {parseFloat(String(offer.cashback)).toFixed(0)} € Cashback</p>
                          )}
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs text-white/30">AWIN Affiliate · *Pflichtangabe</span>
                            <span className="text-xs text-indigo-300 font-semibold group-hover:text-indigo-200">
                              Zum Angebot →
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-xs font-black text-white">H</div>
                <div className="bg-white/10 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick options (only at start) */}
          {messages.length <= 1 && (
            <div className="px-5 pb-3 flex flex-wrap gap-2">
              {QUICK_OPTIONS.map(opt => (
                <button
                  key={opt.label}
                  onClick={() => sendMessage(opt.msg)}
                  className="px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-medium border border-white/10 hover:bg-white/20 hover:text-white transition-all"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage(input)}
                placeholder="Sag BELLA was du suchst..."
                className="flex-1 px-4 py-3 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
