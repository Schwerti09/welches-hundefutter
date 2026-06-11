import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TIP_CATEGORIES, TIP_CATEGORY_BY_SLUG, type TipArticle } from "@/data/tips";
import StructuredData from "@/components/StructuredData";
import AuthorBox from "@/components/AuthorBox";
import SiteFooter from "@/components/SiteFooter";
import TipArticleImage from "@/components/TipArticleImage";
import ReadingProgress from "@/components/ReadingProgress";

// Wandelt eine Überschrift in einen URL-tauglichen Anker-Slug um
function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Rendert **fett** innerhalb von Fließtext als <strong>
function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="text-[var(--ink)] font-semibold">{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export const revalidate = 86400;

export async function generateStaticParams() {
  const params: { category: string; "tip-slug": string }[] = [];
  
  for (const category of TIP_CATEGORIES) {
    if (category.articles) {
      for (const article of category.articles) {
        params.push({
          category: category.slug,
          "tip-slug": article.slug,
        });
      }
    }
  }
  
  return params;
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ category: string; "tip-slug": string }> 
}): Promise<Metadata> {
  const { category, "tip-slug": tipSlug } = await params;
  const cat = TIP_CATEGORY_BY_SLUG[category];
  if (!cat || !cat.articles) return {};
  
  const article = cat.articles.find((a) => a.slug === tipSlug);
  if (!article) return {};
  
  return {
    title: article.seoTitle,
    description: article.seoDescription,
    keywords: article.keywords,
    alternates: {
      canonical: `https://welches-hundefutter.today/tipps/${category}/${tipSlug}`,
      languages: {
        "de-DE": `https://welches-hundefutter.today/tipps/${category}/${tipSlug}`,
        "de-AT": `https://welches-hundefutter.today/tipps/${category}/${tipSlug}`,
        "de-CH": `https://welches-hundefutter.today/tipps/${category}/${tipSlug}`,
        "x-default": `https://welches-hundefutter.today/tipps/${category}/${tipSlug}`,
      },
    },
    openGraph: {
      title: article.seoTitle,
      description: article.seoDescription,
      url: `https://welches-hundefutter.today/tipps/${category}/${tipSlug}`,
      type: "article",
      // OG-Bild wird dynamisch via opengraph-image.tsx generiert (premium gebrandet)
    },
  };
}

