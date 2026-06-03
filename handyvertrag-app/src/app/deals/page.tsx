import { neon } from "@neondatabase/serverless";
import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Top Deals 2026 – Beste Handyvertrag Angebote | welches-hundefutter.today",
  description: "Die besten Handyvertrag Deals 2026: iPhone 17 Pro, Samsung Galaxy S25 Ultra & mehr. Tagesaktuelle Angebote von Telekom, Vodafone und o2. Jetzt bis zu 200 € sparen.",
  alternates: { canonical: "https://welches-hundefutter.today/deals" },
};

const PROV_GRADIENT: Record<string, string> = {
  Telekom: "from-pink-500 to-rose-600",
  Vodafone: "from-red-500 to-red-700",
  o2: "from-sky-500 to-blue-700",
  freenet: "from-emerald-500 to-teal-600",
  otelo: "from-violet-500 to-purple-600",
};
const provColor = (p: string) =>
  Object.entries(PROV_GRADIENT).find(([k]) => p.toLowerCase().includes(k.toLowerCase()))?.[1]
  ?? "from-gray-500 to-gray-700";

interface Deal {
  id: number; brand: string; device_name: string; provider_name: string;
  tariff_name: string; monthly_price: string; effective_monthly_price: string | null;
  data_volume: string | null; is_unlimited: boolean; has_5g: boolean;
  cashback: string | null; affiliate_link: string; image_url: string | null;
}

async function getTopDeals(): Promise<Deal[]> {
  const url = process.env.DATABASE_URL;
  if (!url) return [];
  try {
    const sql = neon(url);
    const rows = await sql.query(
      `SELECT * FROM (
         SELECT DISTINCT ON (LOWER(REGEXP_REPLACE(device_name,'[^a-zA-Z0-9]','','g')))
           id, brand, device_name, provider_name, tariff_name, monthly_price,
           effective_monthly_price, data_volume, is_unlimited, has_5g,
           cashback, affiliate_link, image_url,
           CASE
             WHEN device_name ILIKE '%iphone 17 pro max%' THEN 100
             WHEN device_name ILIKE '%iphone 17 pro%' THEN 98
             WHEN device_name ILIKE '%galaxy s25 ultra%' THEN 95
             WHEN device_name ILIKE '%iphone 17%' THEN 92
             WHEN device_name ILIKE '%galaxy s25%' THEN 88
             WHEN device_name ILIKE '%pixel 10 pro%' THEN 85
             WHEN device_name ILIKE '%iphone air%' THEN 82
             WHEN device_name ILIKE '%galaxy s26 ultra%' THEN 90
             WHEN device_name ILIKE '%pixel 10%' THEN 78
             ELSE 50 END AS pop
         FROM offers
         WHERE availability = 'in stock' AND monthly_price > 0
           AND device_name NOT ILIKE '%tab%' AND device_name NOT ILIKE '%buds%'
           AND device_name NOT ILIKE '%watch%' AND device_name NOT ILIKE '%tag%'
           AND tariff_name NOT ILIKE '%zuhause%' AND tariff_name NOT ILIKE '%glasfaser%'
         ORDER BY LOWER(REGEXP_REPLACE(device_name,'[^a-zA-Z0-9]','','g')), monthly_price ASC
       ) d ORDER BY pop DESC, monthly_price ASC LIMIT 12`,
      []
    );
    return ((rows as unknown as { rows: Deal[] }).rows ?? (rows as unknown as Deal[]));
  } catch { return []; }
}

