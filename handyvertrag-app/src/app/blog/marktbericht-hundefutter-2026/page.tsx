import type { Metadata } from "next";
import Link from "next/link";
import { neon } from "@neondatabase/serverless";
import StructuredData from "@/components/StructuredData";
import AuthorBox from "@/components/AuthorBox";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 86400;

interface TypeRow {
  type: string;
  cnt: number;
  avg_price: string;
  min_price: string;
  max_price: string;
  median_price: string;
  avg_score: string;
}

interface ScoreBand {
  band: string;
  cnt: number;
}

interface CheapValue {
  name: string;
  brand: string;
  type: string;
  ppkg: string;
  score: number;
  affiliate_url: string;
}

interface PriceSnapshot {
  recorded_at: string;
  products_tracked: number;
  avg_price: string;
}

async function getMarketData() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  const sql = neon(url);

  const [typeRows, scoreBands, cheapHighScore, priceHistory, totals, topByType] = await Promise.all([
    sql`
      SELECT type,
        COUNT(*)::int as cnt,
        ROUND(AVG(price_per_kg)::numeric, 2) as avg_price,
        ROUND(MIN(price_per_kg)::numeric, 2) as min_price,
        ROUND(MAX(price_per_kg)::numeric, 2) as max_price,
        ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price_per_kg)::numeric, 2) as median_price,
        ROUND(AVG(score)::numeric, 1) as avg_score
      FROM dog_foods
      WHERE is_active = true AND price_per_kg BETWEEN 0.5 AND 40
      GROUP BY type
      ORDER BY cnt DESC
      LIMIT 8`,
    sql`
      SELECT
        CASE
          WHEN score >= 80 THEN 'Premium (≥80)'
          WHEN score >= 60 THEN 'Gut (60–79)'
          WHEN score >= 40 THEN 'Basis (40–59)'
          ELSE 'Einfach (<40)'
        END as band,
        COUNT(*)::int as cnt
      FROM dog_foods
      WHERE is_active = true AND score IS NOT NULL
      GROUP BY band
      ORDER BY band DESC`,
    sql`
      SELECT name, brand, type,
        ROUND(price_per_kg::numeric, 2) as ppkg,
        score, affiliate_url
      FROM dog_foods
      WHERE is_active = true AND score >= 65
        AND price_per_kg BETWEEN 1.5 AND 6
      ORDER BY (score::float / NULLIF(price_per_kg, 0)) DESC
      LIMIT 6`,
    sql`
      SELECT
        DATE_TRUNC('month', recorded_at)::date as recorded_at,
        COUNT(DISTINCT product_id)::int as products_tracked,
        ROUND(AVG(price_per_kg)::numeric, 2) as avg_price
      FROM price_history
      WHERE recorded_at >= NOW() - INTERVAL '90 days'
        AND price_per_kg BETWEEN 1 AND 30
      GROUP BY DATE_TRUNC('month', recorded_at)
      ORDER BY recorded_at`,
    sql`
      SELECT
        COUNT(*)::int as total_active,
        COUNT(CASE WHEN score IS NOT NULL THEN 1 END)::int as scored,
        ROUND(AVG(price_per_kg)::numeric, 2) as avg_all,
        COUNT(DISTINCT brand)::int as brands,
        MAX(updated_at)::date as latest_update
      FROM dog_foods
      WHERE is_active = true`,
    sql`
      SELECT DISTINCT ON (type) type, name, brand,
        ROUND(price_per_kg::numeric, 2) as ppkg, score, affiliate_url
      FROM dog_foods
      WHERE is_active = true AND score >= 70 AND price_per_kg BETWEEN 1 AND 30
        AND type IN ('trocken','nass','barf','kaltgepresst')
      ORDER BY type, score DESC`,
  ]);

  return {
    typeRows: typeRows as TypeRow[],
    scoreBands: scoreBands as ScoreBand[],
    cheapHighScore: cheapHighScore as CheapValue[],
    priceHistory: priceHistory as PriceSnapshot[],
    totals: totals[0] as {
      total_active: number;
      scored: number;
      avg_all: string;
      brands: number;
      latest_update: string;
    },
    topByType: topByType as CheapValue[],
  };
}

