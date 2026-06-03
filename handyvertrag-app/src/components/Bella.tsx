"use client";

import { useEffect, useState } from "react";

type BellaMood = "idle" | "thinking" | "talking" | "happy" | "waving" | "excited";

interface BellaProps {
  mood?: BellaMood;
  size?: number;
  className?: string;
}

export default function Bella({ mood = "idle", size = 200, className = "" }: BellaProps) {
  const [blink, setBlink] = useState(false);
  const [armAngle, setArmAngle] = useState(0);

  // Blink every 3-5 seconds
  useEffect(() => {
    const blinker = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(blinker);
  }, []);

  // Wave arm when waving/excited
  useEffect(() => {
    if (mood === "waving" || mood === "excited") {
      let angle = 0;
      let dir = 1;
      const waver = setInterval(() => {
        angle += dir * 8;
        if (angle > 30 || angle < -10) dir *= -1;
        setArmAngle(angle);
      }, 60);
      return () => clearInterval(waver);
    } else {
      setArmAngle(0);
    }
  }, [mood]);

  const scale = size / 200;
  const eyeH = blink ? 2 : 22;
  const eyeY = blink ? 89 : 78;

  const bodyBounce = mood === "excited" ? "animate-bounce" : mood === "happy" ? "animate-pulse" : "";

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`} style={{ width: size, height: size * 1.6 }}>
      <svg
        viewBox="0 0 200 320"
        width={size}
        height={size * 1.6}
        className={bodyBounce}
        style={{ filter: "drop-shadow(0 8px 24px rgba(99,102,241,0.35))" }}
      >
        {/* ─── LEFT ARM ─────────────────────────────────────────── */}
        <g transform={`translate(28, 130) rotate(${mood === "waving" ? armAngle + 20 : mood === "thinking" ? -40 : 15})`}
          style={{ transformOrigin: "28px 130px", transition: "transform 0.3s" }}>
          <rect x="-28" y="0" width="16" height="50" rx="8" fill="url(#bellaGrad)" />
          {/* Hand */}
          <circle cx="-20" cy="52" r="10" fill="url(#bellaGrad)" />
          {/* Finger wave when waving */}
          {(mood === "waving" || mood === "excited") && (
            <g transform="translate(-20, 52)">
              <rect x="-3" y="-16" width="6" height="12" rx="3" fill="#a5b4fc" transform="rotate(-20)" />
              <rect x="4" y="-17" width="6" height="14" rx="3" fill="#a5b4fc" transform="rotate(0)" />
              <rect x="11" y="-14" width="6" height="12" rx="3" fill="#a5b4fc" transform="rotate(15)" />
            </g>
          )}
        </g>

        {/* ─── RIGHT ARM ────────────────────────────────────────── */}
        <g transform={`translate(172, 130) rotate(${mood === "thinking" ? 40 : mood === "happy" ? -20 : -15})`}
          style={{ transformOrigin: "172px 130px", transition: "transform 0.3s" }}>
          <rect x="12" y="0" width="16" height="50" rx="8" fill="url(#bellaGrad)" />
          <circle cx="20" cy="52" r="10" fill="url(#bellaGrad)" />
        </g>

        {/* ─── BODY (Phone) ─────────────────────────────────────── */}
        <rect x="38" y="40" width="124" height="210" rx="22" fill="url(#bellaGrad)" />
        {/* Screen */}
        <rect x="48" y="55" width="104" height="160" rx="14" fill="#1e1b4b" />
        {/* Screen shine */}
        <rect x="52" y="58" width="30" height="5" rx="2.5" fill="rgba(255,255,255,0.12)" />

        {/* ─── FACE on screen ───────────────────────────────────── */}

        {/* Eyes */}
        <rect x="70" y={eyeY} width="20" height={eyeH} rx="10" fill="white"
          style={{ transition: "height 0.08s, y 0.08s" }} />
        <rect x="110" y={eyeY} width="20" height={eyeH} rx="10" fill="white"
          style={{ transition: "height 0.08s, y 0.08s" }} />

        {/* Pupils */}
        {!blink && (
          <>
            <circle cx={mood === "thinking" ? 83 : 80} cy="91" r="6" fill="#1e1b4b" />
            <circle cx={mood === "thinking" ? 123 : 120} cy="91" r="6" fill="#1e1b4b" />
            {/* Highlight */}
            <circle cx={mood === "thinking" ? 85 : 82} cy="88" r="2.5" fill="white" />
            <circle cx={mood === "thinking" ? 125 : 122} cy="88" r="2.5" fill="white" />
          </>
        )}

        {/* Mustache 🥸 */}
        <path
          d={mood === "happy" || mood === "excited"
            ? "M 72 112 Q 80 122 100 116 Q 120 122 128 112 Q 120 108 100 112 Q 80 108 72 112 Z"
            : "M 72 112 Q 80 110 100 114 Q 120 110 128 112 Q 120 118 100 115 Q 80 118 72 112 Z"}
          fill="white"
          style={{ transition: "d 0.3s" }}
        />

        {/* Smile / Expression */}
        {mood === "happy" || mood === "excited" ? (
          <path d="M 76 124 Q 100 144 124 124" stroke="white" strokeWidth="3.5"
            strokeLinecap="round" fill="none" />
        ) : mood === "thinking" ? (
          <path d="M 82 130 Q 100 126 118 130" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5"
            strokeLinecap="round" fill="none" />
        ) : (
          <path d="M 78 128 Q 100 140 122 128" stroke="white" strokeWidth="3"
            strokeLinecap="round" fill="none" />
        )}

        {/* Thinking dots */}
        {mood === "thinking" && (
          <g>
            <circle cx="80" cy="145" r="4" fill="rgba(255,255,255,0.7)">
              <animate attributeName="opacity" values="1;0.2;1" dur="0.8s" repeatCount="indefinite" begin="0s" />
            </circle>
            <circle cx="100" cy="145" r="4" fill="rgba(255,255,255,0.7)">
              <animate attributeName="opacity" values="1;0.2;1" dur="0.8s" repeatCount="indefinite" begin="0.27s" />
            </circle>
            <circle cx="120" cy="145" r="4" fill="rgba(255,255,255,0.7)">
              <animate attributeName="opacity" values="1;0.2;1" dur="0.8s" repeatCount="indefinite" begin="0.54s" />
            </circle>
          </g>
        )}

        {/* Speaker / bottom notch */}
        <rect x="85" y="228" width="30" height="6" rx="3" fill="rgba(255,255,255,0.25)" />
        <circle cx="100" cy="237" r="4" fill="rgba(255,255,255,0.15)" />

        {/* Camera bump on top */}
        <rect x="88" y="44" width="24" height="8" rx="4" fill="rgba(255,255,255,0.2)" />

        {/* ─── LEGS ─────────────────────────────────────────────── */}
        <rect x="70" y="248" width="22" height="55" rx="11"
          fill="url(#bellaGrad)"
          transform={mood === "waving" || mood === "excited" ? "translate(0,-3)" : ""}
          style={{ transition: "transform 0.3s" }} />
        <rect x="108" y="248" width="22" height="55" rx="11"
          fill="url(#bellaGrad)"
          transform={mood === "waving" || mood === "excited" ? "translate(0,-3)" : ""}
          style={{ transition: "transform 0.3s" }} />

        {/* Feet */}
        <ellipse cx="81" cy="303" rx="18" ry="10" fill="url(#bellaGrad)" />
        <ellipse cx="119" cy="303" rx="18" ry="10" fill="url(#bellaGrad)" />

        {/* ─── GRADIENT DEFS ────────────────────────────────────── */}
        <defs>
          <linearGradient id="bellaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        {/* Excited stars */}
        {mood === "excited" && (
          <>
            <text x="15" y="60" fontSize="16" style={{ animation: "float 1s ease-in-out infinite" }}>⭐</text>
            <text x="160" y="55" fontSize="14" style={{ animation: "float 1.2s ease-in-out infinite" }}>✨</text>
            <text x="170" y="100" fontSize="12" style={{ animation: "float 0.8s ease-in-out infinite" }}>🎉</text>
          </>
        )}
      </svg>
    </div>
  );
}
