"use client";

import { useState } from "react";
import Link from "next/link";
import breeds from "@/data/breed-gallery.json";

/**
 * "Finde deinen Hund" — Galerie mit echten Rasse-Fotos. Klick auf eine Rasse
 * startet BELLA mit genau dieser Rasse (CustomEvent → BellaAdvisor hört zu)
 * und scrollt nach oben zum Berater.
 */
export default function BreedGallery() {
  const [q, setQ] = useState("");
  const list = breeds.filter((b) => b.name.toLowerCase().includes(q.toLowerCase().trim()));

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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={b.img}
              alt={b.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
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
