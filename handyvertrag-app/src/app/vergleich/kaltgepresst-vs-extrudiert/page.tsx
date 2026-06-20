import type { Metadata } from "next";
import Link from "next/link";
import AuthorBox from "@/components/AuthorBox";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Kaltgepresstes Hundefutter vs. Extrudiert 2026: Der echte Unterschied",
  description: "Kaltgepresst oder extrudiert? Was der Herstellungsunterschied für Nährstoffe, Verdaulichkeit und Kosten bedeutet — datenbasiert erklärt.",
  alternates: {
    canonical: "https://welches-hundefutter.today/vergleich/kaltgepresst-vs-extrudiert",
    languages: {
      "de-DE": "https://welches-hundefutter.today/vergleich/kaltgepresst-vs-extrudiert",
      "de-AT": "https://welches-hundefutter.today/vergleich/kaltgepresst-vs-extrudiert",
      "de-CH": "https://welches-hundefutter.today/vergleich/kaltgepresst-vs-extrudiert",
      "x-default": "https://welches-hundefutter.today/vergleich/kaltgepresst-vs-extrudiert",
    },
  },
};

const faqItems = [
  {
    question: "Ist kaltgepresstes Hundefutter wirklich besser?",
    answer: "Nicht pauschal. Kaltgepresst schont hitzeempfindliche Enzyme und Vitamine besser. Allerdings ist die Keimbelastung bei schlechter Lagerung höher. Hochwertiges extrudiertes Futter mit nachträglicher Vitaminzugabe ist für die meisten Hunde genauso gut.",
  },
  {
    question: "Wie erkenne ich echtes kaltgepresstes Futter?",
    answer: "Echtes Kaltpressen findet unter 40–45 °C statt. Achte auf die Herstellerangabe zur Temperatur. Viele Hersteller bewerben \"schonend verarbeitet\" ohne konkrete Temperaturangabe — das ist kein Qualitätssiegel.",
  },
  {
    question: "Kann kaltgepresstes Futter schimmeln?",
    answer: "Ja, schneller als extrudiertes. Da keine hohen Temperaturen zum Einsatz kommen, sind natürliche Konservierungsmittel (Tocopherole, Rosmarin) wichtig. Offene Packungen sollten im Kühlschrank gelagert und innerhalb von 3–4 Wochen verbraucht werden.",
  },
  {
    question: "Was kostet kaltgepresstes Futter im Vergleich?",
    answer: "Kaltgepresstes Futter kostet im Durchschnitt 30–60 % mehr als vergleichbares extrudiertes Futter. Für einen 20-kg-Hund sind das ca. 40–80 € Aufpreis pro Monat — je nach Marke und Qualitätsstufe.",
  },
];

