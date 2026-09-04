import type { Metadata } from "next";
import Link from "next/link";
import { neon } from "@neondatabase/serverless";
import SiteFooter from "@/components/SiteFooter";
import StructuredData from "@/components/StructuredData";
import JsonLd from "@/components/JsonLd";
import { DATA_REFRESHED } from "@/lib/site-dates";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Hundefutter-Preisindex 2026: Welche Marken wurden teurer? | BELLA",
  description: "BELLA analysiert 6.700+ Preis-Snapshots aus dem AWIN-Feed: welche Hundefutter-Typen teurer wurden, welche günstiger, und was das für deinen Geldbeutel bedeutet.",
  alternates: {
    canonical: "https://welches-hundefutter.today/analyse/preisindex-2026",
    languages: {
      "de-DE": "https://welches-hundefutter.today/analyse/preisindex-2026",
      "de-AT": "https://welches-hundefutter.today/analyse/preisindex-2026",
      "de-CH": "https://welches-hundefutter.today/analyse/preisindex-2026",
      "x-default": "https://welches-hundefutter.today/analyse/preisindex-2026",
    },
  },
  openGraph: {
    title: "Hundefutter-Preisindex 2026 — Echte Preisdaten aus dem gesamten aktiven Katalog",
    description: "Welche Futtertypen sind 2026 teurer geworden? BELLA hat über 6.700 Preis-Snapshots ausgewertet.",
  },
};

interface TypeStat {
  type: string;
  avg_price: number;
  min_price: number;
  max_price: number;
  product_count: number;
}

interface PriceMovement {
  food_slug: string;
  food_name: string;
  first_price: number;
  last_price: number;
  change_pct: number;
  snapshots: number;
}

interface SnapshotStat {
  total_snapshots: number;
  distinct_products: number;
  first_snapshot: string;
  last_snapshot: string;
  avg_price_all: number;
}

interface CompositionStat {
  total: number; with_meat: number; avg_meat: number | null; avg_meat_premium: number | null;
  pct_grain_free: number; pct_monoprotein: number; pct_hypo: number; pct_named_protein: number;
}
interface ProteinStat { protein: string; n: number; }

