import Link from "next/link";

interface AuthorBoxProps {
  reviewedAt?: string;
  compact?: boolean;
}

export default function AuthorBox({ reviewedAt = "2026-06-01", compact = false }: AuthorBoxProps) {
  const date = new Date(reviewedAt).toLocaleDateString("de-DE", {
    day: "numeric", month: "long", year: "numeric",
  });

  if (compact) {
    return (
      <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-[10px] font-black text-white shrink-0">RS</div>
        <span>
          Von{" "}
          <Link href="/ueber-uns" className="text-[var(--honey)] hover:underline">Rolf Schwertfechter</Link>
          {" "}· Geprüft {date}
        </span>
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto w-full px-5 pb-12">
      <div className="flex items-start gap-5 p-6 rounded-2xl bg-white/[0.04] border border-white/10">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-sm font-black text-white shrink-0">
          RS
        </div>
        <div className="min-w-0">
          <Link href="/ueber-uns" className="font-bold text-sm hover:text-[var(--honey)] transition-colors">
            Rolf Schwertfechter
          </Link>
          <p className="text-xs text-[var(--honey)] mb-2">Hundefutter-Experte &amp; BELLA-Gründer</p>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Rolf Schwertfechter betreibt BELLA seit 2024 und hat den BELLA-Score entwickelt, der
            8.442 Hundefutter-Sorten nach Proteinquelle, Deklaration und Preis-Leistung bewertet.
            Er analysiert täglich aktuelle Preisdaten aus dem AWIN-Feed und schreibt alle
            Ratgeber auf dieser Seite.
          </p>
          <p className="text-[10px] text-[var(--muted)] mt-2">
            Zuletzt geprüft:{" "}
            <time dateTime={reviewedAt}>{date}</time>
          </p>
        </div>
      </div>
    </section>
  );
}
