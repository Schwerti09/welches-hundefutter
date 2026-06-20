import type { Metadata } from "next";
import Link from "next/link";
import { neon } from "@neondatabase/serverless";
import StructuredData from "@/components/StructuredData";
import AuthorBox from "@/components/AuthorBox";
import SiteFooter from "@/components/SiteFooter";

// Täglich neu rendern — dieser Artikel lebt von Echtzeit-Daten
export const revalidate = 86400;

interface TypeStat {
  type: string;
  cnt: number;
  avg_price: string;
  min_price: string;
  median_price: string;
}

interface TopValue {
  name: string;
  brand: string;
  type: string;
  ppkg: string;
  score: number;
  affiliate_url: string;
}

interface PriceHistoryStat {
  rows: number;
  oldest: string;
  newest: string;
  avg_30d: string | null;
}

type TypeLabels = Record<string, string>;

async function getMarketData() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  const sql = neon(url);

  const [typeStats, topValue, phStat, totalStat] = await Promise.all([
    sql`
      SELECT type, COUNT(*)::int as cnt,
        ROUND(AVG(price_per_kg)::numeric, 2) as avg_price,
        ROUND(MIN(price_per_kg)::numeric, 2) as min_price,
        ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price_per_kg)::numeric, 2) as median_price
      FROM dog_foods
      WHERE is_active = true AND price_per_kg BETWEEN 1 AND 30
        AND type IN ('trocken', 'nass', 'barf', 'kaltgepresst')
      GROUP BY type ORDER BY cnt DESC`,
    sql`
      SELECT name, brand, type,
        ROUND(price_per_kg::numeric, 2) as ppkg,
        score, affiliate_url
      FROM dog_foods
      WHERE is_active = true AND price_per_kg BETWEEN 2 AND 12
        AND score IS NOT NULL AND score >= 70
      ORDER BY score DESC, price_per_kg ASC
      LIMIT 6`,
    sql`
      SELECT COUNT(*)::int as rows,
        MIN(recorded_at) as oldest,
        MAX(recorded_at) as newest
      FROM price_history`,
    sql`
      SELECT COUNT(*)::int as total,
        ROUND(AVG(price_per_kg)::numeric, 2) as avg_all
      FROM dog_foods WHERE is_active = true AND price_per_kg BETWEEN 1 AND 30`,
  ]);

  return {
    typeStats: typeStats as TypeStat[],
    topValue: topValue as TopValue[],
    phStat: phStat[0] as PriceHistoryStat,
    totalStat: totalStat[0] as { total: number; avg_all: string },
  };
}

export const metadata: Metadata = {
  title: "BELLA Preisbarometer 2026: Was kostet Hundefutter in Deutschland wirklich?",
  description:
    "Nicht Schätzwerte — echte Daten: Durchschnittspreise, Preisspannen und die besten Preis-Leistungs-Werte aus 8.600+ aktiven Hundefutter-Produkten. Live-Auswertung.",
  alternates: {
    canonical: "https://welches-hundefutter.today/blog/preisbarometer-2026",
    languages: {
      "de-DE": "https://welches-hundefutter.today/blog/preisbarometer-2026",
      "de-AT": "https://welches-hundefutter.today/blog/preisbarometer-2026",
      "de-CH": "https://welches-hundefutter.today/blog/preisbarometer-2026",
      "x-default": "https://welches-hundefutter.today/blog/preisbarometer-2026",
    },
  },
  openGraph: {
    title: "BELLA Preisbarometer: Was kostet Hundefutter heute wirklich?",
    description: "Live-Auswertung aus 8.600+ aktiven Produkten. Keine Schätzwerte.",
    type: "article",
  },
};

const TYPE_LABELS: TypeLabels = {
  trocken: "Trockenfutter",
  nass: "Nassfutter",
  barf: "BARF / Rohfutter",
  kaltgepresst: "Kaltgepresst",
};

const TYPE_COLORS: Record<string, string> = {
  trocken: "text-amber-300",
  nass: "text-blue-300",
  barf: "text-rose-300",
  kaltgepresst: "text-emerald-300",
};