async function getData() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  try {
    const sql = neon(url);

    const [meta, typeStats, risers, fallers, composition, proteins] = await Promise.all([
      // Übersicht
      sql`SELECT
        count(*)::int AS total_snapshots,
        count(DISTINCT food_slug)::int AS distinct_products,
        min(recorded_at)::date::text AS first_snapshot,
        max(recorded_at)::date::text AS last_snapshot,
        round(avg(price_per_kg)::numeric, 2)::float AS avg_price_all
      FROM price_history`,

      // Durchschnittspreise nach Typ
      sql`SELECT
        d.type,
        round(avg(d.price_per_kg)::numeric, 2)::float AS avg_price,
        round(min(d.price_per_kg)::numeric, 2)::float AS min_price,
        round(max(d.price_per_kg)::numeric, 2)::float AS max_price,
        count(*)::int AS product_count
      FROM dog_foods d
      WHERE d.is_active = true AND d.price_per_kg IS NOT NULL AND d.price_per_kg > 0
        AND d.type NOT IN ('snack')
      GROUP BY d.type
      ORDER BY avg_price DESC`,

      // Stärkste Preissteigerer (mind. 3 Snapshots)
      sql`SELECT
        ph.food_slug,
        d.name AS food_name,
        round(min(ph.price_per_kg)::numeric, 2)::float AS first_price,
        round(max(ph.price_per_kg)::numeric, 2)::float AS last_price,
        round(((max(ph.price_per_kg) - min(ph.price_per_kg)) / min(ph.price_per_kg) * 100)::numeric, 1)::float AS change_pct,
        count(*)::int AS snapshots
      FROM price_history ph
      JOIN dog_foods d ON d.slug = ph.food_slug
      WHERE d.is_active = true AND ph.price_per_kg > 0
      GROUP BY ph.food_slug, d.name
      HAVING count(*) >= 3 AND max(ph.price_per_kg) > min(ph.price_per_kg)
      ORDER BY change_pct DESC
      LIMIT 8`,

      // Stärkste Preisfaller
      sql`SELECT
        ph.food_slug,
        d.name AS food_name,
        round(max(ph.price_per_kg)::numeric, 2)::float AS first_price,
        round(min(ph.price_per_kg)::numeric, 2)::float AS last_price,
        round(((min(ph.price_per_kg) - max(ph.price_per_kg)) / max(ph.price_per_kg) * 100)::numeric, 1)::float AS change_pct,
        count(*)::int AS snapshots
      FROM price_history ph
      JOIN dog_foods d ON d.slug = ph.food_slug
      WHERE d.is_active = true AND ph.price_per_kg > 0
      GROUP BY ph.food_slug, d.name
      HAVING count(*) >= 3 AND min(ph.price_per_kg) < max(ph.price_per_kg)
      ORDER BY change_pct ASC
      LIMIT 8`,

      // Zusammensetzung (Original-Daten aus dog_foods)
      sql`SELECT
        count(*)::int AS total,
        count(*) FILTER (WHERE meat_percentage IS NOT NULL)::int AS with_meat,
        round(avg(meat_percentage) FILTER (WHERE meat_percentage IS NOT NULL)::numeric, 1)::float AS avg_meat,
        round(avg(meat_percentage) FILTER (WHERE meat_percentage IS NOT NULL AND price_per_kg >= 8)::numeric, 1)::float AS avg_meat_premium,
        round(100.0 * count(*) FILTER (WHERE is_grain_free) / NULLIF(count(*),0), 1)::float AS pct_grain_free,
        round(100.0 * count(*) FILTER (WHERE is_monoprotein) / NULLIF(count(*),0), 1)::float AS pct_monoprotein,
        round(100.0 * count(*) FILTER (WHERE is_hypoallergenic) / NULLIF(count(*),0), 1)::float AS pct_hypo,
        round(100.0 * count(*) FILTER (WHERE protein IS NOT NULL AND protein <> '') / NULLIF(count(*),0), 1)::float AS pct_named_protein
      FROM dog_foods
      WHERE is_active = true AND type IN ('trocken','nass','barf','kaltgepresst')`,

      // Häufigste deklarierte Proteinquellen
      sql`SELECT lower(trim(protein)) AS protein, count(*)::int AS n
      FROM dog_foods
      WHERE is_active = true AND type IN ('trocken','nass','barf','kaltgepresst')
        AND protein IS NOT NULL AND protein <> ''
      GROUP BY lower(trim(protein))
      ORDER BY n DESC
      LIMIT 8`,
    ]);

    return {
      meta: meta[0] as SnapshotStat,
      typeStats: typeStats as TypeStat[],
      risers: risers as PriceMovement[],
      fallers: fallers as PriceMovement[],
      composition: composition[0] as CompositionStat,
      proteins: proteins as ProteinStat[],
    };
  } catch {
    return null;
  }
}

const TYPE_LABEL: Record<string, string> = {
  trocken: "Trockenfutter",
  nass: "Nassfutter",
  barf: "BARF / Rohfutter",
  kaltgepresst: "Kaltgepresst",
  snack: "Snacks",
};

