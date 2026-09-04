import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import AuthorBox from "@/components/AuthorBox";
import SiteFooter from "@/components/SiteFooter";
import { getTopFoodsByScore } from "@/db/queries/foods";
import { CONTENT_REVISED } from "@/lib/site-dates";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Hochwertiges Hundefutter erkennen — 4 messbare Kriterien | BELLA",
  description:
    "\"Hochwertig\" steht auf jeder Packung — von der Discount-Eigenmarke bis zum 30€/kg-Premiumfutter. So erkennst du echte Qualität an 4 messbaren Kriterien, nicht am Preis.",
  alternates: {
    canonical: "https://welches-hundefutter.today/hochwertiges-hundefutter",
    languages: {
      "de-DE": "https://welches-hundefutter.today/hochwertiges-hundefutter",
      "de-AT": "https://welches-hundefutter.today/hochwertiges-hundefutter",
      "de-CH": "https://welches-hundefutter.today/hochwertiges-hundefutter",
      "x-default": "https://welches-hundefutter.today/hochwertiges-hundefutter",
    },
  },
};

const KRITERIEN = [
  { label: "Proteinquelle klar benannt", desc: "\"Hühnerfleisch\" statt \"Fleisch und tierische Nebenerzeugnisse\" — Transparenz ist das erste Qualitätsmerkmal. Mehr dazu im Zutaten-Lexikon.", link: "/glossar/tierische-nebenerzeugnisse" },
  { label: "Verarbeitungsart", desc: "BARF und Kaltgepresstes erhalten mehr Punkte als stark erhitzte Extrusion — die Methode beeinflusst die Nährstoffdichte.", link: "/futtertyp/kaltgepresst" },
  { label: "Allergen-Status", desc: "Monoprotein und hypoallergene Rezepturen sind für Allergiker entscheidend — für alle anderen kein Muss.", link: "/futtertyp/hypoallergen" },
  { label: "Preis-Leistungs-Verhältnis", desc: "Ein gutes Trockenfutter für 4 €/kg ist besser als ein mittelmäßiges für 14 €/kg. Hochpreisig ist nicht automatisch hochwertig.", link: "/analyse/preisindex-2026" },
];

const faqItems = [
  {
    question: "Ist teures Hundefutter automatisch hochwertig?",
    answer: "Nein. Der BELLA-Score zeigt regelmäßig, dass Preis und Qualität nicht zwingend korrelieren. Es gibt gut deklariertes Trockenfutter ab 4 €/kg und teure Produkte mit vager Proteinquelle und viel Füllstoff.",
  },
  {
    question: "Woran erkenne ich hochwertiges Hundefutter ohne Fachwissen?",
    answer: "Drei schnelle Checks: Steht eine konkrete Proteinquelle ganz vorne in der Zutatenliste (nicht \"tierische Nebenerzeugnisse\")? Ist der Fleischanteil angegeben? Wirkt die Beschreibung sachlich oder nur werbend (\"Premium\", \"Super-Premium\" sind keine geschützten Begriffe)?",
  },
  {
    question: "Sind Eigenmarken von Discountern schlechter als teure Markenprodukte?",
    answer: "Nicht grundsätzlich — manche Eigenmarken haben eine klar deklarierte, solide Rezeptur zu einem fairen Preis. Die Marke allein ist kein Qualitätsmerkmal, die Deklaration ist es.",
  },
];

export default async function HochwertigesHundefutterPage() {
  const topFoods = await getTopFoodsByScore(6);

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData
        type="article"
        article={{
          headline: "Hochwertiges Hundefutter erkennen — 4 messbare Kriterien",
          description: "So erkennst du echte Qualität an 4 messbaren Kriterien, nicht am Preis.",
          url: "https://welches-hundefutter.today/hochwertiges-hundefutter",
          dateModified: CONTENT_REVISED,
        }}
      />
      <StructuredData type="faq" faqs={faqItems} />

      <nav className="max-w-4xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">Hochwertiges Hundefutter</span>
      </nav>

      <section className="hero-glow max-w-4xl mx-auto w-full px-5 pt-8 pb-14">
        <span className="pill mb-4">🎯 4 messbare Kriterien</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-5 max-w-3xl">
          Was ist wirklich hochwertiges Hundefutter?
        </h1>
        <p className="text-[var(--muted)] text-lg leading-relaxed max-w-2xl">
          „Hochwertig" ist eines der am häufigsten missbrauchten Wörter im Hundefutter-
          Marketing — jede Marke nennt ihr Produkt so, von der Discount-Eigenmarke bis
          zum 30 €/kg-Premiumfutter. BELLA definiert Qualität messbar, nicht über Preis
          oder Markenname.
        </p>
      </section>

      <section className="max-w-4xl mx-auto w-full px-5 pb-14">
        <div className="grid sm:grid-cols-2 gap-4">
          {KRITERIEN.map((k) => (
            <Link key={k.label} href={k.link} className="card card-hover p-5 block">
              <p className="font-bold text-sm mb-2">{k.label}</p>
              <p className="text-xs text-[var(--muted)] leading-relaxed">{k.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto w-full px-5 pb-14">
        <h2 className="text-xl font-extrabold tracking-tight mb-5">Aktuell höchste BELLA-Scores</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topFoods.map((f) => (
            <a key={f.id} href={f.affiliateUrl} target="_blank" rel="sponsored nofollow noopener noreferrer"
              className="card card-hover p-4 block">
              <div className="flex items-center justify-between mb-1">
                <p className="font-bold text-sm truncate">{f.brand}</p>
                {f.score != null && <span className="text-xs font-bold text-emerald-400 shrink-0 ml-2">{f.score}/100</span>}
              </div>
              <p className="text-xs text-[var(--muted)] truncate">{f.name}</p>
            </a>
          ))}
        </div>
      </section>

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

      <section className="max-w-4xl mx-auto w-full px-5 pb-14">
        <div className="flex flex-wrap gap-3">
          <Link href="/analyse/methodik" className="text-sm text-[var(--honey)] hover:underline">
            Vollständige Score-Methodik →
          </Link>
          <Link href="/warum-bella" className="text-sm text-[var(--honey)] hover:underline">
            Warum BELLA anders ist →
          </Link>
        </div>
      </section>

      <AuthorBox reviewedAt="2026-06-25" />
      <SiteFooter />
    </div>
  );
}
