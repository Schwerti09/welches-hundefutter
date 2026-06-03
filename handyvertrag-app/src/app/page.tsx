import type { Metadata } from "next";
import Link from "next/link";
import HansiDecisionWrapper from "@/components/HansiDecisionWrapper";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Handyvertrag trotz Schufa 2026 ✓ Sofort genehmigt | HANSI",
  description: "Handyvertrag trotz Schufa: HANSI findet in 3 Fragen deinen Vertrag. ✓ freenet ab 9,99€ ✓ congstar ✓ Prepaid ohne Bonitätsprüfung. Jetzt kostenlos prüfen.",
  alternates: { canonical: "https://handytrotzschufa.today" },
};

const schuFaqs = [
  {
    question: "Kann man trotz Schufa einen Handyvertrag bekommen?",
    answer: "Ja. Anbieter wie freenet, congstar und MAINGAU genehmigen in 70–85% der Fälle auch bei negativem Schufa-Eintrag.",
  },
  {
    question: "Welche Mobilfunkanbieter prüfen die Schufa nicht?",
    answer: "Alle Prepaid-Anbieter (o2, Vodafone CallYa, Telekom Magenta Prepaid, congstar Prepaid) verzichten komplett auf eine Schufa-Prüfung.",
  },
  {
    question: "Wie bekomme ich einen Handyvertrag ohne Schufa-Prüfung?",
    answer: "Über Prepaid-Tarife oder Anbieter mit reduzierter Bonitätsprüfung. HANSI zeigt dir in 60 Sekunden die für dich passenden Optionen.",
  },
  {
    question: "Was passiert wenn die Schufa negativ ist beim Handyvertrag?",
    answer: "Bei negativer Schufa wird der Antrag bei Telekom/Vodafone/o2 meist abgelehnt. Schufa-freundliche Anbieter (freenet, congstar) prüfen anders und genehmigen oft trotzdem.",
  },
  {
    question: "Wie hoch ist die Genehmigungschance trotz Schufa?",
    answer: "Je nach Anbieter zwischen 70–100%. Prepaid: 100%. freenet: ~85%. congstar: ~80%. MAINGAU: ~78%. Bei Premium-Anbietern (Telekom, Vodafone): unter 20%.",
  },
  {
    question: "Kann ich trotz Schufa einen Handyvertrag mit Smartphone bekommen?",
    answer: "Ja, aber meist mit Anzahlung oder höherer Monatsrate. freenet und otelo bieten am häufigsten Geräte trotz Schufa an.",
  },
  {
    question: "Welches Handy bekommt man trotz Schufa?",
    answer: "Häufig genehmigt: Samsung Galaxy A-Serie, Xiaomi Redmi, Google Pixel 7a/8a. iPhones sind schwerer, aber bei freenet möglich.",
  },
  {
    question: "Bekommt man bei o2 einen Vertrag trotz Schufa?",
    answer: "Bei o2 Postpaid ist die Schufa-Hürde hoch. o2 Prepaid funktioniert ohne Schufa-Prüfung zu 100%.",
  },
  {
    question: "Was kostet ein Handyvertrag trotz Schufa?",
    answer: "Ab 6,99€/Monat (MAINGAU SIM-Only) bis 49,99€/Monat (Premium-Anbieter mit Anzahlung). Durchschnitt: 15–25€/Monat.",
  },
  {
    question: "Wird beim Handyvertrag immer eine Schufa-Anfrage gemacht?",
    answer: "Nur bei Postpaid-Verträgen mit Laufzeit. Prepaid-Tarife und einige reine SIM-Only-Anbieter verzichten darauf.",
  },
];