const faqItems = [
  {
    question: "Warum sind die Preise so unterschiedlich?",
    answer: "Hundefutter-Preise variieren enorm durch Rohstoffqualität, Verarbeitungsart, Packungsgröße und Marken-Positionierung. Trockenfutter in Großgebinden kostet ab 2 €/kg, BARF-Menüs aus Premiumfleisch bis zu 20 €/kg — beide 'Trockenfutter' oder 'BARF' kann also eine Preisspanne von 1:10 bedeuten.",
  },
  {
    question: "Was bedeutet €/kg bei Nassfutter?",
    answer: "Nassfutter enthält 70–85 % Wasser. Ein €/kg-Vergleich direkt mit Trockenfutter (10 % Wasser) ist irreführend. Auf Trockenmasse umgerechnet ist Nassfutter 3–4× teurer als sein Preis suggeriert — trotzdem kann es sinnvoll sein für Hunde die wenig trinken.",
  },
  {
    question: "Wie oft werden diese Daten aktualisiert?",
    answer: "Unser AWIN-Feed wird täglich um 05:00 Uhr synchronisiert. Die Preise in dieser Analyse spiegeln den Stand des letzten Tages-Imports wider. Der BELLA Preis-Wecker informiert dich, wenn ein bestimmtes Futter günstiger wird.",
  },
];

