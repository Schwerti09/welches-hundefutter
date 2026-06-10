"use client";

import { useState } from "react";

interface TipArticleImageProps {
  src: string;
  alt: string;
  accent: string;
  icon: string;
  /** Artikel-Nummer für das generative Hero-Watermark */
  number?: number;
  /** Kategorie-Label, z. B. "Gesundheit" */
  category?: string;
}

/**
 * Artikel-Hauptbild mit premium generativem Fallback.
 * Existiert eine echte Bilddatei, wird sie gezeigt. Fehlt sie (onError) oder
 * ist kein Pfad gesetzt, rendert ein hochwertiges, deterministisches Hero-Visual
 * (Mesh-Gradient + Dot-Grid + Icon + Nummer) im Kategorie-Akzent — kein kaputtes <img>.
 */
export default function TipArticleImage({ src, alt, accent, icon, number, category }: TipArticleImageProps) {
  const [failed, setFailed] = useState(false);
  const showFallback = failed || !src;

  if (showFallback) {
    return (
      <div
        className="relative w-full aspect-[1200/630] overflow-hidden grid place-items-center"
        style={{
          background: `radial-gradient(120% 140% at 15% 10%, ${accent}40, transparent 55%), radial-gradient(120% 120% at 90% 90%, ${accent}26, transparent 50%), linear-gradient(135deg, #0e0e16, #08080c)`,
        }}
        role="img"
        aria-label={alt}
      >
        {/* Dot-Grid-Pattern */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(${accent}55 1px, transparent 1px)`,
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(circle at 50% 50%, black, transparent 78%)",
            WebkitMaskImage: "radial-gradient(circle at 50% 50%, black, transparent 78%)",
          }}
          aria-hidden
        />
        {/* Riesige Nummer als Wasserzeichen */}
        {number != null && (
          <span
            className="absolute -right-2 -bottom-10 font-black leading-none select-none tabular-nums opacity-[0.10]"
            style={{ color: accent, fontSize: "clamp(10rem, 30vw, 22rem)" }}
            aria-hidden
          >
            {number}
          </span>
        )}
        {/* Zentrales Icon + Label */}
        <div className="relative z-10 flex flex-col items-center gap-3 text-center px-6">
          <span
            className="grid place-items-center rounded-3xl border backdrop-blur-sm"
            style={{
              width: "clamp(76px, 13vw, 120px)",
              height: "clamp(76px, 13vw, 120px)",
              background: `${accent}1a`,
              borderColor: `${accent}40`,
              fontSize: "clamp(2.6rem, 7vw, 4rem)",
            }}
          >
            {icon}
          </span>
          {category && (
            <span
              className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em]"
              style={{ color: accent }}
            >
              {category}
            </span>
          )}
        </div>
        {/* Sheen-Linie oben */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}80, transparent)` }}
          aria-hidden
        />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="w-full h-auto object-cover"
      loading="eager"
      onError={() => setFailed(true)}
    />
  );
}
