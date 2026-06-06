import type { Metadata } from "next";
import Link from "next/link";
import AuthorBox from "@/components/AuthorBox";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "BARF vs. Trockenfutter: Direktvergleich 2026 | BELLA",
  description: "BARF oder Trockenfutter? Kosten, Nährwerte, Aufwand, Risiken und Nutzen ehrlich verglichen. Für welche Hunde und Halter ist welche Methode geeignet?",
  alternates: { canonical: "https://welches-hundefutter.today/vergleich/barf-vs-trockenfutter" },
};

const faqItems = [
  {
    question: "Ist BARF gesünder als Trockenfutter?",
    answer: "Korrekt zusammengestelltes BARF kann sehr gesund sein. Falsch gemacht führt es zu Mängeln. Hochwertiges Trockenfutter von seriösen Herstellern ist für die meisten Hunde sicher und ausreichend. Ein Qualitäts-Trockenfutter ist in der Praxis sicherer als selbst gemischtes BARF für Einsteiger.",
  },
  {
    question: "Was kostet BARF im Vergleich zu Trockenfutter?",
    answer: "Selbst gemischtes BARF kostet für einen 20-kg-Hund ca. 60–120 €/Monat. Gutes Premium-Trockenfutter kostet ca. 50–100 €/Monat für denselben Hund. Der Preisunterschied ist geringer als oft angenommen – BARF spart nur wenn man direkten Metzger-Kontakt hat.",
  },
  {
    question: "Kann ich Trockenfutter und BARF mischen?",
    answer: "Ja, aber mit Überlegung. Die Verdauungsgeschwindigkeit unterscheidet sich: BARF wird schneller verdaut als Trockenfutter. Am besten separate Mahlzeiten (morgens Trocken, abends BARF) statt in derselben Portion mischen. So vermeidest du Verdauungsprobleme.",
  },
  {
    question: "Für welche Hunde ist BARF besonders geeignet?",
    answer: "BARF eignet sich besonders für Hunde mit Futtermittelallergien (kontrollierte Einzelproteine), Hunde mit Fertigfutter-Unverträglichkeiten, sehr aktive Arbeitshunde und Hunde deren Besitzer Zeit und Interesse für die Ernährung mitbringen.",
  },
];

