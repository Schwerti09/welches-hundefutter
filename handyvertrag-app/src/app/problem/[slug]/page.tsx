import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import { PROBLEMS, PROBLEM_BY_SLUG } from "@/data/problems";
import { FUTTERTYP_BY_SLUG } from "@/data/futtertypen";
import { PROBLEM_TO_FUTTERTYPEN } from "@/lib/issue-to-problem";
import ScoreBadge from "@/components/ScoreBadge";
import AuthorBox from "@/components/AuthorBox";
import ProductSchemaBlock from "@/components/ProductSchemaBlock";
import BellaAdvisorWrapper from "@/components/BellaAdvisorWrapper";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";
import CitableStat from "@/components/CitableStat";
import { problemDirectAnswer } from "@/lib/direct-answer";
import type { CitableVariant } from "@/db/queries/stats";

// Problem-Slug → zitierfähige Live-Statistik (nur wo fachlich passend)
const PROBLEM_STAT: Record<string, CitableVariant> = {
  "allergie": "hypoallergen",
  "futtermittelunvertraeglichkeit": "monoprotein",
  "haut-und-fell": "getreidefrei",
};

export const revalidate = 86400;

export function generateStaticParams() {
  return PROBLEMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = PROBLEM_BY_SLUG[slug];
  if (!p) return {};
  return {
    title: p.tagline,
    description: `${p.description.slice(0, 150)}… BELLA findet das passende Futter aus 11.000+ Sorten.`,
    alternates: {
      canonical: `https://welches-hundefutter.today/problem/${p.slug}`,
      languages: {
        "de-DE": `https://welches-hundefutter.today/problem/${p.slug}`,
        "de-AT": `https://welches-hundefutter.today/problem/${p.slug}`,
        "de-CH": `https://welches-hundefutter.today/problem/${p.slug}`,
        "x-default": `https://welches-hundefutter.today/problem/${p.slug}`,
      },
    },
  };
}

