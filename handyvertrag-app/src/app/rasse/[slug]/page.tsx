import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import { BREEDS, BREED_BY_SLUG, BREED_SLUG_ALIASES } from "@/data/breeds";
import type { Breed } from "@/data/breeds";
import gallery from "@/data/breed-gallery.json";
import { issueToProblemSlug } from "@/lib/issue-to-problem";
import AuthorBox from "@/components/AuthorBox";
import ProductSchemaBlock from "@/components/ProductSchemaBlock";
import BellaAdvisorWrapper from "@/components/BellaAdvisorWrapper";
import StructuredData from "@/components/StructuredData";
import { breedDirectAnswer } from "@/lib/direct-answer";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 86400;

const PHOTO: Record<string, string> = Object.fromEntries(
  (gallery as { slug: string; img: string; localImg?: string }[]).map((g) => [g.slug, g.localImg ?? g.img])
);

export function generateStaticParams() {
  return BREEDS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const b = BREED_BY_SLUG[slug];
  if (!b) return {};
  const title = `${b.name}: Futter, Gesundheit & alles zur Rasse — Lexikon`;
  const description = `${b.name} Lexikon: Charakter, Herkunft, Gesundheit, optimales Futter & Portionsrechner. Datengetrieben, redaktionell geprüft.`;
  return {
    title,
    description,
    alternates: {
      canonical: `https://welches-hundefutter.today/rasse/${b.slug}`,
      languages: {
        "de-DE": `https://welches-hundefutter.today/rasse/${b.slug}`,
        "de-AT": `https://welches-hundefutter.today/rasse/${b.slug}`,
        "de-CH": `https://welches-hundefutter.today/rasse/${b.slug}`,
        "x-default": `https://welches-hundefutter.today/rasse/${b.slug}`,
      },
    },
    openGraph: { title, description, images: PHOTO[b.slug] ? [PHOTO[b.slug]] : [] },
  };
}

// ── DB-Abfrage ────────────────────────────────────────────────────────────────
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
  } catch { return []; }
}

// ── Helper: Portionsrechner ───────────────────────────────────────────────────
type PortionRow = { weight: number; low: number; med: number; high: number };

function computePortions(breed: Breed): PortionRow[] {
  const wMin = Math.max(1, Number(breed.weightMin ?? 5));
  const wMax = Math.max(wMin + 1, Number(breed.weightMax ?? 30));
  const points: number[] = [];
  if (wMax - wMin <= 4) {
    points.push(Math.round((wMin + wMax) / 2));
  } else if (wMax - wMin <= 12) {
    points.push(wMin, Math.round((wMin + wMax) / 2), wMax);
  } else {
    points.push(wMin, Math.round(wMin + (wMax - wMin) * 0.33),
      Math.round(wMin + (wMax - wMin) * 0.67), wMax);
  }
  return points.map((w) => {
    const rer = 70 * Math.pow(w, 0.75);
    return { weight: w, low: Math.round(rer * 1.2 / 3.5), med: Math.round(rer * 1.5 / 3.5), high: Math.round(rer * 1.8 / 3.5) };
  });
}

// ── Helper: Experttext Ernährung ──────────────────────────────────────────────
function buildFeedingParagraphs(breed: Breed): string[] {
  const issues = (breed.commonHealthIssues ?? []).map((s) => s.toLowerCase());
  const paras: string[] = [];

  const hasWeight = issues.some((i) => /gewicht|fresssucht/.test(i));
  const hasJoint = issues.some((i) => /gelenk|h[üu]ft|ellenb|dysplasie|arthrose/.test(i));
  const hasAllergy = issues.some((i) => /allergi|haut|atopi|derma/.test(i));
  const hasGDV = issues.some((i) => /magendrehung|drehung|gdv|dilation/.test(i));
  const isBrachy = issues.some((i) => /brachy|atem|nasen/.test(i));
  const hasHeart = issues.some((i) => /herz|kardio|dcm|klappen|mitral/.test(i));
  const hasMagen = issues.some((i) => /magen|darm|pankre|epi\b|verdau/.test(i));
  const hasKidney = issues.some((i) => /niere|renal/.test(i));
  const hasEpi = issues.some((i) => /epilepsi/.test(i));

  if (breed.feedingNotes) paras.push(breed.feedingNotes);

  if (hasWeight) paras.push(
    `${breed.name} neigen genetisch zu Übergewicht — strikte Portionskontrolle nach exaktem Körpergewicht ist entscheidend. Alle Snacks und Leckerlis in die Tagesration einrechnen. Niemals frei füttern. Der Tabelle unten kannst du die tagesaktuelle Grammzahl entnehmen.`
  );
  if (hasJoint) paras.push(
    `Gelenkprobleme wie Hüftdysplasie sind bei ${breed.name} häufig. Omega-3-Fettsäuren (EPA/DHA aus Meerestieren) können die Entzündungsmarker niedrig halten und die Progression verlangsamen. Futter mit nachweisbarem Fischanteil oder ergänzend 0,5–1 ml Lachsöl täglich empfehlenswert.`
  );
  if (hasAllergy) paras.push(
    `${breed.name} zeigen eine erhöhte Prävalenz für Futterunverträglichkeiten. Monoprotein-Sorten (eine einzige tierische Proteinquelle, klar benannt) reduzieren das Sensibilisierungsrisiko. Bei bestehenden Hautsymptomen: 8-wöchige Eliminationsdiät mit neuartiger Proteinquelle (Insekten, Pferd, Kaninchen) unter tierärztlicher Aufsicht.`
  );
  if (hasGDV) paras.push(
    `Das Risiko für Magendilatation-Volvulus (MDV) ist bei tiefbrüstigen ${breed.name} erhöht. Vorbeugend: 2 Mahlzeiten täglich statt einer großen. Mindestens 1 Stunde Ruhe nach dem Fressen. Kein intensives Toben direkt nach der Fütterung.`
  );
  if (isBrachy) paras.push(
    `Die verkürzte Schnauze des ${breed.name} fördert schnelles Fressen und Luftschlucken. Empfehlung: Anti-Schling-Napf oder Slow-Feeder, 2 kleinere Mahlzeiten täglich, mindestens 1 Stunde Ruhe danach.`
  );
  if (hasHeart) paras.push(
    `${breed.name} haben ein erhöhtes Herzerkrankungs-Risiko. Taurin- und L-Carnitin-haltiges Futter wird empfohlen (DCM-Studie FDA 2019). Bei diagnostizierter Herzerkrankung: natriumreduziertes Futter nach Rücksprache mit dem Tierarzt.`
  );
  if (hasMagen) paras.push(
    `Magen-Darm-Empfindlichkeit ist bei ${breed.name} bekannt. Leicht verdauliche Sorten mit Single Protein und fermentierbaren Ballaststoffen (Chicorée-Inulin, Flohsamenschale) können die Darmgesundheit unterstützen. Probiotika-haltige Futter als Ergänzung sinnvoll.`
  );
  if (hasKidney) paras.push(
    `Nierenprobleme bei ${breed.name}: phosphorarmes Futter (unter 0,5 % TS) reduziert die Belastung. Hoher Wasseranteil wichtig — Nassfutter oder Rohfutter (BARF) erhöhen die tägliche Flüssigkeitsaufnahme.`
  );
  if (hasEpi) paras.push(
    `Bei epileptischen ${breed.name}: Bromid-sensible Rassen sollten natriumarmes Futter erhalten, da hohe Salzaufnahme die Bromid-Resorption verringert. Konsequente Fütterungszeiten und kein abrupter Futterwechsel empfohlen.`
  );

  return paras.slice(0, 3);
}

