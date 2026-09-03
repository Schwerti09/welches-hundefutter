"use client";

import { parsePackKg, packReachWeeks, fmtKg } from "@/lib/pack-reach";

// Schicht 1 (Klick-Moment): kein Overlay auf der Shop-Seite (technisch unmöglich),
// sondern der letzte überzeugende Hinweis VOR dem Klick — auf eigenem Grund, reibungsfrei.
// Zeigt, wie lange die empfohlene Packung für genau diesen Hund reicht.

export default function ShopReach({
  name,
  pricePerKg,
  monthlyPrice,
  dailyGrams,
}: {
  name?: string;
  pricePerKg?: number | null;
  monthlyPrice?: number | null;
  dailyGrams?: number | null;
}) {
  const packKg = parsePackKg(name);
  if (!packKg) return null;

  const weeks = packReachWeeks({ packKg, dailyGrams, pricePerKg, monthlyPrice });

  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/10 px-3 py-2.5 text-xs text-white/70 flex items-start gap-2">
      <span aria-hidden>📦</span>
      <span className="leading-snug">
        Diese <strong className="text-white">{fmtKg(packKg)}-Packung</strong>
        {weeks ? (
          <> reicht für deinen Hund <strong className="text-[var(--honey)]">ca. {weeks} {weeks === 1 ? "Woche" : "Wochen"}</strong></>
        ) : null}
        . Im Shop kurz prüfen, ob die Größe passt.
      </span>
    </div>
  );
}
