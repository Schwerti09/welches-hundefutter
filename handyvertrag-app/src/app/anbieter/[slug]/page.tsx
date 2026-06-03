import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import StructuredData from "@/components/StructuredData";

interface AnbieterData {
  name: string;
  acceptanceRate: number;
  minPrice: number;
  network: string;
  schufaFriendly: boolean;
  description: string;
  besonderheiten: string[];
  empfohlenFuer: string[];
}

const anbieter: Record<string, AnbieterData> = {
  "freenet-trotz-schufa": {
    name: "freenet",
    acceptanceRate: 85,
    minPrice: 9.99,
    network: "Vodafone & Telekom",
    schufaFriendly: true,
    description: "freenet ist Deutschlands führender schufa-freundlicher Mobilfunkanbieter. Als Mobilfunk-Reseller nutzt freenet die Netze von Vodafone und Telekom und bietet dabei eine deutlich liberalere Bonitätsprüfung als die Netzbetreiber selbst.",
    besonderheiten: ["Social-Scoring statt harter Schufa", "Tarife ab 9,99€/Monat", "Geräteauswahl mit Anzahlung", "Widerruf innerhalb 14 Tagen"],
    empfohlenFuer: ["Schufa-Einträge durch Inkasso", "Niedrigeinkommen", "Selbständige", "Studenten"],
  },
  "congstar-trotz-schufa": {
    name: "congstar",
    acceptanceRate: 80,
    minPrice: 14.99,
    network: "Telekom",
    schufaFriendly: true,
    description: "congstar ist eine Telekom-Tochter mit eigenem Scoring-System. Die Schufa-Prüfung ist weniger strikt als bei der Telekom direkt. congstar bietet ausgezeichnete Netzqualität im Telekom-Netz.",
    besonderheiten: ["Telekom-Netzqualität", "Flexibel kündbarer Prepaid", "Tarife ab 14,99€/Monat", "Eigenes Scoring-System"],
    empfohlenFuer: ["Nutzer mit Telekom-Netz-Anspruch", "Mobilität in ländlichen Regionen", "Moderate Schufa-Einträge"],
  },
  "otelo-trotz-schufa": {
    name: "otelo",
    acceptanceRate: 75,
    minPrice: 12.99,
    network: "Vodafone",
    schufaFriendly: true,
    description: "otelo ist eine Vodafone-Marke für Budget-Kunden. Die Bonitätsprüfung ist weniger streng als bei Vodafone direkt. Starke Allnet-Flats zu günstigen Preisen.",
    besonderheiten: ["Vodafone-Netz", "Allnet-Flat ab 12,99€", "Keine Einmalzahlung bei SIM-Only", "Flexible Laufzeiten"],
    empfohlenFuer: ["Stadtnutzer mit Vodafone-Netz", "Budget-orientierte Nutzer", "Allnet-Flat-Bedarf"],
  },
  "maingau-trotz-schufa": {
    name: "MAINGAU Energie",
    acceptanceRate: 78,
    minPrice: 6.99,
    network: "Telekom",
    schufaFriendly: true,
    description: "MAINGAU ist der günstigste schufa-freundliche Anbieter Deutschlands. Als Energie- und Mobilfunkanbieter nutzt MAINGAU das Telekom-Netz und hat ein eigenes Scoring-Modell.",
    besonderheiten: ["Günstigste Option ab 6,99€", "Telekom-Netz", "Kombinierbar mit Strom/Gas", "Eigenes Scoring-Modell"],
    empfohlenFuer: ["Sparfüchse", "Bestandskunden mit Strom/Gas", "Leichte Schufa-Einträge"],
  },
  "klarmobil-trotz-schufa": {
    name: "klarmobil",
    acceptanceRate: 72,
    minPrice: 8.99,
    network: "Telekom",
    schufaFriendly: true,
    description: "klarmobil bietet günstige Tarife im Telekom-Netz und hat eine moderate Schufa-Prüfung.",
    besonderheiten: ["Telekom-Netz", "SIM-Only ab 8,99€", "Monatlich kündbar erhältlich"],
    empfohlenFuer: ["SIM-Only-Bedarf", "Moderate Bonitätsprobleme"],
  },
  "1und1-trotz-schufa": {
    name: "1&1",
    acceptanceRate: 70,
    minPrice: 9.99,
    network: "O2 / 5G-Eigennetz",
    schufaFriendly: true,
    description: "1&1 baut aktuell ein eigenes 5G-Netz auf und bietet dabei Social-Scoring als Alternative zur Schufa-Prüfung.",
    besonderheiten: ["Social-Scoring System", "Eigenes 5G-Netz im Aufbau", "Tarife ab 9,99€", "345+ Angebote verfügbar"],
    empfohlenFuer: ["5G-affine Nutzer", "Moderate Schufa-Einträge"],
  },
  "o2-trotz-schufa": {
    name: "o2 Prepaid",
    acceptanceRate: 100,
    minPrice: 9.99,
    network: "o2",
    schufaFriendly: true,
    description: "o2 Prepaid ist die sichere Option: Keine Schufa-Prüfung, keine Laufzeit, volle Kontrolle. Perfekt für alle, die einen Postpaid-Vertrag nicht bekommen.",
    besonderheiten: ["100% Genehmigung", "Keine Schufa-Prüfung", "Keine Mindestlaufzeit", "Sofort verfügbar"],
    empfohlenFuer: ["Schwere Schufa-Einträge", "Privatinsolvenz", "Sofortbedarf", "Kein festes Einkommen"],
  },
  "vodafone-trotz-schufa": {
    name: "Vodafone CallYa",
    acceptanceRate: 100,
    minPrice: 9.99,
    network: "Vodafone",
    schufaFriendly: true,
    description: "Vodafone CallYa ist das echte Prepaid-Angebot von Vodafone – ohne Schufa, ohne Bindung.",
    besonderheiten: ["100% Genehmigung", "Starkes Vodafone-Netz", "Keine Schufa", "Aufladbar per App"],
    empfohlenFuer: ["Vodafone-Netz-Präferenz", "Flexibilitätsbedarf", "Schwere Schufa-Einträge"],
  },
  "telekom-trotz-schufa": {
    name: "Telekom MagentaMobil Prepaid",
    acceptanceRate: 100,
    minPrice: 9.95,
    network: "Telekom",
    schufaFriendly: true,
    description: "Bestes Netz Deutschlands als Prepaid – ohne Schufa-Prüfung.",
    besonderheiten: ["100% Genehmigung", "Bestes Netz Deutschlands", "97% Bevölkerungsabdeckung", "Keine Schufa"],
    empfohlenFuer: ["Ländliche Regionen", "Vielreisende", "Zuverlässigkeitsbedarf"],
  },
};

