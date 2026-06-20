import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import AuthorBox from "@/components/AuthorBox";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Hundefutter Test 2026: Was dahinter steckt — und warum die meisten Tests wertlos sind",
  description:
    "Hundefutter Tests versprechen Objektivität. Die Realität: die meisten sind SEO-Artikel mit Affiliate-Links. Hier erfährst du den Unterschied — und wie BELLA wirklich testet.",
  alternates: {
    canonical: "https://welches-hundefutter.today/hundefutter-test",
    languages: {
      "de-DE": "https://welches-hundefutter.today/hundefutter-test",
      "de-AT": "https://welches-hundefutter.today/hundefutter-test",
      "de-CH": "https://welches-hundefutter.today/hundefutter-test",
      "x-default": "https://welches-hundefutter.today/hundefutter-test",
    },
  },
};

const faqItems = [
  {
    question: "Welcher Hundefutter Test ist wirklich unabhängig?",
    answer: "Stiftung Warentest und Öko-Test sind strukturell unabhängig (keine Affiliate-Einnahmen). Sie testen aber nur wenige Produkte, selten aktualisiert. Für breite, aktuelle Orientierung bietet BELLA algorithmische Bewertung von 11.065 Produkten — täglich aktualisiert, Methodik veröffentlicht.",
  },
  {
    question: "Was testet Stiftung Warentest beim Hundefutter?",
    answer: "Stiftung Warentest analysiert Nährstoffgehalte, Schadstoffe (Mykotoxine, Schwermetalle), Deklarationskonformität und Mindestversorgung nach FEDIAF-Standards. Der letzte große Test war 2022. Ihr Test ist tiefgehend, aber schmal (wenige Produkte) und nicht personalisiert.",
  },
  {
    question: "Wie erkennt man einen seriösen Hundefutter Test?",
    answer: "Vier Merkmale: 1) Klare Test-Methodik veröffentlicht. 2) Keine Affiliate-Links in den getesteten Produkten. 3) Negative Ergebnisse werden veröffentlicht. 4) Die Tester sind unabhängig von den Herstellern. Wenn alle vier fehlen, ist es kein Test — es ist eine bezahlte Empfehlung.",
  },
  {
    question: "Sind Hundefutter Tests von Hunde-Websites seriös?",
    answer: "Meistens nicht als 'Tests' im wissenschaftlichen Sinn. Viele sind gut recherchierte Ratgeber — aber keine echten Tests mit Labor-Analysen. Der Unterschied ist wichtig: ein Artikel über Hundefutter-Kriterien ist nicht dasselbe wie ein Labor-Test.",
  },
  {
    question: "Was bedeutet 'hochwertiges hundefutter' laut Test?",
    answer: "Stiftung Warentest bewertet Nährstoffgehalte und Schadstofffreiheit. BELLA bewertet Deklarationsklarheit, Proteinquelle, Verarbeitungsart und Preis-Leistung. Beides sind sinnvolle Qualitätsindikatoren — aus verschiedenen Blickwinkeln.",
  },
];

const TESTARTEN = [
  {
    name: "Stiftung Warentest / Öko-Test",
    unabh: true,
    produkte: "10–30 pro Test",
    methode: "Labor: Nährstoffe, Schadstoffe, Deklaration",
    aktualitaet: "Alle 2–4 Jahre",
    personalisierung: "Keine",
    affiliate: false,
    fazit: "Tiefgehend, unabhängig, selten und schmal",
  },
  {
    name: "Typische Affiliate-Testseite",
    unabh: false,
    produkte: "5–20 handgepickt",
    methode: "Kein Labor, redaktionelle Meinung",
    aktualitaet: "Selten aktualisiert",
    personalisierung: "Keine",
    affiliate: true,
    fazit: "SEO-Artikel mit Affiliate-Link als \"Test\" verkleidet",
  },
  {
    name: "BELLA (KI-Beraterin)",
    unabh: true,
    produkte: "11.065 aktiv",
    methode: "Algorithmisch: Score aus 4 messbaren Kriterien",
    aktualitaet: "Täglich",
    personalisierung: "Vollständig (Hund-Profil)",
    affiliate: true,
    notiz: "Provision beeinflusst Reihenfolge nicht",
    fazit: "Breit, aktuell, personalisiert — Methodik transparent",
  },
];

