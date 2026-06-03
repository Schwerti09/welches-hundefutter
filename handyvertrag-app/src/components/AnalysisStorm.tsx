"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Contract Rain Cards ─────────────────────────────────────────────────────

const RAIN_POOL = [
  ["iPhone 17 Pro Max", "Telekom", "69,99 €", "ÜBERPRÜFT"],
  ["Galaxy S25 Ultra", "Vodafone", "59,99 €", "ANALYSIERT"],
  ["iPhone Air", "Telekom", "39,99 €", "KANDIDAT"],
  ["Pixel 10 Pro", "o2", "44,99 €", "BEWERTET"],
  ["Galaxy A57 5G", "otelo", "19,99 €", "ELIMINIERT"],
  ["iPhone 16 Pro", "Vodafone", "54,99 €", "ELIMINIERT"],
  ["Galaxy S25", "freenet", "29,99 €", "ANALYSIERT"],
  ["iPhone 17", "o2", "49,99 €", "ÜBERPRÜFT"],
  ["Pixel 10a", "Telekom", "24,99 €", "KANDIDAT"],
  ["Galaxy S25 FE", "congstar", "19,99 €", "ELIMINIERT"],
  ["iPhone 17 Pro", "Telekom", "59,99 €", "ANALYSIERT"],
  ["Galaxy Z Fold7", "Vodafone", "79,99 €", "ELIMINIERT"],
  ["REDMI Note 15", "o2", "14,99 €", "BEWERTET"],
  ["Galaxy A37 5G", "otelo", "19,99 €", "ELIMINIERT"],
  ["iPhone 15", "freenet", "34,99 €", "ANALYSIERT"],
  ["Galaxy S26 Ultra", "Telekom", "69,99 €", "ÜBERPRÜFT"],
  ["Pixel 10 Pro XL", "Vodafone", "64,99 €", "KANDIDAT"],
  ["Galaxy S26", "o2", "44,99 €", "BEWERTET"],
  ["iPhone 16", "Telekom", "44,99 €", "ÜBERPRÜFT"],
  ["HONOR 600 Pro", "otelo", "24,99 €", "ELIMINIERT"],
];

const STATUS_COLOR: Record<string, string> = {
  "ELIMINIERT": "text-red-400/80",
  "ANALYSIERT": "text-amber-300/80",
  "ÜBERPRÜFT": "text-sky-300/80",
  "KANDIDAT": "text-emerald-400",
  "BEWERTET": "text-violet-300/80",
};

// ─── Feed Steps ────────────────────────────────────────────────────────────────

const FEED_STEPS = [
  "Semantischen Intent parsen...",
  "Nutzerprofil konstruieren...",
  "Mobilitätsmuster inferieren...",
  "Premium-Präferenz erkannt...",
  "6.225 Tarife geladen...",
  "Netzkompatibilität prüfen...",
  "Preis-Leistungs-Matrix aufbauen...",
  "5.891 Niedrig-Fit-Tarife eliminieren...",
  "Opportunity-Cost-Analyse...",
  "24-Monats-Wert simulieren...",
  "Regret-Wahrscheinlichkeit berechnen...",
  "Satisfaction-Prediction scoring...",
  "Dominante Empfehlung selektieren...",
  "Konfidenz finalisieren...",
];

const MARKET_FLASHES = [
  { label: "TELEKOM", sub: "Coverage +11%" },
  { label: "O2", sub: "Latenz: abgelehnt" },
  { label: "VODAFONE", sub: "Value: 82/100" },
  { label: "APPLE", sub: "Profil-Treffer ✓" },
  { label: "SAMSUNG", sub: "Kamera-Mismatch" },
  { label: "GOOGLE", sub: "Akku-Fit erkannt" },
  { label: "TELEKOM", sub: "5G: Priorität" },
  { label: "O2", sub: "Budget-Treffer ✓" },
];

// ─── Phase timing ─────────────────────────────────────────────────────────────

const PHASES = [
  { name: "activate",   start: 0,    end: 500  },
  { name: "storm",      start: 500,  end: 2200 },
  { name: "converge",   start: 2200, end: 3500 },
  { name: "lock",       start: 3500, end: 4200 },
];

