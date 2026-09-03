import type { Metadata } from "next";
import Link from "next/link";
import AuthorBox from "@/components/AuthorBox";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";
import VergleichHeroImage from "@/components/VergleichHeroImage";
import UmstellungsPlaner from "@/components/tools/UmstellungsPlaner";

export const metadata: Metadata = {
  title: "Monoprotein vs. Mehrkomponenten Hundefutter 2026: Für wen ist was besser?",
  description: "Monoprotein für Allergiker, Mehrkomponenten für Abwechslung? Was die Forschung wirklich sagt und wann Monoprotein sich lohnt.",
  alternates: {
    canonical: "https://welches-hundefutter.today/vergleich/monoprotein-vs-mehrkomponenten",
    languages: {
      "de-DE": "https://welches-hundefutter.today/vergleich/monoprotein-vs-mehrkomponenten",
      "de-AT": "https://welches-hundefutter.today/vergleich/monoprotein-vs-mehrkomponenten",
      "de-CH": "https://welches-hundefutter.today/vergleich/monoprotein-vs-mehrkomponenten",
      "x-default": "https://welches-hundefutter.today/vergleich/monoprotein-vs-mehrkomponenten",
    },
  },
};

const faqItems = [
  {
    question: "Braucht jeder Hund Monoprotein-Futter?",
    answer: "Nein. Monoprotein lohnt sich vor allem bei bestätigter Futtermittelallergie, während einer Ausschlussdiät oder bei Hunden mit bekannter Unverträglichkeit gegenüber bestimmten Proteinen. Gesunde Hunde profitieren häufig von der breiteren Aminosäure-Palette der Mehrkomponenten-Variante.",
  },
  {
    question: "Kann ich meinen Hund dauerhaft mit Monoprotein füttern?",
    answer: "Ja, wenn das Futter als Alleinfutter deklariert ist und alle Vitamine und Mineralstoffe enthält. Die meisten Monoprotein-Futter sind vollständig formuliert. Achte aber auf abwechselnde Proteinquellen über die Zeit, um neue Sensibilisierungen zu vermeiden.",
  },
  {
    question: "Ist Monoprotein-Futter teurer?",
    answer: "In der Regel ja — 20–50 % Aufpreis gegenüber vergleichbaren Mehrkomponenten-Sorten. Exotische Proteine (Känguru, Strauß, Insekt) sind noch teurer. Der Aufpreis lohnt sich nur bei tatsächlicher Allergie.",
  },
  {
    question: "Welche Proteinquellen sind die häufigsten Allergene?",
    answer: "Laut Studien sind Hühnchen, Rind, Milchprodukte, Weizen und Soja die häufigsten Auslöser von Futtermittelallergien bei Hunden. Bei Verdacht auf Allergie sollte zunächst ein Protein gewählt werden, das der Hund noch nie gefressen hat.",
  },
];

