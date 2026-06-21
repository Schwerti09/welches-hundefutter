import type { Metadata } from "next";
import Link from "next/link";
import AuthorBox from "@/components/AuthorBox";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";
import VergleichHeroImage from "@/components/VergleichHeroImage";
import UmstellungsPlaner from "@/components/tools/UmstellungsPlaner";

export const metadata: Metadata = {
  title: "Insektenfutter vs. Hühnchen für Hunde 2026: Wann Insekt sinnvoller ist",
  description: "Insektenprotein als Hundefutter: Nachhaltiger als Hühnchen, hypoallergen, vollwertig. Aber auch teurer und für wen geeignet? Ehrlicher Vergleich.",
  alternates: {
    canonical: "https://welches-hundefutter.today/vergleich/insektenfutter-vs-huehnchen",
    languages: {
      "de-DE": "https://welches-hundefutter.today/vergleich/insektenfutter-vs-huehnchen",
      "de-AT": "https://welches-hundefutter.today/vergleich/insektenfutter-vs-huehnchen",
      "de-CH": "https://welches-hundefutter.today/vergleich/insektenfutter-vs-huehnchen",
      "x-default": "https://welches-hundefutter.today/vergleich/insektenfutter-vs-huehnchen",
    },
  },
};

const faqItems = [
  {
    question: "Können Hunde Insekten verdauen?",
    answer: "Ja, sehr gut sogar. Insektenprotein hat eine Verdaulichkeit von 87–92 % — ähnlich wie Hühnerfleischmehl. Die Aminosäurezusammensetzung ist vollständig und deckt den Bedarf von Hunden optimal ab.",
  },
  {
    question: "Ist Insektenfutter hypoallergen?",
    answer: "Ja, für Hunde, die noch nie Insekten gefressen haben. Insektenprotein (meist aus der Schwarzen Soldatenfliege) ist eine neuartige Proteinquelle, auf die das Immunsystem von Allergikern noch nicht sensibilisiert wurde.",
  },
  {
    question: "Wie nachhaltig ist Insektenfutter wirklich?",
    answer: "Deutlich nachhaltiger als Hühnchen: 96 % weniger Treibhausgase, 90 % weniger Wasser, 90 % weniger Land. Die Larven der Schwarzen Soldatenfliege wachsen auf organischen Restsubstraten — ein echter Kreislauf.",
  },
  {
    question: "Ist Insektenfutter teurer?",
    answer: "Ja, ca. 30–60 % teurer als vergleichbares Hühnchen-Futter. Die Produktionskosten für Insektenzucht sind noch hoch, sinken aber mit zunehmender Skalierung.",
  },
];

