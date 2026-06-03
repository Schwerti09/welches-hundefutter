import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogArticles, getArticleBySlug } from "@/data/blogArticles";
import StructuredData from "@/components/StructuredData";

export async function generateStaticParams() {
  return blogArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: `${article.title} | BELLA`,
    description: article.description,
    alternates: { canonical: `https://welches-hundefutter.today/blog/${slug}` },
    authors: [{ name: "R. Schwertfechter", url: "https://welches-hundefutter.today/ueber-uns" }],
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: ["R. Schwertfechter"],
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const relatedArticles = blogArticles.filter((a) => article.relatedSlugs.includes(a.slug));

  return (
    <>
      <StructuredData type="faq" faqs={article.faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: "Startseite", url: "https://welches-hundefutter.today" },
          { name: "Blog", url: "https://welches-hundefutter.today/blog" },
          { name: article.title, url: `https://welches-hundefutter.today/blog/${slug}` },
        ]}
      />

      <article className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-300">Startseite</Link>
          <span className="mx-2">›</span>
          <Link href="/blog" className="hover:text-gray-300">Blog</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-300 line-clamp-1">{article.title}</span>
        </nav>

        {/* Artikel-Meta (E-E-A-T) */}
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-4 flex-wrap">
          <span>Von <Link href="/ueber-uns" className="text-indigo-400 hover:text-indigo-300">R. Schwertfechter</Link></span>
          <span>·</span>
          <span>
            Aktualisiert:{" "}
            <time dateTime={article.updatedAt}>
              {new Date(article.updatedAt).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}
            </time>
          </span>
          <span>·</span>
          <span>{article.readingTime} Min. Lesezeit</span>
          <span>·</span>
          <span className="text-green-500">✓ Geprüft</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4 leading-tight">{article.title}</h1>
        <p className="text-gray-400 text-lg mb-8 leading-relaxed">{article.description}</p>

        {/* Artikel-Inhalt */}
        <div className="space-y-8">
          {article.sections.map((section, idx) => (
            <section key={idx}>
              <h2 className="text-xl font-bold text-white mb-3">{section.heading}</h2>
              <div className="text-gray-400 leading-relaxed space-y-3">
                {section.content.split("\n\n").map((para, pIdx) => {
                  if (para.startsWith("**") && para.includes("**\n")) {
                    const [title, ...rest] = para.split("\n");
                    return (
                      <div key={pIdx}>
                        <p className="font-semibold text-white mb-1">{title.replace(/\*\*/g, "")}</p>
                        <p>{rest.join(" ")}</p>
                      </div>
                    );
                  }
                  if (para.includes("| ---")) {
                    const lines = para.trim().split("\n").filter((l) => !l.includes("| ---"));
                    const headers = lines[0].split("|").filter(Boolean).map((h) => h.trim());
                    const rows = lines.slice(1).map((l) => l.split("|").filter(Boolean).map((c) => c.trim()));
                    return (
                      <div key={pIdx} className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="bg-gray-800">
                              {headers.map((h, i) => <th key={i} className="px-3 py-2 text-left border border-gray-700 text-gray-300">{h}</th>)}
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((row, ri) => (
                              <tr key={ri} className="border-b border-gray-800">
                                {row.map((cell, ci) => <td key={ci} className="px-3 py-2 border border-gray-700">{cell}</td>)}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                  if (para.startsWith("- ") || para.startsWith("1. ")) {
                    const items = para.split("\n");
                    return (
                      <ul key={pIdx} className="space-y-1 list-disc list-inside">
                        {items.map((item, ii) => <li key={ii}>{item.replace(/^[-\d.]+\s/, "").replace(/\*\*/g, "")}</li>)}
                      </ul>
                    );
                  }
                  return <p key={pIdx}>{para.replace(/\*\*/g, "")}</p>;
                })}
              </div>
            </section>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-white mb-4">Häufige Fragen</h2>
          <div className="space-y-3">
            {article.faqs.map((faq) => (
              <details key={faq.question} className="bg-gray-900 rounded-lg group">
                <summary className="flex justify-between items-start cursor-pointer list-none px-5 py-4">
                  <span className="font-semibold text-white text-sm pr-4">{faq.question}</span>
                  <span className="text-gray-500 mt-0.5 shrink-0 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-5 pb-4 text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-3">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Verwandte Artikel */}
        {relatedArticles.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-white mb-4">Verwandte Ratgeber</h2>
            <div className="space-y-3">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="block bg-gray-900 hover:bg-gray-800 rounded-lg p-4 transition-colors"
                >
                  <p className="text-white font-medium text-sm mb-1">{rel.title}</p>
                  <p className="text-gray-500 text-xs">{rel.readingTime} Min. Lesezeit</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 bg-indigo-900/30 rounded-xl p-6 text-center">
          <p className="text-white font-semibold mb-2">BELLA findet deinen Empfehlung für deinen Hund</p>
          <Link
            href="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Jetzt Empfehlung für deinen Hund finden
          </Link>
        </div>
      </article>
    </>
  );
}
