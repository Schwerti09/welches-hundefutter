import type { Metadata } from "next";
import Link from "next/link";
import { blogArticles } from "@/data/blogArticles";

export const metadata: Metadata = {
  title: "Blog: Hundefutter, Ernährung & Ratgeber | BELLA",
  description: "Aktuelle Ratgeber zu Hundefutter, Ernährung, Allergien und Gesundheit. Fundiert, ohne Werbung, auf Basis der BELLA-Datenbank.",
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

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-300">Startseite</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-300">Blog</span>
      </nav>

      <h1 className="text-3xl font-bold text-white mb-3">
        Blog: Hundefutter für deinen Hund
      </h1>
      <p className="text-gray-400 mb-10 text-lg">
        Ratgeber, Erfahrungsberichte und aktuelle Tipps rund um Hundefutter für deinen Hund.
        Alle Artikel basieren auf echten Genehmigungsdaten aus der BELLA-Datenbank.
      </p>

      <div className="grid gap-4">
        {blogArticles.map((article) => (
          <article key={article.slug} className="bg-gray-900 rounded-xl p-5 hover:bg-gray-800/80 transition-colors">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <span>Von <Link href="/ueber-uns" className="text-indigo-400 hover:text-indigo-300">R. Schwertfechter</Link></span>
              <span>·</span>
              <time dateTime={article.updatedAt}>
                {new Date(article.updatedAt).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}
              </time>
              <span>·</span>
              <span>{article.readingTime} Min. Lesezeit</span>
            </div>
            <h2 className="text-lg font-semibold text-white mb-2 leading-snug">
              <Link href={`/blog/${article.slug}`} className="hover:text-indigo-300 transition-colors">
                {article.title}
              </Link>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-3">{article.description}</p>
            <Link
              href={`/blog/${article.slug}`}
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
            >
              Artikel lesen →
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-12 bg-indigo-900/30 rounded-xl p-6 text-center">
        <p className="text-white font-semibold mb-2">BELLA beantwortet deine Fragen sofort</p>
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm">
          mit BELLA deinen Empfehlung für deinen Hund finden →
        </Link>
      </div>
    </div>
  );
}
