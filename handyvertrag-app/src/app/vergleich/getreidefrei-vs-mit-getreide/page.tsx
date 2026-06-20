import type { Metadata } from "next";
import Link from "next/link";
import AuthorBox from "@/components/AuthorBox";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Getreidefrei vs. Getreide im Hundefutter 2026: Was ist wirklich besser?",
  description: "Getreidefrei ist kein Qualitätsmerkmal — aber auch nicht wertlos. Was die Wissenschaft wirklich sagt und wann getreidefrei sinnvoll ist.",
  alternates: {
    canonical: "https://welches-hundefutter.today/vergleich/getreidefrei-vs-mit-getreide",
    languages: {
      "de-DE": "https://welches-hundefutter.today/vergleich/getreidefrei-vs-mit-getreide",
      "de-AT": "https://welches-hundefutter.today/vergleich/getreidefrei-vs-mit-getreide",
      "de-CH": "https://welches-hundefutter.today/vergleich/getreidefrei-vs-mit-getreide",
      "x-default": "https://welches-hundefutter.today/vergleich/getreidefrei-vs-mit-getreide",
    },
  },
};

const faqItems = [
  {
    question: "Ist getreidefrei wirklich besser für Hunde?",
    answer: "Nicht pauschal. Hunde können Getreide verdauen — sie haben im Laufe der Domestikation Gene entwickelt, die das erlauben. Getreidefrei lohnt sich bei nachgewiesener Getreide-Allergie oder -Unverträglichkeit, nicht als allgemeines Qualitätsmerkmal.",
  },
  {
    question: "Was ersetzt Getreide im getreidefrei Futter?",
    answer: "Oft Kartoffeln, Süßkartoffeln, Erbsen, Linsen oder Tapioka. Diese Alternativkohlenhydrate sind nicht automatisch besser — Erbsen können in großen Mengen die Eisenaufnahme hemmen und werden mit DCM (Herzerkrankung) in Verbindung gebracht.",
  },
  {
    question: "Ist Getreidefrei teurer?",
    answer: "Ja, im Schnitt 15–30 % teurer als vergleichbare Futter mit Getreide, weil die günstigeren Kohlenhydrate durch teurere Alternativen ersetzt werden.",
  },
  {
    question: "Welche Hunde brauchen getreidefrei Futter?",
    answer: "Hunde mit bestätigter Weizen-, Mais- oder Gerstenallergie. Auch bei Zöliakie (sehr selten bei Hunden). Alle anderen Hunde brauchen es nicht — aber es schadet auch nicht, wenn das Futter ansonsten hochwertig ist.",
  },
];

