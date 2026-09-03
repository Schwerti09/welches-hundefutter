import type { Metadata } from "next";
import Link from "next/link";
import AuthorBox from "@/components/AuthorBox";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";
import VergleichHeroImage from "@/components/VergleichHeroImage";
import UmstellungsPlaner from "@/components/tools/UmstellungsPlaner";

export const metadata: Metadata = {
  title: "Nassfutter vs. BARF 2026: Was ist besser für deinen Hund?",
  description: "Nassfutter oder BARF — was ist nährstoffreicher, günstiger und praktischer? Ehrlicher Vergleich auf Basis von 11.000+ Produkten und aktueller Forschung.",
  alternates: {
    canonical: "https://welches-hundefutter.today/vergleich/nassfutter-vs-barf",
    languages: {
      "de-DE": "https://welches-hundefutter.today/vergleich/nassfutter-vs-barf",
      "de-AT": "https://welches-hundefutter.today/vergleich/nassfutter-vs-barf",
      "de-CH": "https://welches-hundefutter.today/vergleich/nassfutter-vs-barf",
      "x-default": "https://welches-hundefutter.today/vergleich/nassfutter-vs-barf",
    },
  },
};

const faqItems = [
  {
    question: "Ist BARF nahrhafter als Nassfutter?",
    answer: "Korrekt zusammengestelltes BARF kann sehr nährstoffreich sein, erfordert aber tiefes Wissen. Hochwertiges Nassfutter (z. B. Menü-Futter mit 70–80 % Fleisch) liefert für die meisten Hunde eine sichere, vollwertige Versorgung ohne das Fehlrisiko von selbst gemischtem BARF.",
  },
  {
    question: "Was kostet BARF im Vergleich zu Nassfutter?",
    answer: "Nassfutter kostet für einen 20-kg-Hund ca. 50–150 €/Monat je nach Qualität. Selbst gemischtes BARF liegt bei 60–120 €/Monat. Der Preisunterschied ist gering — hochwertiges Nassfutter kann sogar günstiger als BARF vom Metzger sein.",
  },
  {
    question: "Kann ich Nassfutter und BARF kombinieren?",
    answer: "Grundsätzlich ja. Wichtig: BARF wird schneller verdaut. Separate Mahlzeiten (morgens Nassfutter, abends BARF) sind besser als Mischungen in einer Schüssel.",
  },
  {
    question: "Für wen ist BARF geeignet und für wen Nassfutter?",
    answer: "BARF eignet sich für Hundehalter mit Zeit, Wissen und Kühlschrank-Kapazität. Nassfutter ist für alle geeignet — besonders für Hunde mit wenig Trinkmotivation, Senioren und Welpen, die viel Feuchtigkeit brauchen.",
  },
];

