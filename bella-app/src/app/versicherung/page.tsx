import type { Metadata } from "next";
import Link from "next/link";
import AuthorBox from "@/components/AuthorBox";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";
import { CONTENT_REVISED } from "@/lib/site-dates";

export const metadata: Metadata = {
  title: "Hunde-Krankenversicherung Test 2026: Was sie wirklich kostet & wann sie sich lohnt",
  description: "Hunde-OP-Versicherung oder Krankenversicherung? Wir erklären den Unterschied, nennen typische Kosten und sagen dir, wann eine Hundekrankenversicherung sinnvoll ist — und wann nicht.",
  alternates: {
    canonical: "https://welches-hundefutter.today/versicherung",
    languages: {
      "de-DE": "https://welches-hundefutter.today/versicherung",
      "de-AT": "https://welches-hundefutter.today/versicherung",
      "de-CH": "https://welches-hundefutter.today/versicherung",
      "x-default": "https://welches-hundefutter.today/versicherung",
    },
  },
};

const faqItems = [
  {
    question: "Ist eine Hundekrankenversicherung sinnvoll?",
    answer: "Für viele Hunde ja — besonders für Rassen mit bekannten Erbkrankheiten (Labrador: Hüftdysplasie, Bulldogge: Atemwege, Dackel: Bandscheibenvorfall). Eine OP kann schnell 3.000–8.000 € kosten. Eine OP-Versicherung kostet je nach Rasse und Alter 15–60 €/Monat. Wenn dein Hund keine nennenswerten Vorerkrankungen hat, ist eine OP-Versicherung statistisch für etwa 60 % der Hunde ein gutes Investment.",
  },
  {
    question: "Was ist der Unterschied zwischen OP-Versicherung und Krankenversicherung?",
    answer: "Eine OP-Versicherung übernimmt nur die Kosten chirurgischer Eingriffe (Kastration, Tumor-OPs, Knochenbrüche etc.). Sie ist günstiger (15–40 €/Monat) und sinnvoll für die meisten Hunde. Eine Vollkrankenversicherung übernimmt zusätzlich Diagnosekosten, Medikamente und Behandlungen — sie kostet 40–120 €/Monat und lohnt sich besonders bei chronisch kranken Hunden oder Rassen mit hohem Behandlungsrisiko.",
  },
  {
    question: "Bis zu welchem Alter kann man einen Hund versichern?",
    answer: "Die meisten Anbieter nehmen Hunde bis zum 8. Lebensjahr neu auf — einzelne bis zum 10. Lebensjahr. Wichtig: Bei einem Senior-Hund steigen die Prämien, und bestehende Erkrankungen werden in der Regel ausgeschlossen. Wer seinen Hund früh (unter 4 Jahren) versichert, bekommt die günstigsten Konditionen ohne Wartezeiten.",
  },
  {
    question: "Was kostet eine Hunde-OP-Versicherung pro Monat?",
    answer: "Der Preis hängt von Rasse, Alter und gewähltem Anbieter ab. Als Richtwerte: Kleinhunde (bis 10 kg) zahlen 10–25 €/Monat, Mittelhunde 20–40 €/Monat, Großhunde 35–65 €/Monat. Höhere Deckungssummen (z. B. 4.000 statt 2.000 € pro Fall) kosten entsprechend mehr. Rassen mit bekannten Erbkrankheiten wie Bulldogge oder Dackel zahlen oft Aufschläge.",
  },
  {
    question: "Welche Hunderassen brauchen unbedingt eine Versicherung?",
    answer: "Rassen mit hohem OP-Risiko, für die eine Versicherung besonders empfehlenswert ist: Französische Bulldogge (BOAS-Chirurgie), Dackel (Bandscheibenvorfall, Neurochirurgie), Labrador / Golden Retriever (Hüft- und Ellbogendysplasie), Rottweiler (Knochen-Erkrankungen), Berner Sennenhund (Kreuz-Bandruptur, Krebs). Für diese Rassen zahlt sich eine Versicherung statistisch am häufigsten aus.",
  },
  {
    question: "Lohnt sich eine Versicherung für gesunde Mischlinge?",
    answer: "Mischlinge sind genetisch oft robuster als reinrassige Hunde — das statistische OP-Risiko ist niedriger. Trotzdem können auch Mischlinge Unfälle haben oder Tumore entwickeln. Für junge, gesunde Mischlinge ist eine OP-Versicherung mit Basisdeckung (1.500–2.000 €/Jahr) meist die sinnvollste und günstigste Absicherung.",
  },
];