// ── Helper: Ähnliche Rassen ───────────────────────────────────────────────────
function getSimilarBreeds(breed: Breed, n = 4): Breed[] {
  return BREEDS
    .filter((b) => b.slug !== breed.slug && b.slug !== "mischling" && b.slug !== "husky")
    .map((b) => ({
      b,
      score:
        (b.size === breed.size ? 3 : 0) +
        (b.activityLevel === breed.activityLevel ? 2 : 0) +
        ((breed.isMixedBreed ? b.isMixedBreed : !b.isMixedBreed) ? 1 : 0),
    }))
    .sort((a, z) => z.score - a.score)
    .slice(0, n)
    .map((x) => x.b);
}

// ── Helper: FCI-Gruppenname ───────────────────────────────────────────────────
const FCI_NAMES: Record<number, string> = {
  1: "Hütehunde und Treibhunde", 2: "Pinscher, Schnauzer, Molossoide",
  3: "Terrier", 4: "Dachshunde", 5: "Spitze und Hunde vom Urtyp",
  6: "Laufhunde und Schweißhunde", 7: "Vorstehhunde", 8: "Apportier-, Stöber- und Wasserhunde",
  9: "Gesellschafts- und Begleithunde", 10: "Windhunde",
};

const TRAIT_COLOR: Record<string, string> = {
  intelligent: "bg-blue-500/15 border-blue-400/25 text-blue-200",
  loyal: "bg-emerald-500/15 border-emerald-400/25 text-emerald-200",
  freundlich: "bg-teal-500/15 border-teal-400/25 text-teal-200",
  verspielt: "bg-yellow-500/15 border-yellow-400/25 text-yellow-200",
  stur: "bg-orange-500/15 border-orange-400/25 text-orange-200",
  energisch: "bg-red-500/15 border-red-400/25 text-red-200",
  neugierig: "bg-purple-500/15 border-purple-400/25 text-purple-200",
  sanftmütig: "bg-pink-500/15 border-pink-400/25 text-pink-200",
  wachsam: "bg-amber-500/15 border-amber-400/25 text-amber-200",
  gesellig: "bg-cyan-500/15 border-cyan-400/25 text-cyan-200",
  mutig: "bg-rose-500/15 border-rose-400/25 text-rose-200",
  ruhig: "bg-slate-500/15 border-slate-400/25 text-slate-200",
  anhänglich: "bg-violet-500/15 border-violet-400/25 text-violet-200",
  vorsichtig: "bg-lime-500/15 border-lime-400/25 text-lime-200",
  unabhängig: "bg-indigo-500/15 border-indigo-400/25 text-indigo-200",
};
const TRAIT_DEFAULT = "bg-white/5 border-white/10 text-white/70";

function Stars({ n, total = 5 }: { n: number; total?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`w-3 h-3 rounded-sm ${i < n ? "bg-[var(--honey)]" : "bg-white/10"}`} />
      ))}
    </div>
  );
}

