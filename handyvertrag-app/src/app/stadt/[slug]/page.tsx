import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CITY_BY_SLUG, CITIES, getCitiesInState, type City } from '@/data/cities';

export const revalidate = 86400;

// ── Regional intelligence ──────────────────────────────────────────────────────

const REGIONAL_BREEDS: Record<string, { slug: string; name: string }[]> = {
  NW: [
    { slug: 'french-bulldog', name: 'French Bulldog' },
    { slug: 'labrador-retriever', name: 'Labrador Retriever' },
    { slug: 'golden-retriever', name: 'Golden Retriever' },
    { slug: 'boxer', name: 'Boxer' },
    { slug: 'deutscher-schaeferhund', name: 'Dt. Schäferhund' },
    { slug: 'mops', name: 'Mops' },
  ],
  BY: [
    { slug: 'dackel', name: 'Dackel' },
    { slug: 'labrador-retriever', name: 'Labrador Retriever' },
    { slug: 'golden-retriever', name: 'Golden Retriever' },
    { slug: 'deutsch-kurzhaar', name: 'Deutsch Kurzhaar' },
    { slug: 'weimaraner', name: 'Weimaraner' },
    { slug: 'deutscher-schaeferhund', name: 'Dt. Schäferhund' },
  ],
  BW: [
    { slug: 'labrador-retriever', name: 'Labrador Retriever' },
    { slug: 'pudel', name: 'Pudel' },
    { slug: 'rottweiler', name: 'Rottweiler' },
    { slug: 'golden-retriever', name: 'Golden Retriever' },
    { slug: 'deutsch-kurzhaar', name: 'Deutsch Kurzhaar' },
    { slug: 'boxer', name: 'Boxer' },
  ],
  NI: [
    { slug: 'labrador-retriever', name: 'Labrador Retriever' },
    { slug: 'golden-retriever', name: 'Golden Retriever' },
    { slug: 'deutscher-schaeferhund', name: 'Dt. Schäferhund' },
    { slug: 'border-collie', name: 'Border Collie' },
    { slug: 'deutsch-kurzhaar', name: 'Deutsch Kurzhaar' },
    { slug: 'hovawart', name: 'Hovawart' },
  ],
  BE: [
    { slug: 'french-bulldog', name: 'French Bulldog' },
    { slug: 'mops', name: 'Mops' },
    { slug: 'dackel', name: 'Dackel' },
    { slug: 'labrador-retriever', name: 'Labrador Retriever' },
    { slug: 'chihuahua', name: 'Chihuahua' },
    { slug: 'golden-retriever', name: 'Golden Retriever' },
  ],
  HH: [
    { slug: 'labrador-retriever', name: 'Labrador Retriever' },
    { slug: 'golden-retriever', name: 'Golden Retriever' },
    { slug: 'hovawart', name: 'Hovawart' },
    { slug: 'deutsch-kurzhaar', name: 'Deutsch Kurzhaar' },
    { slug: 'flat-coated-retriever', name: 'Flat Coated Retriever' },
    { slug: 'border-collie', name: 'Border Collie' },
  ],
  SH: [
    { slug: 'labrador-retriever', name: 'Labrador Retriever' },
    { slug: 'golden-retriever', name: 'Golden Retriever' },
    { slug: 'hovawart', name: 'Hovawart' },
    { slug: 'deutsch-kurzhaar', name: 'Deutsch Kurzhaar' },
    { slug: 'flat-coated-retriever', name: 'Flat Coated Retriever' },
    { slug: 'weimaraner', name: 'Weimaraner' },
  ],
  MV: [
    { slug: 'labrador-retriever', name: 'Labrador Retriever' },
    { slug: 'golden-retriever', name: 'Golden Retriever' },
    { slug: 'deutsch-drahthaar', name: 'Deutsch Drahthaar' },
    { slug: 'deutsch-kurzhaar', name: 'Deutsch Kurzhaar' },
    { slug: 'deutscher-schaeferhund', name: 'Dt. Schäferhund' },
    { slug: 'rhodesian-ridgeback', name: 'Rhodesian Ridgeback' },
  ],
  HE: [
    { slug: 'labrador-retriever', name: 'Labrador Retriever' },
    { slug: 'golden-retriever', name: 'Golden Retriever' },
    { slug: 'deutscher-schaeferhund', name: 'Dt. Schäferhund' },
    { slug: 'weimaraner', name: 'Weimaraner' },
    { slug: 'dackel', name: 'Dackel' },
    { slug: 'deutsch-kurzhaar', name: 'Deutsch Kurzhaar' },
  ],
  RP: [
    { slug: 'dackel', name: 'Dackel' },
    { slug: 'labrador-retriever', name: 'Labrador Retriever' },
    { slug: 'dobermann', name: 'Dobermann' },
    { slug: 'golden-retriever', name: 'Golden Retriever' },
    { slug: 'rottweiler', name: 'Rottweiler' },
    { slug: 'deutsch-kurzhaar', name: 'Deutsch Kurzhaar' },
  ],
  SL: [
    { slug: 'rottweiler', name: 'Rottweiler' },
    { slug: 'labrador-retriever', name: 'Labrador Retriever' },
    { slug: 'dobermann', name: 'Dobermann' },
    { slug: 'boxer', name: 'Boxer' },
    { slug: 'deutscher-schaeferhund', name: 'Dt. Schäferhund' },
    { slug: 'golden-retriever', name: 'Golden Retriever' },
  ],
  SN: [
    { slug: 'deutscher-schaeferhund', name: 'Dt. Schäferhund' },
    { slug: 'rottweiler', name: 'Rottweiler' },
    { slug: 'labrador-retriever', name: 'Labrador Retriever' },
    { slug: 'golden-retriever', name: 'Golden Retriever' },
    { slug: 'dackel', name: 'Dackel' },
    { slug: 'boxer', name: 'Boxer' },
  ],
  ST: [
    { slug: 'deutscher-schaeferhund', name: 'Dt. Schäferhund' },
    { slug: 'rottweiler', name: 'Rottweiler' },
    { slug: 'labrador-retriever', name: 'Labrador Retriever' },
    { slug: 'dobermann', name: 'Dobermann' },
    { slug: 'boxer', name: 'Boxer' },
    { slug: 'golden-retriever', name: 'Golden Retriever' },
  ],
  TH: [
    { slug: 'deutscher-schaeferhund', name: 'Dt. Schäferhund' },
    { slug: 'rottweiler', name: 'Rottweiler' },
    { slug: 'weimaraner', name: 'Weimaraner' },
    { slug: 'labrador-retriever', name: 'Labrador Retriever' },
    { slug: 'boxer', name: 'Boxer' },
    { slug: 'dackel', name: 'Dackel' },
  ],
  BB: [
    { slug: 'deutscher-schaeferhund', name: 'Dt. Schäferhund' },
    { slug: 'labrador-retriever', name: 'Labrador Retriever' },
    { slug: 'rottweiler', name: 'Rottweiler' },
    { slug: 'golden-retriever', name: 'Golden Retriever' },
    { slug: 'husky', name: 'Husky' },
    { slug: 'border-collie', name: 'Border Collie' },
  ],
  HB: [
    { slug: 'labrador-retriever', name: 'Labrador Retriever' },
    { slug: 'golden-retriever', name: 'Golden Retriever' },
    { slug: 'deutsch-kurzhaar', name: 'Deutsch Kurzhaar' },
    { slug: 'flat-coated-retriever', name: 'Flat Coated Retriever' },
    { slug: 'border-collie', name: 'Border Collie' },
    { slug: 'boxer', name: 'Boxer' },
  ],
};
const REGIONAL_BREEDS_DEFAULT: { slug: string; name: string }[] = [
  { slug: 'labrador-retriever', name: 'Labrador Retriever' },
  { slug: 'golden-retriever', name: 'Golden Retriever' },
  { slug: 'deutscher-schaeferhund', name: 'Dt. Schäferhund' },
  { slug: 'french-bulldog', name: 'French Bulldog' },
  { slug: 'dackel', name: 'Dackel' },
  { slug: 'boxer', name: 'Boxer' },
];