export default async function DealsPage() {
  const deals = await getTopDeals();
  const today = new Date().toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-[#05060f] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 px-5 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">H</span>
            </div>
            <span className="font-bold text-sm">handyvertrag<span className="text-indigo-400">.today</span></span>
          </Link>
          <nav className="text-sm text-white/40 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Startseite</Link>
            <span>/</span>
            <span className="text-white/70">Top Deals</span>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-5 py-12 w-full">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold mb-4">
            🔥 Tagesaktuelle Deals · {today}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            Top Handyvertrag<br /><span className="text-indigo-400">Deals 2026</span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
            Die besten aktuellen Angebote aus über 6.000 tagesaktuellen Tarifen — direkt aus der Datenbank.
          </p>
        </div>

        {/* Deal grid */}
        {deals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {deals.map((deal, i) => {
              const price = parseFloat(deal.effective_monthly_price ?? deal.monthly_price);
              const cashback = deal.cashback ? parseFloat(deal.cashback) : 0;
              return (
                <a key={deal.id} href={deal.affiliate_link} target="_blank" rel="noopener noreferrer sponsored"
                  className="group block bg-white/[0.04] rounded-2xl border border-white/8 hover:border-indigo-500/40 hover:bg-white/[0.07] transition-all overflow-hidden">
                  {/* Top badge */}
                  <div className={`h-1 bg-gradient-to-r ${provColor(deal.provider_name)}`} />

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          {i === 0 && <span className="text-[9px] font-black bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full">#1 DEAL</span>}
                          <span className={`text-[9px] font-bold text-white px-2 py-0.5 rounded bg-gradient-to-r ${provColor(deal.provider_name)}`}>{deal.provider_name}</span>
                          {deal.has_5g && <span className="text-[9px] text-sky-300 bg-sky-500/15 px-1.5 py-0.5 rounded">5G</span>}
                          {deal.is_unlimited && <span className="text-[9px] text-emerald-300 bg-emerald-500/15 px-1.5 py-0.5 rounded">∞</span>}
                        </div>
                        <p className="text-xs text-white/40">{deal.brand}</p>
                        <p className="font-bold text-base text-white leading-tight">{deal.device_name}</p>
                      </div>
                      {/* Image */}
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 overflow-hidden ml-2">
                        {deal.image_url
                          ? <img src={deal.image_url} alt={deal.device_name} className="w-full h-full object-contain p-1" loading="lazy" />
                          : <span className="text-lg font-black text-white/15">{deal.brand[0]}</span>}
                      </div>
                    </div>

                    <p className="text-xs text-white/40 mb-3 truncate">{deal.tariff_name} · {deal.data_volume ?? (deal.is_unlimited ? "Unlimited" : "")}</p>

                    <div className="flex items-baseline justify-between">
                      <div>
                        <p className="text-2xl font-black text-white leading-none">
                          {price.toFixed(2).replace(".", ",")} €
                        </p>
                        <p className="text-[11px] text-white/35 mt-0.5">/Monat</p>
                      </div>
                      {cashback > 0 && (
                        <span className="text-emerald-400 text-xs font-semibold">{cashback.toFixed(0)} € Cashback</span>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-white/25">AWIN Affiliate *</span>
                      <span className="text-xs font-semibold text-indigo-300 group-hover:text-indigo-200 transition-colors">
                        Zum Angebot →
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-white/40">
            <p>Deals werden gerade geladen...</p>
          </div>
        )}

        {/* BELLA CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 p-8 text-center">
          <p className="text-xl font-black mb-2">Welcher Deal passt wirklich zu dir?</p>
          <p className="text-white/50 mb-5 max-w-md mx-auto">BELLA analysiert dein Profil und findet deinen persönlichen Optimal-Deal — nicht nur den günstigsten.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all">
            BELLA fragen — persönliche Analyse starten →
          </Link>
        </div>

        {/* Related links */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "iPhone mit Vertrag", href: "/handys/iphone-17-pro" },
            { label: "Samsung mit Vertrag", href: "/handys/samsung-galaxy-s25-ultra" },
            { label: "Pixel mit Vertrag", href: "/handys/google-pixel-10-pro" },
            { label: "Contract TÜV", href: "/contract-tuev" },
          ].map((l) => (
            <Link key={l.href} href={l.href}
              className="block p-3 rounded-xl bg-white/[0.03] border border-white/8 hover:border-indigo-500/30 text-center text-sm text-white/60 hover:text-white transition-all">
              {l.label}
            </Link>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