const SIZE_LABEL: Record<string, string> = { klein: "Klein (bis 10 kg)", mittel: "Mittel (10–25 kg)", gross: "Groß (25–40 kg)", sehrgross: "Sehr groß (40+ kg)" };
const ACT_LABEL: Record<string, string> = { niedrig: "Gering", mittel: "Moderat", hoch: "Hoch", sehrhoch: "Sehr hoch" };
const COAT_LABEL: Record<string, string> = { kurz: "Kurzhaar", mittellang: "Mittellang", lang: "Langhaar", drahthaar: "Drahthaar", lockig: "Lockig/Gelockt", glatthaar: "Glatthaar" };
const SHED_LABEL: Record<string, string> = { wenig: "Wenig", mittel: "Mittel", stark: "Stark" };
const DIFF_LABEL: Record<string, string> = { leicht: "Anfängergeeignet", mittel: "Erfahrung hilfreich", schwer: "Erfahrener Halter" };

// ── HAUPTSEITE ────────────────────────────────────────────────────────────────
export default async function BreedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const breed = BREED_BY_SLUG[slug];
  if (!breed) {
    const canonicalSlug = BREED_SLUG_ALIASES[slug];
    if (canonicalSlug) permanentRedirect(`/rasse/${canonicalSlug}`);
    notFound();
  }

  const allergyProne = (breed.commonHealthIssues ?? []).some((i) => /allergi|haut|magen|darm|verdau/i.test(i));
  const foods = await getBreedFoods(breed.slug, allergyProne);
  const photo = PHOTO[breed.slug];

  const portions = computePortions(breed);
  const feedingParas = buildFeedingParagraphs(breed);
  const similar = getSimilarBreeds(breed);

  // Suitability: use explicit values or compute from existing data
  const suitFamily = breed.suitabilityFamily ?? (breed.activityLevel === "niedrig" ? 4 : breed.size === "sehrgross" ? 3 : 4);
  const suitApartment = breed.suitabilityApartment ?? (breed.size === "klein" ? 4 : breed.size === "mittel" ? 3 : breed.activityLevel === "niedrig" ? 3 : 2);
  const suitBeginner = breed.suitabilityBeginner ?? (breed.trainingDifficulty === "leicht" ? 4 : breed.trainingDifficulty === "schwer" ? 2 : 3);
  const suitChildren = breed.suitabilityChildren ?? (breed.size === "sehrgross" ? 3 : 4);
  const suitDogs = breed.suitabilityDogs ?? 3;

  const midWeight = Math.round((Number(breed.weightMin ?? 5) + Number(breed.weightMax ?? 30)) / 2);
  const midPortion = portions[Math.floor(portions.length / 2)];

  // BELLA-Intro: persönlich, Rasse-spezifisch, mit Charakter-Beschreibung
  const traits = (breed.characterTraits ?? []).slice(0, 3);
  const traitText = traits.length > 0 ? ` — ${traits.join(", ")}` : "";
  const healthHint = (breed.commonHealthIssues ?? []).length > 0
    ? ` Ich weiß auch, dass ${breed.name} manchmal zu ${(breed.commonHealthIssues ?? []).slice(0, 2).join(" oder ")} neigen — das fließt in meine Empfehlung ein.`
    : "";
  const bellaIntro = `Du hast also einen ${breed.name}${traitText}! 🐕${healthHint}\n\nIch bin BELLA und finde aus 11.000+ echten Sorten das perfekte Futter für dich. Noch zwei kurze Fragen:\n\n→ Wie alt ist dein ${breed.name}? (Welpe, erwachsen oder Senior?)\n→ Gibt es Allergien, einen empfindlichen Magen oder andere Besonderheiten?`;

  // autoStart: 2 Signale (Rasse + Lebensphase) damit hasEnoughIntent sofort Empfehlungen auslöst
  const bellaAutoStart = allergyProne
    ? `Ich habe einen erwachsenen ${breed.name}. Diese Rasse kann empfindlich auf bestimmte Inhaltsstoffe reagieren. Empfiehl mir bitte direkt das passende Futter.`
    : `Ich habe einen erwachsenen ${breed.name}. Bitte empfiehl mir direkt das beste Futter für diese Rasse.`;

  // FAQ-Daten
  const isLargeBreed = breed.size === "gross" || breed.size === "sehrgross";
  const jointProne = (breed.commonHealthIssues ?? []).some((i) => /gelenk|hüft|arthros|ellbogen|patell|kreuzband/i.test(i));
  const da = breedDirectAnswer(breed);
  const faqs = [
    {
      q: `Wie viel Futter braucht ein ${breed.name} täglich?`,
      a: `Ein ${breed.name} mit ca. ${midWeight} kg Körpergewicht und mittlerer Aktivität braucht etwa ${midPortion?.med ?? 200}–${midPortion?.high ?? 250} g Trockenfutter täglich, aufgeteilt auf 2 Mahlzeiten. Die genaue Menge hängt von Alter, Kastrationsstatus und Aktivität ab.`,
    },
    {
      q: `Welche Gesundheitsprobleme hat der ${breed.name}?`,
      a: `Häufige Gesundheitsthemen beim ${breed.name}: ${(breed.commonHealthIssues ?? []).slice(0, 4).join(", ")}. Regelmäßige Vorsorgeuntersuchungen beim Tierarzt sind wichtig.`,
    },
    {
      q: `Ist der ${breed.name} ein Familienhund?`,
      a: suitFamily >= 4 ? `Ja — ${breed.name} sind ausgezeichnete Familienhunde und kinderfreundlich.` : `${breed.name} können in Familien gut gehalten werden, wenn Kinder den Umgang mit Hunden gewohnt sind.`,
    },
    {
      q: `Welches Futter ist am besten für einen ${breed.name}?`,
      a: `Für ${breed.name} eignet sich hochwertiges Trockenfutter mit mindestens ${breed.recommendedProteinPercentage ?? 25} % Rohprotein aus benannten Fleischquellen als erste Zutat. ${allergyProne ? "Wegen der Allergieneigung empfehlen wir Monoprotein- oder getreidfreie Sorten." : "Futter ohne übermäßige Füllstoffe ist empfehlenswert."}`,
    },
    {
      q: `Wie viel Bewegung braucht ein ${breed.name}?`,
      a: `${breed.name} brauchen täglich ca. ${breed.dailyExerciseMinutes ?? (breed.activityLevel === "sehrhoch" ? 120 : breed.activityLevel === "hoch" ? 90 : breed.activityLevel === "mittel" ? 60 : 30)} Minuten Bewegung. ${breed.activityLevel === "sehrhoch" || breed.activityLevel === "hoch" ? "Diese Rasse braucht zusätzlich geistige Auslastung." : ""}`,
    },
    {
      q: `Was sollte ich einem ${breed.name}-Welpen füttern?`,
      a: isLargeBreed
        ? `${breed.name}-Welpen wachsen schnell und sollten ein Large-Breed-Welpenfutter mit kontrolliertem Kalzium- und Energiegehalt bekommen — zu schnelles Wachstum erhöht das Risiko für Gelenkprobleme wie Hüftdysplasie. Füttere 3–4 kleine Portionen täglich und wechsle erst nach Rücksprache mit dem Tierarzt auf Adult-Futter um. BELLA berücksichtigt das Wachstumstempo großer Rassen bei der Empfehlung.`
        : `${breed.name}-Welpen haben einen 2- bis 3-fach höheren Energie- und Proteinbedarf als ausgewachsene Hunde und brauchen ein hochwertiges Welpenfutter mit ausgewogenem Kalzium-Phosphor-Verhältnis für ein gesundes Wachstum. Füttere 3–4 kleine Portionen täglich, bis die Rasse mit etwa 12 Monaten ausgewachsen ist. BELLA berücksichtigt Größe und Wachstumstempo der Rasse bei der Empfehlung.`,
    },
    {
      q: `Worauf muss ich bei einem ${breed.name}-Senior beim Futter achten?`,
      a: jointProne
        ? `Ältere ${breed.name} brauchen kalorienreduziertes Futter mit weniger Fett, da der Energiebedarf sinkt und Übergewicht die Gelenke zusätzlich belastet. Da diese Rasse zu Gelenkproblemen neigt, sind Glucosamin, Chondroitin und Omega-3-Fettsäuren im Senior-Futter besonders wichtig. Leicht verdauliche Proteine und eine angepasste Portionsgröße runden die Ernährung im Alter ab.`
        : `Ältere ${breed.name} brauchen kalorienreduziertes Futter mit weniger Fett und mehr Ballaststoffen, da der Energiebedarf mit dem Alter sinkt und Übergewicht die Gesundheit belastet. Leicht verdauliche Proteine, Antioxidantien gegen Zellalterung und Gelenkstoffe wie Glucosamin sind sinnvoll, auch wenn diese Rasse aktuell keine bekannten Gelenkprobleme zeigt. Die Portionsgröße sollte regelmäßig ans Gewicht angepasst werden.`,
    },
    {
      q: `Neigt der ${breed.name} zu Futterunverträglichkeiten?`,
      a: allergyProne
        ? `Ja — der ${breed.name} zählt zu den Rassen mit erhöhter Neigung zu ${(breed.commonHealthIssues ?? []).filter((i) => /allergi|haut|magen|darm|verdau/i.test(i)).slice(0, 2).join(" und ")}. Achte auf Anzeichen wie Juckreiz, weichen Kot oder Erbrechen nach dem Fressen. Monoprotein-Futter mit einer ungewöhnlichen Fleischquelle wie Ente, Insekt oder Wild und ohne Getreide kann helfen, den Auslöser einzugrenzen — am besten in Absprache mit dem Tierarzt.`
        : `Der ${breed.name} gilt nicht als besonders anfällig für Futterunverträglichkeiten, dennoch kann jeder Hund individuell reagieren. Achte bei einer Futterumstellung auf Anzeichen wie weichen Kot, Juckreiz oder Erbrechen. Hochwertiges Futter mit klarer Deklaration, benannten Fleischquellen und wenigen Zusatzstoffen senkt grundsätzlich das Risiko für Unverträglichkeiten.`,
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData
        type="article"
        article={{
          headline: `${breed.name}: Futter, Gesundheit & alles zur Rasse`,
          description: breed.description ?? `${breed.name} Lexikon: Charakter, Herkunft, Gesundheit, optimales Futter & Portionsrechner.`,
          url: `https://welches-hundefutter.today/rasse/${breed.slug}`,
          dateModified: "2026-06-01",
          ...(photo && { image: photo }),
          speakableSelectors: ["h1", ".bella-answer"],
        }}
      />
      <StructuredData
        type="portions-howto"
        portionsHowTo={{
          breedName: breed.name,
          url: `https://welches-hundefutter.today/rasse/${breed.slug}`,
          rows: portions,
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ── BREADCRUMB ─────────────────────────────────────────────────── */}
      <nav className="max-w-5xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)] flex gap-2 flex-wrap">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span>·</span>
        <Link href="/rassen" className="hover:text-[var(--honey)]">Alle Rassen</Link>
        <span>·</span>
        <span className="text-[var(--ink)]">{breed.name}</span>
      </nav>

      {/* ── SEKTION 1: HERO ────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto w-full px-5 pt-6 pb-10">
        <div className="grid md:grid-cols-[1.1fr_1fr] gap-8 items-start">
          {/* Foto */}
          <div className="relative">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt={`${breed.name} Foto`}
                className="w-full aspect-[4/3] object-cover rounded-3xl border border-white/10 shadow-2xl" />
            ) : (
              <div className="w-full aspect-[4/3] rounded-3xl border border-white/10 bg-gradient-to-br from-amber-500/10 to-orange-500/5 flex flex-col items-center justify-center gap-3">
                <span className="text-7xl">🐕</span>
                <span className="text-sm text-[var(--muted)]">{breed.name}</span>
              </div>
            )}
            {breed.fciGroup && (
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-xs px-2.5 py-1 rounded-lg text-white/80 font-medium">
                FCI Gruppe {breed.fciGroup}
              </div>
            )}
            {breed.isMixedBreed && (
              <div className="absolute top-3 left-3 bg-purple-500/80 backdrop-blur-sm text-xs px-2.5 py-1 rounded-lg text-white font-medium">
                Mischling
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="pill text-xs">🐾 Rasse-Lexikon</span>
              {breed.origin && <span className="pill text-xs">{breed.origin}</span>}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              {breed.name}
            </h1>
            {(breed.alternativeNames ?? []).length > 0 && (
              <p className="text-sm text-[var(--muted)] mb-3">
                Auch bekannt als: {(breed.alternativeNames ?? []).join(", ")}
              </p>
            )}
            <p className="bella-answer text-base sm:text-lg font-semibold text-[var(--ink)] leading-snug mb-3">{da.answer}</p>
            <p className="text-[var(--muted)] leading-relaxed mb-5 text-sm">{breed.description}</p>

            {/* Key Facts Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
              {[
                { icon: "⚖️", label: "Gewicht", val: breed.weightMin && breed.weightMax ? `${breed.weightMin}–${breed.weightMax} kg` : null },
                { icon: "📏", label: "Höhe", val: breed.heightMin && breed.heightMax ? `${breed.heightMin}–${breed.heightMax} cm` : null },
                { icon: "🎂", label: "Lebenserwartung", val: breed.lifeExpectancy ? `${breed.lifeExpectancy} Jahre` : null },
                { icon: "⚡", label: "Aktivität", val: ACT_LABEL[breed.activityLevel ?? ""] ?? null },
                { icon: "🏠", label: "Größe", val: SIZE_LABEL[breed.size] ?? null },
                { icon: "🌍", label: "Herkunft", val: breed.origin ?? null },
              ].filter((f) => f.val).map((f) => (
                <div key={f.label} className="card p-3 text-center">
                  <div className="text-lg mb-0.5">{f.icon}</div>
                  <div className="text-[10px] text-[var(--muted)] mb-0.5">{f.label}</div>
                  <div className="text-xs font-semibold">{f.val}</div>
                </div>
              ))}
            </div>

            <a href="#bella-advisor" className="btn-primary text-sm">
              Futter für meinen {breed.name} finden →
            </a>
          </div>
        </div>
      </section>

      {/* ── SEKTION 2: STECKBRIEF ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto w-full px-5 py-6">
        <div className="card p-6">
          <h2 className="text-xl font-extrabold tracking-tight mb-5">Steckbrief: {breed.name}</h2>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-2 text-sm">
            {[
              ["Rasse", breed.name],
              breed.fciGroup ? ["FCI-Gruppe", `${breed.fciGroup} — ${FCI_NAMES[breed.fciGroup] ?? ""}`] : null,
              breed.origin ? ["Herkunftsland", breed.origin] : null,
              breed.weightMin && breed.weightMax ? ["Gewicht", `${breed.weightMin}–${breed.weightMax} kg`] : null,
              breed.heightMin && breed.heightMax ? ["Schulterhöhe", `${breed.heightMin}–${breed.heightMax} cm`] : null,
              breed.lifeExpectancy ? ["Lebenserwartung", `${breed.lifeExpectancy} Jahre`] : null,
              breed.activityLevel ? ["Aktivitätslevel", ACT_LABEL[breed.activityLevel]] : null,
              breed.dailyExerciseMinutes ? ["Tägliche Bewegung", `mind. ${breed.dailyExerciseMinutes} Min.`] : null,
              breed.coatType ? ["Felltyp", COAT_LABEL[breed.coatType] ?? breed.coatType] : null,
              breed.shedding ? ["Haarausfall", SHED_LABEL[breed.shedding] ?? breed.shedding] : null,
              breed.groomingFrequency ? ["Pflegeaufwand", breed.groomingFrequency] : null,
              breed.trainingDifficulty ? ["Erziehung", DIFF_LABEL[breed.trainingDifficulty] ?? breed.trainingDifficulty] : null,
              breed.recommendedProteinPercentage ? ["Protein-Bedarf", `mind. ${breed.recommendedProteinPercentage} %`] : null,
              breed.recommendedFatPercentage ? ["Fett-Bedarf", `ca. ${breed.recommendedFatPercentage} %`] : null,
            ].filter(Boolean).map((row) => {
              const [k, v] = row as [string, string];
              return (
                <div key={k} className="flex items-baseline gap-2 py-1.5 border-b border-white/5">
                  <span className="text-[var(--muted)] min-w-[130px] flex-shrink-0">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SEKTION 3: CHARAKTER & WESEN ──────────────────────────────── */}
      {((breed.characterTraits ?? []).length > 0 || breed.temperament) && (
        <section className="max-w-5xl mx-auto w-full px-5 py-6">
          <div className="card p-6">
            <h2 className="text-xl font-extrabold tracking-tight mb-4">Charakter & Wesen</h2>
            {(breed.characterTraits ?? []).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {(breed.characterTraits ?? []).map((t) => (
                  <span key={t}
                    className={`text-sm px-3 py-1.5 rounded-xl border font-medium ${TRAIT_COLOR[t.toLowerCase()] ?? TRAIT_DEFAULT}`}>
                    {t}
                  </span>
                ))}
              </div>
            )}
            {breed.temperament && (
              <p className="text-sm text-[var(--muted)] leading-relaxed">{breed.temperament}</p>
            )}
            {breed.trainingDifficulty && (
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
                <span className="text-sm text-[var(--muted)]">Erziehbarkeit:</span>
                <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                  breed.trainingDifficulty === "leicht" ? "bg-emerald-500/15 text-emerald-300" :
                  breed.trainingDifficulty === "schwer" ? "bg-rose-500/15 text-rose-300" :
                  "bg-amber-500/15 text-amber-300"}`}>
                  {DIFF_LABEL[breed.trainingDifficulty]}
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── SEKTION 4: HERKUNFT & GESCHICHTE ─────────────────────────── */}
      {(breed.history || breed.origin) && (
        <section className="max-w-5xl mx-auto w-full px-5 py-6">
          <div className="card p-6">
            <h2 className="text-xl font-extrabold tracking-tight mb-4">Herkunft & Geschichte</h2>
            <div className="flex items-start gap-4">
              {breed.origin && (
                <div className="flex-shrink-0 bg-white/5 rounded-xl px-4 py-3 text-center min-w-[90px]">
                  <div className="text-2xl mb-1">🌍</div>
                  <div className="text-xs text-[var(--muted)]">{breed.origin}</div>
                </div>
              )}
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {breed.history ?? `Der ${breed.name} stammt ursprünglich aus ${breed.origin ?? "Europa"} und gehört ${breed.fciGroup ? `zur FCI-Gruppe ${breed.fciGroup} (${FCI_NAMES[breed.fciGroup] ?? ""})` : "zu den beliebten Haushunden"}. Die Rasse wurde über Generationen auf ${(breed.characterTraits ?? ["Freundlichkeit", "Loyalität"]).slice(0, 2).join(" und ")} gezüchtet.`}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── SEKTION 5: HALTUNG & EIGNUNG ──────────────────────────────── */}
      <section className="max-w-5xl mx-auto w-full px-5 py-6">
        <div className="card p-6">
          <h2 className="text-xl font-extrabold tracking-tight mb-5">Haltung & Eignung</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Familienhund", n: suitFamily, icon: "👨‍👩‍👧" },
              { label: "Für Anfänger", n: suitBeginner, icon: "🐾" },
              { label: "Wohnungshaltung", n: suitApartment, icon: "🏠" },
              { label: "Kinderfreundlich", n: suitChildren, icon: "👶" },
              { label: "Mit anderen Hunden", n: suitDogs, icon: "🐶" },
              { label: "Aktivitätsbedarf", n: breed.activityLevel === "sehrhoch" ? 5 : breed.activityLevel === "hoch" ? 4 : breed.activityLevel === "mittel" ? 3 : 2, icon: "⚡" },
            ].map(({ label, n, icon }) => (
              <div key={label} className="flex items-center gap-3 p-3 bg-white/3 rounded-xl">
                <span className="text-xl flex-shrink-0">{icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-[var(--muted)] mb-1">{label}</div>
                  <Stars n={n} />
                </div>
              </div>
            ))}
          </div>
          {breed.trainingNotes && (
            <p className="mt-4 pt-4 border-t border-white/5 text-sm text-[var(--muted)] leading-relaxed">{breed.trainingNotes}</p>
          )}
        </div>
      </section>

      {/* ── SEKTION 6: GESUNDHEIT & ERKRANKUNGEN ──────────────────────── */}
      {(breed.commonHealthIssues ?? []).length > 0 && (
        <section className="max-w-5xl mx-auto w-full px-5 py-6">
          <div className="card p-6">
            <h2 className="text-xl font-extrabold tracking-tight mb-2">Typische Gesundheitsthemen</h2>
            <p className="text-sm text-[var(--muted)] mb-5">
              Diese Erkrankungen treten beim {breed.name} überdurchschnittlich häufig auf. Das Futter
              kann zwar nicht heilen, aber die richtige Zusammensetzung kann die Progression verlangsamen.
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {(breed.commonHealthIssues ?? []).map((issue) => {
                const problemSlug = issueToProblemSlug(issue);
                return problemSlug ? (
                  <Link key={issue} href={`/problem/${problemSlug}`}
                    className="text-sm px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-400/20 text-rose-200 hover:bg-rose-500/20 transition-colors flex items-center gap-1">
                    {issue}
                    <span className="text-xs opacity-60">→</span>
                  </Link>
                ) : (
                  <span key={issue}
                    className="text-sm px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-400/20 text-rose-200">
                    {issue}
                  </span>
                );
              })}
            </div>
            {allergyProne && (
              <div className="bg-amber-500/8 border border-amber-400/15 rounded-xl p-4">
                <p className="text-sm text-amber-200 leading-relaxed">
                  <strong>Allergie-Hinweis:</strong> {breed.name} neigen zu Futterunverträglichkeiten.
                  BELLA bevorzugt in der Empfehlung unten hypoallergene und getreidfreie Sorten.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── SEKTION 7: PFLEGE & ERZIEHUNG ─────────────────────────────── */}
      {(breed.groomingNotes || breed.coatType || breed.trainingNotes) && (
        <section className="max-w-5xl mx-auto w-full px-5 py-6">
          <div className="grid sm:grid-cols-2 gap-5">
            {(breed.coatType || breed.groomingNotes) && (
              <div className="card p-6">
                <h2 className="text-lg font-extrabold tracking-tight mb-3">✂️ Pflege & Fell</h2>
                <div className="space-y-2 text-sm text-[var(--muted)]">
                  {breed.coatType && <p><strong>Felltyp:</strong> {COAT_LABEL[breed.coatType] ?? breed.coatType}</p>}
                  {breed.shedding && <p><strong>Haarausfall:</strong> {SHED_LABEL[breed.shedding]}</p>}
                  {breed.groomingFrequency && <p><strong>Pflege:</strong> {breed.groomingFrequency}</p>}
                  {breed.groomingNotes && <p className="mt-3 leading-relaxed">{breed.groomingNotes}</p>}
                </div>
              </div>
            )}
            {breed.trainingNotes && (
              <div className="card p-6">
                <h2 className="text-lg font-extrabold tracking-tight mb-3">🎓 Erziehung & Auslastung</h2>
                <div className="text-sm text-[var(--muted)] leading-relaxed">
                  {breed.trainingDifficulty && (
                    <div className="mb-3">
                      <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                        breed.trainingDifficulty === "leicht" ? "bg-emerald-500/15 text-emerald-300" :
                        breed.trainingDifficulty === "schwer" ? "bg-rose-500/15 text-rose-300" :
                        "bg-amber-500/15 text-amber-300"}`}>
                        {DIFF_LABEL[breed.trainingDifficulty]}
                      </span>
                    </div>
                  )}
                  <p>{breed.trainingNotes}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── SEKTION 8: ERNÄHRUNG ──────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto w-full px-5 py-6">
        <div className="card p-6 mb-5">
          <h2 className="text-xl font-extrabold tracking-tight mb-5">Ernährung: Was der {breed.name} braucht</h2>

          {/* Experttext */}
          <div className="space-y-4 text-sm text-[var(--muted)] leading-relaxed mb-6">
            {feedingParas.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          {/* Portionsrechner-Tabelle */}
          <div>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <span className="text-base">🍽️</span> Portionsrechner (Trockenfutter, ca. 3.500 kcal/kg)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="text-[var(--muted)]">
                    <th className="py-2 px-3 text-left font-medium border-b border-white/10">Gewicht</th>
                    <th className="py-2 px-3 font-medium border-b border-white/10">Wenig aktiv</th>
                    <th className="py-2 px-3 font-medium border-b border-white/10 text-[var(--honey)]">Normal aktiv</th>
                    <th className="py-2 px-3 font-medium border-b border-white/10">Sehr aktiv</th>
                  </tr>
                </thead>
                <tbody>
                  {portions.map((row) => (
                    <tr key={row.weight} className="hover:bg-white/3 transition-colors">
                      <td className="py-2.5 px-3 text-left font-semibold">{row.weight} kg</td>
                      <td className="py-2.5 px-3 text-[var(--muted)]">{row.low} g</td>
                      <td className="py-2.5 px-3 font-medium text-[var(--honey)]">{row.med} g</td>
                      <td className="py-2.5 px-3 text-[var(--muted)]">{row.high} g</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-[var(--muted)] mt-2">
              * RER-Formel (70 × kg^0,75 × Aktivitätsfaktor). Bei Kastration –10–15 %. Tierarzt-Rücksprache bei Erkrankung.
            </p>
          </div>
        </div>

        {/* Nährstoffbedarf */}
        {(breed.recommendedProteinPercentage || breed.recommendedFatPercentage) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {breed.recommendedProteinPercentage && (
              <div className="card p-4 text-center">
                <div className="text-2xl font-extrabold text-[var(--honey)]">{breed.recommendedProteinPercentage}%</div>
                <div className="text-xs text-[var(--muted)] mt-1">Rohprotein mind.</div>
              </div>
            )}
            {breed.recommendedFatPercentage && (
              <div className="card p-4 text-center">
                <div className="text-2xl font-extrabold text-[var(--honey)]">{breed.recommendedFatPercentage}%</div>
                <div className="text-xs text-[var(--muted)] mt-1">Rohfett ca.</div>
              </div>
            )}
            <div className="card p-4 text-center">
              <div className="text-2xl font-extrabold text-[var(--honey)]">2×</div>
              <div className="text-xs text-[var(--muted)] mt-1">Mahlzeiten tägl.</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-extrabold text-[var(--honey)]">{midPortion?.med ?? "~200"}g</div>
              <div className="text-xs text-[var(--muted)] mt-1">Richtwert {midWeight} kg</div>
            </div>
          </div>
        )}
      </section>

      {/* ── SEKTION 9: BELLA KI-BERATERIN ─────────────────────────────── */}
      <section id="bella-advisor" className="max-w-5xl mx-auto w-full px-5 py-6 scroll-mt-20">
        <div className="card p-6 mb-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-lg font-bold text-black flex-shrink-0">B</div>
            <div>
              <div className="font-bold text-sm">BELLA — dein KI-Futter-Berater</div>
              <div className="text-xs text-[var(--muted)]">Aus 11.000+ echten Produkten das optimale Futter finden</div>
            </div>
          </div>
        </div>
        <BellaAdvisorWrapper
          introMessage={bellaIntro}
          autoStart={bellaAutoStart}
          pageQuickOptions={[
            { label: "Welpe (unter 1 Jahr)", msg: `Mein ${breed.name} ist noch ein Welpe, unter 1 Jahr alt` },
            { label: "Erwachsen (1–7 Jahre)", msg: `Mein ${breed.name} ist erwachsen, ca. 3–5 Jahre alt` },
            { label: "Senior (7+ Jahre)", msg: `Mein ${breed.name} ist ein Senior, über 7 Jahre alt` },
            { label: "Allergie / sensibler Magen", msg: `Mein ${breed.name} hat eine Futtermittelallergie oder einen empfindlichen Magen` },
          ]}
        />
      </section>

      {/* ── SEKTION 10: FUTTER-EMPFEHLUNGEN ───────────────────────────── */}
      {foods.length > 0 && (
        <section className="max-w-5xl mx-auto w-full px-5 py-6">
          <h2 className="text-xl font-extrabold tracking-tight mb-5">
            Futter-Empfehlungen für {breed.name}
            <span className="ml-2 text-sm text-[var(--muted)] font-normal">nach Score sortiert</span>
          </h2>
          <ProductSchemaBlock foods={foods.map(f => ({ name: f.name, brand: f.brand, type: f.type, protein: f.protein, price_per_kg: f.price_per_kg, affiliate_url: f.affiliate_url, image_url: f.image_url }))} listName={`Futter für ${breed.name}`} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {foods.map((f, i) => (
              <a key={i} href={f.affiliate_url} target="_blank" rel="sponsored noopener noreferrer"
                className="card p-4 hover:border-[var(--honey)] transition-colors group flex flex-col">
                {f.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.image_url} alt={f.name}
                    className="w-full h-40 object-contain mb-3 rounded-xl bg-white/3" />
                )}
                <div className="text-xs text-[var(--muted)] mb-1">{f.brand}</div>
                <div className="text-sm font-semibold mb-2 line-clamp-2 flex-1">{f.name}</div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {f.is_grain_free && <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300">Getreidefrei</span>}
                  {f.is_hypoallergenic && <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/15 text-blue-300">Hypoallergen</span>}
                  {f.protein && <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/50">{f.protein}</span>}
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm font-bold text-[var(--honey)]">
                    {f.price_per_kg ? `${Number(f.price_per_kg).toFixed(2).replace(".", ",")} €/kg` : "Preis ansehen"}
                  </span>
                  <span className="text-xs text-[var(--muted)]">→ ansehen</span>
                </div>
              </a>
            ))}
          </div>
          <p className="text-xs text-[var(--muted)] mt-3">* Affiliate-Links (AWIN). Preise können variieren.</p>
        </section>
      )}

      {/* ── SEKTION 11: ÄHNLICHE RASSEN ───────────────────────────────── */}
      {similar.length > 0 && (
        <section className="max-w-5xl mx-auto w-full px-5 py-6">
          <h2 className="text-xl font-extrabold tracking-tight mb-5">Ähnliche Rassen</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {similar.map((b) => {
              const p = PHOTO[b.slug] ?? b.imageUrl;
              return (
                <Link key={b.slug} href={`/rasse/${b.slug}`}
                  className="card p-4 hover:border-[var(--honey)] transition-colors text-center group">
                  {p ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p} alt={b.name} className="w-full h-28 object-cover rounded-xl mb-3" />
                  ) : (
                    <div className="w-full h-28 rounded-xl mb-3 bg-white/5 flex items-center justify-center text-3xl">🐕</div>
                  )}
                  <div className="text-sm font-semibold group-hover:text-[var(--honey)] transition-colors">{b.name}</div>
                  <div className="text-xs text-[var(--muted)] mt-0.5">{SIZE_LABEL[b.size]?.split(" ")[0]}</div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── SEKTION 12: HÄUFIGE FRAGEN ────────────────────────────────── */}
      <section className="max-w-5xl mx-auto w-full px-5 py-6">
        <h2 className="text-xl font-extrabold tracking-tight mb-5">Häufige Fragen zum {breed.name}</h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <details key={i} className="card p-5 group">
              <summary className="font-semibold text-sm cursor-pointer list-none flex items-center justify-between gap-3">
                {f.q}
                <span className="text-[var(--muted)] group-open:rotate-180 transition-transform flex-shrink-0">▾</span>
              </summary>
              <p className="text-sm text-[var(--muted)] leading-relaxed mt-3 pt-3 border-t border-white/5">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── AUTHOR + FOOTER ────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto w-full px-5 py-8">
        <AuthorBox compact />
      </div>
      <SiteFooter />
    </div>
  );
}
