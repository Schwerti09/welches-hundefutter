import { notFound } from "next/navigation";
import { products, getProviderColor } from "@/data/products";
import type { Metadata } from "next";
import StructuredData from "@/components/StructuredData";
import { neon } from "@neondatabase/serverless";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Fetch live offers from DB for a device
async function getDbOffers(deviceName: string) {
  const url = process.env.DATABASE_URL;
  if (!url) return [];
  try {
    const sql = neon(url);
    const rows = await sql.query(
      `SELECT DISTINCT ON (provider_name)
         id, brand, device_name, provider_name, tariff_name, monthly_price,
         effective_monthly_price, data_volume, is_unlimited, has_5g,
         contract_months, affiliate_link, image_url, cashback
       FROM offers
       WHERE device_name ILIKE $1 AND availability = 'in stock'
         AND tariff_name NOT ILIKE '%zuhause%' AND tariff_name NOT ILIKE '%glasfaser%'
       ORDER BY provider_name, monthly_price ASC
       LIMIT 8`,
      [`%${deviceName}%`]
    );
    return ((rows as unknown as { rows: Record<string, unknown>[] }).rows ??
      (rows as unknown as Record<string, unknown>[])) as {
      id: number; brand: string; device_name: string; provider_name: string;
      tariff_name: string; monthly_price: string; effective_monthly_price: string | null;
      data_volume: string | null; is_unlimited: boolean; has_5g: boolean;
      contract_months: number; affiliate_link: string; image_url: string | null;
      cashback: string | null;
    }[];
  } catch { return []; }
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.id === slug);
  if (!product) return { title: "Nicht gefunden" };
  const bestOffer = product.offers.reduce((b, o) => o.monthlyPrice < b.monthlyPrice ? o : b);
  return {
    title: `${product.name} mit Vertrag ab ${bestOffer.monthlyPrice.toFixed(2)}€/Monat | handytrotzschufa.today`,
    description: `${product.name} Vertragsangebote vergleichen. Ab ${bestOffer.monthlyPrice.toFixed(2)}€/Monat. Alle Provider im Vergleich – Telekom, Vodafone, o2 & mehr. KI-gestützte Empfehlung von HANSI.`,
    alternates: { canonical: `https://handytrotzschufa.today/handys/${product.id}` },
    openGraph: {
      title: `${product.name} mit Vertrag`,
      description: `Ab ${bestOffer.monthlyPrice.toFixed(2)}€/Monat. HANSI findet deinen besten Deal.`,
    },
  };
}

const productFAQs = (name: string, minPrice: number) => [
  { question: `Wie viel kostet das ${name} mit Vertrag?`, answer: `Das ${name} gibt es mit Vertrag ab ${minPrice.toFixed(2)}€ pro Monat, je nach Provider und Datentarif.` },
  { question: `Bei welchem Anbieter ist das ${name} am günstigsten?`, answer: `Vergleiche alle Angebote auf dieser Seite. Telekom, Vodafone, o2 und weitere Anbieter haben unterschiedliche Preise für das ${name}.` },
  { question: `Gibt es das ${name} ohne Einmalzahlung?`, answer: `Ja, viele Angebote für das ${name} sind ohne Einmalzahlung erhältlich. Filtere nach 0€ Einmalpreis.` },
  { question: `Wie lange läuft ein ${name} Vertrag?`, answer: `Die meisten ${name} Verträge laufen 24 Monate. Es gibt auch 12-monatige Laufzeiten.` },
];

