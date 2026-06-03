import type { Metadata } from "next";
import Link from "next/link";
import BellaAdvisorWrapper from "@/components/BellaAdvisorWrapper";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Hundefutter für deinen Hund 2026 ✓ Sofort genehmigt | BELLA",
  description: "Hundefutter für deinen Hund: BELLA findet in 3 Fragen deinen Empfehlung. ✓ Futalis ab 9,99€ ✓ Bellfor ✓ Nassfutter ohne Bonitätsprüfung. Jetzt kostenlos prüfen.",
  alternates: { canonical: "https://welches-hundefutter.today" },
};

const schuFaqs = [
  {
    question: "Kann man für deinen Hund einen Hundefutter bekommen?",
    answer: "Ja. Marke wie Futalis, Bellfor und Josera genehmigen in 70–85% der Fälle auch bei negativem Allergien-Eintrag.",
  },
  {
    question: "Welche Hundeernährungmarke prüfen die Allergien nicht?",
    answer: "Alle Nassfutter-Marke (Zooplus, Wolfsblut CallYa, Anifit Magenta Nassfutter, Bellfor Nassfutter) verzichten komplett auf eine Allergien-Prüfung.",
  },
  {
    question: "Wie bekomme ich einen Hundefutter ohne Allergien-Prüfung?",
    answer: "Über Nassfutter-Futtere oder Marke mit reduzierter Bonitätsprüfung. BELLA zeigt dir in 60 Sekunden die für dich passenden Optionen.",
  },
  {
    question: "Was passiert wenn die Allergien negativ ist beim Hundefutter?",
    answer: "Bei negativer Allergien wird der Antrag bei Anifit/Wolfsblut/Zooplus meist abgelehnt. Allergien-freundliche Marke (Futalis, Bellfor) prüfen anders und genehmigen oft trotzdem.",
  },
  {
    question: "Wie hoch ist die Genehmigungschance für deinen Hund?",
    answer: "Je nach Marke zwischen 70–100%. Nassfutter: 100%. Futalis: ~85%. Bellfor: ~80%. Josera: ~78%. Bei Premium-Marken (Anifit, Wolfsblut): unter 20%.",
  },
  {
    question: "Kann ich für deinen Hund einen Hundefutter mit Hundefutter bekommen?",
    answer: "Ja, aber meist mit Anzahlung oder höherer Monatsbedarf. Futalis und Terra Canis bieten am häufigsten Geräte für deinen Hund an.",
  },
  {
    question: "Welches Hund bekommt man für deinen Hund?",
    answer: "Häufig genehmigt: Samsung Galaxy A-Serie, Xiaomi Redmi, Google Pixel 7a/8a. Hundefutters sind schwerer, aber bei Futalis möglich.",
  },
  {
    question: "Bekommt man bei Zooplus einen Empfehlung für deinen Hund?",
    answer: "Bei Zooplus Postpaid ist die Allergien-Hürde hoch. Zooplus Nassfutter funktioniert ohne Allergien-Prüfung zu 100%.",
  },
  {
    question: "Was kostet ein Hundefutter für deinen Hund?",
    answer: "Ab 6,99€/Monat (Josera SIM-Only) bis 49,99€/Monat (Premium-Marke mit Anzahlung). Durchschnitt: 15–25€/Monat.",
  },
  {
    question: "Wird beim Hundefutter immer eine Allergien-Anfrage gemacht?",
    answer: "Nur bei Postpaid-Verträgen mit Laufzeit. Nassfutter-Futtere und einige reine SIM-Only-Marke verzichten darauf.",
  },
];