export default async function PreisbarometerPage() {
  const data = await getMarketData();
  const now = new Date();
  const dateStr = now.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData
        type="article"
        article={{
          headline:
            "BELLA Preisbarometer 2026: Was kostet Hundefutter in Deutschland wirklich?",
          description:
            "Live-Auswertung aus 8.600+ aktiven Produkten — keine Schätzwerte, echte Marktdaten.",
          url: "https://welches-hundefutter.today/blog/preisbarometer-2026",
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
        <span className="text-[var(--ink)]">Preisbarometer</span>
      </nav>

      <section className="hero-glow max-w-4xl mx-auto w-full px-5 pt-8 pb-12">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="pill">📊 BELLA Intelligence</span>
          <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold">
            🔴 LIVE — Stand {dateStr}, {timeStr} Uhr
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
          Was kostet Hundefutter in Deutschland gerade wirklich?
        </h1>
        <p className="bella-answer text-[var(--muted)] leading-relaxed max-w-2xl mb-6">
          Keine Schätzwerte. Keine Hersteller-Aussagen. Diese Analyse basiert auf{" "}
          <strong className="text-white">{data?.totalStat.total.toLocaleString("de-DE") ?? "8.600+"}</strong> aktiven
          Produkten aus unserem Live-Katalog — täglich aktualisiert aus dem AWIN-Feed.
        </p>

        {data && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="card p-4 text-center">
              <p className="text-2xl font-black text-[var(--honey)]">{data.totalStat.avg_all} €</p>
              <p className="text-xs text-[var(--muted)] mt-1">Ø Preis/kg (alle Typen)</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-black text-white">{data.totalStat.total.toLocaleString("de-DE")}</p>
              <p className="text-xs text-[var(--muted)] mt-1">Aktive Produkte</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-black text-emerald-400">{data.phStat.rows.toLocaleString("de-DE")}</p>
              <p className="text-xs text-[var(--muted)] mt-1">Preis-Datenpunkte</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-black text-blue-400">täglich</p>
              <p className="text-xs text-[var(--muted)] mt-1">Update-Frequenz</p>
            </div>
          </div>
        )}
      </section>

      {/* LIVE: Preise nach Futtertyp */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <h2 className="text-2xl font-extrabold tracking-tight">Live-Preise nach Futtertyp</h2>
          <span className="text-xs text-[var(--muted)]">Stand {dateStr}</span>
        </div>

        {data ? (
          <div className="space-y-3">
            {data.typeStats.map((s) => {
              const pct = Math.min(100, (parseFloat(s.avg_price) / 20) * 100);
              return (
                <div key={s.type} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className={`font-bold ${TYPE_COLORS[s.type] ?? "text-white"}`}>
                        {TYPE_LABELS[s.type] ?? s.type}
                      </span>
                      <span className="text-xs text-[var(--muted)] ml-2">
                        {s.cnt.toLocaleString("de-DE")} Produkte
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-white">{s.avg_price} €/kg</span>
                      <span className="text-xs text-[var(--muted)] block">Ø Preis</span>
                    </div>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-[var(--muted)]">
                    <span>Ab {s.min_price} €/kg</span>
                    <span>Median: {s.median_price} €/kg</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card p-6 text-center text-[var(--muted)]">
            Daten werden geladen…
          </div>
        )}
      </section>

      {/* Context: Was bedeutet das? */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <div className="card p-7">
          <h2 className="text-xl font-extrabold tracking-tight mb-4">Was diese Zahlen bedeuten</h2>
          <div className="space-y-4 text-[var(--muted)] text-sm leading-relaxed">
            <p>
              Der Durchschnitt aller Typen täuscht: Ein Trockenfutter für 2 €/kg und eines für 22 €/kg sind beide
              "Trockenfutter" — der Markt ist extrem heterogen. Was die Zahlen zeigen:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex gap-2">
                <span className="text-amber-400 shrink-0">▶</span>
                <span>
                  <strong className="text-white">Trockenfutter</strong> hat die größte Preisspanne. Günstige Supermarkt-Sorten
                  drücken den Durchschnitt, Premium-Kibble treibt ihn nach oben. Der Median ist aussagekräftiger als der
                  Durchschnitt.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400 shrink-0">▶</span>
                <span>
                  <strong className="text-white">Nassfutter</strong> muss auf Trockenmasse umgerechnet werden.
                  13 €/kg Nassfutter entsprechen ca. 50–65 €/kg Trockenmasse — teurer als die meisten Premium-Trockenfutter.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-rose-400 shrink-0">▶</span>
                <span>
                  <strong className="text-white">BARF</strong> schlägt beim Rohpreis Nassfutter deutlich. Aber: BARF erfordert
                  Zusatzwissen und ergänzende Komponenten (Öle, Mineralien). Der Gesamtpreis liegt höher als der
                  Produktpreis suggeriert.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Live: Beste Preis-Leistung heute */}
      {data && data.topValue.length > 0 && (
        <section className="max-w-4xl mx-auto w-full px-5 pb-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <h2 className="text-2xl font-extrabold tracking-tight">
              Beste Preis-Leistung heute — BELLA Score ≥ 70, unter 12 €/kg
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {data.topValue.map((f, i) => (
              <a
                key={i}
                href={f.affiliate_url}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="card p-4 hover:border-[rgba(240,167,60,0.4)] transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  {i === 0 && (
                    <span className="text-[10px] bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full font-black">
                      🏆 BESTES P/L
                    </span>
                  )}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-[var(--muted)] capitalize">{f.type}</span>
                  <span className="ml-auto text-xs font-bold text-emerald-400">Score {f.score}</span>
                </div>
                <p className="text-sm font-semibold text-white leading-snug mb-1 line-clamp-2">{f.name}</p>
                <p className="text-xs text-[var(--muted)] mb-2">{f.brand}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-[var(--honey)]">{f.ppkg} €/kg</span>
                  <span className="text-xs text-[var(--honey)] group-hover:underline">Zum Futter →</span>
                </div>
              </a>
            ))}
          </div>
          <p className="text-[11px] text-[var(--muted)] mt-3">
            Affiliate-Links · *Werbung · Live-Daten aus unserem Katalog, täglich aktualisiert
          </p>
        </section>
      )}

      {/* Methodik */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <div className="card p-7 border border-purple-500/20">
          <h2 className="text-xl font-extrabold tracking-tight mb-4 text-purple-300">
            🔬 Methodik: Wie wir messen
          </h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">
            Alle Preise stammen aus dem AWIN Affiliate-Feed (Publisher ID 615299) und werden täglich
            um 05:00 Uhr UTC automatisch aktualisiert. Produkte mit Preisen unter 1 €/kg oder über 30 €/kg
            werden aus der Durchschnittsberechnung ausgeschlossen (statistische Ausreißer).
          </p>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">
            Die Preishistorie umfasst{" "}
            <strong className="text-white">
              {data?.phStat.rows.toLocaleString("de-DE") ?? "9.358"} Datenpunkte
            </strong>{" "}
            seit dem{" "}
            {data?.phStat.oldest
              ? new Date(data.phStat.oldest).toLocaleDateString("de-DE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "25. März 2026"}
            . Ein neuer Preis wird nur gespeichert, wenn er sich vom zuletzt erfassten Wert unterscheidet
            (Änderungs-Snapshot, kein vollständiger täglicher Dump).
          </p>
          <Link href="/quellen" className="text-xs text-[var(--honey)] hover:underline">
            Vollständige Methodik und Quellen →
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
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">
            Zu viel Theorie? BELLA findet das Beste für deinen Hund
          </h2>
          <p className="text-[var(--muted)] mb-6 max-w-lg">
            Erzähl BELLA von deinem Hund — Rasse, Alter, Budget. Sie filtert in Echtzeit aus dem
            gleichen Katalog, auf dem diese Analyse basiert.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/#bella-advisor"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
            >
              🐕 Jetzt Futter finden
            </Link>
            <Link
              href="/preis-wecker"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/15 transition-all"
            >
              ⏰ Preis-Wecker aktivieren
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto w-full px-5 pb-10">
        <h2 className="text-xl font-extrabold tracking-tight mb-4">Weitere BELLA Intelligence Reports</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/blog/marken-ranking-bella-score" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">
            📊 Marken-Ranking nach BELLA Score
          </Link>
          <Link href="/blog/marktbericht-hundefutter-2026" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">
            🗂️ Marktbericht Hundefutter 2026
          </Link>
          <Link href="/vergleich" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">
            ⚖️ Futtertypen im Vergleich
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
