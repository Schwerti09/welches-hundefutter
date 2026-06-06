import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import { BREEDS, BREED_BY_SLUG } from "@/data/breeds";
import gallery from "@/data/breed-gallery.json";
import { issueToProblemSlug } from "@/lib/issue-to-problem";
import ScoreBadge from "@/components/ScoreBadge";
import AuthorBox from "@/components/AuthorBox";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 86400; // täglich aktualisieren

const PHOTO: Record<string, string> = Object.fromEntries(
  (gallery as { slug: string; img: string }[]).map((g) => [g.slug, g.img])
);

export function generateStaticParams() {
  return BREEDS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const b = BREED_BY_SLUG[slug];
  if (!b) return {};
  const title = `${b.name} Futter: Das richtige Hundefutter für deinen ${b.name}`;
  const description = `Welches Futter passt zum ${b.name}? Bedarf, typische Gesundheitsthemen und von BELLA empfohlene Sorten — abgestimmt auf Größe, Aktivität & Allergien.`;
  return {
    title,
    description,
    alternates: { canonical: `https://welches-hundefutter.today/rasse/${b.slug}` },
    openGraph: { title, description, images: PHOTO[b.slug] ? [PHOTO[b.slug]] : [] },
  };
}

interface FoodRow {
  brand: string; name: string; type: string; protein: string | null;
  price_per_kg: string | null; is_grain_free: boolean; is_hypoallergenic: boolean;
  affiliate_url: string; image_url: string | null; score: number | null;
}

async function getBreedFoods(slug: string, allergyProne: boolean): Promise<FoodRow[]> {
  const url = process.env.DATABASE_URL;
  if (!url) return [];
  try {
    const sql = neon(url);
    const nameKey = "lower(regexp_replace(name, '[^a-zA-Z0-9]', '', 'g'))";
    const bias = allergyProne ? "(CASE WHEN (is_hypoallergenic OR is_grain_free) THEN 1 ELSE 0 END) DESC, " : "";
    const rows = await sql.query(
      `SELECT * FROM (
         SELECT DISTINCT ON (${nameKey}) brand, name, type, protein, price_per_kg,
           is_grain_free, is_hypoallergenic, affiliate_url, image_url, score
         FROM dog_foods
         WHERE is_active = true AND affiliate_url <> '' AND name <> '' AND price_per_kg BETWEEN 2 AND 60 AND type <> 'snack'
         ORDER BY ${nameKey}, price_per_kg ASC
       ) d ORDER BY ${bias} score DESC NULLS LAST, price_per_kg ASC LIMIT 6`,
      []
    );
    return ((rows as unknown as { rows?: FoodRow[] }).rows ?? (rows as unknown as FoodRow[])) || [];
  } catch {
    return [];
  }
}

const SIZE_LABEL: Record<string, string> = { klein: "Klein", mittel: "Mittel", gross: "Groß", sehrgross: "Sehr groß" };
const ACT_LABEL: Record<string, string> = { niedrig: "Niedrig", mittel: "Mittel", hoch: "Hoch", sehrhoch: "Sehr hoch" };

