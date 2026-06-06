import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import { BREEDS, BREED_BY_SLUG } from "@/data/breeds";
import gallery from "@/data/breed-gallery.json";
import { issueToProblemSlug } from "@/lib/issue-to-problem";
import ScoreBadge from "@/components/ScoreBadge";
import AuthorBox from "@/components/AuthorBox";
import ProductSchemaBlock from "@/components/ProductSchemaBlock";
import BellaAdvisorWrapper from "@/components/BellaAdvisorWrapper";
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

      {/* EEAT: Mops */}
      {breed.slug === "mops" && (
        <section className="max-w-5xl mx-auto w-full px-5 py-10">
          <div className="card p-8">
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Mops und Futter: Was du wissen solltest</h2>
            <div className="space-y-5 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                <strong>Übergewicht ist das größte Risiko beim Mops:</strong> Die kurze Schnauze
                (Brachyzephalie) macht körperliche Anstrengung bereits bei Normalgewicht anstrengend.
                Jedes überschüssige Kilo verschlimmert Atemprobleme, Hitzestress und Gelenkbelastung
                messbar. Mosse mit Übergewicht sind nicht faul — sie sind atemgehandicapt. Die tägliche
                Futtermenge sollte exakt nach Idealgewicht berechnet werden, nicht nach aktuellem Gewicht.
                Idealgewicht Mops: 6–8 kg. Tagesmenge hochwertiges Trockenfutter: 120–180 g.
              </p>
              <p>
                <strong>Portionsfrequenz und Tempo:</strong> Möpse neigen zu schnellem Fressen, was bei
                brachyzephalen Rassen besonders problematisch ist — sie schlucken dabei viel Luft,
                was zu Blähungen und Magenbeschwerden führt. Empfehlung: Anti-Schling-Napf oder
                Slow-Feeder, zwei kleinere Mahlzeiten statt einer großen, mindestens 1 Stunde Ruhe
                nach dem Fressen vor jeder Aktivität.
              </p>
              <p>
                <strong>Hautfalten und Ernährung:</strong> Die Hautfalten des Mopses sind Infektionsrisiko,
                nicht Ernährungsthema. Futter allein kann Faltenekzeme nicht verhindern. Aber:
                Omega-3-Fettsäuren (EPA/DHA aus Lachs) wirken entzündungshemmend und können die
                Hautbarriere stärken — das ist bei faltenreichen Rassen ein sinnvolles Ziel. Futter
                mit Lachsöl oder ein täglicher Zusatz von 0,5 ml Lachsöl ist eine einfache Maßnahme.
              </p>
              <p>
                <strong>Futterauswahl für Möpse:</strong> Proteingehalt 25–28 % ist ausreichend —
                Möpse sind keine Hochleistungssportler. Niedriger Fettgehalt (max. 14 %) hilft beim
                Gewichtsmanagement. Leicht verdauliche Sorten (Lamm, Lachs, Geflügel) sind bevorzugt,
                da Möpse empfindliche Mägen haben können. Keine Sorten mit hohem Weizen-
                oder Maisanteil — erhöhte Allergieneigung bei Möpsen gegenüber Getreide belegt.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* EEAT: Französische Bulldogge */}
      {breed.slug === "franzoesische-bulldogge" && (
        <section className="max-w-5xl mx-auto w-full px-5 py-10">
          <div className="card p-8">
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Französische Bulldogge und Futter: Was du wissen solltest</h2>
            <div className="space-y-5 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                <strong>Allergie-Häufigkeit überdurchschnittlich hoch:</strong> Französische Bulldoggen
                gehören zu den Rassen mit der höchsten Prävalenz für Futterallergien und atopische
                Dermatitis in Deutschland. Schätzungsweise 20–30 % aller Frenchies entwickeln
                im Laufe ihres Lebens eine Überempfindlichkeit gegenüber Futterzutaten — häufigste
                Auslöser: Huhn, Weizen, Milchprodukte. Wer eine Frenchie hat, sollte von Anfang an
                auf Monoprotein-Sorten oder wechselnde Proteinquellen setzen, um Sensibilisierung
                zu verhindern.
              </p>
              <p>
                <strong>Flatulenz und Fressgeschwindigkeit:</strong> Frenchies sind berüchtigt für
                Blähungen — oft durch zu schnelles Fressen und Luftschlucken. Gleiche Empfehlung
                wie beim Mops: Anti-Schling-Napf, zwei Mahlzeiten täglich, keine schwer verdaulichen
                Zutaten (Weizen, Mais, Soja). Probiotika in der Nahrung (Lactobacillus-haltige Sorten)
                können nachweislich die Darmflora stabilisieren und Flatulenz reduzieren.
              </p>
              <p>
                <strong>Rückenprobleme und Gewicht:</strong> Franzosen haben anatomisch eine erhöhte
                Anfälligkeit für Wirbelsäulenprobleme (Hemi-Vertebrae, IVDD). Übergewicht ist der
                wichtigste vermeidbare Belastungsfaktor. Ähnlich wie beim Dackel gilt: Ein Frenchie
                im Normalgewicht lebt gesünder als einer mit 2 kg zu viel. Tägliche Kalorienzählung
                inklusive aller Snacks ist bei dieser Rasse keine Übervorsicht.
              </p>
              <p>
                <strong>Futter-Empfehlung Frenchie:</strong> Getreidefrei oder getreideredu­ziert wegen
                Allergie-Prädisposition. Proteinquelle klar benannt, möglichst Monoprotein.
                Lachs- oder Fischsorten für Omega-3 und Hautgesundheit. Fettgehalt moderat (12–16 %).
                Bei bereits sichtbaren Hautsymptomen: 8-wöchige Eliminationsdiät mit Insekten-
                oder Pferdefleisch vor jeder weiteren Diagnose.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* EEAT: Deutscher Schäferhund */}
      {breed.slug === "deutscher-schaeferhund" && (
        <section className="max-w-5xl mx-auto w-full px-5 py-10">
          <div className="card p-8">
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Deutscher Schäferhund und Futter: Was du wissen solltest</h2>
            <div className="space-y-5 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                <strong>Exokrine Pankreasinsuffizienz (EPI):</strong> Der Deutsche Schäferhund ist
                die am stärksten betroffene Rasse für EPI — eine Erkrankung, bei der die Bauchspeicheldrüse
                keine ausreichenden Verdauungsenzyme mehr produziert. Betroffen sind schätzungsweise
                1–3 % aller Schäferhunde. Symptome: massiver Gewichtsverlust trotz gutem Appetit,
                großer, hellgefärbter, übelriechender Kot. EPI ist behandelbar (Enzymsubstitution),
                aber nur wenn erkannt. Bei entsprechenden Symptomen: sofort Tierarzt, Kot-Elastase-Test.
              </p>
              <p>
                <strong>Magendrehung (MDV/GDV):</strong> Große Hunde mit tiefer Brust wie der
                Schäferhund haben ein erhöhtes Risiko für Magendilatation-Volvulus — ein medizinischer
                Notfall. Vorbeugend: keine einzelne große Mahlzeit, sondern 2 Mahlzeiten täglich.
                Mindestens 1 Stunde Ruhe nach dem Fressen. Kein Fressen direkt vor intensiver
                Aktivität. Slow-Feeder oder erhöhter Napf werden diskutiert — die Evidenz ist gemischt,
                schaden tut es aber nicht.
              </p>
              <p>
                <strong>Hoher Energiebedarf bei Arbeits-Schäferhunden:</strong> Ein aktiver Schäferhund
                in Arbeit (Schutz, Hüten, Sport) hat einen 1,5–2x erhöhten Grundumsatz gegenüber
                einem ruhigen Haushund. Für diese Hunde: Protein ≥ 28 %, Fett ≥ 16 %, Energiedichte
                ≥ 3.800 kcal/kg Trockenfutter. Für den wenig aktiven Haushalt-Schäferhund gelten
                normale Werte (26 % Protein, 14 % Fett).
              </p>
              <p>
                <strong>Hüftdysplasie und Futter:</strong> HD ist beim Schäferhund genetisch — Futter
                kann es nicht verhindern. Was Futter tun kann: Übergewicht vermeiden
                (jedes kg belastet HD-Hüften mehr), Omega-3 aus Fisch für entzündungshemmende
                Wirkung, Glucosamin/Chondroitin als begleitende Maßnahme. Protein qualitativ hochwertig
                für Muskelerhalt — Muskeln sind die beste Gelenkstabilisierung.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* EEAT: Beagle */}
      {breed.slug === "beagle" && (
        <section className="max-w-5xl mx-auto w-full px-5 py-10">
          <div className="card p-8">
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Beagle und Futter: Was du wissen solltest</h2>
            <div className="space-y-5 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                <strong>Nahrungsmotivation als Überlebenstrieb:</strong> Beagles wurden als Meutejaghunde
                gezüchtet — ihr Antrieb, Nahrung zu finden und zu fressen, ist genetisch verankert.
                Ein Beagle, der bettelnd vor dir steht, ist nicht hungrig — er ist ein Beagle.
                Das hat praktische Konsequenzen: Beagles überschätzen ihren Hunger chronisch,
                fressen was da ist und zeigen kein natürliches Sättigungsverhalten. Genaue
                Portionierung nach Gramm (nicht nach Augenmaß) und konsequentes Nicht-Nachgeben
                beim Betteln sind bei dieser Rasse keine Option sondern Pflicht.
              </p>
              <p>
                <strong>Übergewicht und Kastration:</strong> Kastrierte Beagles reduzieren ihren
                Grundumsatz um ca. 20–30 %. Das bedeutet: nach der Kastration die Futtermenge sofort
                anpassen (nicht erst wenn der Hund sichtbar zunimmt). Ein kastrierter Beagle
                braucht ca. 25 % weniger als der unkastrierte gleichen Gewichts.
              </p>
              <p>
                <strong>Verstopfungsrisiko durch Knochen und Fremdkörper:</strong> Beagles verschlucken
                was sie finden — sie sind die Rasse mit der höchsten Rate an Fremdkörperoperationen.
                Rohe Knochen immer beaufsichtigt geben. Schnelle Fresser brauchen Slow-Feeder um
                Würgen und Luftschlucken zu reduzieren.
              </p>
              <p>
                <strong>Futter-Empfehlung Beagle:</strong> Energiereduzierte Sorten oder normales
                hochwertiges Futter in kontrollierten Mengen. Keine kalorienreichen Sorten mit
                hohem Fettgehalt. Proteingehalt 26–28 % für Muskelerhalt bei normalem Gewicht.
                Kalorienarme Gemüse-Snacks (Möhren, Gurke) als Beschäftigung und Sättigungsmittel.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* EEAT: Chihuahua */}
      {breed.slug === "chihuahua" && (
        <section className="max-w-5xl mx-auto w-full px-5 py-10">
          <div className="card p-8">
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Chihuahua und Futter: Was du wissen solltest</h2>
            <div className="space-y-5 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                <strong>Hypoglykämie-Risiko:</strong> Chihuahuas und andere Toy-Rassen haben
                ein hohes Risiko für Hypoglykämie (Unterzuckerung) — besonders Welpen und
                Kleinsthunde unter 1,5 kg. Ursache: sehr geringes Körperfettdepot und hoher
                relativer Energiebedarf. Praxis: Nie länger als 4–6 Stunden fasten lassen,
                3–4 kleine Mahlzeiten täglich, besonders bei Welpen. Zeichen: Zittern,
                Schwäche, Desorientierung, in schweren Fällen Krampfanfall. Bei Verdacht:
                sofort ein Stück Honig auf die Schleimhäute und zum Tierarzt.
              </p>
              <p>
                <strong>Kleine Magenkapazität:</strong> Ein Chihuahua frisst naturgemäß kleine
                Portionen. Zu große Einzelportionen führen zu Erbrechen oder Würgen.
                Richtgröße: 2–3 Mahlzeiten täglich, maximal 30–50 g Trockenfutter pro Mahlzeit
                bei einem 2-kg-Hund. Kleine-Rassen-Kibble (kleinere Stücke) ist bei Chihuahuas
                nicht nur Bequemlichkeit — es reduziert das Aspirationsrisiko.
              </p>
              <p>
                <strong>Zahngesundheit kritisch:</strong> Chihuahuas haben eine der höchsten
                Raten an Zahnerkrankungen aller Hunderassen — die kleinen Kiefer sind zu eng
                für alle Zähne. Parodontitis kann bakteriell innere Organe belasten.
                Konsequenz: tägliches Zähneputzen ist Pflicht, kein Luxus. Dental-Futter
                und enzymatische Kausticks als Ergänzung. Futter mit kalziumfördernden Zutaten
                (kein Zucker!) unterstützt Zahnsubstanz.
              </p>
              <p>
                <strong>Futter-Empfehlung Chihuahua:</strong> Kleine-Rassen-Sorten mit hoher
                Energiedichte (3.800–4.200 kcal/kg) — so reicht eine kleine Portion.
                Protein ≥ 28 % für Muskelerhalt beim kleinen Körper. Keine Sorten mit
                hohem Zuckeranteil. Nassfutter als Mahlzeit-Ergänzung erhöht die Flüssigkeitsaufnahme.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* EEAT: Dackel */}
      {breed.slug === "dackel" && (
        <section className="max-w-5xl mx-auto w-full px-5 py-10">
          <div className="card p-8">
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Dackel und Futter: Was du wissen solltest</h2>
            <div className="space-y-5 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                <strong>IVDD: Gewicht ist eine medizinische Frage:</strong> Bandscheibenvorfall
                (Intervertebral Disc Disease, IVDD) betrifft schätzungsweise 25 % aller Dackel
                im Laufe ihres Lebens. Die Chondrodystrophie — der genetische Grund für die
                kurzen Beine — betrifft auch die Wirbelsäule. Übergewicht ist der stärkste
                kontrollierbare Risikofaktor für Schweregrad und Häufigkeit von IVDD-Vorfällen.
                Jedes überschüssige Kilo beim Dackel ist keine Ästhetikfrage — es kann über
                eine Lähmung entscheiden.
              </p>
              <p>
                <strong>Gewichtsmanagement beim Dackel:</strong> Idealgewicht Kurzdackel 7–14 kg
                je nach Typ (Standard/Zwerg/Kaninchen). Die Futtermenge für einen 8-kg-Dackel:
                ca. 140–160 g hochwertiges Trockenfutter täglich (bei 3.700 kcal/kg).
                Packungsangaben der Hersteller sind systematisch zu hoch — immer nach
                RER-Formel berechnen. Konsequente Snack-Kontrolle: Leckerli von der Tagesration
                abziehen, nie zusätzlich geben.
              </p>
              <p>
                <strong>Omega-3 als entzündungshemmende Unterstützung:</strong> Bei IVDD-gefährdeten
                Hunden wird Omega-3 aus Fisch (EPA/DHA) für seine entzündungshemmende Wirkung
                auf nervliches Gewebe diskutiert. Kein Heilmittel, aber eine risikoarme,
                sinnvolle Ergänzung. Lachsöl (0,5–1 ml täglich für einen 10-kg-Dackel)
                oder Futter mit Lachs als Erstzutat.
              </p>
              <p>
                <strong>Futter-Empfehlung Dackel:</strong> Energiereduziert oder normale hochwertige
                Sorte in reduzierter Menge. Kein Hochenergiefutter für aktive Hunde (zu kalorienreich).
                Proteingehalt 25–28 %. Kein Zucker. Omega-3-reich (Lachs, Hering, Lachsöl).
                Bei aktiv IVDD-kranken Dackeln: Rücksprache mit Tierarzt ob spezifisches Diätfutter.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* EEAT: Yorkshire Terrier */}
      {breed.slug === "yorkshire-terrier" && (
        <section className="max-w-5xl mx-auto w-full px-5 py-10">
          <div className="card p-8">
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Yorkshire Terrier und Futter: Was du wissen solltest</h2>
            <div className="space-y-5 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                <strong>Portosystemischer Shunt:</strong> Yorkies haben eine genetisch erhöhte
                Häufigkeit für portosystemische Lebererkrankungen (PSS — eine Gefäßfehlbildung,
                die Blut an der Leber vorbeileitet). Bei PSS-Hunden ist eine proteinmodifizierte
                Diät essenziell — hochverdauliches Protein in reduzierter Menge, um
                Ammoniakbelastung zu minimieren. Dies ist aber eine tierärztlich zu begleitende
                Spezialdiät, kein Standard-Ratschlag für gesunde Yorkies.
              </p>
              <p>
                <strong>Zahnerkrankungen extrem häufig:</strong> Yorkshire Terrier haben die
                höchste Rate an schwerer Parodontitis unter allen Hunderassen. Die Zähne sind
                zu nah beieinander, Plaque-Akkumulation ist unvermeidlich. Konsequenz:
                tägliches Zähneputzen ab dem ersten Lebensmonat trainieren.
                Futter-seitig: keine weichen Sorten als Alleinernährung — der mechanische
                Kauaufwand von Trockenfutter ist minimal hilfreich.
              </p>
              <p>
                <strong>Seidiges Fell und Fettsäuren:</strong> Das charakteristische, seidenglatte
                Fell des Yorkies ist fettsäureabhängig. Unzureichende Omega-6-Versorgung
                (Linolsäure) führt zu stumpfem, brüchigem Fell. Das ist kein Luxusproblem —
                es zeigt Nährstoffmangel an. Futter mit Sonnenblumen- oder Distelöl als Quelle
                für Linolsäure sowie Omega-3 für Balance. Fisch als Proteinquelle liefert beides.
              </p>
              <p>
                <strong>Futter-Empfehlung Yorkie:</strong> Kleine-Rassen-Sorten mit hoher
                Energiedichte. Protein ≥ 28 %, Fett 14–18 % mit gutem Fettsäureprofil.
                Keine billigen Sorten ohne spezifische Fleischdeklaration — der kleine Körper
                reagiert empfindlicher auf Minderqualität. 2–3 kleine Mahlzeiten täglich
                (Hypoglykämie-Prävention bei kleinen Exemplaren).
              </p>
            </div>
          </div>
        </section>
      )}

      {/* EEAT: Pudel */}
      {breed.slug === "pudel" && (
        <section className="max-w-5xl mx-auto w-full px-5 py-10">
          <div className="card p-8">
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Pudel und Futter: Was du wissen solltest</h2>
            <div className="space-y-5 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                <strong>Vier Größen, vier Fütterungskonzepte:</strong> Groß-, Mittel-, Zwerg- und
                Toy-Pudel haben grundlegend unterschiedliche Energiebedarfe. Ein Großpudel (45–70 cm)
                braucht ähnliche Portionen wie ein Labrador. Ein Toy-Pudel (unter 28 cm) folgt den
                Regeln der Kleinsthunde mit Hypoglykämie-Prävention und kleinen Mahlzeiten.
                Die Größengruppe bestimmt hier mehr als die Rasse.
              </p>
              <p>
                <strong>Sebaceous Adenitis (SA):</strong> Pudel haben eine genetisch erhöhte
                Prädisposition für Sebaceous Adenitis — eine entzündliche Erkrankung der
                Talgdrüsen, die zu Schuppenbildung, Haarausfall und Hautirritationen führt.
                Ein ungünstiges Omega-6:Omega-3-Verhältnis in der Ernährung wird als
                Triggerfaktor diskutiert. Empfehlung: Futter mit niedrigem Omega-6:Omega-3-
                Verhältnis (idealerweise unter 7:1) — d.h. Lachs, Makrele, Hering als Protein
                oder Lachsöl als Ergänzung.
              </p>
              <p>
                <strong>Intelligenz und Aktivitätslevel:</strong> Pudel sind hochintelligent
                und aktiv — sie brauchen mentale und körperliche Auslastung. Unterauslastung
                führt zu Stress und ist ein indirekter Auslöser für Verdauungsprobleme.
                Für aktive Pudel: Protein ≥ 26 %, Fett 14–16 %, moderate Energiedichte.
                Für wenig aktive oder ältere Pudel: energiereduziert.
              </p>
              <p>
                <strong>Futter-Empfehlung Pudel:</strong> Fisch als Hauptprotein ist für Pudel
                besonders geeignet — Omega-3-Profil und vollständige Aminosäurenversorgung
                in einem. Getreidefrei kann bei Pudeln mit Hautsymptomen sinnvoll sein.
                Keine Sorten mit hohem Sonnenblumenöl-Anteil (verschiebt Omega-Verhältnis).
                Größengerechte Kibble-Größe beachten.
              </p>
            </div>
          </div>
        </section>
      )}

      <ProductSchemaBlock foods={foods} listName={`Empfohlenes Hundefutter für ${breed.name}`} />

      {/* BELLA CHAT — personalisierte Beratung */}
      <section className="max-w-5xl mx-auto w-full px-5 py-10">
        <h2 className="text-2xl font-extrabold tracking-tight mb-2">
          BELLA findet das perfekte Futter für deinen {breed.name}
        </h2>
        <p className="text-[var(--muted)] text-sm mb-7">
          Erzähl BELLA von deinem Hund — Alter, Gewicht, Allergien — und sie empfiehlt sofort die besten Sorten.
        </p>
        <BellaAdvisorWrapper
          introMessage={`Hallo! Ich bin BELLA 🐕 — deine KI-Ernährungsberaterin.\n\nEin ${breed.name}! Super Rasse. Um das perfekte Futter zu finden, brauche ich noch ein paar Details:\n\n• Wie alt ist dein ${breed.name}?\n• Wie schwer ist er/sie?\n• Gibt es Allergien, Gelenkprobleme oder andere Gesundheitsthemen?\n\nDann empfehle ich dir sofort die passenden Sorten aus 8.000+ Produkten!`}
          pageQuickOptions={[
            { label: `🐕 Futter für ${breed.name}`, msg: `Ich habe einen ${breed.name} — welches Futter empfiehlst du?` },
            { label: "🐶 Welpe", msg: `Mein ${breed.name}-Welpe braucht Welpen-Futter — was passt?` },
            { label: "👴 Senior", msg: `Mein ${breed.name} ist älter — welches Senior-Futter ist das beste?` },
            { label: "🩺 Allergie / empfindlich", msg: `Mein ${breed.name} hat eine Allergie / empfindlichen Magen — was empfiehlst du?` },
          ]}
        />
      </section>

      {/* EMPFOHLENE PRODUKTE — Schnellübersicht */}
      <section className="max-w-5xl mx-auto w-full px-5 py-6">
        <h3 className="text-lg font-bold tracking-tight mb-2">
          Schnellübersicht: Top-Sorten für {breed.name}
        </h3>
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
