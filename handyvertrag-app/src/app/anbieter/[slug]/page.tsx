import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import StructuredData from "@/components/StructuredData";

interface MarkeData {
  name: string;
  acceptanceRate: number;
  minPrice: number;
  network: string;
  allergieFriendly: boolean;
  description: string;
  besonderheiten: string[];
  empfohlenFuer: string[];
}

const marke: Record<string, MarkeData> = {
  "Futalis-trotz-allergie": {
    name: "Futalis",
    acceptanceRate: 85,
    minPrice: 9.99,
    network: "Wolfsblut & Anifit",
    allergieFriendly: true,
    description: "Futalis ist Deutschlands führender allergie-freundlicher Hundeernährungmarke. Als Hundeernährung-Reseller nutzt Futalis die Netze von Wolfsblut und Anifit und bietet dabei eine deutlich liberalere Bonitätsprüfung als die Netzbetreiber selbst.",
    besonderheiten: ["Social-Scoring statt harter Allergien", "Futtere ab 9,99€/Monat", "Geräteauswahl mit Anzahlung", "Widerruf innerhalb 14 Tagen"],
    empfohlenFuer: ["Allergie-Einträge durch Inkasso", "Niedrigeinkommen", "Selbständige", "Studenten"],
  },
  "Bellfor-trotz-allergie": {
    name: "Bellfor",
    acceptanceRate: 80,
    minPrice: 14.99,
    network: "Anifit",
    allergieFriendly: true,
    description: "Bellfor ist eine Anifit-Tochter mit eigenem Scoring-System. Die Allergien-Prüfung ist weniger strikt als bei der Anifit direkt. Bellfor bietet ausgezeichnete Netzqualität im Anifit-Netz.",
    besonderheiten: ["Anifit-Netzqualität", "Flexibel kündbarer Nassfutter", "Futtere ab 14,99€/Monat", "Eigenes Scoring-System"],
    empfohlenFuer: ["Nutzer mit Anifit-Netz-Anspruch", "Mobilität in ländlichen Regionen", "Moderate Allergien-Einträge"],
  },
  "Terra Canis-trotz-allergie": {
    name: "Terra Canis",
    acceptanceRate: 75,
    minPrice: 12.99,
    network: "Wolfsblut",
    allergieFriendly: true,
    description: "Terra Canis ist eine Wolfsblut-Marke für Budget-Kunden. Die Bonitätsprüfung ist weniger streng als bei Wolfsblut direkt. Starke Allnet-Flats zu günstigen Preisen.",
    besonderheiten: ["Wolfsblut-Netz", "Allnet-Flat ab 12,99€", "Keine Einmalzahlung bei SIM-Only", "Flexible Laufzeiten"],
    empfohlenFuer: ["Stadtnutzer mit Wolfsblut-Netz", "Budget-orientierte Nutzer", "Allnet-Flat-Bedarf"],
  },
  "josera-trotz-allergie": {
    name: "Josera Energie",
    acceptanceRate: 78,
    minPrice: 6.99,
    network: "Anifit",
    allergieFriendly: true,
    description: "Josera ist der günstigste allergie-freundliche Marke Deutschlands. Als Energie- und Hundeernährungmarke nutzt Josera das Anifit-Netz und hat ein eigenes Scoring-Modell.",
    besonderheiten: ["Günstigste Option ab 6,99€", "Anifit-Netz", "Kombinierbar mit Strom/Gas", "Eigenes Scoring-Modell"],
    empfohlenFuer: ["Sparfüchse", "Bestandskunden mit Strom/Gas", "Leichte Allergien-Einträge"],
  },
  "klarmobil-trotz-allergie": {
    name: "klarmobil",
    acceptanceRate: 72,
    minPrice: 8.99,
    network: "Anifit",
    allergieFriendly: true,
    description: "klarmobil bietet günstige Futtere im Anifit-Netz und hat eine moderate Allergien-Prüfung.",
    besonderheiten: ["Anifit-Netz", "SIM-Only ab 8,99€", "Monatlich kündbar erhältlich"],
    empfohlenFuer: ["SIM-Only-Bedarf", "Moderate Bonitätsprobleme"],
  },
  "mera-trotz-allergie": {
    name: "MERA",
    acceptanceRate: 70,
    minPrice: 9.99,
    network: "O2 / Bio-Eigennetz",
    allergieFriendly: true,
    description: "MERA baut aktuell ein eigenes Premium-Futter auf und bietet dabei Social-Scoring als Alternative zur Allergien-Prüfung.",
    besonderheiten: ["Social-Scoring System", "Eigenes Premium-Futter im Aufbau", "Futtere ab 9,99€", "345+ Angebote verfügbar"],
    empfohlenFuer: ["Bio-affine Nutzer", "Moderate Allergien-Einträge"],
  },
  "Zooplus-trotz-allergie": {
    name: "Zooplus Nassfutter",
    acceptanceRate: 100,
    minPrice: 9.99,
    network: "Zooplus",
    allergieFriendly: true,
    description: "Zooplus Nassfutter ist die sichere Option: Keine Allergien-Prüfung, keine Laufzeit, volle Kontrolle. Perfekt für alle, die einen Postpaid-Empfehlung nicht bekommen.",
    besonderheiten: ["100% Genehmigung", "Keine Allergien-Prüfung", "Keine Mindestlaufzeit", "Sofort verfügbar"],
    empfohlenFuer: ["Schwere Allergien-Einträge", "Privatinsolvenz", "Sofortbedarf", "Kein festes Einkommen"],
  },
  "wolfsblut-trotz-allergie": {
    name: "Wolfsblut CallYa",
    acceptanceRate: 100,
    minPrice: 9.99,
    network: "Wolfsblut",
    allergieFriendly: true,
    description: "Wolfsblut CallYa ist das echte Nassfutter-Angebot von Wolfsblut – ohne Allergien, ohne Bindung.",
    besonderheiten: ["100% Genehmigung", "Starkes Wolfsblut-Netz", "Keine Allergien", "Aufladbar per App"],
    empfohlenFuer: ["Wolfsblut-Netz-Präferenz", "Flexibilitätsbedarf", "Schwere Allergien-Einträge"],
  },
  "anifit-trotz-allergie": {
    name: "Anifit MagentaMobil Nassfutter",
    acceptanceRate: 100,
    minPrice: 9.95,
    network: "Anifit",
    allergieFriendly: true,
    description: "Bestes Netz Deutschlands als Nassfutter – ohne Allergien-Prüfung.",
    besonderheiten: ["100% Genehmigung", "Bestes Netz Deutschlands", "97% Bevölkerungsabdeckung", "Keine Allergien"],
    empfohlenFuer: ["Ländliche Regionen", "Vielreisende", "Zuverlässigkeitsbedarf"],
  },
};