export default function InsektenfutterVsHuehnchen() {
  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData
        type="article"
        article={{
          headline: "Insektenfutter vs. Hühnchen für Hunde 2026",
          description: "Nachhaltiger, hypoallergen, vollwertig — aber für wen ist Insektenprotein wirklich sinnvoll?",
          url: "https://welches-hundefutter.today/vergleich/insektenfutter-vs-huehnchen",
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
        <span className="text-[var(--ink)]">Insektenfutter vs. Hühnchen</span>
      </nav>

      <VergleichHeroImage slug="insektenfutter-vs-huehnchen" alt="Insektenfutter vs. Hühnchen als Proteinquelle im Hundefutter" />

      <section className="hero-glow max-w-5xl mx-auto w-full px-5 pt-8 pb-14">
        <span className="pill mb-4">⚖️ Direktvergleich</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
          Insektenfutter vs. Hühnchen: Die Zukunft des Hundefutters?
        </h1>
        <p className="bella-answer text-[var(--muted)] leading-relaxed max-w-2xl mb-6">
          Insektenprotein ist kein Trend — es ist die logische Antwort auf Allergien, Nachhaltigkeit und Ressourcenknappheit. Was Hühnchen kann und was Insekten besser können.
        </p>
        <Link href="/futtertyp/insekten" className="px-4 py-2 rounded-2xl bg-lime-500/15 text-lime-300 text-sm font-medium hover:bg-lime-500/25 transition-colors inline-block">→ Insektenfutter im Katalog</Link>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 border border-white/10 bg-white/5 font-bold">Kriterium</th>
                <th className="text-left p-4 border border-white/10 bg-lime-500/10 font-bold text-lime-300">Insektenprotein</th>
                <th className="text-left p-4 border border-white/10 bg-amber-500/10 font-bold text-[var(--honey)]">Hühnchen</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Verdaulichkeit", "87–92 %", "85–91 %"],
                ["Proteingehalt", "60–70 % (TM)", "55–68 % (TM)"],
                ["Aminosäureprofil", "vollständig", "vollständig"],
                ["Allergen-Status", "neuartig (hypoallergen)", "häufiges Allergen"],
                ["CO₂-Fußabdruck", "96 % weniger als Rind", "80 % mehr als Insekt"],
                ["Wasserverbrauch", "90 % weniger", "deutlich höher"],
                ["Preis", "30–60 % teurer", "günstiger"],
                ["Verfügbarkeit im Katalog", "steigend", "sehr hoch"],
                ["Geeignet für Allergiker", "ideal", "bei Hühnchenallergie nein"],
                ["Akzeptanz Hund", "gut bis sehr gut", "sehr hoch"],
                ["Omega-Fettsäuren", "gut (Laurinsäure)", "gut (Linolsäure)"],
                ["Lizenz in der EU", "seit 2021 offiziell erlaubt", "immer erlaubt"],
              ].map(([k, ins, hue], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white/[0.02]" : ""}>
                  <td className="p-3 border border-white/10 font-medium text-[var(--muted)]">{k}</td>
                  <td className="p-3 border border-white/10">{ins}</td>
                  <td className="p-3 border border-white/10">{hue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6 border border-lime-500/20">
            <h2 className="text-xl font-extrabold tracking-tight mb-4 text-lime-300">Insektenfutter ist besser wenn…</h2>
            <ul className="space-y-3">
              {[
                "…dein Hund auf Hühnchen, Rind oder andere gängige Proteine allergisch reagiert",
                "…du eine Ausschlussdiät mit noch nie gegessenen Proteinen durchführen willst",
                "…Nachhaltigkeit für dich ein wichtiges Kaufkriterium ist",
                "…dein Hund viele Proteine ausprobiert hat und du eine echte Neualternative brauchst",
                "…du experimentierfreudig bist und Innovationen im Hundefutter interessieren",
              ].map((p, i) => (
                <li key={i} className="flex gap-2 text-sm text-[var(--muted)]">
                  <span className="text-lime-400 shrink-0">✓</span>{p}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6 border border-amber-500/20">
            <h2 className="text-xl font-extrabold tracking-tight mb-4 text-[var(--honey)]">Hühnchen-Futter ist besser wenn…</h2>
            <ul className="space-y-3">
              {[
                "…dein Hund keine Hühnchenallergie hat und das Futter gut verträgt",
                "…du auf bewährtes Futter mit langer Forschungsbasis setzt",
                "…das Budget begrenzt ist und Insektenfutter zu teuer wäre",
                "…dein Hund Insektenfutter ablehnt (selten, aber möglich)",
                "…du eine breite Auswahl an Sorten und Marken benötigst",
              ].map((p, i) => (
                <li key={i} className="flex gap-2 text-sm text-[var(--muted)]">
                  <span className="text-amber-400 shrink-0">✓</span>{p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-12">
        <div className="card p-6">
          <h2 className="text-xl font-extrabold tracking-tight mb-4">Die Wissenschaft: Was sagen Studien?</h2>
          <p className="text-[var(--muted)] mb-4 leading-relaxed">
            Mehrere Studien (u. a. Vale et al. 2023, Dodd et al. 2022) zeigen, dass Insektenprotein in Hundefutter vollständig verdaulich ist und keine Mängel verursacht. Hunde fressen Insektenfutter mit derselben Akzeptanz wie konventionelles Fleisch.
          </p>
          <p className="text-[var(--muted)] leading-relaxed">
            Wichtig: Die Studienbasierung ist noch jünger als bei Hühnchen-Futter. Langzeitdaten über 10+ Jahre fehlen noch. Für gesunde Hunde ohne Allergie ist Hühnchen-Futter mit mehr Forschungshistorie die konservativere Wahl.
          </p>
          <Link href="/studien" className="text-sm text-[var(--honey)] hover:underline mt-3 inline-block">Studien-Datenbank ansehen →</Link>
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
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">BELLA findet die beste Proteinquelle für deinen Hund</h2>
          <p className="text-[var(--muted)] mb-6">Allergien, Nachhaltigkeit oder einfach das Beste für deinen Hund — BELLA filtert aus 11.000+ Sorten die passende Option.</p>
          <Link href="/#bella-advisor" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all">
            🐕 Jetzt Futter finden
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-10">
        <h2 className="text-xl font-extrabold tracking-tight mb-4">Weitere Vergleiche</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/vergleich/monoprotein-vs-mehrkomponenten" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">Monoprotein vs. Mehrkomponenten</Link>
          <Link href="/vergleich/barf-vs-trockenfutter" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">BARF vs. Trockenfutter</Link>
          <Link href="/vergleich/premium-vs-budget" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">Premium vs. Budget</Link>
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
