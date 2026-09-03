import type { Metadata } from "next";
import Link from "next/link";
import { BREEDS } from "@/data/breeds";
import { getAvgPricePerKgDry } from "@/db/queries/foods";
import { lifetimeFoodCost, representativeWeight, lifespanYears, fmtEur } from "@/lib/dogCost";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 86400;
const BASE = "https://welches-hundefutter.today";

export const metadata: Metadata = {
  title: "Was kostet ein Hund? Die teuersten & günstigsten Rassen 2026",
  description: "Was kostet dich dein Hund ein Leben lang – allein an Futter? Die Rangliste aller 186 Hunderassen, berechnet aus echten Preisen, Rasse-Gewicht und Lebenserwartung. Von der Dogge bis zum Chihuahua.",
  alternates: {
    canonical: `${BASE}/ratgeber/was-kostet-ein-hund`,
    languages: { "de-DE": `${BASE}/ratgeber/was-kostet-ein-hund`, "de-AT": `${BASE}/ratgeber/was-kostet-ein-hund`, "de-CH": `${BASE}/ratgeber/was-kostet-ein-hund`, "x-default": `${BASE}/ratgeber/was-kostet-ein-hund` },
  },
  openGraph: {
    title: "Die teuersten & günstigsten Hunderassen 2026 (Lebenszeit-Futterkosten)",
    description: "Rangliste aller 186 Rassen aus echten Futterpreisen. Was kostet dich dein Hund wirklich?",
    url: `${BASE}/ratgeber/was-kostet-ein-hund`,
    type: "article",
  },
};

interface Row {
  slug: string;
  name: string;
  size?: string;
  weight: number;
  years: number;
  lifetime: number;
}

