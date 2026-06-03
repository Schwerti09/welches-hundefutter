import { notFound } from "next/navigation";
import { products, getProviderColor } from "@/data/products";
import type { Metadata } from "next";
import { neon } from "@neondatabase/serverless";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";

interface PageProps {
  params: Promise<{ slug: string; provider: string }>;
}

const PROVIDER_MAP: Record<string, string> = {
  telekom: "Telekom",
  vodafone: "Vodafone",
  o2: "o2",
  freenet: "freenet",
  otelo: "otelo",
  congstar: "congstar",
};

async function getProviderOffers(deviceName: string, providerNorm: string) {
  const url = process.env.DATABASE_URL;
  if (!url) return [];
  try {
    const sql = neon(url);
    const rows = await sql.query(
      `SELECT id, brand, device_name, provider_name, tariff_name, monthly_price,
         effective_monthly_price, data_volume, is_unlimited, has_5g,
         contract_months, affiliate_link, image_url, cashback, one_time_price
       FROM offers
       WHERE device_name ILIKE $1 AND LOWER(provider_name) LIKE $2
         AND availability = 'in stock'
         AND tariff_name NOT ILIKE '%zuhause%' AND tariff_name NOT ILIKE '%glasfaser%'
       ORDER BY effective_monthly_price ASC NULLS LAST, monthly_price ASC
       LIMIT 6`,
      [`%${deviceName}%`, `%${providerNorm}%`]
    );
    return ((rows as unknown as { rows: Record<string, unknown>[] }).rows ??
      (rows as unknown as Record<string, unknown>[])) as {
      id: number; brand: string; device_name: string; provider_name: string;
      tariff_name: string; monthly_price: string; effective_monthly_price: string | null;
      data_volume: string | null; is_unlimited: boolean; has_5g: boolean;
      contract_months: number; affiliate_link: string; image_url: string | null;
      cashback: string | null; one_time_price: string | null;
    }[];
  } catch { return []; }
}

