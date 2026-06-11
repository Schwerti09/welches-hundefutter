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
          {" "}· Geprüft{" "}
          <time dateTime={reviewedAt}>{date}</time>
          {" "}·{" "}
          <Link href="/quellen" className="text-[var(--honey)] hover:underline">Quellen</Link>
        </span>
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto w-full px-5 pb-12">
      <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-6">
        <div className="flex items-start gap-5 mb-5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-sm font-black text-white shrink-0">
            RS
          </div>
          <div className="min-w-0">
            <Link href="/ueber-uns" className="font-bold text-sm hover:text-[var(--honey)] transition-colors">
              Rolf Schwertfechter
            </Link>
            <p className="text-xs text-[var(--honey)] mb-1">Hundefutter-Experte & BELLA-Gründer</p>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Rolf Schwertfechter betreibt BELLA seit 2024 und hat den BELLA-Score entwickelt, der
              11.000+ Hundefutter-Sorten nach Proteinquelle, Deklaration und Preis-Leistung bewertet.
              Er analysiert täglich Preisdaten aus dem AWIN-Feed, wertet aktuelle Studien aus und
              schreibt alle Ratgeber auf dieser Seite.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mb-5">
          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3 text-center">
            <p className="text-lg font-black text-white">11.000+</p>
            <p className="text-[10px] text-[var(--muted)]">analysierte Futtersorten</p>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3 text-center">
            <p className="text-lg font-black text-white">2+ J.</p>
            <p className="text-[10px] text-[var(--muted)]">Erfahrung mit Tiernahrung & KI</p>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3 text-center">
            <p className="text-lg font-black text-white">16+</p>
            <p className="text-[10px] text-[var(--muted)]">peer-reviewed Quellen</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-[10px]">
          <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[var(--muted)]">
            Letzte Prüfung: <time dateTime={reviewedAt}>{date}</time>
          </span>
          <Link
            href="/quellen"
            className="px-2 py-1 rounded-lg bg-orange-500/10 border border-orange-500/25 text-orange-300 hover:bg-orange-500/20 transition-colors"
          >
            Studien & Quellen →
          </Link>
          <Link
            href="/analyse/methodik"
            className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[var(--muted)] hover:text-white transition-colors"
          >
            Score-Methodik →
          </Link>
          <Link
            href="/ueber-uns"
            className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[var(--muted)] hover:text-white transition-colors"
          >
            Über den Autor →
          </Link>
        </div>
      </div>
    </section>
  );
}
