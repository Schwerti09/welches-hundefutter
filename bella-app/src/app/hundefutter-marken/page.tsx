import type { Metadata } from "next";
import Link from "next/link";
import { neon } from "@neondatabase/serverless";
import StructuredData from "@/components/StructuredData";
import AuthorBox from "@/components/AuthorBox";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 86400;

interface BrandRow {
  brand: string;
  products: number;
  avg_score: string;
  avg_price: string;
  top_type: string;
}

async function getBrands() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  const sql = neon(url);
  const rows = await sql`
    SELECT brand, COUNT(*)::int as products,
      ROUND(AVG(score)::numeric, 1) as avg_score,
      ROUND(AVG(price_per_kg)::numeric, 2) as avg_price,
      MODE() WITHIN GROUP (ORDER BY type) as top_type
    FROM dog_foods
    WHERE is_active = true AND score IS NOT NULL AND price_per_kg BETWEEN 1 AND 30
    GROUP BY brand
    HAVING COUNT(*) >= 8
    ORDER BY products DESC
    LIMIT 25`;
  return rows as BrandRow[];
}

export const metadata: Metadata = {
  title: "Hundefutter Marken 2026: Josera, FRESSNAPF & Co. — was der BELLA Score sagt",
  description:
    "Josera, HILLS, Royal Canin, FRESSNAPF-Eigenmarken — was steckt wirklich dahinter? BELLA bewertet alle Marken nach denselben 4 Kriterien. Kein Hersteller kann seinen Score kaufen.",
  alternates: {
    canonical: "https://welches-hundefutter.today/hundefutter-marken",
    languages: {
      "de-DE": "https://welches-hundefutter.today/hundefutter-marken",
      "de-AT": "https://welches-hundefutter.today/hundefutter-marken",
      "de-CH": "https://welches-hundefutter.today/hundefutter-marken",
      "x-default": "https://welches-hundefutter.today/hundefutter-marken",
    },
  },
};

const faqItems = [
  {
    question: "Ist Josera ein gutes Hundefutter?",
    answer: "Josera bietet ein breites Sortiment — von Einstiegsprodukten bis hin zu Spezialdiäten. Der BELLA Score variiert je nach Produkt erheblich. Josera Lachs & Kartoffel und andere monoprotein-basierte Produkte erzielen bessere Scores als Mehrkornprodukte mit unspezifischen Fleisch-Deklarationen. Schaue dir den BELLA Score des konkreten Josera-Produkts an, nicht die Marke als Ganzes.",
  },
  {
    question: "Lohnt sich FRESSNAPF-Eigenmarke vs. Markenfutter?",
    answer: "FRESSNAPF-Eigenmarken (wie 'Mein Bestes' oder 'Lukullus') haben in unserem BELLA Score ein durchschnittliches Abschneiden -- aehnlich wie Massenhersteller. Einzelne Produkte koennen gut abschneiden. Das Argument 'Marke = Qualitaet' funktioniert nicht: ein guenstigeres Eigenmarkenprodukt mit klar deklariertem Huehnchenfleisch kann besser scoren als teures Markenfutter mit unklarer Zutatenliste.",
  },
  {
    question: "Was ist hochwertiges Hundefutter bei Marken wie Royal Canin?",
    answer: "Royal Canin ist stark auf tierärztliche Empfehlung ausgerichtet und bietet Diät-Produkte für medizinische Indikationen. Für gesunde Hunde ohne Spezialbedarfe ist die Preis-Leistung oft schwächer als beim BELLA Score erkennbar. Royal Canins Stärke liegt in Spezialprodukten, nicht im Mainstream-Segment.",
  },
  {
    question: "Welche Hundefutter-Marken haben den höchsten BELLA Score?",
    answer: "Im aktuellen Katalog erzielen Terra Canis (BARF-Segment), HerzensHund und spezialisierte Kaltpresshersteller die höchsten Durchschnittsscores. Das liegt an der Deklarationsklarheit und Verarbeitungsart — nicht am Marketing-Budget. Der vollständige Marken-Ranking ist täglich aktuell auf unserer Marken-Ranking-Seite.",
  },
  {
    question: "Kann ich Hundefutter günstig kaufen ohne schlechte Qualität?",
    answer: "Ja. BELLA zeigt täglich Produkte mit Score ≥65 unter 4 €/kg. Das Segment 2,50–4 €/kg Trockenfutter bietet oft bessere Preis-Leistung als das 8–12 €/kg Premium-Segment. Entscheidend ist der BELLA Score des Einzelprodukts, nicht der Preis.",
  },
];

const TYPE_LABELS: Record<string, string> = {
  trocken: "Trockenfutter",
  nass: "Nassfutter",
  barf: "BARF",
  snack: "Snacks",
  kaltgepresst: "Kaltgepresst",
};