export default async function BreedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const breed = BREED_BY_SLUG[slug];
  if (!breed) notFound();

  const allergyProne = (breed.commonHealthIssues ?? []).some((i) => /allergi|haut|magen|darm|verdau/i.test(i));
  const foods = await getBreedFoods(breed.slug, allergyProne);
  const photo = PHOTO[breed.slug];

  const facts = [
    { k: "Größe", v: SIZE_LABEL[breed.size] ?? breed.size },
    breed.weightMin && breed.weightMax ? { k: "Gewicht", v: `${breed.weightMin}–${breed.weightMax} kg` } : null,
    breed.activityLevel ? { k: "Aktivität", v: ACT_LABEL[breed.activityLevel] ?? breed.activityLevel } : null,
    breed.lifeExpectancy ? { k: "Lebenserwartung", v: `${breed.lifeExpectancy} Jahre` } : null,
    breed.recommendedProteinPercentage ? { k: "Protein empf.", v: `~${breed.recommendedProteinPercentage} %` } : null,
  ].filter(Boolean) as { k: string; v: string }[];

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData type="organization" />

      {/* Breadcrumb */}
      <nav className="max-w-5xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">{breed.name}</span>
      </nav>

      {/* HERO */}
      <section className="relative hero-glow max-w-5xl mx-auto w-full px-5 pt-8 pb-14">
        <div className="grid md:grid-cols-[1fr_1.1fr] gap-8 items-center">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt={breed.name} className="w-full aspect-[4/3] object-cover rounded-3xl border border-white/10" />
          ) : (
            <div className="w-full aspect-[4/3] rounded-3xl border border-white/10 bg-white/5 flex items-center justify-center text-6xl">🐕</div>
          )}
          <div>
            <span className="pill mb-4">🐾 Rasse-Ratgeber</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Das richtige Futter für deinen <span className="text-accent">{breed.name}</span>
            </h1>
            <p className="text-[var(--muted)] leading-relaxed mb-6">{breed.description}</p>
            <div className="flex flex-wrap gap-2">
              {facts.map((f) => (
                <span key={f.k} className="text-xs px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[var(--muted)]">{f.k}: </span>
                  <span className="font-semibold">{f.v}</span>
                </span>
              ))}
            </div>
            <Link href="/#bella-advisor" className="btn-primary mt-7 text-sm">Frag BELLA zu deinem {breed.name} →</Link>
          </div>
        </div>
      </section>

      {/* FÜTTERUNG */}
      <section className="max-w-5xl mx-auto w-full px-5 py-10">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="card p-6">
            <h2 className="text-lg font-bold tracking-tight mb-3">Worauf es beim {breed.name}-Futter ankommt</h2>
            <p className="text-sm text-[var(--muted)] leading-relaxed">{breed.feedingNotes}</p>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-bold tracking-tight mb-3">Typische Gesundheitsthemen</h2>
            <div className="flex flex-wrap gap-2">
              {(breed.commonHealthIssues ?? []).map((i) => {
                const problemSlug = issueToProblemSlug(i);
                return problemSlug ? (
                  <Link key={i} href={`/problem/${problemSlug}`}
                    className="text-xs px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-400/20 text-rose-200 hover:bg-rose-500/20 hover:border-rose-400/40 transition-colors">
                    {i} →
                  </Link>
                ) : (
                  <span key={i} className="text-xs px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-400/20 text-rose-200">{i}</span>
                );
              })}
            </div>
            {allergyProne && (
              <p className="text-sm text-[var(--muted)] leading-relaxed mt-4">
                Diese Rasse neigt zu Allergien/Sensibilitäten — BELLA bevorzugt unten getreidefreie bzw. hypoallergene Sorten.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* EEAT-EXPERTEN-BLOCK: Labrador */}
      {breed.slug === "labrador-retriever" && (
        <section className="max-w-5xl mx-auto w-full px-5 py-10">
          <div className="card p-8">
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Labrador und Futter: Was du wissen solltest</h2>
            <div className="space-y-5 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                Der Labrador ist genetisch für Übergewicht prädisponiert. Das ist keine Übertreibung:
                Forscher der Universität Cambridge haben 2016 eine Mutation im <strong>POMC-Gen</strong> identifiziert,
                die bei schätzungsweise 25 % aller Labradors vorkommt und das Sättigungsgefühl direkt beeinträchtigt.
                Betroffene Hunde sind nicht „gierig" — sie spüren schlicht nicht, wann sie satt sind.
                Das bedeutet für die Fütterung: exakte Gramm-Dosierung nach Körpergewicht, kein Füttern nach Augenmaß,
                kein dauerhaft gefüllter Napf.
              </p>
              <p>
                <strong>Gelenkgesundheit und Futter:</strong> Hüftdysplasie (HD) und Ellenbogendysplasie (ED) sind die
                häufigsten orthopädischen Erkrankungen beim Labrador. Ob ein Hund HD entwickelt, hängt primär von Genetik
                und Aufzuchtbedingungen ab — nicht vom Futter allein. Aber Übergewicht beschleunigt die Symptomausprägung
                messbar. Ein Labrador mit 5 kg Übergewicht belastet seine Gelenke pro Schritt mit einem Vielfachen dieser
                Last. Futter mit angemessenem Proteingehalt (≥ 26 %) und <strong>Omega-3-Fettsäuren</strong> (EPA/DHA aus
                Meeresquellen) kann Gelenkentzündungen nicht heilen, aber die Entzündungsmarker niedrig halten und
                die Progression verlangsamen.
              </p>
              <p>
                <strong>Portionsbedarf und Futtertyp:</strong> Ein ausgewachsener Labrador wiegt typisch 25–36 kg.
                Der tatsächliche Tagesbedarf hängt von Aktivitätslevel, Kastrationsstatus und Alter ab — nicht von der
                Packungsangabe. Hersteller-Empfehlungen sind generell zu hoch angesetzt, weil mehr Futter mehr Umsatz
                bedeutet. Ein aktiver, 32 kg schwerer Labrador braucht ca. 370–420 g hochwertiges Trockenfutter mit
                einer Energiedichte von 3.700 kcal/kg täglich. BELLA berechnet das automatisch über die
                RER-Formel (70 × kg^0,75 × Aktivitätsfaktor).
              </p>
              <p>
                <strong>Worauf beim Kauf achten:</strong> Für Labradors empfehlen wir erstens ein Futter mit einem
                spezifisch benannten Fleisch als erster Zutat — kein „Fleisch und tierische Nebenerzeugnisse" ohne
                Herkunftsangabe. Zweitens einen Rohproteingehalt zwischen 26 und 32 % (höher bei sehr aktiven Hunden).
                Drittens möglichst keinen zugesetzten Zucker (Rübenzucker, Melasse) — er erhöht die Kaloriendichte
                ohne Nährwert. Nassfutter als Beimischung kann für gewichtsreduzierte Labradors sinnvoll sein:
                mehr Sättigung bei weniger kcal durch den hohen Wasseranteil.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* EEAT-EXPERTEN-BLOCK: Golden Retriever */}
      {breed.slug === "golden-retriever" && (
        <section className="max-w-5xl mx-auto w-full px-5 py-10">
          <div className="card p-8">
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Golden Retriever und Futter: Was du wissen solltest</h2>
            <div className="space-y-5 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                Golden Retriever haben laut der Morris Animal Foundation Lifetime Study eine genetisch erhöhte Krebsrate —
                schätzungsweise 60 % sterben an einer Krebserkrankung. Antioxidantienreiche Ernährung mit
                <strong> Omega-3-Fettsäuren</strong> (EPA/DHA) und <strong>Vitamin E</strong> wird in der Fachliteratur
                diskutiert und kann das Immunsystem unterstützen. Sie ist jedoch kein Schutz vor Krebs und ersetzt
                keine regelmäßige tierärztliche Vorsorge. Was du tun kannst: eine qualitativ hochwertige Ernährung
                mit nachweisbarem Fischanteil wählen und Übergewicht konsequent vermeiden — beides gilt als modulierend
                für systemische Entzündungsprozesse.
              </p>
              <p>
                <strong>Gewicht und Fütterungsdisziplin:</strong> Goldens sind übergewichtsgefährdet, aber weniger
                extrem als Labradors. Das Hauptproblem: Sie fressen weitgehend was da ist, ohne Protest.
                Anders als der Labrador fehlt hier eine bekannte genetische Ursache — es ist eher
                Konditionierung und die hohe Akzeptanz für Leckerlis. Konsequente Portionierung und das
                Einrechnen aller Snacks in die Tagesration sind entscheidend.
              </p>
              <p>
                <strong>Fell und Fettsäure-Verhältnis:</strong> Das dichte Doppelfell des Golden Retrievers reagiert
                empfindlich auf ein ungünstiges Omega-6 zu Omega-3-Verhältnis. Ideal ist ein Verhältnis von etwa 5:1.
                Billigfutter mit hohem Anteil an <strong>Sonnenblumenöl</strong> verschiebt das Verhältnis stark
                in Richtung Omega-6 — das fördert Entzündungsreaktionen und kann sich in trockenem Fell,
                Schuppen oder Hautirritationen zeigen. Lachs- oder Leinöl als Ergänzung kann das Gleichgewicht
                korrigieren, wenn das Grundfutter keine ausreichenden Omega-3-Quellen enthält.
              </p>
              <p>
                <strong>Futterauswahl für Goldens:</strong> Gut geeignet sind Sorten mit <strong>Lachs oder Weißfisch</strong>
                als Hauptprotein, moderatem Fettgehalt zwischen 14 und 18 % sowie einer klaren Deklaration der
                Zutaten. Bei Hautsymptomen lohnt ein Versuch mit getreidefrei — nicht weil Getreide per se schlecht
                ist, sondern weil ein Wechsel der Kohlenhydratquelle manchmal Unverträglichkeiten aufdeckt.
                Rohproteingehalt zwischen 26 und 30 % ist für durchschnittlich aktive Goldens angemessen.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* EMPFOHLENE PRODUKTE */}
      <section className="max-w-5xl mx-auto w-full px-5 py-10">
        <h2 className="text-2xl font-extrabold tracking-tight mb-2">
          Empfohlenes Futter für deinen {breed.name}
        </h2>
        <p className="text-[var(--muted)] text-sm mb-7">
          Aus über 8.000 Sorten — {allergyProne ? "verträglich & " : ""}fair im Preis. Affiliate-Links (rel=sponsored).
        </p>
        {foods.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {foods.map((f, i) => (
              <a
                key={i}
                href={f.affiliate_url}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="card card-hover p-5 block"
              >
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(240,167,60,0.14)] text-[#ffcd8a] capitalize">{f.type}</span>
                  {f.protein && <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300">{f.protein}</span>}
                  {f.is_grain_free && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300">getreidefrei</span>}
                  {f.score != null && <ScoreBadge score={f.score} />}
                </div>
                <p className="font-semibold text-sm leading-tight">{f.name}</p>
                <p className="text-[var(--muted)] text-xs mt-0.5">{f.brand}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-black">{f.price_per_kg ? `${parseFloat(f.price_per_kg).toFixed(2)} €` : ""}<span className="text-xs font-medium text-[var(--muted)]">/kg</span></span>
                  <span className="text-xs text-[var(--honey)] font-semibold">Zum Futter →</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="card p-6 text-center text-[var(--muted)]">
            Frag BELLA oben im Chat — sie findet live das passende Futter für deinen {breed.name}.
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto w-full px-5 py-12 text-center">
        <div className="card p-8">
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">Unsicher, welche Sorte für deinen {breed.name}?</h2>
          <p className="text-[var(--muted)] mb-6 max-w-xl mx-auto">BELLA fragt nach Alter, Allergien & Vorlieben und empfiehlt in 60 Sekunden die passende Sorte — kostenlos.</p>
          <Link href="/#bella-advisor" className="btn-primary">BELLA jetzt fragen →</Link>
        </div>
      </section>

      <AuthorBox />
      <SiteFooter />
    </div>
  );
}
