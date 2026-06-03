import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import StructuredData from "@/components/StructuredData";

interface HandyData {
  name: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  offerCount: number;
  description: string;
  schufaChance: number;
}

const handys: Record<string, HandyData> = {
  "iphone-16-trotz-schufa": {
    name: "iPhone 16",
    brand: "Apple",
    minPrice: 29.99,
    maxPrice: 79.99,
    offerCount: 8,
    schufaChance: 65,
    description: "Das iPhone 16 trotz Schufa ist möglich – hauptsächlich über freenet und otelo. Premium-Anbieter wie Telekom und Vodafone lehnen bei negativer Schufa meist ab.",
  },
  "iphone-15-trotz-schufa": {
    name: "iPhone 15",
    brand: "Apple",
    minPrice: 19.99,
    maxPrice: 59.99,
    offerCount: 12,
    schufaChance: 72,
    description: "Das iPhone 15 ist bei Schufa-Einträgen leichter zu bekommen als neuere Modelle. freenet bietet das beste Verhältnis aus Preis und Genehmigungschance.",
  },
  "iphone-14-trotz-schufa": {
    name: "iPhone 14",
    brand: "Apple",
    minPrice: 14.99,
    maxPrice: 49.99,
    offerCount: 15,
    schufaChance: 78,
    description: "Das iPhone 14 ist ein attraktiver Kompromiss für Schufa-belastete Kunden. Günstiger Einstieg und hohe Genehmigungsquote bei Budget-Anbietern.",
  },
  "samsung-galaxy-s24-trotz-schufa": {
    name: "Samsung Galaxy S24",
    brand: "Samsung",
    minPrice: 24.99,
    maxPrice: 69.99,
    offerCount: 10,
    schufaChance: 75,
    description: "Das Samsung Galaxy S24 trotz Schufa – freenet und congstar bieten die besten Konditionen mit realistischer Genehmigungschance.",
  },
  "samsung-galaxy-a55-trotz-schufa": {
    name: "Samsung Galaxy A55",
    brand: "Samsung",
    minPrice: 9.99,
    maxPrice: 29.99,
    offerCount: 18,
    schufaChance: 88,
    description: "Das Samsung Galaxy A55 ist das meistgenehmigte Gerät bei negativer Schufa. Günstiger Einstieg, starke Kamera, lange Softwareunterstützung.",
  },
  "samsung-galaxy-a25-trotz-schufa": {
    name: "Samsung Galaxy A25",
    brand: "Samsung",
    minPrice: 6.99,
    maxPrice: 19.99,
    offerCount: 20,
    schufaChance: 92,
    description: "Das günstigste Einstiegs-Gerät mit der höchsten Schufa-Genehmigungsquote. Ideal für Kunden mit schwerem Schufa-Eintrag.",
  },
  "google-pixel-8-trotz-schufa": {
    name: "Google Pixel 8",
    brand: "Google",
    minPrice: 19.99,
    maxPrice: 49.99,
    offerCount: 9,
    schufaChance: 73,
    description: "Das Google Pixel 8 überzeugt mit KI-Kamerafunktionen. Bei negativer Schufa sind freenet und klarmobil die realistischsten Anbieter.",
  },
  "xiaomi-redmi-12-trotz-schufa": {
    name: "Xiaomi Redmi 12",
    brand: "Xiaomi",
    minPrice: 5.99,
    maxPrice: 15.99,
    offerCount: 14,
    schufaChance: 90,
    description: "Das Xiaomi Redmi 12 ist der Preisbrecher: Maximale Genehmigungsquote, minimaler Preis. Perfekt für Kunden mit schwerer Schufa.",
  },
};

export async function generateStaticParams() {
  return Object.keys(handys).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = handys[slug];
  if (!data) return {};

  return {
    title: `${data.name} trotz Schufa ✓ ${data.schufaChance}% Genehmigung | BELLA`,
    description: `${data.name} Vertrag trotz Schufa: ${data.offerCount} Angebote ab ${data.minPrice.toFixed(2).replace(".", ",")}€/Monat. Genehmigungschance ${data.schufaChance}%. Jetzt prüfen.`,
    alternates: { canonical: `https://welches-hundefutter.today/handy/${slug}` },
  };
}