export default function GetreidefeiVsMitGetreide() {
  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData
        type="article"
        article={{
          headline: "Getreidefrei vs. Mit Getreide 2026",
          description: "Was die Wissenschaft wirklich sagt — getreidefrei ist kein Qualitätsmerkmal per se.",
          url: "https://welches-hundefutter.today/vergleich/getreidefrei-vs-mit-getreide",
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
        <span className="text-[var(--ink)]">Getreidefrei vs. Mit Getreide</span>
      </nav>

      <section className="hero-glow max-w-5xl mx-auto w-full px-5 pt-8 pb-14">
        <span className="pill mb-4">⚖️ Direktvergleich</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
          Getreidefrei vs. Mit Getreide: Was ist wirklich besser?
        </h1>
        <p className="bella-answer text-[var(--muted)] leading-relaxed max-w-2xl mb-6">
          Der Mythos "getreidefrei = artgerechter" hält sich hartnäckig — stimmt aber nicht pauschal. Wir räumen mit den häufigsten Missverständnissen auf und erklären, wann getreidefrei Sinn macht und wann nicht.
        </p>
        <Link href="/futtertyp/getreidefrei" className="px-4 py-2 rounded-2xl bg-emerald-500/15 text-emerald-300 text-sm font-medium hover:bg-emerald-500/25 transition-colors inline-block">→ Getreidefrei Futter im Katalog</Link>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-10">
        <div className="card p-6 bg-amber-500/5 border border-amber-500/20 mb-6">
          <h2 className="text-lg font-bold text-amber-300 mb-3">⚠️ Wichtiger Hinweis: DCM und getreidefrei</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            Die US-amerikanische FDA untersucht seit 2018 einen möglichen Zusammenhang zwischen getreidefrei Diäten mit hohem Erbsenanteil und Dilatativer Kardiomyopathie (DCM) bei Hunden. Die Untersuchungen sind noch nicht abgeschlossen. Bei Hunderassen mit erhöhtem DCM-Risiko (Golden Retriever, Dobermann, Cocker Spaniel) solltest du dies mit deinem Tierarzt besprechen.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 border border-white/10 bg-white/5 font-bold">Kriterium</th>
                <th className="text-left p-4 border border-white/10 bg-emerald-500/10 font-bold text-emerald-300">Getreidefrei</th>
                <th className="text-left p-4 border border-white/10 bg-amber-500/10 font-bold text-[var(--honey)]">Mit Getreide</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Kohlenhydratalternative", "Kartoffel, Erbse, Tapioka", "Reis, Gerste, Hafer, Weizen"],
                ["Preis", "15–30 % teurer", "günstiger"],
                ["Geeignet bei Weizen-Allergie", "ja", "nein (weizenhaltiges Futter)"],
                ["Geeignet für gesunde Hunde", "ja (unnötig teuer)", "optimal"],
                ["Verdaulichkeit Kohlenhydrate", "gut", "sehr gut (aufgeschlossen)"],
                ["Ballaststoffe", "gut (Süßkartoffel, Erbsen)", "sehr gut (Hafer, Gerste)"],
                ["DCM-Hinweis (erbsenreich)", "zu beachten", "nicht relevant"],
                ["Fleischanteil", "oft höher", "variabel"],
                ["Insulinreaktion", "ähnlich", "ähnlich"],
                ["Marketing-Hype", "sehr hoch", "niedrig"],
              ].map(([k, g, mg], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white/[0.02]" : ""}>
                  <td className="p-3 border border-white/10 font-medium text-[var(--muted)]">{k}</td>
                  <td className="p-3 border border-white/10">{g}</td>
                  <td className="p-3 border border-white/10">{mg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <div className="card p-6">
          <h2 className="text-xl font-extrabold tracking-tight mb-4">Der Mythos der Artgerechtigkeit</h2>
          <p className="text-[var(--muted)] mb-4 leading-relaxed">
            Wölfe fressen kein Getreide — das stimmt. Aber Hunde sind keine Wölfe. Im Laufe von 15.000 Jahren Domestikation haben Hunde mehrere Kopien des AMY2B-Gens entwickelt, das Amylase produziert und damit die Stärkeverdauung ermöglicht. Wölfe haben diese Genkopien nicht.
          </p>
          <p className="text-[var(--muted)] leading-relaxed">
            Das bedeutet: Getreide in moderaten Mengen ist für Hunde biologisch kein Problem. Was ein Problem ist, sind minderwertige Futter mit Getreide als Hauptzutat, die günstige Kohlenhydrate nutzen, um teure Proteine zu ersetzen. Das ist eine Qualitätsfrage — keine Getreide-Frage.
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
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">BELLA prüft Getreide-Status für deinen Hund</h2>
          <p className="text-[var(--muted)] mb-6">Erzähl BELLA von Allergien oder Unverträglichkeiten — sie filtert automatisch getreidefrei oder nicht, je nach dem was für deinen Hund passt.</p>
          <Link href="/#bella-advisor" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all">
            🐕 Jetzt Futter finden
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-10">
        <h2 className="text-xl font-extrabold tracking-tight mb-4">Weitere Vergleiche</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/vergleich/monoprotein-vs-mehrkomponenten" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">Monoprotein vs. Mehrkomponenten</Link>
          <Link href="/vergleich/premium-vs-budget" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">Premium vs. Budget</Link>
          <Link href="/vergleich/barf-vs-trockenfutter" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">BARF vs. Trockenfutter</Link>
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
