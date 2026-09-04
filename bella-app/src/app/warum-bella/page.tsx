import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";
import LiveProofTicker from "@/components/LiveProofTicker";
import { getFoodCount, getCrossSellCount } from "@/db/queries/foods";
import { PARTNER_VOUCHERS } from "@/data/partners";
import { CONTENT_REVISED } from "@/lib/site-dates";

export const metadata: Metadata = {
  title: "Warum BELLA anders ist: Kein Affiliate-Vergleich. Ein Berater.",
  description:
    "Warum die meisten Hundefutter-Seiten dich in die Irre führen — und was BELLA stattdessen macht. Transparent, datenbasiert, mit dem Wohl deiner Fellnase als einzigem Ziel.",
  alternates: {
    canonical: "https://welches-hundefutter.today/warum-bella",
    languages: {
      "de-DE": "https://welches-hundefutter.today/warum-bella",
      "de-AT": "https://welches-hundefutter.today/warum-bella",
      "de-CH": "https://welches-hundefutter.today/warum-bella",
      "x-default": "https://welches-hundefutter.today/warum-bella",
    },
  },
};

const faqItems = [
  {
    question: "Wie verdient BELLA Geld, wenn es kein Affiliate-Vergleich ist?",
    answer: "BELLA verdient über Affiliate-Provisionen — aber der entscheidende Unterschied ist: Welches Produkt wir empfehlen, richtet sich ausschließlich nach dem BELLA Score und dem Profil deines Hundes. Nicht danach, welcher Anbieter die höchste Provision zahlt. Die Provision ist das Ergebnis einer guten Empfehlung, nicht ihr Ziel.",
  },
  {
    question: "Was ist der Unterschied zwischen BELLA und einem Hundefutter-Test wie bei Stiftung Warentest?",
    answer: "Stiftung Warentest testet Labor-Werte von ~10–20 ausgewählten Produkten alle paar Jahre. BELLA bewertet algorithmisch über 11.000 aktive Produkte täglich anhand von vier transparenten Kriterien. Keine dieser Methoden ist 'besser' — sie sind ergänzend. BELLA ist breiter, aktueller und personalisiert auf deinen Hund.",
  },
  {
    question: "Stimmt es, dass Hundefutter-Marken wie Josera oder Purina Seiten dafür bezahlen, gut bewertet zu werden?",
    answer: "BELLA bezahlt keine Meinungen und verkauft keine Bewertungen. Der BELLA Score ist ein Algorithmus — kein Mensch kann ihn durch Zahlung beeinflussen. Josera, Purina, FRESSNAPF-Eigenmarken: alle werden nach denselben vier Kriterien gemessen.",
  },
  {
    question: "Ist qualitativ hochwertiges Hundefutter wirklich teurer?",
    answer: "Nicht zwingend. Der BELLA Score zeigt, dass Preis und Qualität oft nicht korrelieren. Es gibt hochwertiges Trockenfutter ab 4 €/kg und teure Produkte mit schlechter Deklaration. 'Hochwertig' bedeutet: klare Fleischquelle, geringe Füllstoffe, passend für deinen Hund — nicht das teuerste Produkt im Regal.",
  },
  {
    question: "Empfiehlt BELLA Fressnapf-Produkte?",
    answer: "BELLA empfiehlt das Produkt mit dem besten BELLA Score für deinen Hund — egal ob das ein FRESSNAPF-Eigenmarkenprodukt, ein Premiumhersteller oder ein Discountartikel ist. Wenn ein FRESSNAPF-Produkt die beste Lösung für deine Fellnase ist, wirst du es empfohlen bekommen. Wenn nicht, nicht.",
  },
  {
    question: "Kann ich Hundefutter günstig kaufen ohne Qualität zu opfern?",
    answer: "Ja. BELLA zeigt täglich Produkte mit Score ≥65 unter 4 €/kg — das ist echte Preis-Leistung ohne Kompromiss bei der Deklarationsklarheit. Hundefutter online kaufen günstig muss nicht bedeuten: schlechte Zutaten.",
  },
];

