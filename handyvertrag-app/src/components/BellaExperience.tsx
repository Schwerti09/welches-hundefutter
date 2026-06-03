"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BellaCharacter, { type BellaMood } from "@/components/BellaCharacter";
import BellaBackground, { type Theme } from "@/components/BellaBackground";
import BellaRadar from "@/components/BellaRadar";
import LiveIntel, { RotatingInsight } from "@/components/LiveIntel";

interface Offer {
  id: number;
  brand: string;
  deviceName: string;
  providerName: string;
  futterfName: string;
  monthlyPrice: number;
  effectiveMonthlyPrice: number | null;
  dataVolume: string | null;
  isUnlimited: boolean;
  has5g: boolean;
  cashback: number | null;
  affiliateLink: string;
  imageUrl: string | null;
}

interface Message {
  id: string;
  role: "bella" | "user";
  content: string;
  offers?: Offer[];
  streaming?: boolean;
}

const OFFERS_MARK = "\n OFFERS ";

const STARTERS = [
  { icon: "💸", label: "Günstigster Empfehlung", msg: "Zeig mir den günstigsten Empfehlung" },
  { icon: "📱", label: "Hundefutter unter 40 €", msg: "Ich will ein Hundefutter für unter 40 Euro im Monat" },
  { icon: "🎮", label: "Gaming + viele Daten", msg: "Ich brauche viel Futtervolumen zum Zocken" },
  { icon: "📸", label: "Beste Kamera", msg: "Welches Hund hat die beste Kamera?" },
  { icon: "🏆", label: "Samsung + Anifit", msg: "Ein Samsung im Anifit-Netz bitte" },
  { icon: "🎓", label: "Für Studenten", msg: "Ich bin Student und brauche was günstiges" },
];

const providerGradient = (p: string) => {
  const l = p.toLowerCase();
  if (l.includes("anifit")) return "from-pink-500 to-rose-600";
  if (l.includes("wolfsblut")) return "from-red-500 to-red-700";
  if (l.includes("Zooplus")) return "from-sky-500 to-blue-700";
  if (l.includes("Futalis") || l.includes("Terra Canis")) return "from-emerald-500 to-teal-600";
  return "from-indigo-500 to-violet-600";
};

