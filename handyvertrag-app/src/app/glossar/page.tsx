import type { Metadata } from "next";
import Link from "next/link";
import { neon } from "@neondatabase/serverless";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Hundeernährung Fachbegriffe-Glossar — BELLA Wissensuniversum",
  description:
    "Von RCT bis Dysbiosis, von MCT bis CAFR: Alle wissenschaftlichen Fachbegriffe zur Hundeernährung einfach und verständlich erklärt.",
  alternates: {
    canonical: "https://welches-hundefutter.today/glossar",
  },
};

interface GlossaryRow {
  slug: string;
  term: string;
  definition: string;
  category: string;
}

const CATEGORY_ORDER = ["Methodik", "Ernährung", "Gesundheit", "Standards"];

async function getGlossaryTerms(): Promise<GlossaryRow[]> {
  const url = process.env.DATABASE_URL;
  if (!url) return [];
  try {
    const sql = neon(url);
    const rows = await sql`
      SELECT slug, term, definition, category
      FROM glossary_terms
      ORDER BY category, term ASC
    `;
    return rows as GlossaryRow[];
  } catch {
    return [];
  }
}

const CATEGORY_ICON: Record<string, string> = {
  Methodik: "🔬",
  Ernährung: "🥩",
  Gesundheit: "🏥",
  Standards: "✅",
};

export default async function GlossarPage() {
  const terms = await getGlossaryTerms();

  const byCategory = CATEGORY_ORDER.reduce<Record<string, GlossaryRow[]>>((acc, cat) => {
    acc[cat] = terms.filter((t) => t.category === cat);
    return acc;
  }, {});

  const allCats = terms.length > 0 ? CATEGORY_ORDER : [];

  return (
    <>
      <main className="min-h-screen bg-[#0a0f1e] text-white">
        {/* Header */}
        <section className="max-w-4xl mx-auto px-4 pt-16 pb-10">
          <nav className="text-sm text-white/40 mb-6">
            <Link href="/studien" className="hover:text-white/70 transition-colors">
              Wissensuniversum
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/70">Glossar</span>
          </nav>
          <div className="text-5xl mb-4">📚</div>
          <h1 className="text-4xl font-bold mb-3">Fachbegriffe-Glossar</h1>
          <p className="text-lg text-white/60 max-w-2xl">
            Wissenschaftliche Begriffe aus der Hundeernährung einfach erklärt —
            damit du Studien und Empfehlungen wirklich verstehst.
          </p>
        </section>

        {/* Kategorie-Tabs */}
        {allCats.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 pb-4">
            <div className="flex flex-wrap gap-2">
              {allCats.map((cat) => (
                <a
                  key={cat}
                  href={`#${cat.toLowerCase()}`}
                  className="text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-4 py-1.5 transition-colors"
                >
                  {CATEGORY_ICON[cat]} {cat}
                  {byCategory[cat]?.length > 0 && (
                    <span className="ml-1.5 text-white/40 text-xs">
                      ({byCategory[cat].length})
                    </span>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Terms */}
        <section className="max-w-4xl mx-auto px-4 pb-20 mt-8">
          {terms.length === 0 ? (
            <div className="text-center py-16 text-white/40">
              <p>Glossar wird nach der ersten DB-Migration verfügbar sein.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {allCats.map((cat) => {
                const catTerms = byCategory[cat] ?? [];
                if (catTerms.length === 0) return null;
                return (
                  <div key={cat} id={cat.toLowerCase()}>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <span>{CATEGORY_ICON[cat]}</span>
                      <span>{cat}</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {catTerms.map((t) => (
                        <Link
                          key={t.slug}
                          href={`/glossar/${t.slug}`}
                          className="group bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all"
                        >
                          <h3 className="font-semibold text-white group-hover:text-accent transition-colors mb-1">
                            {t.term}
                          </h3>
                          <p className="text-sm text-white/50 line-clamp-2">
                            {t.definition}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* CTA zurück */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <Link
            href="/studien"
            className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1"
          >
            ← Zurück zum Wissensuniversum
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
