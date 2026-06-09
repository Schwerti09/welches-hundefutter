"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { TipEntry, TipLevel, TipArticle } from "@/data/tips/types";
import { TIP_LEVELS } from "@/data/tips/types";

interface TipsListProps {
  tips: TipEntry[];
  accent: string;
  ctaEvery?: number; // alle N Tipps eine BELLA-CTA einstreuen
  categorySlug?: string; // für Links zu Detailseiten
  articles?: TipArticle[]; // vollständige Artikel für Detail-Links
}

const LEVEL_FILTERS: { value: TipLevel | "all"; label: string }[] = [
  { value: "all", label: "Alle" },
  { value: 0, label: TIP_LEVELS[0].label },
  { value: 1, label: TIP_LEVELS[1].label },
  { value: 2, label: TIP_LEVELS[2].label },
];

export default function TipsList({ tips, accent, ctaEvery = 25, categorySlug, articles }: TipsListProps) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<TipLevel | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tips.filter(([, title, desc, lvl, tags]) => {
      if (level !== "all" && lvl !== level) return false;
      if (!q) return true;
      return (
        title.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q) ||
        tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [tips, query, level]);

  // Map von Tip-ID zu Artikel für schnellen Lookup
  const articleMap = useMemo(() => {
    if (!articles) return new Map<number, TipArticle>();
    return new Map(articles.map((a) => [a.id, a]));
  }, [articles]);

  return (
    <div>
      {/* Filterleiste */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {LEVEL_FILTERS.map((f) => {
            const active = f.value === level;
            return (
              <button
                key={String(f.value)}
                onClick={() => setLevel(f.value)}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-xl border transition-colors"
                style={
                  active
                    ? { background: `${accent}22`, borderColor: `${accent}66`, color: accent }
                    : { borderColor: "var(--line)", color: "var(--muted)" }
                }
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tipps durchsuchen…"
          className="text-sm px-4 py-2 rounded-xl bg-white/5 border border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--honey)] sm:w-64"
        />
      </div>

      <p className="text-xs text-[var(--muted)] mb-6">
        {filtered.length} {filtered.length === 1 ? "Tipp" : "Tipps"}
        {(query || level !== "all") && ` (von ${tips.length})`}
      </p>

      {/* Tipp-Liste */}
      <ol className="space-y-4">
        {filtered.map((tip, idx) => {
          const [num, title, desc, lvl, tags] = tip;
          const lvlInfo = TIP_LEVELS[lvl];
          const article = articleMap.get(num);
          const hasDetailPage = article && categorySlug;

          return (
            <li key={num}>
              {hasDetailPage ? (
                <Link
                  href={`/tipps/${categorySlug}/${article.slug}`}
                  className="card card-hover p-5 sm:p-6 relative overflow-hidden block"
                >
                  <span
                    className="absolute -right-4 -top-8 text-[8rem] font-black leading-none opacity-[0.06] select-none pointer-events-none tabular-nums"
                    style={{ color: accent }}
                    aria-hidden
                  >
                    {num}
                  </span>
                  <div className="relative flex gap-4">
                    <span
                      className="shrink-0 text-sm font-black tabular-nums w-9 h-9 rounded-xl grid place-items-center"
                      style={{ background: `${accent}1f`, color: accent }}
                    >
                      {num}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold tracking-tight">{title}</h3>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: `${lvlInfo.color}1f`, color: lvlInfo.color }}
                        >
                          {lvlInfo.label}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--honey)]/20 text-[var(--honey)]">
                          Vollständiger Artikel →
                        </span>
                      </div>
                      <p className="text-[var(--muted)] text-sm leading-relaxed">{desc}</p>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {tags.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[var(--muted)]"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ) : (
                <article className="card p-5 sm:p-6 relative overflow-hidden">
                  <span
                    className="absolute -right-4 -top-8 text-[8rem] font-black leading-none opacity-[0.06] select-none pointer-events-none tabular-nums"
                    style={{ color: accent }}
                    aria-hidden
                  >
                    {num}
                  </span>
                  <div className="relative flex gap-4">
                    <span
                      className="shrink-0 text-sm font-black tabular-nums w-9 h-9 rounded-xl grid place-items-center"
                      style={{ background: `${accent}1f`, color: accent }}
                    >
                      {num}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold tracking-tight">{title}</h3>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: `${lvlInfo.color}1f`, color: lvlInfo.color }}
                        >
                          {lvlInfo.label}
                        </span>
                      </div>
                      <p className="text-[var(--muted)] text-sm leading-relaxed">{desc}</p>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {tags.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[var(--muted)]"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              )}

              {/* BELLA-CTA in regelmäßigen Abständen */}
              {ctaEvery > 0 && (idx + 1) % ctaEvery === 0 && idx + 1 < filtered.length && (
                <div className="my-4">
                  <Link
                    href="/#bella-advisor"
                    className="card card-hover p-5 flex items-center gap-4 block"
                    style={{ borderColor: `${accent}33` }}
                  >
                    <span className="text-3xl">🐕</span>
                    <div>
                      <p className="font-semibold text-sm">Frag BELLA zu deinem Hund</p>
                      <p className="text-[var(--muted)] text-xs">
                        Persönliche Futter-Empfehlung aus 8.000+ Sorten — in 60 Sekunden, kostenlos.
                      </p>
                    </div>
                    <span className="ml-auto text-xs font-semibold shrink-0" style={{ color: accent }}>
                      Los →
                    </span>
                  </Link>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {filtered.length === 0 && (
        <div className="card p-8 text-center text-[var(--muted)]">
          Keine Tipps gefunden. Versuch einen anderen Suchbegriff oder Filter.
        </div>
      )}
    </div>
  );
}