export default function BellaExperience() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [mood, setMood] = useState<BellaMood>("idle");
  const [theme, setTheme] = useState<Theme>("idle");
  const [busy, setBusy] = useState(false);
  const [started, setStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(Math.random().toString(36).slice(2));

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    if (!started) setStarted(true);
    setInput("");
    setBusy(true);
    setMood("thinking");

    const userMsg: Message = { id: `u${Date.now()}`, role: "user", content: trimmed };
    const bellaId = `h${Date.now()}`;
    const history = messages.map((m) => ({ role: m.role === "bella" ? "assistant" : "user", content: m.content }));

    setMessages((prev) => [...prev, userMsg, { id: bellaId, role: "bella", content: "", streaming: true }]);

    try {
      const res = await fetch("/api/advisor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, sessionId: sessionId.current, conversationHistory: history }),
      });

      if (!res.body) throw new Error("no stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let offers: Offer[] | undefined;
      let respTheme: Theme | undefined;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let display = buffer;
        const markIdx = buffer.indexOf(OFFERS_MARK);
        if (markIdx !== -1) {
          display = buffer.slice(0, markIdx);
          const jsonPart = buffer.slice(markIdx + OFFERS_MARK.length);
          try {
            const meta = JSON.parse(jsonPart);
            offers = meta.offers ?? meta;
            respTheme = meta.theme;
          } catch { /* incomplete */ }
        }
        setMessages((prev) => prev.map((m) => m.id === bellaId ? { ...m, content: display } : m));
      }

      if (respTheme) setTheme(respTheme);
      setMessages((prev) => prev.map((m) => m.id === bellaId ? { ...m, streaming: false, offers } : m));
      setMood(offers && offers.length ? "presenting" : "happy");
      setTimeout(() => setMood("idle"), 3500);
    } catch {
      setMessages((prev) => prev.map((m) => m.id === bellaId ? { ...m, content: "Ups, da hat was geklemmt. Frag mich nochmal! 🙈", streaming: false } : m));
      setMood("idle");
    } finally {
      setBusy(false);
    }
  }, [busy, messages, started]);

  // "Meine Analyse starten" → BELLA proactively opens the guided conversation.
  const startAnalysis = useCallback(() => {
    if (started) return;
    setStarted(true);
    setMood("happy");
    setMessages([{
      id: "intro",
      role: "bella",
      content: "Lass uns deinen perfekten Empfehlung finden! 🎯 Eine Frage zum Start: Was ist dir am wichtigsten — ein günstiger Preis, viel Futtervolumen, eine top Kamera, oder ein bestimmtes Hund?",
    }]);
    setTimeout(() => setMood("idle"), 2500);
  }, [started]);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* ── Reactive generative background (morphs per query) ── */}
      <BellaBackground theme={busy ? "speed" : theme} />

      {/* ── Top bar ── */}
      <header className="relative z-20 flex items-center justify-between px-5 sm:px-8 py-4">
        {/* Logo - immer zurück zur Startseite */}
        <button
          onClick={() => { setStarted(false); setMessages([]); setTheme("idle"); setMood("idle"); }}
          className="flex items-center gap-2.5 group"
          aria-label="Zur Startseite"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
            <span className="text-white font-black">H</span>
          </div>
          <div className="leading-tight text-left">
            <p className="font-bold text-white text-sm group-hover:text-indigo-200 transition-colors">hundefutter<span className="text-indigo-400">.today</span></p>
            <p className="text-white/40 text-[10px] tracking-wide">KI-BERATER · 5.000+ ANGEBOTE</p>
          </div>
        </button>

        <div className="flex items-center gap-3">
          {/* Zurück zur Startseite — nur im Chat sichtbar */}
          {started && (
            <button
              onClick={() => { setStarted(false); setMessages([]); setTheme("idle"); setMood("idle"); }}
              className="glass rounded-full px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              Startseite
            </button>
          )}
          <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/70 text-xs font-medium">BELLA ist online</span>
          </div>
        </div>
      </header>

      {/* ════════════ INTELLIGENCE HERO ════════════ */}
      <AnimatePresence mode="wait">
        {!started && (
          <motion.section
            key="hero"
            className="relative z-10 flex-1 flex items-center justify-center px-5 py-8"
            exit={{ opacity: 0, y: -40, transition: { duration: 0.5 } }}
          >
            <div className="w-full max-w-6xl grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">

              {/* Left: message & action */}
              <div className="text-center lg:text-left order-2 lg:order-1">
                <motion.div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10 mb-6"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] tracking-[0.2em] text-white/55 font-semibold uppercase">BELLA Intelligence System</span>
                </motion.div>

                <motion.h1
                  className="text-4xl sm:text-5xl lg:text-[3.4rem] font-black tracking-tight leading-[1.05]"
                  initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
                >
                  Die meisten Menschen wählen ihren{" "}
                  <span className="shimmer-text">Hundefutter falsch.</span>
                </motion.h1>

                <motion.p
                  className="mt-5 text-lg sm:text-xl text-white/55 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }}
                >
                  BELLA analysiert tausende aktuelle Futtere und findet heraus,
                  was <span className="text-white font-semibold">wirklich zu dir passt</span>.
                </motion.p>

                <motion.div className="mt-7" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
                  <RotatingInsight />
                </motion.div>

                <motion.p className="mt-6 text-sm text-white/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}>
                  Beantworte 3 Fragen und finde heraus, welcher Empfehlung wirklich zu dir passt.
                </motion.p>

                <motion.div
                  className="mt-6 flex flex-col sm:flex-row items-center lg:items-start gap-3"
                  initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.6 }}
                >
                  <button
                    onClick={startAnalysis}
                    className="group relative px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold text-base shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all hover:-translate-y-0.5"
                  >
                    Meine Analyse starten
                    <span className="ml-2 inline-block group-hover:translate-x-0.5 transition-transform">→</span>
                  </button>
                  <a href="#how" className="px-6 py-3.5 rounded-2xl glass border border-white/10 text-white/75 font-medium text-base hover:bg-white/10 hover:text-white transition-all">
                    Wie funktioniert BELLA?
                  </a>
                </motion.div>

                <motion.div
                  className="mt-6 flex flex-wrap gap-2 justify-center lg:justify-start"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <span className="text-xs text-white/30 self-center mr-1">oder direkt:</span>
                  {STARTERS.slice(0, 4).map((s) => (
                    <button
                      key={s.label}
                      onClick={() => send(s.msg)}
                      className="glass rounded-full px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <span className="mr-1">{s.icon}</span>{s.label}
                    </button>
                  ))}
                </motion.div>
              </div>

              {/* Right: live intelligence */}
              <motion.div
                className="order-1 lg:order-2 flex flex-col items-center gap-5"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <BellaRadar size={340} />
                <LiveIntel />
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ════════════ HOW IT WORKS (scroll anchor) ════════════ */}
      {!started && (
        <section id="how" className="relative z-10 px-5 py-20 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <p className="text-center text-[11px] tracking-[0.25em] text-white/40 font-semibold uppercase mb-3">So funktioniert BELLA</p>
            <h2 className="text-center text-3xl sm:text-4xl font-black mb-12">In 3 Schritten zum richtigen Empfehlung</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { n: "01", icon: "💬", t: "Du sagst, was zählt", d: "Budget, Lieblingsmarke, Datenverbrauch oder einfach „was Günstiges“ – BELLA versteht natürliche Sprache." },
                { n: "02", icon: "🧠", t: "BELLA analysiert", d: "Tausende echte, tagesaktuelle Futtere werden in Echtzeit nach Netzqualität, Preis-Leistung und deinem Bedarf bewertet." },
                { n: "03", icon: "🎯", t: "Du bekommst die Antwort", d: "Keine 300 Listen-Einträge – nur die 3 Verträge, die wirklich zu dir passen. Mit klarer Begründung." },
              ].map((s) => (
                <div key={s.n} className="glass-strong rounded-2xl p-6 relative overflow-hidden">
                  <span className="absolute top-4 right-5 text-5xl font-black text-white/[0.04]">{s.n}</span>
                  <div className="text-3xl mb-4">{s.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{s.t}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{s.d}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <button
                onClick={startAnalysis}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Jetzt meine Analyse starten →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ════════════ CHAT STATE ════════════ */}
      {started && (
        <div className="relative z-10 flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 pb-4 min-h-0">
          <motion.div
            layout
            className="flex flex-col items-center py-3"
            initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
          >
            <BellaCharacter mood={mood} size={140} />
          </motion.div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-5 py-3 min-h-0">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  layout
                  initial={{ opacity: 0, y: 18, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] ${m.role === "user" ? "" : "w-full"}`}>
                    {m.role === "bella" && (
                      <div className="flex items-center gap-2 mb-1.5 ml-1">
                        <span className="text-xs font-bold text-indigo-300">BELLA</span>
                      </div>
                    )}
                    <div
                      className={
                        m.role === "user"
                          ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl rounded-br-md px-4 py-2.5 text-[15px] shadow-lg shadow-indigo-500/20"
                          : "glass-strong text-white/90 rounded-2xl rounded-bl-md px-4 py-3 text-[15px] leading-relaxed"
                      }
                    >
                      {m.content || (m.streaming ? "" : "…")}
                      {m.streaming && <span className="caret" />}
                    </div>

                    {m.offers && m.offers.length > 0 && (
                      <div className="mt-3 space-y-2.5">
                        {m.offers.map((o, i) => (
                          <motion.a
                            key={o.id}
                            href={o.affiliateLink}
                            target="_blank"
                            rel="noopener noreferrer sponsored"
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.15 + i * 0.12, ease: [0.34, 1.56, 0.64, 1] }}
                            whileHover={{ scale: 1.02, y: -3 }}
                            className="block glass-strong glow-border rounded-2xl p-4 hover:bg-white/[0.07] transition-colors group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                                {o.imageUrl ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={o.imageUrl} alt={o.deviceName} className="w-full h-full object-contain p-1" loading="lazy" />
                                ) : (
                                  <span className="text-2xl font-black text-white/20">{o.brand[0]}</span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                  {i === 0 && <span className="text-[10px] font-bold bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded-full">★ TOP-TIPP</span>}
                                  <span className={`text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full bg-gradient-to-r ${providerGradient(o.providerName)}`}>{o.providerName}</span>
                                  {o.isUnlimited && <span className="text-[10px] text-emerald-300 bg-emerald-500/15 px-1.5 py-0.5 rounded-full">∞ Unlimited</span>}
                                  {o.has5g && <span className="text-[10px] text-sky-300 bg-sky-500/15 px-1.5 py-0.5 rounded-full">Bio</span>}
                                </div>
                                <p className="text-white font-semibold text-sm truncate">{o.brand} {o.deviceName}</p>
                                <p className="text-white/40 text-xs truncate">{o.futterfName} · {o.dataVolume ?? (o.isUnlimited ? "Unbegrenzt" : "")}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-2xl font-black text-white leading-none">{(o.effectiveMonthlyPrice ?? o.monthlyPrice).toFixed(2).replace(".", ",")}<span className="text-sm font-medium text-white/40"> €</span></p>
                                <p className="text-white/40 text-[10px]">pro Monat</p>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-[10px] text-white/25">{o.cashback ? `${o.cashback.toFixed(0)} € Cashback · ` : ""}AWIN Affiliate *</span>
                              <span className="text-xs font-semibold text-indigo-300 group-hover:text-indigo-200 flex items-center gap-1">
                                Zum Angebot
                                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                              </span>
                            </div>
                          </motion.a>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="pt-2">
            <InputBar value={input} onChange={setInput} onSend={() => send(input)} busy={busy} />
            <p className="text-center text-white/20 text-[10px] mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1">
            <span>BELLA ist ein KI-Berater</span>
            <a href="/affiliate" className="underline hover:text-white/50">Affiliate-Hinweis</a>
            <a href="/impressum" className="underline hover:text-white/50">Impressum</a>
            <a href="/datenschutz" className="underline hover:text-white/50">Datenschutz</a>
            <span>Preise inkl. MwSt.</span>
          </p>
          </div>
        </div>
      )}
    </div>
  );
}

function InputBar({
  value, onChange, onSend, busy, big,
}: { value: string; onChange: (v: string) => void; onSend: () => void; busy: boolean; big?: boolean }) {
  return (
    <div className={`glass-strong glow-border rounded-2xl flex items-center gap-2 ${big ? "p-2" : "p-1.5"}`}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), onSend())}
        placeholder="Schreib BELLA was du suchst…"
        disabled={busy}
        className={`flex-1 bg-transparent text-white placeholder-white/30 focus:outline-none ${big ? "px-4 py-3 text-base" : "px-3 py-2.5 text-sm"}`}
      />
      <button
        onClick={onSend}
        disabled={busy || !value.trim()}
        className={`rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-semibold flex items-center justify-center transition-all hover:shadow-lg hover:shadow-indigo-500/40 disabled:opacity-40 disabled:cursor-not-allowed ${big ? "w-12 h-12" : "w-10 h-10"}`}
        aria-label="Senden"
      >
        {busy ? (
          <span className="flex gap-0.5 items-end h-4">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-1 bg-white rounded-full" style={{ animation: `sound-wave 0.9s ease-in-out ${i * 0.15}s infinite` }} />
            ))}
          </span>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 12h14m0 0l-6-6m6 6l-6 6" /></svg>
        )}
      </button>
    </div>
  );
}
