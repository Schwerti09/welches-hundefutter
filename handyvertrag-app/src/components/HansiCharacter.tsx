"use client";

import { useEffect, useRef, useState } from "react";

export type HansiMood = "idle" | "listening" | "thinking" | "excited" | "happy" | "presenting";

interface Props {
  mood?: HansiMood;
  size?: number;
}

const MOOD_AURA: Record<HansiMood, string> = {
  idle: "#6366f1",
  listening: "#22d3ee",
  thinking: "#a855f7",
  excited: "#ec4899",
  happy: "#34d399",
  presenting: "#f59e0b",
};

export default function HansiCharacter({ mood = "idle", size = 260 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);
  const aura = MOOD_AURA[mood];

  // Eyes follow cursor
  useEffect(() => {
    function onMove(e: MouseEvent) {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2.5;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const max = 5.5;
      setPupil({
        x: (dx / dist) * Math.min(max, dist / 32),
        y: (dy / dist) * Math.min(max, dist / 32),
      });
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Natural blinking
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const loop = () => {
      setBlink(true);
      setTimeout(() => setBlink(false), 130);
      t = setTimeout(loop, 2600 + Math.random() * 3200);
    };
    t = setTimeout(loop, 1800);
    return () => clearTimeout(t);
  }, []);

  const isThinking = mood === "thinking";
  const isExcited = mood === "excited";
  const isHappy = mood === "happy" || mood === "presenting";
  const eyeScaleY = blink ? 0.1 : 1;

  return (
    <div
      ref={wrapRef}
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size * 1.18 }}
    >
      {/* Outer soft aura */}
      <div
        className="absolute rounded-full glow-pulse"
        style={{
          width: size * 1.25,
          height: size * 1.25,
          background: `radial-gradient(circle, ${aura}66 0%, ${aura}1f 42%, transparent 72%)`,
          filter: "blur(26px)",
          transition: "background 0.9s ease",
        }}
      />

      {/* Twin rotating halo rings */}
      <svg className="absolute ring-rotate" width={size * 1.12} height={size * 1.12} viewBox="0 0 100 100" style={{ opacity: 0.5 }}>
        <circle cx="50" cy="50" r="48" fill="none" stroke={aura} strokeWidth="0.3" strokeDasharray="1 7" style={{ transition: "stroke 0.9s ease" }} />
      </svg>
      <svg className="absolute" width={size * 1.0} height={size * 1.0} viewBox="0 0 100 100" style={{ opacity: 0.35, animation: "ring-rotate 26s linear infinite reverse" }}>
        <circle cx="50" cy="50" r="46" fill="none" stroke={aura} strokeWidth="0.25" strokeDasharray="0.5 11" style={{ transition: "stroke 0.9s ease" }} />
      </svg>

      {/* Contact shadow */}
      <div
        className="absolute"
        style={{
          bottom: size * 0.02,
          width: size * 0.42,
          height: size * 0.06,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(0,0,0,0.45), transparent 70%)",
          filter: "blur(6px)",
          animation: "shadow-breathe 5s ease-in-out infinite",
        }}
      />

      {/* Character */}
      <div className="breathe relative" style={{ width: size * 0.64, height: size * 0.9 }}>
        <svg viewBox="0 0 170 230" width="100%" height="100%" style={{ filter: `drop-shadow(0 22px 48px ${aura}77)`, transition: "filter 0.9s ease" }}>
          <defs>
            {/* Glossy body gradient */}
            <linearGradient id="hBody" x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0%" stopColor="#33354d" />
              <stop offset="45%" stopColor="#1a1c2e" />
              <stop offset="100%" stopColor="#0a0b16" />
            </linearGradient>
            {/* Edge rim light */}
            <linearGradient id="hRim" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={aura} stopOpacity="0.9" />
              <stop offset="50%" stopColor={aura} stopOpacity="0.15" />
              <stop offset="100%" stopColor={aura} stopOpacity="0.7" />
            </linearGradient>
            {/* Screen */}
            <radialGradient id="hScreen" cx="0.42" cy="0.32" r="0.9">
              <stop offset="0%" stopColor={aura} stopOpacity="0.28" />
              <stop offset="55%" stopColor="#0a0b16" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#05060f" />
            </radialGradient>
            {/* Eye */}
            <radialGradient id="hEye" cx="0.38" cy="0.32" r="0.85">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor={aura} />
              <stop offset="100%" stopColor={aura} stopOpacity="0.55" />
            </radialGradient>
            {/* Limb gradient */}
            <linearGradient id="hLimb" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2a2c40" />
              <stop offset="100%" stopColor="#13141f" />
            </linearGradient>
            <filter id="hGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.6" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Antenna */}
          <line x1="85" y1="24" x2="85" y2="7" stroke={aura} strokeWidth="2.6" strokeLinecap="round" style={{ transition: "stroke 0.9s" }} />
          <circle cx="85" cy="6" r="4.5" fill={aura} filter="url(#hGlow)" style={{ transition: "fill 0.9s" }}>
            <animate attributeName="r" values="4.5;6;4.5" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* Left arm */}
          <path
            d={isHappy ? "M 36 102 Q 12 80 17 58" : isThinking ? "M 36 106 Q 15 110 12 90" : "M 36 106 Q 17 116 15 134"}
            stroke="url(#hLimb)" strokeWidth="12" strokeLinecap="round" fill="none"
            style={{ transition: "d 0.55s cubic-bezier(0.34,1.56,0.64,1)" }}
          />
          <circle cx={isHappy ? 17 : 15} cy={isHappy ? 58 : isThinking ? 90 : 134} r="7" fill="url(#hLimb)" style={{ transition: "all 0.55s cubic-bezier(0.34,1.56,0.64,1)" }} />

          {/* Right arm */}
          <path
            d={isExcited ? "M 134 102 Q 158 80 153 56" : isThinking ? "M 134 106 Q 152 100 160 86" : "M 134 106 Q 153 116 155 134"}
            stroke="url(#hLimb)" strokeWidth="12" strokeLinecap="round" fill="none"
            style={{ transition: "d 0.55s cubic-bezier(0.34,1.56,0.64,1)" }}
          />
          <circle cx={isExcited ? 153 : 155} cy={isExcited ? 56 : isThinking ? 86 : 134} r="7" fill="url(#hLimb)" style={{ transition: "all 0.55s cubic-bezier(0.34,1.56,0.64,1)" }} />

          {/* Body */}
          <rect x="36" y="24" width="98" height="166" rx="26" fill="url(#hBody)" />
          {/* Rim light edge */}
          <rect x="36" y="24" width="98" height="166" rx="26" fill="none" stroke="url(#hRim)" strokeWidth="1.6" style={{ transition: "stroke 0.9s" }} />
          {/* Top gloss highlight */}
          <ellipse cx="70" cy="44" rx="34" ry="12" fill="#ffffff" opacity="0.07" />

          {/* Screen */}
          <rect x="45" y="35" width="80" height="128" rx="18" fill="url(#hScreen)" style={{ transition: "fill 0.9s" }} />
          {/* Screen reflection streak */}
          <rect x="50" y="40" width="20" height="118" rx="10" fill="#ffffff" opacity="0.05" transform="skewX(-8)" />

          {/* ── FACE ── */}
          <g transform={`translate(${pupil.x}, ${pupil.y})`} style={{ transition: "transform 0.13s ease-out" }}>
            <g transform={`translate(68, 84) scale(1, ${eyeScaleY})`} style={{ transition: "transform 0.07s" }} filter="url(#hGlow)">
              <circle cx="0" cy="0" r="8.5" fill="url(#hEye)" />
              <circle cx="-2.6" cy="-2.6" r="2.6" fill="#fff" />
            </g>
            <g transform={`translate(102, 84) scale(1, ${eyeScaleY})`} style={{ transition: "transform 0.07s" }} filter="url(#hGlow)">
              <circle cx="0" cy="0" r="8.5" fill="url(#hEye)" />
              <circle cx="-2.6" cy="-2.6" r="2.6" fill="#fff" />
            </g>
          </g>

          {/* Mustache */}
          <path
            d={isHappy
              ? "M 60 110 Q 70 120 85 114 Q 100 120 110 110 Q 100 105 85 110 Q 70 105 60 110 Z"
              : "M 60 110 Q 70 106 85 111 Q 100 106 110 110 Q 100 116 85 112 Q 70 116 60 110 Z"}
            fill="#eef2ff"
            style={{ transition: "d 0.4s" }}
          />

          {/* Mouth */}
          {isHappy ? (
            <path d="M 70 125 Q 85 142 100 125" stroke={aura} strokeWidth="3.2" strokeLinecap="round" fill="none" style={{ transition: "stroke 0.9s" }} />
          ) : isThinking ? (
            <circle cx="85" cy="130" r="3.5" fill="none" stroke={aura} strokeWidth="2" opacity="0.7" />
          ) : isExcited ? (
            <ellipse cx="85" cy="130" rx="7" ry="9" fill={aura} opacity="0.9" />
          ) : (
            <path d="M 72 127 Q 85 135 98 127" stroke={aura} strokeWidth="2.8" strokeLinecap="round" fill="none" style={{ transition: "stroke 0.9s" }} />
          )}

          {/* Thinking dots */}
          {isThinking && (
            <g>
              {[72, 85, 98].map((cx, i) => (
                <circle key={cx} cx={cx} cy="146" r="2.6" fill={aura}>
                  <animate attributeName="opacity" values="0.2;1;0.2" dur="1.2s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </g>
          )}

          {/* Home bar */}
          <rect x="72" y="170" width="26" height="4" rx="2" fill={aura} opacity="0.35" style={{ transition: "fill 0.9s" }} />

          {/* Legs */}
          <path d="M 68 190 L 66 210" stroke="url(#hLimb)" strokeWidth="10" strokeLinecap="round" />
          <path d="M 102 190 L 104 210" stroke="url(#hLimb)" strokeWidth="10" strokeLinecap="round" />
          <ellipse cx="64" cy="214" rx="10" ry="5" fill="#0a0b16" />
          <ellipse cx="106" cy="214" rx="10" ry="5" fill="#0a0b16" />
        </svg>

        {/* Excited sparkles */}
        {isExcited && (
          <>
            <span className="absolute -top-2 -left-1 text-xl animate-pop-in">✨</span>
            <span className="absolute top-4 -right-2 text-lg animate-pop-in" style={{ animationDelay: "0.15s" }}>⭐</span>
            <span className="absolute top-1/2 -right-5 text-base animate-pop-in" style={{ animationDelay: "0.3s" }}>🎉</span>
          </>
        )}
      </div>
    </div>
  );
}