const TIPPS = [
  { nr: "1", titel: "Früh abschließen", text: "Je jünger der Hund, desto günstiger die Prämie und desto weniger Vorerkrankungen werden ausgeschlossen. Idealer Zeitpunkt: nach der 1. Impfserie, vor dem 2. Geburtstag." },
  { nr: "2", titel: "OP-Versicherung vs. Vollschutz", text: "Für die meisten Hunde reicht eine reine OP-Versicherung. Vollschutz lohnt sich erst ab chronischen Erkrankungen oder Rassen mit sehr hohem Behandlungsrisiko." },
  { nr: "3", titel: "Wartezeiten beachten", text: "Die meisten Anbieter haben eine Wartezeit von 3 Monaten für Krankheiten — OPs nach Unfall sind oft sofort abgedeckt. Wichtig beim Vergleich." },
  { nr: "4", titel: "Deckungssumme wählen", text: "Mindestens 2.000 €/Fall für Kleinhunde, mindestens 4.000 € für Großhunde. OPs bei großen Rassen können 5.000–8.000 € kosten." },
  { nr: "5", titel: "Kastration & Zahnbehandlung prüfen", text: "Viele Basis-Tarife schließen elektive Eingriffe (Kastration) aus. Wer das einschließen will, muss gezielt danach filtern." },
  { nr: "6", titel: "Senior-Grenze beachten", text: "Viele Anbieter versichern keine Neukunden ab 8 Jahren. Für Senior-Hunde gilt: Bestandsversicherung ist gut, Neuabschluss wird schwierig." },
];

const ANBIETER = [
  { name: "Agila", st: "★★★★★", fokus: "Marktführer, breites Netz, Online-Schadenmeldung", tarif: "ab ~18 €/Monat", typ: "OP + Kranken" },
  { name: "Petplan", st: "★★★★☆", fokus: "Hohe Deckung, auch für chronische Erkrankungen geeignet", tarif: "ab ~22 €/Monat", typ: "OP + Kranken" },
  { name: "Allianz", st: "★★★★☆", fokus: "Bekannter Name, kombinierbar mit Haftpflicht", tarif: "ab ~20 €/Monat", typ: "OP + Kranken" },
  { name: "Hansemerkur", st: "★★★★☆", fokus: "Flexible Deckungssummen, schnelle Abwicklung", tarif: "ab ~16 €/Monat", typ: "OP-only & Vollschutz" },
];

