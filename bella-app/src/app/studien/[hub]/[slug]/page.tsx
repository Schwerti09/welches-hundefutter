import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import SiteFooter from "@/components/SiteFooter";

export const revalidate = 86400;
export const dynamicParams = true;

interface StudyDetail {
  id: string;
  slug: string;
  title: string;
  authors: string[];
  year: number;
  journal: string;
  doi: string | null;
  pubmed_link: string | null;
  study_design: string;
  population: string;
  methodology: string;
  key_findings: string;
  limitations: string | null;
  bella_summary: string;
  evidence_strength: string;
  tags: string[];
  topic_hub: string;
  related_products: string[];
}

interface HubName {
  name: string;
  icon: string;
}

async function getStudy(slug: string): Promise<StudyDetail | null> {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  try {
    const sql = neon(url);
    const rows = await sql`
      SELECT id, slug, title, authors, year, journal, doi, pubmed_link,
             study_design, population, methodology, key_findings, limitations,
             bella_summary, evidence_strength, tags, topic_hub, related_products
      FROM studies WHERE slug = ${slug}
    `;
    return (rows[0] as StudyDetail) ?? null;
  } catch {
    return null;
  }
}

async function getHubName(hubSlug: string): Promise<HubName> {
  const url = process.env.DATABASE_URL;
  if (!url) return { name: hubSlug, icon: "🔬" };
  try {
    const sql = neon(url);
    const rows = await sql`SELECT name, icon FROM topic_hubs WHERE slug = ${hubSlug}`;
    return (rows[0] as HubName) ?? { name: hubSlug, icon: "🔬" };
  } catch {
    return { name: hubSlug, icon: "🔬" };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hub: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = await getStudy(slug);
  if (!study) return {};
  const authorShort = study.authors?.[0]?.split(",")[0] ?? "";
  return {
    title: `${study.title.slice(0, 60)}… (${study.year}) — Studie erklärt`,
    description: `${authorShort} et al. (${study.year}) in ${study.journal}: BELLAs Einschätzung, Methodik, Ergebnisse und Einschränkungen verständlich erklärt.`,
    alternates: {
      canonical: `https://welches-hundefutter.today/studien/${study.topic_hub}/${slug}`,
    },
    openGraph: {
      title: `Studie: ${study.title.slice(0, 70)}`,
      description: study.bella_summary.slice(0, 160),
    },
  };
}

const EVIDENCE_BADGE: Record<string, { label: string; classes: string }> = {
  hoch: { label: "Hohe Evidenz", classes: "text-green-400 bg-green-400/10 border-green-400/30" },
  mittel: { label: "Mittlere Evidenz", classes: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
  niedrig: { label: "Niedrige Evidenz", classes: "text-orange-400 bg-orange-400/10 border-orange-400/30" },
};

export default async function StudyDetailPage({
  params,
}: {
  params: Promise<{ hub: string; slug: string }>;
}) {
  const { hub, slug } = await params;
  const [study, hubInfo] = await Promise.all([getStudy(slug), getHubName(hub)]);

  if (!study) notFound();

  const badge = EVIDENCE_BADGE[study.evidence_strength] ?? {
    label: study.evidence_strength,
    classes: "text-white/60 bg-white/5 border-white/20",
  };

  const authors = Array.isArray(study.authors) ? study.authors : [];
  const tags = Array.isArray(study.tags) ? study.tags : [];

  return (
    <>
      <main className="min-h-screen bg-[#0a0f1e] text-white">
        {/* Breadcrumb */}
        <div className="max-w-3xl mx-auto px-4 pt-8">
          <nav className="text-sm text-white/40 flex items-center gap-2 flex-wrap">
            <Link href="/studien" className="hover:text-white/70 transition-colors">
              Wissensuniversum
            </Link>
            <span>/</span>
            <Link href={`/studien/${hub}`} className="hover:text-white/70 transition-colors">
              {hubInfo.icon} {hubInfo.name}
            </Link>
            <span>/</span>
            <span className="text-white/60 line-clamp-1 max-w-xs">{study.title.slice(0, 50)}…</span>
          </nav>
        </div>

        <article className="max-w-3xl mx-auto px-4 pt-8 pb-20">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`text-xs font-medium border rounded-full px-3 py-1 ${badge.classes}`}>
              {badge.label}
            </span>
            <span className="text-xs text-white/40 bg-white/5 border border-white/10 rounded-full px-3 py-1">
              {study.study_design}
            </span>
            <span className="text-xs text-white/40 bg-white/5 border border-white/10 rounded-full px-3 py-1">
              {study.year}
            </span>
          </div>

          {/* Titel */}
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 leading-snug">
            {study.title}
          </h1>

          {/* Autoren & Journal */}
          <p className="text-white/50 mb-2">
            {authors.slice(0, 4).join(", ")}
            {authors.length > 4 ? " et al." : ""}
          </p>
          <p className="text-white/40 text-sm mb-6">
            <em>{study.journal}</em> · {study.year}
            {study.doi && (
              <span> · DOI:{" "}
                <a
                  href={`https://doi.org/${study.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {study.doi}
                </a>
              </span>
            )}
            {study.pubmed_link && (
              <span className="ml-2">·{" "}
                <a
                  href={study.pubmed_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  PubMed ↗
                </a>
              </span>
            )}
          </p>

          {/* BELLA-Zusammenfassung — prominent */}
          <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/30 border border-purple-500/30 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🐾</span>
              <span className="font-semibold text-purple-300">BELLAs Einschätzung</span>
            </div>
            <p className="text-white/80 leading-relaxed">{study.bella_summary}</p>
          </div>

          {/* Studie im Detail */}
          <div className="space-y-6">
            <InfoBlock title="Studiendesign & Stichprobe">
              <div className="space-y-2 text-sm text-white/70">
                <div><span className="text-white/40">Design:</span> {study.study_design}</div>
                <div><span className="text-white/40">Stichprobe:</span> {study.population}</div>
              </div>
            </InfoBlock>

            <InfoBlock title="Methodik">
              <p className="text-sm text-white/70 leading-relaxed">{study.methodology}</p>
            </InfoBlock>

            <InfoBlock title="Wichtigste Ergebnisse">
              <p className="text-sm text-white/70 leading-relaxed">{study.key_findings}</p>
            </InfoBlock>

            {study.limitations && (
              <InfoBlock title="Einschränkungen & Limitierungen">
                <p className="text-sm text-white/60 leading-relaxed italic">{study.limitations}</p>
              </InfoBlock>
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/10">
              {tags.map((t) => (
                <span
                  key={t}
                  className="text-xs text-white/40 bg-white/5 rounded-full px-2.5 py-0.5"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-white/3 border border-white/8 rounded-xl text-xs text-white/30 leading-relaxed">
            <strong className="text-white/50">Hinweis:</strong> Diese Zusammenfassung dient der
            allgemeinen Information und ersetzt keine tierärztliche Beratung. Bei
            Gesundheitsfragen: Tierarzt konsultieren. Alle Angaben beziehen sich auf die
            verlinkten Primärstudien.
          </div>

          {/* Navigation */}
          <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
            <Link
              href={`/studien/${hub}`}
              className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1"
            >
              ← Alle {hubInfo.name}-Studien
            </Link>
            <Link
              href="/studien"
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              Wissensuniversum
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
        {title}
      </h2>
      {children}
    </div>
  );
}
