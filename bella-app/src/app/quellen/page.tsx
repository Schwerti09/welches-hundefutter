import type { Metadata } from "next";
import Link from "next/link";
import { STUDIEN } from "@/data/studien";
import AuthorBox from "@/components/AuthorBox";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Wissenschaftliche Quellen & Studien | welches-hundefutter.today",
  description: "Alle Studien, Leitlinien und wissenschaftlichen Quellen, auf die sich die Ratgeber von welches-hundefutter.today stuetzen — mit DOI, PubMed-Link und Kernaussage.",
  alternates: {
    canonical: "https://welches-hundefutter.today/quellen",
    languages: {
      "de-DE": "https://welches-hundefutter.today/quellen",
      "de-AT": "https://welches-hundefutter.today/quellen",
      "de-CH": "https://welches-hundefutter.today/quellen",
      "x-default": "https://welches-hundefutter.today/quellen",
    },
  },
};

const TYPE_LABEL: Record<string, string> = {
  "peer-reviewed": "Peer-reviewed",
  "meta-analysis": "Systematischer Review / Meta-Analyse",
  "guidelines": "Leitlinie / Konsensus",
  "government": "Behoerde / Regierung",
};

const TYPE_COLOR: Record<string, string> = {
  "peer-reviewed": "bg-blue-500/15 text-blue-300 border-blue-500/30",
  "meta-analysis": "bg-violet-500/15 text-violet-300 border-violet-500/30",
  "guidelines": "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  "government": "bg-amber-500/15 text-amber-300 border-amber-500/30",
};

const KATEGORIEN = [
  { slug: "allergie", label: "Futterallergien & Unvertraeglichkeiten" },
  { slug: "gelenke", label: "Gelenkerkrankungen & Arthrose" },
  { slug: "uebergewicht", label: "Uebergewicht & Koerperkondition" },
  { slug: "pankreas", label: "Pankreaserkrankungen" },
  { slug: "niere", label: "Nierenerkrankungen" },
  { slug: "leber", label: "Lebererkrankungen" },
  { slug: "haut", label: "Haut & Fell" },
  { slug: "omega-3", label: "Omega-3-Fettsaeuren" },
  { slug: "getreidefrei", label: "Getreidefrei & DCM" },
  { slug: "ernaehrung-allgemein", label: "Allgemeine Ernaehrungsgrundlagen" },
];

