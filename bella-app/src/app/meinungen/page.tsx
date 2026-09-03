import type { Metadata } from "next";
import Link from "next/link";
import { neon } from "@neondatabase/serverless";
import SiteFooter from "@/components/SiteFooter";
import MeinungenFilter from "@/components/MeinungenFilter";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Meinungsnetz — Was Hundebesitzer wirklich sagen | BELLA",
  description:
    "Echte Bewertungen, Forenkommentare und Erfahrungen aus deutschen Hundefutter-Communities — verknüpft mit peer-reviewed Studien. Kein Marketing, echte Meinungen.",
  alternates: {
    canonical: "https://welches-hundefutter.today/meinungen",
  },
  openGraph: {
    title: "Meinungsnetz: Echte Meinungen, echte Studien",
    description:
      "Was sagen Hundebesitzer wirklich? 36+ verifizierte Kommentare aus Dogforum, Zooplus & Co — mit Studien verknüpft.",
    images: ["/og-image.png"],
  },
};

export interface Insight {
  id: string;
  platform: string;
  source_url: string;
  author: string | null;
  content_excerpt: string;
  sentiment: string;
  mentioned_brands: string[];
  mentioned_topics: string[];
  related_study_slugs: string[];
  related_product_slugs: string[];
  upvotes: number | null;
  published_at: string | null;
  verified: boolean;
}

async function getInsights(): Promise<Insight[]> {
  const url = process.env.DATABASE_URL;
  if (!url) return [];
  try {
    const sql = neon(url);
    const rows = await sql`
      SELECT id, platform, source_url, author, content_excerpt, sentiment,
             mentioned_brands, mentioned_topics, related_study_slugs,
             related_product_slugs, upvotes, published_at, verified
      FROM community_insights
      ORDER BY
        CASE WHEN verified THEN 0 ELSE 1 END,
        published_at DESC NULLS LAST
    `;
    return rows as Insight[];
  } catch {
    return [];
  }
}

async function getStudyMap(): Promise<Record<string, { title: string; topic_hub: string }>> {
  const url = process.env.DATABASE_URL;
  if (!url) return {};
  try {
    const sql = neon(url);
    const rows = await sql`SELECT slug, title, topic_hub FROM studies`;
    return Object.fromEntries(rows.map((r) => [r.slug, { title: r.title, topic_hub: r.topic_hub }]));
  } catch {
    return {};
  }
}

const PLATFORM_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  forum: { label: "Forum", color: "bg-blue-500/20 text-blue-300 border-blue-500/30", icon: "💬" },
  zooplus: { label: "Zooplus", color: "bg-orange-500/20 text-orange-300 border-orange-500/30", icon: "⭐" },
  amazon: { label: "Amazon", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", icon: "📦" },
  reddit: { label: "Reddit", color: "bg-red-500/20 text-red-300 border-red-500/30", icon: "🔴" },
  youtube: { label: "YouTube", color: "bg-red-600/20 text-red-400 border-red-600/30", icon: "▶" },
  google: { label: "Google", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", icon: "🔍" },
};

const SENTIMENT_STYLES = {
  positiv: { dot: "bg-emerald-400", border: "border-l-emerald-400/60", label: "Positiv" },
  negativ: { dot: "bg-red-400", border: "border-l-red-400/60", label: "Kritisch" },
  gemischt: { dot: "bg-amber-400", border: "border-l-amber-400/60", label: "Gemischt" },
};

const TOPIC_LABELS: Record<string, string> = {
  allergie: "Allergien",
  ausschlussdiät: "Ausschlussdiät",
  barf: "BARF",
  trockenfutter: "Trockenfutter",
  nassfutter: "Nassfutter",
  verdauung: "Verdauung",
  übergewicht: "Übergewicht",
  senior: "Senioren",
  welpen: "Welpen",
  omega3: "Omega-3",
  gelenke: "Gelenke",
  insektenprotein: "Insektenprotein",
  nachhaltigkeit: "Nachhaltigkeit",
  hygiene: "Hygiene",
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("de-DE", { year: "numeric", month: "short" });
  } catch {
    return "";
  }
}

