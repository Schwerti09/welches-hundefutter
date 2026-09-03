"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import breeds from "@/data/breed-gallery.json";

type BreedEntry = {
  slug: string;
  name: string;
  /** Externe URL (images.dog.ceo) — Fallback wenn localImg noch nicht vorhanden */
  img: string;
  /** Lokaler Pfad (public/breeds/[slug].jpg) — bevorzugt nach npm run download-breed-images */
  localImg?: string;
  dogCeoBreed?: string;
};

/** Gibt die beste verfügbare Bild-URL zurück: lokal > dog.ceo */
function getImageSrc(b: BreedEntry): string {
  return b.localImg ?? b.img;
}

/**
 * "Finde deinen Hund" — Galerie mit echten Rasse-Fotos.
 * Bilder werden bevorzugt lokal aus public/breeds/ geladen (kein externer Dienst),
 * bei fehlendem lokalem Bild als Fallback von images.dog.ceo.
 */
export default function BreedGallery() {
  const [q, setQ] = useState("");
  // Zwei-stufiger Fallback: local → dog.ceo → Emoji
  const [triedLocal, setTriedLocal] = useState<Record<string, boolean>>({});
  const [broken, setBroken] = useState<Record<string, boolean>>({});

  const list = (breeds as BreedEntry[]).filter((b) =>
    b.name.toLowerCase().includes(q.toLowerCase().trim()),
  );

  function handleError(b: BreedEntry) {
    if (!triedLocal[b.slug] && b.localImg) {
      // Lokales Bild fehlgeschlagen → dog.ceo versuchen
      setTriedLocal((prev) => ({ ...prev, [b.slug]: true }));
    } else {
      // Auch dog.ceo fehlgeschlagen → Emoji-Fallback
      setBroken((prev) => ({ ...prev, [b.slug]: true }));
    }
  }

  function currentSrc(b: BreedEntry): string {
    if (triedLocal[b.slug]) return b.img; // dog.ceo Fallback
    return getImageSrc(b);
  }

  return (
    <section className="relative max-w-6xl mx-auto px-5 py-20 w-full">
      <div className="text-center mb-3">
        <span className="pill mb-5">🐾 Finde deinen Hund</span>
      </div>
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center mb-3">
        Welche Rasse ist <span className="text-accent">dein Hund</span>?
      </h2>
      <p className="text-[var(--muted)] text-center max-w-2xl mx-auto mb-9">
        Klick deine Rasse an — BELLA kennt die typischen Bedürfnisse von Welpe bis Senior und
        empfiehlt sofort das passende Futter. Mischling? Auch dabei.
      </p>

      <div className="max-w-md mx-auto mb-10">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rasse suchen… z. B. Labrador, Mops, Schäferhund"
          className="w-full px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(240,167,60,0.5)] focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {list.map((b) => (
          <Link
            key={b.slug}
            href={`/rasse/${b.slug}`}
            className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 hover:border-[rgba(240,167,60,0.5)] transition-all block focus:outline-none focus:ring-2 focus:ring-[rgba(240,167,60,0.5)]"
          >
            {broken[b.slug] ? (
              <div
                role="img"
                aria-label={b.name}
                className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-amber-500/10 to-orange-500/5"
              >
                🐕
              </div>
            ) : (
              <Image
                src={currentSrc(b)}
                alt={b.name}
                fill
                quality={65}
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 17vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                onError={() => handleError(b)}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3 text-left">
              <p className="text-white font-semibold text-sm leading-tight drop-shadow">{b.name}</p>
              <p className="text-[var(--honey)] text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0">
                Futter finden →
              </p>
            </div>
          </Link>
        ))}
      </div>

      {list.length === 0 && (
        <p className="text-center text-[var(--muted)] mt-8">
          „{q}" ist nicht in der Galerie — frag BELLA einfach direkt oben im Chat. Sie kennt alle Rassen.
        </p>
      )}
    </section>
  );
}
