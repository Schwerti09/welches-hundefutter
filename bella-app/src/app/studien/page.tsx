import type { Metadata } from "next";
import Link from "next/link";
import { neon } from "@neondatabase/serverless";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Wissensuniversum Hundeernährung — Peer-Reviewed Studien & Fakten",
  description:
    "30+ echte wissenschaftliche Studien zur Hundeernährung, verständlich erklärt von BELLA. Allergien, BARF, Trockenfutter, Welpen, Senioren & mehr — fundiert, ehrlich, praktisch.",
  alternates: {
    canonical: "https://welches-hundefutter.today/studien",
    languages: {
      "de-DE": "https://welches-hundefutter.today/studien",
      "de-AT": "https://welches-hundefutter.today/studien",
      "de-CH": "https://welches-hundefutter.today/studien",
      "x-default": "https://welches-hundefutter.today/studien",
    },
  },
  openGraph: {
    title: "Wissensuniversum: Peer-Reviewed Studien zur Hundeernährung",
    description:
      "30+ echte wissenschaftliche Studien, verständlich erklärt von BELLA. Keine Mythen, nur Fakten.",
    images: ["/og-image.png"],
  },
};

interface HubRow {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon: string;
  study_count: number;
  order: number;
}

async function getHubs(): Promise<HubRow[]> {
  const url = process.env.DATABASE_URL;
  if (!url) return [];
  try {
    const sql = neon(url);
    const rows = await sql`
      SELECT id, slug, name, description, icon, study_count, "order"
      FROM topic_hubs
      ORDER BY "order" ASC
    `;
    return rows as HubRow[];
  } catch {
    return [];
  }
}

async function getTotalStudyCount(): Promise<number> {
  const url = process.env.DATABASE_URL;
  if (!url) return 30;
  try {
    const sql = neon(url);
    const rows = await sql`SELECT COUNT(*) as n FROM studies`;
    return Number(rows[0]?.n ?? 30);
  } catch {
    return 30;
  }
}

