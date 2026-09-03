import type { Metadata } from "next";
import Link from "next/link";
import { neon } from "@neondatabase/serverless";
import StructuredData from "@/components/StructuredData";
import AuthorBox from "@/components/AuthorBox";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 86400;

interface BrandStat {
  brand: string;
  products: number;
  avg_score: string;
  avg_price: string;
  top_type: string;
}

interface TopScorer {
  name: string;
  brand: string;
  type: string;
  ppkg: string;
  score: number;
  affiliate_url: string;
}

// Bekannte Nicht-Marken-Namen filtern (Produktkategorien die als Brand gelistet sind)
const EXCLUDE_BRANDS = new Set([
  "Probiermenü", "All-in-One", "Komfort-BARF", "Sous", "Pferdefleisch",
  "Thunfisch", "Wildfleisch", "Pferd", "Lachs", "Ente", "Lamm", "Rind", "Hirsch",
]);

async function getBrandData() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  const sql = neon(url);

  const [brandStats, topScorers, marketShare, totalScored] = await Promise.all([
    sql`
      SELECT brand, COUNT(*)::int as products,
        ROUND(AVG(score)::numeric, 1) as avg_score,
        ROUND(AVG(price_per_kg)::numeric, 2) as avg_price,
        MODE() WITHIN GROUP (ORDER BY type) as top_type
      FROM dog_foods
      WHERE is_active = true AND score IS NOT NULL
        AND price_per_kg BETWEEN 1 AND 30
      GROUP BY brand
      HAVING COUNT(*) >= 8
      ORDER BY avg_score DESC
      LIMIT 20`,
    sql`
      SELECT name, brand, type,
        ROUND(price_per_kg::numeric, 2) as ppkg,
        score, affiliate_url
      FROM dog_foods
      WHERE is_active = true AND score >= 77
        AND price_per_kg BETWEEN 1 AND 30
      ORDER BY score DESC, price_per_kg ASC
      LIMIT 8`,
    sql`
      SELECT type, COUNT(*)::int as cnt
      FROM dog_foods WHERE is_active = true
      GROUP BY type ORDER BY cnt DESC`,
    sql`SELECT COUNT(*)::int as total FROM dog_foods WHERE is_active = true AND score IS NOT NULL`,
  ]);

  return {
    brandStats: (brandStats as BrandStat[]).filter((b) => !EXCLUDE_BRANDS.has(b.brand)),
    topScorers: topScorers as TopScorer[],
    marketShare: marketShare as { type: string; cnt: number }[],
    totalScored: (totalScored[0] as { total: number }).total,
  };
}

export const metadata: Metadata = {
  title: "Welche Hundefutter-Marke ist wirklich gut? BELLA Score Ranking 2026",
  description:
    "Wir haben 11.065 Produkte mit dem BELLA Score bewertet. Das sind die Top-Marken — nach echten Qualitätskriterien, nicht nach Werbebudget.",
  alternates: {
    canonical: "https://welches-hundefutter.today/blog/marken-ranking-bella-score",
    languages: {
      "de-DE": "https://welches-hundefutter.today/blog/marken-ranking-bella-score",
      "de-AT": "https://welches-hundefutter.today/blog/marken-ranking-bella-score",
      "de-CH": "https://welches-hundefutter.today/blog/marken-ranking-bella-score",
      "x-default": "https://welches-hundefutter.today/blog/marken-ranking-bella-score",
    },
  },
};