export default async function HandyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = handys[slug];
  if (!data) notFound();

  const faqsForSchema = [
    {
      question: `Kann ich das ${data.name} trotz Schufa bekommen?`,
      answer: `Ja. Die Genehmigungschance für das ${data.name} trotz Schufa beträgt ca. ${data.schufaChance}%. Tarife starten ab ${data.minPrice.toFixed(2).replace(".", ",")}€/Monat.`,
    },
    {
      question: `Bei welchem Anbieter bekomme ich das ${data.name} trotz Schufa?`,
      answer: `Die besten Chancen für das ${data.name} trotz Schufa haben freenet, congstar und MAINGAU. Alle drei bieten eine liberalere Schufa-Prüfung als Premium-Anbieter.`,
    },
  ];

  return (
    <>
      <StructuredData type="faq" faqs={faqsForSchema} />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: "Startseite", url: "https://welches-hundefutter.today" },
          { name: "Handys", url: "https://welches-hundefutter.today/handys" },
          { name: `${data.name} trotz Schufa`, url: `https://welches-hundefutter.today/handy/${slug}` },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-300">Startseite</Link>
          <span className="mx-2">›</span>
          <Link href="/handys" className="hover:text-gray-300">Handys</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-300">{data.name} trotz Schufa</span>
        </nav>

        <span className="bg-green-900/50 text-green-400 text-xs px-2 py-1 rounded-full mb-3 inline-block">
          {data.schufaChance}% Genehmigungschance
        </span>

        <h1 className="text-3xl font-bold text-white mb-4">
          {data.name} trotz Schufa – Vertrag ab {data.minPrice.toFixed(2).replace(".", ",")} €/Monat
        </h1>

        <p className="text-gray-400 text-lg mb-8 leading-relaxed">{data.description}</p>

        {/* Kenndaten */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8 grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-xs mb-1">Genehmigungschance</p>
            <p className="text-2xl font-bold text-green-400">{data.schufaChance}%</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Preis ab</p>
            <p className="text-2xl font-bold text-white">{data.minPrice.toFixed(2).replace(".", ",")} €/M</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Angebote verfügbar</p>
            <p className="text-white font-semibold">{data.offerCount}+ Tarife</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Marke</p>
            <p className="text-white font-semibold">{data.brand}</p>
          </div>
        </div>

        {/* FAQ */}
        <h2 className="text-xl font-bold text-white mb-4">Häufige Fragen zum {data.name} trotz Schufa</h2>
        <div className="space-y-3 mb-10">
          {faqsForSchema.map((faq) => (
            <details key={faq.question} className="bg-gray-900 rounded-lg group">
              <summary className="flex justify-between items-start cursor-pointer list-none px-5 py-4">
                <span className="font-semibold text-white text-sm pr-4">{faq.question}</span>
                <span className="text-gray-500 mt-0.5 shrink-0 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="px-5 pb-4 text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-3">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        {/* Anbieter-Links */}
        <h2 className="text-xl font-bold text-white mb-3">Beste Anbieter für {data.name} trotz Schufa</h2>
        <div className="flex flex-wrap gap-2 mb-10">
          {[
            { slug: "freenet-trotz-schufa", name: "freenet" },
            { slug: "congstar-trotz-schufa", name: "congstar" },
            { slug: "maingau-trotz-schufa", name: "MAINGAU" },
          ].map((a) => (
            <Link
              key={a.slug}
              href={`/anbieter/${a.slug}`}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              {data.name} mit Vertrag bei {a.name} trotz Schufa
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-indigo-900/30 rounded-xl p-6 text-center">
          <p className="text-white font-semibold mb-2">BELLA findet den besten Tarif für dein {data.name}</p>
          <Link
            href="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Jetzt Vertrag trotz Schufa finden
          </Link>
        </div>
      </div>
    </>
  );
}