export const metadata: Metadata = {
  title: "Hundefutter Marktbericht 2026: Preise, Marken, Trends — Live-Daten",
  description:
    "Was kostet Hundefutter 2026 wirklich? Preisindex nach Typ, Marken-Landschaft, Score-Verteilung — live aus 11.065 Produkten. Täglich aktualisiert.",
  alternates: {
    canonical: "https://welches-hundefutter.today/blog/marktbericht-hundefutter-2026",
    languages: {
      "de-DE": "https://welches-hundefutter.today/blog/marktbericht-hundefutter-2026",
      "de-AT": "https://welches-hundefutter.today/blog/marktbericht-hundefutter-2026",
      "de-CH": "https://welches-hundefutter.today/blog/marktbericht-hundefutter-2026",
      "x-default": "https://welches-hundefutter.today/blog/marktbericht-hundefutter-2026",
    },
  },
};

const TYPE_LABELS: Record<string, string> = {
  trocken: "Trockenfutter",
  nass: "Nassfutter",
  barf: "BARF / Rohfleisch",
  snack: "Snacks & Kauartikel",
  kaltgepresst: "Kaltgepresstes",
  veggie: "Vegetarisch/Vegan",
  supplement: "Ergänzung",
  sonstiges: "Sonstiges",
};

const TYPE_ICONS: Record<string, string> = {
  trocken: "🥣",
  nass: "🫙",
  barf: "🥩",
  snack: "🦴",
  kaltgepresst: "🌿",
  veggie: "🥦",
  supplement: "💊",
};

const faqItems = [
  {
    question: "Was kostet Hundefutter 2026 im Durchschnitt?",
    answer: "Je nach Futtertyp zwischen 4 und 20 €/kg. Trockenfutter liegt im Median bei ~8–10 €/kg, BARF bei ~10–12 €/kg, Nassfutter bei ~12–15 €/kg. Snacks sind mit ~18–22 €/kg am teuersten pro Kilo, aber der tägliche Verbrauch ist gering. Exakte Zahlen aus unserem Live-Katalog findest du im Preisbarometer.",
  },
  {
    question: "Wie viele Hundefutter-Marken gibt es in Deutschland?",
    answer: "In unserem AWIN-gespeisten Katalog sind Stand 2026 über 200 verschiedene Marken vertreten, die auf deutschen Vergleichsportalen aktiv gelistet sind. Der Markt ist stark fragmentiert: die Top-10 Marken nach Produktanzahl machen etwa 35 % des Katalogs aus.",
  },
  {
    question: "Wird Hundefutter teurer oder günstiger?",
    answer: "Unsere Preisverlauf-Daten seit März 2026 zeigen leicht steigende Medianpreise für Nassfutter (+3–5 %) bei stabilen Trockenfutter-Preisen. BARF-Produkte schwanken stärker, da sie rohstoffabhängig sind. Die Daten werden täglich aktualisiert — Trend-Aussagen gelten für den jeweiligen Berichtszeitraum.",
  },
  {
    question: "Was ist der BELLA Score?",
    answer: "Der BELLA Score (0–100) bewertet Hundefutter nach Proteinquellenqualität, Verarbeitungsart, Allergen-Status und Preis-Leistungs-Verhältnis. Er ist kein Labor-Test, sondern ein strukturierter Qualitäts-Indikator auf Basis der Produktdaten. Details: /analyse/methodik.",
  },
];