interface RegionProfile {
  headline: string;
  intro: string;
  outdoor: string;
  climate: string;
  tip: string;
}
const REGION_PROFILE: Record<string, RegionProfile> = {
  NW: {
    headline: 'Hundeleben im Rheinland & Ruhrgebiet',
    intro: 'Im bevölkerungsreichsten Bundesland Deutschlands sind Hunde allgegenwärtig. Rheinufer, Stadtparks, Ruhrtalradweg und Naherholungsgebiete bieten aktiven Hunden täglich neue Routen. Hunde aus NRW brauchen ausgewogenes, hochwertiges Futter für ein aktives, urbanes Leben.',
    outdoor: 'mittel bis hoch',
    climate: 'gemäßigt, mild',
    tip: 'Hunde in Ballungsräumen brauchen Futter mit optimaler Energie-Dichte — nicht zu viel für den Couch-Tag, nicht zu wenig für den Park-Marathon.',
  },
  BY: {
    headline: 'Hundeleben in Bayern',
    intro: 'Bayerische Hundehalter schätzen Qualität und Tradition. Alpenausflüge, Biergartenbesuche, Wochenmärkte — der Hund gehört immer dazu. Das bayerische Terrain ist anspruchsvoll: Bergwanderungen, Schnee im Winter, Hitze im Alpenvorland-Sommer.',
    outdoor: 'hoch',
    climate: 'kontinental, kalte Winter, warme Sommer',
    tip: 'Im Winter mehr Kalorien für Kälteausgleich — im Sommer leichtere Portionen und viel Wasser. BELLA berechnet die ideale Tagesdosis automatisch.',
  },
  BW: {
    headline: 'Hundeleben in Baden-Württemberg',
    intro: 'Schwarzwald, Schwäbische Alb, Bodensee, Kaiserstuhl — Baden-Württemberg ist ein Hundeeldorado. Viele Halter setzen bewusst auf Premiumfutter und sind bestens informiert. Das Angebot ist riesig, die Unterschiede enorm.',
    outdoor: 'hoch',
    climate: 'gemäßigt bis warm, Bodenseeeinfluss',
    tip: 'BW-Halter kaufen überdurchschnittlich oft Monoprotein- und Getreidefrei-Futter. BELLA prüft Inhaltstoffe, Deklaration und Preis in Sekunden.',
  },
  NI: {
    headline: 'Hundeleben in Niedersachsen',
    intro: 'Lüneburger Heide, Nordseeküste, Harzvorland und endlose Flussniederungen — Niedersachsen ist das flächenmäßig größte Bundesland. Hunde hier haben Auslauf satt. Das Futter muss mit dem Aktivitätslevel Schritt halten.',
    outdoor: 'sehr hoch',
    climate: 'atlantisch, mild, feucht',
    tip: 'Für sehr aktive Hunde empfiehlt BELLA Futter mit 26%+ Rohprotein und hohem Fleischanteil. Der Energiebedarf steigt bei langen Strecken erheblich.',
  },
  BE: {
    headline: 'Hundeleben in Berlin',
    intro: 'Berlin ist eine der hundefreundlichsten Metropolen Europas. Über 400 ausgewiesene Hundeauslaufgebiete, breite Bürgersteige und eine aktive Hundekultur machen die Hauptstadt zum urbanen Paradies für Vierbeiner. Mit über 160.000 gemeldeten Hunden ist Berlin Deutschlands Hunde-Hauptstadt.',
    outdoor: 'mittel (urban)',
    climate: 'kontinental, kalt-kalte Winter, heiße Sommer',
    tip: 'Berliner Hunde leben oft in Wohnungen — kalorienkontrolliertes Futter ist wichtig. BELLA berücksichtigt Aktivitätslevel und Wohnverhältnis automatisch.',
  },
  HH: {
    headline: 'Hundeleben in Hamburg',
    intro: 'An Alster und Elbe genießen Hunde die grüne Seite der Hansestadt. Hamburger Halter sind anspruchsvoll: sie wollen Bio-Qualität, transparente Zutaten und faire Preise. Der Stadtpark, die Elbchaussee und die Außenalster sind klassische Hunde-Hotspots.',
    outdoor: 'mittel bis hoch',
    climate: 'maritim, mild, windreich',
    tip: 'Hamburgs Regen macht Outdoor-Aktivität manchmal tricky — ein ausgewogenes Futter für moderate und intensive Tage ist ideal. BELLA passt die Empfehlung automatisch an.',
  },
  SH: {
    headline: 'Hundeleben in Schleswig-Holstein',
    intro: 'Zwischen Nord- und Ostseeküste, Förden und Knicks leben einige der aktivsten Hunde Deutschlands. Strandläufe, Wattwanderungen, Förde-Spaziergänge — hier braucht kein Hund einen Treadmill.',
    outdoor: 'sehr hoch',
    climate: 'maritim, kühl, windig',
    tip: 'Hochkalorisches, proteinreiches Futter für den aktiven Küstenhund. Omega-3 aus Fisch ist ideal — für Fell, Gelenke und Gehirn. BELLA findet die besten Produkte.',
  },
  MV: {
    headline: 'Hundeleben in Mecklenburg-Vorpommern',
    intro: 'Ostseeküste, Seenplatte, Rügen, Usedom — Mecklenburg-Vorpommern ist Deutschlands Natur-Schatzkammer. Hier leben Outdoor-Hunde mit grenzenlosem Auslauf. Robuste Ernährung für das aktive Seenplattenleben ist Pflicht.',
    outdoor: 'sehr hoch',
    climate: 'maritim-kontinental, kühl, viel Wind',
    tip: 'MV-Hunde verbringen viel Zeit im Freien, oft bei Kälte. Energiedichte Ernährung mit hochwertigem Protein und gesunden Fetten hält Fell und Körper fit.',
  },
  HE: {
    headline: 'Hundeleben in Hessen',
    intro: 'Taunus, Odenwald, Rhön und Vogelsberg umrahmen das Herz Deutschlands. Zwischen Frankfurter Metropole und ländlicher Idylle erleben Hunde in Hessen maximale Vielfalt — Urban-Spaziergänge am Main oder Waldwanderungen im Taunus.',
    outdoor: 'hoch',
    climate: 'gemäßigt, regional unterschiedlich',
    tip: 'Hessen-Hunde sind vielseitig: mal Cityhund, mal Waldläufer. Flexibles Futter mit gutem Protein- und Fettverhältnis hält beide Lebensstile im Gleichgewicht.',
  },
  RP: {
    headline: 'Hundeleben in Rheinland-Pfalz',
    intro: 'Moselweinberge, Pfälzer Wald, Eifel und das Mittelrheintal bieten Hunden ein abwechslungsreiches Zuhause. In Rheinland-Pfalz leben Hund und Halter in enger Verbundenheit mit der Natur.',
    outdoor: 'hoch',
    climate: 'gemäßigt bis mild, Weinbauklima',
    tip: 'Aktive Wanderhunde aus dem Pfälzer Wald oder der Eifel brauchen mehr Kalorien als der typische Stadthund. BELLA berechnet den genauen Bedarf.',
  },
  SL: {
    headline: 'Hundeleben im Saarland',
    intro: 'Das kleinste Flächenbundesland hat kurze Wege zur Natur: Saarschleife, Bliesgau, Naturpark Saar-Hunsrück. Saarländische Halter sind bodenständig und schätzen gutes, preiswürdiges Futter.',
    outdoor: 'mittel bis hoch',
    climate: 'mild, atlantisch beeinflusst',
    tip: 'Saarland-Hunde genießen die Nähe zu Frankreich und Luxemburg — dort gelten andere Futtermarken als populär. BELLA kennt auch die internationalen Top-Produkte.',
  },
  SN: {
    headline: 'Hundeleben in Sachsen',
    intro: 'Von der Dresdner Heide über das Erzgebirge bis zur Lausitzer Seenlandschaft: Sachsens Hunde haben abwechslungsreiche Reviere. Stadtkultur trifft Bergwelt — das Futter muss für beides taugen.',
    outdoor: 'mittel bis hoch',
    climate: 'kontinental, kalte Winter, warme Sommer',
    tip: 'Sachsens Winter sind kalt und oft schneereich — Hunde brauchen im Winter 10-15% mehr Kalorien. BELLA passt Empfehlungen saisonal an.',
  },
  ST: {
    headline: 'Hundeleben in Sachsen-Anhalt',
    intro: 'Harz, Saale-Unstrut-Weinland, Elbauen und Magdeburger Börde: Sachsen-Anhalt überrascht mit wilder Natur und weitem Himmel. Outdoor-Hunde haben hier ihr Paradies.',
    outdoor: 'hoch',
    climate: 'kontinental, trocken, kalt-kalte Winter',
    tip: 'Trockenes Kontinentalklima — achte auf ausreichend Wasserversorgung neben dem Futter. Hunde brauchen im Sommer mehr Flüssigkeit als im Winter.',
  },
  TH: {
    headline: 'Hundeleben in Thüringen',
    intro: 'Im grünen Herz Deutschlands begleiten Hunde ihre Halter durch Thüringer Wald, Kyffhäuser und Rennsteig. Wanderkultur ist hier Alltagskultur — und der Hund immer dabei.',
    outdoor: 'sehr hoch',
    climate: 'kontinental, raues Mittelgebirgsklima',
    tip: 'Thüringer Wanderhunde brauchen echte Ausdauer-Ernährung. Hochwertiges Protein, komplexe Kohlenhydrate und Omega-3 für Gelenke sind ideal.',
  },
  BB: {
    headline: 'Hundeleben in Brandenburg',
    intro: 'Brandenburgs Seen, Wälder und das Berliner Umland machen es zum grünen Rückzugsort für Stadt-Hunde. Viele Berliner kommen mit ihrem Hund übers Wochenende nach Brandenburg — echte Natur, echter Auslauf.',
    outdoor: 'sehr hoch',
    climate: 'kontinental, warm-trockene Sommer, kalte Winter',
    tip: 'Brandenburgs trockene Sommer bedeuten Staubpisten und Hitze. Ausreichend Wasser und etwas weniger Kalorien im Hochsommer sind die richtige Strategie.',
  },
  HB: {
    headline: 'Hundeleben in Bremen',
    intro: 'In der Hansestadt Bremen treffen Bürgerpark, Weserufer und urbanes Stadtleben aufeinander. Der Bremer Bürgerpark — einer der schönsten innenstädtischen Parks Deutschlands — ist ein echtes Hundeeldorado.',
    outdoor: 'mittel',
    climate: 'atlantisch, mild, feucht',
    tip: 'Stadtnahe Hunde in Bremen haben oft gemischten Alltag — mal gemütlich, mal aktiv. Flexibles Futter mit gutem Protein-Fett-Verhältnis passt für beides.',
  },
};

