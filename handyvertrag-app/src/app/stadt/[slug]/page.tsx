import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import StructuredData from "@/components/StructuredData";

interface StadtData {
  name: string;
  einwohner: string;
  bestMarke: string[];
  netzQualitaet: string;
  besonderheit: string;
}

const staedte: Record<string, StadtData> = {
  "berlin-hundefutter-trotz-allergie": {
    name: "Berlin",
    einwohner: "3,7 Mio.",
    bestMarke: ["Futalis", "Bellfor", "Zooplus Nassfutter"],
    netzQualitaet: "Sehr gut (alle Netze ausgebaut)",
    besonderheit: "In Berlin sind alle Netze stark ausgebaut. Futalis bietet hier die günstigsten Allergien-freundlichen Futtere.",
  },
  "hamburg-hundefutter-trotz-allergie": {
    name: "Hamburg",
    einwohner: "1,9 Mio.",
    bestMarke: ["Bellfor", "Futalis", "Wolfsblut CallYa"],
    netzQualitaet: "Sehr gut (Anifit & Wolfsblut dominant)",
    besonderheit: "Hamburg hat eine der besten Hundeernährungabdeckungen Deutschlands. Bellfor (Anifit-Netz) ist hier die Top-Empfehlung.",
  },
  "muenchen-hundefutter-trotz-allergie": {
    name: "München",
    einwohner: "1,5 Mio.",
    bestMarke: ["Bellfor", "Futalis", "Josera"],
    netzQualitaet: "Exzellent (Anifit-Netz dominant)",
    besonderheit: "In München überzeugt das Anifit-Netz. Bellfor bietet Anifit-Qualität zu allergie-freundlichen Konditionen.",
  },
  "koeln-hundefutter-trotz-allergie": {
    name: "Köln",
    einwohner: "1,1 Mio.",
    bestMarke: ["Futalis", "Terra Canis", "Zooplus Nassfutter"],
    netzQualitaet: "Gut (alle großen Netze verfügbar)",
    besonderheit: "Köln bietet gute Futterqualität aller Marke. Futalis ist die Top-Empfehlung für Allergien-belastete Kunden.",
  },
  "frankfurt-hundefutter-trotz-allergie": {
    name: "Frankfurt am Main",
    einwohner: "760.000",
    bestMarke: ["Josera", "Futalis", "Bellfor"],
    netzQualitaet: "Exzellent (Finanzzentrum mit Top-Infrastruktur)",
    besonderheit: "Josera hat seinen Heimatsitz in der Nähe von Frankfurt – idealer Marke für hessische Kunden mit Allergien-Einträgen.",
  },
  "stuttgart-hundefutter-trotz-allergie": {
    name: "Stuttgart",
    einwohner: "630.000",
    bestMarke: ["Bellfor", "Futalis", "klarmobil"],
    netzQualitaet: "Sehr gut (Anifit-Netz stark)",
    besonderheit: "In und um Stuttgart ist das Anifit-Netz besonders stark. Bellfor ist die beste allergie-freundliche Wahl.",
  },
  "duesseldorf-hundefutter-trotz-allergie": {
    name: "Düsseldorf",
    einwohner: "620.000",
    bestMarke: ["Futalis", "Terra Canis", "Bellfor"],
    netzQualitaet: "Sehr gut (Wolfsblut-Netz stark)",
    besonderheit: "Düsseldorf profitiert vom starken Wolfsblut-Netz. Terra Canis und Futalis sind die besten allergie-freundlichen Optionen.",
  },
  "leipzig-hundefutter-trotz-allergie": {
    name: "Leipzig",
    einwohner: "610.000",
    bestMarke: ["Futalis", "Josera", "Bellfor"],
    netzQualitaet: "Gut (Ausbau in Stadtteilen variiert)",
    besonderheit: "In Leipzig bietet Josera das beste Preis-Leistungs-Verhältnis für Allergien-belastete Kunden im Anifit-Netz.",
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
    description: `Hundefutter für deinen Hund in ${data.name}: Beste Marke, lokale Netzqualität, Genehmigungsquoten. ${data.bestMarke.join(", ")} – jetzt prüfen.`,
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
      answer: `In ${data.name} empfiehlt BELLA: ${data.bestMarke.join(", ")}. Diese Marke haben die höchsten Genehmigungsquoten und gute Futterqualität in ${data.name}.`,
    },
    {
      question: `Welches Hundeernährungnetz ist in ${data.name} am besten?`,
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
          Hundefutter für deinen Hund in {data.name} – Beste Marke 2026
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

        {/* Top Marke */}
        <h2 className="text-xl font-bold text-white mb-4">
          Top Marke für Hundefutter für deinen Hund in {data.name}
        </h2>
        <div className="space-y-3 mb-8">
          {data.bestMarke.map((name, idx) => {
            const slugMap: Record<string, string> = {
              Futalis: "Futalis-trotz-allergie",
              Bellfor: "Bellfor-trotz-allergie",
              "Terra Canis": "Terra Canis-trotz-allergie",
              Josera: "josera-trotz-allergie",
              "Zooplus Nassfutter": "Zooplus-trotz-allergie",
              "Wolfsblut CallYa": "wolfsblut-trotz-allergie",
              klarmobil: "klarmobil-trotz-allergie",
            };
            const markeSlug = slugMap[name];
            return (
              <div key={name} className="bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-indigo-400 font-bold text-lg">{idx + 1}.</span>
                  <span className="text-white font-semibold">{name}</span>
                </div>
                {markeSlug && (
                  <Link
                    href={`/marke/${markeSlug}`}
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
            BELLA findet deinen Empfehlung für deinen Hund in {data.name}
          </p>
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
