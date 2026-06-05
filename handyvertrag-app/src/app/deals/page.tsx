import { neon } from "@neondatabase/serverless";
import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Hundefutter Deals 2026 – Beste Angebote heute | BELLA",
  description: "Die besten Hundefutter-Deals: tagesaktuelle Angebote von Anifit, Wolfsblut, Futalis und mehr. Günstigste Preise aus dem Live-Katalog, täglich aktualisiert.",
  alternates: { canonical: "https://welches-hundefutter.today/deals" },
};

interface DogFoodDeal {
  id: number;
  brand: string;
  name: string;
  food_type: string;
  price_per_kg: number | null;
  affiliate_url: string;
  image_url: string | null;
  protein: string | null;
  grain_free: boolean;
  score: number | null;
}

const BRAND_GRADIENT: Record<string, string> = {
  Anifit: "from-orange-400 to-rose-500",
  Wolfsblut: "from-amber-500 to-orange-600",
  Futalis: "from-emerald-400 to-teal-500",
  "Terra Canis": "from-violet-400 to-purple-500",
  Josera: "from-sky-400 to-blue-500",
  Bellfor: "from-lime-400 to-green-500",
  Mera: "from-cyan-400 to-sky-500",
};
const brandColor = (b: string) =>
  Object.entries(BRAND_GRADIENT).find(([k]) => b.toLowerCase().includes(k.toLowerCase()))?.[1] ??
  "from-orange-400 to-amber-500";

async function getDeals(): Promise<DogFoodDeal[]> {
  const url = process.env.DATABASE_URL;
  if (!url) return [];
  try {
    const sql = neon(url);
    const rows = await sql`
      SELECT id, brand, name, food_type, price_per_kg, affiliate_url, image_url, protein, grain_free, score
      FROM dog_foods
      WHERE is_active = true
        AND affiliate_url IS NOT NULL
        AND price_per_kg IS NOT NULL
        AND price_per_kg > 0
      ORDER BY score DESC NULLS LAST, price_per_kg ASC
      LIMIT 12
    `;
    return rows as unknown as DogFoodDeal[];
  } catch { return []; }
}

export default async function DealsPage() {
  const deals = await getDeals();
  const today = new Date().toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 px-5 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">B</span>
            </div>
            <span className="font-bold text-sm">welches-hundefutter<span className="text-orange-400">.today</span></span>
          </Link>
          <nav className="text-sm text-white/40 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Startseite</Link>
            <span>/</span>
            <span className="text-white/70">Deals</span>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-5 py-12 w-full">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-400/10 border border-orange-400/20 text-orange-300 text-xs font-semibold mb-4">
            🔥 Tagesaktuelle Deals · {today}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            Hundefutter-Deals<br />
            <span className="text-[var(--honey)]">günstigste Sorten heute</span>
          </h1>
          <p className="text-[var(--muted)] text-lg max-w-xl mx-auto leading-relaxed">
            Täglich aktualisierte Preise aus über 8.000 Sorten — BELLA zeigt dir die besten Deals.
          </p>
        </div>

        {/* Deal grid */}
        {deals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {deals.map((deal, i) => (
              <a
                key={deal.id}
                href={deal.affiliate_url}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="group block bg-white/[0.04] rounded-2xl border border-white/8 hover:border-orange-500/40 hover:bg-white/[0.07] transition-all overflow-hidden"
              >
                <div className={`h-1 bg-gradient-to-r ${brandColor(deal.brand)}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {i === 0 && (
                          <span className="text-[9px] font-black bg-orange-400 text-orange-950 px-2 py-0.5 rounded-full">
                            TOP DEAL
                          </span>
                        )}
                        <span className={`text-[9px] font-bold text-white px-2 py-0.5 rounded bg-gradient-to-r ${brandColor(deal.brand)}`}>
                          {deal.brand}
                        </span>
                        {deal.grain_free && (
                          <span className="text-[9px] text-emerald-300 bg-emerald-500/15 px-1.5 py-0.5 rounded">getreidefrei</span>
                        )}
                      </div>
                      <p className="font-bold text-base text-[var(--ink)] leading-tight truncate">{deal.name}</p>
                      <p className="text-xs text-[var(--muted)] mt-0.5 capitalize">
                        {deal.food_type}{deal.protein ? ` · ${deal.protein}` : ""}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 overflow-hidden ml-2">
                      {deal.image_url
                        ? <img src={deal.image_url} alt={deal.name} className="w-full h-full object-contain p-1" loading="lazy" />
                        : <span className="text-lg font-black text-white/15">{deal.brand[0]}</span>}
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <p className="text-2xl font-black text-[var(--honey)] leading-none">
                        {deal.price_per_kg != null ? `${deal.price_per_kg.toFixed(2).replace(".", ",")} €` : "—"}
                      </p>
                      <p className="text-[11px] text-[var(--muted)] mt-0.5">/kg</p>
                    </div>
                    {deal.score != null && (
                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-400">{deal.score}/100</p>
                        <p className="text-[10px] text-[var(--muted)]">BELLA-Score</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-white/25">Affiliate-Link*</span>
                    <span className="text-xs font-semibold text-orange-300 group-hover:text-orange-200 transition-colors">
                      Zum Angebot →
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-[var(--muted)]">
            <p className="text-lg mb-2">Deals werden gleich geladen…</p>
            <p className="text-sm">Oder lass BELLA direkt das passende Futter für deinen Hund finden.</p>
          </div>
        )}

        {/* BELLA CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 p-8 text-center mb-10">
          <p className="text-xl font-black mb-2">Welches Futter passt wirklich zu deinem Hund?</p>
          <p className="text-[var(--muted)] mb-5 max-w-md mx-auto">
            BELLA fragt 5 Dinge — Rasse, Alter, Aktivität, Allergien, Futtertyp — und findet den optimalen Futter aus dem Live-Katalog.
          </p>
          <Link
            href="/#bella-advisor"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
          >
            🐕 BELLA fragen — kostenlos starten →
          </Link>
        </div>

        {/* Related links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Hundefutter bei Allergie", href: "/allergie" },
            { label: "Trockenfutter Vergleich", href: "/futtertyp/trockenfutter" },
            { label: "Nassfutter Test", href: "/futtertyp/nassfutter" },
            { label: "BARF Hundefutter", href: "/futtertyp/barf" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block p-3 rounded-xl bg-white/[0.03] border border-white/8 hover:border-orange-500/30 text-center text-sm text-[var(--muted)] hover:text-white transition-all"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <p className="text-[10px] text-[var(--muted)] mt-8 text-center">
          * Affiliate-Links mit <code className="text-[var(--muted)]">rel=&quot;sponsored&quot;</code>. Preise täglich aktualisiert. Keine Gewähr für Aktualität. BELLA erhält bei Kauf eine Provision — das ändert nichts an der objektiven Bewertung.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
