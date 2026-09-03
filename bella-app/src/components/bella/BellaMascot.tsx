import type { CSSProperties } from "react";

/**
 * BELLA — das Marken-Maskottchen (Roadmap 3.2).
 *
 * Bewusst ANDERS als `Bella.tsx` (interaktiv, cursor-tracking, nur Hero) und
 * `BellaCharacter.tsx` (off-brand Farben): dies ist die ruhige, überall
 * einsetzbare Marken-BELLA — reines SVG, KEIN "use client", kein JS, server-
 * renderbar (404, Loading, Popup, Avatare). Wenige Linien, Honig/Token-Palette.
 *
 * Farben kommen aus CSS-Custom-Properties mit Fallback → funktioniert auch
 * außerhalb des Token-Kontexts und in Light + Dark.
 * Die dezente Idle-Animation läuft nur bei `prefers-reduced-motion: no-preference`.
 */
export type BellaPose = "idle" | "sniff" | "found" | "hmm";

interface Props {
  pose?: BellaPose;
  size?: number;
  className?: string;
  /** Gesetzt → `role="img"` + `<title>`. Leer → rein dekorativ (`aria-hidden`). */
  title?: string;
}

const WRAP: CSSProperties = {
  // Token-Fallbacks: Honig-Fell, immer-dunkle Nase/Augen.
  ["--bella-coat" as string]: "var(--honey, #f0a73c)",
  ["--bella-coat-shade" as string]: "var(--honey-2, #e07f2e)",
  ["--bella-muzzle" as string]: "#fbe4c2",
  ["--bella-ink" as string]: "#2a1c0d",
  ["--bella-accent" as string]: "var(--honey-2, #ff8a4c)",
  display: "inline-block",
  lineHeight: 0,
};

