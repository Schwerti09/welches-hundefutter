import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import StructuredData from "@/components/StructuredData";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 86400;

const PHASEN: Record<string, {
  name: string; tagline: string; description: string;
  dbFilter: string; ageRange: string; keyPoints: string[]; emoji: string;
}> = {
  welpen: {
    name: "Welpen", tagline: "Welpenfutter: Das Richtige für die ersten Monate",
    description: "Welpen haben einen zwei- bis dreimal höheren Energiebedarf als ausgewachsene Hunde. Ihr Skelett und ihre Organe wachsen rasant — das erfordert optimale Mengen an Protein, Kalzium und Phosphor. Zu viel Kalzium ist besonders bei Großrassen gefährlich (Wachstumsstörungen). Spezielle Welpenfutter sind auf diese Bedürfnisse abgestimmt.",
    dbFilter: "welpen", ageRange: "0–12 Monate (kleine Rassen) / 0–18 Monate (große Rassen)",
    keyPoints: ["Höherer Protein- und Energiebedarf", "Kalzium/Phosphor-Verhältnis kritisch (1:1 bis 1.3:1)", "Große Rassen: Large-Breed-Welpen-Formel", "3–4 Mahlzeiten täglich", "Kein Erwachsenen-Futter"],
    emoji: "🐶",
  },
  junghund: {
    name: "Junghund", tagline: "Junghundfutter: Übergang vom Welpen zum Erwachsenen",
    description: "Junghunde (ca. 6–18 Monate) befinden sich in der Abschlussphase des Wachstums. Der Energiebedarf bleibt hoch, aber die Wachstumsrate sinkt. Junior-Futter oder die Umstellung auf hochwertiges Adult-Futter ist möglich — je nach Rasse und Entwicklung.",
    dbFilter: "junior", ageRange: "6–18 Monate",
    keyPoints: ["Immer noch erhöhter Energie- und Proteinbedarf", "Schrittweise Umstellung auf Erwachsenenfutter möglich", "Sozialisation und Training erhöhen Kalorienbedarf", "2 Mahlzeiten täglich"],
    emoji: "🦴",
  },
  adult: {
    name: "Erwachsener Hund", tagline: "Adult-Futter: Ausgewogenes Futter für ausgewachsene Hunde",
    description: "Ausgewachsene Hunde brauchen ein ausgewogenes Futter, das Energie, Protein, Fett und Mikronährstoffe optimal liefert. Übergewicht ist die häufigste Ursache für Gelenkprobleme und verkürzte Lebenserwartung — Portionskontrolle ist entscheidend. Qualität schlägt Menge.",
    dbFilter: "adult", ageRange: "1–7 Jahre (je nach Rasse)",
    keyPoints: ["Protein >25% (Trockenmasse)", "Fett 10–18%", "2 Mahlzeiten täglich", "Übergewicht vermeiden (BCS kontrollieren)", "Hochwertiges Fleisch als Hauptzutat"],
    emoji: "🐕",
  },
  senior: {
    name: "Senior", tagline: "Seniorfutter: Schonend, gelenkfreundlich, gut verdaulich",
    description: "Ältere Hunde (ab 7–9 Jahren je nach Rasse) brauchen weniger Kalorien, aber mehr Gelenkstoffe (Glucosamin, Chondroitin), leicht verdauliche Proteine und Antioxidantien gegen Zellalterung. Seniorenfutter ist kalorienreduziert und auf reduzierte Nierenfunktion ausgelegt.",
    dbFilter: "senior", ageRange: "Ab 7 Jahren (große Rassen) / ab 9 Jahren (kleine Rassen)",
    keyPoints: ["Kalorienreduziert (-20–30%)", "Glucosamin & Chondroitin", "Leicht verdauliche Proteine", "Antioxidantien (Vitamin E/C)", "Erhöhter Feuchtigkeitsbedarf (Nassfutter-Anteil)"],
    emoji: "🐾",
  },
};

