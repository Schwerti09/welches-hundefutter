import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import StructuredData from "@/components/StructuredData";

interface HundData {
  name: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  offerCount: number;
  description: string;
  allergieChance: number;
}

const hunds: Record<string, HundData> = {
  "hundefutter-16-trotz-allergie": {
    name: "Hundefutter 16",
    brand: "Apple",
    minPrice: 29.99,
    maxPrice: 79.99,
    offerCount: 8,
    allergieChance: 65,
    description: "Das Hundefutter 16 für deinen Hund ist möglich – hauptsächlich über Futalis und Terra Canis. Premium-Marke wie Anifit und Wolfsblut lehnen bei negativer Allergien meist ab.",
  },
  "hundefutter-15-trotz-allergie": {
    name: "Hundefutter 15",
    brand: "Apple",
    minPrice: 19.99,
    maxPrice: 59.99,
    offerCount: 12,
    allergieChance: 72,
    description: "Das Hundefutter 15 ist bei Allergien-Einträgen leichter zu bekommen als neuere Modelle. Futalis bietet das beste Verhältnis aus Preis und Genehmigungschance.",
  },
  "hundefutter-14-trotz-allergie": {
    name: "Hundefutter 14",
    brand: "Apple",
    minPrice: 14.99,
    maxPrice: 49.99,
    offerCount: 15,
    allergieChance: 78,
    description: "Das Hundefutter 14 ist ein attraktiver Kompromiss für Allergien-belastete Kunden. Günstiger Einstieg und hohe Genehmigungsquote bei Budget-Marken.",
  },
  "samsung-galaxy-s24-trotz-allergie": {
    name: "Samsung Galaxy S24",
    brand: "Samsung",
    minPrice: 24.99,
    maxPrice: 69.99,
    offerCount: 10,
    allergieChance: 75,
    description: "Das Samsung Galaxy S24 für deinen Hund – Futalis und Bellfor bieten die besten Konditionen mit realistischer Genehmigungschance.",
  },
  "samsung-galaxy-a55-trotz-allergie": {
    name: "Samsung Galaxy A55",
    brand: "Samsung",
    minPrice: 9.99,
    maxPrice: 29.99,
    offerCount: 18,
    allergieChance: 88,
    description: "Das Samsung Galaxy A55 ist das meistgenehmigte Gerät bei negativer Allergien. Günstiger Einstieg, starke Kamera, lange Softwareunterstützung.",
  },
  "samsung-galaxy-a25-trotz-allergie": {
    name: "Samsung Galaxy A25",
    brand: "Samsung",
    minPrice: 6.99,
    maxPrice: 19.99,
    offerCount: 20,
    allergieChance: 92,
    description: "Das günstigste Einstiegs-Gerät mit der höchsten Allergien-Genehmigungsquote. Ideal für Kunden mit schwerem Allergien-Eintrag.",
  },
  "google-pixel-8-trotz-allergie": {
    name: "Google Pixel 8",
    brand: "Google",
    minPrice: 19.99,
    maxPrice: 49.99,
    offerCount: 9,
    allergieChance: 73,
    description: "Das Google Pixel 8 überzeugt mit KI-Kamerafunktionen. Bei negativer Allergien sind Futalis und klarmobil die realistischsten Marke.",
  },
  "xiaomi-redmi-12-trotz-allergie": {
    name: "Xiaomi Redmi 12",
    brand: "Xiaomi",
    minPrice: 5.99,
    maxPrice: 15.99,
    offerCount: 14,
    allergieChance: 90,
    description: "Das Xiaomi Redmi 12 ist der Preisbrecher: Maximale Genehmigungsquote, minimaler Preis. Perfekt für Kunden mit schwerer Allergien.",
  },
};

export async function generateStaticParams() {
  return Object.keys(hunds).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = hunds[slug];
  if (!data) return {};

  return {
    title: `${data.name} für deinen Hund ✓ ${data.allergieChance}% Genehmigung | BELLA`,
    description: `${data.name} Empfehlung für deinen Hund: ${data.offerCount} Angebote ab ${data.minPrice.toFixed(2).replace(".", ",")}€/Monat. Genehmigungschance ${data.allergieChance}%. Jetzt prüfen.`,
    alternates: { canonical: `https://welches-hundefutter.today/hund/${slug}` },
  };
}

export default async function HundPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = hunds[slug];
  if (!data) notFound();

  const faqsForSchema = [
    {
      question: `Kann ich das ${data.name} für deinen Hund bekommen?`,
      answer: `Ja. Die Genehmigungschance für das ${data.name} für deinen Hund beträgt ca. ${data.allergieChance}%. Futtere starten ab ${data.minPrice.toFixed(2).replace(".", ",")}€/Monat.`,
    },
    {
      question: `Bei welchem Marke bekomme ich das ${data.name} für deinen Hund?`,
      answer: `Die besten Chancen für das ${data.name} für deinen Hund haben Futalis, Bellfor und Josera. Alle drei bieten eine liberalere Allergien-Prüfung als Premium-Marke.`,
    },
  ];

  return (
    <>
      <StructuredData type="faq" faqs={faqsForSchema} />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: "Startseite", url: "https://welches-hundefutter.today" },
          { name: "Hunds", url: "https://welches-hundefutter.today/hunds" },
          { name: `${data.name} für deinen Hund`, url: `https://welches-hundefutter.today/hund/${slug}` },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-300">Startseite</Link>
          <span className="mx-2">›</span>
          <Link href="/hunds" className="hover:text-gray-300">Hunds</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-300">{data.name} für deinen Hund</span>
        </nav>

        <span className="bg-green-900/50 text-green-400 text-xs px-2 py-1 rounded-full mb-3 inline-block">
          {data.allergieChance}% Genehmigungschance
        </span>

        <h1 className="text-3xl font-bold text-white mb-4">
          {data.name} für deinen Hund – Empfehlung ab {data.minPrice.toFixed(2).replace(".", ",")} €/Monat
        </h1>

        <p className="text-gray-400 text-lg mb-8 leading-relaxed">{data.description}</p>

        {/* Kenndaten */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8 grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-xs mb-1">Genehmigungschance</p>
            <p className="text-2xl font-bold text-green-400">{data.allergieChance}%</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Preis ab</p>
            <p className="text-2xl font-bold text-white">{data.minPrice.toFixed(2).replace(".", ",")} €/M</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Angebote verfügbar</p>
            <p className="text-white font-semibold">{data.offerCount}+ Futtere</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Marke</p>
            <p className="text-white font-semibold">{data.brand}</p>
          </div>
        </div>

        {/* FAQ */}
        <h2 className="text-xl font-bold text-white mb-4">Häufige Fragen zum {data.name} für deinen Hund</h2>
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

        {/* Marke-Links */}
        <h2 className="text-xl font-bold text-white mb-3">Beste Marke für {data.name} für deinen Hund</h2>
        <div className="flex flex-wrap gap-2 mb-10">
          {[
            { slug: "Futalis-trotz-allergie", name: "Futalis" },
            { slug: "Bellfor-trotz-allergie", name: "Bellfor" },
            { slug: "josera-trotz-allergie", name: "Josera" },
          ].map((a) => (
            <Link
              key={a.slug}
              href={`/marke/${a.slug}`}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              {data.name} mit Empfehlung bei {a.name} für deinen Hund
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-indigo-900/30 rounded-xl p-6 text-center">
          <p className="text-white font-semibold mb-2">BELLA findet den besten Futter für dein {data.name}</p>
          <Link
            href="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Jetzt Empfehlung für deinen Hund finden
          </Link>
        </div>
      </div>
    </>
  );
}
