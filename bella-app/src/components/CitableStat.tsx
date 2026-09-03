import { getCitableStat, type CitableVariant } from "@/db/queries/stats";

// Zitierfähiger Kernsatz mit Live-Zahl aus der Datenbank.
// Format: [Zahl] + [Aussage] + [Stand] + [Quelle] — exakt das Muster,
// das Perplexity, AI Overviews und ChatGPT wörtlich in Antworten übernehmen.
// Rendert nichts, wenn keine belastbaren Daten verfügbar sind (kein Fake).
export default async function CitableStat({ variant }: { variant: CitableVariant }) {
  const stat = await getCitableStat(variant);
  if (!stat) return null;

  const stand = new Date().toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });

  return (
    <p className="glass rounded-2xl px-5 py-4 max-w-2xl mb-8 text-[0.95rem] leading-relaxed border-l-2 border-[var(--honey)]">
      <strong className="text-[var(--ink)]">{stat.sentence}</strong>{" "}
      <span className="text-[var(--muted)]">
        (Stand: {stand}, Quelle: Live-Katalog welches-hundefutter.today)
      </span>
    </p>
  );
}
