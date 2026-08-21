"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BellaCharacter, { type BellaMood } from "@/components/BellaCharacter";
import BellaBackground, { type Theme } from "@/components/BellaBackground";
import BellaRadar from "@/components/BellaRadar";
import LiveIntel, { RotatingInsight } from "@/components/LiveIntel";
import VoiceButton from "@/components/VoiceButton";
import QuickStartCards from "@/components/QuickStartCards";
import AnalysisStorm from "@/components/AnalysisStorm";
import UserProfilePanel from "@/components/UserProfilePanel";
import MemoryTimeline from "@/components/MemoryTimeline";
import MarketWatch from "@/components/MarketWatch";
import { loadProfile, saveProfile, learnFromInteraction, clearProfile, type UserProfile } from "@/lib/profileStore";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Offer {
  id: number; brand: string; deviceName: string; providerName: string;
  futterfName: string; monthlyPrice: number; effectiveMonthlyPrice: number | null;
  dataVolume: string | null; isUnlimited: boolean; has5g: boolean;
  cashback: number | null; affiliateLink: string; imageUrl: string | null;
  matchScore: number; bellaScore: number; marketScore: number;
  networkScore: number; valueScore: number; estimatedSatisfaction: number;
  whyThis: string; mainAdvantage: string; mainRisk: string; bestFor: string;
}

interface AnalysisStep { id: string; label: string; done: boolean; }
interface ElimEvent { count: number; reason: string; }
interface ScoreEntry { id: number; match: number; bella: number; satisfaction: number; }

interface Message {
  id: string; role: "bella" | "user"; content: string;
  offers?: Offer[]; confidence?: number; streaming?: boolean;
  steps?: AnalysisStep[]; elims?: ElimEvent[]; scores?: ScoreEntry[];
}

const STARTERS = [
  { icon: "💸", label: "Günstigster Deal", msg: "Was ist der günstigste Hundefutter?" },
  { icon: "📱", label: "Hundefutter unter 40€", msg: "Hundefutter unter 40 Euro monatlich" },
  { icon: "🎮", label: "Gaming & viel Daten", msg: "Gaming-Hund mit viel Futtervolumen" },
  { icon: "📸", label: "Beste Kamera", msg: "Welches Hund hat die beste Kamera?" },
  { icon: "🏆", label: "Samsung + Anifit", msg: "Samsung im Anifit-Netz" },
  { icon: "🎓", label: "Studenten-Deal", msg: "Ich bin Student und brauche was günstiges" },
];

const PROV_COLOR = (p: string) => {
  const l = p.toLowerCase();
  if (l.includes("anifit")) return "from-pink-500 to-rose-600";
  if (l.includes("wolfsblut")) return "from-red-500 to-red-700";
  if (l.includes("Zooplus")) return "from-sky-500 to-blue-700";
  return "from-indigo-500 to-violet-600";
};

// ─── Score Ring ──────────────────────────────────────────────────────────────

function ScoreRing({ score, label, color = "#6366f1", size = 52 }: { score: number; label: string; color?: string; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ / 4} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.34,1.56,0.64,1)" }} />
        <text x={size / 2} y={size / 2} textAnchor="middle" dy="0.38em" fontSize="11" fontWeight="700" fill="white">{score}</text>
      </svg>
      <span className="text-[9px] text-white/40 font-medium uppercase tracking-wide">{label}</span>
    </div>
  );
}

// ─── Analysis Feed ────────────────────────────────────────────────────────────