export default function MonoproteinVsMehrkomponenten() {
  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData
        type="article"
        article={{
          headline: "Monoprotein vs. Mehrkomponenten Hundefutter 2026",
          description: "Monoprotein für Allergiker — was die Forschung wirklich sagt.",
          url: "https://welches-hundefutter.today/vergleich/monoprotein-vs-mehrkomponenten",
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
        <span className="text-[var(--ink)]">Monoprotein vs. Mehrkomponenten</span>
      </nav>

      <VergleichHeroImage slug="monoprotein-vs-mehrkomponenten" alt="Monoprotein vs. Mehrkomponenten Hundefutter – Vergleich" />

      <section className="hero-glow max-w-5xl mx-auto w-full px-5 pt-8 pb-14">
        <span className="pill mb-4">⚖️ Direktvergleich</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
          Monoprotein vs. Mehrkomponenten: Wann lohnt sich was?
        </h1>
        <p className="bella-answer text-[var(--muted)] leading-relaxed max-w-2xl mb-6">
          Monoprotein gilt als der Standard für Allergiker — aber nicht jeder Hund braucht es, und nicht jedes teure Monoprotein-Futter ist wirklich besser. Was die Wissenschaft sagt und wann du wechseln solltest.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/futtertyp/monoprotein" className="px-4 py-2 rounded-2xl bg-purple-500/15 text-purple-300 text-sm font-medium hover:bg-purple-500/25 transition-colors">→ Monoprotein-Futter im Katalog</Link>
          <Link href="/problem/allergie" className="px-4 py-2 rounded-2xl bg-red-500/15 text-red-300 text-sm font-medium hover:bg-red-500/25 transition-colors">→ Hundefutter bei Allergie</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 border border-white/10 bg-white/5 font-bold">Kriterium</th>
                <th className="text-left p-4 border border-white/10 bg-purple-500/10 font-bold text-purple-300">Monoprotein</th>
                <th className="text-left p-4 border border-white/10 bg-amber-500/10 font-bold text-[var(--honey)]">Mehrkomponenten</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Proteinquellen", "1 Fleischquelle", "2–5+ Fleischquellen"],
                ["Allergen-Kontrolle", "sehr hoch", "niedrig bis mittel"],
                ["Aminosäure-Profil", "eingeschränkter", "breiter, ausgeglichener"],
                ["Geeignet für Ausschlussdiät", "ja (neue Quelle)", "nein"],
                ["Mikrobiomdiversität", "geringer", "höher"],
                ["Kosten", "20–50 % teurer", "günstiger"],
                ["Exotische Optionen", "Känguru, Strauß, Insekt…", "weniger relevant"],
                ["Langzeitrisiko Sensibilisierung", "geringer", "möglich bei viel Huhn/Rind"],
                ["Geeignet für gesunde Hunde", "ja, aber unnötig teuer", "optimal"],
                ["Geeignet für Allergiker", "optimal", "ungeeignet während Diät"],
              ].map(([k, m, me], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white/[0.02]" : ""}>
                  <td className="p-3 border border-white/10 font-medium text-[var(--muted)]">{k}</td>
                  <td className="p-3 border border-white/10">{m}</td>
                  <td className="p-3 border border-white/10">{me}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6 border border-purple-500/20">
            <h2 className="text-xl font-extrabold tracking-tight mb-4 text-purple-300">Monoprotein ist richtig wenn…</h2>
            <ul className="space-y-3">
              {[
                "…dein Hund eine bestätigte Futtermittelallergie hat",
                "…du eine Ausschlussdiät durchführst und alle Variablen kontrollieren musst",
                "…dein Hund auf alle gängigen Proteine (Huhn, Rind, Lamm) reagiert",
                "…du ein neues Protein einführen willst, das dein Hund noch nicht kennt",
                "…dein Tierarzt explizit Monoprotein empfohlen hat",
              ].map((p, i) => (
                <li key={i} className="flex gap-2 text-sm text-[var(--muted)]">
                  <span className="text-purple-400 shrink-0">✓</span>{p}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6 border border-amber-500/20">
            <h2 className="text-xl font-extrabold tracking-tight mb-4 text-[var(--honey)]">Mehrkomponenten ist besser wenn…</h2>
            <ul className="space-y-3">
              {[
                "…dein Hund keine nachgewiesene Allergie hat",
                "…du Abwechslung im Ernährungsplan willst",
                "…du auf ein breiteres Aminosäureprofil Wert legst",
                "…du ein gesünderes Mikrobiom durch Proteinvielfalt aufbauen willst",
                "…du Kosten sparen möchtest ohne Qualitätseinbußen",
              ].map((p, i) => (
                <li key={i} className="flex gap-2 text-sm text-[var(--muted)]">
                  <span className="text-amber-400 shrink-0">✓</span>{p}
                </li>
              ))}
            </ul>
          </div>
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
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">BELLA findet das richtige Protein für deinen Hund</h2>
          <p className="text-[var(--muted)] mb-6">Allergie, sensibler Magen oder einfach das beste Futter — BELLA filtert aus 11.000+ Sorten genau das, was zu deinem Hund passt.</p>
          <Link href="/#bella-advisor" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all">
            🐕 Jetzt Futter finden
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-10">
        <h2 className="text-xl font-extrabold tracking-tight mb-4">Weitere Vergleiche</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/vergleich/barf-vs-trockenfutter" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">BARF vs. Trockenfutter</Link>
          <Link href="/vergleich/getreidefrei-vs-mit-getreide" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">Getreidefrei vs. Mit Getreide</Link>
          <Link href="/vergleich/premium-vs-budget" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">Premium vs. Budget</Link>
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