export default function KaltgepresstvExtrudiert() {
  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData
        type="article"
        article={{
          headline: "Kaltgepresst vs. Extrudiert: Direktvergleich 2026",
          description: "Was der Herstellungsunterschied für Nährstoffe, Verdaulichkeit und Kosten bedeutet.",
          url: "https://welches-hundefutter.today/vergleich/kaltgepresst-vs-extrudiert",
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
        <span className="text-[var(--ink)]">Kaltgepresst vs. Extrudiert</span>
      </nav>

      <section className="hero-glow max-w-5xl mx-auto w-full px-5 pt-8 pb-14">
        <span className="pill mb-4">⚖️ Direktvergleich</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
          Kaltgepresstes Hundefutter vs. Extrudiert: Was ist der echte Unterschied?
        </h1>
        <p className="bella-answer text-[var(--muted)] leading-relaxed max-w-2xl mb-6">
          Die Herstellung macht den Unterschied — aber viele Behauptungen rund ums Kaltpressen sind Marketing. Hier kommt der ehrliche Vergleich: Was bringt die schonende Verarbeitung wirklich, und wann lohnt der Aufpreis?
        </p>
        <Link href="/futtertyp/kaltgepresst" className="px-4 py-2 rounded-2xl bg-emerald-500/15 text-emerald-300 text-sm font-medium hover:bg-emerald-500/25 transition-colors inline-block">→ Kaltgepresstes Futter im Katalog</Link>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-10">
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-extrabold tracking-tight mb-4">Wie entsteht der Unterschied?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-emerald-300 mb-2">Kaltpressen (bis ~45 °C)</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">Die Zutaten werden bei niedrigen Temperaturen gepresst. Hitzeempfindliche Enzyme, natürliche Antioxidantien und bestimmte Vitamine (B1, C) bleiben besser erhalten. Das Endprodukt hat eine weichere, dichtere Textur und quillt im Magen des Hundes auf.</p>
            </div>
            <div>
              <h3 className="font-bold text-amber-300 mb-2">Extrudieren (120–180 °C)</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">Dampf und Hitze formen die Zutaten zu den typischen Kibble-Stücken. Dabei werden Keime zuverlässig abgetötet, Stärken aufgeschlossen (besser verdaulich) und das Futter sehr haltbar. Verloren gehende Vitamine werden anschließend nachträglich zugegeben.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 border border-white/10 bg-white/5 font-bold">Kriterium</th>
                <th className="text-left p-4 border border-white/10 bg-emerald-500/10 font-bold text-emerald-300">Kaltgepresst</th>
                <th className="text-left p-4 border border-white/10 bg-amber-500/10 font-bold text-[var(--honey)]">Extrudiert</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Verarbeitungstemperatur", "bis 45 °C", "120–180 °C"],
                ["Vitamine (hitzeempfindlich)", "besser erhalten", "meist nachträglich zugegeben"],
                ["Stärkeaufschluss", "geringer → dichter Stuhl", "höher → leichter verdaulich"],
                ["Keimbelastung", "gering bis mittel", "sehr niedrig"],
                ["Haltbarkeit (geöffnet)", "3–4 Wochen", "4–8 Wochen"],
                ["Kosten/Monat (20 kg)", "80–160 €", "40–100 €"],
                ["Zutatendichte", "hoch (weniger Luftanteil)", "niedriger (luftig, leicht)"],
                ["Textur", "fest, dicht", "knusprig, gebläht"],
                ["Sättigungseffekt", "sehr hoch (quillt auf)", "hoch"],
                ["Allergiker-Eignung", "gut", "gut"],
                ["Geeignet für Welpen", "ja (mit quellen lassen)", "ja"],
                ["Verfügbarkeit", "begrenzt", "sehr hoch"],
              ].map(([k, ka, ex], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white/[0.02]" : ""}>
                  <td className="p-3 border border-white/10 font-medium text-[var(--muted)]">{k}</td>
                  <td className="p-3 border border-white/10">{ka}</td>
                  <td className="p-3 border border-white/10">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <div className="card p-6">
          <h2 className="text-xl font-extrabold tracking-tight mb-4">Der Mythos der Überlegenheit</h2>
          <p className="text-[var(--muted)] mb-4 leading-relaxed">
            "Kaltgepresst = natürlicher = besser" ist ein weit verbreiteter Marketing-Gedanke, der wissenschaftlich nicht universell hält. Studien zeigen, dass Hunde hochwertiges extrudiertes Futter mit nachträglicher Vitaminzugabe genauso gut verwerten wie kaltgepresstes.
          </p>
          <p className="text-[var(--muted)] leading-relaxed">
            Der echte Vorteil des Kaltpressens liegt in der Transparenz: Wer bei niedrigen Temperaturen presst, kann keine minderwertigen Rohstoffe durch Hochtemperatur kaschieren. Das ist ein indirekter Qualitätsindikator — aber kein Garant für bessere Nährstoffversorgung.
          </p>
        </div>
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
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">BELLA kennt alle Futtertypen — auch kaltgepresstes</h2>
          <p className="text-[var(--muted)] mb-6">Erzähl BELLA von deinem Hund — sie findet das passende Futter aus 11.000+ Sorten, egal ob kaltgepresst, extrudiert oder Nassfutter.</p>
          <Link href="/#bella-advisor" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all">
            🐕 Jetzt Futter finden
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-10">
        <h2 className="text-xl font-extrabold tracking-tight mb-4">Weitere Vergleiche</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/vergleich/barf-vs-trockenfutter" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">BARF vs. Trockenfutter</Link>
          <Link href="/vergleich/trockenfutter-vs-nassfutter" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">Trockenfutter vs. Nassfutter</Link>
          <Link href="/vergleich/nassfutter-vs-barf" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">Nassfutter vs. BARF</Link>
          <Link href="/vergleich/monoprotein-vs-mehrkomponenten" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">Monoprotein vs. Mehrkomponenten</Link>
          <Link href="/vergleich/getreidefrei-vs-mit-getreide" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">Getreidefrei vs. Mit Getreide</Link>
        </div>
      </section>

      <div className="max-w-5xl mx-auto w-full px-5 pb-10">
        <AuthorBox />
      </div>
      <SiteFooter />
    </div>
  );
}