function InsightCard({
  insight,
  studyMap,
}: {
  insight: Insight;
  studyMap: Record<string, { title: string; topic_hub: string }>;
}) {
  const plat = PLATFORM_LABELS[insight.platform] ?? { label: insight.platform, color: "bg-white/10 text-white/60 border-white/10", icon: "💬" };
  const sent = SENTIMENT_STYLES[insight.sentiment as keyof typeof SENTIMENT_STYLES] ?? SENTIMENT_STYLES.gemischt;
  const portraitNum = ((insight.id.charCodeAt(0) + (insight.id.charCodeAt(2) ?? 0)) % 4) + 1;

  return (
    <div className={`relative bg-white/4 border border-white/8 border-l-4 ${sent.border} rounded-2xl p-5 flex flex-col gap-3 hover:bg-white/7 transition-colors`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${plat.color}`}>
            <span>{plat.icon}</span>
            <span>{plat.label}</span>
          </span>
          {insight.verified && (
            <span className="text-xs text-emerald-400/80">✓ verifiziert</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`w-2 h-2 rounded-full ${sent.dot}`} title={sent.label} />
        </div>
      </div>

      {/* Quote */}
      <blockquote className="text-white/85 text-sm leading-relaxed">
        <span className="text-white/30 text-lg leading-none">"</span>
        {insight.content_excerpt}
        <span className="text-white/30 text-lg leading-none">"</span>
      </blockquote>

      {/* Author + Date */}
      <div className="flex items-center gap-2 text-xs text-white/40">
        <img
          src={`/images/content/meinungen/dog-portrait-${portraitNum}.jpg`}
          alt="Hund"
          className="w-7 h-7 rounded-full object-cover border border-white/10 shrink-0"
        />
        {insight.author && (
          <span className="font-medium text-white/60">{insight.author}</span>
        )}
        {insight.author && insight.published_at && <span>·</span>}
        {insight.published_at && <span>{formatDate(insight.published_at)}</span>}
        <a
          href={insight.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-white/30 hover:text-white/60 transition-colors"
          title="Originalquelle"
        >
          ↗ Quelle
        </a>
      </div>

      {/* Topics */}
      {insight.mentioned_topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {insight.mentioned_topics.slice(0, 4).map((t) => (
            <span key={t} className="text-xs bg-white/5 text-white/40 rounded-full px-2 py-0.5">
              {TOPIC_LABELS[t] ?? t}
            </span>
          ))}
        </div>
      )}

      {/* Related Studies */}
      {insight.related_study_slugs.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-purple-400/60 font-medium">📚 Passende Studien</span>
          <div className="flex flex-wrap gap-1.5">
            {insight.related_study_slugs.slice(0, 2).map((slug) => {
              const study = studyMap[slug];
              if (!study) return null;
              return (
                <Link
                  key={slug}
                  href={`/studien/${study.topic_hub}/${slug}`}
                  className="text-xs bg-purple-900/30 text-purple-300 border border-purple-500/20 rounded-lg px-2 py-0.5 hover:bg-purple-900/50 transition-colors truncate max-w-[180px]"
                  title={study.title}
                >
                  {study.title.length > 40 ? study.title.slice(0, 40) + "…" : study.title}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Related Products */}
      {insight.related_product_slugs.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {insight.related_product_slugs.slice(0, 1).map((slug) => (
            <Link
              key={slug}
              href={`/produkt/${slug}`}
              className="text-xs bg-emerald-900/20 text-emerald-300 border border-emerald-500/20 rounded-lg px-2 py-0.5 hover:bg-emerald-900/40 transition-colors"
            >
              🛒 Produkt ansehen
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function MeinungenPage({
  searchParams,
}: {
  searchParams: Promise<{ thema?: string; stimmung?: string }>;
}) {
  const params = await searchParams;
  const [allInsights, studyMap] = await Promise.all([getInsights(), getStudyMap()]);

  // Alle einzigartigen Themen für Filter sammeln
  const allTopics = Array.from(
    new Set(allInsights.flatMap((i) => i.mentioned_topics))
  ).filter((t) => t in TOPIC_LABELS);

  // Filter anwenden
  const filtered = allInsights.filter((i) => {
    if (params.thema && !i.mentioned_topics.includes(params.thema)) return false;
    if (params.stimmung && i.sentiment !== params.stimmung) return false;
    return true;
  });

  const posCount = allInsights.filter((i) => i.sentiment === "positiv").length;
  const negCount = allInsights.filter((i) => i.sentiment === "negativ").length;
  const gemCount = allInsights.filter((i) => i.sentiment === "gemischt").length;
  const verifiedCount = allInsights.filter((i) => i.verified).length;

  return (
    <>
      <main className="min-h-screen bg-[#0a0f1e] text-white">
        {/* Hero mit Spinnennetz-SVG */}
        <section className="relative max-w-5xl mx-auto px-4 pt-14 pb-10 text-center overflow-hidden">
          {/* Dekoratives Spinnennetz im Hintergrund */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <svg width="600" height="400" viewBox="0 0 600 400" fill="none" className="max-w-full">
              {/* Radiale Strahlen */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
                const rad = (deg * Math.PI) / 180;
                const x = 300 + 250 * Math.cos(rad);
                const y = 200 + 180 * Math.sin(rad);
                return <line key={i} x1="300" y1="200" x2={x} y2={y} stroke="white" strokeWidth="0.8" />;
              })}
              {/* Konzentrische Ellipsen */}
              {[0.25, 0.5, 0.75, 1].map((scale, i) => (
                <ellipse key={i} cx="300" cy="200" rx={250 * scale} ry={180 * scale} stroke="white" strokeWidth="0.8" fill="none" />
              ))}
              {/* Verbindungslinien zwischen Strahlenpunkten */}
              {[0.5, 1].map((scale) =>
                [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i, arr) => {
                  const nextDeg = arr[(i + 1) % arr.length];
                  const r1 = (deg * Math.PI) / 180;
                  const r2 = (nextDeg * Math.PI) / 180;
                  return (
                    <line
                      key={`${scale}-${i}`}
                      x1={300 + 250 * scale * Math.cos(r1)}
                      y1={200 + 180 * scale * Math.sin(r1)}
                      x2={300 + 250 * scale * Math.cos(r2)}
                      y2={200 + 180 * scale * Math.sin(r2)}
                      stroke="white"
                      strokeWidth="0.5"
                    />
                  );
                })
              )}
            </svg>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white/60 mb-5">
              <span>🕸️</span>
              <span>Echte Stimmen · Verifizierte Quellen · Wissenschaftlich verknüpft</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Meinungsnetz
            </h1>
            <p className="text-lg text-white/65 max-w-2xl mx-auto mb-6">
              Was sagen Hundebesitzer wirklich über Futter? Echte Kommentare aus deutschen Foren und Bewertungsportalen —
              verknüpft mit peer-reviewed Studien.
            </p>

            {/* Stats-Leiste */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-white/5 rounded-xl px-4 py-2 flex items-center gap-2">
                <span className="text-white/40">Gesamt</span>
                <span className="font-bold">{allInsights.length} Stimmen</span>
              </div>
              <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-xl px-4 py-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-emerald-300">{posCount} positiv</span>
              </div>
              <div className="bg-red-900/20 border border-red-500/20 rounded-xl px-4 py-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-red-300">{negCount} kritisch</span>
              </div>
              <div className="bg-amber-900/20 border border-amber-500/20 rounded-xl px-4 py-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-amber-300">{gemCount} gemischt</span>
              </div>
              <div className="bg-white/5 rounded-xl px-4 py-2 text-white/50">
                ✓ {verifiedCount} verifiziert
              </div>
            </div>
          </div>
        </section>

        {/* Filter (Client Component) */}
        <section className="max-w-5xl mx-auto px-4 pb-4">
          <MeinungenFilter
            topics={allTopics}
            topicLabels={TOPIC_LABELS}
            activeThema={params.thema}
            activeStimmung={params.stimmung}
          />
        </section>

        {/* Ergebnis-Header */}
        {(params.thema || params.stimmung) && (
          <div className="max-w-5xl mx-auto px-4 pb-4">
            <p className="text-sm text-white/50">
              {filtered.length} von {allInsights.length} Stimmen
              {params.thema && ` · Thema: ${TOPIC_LABELS[params.thema] ?? params.thema}`}
              {params.stimmung && ` · Stimmung: ${SENTIMENT_STYLES[params.stimmung as keyof typeof SENTIMENT_STYLES]?.label ?? params.stimmung}`}
            </p>
          </div>
        )}

        {/* Karten-Grid */}
        <section className="max-w-5xl mx-auto px-4 pb-20">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-white/40">
              <div className="text-4xl mb-3">🔍</div>
              <p>Keine Einträge für diesen Filter.</p>
              <Link href="/meinungen" className="mt-4 inline-block text-sm text-white/60 hover:text-white transition-colors">
                Filter zurücksetzen
              </Link>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {filtered.map((insight) => (
                <div key={insight.id} className="break-inside-avoid">
                  <InsightCard insight={insight} studyMap={studyMap} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Transparenz-Box */}
        <section className="max-w-3xl mx-auto px-4 pb-16">
          <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-3">🕸️ Was ist das Meinungsnetz?</h2>
            <div className="space-y-2 text-sm text-white/55 leading-relaxed">
              <p>
                Alle Zitate stammen aus öffentlichen deutschen Hundefutter-Foren, Bewertungsportalen und Communities
                (dogforum.de, dogorama.app, zooplus.de, haustiere.de). Keine erfundenen Bewertungen, kein Marketing.
              </p>
              <p>
                Jeder Eintrag ist mit passenden Studien aus dem{" "}
                <Link href="/studien" className="text-purple-300 hover:text-purple-200 transition-colors">
                  Wissensuniversum
                </Link>{" "}
                verknüpft — damit du weißt, was die Wissenschaft zu den erlebten Erfahrungen sagt.
              </p>
              <p className="text-white/35 text-xs">
                ✓ Verifiziert bedeutet: URL wurde manuell geprüft und war beim Abrufen öffentlich zugänglich.
                Plattformbetreiber können Inhalte jederzeit entfernen oder ändern.
              </p>
            </div>
          </div>
        </section>

        {/* CTA zu Studien */}
        <section className="max-w-5xl mx-auto px-4 pb-20">
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-2xl p-8 text-center">
            <div className="text-3xl mb-3">🔬</div>
            <h2 className="text-2xl font-bold mb-2">Die Wissenschaft dahinter</h2>
            <p className="text-white/60 mb-5 max-w-lg mx-auto">
              Was steckt hinter den Erfahrungen? 26+ peer-reviewed Studien zur Hundeernährung, verständlich erklärt.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/studien"
                className="inline-flex items-center gap-2 bg-white text-[#0a0f1e] font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors"
              >
                Zum Wissensuniversum 🔬
              </Link>
              <Link
                href="/glossar"
                className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/15 transition-colors"
              >
                Glossar 📚
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
