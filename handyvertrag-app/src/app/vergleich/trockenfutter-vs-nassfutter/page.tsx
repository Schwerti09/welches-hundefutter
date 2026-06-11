import type { Metadata } from "next";
import Link from "next/link";
import AuthorBox from "@/components/AuthorBox";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Trockenfutter vs. Nassfutter: Der ehrliche Vergleich 2026 | BELLA",
  description: "Was ist besser für deinen Hund – Trocken- oder Nassfutter? Kosten, Nährwerte, Zahngesundheit, Sättigung und Praxis im Direktvergleich. Ohne Herstellermeinungen.",
  alternates: {
    canonical: "https://welches-hundefutter.today/vergleich/trockenfutter-vs-nassfutter",
    languages: {
      "de-DE": "https://welches-hundefutter.today/vergleich/trockenfutter-vs-nassfutter",
      "de-AT": "https://welches-hundefutter.today/vergleich/trockenfutter-vs-nassfutter",
      "de-CH": "https://welches-hundefutter.today/vergleich/trockenfutter-vs-nassfutter",
      "x-default": "https://welches-hundefutter.today/vergleich/trockenfutter-vs-nassfutter",
    },
  },
  openGraph: {
    title: "Trockenfutter vs. Nassfutter 2026 – Was ist besser für deinen Hund?",
    description: "Kosten, Nährwerte, Zähne, Sättigung im direkten Vergleich. Datenbasiert, ohne Hersteller-Bias.",
  },
};

const faqItems = [
  {
    question: "Was ist besser – Trockenfutter oder Nassfutter für Hunde?",
    answer: "Es gibt kein universelles Besser. Nassfutter ist günstiger in der Trockenmasse-Kalkulation und sättigender durch den Wasseranteil – gut für übergewichtige Hunde. Trockenfutter ist kostengünstiger pro Mahlzeit, fördert die Zahngesundheit und ist einfacher zu lagern. Optimal: Kombination aus beiden.",
  },
  {
    question: "Wie viel Nassfutter entspricht wie viel Trockenfutter?",
    answer: "Faustformel: 1 Teil Trockenfutter ≈ 3–4 Teile Nassfutter (nach Gewicht). Ein Hund der 200 g Trockenfutter pro Tag braucht, bräuchte ca. 600–800 g Nassfutter. Grund: Nassfutter besteht zu 75–80 % aus Wasser.",
  },
  {
    question: "Reinigt Trockenfutter wirklich die Zähne?",
    answer: "Nur begrenzt. Trockenfutter-Brocken brechen beim Kauen in Stücke, die kaum nennenswerte mechanische Reinigung durchführen. Speziell geformte Dental-Kroketten (Hill's Dental, Royal Canin Dental) haben nachgewiesene Wirkung. Beste Zahnpflege: tägliches Zähneputzen.",
  },
  {
    question: "Ist Nassfutter teurer als Trockenfutter?",
    answer: "Verglichen nach Trockenmasse: Nassfutter ist oft teurer. Verglichen nach Kaufpreis pro kg: Nassfutter ist oft günstiger. Ein fairer Vergleich rechnet in €/1000 kcal – dann liegen gutes Trockenfutter und gutes Nassfutter ähnlich.",
  },
];

const PROS_TROCKEN = [
  "Günstigerer Kaufpreis pro Kilogramm",
  "Einfache Lagerung, lange Haltbarkeit",
  "Fördert mechanische Kaureinigung",
  "Einfach zu dosieren und zu portionieren",
  "Gut für unterwegs und Reisen",
];
const CONS_TROCKEN = [
  "Geringerer Wasseranteil (~10 %) – Hunde trinken oft zu wenig",
  "Höhere Verarbeitungstemperatur (120–180°C) beim Extrudieren",
  "Oft mehr Kohlenhydrate als notwendig",
  "Nicht ideal für Hunde die wenig trinken oder Nierenpatienten",
];
const PROS_NASS = [
  "Hoher Wasseranteil (75–80 %) – gut für Nieren und Harnwege",
  "Schmackhafter – ideal für wählerische oder kranke Hunde",
  "Niedrigere Verarbeitungstemperatur erhält mehr Nährstoffe",
  "Mehr Sättigungseffekt bei gleicher Kalorienmenge",
  "Geringerer Kohlenhydratanteil",
];
const CONS_NASS = [
  "Nach dem Öffnen nur 2–3 Tage haltbar",
  "Teurer nach Trockenmasse gerechnet",
  "Weniger Kauaufwand – kein Beitrag zur Zahnreinigung",
  "Schwieriger zu lagern und zu transportieren",
];

