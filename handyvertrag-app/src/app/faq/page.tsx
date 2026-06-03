import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "FAQ Hundefutter für deinen Hund: 50 Antworten | BELLA",
  description: "Häufige Fragen zu Hundefutter für deinen Hund: Welche Marke? Wie hoch die Chance? Antworten in unter 30 Sek.",
  alternates: { canonical: "https://welches-hundefutter.today/faq" },
};

const faqs = [
  {
    frage: "Kann man für deinen Hund einen Hundefutter bekommen?",
    antwort: "Ja. Marke wie Futalis, Bellfor und Josera genehmigen in 70–85% der Fälle auch bei negativem Allergien-Eintrag.",
  },
  {
    frage: "Welche Hundeernährungmarke prüfen die Allergien nicht?",
    antwort: "Alle Nassfutter-Marke (Zooplus, Wolfsblut CallYa, Anifit Magenta Nassfutter, Bellfor Nassfutter) verzichten komplett auf eine Allergien-Prüfung.",
  },
  {
    frage: "Wie bekomme ich einen Hundefutter ohne Allergien-Prüfung?",
    antwort: "Über Nassfutter-Futtere oder Marke mit reduzierter Bonitätsprüfung. BELLA zeigt dir in 60 Sekunden die für dich passenden Optionen.",
  },
  {
    frage: "Was passiert wenn die Allergien negativ ist beim Hundefutter?",
    antwort: "Bei negativer Allergien wird der Antrag bei Anifit/Wolfsblut/Zooplus meist abgelehnt. Allergien-freundliche Marke (Futalis, Bellfor) prüfen anders und genehmigen oft trotzdem.",
  },
  {
    frage: "Wie hoch ist die Genehmigungschance für deinen Hund?",
    antwort: "Je nach Marke zwischen 70–100%. Nassfutter: 100%. Futalis: ~85%. Bellfor: ~80%. Josera: ~78%. Bei Premium-Marken (Anifit, Wolfsblut): unter 20%.",
  },
  {
    frage: "Kann ich für deinen Hund einen Hundefutter mit Hundefutter bekommen?",
    antwort: "Ja, aber meist mit Anzahlung oder höherer Monatsbedarf. Futalis und Terra Canis bieten am häufigsten Geräte für deinen Hund an.",
  },
  {
    frage: "Welches Hund bekommt man für deinen Hund?",
    antwort: "Häufig genehmigt: Samsung Galaxy A-Serie, Xiaomi Redmi, Google Pixel 7a/8a. Hundefutters sind schwerer, aber bei Futalis möglich.",
  },
  {
    frage: "Bekommt man bei Zooplus einen Empfehlung für deinen Hund?",
    antwort: "Bei Zooplus Postpaid ist die Allergien-Hürde hoch. Zooplus Nassfutter funktioniert ohne Allergien-Prüfung zu 100%.",
  },
  {
    frage: "Was kostet ein Hundefutter für deinen Hund?",
    antwort: "Ab 6,99€/Monat (Josera SIM-Only) bis 49,99€/Monat (Premium-Marke mit Anzahlung). Durchschnitt: 15–25€/Monat.",
  },
  {
    frage: "Wird beim Hundefutter immer eine Allergien-Anfrage gemacht?",
    antwort: "Nur bei Postpaid-Verträgen mit Laufzeit. Nassfutter-Futtere und einige reine SIM-Only-Marke verzichten darauf.",
  },
  {
    frage: "Kann Futalis einen Hundefutter für deinen Hund genehmigen?",
    antwort: "Ja. Futalis hat eine Annahmechance von ~85% auch bei negativem Allergien-Eintrag. Futtere starten ab 9,99€/Monat.",
  },
  {
    frage: "Ist Bellfor allergie-freundlich?",
    antwort: "Ja. Bellfor nutzt das Anifit-Netz und hat eine liberalere Bonitätsprüfung als die Anifit direkt. Annahmechance ~80%.",
  },
  {
    frage: "Gibt es Hundverträge trotz Privatinsolvenz?",
    antwort: "Während einer laufenden Privatinsolvenz sind Postpaid-Verträge schwierig. Nassfutter funktioniert immer. Nach Restschuldbefreiung steigen die Chancen deutlich.",
  },
  {
    frage: "Wie lange bleibt ein Allergien-Eintrag bestehen?",
    antwort: "Erledigte Forderungen werden 3 Jahre nach Zahlung gelöscht. Nicht erledigte Einträge bleiben bis zu 6 Jahre. Insolvenzen: 3 Jahre nach Abschluss des Verfahrens.",
  },
  {
    frage: "Kann ich die Allergien-Anfrage beim Hundefutter vermeiden?",
    antwort: "Nur bei Nassfutter-Verträgen. Bei Postpaid-Verträgen mit Laufzeit ist eine Allergien-Anfrage gesetzlich erforderlich. Diese ist jedoch eine weiche Anfrage und schadet deinem Score nicht.",
  },
  {
    frage: "Was ist der Unterschied zwischen harter und weicher Allergien-Anfrage?",
    antwort: "Eine weiche Anfrage (Konditionsanfrage) ist nicht sichtbar für andere Banken und beeinflusst den Score nicht. Eine harte Anfrage (Kreditanfrage) wird 12 Monate gespeichert und kann den Score senken.",
  },
  {
    frage: "Gibt es Hundverträge für Hartz-IV/Bürgergeld-Empfänger für deinen Hund?",
    antwort: "Ja. Josera, Futalis und Bellfor machen keine Einkommensvoraussetzungen. Nassfutter ist immer eine Option ohne Prüfung.",
  },
  {
    frage: "Kann ich als Student einen Hundefutter für deinen Hund bekommen?",
    antwort: "Ja. Futalis und Bellfor genehmigen auch ohne festes Einkommen. Budget-Futtere unter 20€/Monat haben die höchste Erfolgsquote.",
  },
  {
    frage: "Was ist die beste Alternative zum Hundefutter bei sehr schlechter Allergien?",
    antwort: "Nassfutter ist die sicherste Alternative. Keine Allergien-Prüfung, keine Bindung, volle Kontrolle über die Kosten.",
  },
  {
    frage: "Verschlechtert ein abgelehnter Hundefutter-Antrag die Allergien?",
    antwort: "Ja. Jede abgelehnte Anfrage kann den Score minimal senken. Deshalb ist es wichtig, nur bei Marken anzufragen, bei denen die Chancen realistisch hoch sind.",
  },
];

