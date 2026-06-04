import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Hundefutter FAQ: Die 10 wichtigsten Fragen zur Hundeernährung | BELLA",
  description: "Welches Hundefutter ist das beste? Was bei Allergie? Wie viel fressen? BELLA beantwortet die häufigsten Fragen zur Hundeernährung – kurz und verständlich.",
  alternates: { canonical: "https://welches-hundefutter.today/faq" },
};

const faqs = [
  {
    frage: "Welches Hundefutter ist das beste?",
    antwort: "Das hängt von Rasse, Alter, Aktivität und Gesundheit ab. Premium-Sorten wie Anifit, Wolfsblut oder Futalis sind 2026 Testsieger. BELLA findet in 60 Sekunden das passende Futter speziell für deinen Hund.",
  },
  {
    frage: "Wie erkenne ich gutes Hundefutter?",
    antwort: "Hoher Fleischanteil (über 70 %), keine Zucker, keine Geschmacksverstärker, klare Zutatenliste ohne \"tierische Nebenerzeugnisse\". Bei Premium-Futter steht genau drauf, welches Fleisch in welcher Menge enthalten ist.",
  },
  {
    frage: "Welches Hundefutter bei Allergie?",
    antwort: "Hypoallergenes Monoprotein-Futter (z.B. Wolfsblut Wild Duck, Bellfor Hypoallergen) ohne Huhn, Rind, Weizen. Diese drei sind die häufigsten Allergie-Auslöser bei Hunden in Deutschland.",
  },
  {
    frage: "Wie viel sollte mein Hund pro Tag fressen?",
    antwort: "Faustregel Trockenfutter: 1,5–2,5 % des Körpergewichts. Ein 20 kg Hund braucht etwa 300–500 g/Tag. Bei Nassfutter: Faktor 3. Aktive Hunde mehr, Senioren weniger.",
  },
  {
    frage: "Trockenfutter oder Nassfutter – was ist besser?",
    antwort: "Beides hat Vor- und Nachteile. Trockenfutter ist günstiger und gut für die Zähne. Nassfutter hat mehr Feuchtigkeit und schmeckt vielen Hunden besser. Optimal: Mischfütterung – Frühstück trocken, Abend nass.",
  },
  {
    frage: "Ab wann sollte mein Hund Seniorfutter bekommen?",
    antwort: "Kleine Rassen ab 9 Jahren, große Rassen schon ab 7 Jahren. Seniorfutter hat weniger Kalorien, mehr Gelenkstoffe (Glucosamin, Chondroitin) und ist leichter verdaulich.",
  },
  {
    frage: "Welches Hundefutter empfehlen Tierärzte?",
    antwort: "Tierärzte empfehlen oft Royal Canin, Hill's oder Eukanuba – primär aus Vertragsgründen. Unabhängige Empfehlungen liegen häufig bei Anifit, Wolfsblut oder Futalis wegen höherer Fleischqualität.",
  },
  {
    frage: "Welches Futter für meinen Welpen?",
    antwort: "Spezielles Welpenfutter mit erhöhtem Protein- und Kalziumgehalt für gesundes Wachstum. Bei großen Rassen wichtig: Junior-Futter für Large Breeds, damit das Knochenwachstum nicht zu schnell verläuft.",
  },
  {
    frage: "Ist BARF besser als Fertigfutter?",
    antwort: "BARF kann sehr gut sein – wenn richtig berechnet. Falsch gemacht führt es zu Mangelerscheinungen. Für Anfänger ist hochwertiges Fertigfutter sicherer. Mischlösung: BARF ergänzend zum Trockenfutter.",
  },
  {
    frage: "Wie wechsle ich das Hundefutter richtig?",
    antwort: "Über 5–7 Tage langsam mischen: Tag 1–2: 75 % altes + 25 % neues Futter. Tag 3–4: 50/50. Tag 5–7: 25 % altes + 75 % neues. Dann ganz umstellen. So vermeidest du Verdauungsprobleme.",
  },
];

export default function FaqPage() {
  const schemaFaqs = faqs.map((f) => ({ question: f.frage, answer: f.antwort }));

  return (
    <div className="min-h-screen bg-[#fef6f0] text-gray-900 flex flex-col">
      <StructuredData type="faq" faqs={schemaFaqs} />

      <header className="border-b border-orange-100 bg-white px-5 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">B</span>
            </div>
            <span className="font-bold text-sm">welches-hundefutter<span className="text-orange-500">.today</span></span>
          </Link>
          <nav className="text-sm text-gray-400 flex gap-2">
            <Link href="/" className="hover:text-gray-700 transition-colors">Startseite</Link>
            <span>/</span>
            <span className="text-gray-700">FAQ</span>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-5 py-14 w-full">
        <div className="mb-10">
          <h1 className="text-4xl font-black mb-3">
            Häufige Fragen zur Hundeernährung
          </h1>
          <p className="text-gray-500">
            Die 10 wichtigsten Fragen – im Featured-Snippet-Format, damit du schnell die Antwort findest.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm">
              <h2 className="text-lg font-bold mb-3 text-gray-900">{f.frage}</h2>
              <p className="text-gray-600 leading-relaxed">{f.antwort}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-orange-50 rounded-2xl border border-orange-100 text-center">
          <p className="font-bold mb-2">Deine Frage nicht dabei?</p>
          <p className="text-sm text-gray-600 mb-4">
            BELLA beantwortet sie persönlich – und empfiehlt gleich das passende Futter.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors text-sm"
          >
            🐕 BELLA fragen →
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