export default function VergleichTrockenNassPage() {
  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData
        type="article"
        article={{
          headline: "Trockenfutter vs. Nassfutter: Der ehrliche Vergleich 2026",
          description: "Was ist besser für deinen Hund – Trocken- oder Nassfutter? Kosten, Nährwerte, Zahngesundheit, Sättigung und Praxis im Direktvergleich. Ohne Herstellermeinungen.",
          url: "https://welches-hundefutter.today/vergleich/trockenfutter-vs-nassfutter",
          dateModified: "2026-06-06",
          speakableSelectors: ["h1", ".bella-answer"],
        }}
      />
      <StructuredData type="faq" faqs={faqItems} />

      <nav className="max-w-5xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <Link href="/faq" className="hover:text-[var(--honey)]">Ratgeber</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">Trockenfutter vs. Nassfutter</span>
      </nav>

      <section className="hero-glow max-w-5xl mx-auto w-full px-5 pt-8 pb-14">
        <span className="pill mb-4">⚖️ Direktvergleich</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
          Trockenfutter vs. Nassfutter: Was ist besser für deinen Hund?
        </h1>
        <p className="bella-answer text-[var(--muted)] leading-relaxed max-w-2xl mb-6">
          Kein Marketing, keine Hersteller-Meinungen. Nur die Fakten — basierend auf
          Nährwertdaten, Kosten aus unserem Live-Katalog und veterinärmedizinischer Evidenz.
        </p>
      </section>

      {/* Head-to-head overview */}
      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 border border-white/10 bg-white/5 font-bold">Kriterium</th>
                <th className="text-left p-4 border border-white/10 bg-amber-500/10 font-bold text-[var(--honey)]">Trockenfutter</th>
                <th className="text-left p-4 border border-white/10 bg-blue-500/10 font-bold text-blue-300">Nassfutter</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Wasseranteil", "~10 %", "75–80 %"],
                ["Kosten (Kaufpreis/kg)", "3–15 €/kg", "1–8 €/kg"],
                ["Kosten (Trockenmasse)", "gut", "teurer"],
                ["Kosten (pro 1.000 kcal)", "ca. 1,50–4,00 €", "ca. 1,80–5,00 €"],
                ["Protein-Anteil", "25–35 % TM", "50–70 % TM"],
                ["Kohlenhydrate", "30–50 %", "5–20 %"],
                ["Haltbarkeit geöffnet", "Wochen bis Monate", "2–3 Tage im Kühlschrank"],
                ["Zahnreinigung", "gering (außer Dental-Sorten)", "keine"],
                ["Sättigungseffekt", "mittel", "hoch"],
                ["Nieren-freundlichkeit", "nur wenn ausreichend trinken", "von Natur aus gut"],
                ["Verarbeitungstemperatur", "120–180°C (Extrusion)", "meist 80–100°C"],
                ["Reiseeignung", "sehr gut", "eingeschränkt"],
              ].map(([k, t, n], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white/[0.02]" : ""}>
                  <td className="p-3 border border-white/10 font-medium text-[var(--muted)]">{k}</td>
                  <td className="p-3 border border-white/10">{t}</td>
                  <td className="p-3 border border-white/10">{n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pros/Cons */}
      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-xl font-extrabold tracking-tight mb-5 text-[var(--honey)]">Trockenfutter</h2>
            <div className="mb-5">
              <h3 className="text-sm font-bold text-emerald-300 mb-3">Vorteile</h3>
              <ul className="space-y-2">
                {PROS_TROCKEN.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-300 mb-3">Nachteile</h3>
              <ul className="space-y-2">
                {CONS_TROCKEN.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                    <span className="text-rose-400 mt-0.5 shrink-0">✕</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-extrabold tracking-tight mb-5 text-blue-300">Nassfutter</h2>
            <div className="mb-5">
              <h3 className="text-sm font-bold text-emerald-300 mb-3">Vorteile</h3>
              <ul className="space-y-2">
                {PROS_NASS.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-300 mb-3">Nachteile</h3>
              <ul className="space-y-2">
                {CONS_NASS.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                    <span className="text-rose-400 mt-0.5 shrink-0">✕</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Wann welches */}
      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <h2 className="text-2xl font-extrabold tracking-tight mb-6">Wann welches Futter sinnvoll ist</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: "Trockenfutter empfohlen wenn…",
              color: "border-[var(--honey)]/30",
              items: [
                "…dein Hund viel trinkt und keine Nierenprobleme hat",
                "…du unterwegs bist oder reist",
                "…du ein enges Budget hast (günstiger pro Mahlzeit)",
                "…dein Hund schnell frisst und Kauaufwand braucht",
                "…du Mehrportionen-Fütterung planst ohne Kühlung",
              ],
            },
            {
              title: "Nassfutter empfohlen wenn…",
              color: "border-blue-400/30",
              items: [
                "…dein Hund wenig trinkt oder Nierenpatienten ist",
                "…dein Hund übergewichtig ist (mehr Sättigung, weniger Kalorien)",
                "…dein Hund wählerisch ist oder schlecht frisst",
                "…du maximale Fleischdichte pro Mahlzeit möchtest",
                "…dein Hund Zahnprobleme hat und Kauen schmerzhaft ist",
              ],
            },
          ].map(({ title, color, items }) => (
            <div key={title} className={`card p-6 border ${color}`}>
              <h3 className="font-bold text-sm mb-4">{title}</h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item} className="text-sm text-[var(--muted)] flex items-start gap-2">
                    <span className="shrink-0 mt-0.5">→</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Die beste Lösung */}
      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <div className="card p-8">
          <h2 className="text-xl font-extrabold tracking-tight mb-4">Unsere Empfehlung: Mischfütterung</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
            Für die meisten Hunde ist die Kombination optimal: Morgens Trockenfutter für den Kauaufwand
            und einfache Lagerung, abends Nassfutter für Feuchtigkeit und Palatabilität. Der Flüssigkeitsbedarf
            wird tagsüber durch das Nassfutter besser gedeckt, abends schläft der Hund mit einem gut gefüllten,
            sättigenden Magen.
          </p>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            Wichtig bei Mischfütterung: Gesamtkalorien im Auge behalten. Beide Futtersorten haben
            unterschiedliche Energiedichten – BELLA rechnet das automatisch wenn du Rasse, Gewicht und Aktivität eingibst.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <h2 className="text-2xl font-extrabold tracking-tight mb-6">Häufige Fragen</h2>
        <div className="space-y-3">
          {faqItems.map((faq) => (
            <details key={faq.question} className="card group">
              <summary className="flex justify-between items-start cursor-pointer list-none p-5 gap-3">
                <h3 className="font-semibold text-sm leading-snug pr-2">{faq.question}</h3>
                <span className="text-[var(--muted)] mt-0.5 shrink-0 text-xs group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="px-5 pb-5 text-sm text-[var(--muted)] leading-relaxed border-t border-white/5 pt-3">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto w-full px-5 pb-12 text-center">
        <div className="rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 p-8">
          <h2 className="text-xl font-extrabold tracking-tight mb-3">
            BELLA empfiehlt die beste Mischung für deinen Hund
          </h2>
          <p className="text-[var(--muted)] text-sm mb-5 max-w-md mx-auto">
            In 60 Sekunden — basierend auf Rasse, Alter, Gewicht und Gesundheitsthemen deines Hundes.
          </p>
          <Link href="/#bella-advisor" className="btn-primary">BELLA fragen →</Link>
        </div>
      </section>

      {/* Weitere Vergleiche */}
      <section className="max-w-5xl mx-auto w-full px-5 pb-10">
        <h3 className="text-lg font-bold mb-4">Weitere Vergleiche</h3>
        <div className="flex flex-wrap gap-2">
          <Link href="/vergleich/barf-vs-trockenfutter"
            className="text-sm px-4 py-2 rounded-xl border border-white/10 text-[var(--muted)] hover:text-white hover:border-orange-500/40 transition-colors">
            BARF vs. Trockenfutter →
          </Link>
          <Link href="/futtertyp/trockenfutter"
            className="text-sm px-4 py-2 rounded-xl border border-white/10 text-[var(--muted)] hover:text-white hover:border-orange-500/40 transition-colors">
            Trockenfutter Ratgeber →
          </Link>
          <Link href="/futtertyp/nassfutter"
            className="text-sm px-4 py-2 rounded-xl border border-white/10 text-[var(--muted)] hover:text-white hover:border-orange-500/40 transition-colors">
            Nassfutter Ratgeber →
          </Link>
        </div>
      </section>

      <AuthorBox reviewedAt="2026-06-06" />
      <SiteFooter />
    </div>
  );
}
