interface Props {
  foodCount: number;
  crossSellCount: number;
  voucherCount: number;
}

/**
 * Echte Live-Zahlen aus der DB statt Behauptungen — kein simulierter Ambient-
 * Counter wie LiveIntel auf der Startseite. Auf einer Seite, die ausdrücklich
 * "wir vs. die Branche" sagt, dürfen die eigenen Zahlen nicht weicher sein als
 * der Anspruch.
 */
export default function LiveProofTicker({ foodCount, crossSellCount, voucherCount }: Props) {
  const stats = [
    { value: foodCount.toLocaleString("de-DE"), label: "aktive Produkte, täglich aktualisiert" },
    { value: crossSellCount.toLocaleString("de-DE"), label: "Begleitprodukte, nie als Komplett-Futter getarnt" },
    { value: String(voucherCount), label: "echte Gutscheine, alle hier gelistet — nicht versteckt" },
    { value: "0 €", label: "Aufpreis für dich durch unsere Provision" },
  ];

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.06] to-transparent p-6">
      <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-4">
        ● Live — keine Behauptung, nachprüfbar
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-2xl sm:text-3xl font-black text-white leading-none mb-1.5">{s.value}</p>
            <p className="text-xs text-[var(--muted)] leading-snug">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
