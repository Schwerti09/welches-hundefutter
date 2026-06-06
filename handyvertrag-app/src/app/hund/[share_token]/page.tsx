import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { neon } from "@neondatabase/serverless";
import SiteFooter from "@/components/SiteFooter";

interface Profile {
  id: string;
  name: string;
  breed_slug: string | null;
  birth_or_age: string | null;
  weight_kg: string | null;
  activity_level: string | null;
  allergies: string[] | null;
  health_flags: string[] | null;
  current_food_slug: string | null;
  est_daily_grams: number | null;
  est_bag_days: number | null;
}

interface Food {
  name: string;
  brand: string;
  type: string;
  price_per_kg: string | null;
  affiliate_url: string;
  is_grain_free: boolean;
}

async function getProfile(token: string): Promise<{ profile: Profile; food: Food | null } | null> {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  try {
    const sql = neon(url);
    const rows = await sql`
      SELECT id, name, breed_slug, birth_or_age, weight_kg, activity_level,
             allergies, health_flags, current_food_slug, est_daily_grams, est_bag_days
      FROM dog_profiles
      WHERE share_token = ${token} AND share_enabled = true
      LIMIT 1`;
    if (!rows[0]) return null;
    const profile = rows[0] as unknown as Profile;

    let food: Food | null = null;
    if (profile.current_food_slug) {
      const f = await sql`
        SELECT name, brand, type, price_per_kg, affiliate_url, is_grain_free
        FROM dog_foods WHERE slug = ${profile.current_food_slug} AND is_active = true LIMIT 1`;
      food = (f[0] as unknown as Food) ?? null;
    }
    return { profile, food };
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: { share_token: string } }): Promise<Metadata> {
  const data = await getProfile(params.share_token);
  if (!data) return { title: "Profil nicht gefunden | BELLA" };
  return {
    title: `${data.profile.name}s Futterprofil | BELLA – Hundefutter-Beraterin`,
    description: `Das Futterprofil von ${data.profile.name}${data.profile.breed_slug ? ` (${data.profile.breed_slug})` : ""} — erstellt mit BELLA, der KI-Hundefutterberaterin.`,
    robots: { index: false, follow: false },
  };
}

const ACTIVITY_LABELS: Record<string, string> = {
  niedrig: "Ruhig (Couch-Hund)",
  mittel: "Normal aktiv",
  hoch: "Sehr aktiv",
  sehr_hoch: "Arbeitshund / Sport",
};