export default async function HandyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = products.find((p) => p.id === slug);
  if (!product) notFound();

  const bestOffer = product.offers.reduce((b, o) => o.monthlyPrice < b.monthlyPrice ? o : b);
  const dbOffers = await getDbOffers(product.name);
  const faqs = productFAQs(product.name, bestOffer.monthlyPrice);

  // Related: other products
  const related = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#05060f] text-white">
      <StructuredData type="product" productId={product.id} />
      <StructuredData type="faq" faqs={faqs.map(f => ({ question: f.question, answer: f.answer }))} />
      <StructuredData type="breadcrumb" breadcrumbs={[
        { name: "Startseite", url: "https://handytrotzschufa.today" },
        { name: "Handys", url: "https://handytrotzschufa.today/handys" },
        { name: product.name, url: `https://handytrotzschufa.today/handys/${product.id}` },
      ]} />

      {/* Top bar */}
      <header className="border-b border-white/5 px-5 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">H</span>
            </div>
            <span className="font-bold text-sm">handyvertrag<span className="text-indigo-400">.today</span></span>
          </Link>
          <nav className="text-sm text-white/40 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Startseite</Link>
            <span>/</span>
            <Link href="/#vergleich" className="hover:text-white transition-colors">Handys</Link>
            <span>/</span>
            <span className="text-white/70">{product.name}</span>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-12">
        {/* Hero */}
        <div className="grid md:grid-cols-2 gap-10 mb-14">
          <div>
            <div className="text-[11px] tracking-[0.2em] text-indigo-400 font-semibold uppercase mb-2">{product.brand}</div>
            <h1 className="text-4xl font-black mb-4">{product.name} <span className="text-white/50">mit Vertrag</span></h1>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => <span key={i} className={`text-sm ${i < Math.floor(product.rating) ? "text-amber-400" : "text-white/20"}`}>★</span>)}
              </div>
              <span className="text-white/50 text-sm">{product.rating} ({product.reviews.toLocaleString("de-DE")} Bewertungen)</span>
            </div>

            <div className="glass-strong rounded-2xl p-5 mb-5">
              <div className="text-xs text-white/40 mb-1">Ab</div>
              <div className="text-4xl font-black text-indigo-300">{bestOffer.monthlyPrice.toFixed(2).replace(".", ",")} €<span className="text-lg font-normal text-white/40">/Monat</span></div>
              <div className="text-sm text-white/50 mt-1">bei {bestOffer.provider} · {bestOffer.dataVolume}</div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                { icon: "📱", label: product.specs.display },
                { icon: "📸", label: product.specs.camera.split("+")[0].trim() },
                { icon: "🔋", label: product.specs.battery },
                { icon: "⚡", label: product.specs.chip },
              ].map((s) => (
                <div key={s.icon} className="flex items-center gap-2 text-white/60 bg-white/5 rounded-xl px-3 py-2">
                  <span>{s.icon}</span><span className="truncate text-xs">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image placeholder */}
          <div className="flex items-center justify-center bg-white/5 rounded-2xl p-8">
            <div className="text-center">
              <div className="text-6xl font-black text-white/10 mb-2">{product.brand[0]}</div>
              <div className="text-white/30 text-sm">{product.name}</div>
            </div>
          </div>
        </div>

        {/* DB Offers (real-time) */}
        {dbOffers.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-black mb-2">Aktuelle Angebote</h2>
            <p className="text-white/40 text-sm mb-6">Tagesaktuelle Tarife von allen Anbietern — {dbOffers.length} Angebote gefunden</p>
            <div className="space-y-3">
              {dbOffers.map((o, i) => (
                <a key={o.id} href={o.affiliate_link} target="_blank" rel="noopener noreferrer sponsored"
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] border border-white/8 hover:border-indigo-500/40 hover:bg-white/[0.07] transition-all group">
                  <div className="flex items-center gap-4">
                    {i === 0 && <span className="text-[10px] bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full font-bold shrink-0">BESTES</span>}
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded bg-gradient-to-r ${getProviderColor(o.provider_name)}`}>{o.provider_name}</span>
                        {o.has_5g && <span className="text-[10px] text-sky-300 bg-sky-500/15 px-1.5 py-0.5 rounded">5G</span>}
                        {o.is_unlimited && <span className="text-[10px] text-emerald-300 bg-emerald-500/15 px-1.5 py-0.5 rounded">∞</span>}
                      </div>
                      <div className="text-sm text-white/70">{o.tariff_name} · {o.data_volume ?? (o.is_unlimited ? "Unlimited" : "")}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {o.cashback && parseFloat(o.cashback) > 0 && (
                      <span className="text-xs text-emerald-400 hidden sm:block">{parseFloat(o.cashback).toFixed(0)} € Cashback</span>
                    )}
                    <div className="text-right">
                      <div className="font-black text-xl">{parseFloat(o.effective_monthly_price ?? o.monthly_price).toFixed(2).replace(".", ",")} €</div>
                      <div className="text-[10px] text-white/30">/Monat</div>
                    </div>
                    <svg className="w-4 h-4 text-white/20 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mb-14">
          <h2 className="text-2xl font-black mb-6">Häufige Fragen zum {product.name}</h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.question} className="bg-white/[0.04] rounded-2xl group">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-sm list-none">
                  {f.question}
                  <span className="text-white/30 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="px-5 pb-4 text-sm text-white/55 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related + CTA */}
        <section className="mb-12">
          <h2 className="text-2xl font-black mb-6">Ähnliche Handys</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {related.map((r) => {
              const best = r.offers.reduce((b, o) => o.monthlyPrice < b.monthlyPrice ? o : b);
              return (
                <Link key={r.id} href={`/handys/${r.id}`}
                  className="block p-4 rounded-2xl bg-white/[0.04] border border-white/8 hover:border-indigo-500/40 transition-all">
                  <div className="text-xs text-white/40 mb-1">{r.brand}</div>
                  <div className="font-bold mb-2">{r.name}</div>
                  <div className="text-indigo-300 font-black">ab {best.monthlyPrice.toFixed(2)} €/Mo.</div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* HANSI CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 p-6 text-center">
          <p className="text-lg font-bold mb-2">Unsicher welches Angebot passt?</p>
          <p className="text-white/50 text-sm mb-5">HANSI analysiert dein Nutzerprofil und findet den perfekten Tarif für das {product.name}.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all">
            HANSI fragen →
          </Link>
        </div>
      </main>

      <footer className="border-t border-white/5 px-5 py-8 text-center">
        <p className="text-white/20 text-xs">© 2026 handytrotzschufa.today · Affiliate-Links · Preise inkl. MwSt. · Letzte Aktualisierung: täglich</p>
        <div className="flex justify-center gap-4 mt-3">
          {["iPhone 17 Pro", "Galaxy S25 Ultra", "Pixel 10 Pro"].map(d => (
            <Link key={d} href={`/handys/${d.toLowerCase().replace(/\s+/g, "-")}`} className="text-xs text-white/30 hover:text-white/60 transition-colors">{d} mit Vertrag</Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