export async function generateStaticParams() {
  return Object.keys(anbieter).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = anbieter[slug];
  if (!data) return {};

  return {
    title: `${data.name} Handyvertrag trotz Schufa ✓ ${data.acceptanceRate}% Annahme | HANSI`,
    description: `${data.name} bei negativer Schufa: Annahmechance ${data.acceptanceRate}%, Tarife ab ${data.minPrice.toFixed(2).replace(".", ",")}€/Monat. Echte Erfahrungen & Empfehlung von HANSI.`,
    alternates: { canonical: `https://handytrotzschufa.today/anbieter/${slug}` },
  };
}

const alternativeAnbieter = [
  { slug: "freenet-trotz-schufa", name: "freenet" },
  { slug: "congstar-trotz-schufa", name: "congstar" },
  { slug: "otelo-trotz-schufa", name: "otelo" },
  { slug: "maingau-trotz-schufa", name: "MAINGAU" },
];

export default async function AnbieterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = anbieter[slug];
  if (!data) notFound();

  const faqsForSchema = [
    {
      question: `Kann ich bei ${data.name} einen Vertrag trotz Schufa bekommen?`,
      answer: `Ja. ${data.name} hat eine Annahmechance von ${data.acceptanceRate}% auch bei negativem Schufa-Eintrag. Tarife starten ab ${data.minPrice.toFixed(2).replace(".", ",")}€/Monat.`,
    },
    {
      question: `Welches Netz nutzt ${data.name}?`,
      answer: `${data.name} nutzt das ${data.network}-Netz.`,
    },
    {
      question: `Ab wann sind Tarife bei ${data.name} erhältlich?`,
      answer: `Tarife bei ${data.name} starten ab ${data.minPrice.toFixed(2).replace(".", ",")}€/Monat.`,
    },
  ];

  return (
    <>
      <StructuredData type="faq" faqs={faqsForSchema} />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: "Startseite", url: "https://handytrotzschufa.today" },
          { name: "Anbieter", url: "https://handytrotzschufa.today/anbieter" },
          { name: `${data.name} trotz Schufa`, url: `https://handytrotzschufa.today/anbieter/${slug}` },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-300">Startseite</Link>
          <span className="mx-2">›</span>
          <span className="hover:text-gray-300">Anbieter</span>
          <span className="mx-2">›</span>
          <span className="text-gray-300">{data.name} trotz Schufa</span>
        </nav>

        <div className="flex items-center gap-3 mb-2">
          {data.acceptanceRate === 100 ? (
            <span className="bg-green-900/50 text-green-400 text-xs px-2 py-1 rounded-full">100% Genehmigung</span>
          ) : (
            <span className="bg-indigo-900/50 text-indigo-300 text-xs px-2 py-1 rounded-full">{data.acceptanceRate}% Annahme</span>
          )}
          {data.schufaFriendly && (
            <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full">Schufa-freundlich</span>
          )}
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          {data.name} Handyvertrag trotz Schufa – {data.acceptanceRate}% Genehmigungschance
        </h1>

        <p className="text-gray-400 text-lg mb-8 leading-relaxed">{data.description}</p>

        {/* Kenndaten */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8 grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-xs mb-1">Annahmechance trotz Schufa</p>
            <p className="text-2xl font-bold text-green-400">{data.acceptanceRate}%</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Tarif ab</p>
            <p className="text-2xl font-bold text-white">{data.minPrice.toFixed(2).replace(".", ",")} €/Monat</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Netz</p>
            <p className="text-white font-semibold">{data.network}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Schufa-freundlich</p>
            <p className="text-green-400 font-semibold">{data.schufaFriendly ? "✓ Ja" : "✗ Nein"}</p>
          </div>
        </div>

        {/* Besonderheiten */}
        <h2 className="text-xl font-bold text-white mb-3">Besonderheiten</h2>
        <ul className="space-y-2 mb-8">
          {data.besonderheiten.map((b) => (
            <li key={b} className="flex items-center gap-2 text-gray-400">
              <span className="text-green-400">✓</span> {b}
            </li>
          ))}
        </ul>

        {/* Empfohlen für */}
        <h2 className="text-xl font-bold text-white mb-3">Empfohlen für</h2>
        <ul className="space-y-2 mb-10">
          {data.empfohlenFuer.map((e) => (
            <li key={e} className="flex items-center gap-2 text-gray-400">
              <span className="text-indigo-400">→</span> {e}
            </li>
          ))}
        </ul>

        {/* FAQ */}
        <h2 className="text-xl font-bold text-white mb-4">Häufige Fragen zu {data.name} trotz Schufa</h2>
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

        {/* Alternativen */}
        <h2 className="text-xl font-bold text-white mb-3">Alternative Anbieter trotz Schufa</h2>
        <div className="flex flex-wrap gap-2 mb-10">
          {alternativeAnbieter
            .filter((a) => a.slug !== slug)
            .map((a) => (
              <Link
                key={a.slug}
                href={`/anbieter/${a.slug}`}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Alternative: {a.name} trotz Schufa
              </Link>
            ))}
        </div>

        {/* CTA */}
        <div className="bg-indigo-900/30 rounded-xl p-6 text-center">
          <p className="text-white font-semibold mb-2">HANSI findet deinen Vertrag bei {data.name}</p>
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
