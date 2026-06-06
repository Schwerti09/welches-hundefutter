import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import { FUTTERTYPEN, FUTTERTYP_BY_SLUG } from "@/data/futtertypen";
import { PROBLEM_BY_SLUG } from "@/data/problems";
import { FUTTERTYP_TO_PROBLEME } from "@/lib/issue-to-problem";
import ScoreBadge from "@/components/ScoreBadge";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 86400;

export function generateStaticParams() {
  return FUTTERTYPEN.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const f = FUTTERTYP_BY_SLUG[slug];
  if (!f) return {};
  return {
    title: `${f.tagline} | BELLA – KI-Hundefutterberaterin`,
    description: `${f.description.slice(0, 155)}… BELLA vergleicht über 8.000 Sorten und empfiehlt das passende.`,
    alternates: { canonical: `https://welches-hundefutter.today/futtertyp/${f.slug}` },
  };
}

interface FoodRow {
  brand: string; name: string; type: string; protein: string | null;
  price_per_kg: string | null; is_grain_free: boolean; is_hypoallergenic: boolean;
  affiliate_url: string; score: number | null;
}

async function getFoodsByType(dbType: string, grainFree: boolean, hypo: boolean): Promise<FoodRow[]> {
  const url = process.env.DATABASE_URL;
  if (!url) return [];
  try {
    const sql = neon(url);
    const nameKey = "lower(regexp_replace(name, '[^a-zA-Z0-9]', '', 'g'))";
    const filters = [
      "is_active = true", "affiliate_url <> ''", "name <> ''", "price_per_kg BETWEEN 2 AND 60",
      `type = '${dbType.replace(/'/g, "''")}'`,
      ...(grainFree ? ["is_grain_free = true"] : []),
      ...(hypo ? ["is_hypoallergenic = true"] : []),
    ].join(" AND ");
    // Fallback: wenn kein Treffer mit strengem Filter, alle aktiven dieses Typs
    const rows = await sql.query(
      `SELECT * FROM (
         SELECT DISTINCT ON (${nameKey}) brand, name, type, protein, price_per_kg,
           is_grain_free, is_hypoallergenic, affiliate_url, score
         FROM dog_foods WHERE ${filters}
         ORDER BY ${nameKey}, price_per_kg ASC
       ) d ORDER BY price_per_kg ASC LIMIT 6`,
      []
    );
    const data = ((rows as unknown as { rows?: FoodRow[] }).rows ?? (rows as unknown as FoodRow[])) || [];
    if (data.length > 0) return data;
    // Fallback: ohne Grain-Free/Hypo-Filter
    const fallback = await sql.query(
      `SELECT * FROM (
         SELECT DISTINCT ON (${nameKey}) brand, name, type, protein, price_per_kg,
           is_grain_free, is_hypoallergenic, affiliate_url
         FROM dog_foods WHERE is_active = true AND affiliate_url <> '' AND name <> ''
           AND price_per_kg BETWEEN 2 AND 60 AND type <> 'snack'
         ORDER BY ${nameKey}, price_per_kg ASC
       ) d ORDER BY price_per_kg ASC LIMIT 6`,
      []
    );
    return ((fallback as unknown as { rows?: FoodRow[] }).rows ?? (fallback as unknown as FoodRow[])) || [];
  } catch { return []; }
}

