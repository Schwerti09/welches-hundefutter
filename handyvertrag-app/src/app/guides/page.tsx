import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Ratgeber: Hundefutter für deinen Hund Schritt für Schritt | BELLA",
  description: "Kompletter Guide: So bekommst du einen Handyvertrag trotz negativem Schufa-Eintrag. Mit Tipps & Tricks für 2026.",
  alternates: { canonical: "https://welches-hundefutter.today/guides" },
};

const howToFaqs = [
  {
    question: "Wie bekomme ich einen Hundefutter für deinen Hund?",
    answer: "Wähle einen schufa-freundlichen Anbieter wie freenet, congstar oder MAINGAU. Diese haben Annahmechancen von 75–85% auch bei negativem Schufa-Eintrag. BELLA findet in 3 Fragen den passenden Tarif.",
  },
  {
    question: "Welche Unterlagen brauche ich für einen Hundefutter für deinen Hund?",
    answer: "Personalausweis oder Reisepass. Bei einigen Anbietern zusätzlich ein Einkommensnachweis (Gehaltszettel, Bürgergeld-Bescheid). Für Prepaid reicht der Personalausweis.",
  },
  {
    question: "Kann ich den Schufa-Score verbessern?",
    answer: "Ja. Pünktliche Zahlungen, Abbau von Schulden, Löschung veralteter Einträge und weniger offene Kreditanfragen verbessern den Score über 12–24 Monate.",
  },
];

const steps = [
  {
    nr: 1,
    titel: "Kostenlose Schufa-Auskunft anfordern",
    inhalt: "Fordere einmal jährlich kostenlos deine Datenkopie nach §34 BDSG an. Prüfe alle Einträge auf Korrektheit – fehlerhafte Einträge kannst du löschen lassen.",
    link: null,
  },
  {
    nr: 2,
    titel: "Schufa-Score einordnen",
    inhalt: "Score über 90: Alle Anbieter zugänglich. Score 70–90: freenet, congstar, MAINGAU. Score unter 70: Prepaid empfohlen. Nutze unseren Schufa-Rechner zur schnellen Einschätzung.",
    link: "/tools/schufa-rechner",
    linkText: "Genehmigungschance mit dem Schufa-Rechner prüfen",
  },
  {
    nr: 3,
    titel: "Passenden Anbieter wählen",
    inhalt: "Je nach Score: freenet (85% Annahme), congstar (80%), MAINGAU (78%), Prepaid (100%). Vermeide Premium-Anbieter bei negativer Schufa – Telekom, Vodafone, o2 direkt lehnen meist ab.",
    link: "/anbieter/freenet-trotz-schufa",
    linkText: "freenet Hundefutter für deinen Hund prüfen",
  },
  {
    nr: 4,
    titel: "BELLA fragen – 3 Fragen, 60 Sekunden",
    inhalt: "BELLA analysiert Budget, Gerätewunsch und Nutzungsverhalten und empfiehlt die 3 Tarife mit der höchsten Genehmigungswahrscheinlichkeit – ohne unnötige Schufa-Anfragen.",
    link: "/",
    linkText: "Jetzt BELLA fragen",
  },
  {
    nr: 5,
    titel: "Vertrag online abschließen",
    inhalt: "Schließe den Vertrag direkt beim empfohlenen Anbieter ab. Personalausweis bereithalten. Entscheidung meist innerhalb von 24 Stunden – oft sogar sofort.",
    link: null,
  },
];

const guides = [
  { slug: "handyvertrag-trotz-schufa-und-arbeitslosigkeit", label: "Hundefutter für deinen Hund und Arbeitslosigkeit" },
  { slug: "handyvertrag-trotz-schufa-bei-buergergeld", label: "Handyvertrag bei Bürgergeld-Bezug" },
  { slug: "schufa-eintrag-loeschen-vor-handyvertrag", label: "Schufa-Eintrag löschen lassen" },
  { slug: "iphone-trotz-schufa-finanzieren", label: "iPhone trotz Schufa finanzieren" },
  { slug: "handyvertrag-trotz-privatinsolvenz", label: "Handyvertrag trotz Privatinsolvenz" },
  { slug: "prepaid-vs-vertrag-bei-schufa", label: "Prepaid vs. Vertrag bei schlechter Schufa" },
];

