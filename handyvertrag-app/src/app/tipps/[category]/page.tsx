import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TIP_CATEGORY_BY_SLUG, type TipArticle } from "@/data/tips";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 86400;

export async function generateStaticParams() {
  return Object.keys(TIP_CATEGORY_BY_SLUG).map((slug) => ({
    category: slug,
  }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ category: string }> 
}): Promise<Metadata> {
  const { category } = await params;
  const cat = TIP_CATEGORY_BY_SLUG[category];
  if (!cat) return {};
  
  return {
    title: `${cat.headline} – 100 Tipps von BELLA`,
    description: cat.description,
    alternates: {
      canonical: `https://welches-hundefutter.today/tipps/${category}`,
      languages: {
        "de-DE": `https://welches-hundefutter.today/tipps/${category}`,
        "de-AT": `https://welches-hundefutter.today/tipps/${category}`,
        "de-CH": `https://welches-hundefutter.today/tipps/${category}`,
        "x-default": `https://welches-hundefutter.today/tipps/${category}`,
      },
    },
    openGraph: {
      title: cat.headline,
      description: cat.description,
      url: `https://welches-hundefutter.today/tipps/${category}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ category: string }> 
}) {
  const { category } = await params;
  const cat = TIP_CATEGORY_BY_SLUG[category];
  if (!cat) notFound();

  const articles = cat.articles || [];

  // Breadcrumb-Schema
  const breadcrumbs = [
    { name: "Start", url: "https://welches-hundefutter.today/" },
    { name: "Tipps", url: "https://welches-hundefutter.today/tipps" },
    { name: cat.title, url: `https://welches-hundefutter.today/tipps/${category}` },
  ];

  // ItemList-Schema für Artikel
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: cat.headline,
    description: cat.description,
    numberOfItems: articles.length,
    itemListElement: articles.map((article, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: article.title,
      description: article.shortDescription,
      url: `https://welches-hundefutter.today/tipps/${category}/${article.slug}`,
    })),
  };

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <StructuredData type="breadcrumb" breadcrumbs={breadcrumbs} />

      <nav className="max-w-6xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <Link href="/tipps" className="hover:text-[var(--honey)]">Tipps</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">{cat.title}</span>
      </nav>

      {/* HERO */}
      <section className="hero-glow max-w-6xl mx-auto w-full px-5 pt-8 pb-12">
        <span className="pill mb-4">{cat.icon} {articles.length} Artikel</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
          {cat.headline}
        </h1>
        <p className="text-[var(--muted)] leading-relaxed max-w-2xl mb-8">
          {cat.description}
        </p>
        <p className="text-[var(--muted)] leading-relaxed max-w-2xl mb-8">
          {cat.intro}
        </p>
      </section>

      {/* ARTIKEL-LISTE */}
      <section className="max-w-6xl mx-auto w-full px-5 pb-16">
        {articles.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/tipps/${category}/${article.slug}`}
                className="card card-hover p-6 block relative overflow-hidden group"
                style={{ borderColor: `${cat.accent}33` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: `${cat.accent}22`, color: cat.accent }}
                  >
                    Tipp #{article.id}
                  </span>
                  <span className="text-xs text-[var(--muted)]">
                    {article.readingTime} Min.
                  </span>
                </div>
                <h3 className="text-lg font-bold tracking-tight mb-2 group-hover:text-[var(--honey)] transition-colors">
                  {article.title}
                </h3>
                <p className="text-[var(--muted)] text-sm leading-relaxed line-clamp-3 mb-4">
                  {article.shortDescription}
                </p>
                {article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ 
                          background: `${cat.accent}1f`, 
                          color: cat.accent 
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <p className="text-[var(--muted)]">
              Noch keine Artikel verfügbar. Die kompakte Übersicht mit 100 Tipps ist weiter unten.
            </p>
          </div>
        )}

        {/* KOMPAKTE ÜBERSICHT (FALLBACK) */}
        {articles.length === 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Kompakte Übersicht (100 Tipps)</h2>
            <div className="space-y-3">
              {cat.tips.map((tip, idx) => (
                <div
                  key={idx}
                  className="card p-4"
                  style={{ borderColor: `${cat.accent}33` }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: `${cat.accent}22`, color: cat.accent }}
                    >
                      #{tip[0]}
                    </span>
                    <div>
                      <h3 className="font-bold text-sm mb-1">{tip[1]}</h3>
                      <p className="text-xs text-[var(--muted)]">{tip[2]}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </section>

      {/* ZURÜCK ZUR ÜBERSICHT */}
      <section className="max-w-6xl mx-auto w-full px-5 pb-16">
        <Link
          href="/tipps"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--honey)] transition-colors"
        >
          ← Alle Kategorien ansehen
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}