export default function HundefutterTestPage() {
  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData
        type="article"
        article={{
          headline: "Hundefutter Test 2026: Was steckt wirklich dahinter?",
          description: "Wie unterscheidest du echte Tests von Affiliate-Artikeln? Und was ist die Alternative?",
          url: "https://welches-hundefutter.today/hundefutter-test",
          dateModified: new Date().toISOString(),
          speakableSelectors: ["h1", ".bella-answer"],
        }}
      />
      <StructuredData type="faq" faqs={faqItems} />

      <nav className="max-w-4xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <Link href="/warum-bella" className="hover:text-[var(--honey)]">Warum BELLA</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">Hundefutter Test</span>
      </nav>

      {/* Hero */}
      <section className="hero-glow max-w-4xl mx-auto w-full px-5 pt-8 pb-12">
        <span className="pill mb-4">🔬 Ehrliche Analyse</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
          Hundefutter Test 2026: Was dahinter steckt — und warum die meisten Tests{" "}
          <span className="text-red-400">wertlos</span> sind
        </h1>
        <p className="bella-answer text-[var(--muted)] leading-relaxed max-w-2xl">
          „Hundefutter Test" ist eines der meistgesuchten Begriffe im Bereich Hundehaltung.
          Und einer der meistmissbrauchten. Was ein echter Test ist, was ein SEO-Artikel
          mit Affiliate-Link ist — und wie du den Unterschied erkennst.
        </p>
      </section>

      {/* Was ein echter Test bedeutet */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <h2 className="text-2xl font-extrabold tracking-tight mb-6">
          Was macht einen echten Hundefutter-Test aus?
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {[
            { icon: "🧪", title: "Laboranalyse", text: "Echte Nährstoffwerte (Rohprotein, Rohfett, Rohfaser, Asche, Feuchtigkeit) aus einem akkreditierten Labor — nicht vom Etikett abgelesen." },
            { icon: "📋", title: "Transparente Methodik", text: "Was wird bewertet? Mit welcher Gewichtung? Wer trifft die Entscheidungen? All das muss vor der Bewertung feststehen und veröffentlicht sein." },
            { icon: "🔒", title: "Keine Interessenkonflikte", text: "Der Tester darf keine finanziellen Vorteile aus bestimmten Testergebnissen ziehen. Affiliate-Links und Testberichte in einem Dokument sind ein Interessenkonflikt." },
            { icon: "📉", title: "Negative Ergebnisse", text: "Ein Test ohne ein einziges 'mangelhaft' ist kein Test — es ist Marketing. Echte Tests zeigen auch, was nicht funktioniert." },
          ].map((c) => (
            <div key={c.title} className="card p-5">
              <div className="flex gap-3">
                <span className="text-2xl shrink-0">{c.icon}</span>
                <div>
                  <h3 className="font-bold text-white text-sm mb-1.5">{c.title}</h3>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">{c.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Test-Typen Vergleich */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <h2 className="text-2xl font-extrabold tracking-tight mb-6">
          Die drei Arten von Hundefutter-Tests im Vergleich
        </h2>
        <div className="space-y-4">
          {TESTARTEN.map((t) => (
            <div
              key={t.name}
              className={`card p-5 border ${
                t.name.includes("BELLA")
                  ? "border-emerald-500/30 bg-emerald-500/[0.03]"
                  : t.unabh
                  ? "border-blue-500/20"
                  : "border-red-500/15 bg-red-500/[0.02]"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <h3 className="font-extrabold text-white">{t.name}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  t.name.includes("BELLA")
                    ? "bg-emerald-500/20 text-emerald-400"
                    : t.unabh
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-red-500/15 text-red-400"
                }`}>
                  {t.name.includes("BELLA") ? "Empfohlen" : t.unabh ? "Unabhängig" : "Vorsicht"}
                </span>
                {t.affiliate && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-bold">
                    {t.notiz ?? "Affiliate"}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {[
                  { label: "Produkte", val: t.produkte },
                  { label: "Methode", val: t.methode },
                  { label: "Aktualität", val: t.aktualitaet },
                  { label: "Personalisierung", val: t.personalisierung },
                ].map((row) => (
                  <div key={row.label}>
                    <p className="text-[var(--muted)] mb-0.5">{row.label}</p>
                    <p className="font-medium text-white">{row.val}</p>
                  </div>
                ))}
              </div>
              <p className={`text-xs mt-3 font-semibold ${
                t.name.includes("BELLA") ? "text-emerald-400" : t.unabh ? "text-blue-400" : "text-red-400"
              }`}>
                → {t.fazit}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Wie man Affiliate-Artikel erkennt */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <div className="card p-7">
          <h2 className="text-xl font-extrabold tracking-tight mb-5">
            5 Zeichen, dass ein „Test" in Wirklichkeit ein Affiliate-Artikel ist
          </h2>
          <ol className="space-y-4">
            {[
              { n: "1", title: "Alle Produkte sind empfehlenswert", text: "Ein echter Test hat auch schlechte Ergebnisse. Wenn alle 8 getesteten Produkte 'sehr gut' oder 'empfohlen' sind, war das Ziel nicht Testen, sondern Klicks generieren." },
              { n: "2", title: "Affiliate-Links direkt neben den Bewertungen", text: "\"Jetzt kaufen bei...\" mit UTM-Parameter direkt im Testbericht ist ein Interessenkonflikt. Objektive Tests verlinken nicht auf Shops, von denen sie Provision erhalten." },
              { n: "3", title: "Keine Methodik erklärt", text: "Warum ist Produkt A besser als Produkt B? Wenn das nicht beantwortet wird, gibt es keine Methodik — nur eine subjektive Meinung oder eine Ranking-Liste nach Provision." },
              { n: "4", title: "Test deckt alle wichtigen Keywords ab", text: "Wenn ein einziger Artikel gleichzeitig Trockenfutter, Nassfutter, BARF, Senior, Welpe, günstig und premium \"testet\" — das ist SEO-Optimierung, kein Test." },
              { n: "5", title: "Das \"Siegerprodukt\" ändert sich mit den Provisionen", text: "Wenn das empfohlene Produkt letztes Jahr ein anderes war und heute eine andere Marke vorne steht — ohne neue Testergebnisse — folgte die Änderung dem Geld, nicht der Qualität." },
            ].map((item) => (
              <li key={item.n} className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-red-500/20 text-red-400 font-black text-sm flex items-center justify-center shrink-0 mt-0.5">{item.n}</span>
                <div>
                  <p className="font-bold text-white text-sm mb-1">{item.title}</p>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Was BELLA anders macht */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <h2 className="text-2xl font-extrabold tracking-tight mb-5">
          Wie BELLA bewertet — und warum das kein Test ist, sondern besser
        </h2>
        <p className="text-[var(--muted)] text-sm leading-relaxed mb-6 max-w-2xl">
          BELLA macht keine Labor-Tests. BELLA macht etwas anderes: Sie bewertet algorithmisch,
          was aus den Produktdaten ableitbar ist — für 11.065 Produkte, täglich.
          Das ist kein Ersatz für einen Stiftung-Warentest-Labor-Report.
          Aber es ist der einzige Weg, <em>deinen Hund</em> mit <em>diesem Produkt</em> zu matchen.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {[
            { n: "11.065", label: "bewertete Produkte", sub: "täglich aktualisiert" },
            { n: "4", label: "transparente Kriterien", sub: "vollständig dokumentiert" },
            { n: "0", label: "Produkte mit \"gekaufter\" Bewertung", sub: "Algorithmus, nicht Meinung" },
          ].map((s) => (
            <div key={s.label} className="card p-5 text-center">
              <p className="text-3xl font-black text-[var(--honey)]">{s.n}</p>
              <p className="text-sm font-bold text-white mt-1">{s.label}</p>
              <p className="text-xs text-[var(--muted)] mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
        <Link href="/analyse/methodik" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm hover:border-[rgba(240,167,60,0.4)] transition-all">
          BELLA Score Methodik vollständig ansehen →
        </Link>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-12">
        <h2 className="text-2xl font-extrabold tracking-tight mb-6">Häufige Fragen</h2>
        <div className="space-y-4">
          {faqItems.map((f, i) => (
            <div key={i} className="card p-5">
              <h3 className="font-bold text-base mb-2">{f.question}</h3>
              <p className="text-[var(--muted)] text-sm leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related cluster */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-10">
        <h2 className="text-xl font-extrabold tracking-tight mb-4">Mehr Hintergrund</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/warum-bella" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">Warum BELLA anders ist</Link>
          <Link href="/hundefutter-marken" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">Hundefutter Marken ehrlich bewertet</Link>
          <Link href="/blog/marken-ranking-bella-score" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">BELLA Score Ranking</Link>
          <Link href="/analyse/methodik" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[var(--muted)] hover:border-[rgba(240,167,60,0.4)] transition-all">Score-Methodik</Link>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-14">
        <div className="rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 p-8">
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">Kein Test nötig — BELLA findet es für dich</h2>
          <p className="text-[var(--muted)] mb-6">Erzähl ihr von deinem Hund. Sie findet aus 11.065 Produkten das passende — algorithmisch, transparent, ohne Interessenkonflikt.</p>
          <Link href="/#bella-advisor" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all">
            🐕 Jetzt BELLA fragen
          </Link>
        </div>
      </section>

      <div className="max-w-4xl mx-auto w-full px-5 pb-10">
        <AuthorBox />
      </div>
      <SiteFooter />
    </div>
  );
}