export default async function PreisindexPage() {
  const data = await getData();

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData
        type="article"
        article={{
          headline: "Hundefutter-Preisindex 2026",
          description: "BELLA analysiert Preis-Snapshots aus dem AWIN-Feed: welche Hundefutter-Typen teurer wurden, welche günstiger, und was das für deinen Geldbeutel bedeutet.",
          url: "https://welches-hundefutter.today/analyse/preisindex-2026",
          dateModified: DATA_REFRESHED,
          speakableSelectors: ["h1", ".bella-answer", ".bella-tldr"],
        }}
      />
      <nav className="max-w-5xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <Link href="/analyse/methodik" className="hover:text-[var(--honey)]">Methodik</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">Preisindex 2026</span>
      </nav>

      <section className="hero-glow max-w-5xl mx-auto w-full px-5 pt-8 pb-14">
        <span className="pill mb-4">📊 Original-Daten</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
          Hundefutter-Preisindex 2026
        </h1>
        <p className="text-[var(--muted)] leading-relaxed max-w-2xl mb-6">
          BELLA erfasst täglich Preisänderungen aus dem AWIN-Affiliate-Feed.
          Diese Analyse basiert auf <strong className="text-white">{data?.meta.total_snapshots.toLocaleString("de") ?? "tausenden"} Preis-Snapshots</strong> von{" "}
          <strong className="text-white">{data?.meta.distinct_products.toLocaleString("de") ?? "tausenden"} Produkten</strong>.
          Keine redaktionelle Verzerrung — nur Rohdaten.
        </p>
        {data?.meta && (
          <p className="text-xs text-[var(--muted)]">
            Datenzeitraum: {data.meta.first_snapshot} bis {data.meta.last_snapshot} ·
            Ø Preis alle Typen: {data.meta.avg_price_all.toFixed(2)} €/kg
          </p>
        )}
      </section>

      {/* Zitierfähiger Antwort-Block (GEO B1/B4) */}
      {data?.composition && (
        <section className="max-w-5xl mx-auto w-full px-5">
          <div className="bella-answer card p-5 mb-6 max-w-2xl">
            <p className="leading-relaxed">
              Im aktiven BELLA-Katalog ({data.composition.total.toLocaleString("de")} Hauptfutter-Sorten:
              Trocken, Nass, BARF, Kaltgepresst) liegt der durchschnittliche{" "}
              <strong className="text-white">Fleischanteil bei {data.composition.avg_meat ?? "—"} %</strong>
              {data.composition.avg_meat_premium != null && <> (Premium ab 8 €/kg: {data.composition.avg_meat_premium} %)</>}.
              {" "}<strong className="text-white">{data.composition.pct_grain_free} %</strong> sind getreidefrei,{" "}
              <strong className="text-white">{data.composition.pct_monoprotein} %</strong> Monoprotein.
              {data.proteins?.[0] && <> Häufigste deklarierte Proteinquelle: {data.proteins[0].protein}.</>}
              {" "}Ø-Preis aller Typen: {data.meta?.avg_price_all?.toFixed(2)} €/kg. Stand: {data.meta?.last_snapshot}.
            </p>
          </div>

          {/* Das Wichtigste in Kürze */}
          <ul className="bella-tldr text-sm text-[var(--muted)] space-y-1 mb-6 max-w-2xl">
            <li>• Ø Fleischanteil: <strong className="text-white">{data.composition.avg_meat ?? "—"} %</strong> (Datenbasis: {data.composition.with_meat.toLocaleString("de")} Sorten mit Angabe)</li>
            <li>• Getreidefrei: <strong className="text-white">{data.composition.pct_grain_free} %</strong> · Monoprotein: <strong className="text-white">{data.composition.pct_monoprotein} %</strong> · Hypoallergen: <strong className="text-white">{data.composition.pct_hypo} %</strong></li>
            <li>• Proteinquelle deklariert: <strong className="text-white">{data.composition.pct_named_protein} %</strong> der Sorten</li>
            <li>• Preisdaten aus <strong className="text-white">{data.meta?.distinct_products.toLocaleString("de")}</strong> Produkten, {data.meta?.first_snapshot}–{data.meta?.last_snapshot}</li>
          </ul>
        </section>
      )}

      {/* Preise nach Futtertyp */}
      <section className="max-w-5xl mx-auto w-full px-5 py-10">
        <h2 className="text-2xl font-extrabold tracking-tight mb-6">Durchschnittspreise nach Futtertyp</h2>
        {data ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {data.typeStats.map((t) => (
              <div key={t.type} className="card p-5">
                <p className="text-sm font-bold mb-1">{TYPE_LABEL[t.type] ?? t.type}</p>
                <p className="text-3xl font-black text-[var(--honey)]">{t.avg_price.toFixed(2)} <span className="text-base font-medium text-[var(--muted)]">€/kg</span></p>
                <div className="flex justify-between text-xs text-[var(--muted)] mt-2">
                  <span>Min: {t.min_price.toFixed(2)} €</span>
                  <span>Max: {t.max_price.toFixed(2)} €</span>
                </div>
                <p className="text-[10px] text-white/25 mt-2">{t.product_count.toLocaleString("de")} Produkte im Katalog</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-6 text-center text-[var(--muted)]">Daten werden geladen…</div>
        )}
        <p className="text-xs text-[var(--muted)]">Aktive Produkte mit gültigem Preis · Snacks ausgeschlossen · täglich aktualisiert</p>
      </section>

      {/* Stärke Bewegungen */}
      <section className="max-w-5xl mx-auto w-full px-5 py-10">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight mb-4 flex items-center gap-2">
              <span className="text-rose-400">↑</span> Stärkste Preissteigerungen
            </h2>
            {data?.risers.length ? (
              <div className="space-y-2">
                {data.risers.map((r) => (
                  <div key={r.food_slug} className="card p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{r.food_name}</p>
                      <p className="text-xs text-[var(--muted)]">{r.first_price.toFixed(2)} → {r.last_price.toFixed(2)} €/kg</p>
                    </div>
                    <span className="text-rose-400 font-black text-sm flex-shrink-0">+{r.change_pct}%</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-[var(--muted)] text-sm">Noch zu wenig Verlaufsdaten für Bewegungsanalyse.</p>}
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight mb-4 flex items-center gap-2">
              <span className="text-emerald-400">↓</span> Stärkste Preissenkungen
            </h2>
            {data?.fallers.length ? (
              <div className="space-y-2">
                {data.fallers.map((f) => (
                  <div key={f.food_slug} className="card p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{f.food_name}</p>
                      <p className="text-xs text-[var(--muted)]">{f.first_price.toFixed(2)} → {f.last_price.toFixed(2)} €/kg</p>
                    </div>
                    <span className="text-emerald-400 font-black text-sm flex-shrink-0">{f.change_pct}%</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-[var(--muted)] text-sm">Noch zu wenig Verlaufsdaten für Bewegungsanalyse.</p>}
          </div>
        </div>
      </section>

      {/* Zusammensetzung */}
      <section className="max-w-5xl mx-auto w-full px-5 py-10">
        <h2 className="text-2xl font-extrabold tracking-tight mb-2">Was steckt drin? Zusammensetzung im Katalog</h2>
        <p className="text-[var(--muted)] text-sm mb-6 max-w-2xl">
          Auswertung aller aktiven Hauptfutter-Sorten (Trocken, Nass, BARF, Kaltgepresst). Werte „wie deklariert" aus dem Affiliate-Feed.
        </p>
        {data?.composition ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="card p-5">
                <p className="text-sm font-bold mb-1">Ø Fleischanteil</p>
                <p className="text-3xl font-black text-[var(--honey)]">{data.composition.avg_meat ?? "—"}<span className="text-base font-medium text-[var(--muted)]"> %</span></p>
                <p className="text-[10px] text-white/25 mt-2">Premium ≥8 €/kg: {data.composition.avg_meat_premium ?? "—"} %</p>
              </div>
              <div className="card p-5">
                <p className="text-sm font-bold mb-1">Getreidefrei</p>
                <p className="text-3xl font-black text-[var(--honey)]">{data.composition.pct_grain_free}<span className="text-base font-medium text-[var(--muted)]"> %</span></p>
              </div>
              <div className="card p-5">
                <p className="text-sm font-bold mb-1">Monoprotein</p>
                <p className="text-3xl font-black text-[var(--honey)]">{data.composition.pct_monoprotein}<span className="text-base font-medium text-[var(--muted)]"> %</span></p>
              </div>
              <div className="card p-5">
                <p className="text-sm font-bold mb-1">Hypoallergen</p>
                <p className="text-3xl font-black text-[var(--honey)]">{data.composition.pct_hypo}<span className="text-base font-medium text-[var(--muted)]"> %</span></p>
              </div>
            </div>

            {data.proteins?.length > 0 && (
              <div className="card p-5">
                <p className="text-sm font-bold mb-3">Häufigste deklarierte Proteinquellen</p>
                <div className="flex flex-wrap gap-2">
                  {data.proteins.map((p) => (
                    <span key={p.protein} className="pill capitalize">{p.protein} · {p.n.toLocaleString("de")}</span>
                  ))}
                </div>
              </div>
            )}
            <p className="text-xs text-[var(--muted)] mt-3">
              Datenbasis Fleischanteil: {data.composition.with_meat.toLocaleString("de")} von {data.composition.total.toLocaleString("de")} Sorten mit Herstellerangabe ·{" "}
              <Link href="/analyse/methodik" className="text-[var(--honey)] hover:underline">Methodik →</Link>
            </p>
          </>
        ) : (
          <div className="card p-6 text-center text-[var(--muted)]">Daten werden geladen…</div>
        )}
      </section>

      {/* Hinweis + Methodik */}
      <section className="max-w-5xl mx-auto w-full px-5 pb-10">
        <div className="card p-6 text-sm text-[var(--muted)] space-y-2">
          <p><strong className="text-white">Datenquelle:</strong> AWIN Affiliate-Feed, täglich 05:00 UTC. Preise können sich zwischen Snapshot und Kauf ändern.</p>
          <p><strong className="text-white">Methodik:</strong> Nur Produkte mit ≥3 Preis-Snapshots in der Bewegungsanalyse. Ausreißer durch Verpackungsgrößenwechsel möglich.</p>
          <p>
            <Link href="/analyse/methodik" className="text-[var(--honey)] hover:underline">BELLA-Score Methodik →</Link>
            {" · "}
            <Link href="/#bella-advisor" className="text-[var(--honey)] hover:underline">BELLA fragen →</Link>
            {" · "}
            <Link href="/data/hundefutter-report" className="text-[var(--honey)] hover:underline">Rohdaten als JSON/CSV →</Link>
          </p>
        </div>
      </section>

      <JsonLd data={{
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "BELLA Hundefutter-Marktreport 2026",
            description:
              "Auswertung des aktiven Hundefutter-Katalogs (Trocken, Nass, BARF, Kaltgepresst): durchschnittlicher Fleischanteil, Getreidefrei-/Monoprotein-/Hypoallergen-Anteil, häufigste deklarierte Proteinquellen, Durchschnittspreise pro Typ und Preisentwicklung aus täglichen Snapshots.",
            url: "https://welches-hundefutter.today/analyse/preisindex-2026",
            creator: { "@type": "Organization", "@id": "https://welches-hundefutter.today/#organization" },
            license: "https://creativecommons.org/licenses/by/4.0/",
            isAccessibleForFree: true,
            inLanguage: "de-DE",
            dateModified: DATA_REFRESHED,
            ...(data?.meta?.first_snapshot && data?.meta?.last_snapshot
              ? { temporalCoverage: `${data.meta.first_snapshot}/${data.meta.last_snapshot}` }
              : {}),
            variableMeasured: [
              "Preis pro Kilogramm", "Fleischanteil", "Getreidefrei-Anteil",
              "Monoprotein-Anteil", "Hypoallergen-Anteil", "Proteinquellen-Häufigkeit",
            ],
            distribution: [
              { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: "https://welches-hundefutter.today/data/hundefutter-report" },
              { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: "https://welches-hundefutter.today/data/hundefutter-report?format=csv" },
            ],
          }} />

      <SiteFooter />
    </div>
  );
}