export default async function TipArticlePage({ 
  params 
}: { 
  params: Promise<{ category: string; "tip-slug": string }> 
}) {
  const { category, "tip-slug": tipSlug } = await params;
  const cat = TIP_CATEGORY_BY_SLUG[category];
  if (!cat || !cat.articles) notFound();
  
  const article = cat.articles.find((a) => a.slug === tipSlug);
  if (!article) notFound();

  // Article-Schema für maximale SEO-Visibility
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seoDescription,
    image: article.imageUrl.startsWith("http") 
      ? article.imageUrl 
      : `https://welches-hundefutter.today${article.imageUrl}`,
    author: { "@id": "https://welches-hundefutter.today/ueber-uns#person" },
    publisher: {
      "@type": "Organization",
      name: "BELLA",
      url: "https://welches-hundefutter.today",
      logo: {
        "@type": "ImageObject",
        url: "https://welches-hundefutter.today/logo.png",
      },
    },
    datePublished: "2025-01-01",
    dateModified: article.lastUpdated,
    mainEntityOfPage: `https://welches-hundefutter.today/tipps/${category}/${tipSlug}`,
    keywords: article.keywords.join(", "),
    articleSection: cat.title,
    wordCount: article.content.split(" ").length,
    readingTime: `${article.readingTime} minutes`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".bella-answer"],
    },
  };

  // Geo-Schema wenn regional relevant
  const geoSchema = article.geoRelevant && article.relevantCities ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "BELLA Hundeernährungsberatung",
    description: article.seoDescription,
    areaServed: article.relevantCities.map((city) => ({
      "@type": "City",
      name: city,
    })),
  } : null;

  const breadcrumbs = [
    { name: "Start", url: "https://welches-hundefutter.today/" },
    { name: "Tipps", url: "https://welches-hundefutter.today/tipps" },
    { name: cat.title, url: `https://welches-hundefutter.today/tipps/${category}` },
    { name: article.title, url: `https://welches-hundefutter.today/tipps/${category}/${tipSlug}` },
  ];

  // Verwandte Tipps aus der gleichen Kategorie
  const relatedArticles = article.relatedTips
    ?.map((id) => cat.articles?.find((a) => a.id === id))
    .filter(Boolean) as TipArticle[] || [];

  // Inhaltsverzeichnis aus den ##-Überschriften des Artikels
  const toc = article.content
    .split("\n")
    .filter((line) => line.startsWith("## ") && !line.startsWith("### "))
    .map((line) => {
      const text = line.replace(/^##\s+/, "").trim();
      return { text, id: slugifyHeading(text) };
    });

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <ReadingProgress accent={cat.accent} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {geoSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(geoSchema) }} />}
      <StructuredData type="breadcrumb" breadcrumbs={breadcrumbs} />

      <nav className="max-w-4xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <Link href="/tipps" className="hover:text-[var(--honey)]">Tipps</Link>
        <span className="mx-2">·</span>
        <Link href={`/tipps/${category}`} className="hover:text-[var(--honey)]">{cat.title}</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">{article.title}</span>
      </nav>

      {/* HERO MIT BILD */}
      <article className="max-w-4xl mx-auto w-full px-5 pt-8 pb-12">
        <header className="mb-8">
          <span 
            className="pill mb-4 inline-block" 
            style={{ background: `${cat.accent}1f`, color: cat.accent }}
          >
            {cat.icon} Tipp #{article.id} · {article.readingTime} Min. Lesezeit
          </span>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
            {article.title}
          </h1>
          
          <p className="bella-answer text-[var(--muted)] text-lg leading-relaxed max-w-2xl mb-6">
            {article.shortDescription}
          </p>

          {/* Geo-Tag wenn regional relevant */}
          {article.geoRelevant && article.relevantCities && (
            <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-4">
              <span>📍</span>
              <span>Regional relevant für: {article.relevantCities.join(", ")}</span>
            </div>
)}

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-3 py-1 rounded-full"
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
        </header>

        {/* HAUPTBILD */}
        <figure className="mb-10 rounded-2xl overflow-hidden">
          <TipArticleImage
            src={article.imageUrl}
            alt={article.imageAlt}
            accent={cat.accent}
            icon={cat.icon}
            number={article.id}
            category={cat.title}
          />
          {article.imageAlt && (
            <figcaption className="text-xs text-[var(--muted)] mt-2 text-center">
              {article.imageAlt}
            </figcaption>
          )}
        </figure>

        {/* MEDIZINISCHER HINWEIS */}
        <div className="card p-4 text-xs text-[var(--muted)] leading-relaxed mb-8">
          <strong className="text-[var(--ink)]">Hinweis:</strong> Dieser Tipp dient der Information und
          ersetzt keine tierärztliche Beratung. Bei Krankheitssymptomen, vor Diäten und besonderen
          Fütterungsformen wende dich bitte an deine Tierärztin oder deinen Tierarzt.
        </div>

        {/* INHALTSVERZEICHNIS */}
        {toc.length >= 3 && (
          <nav className="card p-5 mb-10" aria-label="Inhaltsverzeichnis">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
              Inhalt
            </p>
            <ol className="space-y-1.5">
              {toc.map((h, i) => (
                <li key={h.id} className="flex gap-2 text-sm">
                  <span className="tabular-nums font-semibold" style={{ color: cat.accent }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <a href={`#${h.id}`} className="text-[var(--muted)] hover:text-[var(--honey)] transition-colors">
                    {h.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* ARTIKEL-CONTENT (Markdown-Rendering) */}
        <div className="prose prose-lg max-w-none">
          <div className="article-content">
            {article.content.split("\n\n").map((paragraph, idx) => {
              // Überschriften
              if (paragraph.startsWith("### ")) {
                const text = paragraph.replace(/^###\s+/, "");
                return (
                  <h3 key={idx} id={slugifyHeading(text)} className="text-xl sm:text-2xl font-bold mt-8 mb-3 scroll-mt-24">
                    {text}
                  </h3>
                );
              }
              if (paragraph.startsWith("## ")) {
                const text = paragraph.replace(/^##\s+/, "");
                return (
                  <h2 key={idx} id={slugifyHeading(text)} className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-12 mb-5 scroll-mt-24">
                    {text}
                  </h2>
                );
              }

              // Listen
              if (paragraph.startsWith("- ")) {
                const items = paragraph.split("\n").map((item) => item.replace(/^-\s+/, ""));
                return (
                  <ul key={idx} className="list-disc pl-6 mb-6 space-y-2 marker:text-[var(--muted)]">
                    {items.map((item, i) => (
                      <li key={i} className="text-[var(--ink)] leading-relaxed">
                        {renderInline(item)}
                      </li>
                    ))}
                  </ul>
                );
              }

              // Nummerierte Listen
              if (paragraph.match(/^\d+\./)) {
                const items = paragraph.split("\n").map((item) => item.replace(/^\d+\.\s/, ""));
                return (
                  <ol key={idx} className="list-decimal pl-6 mb-6 space-y-2 marker:text-[var(--muted)]">
                    {items.map((item, i) => (
                      <li key={i} className="text-[var(--ink)] leading-relaxed">
                        {renderInline(item)}
                      </li>
                    ))}
                  </ol>
                );
              }

              // Blockzitat / Hinweis
              if (paragraph.startsWith("> ")) {
                return (
                  <blockquote
                    key={idx}
                    className="border-l-4 pl-5 py-1 my-6 text-[var(--muted)] italic"
                    style={{ borderColor: cat.accent }}
                  >
                    {renderInline(paragraph.replace(/^>\s+/, ""))}
                  </blockquote>
                );
              }

              // Normale Absätze
              return (
                <p key={idx} className="text-[var(--ink)]/90 leading-relaxed mb-6">
                  {renderInline(paragraph)}
                </p>
              );
            })}
          </div>
        </div>

        {/* INTERNE LINKS SECTION */}
        {article.internalLinks.length > 0 && (
          <section className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-orange-600/10 to-amber-600/10 border border-orange-500/20">
            <h3 className="text-lg font-bold mb-4">Weiterführende Informationen</h3>
            <ul className="space-y-2">
              {article.internalLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link}
                    className="text-[var(--honey)] hover:underline text-sm"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* VERWANDTE TIPPS */}
        {relatedArticles.length > 0 && (
          <section className="mt-12">
            <h3 className="text-lg font-bold mb-4">Verwandte Tipps</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/tipps/${category}/${related.slug}`}
                  className="card card-hover p-4 block"
                >
                  <span className="text-xs font-semibold mb-2 inline-block" style={{ color: cat.accent }}>
                    Tipp #{related.id}
                  </span>
                  <h4 className="font-bold text-sm mb-1">{related.title}</h4>
                  <p className="text-xs text-[var(--muted)] line-clamp-2">
                    {related.shortDescription}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ZURÜCK ZUR KATEGORIE */}
        <section className="mt-12">
          <Link
            href={`/tipps/${category}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--honey)] transition-colors"
          >
            ← Alle {cat.title}-Tipps ansehen
          </Link>
        </section>
      </article>

      {/* CTA */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-16">
        <div className="rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 p-8 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">
            Du willst eine persönliche Futter-Empfehlung?
          </h2>
          <p className="text-[var(--muted)] mb-6 max-w-xl mx-auto">
            BELLA fragt nach Rasse, Alter, Gewicht und Gesundheit und empfiehlt in 60 Sekunden
            die optimale Sorte aus über 11.000 Produkten — kostenlos.
          </p>
          <Link href="/#bella-advisor" className="btn-primary">
            🐕 BELLA fragen →
          </Link>
        </div>
      </section>

      <AuthorBox />
      <SiteFooter />
    </div>
  );
}
