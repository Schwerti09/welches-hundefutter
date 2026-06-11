import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import { REVIEWER } from "@/data/reviewer";

export async function generateStaticParams() {
  return REVIEWER ? [{ slug: REVIEWER.slug }] : [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!REVIEWER || REVIEWER.slug !== slug) return {};

  const url = `https://welches-hundefutter.today/experten/${REVIEWER.slug}`;
  return {
    title: `${REVIEWER.name} — Tiermedizinische Prüfung | welches-hundefutter.today`,
    description: `${REVIEWER.name} (${REVIEWER.title}) prüft die Gesundheitsratgeber auf welches-hundefutter.today fachlich. ${REVIEWER.approbation}.`,
    alternates: {
      canonical: url,
      languages: {
        "de-DE": url,
        "de-AT": url,
        "de-CH": url,
        "x-default": url,
      },
    },
  };
}

export default async function ExpertenPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!REVIEWER || REVIEWER.slug !== slug) notFound();

  const url = `https://welches-hundefutter.today/experten/${REVIEWER.slug}`;
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${url}#person`,
    name: REVIEWER.name,
    url,
    jobTitle: REVIEWER.title,
    description: REVIEWER.approbation,
    image: REVIEWER.imageUrl,
    sameAs: REVIEWER.sameAs,
    knowsAbout: ["Tierernährung", "Hundeernährung", "Veterinärmedizin"],
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <header className="border-b border-white/5 px-5 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">B</span>
            </div>
            <span className="font-bold text-sm">welches-hundefutter<span className="text-orange-400">.today</span></span>
          </Link>
          <nav className="text-sm text-white/40 flex gap-2">
            <Link href="/" className="hover:text-white transition-colors">Startseite</Link>
            <span>/</span>
            <Link href="/ueber-uns" className="hover:text-white transition-colors">Über uns</Link>
            <span>/</span>
            <span className="text-white/70">Experten</span>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-5 py-14 w-full">
        {/* Profil-Header */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-10 flex items-start gap-5 border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={REVIEWER.imageUrl}
            alt={REVIEWER.name}
            className="w-16 h-16 rounded-full object-cover shrink-0 border border-white/10"
          />
          <div className="min-w-0">
            <p className="font-bold text-white text-lg">{REVIEWER.name}</p>
            <p className="text-orange-400 text-sm mb-3">{REVIEWER.title}</p>
            <p className="text-gray-400 text-sm leading-relaxed">{REVIEWER.bio}</p>
          </div>
        </div>

        {/* Approbation */}
        <section className="mb-14">
          <div className="bg-white/[0.04] rounded-2xl p-5 border border-white/10 flex items-start gap-4">
            <span className="text-2xl" aria-hidden>🩺</span>
            <div>
              <h2 className="font-bold mb-1">Fachliche Qualifikation</h2>
              <p className="text-sm text-white/60 leading-relaxed">{REVIEWER.approbation}</p>
            </div>
          </div>
        </section>

        {/* Geprüfte Artikel */}
        {REVIEWER.reviewedArticles.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-black mb-6">Fachlich geprüfte Ratgeber</h2>
            <div className="space-y-3">
              {REVIEWER.reviewedArticles.map((a) => {
                const date = new Date(a.reviewedAt).toLocaleDateString("de-DE", {
                  day: "numeric", month: "long", year: "numeric",
                });
                return (
                  <Link
                    key={a.href}
                    href={a.href}
                    className="flex items-center justify-between gap-4 bg-white/[0.04] rounded-xl p-4 border border-white/10 hover:border-orange-500/30 transition-colors"
                  >
                    <span className="font-semibold text-sm">{a.title}</span>
                    <span className="text-xs text-white/40 whitespace-nowrap">Geprüft: {date}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Links */}
        {REVIEWER.sameAs.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-black mb-6">Praxis & Profile</h2>
            <div className="flex flex-wrap gap-3 text-sm">
              {REVIEWER.sameAs.map((href) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-orange-400 hover:bg-white/[0.08] transition-colors"
                >
                  {href.replace(/^https?:\/\//, "")} →
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Zurück */}
        <div className="text-center">
          <Link href="/ueber-uns" className="text-orange-400 hover:text-orange-300 text-sm font-medium">
            ← Zurück zu Über uns
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
