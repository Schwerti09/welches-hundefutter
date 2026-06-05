"use client";

import { useEffect, useRef, useState } from "react";

type BellaMood = "idle" | "thinking" | "talking" | "happy" | "waving" | "excited";

interface BellaProps {
  mood?: BellaMood;
  size?: number;
  className?: string;
  track?: boolean;   // Augen + Nase folgen dem Cursor (der „lebende" Effekt)
}

/**
 * BELLA — freundlicher goldener Hund (KI-Ernährungsberaterin).
 * Stimmungen: idle/thinking/talking/happy/waving/excited.
 */
export default function Bella({ mood = "idle", size = 200, className = "", track = false }: BellaProps) {
  const [blink, setBlink] = useState(false);
  const [tail, setTail] = useState(0);
  const [gaze, setGaze] = useState({ x: 0, y: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);

  // Blick folgt dem Cursor — normalisiert auf die Distanz, sanft geclamped, rAF-gedrosselt.
  useEffect(() => {
    if (!track) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = wrapRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height * 0.42;
        const clamp = (v: number) => Math.max(-1, Math.min(1, v));
        setGaze({ x: clamp((e.clientX - cx) / 480), y: clamp((e.clientY - cy) / 480) });
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, [track]);

  const ex = gaze.x * 4, ey = gaze.y * 3;       // Augen-Versatz
  const nx = gaze.x * 2.6, ny = gaze.y * 2;      // Nasen-Versatz

  useEffect(() => {
    const b = setInterval(() => { setBlink(true); setTimeout(() => setBlink(false), 140); }, 3200 + Math.random() * 1800);
    return () => clearInterval(b);
  }, []);

  // Schwanzwedeln bei freudigen Stimmungen
  useEffect(() => {
    const fast = mood === "excited" || mood === "waving" || mood === "happy";
    let a = 0, dir = 1;
    const w = setInterval(() => { a += dir * (fast ? 14 : 5); if (a > 22 || a < -22) dir *= -1; setTail(a); }, 55);
    return () => clearInterval(w);
  }, [mood]);

  const happy = mood === "happy" || mood === "excited";
  const eyeRy = blink ? 0.6 : 7;
  const bounce = mood === "excited" ? "animate-bounce" : "";

  return (
    <div ref={wrapRef} className={`inline-flex items-center justify-center select-none ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" width={size} height={size} className={bounce}
        style={{ filter: "drop-shadow(0 10px 26px rgba(193,122,58,0.30))" }}>
        <defs>
          <linearGradient id="furGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F0C078" />
            <stop offset="100%" stopColor="#D99A4E" />
          </linearGradient>
          <linearGradient id="earGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9873C" />
            <stop offset="100%" stopColor="#A66A28" />
          </linearGradient>
          <radialGradient id="cheek" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F7A6A6" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#F7A6A6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ─── Schwanz (wedelt) ─────────────────────────────── */}
        <g transform={`rotate(${tail} 150 150)`} style={{ transition: "transform 0.05s linear" }}>
          <path d="M148 150 Q176 140 182 112 Q170 120 158 132 Q150 140 148 150 Z" fill="url(#furGrad)" />
        </g>

        {/* ─── Körper (sitzend) ─────────────────────────────── */}
        <ellipse cx="100" cy="158" rx="46" ry="34" fill="url(#furGrad)" />
        <ellipse cx="100" cy="166" rx="30" ry="22" fill="#F6E2C2" />
        {/* Vorderpfoten */}
        <ellipse cx="82" cy="184" rx="13" ry="9" fill="url(#furGrad)" />
        <ellipse cx="118" cy="184" rx="13" ry="9" fill="url(#furGrad)" />
        <ellipse cx="82" cy="186" rx="8" ry="5" fill="#F6E2C2" />
        <ellipse cx="118" cy="186" rx="8" ry="5" fill="#F6E2C2" />

        {/* ─── Ohren (heben sich bei excited) ───────────────── */}
        <g style={{ transition: "transform 0.3s" }} transform={mood === "excited" || mood === "waving" ? "translate(0,-4)" : ""}>
          <path d="M46 70 Q30 96 44 124 Q60 116 62 88 Z" fill="url(#earGrad)" />
          <path d="M154 70 Q170 96 156 124 Q140 116 138 88 Z" fill="url(#earGrad)" />
        </g>

        {/* ─── Kopf ─────────────────────────────────────────── */}
        <ellipse cx="100" cy="92" rx="52" ry="48" fill="url(#furGrad)" />
        {/* Schnauze hell */}
        <ellipse cx="100" cy="108" rx="30" ry="26" fill="#F8E8CC" />

        {/* Wangen */}
        <circle cx="64" cy="104" r="12" fill="url(#cheek)" />
        <circle cx="136" cy="104" r="12" fill="url(#cheek)" />

        {/* Augenbrauen bei thinking */}
        {mood === "thinking" && (
          <>
            <path d="M70 70 Q80 65 90 70" stroke="#A66A28" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M110 68 Q120 62 130 67" stroke="#A66A28" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        )}

        {/* Augen (folgen dem Cursor) */}
        <g transform={`translate(${ex} ${ey})`} style={{ transition: "transform .12s ease-out" }}>
          <ellipse cx="80" cy="86" rx="7" ry={eyeRy} fill="#3A2417" style={{ transition: "ry 0.08s" }} />
          <ellipse cx="120" cy="86" rx="7" ry={eyeRy} fill="#3A2417" style={{ transition: "ry 0.08s" }} />
          {!blink && (
            <>
              <circle cx="82" cy="83" r="2.2" fill="white" />
              <circle cx="122" cy="83" r="2.2" fill="white" />
            </>
          )}
        </g>

        {/* Nase (folgt dem Cursor) */}
        <g transform={`translate(${nx} ${ny})`} style={{ transition: "transform .12s ease-out" }}>
          <ellipse cx="100" cy="104" rx="9" ry="7" fill="#3A2417" />
          <ellipse cx="97" cy="101" rx="2.5" ry="1.8" fill="rgba(255,255,255,0.5)" />
        </g>

        {/* Mund / Zunge */}
        {happy ? (
          <>
            <path d="M100 110 Q100 120 90 124 M100 110 Q100 120 110 124" stroke="#3A2417" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <ellipse cx="100" cy="126" rx="7" ry="9" fill="#F47E7E" />
          </>
        ) : mood === "thinking" ? (
          <path d="M92 118 Q100 114 108 118" stroke="#3A2417" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M100 110 Q100 119 91 122 M100 110 Q100 119 109 122" stroke="#3A2417" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}

        {/* Denk-Punkte */}
        {mood === "thinking" && (
          <g>
            {[0, 0.27, 0.54].map((d, i) => (
              <circle key={i} cx={150 + i * 12} cy={54 - i * 8} r={3 + i} fill="#C9873C">
                <animate attributeName="opacity" values="1;0.2;1" dur="0.9s" repeatCount="indefinite" begin={`${d}s`} />
              </circle>
            ))}
          </g>
        )}

        {/* Freude-Funken */}
        {mood === "excited" && (
          <>
            <text x="24" y="48" fontSize="16" style={{ animation: "float 1s ease-in-out infinite" }}>✨</text>
            <text x="160" y="44" fontSize="14" style={{ animation: "float 1.2s ease-in-out infinite" }}>⭐</text>
          </>
        )}
      </svg>
    </div>
  );
}