// ── Math helpers ───────────────────────────────────────────────────────────────

function estimateDogs(pop: number): number {
  return Math.round((pop * 0.198) / 500) * 500;
}
function estimateOwners(pop: number): number {
  return Math.round((pop * 0.12) / 500) * 500;
}
function estimateTonsFeed(pop: number): string {
  const tons = (estimateDogs(pop) * 110) / 1000;
  return tons >= 100
    ? `${Math.round(tons / 10) * 10} Tonnen`
    : `${Math.round(tons)} Tonnen`;
}
function estimateSpend(pop: number): string {
  const m = (pop * 0.198 * 480) / 1_000_000;
  return `${m >= 10 ? m.toFixed(0) : m.toFixed(1)} Mio. Euro`;
}
function fmt(n: number): string {
  return n.toLocaleString('de-DE');
}

// ── Static params + Metadata ────────────────────────────────────────────────

export function generateStaticParams() {
  return CITIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = CITY_BY_SLUG[slug];
  if (!city) return { title: 'Stadt nicht gefunden' };
  const dogs = fmt(estimateDogs(city.population));
  return {
    title: `Hundefutter ${city.name} 2025 — BELLA empfiehlt kostenlos`,
    description: `Das beste Hundefutter für ${city.name}: BELLA vergleicht über 8.400 Produkte und findet in Sekunden das ideale Futter für deinen Hund. ~${dogs} Hunde in ${city.name} vertrauen auf gute Ernährung.`,
    openGraph: {
      title: `Hundefutter ${city.name} — BELLA berät kostenlos`,
      description: `~${dogs} Hunde in ${city.name}. BELLA findet das perfekte Futter für deinen Vierbeiner — kostenlos, ohne Anmeldung, aus über 8.400 echten Produkten.`,
    },
    alternates: {
      canonical: `/stadt/${city.slug}`,
      languages: {
        "de-DE": `/stadt/${city.slug}`,
        "de-AT": `/stadt/${city.slug}`,
        "de-CH": `/stadt/${city.slug}`,
        "x-default": `/stadt/${city.slug}`,
      },
    },
  };
}