export default function VersicherungPage() {
  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData type="faq" faqs={faqItems} />
      <StructuredData
        type="article"
        article={{
          headline: "Hunde-Krankenversicherung Test 2026: Was sie wirklich kostet & wann sie sich lohnt",
          description: "Hunde-OP-Versicherung vs. Vollkrankenversicherung — Kosten, Leistungen und wann es sich wirklich lohnt.",
          url: "https://welches-hundefutter.today/versicherung",
          dateModified: CONTENT_REVISED,
          speakableSelectors: ["h1", ".bella-answer"],
        }}
      />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: "Start", url: "https://welches-hundefutter.today/" },
          { name: "Hunde-Krankenversicherung", url: "https://welches-hundefutter.today/versicherung" },
        ]}
      />

      <nav className="max-w-4xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">Hunde-Krankenversicherung</span>
      </nav>

      {/* HERO */}
      <section className="hero-glow max-w-4xl mx-auto w-full px-5 pt-8 pb-12">
        <span className="pill mb-4">🛡️ Absicherung</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
          Hundekrankenversicherung:<br />wann sie sich lohnt
        </h1>
        <p className="bella-answer text-lg sm:text-xl font-semibold text-[var(--ink)] leading-snug max-w-2xl mb-4">
          Eine OP beim Hund kostet schnell 3.000–8.000 €. Wir erklären sachlich, für wen eine Versicherung
          Sinn macht — und für wen nicht.
        </p>
        <p className="text-[var(--muted)] text-sm max-w-xl">
          Kein Sponsoring durch Versicherer. Wir erhalten Provisionen wenn du über unsere Links
          einen Vertrag abschließt — das hat keinen Einfluss auf unsere Bewertung.
        </p>
      </section>

      {/* TYPEN-VERGLEICH */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <h2 className="text-2xl font-extrabold tracking-tight mb-6">OP-Versicherung vs. Krankenversicherung</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="card p-6">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-2">OP-Versicherung</p>
            <p className="text-2xl font-black mb-1">ab ~15 €/Monat</p>
            <p className="text-sm text-[var(--muted)] mb-4">Übernimmt Kosten für chirurgische Eingriffe</p>
            <ul className="space-y-1.5 text-sm text-white/80">
              <li>✓ Operationen, Narkose, Nachsorge</li>
              <li>✓ Unfälle & Knochenbrüche</li>
              <li>✓ Tumorentfernung</li>
              <li className="text-white/40">✗ Reguläre Arztbesuche</li>
              <li className="text-white/40">✗ Medikamente ohne OP</li>
            </ul>
            <p className="text-xs text-emerald-400 mt-4 font-semibold">Empfehlung: für die meisten Hunde</p>
          </div>
          <div className="card p-6">
            <p className="text-xs font-semibold text-[var(--honey)] uppercase tracking-wide mb-2">Vollkrankenversicherung</p>
            <p className="text-2xl font-black mb-1">ab ~40 €/Monat</p>
            <p className="text-sm text-[var(--muted)] mb-4">Übernimmt alle medizinischen Kosten</p>
            <ul className="space-y-1.5 text-sm text-white/80">
              <li>✓ OPs & Chirurgie</li>
              <li>✓ Diagnose & Laborwerte</li>
              <li>✓ Medikamente & Therapien</li>
              <li>✓ Physiotherapie & Reha</li>
              <li>✓ Chronische Erkrankungen (je nach Tarif)</li>
            </ul>
            <p className="text-xs text-[var(--honey)] mt-4 font-semibold">Empfehlung: bei Rassen mit Erbkrankheiten</p>
          </div>
        </div>
      </section>

      {/* ANBIETER-ÜBERSICHT */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <h2 className="text-2xl font-extrabold tracking-tight mb-2">Bekannte Anbieter im Überblick</h2>
        <p className="text-sm text-[var(--muted)] mb-6">Ohne Ranking — Konditionen variieren stark je nach Rasse, Alter und Tarif. Immer selbst vergleichen.</p>
        <div className="space-y-3">
          {ANBIETER.map((a) => (
            <div key={a.name} className="card p-5 flex flex-wrap gap-4 items-center justify-between">
              <div>
                <p className="font-bold text-white">{a.name}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">{a.fokus}</p>
              </div>
              <div className="flex gap-6 text-sm shrink-0">
                <div>
                  <p className="text-xs text-[var(--muted)] mb-0.5">Tarif-Typ</p>
                  <p className="font-semibold">{a.typ}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)] mb-0.5">Einstieg</p>
                  <p className="font-semibold text-[var(--honey)]">{a.tarif}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--muted)] mt-4">
          Preise sind Richtwerte für einen 2-jährigen Mischling, ~20 kg. Affiliate-Links · Preise können abweichen.
        </p>
      </section>

      {/* TIPPS */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <h2 className="text-2xl font-extrabold tracking-tight mb-6">6 Tipps bevor du abschließt</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {TIPPS.map((t) => (
            <div key={t.nr} className="card p-5">
              <div className="flex items-start gap-3">
                <span className="text-2xl font-black text-[var(--honey)] w-8 shrink-0">{t.nr}</span>
                <div>
                  <p className="font-bold text-sm mb-1">{t.titel}</p>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">{t.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SENIOR ALERT */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/8 p-6">
          <h2 className="text-lg font-bold text-amber-300 mb-3">🐾 Senior-Hunde: jetzt noch handeln</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
            Die meisten Versicherer nehmen keine Neukunden mehr an, sobald ein Hund <strong className="text-white">8 Jahre</strong> alt ist.
            Wer einen Junghund hat und „irgendwann" versichern will, sollte nicht zu lange warten —
            mit zunehmenden Alter steigen auch die Prämien und mehr Vorerkrankungen werden ausgeschlossen.
          </p>
          <p className="text-sm text-[var(--muted)]">
            BELLA erinnert dich 30 Tage bevor dein Hund die Senior-Phase erreicht —
            rechtzeitig für den Versicherungsabschluss.
          </p>
          <Link
            href="/mein-hund"
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm font-semibold hover:bg-amber-500/30 transition-colors"
          >
            🐕 Lebensphasen-Wecker für meinen Hund →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <h2 className="text-2xl font-extrabold tracking-tight mb-6">Häufige Fragen</h2>
        <div className="space-y-4">
          {faqItems.map((item) => (
            <details key={item.question} className="card p-5 group">
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center text-sm">
                {item.question}
                <span className="text-[var(--muted)] group-open:rotate-180 transition-transform shrink-0 ml-3">▾</span>
              </summary>
              <p className="text-sm text-[var(--muted)] mt-3 leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA BELLA */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-14">
        <div className="rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 p-8 text-center">
          <h2 className="text-xl font-extrabold mb-3">Erst das Futter optimieren, dann absichern</h2>
          <p className="text-[var(--muted)] text-sm mb-6 max-w-lg mx-auto">
            Gutes Futter senkt das Krankheitsrisiko — BELLA findet aus 11.000+ Sorten das Optimale für deinen Hund.
            Sie legt auch ein Profil an, das dich rechtzeitig an die Senior-Phase erinnert.
          </p>
          <Link
            href="/#bella-advisor"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
          >
            🐕 BELLA fragen — Futter + Profil anlegen
          </Link>
        </div>
      </section>

      <div className="max-w-4xl mx-auto w-full px-5 mb-10">
        <AuthorBox />
      </div>

      <SiteFooter />
    </div>
  );
}
