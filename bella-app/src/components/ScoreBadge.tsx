interface Props {
  score: number;
  showLabel?: boolean;
}

export default function ScoreBadge({ score, showLabel = false }: Props) {
  const tier = score >= 75 ? "premium" : score >= 55 ? "gut" : "basis";
  const color = tier === "premium"
    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
    : tier === "gut"
    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
    : "bg-white/8 text-white/40 border-white/10";

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-semibold ${color}`}
      title={`BELLA-Score ${score}/100 · Berechnet aus: Proteinquelle (18 Pkt), Getreidefrei (12), Hypoallergen (10), Preis-Qualität (15), Futtertyp (8). Methodik: /analyse/methodik`}
    >
      {tier === "premium" ? "★" : tier === "gut" ? "◆" : "·"} {score}
      {showLabel && <span className="font-normal opacity-70">/100</span>}
    </span>
  );
}