const EXPOSÉ_PUNKTE = [
  {
    icon: "💸",
    title: "Provision bestimmt die Platzierung",
    text: "Die meisten Hundefutter-Vergleiche sortieren nach Höhe der Affiliate-Provision — nicht nach Qualität. Was oben steht, zahlt am besten. Was gut für deinen Hund ist, ist kein Kriterium.",
  },
  {
    icon: "🎭",
    title: "Fake-Tests ohne Labor",
    text: "\"Hundefutter Test\" klingt nach Wissenschaft. Meistens ist es ein SEO-Artikel mit einem Affiliate-Link. Kein echtes Testlabor, kein unabhängiges Gremium — nur Texte, die gut ranken, um zu konvertieren.",
  },
  {
    icon: "🔄",
    title: "Marken kaufen Sichtbarkeit",
    text: "\"Empfohlen von...\" und \"Partner von...\" sind Marketing-Codes für: hat Geld bezahlt. Josera, HILLS, Royal Canin, Purina — alle haben Marketing-Budgets für Sichtbarkeit. Das hat nichts mit dem Wohl deines Hundes zu tun.",
  },
  {
    icon: "🔒",
    title: "Keine Transparenz über die Methodik",
    text: "Warum steht Produkt A vor Produkt B? Das erfahren Nutzer nie. Kein einziger großer Hundefutter-Vergleich veröffentlicht, wie er bewertet. Weil die Methodik die Wahrheit verraten würde.",
  },
  {
    icon: "📦",
    title: "Abo-Modelle für maximale Provision",
    text: "\"Hundefutter Online Bestellen Abo\" ist das lukrativste Keyword im Markt — weil Abos wiederkehrende Provisionen bedeuten. Deshalb pushten alle Affiliate-Seiten Abos — unabhängig davon, ob dein Hund das Futter verträgt.",
  },
  {
    icon: "😶",
    title: "Der Hund kommt zuletzt",
    text: "Am Ende jeder Empfehlung steht: Was verdienen wir? Nicht: Was braucht diese spezifische Fellnase? Rasse, Alter, Allergien, Gewicht — irrelevant für die Provision, also irrelevant für die Empfehlung.",
  },
];

const BELLA_PRINZIPIEN = [
  {
    icon: "🎯",
    title: "Algorithmus schlägt Provision",
    text: "Der BELLA Score (0–100) berechnet sich aus vier messbaren Kriterien: Proteinquelle, Verarbeitungsart, Allergen-Status, Preis-Leistung. Kein Hersteller kann zahlen, um diesen Score zu verbessern.",
  },
  {
    icon: "🐕",
    title: "Dein Hund ist die Einheit — nicht das Produkt",
    text: "BELLA beginnt nicht mit dem Produktkatalog. Sie beginnt mit deinem Hund. Rasse, Alter, Gewicht, Allergien, Aktivitätslevel. Dann erst sucht sie im 11.000+-Produkte-Katalog — gefiltert auf das, was passt.",
  },
  {
    icon: "🔍",
    title: "Vollständige Methodik-Transparenz",
    text: "Jede Bewertung ist erklärbar. Warum steht Produkt A vor Produkt B? Weil Score-Kriterium X erfüllt ist und Y nicht. Wir veröffentlichen die vollständige Methodik — weil wir sie veröffentlichen können.",
  },
  {
    icon: "📊",
    title: "Live-Daten, keine Schätzungen",
    text: "Preise kommen täglich vom AWIN-Feed — kein manuelles Update, kein 6 Monate alter Preisvergleich. Wenn Josera heute 12 % teurer wird, sieht das BELLA morgen.",
  },
  {
    icon: "💬",
    title: "Empathie statt Conversion-Optimierung",
    text: "BELLA fragt nach, wenn sie unsicher ist. Sie erklärt, warum sie etwas empfiehlt. Sie sagt auch: 'Kein Futter in unserem Katalog passt perfekt zu deinen Anforderungen.' Das kostet Provision — und erhöht Vertrauen.",
  },
  {
    icon: "✉️",
    title: "Kein E-Mail-Spam, kein Tracker-Pixel",
    text: "Der Preis-Wecker ist Double-Opt-In. Kein On-Load-Tracking-Pixel. Keine Re-Targeting-Netzwerke. Was wir über deinen Hund wissen, verwenden wir ausschließlich, um bessere Empfehlungen zu machen — nicht um dich im Internet zu verfolgen.",
  },
];