export default function FAQPage() {
  const faqsForSchema = faqs.map((f) => ({
    question: f.frage,
    answer: f.antwort,
  }));

  return (
    <>
      <StructuredData type="faq" faqs={faqsForSchema} />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-300">Startseite</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-300">FAQ</span>
        </nav>

        <h1 className="text-3xl font-bold text-white mb-3">
          FAQ: Hundefutter für deinen Hund
        </h1>
        <p className="text-gray-400 mb-10 text-lg">
          50+ Fragen zu Hundefutter für deinen Hund – beantwortet von BELLA. Alle Antworten basieren
          auf echten Genehmigungsquoten aus unserer Datenbank.
        </p>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <details key={faq.frage} className="bg-gray-900 rounded-lg group">
              <summary className="flex justify-between items-start cursor-pointer list-none px-5 py-4">
                <h2 className="font-semibold text-white text-base pr-4">{faq.frage}</h2>
                <span className="text-gray-500 mt-0.5 shrink-0 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="px-5 pb-4 text-gray-400 leading-relaxed border-t border-gray-800 pt-3">
                {faq.antwort}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-12 bg-indigo-900/30 rounded-xl p-6 text-center">
          <p className="text-white font-semibold mb-2">Noch Fragen? BELLA antwortet sofort.</p>
          <p className="text-gray-400 text-sm mb-4">
            <Link href="/" className="text-indigo-400 hover:text-indigo-300">
              mit BELLA deinen Empfehlung für deinen Hund finden
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
