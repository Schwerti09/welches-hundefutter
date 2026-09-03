"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src?: string | null;
  alt: string;
  /** Tailwind-Klassen für <Image> bzw. den Emoji-Fallback-Container */
  className?: string;
  /** aspect-ratio / Größenklassen für den Wrapper (fill-Modus) */
  wrapperClassName?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
};

/**
 * Rasse-Foto mit robustem Fallback.
 * - lädt lokal aus /public/breeds (self-hosted) via next/image → AVIF/WebP, lazy, kein CLS
 * - schlägt das Bild fehl (fehlende Datei, toter Fremd-Host), erscheint ein
 *   ruhiger Emoji-Platzhalter statt eines kaputten Bild-Icons + Konsolenfehlers-Kaskade
 */
export default function BreedImg({
  src,
  alt,
  className = "object-cover",
  wrapperClassName = "",
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px",
  priority = false,
  quality = 68,
}: Props) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-amber-500/10 to-orange-500/5 text-4xl ${wrapperClassName} ${className}`}
      >
        🐕
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      <Image
        src={src}
        alt={alt}
        fill
        quality={quality}
        sizes={sizes}
        priority={priority}
        className={className}
        onError={() => setBroken(true)}
      />
    </div>
  );
}