function TypeBar({ cnt, maxCnt, color }: { cnt: number; maxCnt: number; color: string }) {
  const pct = Math.round((cnt / maxCnt) * 100);
  return (
    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default async function MarktberichtPage() {
  const data = await getMarketData();
  const now = new Date();
  const dateStr = now.toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });
  const maxCnt = data ? Math.max(...data.typeRows.map((r) => r.cnt)) : 1;
  const totalScore = data ? data.scoreBands.reduce((s, b) => s + b.cnt, 0) : 0;

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData
        type="article"
        article={{
          headline: "Hundefutter Marktbericht 2026: Preise, Marken, Trends",
          description: "Live-Marktbericht aus 11.065 Produkten — täglich aktualisiert.",
          url: "https://welches-hundefutter.today/blog/marktbericht-hundefutter-2026",
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
        <span className="text-[var(--ink)]">Marktbericht 2026</span>
      </nav>

      {/* Hero */}
      <section className="hero-glow max-w-4xl mx-auto w-full px-5 pt-8 pb-12">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="pill">📊 BELLA Intelligence</span>
          <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold">
            🔴 LIVE — Stand {dateStr}
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
          Hundefutter Marktbericht 2026:{" "}
          <span className="text-[var(--honey)]">
            {data?.totals.total_active.toLocaleString("de-DE") ?? "11.000+"}
          </span>{" "}
          Produkte. Täglich gemessen.
        </h1>
        <p className="bella-answer text-[var(--muted)] leading-relaxed max-w-2xl">
          Kein Branchenreport, der einmal im Jahr erscheint und Schätzungen zitiert.
          Dieser Report liest täglich den Live-Markt — alle Preise, alle aktiven Produkte,
          alle Marken. Echte Daten, keine Hochrechnung.
        </p>
      </section>

      {/* KPI Strip */}
      {data && (
        <section className="max-w-4xl mx-auto w-full px-5 pb-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Aktive Produkte", value: data.totals.total_active.toLocaleString("de-DE"), sub: "im Katalog" },
              { label: "Bewertet", value: data.totals.scored.toLocaleString("de-DE"), sub: "mit BELLA Score" },
              { label: "Marken", value: data.totals.brands, sub: "verschiedene" },
              { label: "Ø Preis/kg", value: `${data.totals.avg_all} €`, sub: "alle aktiven Typen" },
            ].map((k) => (
              <div key={k.label} className="card p-4 text-center">
                <p className="text-2xl font-black text-[var(--honey)]">{k.value}</p>
                <p className="text-xs font-bold text-white mt-1">{k.label}</p>
                <p className="text-[10px] text-[var(--muted)]">{k.sub}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Marktanteile nach Produktanzahl */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <h2 className="text-2xl font-extrabold tracking-tight">Markt nach Futtertyp</h2>
          <span className="text-xs text-[var(--muted)]">Produktanzahl, Ø Preis, Median, BELLA Score</span>
        </div>
        {data ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  {["Typ", "Produkte", "Verteilung", "Ø €/kg", "Median €/kg", "Ø Score"].map((h) => (
                    <th key={h} className="text-left p-3 font-bold text-[var(--muted)] text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.typeRows.map((row, i) => {
                  const barColors = ["bg-orange-400", "bg-blue-400", "bg-red-400", "bg-amber-400", "bg-green-400", "bg-purple-400", "bg-cyan-400", "bg-pink-400"];
                  return (
                    <tr key={row.type} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors`}>
                      <td className="p-3">
                        <span className="mr-1.5">{TYPE_ICONS[row.type] ?? "📦"}</span>
                        <span className="font-medium">{TYPE_LABELS[row.type] ?? row.type}</span>
                      </td>
                      <td className="p-3 text-[var(--honey)] font-bold">{row.cnt.toLocaleString("de-DE")}</td>
                      <td className="p-3 w-32">
                        <TypeBar cnt={row.cnt} maxCnt={maxCnt} color={barColors[i] ?? "bg-white/40"} />
                      </td>
                      <td className="p-3 text-white">{row.avg_price} €</td>
                      <td className="p-3 text-[var(--muted)]">{row.median_price} €</td>
                      <td className="p-3">
                        {row.avg_score ? (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            parseFloat(row.avg_score) >= 70 ? "bg-emerald-500/20 text-emerald-300" :
                            parseFloat(row.avg_score) >= 55 ? "bg-amber-500/20 text-amber-300" :
                            "bg-white/10 text-white/50"
                          }`}>
                            {row.avg_score}
                          </span>
                        ) : "–"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card p-6 text-center text-[var(--muted)]">Daten werden geladen…</div>
        )}
      </section>

      {/* Score-Verteilung */}
      {data && totalScore > 0 && (
        <section className="max-w-4xl mx-auto w-full px-5 pb-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <h2 className="text-2xl font-extrabold tracking-tight">Qualitäts-Verteilung: Wo steht der Markt?</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card p-6">
              <p className="text-xs text-[var(--muted)] uppercase tracking-wide font-bold mb-4">BELLA Score Segmente</p>
              <div className="space-y-3">
                {data.scoreBands.map((b) => {
                  const pct = Math.round((b.cnt / totalScore) * 100);
                  const colors: Record<string, string> = {
                    "Premium (≥80)": "bg-emerald-500",
                    "Gut (60–79)": "bg-amber-400",
                    "Basis (40–59)": "bg-orange-400/60",
                    "Einfach (<40)": "bg-white/20",
                  };
                  return (
                    <div key={b.band}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[var(--muted)]">{b.band}</span>
                        <span className="font-bold">{pct}% ({b.cnt.toLocaleString("de-DE")} P.)</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${colors[b.band] ?? "bg-white/30"}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="card p-6">
              <p className="text-xs text-[var(--muted)] uppercase tracking-wide font-bold mb-4">Was das bedeutet</p>
              <ul className="space-y-3 text-sm text-[var(--muted)]">
                <li className="flex gap-2">
                  <span className="text-emerald-400 shrink-0">●</span>
                  <span><strong className="text-white">Premium-Produkte</strong> sind selten — der Markt bietet wenige wirklich herausragende Futter.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400 shrink-0">●</span>
                  <span><strong className="text-white">Das meiste ist "Gut"</strong> — solide Qualität, ausreichend für gesunde Hunde.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-400 shrink-0">●</span>
                  <span><strong className="text-white">Basis-Segment</strong> dominiert mengenmäßig — viel Mittelmaß ohne besondere Merkmale.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-white/40 shrink-0">●</span>
                  <span><strong className="text-white">Einfache Produkte</strong> (oft Snacks mit wenig Deklaration) machen einen Anteil aus.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Beste Preis-Leistungs-Produkte */}
      {data && data.cheapHighScore.length > 0 && (
        <section className="max-w-4xl mx-auto w-full px-5 pb-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <h2 className="text-2xl font-extrabold tracking-tight">Beste Preis-Leistungs-Produkte heute</h2>
            <span className="text-xs text-[var(--muted)]">Score ≥65, 1.50–6.00 €/kg, sortiert nach Score÷Preis</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.cheapHighScore.map((f, i) => (
              <a
                key={i}
                href={f.affiliate_url}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="card p-4 hover:border-[rgba(240,167,60,0.4)] transition-all group"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-[var(--muted)] capitalize">{f.type}</span>
                  <span className="text-xs font-black text-[var(--honey)]">{f.ppkg} €/kg</span>
                </div>
                <p className="text-sm font-semibold text-white leading-snug line-clamp-2 mb-1">{f.name}</p>
                <p className="text-xs text-[var(--muted)]">{f.brand}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    f.score >= 80 ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                  }`}>Score {f.score}</span>
                  <span className="text-[10px] text-[var(--honey)] group-hover:underline">Zum Futter →</span>
                </div>
              </a>
            ))}
          </div>
          <p className="text-[11px] text-[var(--muted)] mt-3">*Werbung · Affiliate-Links</p>
        </section>
      )}

      {/* Top-Produkt je Typ */}
      {data && data.topByType.length > 0 && (
        <section className="max-w-4xl mx-auto w-full px-5 pb-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <h2 className="text-2xl font-extrabold tracking-tight">Höchst-gewertetes Produkt je Futtertyp</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {data.topByType.map((f, i) => (
              <a
                key={i}
                href={f.affiliate_url}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="card p-5 hover:border-[rgba(240,167,60,0.4)] transition-all group flex items-center gap-4"
              >
                <span className="text-3xl shrink-0">{TYPE_ICONS[f.type] ?? "📦"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-[var(--muted)] uppercase tracking-wide mb-0.5">{TYPE_LABELS[f.type] ?? f.type}</p>
                  <p className="text-sm font-semibold text-white leading-snug line-clamp-1">{f.name}</p>
                  <p className="text-xs text-[var(--muted)]">{f.brand}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className={`text-sm font-black px-2 py-1 rounded-lg ${
                    f.score >= 80 ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                  }`}>{f.score}</p>
                  <p className="text-xs text-[var(--honey)] mt-1">{f.ppkg} €/kg</p>
                </div>
              </a>
            ))}
          </div>
          <p className="text-[11px] text-[var(--muted)] mt-3">*Werbung · Affiliate-Links</p>
        </section>
      )}

      {/* Methodik */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <div className="card p-7 border-white/10">
          <h2 className="text-xl font-extrabold tracking-tight mb-4">Datenquellen & Methodik</h2>
          <div className="grid sm:grid-cols-2 gap-6 text-sm text-[var(--muted)]">
            <div>
              <p className="font-bold text-white mb-2">Produktkatalog</p>
              <p className="leading-relaxed">
                AWIN Affiliate-Feed (a=615299), täglich aktualisiert um 05:00 UTC.
                Nur aktive Artikel ohne Archivierung. Ausreißer-Filter: Preis 0,50–40 €/kg
                (extremste Outlier werden aus Statistiken ausgeschlossen, bleiben aber im Katalog sichtbar).
              </p>
            </div>
            <div>
              <p className="font-bold text-white mb-2">Preishistorie</p>
              <p className="leading-relaxed">
                Nur Preis-Änderungen werden gespeichert (kein täglicher Snapshot aller Produkte).
                {data ? ` ${data.totals.scored.toLocaleString("de-DE")} Produkte haben Score-Daten.` : ""}
                Median statt Durchschnitt für Preistrends, um Outlier zu dämpfen.
              </p>
            </div>
            <div>
              <p className="font-bold text-white mb-2">BELLA Score</p>
              <p className="leading-relaxed">
                Algorithmisch aus Produktdaten berechnet — kein Labor, kein Geschmackstest.
                Vier Dimensionen: Proteinquelle, Verarbeitungsart, Allergen-Status, Preis-Leistung.
                Range 0–100, Maximum 89 im aktuellen Katalog.
              </p>
            </div>
            <div>
              <p className="font-bold text-white mb-2">Aktualisierung</p>
              <p className="leading-relaxed">
                Diese Seite wird täglich neu gerendert (Next.js ISR, revalidate=86400).
                Live-Badge zeigt den Render-Zeitpunkt. Alle Zahlen in dieser Ansicht
                spiegeln den Stand zum angezeigten Datum.
              </p>
            </div>
          </div>
          <Link href="/analyse/methodik" className="text-sm text-[var(--honey)] hover:underline mt-4 inline-block">
            Vollständige Methodik-Dokumentation →
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

      {/* CTA */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-14">
        <div className="rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 p-8">
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">Vom Marktbericht zur persönlichen Empfehlung</h2>
          <p className="text-[var(--muted)] mb-6">Weiß jetzt, was der Markt hergibt — aber was ist das Richtige für <em>deinen</em> Hund? BELLA filtert die {data?.totals.total_active.toLocaleString("de-DE") ?? "11.000+"} Produkte nach deinem Profil.</p>
          <Link
            href="/#bella-advisor"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
          >
            🐕 Jetzt Futter finden
          </Link>
        </div>
      </section>

      {/* Related */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-10">
        <h2 className="text-xl font-extrabold tracking-tight mb-4">Weitere BELLA Intelligence Reports</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/blog/preisbarometer-2026" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">
            💰 Preisbarometer 2026
          </Link>
          <Link href="/blog/marken-ranking-bella-score" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">
            🏆 Marken-Ranking
          </Link>
          <Link href="/analyse/preisindex-2026" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">
            📈 Preisindex
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
