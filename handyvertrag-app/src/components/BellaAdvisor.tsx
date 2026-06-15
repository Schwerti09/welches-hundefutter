"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import PriceAlertBox from "@/components/PriceAlertBox";
import VoiceButton from "@/components/VoiceButton";

const Bella = dynamic(() => import("@/components/Bella"), { ssr: false });

interface FoodCard {
  id: number | string;
  slug?: string;            // für Preis-Wecker (Schicht 2)
  name?: string;
  brand?: string;
  type?: string;            // 'trocken' | 'nass' | 'barf' | ...
  protein?: string | null;
  pricePerKg?: number | null;
  packageInfo?: string | null;
  suitableFor?: string[] | null;
  rating?: number | null;
  affiliateUrl?: string;
  imageUrl?: string | null;
  whyThis?: string | null;
  // tolerate legacy/handy-shaped payloads during the dog_foods migration
  deviceName?: string;
  providerName?: string;
  monthlyPrice?: number;
  effectiveMonthlyPrice?: number | null;
  affiliateLink?: string;
}

interface Companion {
  slug: string;
  brand: string;
  name: string;
  category: string;
  price: number | null;
  imageUrl: string | null;
  affiliateUrl: string;
  reason: string;
}

interface ProfileData {
  id: string;
  shareToken: string;
  name: string;
  dailyGrams: number | null;
  currentFood: string | null;
}

interface Message {
  id: string;
  role: "bella" | "user";
  content: string;
  offers?: FoodCard[];
  companions?: Companion[];
  profile?: ProfileData;
}

type BellaMood = "idle" | "thinking" | "talking" | "happy" | "waving" | "excited";

const INTRO_MESSAGE: Message = {
  id: "0",
  role: "bella",
  content:
    "Hallo! Ich bin BELLA 🐕 — deine KI-Ernährungsberaterin für Hunde.\n\nErzähl mir kurz von deinem Hund: Rasse, Alter, und ob es Allergien oder einen empfindlichen Magen gibt. Dann finde ich das perfekte Futter für euch.",
};

const QUICK_OPTIONS = [
  { label: "🐶 Welpe", msg: "Welches Futter ist das richtige für meinen Welpen?" },
  { label: "🦴 Allergie / sensibler Magen", msg: "Mein Hund hat Allergien und einen empfindlichen Magen — welches Futter passt?" },
  { label: "🥩 BARF / Frischfutter", msg: "Ich interessiere mich für BARF bzw. Frischfutter für meinen Hund." },
  { label: "👴 Senior", msg: "Welches Futter ist gut für meinen älteren Hund (Senior)?" },
  { label: "💰 Günstig & gut", msg: "Ich suche ein gutes, aber günstiges Hundefutter." },
  { label: "🐕 Nach Rasse", msg: "Welches Futter passt am besten zu meiner Hunderasse?" },
];

const MOOD_LABEL: Record<BellaMood, string> = {
  thinking: "🤔 Ich schnüffle nach dem besten Futter…",
  excited: "🎉 Perfekte Treffer gefunden!",
  happy: "😊 Helfe dir gerne weiter!",
  waving: "👋 Hallo!",
  talking: "💬 BELLA · KI-Ernährungsberaterin",
  idle: "💬 BELLA · KI-Ernährungsberaterin",
};

interface BellaAdvisorProps {
  introMessage?: string;
  pageQuickOptions?: Array<{ label: string; msg: string }>;
}

