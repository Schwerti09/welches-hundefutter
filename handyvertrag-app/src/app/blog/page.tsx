import type { Metadata } from "next";
import Link from "next/link";
import { blogArticles } from "@/data/blogArticles";

export const metadata: Metadata = {
  title: "Blog & Marktdaten: Hundefutter 2026 | BELLA",
  description:
    "Live-Marktberichte aus 11.065 Produkten + Ratgeber zu Hundefutter, Ernährung und Allergien. Was andere schätzen, messen wir.",
  alternates: {
    canonical: "https://welches-hundefutter.today/blog",
    languages: {
      "de-DE": "https://welches-hundefutter.today/blog",
      "de-AT": "https://welches-hundefutter.today/blog",
      "de-CH": "https://welches-hundefutter.today/blog",
      "x-default": "https://welches-hundefutter.today/blog",
    },
  },
};

const BELLA_INTELLIGENCE = [
  {
    slug: "preisbarometer-2026",
    title: "Hundefutter-Preisbarometer 2026: Was Futter wirklich kostet",
    description:
      "Live-Preisindex aus 11.065 Produkten nach Typ — Trockenfutter, BARF, Nass, Kaltgepresst. Täglich aktualisiert, keine Schätzungen.",
    emoji: "💰",
    tag: "Täglich live",
    tagColor: "bg-emerald-500/15 text-emerald-400",
  },
  {
    slug: "marken-ranking-bella-score",
    title: "Welche Hundefutter-Marke ist wirklich gut? BELLA Score Ranking 2026",
    description:
      "Wir haben über 11.000 Produkte mit 4 echten Qualitätskriterien bewertet. Das sind die Top-Marken — nach Daten, nicht Werbebudget.",
    emoji: "🏆",
    tag: "Täglich live",
    tagColor: "bg-emerald-500/15 text-emerald-400",
  },
  {
    slug: "marktbericht-hundefutter-2026",
    title: "Hundefutter Marktbericht 2026: Preise, Marken, Trends — Live-Daten",
    description:
      "Vollständiger Live-Marktbericht: Produktverteilung, Qualitätssegmente, beste Preis-Leistungs-Produkte heute — aus dem echten Katalog.",
    emoji: "📊",
    tag: "Täglich live",
    tagColor: "bg-emerald-500/15 text-emerald-400",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-5 pt-8">
        <nav className="text-sm text-[var(--muted)] mb-8">
          <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
          <span className="mx-2">·</span>
          <span className="text-[var(--ink)]">Blog</span>
        </nav>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Blog & Marktdaten
        </h1>
        <p className="text-[var(--muted)] leading-relaxed max-w-2xl mb-12">
          Was andere schätzen — wir messen. Live-Berichte aus 11.065 Produkten,
          täglich aktualisiert. Plus Ratgeber ohne Hersteller-Bias.
        </p>

        {/* BELLA Intelligence — featured section */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">BELLA Intelligence</span>
            </div>
            <span className="text-xs text-[var(--muted)]">Live-Daten, täglich neu gerendert</span>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-3">
            {BELLA_INTELLIGENCE.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="card p-5 hover:border-[rgba(240,167,60,0.4)] transition-all group flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{a.emoji}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${a.tagColor}`}>
                    {a.tag}
                  </span>
                </div>
                <h2 className="text-sm font-extrabold text-white leading-snug mb-2 flex-1">
                  {a.title}
                </h2>
                <p className="text-xs text-[var(--muted)] leading-relaxed mb-3">{a.description}</p>
                <span className="text-xs text-[var(--honey)] font-semibold group-hover:underline mt-auto">
                  Report lesen →
                </span>
              </Link>
            ))}
          </div>
          <p className="text-[11px] text-[var(--muted)]">
            Diese Reports laufen als Next.js Server Components direkt gegen die BELLA-Datenbank.
            Kein redaktioneller Aufwand, keine veralteten Zahlen — nur Live-Daten.
          </p>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 border-t border-white/10" />
          <span className="text-xs text-[var(--muted)] font-semibold uppercase tracking-widest">Ratgeber & Analyse</span>
          <div className="flex-1 border-t border-white/10" />
        </div>

        {/* Regular blog articles */}
        <div className="grid gap-4 mb-14">
          {blogArticles.map((article) => (
            <article
              key={article.slug}
              className="card overflow-hidden hover:border-[rgba(240,167,60,0.3)] transition-colors"
            >
              {article.imageUrl && (
                <Link href={`/blog/${article.slug}`}>
                  <div className="relative h-44 sm:h-52 overflow-hidden">
                    <img
                      src={article.imageUrl}
                      alt={article.imageAlt ?? article.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08080c]/80 via-transparent to-transparent" />
                    <span className="absolute bottom-3 right-3 text-xs bg-black/60 text-white/70 px-2 py-0.5 rounded-full">
                      {article.readingTime} Min.
                    </span>
                  </div>
                </Link>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-[var(--muted)] mb-2">
                  <span>
                    Von{" "}
                    <Link href="/ueber-uns" className="text-[var(--honey)] hover:underline">
                      R. Schwertfechter
                    </Link>
                  </span>
                  <span>·</span>
                  <time dateTime={article.updatedAt}>
                    {new Date(article.updatedAt).toLocaleDateString("de-DE", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </time>
                  {!article.imageUrl && <><span>·</span><span>{article.readingTime} Min.</span></>}
                </div>
                <h2 className="text-base font-semibold text-white mb-2 leading-snug">
                  <Link href={`/blog/${article.slug}`} className="hover:text-[var(--honey)] transition-colors">
                    {article.title}
                  </Link>
                </h2>
                <p className="text-[var(--muted)] text-sm leading-relaxed mb-3">{article.description}</p>
                <Link href={`/blog/${article.slug}`} className="text-[var(--honey)] text-sm font-medium hover:underline">
                  Artikel lesen →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 p-7 text-center mb-12">
          <p className="font-extrabold text-lg text-white mb-2">BELLA beantwortet deine Frage sofort</p>
          <p className="text-[var(--muted)] text-sm mb-4">Kein Lesen nötig — einfach erzählen, welchen Hund du hast.</p>
          <Link
            href="/#bella-advisor"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-orange-500/30 transition-all"
          >
            🐕 Futter finden
          </Link>
        </div>
      </div>
    </div>
  );
}
