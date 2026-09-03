import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 86400;
export const dynamicParams = true;

const HUB_SLUGS = [
  "allergien", "barf", "trockenfutter", "welpen",
  "senioren", "uebergewicht", "verdauung", "nachhaltigkeit",
];

export function generateStaticParams() {
  return HUB_SLUGS.map((hub) => ({ hub }));
}

interface HubRow {
  slug: string;
  name: string;
  description: string;
  icon: string;
  study_count: number;
}

interface StudyRow {
  id: string;
  slug: string;
  title: string;
  authors: string[];
  year: number;
  journal: string;
  study_design: string;
  evidence_strength: string;
  bella_summary: string;
  tags: string[];
}

async function getHub(slug: string): Promise<HubRow | null> {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  try {
    const sql = neon(url);
    const rows = await sql`
      SELECT slug, name, description, icon, study_count
      FROM topic_hubs WHERE slug = ${slug}
    `;
    return (rows[0] as HubRow) ?? null;
  } catch {
    return null;
  }
}

async function getStudiesForHub(hubSlug: string): Promise<StudyRow[]> {
  const url = process.env.DATABASE_URL;
  if (!url) return [];
  try {
    const sql = neon(url);
    const rows = await sql`
      SELECT id, slug, title, authors, year, journal, study_design, evidence_strength, bella_summary, tags
      FROM studies
      WHERE topic_hub = ${hubSlug}
      ORDER BY year DESC
    `;
    return rows as StudyRow[];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hub: string }>;
}): Promise<Metadata> {
  const { hub } = await params;
  const data = await getHub(hub);
  if (!data) return {};
  return {
    title: `${data.name}: ${data.study_count} Studien — Wissensuniversum`,
    description: `${data.description} Alle Studien mit DOI, PubMed-Links und BELLAs Einschätzung.`,
    alternates: {
      canonical: `https://welches-hundefutter.today/studien/${hub}`,
    },
  };
}

const EVIDENCE_COLOR: Record<string, string> = {
  hoch: "text-green-400 bg-green-400/10 border-green-400/30",
  mittel: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  niedrig: "text-orange-400 bg-orange-400/10 border-orange-400/30",
};

const EVIDENCE_DOT: Record<string, string> = {
  hoch: "bg-green-400",
  mittel: "bg-yellow-400",
  niedrig: "bg-orange-400",
};

export default async function StudienHubPage({
  params,
}: {
  params: Promise<{ hub: string }>;
}) {
  const { hub } = await params;
  const [hubData, studies] = await Promise.all([
    getHub(hub),
    getStudiesForHub(hub),
  ]);

  if (!hubData && !HUB_SLUGS.includes(hub)) notFound();

  // Fallback wenn DB nicht erreichbar aber Slug gültig
  const name = hubData?.name ?? hub;
  const icon = hubData?.icon ?? "🔬";
  const description = hubData?.description ?? "";

  return (
    <>
      <main className="min-h-screen bg-[#0a0f1e] text-white">
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <nav className="text-sm text-white/40 flex items-center gap-2">
            <Link href="/studien" className="hover:text-white/70 transition-colors">
              Wissensuniversum
            </Link>
            <span>/</span>
            <span className="text-white/70">{name}</span>
          </nav>
        </div>

        {/* Header */}
        <section className="max-w-4xl mx-auto px-4 pt-8 pb-10">
          <div className="text-5xl mb-4">{icon}</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">{name}</h1>
          <p className="text-lg text-white/60 max-w-2xl">{description}</p>
          {studies.length > 0 && (
            <p className="text-sm text-white/40 mt-2">
              {studies.length} {studies.length === 1 ? "Studie" : "Studien"} in diesem Themenbereich
            </p>
          )}
        </section>

        {/* Studies List */}
        <section className="max-w-4xl mx-auto px-4 pb-20">
          {studies.length === 0 ? (
            <div className="text-center py-16 text-white/40">
              <p className="text-lg">Studien werden geladen…</p>
              <p className="text-sm mt-2">Bitte nach der ersten DB-Migration erneut aufrufen.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {studies.map((s) => (
                <Link
                  key={s.slug}
                  href={`/studien/${hub}/${s.slug}`}
                  className="group block bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <div className="flex flex-wrap items-start gap-3 mb-3">
                    <span
                      className={`text-xs font-medium border rounded-full px-2.5 py-0.5 ${
                        EVIDENCE_COLOR[s.evidence_strength] ?? "text-white/60 bg-white/5 border-white/20"
                      }`}
                    >
                      <span
                        className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle ${
                          EVIDENCE_DOT[s.evidence_strength] ?? "bg-white/60"
                        }`}
                      />
                      {s.evidence_strength === "hoch"
                        ? "Hohe Evidenz"
                        : s.evidence_strength === "mittel"
                        ? "Mittlere Evidenz"
                        : "Niedrige Evidenz"}
                    </span>
                    <span className="text-xs text-white/40 bg-white/5 rounded-full px-2.5 py-0.5">
                      {s.study_design}
                    </span>
                    <span className="text-xs text-white/40">{s.year}</span>
                  </div>

                  <h2 className="text-base font-semibold text-white mb-1 group-hover:text-accent transition-colors line-clamp-2">
                    {s.title}
                  </h2>
                  <p className="text-sm text-white/50 mb-3">
                    {Array.isArray(s.authors) ? s.authors.slice(0, 3).join(", ") : s.authors}
                    {Array.isArray(s.authors) && s.authors.length > 3 ? " et al." : ""} ·{" "}
                    <em>{s.journal}</em>
                  </p>

                  {/* BELLA-Vorschau */}
                  <div className="bg-purple-900/20 border border-purple-500/20 rounded-xl px-4 py-3">
                    <p className="text-xs text-purple-300 font-medium mb-1">🐾 BELLAs Einschätzung</p>
                    <p className="text-sm text-white/70 line-clamp-2">
                      {s.bella_summary}
                    </p>
                  </div>

                  {/* Tags */}
                  {Array.isArray(s.tags) && s.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {s.tags.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="text-xs text-white/30 bg-white/5 rounded-full px-2 py-0.5"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 text-xs text-white/30 group-hover:text-accent transition-colors">
                    Studie vollständig lesen →
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Navigation to other hubs */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between">
            <Link
              href="/studien"
              className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1"
            >
              ← Alle Themengebiete
            </Link>
            <Link
              href="/glossar"
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              Fachbegriffe-Glossar →
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
