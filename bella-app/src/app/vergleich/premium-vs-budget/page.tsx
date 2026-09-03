import type { Metadata } from "next";
import Link from "next/link";
import AuthorBox from "@/components/AuthorBox";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";
import VergleichHeroImage from "@/components/VergleichHeroImage";
import UmstellungsPlaner from "@/components/tools/UmstellungsPlaner";

export const metadata: Metadata = {
  title: "Premium vs. Budget Hundefutter 2026: Lohnt sich der Aufpreis?",
  description: "Macht teures Hundefutter Hunde wirklich gesünder? Was der Preisunterschied bedeutet, wo er gerechtfertigt ist und wann günstig gut genug ist.",
  alternates: {
    canonical: "https://welches-hundefutter.today/vergleich/premium-vs-budget",
    languages: {
      "de-DE": "https://welches-hundefutter.today/vergleich/premium-vs-budget",
      "de-AT": "https://welches-hundefutter.today/vergleich/premium-vs-budget",
      "de-CH": "https://welches-hundefutter.today/vergleich/premium-vs-budget",
      "x-default": "https://welches-hundefutter.today/vergleich/premium-vs-budget",
    },
  },
};

const faqItems = [
  {
    question: "Ab welchem Preis gilt Hundefutter als Premium?",
    answer: "Es gibt keine offizielle Grenze. Als Orientierung gilt: Trockenfutter ab ca. 4–5 €/kg und Nassfutter ab 4–6 €/kg nennen sich häufig Premium. Wichtiger als der Preis ist die Qualität der Zutaten — hoher Fleischanteil, offene Deklaration, keine Füllstoffe.",
  },
  {
    question: "Ist teures Hundefutter immer besser?",
    answer: "Nein. Preis und Qualität korrelieren nicht perfekt. Es gibt günstige Futter mit gutem Fleischanteil und teure Produkte, die hauptsächlich durch Marketing teuer sind. Die Zutatenliste und die analytischen Bestandteile sagen mehr als der Preis.",
  },
  {
    question: "Wie viel kosten Premium-Futter monatlich?",
    answer: "Für einen 20-kg-Hund: Budget-Futter 20–40 €/Monat, Mittelklasse 40–80 €, Premium 80–150 €, Superpremium über 150 €. Hochwertige Mittelklasse bietet oft das beste Preis-Leistungs-Verhältnis.",
  },
  {
    question: "Kann ich bei Futter sparen ohne die Gesundheit zu gefährden?",
    answer: "Ja, wenn du clever kaufst. Vergleiche Preis pro kg statt pro Packung, nutze Preisalarme (BELLA's Preis-Wecker), kaufe Großpackungen bei stabiler Verträglichkeit und wähle bewährte Mittelklasse-Marken mit guter Deklaration statt teurer Marken-Premium.",
  },
];