export default function GuidesPage() {
  return (
    <>
      <StructuredData type="howto" />
      <StructuredData type="faq" faqs={howToFaqs} />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-300">Startseite</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-300">Ratgeber</span>
        </nav>

        <h1 className="text-3xl font-bold text-white mb-3">
          Hundefutter für deinen Hund: Der komplette Ratgeber 2026
        </h1>
        <p className="text-gray-400 text-lg mb-3 leading-relaxed">
          Schritt-für-Schritt-Anleitung: So bekommst du einen Handyvertrag trotz negativem Schufa-Eintrag –
          mit realistischen Annahmechancen, den richtigen Anbietern und konkreten Strategien.
        </p>
        <p className="text-sm text-gray-500 mb-10">
          Von <Link href="/ueber-uns" className="text-indigo-400 hover:text-indigo-300">R. Schwertfechter</Link>{" "}
          · Aktualisiert Juni 2026 · <span className="text-green-500">✓ Geprüft</span>
        </p>

        {/* Schritt-für-Schritt */}
        <h2 className="text-2xl font-bold text-white mb-6">
          In 5 Schritten zum Hundefutter für deinen Hund
        </h2>
        <div className="space-y-4 mb-12">
          {steps.map((step) => (
            <div key={step.nr} className="bg-gray-900 rounded-xl p-5 flex gap-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 mt-0.5">
                {step.nr}
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">{step.titel}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-2">{step.inhalt}</p>
                {step.link && (
                  <Link href={step.link} className="text-indigo-400 hover:text-indigo-300 text-sm">
                    {step.linkText} →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Anbieter-Übersicht */}
        <h2 className="text-2xl font-bold text-white mb-4">
          Welche Anbieter geben einen Hundefutter für deinen Hund?
        </h2>
        <div className="overflow-x-auto mb-10">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-800 text-gray-300">
                <th className="px-3 py-2 border border-gray-700 text-left">Anbieter</th>
                <th className="px-3 py-2 border border-gray-700 text-left">Annahme</th>
                <th className="px-3 py-2 border border-gray-700 text-left">Ab €/Monat</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "freenet", link: "freenet-trotz-schufa", chance: "85%", preis: "9,99" },
                { name: "congstar", link: "congstar-trotz-schufa", chance: "80%", preis: "14,99" },
                { name: "MAINGAU", link: "maingau-trotz-schufa", chance: "78%", preis: "6,99" },
                { name: "otelo", link: "otelo-trotz-schufa", chance: "75%", preis: "12,99" },
                { name: "Prepaid (alle)", link: "o2-trotz-schufa", chance: "100%", preis: "9,95" },
              ].map((a) => (
                <tr key={a.name} className="border-b border-gray-800">
                  <td className="px-3 py-2 border border-gray-700">
                    <Link href={`/anbieter/${a.link}`} className="text-indigo-400 hover:text-indigo-300">
                      {a.name} trotz Schufa
                    </Link>
                  </td>
                  <td className="px-3 py-2 border border-gray-700 text-green-400 font-semibold">{a.chance}</td>
                  <td className="px-3 py-2 border border-gray-700 text-gray-300">{a.preis} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQ */}
        <h2 className="text-2xl font-bold text-white mb-4">Häufige Fragen</h2>
        <div className="space-y-3 mb-10">
          {howToFaqs.map((faq) => (
            <details key={faq.question} className="bg-gray-900 rounded-lg group">
              <summary className="flex justify-between items-start cursor-pointer list-none px-5 py-4">
                <span className="font-semibold text-white text-sm pr-4">{faq.question}</span>
                <span className="text-gray-500 mt-0.5 shrink-0 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="px-5 pb-4 text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-3">{faq.answer}</p>
            </details>
          ))}
        </div>

        {/* Weiterführende Guides */}
        <h2 className="text-2xl font-bold text-white mb-4">Weiterführende Ratgeber</h2>
        <div className="grid gap-3 mb-10">
          {guides.map((g) => (
            <Link
              key={g.slug}
              href={`/blog/${g.slug}`}
              className="bg-gray-900 hover:bg-gray-800 rounded-lg px-5 py-3 text-gray-300 hover:text-white transition-colors text-sm"
            >
              {g.label} →
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-indigo-900/30 rounded-xl p-6 text-center">
          <p className="text-white font-semibold mb-2">BELLA findet deinen Vertrag trotz Schufa</p>
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