const FAQS_BY_PHASE: Record<string, { question: string; answer: string }[]> = {
  welpen: [
    {
      question: "Was ist das beste Futter für Welpen?",
      answer: "Welpenfutter ist auf den 2- bis 3-fach höheren Energiebedarf von Welpen abgestimmt und liefert mehr Protein, Kalzium und Phosphor im richtigen Verhältnis (1:1 bis 1,3:1). Bei großen Rassen ist zu viel Kalzium riskant, da es Wachstumsstörungen begünstigen kann — hier sind Large-Breed-Welpenformeln wichtig. BELLA berücksichtigt Rasse und Größe deines Welpen bei der Empfehlung.",
    },
    {
      question: "Ab wann ist ein Hund kein Welpe mehr?",
      answer: "Kleine Rassen gelten meist ab 12 Monaten, große Rassen erst ab 18 Monaten als ausgewachsen, da ihr Skelett länger wächst. Bis dahin sollte durchgehend Welpenfutter oder eine speziell abgestimmte Wachstumsformel gefüttert werden — ein zu früher Wechsel auf Erwachsenenfutter kann den erhöhten Nährstoffbedarf in der Wachstumsphase nicht decken. Im Zweifel hilft der Tierarzt bei der Einschätzung.",
    },
  ],
  junghund: [
    {
      question: "Was ist das beste Futter für Junghunde?",
      answer: "Junghunde zwischen 6 und 18 Monaten haben das Hauptwachstum hinter sich, brauchen aber noch erhöhte Energie- und Proteinmengen für Muskelaufbau, Training und Sozialisation. Junior-Futter überbrückt diese Phase, alternativ ist eine schrittweise Umstellung auf hochwertiges Adult-Futter möglich — abhängig von Rasse und individueller Entwicklung. BELLA empfiehlt passendes Futter basierend auf Alter, Größe und Aktivitätslevel deines Hundes.",
    },
    {
      question: "Wie viele Mahlzeiten braucht ein Junghund pro Tag?",
      answer: "Für die meisten Junghunde reichen zwei Mahlzeiten täglich, idealerweise zu festen Zeiten morgens und abends. Das unterstützt eine gleichmäßige Verdauung und hilft bei der Stubenreinheit. Aktive oder noch sehr junge Hunde profitieren manchmal von einer dritten kleinen Portion. Wichtig ist vor allem, die Gesamtmenge an die individuelle Aktivität und das Gewicht des Hundes anzupassen — nicht nur an sein Alter.",
    },
  ],
  adult: [
    {
      question: "Was ist das beste Futter für ausgewachsene Hunde?",
      answer: "Ausgewachsene Hunde brauchen ein ausgewogenes Futter mit mindestens 25 % Protein und 10–18 % Fett in der Trockenmasse, dazu hochwertiges Fleisch als Hauptzutat statt Füllstoffen. Wichtiger als das Etikett ist die Portionskontrolle: Übergewicht ist die häufigste Ursache für Gelenkprobleme und eine verkürzte Lebenserwartung. BELLA berechnet die passende Tagesmenge basierend auf Gewicht, Rasse und Aktivität deines Hundes.",
    },
    {
      question: "Wie oft sollte ein erwachsener Hund täglich gefüttert werden?",
      answer: "Für die meisten erwachsenen Hunde haben sich zwei Mahlzeiten pro Tag bewährt — eine morgens, eine abends. Das hält den Blutzucker stabiler als eine große Portion und kann bei tiefbrüstigen Rassen das Risiko einer Magendrehung senken. Die Tagesmenge richtet sich nach Gewicht, Aktivität und Futtertyp und sollte bei Gewichtsveränderungen regelmäßig angepasst werden. Frisches Wasser sollte immer verfügbar sein.",
    },
  ],
  senior: [
    {
      question: "Was ist das beste Futter für Seniorhunde?",
      answer: "Seniorfutter ist kalorienreduziert (meist 20–30 % weniger als Adult-Futter), enthält Gelenkstoffe wie Glucosamin und Chondroitin sowie leicht verdauliche Proteine und Antioxidantien gegen Zellalterung. Ab welchem Alter ein Hund als Senior gilt, hängt stark von der Rasse ab — große Rassen früher, kleine später. BELLA berücksichtigt Alter, Rasse und eventuelle Erkrankungen bei der Futterempfehlung.",
    },
    {
      question: "Ab welchem Alter gilt ein Hund als Senior?",
      answer: "Große Rassen gelten oft schon ab 7 Jahren als Senior, kleine Rassen meist erst ab 9 Jahren — größere Hunde altern biologisch schneller. Typische Anzeichen sind weniger Ausdauer, längere Erholungszeiten nach Bewegung und beginnende Steifheit. Eine Futterumstellung muss nicht abrupt erfolgen: Schleiche das neue Futter über 1–2 Wochen ein, um Verdauungsprobleme zu vermeiden, und sprich bei Vorerkrankungen mit dem Tierarzt.",
    },
  ],
};

export function generateStaticParams() {
  return Object.keys(PHASEN).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = PHASEN[slug];
  if (!p) return {};
  return {
    title: `${p.tagline} | BELLA – KI-Hundefutterberaterin`,
    description: `${p.description.slice(0, 155)}… BELLA empfiehlt das passende aus 8.000+ Sorten.`,
    alternates: {
      canonical: `https://welches-hundefutter.today/lebensphase/${slug}`,
      languages: {
        "de-DE": `https://welches-hundefutter.today/lebensphase/${slug}`,
        "de-AT": `https://welches-hundefutter.today/lebensphase/${slug}`,
        "de-CH": `https://welches-hundefutter.today/lebensphase/${slug}`,
        "x-default": `https://welches-hundefutter.today/lebensphase/${slug}`,
      },
    },
  };
}

interface FoodRow {
  brand: string; name: string; type: string; protein: string | null;
  price_per_kg: string | null; is_grain_free: boolean; affiliate_url: string;
}