export default function VergleichBarfTrockenPage() {
  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData type="faq" faqs={faqItems} />

      <nav className="max-w-5xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <Link href="/faq" className="hover:text-[var(--honey)]">Ratgeber</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">BARF vs. Trockenfutter</span>
      </nav>

      <section className="hero-glow max-w-5xl mx-auto w-full px-5 pt-8 pb-14">
        <span className="pill mb-4">⚖️ Direktvergleich</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
          BARF vs. Trockenfutter: Was passt zu dir und deinem Hund?
        </h1>
        <p className="text-[var(--muted)] leading-relaxed max-w-2xl mb-6">
          BARF ist nicht für jeden — und Trockenfutter nicht per se schlechter. Hier vergleichen
          wir ehrlich: Kosten, Aufwand, Risiken, Nutzen.
        </p>
      </section>

      {/* Vergleichstabelle */}
      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 border border-white/10 bg-white/5 font-bold">Kriterium</th>
                <th className="text-left p-4 border border-white/10 bg-rose-500/10 font-bold text-rose-300">BARF</th>
                <th className="text-left p-4 border border-white/10 bg-amber-500/10 font-bold text-[var(--honey)]">Trockenfutter</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Verarbeitung", "Roh, minimal", "120–180°C extrudiert"],
                ["Wasseranteil", "60–70 %", "~10 %"],
                ["Protein (TM)", "55–70 %", "25–35 %"],
                ["Kohlenhydrate", "< 5 %", "30–50 %"],
                ["Kosten/Monat (20 kg Hund)", "60–120 €", "50–100 €"],
                ["Zeitaufwand täglich", "10–20 Minuten", "< 1 Minute"],
                ["Risiko Fehlversorgung", "hoch (ohne Wissen)", "niedrig (wenn Qualitätsfutter)"],
                ["Hygiene-Aufwand", "hoch", "minimal"],
                ["Allergiekontrolle", "sehr gut (einzelne Proteine)", "gut (Monoprotein-Sorten)"],
                ["Reiseeignung", "schlecht", "sehr gut"],
                ["Akzeptanz Hund", "sehr hoch", "hoch"],
                ["Stuhlfestigkeit", "Tendenziell fester", "normal bis variabel"],
              ].map(([k, b, t], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white/[0.02]" : ""}>
                  <td className="p-3 border border-white/10 font-medium text-[var(--muted)]">{k}</td>
                  <td className="p-3 border border-white/10">{b}</td>
                  <td className="p-3 border border-white/10">{t}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Wer ist BARF für? */}
      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6 border border-rose-500/20">
            <h2 className="text-xl font-extrabold tracking-tight mb-5 text-rose-300">BARF ist die richtige Wahl wenn…</h2>
            <ul className="space-y-3">
              {[
                "…du Zeit und Interesse an Hundeernährung mitbringst",
                "…dein Hund eine bestätigte Futterallergie hat und Monoprotein-Kontrolle brauchst",
                "…dein Hund Fertigfutter schlecht verträgt trotz mehrerer Versuche",
                "…du in der Nähe eines Metzgers oder Fleischgroßhändlers bist",
                "…du dir die Hygiene-Anforderungen im Haushalt leisten kannst",
                "…dein Hund sehr aktiv ist und hohe Protein/Fett-Dichte braucht",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                  <span className="text-rose-300 mt-0.5 shrink-0">→</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6 border border-[var(--honey)]/20">
            <h2 className="text-xl font-extrabold tracking-tight mb-5 text-[var(--honey)]">Trockenfutter ist sinnvoller wenn…</h2>
            <ul className="space-y-3">
              {[
                "…du wenig Zeit für Ernährungsvorbereitung hast",
                "…du viel reist oder unterwegs bist mit deinem Hund",
                "…Kleinkinder, Schwangere oder Immungeschwächte im Haushalt leben",
                "…du gerade erst mit Hundehaltung anfängst",
                "…dein Hund keinerlei Unverträglichkeiten zeigt",
                "…du das Risiko einer Fehlversorgung minimieren möchtest",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                  <span className="text-[var(--honey)] mt-0.5 shrink-0">→</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Die Misch-Option */}
      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <div className="card p-8">
          <h2 className="text-xl font-extrabold tracking-tight mb-4">Die dritte Option: Hybrid-Fütterung</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
            Viele erfahrene Hundehalter kombinieren beide Methoden: Morgens hochwertiges Trockenfutter
            (einfach, sicher, stabile Nährstoffbasis), abends BARF oder BARF-Fertigprodukte (tiefgekühlt).
          </p>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
            Vorteil: Du profitierst von der Einfachheit des Trockenfutters und der Rohfütterungs-Vorteile
            ohne das volle Risiko einer zu 100 % selbst kalkulierten BARF-Ration.
          </p>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            Wichtig: Separate Mahlzeiten statt Mischen in einer Portion — Rohfleisch und Trockenfutter
            haben unterschiedliche Verdauungsgeschwindigkeiten.
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
          <h2 className="text-xl font-extrabold tracking-tight mb-3">Was passt zu deinem Hund?</h2>
          <p className="text-[var(--muted)] text-sm mb-5 max-w-md mx-auto">
            BELLA berücksichtigt deinen Lifestyle und deinen Hund — und gibt dir eine konkrete Empfehlung.
          </p>
          <Link href="/#bella-advisor" className="btn-primary">BELLA fragen →</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-10">
        <h3 className="text-lg font-bold mb-4">Weitere Vergleiche & Ratgeber</h3>
        <div className="flex flex-wrap gap-2">
          <Link href="/vergleich/trockenfutter-vs-nassfutter"
            className="text-sm px-4 py-2 rounded-xl border border-white/10 text-[var(--muted)] hover:text-white hover:border-orange-500/40 transition-colors">
            Trockenfutter vs. Nassfutter →
          </Link>
          <Link href="/futtertyp/barf"
            className="text-sm px-4 py-2 rounded-xl border border-white/10 text-[var(--muted)] hover:text-white hover:border-orange-500/40 transition-colors">
            BARF Ratgeber →
          </Link>
          <Link href="/blog/barf-hund-anfaenger"
            className="text-sm px-4 py-2 rounded-xl border border-white/10 text-[var(--muted)] hover:text-white hover:border-orange-500/40 transition-colors">
            BARF für Anfänger →
          </Link>
        </div>
      </section>

      <AuthorBox reviewedAt="2026-06-06" />
      <SiteFooter />
    </div>
  );
}