export function generateStaticParams() {
  const slugs = products.map((p) => p.id);
  const providers = Object.keys(PROVIDER_MAP);
  return slugs.flatMap((slug) => providers.map((provider) => ({ slug, provider })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, provider } = await params;
  const product = products.find((p) => p.id === slug);
  const pName = PROVIDER_MAP[provider];
  if (!product || !pName) return { title: "Nicht gefunden" };
  return {
    title: `${product.name} mit ${pName} Vertrag | welches-hundefutter.today`,
    description: `${product.name} mit ${pName} Vertrag vergleichen. Alle aktuellen ${pName} Tarife für das ${product.name} im Überblick. Günstigsten Deal finden mit BELLA.`,
    alternates: { canonical: `https://welches-hundefutter.today/handys/${slug}/${provider}` },
    openGraph: { title: `${product.name} mit ${pName}`, description: `Alle ${pName} Tarife für das ${product.name}` },
  };
}

export default async function DeviceProviderPage({ params }: PageProps) {
  const { slug, provider } = await params;
  const product = products.find((p) => p.id === slug);
  const pName = PROVIDER_MAP[provider];
  if (!product || !pName) notFound();

  const offers = await getProviderOffers(product.name, provider);
  const cheapest = offers[0];

  const faqs = [
    { question: `Wie viel kostet das ${product.name} mit ${pName} Vertrag?`, answer: cheapest ? `Das ${product.name} mit ${pName} gibt es ab ${parseFloat(cheapest.effective_monthly_price ?? cheapest.monthly_price).toFixed(2)}€ pro Monat mit ${cheapest.data_volume ?? (cheapest.is_unlimited ? "unbegrenzten Daten" : "Daten")}.` : `Das ${product.name} bei ${pName} ist aktuell verfügbar. Preise variieren je nach Tarif.` },
    { question: `Welcher ${pName} Tarif passt zum ${product.name}?`, answer: `Für das ${product.name} bei ${pName} empfehlen wir Tarife mit mindestens 30 GB Datenvolumen, um alle Funktionen optimal zu nutzen. 5G-Tarife bieten die beste Performance.` },
    { question: `Gibt es Cashback beim ${product.name} mit ${pName}?`, answer: `Ja, viele ${pName} Angebote für das ${product.name} beinhalten Cashback oder Sofortrabatte. Die aktuellen Aktionen siehst du in der Angebotsliste oben.` },
  ];

  const otherProviders = Object.entries(PROVIDER_MAP).filter(([k]) => k !== provider);

  return (
    <div className="min-h-screen bg-[#05060f] text-white">
      <StructuredData type="faq" faqs={faqs.map(f => ({ question: f.question, answer: f.answer }))} />
      <StructuredData type="breadcrumb" breadcrumbs={[
        { name: "Startseite", url: "https://welches-hundefutter.today" },
        { name: product.name + " Verträge", url: `https://welches-hundefutter.today/handys/${slug}` },
        { name: pName, url: `https://welches-hundefutter.today/handys/${slug}/${provider}` },
      ]} />

      {/* Top bar */}
      <header className="border-b border-white/5 px-5 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3 text-sm text-white/40 flex-wrap">
          <Link href="/" className="flex items-center gap-2 text-white">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-black">H</div>
            <span className="font-bold text-sm">handyvertrag<span className="text-indigo-400">.today</span></span>
          </Link>
          <span>/</span>
          <Link href={`/handys/${slug}`} className="hover:text-white transition-colors">{product.name}</Link>
          <span>/</span>
          <span className="text-white/70">{pName}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-12">
        {/* Hero */}
        <div className="mb-10">
          <div className={`inline-block text-[10px] font-bold text-white px-3 py-1 rounded-full bg-gradient-to-r ${getProviderColor(pName)} mb-4`}>{pName}</div>
          <h1 className="text-4xl font-black leading-tight mb-3">
            {product.name} mit{" "}
            <span className="text-indigo-300">{pName} Vertrag</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl leading-relaxed">
            {offers.length > 0
              ? `${offers.length} aktuelle ${pName} Tarife für das ${product.name} im Vergleich. Günstigstes Angebot: ab ${parseFloat(offers[0].effective_monthly_price ?? offers[0].monthly_price).toFixed(2)}€/Monat.`
              : `Alle ${pName} Tarife für das ${product.name} im Vergleich. Finde den besten Deal.`}
          </p>
        </div>

        {/* Offers */}
        {offers.length > 0 ? (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-5">Aktuelle {pName} Tarife für das {product.name}</h2>
            <div className="space-y-3">
              {offers.map((o, i) => {
                const price = parseFloat(o.effective_monthly_price ?? o.monthly_price);
                const oneTime = o.one_time_price ? parseFloat(o.one_time_price) : 0;
                return (
                  <a key={o.id} href={o.affiliate_link} target="_blank" rel="noopener noreferrer sponsored"
                    className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.04] border border-white/8 hover:border-indigo-500/40 hover:bg-white/[0.07] transition-all group">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        {i === 0 && <span className="text-[10px] bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full font-bold">TOP DEAL</span>}
                        {o.has_5g && <span className="text-[10px] text-sky-300 bg-sky-500/15 px-2 py-0.5 rounded">5G</span>}
                        {o.is_unlimited && <span className="text-[10px] text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded">Unlimited</span>}
                      </div>
                      <div className="font-semibold">{o.tariff_name}</div>
                      <div className="text-sm text-white/50 mt-0.5">
                        {o.data_volume ?? (o.is_unlimited ? "Unbegrenzte Daten" : "Datenvolumen")} ·{" "}
                        {o.contract_months} Monate{oneTime > 0 ? ` · ${oneTime.toFixed(2)}€ einmalig` : " · 0€ Einmalpreis"}
                      </div>
                      {o.cashback && parseFloat(o.cashback) > 0 && (
                        <div className="text-xs text-emerald-400 mt-1">✓ {parseFloat(o.cashback).toFixed(0)} € Cashback</div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-black">{price.toFixed(2).replace(".", ",")} €</div>
                        <div className="text-[10px] text-white/30">/Monat</div>
                      </div>
                      <svg className="w-5 h-5 text-white/20 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                    </div>
                  </a>
                );
              })}
            </div>
            <p className="text-xs text-white/25 mt-3 text-center">* Affiliate-Links · Preise können variieren · Letzte Aktualisierung: täglich</p>
          </section>
        ) : (
          <div className="text-center py-12 text-white/40 mb-12">
            <p className="text-lg mb-2">Aktuell keine direkten {pName} Angebote</p>
            <p className="text-sm">BELLA findet trotzdem den besten Deal für dich.</p>
          </div>
        )}

        {/* Other providers */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-5">{product.name} auch bei anderen Anbietern</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {otherProviders.map(([k, n]) => (
              <Link key={k} href={`/handys/${slug}/${k}`}
                className="block p-3 rounded-xl bg-white/[0.04] border border-white/8 hover:border-indigo-500/30 transition-all text-center">
                <div className={`text-xs font-bold text-white inline-block px-2 py-0.5 rounded bg-gradient-to-r ${getProviderColor(n)} mb-1`}>{n}</div>
                <div className="text-xs text-white/50">{product.name}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-5">Häufige Fragen</h2>
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

        {/* Device page link + BELLA CTA */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link href={`/handys/${slug}`} className="p-4 rounded-2xl bg-white/[0.04] border border-white/8 hover:border-white/20 transition-all">
            <div className="text-sm font-bold mb-1">Alle Anbieter vergleichen</div>
            <div className="text-xs text-white/40">→ {product.name} mit Vertrag – kompletter Vergleich</div>
          </Link>
          <Link href="/" className="p-4 rounded-2xl bg-gradient-to-r from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 hover:border-indigo-500/50 transition-all">
            <div className="text-sm font-bold mb-1">BELLA persönlich fragen</div>
            <div className="text-xs text-white/40">→ KI-Berater findet deinen optimalen Tarif</div>
          </Link>
        </div>
      </main>
    </div>
  );
}
