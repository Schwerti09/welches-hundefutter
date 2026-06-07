import type { Metadata } from "next";
import Link from "next/link";
import { TIP_CATEGORIES, TOTAL_TIPS } from "@/data/tips";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: `${TOTAL_TIPS} Hunde-Tipps von BELLA – Ernährung, Gesundheit, Pflege & Training`,
  description: `Über ${TOTAL_TIPS} praktische Hunde-Tipps in ${TIP_CATEGORIES.length} Kategorien: Ernährung, Abnehmen, Gesundheit, Welpen, Senioren, Allergien, Zähne, BARF, Verdauung und mehr. Fundiert, alltagstauglich und kostenlos.`,
  alternates: { canonical: "https://welches-hundefutter.today/tipps" },
  openGraph: {
    title: `${TOTAL_TIPS} Hunde-Tipps von BELLA`,
    description: `Praktische Tipps rund um Ernährung, Gesundheit und Pflege deines Hundes — in ${TIP_CATEGORIES.length} Kategorien.`,
    url: "https://welches-hundefutter.today/tipps",
    type: "website",
  },
};

export default function TippsOverviewPage() {
  // ItemList-Schema für gute Maschinen- & KI-Lesbarkeit
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${TOTAL_TIPS} Hunde-Tipps von BELLA`,
    description: `Ratgeber-Sammlung mit ${TOTAL_TIPS} Tipps rund um Hundeernährung, Gesundheit und Pflege.`,
    numberOfItems: TIP_CATEGORIES.length,
    itemListElement: TIP_CATEGORIES.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.headline,
      url: `https://welches-hundefutter.today/tipps/${c.slug}`,
    })),
  };

  const breadcrumbs = [
    { name: "Start", url: "https://welches-hundefutter.today/" },
    { name: "Tipps", url: "https://welches-hundefutter.today/tipps" },
  ];

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <StructuredData type="breadcrumb" breadcrumbs={breadcrumbs} />

      <nav className="max-w-6xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">Tipps</span>
      </nav>

      {/* HERO */}
      <section className="hero-glow max-w-6xl mx-auto w-full px-5 pt-8 pb-12">
        <span className="pill mb-4">🐕 {TOTAL_TIPS.toLocaleString("de-DE")} Tipps · {TIP_CATEGORIES.length} Kategorien</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
          {TOTAL_TIPS.toLocaleString("de-DE")} Hunde-Tipps für ein langes, gesundes Hundeleben
        </h1>
        <p className="text-[var(--muted)] leading-relaxed max-w-2xl mb-8">
          Praktisches Wissen rund um Ernährung, Gesundheit, Pflege und Training — gebündelt von BELLA,
          deiner KI-Ernährungsberaterin. Jede Kategorie enthält 100 sorgfältig ausgewählte Tipps für
          Einsteiger, Fortgeschrittene und Profis.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link href="/#bella-advisor" className="btn-primary">BELLA persönlich fragen →</Link>
        </div>
      </section>

      {/* KATEGORIEN-GRID */}
      <section className="max-w-6xl mx-auto w-full px-5 pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TIP_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/tipps/${c.slug}`}
              className="card card-hover p-6 block relative overflow-hidden group"
              style={{ borderColor: `${c.accent}33` }}
            >
              <span
                className="absolute -right-3 -top-6 text-[7rem] font-black leading-none opacity-[0.07] select-none pointer-events-none"
                style={{ color: c.accent }}
                aria-hidden
              >
                {c.icon}
              </span>
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{c.icon}</span>
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: `${c.accent}22`, color: c.accent }}
                  >
                    100 Tipps
                  </span>
                </div>
                <h2 className="text-lg font-bold tracking-tight mb-1.5 group-hover:text-[var(--honey)] transition-colors">
                  {c.title}
                </h2>
                <p className="text-[var(--muted)] text-sm leading-relaxed line-clamp-3">{c.description}</p>
                <span className="inline-block mt-4 text-xs font-semibold" style={{ color: c.accent }}>
                  Alle 100 Tipps ansehen →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto w-full px-5 pb-16">
        <div className="rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 p-8 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">
            Du suchst das passende Futter statt allgemeiner Tipps?
          </h2>
          <p className="text-[var(--muted)] mb-6 max-w-xl mx-auto">
            BELLA fragt nach Rasse, Alter, Gewicht und Gesundheit und empfiehlt in 60 Sekunden
            die optimale Sorte aus über 8.000 Produkten — kostenlos.
          </p>
          <Link href="/#bella-advisor" className="btn-primary">🐕 BELLA fragen — Profil + Empfehlung →</Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