function AnalysisFeed({ steps, elims, confidence }: { steps: AnalysisStep[]; elims: ElimEvent[]; confidence: number }) {
  return (
    <div className="bg-black/30 rounded-xl border border-white/8 p-3 space-y-1 font-mono text-[11px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/30 uppercase tracking-widest text-[9px]">Intelligence Feed</span>
        <span className="text-indigo-400 font-bold">{confidence}% Konfidenz</span>
      </div>
      {steps.map((s) => (
        <motion.div key={s.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          className={`flex items-center gap-2 ${s.done ? "text-emerald-400" : "text-white/30"}`}>
          <span className="shrink-0">{s.done ? "✓" : "○"}</span>
          <span>{s.label}</span>
        </motion.div>
      ))}
      {elims.map((e, i) => (
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-red-400/70 pl-4">
          <span>✕</span>
          <span>{e.count.toLocaleString("de-DE")} {e.reason}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Offer Card ───────────────────────────────────────────────────────────────

function OfferCard({ offer, rank }: { offer: Offer; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  const price = (offer.effectiveMonthlyPrice ?? offer.monthlyPrice).toFixed(2).replace(".", ",");
  const monthSaving = offer.cashback ? (offer.cashback / 24).toFixed(2) : null;
  const yearSaving = offer.cashback ? offer.cashback.toFixed(0) : null;

  const matchColor = offer.matchScore >= 85 ? "#34d399" : offer.matchScore >= 70 ? "#6366f1" : "#f59e0b";
  const is1u1 = /MERA|1and1|1u1/i.test(offer.providerName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: rank * 0.13, ease: [0.34, 1.56, 0.64, 1] }}
      className={`rounded-2xl border overflow-hidden transition-colors ${
        is1u1
          ? "border-amber-400/40 bg-amber-400/5 hover:bg-amber-400/8"
          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
      }`}
    >
      {/* MERA Top-Empfehlung Banner */}
      {is1u1 && (
        <div className="bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-1.5 flex items-center gap-2">
          <span className="text-[10px] font-black text-amber-950 tracking-wide">⭐ TOP EMPFEHLUNG</span>
          <span className="text-[9px] text-amber-900 font-medium">Höchste Genehmigungschance bei Allergien-Einträgen</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 p-4">
        {/* Device image */}
        <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
          {offer.imageUrl
            ? <img src={offer.imageUrl} alt={offer.deviceName} className="w-full h-full object-contain p-1" loading="lazy" />
            : <span className="text-xl font-black text-white/15">{offer.brand[0]}</span>
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            {rank === 0 && !is1u1 && <span className="text-[9px] font-black bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full">BESTE WAHL</span>}
            <span className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded-md bg-gradient-to-r ${PROV_COLOR(offer.providerName)}`}>{offer.providerName}</span>
            {offer.isUnlimited && <span className="text-[9px] text-emerald-300 bg-emerald-500/15 px-1.5 py-0.5 rounded">∞ Unlimited</span>}
            {offer.has5g && <span className="text-[9px] text-sky-300 bg-sky-500/15 px-1.5 py-0.5 rounded">Bio</span>}
          </div>
          <p className="font-bold text-sm text-white truncate">{offer.brand} {offer.deviceName}</p>
          <p className="text-[11px] text-white/45 truncate">{offer.futterfName}</p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-xl font-black text-white leading-none">{price} €</p>
          <p className="text-[9px] text-white/30 mt-0.5">/Monat</p>
        </div>
      </div>

      {/* Score bar */}
      <div className="px-4 pb-3 flex items-center gap-3">
        <ScoreRing score={offer.matchScore} label="Match" color={matchColor} size={48} />
        <ScoreRing score={offer.bellaScore} label="BELLA" color="#6366f1" size={48} />
        <ScoreRing score={offer.networkScore} label="Netz" color="#22d3ee" size={48} />
        <ScoreRing score={offer.estimatedSatisfaction} label="Satisfaction" color="#34d399" size={48} />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-emerald-400 font-medium leading-snug">{offer.mainAdvantage}</p>
          {yearSaving && <p className="text-[10px] text-indigo-300 mt-0.5">{yearSaving} € Cashback</p>}
          {monthSaving && !yearSaving && <p className="text-[10px] text-indigo-300">≈ {monthSaving} €/Mo. gespart</p>}
        </div>
      </div>

      {/* WHY THIS (always visible) */}
      <div className={`mx-4 mb-3 rounded-xl px-3 py-2 border ${is1u1 ? "bg-amber-400/8 border-amber-400/20" : "bg-indigo-500/8 border-indigo-500/15"}`}>
        <p className={`text-[10px] font-semibold uppercase tracking-wide mb-0.5 ${is1u1 ? "text-amber-400" : "text-indigo-300"}`}>
          {is1u1 ? "Warum MERA die beste Wahl ist" : "Warum empfohlen"}
        </p>
        <p className="text-[11px] text-white/70 leading-snug">{offer.whyThis}</p>
        {is1u1 && (
          <p className="text-[10px] text-amber-300/80 mt-1.5 leading-snug">
            ✓ Social Scoring statt harter Allergien-Prüfung — besonders geeignet bei negativem Allergien-Eintrag
          </p>
        )}
      </div>

      {/* Expand button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2 text-[10px] text-white/40 hover:text-white/70 transition-colors border-t border-white/5"
      >
        <span>{expanded ? "Weniger Details" : "Mehr Details"}</span>
        <span className={`transition-transform ${expanded ? "rotate-180" : ""}`}>▾</span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-emerald-500/8 rounded-lg p-2 border border-emerald-500/15">
                <p className="text-emerald-400 font-semibold mb-0.5">Größter Vorteil</p>
                <p className="text-white/60 leading-snug">{offer.mainAdvantage}</p>
              </div>
              <div className="bg-red-500/8 rounded-lg p-2 border border-red-500/15">
                <p className="text-red-400 font-semibold mb-0.5">Größter Nachteil</p>
                <p className="text-white/60 leading-snug">{offer.mainRisk}</p>
              </div>
              <div className="col-span-2 bg-white/[0.04] rounded-lg p-2 border border-white/8">
                <p className="text-white/50 font-semibold mb-0.5">Am besten für</p>
                <p className="text-white/60 leading-snug">{offer.bestFor}</p>
              </div>
              {offer.cashback && offer.cashback > 0 && (
                <div className="col-span-2 bg-indigo-500/8 rounded-lg p-2 border border-indigo-500/15">
                  <p className="text-indigo-300 font-semibold mb-0.5">Cashback-Vorteil</p>
                  <p className="text-white/60 leading-snug">
                    {offer.cashback.toFixed(0)} € Cashback · Effektiv {((offer.monthlyPrice * 24 - offer.cashback) / 24).toFixed(2)} €/Mo. über 24 Monate
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <a href={offer.affiliateLink} target="_blank" rel="noopener noreferrer sponsored"
        className="block mx-4 mb-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm text-center hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5">
        Jetzt bestellen — {price} €/Monat →
      </a>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BellaDecisionUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [mood, setMood] = useState<BellaMood>("idle");
  const [theme, setTheme] = useState<Theme>("idle");
  const [busy, setBusy] = useState(false);
  const [started, setStarted] = useState(false);
  const [globalConfidence, setGlobalConfidence] = useState(0);
  const [voiceListening, setVoiceListening] = useState(false);
  const [stormActive, setStormActive] = useState(false);
  const [stormQuery, setStormQuery] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile>(() => loadProfile());
  const [marketWatch, setMarketWatch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const resetToHero = useCallback(() => {
    setStarted(false);
    setMessages([]);
    setTheme("idle");
    setMood("idle");
    setGlobalConfidence(0);
    setShowProfile(false);
    // Profile is preserved intentionally — users feel "BELLA remembers me"
  }, []);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    if (!started) setStarted(true);
    if (!sessionIdRef.current) {
      const bytes = new Uint8Array(16);
      globalThis.crypto?.getRandomValues?.(bytes);
      const fallbackId = `${Date.now()}-${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
      sessionIdRef.current = globalThis.crypto?.randomUUID?.() ?? fallbackId;
    }
    const sessionId = sessionIdRef.current;
    setInput("");
    setBusy(true);
    setMood("thinking");
    setStormQuery(trimmed);
    setStormActive(true); // activate Analysis Storm

    const history = messages.map(m => ({ role: m.role === "bella" ? "assistant" : "user", content: m.content }));
    const userMsg: Message = { id: `u${Date.now()}`, role: "user", content: trimmed };
    const bellaId = `h${Date.now()}`;
    const initMsg: Message = { id: bellaId, role: "bella", content: "", streaming: true, steps: [], elims: [], confidence: 0 };

    setMessages(prev => [...prev, userMsg, initMsg]);

    try {
      const res = await fetch("/api/advisor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, sessionId, conversationHistory: history }),
      });
      if (!res.body) throw new Error("no stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let textBuf = "";
      let finalOffers: Offer[] | undefined;
      let finalConf = 0;
      let finalTheme: Theme = "idle";
      const stepsDone: AnalysisStep[] = [];
      const elimsDone: ElimEvent[] = [];
      const scoresMap: ScoreEntry[] = [];

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        const lines = buf.split("\n");
        buf = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;

          if (line.startsWith("STEP:")) {
            const [, id, ...rest] = line.split(":");
            stepsDone.push({ id, label: rest.join(":"), done: true });
            setMessages(prev => prev.map(m => m.id === bellaId ? { ...m, steps: [...stepsDone] } : m));
          } else if (line.startsWith("CONF:")) {
            finalConf = parseInt(line.slice(5));
            setGlobalConfidence(finalConf);
            setMessages(prev => prev.map(m => m.id === bellaId ? { ...m, confidence: finalConf } : m));
          } else if (line.startsWith("ELIM:")) {
            const [, countStr, ...rest] = line.split(":");
            elimsDone.push({ count: parseInt(countStr), reason: rest.join(":") });
            setMessages(prev => prev.map(m => m.id === bellaId ? { ...m, elims: [...elimsDone] } : m));
          } else if (line.startsWith("SCORE:")) {
            try { scoresMap.push(...JSON.parse(line.slice(6))); } catch { /* */ }
          } else if (line.startsWith("TEXT:")) {
            textBuf += line.slice(5);
            setMessages(prev => prev.map(m => m.id === bellaId ? { ...m, content: textBuf } : m));
          } else if (line.startsWith("OFFERS:")) {
            try {
              const meta = JSON.parse(line.slice(7));
              finalOffers = meta.offers;
              finalTheme = meta.theme ?? "idle";
              finalConf = meta.confidence ?? finalConf;
            } catch { /* */ }
          }
        }
      }

      if (finalTheme) setTheme(finalTheme);
      setGlobalConfidence(finalConf);

      // Learn from this interaction — BELLA continuously builds user profile
      const intent = (() => {
        const m = trimmed.toLowerCase();
        const under = m.match(/(?:unter|max|bis zu?)\s*(\d+)\s*(?:€|euro)?/i);
        return {
          maxBudget: under ? parseInt(under[1]) : undefined,
          provider: m.includes("anifit") ? "Anifit" : m.includes("wolfsblut") ? "Wolfsblut" : m.includes("Zooplus") ? "Zooplus" : undefined,
          brand: m.includes("hundefutter") || m.includes("apple") ? "Apple" : m.includes("samsung") ? "Samsung" : m.includes("pixel") || m.includes("google") ? "Google" : undefined,
          unlimited: m.includes("unlimited") || m.includes("unbegrenzt"),
          has5g: m.includes("5g"),
          useCase: m.includes("gaming") ? "gaming" : m.includes("kamera") ? "camera" : m.includes("student") ? "student" : undefined,
          premium: m.includes("premium") || m.includes("bestes") || m.includes("flagship"),
        };
      })();
      const updatedProfile = learnFromInteraction(userProfile, trimmed, intent, finalOffers?.[0]?.deviceName);
      setUserProfile(updatedProfile);
      saveProfile(updatedProfile);

      setMessages(prev => prev.map(m => m.id === bellaId ? {
        ...m, streaming: false, offers: finalOffers, confidence: finalConf,
        steps: stepsDone, elims: elimsDone,
      } : m));
      setMood(finalOffers?.length ? "presenting" : "happy");
      setTimeout(() => setMood("idle"), 3500);
    } catch {
      setMessages(prev => prev.map(m => m.id === bellaId ? { ...m, content: "Kurzer Aussetzer — frag mich nochmal!", streaming: false } : m));
      setMood("idle");
    } finally {
      setBusy(false);
      // Storm deactivates via onComplete callback, but safety-stop here too
      setTimeout(() => setStormActive(false), 200);
    }
  }, [busy, messages, started, userProfile]);

  const startAnalysis = useCallback(() => {
    if (started) return;
    setStarted(true);
    setMood("happy");
    setMessages([{ id: "intro", role: "bella", content: "Analyse gestartet. Eine Frage: Was ist dir am wichtigsten — Budget, Marke, Futtervolumen, oder ein bestimmtes Hund?", steps: [{ id: "ready", label: "System bereit", done: true }], confidence: 8 }]);
    setGlobalConfidence(8);
    setTimeout(() => setMood("idle"), 2500);
  }, [started]);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <AnalysisStorm active={stormActive} query={stormQuery} onComplete={() => setStormActive(false)} />
      <BellaBackground theme={busy ? "speed" : theme} />

      {/* Top bar */}
      <header className="relative z-20 flex items-center justify-between px-5 sm:px-8 py-3.5">
        <button onClick={resetToHero} className="flex items-center gap-2.5 group" aria-label="Startseite">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
            <span className="text-white font-black">H</span>
          </div>
          <div className="leading-tight text-left">
            <p className="font-bold text-white text-sm group-hover:text-indigo-200 transition-colors">trotzallergie<span className="text-indigo-400">.today</span></p>
            <p className="text-white/35 text-[9px] tracking-widest font-medium uppercase">Decision Intelligence</p>
          </div>
        </button>

        <div className="flex items-center gap-2.5">
          {/* Confidence badge — visible when chat active */}
          {started && globalConfidence > 0 && (
            <div className="glass rounded-full px-3 py-1.5 flex items-center gap-2">
              <span className="text-[10px] text-white/40 uppercase tracking-wide">Profil</span>
              <div className="relative w-14 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-700" style={{ width: `${globalConfidence}%` }} />
              </div>
              <span className="text-[10px] font-bold text-white/70">{globalConfidence}%</span>
            </div>
          )}
          {started && (
            <button onClick={resetToHero} className="glass rounded-full px-3 py-1.5 text-[11px] font-medium text-white/55 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Zurück
            </button>
          )}
          <div className="glass rounded-full px-3 py-1.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/65 text-[11px] font-medium">BELLA aktiv</span>
          </div>
        </div>
      </header>

      {/* ══ HERO ══ */}
      <AnimatePresence mode="wait">
        {!started && (
          <motion.section key="hero" className="relative z-10 flex-1 flex items-center justify-center px-5 py-8"
            exit={{ opacity: 0, y: -40, transition: { duration: 0.45 } }}>
            <div className="w-full max-w-6xl grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
              <div className="text-center lg:text-left order-2 lg:order-1">
                <motion.div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10 mb-6"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] tracking-[0.2em] text-white/55 font-semibold uppercase">Decision Intelligence Engine</span>
                </motion.div>
                <motion.h1 className="text-4xl sm:text-5xl lg:text-[3.3rem] font-black tracking-tight leading-[1.05]"
                  initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}>
                  Hund für deinen Hund?{" "}
                  <span className="shimmer-text">BELLA findet deinen Empfehlung.</span>
                </motion.h1>
                <motion.p className="mt-5 text-lg sm:text-xl text-white/50 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                  initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                  BELLA analysiert tausende Futtere — sichtbar, nachvollziehbar, präzise.
                  <span className="text-white font-semibold"> transparent, ohne Umwege.</span>
                </motion.p>
                <motion.div className="mt-7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  <RotatingInsight />
                </motion.div>
                <motion.p className="mt-5 text-sm text-white/35" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                  Beantworte 3 Fragen — BELLA zeigt dir live, was analysiert wird.
                </motion.p>
                <motion.div className="mt-6 flex flex-col sm:flex-row items-center lg:items-start gap-3"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
                  <button onClick={startAnalysis}
                    className="group px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold text-base shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all">
                    Analyse starten
                    <span className="ml-2 inline-block group-hover:translate-x-0.5 transition-transform">→</span>
                  </button>
                  <a href="#how" className="px-6 py-3.5 rounded-2xl glass border border-white/10 text-white/70 font-medium hover:bg-white/10 hover:text-white transition-all">
                    Wie funktioniert BELLA?
                  </a>
                </motion.div>
                <motion.div className="mt-6 flex flex-wrap gap-2 justify-center lg:justify-start"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                  <span className="text-[10px] text-white/25 self-center">oder direkt:</span>
                  {STARTERS.slice(0, 4).map(s => (
                    <button key={s.label} onClick={() => send(s.msg)}
                      className="glass rounded-full px-3 py-1.5 text-[11px] font-medium text-white/65 hover:text-white hover:bg-white/10 transition-all">
                      <span className="mr-1">{s.icon}</span>{s.label}
                    </button>
                  ))}
                </motion.div>
              </div>
              <motion.div className="order-1 lg:order-2 flex flex-col items-center gap-5"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
                <BellaRadar size={340} />
                <LiveIntel />
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* HOW IT WORKS */}
      {!started && (
        <section id="how" className="relative z-10 px-5 py-16 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <p className="text-center text-[10px] tracking-[0.25em] text-white/35 font-semibold uppercase mb-2">So funktioniert BELLA</p>
            <h2 className="text-center text-3xl font-black mb-10">Sichtbare Intelligenz</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { n: "01", icon: "🔍", t: "Profil-Analyse", d: "BELLA extrahiert aus deiner Anfrage Budget, Marke, Nutzungsverhalten und Netzpräferenz — vollautomatisch." },
                { n: "02", icon: "⚡", t: "Sichtbare Elimination", d: "Du siehst live, wie BELLA tausende Futtere aussortiert und warum. Kein Blackbox-Ergebnis." },
                { n: "03", icon: "🎯", t: "Begründete Entscheidung", d: "Jede Empfehlung kommt mit Match-Score, Vorteil, Risiko und Zufriedenheitsprognose. Volle Transparenz." },
              ].map(s => (
                <div key={s.n} className="glass-strong rounded-2xl p-6 relative overflow-hidden">
                  <span className="absolute top-4 right-4 text-5xl font-black text-white/[0.04]">{s.n}</span>
                  <div className="text-3xl mb-3">{s.icon}</div>
                  <h3 className="font-bold text-base mb-2">{s.t}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ CHAT ══ */}
      {started && (
        <div className="relative z-10 flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 pb-4 min-h-0">
          <motion.div layout className="flex flex-col items-center py-2"
            initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}>
            <BellaCharacter mood={mood} size={110} />
          </motion.div>

          {/* Quick-Start Cards — visible only on first message (intro state) */}
          <QuickStartCards
            onSend={(q) => { send(q); }}
            visible={messages.length <= 1 && !busy}
          />

          <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-5 py-2 min-h-0">
            <AnimatePresence initial={false}>
              {messages.map(m => (
                <motion.div key={m.id} layout
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>

                  {m.role === "user" ? (
                    <div className="max-w-[80%] bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl rounded-br-md px-4 py-2.5 text-sm shadow-lg shadow-indigo-500/20">
                      {m.content}
                    </div>
                  ) : (
                    <div className="w-full space-y-3">
                      {/* Analysis Feed */}
                      {(m.steps?.length || 0) > 0 && (
                        <AnalysisFeed
                          steps={m.steps ?? []}
                          elims={m.elims ?? []}
                          confidence={m.confidence ?? 0}
                        />
                      )}

                      {/* BELLA text */}
                      {(m.content || m.streaming) && (
                        <div className="glass-strong rounded-2xl rounded-bl-md px-4 py-3 text-[14px] text-white/85 leading-relaxed">
                          {m.content || ""}
                          {m.streaming && <span className="caret" />}
                        </div>
                      )}

                      {/* Offer Cards */}
                      {m.offers && m.offers.length > 0 && (
                        <div className="space-y-3">
                          {m.offers.map((o, i) => <OfferCard key={o.id} offer={o} rank={i} />)}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Profile Panel — slides in when toggled */}
          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden space-y-3 pb-3"
              >
                <UserProfilePanel
                  profile={userProfile}
                  onClear={() => { clearProfile(); setUserProfile(loadProfile()); }}
                />
                <MemoryTimeline profile={userProfile} />
                <MarketWatch active={marketWatch} onToggle={() => setMarketWatch(w => !w)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input */}
          <div className="pt-2 space-y-1">
            <div className={`glass-strong glow-border rounded-2xl flex items-center gap-2 p-1.5 transition-all ${voiceListening ? "border-red-500/50 shadow-red-500/20 shadow-lg" : ""}`}>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send(input))}
                placeholder={voiceListening ? "Spreche jetzt…" : "Frag BELLA — Budget, Marke, Nutzung…"}
                disabled={busy}
                className="flex-1 bg-transparent text-white placeholder-white/25 text-sm focus:outline-none px-3 py-2.5" />
              {/* Voice input */}
              <VoiceButton
                onResult={(text) => { setInput(text); setTimeout(() => send(text), 100); }}
                onListening={setVoiceListening}
                disabled={busy}
              />
              {/* Send */}
              <button onClick={() => send(input)} disabled={busy || !input.trim()}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center hover:shadow-lg hover:shadow-indigo-500/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                {busy
                  ? <span className="flex gap-0.5 items-end h-4">{[0,1,2].map(i => <span key={i} className="w-1 bg-white rounded-full" style={{ animation: `sound-wave 0.9s ease-in-out ${i * 0.15}s infinite` }} />)}</span>
                  : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 12h14m0 0l-6-6m6 6l-6 6" /></svg>
                }
              </button>
            </div>
            <p className="text-center text-white/15 text-[10px] flex flex-wrap justify-center gap-x-3">
              <span>Decision Intelligence Engine</span>
              <a href="/affiliate" className="underline underline-offset-2 hover:text-white/40">Affiliate</a>
              <a href="/impressum" className="underline underline-offset-2 hover:text-white/40">Impressum</a>
              <a href="/datenschutz" className="underline underline-offset-2 hover:text-white/40">Datenschutz</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