export default function BellaMascot({ pose = "idle", size = 64, className, title }: Props) {
  const decorative = !title;
  const tilt = pose === "hmm" ? -9 : pose === "sniff" ? 4 : 0;

  return (
    <span style={WRAP} className={className} data-bella-pose={pose}>
      <svg
        viewBox="0 0 96 96"
        width={size}
        height={size}
        role={decorative ? undefined : "img"}
        aria-hidden={decorative || undefined}
        aria-label={decorative ? undefined : title}
        style={{ overflow: "visible" }}
      >
        {!decorative && <title>{title}</title>}

        <style>{`
          @media (prefers-reduced-motion: no-preference) {
            [data-bella-pose] .bella-head { animation: bella-breathe 4.8s ease-in-out infinite; transform-origin: 48px 60px; }
            [data-bella-pose="sniff"] .bella-nose { animation: bella-nose 1.1s ease-in-out infinite; transform-origin: 48px 62px; }
            [data-bella-pose="sniff"] .bella-scent { animation: bella-scent 2.4s ease-in-out infinite; }
            [data-bella-pose="found"] .bella-spark { animation: bella-spark 1.8s ease-in-out infinite; transform-origin: 76px 20px; }
            [data-bella-pose="found"] .bella-ear-l,
            [data-bella-pose="found"] .bella-ear-r { animation: bella-perk 1.8s ease-in-out infinite; }
          }
          @keyframes bella-breathe { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-1.2px) scale(1.015); } }
          @keyframes bella-nose { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-1.1px) rotate(-3deg); } 75% { transform: translateX(1.1px) rotate(3deg); } }
          @keyframes bella-scent { 0% { opacity: 0; transform: translateY(2px); } 30% { opacity: .9; } 100% { opacity: 0; transform: translateY(-9px); } }
          @keyframes bella-spark { 0%,100% { opacity: .35; transform: scale(.8) rotate(0deg); } 50% { opacity: 1; transform: scale(1.1) rotate(45deg); } }
          @keyframes bella-perk { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-1.5px); } }
        `}</style>

        <g className="bella-head" transform={`rotate(${tilt} 48 52)`}>
          {/* Ohren (Retriever, floppy) — Pose steuert die Stellung */}
          <path
            className="bella-ear-l"
            d={
              pose === "found"
                ? "M27 26C16 20 12 34 15 46c3 11 13 12 18 6 4-5 3-24-6-32Z"
                : pose === "hmm"
                ? "M28 22C17 18 11 30 13 43c2 12 12 15 18 9 4-5 5-24-3-30Z"
                : "M29 30C19 27 13 40 16 52c3 11 13 12 18 5 4-6 3-22-5-27Z"
            }
            fill="var(--bella-coat-shade)"
          />
          <path
            className="bella-ear-r"
            d={
              pose === "found"
                ? "M69 26C80 20 84 34 81 46c-3 11-13 12-18 6-4-5-3-24 6-32Z"
                : pose === "hmm"
                ? "M68 33C79 31 85 44 81 55c-3 10-13 10-18 3-3-6-2-20 5-25Z"
                : "M67 30C77 27 83 40 80 52c-3 11-13 12-18 5-4-6-3-22 5-27Z"
            }
            fill="var(--bella-coat-shade)"
          />

          {/* Kopf */}
          <path
            d="M48 18c16 0 27 12 27 29 0 18-12 31-27 31S21 65 21 47c0-17 11-29 27-29Z"
            fill="var(--bella-coat)"
          />
          {/* Stirn-Glanz */}
          <path d="M35 30c6-7 20-8 27-1-4-3-23-4-27 1Z" fill="#ffffff" opacity="0.18" />

          {/* Schnauze */}
          <ellipse cx="48" cy="60" rx="16" ry="13" fill="var(--bella-muzzle)" />

          {/* Augen */}
          {pose === "found" ? (
            <>
              <circle cx="39" cy="45" r="4.4" fill="var(--bella-ink)" />
              <circle cx="57" cy="45" r="4.4" fill="var(--bella-ink)" />
              <circle cx="40.6" cy="43.4" r="1.5" fill="#fff" />
              <circle cx="58.6" cy="43.4" r="1.5" fill="#fff" />
            </>
          ) : pose === "sniff" ? (
            <>
              <path d="M35 46c2-2 6-2 8 0" stroke="var(--bella-ink)" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M53 46c2-2 6-2 8 0" stroke="var(--bella-ink)" strokeWidth="3" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <circle cx="39" cy="45" r="3.6" fill="var(--bella-ink)" />
              <circle cx="57" cy="45" r="3.6" fill="var(--bella-ink)" />
              <circle cx="40.2" cy="43.7" r="1.2" fill="#fff" />
              <circle cx="58.2" cy="43.7" r="1.2" fill="#fff" />
            </>
          )}

          {/* Brauen — der Ausdruck */}
          {pose === "hmm" && (
            <path d="M34 37c3-2 7-2 9 0" stroke="var(--bella-ink)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          )}
          {pose === "found" && (
            <>
              <path d="M33 37c3-3 8-3 11-1" stroke="var(--bella-ink)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M52 36c3-2 8-2 11 1" stroke="var(--bella-ink)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            </>
          )}

          {/* Nase */}
          <path className="bella-nose" d="M43 57h10c2 0 3 2 2 4l-5 5c-1 1-3 1-4 0l-5-5c-1-2 0-4 2-4Z" fill="var(--bella-ink)" />

          {/* Mund */}
          {pose === "found" ? (
            <path d="M40 68c3 5 13 5 16 0 0 6-5 10-8 10s-8-4-8-10Z" fill="var(--bella-ink)" />
          ) : pose === "hmm" ? (
            <path d="M44 70c2-1.5 5-1.5 7 0" stroke="var(--bella-ink)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          ) : (
            <path d="M48 66v4M42 71c3 3 9 3 12 0" stroke="var(--bella-ink)" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          )}
        </g>

        {/* Schnüffel-Duftspur */}
        {pose === "sniff" && (
          <g className="bella-scent" fill="var(--bella-accent)">
            <circle cx="70" cy="50" r="2.4" opacity="0.9" />
            <circle cx="76" cy="42" r="1.8" opacity="0.7" />
            <circle cx="72" cy="34" r="1.3" opacity="0.5" />
          </g>
        )}

        {/* „Gefunden!"-Funke */}
        {pose === "found" && (
          <path
            className="bella-spark"
            d="M76 10l3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8Z"
            fill="var(--bella-accent)"
          />
        )}

        {/* „Hm?"-Fragezeichen */}
        {pose === "hmm" && (
          <text x="74" y="24" fontSize="22" fontWeight="800" fill="var(--bella-accent)" fontFamily="ui-sans-serif, system-ui, sans-serif">
            ?
          </text>
        )}
      </svg>
    </span>
  );
}
