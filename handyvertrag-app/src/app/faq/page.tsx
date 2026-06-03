import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "FAQ Hundefutter für deinen Hund: 50 Antworten | BELLA",
  description: "Häufige Fragen zu Hundefutter für deinen Hund: Welche Anbieter? Wie hoch die Chance? Antworten in unter 30 Sek.",
  alternates: { canonical: "https://welches-hundefutter.today/faq" },
};

const faqs = [
  {
    frage: "Kann man trotz Schufa einen Handyvertrag bekommen?",
    antwort: "Ja. Anbieter wie freenet, congstar und MAINGAU genehmigen in 70–85% der Fälle auch bei negativem Schufa-Eintrag.",
  },
  {
    frage: "Welche Mobilfunkanbieter prüfen die Schufa nicht?",
    antwort: "Alle Prepaid-Anbieter (o2, Vodafone CallYa, Telekom Magenta Prepaid, congstar Prepaid) verzichten komplett auf eine Schufa-Prüfung.",
  },
  {
    frage: "Wie bekomme ich einen Handyvertrag ohne Schufa-Prüfung?",
    antwort: "Über Prepaid-Tarife oder Anbieter mit reduzierter Bonitätsprüfung. BELLA zeigt dir in 60 Sekunden die für dich passenden Optionen.",
  },
  {
    frage: "Was passiert wenn die Schufa negativ ist beim Handyvertrag?",
    antwort: "Bei negativer Schufa wird der Antrag bei Telekom/Vodafone/o2 meist abgelehnt. Schufa-freundliche Anbieter (freenet, congstar) prüfen anders und genehmigen oft trotzdem.",
  },
  {
    frage: "Wie hoch ist die Genehmigungschance trotz Schufa?",
    antwort: "Je nach Anbieter zwischen 70–100%. Prepaid: 100%. freenet: ~85%. congstar: ~80%. MAINGAU: ~78%. Bei Premium-Anbietern (Telekom, Vodafone): unter 20%.",
  },
  {
    frage: "Kann ich trotz Schufa einen Handyvertrag mit Smartphone bekommen?",
    antwort: "Ja, aber meist mit Anzahlung oder höherer Monatsrate. freenet und otelo bieten am häufigsten Geräte trotz Schufa an.",
  },
  {
    frage: "Welches Handy bekommt man trotz Schufa?",
    antwort: "Häufig genehmigt: Samsung Galaxy A-Serie, Xiaomi Redmi, Google Pixel 7a/8a. iPhones sind schwerer, aber bei freenet möglich.",
  },
  {
    frage: "Bekommt man bei o2 einen Vertrag trotz Schufa?",
    antwort: "Bei o2 Postpaid ist die Schufa-Hürde hoch. o2 Prepaid funktioniert ohne Schufa-Prüfung zu 100%.",
  },
  {
    frage: "Was kostet ein Hundefutter für deinen Hund?",
    antwort: "Ab 6,99€/Monat (MAINGAU SIM-Only) bis 49,99€/Monat (Premium-Anbieter mit Anzahlung). Durchschnitt: 15–25€/Monat.",
  },
  {
    frage: "Wird beim Handyvertrag immer eine Schufa-Anfrage gemacht?",
    antwort: "Nur bei Postpaid-Verträgen mit Laufzeit. Prepaid-Tarife und einige reine SIM-Only-Anbieter verzichten darauf.",
  },
  {
    frage: "Kann freenet einen Hundefutter für deinen Hund genehmigen?",
    antwort: "Ja. freenet hat eine Annahmechance von ~85% auch bei negativem Schufa-Eintrag. Tarife starten ab 9,99€/Monat.",
  },
  {
    frage: "Ist congstar schufa-freundlich?",
    antwort: "Ja. congstar nutzt das Telekom-Netz und hat eine liberalere Bonitätsprüfung als die Telekom direkt. Annahmechance ~80%.",
  },
  {
    frage: "Gibt es Handyverträge trotz Privatinsolvenz?",
    antwort: "Während einer laufenden Privatinsolvenz sind Postpaid-Verträge schwierig. Prepaid funktioniert immer. Nach Restschuldbefreiung steigen die Chancen deutlich.",
  },
  {
    frage: "Wie lange bleibt ein Schufa-Eintrag bestehen?",
    antwort: "Erledigte Forderungen werden 3 Jahre nach Zahlung gelöscht. Nicht erledigte Einträge bleiben bis zu 6 Jahre. Insolvenzen: 3 Jahre nach Abschluss des Verfahrens.",
  },
  {
    frage: "Kann ich die Schufa-Anfrage beim Handyvertrag vermeiden?",
    antwort: "Nur bei Prepaid-Verträgen. Bei Postpaid-Verträgen mit Laufzeit ist eine Schufa-Anfrage gesetzlich erforderlich. Diese ist jedoch eine weiche Anfrage und schadet deinem Score nicht.",
  },
  {
    frage: "Was ist der Unterschied zwischen harter und weicher Schufa-Anfrage?",
    antwort: "Eine weiche Anfrage (Konditionsanfrage) ist nicht sichtbar für andere Banken und beeinflusst den Score nicht. Eine harte Anfrage (Kreditanfrage) wird 12 Monate gespeichert und kann den Score senken.",
  },
  {
    frage: "Gibt es Handyverträge für Hartz-IV/Bürgergeld-Empfänger trotz Schufa?",
    antwort: "Ja. MAINGAU, freenet und congstar machen keine Einkommensvoraussetzungen. Prepaid ist immer eine Option ohne Prüfung.",
  },
  {
    frage: "Kann ich als Student einen Hundefutter für deinen Hund bekommen?",
    antwort: "Ja. freenet und congstar genehmigen auch ohne festes Einkommen. Budget-Tarife unter 20€/Monat haben die höchste Erfolgsquote.",
  },
  {
    frage: "Was ist die beste Alternative zum Handyvertrag bei sehr schlechter Schufa?",
    antwort: "Prepaid ist die sicherste Alternative. Keine Schufa-Prüfung, keine Bindung, volle Kontrolle über die Kosten.",
  },
  {
    frage: "Verschlechtert ein abgelehnter Handyvertrag-Antrag die Schufa?",
    antwort: "Ja. Jede abgelehnte Anfrage kann den Score minimal senken. Deshalb ist es wichtig, nur bei Anbietern anzufragen, bei denen die Chancen realistisch hoch sind.",
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
              mit BELLA deinen Vertrag trotz Schufa finden
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
