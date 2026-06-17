"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface Props {
  topics: string[];
  topicLabels: Record<string, string>;
  activeThema?: string;
  activeStimmung?: string;
}

const SENTIMENTS = [
  { value: "positiv", label: "✓ Positiv", cls: "border-emerald-500/40 text-emerald-300 data-[active=true]:bg-emerald-500/20" },
  { value: "gemischt", label: "◑ Gemischt", cls: "border-amber-500/40 text-amber-300 data-[active=true]:bg-amber-500/20" },
  { value: "negativ", label: "✗ Kritisch", cls: "border-red-500/40 text-red-300 data-[active=true]:bg-red-500/20" },
];

export default function MeinungenFilter({ topics, topicLabels, activeThema, activeStimmung }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || params.get(key) === value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const clearAll = () => router.push(pathname, { scroll: false });
  const hasFilter = activeThema || activeStimmung;

  return (
    <div className="flex flex-col gap-3">
      {/* Stimmungs-Filter */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-white/40 shrink-0">Stimmung:</span>
        {SENTIMENTS.map((s) => (
          <button
            key={s.value}
            onClick={() => updateFilter("stimmung", s.value)}
            data-active={activeStimmung === s.value}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${s.cls} ${
              activeStimmung === s.value ? "opacity-100" : "opacity-50 hover:opacity-80"
            } border`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Themen-Filter */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-white/40 shrink-0">Thema:</span>
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => updateFilter("thema", t)}
            data-active={activeThema === t}
            className={`text-xs px-3 py-1.5 rounded-full border border-white/15 transition-colors ${
              activeThema === t
                ? "bg-white/15 text-white"
                : "text-white/50 hover:text-white/80 hover:bg-white/8"
            }`}
          >
            {topicLabels[t] ?? t}
          </button>
        ))}
        {hasFilter && (
          <button
            onClick={clearAll}
            className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/30 hover:text-white/60 transition-colors"
          >
            × Filter löschen
          </button>
        )}
      </div>
    </div>
  );
}
