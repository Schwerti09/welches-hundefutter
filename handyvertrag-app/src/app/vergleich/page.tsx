import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Hundefutter Vergleich 2026: Futtertypen im Direktvergleich | BELLA",
  description: "Trockenfutter vs. Nassfutter, BARF vs. Fertigfutter — alle Vergleiche auf Basis echter Daten aus 8.442 Produkten. Ohne Hersteller-Bias.",
  alternates: { canonical: "https://welches-hundefutter.today/vergleich" },
};

const vergleiche = [
  {
    slug: "trockenfutter-vs-nassfutter",
    title: "Trockenfutter vs. Nassfutter",
    description: "Kosten, Nährwerte, Zahngesundheit und Sättigungseffekt im Direktvergleich.",
    emoji: "⚖️",
  },
  {
    slug: "barf-vs-trockenfutter",
    title: "BARF vs. Trockenfutter",
    description: "Rohfütterung gegen Fertigfutter: Aufwand, Kosten, Risiken und Nutzen ehrlich gegenübergestellt.",
    emoji: "🥩",
  },
];

export default function VergleichIndexPage() {
  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <nav className="max-w-5xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">Vergleiche</span>
      </nav>

      <section className="hero-glow max-w-5xl mx-auto w-full px-5 pt-8 pb-14">
        <span className="pill mb-4">⚖️ Direktvergleiche</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Hundefutter im Vergleich
        </h1>
        <p className="text-[var(--muted)] leading-relaxed max-w-2xl">
          Datenbasierte Vergleiche ohne Herstellermeinungen — auf Basis von 8.442 echten Produkten aus unserem Katalog.
        </p>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-16">
        <div className="grid sm:grid-cols-2 gap-4">
          {vergleiche.map((v) => (
            <Link key={v.slug} href={`/vergleich/${v.slug}`}
              className="card card-hover p-6 block">
              <div className="text-3xl mb-3">{v.emoji}</div>
              <h2 className="text-lg font-extrabold tracking-tight mb-2">{v.title}</h2>
              <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">{v.description}</p>
              <span className="text-xs text-[var(--honey)] font-semibold">Vergleich lesen →</span>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