export default async function HundSteckbriefPage({ params }: { params: { share_token: string } }) {
  const data = await getProfile(params.share_token);
  if (!data) notFound();

  const { profile, food } = data;

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <header className="border-b border-white/5 px-5 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">B</span>
            </div>
            <span className="font-bold text-sm">welches-hundefutter<span className="text-orange-400">.today</span></span>
          </Link>
          <span className="text-xs text-[var(--muted)]">Futter-Steckbrief</span>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-5 py-12 w-full">
        {/* Hunde-Karte */}
        <div className="card p-8 mb-8 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center mx-auto mb-4 text-3xl">
            🐕
          </div>
          <h1 className="text-3xl font-black mb-1">{profile.name}</h1>
          {profile.breed_slug && (
            <p className="text-[var(--muted)] capitalize mb-4">{profile.breed_slug.replace(/-/g, " ")}</p>
          )}
          <div className="flex flex-wrap gap-2 justify-center">
            {profile.birth_or_age && (
              <span className="px-3 py-1 rounded-full bg-orange-500/15 text-orange-300 text-sm">{profile.birth_or_age}</span>
            )}
            {profile.weight_kg && (
              <span className="px-3 py-1 rounded-full bg-white/10 text-[var(--muted)] text-sm">{profile.weight_kg} kg</span>
            )}
            {profile.activity_level && (
              <span className="px-3 py-1 rounded-full bg-white/10 text-[var(--muted)] text-sm">
                {ACTIVITY_LABELS[profile.activity_level] ?? profile.activity_level}
              </span>
            )}
          </div>
        </div>

        {/* Allergien & Gesundheit */}
        {((profile.allergies?.length ?? 0) > 0 || (profile.health_flags?.length ?? 0) > 0) && (
          <div className="card p-6 mb-6">
            <h2 className="font-bold text-lg mb-4">Gesundheit & Unverträglichkeiten</h2>
            {(profile.allergies?.length ?? 0) > 0 && (
              <div className="mb-3">
                <p className="text-xs text-[var(--muted)] mb-2 uppercase tracking-wide">Allergene vermeiden</p>
                <div className="flex flex-wrap gap-2">
                  {profile.allergies!.map((a) => (
                    <span key={a} className="px-2.5 py-1 rounded-lg bg-red-500/15 text-red-300 text-sm capitalize">{a}</span>
                  ))}
                </div>
              </div>
            )}
            {(profile.health_flags?.length ?? 0) > 0 && (
              <div>
                <p className="text-xs text-[var(--muted)] mb-2 uppercase tracking-wide">Gesundheitshinweise</p>
                <div className="flex flex-wrap gap-2">
                  {profile.health_flags!.map((h) => (
                    <span key={h} className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 text-sm capitalize">{h}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Verbrauchsmathematik */}
        {profile.est_daily_grams && (
          <div className="card p-6 mb-6">
            <h2 className="font-bold text-lg mb-4">Tagesbedarf (Orientierungswert)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-black text-[var(--honey)]">{profile.est_daily_grams} g</p>
                <p className="text-xs text-[var(--muted)] mt-1">Trockenfutter / Tag</p>
              </div>
              {profile.est_bag_days ? (
                <div className="text-center">
                  <p className="text-2xl font-black text-emerald-400">{profile.est_bag_days} Tage</p>
                  <p className="text-xs text-[var(--muted)] mt-1">hält der aktuelle Sack</p>
                </div>
              ) : null}
            </div>
            <p className="text-xs text-[var(--muted)] mt-4 leading-relaxed">
              Orientierungswert (RER-Formel). Abweichungen je nach Kondition und Futter. Mit dem Tierarzt abstimmen.
            </p>
          </div>
        )}

        {/* Aktuelles Futter */}
        {food && (
          <div className="card p-6 mb-8">
            <h2 className="font-bold text-lg mb-4">Aktuelles Futter</h2>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-[var(--ink)]">{food.brand}</p>
                <p className="text-sm text-[var(--muted)]">{food.name}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-[var(--muted)] capitalize">{food.type}</span>
                  {food.is_grain_free && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300">getreidefrei</span>}
                </div>
              </div>
              <div className="text-right shrink-0">
                {food.price_per_kg && (
                  <p className="text-lg font-black text-[var(--honey)]">{parseFloat(food.price_per_kg).toFixed(2)} €/kg</p>
                )}
                <a
                  href={food.affiliate_url}
                  target="_blank"
                  rel="sponsored nofollow noopener noreferrer"
                  className="text-xs px-3 py-1.5 rounded-lg btn-primary mt-1 inline-block"
                >
                  Zum Angebot →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* BELLA CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 p-6 text-center">
          <p className="font-bold text-lg mb-2">Eigenes Futterprofil erstellen?</p>
          <p className="text-[var(--muted)] text-sm mb-4">
            BELLA fragt 5 Dinge über deinen Hund und findet das passende Futter aus 8.000+ Sorten.
          </p>
          <Link
            href="/#bella-advisor"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all text-sm"
          >
            🐕 BELLA fragen — kostenlos
          </Link>
        </div>

        <p className="text-xs text-[var(--muted)] mt-6 text-center">
          Dieser Steckbrief wurde vom Hundehalter freiwillig geteilt.
          Keine personenbezogenen Daten außer den oben angezeigten. · <Link href="/datenschutz" className="underline">Datenschutz</Link>
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
