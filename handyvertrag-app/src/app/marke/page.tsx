import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";
import { getBrandsWithCounts } from "@/db/queries/foods";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Hundefutter-Marken im Vergleich 2026 — alle Marken mit BELLA-Score",
  description:
    "Alle Hundefutter-Marken im BELLA-Score-Vergleich: Produktanzahl, Durchschnittsscore und Preise ab €/kg. Finde die beste Marke für deinen Hund.",
  alternates: {
    canonical: "https://welches-hundefutter.today/marke",
    languages: {
      "de-DE": "https://welches-hundefutter.today/marke",
      "de-AT": "https://welches-hundefutter.today/marke",
      "de-CH": "https://welches-hundefutter.today/marke",
      "x-default": "https://welches-hundefutter.today/marke",
    },
  },
};

export default async function MarkenIndexPage() {
  const brands = await getBrandsWithCounts(3);

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: "Start", url: "https://welches-hundefutter.today/" },
          { name: "Marken", url: "https://welches-hundefutter.today/marke" },
        ]}
      />

      <nav className="max-w-5xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">Marken</span>
      </nav>

      <section className="hero-glow max-w-5xl mx-auto w-full px-5 pt-8 pb-14">
        <span className="pill mb-4">🏷️ Marken-Vergleich</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Hundefutter-Marken im Vergleich
        </h1>
        <p className="bella-answer text-lg sm:text-xl font-semibold text-[var(--ink)] leading-snug max-w-2xl mb-4">
          {brands.length} Marken mit je mindestens 3 Sorten im BELLA-Katalog —
          sortiert nach Produktanzahl, täglich aktualisiert.
        </p>
        <p className="text-[var(--muted)] text-sm max-w-2xl">
          BELLA bewertet jede Sorte unabhängig nach Fleischanteil, Deklarationsqualität
          und Zusammensetzung. Klick auf eine Marke für alle Sorten im Preisvergleich.
        </p>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 py-6 mb-16">
        {brands.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {brands.map((b) => (
              <Link
                key={b.slug}
                href={`/marke/${b.slug}`}
                className="card card-hover p-5 block"
              >
                <p className="font-bold text-base leading-tight mb-1">{b.brand}</p>
                <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(240,167,60,0.14)] text-[#ffcd8a]">
                    {b.count} Sorten
                  </span>
                  {b.avgScore != null && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      b.avgScore >= 75
                        ? "bg-emerald-500/15 text-emerald-300"
                        : b.avgScore >= 55
                        ? "bg-amber-500/15 text-amber-300"
                        : "bg-white/5 text-white/40"
                    }`}>
                      Ø {b.avgScore}/100
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted)]">
                    {b.minPricePerKg != null
                      ? `ab ${b.minPricePerKg.toFixed(2)} €/kg`
                      : ""}
                  </span>
                  <span className="text-xs text-[var(--honey)] font-semibold">Vergleich →</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center text-[var(--muted)]">
            Marken werden geladen…
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