export default function NassfutterVsBarf() {
  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData
        type="article"
        article={{
          headline: "Nassfutter vs. BARF: Direktvergleich 2026",
          description: "Nassfutter oder BARF — ehrlicher Vergleich auf Basis echter Daten.",
          url: "https://welches-hundefutter.today/vergleich/nassfutter-vs-barf",
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
        <span className="text-[var(--ink)]">Nassfutter vs. BARF</span>
      </nav>

      <VergleichHeroImage slug="nassfutter-vs-barf" alt="Nassfutter vs. BARF – Vergleich Hundefutter" />

      <section className="hero-glow max-w-5xl mx-auto w-full px-5 pt-8 pb-14">
        <span className="pill mb-4">⚖️ Direktvergleich</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
          Nassfutter vs. BARF: Was ist wirklich besser?
        </h1>
        <p className="bella-answer text-[var(--muted)] leading-relaxed max-w-2xl mb-6">
          Beide sind fleischbetont, feuchtigkeitsreich und gelten als artgerecht — aber die Unterschiede beim Aufwand, Risiko und Kosten sind erheblich. Ein ehrlicher Vergleich ohne Marketing-Sprech.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/futtertyp/nassfutter" className="px-4 py-2 rounded-2xl bg-blue-500/15 text-blue-300 text-sm font-medium hover:bg-blue-500/25 transition-colors">→ Nassfutter erkunden</Link>
          <Link href="/futtertyp/barf" className="px-4 py-2 rounded-2xl bg-rose-500/15 text-rose-300 text-sm font-medium hover:bg-rose-500/25 transition-colors">→ BARF erkunden</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 border border-white/10 bg-white/5 font-bold">Kriterium</th>
                <th className="text-left p-4 border border-white/10 bg-blue-500/10 font-bold text-blue-300">Nassfutter</th>
                <th className="text-left p-4 border border-white/10 bg-rose-500/10 font-bold text-rose-300">BARF</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Wasseranteil", "70–85 %", "60–70 %"],
                ["Verarbeitung", "Pasteurisiert / gegart", "Roh, unverarbeitet"],
                ["Proteingehalt (TM)", "50–70 %", "55–75 %"],
                ["Kosten/Monat (20 kg Hund)", "50–150 €", "60–120 €"],
                ["Zeitaufwand täglich", "1–2 Minuten", "10–20 Minuten"],
                ["Risiko Fehlversorgung", "niedrig (vollwertig)", "hoch (ohne Wissen)"],
                ["Keimbelastung", "sehr niedrig", "gering bis mittel"],
                ["Allergiekontrolle", "gut (Monoprotein)", "sehr gut (full control)"],
                ["Reiseeignung", "gut (Konserve/Pouch)", "schlecht (Kühlung nötig)"],
                ["Zahngesundheit", "neutral", "gut (Fleisch, Knochen)"],
                ["Trinkmotivation", "hoch durch Feuchte", "hoch durch Feuchte"],
                ["Geeignet für Welpen", "ja (wenn altersgerecht)", "nur mit Experten-Begleitung"],
              ].map(([k, n, b], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white/[0.02]" : ""}>
                  <td className="p-3 border border-white/10 font-medium text-[var(--muted)]">{k}</td>
                  <td className="p-3 border border-white/10">{n}</td>
                  <td className="p-3 border border-white/10">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6 border border-blue-500/20">
            <h2 className="text-xl font-extrabold tracking-tight mb-5 text-blue-300">Nassfutter ist besser wenn…</h2>
            <ul className="space-y-3">
              {[
                "…dein Hund wenig trinkt (Nieren, Harnwege)",
                "…du wenig Zeit für die Futterorganisation hast",
                "…Welpen oder Senioren mit empfindlichem Kiefer versorgt werden",
                "…du auf Reisen bist (Dosen/Pouches halten ohne Kühlung)",
                "…du kein BARF-Wissen aufbauen willst aber trotzdem viel Fleisch geben möchtest",
              ].map((p, i) => (
                <li key={i} className="flex gap-2 text-sm text-[var(--muted)]">
                  <span className="text-blue-400 shrink-0">✓</span>{p}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6 border border-rose-500/20">
            <h2 className="text-xl font-extrabold tracking-tight mb-5 text-rose-300">BARF ist besser wenn…</h2>
            <ul className="space-y-3">
              {[
                "…dein Hund eine bestätigte Allergie hat und du jede Zutat kontrollieren willst",
                "…du selbst Wissen über Hundeernährung aufbauen möchtest",
                "…du Kontakt zu Metzgereien oder Landwirten hast",
                "…dein Hund Fertigfutter generell schlecht verträgt",
                "…du Abwechslung durch saisonale Rohkomponenten bieten willst",
              ].map((p, i) => (
                <li key={i} className="flex gap-2 text-sm text-[var(--muted)]">
                  <span className="text-rose-400 shrink-0">✓</span>{p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <div className="card p-6">
          <h2 className="text-2xl font-extrabold tracking-tight mb-4">Das wichtigste Argument: Sicherheit</h2>
          <p className="text-[var(--muted)] mb-4 leading-relaxed">
            Der entscheidende Unterschied zwischen Nassfutter und BARF ist nicht der Nährstoffgehalt — sondern das Fehlerrisiko. Hochwertiges Nassfutter ist so formuliert, dass ein durchschnittlicher Hundehalter seinen Hund dauerhaft vollwertig versorgen kann, ohne Ernährungsexpertise.
          </p>
          <p className="text-[var(--muted)] mb-4 leading-relaxed">
            BARF hingegen erfordert fundiertes Wissen über Mineralstoffe, Vitamine, das Calcium-Phosphor-Verhältnis und den Aufbau einer ausgewogenen Wochenration. Fehler passieren — und sie können langfristige Mangelerscheinungen verursachen, die sich erst nach Monaten zeigen.
          </p>
          <p className="text-[var(--muted)] leading-relaxed">
            Für Hunde mit bestimmten Erkrankungen (Nierenprobleme, Pankreatitis, Diabetes) ist der direkte Vergleich noch wichtiger: Dort gelten spezifische Nährstoffgrenzen, die im Fertigfutter bereits eingehalten werden — im selbst gemischten BARF muss man sie selbst berechnen.
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
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">BELLA fragt 5 Dinge — du bekommst das passende Futter</h2>
          <p className="text-[var(--muted)] mb-6">Egal ob Nassfutter oder BARF-Basis: BELLA kennt alle Futterarten und findet aus 11.000+ Sorten das richtige für genau deinen Hund.</p>
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
          <Link href="/vergleich/kaltgepresst-vs-extrudiert" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">Kaltgepresst vs. Extrudiert</Link>
          <Link href="/vergleich/monoprotein-vs-mehrkomponenten" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">Monoprotein vs. Mehrkomponenten</Link>
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