export default function QuellenPage() {
  const byKategorie: Record<string, typeof STUDIEN> = {};
  for (const kat of KATEGORIEN) {
    byKategorie[kat.slug] = STUDIEN.filter((s) => s.kategorie.includes(kat.slug));
  }

  const schemaItems = STUDIEN.map((s, i) => ({
    "@type": "ScholarlyArticle",
    position: i + 1,
    headline: s.title,
    author: s.authors,
    datePublished: String(s.year),
    ...(s.doi ? { identifier: `https://doi.org/${s.doi}` } : {}),
    ...(s.url ? { url: s.url } : {}),
  }));

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <JsonLd data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Wissenschaftliche Quellen — welches-hundefutter.today",
            numberOfItems: STUDIEN.length,
            itemListElement: schemaItems,
          }} />

      <nav className="max-w-5xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">.</span>
        <span className="text-[var(--ink)]">Wissenschaftliche Quellen</span>
      </nav>

      {/* HERO */}
      <section className="hero-glow max-w-5xl mx-auto w-full px-5 pt-8 pb-14">
        <span className="pill mb-4">Transparenz & EEAT</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
          Wissenschaftliche Quellen
        </h1>
        <p className="text-[var(--muted)] leading-relaxed max-w-2xl mb-6">
          Alle Ratgeber auf welches-hundefutter.today basieren auf peer-reviewten Studien,
          internationalen Leitlinien und behoerdlichen Richtlinien. Diese Seite listet
          saemtliche Quellenbelege — mit DOI, PubMed-ID und Kernaussage.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[var(--muted)]">
            {STUDIEN.length} Studien & Leitlinien
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[var(--muted)]">
            {STUDIEN.filter((s) => s.type === "peer-reviewed").length} Peer-reviewed
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[var(--muted)]">
            {STUDIEN.filter((s) => s.type === "meta-analysis").length} Systematische Reviews
          </span>
        </div>
      </section>

      {/* HINWEIS */}
      <section className="max-w-5xl mx-auto w-full px-5 pb-8">
        <div className="card p-5 border-l-4 border-amber-500/60">
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            <strong className="text-[var(--ink)]">Wichtiger Hinweis:</strong> Die Inhalte auf dieser Website dienen ausschliesslich der
            Informationsvermittlung und ersetzen keine tieraerztliche Beratung. Bei gesundheitlichen Fragen zu
            deinem Hund wende dich immer an einen approbierten Tierarzt. Ernaehrungsempfehlungen sollten
            mit dem behandelnden Tierarzt abgestimmt werden, besonders bei Vorerkrankungen.
          </p>
        </div>
      </section>

      {/* KATEGORISIERTE STUDIEN */}
      {KATEGORIEN.map((kat) => {
        const studien = byKategorie[kat.slug];
        if (!studien || studien.length === 0) return null;
        return (
          <section key={kat.slug} className="max-w-5xl mx-auto w-full px-5 py-8">
            <h2 className="text-xl font-extrabold tracking-tight mb-5" id={kat.slug}>
              {kat.label}
            </h2>
            <div className="space-y-4">
              {studien.map((s) => (
                <div key={s.id} className="card p-6">
                  <div className="flex flex-wrap items-start gap-2 mb-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${TYPE_COLOR[s.type]}`}>
                      {TYPE_LABEL[s.type]}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[var(--muted)]">
                      {s.year}
                    </span>
                    {s.pmid && (
                      <a
                        href={s.url ?? `https://pubmed.ncbi.nlm.nih.gov/${s.pmid}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        PubMed {s.pmid}
                      </a>
                    )}
                    {s.doi && (
                      <a
                        href={`https://doi.org/${s.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        DOI
                      </a>
                    )}
                    {!s.pmid && !s.doi && s.url && (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[var(--muted)] hover:text-white transition-colors"
                      >
                        Quelle ansehen
                      </a>
                    )}
                  </div>

                  <p className="font-semibold text-sm leading-tight mb-1">{s.title}</p>
                  <p className="text-xs text-[var(--muted)] mb-3">
                    {s.authors} &mdash; <em>{s.journal}</em>{s.volume ? `, ${s.volume}` : ""} ({s.year})
                  </p>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">
                    <strong className="text-[var(--ink)]">Kernaussage:</strong> {s.kernaussage}
                  </p>

                  {s.relevanteSlugs.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className="text-[10px] text-[var(--muted)]">Relevant fuer:</span>
                      {s.relevanteSlugs.map((slug) => (
                        <Link
                          key={slug}
                          href={`/problem/${slug}`}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 hover:bg-orange-500/20 transition-colors"
                        >
                          {slug}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* INSTITUTIONELLE QUELLEN */}
      <section className="max-w-5xl mx-auto w-full px-5 py-8">
        <h2 className="text-xl font-extrabold tracking-tight mb-5">
          Institutionelle Quellen & Leitlinienorganisationen
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              name: "IRIS — International Renal Interest Society",
              url: "http://www.iris-kidney.com",
              beschreibung: "Internationalte Gesellschaft fuer Nierenerkrankungen bei Tieren. Herausgeber der CKD-Staging-Leitlinien.",
            },
            {
              name: "WSAVA — World Small Animal Veterinary Association",
              url: "https://wsava.org/global-guidelines/nutrition-guidelines/",
              beschreibung: "Herausgeber globaler Ernaehrungsleitlinien fuer Kleintierpraxis. Empfiehlt Ernaehrungsbewertung als 5. Vitalzeichen.",
            },
            {
              name: "FDA — U.S. Food and Drug Administration",
              url: "https://www.fda.gov/animal-veterinary",
              beschreibung: "Behoerde fuer Lebensmittelsicherheit inkl. Tiernahrung. Fuer DCM/Getreidefrei-Untersuchung 2018-2019 relevant.",
            },
            {
              name: "ESVCN — European Society of Veterinary and Comparative Nutrition",
              url: "https://www.esvcn.eu",
              beschreibung: "Europaeische veterinaeradiaetetische Fachgesellschaft. Setzt Qualitaetsstandards fuer Tiernahrungsforschung.",
            },
            {
              name: "BfR — Bundesinstitut fuer Risikobewertung",
              url: "https://www.bfr.bund.de",
              beschreibung: "Deutsche Behoerde fuer Risikobewertung von Lebensmitteln, auch Tiernahrung. DACH-relevante Empfehlungen.",
            },
            {
              name: "Tieraerztliche Hochschule Hannover (TiHo)",
              url: "https://www.tiho-hannover.de",
              beschreibung: "Fuehrende veterinaarmedizinische Hochschule in Deutschland. Forschungsschwerpunkt u.a. Kleintiermedizin und Ernaehrung.",
            },
          ].map((inst) => (
            <a
              key={inst.name}
              href={inst.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card card-hover p-5 block"
            >
              <p className="font-semibold text-sm mb-1">{inst.name}</p>
              <p className="text-xs text-[var(--muted)] leading-relaxed">{inst.beschreibung}</p>
              <p className="text-[10px] text-[var(--honey)] mt-2">Zur Website →</p>
            </a>
          ))}
        </div>
      </section>

      {/* METHODIK-LINK */}
      <section className="max-w-5xl mx-auto w-full px-5 py-8">
        <div className="rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 p-8">
          <h2 className="text-xl font-extrabold tracking-tight mb-3">BELLA-Score Methodik</h2>
          <p className="text-[var(--muted)] text-sm mb-5 leading-relaxed">
            Der BELLA-Score bewertet 11.000+ Hundefutter-Sorten nach Proteinquelle, Deklarationstransparenz
            und Preis-Leistung. Die genaue Berechnung, die verwendeten Gewichtungen und die Grenzen
            der Methodik sind auf der Methodik-Seite dokumentiert.
          </p>
          <Link href="/analyse/methodik" className="btn-primary text-sm">
            Methodik & Scoring ansehen →
          </Link>
        </div>
      </section>

      <AuthorBox reviewedAt="2026-06-06" />
      <SiteFooter />
    </div>
  );
}