export default async function WarumBellaPage() {
  const [foodCount, crossSellCount] = await Promise.all([getFoodCount(), getCrossSellCount()]);

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData
        type="article"
        article={{
          headline: "Warum BELLA anders ist als 99 % der Hundefutter-Seiten",
          description: "Kein Affiliate-Vergleich. Ein Berater — mit dem Wohl deiner Fellnase als einzigem Ziel.",
          url: "https://welches-hundefutter.today/warum-bella",
          dateModified: CONTENT_REVISED,
          speakableSelectors: ["h1", ".bella-manifesto"],
        }}
      />
      <StructuredData type="faq" faqs={faqItems} />

      <nav className="max-w-4xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">Warum BELLA</span>
      </nav>

      {/* Hero — die Ansage */}
      <section className="hero-glow max-w-4xl mx-auto w-full px-5 pt-8 pb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold mb-6">
          ⚠️ Das sagt dir kein anderer Hundefutter-Anbieter
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-5 max-w-3xl">
          Die meisten Hundefutter-Seiten führen dich in die Irre.{" "}
          <span className="text-[var(--honey)]">BELLA nicht.</span>
        </h1>
        <p className="bella-manifesto text-[var(--muted)] text-lg leading-relaxed max-w-2xl mb-8">
          Wir sind kein Vergleichsportal, das Produkte nach Provision sortiert.
          Wir sind ein intelligenter Berater — der einzige, dem es egal ist,
          welches Futter die höchste Provision zahlt, weil unser Score-Algorithmus
          das für uns entscheidet.{" "}
          <strong className="text-white">Das Einzige, was zählt: Hat deine Fellnase das richtige Futter gefunden?</strong>
        </p>
        <div className="flex flex-wrap gap-3 mb-8">
          <Link href="/#bella-advisor" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all text-sm">
            🐕 BELLA fragen — kostenlos
          </Link>
          <Link href="/analyse/methodik" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm hover:border-[rgba(240,167,60,0.4)] transition-all">
            Methodik ansehen →
          </Link>
        </div>
        <LiveProofTicker foodCount={foodCount} crossSellCount={crossSellCount} voucherCount={PARTNER_VOUCHERS.length} />
      </section>

      {/* Exposé — wie der Markt funktioniert */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-14">
        <div className="mb-8">
          <span className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 block">Was niemand dir sagt</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
            Wie der Hundefutter-Markt wirklich funktioniert
          </h2>
          <p className="text-[var(--muted)] max-w-2xl leading-relaxed">
            Bevor du das nächste Hundefutter online kaufst — ob günstig bei FRESSNAPF,
            Premium bei Josera oder hochwertig beim Spezialversand — solltest du wissen,
            wie die Seiten funktionieren, die dir Empfehlungen geben.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {EXPOSÉ_PUNKTE.map((p) => (
            <div key={p.title} className="rounded-2xl border border-red-500/10 bg-red-500/[0.03] p-5">
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{p.icon}</span>
                <div>
                  <h3 className="font-bold text-white text-sm mb-1.5">{p.title}</h3>
                  <p className="text-[var(--muted)] text-sm leading-relaxed">{p.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto w-full px-5 pb-10">
        <div className="flex items-center gap-4">
          <div className="flex-1 border-t border-white/10" />
          <span className="text-sm font-bold text-[var(--honey)]">Was wir stattdessen tun</span>
          <div className="flex-1 border-t border-white/10" />
        </div>
      </div>

      {/* BELLA-Prinzipien */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-14">
        <div className="mb-8">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 block">Das BELLA-Versprechen</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Sechs Prinzipien, die BELLA von jedem anderen unterscheiden
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {BELLA_PRINZIPIEN.map((p) => (
            <div key={p.title} className="card p-5">
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{p.icon}</span>
                <div>
                  <h3 className="font-bold text-white text-sm mb-1.5">{p.title}</h3>
                  <p className="text-[var(--muted)] text-sm leading-relaxed">{p.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Was hochwertiges Hundefutter wirklich ist */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-14">
        <div className="card p-7">
          <h2 className="text-xl font-extrabold tracking-tight mb-4">
            Was ist wirklich „qualitativ hochwertiges Hundefutter"?
          </h2>
          <p className="text-[var(--muted)] text-sm leading-relaxed mb-5">
            „Hochwertig" ist eines der am häufigsten missbrauchten Wörter im Hundefutter-Marketing.
            Jede Marke nennt ihr Produkt hochwertig — von FRESSNAPF-Eigenmarke bis zu 30 €/kg Premium-BARF.
            BELLA definiert Qualität messbar:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            {[
              { label: "Proteinquelle klar benannt", desc: "'Hühnerfleisch' statt 'Fleisch und tierische Nebenerzeugnisse' -- Transparenz ist das erste Qualitätsmerkmal.", score: "+25 Punkte" },
              { label: "Verarbeitungsart", desc: "BARF und Kaltgepresstes erhalten mehr Punkte als Extrusion bei hohen Temperaturen. Die Methode beeinflusst die Nährstoffdichte.", score: "+20 Punkte" },
              { label: "Allergen-Status", desc: "Monoprotein und hypoallergene Rezepturen erhalten Bonus-Punkte. Für Allergiker entscheidend — nicht für alle nötig.", score: "+15 Punkte" },
              { label: "Preis-Leistungs-Verhältnis", desc: "Im Marktkontext bewertet: Ein gutes Trockenfutter für 4 €/kg ist besser als ein mittelmäßiges für 14 €/kg.", score: "+10 Punkte" },
            ].map((c) => (
              <div key={c.label} className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-sm text-white">{c.label}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold shrink-0 ml-2">{c.score}</span>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/analyse/methodik" className="text-sm text-[var(--honey)] hover:underline">
              Vollständige Score-Methodik →
            </Link>
            <Link href="/blog/marken-ranking-bella-score" className="text-sm text-[var(--honey)] hover:underline">
              Marken-Ranking nach BELLA Score →
            </Link>
          </div>
        </div>
      </section>

      {/* Vergleich: BELLA vs. Affiliate-Portal */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-14">
        <h2 className="text-2xl font-extrabold tracking-tight mb-6">BELLA vs. typisches Affiliate-Portal</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-3 text-[var(--muted)] text-xs uppercase tracking-wide font-bold">Kriterium</th>
                <th className="text-left p-3 text-red-400 text-xs uppercase tracking-wide font-bold">Typischer Affiliate-Vergleich</th>
                <th className="text-left p-3 text-emerald-400 text-xs uppercase tracking-wide font-bold">BELLA</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Reihenfolge der Produkte", "Provision des Herstellers", "BELLA Score (Algorithmus)"],
                ["Personalisierung", "Keine — gleiche Liste für alle", "Profil deines Hundes (Rasse, Alter, Allergien)"],
                ["Anzahl bewerteter Produkte", "10–50 handgepickte Produkte", `${foodCount.toLocaleString("de-DE")} aktive Produkte, täglich`],
                ["Preis-Aktualität", "Oft Monate alt", "Täglich via AWIN-Feed"],
                ["Score-Transparenz", "Keine Methodik veröffentlicht", "Vollständig transparent (/analyse/methodik)"],
                ["Was verdient der Betreiber?", "Höchste Provision pro Klick", "Provision nur wenn Empfehlung stimmt"],
                ["Hundefutter-Test", "Meist SEO-Artikel ohne Labor", "Algorithmische Bewertung, erklärbar"],
                ["Wohl des Hundes", "Kein Bewertungskriterium", "Das einzige Ziel"],
                ["Gutscheincodes", "Versteckt oder gar nicht erwähnt", `${PARTNER_VOUCHERS.length} echte Codes offen gelistet (/gutscheine)`],
                ["Begleitprodukte (Snacks, Zubehör)", "Wahllos eingeblendete Werbung", "Kuratiert, max. 3, nie als Komplett-Futter getarnt"],
                ["Nach der Empfehlung", "Interessiert niemanden mehr", "Wirkungs-Tracker fragt nach: hat's geholfen?"],
              ].map(([k, aff, bella], i) => (
                <tr key={k} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/[0.015]" : ""}`}>
                  <td className="p-3 font-medium text-[var(--muted)] text-xs">{k}</td>
                  <td className="p-3 text-red-300/70 text-xs">{aff}</td>
                  <td className="p-3 text-emerald-300 text-xs font-medium">{bella}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Keyword Cluster Links — intern */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-14">
        <h2 className="text-xl font-extrabold tracking-tight mb-5">Deine Fragen — unsere ehrlichen Antworten</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { href: "/hundefutter-test", label: "🔬 Hundefutter Test", desc: "Was steckt wirklich hinter Tests?" },
            { href: "/hundefutter-marken", label: "🏷️ Hundefutter Marken", desc: "Josera, FRESSNAPF & Co. ehrlich bewertet" },
            { href: "/vergleich", label: "⚖️ Echte Vergleiche", desc: "8 datenbasierte Direktvergleiche" },
            { href: "/blog/marken-ranking-bella-score", label: "🏆 BELLA Score Ranking", desc: "Top-Marken nach echten Kriterien" },
            { href: "/blog/preisbarometer-2026", label: "💰 Was Futter kostet", desc: "Live-Preise nach Futtertyp" },
            { href: "/analyse/methodik", label: "📐 Unsere Methodik", label2: "So berechnen wir den Score", desc: "Vollständig transparent" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="card p-4 hover:border-[rgba(240,167,60,0.4)] transition-all group"
            >
              <p className="font-bold text-sm text-white mb-1">{l.label}</p>
              <p className="text-xs text-[var(--muted)]">{l.desc}</p>
              <span className="text-[10px] text-[var(--honey)] group-hover:underline mt-2 block">Mehr erfahren →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-14">
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

      {/* Finaler CTA */}
      <section className="max-w-4xl mx-auto w-full px-5 pb-16">
        <div className="rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 p-8 text-center">
          <p className="text-3xl mb-4">🐕</p>
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">
            Deine Fellnase verdient eine echte Empfehlung
          </h2>
          <p className="text-[var(--muted)] mb-6 max-w-lg mx-auto">
            Kein Vergleich, kein Ranking, keine Provision-Liste.
            Nur BELLA — die fragt, zuhört, und das wirklich passende Futter findet.
          </p>
          <Link
            href="/#bella-advisor"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
          >
            Jetzt BELLA fragen — kostenlos
          </Link>
          <p className="text-xs text-[var(--muted)] mt-4">
            Über {foodCount.toLocaleString("de-DE")} Produkte. Kein Account nötig. Keine E-Mail-Pflicht.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