// ── Page ────────────────────────────────────────────────────────────────────────

export default async function StadtPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const city = CITY_BY_SLUG[slug];
  if (!city) notFound();

  const dogs = estimateDogs(city.population);
  const owners = estimateOwners(city.population);
  const tons = estimateTonsFeed(city.population);
  const spend = estimateSpend(city.population);
  const profile = REGION_PROFILE[city.stateCode] ?? REGION_PROFILE['NI'];
  const breeds = REGIONAL_BREEDS[city.stateCode] ?? REGIONAL_BREEDS_DEFAULT;
  const nearbyCities = getCitiesInState(city.stateCode, city.slug, 10);

  const faqs = [
    {
      q: `Welches Hundefutter ist für Hunde in ${city.name} am besten?`,
      a: `Das beste Hundefutter hängt von Rasse, Alter, Gewicht und gesundheitlichen Besonderheiten deines Hundes ab — nicht vom Wohnort. BELLA berücksichtigt alle diese Faktoren und empfiehlt aus über 8.400 Produkten das passende Futter. In ${city.state} sind besonders ${breeds.slice(0, 3).map((b) => b.name).join(', ')} verbreitet — für diese Rassen hat BELLA spezialisierte Empfehlungen.`,
    },
    {
      q: `Wo kaufe ich das beste Hundefutter in ${city.name}?`,
      a: `Der günstigste und bequemste Weg ist der Online-Kauf. BELLA vergleicht Preise aus über 30 Shops und zeigt dir immer das beste Angebot — oft 20-40% günstiger als im lokalen Fachhandel. Die Lieferung erfolgt direkt nach ${city.name} nach Hause.`,
    },
    {
      q: `Wie viel Hundefutter braucht mein Hund pro Monat in ${city.name}?`,
      a: `Das hängt von Gewicht und Aktivitätslevel ab. Ein 20 kg schwerer mittelaktiver Hund (wie ein typischer Labrador) braucht rund 300g Trockenfutter pro Tag, also ca. 9 kg pro Monat — Kosten ca. 30-60 Euro je nach Qualität. BELLA berechnet den genauen Bedarf für deinen spezifischen Hund kostenlos.`,
    },
    {
      q: `Gibt es spezielles Hundefutter für ${city.state}?`,
      a: `Nicht für das Bundesland, aber für den Lebensstil: ${profile.outdoor} Aktivität prägt den Futterbedarf. ${profile.tip}`,
    },
    {
      q: `Was kostet gutes Hundefutter in ${city.name} pro Monat?`,
      a: `Gutes Trockenfutter kostet für einen mittelgroßen Hund 25-60 Euro pro Monat. BELLA findet Produkte in jeder Preisklasse — von günstigem Qualitätsfutter bis zu Premium-Marken. Der durchschnittliche ${city.name}er Hundehalter gibt rund 40 Euro monatlich für Futter aus.`,
    },
    {
      q: `Kann ich BELLA kostenlos nutzen, wenn ich in ${city.name} wohne?`,
      a: `Ja! BELLA ist vollständig kostenlos und ohne Anmeldung nutzbar. Einfach auf "BELLA starten" klicken, deinen Hund beschreiben und in unter 60 Sekunden eine personalisierte Empfehlung erhalten — egal ob du in ${city.name} oder anderswo in Deutschland wohnst.`,
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'BELLA', item: 'https://welches-hundefutter.today' },
          { '@type': 'ListItem', position: 2, name: 'Städte', item: 'https://welches-hundefutter.today/stadt' },
          { '@type': 'ListItem', position: 3, name: city.name, item: `https://welches-hundefutter.today/stadt/${city.slug}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'WebPage',
        name: `Hundefutter ${city.name}`,
        description: `BELLA findet das beste Hundefutter für ${city.name}: ~${fmt(dogs)} Hunde in ${city.name} verdienen optimale Ernährung.`,
        url: `https://welches-hundefutter.today/stadt/${city.slug}`,
        isPartOf: { '@type': 'WebSite', name: 'welches-hundefutter.today', url: 'https://welches-hundefutter.today' },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen" style={{ background: 'var(--bg, #0a0a0f)', color: 'var(--fg, #f0f0f0)' }}>

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-4 pt-16 pb-12">
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
            <div className="h-[500px] w-[500px] rounded-full opacity-10 blur-[120px]" style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)' }} />
          </div>

          <div className="mx-auto max-w-4xl">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <Link href="/" className="hover:text-white/70">welches-hundefutter.today</Link>
              <span>/</span>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>Städte</span>
              <span>/</span>
              <span style={{ color: 'var(--honey, #F59E0B)' }}>{city.name}</span>
            </nav>

            <div className="flex flex-wrap items-start gap-3 mb-4">
              <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}>
                {city.state}
              </span>
              <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
                {fmt(city.population)} Einwohner
              </span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight mb-4 lg:text-5xl">
              Hundefutter in <span style={{ color: '#F59E0B' }}>{city.name}</span>
            </h1>
            <p className="text-lg max-w-2xl" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Etwa <strong style={{ color: '#fff' }}>{fmt(dogs)} Hunde</strong> leben in {city.name}. Jeder verdient das beste Futter.
              BELLA vergleicht über 8.400 Produkte und findet in 60 Sekunden die perfekte Empfehlung — kostenlos.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/advisor"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all hover:scale-105"
                style={{ background: '#F59E0B', color: '#000' }}
              >
                BELLA starten — kostenlos
                <span>→</span>
              </Link>
              <Link
                href="/deals"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                Aktuelle Angebote ansehen
              </Link>
            </div>
          </div>
        </section>

        {/* ── STADTPROFIL STATS ────────────────────────────────────── */}
        <section className="px-4 pb-12">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-xl font-bold mb-6">
              {city.name} in Zahlen — der Hunde-Stadtreport
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Hunde in der Stadt', value: `~${fmt(dogs)}`, sub: 'geschätzt', icon: '🐾' },
                { label: 'Hundehalter-Haushalte', value: `~${fmt(owners)}`, sub: 'Familien mit Hund', icon: '🏠' },
                { label: 'Jährl. Futterbedarf', value: tons, sub: 'Trockenmasse/Jahr', icon: '🥩' },
                { label: 'Futter-Marktpotenzial', value: spend, sub: 'pro Jahr in der Stadt', icon: '📊' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl p-4 flex flex-col gap-2"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <span className="text-2xl">{s.icon}</span>
                  <div className="text-2xl font-extrabold" style={{ color: '#F59E0B' }}>{s.value}</div>
                  <div className="text-xs font-semibold text-white/80">{s.label}</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.sub}</div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              * Schätzungen basieren auf bundesweiten IVH-Statistiken (19,8 Hunde je 100 Einwohner, Ø 480 Euro Jahresausgaben). Nicht amtlich.
            </p>
          </div>
        </section>

        {/* ── REGIONALES PROFIL ────────────────────────────────────── */}
        <section className="px-4 pb-12">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-3xl p-6 sm:p-8" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
              <h2 className="text-xl font-bold mb-3">{profile.headline}</h2>
              <p className="mb-6" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.75 }}>{profile.intro}</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { label: 'Aktivitätsprofil', value: profile.outdoor },
                  { label: 'Klima', value: profile.climate },
                  { label: 'BELLA-Tipp', value: profile.tip },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="text-xs mb-1 font-semibold" style={{ color: '#F59E0B' }}>{item.label}</div>
                    <div className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── BELLA CTA ────────────────────────────────────────────── */}
        <section className="px-4 pb-12">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-3xl p-8 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.04) 100%)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 blur-3xl" style={{ background: '#F59E0B' }} />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
                  🐶
                </div>
                <h2 className="text-2xl font-extrabold mb-3">
                  BELLA findet das perfekte Futter<br />
                  <span style={{ color: '#F59E0B' }}>für deinen {city.name}er Hund</span>
                </h2>
                <p className="mb-6 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Sag BELLA einfach Rasse, Alter und ob dein Hund besondere Bedürfnisse hat.
                  In unter 60 Sekunden bekommst du eine personalisierte Empfehlung aus
                  über 8.400 echten Produkten — kostenlos, ohne Anmeldung.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link
                    href="/advisor"
                    className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold transition-all hover:scale-105 hover:shadow-lg"
                    style={{ background: '#F59E0B', color: '#000', boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}
                  >
                    Jetzt mit BELLA starten →
                  </Link>
                  <Link
                    href="/deals"
                    className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold"
                    style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
                  >
                    Angebote für {city.name}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── BELIEBTE RASSEN ─────────────────────────────────────── */}
        <section className="px-4 pb-12">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-xl font-bold mb-2">
              Beliebte Rassen in {city.state}
            </h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Für jede dieser Rassen hat BELLA spezialisierte Futter-Empfehlungen — mit rassenspezifischen Gesundheits-Hinweisen und Portionsrechner.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {breeds.map((b) => (
                <Link
                  key={b.slug}
                  href={`/rasse/${b.slug}`}
                  className="rounded-2xl p-4 flex items-center gap-3 group transition-all hover:scale-105"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <span className="text-2xl">🐕</span>
                  <div>
                    <div className="text-sm font-semibold group-hover:text-yellow-400 transition-colors">{b.name}</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Rasse-Seite ansehen</div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/rassen" className="text-sm transition-colors hover:text-yellow-400" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Alle 185 Rassen & Mischlinge ansehen →
              </Link>
            </div>
          </div>
        </section>

        {/* ── FÜTTERUNGSGUIDE ──────────────────────────────────────── */}
        <section className="px-4 pb-12">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-xl font-bold mb-6">
              Fütterungsguide für Hunde in {city.name}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: 'Wie viel Futter braucht mein Hund?',
                  icon: '⚖️',
                  text: `Die Futtermenge hängt von Gewicht, Alter und Aktivität ab — nicht vom Wohnort. Ein 10 kg Hund braucht ca. 170–210g Trockenfutter täglich. Ein 30 kg Hund ca. 350–450g. BELLA berechnet die exakte Menge nach der RER-Formel (70 × Körpergewicht^0,75 × Aktivitätsfaktor).`,
                },
                {
                  title: 'Trockenfutter oder Nassfutter?',
                  icon: '🥫',
                  text: 'Beides hat Vorteile: Trockenfutter ist günstiger und gut für die Zähne, Nassfutter hat mehr Feuchtigkeit und ist leicht verdaulich. Viele Halter kombinieren beides. BELLA empfiehlt das Optimale für deinen spezifischen Hund.',
                },
                {
                  title: 'Worauf sollte ich bei Inhaltsstoffen achten?',
                  icon: '🔍',
                  text: 'Fleisch sollte als erstes Inhaltsstoff stehen. Mindestens 60% Fleischanteil im Trockenfutter, keine Zuckerzusätze, keine Farb- oder Konservierungsstoffe. Der BELLA-Score berechnet automatisch: Fleischanteil, Deklarationsqualität und Zusammensetzung.',
                },
                {
                  title: 'Was tue ich bei Allergien oder Unverträglichkeiten?',
                  icon: '⚠️',
                  text: 'Häufige Auslöser sind Huhn, Rind und Weizen. Bei Verdacht: Monoprotein-Futter mit einem einzigen, neuen Protein (z.B. Insekten, Pferd, Känguru) für 8 Wochen. BELLA filtert automatisch Allergen-freie Produkte nach deiner Angabe.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl p-5"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{item.icon}</span>
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                  </div>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────── */}
        <section className="px-4 pb-12">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-xl font-bold mb-6">
              Häufige Fragen zu Hundefutter in {city.name}
            </h2>
            <div className="flex flex-col gap-4">
              {faqs.map((f, i) => (
                <details
                  key={i}
                  className="rounded-2xl group"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <summary
                    className="cursor-pointer px-5 py-4 font-semibold text-sm flex items-center justify-between gap-4 select-none list-none"
                    style={{ color: '#fff' }}
                  >
                    <span>{f.q}</span>
                    <span className="text-yellow-400 text-lg shrink-0 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-5 pb-5 text-sm" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.75 }}>
                    {f.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── NAHE STAEDTE ─────────────────────────────────────────── */}
        {nearbyCities.length > 0 && (
          <section className="px-4 pb-16">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-xl font-bold mb-2">
                Hundefutter-Beratung in anderen Städten in {city.state}
              </h2>
              <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
                BELLA berät überall in Deutschland — für jede Stadt kostenlos und personalisiert.
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                {nearbyCities.map((nc) => (
                  <Link
                    key={nc.slug}
                    href={`/stadt/${nc.slug}`}
                    className="rounded-xl p-3 text-center text-sm font-medium transition-all hover:scale-105"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
                  >
                    {nc.name}
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {fmt(Math.round(nc.population / 1000))}k Einw.
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FOOTER CTA ───────────────────────────────────────────── */}
        <section className="px-4 pb-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
              BELLA ist Deutschlands erste KI-Beraterin für Hundefutter.
              Kostenlos · Ohne Anmeldung · 8.442 echte Produkte
            </p>
            <Link
              href="/advisor"
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold transition-all hover:scale-105"
              style={{ background: '#F59E0B', color: '#000' }}
            >
              BELLA jetzt kostenlos starten →
            </Link>
          </div>
        </section>

      </main>
    </>
  );
}