export default function PremiumVsBudget() {
  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData
        type="article"
        article={{
          headline: "Premium vs. Budget Hundefutter 2026",
          description: "Lohnt sich der Aufpreis? Was der Preisunterschied wirklich bedeutet.",
          url: "https://welches-hundefutter.today/vergleich/premium-vs-budget",
          dateModified: "2026-06-20",
          speakableSelectors: ["h1", ".bella-answer"],
        }}
      />
      <StructuredData type="faq" faqs={faqItems} />

      <nav className="max-w-5xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <Link href="/vergleich" className="hover:text-[var(--honey)]">Vergleiche</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">Premium vs. Budget</span>
      </nav>

      <VergleichHeroImage slug="premium-vs-budget" alt="Premium vs. Budget Hundefutter – Direktvergleich" />

      <section className="hero-glow max-w-5xl mx-auto w-full px-5 pt-8 pb-14">
        <span className="pill mb-4">⚖️ Direktvergleich</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
          Premium vs. Budget Hundefutter: Lohnt sich der Aufpreis?
        </h1>
        <p className="bella-answer text-[var(--muted)] leading-relaxed max-w-2xl mb-6">
          Wir haben 11.000+ Produkte analysiert. Das Ergebnis: Der Preisunterschied zwischen Premium und Budget ist real — aber die Grenze zwischen "gut" und "teuer" liegt nicht dort, wo du denkst.
        </p>
        <Link href="/deals" className="px-4 py-2 rounded-2xl bg-amber-500/15 text-amber-300 text-sm font-medium hover:bg-amber-500/25 transition-colors inline-block">→ Aktuelle Futter-Deals</Link>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 border border-white/10 bg-white/5 font-bold">Merkmal</th>
                <th className="text-left p-4 border border-white/10 bg-amber-500/10 font-bold text-[var(--honey)]">Premium (4+ €/kg)</th>
                <th className="text-left p-4 border border-white/10 bg-blue-500/10 font-bold text-blue-300">Budget (unter 2 €/kg)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Fleischanteil", "30–70 %", "10–25 %"],
                ["Erste Zutat", "Fleischmehl / Fleisch", "Getreide / Nebenerzeugnisse"],
                ["Deklaration", "offen, konkret", "vage, zusammengefasst"],
                ["Konservierung", "natürlich (Tocopherole)", "oft synthetisch (BHA, BHT)"],
                ["Fleischmehlqualität", "human-grade oder kontrolliert", "4D-Mehl möglich"],
                ["Zuckerzusatz", "selten", "häufig"],
                ["Kosten/Monat (20 kg)", "80–150 €", "20–40 €"],
                ["Verdaulichkeit", "85–92 %", "68–78 %"],
                ["Stuhlmenge", "gering", "hoch"],
                ["Hersteller-Transparenz", "meist hoch", "oft niedrig"],
              ].map(([k, p, b], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white/[0.02]" : ""}>
                  <td className="p-3 border border-white/10 font-medium text-[var(--muted)]">{k}</td>
                  <td className="p-3 border border-white/10">{p}</td>
                  <td className="p-3 border border-white/10">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <div className="card p-6">
          <h2 className="text-xl font-extrabold tracking-tight mb-4">Was der Preis wirklich kauft</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Fleischqualität", icon: "🥩", text: "Premium-Futter nutzt kontrolliertes Fleischmehl oder Frischfleisch. Budget-Futter greift auf vage \"tierische Nebenerzeugnisse\" zurück — das kann alles sein, von Lunge bis Federn." },
              { title: "Verdaulichkeit", icon: "🔬", text: "Premium-Futter wird zu 85–92 % verdaut. Budget liegt bei 68–78 %. Das bedeutet: Pro Kilo Premium-Futter bekommt dein Hund effektiv mehr Nährstoffe — die Stuhlmenge ist kleiner." },
              { title: "Konservierung", icon: "🛡️", text: "Premium-Futter konserviert mit Tocopherolen (Vitamin E) oder Rosmarin. Günstige Futter enthalten oft synthetische Konservierungsstoffe wie BHA, BHT oder Propylgallat — deren Langzeitwirkung ist umstritten." },
            ].map((c) => (
              <div key={c.title} className="bg-white/[0.03] rounded-xl p-4">
                <div className="text-2xl mb-2">{c.icon}</div>
                <h3 className="font-bold mb-2">{c.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <div className="card p-6 border border-emerald-500/20">
          <h2 className="text-xl font-extrabold tracking-tight mb-4 text-emerald-300">Das Sweet Spot: Gute Mittelklasse</h2>
          <p className="text-[var(--muted)] mb-4 leading-relaxed">
            Das beste Preis-Leistungs-Verhältnis bietet Trockenfutter im Bereich 2,50–4 €/kg: hoher Fleischanteil, offene Deklaration, natürliche Konservierung — ohne den Premium-Aufpreis für Marketing und Designverpackung.
          </p>
          <p className="text-[var(--muted)] leading-relaxed">
            In unserem Katalog mit 11.000+ Produkten filtern wir nach Fleischanteil, Deklarationsklarheit und Preis-pro-kg. BELLA findet die besten Kandidaten für deinen Hund — ohne Marken-Bias.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-10">
        <UmstellungsPlaner />
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-14">
        <h2 className="text-2xl font-extrabold tracking-tight mb-6">Häufige Fragen (FAQ)</h2>
        <div className="space-y-4">
          {faqItems.map((f, i) => (
            <div key={i} className="card p-5">
              <h3 className="font-bold text-base mb-2">{f.question}</h3>
              <p className="text-[var(--muted)] text-sm leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-14">
        <div className="rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 p-8">
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">BELLA findet das Beste im richtigen Preis-Fenster</h2>
          <p className="text-[var(--muted)] mb-6">Sag BELLA dein Budget und dein Hunde-Profil — sie findet die besten Optionen, ohne dich zu überteures Premium zu drängen.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/#bella-advisor" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all">
              🐕 Futter finden
            </Link>
            <Link href="/preis-wecker" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/15 transition-all">
              ⏰ Preis-Wecker
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-10">
        <h2 className="text-xl font-extrabold tracking-tight mb-4">Weitere Vergleiche</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/vergleich/barf-vs-trockenfutter" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">BARF vs. Trockenfutter</Link>
          <Link href="/vergleich/trockenfutter-vs-nassfutter" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">Trockenfutter vs. Nassfutter</Link>
          <Link href="/vergleich/getreidefrei-vs-mit-getreide" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">Getreidefrei vs. Mit Getreide</Link>
          <Link href="/vergleich/monoprotein-vs-mehrkomponenten" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">Monoprotein vs. Mehrkomponenten</Link>
          <Link href="/vergleich/insektenfutter-vs-huehnchen" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">Insektenfutter vs. Hühnchen</Link>
        </div>
      </section>

      <div className="max-w-5xl mx-auto w-full px-5 pb-10">
        <AuthorBox />
      </div>
      <SiteFooter />
    </div>
  );
}