export default async function HundekostenRanglistePage() {
  const avg = await getAvgPricePerKgDry();
  const today = new Date().toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });

  const rows: Row[] = BREEDS.map((b) => {
    const weight = representativeWeight(b);
    const years = lifespanYears(b);
    return { slug: b.slug, name: b.name, size: b.size, weight, years, lifetime: lifetimeFoodCost(weight, years, avg) };
  }).sort((a, b) => b.lifetime - a.lifetime);

  const most = rows[0];
  const least = rows[rows.length - 1];
  const median = rows[Math.floor(rows.length / 2)];
  const top = rows.slice(0, 10);
  const bottom = rows.slice(-10).reverse();

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Lebenszeit-Futterkosten aller ${rows.length} Hunderassen`,
    numberOfItems: rows.length,
    itemListElement: rows.slice(0, 50).map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: r.name,
      url: `${BASE}/rasse/${r.slug}`,
    })),
  };
  const breadcrumbs = [
    { name: "Start", url: `${BASE}/` },
    { name: "Ratgeber", url: `${BASE}/tipps` },
    { name: "Was kostet ein Hund?", url: `${BASE}/ratgeber/was-kostet-ein-hund` },
  ];

  const RowLine = ({ r, rank }: { r: Row; rank: number }) => (
    <Link
      href={`/rasse/${r.slug}`}
      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.04] transition-colors"
    >
      <span className="text-sm text-[var(--muted)] w-7 tabular-nums">{rank}.</span>
      <span className="flex-1 font-medium text-sm">{r.name}</span>
      <span className="text-xs text-[var(--muted)] hidden sm:block">{Math.round(r.weight)} kg · {r.years} J.</span>
      <span className="font-semibold text-sm tabular-nums w-24 text-right">{fmtEur(r.lifetime)} €</span>
    </Link>
  );

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <StructuredData type="breadcrumb" breadcrumbs={breadcrumbs} />

      <article className="max-w-3xl mx-auto w-full px-5 pt-12 pb-16">
        <nav className="text-sm text-[var(--muted)] mb-4">
          <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
          <span className="mx-2">·</span>
          <span className="text-[var(--ink)]">Was kostet ein Hund?</span>
        </nav>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--honey)]">Daten-Analyse</p>
        <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight">
          Was kostet ein Hund? Die teuersten und günstigsten Rassen 2026
        </h1>

        {/* Zitierfähiger Kernsatz */}
        <p className="mt-6 glass rounded-2xl px-5 py-4 text-[0.97rem] leading-relaxed border-l-2 border-[var(--honey)]">
          <strong>
            Ein {most.name} kostet über sein Leben rund {fmtEur(most.lifetime)} € — allein an Futter.
            Ein {least.name} dagegen nur etwa {fmtEur(least.lifetime)} €.
          </strong>{" "}
          <span className="text-[var(--muted)]">
            Das ergibt eine Auswertung der Lebenszeit-Futterkosten aller {rows.length} Hunderassen auf Basis
            echter Trockenfutter-Preise (Ø {avg.toFixed(2).replace(".", ",")} €/kg, Stand {today}, Quelle: welches-hundefutter.today).
          </span>
        </p>

        <p className="mt-6 text-[var(--muted)] leading-relaxed">
          Wer sich einen Hund anschafft, denkt selten an die Gesamtsumme. Dabei summieren sich allein die
          Futterkosten über ein Hundeleben zu vierstelligen, bei großen Rassen sogar fünfstelligen Beträgen.
          Wir haben für jede der {rows.length} Rassen den Energiebedarf (RER-Formel) und die typische
          Lebenserwartung mit dem aktuellen Durchschnittspreis für Trockenfutter verrechnet. Tierarzt,
          Versicherung und Zubehör sind dabei <strong>nicht</strong> eingerechnet — die echten Gesamtkosten
          liegen also noch deutlich höher. Der mittlere Wert (Median) liegt bei einem {median.name} mit rund {fmtEur(median.lifetime)} €.
        </p>

        {/* Teuerste */}
        <h2 className="mt-10 text-2xl font-extrabold tracking-tight">Die 10 teuersten Rassen (Lebenszeit-Futter)</h2>
        <div className="mt-4 glass-strong rounded-2xl p-2">
          {top.map((r, i) => <RowLine key={r.slug} r={r} rank={i + 1} />)}
        </div>

        {/* Günstigste */}
        <h2 className="mt-10 text-2xl font-extrabold tracking-tight">Die 10 günstigsten Rassen</h2>
        <div className="mt-4 glass-strong rounded-2xl p-2">
          {bottom.map((r, i) => <RowLine key={r.slug} r={r} rank={rows.length - 9 + i} />)}
        </div>

        {/* CTA zum Rechner */}
        <div className="mt-10 rounded-2xl p-6 text-center" style={{ background: "linear-gradient(135deg, rgba(240,167,60,0.14), rgba(255,138,76,0.10))" }}>
          <p className="font-semibold text-lg">Was kostet genau deine Rasse?</p>
          <p className="text-sm text-[var(--muted)] mt-1 mb-4">Mit Gewicht und Alter deines Hundes auf den Euro genau schätzen.</p>
          <Link href="/tools/lebenszeit-kosten" className="btn-primary rounded-xl px-6 py-3 text-sm font-semibold inline-block">
            Zum Lebenszeit-Rechner →
          </Link>
        </div>

        {/* Vollständige Tabelle */}
        <h2 className="mt-12 text-2xl font-extrabold tracking-tight">Alle {rows.length} Rassen im Überblick</h2>
        <p className="text-sm text-[var(--muted)] mt-1 mb-4">Sortiert nach Lebenszeit-Futterkosten, von teuer nach günstig.</p>
        <div className="glass rounded-2xl p-2">
          {rows.map((r, i) => <RowLine key={r.slug} r={r} rank={i + 1} />)}
        </div>

        <p className="mt-8 text-xs text-[var(--muted)] leading-relaxed">
          Methodik: Futtermenge je Rasse aus dem Energiebedarf (RER = 70 × kg^0,75 × Aktivitätsfaktor 1,6),
          multipliziert mit dem Durchschnittspreis aktiver Trockenfutter im Katalog und der typischen
          Lebenserwartung der Rasse. Schätzwerte; individuelle Kosten variieren je nach Futterwahl und Aktivität.
          Datenquelle und Berechnung: welches-hundefutter.today, Stand {today}.
        </p>
      </article>

      <SiteFooter />
    </div>
  );
}
