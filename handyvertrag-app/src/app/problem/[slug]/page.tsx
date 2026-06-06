import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import { PROBLEMS, PROBLEM_BY_SLUG } from "@/data/problems";
import { FUTTERTYP_BY_SLUG } from "@/data/futtertypen";
import { PROBLEM_TO_FUTTERTYPEN } from "@/lib/issue-to-problem";
import ScoreBadge from "@/components/ScoreBadge";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 86400;

export function generateStaticParams() {
  return PROBLEMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = PROBLEM_BY_SLUG[slug];
  if (!p) return {};
  return {
    title: `${p.tagline} | BELLA – KI-Hundefutterberaterin`,
    description: `${p.description.slice(0, 150)}… BELLA findet das passende Futter aus 8.000+ Sorten.`,
    alternates: { canonical: `https://welches-hundefutter.today/problem/${p.slug}` },
  };
}

interface FoodRow {
  brand: string; name: string; type: string; protein: string | null;
  price_per_kg: string | null; is_grain_free: boolean; is_hypoallergenic: boolean;
  affiliate_url: string; score: number | null;
}

async function getFoodsForProblem(grainFree: boolean, hypo: boolean): Promise<FoodRow[]> {
  const url = process.env.DATABASE_URL;
  if (!url) return [];
  try {
    const sql = neon(url);
    const nameKey = "lower(regexp_replace(name, '[^a-zA-Z0-9]', '', 'g'))";
    const filter = [
      "is_active = true", "affiliate_url <> ''", "name <> ''",
      "price_per_kg BETWEEN 2 AND 60", "type <> 'snack'",
      ...(grainFree ? ["is_grain_free = true"] : []),
      ...(hypo ? ["is_hypoallergenic = true"] : []),
    ].join(" AND ");
    const bias = (grainFree || hypo)
      ? "(CASE WHEN (is_hypoallergenic OR is_grain_free) THEN 1 ELSE 0 END) DESC, "
      : "";
    const rows = await sql.query(
      `SELECT * FROM (
         SELECT DISTINCT ON (${nameKey}) brand, name, type, protein, price_per_kg,
           is_grain_free, is_hypoallergenic, affiliate_url, score
         FROM dog_foods WHERE ${filter}
         ORDER BY ${nameKey}, price_per_kg ASC
       ) d ORDER BY ${bias} price_per_kg ASC LIMIT 6`,
      []
    );
    return ((rows as unknown as { rows?: FoodRow[] }).rows ?? (rows as unknown as FoodRow[])) || [];
  } catch { return []; }
}