async function getFoodsByPhase(suitableFor: string): Promise<FoodRow[]> {
  const url = process.env.DATABASE_URL;
  if (!url) return [];
  try {
    const sql = neon(url);
    const nameKey = "lower(regexp_replace(name, '[^a-zA-Z0-9]', '', 'g'))";
    const rows = await sql.query(
      `SELECT * FROM (
         SELECT DISTINCT ON (${nameKey}) brand, name, type, protein, price_per_kg, is_grain_free, affiliate_url
         FROM dog_foods
         WHERE is_active = true AND affiliate_url <> '' AND name <> ''
           AND price_per_kg BETWEEN 2 AND 60 AND type <> 'snack'
           AND (suitable_for @> ARRAY[$1] OR suitable_for IS NULL)
         ORDER BY ${nameKey}, price_per_kg ASC
       ) d ORDER BY price_per_kg ASC LIMIT 6`,
      [suitableFor]
    );
    const data = ((rows as unknown as { rows?: FoodRow[] }).rows ?? (rows as unknown as FoodRow[])) || [];
    if (data.length > 0) return data;
    // Fallback ohne Phasen-Filter
    const fb = await sql.query(
      `SELECT * FROM (
         SELECT DISTINCT ON (${nameKey}) brand, name, type, protein, price_per_kg, is_grain_free, affiliate_url
         FROM dog_foods WHERE is_active = true AND affiliate_url <> '' AND name <> ''
           AND price_per_kg BETWEEN 2 AND 60 AND type <> 'snack'
         ORDER BY ${nameKey}, price_per_kg ASC
       ) d ORDER BY price_per_kg ASC LIMIT 6`,
      []
    );
    return ((fb as unknown as { rows?: FoodRow[] }).rows ?? (fb as unknown as FoodRow[])) || [];
  } catch { return []; }
}

export default async function LebensphaseePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const phase = PHASEN[slug];
  if (!phase) notFound();

  const foods = await getFoodsByPhase(phase.dbFilter);

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData
        type="article"
        article={{
          headline: phase.tagline,
          description: phase.description,
          url: `https://welches-hundefutter.today/lebensphase/${slug}`,
          dateModified: "2026-06-10",
          speakableSelectors: ["h1", ".bella-answer"],
        }}
      />
      <StructuredData type="faq" faqs={FAQS_BY_PHASE[slug]} />

      <nav className="max-w-5xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">{phase.tagline}</span>
      </nav>

      <section className="hero-glow max-w-5xl mx-auto w-full px-5 pt-8 pb-14">
        <span className="pill mb-4">{phase.emoji} Lebensphase</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">{phase.tagline}</h1>
        <p className="bella-answer text-[var(--muted)] leading-relaxed max-w-2xl mb-4">{phase.description}</p>
        <p className="text-sm text-[var(--muted)] mb-8"><span className="font-semibold text-[var(--ink)]">Altersbereich:</span> {phase.ageRange}</p>
        <Link href="/#bella-advisor" className="btn-primary">BELLA fragt nach deinem Hund — Empfehlung in 60 s →</Link>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 py-10">
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-bold tracking-tight mb-4">Worauf es bei {phase.name}-Futter ankommt</h2>
          <ul className="space-y-2">
            {phase.keyPoints.map((kp) => (
              <li key={kp} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                <span className="mt-0.5 text-orange-400">→</span> {kp}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 py-10">
        <h2 className="text-2xl font-extrabold tracking-tight mb-7">
          Empfohlenes {phase.name}-Futter
        </h2>
        {foods.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {foods.map((f, i) => (
              <a key={i} href={f.affiliate_url} target="_blank" rel="sponsored nofollow noopener noreferrer" className="card card-hover p-5 block">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(240,167,60,0.14)] text-[#ffcd8a] capitalize">{f.type}</span>
                  {f.protein && <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300">{f.protein}</span>}
                  {f.is_grain_free && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300">getreidefrei</span>}
                </div>
                <p className="font-semibold text-sm leading-tight">{f.name}</p>
                <p className="text-[var(--muted)] text-xs mt-0.5">{f.brand}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-black">{f.price_per_kg ? `${parseFloat(f.price_per_kg).toFixed(2)} €` : ""}<span className="text-xs font-medium text-[var(--muted)]">/kg</span></span>
                  <span className="text-xs text-[var(--honey)] font-semibold">Ansehen →</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="card p-6 text-center text-[var(--muted)] mb-10">BELLA findet live die passende Sorte.</div>
        )}
      </section>

      <section className="max-w-5xl mx-auto w-full px-5 pb-16">
        <div className="rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 p-8 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">Futterplan für deinen {phase.name} erstellen</h2>
          <p className="text-[var(--muted)] mb-6 max-w-xl mx-auto">
            BELLA fragt nach Rasse, Gewicht und Allergien — und findet die optimale Sorte + Tagesmenge für diese Lebensphase.
          </p>
          <Link href="/#bella-advisor" className="btn-primary">🐕 BELLA jetzt fragen →</Link>
        </div>
        <div className="flex flex-wrap gap-2 mt-8">
          {Object.entries(PHASEN).filter(([s]) => s !== slug).map(([s, p]) => (
            <Link key={s} href={`/lebensphase/${s}`}
              className="text-sm px-4 py-2 rounded-xl border border-white/10 text-[var(--muted)] hover:text-white hover:border-orange-500/40 transition-colors">
              {p.emoji} {p.name}
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