/**
 * Tracks elapsed ms. When active goes false, fast-forwards to reveal phase
 * so the storm always ends cleanly regardless of API response time.
 */
function useStormPhase(active: boolean): { ms: number; forcedReveal: boolean } {
  const [ms, setMs] = useState(0);
  const [forcedReveal, setForcedReveal] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null!);
  const startRef = useRef(0);
  const wasActive = useRef(false);

  useEffect(() => {
    if (active) {
      startRef.current = Date.now();
      setMs(0);
      setForcedReveal(false);
      wasActive.current = true;
      intervalRef.current = setInterval(() => setMs(Date.now() - startRef.current), 16);
    } else {
      clearInterval(intervalRef.current);
      // API done: if storm was running, jump to reveal immediately
      if (wasActive.current) {
        wasActive.current = false;
        setForcedReveal(true);
        // Auto-call onComplete after the reveal delay
        setTimeout(() => setMs(99999), 50); // reveal phase trigger
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [active]);

  return { ms, forcedReveal };
}

function phaseOf(ms: number, forcedReveal: boolean) {
  if (forcedReveal) return "reveal";
  for (const p of PHASES) if (ms >= p.start && ms < p.end) return p.name;
  return "reveal";
}

// ─── Animated counter ─────────────────────────────────────────────────────────

function Counter({ target, ms, label }: { target: number; ms: number; label: string }) {
  const progress = Math.min(1, Math.max(0, (ms - 400) / 1800));
  const eased = 1 - Math.pow(1 - progress, 3);
  const val = Math.round(eased * target);
  return (
    <div className="text-center">
      <div className="text-xl sm:text-2xl font-black tabular-nums text-white leading-none">
        {val.toLocaleString("de-DE")}
      </div>
      <div className="text-[10px] text-white/35 mt-0.5 leading-snug">{label}</div>
    </div>
  );
}

// ─── Confidence bar ───────────────────────────────────────────────────────────

function ConfidenceBar({ ms }: { ms: number }) {
  const progress = Math.min(1, Math.max(0, (ms - 600) / 2600));
  const conf = Math.round(60 + progress * 34);
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] text-white/40 whitespace-nowrap">Konfidenz</span>
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all"
          style={{ width: `${conf}%`, transition: "width 0.08s linear" }}
        />
      </div>
      <span className="text-[11px] font-black text-emerald-300 tabular-nums w-9 text-right">{conf}%</span>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

interface Props {
  active: boolean;
  query: string;
  onComplete?: () => void;
}

export default function AnalysisStorm({ active, query, onComplete }: Props) {
  const { ms, forcedReveal } = useStormPhase(active);
  const phase = phaseOf(ms, forcedReveal);
  const [feedIdx, setFeedIdx] = useState(0);
  const [flashIdx, setFlashIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) { setFeedIdx(0); setFlashIdx(0); return; }
    setDone(false); // reset on new activation
    const fi = setInterval(() => setFeedIdx(i => Math.min(i + 1, FEED_STEPS.length - 1)), 220);
    const fl = setInterval(() => setFlashIdx(i => (i + 1) % MARKET_FLASHES.length), 280);
    return () => { clearInterval(fi); clearInterval(fl); };
  }, [active]);

  // Signal completion: show reveal, then self-destruct + call parent
  useEffect(() => {
    if (done) return;
    if (phase === "reveal" && (ms > 4200 || forcedReveal)) {
      const delay = forcedReveal ? 1200 : 100; // 1.2s reveal if forced, 0.1s if natural
      const t = setTimeout(() => {
        setDone(true);       // self-destruct — hides immediately
        onComplete?.();      // notify parent
      }, delay);
      return () => clearTimeout(t);
    }
  }, [phase, ms, forcedReveal, onComplete, done]);

  if (done || (!active && ms < 100 && !forcedReveal)) return null;

  const stormOpacity = forcedReveal ? 0
    : phase === "activate" ? 1
    : phase === "storm" ? 1
    : phase === "converge" ? Math.max(0, 1 - (ms - 2200) / 800)
    : 0;

  const revealOpacity = forcedReveal ? 1
    : phase === "lock" ? Math.min(1, (ms - 3500) / 500)
    : phase === "reveal" ? 1 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#03030d] flex flex-col overflow-hidden">
      {/* ── Rain column (left) ── */}
      <div
        className="absolute left-0 top-0 w-1/3 sm:w-1/4 h-full overflow-hidden pointer-events-none border-r border-white/5"
        style={{ opacity: stormOpacity }}
      >
        <div
          className="flex flex-col gap-1 will-change-transform"
          style={{
            transform: `translateY(${-((ms * 0.22) % 600)}px)`,
            transition: "none",
          }}
        >
          {[...RAIN_POOL, ...RAIN_POOL].map((item, i) => (
            <div key={i} className="px-2 py-1.5 border-b border-white/[0.04] flex-shrink-0">
              <p className="text-[10px] font-semibold text-white/70 truncate">{item[0]}</p>
              <p className="text-[9px] text-white/35">{item[1]} · {item[2]}</p>
              <p className={`text-[9px] font-bold ${STATUS_COLOR[item[3]] ?? "text-white/30"}`}>{item[3]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main center column ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6"
        style={{ left: "25%", right: "0" }}>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-white/50 tracking-widest uppercase font-bold">HANSI Decision Intelligence</span>
          </div>
          <span className="text-[10px] text-white/25 font-mono">{(ms / 1000).toFixed(1)}s</span>
        </div>

        {/* Storm state */}
        <div style={{ opacity: stormOpacity, transition: "opacity 0.3s" }} className="w-full max-w-lg space-y-5">
          {/* Query */}
          <div className="text-center">
            <p className="text-[11px] text-white/30 uppercase tracking-widest mb-1">Anfrage</p>
            <p className="text-base font-bold text-white/80">{query || "Analyse läuft..."}</p>
          </div>

          {/* Decision feed */}
          <div className="bg-black/40 rounded-xl border border-white/8 p-3 font-mono space-y-1 min-h-[120px]">
            <p className="text-[9px] text-white/25 uppercase tracking-widest mb-2">Decision Feed</p>
            {FEED_STEPS.slice(0, feedIdx + 1).map((step, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: i === feedIdx ? 1 : 0.35, x: 0 }}
                className={`text-[11px] flex items-center gap-2 ${i === feedIdx ? "text-indigo-300" : "text-white/40"}`}
              >
                <span className="text-emerald-400">{i < feedIdx ? "✓" : "›"}</span>
                {step}
              </motion.div>
            ))}
          </div>

          {/* Counters */}
          <div className="grid grid-cols-3 gap-3">
            <Counter target={6225} ms={ms} label="Tarife geladen" />
            <Counter target={5891} ms={ms} label="Eliminiert" />
            <Counter target={Math.min(feedIdx * 3 + 8, 94)} ms={ms} label="Konfidenz %" />
          </div>

          {/* Confidence bar */}
          <ConfidenceBar ms={ms} />

          {/* Market flash */}
          <AnimatePresence mode="wait">
            <motion.div key={flashIdx}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-2.5 flex items-center gap-3">
              <span className="text-[10px] font-black text-white/50 tracking-widest w-20">{MARKET_FLASHES[flashIdx].label}</span>
              <span className="text-[11px] text-white/60">{MARKET_FLASHES[flashIdx].sub}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Converge / Lock / Reveal ── */}
        <AnimatePresence>
          {(phase === "lock" || phase === "reveal") && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: revealOpacity, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
            >
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "2px" }}
                transition={{ delay: 0.1, duration: 0.6, ease: [0.87, 0, 0.13, 1] }}
                className="h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent mb-8"
              />
              <p className="text-[11px] tracking-[0.3em] text-white/30 uppercase font-semibold mb-3">Optimaler Match gefunden</p>
              <h2 className="text-4xl font-black text-white mb-2">Analyse abgeschlossen.</h2>
              <p className="text-white/45 text-base">HANSI hat die beste Entscheidung für dein Profil berechnet.</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-300 font-bold text-sm">
                    {Math.round(60 + Math.min(1, (ms - 600) / 2600) * 34)}% Konfidenz
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Scanline overlay ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: stormOpacity * 0.06 }}>
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="h-px bg-white/20" style={{ marginTop: i === 0 ? 0 : "calc(2.5vh - 1px)" }} />
        ))}
      </div>
    </div>
  );
}
