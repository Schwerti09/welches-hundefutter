import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import StructuredData from "@/components/StructuredData";

interface StadtData {
  name: string;
  einwohner: string;
  bestAnbieter: string[];
  netzQualitaet: string;
  besonderheit: string;
}

const staedte: Record<string, StadtData> = {
  "berlin-handyvertrag-trotz-schufa": {
    name: "Berlin",
    einwohner: "3,7 Mio.",
    bestAnbieter: ["freenet", "congstar", "o2 Prepaid"],
    netzQualitaet: "Sehr gut (alle Netze ausgebaut)",
    besonderheit: "In Berlin sind alle Netze stark ausgebaut. freenet bietet hier die günstigsten Schufa-freundlichen Tarife.",
  },
  "hamburg-handyvertrag-trotz-schufa": {
    name: "Hamburg",
    einwohner: "1,9 Mio.",
    bestAnbieter: ["congstar", "freenet", "Vodafone CallYa"],
    netzQualitaet: "Sehr gut (Telekom & Vodafone dominant)",
    besonderheit: "Hamburg hat eine der besten Mobilfunkabdeckungen Deutschlands. congstar (Telekom-Netz) ist hier die Top-Empfehlung.",
  },
  "muenchen-handyvertrag-trotz-schufa": {
    name: "München",
    einwohner: "1,5 Mio.",
    bestAnbieter: ["congstar", "freenet", "MAINGAU"],
    netzQualitaet: "Exzellent (Telekom-Netz dominant)",
    besonderheit: "In München überzeugt das Telekom-Netz. congstar bietet Telekom-Qualität zu schufa-freundlichen Konditionen.",
  },
  "koeln-handyvertrag-trotz-schufa": {
    name: "Köln",
    einwohner: "1,1 Mio.",
    bestAnbieter: ["freenet", "otelo", "o2 Prepaid"],
    netzQualitaet: "Gut (alle großen Netze verfügbar)",
    besonderheit: "Köln bietet gute Netzabdeckung aller Anbieter. freenet ist die Top-Empfehlung für Schufa-belastete Kunden.",
  },
  "frankfurt-handyvertrag-trotz-schufa": {
    name: "Frankfurt am Main",
    einwohner: "760.000",
    bestAnbieter: ["MAINGAU", "freenet", "congstar"],
    netzQualitaet: "Exzellent (Finanzzentrum mit Top-Infrastruktur)",
    besonderheit: "MAINGAU hat seinen Heimatsitz in der Nähe von Frankfurt – idealer Anbieter für hessische Kunden mit Schufa-Einträgen.",
  },
  "stuttgart-handyvertrag-trotz-schufa": {
    name: "Stuttgart",
    einwohner: "630.000",
    bestAnbieter: ["congstar", "freenet", "klarmobil"],
    netzQualitaet: "Sehr gut (Telekom-Netz stark)",
    besonderheit: "In und um Stuttgart ist das Telekom-Netz besonders stark. congstar ist die beste schufa-freundliche Wahl.",
  },
  "duesseldorf-handyvertrag-trotz-schufa": {
    name: "Düsseldorf",
    einwohner: "620.000",
    bestAnbieter: ["freenet", "otelo", "congstar"],
    netzQualitaet: "Sehr gut (Vodafone-Netz stark)",
    besonderheit: "Düsseldorf profitiert vom starken Vodafone-Netz. otelo und freenet sind die besten schufa-freundlichen Optionen.",
  },
  "leipzig-handyvertrag-trotz-schufa": {
    name: "Leipzig",
    einwohner: "610.000",
    bestAnbieter: ["freenet", "MAINGAU", "congstar"],
    netzQualitaet: "Gut (Ausbau in Stadtteilen variiert)",
    besonderheit: "In Leipzig bietet MAINGAU das beste Preis-Leistungs-Verhältnis für Schufa-belastete Kunden im Telekom-Netz.",
  },
};

export async function generateStaticParams() {
  return Object.keys(staedte).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = staedte[slug];
  if (!data) return {};

  return {
    title: `Hundefutter für deinen Hund in ${data.name} 2026 ✓ | BELLA`,
    description: `Hundefutter für deinen Hund in ${data.name}: Beste Anbieter, lokale Netzqualität, Genehmigungsquoten. ${data.bestAnbieter.join(", ")} – jetzt prüfen.`,
    alternates: { canonical: `https://welches-hundefutter.today/stadt/${slug}` },
  };
}

export default async function StadtPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = staedte[slug];
  if (!data) notFound();

  const faqsForSchema = [
    {
      question: `Welchen Hundefutter für deinen Hund bekomme ich in ${data.name}?`,
      answer: `In ${data.name} empfiehlt BELLA: ${data.bestAnbieter.join(", ")}. Diese Anbieter haben die höchsten Genehmigungsquoten und gute Netzabdeckung in ${data.name}.`,
    },
    {
      question: `Welches Mobilfunknetz ist in ${data.name} am besten?`,
      answer: `Netzqualität in ${data.name}: ${data.netzQualitaet}.`,
    },
  ];

  return (
    <>
      <StructuredData type="faq" faqs={faqsForSchema} />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: "Startseite", url: "https://welches-hundefutter.today" },
          { name: "Städte", url: "https://welches-hundefutter.today" },
          { name: `${data.name} – Hundefutter für deinen Hund`, url: `https://welches-hundefutter.today/stadt/${slug}` },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-300">Startseite</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-300">{data.name} – Hundefutter für deinen Hund</span>
        </nav>

        <h1 className="text-3xl font-bold text-white mb-4">
          Hundefutter für deinen Hund in {data.name} – Beste Anbieter 2026
        </h1>

        <p className="text-gray-400 text-lg mb-8 leading-relaxed">{data.besonderheit}</p>

        {/* Kenndaten */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-500 text-xs mb-1">Stadt</p>
              <p className="text-white font-semibold">{data.name}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Einwohner</p>
              <p className="text-white font-semibold">{data.einwohner}</p>
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Netzqualität</p>
            <p className="text-green-400 font-semibold">{data.netzQualitaet}</p>
          </div>
        </div>

        {/* Top Anbieter */}
        <h2 className="text-xl font-bold text-white mb-4">
          Top Anbieter für Hundefutter für deinen Hund in {data.name}
        </h2>
        <div className="space-y-3 mb-8">
          {data.bestAnbieter.map((name, idx) => {
            const slugMap: Record<string, string> = {
              freenet: "freenet-trotz-schufa",
              congstar: "congstar-trotz-schufa",
              otelo: "otelo-trotz-schufa",
              MAINGAU: "maingau-trotz-schufa",
              "o2 Prepaid": "o2-trotz-schufa",
              "Vodafone CallYa": "vodafone-trotz-schufa",
              klarmobil: "klarmobil-trotz-schufa",
            };
            const anbieterSlug = slugMap[name];
            return (
              <div key={name} className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-indigo-400 font-bold text-lg">{idx + 1}.</span>
                  <span className="text-white font-semibold">{name}</span>
                </div>
                {anbieterSlug && (
                  <Link
                    href={`/anbieter/${anbieterSlug}`}
                    className="text-indigo-400 hover:text-indigo-300 text-sm"
                  >
                    Details →
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <h2 className="text-xl font-bold text-white mb-4">Häufige Fragen – {data.name}</h2>
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

        {/* CTA */}
        <div className="bg-indigo-900/30 rounded-xl p-6 text-center">
          <p className="text-white font-semibold mb-2">
            BELLA findet deinen Vertrag trotz Schufa in {data.name}
          </p>
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