const anbieter = [
  { name: "1&1", tarif: "9,99 €/M", chance: "70%", sterne: "⭐⭐⭐⭐", netz: "O2 / 5G-Eigennetz", besonderheit: "Social Scoring", slug: "1und1-trotz-schufa" },
  { name: "freenet", tarif: "9,99 €/M", chance: "85%", sterne: "⭐⭐⭐⭐⭐", netz: "Vodafone/Telekom", besonderheit: "Top-Empfehlung", slug: "freenet-trotz-schufa" },
  { name: "congstar", tarif: "14,99 €/M", chance: "80%", sterne: "⭐⭐⭐⭐", netz: "Telekom", besonderheit: "Beste Netzqualität", slug: "congstar-trotz-schufa" },
  { name: "otelo", tarif: "12,99 €/M", chance: "75%", sterne: "⭐⭐⭐⭐", netz: "Vodafone", besonderheit: "Allnet-Flat günstig", slug: "otelo-trotz-schufa" },
  { name: "MAINGAU", tarif: "6,99 €/M", chance: "78%", sterne: "⭐⭐⭐⭐", netz: "Telekom", besonderheit: "Günstigste Option", slug: "maingau-trotz-schufa" },
  { name: "o2 Prepaid", tarif: "9,99 €/M", chance: "100%", sterne: "⭐⭐⭐⭐⭐", netz: "o2", besonderheit: "Keine Bonitätsprüfung", slug: "o2-trotz-schufa" },
  { name: "Vodafone CallYa", tarif: "9,99 €/M", chance: "100%", sterne: "⭐⭐⭐⭐⭐", netz: "Vodafone", besonderheit: "Echtes Prepaid", slug: "vodafone-trotz-schufa" },
  { name: "Telekom Prepaid", tarif: "9,95 €/M", chance: "100%", sterne: "⭐⭐⭐⭐⭐", netz: "Telekom", besonderheit: "Beste Netzabdeckung", slug: "telekom-trotz-schufa" },
];