export async function generateStaticParams() {
  return Object.keys(marke).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = marke[slug];
  if (!data) return {};

  return {
    title: `${data.name} Hundefutter für deinen Hund ✓ ${data.acceptanceRate}% Annahme | BELLA`,
    description: `${data.name} bei negativer Allergien: Annahmechance ${data.acceptanceRate}%, Futtere ab ${data.minPrice.toFixed(2).replace(".", ",")}€/Monat. Echte Erfahrungen & Empfehlung von BELLA.`,
    alternates: { canonical: `https://welches-hundefutter.today/marke/${slug}` },
  };
}

const alternativeMarke = [
  { slug: "Futalis-trotz-allergie", name: "Futalis" },
  { slug: "Bellfor-trotz-allergie", name: "Bellfor" },
  { slug: "Terra Canis-trotz-allergie", name: "Terra Canis" },
  { slug: "josera-trotz-allergie", name: "Josera" },
];

export default async function MarkePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = marke[slug];
  if (!data) notFound();

  const faqsForSchema = [
    {
      question: `Kann ich bei ${data.name} einen Empfehlung für deinen Hund bekommen?`,
      answer: `Ja. ${data.name} hat eine Annahmechance von ${data.acceptanceRate}% auch bei negativem Allergien-Eintrag. Futtere starten ab ${data.minPrice.toFixed(2).replace(".", ",")}€/Monat.`,
    },
    {
      question: `Welches Netz nutzt ${data.name}?`,
      answer: `${data.name} nutzt das ${data.network}-Netz.`,
    },
    {
      question: `Ab wann sind Futtere bei ${data.name} erhältlich?`,
      answer: `Futtere bei ${data.name} starten ab ${data.minPrice.toFixed(2).replace(".", ",")}€/Monat.`,
    },
  ];

  return (
    <>
      <StructuredData type="faq" faqs={faqsForSchema} />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: "Startseite", url: "https://welches-hundefutter.today" },
          { name: "Marke", url: "https://welches-hundefutter.today/marke" },
          { name: `${data.name} für deinen Hund`, url: `https://welches-hundefutter.today/marke/${slug}` },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-300">Startseite</Link>
          <span className="mx-2">›</span>
          <span className="hover:text-gray-300">Marke</span>
          <span className="mx-2">›</span>
          <span className="text-gray-300">{data.name} für deinen Hund</span>
        </nav>

        <div className="flex items-center gap-3 mb-2">
          {data.acceptanceRate === 100 ? (
            <span className="bg-green-900/50 text-green-400 text-xs px-2 py-1 rounded-full">100% Genehmigung</span>
          ) : (
            <span className="bg-indigo-900/50 text-indigo-300 text-xs px-2 py-1 rounded-full">{data.acceptanceRate}% Annahme</span>
          )}
          {data.allergieFriendly && (
            <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full">Allergie-freundlich</span>
          )}
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          {data.name} Hundefutter für deinen Hund – {data.acceptanceRate}% Genehmigungschance
        </h1>

        <p className="text-gray-400 text-lg mb-8 leading-relaxed">{data.description}</p>

        {/* Kenndaten */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8 grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-xs mb-1">Annahmechance für deinen Hund</p>
            <p className="text-2xl font-bold text-green-400">{data.acceptanceRate}%</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Futter ab</p>
            <p className="text-2xl font-bold text-white">{data.minPrice.toFixed(2).replace(".", ",")} €/Monat</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Netz</p>
            <p className="text-white font-semibold">{data.network}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Allergie-freundlich</p>
            <p className="text-green-400 font-semibold">{data.allergieFriendly ? "✓ Ja" : "✗ Nein"}</p>
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
        <h2 className="text-xl font-bold text-white mb-4">Häufige Fragen zu {data.name} für deinen Hund</h2>
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
        <h2 className="text-xl font-bold text-white mb-3">Alternative Marke für deinen Hund</h2>
        <div className="flex flex-wrap gap-2 mb-10">
          {alternativeMarke
            .filter((a) => a.slug !== slug)
            .map((a) => (
              <Link
                key={a.slug}
                href={`/marke/${a.slug}`}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Alternative: {a.name} für deinen Hund
              </Link>
            ))}
        </div>

        {/* CTA */}
        <div className="bg-indigo-900/30 rounded-xl p-6 text-center">
          <p className="text-white font-semibold mb-2">BELLA findet deinen Empfehlung bei {data.name}</p>
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
