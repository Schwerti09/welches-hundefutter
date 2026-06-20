import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Hundefutter Vergleich 2026: Futtertypen im Direktvergleich | BELLA",
  description: "Trockenfutter vs. Nassfutter, BARF vs. Fertigfutter — alle Vergleiche auf Basis echter Daten aus 11.000+ Produkten. Ohne Hersteller-Bias.",
  alternates: {
    canonical: "https://welches-hundefutter.today/vergleich",
    languages: {
      "de-DE": "https://welches-hundefutter.today/vergleich",
      "de-AT": "https://welches-hundefutter.today/vergleich",
      "de-CH": "https://welches-hundefutter.today/vergleich",
      "x-default": "https://welches-hundefutter.today/vergleich",
    },
  },
};

const vergleiche = [
  {
    slug: "trockenfutter-vs-nassfutter",
    title: "Trockenfutter vs. Nassfutter",
    description: "Kosten, Nährwerte, Zahngesundheit und Sättigungseffekt im Direktvergleich.",
    emoji: "⚖️",
    tag: "Klassiker",
  },
  {
    slug: "barf-vs-trockenfutter",
    title: "BARF vs. Trockenfutter",
    description: "Rohfütterung gegen Fertigfutter: Aufwand, Kosten, Risiken und Nutzen ehrlich gegenübergestellt.",
    emoji: "🥩",
    tag: "Beliebt",
  },
  {
    slug: "nassfutter-vs-barf",
    title: "Nassfutter vs. BARF",
    description: "Beide fleischbetont und feucht — wo liegen die echten Unterschiede bei Aufwand, Kosten und Risiko?",
    emoji: "🫙",
    tag: "Neu",
  },
  {
    slug: "kaltgepresst-vs-extrudiert",
    title: "Kaltgepresst vs. Extrudiert",
    description: "Was der Herstellungsunterschied für Nährstoffe, Verdaulichkeit und den Aufpreis bedeutet.",
    emoji: "🌡️",
    tag: "Neu",
  },
  {
    slug: "monoprotein-vs-mehrkomponenten",
    title: "Monoprotein vs. Mehrkomponenten",
    description: "Wann Monoprotein wirklich nötig ist — und wann du Geld für unnötigen Aufpreis ausgibst.",
    emoji: "🧬",
    tag: "Allergie",
  },
  {
    slug: "getreidefrei-vs-mit-getreide",
    title: "Getreidefrei vs. Mit Getreide",
    description: "Getreidefrei ist kein Qualitätsmerkmal per se — was die Wissenschaft wirklich sagt.",
    emoji: "🌾",
    tag: "Mythos-Check",
  },
  {
    slug: "premium-vs-budget",
    title: "Premium vs. Budget",
    description: "Lohnt sich der Aufpreis? Wo der echte Qualitätsunterschied liegt — und wo nicht.",
    emoji: "💰",
    tag: "Sparpotenzial",
  },
  {
    slug: "insektenfutter-vs-huehnchen",
    title: "Insektenfutter vs. Hühnchen",
    description: "Nachhaltig, hypoallergen, vollwertig — Insektenprotein als echte Alternative für Allergiker.",
    emoji: "🦟",
    tag: "Zukunft",
  },
];

export default function VergleichIndexPage() {
  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <nav className="max-w-5xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">Vergleiche</span>
      </nav>

      <section className="hero-glow max-w-5xl mx-auto w-full px-5 pt-8 pb-14">
        <span className="pill mb-4">⚖️ Direktvergleiche</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Hundefutter im Vergleich
        </h1>
        <p className="text-[var(--muted)] leading-relaxed max-w-2xl">
          Datenbasierte Vergleiche ohne Herstellermeinungen — auf Basis von 11.000+ echten Produkten aus unserem Katalog.
        </p>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vergleiche.map((v) => (
            <Link key={v.slug} href={`/vergleich/${v.slug}`}
              className="card card-hover p-6 block group">
              <div className="flex items-center justify-between mb-3">
                <div className="text-3xl">{v.emoji}</div>
                {v.tag && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(240,167,60,0.15)] text-[var(--honey)] font-semibold uppercase tracking-wide">{v.tag}</span>}
              </div>
              <h2 className="text-base font-extrabold tracking-tight mb-2">{v.title}</h2>
              <p className="text-xs text-[var(--muted)] leading-relaxed mb-4">{v.description}</p>
              <span className="text-xs text-[var(--honey)] font-semibold group-hover:underline">Vergleich lesen →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-14">
        <div className="rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 p-8 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">Kein Vergleich nötig — BELLA entscheidet für deinen Hund</h2>
          <p className="text-[var(--muted)] mb-6 max-w-lg mx-auto">Erzähl BELLA von deinem Hund: Rasse, Alter, Allergien. Sie filtert aus 11.000+ Sorten das passende Futter — ohne Theorie.</p>
          <Link href="/#bella-advisor" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all">
            🐕 Jetzt Futter finden
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