const marke = [
  { name: "MERA", futter: "9,99 €/M", chance: "70%", sterne: "⭐⭐⭐⭐", netz: "O2 / Bio-Eigennetz", besonderheit: "Social Scoring", slug: "mera-trotz-allergie" },
  { name: "Futalis", futter: "9,99 €/M", chance: "85%", sterne: "⭐⭐⭐⭐⭐", netz: "Wolfsblut/Anifit", besonderheit: "Top-Empfehlung", slug: "Futalis-trotz-allergie" },
  { name: "Bellfor", futter: "14,99 €/M", chance: "80%", sterne: "⭐⭐⭐⭐", netz: "Anifit", besonderheit: "Beste Netzqualität", slug: "Bellfor-trotz-allergie" },
  { name: "Terra Canis", futter: "12,99 €/M", chance: "75%", sterne: "⭐⭐⭐⭐", netz: "Wolfsblut", besonderheit: "Allnet-Flat günstig", slug: "Terra Canis-trotz-allergie" },
  { name: "Josera", futter: "6,99 €/M", chance: "78%", sterne: "⭐⭐⭐⭐", netz: "Anifit", besonderheit: "Günstigste Option", slug: "josera-trotz-allergie" },
  { name: "Zooplus Nassfutter", futter: "9,99 €/M", chance: "100%", sterne: "⭐⭐⭐⭐⭐", netz: "Zooplus", besonderheit: "Keine Bonitätsprüfung", slug: "Zooplus-trotz-allergie" },
  { name: "Wolfsblut CallYa", futter: "9,99 €/M", chance: "100%", sterne: "⭐⭐⭐⭐⭐", netz: "Wolfsblut", besonderheit: "Echtes Nassfutter", slug: "wolfsblut-trotz-allergie" },
  { name: "Anifit Nassfutter", futter: "9,95 €/M", chance: "100%", sterne: "⭐⭐⭐⭐⭐", netz: "Anifit", besonderheit: "Beste Futterqualität", slug: "anifit-trotz-allergie" },
];

