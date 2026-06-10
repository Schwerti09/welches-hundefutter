"use client";

import { useState } from "react";

interface TipArticleImageProps {
  src: string;
  alt: string;
  accent: string;
  icon: string;
}

// Zeigt das Artikel-Hauptbild. Fehlt die Datei (noch keine echten Bilder hochgeladen),
// wird ein ansprechender Kategorie-Gradient mit Icon als Fallback gerendert — kein kaputtes <img>.
export default function TipArticleImage({ src, alt, accent, icon }: TipArticleImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className="w-full aspect-[1200/630] grid place-items-center"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${accent}33, transparent 60%), linear-gradient(135deg, ${accent}22, #0d0d14)`,
        }}
        role="img"
        aria-label={alt}
      >
        <span className="text-7xl sm:text-8xl opacity-80 select-none" aria-hidden>
          {icon}
        </span>
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
