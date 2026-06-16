import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 86400;
export const dynamicParams = true;

const GLOSSARY_SLUGS = [
  "rct", "meta-analyse", "mikrobiom", "dha", "epa", "aafco", "fediaf",
  "oxidativer-stress", "praebiotika", "probiotika", "hydrolysiertes-protein",
  "eliminationsdiat", "eubiosis", "dysbiosis", "k9pbn", "rmbd",
  "arachidonsaeure", "fructosamin", "verdaulichkeit", "in-vitro", "in-vivo",
  "cafr", "cds", "mct",
];

export function generateStaticParams() {
  return GLOSSARY_SLUGS.map((slug) => ({ slug }));
}

interface GlossaryDetail {
  slug: string;
  term: string;
  definition: string;
  explanation: string;
  category: string;
  related_slugs: string[];
}

async function getTerm(slug: string): Promise<GlossaryDetail | null> {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  try {
    const sql = neon(url);
    const rows = await sql`
      SELECT slug, term, definition, explanation, category, related_slugs
      FROM glossary_terms WHERE slug = ${slug}
    `;
    return (rows[0] as GlossaryDetail) ?? null;
  } catch {
    return null;
  }
}

async function getRelatedTerms(slugs: string[]): Promise<{ slug: string; term: string }[]> {
  if (!slugs || slugs.length === 0) return [];
  const url = process.env.DATABASE_URL;
  if (!url) return [];
  try {
    const sql = neon(url);
    const rows = await sql`
      SELECT slug, term FROM glossary_terms
      WHERE slug = ANY(${slugs})
      LIMIT 6
    `;
    return rows as { slug: string; term: string }[];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const term = await getTerm(slug);
  if (!term) return {};
  return {
    title: `${term.term} — Fachbegriff Hundeernährung erklärt`,
    description: `${term.definition.slice(0, 155)}`,
    alternates: {
      canonical: `https://welches-hundefutter.today/glossar/${slug}`,
    },
  };
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const term = await getTerm(slug);

  if (!term) notFound();

  const relatedSlugs = Array.isArray(term.related_slugs) ? term.related_slugs : [];
  const related = await getRelatedTerms(relatedSlugs);

  return (
    <>
      <main className="min-h-screen bg-[#0a0f1e] text-white">
        {/* Breadcrumb */}
        <div className="max-w-2xl mx-auto px-4 pt-8">
          <nav className="text-sm text-white/40 flex items-center gap-2">
            <Link href="/studien" className="hover:text-white/70 transition-colors">
              Wissensuniversum
            </Link>
            <span>/</span>
            <Link href="/glossar" className="hover:text-white/70 transition-colors">
              Glossar
            </Link>
            <span>/</span>
            <span className="text-white/70">{term.term}</span>
          </nav>
        </div>

        <article className="max-w-2xl mx-auto px-4 pt-8 pb-20">
          {/* Kategorie-Badge */}
          <span className="text-xs text-white/40 bg-white/5 border border-white/10 rounded-full px-3 py-1">
            {term.category}
          </span>

          <h1 className="text-3xl font-bold mt-4 mb-4">{term.term}</h1>

          {/* Definition */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
              Definition
            </h2>
            <p className="text-white/80 leading-relaxed">{term.definition}</p>
          </div>

          {/* Einfache Erklärung */}
          <div className="bg-purple-900/20 border border-purple-500/20 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🐾</span>
              <h2 className="text-sm font-semibold text-purple-300">
                BELLA erklärt es einfach
              </h2>
            </div>
            <p className="text-white/75 leading-relaxed">{term.explanation}</p>
          </div>

          {/* Verwandte Begriffe */}
          {related.length > 0 && (
            <div className="mt-8 pt-6 border-t border-white/10">
              <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
                Verwandte Begriffe
              </h2>
              <div className="flex flex-wrap gap-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/glossar/${r.slug}`}
                    className="text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 transition-colors"
                  >
                    {r.term}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
            <Link
              href="/glossar"
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              ← Alle Fachbegriffe
            </Link>
            <Link
              href="/studien"
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              Wissensuniversum →
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