export default async function ProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const problem = PROBLEM_BY_SLUG[slug];
  if (!problem) notFound();

  const foods = await getFoodsForProblem(!!problem.filterGrainFree, !!problem.filterHypo);

  const faqItems = [
    {
      question: `Was ist das beste Hundefutter bei ${problem.name}?`,
      answer: `${problem.recommendedCriteria.join(", ")} sind entscheidend. ${problem.description.slice(0, 100)}…`,
    },
    {
      question: `Welche Zutaten sollte Futter bei ${problem.name} vermeiden?`,
      answer: `Folgendes vermeiden: ${problem.avoidIngredients.join(", ")}.`,
    },
  ];

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData type="faq" faqs={faqItems} />

      <nav className="max-w-5xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <Link href="/faq" className="hover:text-[var(--honey)]">Ratgeber</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">{problem.tagline}</span>
      </nav>

      {/* HERO */}
      <section className="hero-glow max-w-5xl mx-auto w-full px-5 pt-8 pb-14">
        <span className="pill mb-4">🩺 Gesundheits-Ratgeber</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
          {problem.tagline}
        </h1>
        <p className="text-[var(--muted)] leading-relaxed max-w-2xl mb-8">{problem.description}</p>
        <Link href="/#bella-advisor" className="btn-primary">
          BELLA fragt nach deinem Hund → passende Sorten in 60 s
        </Link>
      </section>

      {/* VERMEIDEN / EMPFEHLEN */}
      <section className="max-w-5xl mx-auto w-full px-5 py-10">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="card p-6">
            <h2 className="text-lg font-bold tracking-tight mb-4 text-rose-300">❌ Das vermeiden</h2>
            <ul className="space-y-2">
              {problem.avoidIngredients.map((i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                  <span className="mt-0.5 text-rose-400">✕</span> {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-bold tracking-tight mb-4 text-emerald-300">✓ Darauf achten</h2>
            <ul className="space-y-2">
              {problem.recommendedCriteria.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                  <span className="mt-0.5 text-emerald-400">✓</span> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* EEAT-EXPERTEN-BLOCK: Allergie */}
      {slug === "allergie" && (
        <section className="max-w-5xl mx-auto w-full px-5 py-10">
          <div className="card p-8">
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Futterallergie beim Hund: Was du wissen solltest</h2>
            <div className="space-y-5 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                <strong>Echte Futterallergie vs. Unverträglichkeit:</strong> Nur etwa 10 % aller Hautsymptome beim
                Hund sind echte IgE-vermittelte Allergien mit einer Immunreaktion. Die meisten Fälle sind
                Unverträglichkeiten — ohne Immunbeteiligung, oft dosisabhängig und langsamer in der Ausprägung.
                Der praktische Unterschied: Eine Allergie tritt bereits bei kleinsten Mengen des Auslösers auf,
                eine Unverträglichkeit kann sich über Wochen aufbauen. Für die Diagnose ist das relevant,
                weil Eliminationsdiäten bei echten Allergien strenger durchgeführt werden müssen.
              </p>
              <p>
                <strong>Die häufigsten Allergene:</strong> Laut Studienlage sind die häufigsten Futtermittelallergene
                beim Hund <strong>Huhn (34 %)</strong>, Rind (17 %), Milchprodukte (17 %), Weizen (15 %) und Lamm (14 %).
                Nicht Getreide als Gruppe steht an erster Stelle — sondern tierische Proteine. Eine Umstellung auf
                getreidefrei allein löst daher keine Huhn- oder Rindfleisch-Allergie. Wer wegen Allergie-Verdachts
                das Futter wechselt, muss auch die Proteinquelle wechseln.
              </p>
              <p>
                <strong>Eliminationsdiät — wie sie funktioniert:</strong> Das anerkannte Diagnoseverfahren sind
                8–12 Wochen mit ausschließlich einer einzigen, bisher unbekannten Proteinquelle (z. B. Insekten,
                Pferd, Känguru). Alle anderen Futter, Snacks und Tafelfleisch sind in diesem Zeitraum verboten —
                auch Kaustangen oder aromatisierte Zahnpflegeprodukte. Ohne konsequente Durchführung ist das
                Ergebnis wertlos. Die Diagnose gilt als bestätigt, wenn nach Rückführung des Verdachts-Proteins
                die Symptome wiederkehren.
              </p>
              <p>
                <strong>BELLAs Empfehlung für die Erstdiagnose:</strong> <strong>Insektenprotein</strong> (Hermetia
                illucens, die Schwarze Soldatenfliege) eignet sich besonders gut als Ausgangsprotein bei
                Allergie-Verdacht — die meisten Hunde hatten noch nie Kontakt damit, daher besteht keine
                Vorimmunisierung. Nach 8 Wochen Symptomfreiheit folgt die sukzessive Reintroduktion einzelner
                Proteinquellen, um den tatsächlichen Auslöser zu identifizieren. Dieses Vorgehen sollte
                begleitend mit einem Tierarzt abgestimmt werden.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* EEAT-EXPERTEN-BLOCK: Übergewicht */}
      {slug === "uebergewicht" && (
        <section className="max-w-5xl mx-auto w-full px-5 py-10">
          <div className="card p-8">
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Übergewicht beim Hund: Was du wissen solltest</h2>
            <div className="space-y-5 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                Übergewicht beim Hund ist kein Randproblem: Laut einer Auswertung der Veterinärmedizinischen
                Universität Wien (2022) sind rund <strong>54 % der deutschen Hunde übergewichtig</strong>.
                Die gesundheitlichen Folgen sind gut belegt — erhöhte Gelenkbelastung, Herzkreislauf-Risiken
                und eine nachweislich verkürzte Lebenserwartung: Adipöse Hunde leben im Schnitt bis zu
                2,5 Jahre kürzer als normalgewichtige Tiere der gleichen Rasse.
              </p>
              <p>
                <strong>Body Condition Score (BCS) — die Rippen-Probe:</strong> Der einfachste Test ohne
                Waage ist der Rippen-Tasttest. Kannst du die Rippen deines Hundes durch das Fell ertasten,
                ohne dass sie sichtbar vorstehen? Dann liegt der Hund wahrscheinlich im idealen
                BCS-Bereich (5 von 9). Sind die Rippen nicht zu ertasten, besteht Übergewicht.
                Die meisten Halter unterschätzen das Gewicht ihres Hundes — das ist keine Ausnahme,
                sondern der Normalfall. Tiere, die täglich gesehen werden, werden unbewusst als „normal" wahrgenommen.
              </p>
              <p>
                <strong>Kalorienreduktion praktisch umgesetzt:</strong> Eine gesunde Gewichtsabnahme liegt
                bei 1–2 % des Körpergewichts pro Woche. Das entspricht einer Reduktion des Kalorienbedarfs
                um 20–25 % gegenüber dem Erhaltungsbedarf. Nassfutter oder mit Wasser aufgequollenes
                Trockenfutter erhöht die Sättigungszeit bei gleicher oder geringerer Kalorienmenge.
                Snacks müssen vollständig aus der täglichen Ration abgezogen werden — nicht zusätzlich
                gegeben werden.
              </p>
              <p>
                <strong>Light-Futter — nötig oder nicht?</strong> Spezielles Light-Futter ist oft teurer,
                aber nicht grundsätzlich nötig. Es enthält mehr Füllstoffe wie Cellulose, was das Volumen
                erhöht aber den Nährwert nicht verbessert. Normales hochwertiges Futter, korrekt dosiert
                und mit dem tatsächlichen Tagesbedarf des Hundes abgeglichen, erzielt gleichwertige
                Ergebnisse. Der entscheidende Faktor ist die präzise Gramm-Dosierung — nicht das
                Produktlabel.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* FUTTER-EMPFEHLUNGEN */}
      <section className="max-w-5xl mx-auto w-full px-5 py-10">
        <h2 className="text-2xl font-extrabold tracking-tight mb-2">
          Empfohlenes Futter bei {problem.name}
        </h2>
        <p className="text-[var(--muted)] text-sm mb-7">
          Aus über 8.000 Sorten im Live-Katalog{problem.filterGrainFree ? " · getreidefrei" : ""}{problem.filterHypo ? " · hypoallergen" : ""} · Affiliate-Links (rel=sponsored)
        </p>
        {foods.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {foods.map((f, i) => (
              <a key={i} href={f.affiliate_url} target="_blank"
                rel="sponsored nofollow noopener noreferrer" className="card card-hover p-5 block">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(240,167,60,0.14)] text-[#ffcd8a] capitalize">{f.type}</span>
                  {f.protein && <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300">{f.protein}</span>}
                  {f.is_grain_free && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300">getreidefrei</span>}
                  {f.is_hypoallergenic && <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300">hypoallergen</span>}
                  {f.score != null && <ScoreBadge score={f.score} />}
                </div>
                <p className="font-semibold text-sm leading-tight">{f.name}</p>
                <p className="text-[var(--muted)] text-xs mt-0.5">{f.brand}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-black">
                    {f.price_per_kg ? `${parseFloat(f.price_per_kg).toFixed(2)} €` : ""}
                    <span className="text-xs font-medium text-[var(--muted)]">/kg</span>
                  </span>
                  <span className="text-xs text-[var(--honey)] font-semibold">Ansehen →</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="card p-6 text-center text-[var(--muted)] mb-10">
            BELLA findet live die passende Sorte — frag jetzt oben.
          </div>
        )}
      </section>

      {/* CTA → BELLA-Profil */}
      <section className="max-w-5xl mx-auto w-full px-5 pb-16">
        <div className="rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 p-8 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">
            Lass BELLA einen Futterplan speziell für deinen Hund erstellen
          </h2>
          <p className="text-[var(--muted)] mb-6 max-w-xl mx-auto">
            BELLA fragt nach Rasse, Alter, Gewicht und Allergien — und empfiehlt in 60 Sekunden
            die passenden Sorten. Kostenlos, ohne Anmeldung.
          </p>
          <Link href="/#bella-advisor" className="btn-primary">
            🐕 BELLA jetzt fragen — Futterplan erstellen →
          </Link>
        </div>
      </section>

      {/* Passende Futtertypen */}
      {(PROBLEM_TO_FUTTERTYPEN[slug] ?? []).length > 0 && (
        <section className="max-w-5xl mx-auto w-full px-5 pb-10">
          <h3 className="text-lg font-bold mb-4">Empfohlene Futtertypen bei {problem.name}</h3>
          <div className="flex flex-wrap gap-2">
            {(PROBLEM_TO_FUTTERTYPEN[slug] ?? []).map((ftSlug) => {
              const ft = FUTTERTYP_BY_SLUG[ftSlug];
              if (!ft) return null;
              return (
                <Link key={ftSlug} href={`/futtertyp/${ftSlug}`}
                  className="text-sm px-4 py-2 rounded-xl border border-orange-500/30 text-orange-200 bg-orange-500/10 hover:bg-orange-500/20 transition-colors">
                  {ft.emoji} {ft.name}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Verwandte Probleme */}
      <section className="max-w-5xl mx-auto w-full px-5 pb-16">
        <h3 className="text-lg font-bold mb-4">Weitere Gesundheits-Ratgeber</h3>
        <div className="flex flex-wrap gap-2">
          {PROBLEMS.filter((p) => p.slug !== slug).slice(0, 8).map((p) => (
            <Link key={p.slug} href={`/problem/${p.slug}`}
              className="text-sm px-4 py-2 rounded-xl border border-white/10 text-[var(--muted)] hover:text-white hover:border-orange-500/40 transition-colors">
              {p.name}
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