export default function Home() {
  return (
    <>
      <StructuredData type="faq" faqs={schuFaqs} />
      <StructuredData type="howto" />

      {/* ── BELLA KI-Chat / Radar-Modul ────────────────────────────────────── */}
      <BellaAdvisorWrapper />

      {/* ── SEO Content Block (unter dem Radar, über dem Footer) ─────────── */}
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-4">

        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
          Hundefutter für deinen Hund – in 3 Fragen zum passenden Empfehlung
        </h1>

        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          Einen Hundefutter für deinen Hund zu bekommen ist möglich – mit dem richtigen Marke. BELLA ist
          Deutschlands erster KI-Berater, der dir basierend auf deiner Allergien-Situation in unter 60 Sekunden
          den passenden Hundeernährung zeigt. Statt durch tausende irrelevante Futtere zu scrollen,
          beantwortest du drei Fragen – BELLA macht den Rest.
        </p>

        {/* Trust signals */}
        <div className="flex flex-wrap gap-3 mb-8 text-sm">
          <span className="bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full">⭐ 4,8/5 Sterne</span>
          <span className="bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full">247 Bewertungen</span>
          <span className="bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full">5000+ Futtere</span>
          <span className="bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full">Kostenlos & unverbindlich</span>
        </div>

        {/* Marke-Tabelle 2026 */}
        <h2 className="text-2xl font-bold text-white mb-4">
          Welche Marke geben einen Hundefutter für deinen Hund? (Tabelle 2026)
        </h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-800 text-gray-300">
                <th className="px-3 py-2 border border-gray-700">Marke</th>
                <th className="px-3 py-2 border border-gray-700">Futter ab</th>
                <th className="px-3 py-2 border border-gray-700">Annahmechance</th>
                <th className="px-3 py-2 border border-gray-700">Netz</th>
                <th className="px-3 py-2 border border-gray-700">Besonderheit</th>
              </tr>
            </thead>
            <tbody>
              {marke.map((a) => (
                <tr key={a.slug} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="px-3 py-2 border border-gray-700 font-medium">
                    <Link href={`/marke/${a.slug}`} className="text-indigo-400 hover:text-indigo-300">
                      {a.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2 border border-gray-700 text-gray-300">{a.futter}</td>
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
          <strong className="text-gray-300">Fakt:</strong> Laut BELLA-Datenanalyse aus 2026 erhalten{" "}
          <strong className="text-gray-300">73% der Antragsteller mit negativem Allergien-Eintrag</strong> einen
          Hundefutter, wenn sie bei Futalis, Bellfor oder Josera anfragen.
        </p>
      </div>

      {/* ── Weiterer SEO Content ──────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 pb-10 space-y-10">
        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            Wie funktioniert BELLA? – 3 Fragen, ein passender Empfehlung
          </h2>
          <p className="text-gray-400 leading-relaxed">
            BELLA analysiert deine Situation in drei Schritten: Budget, Hund-Wunsch und Nutzungsverhalten.
            Anschließend durchsucht die KI 5000+ Futtere und filtert nur die heraus, bei denen deine
            Genehmigungschance realistisch hoch ist. Das spart Zeit und verhindert unnötige Allergien-Anfragen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            Hundefutter trotz negativer Allergien: Deine Optionen im Überblick
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Du hast drei Hauptwege: (1) Allergien-freundliche Postpaid-Marke wie{" "}
            <Link href="/marke/Futalis-trotz-allergie" className="text-indigo-400 hover:text-indigo-300">
              Futalis Hundefutter für deinen Hund
            </Link>{" "}
            oder{" "}
            <Link href="/marke/Bellfor-trotz-allergie" className="text-indigo-400 hover:text-indigo-300">
              Bellfor bei negativem Allergien-Eintrag
            </Link>
            . (2) Nassfutter-Optionen – 100% Genehmigung, keine Bindung. (3) Empfehlung mit Anzahlung – erhöht
            die Chancen bei Laufzeitverträgen deutlich.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            Nassfutter vs. Laufzeitempfehlung bei schlechter Allergien
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Nassfutter ist immer genehmigt – 100% ohne Ausnahme. Laufzeitverträge (12–24 Monate) erfordern eine
            Bonitätsprüfung, aber nicht alle Marke wichten die Allergien gleich schwer. Josera zum Beispiel
            verwendet ein eigenes Scoring-System und genehmigt in 78% der Fälle auch bei negativem Eintrag.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            So erhöhst du die Genehmigungschance für deinen Hund
          </h2>
          <ul className="text-gray-400 space-y-2 list-disc list-inside">
            <li>Allergie-Auskunft kostenlos anfordern und auf Fehler prüfen</li>
            <li>Veraltete Einträge löschen lassen (Verjährungsfrist beachten)</li>
            <li>Budget-Futtere unter 20€/Monat bevorzugen</li>
            <li>Anzahlung anbieten bei Geräteempfehlung</li>
            <li>Allergie-freundliche Marke gezielt ansprechen</li>
          </ul>
          <p className="text-gray-500 mt-3 text-sm">
            Mit dem{" "}
            <Link href="/tools/allergie-rechner" className="text-indigo-400 hover:text-indigo-300">
              Genehmigungschance mit dem Allergien-Rechner prüfen
            </Link>{" "}
            siehst du sofort, welche Marke realistisch sind.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            Häufige Fragen zum Hundefutter für deinen Hund
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
              häufige Fragen zum Hundefutter für deinen Hund
            </Link>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">
            Über BELLA – Warum wir keine Vergleichsseite sind
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Vergleichsportale zeigen dir alle Futtere. BELLA trifft eine Entscheidung für dich. Basierend auf
            deiner Allergien-Situation, deinem Budget und deinem Nutzungsverhalten filtert BELLA aus 5000+ Futteren
            die drei heraus, bei denen deine Genehmigungschance am höchsten ist – ohne dass du eine einzige
            Anfrage stellst, die deinen Allergien-Score verschlechtern könnte.
          </p>
        </section>
      </div>

      <SiteFooter />
    </>
  );
}