const TYPE_LABELS: Record<string, string> = {
  trocken: "Trockenfutter",
  nass: "Nassfutter",
  barf: "BARF",
  snack: "Snacks",
  kaltgepresst: "Kaltgepresst",
};

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" :
    score >= 70 ? "bg-amber-500/20 text-amber-300 border-amber-500/30" :
    "bg-white/10 text-white/60 border-white/10";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-bold border ${color}`}>
      {score}
    </span>
  );
}

const faqItems = [
  {
    question: "Was misst der BELLA Score?",
    answer: "Der BELLA Score bewertet Hundefutter nach vier Kriterien: Proteinquellenqualität (ist Fleisch konkret benannt?), Verarbeitungsart (BARF > kaltgepresst > nass > trocken), Allergen-Status (monoprotein/hypoallergen) und Preis-Leistungs-Verhältnis. Maximum 100 Punkte, Basiswert 35.",
  },
  {
    question: "Warum sind manche bekannte Marken nicht vorne?",
    answer: "Marken wie Royal Canin oder Purina werden oft mit hohem Marketing-Budget positioniert. Der BELLA Score ignoriert Marken-Prestige und bewertet nur die tatsächliche Zusammensetzung, Deklarationsklarheit und den Preis. Werbebudget erhöht keine Qualität.",
  },
  {
    question: "Sind niedrig scorende Futter schlecht?",
    answer: "Nein. Ein BELLA Score unter 60 bedeutet nicht, dass das Futter ungesund ist — nur dass es keine herausragenden Qualitätsmerkmale aufweist. Für einen gesunden Hund ohne Spezialbedarfe ist solides Basisqualität oft ausreichend.",
  },
];

export default async function MarkenRankingPage() {
  const data = await getBrandData();
  const now = new Date();
  const dateStr = now.toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData
        type="article"
        article={{
          headline: "Welche Hundefutter-Marke ist wirklich gut? BELLA Score Ranking 2026",
          description: "11.065 Produkte bewertet — das sind die Top-Marken nach echten Kriterien.",
          url: "https://welches-hundefutter.today/blog/marken-ranking-bella-score",
          dateModified: now.toISOString(),
          speakableSelectors: ["h1", ".bella-answer"],
        }}
      />
      <StructuredData type="faq" faqs={faqItems} />

      <nav className="max-w-4xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <Link href="/blog" className="hover:text-[var(--honey)]">Blog</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">Marken-Ranking</span>
      </nav>

      <section className="hero-glow max-w-4xl mx-auto w-full px-5 pt-8 pb-12">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="pill">📊 BELLA Intelligence</span>
          <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold">
            🔴 LIVE — Stand {dateStr}
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
          Welche Hundefutter-Marke ist wirklich gut? Wir haben{" "}
          <span className="text-[var(--honey)]">{data?.totalScored.toLocaleString("de-DE") ?? "11.065"}</span>{" "}
          Produkte analysiert.
        </h1>
        <p className="bella-answer text-[var(--muted)] leading-relaxed max-w-2xl">
          Kein Test-Labor bezahlt von Herstellern. Kein Affiliate-verzerrtes Ranking.
          Der BELLA Score basiert auf vier messbaren Kriterien: Proteinquelle, Verarbeitungsart,
          Allergen-Status und Preis-Leistung.
        </p>
      </section>

      {/* Score erklärt */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-10">
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {[
            { range: "≥ 80", label: "Premium ★", desc: "Klare Fleischdeklaration, wenig Füllstoffe, faires Preis-Leistungs-Verhältnis", color: "border-emerald-500/30 bg-emerald-500/5" },
            { range: "60–79", label: "Gut ◆", desc: "Solide Qualität, einige Qualitätsmerkmale vorhanden, für die meisten Hunde geeignet", color: "border-amber-500/30 bg-amber-500/5" },
            { range: "< 60", label: "Basis ·", desc: "Keine besonderen Merkmale, aber nicht unbedingt schlechte Qualität", color: "border-white/10 bg-white/[0.02]" },
          ].map((tier) => (
            <div key={tier.range} className={`rounded-2xl border p-4 ${tier.color}`}>
              <p className="text-lg font-black mb-1">Score {tier.range}</p>
              <p className="font-bold text-sm mb-2">{tier.label}</p>
              <p className="text-xs text-[var(--muted)] leading-relaxed">{tier.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Ranking */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <h2 className="text-2xl font-extrabold tracking-tight">
            Top-Marken nach Ø BELLA Score
          </h2>
          <span className="text-xs text-[var(--muted)]">mind. 8 Produkte, nur aktive Artikel</span>
        </div>

        {data ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-3 font-bold text-[var(--muted)] text-xs uppercase tracking-wide">#</th>
                  <th className="text-left p-3 font-bold text-[var(--muted)] text-xs uppercase tracking-wide">Marke</th>
                  <th className="text-center p-3 font-bold text-[var(--muted)] text-xs uppercase tracking-wide">BELLA Score</th>
                  <th className="text-right p-3 font-bold text-[var(--muted)] text-xs uppercase tracking-wide">Ø Preis/kg</th>
                  <th className="text-right p-3 font-bold text-[var(--muted)] text-xs uppercase tracking-wide hidden sm:table-cell">Produkte</th>
                  <th className="text-right p-3 font-bold text-[var(--muted)] text-xs uppercase tracking-wide hidden md:table-cell">Haupttyp</th>
                </tr>
              </thead>
              <tbody>
                {data.brandStats.slice(0, 15).map((b, i) => (
                  <tr
                    key={b.brand}
                    className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${i === 0 ? "bg-amber-500/5" : ""}`}
                  >
                    <td className="p-3 text-[var(--muted)] font-bold">
                      {i === 0 ? "🏆" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-white">{b.brand}</span>
                    </td>
                    <td className="p-3 text-center">
                      <ScoreBadge score={Math.round(parseFloat(b.avg_score))} />
                    </td>
                    <td className="p-3 text-right text-[var(--honey)] font-bold">{b.avg_price} €</td>
                    <td className="p-3 text-right text-[var(--muted)] hidden sm:table-cell">{b.products}</td>
                    <td className="p-3 text-right text-[var(--muted)] text-xs capitalize hidden md:table-cell">
                      {TYPE_LABELS[b.top_type] ?? b.top_type}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card p-6 text-center text-[var(--muted)]">Daten werden geladen…</div>
        )}
      </section>

      {/* Höchst-Scorer Produkte */}
      {data && data.topScorers.length > 0 && (
        <section className="max-w-4xl mx-auto w-full px-5 pb-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <h2 className="text-2xl font-extrabold tracking-tight">
              Die höchst-gescorten Produkte im Katalog
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {data.topScorers.map((f, i) => (
              <a
                key={i}
                href={f.affiliate_url}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="card p-4 hover:border-[rgba(240,167,60,0.4)] transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-[var(--muted)] capitalize">{f.type}</span>
                  <ScoreBadge score={f.score} />
                </div>
                <p className="text-sm font-semibold text-white leading-snug mb-1 line-clamp-2">{f.name}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-[var(--muted)]">{f.brand}</span>
                  <span className="text-base font-black text-[var(--honey)]">{f.ppkg} €/kg</span>
                </div>
                <p className="text-[10px] text-[var(--honey)] mt-1 group-hover:underline">Zum Futter →</p>
              </a>
            ))}
          </div>
          <p className="text-[11px] text-[var(--muted)] mt-3">*Werbung · Affiliate-Links</p>
        </section>
      )}

      {/* Was der Score NICHT misst */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <div className="card p-7">
          <h2 className="text-xl font-extrabold tracking-tight mb-4">Was der BELLA Score nicht misst — und warum das wichtig ist</h2>
          <p className="text-[var(--muted)] text-sm leading-relaxed mb-4">
            Der BELLA Score ist ein Qualitäts-Indikator, kein Geschmacks-Test und keine tierärztliche Empfehlung.
            Er bewertet, was aus den Produktdaten ableitbar ist — nicht, ob dein spezifischer Hund das Futter
            verträgt oder möchte.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-[var(--muted)]">
            {[
              { icon: "❌", text: "Palatabilität / ob der Hund das Futter frisst" },
              { icon: "❌", text: "Individuelle Verträglichkeit für deinen Hund" },
              { icon: "❌", text: "Tatsächliche Labor-analysierte Nährstoffgehalte" },
              { icon: "❌", text: "Herstellertransparenz und Unternehmensethik" },
              { icon: "✓", text: "Deklarationsklarheit (wer nennt konkrete Zutaten?)" },
              { icon: "✓", text: "Fleischanteil-Indikator (erste Zutat, Proteingehalt)" },
              { icon: "✓", text: "Verarbeitungsmethode (BARF > kaltgepresst > nass > trocken)" },
              { icon: "✓", text: "Preis-Leistungs-Verhältnis im Marktkontext" },
            ].map((item, i) => (
              <div key={i} className="flex gap-2">
                <span className={item.icon === "✓" ? "text-emerald-400" : "text-red-400/70"}>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <h2 className="text-2xl font-extrabold tracking-tight mb-6">Häufige Fragen</h2>
        <div className="space-y-4">
          {faqItems.map((f, i) => (
            <div key={i} className="card p-5">
              <h3 className="font-bold text-base mb-2">{f.question}</h3>
              <p className="text-[var(--muted)] text-sm leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-14">
        <div className="rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 p-8">
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">BELLA weiß welche Marke zu deinem Hund passt</h2>
          <p className="text-[var(--muted)] mb-6">Nicht jede Top-Marke ist die richtige für jeden Hund. BELLA kombiniert das Marken-Ranking mit deinem spezifischen Hunde-Profil.</p>
          <Link
            href="/#bella-advisor"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
          >
            🐕 Jetzt Futter finden
          </Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto w-full px-5 pb-10">
        <h2 className="text-xl font-extrabold tracking-tight mb-4">Weitere BELLA Intelligence Reports</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/blog/preisbarometer-2026" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">
            💰 Preisbarometer 2026
          </Link>
          <Link href="/blog/marktbericht-hundefutter-2026" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">
            🗂️ Marktbericht 2026
          </Link>
          <Link href="/vergleich" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">
            ⚖️ Vergleiche
          </Link>
        </div>
      </section>

      <div className="max-w-4xl mx-auto w-full px-5 pb-10">
        <AuthorBox />
      </div>
      <SiteFooter />
    </div>
  );
}
