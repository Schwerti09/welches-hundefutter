import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TIP_CATEGORIES, TIP_CATEGORY_BY_SLUG } from "@/data/tips";
import TipsList from "@/components/TipsList";
import StructuredData from "@/components/StructuredData";
import AuthorBox from "@/components/AuthorBox";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 86400;

export function generateStaticParams() {
  return TIP_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = TIP_CATEGORY_BY_SLUG[slug];
  if (!c) return {};
  return {
    title: `${c.headline} | BELLA`,
    description: c.description,
    alternates: { canonical: `https://welches-hundefutter.today/tipps/${c.slug}` },
    openGraph: {
      title: c.headline,
      description: c.description,
      url: `https://welches-hundefutter.today/tipps/${c.slug}`,
      type: "article",
    },
  };
}

export default async function TippsCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = TIP_CATEGORY_BY_SLUG[slug];
  if (!c) notFound();

  // ItemList mit allen 100 Tipps — maschinen- und KI-lesbar für Zitierung
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: c.headline,
    description: c.description,
    numberOfItems: c.tips.length,
    itemListElement: c.tips.map(([num, title, desc]) => ({
      "@type": "ListItem",
      position: num,
      name: title,
      description: desc,
    })),
  };

  // Article-Schema für Autorität/EEAT
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.headline,
    description: c.description,
    inLanguage: "de-DE",
    author: { "@type": "Organization", name: "BELLA" },
    publisher: {
      "@type": "Organization",
      name: "BELLA",
      url: "https://welches-hundefutter.today",
    },
    mainEntityOfPage: `https://welches-hundefutter.today/tipps/${c.slug}`,
  };

  // FAQ aus den ersten Einsteiger-Tipps für Rich Results
  const faqItems = c.tips
    .filter(([, , , lvl]) => lvl === 0)
    .slice(0, 6)
    .map(([num, title, desc]) => ({ question: `Tipp ${num}: ${title}?`, answer: desc }));

  const breadcrumbs = [
    { name: "Start", url: "https://welches-hundefutter.today/" },
    { name: "Tipps", url: "https://welches-hundefutter.today/tipps" },
    { name: c.title, url: `https://welches-hundefutter.today/tipps/${c.slug}` },
  ];

  const otherCategories = TIP_CATEGORIES.filter((x) => x.slug !== slug);

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqItems.length > 0 && <StructuredData type="faq" faqs={faqItems} />}
      <StructuredData type="breadcrumb" breadcrumbs={breadcrumbs} />

      <nav className="max-w-4xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <Link href="/tipps" className="hover:text-[var(--honey)]">Tipps</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">{c.title}</span>
      </nav>

      {/* HERO */}
      <section className="hero-glow max-w-4xl mx-auto w-full px-5 pt-8 pb-10 relative overflow-hidden">
        <span
          className="absolute -right-6 -top-10 text-[12rem] leading-none opacity-10 select-none pointer-events-none"
          aria-hidden
        >
          {c.icon}
        </span>
        <span className="pill mb-4" style={{ background: `${c.accent}1f`, color: c.accent }}>
          {c.icon} 100 Tipps
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">{c.headline}</h1>
        <p className="text-[var(--muted)] leading-relaxed max-w-2xl">{c.intro}</p>
      </section>

      {/* MEDIZINISCHER HINWEIS */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-6">
        <div className="card p-4 text-xs text-[var(--muted)] leading-relaxed">
          <strong className="text-[var(--ink)]">Hinweis:</strong> Diese Tipps dienen der Information und
          ersetzen keine tierärztliche Beratung. Bei Krankheitssymptomen, vor Diäten und besonderen
          Fütterungsformen wende dich bitte an deine Tierärztin oder deinen Tierarzt.
        </div>
      </section>

      {/* TIPP-LISTE (Client mit Filter & Suche) */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-14">
        <TipsList tips={c.tips} accent={c.accent} ctaEvery={25} categorySlug={c.slug} articles={c.articles} />
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-16">
        <div className="rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 p-8 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">
            Welches Futter passt wirklich zu deinem Hund?
          </h2>
          <p className="text-[var(--muted)] mb-6 max-w-xl mx-auto">
            BELLA fragt nach Rasse, Alter, Gewicht und Gesundheit und empfiehlt in 60 Sekunden
            die optimale Sorte aus über 8.000 Produkten — kostenlos.
          </p>
          <Link href="/#bella-advisor" className="btn-primary">🐕 BELLA fragen →</Link>
        </div>
      </section>

      {/* WEITERE KATEGORIEN */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-16">
        <h2 className="text-lg font-bold mb-4">Weitere Tipp-Kategorien</h2>
        <div className="flex flex-wrap gap-2">
          {otherCategories.map((x) => (
            <Link
              key={x.slug}
              href={`/tipps/${x.slug}`}
              className="text-sm px-4 py-2 rounded-xl border border-white/10 text-[var(--muted)] hover:text-white transition-colors"
              style={{ borderColor: `${x.accent}33` }}
            >
              {x.icon} {x.title}
            </Link>
          ))}
        </div>
      </section>

      <AuthorBox />
      <SiteFooter />
    </div>
  );
}