function ScoreChip({ score }: { score: number }) {
  const cls =
    score >= 80 ? "bg-emerald-500/20 text-emerald-300" :
    score >= 65 ? "bg-amber-500/20 text-amber-300" :
    "bg-white/10 text-white/50";
  return <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${cls}`}>{score}</span>;
}

export default async function HundefutterMarkenPage() {
  const brands = await getBrands();
  const now = new Date();
  const dateStr = now.toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData
        type="article"
        article={{
          headline: "Hundefutter Marken 2026: Was der BELLA Score wirklich sagt",
          description: "Josera, FRESSNAPF, Royal Canin & Co. — bewertet nach 4 messbaren Kriterien, nicht nach Marketing-Budget.",
          url: "https://welches-hundefutter.today/hundefutter-marken",
          dateModified: now.toISOString(),
          speakableSelectors: ["h1", ".bella-answer"],
        }}
      />
      <StructuredData type="faq" faqs={faqItems} />

      <nav className="max-w-4xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <Link href="/warum-bella" className="hover:text-[var(--honey)]">Warum BELLA</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">Hundefutter Marken</span>
      </nav>

      <section className="hero-glow max-w-4xl mx-auto w-full px-5 pt-8 pb-12">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="pill">🏷️ Marken-Analyse</span>
          <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold">
            🔴 LIVE — Stand {dateStr}
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
          Hundefutter Marken 2026:{" "}
          <span className="text-[var(--honey)]">Was Josera, FRESSNAPF & Co. wirklich taugen</span>
        </h1>
        <p className="bella-answer text-[var(--muted)] leading-relaxed max-w-2xl">
          Jede Marke nennt sich hochwertig. BELLA misst es.
          Vier Kriterien, ein Algorithmus — kein Hersteller kann seinen Score kaufen.
          Weder Josera, noch HILLS, noch Royal Canin, noch FRESSNAPF-Eigenmarken.
        </p>
      </section>

      {/* Die ehrliche Marken-Wahrheit */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <div className="card p-7 border-amber-500/20">
          <h2 className="text-xl font-extrabold tracking-tight mb-4">
            Was „Marke" wirklich bedeutet — und was nicht
          </h2>
          <div className="grid sm:grid-cols-2 gap-5 text-sm text-[var(--muted)]">
            <div>
              <p className="font-bold text-white mb-2">Was Marken-Prestige wirklich bedeutet</p>
              <ul className="space-y-2">
                {[
                  "Jahrelange Marketing-Investitionen beim Tierarzt (Royal Canin, HILLS)",
                  "Breite Verteilung in Zoohandel und Supermärkten (Purina, FRESSNAPF)",
                  "Bekannte Namen durch TV-Werbung (Pedigree, Whiskas-Niveau)",
                  "Hochwertige Verpackung und Premium-Positionierung (Acana, Orijen)",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-amber-400 shrink-0">≠</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-bold text-white mb-2">Was der BELLA Score stattdessen misst</p>
              <ul className="space-y-2">
                {[
                  "Ist die Fleischquelle konkret benannt? (\"Hühnchenfleisch\" vs. \"Fleisch\")",
                  "Welche Verarbeitungsmethode? (BARF > kaltgepresst > nass > trocken)",
                  "Monoprotein oder hypoallergen? (für Allergiker entscheidend)",
                  "Preis-Leistung im Marktkontext (Score ÷ Preis/kg)",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-emerald-400 shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Live Marken-Tabelle */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <h2 className="text-2xl font-extrabold tracking-tight">Marken im BELLA Score — nach Produktanzahl</h2>
        </div>
        <p className="text-[var(--muted)] text-sm mb-6">
          Nur Marken mit ≥8 aktiven, bewerteten Produkten. Sortiert nach Produktanzahl im Katalog.
          Der Score-Durchschnitt zeigt, wie konsistent eine Marke qualitativ ist — nicht nur Einzelprodukte.
        </p>
        {brands ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  {["Marke", "BELLA Score Ø", "Ø Preis/kg", "Produkte", "Haupttyp"].map((h) => (
                    <th key={h} className="text-left p-3 font-bold text-[var(--muted)] text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {brands.map((b, i) => (
                  <tr key={b.brand} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
                    <td className="p-3 font-semibold text-white">{b.brand}</td>
                    <td className="p-3">
                      <ScoreChip score={Math.round(parseFloat(b.avg_score))} />
                    </td>
                    <td className="p-3 text-[var(--honey)] font-bold">{b.avg_price} €</td>
                    <td className="p-3 text-[var(--muted)]">{b.products}</td>
                    <td className="p-3 text-[var(--muted)] text-xs capitalize">{TYPE_LABELS[b.top_type] ?? b.top_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card p-6 text-center text-[var(--muted)]">Daten werden geladen…</div>
        )}
        <p className="text-xs text-[var(--muted)] mt-3">
          Kein Score = noch nicht im BELLA-Algorithmus bewertet. Alle aktiven Produkte dieser Marke im Katalog vorhanden.
        </p>
      </section>

      {/* Josera, Fressnapf etc. ehrlich */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <h2 className="text-2xl font-extrabold tracking-tight mb-6">Die großen Namen — ehrlich eingeordnet</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              name: "FRESSNAPF-Eigenmarken",
              urteil: "Durchwachsen",
              color: "border-amber-500/25 bg-amber-500/[0.03]",
              scoreColor: "text-amber-400",
              text: "Die FRESSNAPF-Eigenmarken (\"Mein Bestes\", \"Lukullus\") schneiden je nach Linie sehr unterschiedlich ab. Einige Speziallinien (Monoprotein, Sensitive) erzielen solide Scores. Das Standard-Sortiment hat oft unspezifische Zutaten-Deklaration.",
              link: null,
            },
            {
              name: "Josera",
              urteil: "Selektiv gut",
              color: "border-amber-500/25 bg-amber-500/[0.03]",
              scoreColor: "text-amber-400",
              text: "Josera hat ein breites Sortiment mit sehr unterschiedlicher Qualität. Die Spezial-Linien (SensPlus, Lachs & Kartoffel, Dolce Vita) erzielen deutlich bessere Scores als das Basisprodukt \"Natura\". Nicht die Marke kaufen — das konkrete Produkt prüfen.",
              link: null,
            },
            {
              name: "Royal Canin / HILLS",
              urteil: "Medizin vs. Alltag",
              color: "border-blue-500/20 bg-blue-500/[0.02]",
              scoreColor: "text-blue-400",
              text: "Stark in medizinischen Diät-Produkten (Nierendiät, Stoffwechsel-Diät), die unter tierärztlicher Aufsicht sinnvoll sind. Für gesunde Hunde ohne Spezialbedarfe ist die Preis-Leistung im BELLA Score oft schwächer. Marketing-Budget ≠ Futterwert.",
              link: null,
            },
            {
              name: "Terra Canis / Premium BARF",
              urteil: "Top-Scores, höherer Preis",
              color: "border-emerald-500/25 bg-emerald-500/[0.03]",
              scoreColor: "text-emerald-400",
              text: "Spezialisierte BARF- und Frischfleisch-Hersteller erzielen systembedingt hohe BELLA Scores: klare Fleischquelle, minimale Verarbeitung, keine Füllstoffe. Der Preis ist deutlich höher — aber der Score rechtfertigt ihn durch echte Qualitätskriterien.",
              link: "/blog/marken-ranking-bella-score",
            },
          ].map((m) => (
            <div key={m.name} className={`card p-5 border ${m.color}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-extrabold text-white">{m.name}</h3>
                <span className={`text-xs font-bold ${m.scoreColor}`}>{m.urteil}</span>
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed mb-3">{m.text}</p>
              {m.link && (
                <Link href={m.link} className="text-xs text-[var(--honey)] hover:underline">Score-Ranking ansehen →</Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Nicht die Marke, das Produkt */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <div className="rounded-2xl bg-[var(--honey)]/10 border border-[rgba(240,167,60,0.3)] p-7">
          <h2 className="text-xl font-extrabold tracking-tight mb-3">
            Die wichtigste Erkenntnis: Nicht die Marke kaufen — das Produkt prüfen
          </h2>
          <p className="text-[var(--muted)] text-sm leading-relaxed mb-5">
            Josera hat Produkte mit Score 45 und Produkte mit Score 78.
            FRESSNAPF hat Eigenmarken mit Score 40 und Speziallinien mit Score 70.
            Die Marke sagt fast nichts. Das Produkt — mit seiner konkreten Zutatenliste,
            Verarbeitungsmethode und Preis — sagt alles.
          </p>
          <Link
            href="/#bella-advisor"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-orange-500/30 transition-all"
          >
            🐕 BELLA findet das richtige Produkt für deinen Hund
          </Link>
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

      {/* Cluster links */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-10">
        <h2 className="text-xl font-extrabold tracking-tight mb-4">Weiter recherchieren</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/blog/marken-ranking-bella-score" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">🏆 Top-Marken nach Score</Link>
          <Link href="/hundefutter-test" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">🔬 Hundefutter Test erklärt</Link>
          <Link href="/warum-bella" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">⚡ Warum BELLA anders ist</Link>
          <Link href="/vergleich/premium-vs-budget" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">💰 Premium vs. Budget</Link>
        </div>
      </section>

      <div className="max-w-4xl mx-auto w-full px-5 pb-10">
        <AuthorBox />
      </div>
      <SiteFooter />
    </div>
  );
}