interface FoodRow {
  brand: string; name: string; type: string; protein: string | null;
  price_per_kg: string | null; is_grain_free: boolean; is_hypoallergenic: boolean;
  affiliate_url: string; image_url: string | null; score: number | null;
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
           is_grain_free, is_hypoallergenic, affiliate_url, image_url, score
         FROM dog_foods WHERE ${filter}
         ORDER BY ${nameKey}, price_per_kg ASC
       ) d ORDER BY ${bias} score DESC NULLS LAST, price_per_kg ASC LIMIT 6`,
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

  const da = problemDirectAnswer(problem);
  const faqItems = [
    { question: da.question, answer: da.answer },
    {
      question: `Was ist das beste Hundefutter bei ${problem.name}?`,
      answer: `${problem.description} Achte besonders auf folgende Kriterien: ${problem.recommendedCriteria.join(", ")}. BELLA filtert den Live-Katalog automatisch nach diesen Eigenschaften.`,
    },
    {
      question: `Welche Zutaten sollte Futter bei ${problem.name} vermeiden?`,
      answer: `Bei ${problem.name} solltest du auf folgende Inhaltsstoffe möglichst verzichten: ${problem.avoidIngredients.join(", ")}. Diese können bestehende Beschwerden verschlimmern oder die Verträglichkeit zusätzlich verschlechtern. BELLA schließt diese Zutaten bei der Futterauswahl für deinen Hund automatisch aus und zeigt dir nur passende Sorten aus dem Live-Katalog an.`,
    },
    {
      question: `Wie lange dauert eine Futterumstellung bei ${problem.name}?`,
      answer: `Eine Futterumstellung bei ${problem.name} sollte schrittweise über 7–10 Tage erfolgen, um Verdauungsprobleme zu vermeiden — das neue Futter wird dabei zunehmend untergemischt. Erste Verbesserungen zeigen sich oft nach 2–4 Wochen, bei chronischen Beschwerden kann es länger dauern. Beobachte deinen Hund und sprich bei anhaltenden oder starken Symptomen mit dem Tierarzt.`,
    },
  ];

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData
        type="article"
        article={{
          headline: problem.tagline,
          description: problem.description,
          url: `https://welches-hundefutter.today/problem/${problem.slug}`,
          dateModified: "2026-06-01",
          speakableSelectors: ["h1", ".bella-answer"],
        }}
      />
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
        <p className="bella-answer text-lg sm:text-xl font-semibold text-[var(--ink)] leading-snug max-w-2xl mb-4">{da.answer}</p>
        <p className="text-[var(--muted)] leading-relaxed max-w-2xl mb-8">{problem.description}</p>
        {PROBLEM_STAT[slug] && <CitableStat variant={PROBLEM_STAT[slug]} />}
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

      {/* EEAT: Sensibler Magen */}
      {slug === "sensibler-magen" && (
        <section className="max-w-5xl mx-auto w-full px-5 py-10">
          <div className="card p-8">
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Sensibler Magen beim Hund: Was du wissen solltest</h2>
            <div className="space-y-5 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                <strong>Was "sensibler Magen" medizinisch bedeutet:</strong> Der Begriff fasst mehrere unterschiedliche
                Zustände zusammen. Manche Hunde reagieren auf Futterwechsel mit Durchfall oder Erbrechen
                (gestorte Darmflora-Adaptionsfahigkeit), andere haben eine chronisch erhohte Magensaurereaktivitat
                oder eine subklinische entzundliche Darmerkrankung (IBD). Wichtig: Wiederholtes Erbrechen oder
                Durchfall uber mehr als 2 Wochen ist kein "normaler sensibler Magen" sondern ein Tierarzt-Fall.
              </p>
              <p>
                <strong>Monoprotein und hochverdauliche Kohlenhydrate:</strong> Bei diagnostisch unklarem empfindlichem
                Magen ist die erste Massnahme ein leicht verdauliches Monoprotein (Pute, Lamm, Kaninchen) kombiniert
                mit gut verdaulichen Kohlenhydraten wie Reis oder Kartoffel. Mais, Weizen und hochverarbeitete
                Nebenerzeugnisse belasten das Verdauungssystem starker und sollten zunachst vermieden werden.
                Ballaststoffgehalt unter 4 % TS ist bei empfindlichem Magen gunstig.
              </p>
              <p>
                <strong>Prabiotika und Darmflora:</strong> Naturliche Prabiotika wie Chicoreewurzel-Inulin oder
                Flohsamenschalen (Psyllium) konnen die Darmflora stabilisieren. Klinische Studien zeigen, dass
                Fructooligosaccharide (FOS) das Wachstum von Bifidobacterium und Lactobacillus im Hundedarm fordern.
                Diese Zutaten sind in besseren Sensibel-Futtern bereits enthalten. Separate Prabiotika-Praperate
                sind meist nur bei anhaltender Dysbiose nach Antibiotika-Therapie sinnvoll.
              </p>
              <p>
                <strong>Omega-3 und Magenreizung:</strong> EPA und DHA aus Fischol haben in Studien anti-inflammatorische
                Wirkung auf die Darmschleimhaut gezeigt. Ein Anteil von mindestens 0,5 % Fischol in der Tagesration
                kann die Schleimhautintegritat unterstutzen. Gleichzeitig: Zu viel Fett insgesamt (uber 18 % TS)
                beschleunigt die Magenentleerung und erhoht das Durchfallrisiko bei empfindlichen Hunden.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* EEAT: Futtermittelunvertraeglichkeit */}
      {slug === "futtermittelunvertraeglichkeit" && (
        <section className="max-w-5xl mx-auto w-full px-5 py-10">
          <div className="card p-8">
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Futtermittelunvertraeglichkeit: Was du wissen solltest</h2>
            <div className="space-y-5 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                <strong>Unvertraeglichkeit ist nicht dasselbe wie Allergie:</strong> Eine Futtermittelunvertraeglichkeit
                ist keine immunologische Reaktion. Sie entsteht durch fehlende oder unzureichende Enzyme,
                durch direkte chemische Reizwirkung von Bestandteilen oder durch eine Storung der Darmpermeabilitat.
                Die Symptome sind ahnlich (Durchfall, Erbrechen, Hautprobleme), aber die Reaktion ist
                oft dosisabhangig und setzt langsamer ein. Geringe Mengen des Auslösers werden manchmal
                toleriert, was bei echter Allergie nicht der Fall ist.
              </p>
              <p>
                <strong>Die haufigsten Auslöser:</strong> Laktose (viele Hunde haben nach der Welphenphase reduzierte
                Laktase-Aktivitat), bestimmte Getreideproteine (Gluten bei Glutenunvertraeglichkeit, v.a. dokumentiert
                beim Irish Setter), hochverarbeitete tierische Proteine mit Histamingehalten sowie kunstliche
                Aromen und Konservierungsstoffe. Histamin ist insbesondere in schlecht verarbeitetem Fisch
                und langer gelagertem Fleisch ein Thema.
              </p>
              <p>
                <strong>Wie Futterwechsel richtig funktioniert:</strong> Bei Verdacht auf Futtermittelunvertraeglichkeit
                sollte der Wechsel auf ein anderes Futter uber mindestens 7-10 Tage langsam erfolgen
                (20 % neu / 80 % alt, stufenweise anpassen). Abrupte Wechsel verschlimmern Magen-Darm-Symptome
                unabhangig vom Auslöser, weil die Darmflora Zeit zur Anpassung braucht. Wenn Symptome
                nach dem Wechsel verschwinden, war das alte Futter der Auslöser.
              </p>
              <p>
                <strong>Langzeitmanagement:</strong> Im Gegensatz zur Allergie kann sich eine Unvertraeglichkeit
                manchmal verbessern oder verandern. Rotationsernährung (alle 3-6 Monate Proteinquelle wechseln)
                kann helfen, neue Unvertraeglichkeiten zu vermeiden, indem eine Sensibilisierung durch dauerhaft
                gleiche Zutaten verhindert wird. Wichtig: Auch bei Unvertraeglichkeit gilt tierarztliche
                Abklarung vor Selbstdiagnose.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* EEAT: Gelenkprobleme */}
      {slug === "gelenkprobleme" && (
        <section className="max-w-5xl mx-auto w-full px-5 py-10">
          <div className="card p-8">
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Gelenkprobleme beim Hund: Was Futter beitragen kann</h2>
            <div className="space-y-5 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                <strong>Gelenke und Ernahrung — was belegt ist:</strong> Futter kann Gelenkerkrankungen nicht heilen.
                Es kann aber nachweislich den Entzundungsstatus beeinflussen und die Gelenkknaerpelstruktur
                unterstutzen. Die zwei evidenzbasiert wichtigsten Nahrstoffe sind <strong>Omega-3-Fettsauren</strong>
                (EPA/DHA aus Fischol) und <strong>naturliche Glucosamin- und Chondroitinquellen</strong> aus
                Knorpel- und Bindegewebsanteilen im Fleisch. Hochwertige Fleischsorten wie Huhn mit Knorpel
                oder Grunscha-Muscheln liefern diese Komponenten in naturlicher Matrix.
              </p>
              <p>
                <strong>Omega-3 — konkrete Dosierung:</strong> Fur eine anti-inflammatorische Wirkung werden
                beim Hund 40-100 mg EPA+DHA pro kg Korpergewicht taglich empfohlen (Dodd et al., 2019).
                Ein 20-kg-Hund braucht also mindestens 800 mg EPA+DHA taglich. Viele Fischol-Zugaben in
                Standardfutter erreichen diese Dosis nicht. Zusatzliches Fischol in klinischer Dosis oder
                spezialisierte Gelenkfutter mit erhohetem Omega-3-Anteil sind fur betroffene Hunde sinnvoll.
              </p>
              <p>
                <strong>Gewicht als primare Variable:</strong> 1 kg Ubergewicht erhoht die Gelenklast
                jedes Schrittes um den 2-4-fachen Faktor der Schwerkraft (bei Trab/Lauf noch mehr).
                Bei Gelenkproblemen ist normales Korpergewicht wichtiger als jedes Supplement. Ein Hund
                mit Huftgelenkproblemen und 3 kg Ubergewicht profitiert mehr von einem kalorienreduzierten
                Futter als von teuren Gelenkzusatzen bei gleichbleibendem Ubergewicht.
              </p>
              <p>
                <strong>Grunscha-Muschel (Perna canaliculus):</strong> Extrakt der Grunscha-Muschel enthalt
                neben EPA/DHA auch seltene Lipide (ETA), die spezifisch die 5-Lipoxygenase hemmen. Mehrere
                randomisiert-kontrollierte Studien bei Hunden mit Osteoarthritis zeigen signifikante
                Schmerzreduktion nach 8-12 Wochen. Der Effekt ist kein Ersatz fur Schmerzmittel, aber eine
                belegte ernahrerische Unterstutzung.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* EEAT: Arthrose */}
      {slug === "arthrose" && (
        <section className="max-w-5xl mx-auto w-full px-5 py-10">
          <div className="card p-8">
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Arthrose beim Hund: Ernahrung als Therapiebegleitung</h2>
            <div className="space-y-5 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                <strong>Was Arthrose ist und was sie nicht ist:</strong> Arthrose (Osteoarthritis) ist ein
                degenerativer, progressiver Knorpelabbau — keine Entzundungserkrankung im klassischen Sinne,
                aber Entzundungsmediatoren spielen im Verlauf eine Rolle. Sie betrifft rund 20 % aller Hunde,
                bei uber 7-jahrigen Hunden grosserer Rassen bis zu 80 %. Ernahrung kann den Verlauf nicht
                stoppen, aber die Entzundungsaktivitat im Gelenk beeinflussen und die Lebensqualitat
                spurbar verbessern.
              </p>
              <p>
                <strong>EPA vs. DHA — beide zahlen:</strong> EPA (Eicosapentaensaure) hemmt direkt
                die Arachidonsaure-Kaskade, die Prostaglandine und Leukotriene produziert. DHA
                (Docosahexaensaure) wirkt indirekt uber Resolvine und Protektine. Fur die Arthrose-Unterstutzung
                ist das EPA:DHA-Verhaltnis weniger kritisch als die absolute Tagesdosis. Ziel ist mindestens
                1.000 mg EPA+DHA pro 10 kg Korpergewicht taglich.
              </p>
              <p>
                <strong>Kalorienmanagement ist Pflichtprogramm:</strong> Jedes Kilo Ubergewicht beschleunigt
                den Knorpelabbau messsbar. Bei arthrotischen Hunden sollte der BCS (Body Condition Score)
                konsequent bei 4-5 von 9 gehalten werden. Ein spezialisiertes Gelenk-Trockenfutter mit
                reduziertem Kaloriengehalt und erhohem Omega-3-Anteil erfullt oft beide Anforderungen.
              </p>
              <p>
                <strong>Antioxidantien — Vitamin E und C:</strong> Freie Radikale aus dem Entzundungsgeschehen
                beschadigen das Knorpelgewebe zusatzlich. Vitamin E (alpha-Tocopherol) in Futtern mit
                mindestens 400 IE/kg TS hat in Studien oxidativen Gelenkstress reduziert. Vitamin C
                synthetisieren Hunde selbst, aber unter chronischer Erkrankung kann der Bedarf die
                Eigenproduktion ubersteigen. Einige spezalisierte Arthrose-Futter enthalten beide.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* EEAT: Nierenprobleme */}
      {slug === "nierenprobleme" && (
        <section className="max-w-5xl mx-auto w-full px-5 py-10">
          <div className="card p-8">
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Nierenprobleme beim Hund: Ernahrung ist der entscheidende Hebel</h2>
            <div className="space-y-5 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                <strong>Chronische Nierenerkrankung (CKD) — warum Futter so wichtig ist:</strong> Bei CKD
                konnen die Nieren Phosphat, Stickstoffabbauprodukte und Natriumbelasung nicht mehr ausreichend
                filtern. Dietary-Management ist nicht optional, sondern klinisch belegt lebensverlangernd.
                Die IRIS-Leitlinien (International Renal Interest Society) fur Hunde empfehlen ab Stadium 2
                explizit eine Phosphatrestriktion. <strong>Normales Futter mit hohem Phosphatgehalt</strong>
                beschleunigt die Progression signifikant.
              </p>
              <p>
                <strong>Phosphat — die kritische Zielgrosse:</strong> Nierenfutter hat typischerweise unter
                0,4-0,5 % Phosphor in der Trockenmasse. Standardfutter liegt oft bei 0,8-1,5 %. Nicht jedes
                als "nierenschonend" beworbene Futter trifft diesen Wert. Kaufentscheidend ist die Angabe
                im Nahrwertpanel: Phosphor in % TS unter 0,5 gilt als nierenschonend im CKD-Kontext.
              </p>
              <p>
                <strong>Protein — Qualitat vor Menge:</strong> Die alte Empfehlung "Nierenhunde brauchen wenig Protein"
                ist uberholt. Aktuell gilt: Hochwertiges, bioverfugbares Protein in moderater Menge ist besser als
                niedrige Mengen minderwertigen Proteins. Wichtig ist die Reduktion von Stickstoffabbauprodukten
                (Harnstoff, Kreatinin) — und die entstehen vor allem aus schlecht verdaulichem Protein.
                Muskelfleisch ist besser als Nebenerzeugnisse.
              </p>
              <p>
                <strong>Nassfutter als Standard:</strong> Nierenkranke Hunde mussen viel trinken. Da viele
                CKD-Hunde spontan zu wenig Wasser aufnehmen, ist der hohe Feuchtigkeitsgehalt von Nassfutter
                (75-80 %) ein klinischer Vorteil gegenuber Trockenfutter. Wenn der Hund kein Nass-Nierenfutter
                akzeptiert, kann Wasser ins Trockenfutter gemischt werden.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* EEAT: Leberprobleme */}
      {slug === "leberprobleme" && (
        <section className="max-w-5xl mx-auto w-full px-5 py-10">
          <div className="card p-8">
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Leberprobleme beim Hund: Ernahrung als Entlastung</h2>
            <div className="space-y-5 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                <strong>Leber und Ernahrung — der direkte Zusammenhang:</strong> Die Leber ist das zentrale
                Stoffwechselorgan fur Entgiftung, Proteinverwertung, Fettmetabolismus und Glukosespeicherung.
                Bei Lebererkrankungen wird die Kapazitat fur alle diese Funktionen reduziert. Futter beeinflusst
                direkt, wie stark die Leber belastet wird. Ein hoher Kupfergehalt ist bei kupferspeichernden
                Rassen (Bedlington Terrier, West Highland White Terrier, Labrador Retriever) aktiv schadigend.
              </p>
              <p>
                <strong>Kupfer — die unterschatzte Gefahr:</strong> Verschiedene Hunderassen haben genetisch
                bedingte Varianten in der Kupfertransportregulation (COMMD1, ATP7A, ATP7B). Betroffen sind
                vor allem: Bedlington Terrier (hochste Pravalenz), West Highland White Terrier, Skye Terrier
                und in jungerer Forschung auch Labrador Retriever. Fur diese Rassen ist ein kupferarmes Futter
                (unter 8 mg/kg TS) keine Luxus-Option, sondern medizinische Prievention. Leber, Nieren und
                bestimmte Fischsorten haben naturlich hohe Kupfergehalte und sollten bei Risikotieren
                vermieden werden.
              </p>
              <p>
                <strong>Protein — leicht verdaulich, aber nicht wenig:</strong> Bei Lebererkrankungen fallt
                Ammoniakbildung aus dem Proteinabbau ins Gewicht. Leicht verdauliches Protein (Huhn, Ei,
                Fisch) produziert weniger Abbauprodukte als schwer verdauliches. Die traditionelle Empfehlung
                "wenig Protein bei Leberkranken" gilt nur bei hepatischer Enzephalopathie (Stadium 3/4) —
                in fruheren Stadien ist ausreichend Protein wichtig fur Gewebereparatur.
              </p>
              <p>
                <strong>Antioxidantien und leberschutzende Nahrungsmittel:</strong> SAMe
                (S-Adenosylmethionin), Silymarin (Mariendistel-Extrakt) und Vitamin E konnen die
                Leberzellmembran-Integritat unterstutzen. Diese Wirkstoffe finden sich selten in
                Standard-Trockenfutter, werden aber als Erganzungspraparat haufig eingesetzt.
                Tierarztliche Begleitung ist bei Lebererkrankungen unbedingt notig.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* EEAT: Diabetes */}
      {slug === "diabetes" && (
        <section className="max-w-5xl mx-auto w-full px-5 py-10">
          <div className="card p-8">
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Diabetes beim Hund: Futter als Blutzuckermanagement</h2>
            <div className="space-y-5 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                <strong>Caniner Diabetes ist meist Typ 1:</strong> Im Gegensatz zum menschlichen Typ-2-Diabetes
                (Insulinresistenz) ist Diabetes beim Hund fast ausschliesslich ein insulinabhangiger Diabetes
                mellitus (IDDM) durch Zerstorung der Beta-Zellen im Pankreas. Das bedeutet: Der Hund braucht
                meist lebenslang externe Insulingaben, Futter kann den Insulinbedarf aber erheblich
                beeinflussen. Wichtig ist vor allem die Konsistenz — gleiche Futtermenge zur gleichen Zeit,
                direkt koordiniert mit der Insulingabe.
              </p>
              <p>
                <strong>Glykamischer Index und Starkequellen:</strong> Kohlenhydrate mit hohem
                glykamischen Index (schnell verdauliche Starke aus Mais, Weizen, weissem Reis) verursachen
                steile Blutzuckerspitzen. Komplexe Kohlenhydrate (Gerste, Vollkornreis, Linsen, Kartoffel
                mit Schale) werden langsamer verstoffwechselt. Fur diabetische Hunde ist Trockenfutter
                mit einem Ballaststoffgehalt von 5-15 % TS und quellfahigen Fasern (Psyllium, Beet-Pulp)
                gunstig, da diese die Magenentleerung verzogern.
              </p>
              <p>
                <strong>Mahlzeitkonsistenz als Pflicht:</strong> Blutzuckerregulation bei insulinpflichtigem
                Diabetes funktioniert nur mit exakt reproduzierbarer Futteraufnahme. Freifutterung (Futter
                steht immer bereit) ist fur diabetische Hunde kontraindiziert. Zwei feste Mahlzeiten
                taglich, zeitlich an die Insulingaben gebunden, ist das Standardprotokoll. Snacks und
                Leckerli mussen kalorisch eingerechnet und zur richtigen Zeit gegeben werden.
              </p>
              <p>
                <strong>Gewicht und Diabetesmanagement:</strong> Ubergewicht erhoht die Insulinresistenz
                auch beim Hund. Normalisierung des Korpergewichts verbessert die Insulinsensitivitat
                und kann den Insulinbedarf reduzieren. Kastrierte weibliche Hunde haben ein erhoht
                Diabetesrisiko — bei diesen Tieren ist Gewichtsmanagement besonders relevant.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* EEAT: Pankreatitis */}
      {slug === "pankreatitis" && (
        <section className="max-w-5xl mx-auto w-full px-5 py-10">
          <div className="card p-8">
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Pankreatitis beim Hund: Fetthalt ist entscheidend</h2>
            <div className="space-y-5 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                <strong>Warum Fett das Pancreas belastet:</strong> Die Bauchspeicheldruse produziert
                fettverdauende Enzyme (Lipase, Phospholipase). Bei Pankreatitis werden diese Enzyme
                vorzeitig innerhalb der Druse aktiviert und greifen das eigene Gewebe an.
                Fettreiche Mahlzeiten stimulieren die Enzymproduktion stark und konnen eine akute
                Episode auslosen oder eine chronische Pankreatitis verschlimmern. Das ist der Grund,
                warum Fetthalt die absoluteste Ernahrungsmassgabe bei Pankreatitis ist.
              </p>
              <p>
                <strong>Konkrete Fettwerte:</strong> Fur Hunde mit akuter oder chronisch-rezidivierender
                Pankreatitis gilt ein Fetthalt von maximal <strong>10 % in der Trockenmasse</strong> als
                sicher. Viele Premium-Trockenfutter liegen bei 15-22 % Fett TS. Ein spezielles Pankreatitis-
                oder "Low-Fat"-Futter ist keine Option, sondern medizinische Notwendigkeit.
                Im Akutstadium wird zunachst oft eine kurze Nahrungskarenz (12-24 Stunden) verordnet,
                bevor schrittweise auf Low-Fat umgestellt wird.
              </p>
              <p>
                <strong>Kleine, haufige Mahlzeiten:</strong> Grosse Mahlzeiten stimulieren die Bauchspeicheldruse
                starker als kleine. Drei bis vier kleine Mahlzeiten taglich statt einer oder zwei grossen
                reduzieren den Stimulationsreiz erheblich. Dies gilt sowohl fur die Akutphase als auch fur
                die Langzeiternährung bei chronischer Pankreatitis.
              </p>
              <p>
                <strong>Was absolut zu vermeiden ist:</strong> Tafelfleisch mit hohem Fettanteil
                (Schweinebraten, Speck, Wurst), Kochfette, fettreiche Snacks und Kauartikel mit
                tierischen Fetten sind fur Pankreatitis-Hunde verboten. Auch eine einmalige fettreiche
                Mahlzeit bei ansonsten Low-Fat-Ernahrung kann einen Schub auslosen. Konsequenz ist hier
                wichtiger als bei fast jeder anderen Ernahrungsempfehlung.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* EEAT: Haut und Fell */}
      {slug === "haut-und-fell" && (
        <section className="max-w-5xl mx-auto w-full px-5 py-10">
          <div className="card p-8">
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Haut und Fell beim Hund: Was Ernahrung bewirken kann</h2>
            <div className="space-y-5 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                <strong>Haut als Ernahrungsspiegel:</strong> Die Haut ist das grosste Organ des Hundes und
                macht 25-30 % des gesamten Proteinbedarfs aus. Mange an bestimmten Aminosauren
                (Methionin, Cystein), Fettsauren oder Mikronnahrstoffen zeigt sich zuerst an Fell und Haut.
                Ein stumpfes, sprodes Fell ist oft ein fruher Indikator fur ernahrerische Defizite
                — bevor andere Mangelsymptome auftreten.
              </p>
              <p>
                <strong>Omega-6:Omega-3-Verhaltnis — die entscheidende Grosse:</strong> Linolsaure (Omega-6,
                z.B. aus Huhnerchenfett) ist essentiell fur die Hautbarriere. Zu viel Omega-6 ohne
                ausreichend Omega-3 verschiebt aber das Entzundungsgleichgewicht pro-inflammatorisch.
                Das ideale Verhaltnis liegt bei 5:1 bis 10:1 (Omega-6:Omega-3). Viele gunstige Trockenfutter
                haben Verhaltnisse von 20:1 oder mehr. Lachsol oder Fischol als Erganzung kann
                dieses Gleichgewicht korrigieren.
              </p>
              <p>
                <strong>Zink — der unterschatzte Mikronnahrstoff:</strong> Zinkmangel verursacht beim Hund
                eine spezifische Hauterkrankung (Zink-responsive Dermatose). Besonders betroffen sind
                Siberian Husky und Alaskan Malamute, die genetisch bedingt Zink schlechter absorbieren.
                Typische Symptome: Schuppenbildung, Krusten um Maul, Augen und Nasenlocher sowie
                stumpfes Fell. Tierarztliche Diagnose notig, aber zinkarmes Futter ist ein bekannter
                Ausloser.
              </p>
              <p>
                <strong>Biotin und Schwefelamino-Sauren:</strong> Biotin (Vitamin B7) ist fur die Keratinsynthese
                essenziell. Viele hochwertige Futter enthalten ausreichend Biotin, aber bei starkem
                Haarverlust ausserhalb der normalen Wechselhaarsaison oder bei Schuppenbildung kann ein
                Biotin-Mangel vorliegen. Eier enthalten Avidin, das die Biotin-Absorption hemmt —
                daher sollten rohe Eier bei Fell-Problemen nicht verfuttert werden.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* EEAT: Zahnsteine */}
      {slug === "zahnsteine" && (
        <section className="max-w-5xl mx-auto w-full px-5 py-10">
          <div className="card p-8">
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Zahnsteine beim Hund: Was Futter tatsachlich beitragen kann</h2>
            <div className="space-y-5 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                <strong>Wie Zahnstein entsteht:</strong> Zahnbelag (Plaque) aus Bakterien mineralisiert
                innerhalb von 2-3 Tagen durch Kalzium und Phosphor aus dem Speichel zu Zahnstein (Calculus).
                Zahnstein selbst schadet weniger als der darunter liegende Plaque — dieser fuhrt zu
                Gingivitis und Parodontitis. Ernahrung kann die Plaquebildung verlangsamen, aber nicht stoppen.
                Regelmassige Zahnburstenreinigung ist der einzig belegte primarpraven Ansatz.
              </p>
              <p>
                <strong>Der Trockenfutter-Mythos:</strong> Die weitverbreitete Meinung, dass Trockenfutter
                Zahne reinigt, ist wissenschaftlich nicht belegt. Kibbles (Brocken) zerbrockeln beim Abbeissen,
                bevor eine scheuernde Wirkung auf die Zahnflache entsteht. Ausnahme: Speziell entwickelte
                dentale Trockenfutter (z.B. mit VOHC-Siegel) haben tatsachlich eine belegte Plaqueregulierung
                durch besondere Textur und Grosse. Normales Trockenfutter hat diesen Effekt nicht.
              </p>
              <p>
                <strong>Was wirklich hilft:</strong> Enzymatische Zahnpflegesnacks oder -pasten (Amylase,
                Lysozym) konnen die Bakterienlast im Speichel reduzieren. Rohe Rinderknochen (keine
                gekochten Knochen!) haben abrasive Wirkung und sind klinisch untersucht. Das Risiko von
                Knochenverletzungen bei hartknochigen Rassen ist real. VOHC-zertifizierte Produkte sind
                derzeit die einzigen Futter/Snack-Produkte mit belegt plaqueregulierender Wirkung beim Hund.
              </p>
              <p>
                <strong>Zucker und leicht fermentierbare Kohlenhydrate:</strong> Saccharose und andere
                Einfachzucker fordern das Wachstum von Streptococcus mutans und ahnlichen karioganenen
                Keimen. Futter mit hohem Zuckergehalt, Melasse oder Fruchtbeigaben sollte bei Hunden
                mit starker Zahnsteinneigung vermieden werden. Das ist auch ein Argument gegen viele
                kommerzielle Snacks und Leckerli, die Zucker als Geschmackstrager verwenden.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* EEAT: Durchfall */}
      {slug === "durchfall" && (
        <section className="max-w-5xl mx-auto w-full px-5 py-10">
          <div className="card p-8">
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Durchfall beim Hund: Ernahrung in der Akutphase und danach</h2>
            <div className="space-y-5 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                <strong>Akuter Durchfall — erste Massnahmen:</strong> Bei einmaligem oder zweimaligem
                Durchfall ohne Blut, ohne Fieber und bei unverandertem Allgemeinzustand ist eine
                12-24-stunige Schonkost-Phase der erste Schritt. Danach: leicht verdauliche Ernahrung
                fur 3-5 Tage. Das klassische "Hunde-BRAT" ist gekochtes Huhn (fettlos) mit weissem
                Reis im Verhaltnis 1:2. Wichtig: ausreichend Wasser, da Durchfall dehydriert.
              </p>
              <p>
                <strong>Wann sofort zum Tierarzt:</strong> Blut im Stuhl, mehr als 3 Episoden innerhalb
                von 24 Stunden, Lethargie, Erbrechen kombiniert mit Durchfall, Welpen unter 3 Monaten
                oder Hunde uber 10 Jahre — alle diese Konstellationen erfordern sofortige tierarztliche
                Untersuchung. Durchfall bei Welpen kann lebensbedrohlich schnell zur Dehydration fuhren.
              </p>
              <p>
                <strong>Prabiotika und Darmmikrobiom:</strong> Nach Durchfall-Episoden ist das Mikrobiom
                oft gestort. Zubereitungen mit Lactobacillus und Bifidobacterium konnen die Erholungszeit
                verkurzen. In einer Metaanalyse von 2022 zeigten Probiotika-Zugaben bei akutem Hunde-Durchfall
                eine Reduktion der Durchfalldauer um durchschnittlich 1,5 Tage. Gut untersucht sind
                Enterococcus faecium-Stamme (z.B. SF68) als veterinarmedizinische Probiotika.
              </p>
              <p>
                <strong>Chronischer Durchfall — Ursachenfindung vor Symptommanagement:</strong>
                Wiederkehrender Durchfall uber mehr als 2 Wochen ist keine Futteraufgabe, sondern ein
                diagnostisches Problem. Mogliche Ursachen: IBD, EPI (exokrine Pankreasinsuffizienz),
                Giardia, Parasiten, Lymphom, Proteinverlustnephropathie. Futter andern ohne Diagnose
                ist Symptommanagement ohne Ursachenbehebung und verzoggert die richtige Behandlung.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* EEAT: Untergewicht */}
      {slug === "untergewicht" && (
        <section className="max-w-5xl mx-auto w-full px-5 py-10">
          <div className="card p-8">
            <h2 className="text-xl font-extrabold tracking-tight mb-6">Untergewicht beim Hund: Ursachen kennen, dann ernahren</h2>
            <div className="space-y-5 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                <strong>Untergewicht ist ein Symptom, keine Diagnose:</strong> Bevor Futterumstellungen
                gemacht werden, muss die Ursache geklart sein. Haufige medizinische Ursachen fur
                Untergewicht: Parasitenbefall (vor allem Rundwurmer bei Welpen), exokrine
                Pankreasinsuffizienz (EPI, vor allem beim Deutschen Schaeferhund), IBD (chronische
                Darmentzundung), renaler Proteinverlust, Malabsorptions-Syndrome oder — selten aber
                relevant — Tumorerkrankungen. Ein Hund, der trotz ausreichender Futtermengen nicht zunimmt,
                muss veterinarmedizinisch untersucht werden.
              </p>
              <p>
                <strong>EPI — die unterschatzte Erkrankung:</strong> Die exokrine Pankreasinsuffizienz betrifft
                rund <strong>1-2 % aller Deutschen Schaeferhunde</strong> und ist bei dieser Rasse die haufigste
                Ursache fur extremes Untergewicht trotz Heisshunger. Der Hund frisst viel, aber verdaut kaum.
                Diagnose uber TLI-Test (Trypsin-like Immunoreactivity). Behandlung: Pankreas-Enzympraparat
                zum Futter und oft Vitamin B12-Supplementation, da Cobalamin-Mangel sekundar auftreten kann.
              </p>
              <p>
                <strong>Kalorientdichte erhohen, nicht Portionen unkontrolliert steigern:</strong> Bei
                medizinisch geklarter Untergewichtigkeit ohne Verdauungspathologie ist energiedichtes
                Futter (hoherer Fettgehalt, hochverdauliches Protein) der richtige Ansatz. Nassfutter hat
                trotz hoherem Feuchtigkeitsgehalt oft eine gunstige Kalorienstruktur fur untergewichtige Hunde.
                Mehrere kleine Mahlzeiten (3-4 taglich) sind bei sehr dunnen Hunden besser vertragen als
                grosse Einzelmahlzeiten.
              </p>
              <p>
                <strong>Muskelaufbau: Protein muss verdaubar sein:</strong> Fur Muskelmasseaufbau braucht der
                Hund biologisch hochwertige Proteine (hohe Bioverfugbarkeit). Huhn, Rind, Ei, Fisch sind
                bessere Proteinquellen als Federmehl oder Knochenmahl. Der Rohproteingehalt im Futter
                sollte bei untergewichtigen Hunden mindestens 30 % TS betragen — aber nur bei normaler
                Nieren- und Leberfunktion.
              </p>
            </div>
          </div>
        </section>
      )}

      <ProductSchemaBlock foods={foods} listName={`Hundefutter bei ${problem.name}`} />

      {/* BELLA CHAT — personalisierte Beratung */}
      <section className="max-w-5xl mx-auto w-full px-5 py-10">
        <h2 className="text-2xl font-extrabold tracking-tight mb-2">
          BELLA findet das passende Futter für deinen Hund
        </h2>
        <p className="text-[var(--muted)] text-sm mb-7">
          Erzähl BELLA von deinem Hund — Rasse, Alter, Gewicht — und sie empfiehlt sofort die passenden Sorten.
        </p>
        <BellaAdvisorWrapper
          introMessage={`Hallo! Ich bin BELLA 🐕 — deine KI-Ernährungsberaterin.\n\nDu schaust nach Futter bei ${problem.name}. Um die besten Sorten aus 11.000+ Produkten zu finden, erzähl mir kurz:\n\n• Welche Rasse ist dein Hund?\n• Wie alt und wie schwer ist er?\n• Gibt es neben ${problem.name} noch weitere Probleme?\n\nDann empfehle ich dir sofort die passenden Sorten!`}
          pageQuickOptions={[
            { label: `🩺 Futter bei ${problem.name}`, msg: `Mein Hund hat ${problem.name} — welches Futter empfiehlst du?` },
            { label: "🐶 Rasse nennen", msg: "Ich sage dir die Rasse meines Hundes:" },
            { label: "💊 Was unbedingt vermeiden?", msg: `Was sollte ich bei Futter für ${problem.name} unbedingt vermeiden?` },
            { label: "💰 Günstige Optionen", msg: `Gibt es gute günstige Optionen bei ${problem.name}?` },
          ]}
        />
      </section>

      {/* FUTTER-SCHNELLÜBERSICHT */}
      <section className="max-w-5xl mx-auto w-full px-5 py-6">
        <h3 className="text-lg font-bold tracking-tight mb-2">
          Schnellübersicht: Top-Sorten bei {problem.name}
        </h3>
        <p className="text-[var(--muted)] text-sm mb-7">
          Aus über 11.000 Sorten im Live-Katalog{problem.filterGrainFree ? " · getreidefrei" : ""}{problem.filterHypo ? " · hypoallergen" : ""} · Affiliate-Links (rel=sponsored)
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

      <AuthorBox />
      <SiteFooter />
    </div>
  );
}