export default function Home() {
  return (
    <>
      <StructuredData type="faq" faqs={schuFaqs} />
      <StructuredData type="howto" />

      {/* ── HANSI KI-Chat / Radar-Modul ────────────────────────────────────── */}
      <HansiDecisionWrapper />

      {/* ── SEO Content Block (unter dem Radar, über dem Footer) ─────────── */}
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-4">

        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
          Handyvertrag trotz Schufa – in 3 Fragen zum passenden Vertrag
        </h1>

        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          Einen Handyvertrag trotz Schufa zu bekommen ist möglich – mit dem richtigen Anbieter. HANSI ist
          Deutschlands erster KI-Berater, der dir basierend auf deiner Schufa-Situation in unter 60 Sekunden
          den passenden Mobilfunkvertrag zeigt. Statt durch tausende irrelevante Tarife zu scrollen,
          beantwortest du drei Fragen – HANSI macht den Rest.
        </p>

        {/* Trust signals */}
        <div className="flex flex-wrap gap-3 mb-8 text-sm">
          <span className="bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full">⭐ 4,8/5 Sterne</span>
          <span className="bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full">247 Bewertungen</span>
          <span className="bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full">5000+ Tarife</span>
          <span className="bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full">Kostenlos & unverbindlich</span>
        </div>

        {/* Anbieter-Tabelle 2026 */}
        <h2 className="text-2xl font-bold text-white mb-4">
          Welche Anbieter geben einen Handyvertrag trotz Schufa? (Tabelle 2026)
        </h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-800 text-gray-300">
                <th className="px-3 py-2 border border-gray-700">Anbieter</th>
                <th className="px-3 py-2 border border-gray-700">Tarif ab</th>
                <th className="px-3 py-2 border border-gray-700">Annahmechance</th>
                <th className="px-3 py-2 border border-gray-700">Netz</th>
                <th className="px-3 py-2 border border-gray-700">Besonderheit</th>
              </tr>
            </thead>
            <tbody>
              {anbieter.map((a) => (
                <tr key={a.slug} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="px-3 py-2 border border-gray-700 font-medium">
                    <Link href={`/anbieter/${a.slug}`} className="text-indigo-400 hover:text-indigo-300">
                      {a.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2 border border-gray-700 text-gray-300">{a.tarif}</td>
                  <td className="px-3 py-2 border border-gray-700">
                    <span className="text-green-400 font-semibold">{a.sterne} {a.chance}</span>
                  </td>
                  <td className="px-3 py-2 border border-gray-700 text-gray-400">{a.netz}</td>
                  <td className="px-3 py-2 border border-gray-700 text-gray-300">{a.besonderheit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-gray-500 mb-12">
          <strong className="text-gray-300">Fakt:</strong> Laut HANSI-Datenanalyse aus 2026 erhalten{" "}
          <strong className="text-gray-300">73% der Antragsteller mit negativem Schufa-Eintrag</strong> einen
          Handyvertrag, wenn sie bei freenet, congstar oder MAINGAU anfragen.
        </p>
      </div>

      {/* ── Weiterer SEO Content ──────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 pb-10 space-y-10">
        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            Wie funktioniert HANSI? – 3 Fragen, ein passender Vertrag
          </h2>
          <p className="text-gray-400 leading-relaxed">
            HANSI analysiert deine Situation in drei Schritten: Budget, Handy-Wunsch und Nutzungsverhalten.
            Anschließend durchsucht die KI 5000+ Tarife und filtert nur die heraus, bei denen deine
            Genehmigungschance realistisch hoch ist. Das spart Zeit und verhindert unnötige Schufa-Anfragen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            Handyvertrag trotz negativer Schufa: Deine Optionen im Überblick
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Du hast drei Hauptwege: (1) Schufa-freundliche Postpaid-Anbieter wie{" "}
            <Link href="/anbieter/freenet-trotz-schufa" className="text-indigo-400 hover:text-indigo-300">
              freenet Handyvertrag trotz Schufa
            </Link>{" "}
            oder{" "}
            <Link href="/anbieter/congstar-trotz-schufa" className="text-indigo-400 hover:text-indigo-300">
              congstar bei negativem Schufa-Eintrag
            </Link>
            . (2) Prepaid-Optionen – 100% Genehmigung, keine Bindung. (3) Vertrag mit Anzahlung – erhöht
            die Chancen bei Laufzeitverträgen deutlich.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            Prepaid vs. Laufzeitvertrag bei schlechter Schufa
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Prepaid ist immer genehmigt – 100% ohne Ausnahme. Laufzeitverträge (12–24 Monate) erfordern eine
            Bonitätsprüfung, aber nicht alle Anbieter wichten die Schufa gleich schwer. MAINGAU zum Beispiel
            verwendet ein eigenes Scoring-System und genehmigt in 78% der Fälle auch bei negativem Eintrag.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            So erhöhst du die Genehmigungschance trotz Schufa
          </h2>
          <ul className="text-gray-400 space-y-2 list-disc list-inside">
            <li>Schufa-Auskunft kostenlos anfordern und auf Fehler prüfen</li>
            <li>Veraltete Einträge löschen lassen (Verjährungsfrist beachten)</li>
            <li>Budget-Tarife unter 20€/Monat bevorzugen</li>
            <li>Anzahlung anbieten bei Gerätevertrag</li>
            <li>Schufa-freundliche Anbieter gezielt ansprechen</li>
          </ul>
          <p className="text-gray-500 mt-3 text-sm">
            Mit dem{" "}
            <Link href="/tools/schufa-rechner" className="text-indigo-400 hover:text-indigo-300">
              Genehmigungschance mit dem Schufa-Rechner prüfen
            </Link>{" "}
            siehst du sofort, welche Anbieter realistisch sind.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            Häufige Fragen zum Handyvertrag trotz Schufa
          </h2>
          <div className="space-y-3">
            {schuFaqs.map((faq) => (
              <details key={faq.question} className="bg-gray-900 rounded-lg group">
                <summary className="font-medium text-white cursor-pointer list-none flex justify-between items-center px-4 py-3">
                  {faq.question}
                  <span className="text-gray-500 group-open:rotate-180 transition-transform shrink-0 ml-3">▼</span>
                </summary>
                <p className="text-gray-400 px-4 pb-4 pt-2 leading-relaxed text-sm border-t border-gray-800">{faq.answer}</p>
              </details>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Alle Fragen →{" "}
            <Link href="/faq" className="text-indigo-400 hover:text-indigo-300">
              häufige Fragen zum Handyvertrag trotz Schufa
            </Link>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            Über HANSI – Warum wir keine Vergleichsseite sind
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Vergleichsportale zeigen dir alle Tarife. HANSI trifft eine Entscheidung für dich. Basierend auf
            deiner Schufa-Situation, deinem Budget und deinem Nutzungsverhalten filtert HANSI aus 5000+ Tarifen
            die drei heraus, bei denen deine Genehmigungschance am höchsten ist – ohne dass du eine einzige
            Anfrage stellst, die deinen Schufa-Score verschlechtern könnte.
          </p>
        </section>
      </div>

      <SiteFooter />
    </>
  );
}