export default async function FuttertypPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const typ = FUTTERTYP_BY_SLUG[slug];
  if (!typ) notFound();

  const foods = await getFoodsByType(typ.dbType, slug === "getreidefrei", slug === "hypoallergen" || slug === "monoprotein");

  const faqItems = [
    {
      question: `Was ist ${typ.name} für Hunde?`,
      answer: typ.description.slice(0, 200),
    },
    {
      question: `Für welche Hunde ist ${typ.name} geeignet?`,
      answer: typ.idealFor.join(", ") + ".",
    },
    {
      question: `Was kostet ${typ.name}?`,
      answer: `${typ.name} kostet typischerweise ${typ.priceRange} — je nach Marke und Qualität.`,
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
        <span className="text-[var(--ink)]">{typ.name}</span>
      </nav>

      {/* HERO */}
      <section className="hero-glow max-w-5xl mx-auto w-full px-5 pt-8 pb-14">
        <span className="pill mb-4">{typ.emoji} Futtertyp-Ratgeber</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
          {typ.tagline}
        </h1>
        <p className="text-[var(--muted)] leading-relaxed max-w-2xl mb-8">{typ.description}</p>
        <div className="flex gap-3 flex-wrap">
          <Link href="/#bella-advisor" className="btn-primary">BELLA findet das Beste für deinen Hund →</Link>
          <span className="self-center text-xs text-[var(--muted)]">{typ.priceRange} typisch</span>
        </div>
      </section>

      {/* PROS / CONS */}
      <section className="max-w-5xl mx-auto w-full px-5 py-10">
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          <div className="card p-6">
            <h2 className="text-lg font-bold tracking-tight mb-4 text-emerald-300">✓ Vorteile</h2>
            <ul className="space-y-2">
              {typ.pros.map((pro) => (
                <li key={pro} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                  <span className="mt-0.5 text-emerald-400">✓</span> {pro}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-bold tracking-tight mb-4 text-rose-300">⚠ Nachteile</h2>
            <ul className="space-y-2">
              {typ.cons.map((con) => (
                <li key={con} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                  <span className="mt-0.5 text-amber-400">!</span> {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="card p-5">
          <p className="text-sm font-semibold mb-2">Ideal für:</p>
          <div className="flex flex-wrap gap-2">
            {typ.idealFor.map((i) => (
              <span key={i} className="text-xs px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[var(--muted)]">{i}</span>
            ))}
          </div>
        </div>
      </section>

      {/* EEAT-EXPERTEN-BLOCK: Getreidefrei */}
      {slug === "getreidefrei" && (
        <section className="max-w-5xl mx-auto w-full px-5 py-10">
          <div className="card p-8">
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Getreidefrei: Was du wissen solltest</h2>
            <div className="space-y-5 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                <strong>Was „getreidefrei" wirklich bedeutet:</strong> Getreidefrei heißt: kein Weizen, Mais,
                Gerste, Roggen, Hafer, Reis. Stattdessen werden Kohlenhydrate aus Kartoffel, Erbse,
                Süßkartoffel oder Linsen verwendet. Das ist kein Low-Carb — der Gesamtkohlenhydratgehalt
                kann bei getreidefrei-Futter identisch oder sogar höher sein als bei Futter mit Vollkornreis.
                Wer Low-Carb für seinen Hund möchte, muss explizit auf den Kohlenhydratgehalt achten,
                nicht nur auf das „getreidefrei"-Label.
              </p>
              <p>
                <strong>Der DCM-Verdacht — aktueller Stand:</strong> 2018 warnte die US-amerikanische FDA
                vor einem möglichen Zusammenhang zwischen getreidefrei-Futter mit hohem Hülsenfruchtanteil
                und <strong>dilatativer Kardiomyopathie (DCM)</strong> beim Hund. Stand 2024 ist kein kausaler
                Zusammenhang wissenschaftlich belegt. Eine Studie der Tufts University (2023) konnte keine
                statistische Signifikanz nachweisen. Das Thema gilt als nicht abgeschlossen. Für Rassen mit
                genetischer DCM-Disposition — darunter Dobermann, Boxer und Irischer Wolfshund — ist
                tierärztliche Rücksprache bei dauerhafter getreidefrei-Ernährung empfehlenswert.
              </p>
              <p>
                <strong>Wann getreidefrei sinnvoll ist:</strong> Bei nachgewiesener Getreide-Unverträglichkeit
                (durch Eliminationsdiät bestätigt), bei Hunden mit wiederkehrenden Hautsymptomen als
                Versuchsumstellung sowie als Basis für eine Eliminationsdiät, wenn Getreide als
                möglicher Auslöser ausgeschlossen werden soll. In diesen Fällen hat die Umstellung
                eine klare Begründung.
              </p>
              <p>
                <strong>Wann getreidefrei nicht nötig ist:</strong> Bei gesunden Hunden ohne Symptome gibt
                es keine belastbaren Belege dafür, dass getreidefrei-Futter gesünder ist als qualitativ
                hochwertiges Futter mit Getreide. <strong>Vollkornreis und Hafer sind gut verdaulich</strong>
                und liefern Ballaststoffe und Spurenelemente. Die Gleichsetzung „getreidefrei = besser"
                ist ein Marketingmythos — sie hat keinen wissenschaftlichen Rückhalt für den
                asymptomatischen Hund.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* PRODUKTE */}
      <section className="max-w-5xl mx-auto w-full px-5 py-10">
        <h2 className="text-2xl font-extrabold tracking-tight mb-2">
          {typ.name} im Preisvergleich
        </h2>
        <p className="text-[var(--muted)] text-sm mb-7">
          Live-Preise aus 8.000+ Sorten · täglich aktualisiert · Affiliate-Links (rel=sponsored)
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

      {/* CTA */}
      <section className="max-w-5xl mx-auto w-full px-5 pb-16">
        <div className="rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 p-8 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">
            Welches {typ.name} passt genau zu deinem Hund?
          </h2>
          <p className="text-[var(--muted)] mb-6 max-w-xl mx-auto">
            BELLA fragt nach Rasse, Alter, Gewicht und Allergien und empfiehlt
            in 60 Sekunden die optimale Sorte — kostenlos.
          </p>
          <Link href="/#bella-advisor" className="btn-primary">🐕 BELLA fragen — Profil + Empfehlung →</Link>
        </div>
      </section>

      {/* Passende Gesundheitsthemen */}
      {(FUTTERTYP_TO_PROBLEME[slug] ?? []).length > 0 && (
        <section className="max-w-5xl mx-auto w-full px-5 pb-10">
          <h3 className="text-lg font-bold mb-4">{typ.name} hilft bei diesen Gesundheitsthemen</h3>
          <div className="flex flex-wrap gap-2">
            {(FUTTERTYP_TO_PROBLEME[slug] ?? []).map((pSlug) => {
              const prob = PROBLEM_BY_SLUG[pSlug];
              if (!prob) return null;
              return (
                <Link key={pSlug} href={`/problem/${pSlug}`}
                  className="text-sm px-4 py-2 rounded-xl border border-rose-500/30 text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 transition-colors">
                  🩺 {prob.name}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Andere Futtertypen */}
      <section className="max-w-5xl mx-auto w-full px-5 pb-16">
        <h3 className="text-lg font-bold mb-4">Andere Futtertypen</h3>
        <div className="flex flex-wrap gap-2">
          {FUTTERTYPEN.filter((f) => f.slug !== slug).map((f) => (
            <Link key={f.slug} href={`/futtertyp/${f.slug}`}
              className="text-sm px-4 py-2 rounded-xl border border-white/10 text-[var(--muted)] hover:text-white hover:border-orange-500/40 transition-colors">
              {f.emoji} {f.name}
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