export default async function StudienPage() {
  const [hubs, totalCount] = await Promise.all([getHubs(), getTotalStudyCount()]);

  // Fallback-Daten falls DB noch nicht migriert
  const displayHubs =
    hubs.length > 0
      ? hubs
      : [
          { slug: "allergien", name: "Allergien & Unverträglichkeiten", description: "Wissenschaftliche Studien zu Futterallergien, Eliminationsdiäten und hypoallergenem Futter.", icon: "🤧", study_count: 5, id: 1, order: 1 },
          { slug: "barf", name: "BARF vs. Verarbeitung", description: "Vergleichsstudien zwischen Rohfütterung, Trockenfutter und Nassfutter.", icon: "🥩", study_count: 3, id: 2, order: 2 },
          { slug: "trockenfutter", name: "Trockenfutter", description: "Studien zu Kibble, Nährstoffdichte und Auswirkungen auf Zahngesundheit.", icon: "🥣", study_count: 3, id: 3, order: 3 },
          { slug: "welpen", name: "Welpen-Ernährung", description: "Wachstum, Nährstoffbedarf und langfristige Auswirkungen der Welpen-Ernährung.", icon: "🐕", study_count: 3, id: 4, order: 4 },
          { slug: "senioren", name: "Senioren & Longevity", description: "Alterungsprozess, Gelenkgesundheit, kognitive Funktion und Ernährungsstrategien.", icon: "👴", study_count: 3, id: 5, order: 5 },
          { slug: "uebergewicht", name: "Übergewicht", description: "Kalorien, Gewichtsmanagement und metabolische Auswirkungen von Übergewicht.", icon: "⚖️", study_count: 3, id: 6, order: 6 },
          { slug: "verdauung", name: "Verdauung & Mikrobiom", description: "Darmgesundheit, Probiotika und die Rolle des Darmmikrobioms.", icon: "🦠", study_count: 5, id: 7, order: 7 },
          { slug: "nachhaltigkeit", name: "Nachhaltigkeit", description: "Plant-based Diäten, Insektenprotein und Umwelt-Impact von Hundefutter.", icon: "🌱", study_count: 3, id: 8, order: 8 },
        ] satisfies HubRow[];

  return (
    <>
      <main className="min-h-screen bg-[#0a0f1e] text-white">
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 pt-16 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white/60 mb-6">
            <span>🔬</span>
            <span>Peer-Reviewed Wissenschaft · Verständlich erklärt</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Wissensuniversum
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-6">
            {totalCount}+ echte peer-reviewed Studien zur Hundeernährung — verständlich erklärt, ehrlich bewertet.
            Kein Marketing, nur Wissenschaft.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-white/50">
            <span className="bg-white/5 rounded-full px-3 py-1">Alle Studien mit DOI & PubMed</span>
            <span className="bg-white/5 rounded-full px-3 py-1">Evidenzstärke bewertet</span>
            <span className="bg-white/5 rounded-full px-3 py-1">BELLAs Einschätzung zu jeder Studie</span>
          </div>
        </section>

        {/* Hub-Grid */}
        <section className="max-w-5xl mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayHubs.map((hub) => (
              <Link
                key={hub.slug}
                href={`/studien/${hub.slug}`}
                className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-200 card-hover"
              >
                {/* Hub image */}
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={`/images/content/studien/${hub.slug}.jpg`}
                    alt={hub.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/50 to-transparent" />
                  <span className="absolute top-3 left-3 text-2xl">{hub.icon}</span>
                </div>
                <div className="p-5">
                  <h2 className="text-base font-semibold text-white mb-2 group-hover:text-accent transition-colors">
                    {hub.name}
                  </h2>
                  <p className="text-sm text-white/50 leading-relaxed mb-4">
                    {hub.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-white/10 rounded-full px-3 py-1 text-white/60">
                      {hub.study_count} {hub.study_count === 1 ? "Studie" : "Studien"}
                    </span>
                    <span className="text-xs text-white/40 group-hover:text-accent transition-colors">
                      Studien ansehen →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Glossar CTA */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-2xl p-8 text-center">
            <div className="text-3xl mb-3">📚</div>
            <h2 className="text-2xl font-bold mb-2">Fachbegriffe-Glossar</h2>
            <p className="text-white/60 mb-4 max-w-lg mx-auto">
              Von RCT bis Dysbiosis: Alle wissenschaftlichen Fachbegriffe einfach erklärt.
            </p>
            <Link
              href="/glossar"
              className="inline-flex items-center gap-2 bg-white text-[#0a0f1e] font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors"
            >
              Zum Glossar
            </Link>
          </div>
        </section>

        {/* Methodische Transparenz */}
        <section className="max-w-3xl mx-auto px-4 pb-20">
          <div className="bg-white/3 border border-white/8 rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-4">Wie wir Studien bewerten</h2>
            <div className="space-y-3 text-sm text-white/60">
              <div className="flex gap-3">
                <span className="text-green-400 mt-0.5">●</span>
                <div>
                  <strong className="text-white">Hohe Evidenz:</strong> RCTs, systematische Reviews, Metaanalysen mit großen Stichproben
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-yellow-400 mt-0.5">●</span>
                <div>
                  <strong className="text-white">Mittlere Evidenz:</strong> Crossover-Studien, prospektive Kohortenstudien, gut durchgeführte Vergleiche
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-orange-400 mt-0.5">●</span>
                <div>
                  <strong className="text-white">Niedrige Evidenz:</strong> Pilotstudien, kleine Stichproben, kurze Beobachtungszeiträume
                </div>
              </div>
            </div>
            <p className="text-xs text-white/30 mt-4">
              Alle Studien verlinken zu echten DOI / PubMed-Quellen. BELLAs Zusammenfassung ist keine tierärztliche Beratung.
              Bei Gesundheitsfragen: Tierarzt fragen.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