export default function BellaAdvisor({ introMessage, pageQuickOptions }: BellaAdvisorProps = {}) {
  const activeIntro: Message = introMessage
    ? { id: "0", role: "bella", content: introMessage }
    : INTRO_MESSAGE;
  const [messages, setMessages] = useState<Message[]>([activeIntro]);
  const [input, setInput] = useState("");
  const [mood, setMood] = useState<BellaMood>("waving");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).slice(2));
  const [voiceListening, setVoiceListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMood("idle"), 2000);
    return () => clearTimeout(t);
  }, []);

  // Nur INNERHALB des Chat-Containers scrollen (nicht die ganze Seite), und nur
  // wenn der Nutzer ohnehin nah am Ende ist → ruhiges, edles Mitlaufen ohne Springen.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.clientHeight - el.scrollTop < 240;
    if (nearBottom) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setMood("thinking");

    const history = messages
      .filter(m => m.id !== "0")
      .map(m => ({ role: m.role === "bella" ? "assistant" : "user", content: m.content }));

    // Placeholder BELLA message we stream into
    const bellaId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: bellaId, role: "bella", content: "" }]);

    try {
      const res = await fetch("/api/advisor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, sessionId, conversationHistory: history }),
      });

      if (!res.body) throw new Error("no stream");

      // The advisor route streams line-based events:
      //   TEXT:<chunk>   — reasoning text (append)
      //   OFFERS:<json>  — final { offers, theme, confidence }
      // (STEP/CONF/SCORE/ELIM are progress events we ignore here)
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let replyText = "";
      let offers: FoodCard[] = [];
      let companions: Companion[] = [];
      let profile: ProfileData | undefined;

      const flushLine = (line: string) => {
        if (line.startsWith("TEXT:")) {
          replyText += line.slice(5);
          setMessages(prev => prev.map(m => m.id === bellaId ? { ...m, content: replyText } : m));
        } else if (line.startsWith("OFFERS:")) {
          try {
            const payload = JSON.parse(line.slice(7));
            if (Array.isArray(payload?.offers)) offers = payload.offers as FoodCard[];
          } catch { /* ignore partial */ }
        } else if (line.startsWith("COMPANIONS:")) {
          try {
            const payload = JSON.parse(line.slice(11));
            if (Array.isArray(payload?.companions)) companions = payload.companions as Companion[];
          } catch { /* ignore partial */ }
        } else if (line.startsWith("PROFILE:")) {
          try { profile = JSON.parse(line.slice(8)) as ProfileData; } catch { /* ignore partial */ }
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) flushLine(line);
      }
      if (buffer) flushLine(buffer);

      if (!replyText.trim()) {
        replyText = "Erzähl mir noch ein bisschen mehr über deinen Hund — Rasse, Alter, Allergien? Dann finde ich das passende Futter.";
      }
      setMessages(prev => prev.map(m =>
        m.id === bellaId ? { ...m, content: replyText, offers: offers.length ? offers : undefined, companions: companions.length ? companions : undefined, profile } : m
      ));

      setMood(offers.length > 0 ? "excited" : "happy");
      setTimeout(() => setMood("idle"), 3000);
    } catch {
      setMessages(prev => prev.map(m =>
        m.id === bellaId ? { ...m, content: "Ups, da ist etwas schiefgelaufen. Versuch es bitte nochmal! 🐾" } : m
      ));
      setMood("idle");
    } finally {
      setLoading(false);
    }
  }, [messages, loading, sessionId]);

  // Rasse aus der Galerie ("Finde deinen Hund") → BELLA startet damit
  useEffect(() => {
    const handler = (e: Event) => {
      const breed = (e as CustomEvent<string>).detail;
      if (breed) sendMessage(`Welches Futter passt am besten für meinen ${breed}?`);
    };
    window.addEventListener("bella:breed", handler);
    return () => window.removeEventListener("bella:breed", handler);
  }, [sendMessage]);

  // Hero-Einstieg ("Erzähl mir von deinem Hund…") → BELLA übernimmt die Frage
  useEffect(() => {
    const handler = (e: Event) => {
      const q = (e as CustomEvent<string>).detail;
      if (q && q.trim()) sendMessage(q.trim());
    };
    window.addEventListener("bella:ask", handler);
    return () => window.removeEventListener("bella:ask", handler);
  }, [sendMessage]);

  // Kosten-Hook ("Was kostet dein Hund?") → BELLA übernimmt direkt mit Rasse +
  // Gewicht, damit der Übergang vom Hero in den Chat ohne erneute Eingabe klappt.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ breedName: string | null; weightKg: number }>).detail;
      if (!detail) return;
      const msg = detail.breedName
        ? `Ich habe einen ${detail.breedName}, ca. ${detail.weightKg} kg. Welches Futter passt am besten für ihn?`
        : `Mein Hund wiegt ca. ${detail.weightKg} kg. Welches Futter passt am besten?`;
      sendMessage(msg);
    };
    window.addEventListener("bella:dogIntro", handler);
    return () => window.removeEventListener("bella:dogIntro", handler);
  }, [sendMessage]);

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-8 items-start">

        {/* ─── BELLA Column ──────────────────────────────── */}
        <div className="flex flex-col items-center gap-4">
          <Bella mood={mood} size={220} />

          <div className="rounded-2xl px-4 py-2 text-center glass">
            <p className="text-white/70 text-sm font-medium">{MOOD_LABEL[mood]}</p>
          </div>

          <div className="rounded-2xl p-4 w-full glass space-y-2.5">
            {[
              { icon: "🥘", label: "Futtersorten", value: "11.000+" },
              { icon: "🐕", label: "Rassen-Profile", value: "50" },
              { icon: "⚡", label: "Antwortzeit", value: "< 1 Sek." },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-white/40 text-xs">{s.icon} {s.label}</span>
                <span className="text-white font-bold text-sm">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Chat Column ───────────────────────────────── */}
        <div className="flex flex-col h-[680px] glass-strong rounded-3xl overflow-hidden">

          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center gap-3 bg-white/[0.03]">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            <div>
              <p className="text-white font-bold">BELLA – deine KI-Ernährungsberaterin</p>
              <p className="text-white/40 text-xs">Findet das perfekte Futter für deinen Hund</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-5">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-3`}>
                {msg.role === "bella" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 text-xs font-black text-white shadow-md shadow-orange-200">B</div>
                )}
                <div className="max-w-[80%] space-y-3">
                  {msg.content && (
                    <div className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-br-sm shadow-md shadow-orange-200"
                        : "bg-white/[0.06] text-white/90 rounded-bl-sm border border-white/10"
                    }`}>
                      {msg.content}
                    </div>
                  )}

                  {/* Food recommendation cards */}
                  {msg.offers && msg.offers.length > 0 && (
                    <div className="space-y-2">
                      {msg.offers.map((offer, i) => {
                        const name = offer.name ?? [offer.brand, offer.deviceName].filter(Boolean).join(" ") ?? "Futter-Empfehlung";
                        const price = offer.pricePerKg ?? offer.effectiveMonthlyPrice ?? offer.monthlyPrice ?? null;
                        const priceUnit = offer.pricePerKg != null ? "/kg" : "";
                        const url = offer.affiliateUrl ?? offer.affiliateLink ?? "#";
                        return (
                          <a
                            key={offer.id ?? i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            className="block bg-white/[0.04] border border-white/10 rounded-2xl p-4 hover:border-[rgba(240,167,60,0.45)] transition-all group"
                          >
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              {i === 0 && (
                                <span className="text-xs bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full font-bold">🏆 BELLAs Tipp</span>
                              )}
                              {offer.type && (
                                <span className="text-xs bg-[rgba(240,167,60,0.14)] text-[#ffcd8a] px-2 py-0.5 rounded-full capitalize">{offer.type}</span>
                              )}
                              {offer.protein && (
                                <span className="text-xs bg-rose-500/15 text-rose-300 px-2 py-0.5 rounded-full">{offer.protein}</span>
                              )}
                              {(offer.suitableFor ?? []).slice(0, 2).map(s => (
                                <span key={s} className="text-xs bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded-full capitalize">{s}</span>
                              ))}
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-white font-semibold text-sm truncate">{name}</p>
                                {offer.brand && offer.name && (
                                  <p className="text-white/40 text-xs">{offer.brand}</p>
                                )}
                              </div>
                              {price != null && (
                                <div className="text-right flex-shrink-0">
                                  <p className="text-xl font-black text-white">{Number(price).toFixed(2)} €<span className="text-xs font-medium text-white/40">{priceUnit}</span></p>
                                  {offer.rating != null && <p className="text-amber-500 text-xs">★ {Number(offer.rating).toFixed(1)}</p>}
                                </div>
                              )}
                            </div>
                            {offer.whyThis && (
                              <p className="text-white/55 text-xs mt-2 leading-relaxed">{offer.whyThis}</p>
                            )}
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-[10px] text-white/25">Affiliate-Link · *Werbung</span>
                              <span className="text-xs text-[var(--honey)] font-semibold group-hover:text-[var(--honey)]">Zum Futter →</span>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  )}

                  {/* Begleit-Empfehlung (Cross-Selling, kuratiert) */}
                  {msg.companions && msg.companions.length > 0 && (
                    <div className="mt-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-2">🐾 Passend dazu für deinen Hund</p>
                      <div className="space-y-2">
                        {msg.companions.map((c) => (
                          <a key={c.slug} href={c.affiliateUrl} target="_blank" rel="sponsored nofollow noopener noreferrer"
                            className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-xl p-3 hover:border-[rgba(240,167,60,0.4)] transition-all group">
                            {c.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={c.imageUrl} alt={c.name} loading="lazy" className="w-12 h-12 rounded-lg object-cover bg-white/5 flex-shrink-0" />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 text-lg">🐾</div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[rgba(240,167,60,0.14)] text-[#ffcd8a] uppercase tracking-wide">{c.category}</span>
                                {c.price != null && <span className="text-xs text-white/50">{c.price.toFixed(2)} €</span>}
                              </div>
                              <p className="text-sm text-white/90 font-medium truncate mt-0.5">{c.name}</p>
                              <p className="text-[11px] text-[var(--honey)]">{c.reason}</p>
                            </div>
                            <span className="text-white/30 group-hover:text-[var(--honey)] flex-shrink-0">→</span>
                          </a>
                        ))}
                      </div>
                      <p className="text-[9px] text-white/25 mt-2">Werbung · Affiliate-Links (rel=sponsored) · ausgewählt nach Passung, nicht nach Provision</p>
                    </div>
                  )}

                  {/* Schicht 2: Preis-Wecker nach der Empfehlung */}
                  {msg.offers && msg.offers.length > 0 && (
                    <PriceAlertBox food={msg.offers[0]} />
                  )}

                  {/* Futter-Pass CTA (erscheint sobald Profil angelegt) */}
                  {msg.profile && (
                    <div className="mt-3 rounded-2xl bg-gradient-to-r from-orange-600/15 to-amber-600/15 border border-orange-500/25 p-4">
                      <p className="text-xs font-bold text-orange-300 mb-1">🐕 Futter-Pass für {msg.profile.name} angelegt</p>
                      {msg.profile.dailyGrams && (
                        <p className="text-[11px] text-white/60 mb-3">
                          Tagesbedarf ca. <span className="text-white font-semibold">{msg.profile.dailyGrams} g</span>
                          {msg.profile.currentFood && <> · empfohlen: <span className="text-white/80">{msg.profile.currentFood}</span></>}
                        </p>
                      )}
                      <a
                        href={`/hund/${msg.profile.shareToken}`}
                        target="_blank"
                        rel="noopener"
                        className="text-xs px-3 py-1.5 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-200 hover:bg-orange-500/30 transition-colors inline-block"
                      >
                        Steckbrief ansehen →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center text-xs font-black text-white">B</div>
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick options (only at start) */}
          {messages.length <= 1 && (
            <div className="px-5 pb-3 flex flex-wrap gap-2">
              {(pageQuickOptions ?? QUICK_OPTIONS).map(opt => (
                <button
                  key={opt.label}
                  onClick={() => sendMessage(opt.msg)}
                  className="px-3 py-1.5 rounded-full bg-white/5 text-white/70 text-xs font-medium border border-white/10 hover:bg-white/10 hover:border-[rgba(240,167,60,0.4)] transition-all"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-white/10 bg-transparent">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage(input)}
                placeholder={voiceListening ? "🎙 Ich höre zu…" : "Erzähl BELLA von deinem Hund…"}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(240,167,60,0.5)] focus:border-transparent"
                disabled={loading}
              />
              <VoiceButton
                onResult={(text) => sendMessage(text)}
                onListening={setVoiceListening}
                disabled={loading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-semibold text-sm hover:shadow-lg hover:shadow-orange-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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
