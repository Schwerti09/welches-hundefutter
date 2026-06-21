import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { neon } from "@neondatabase/serverless";
import SiteFooter from "@/components/SiteFooter";
import ShareButton from "./ShareButton";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  image_url: string | null;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

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
        SELECT name, brand, type, price_per_kg, affiliate_url, is_grain_free, image_url
        FROM dog_foods WHERE slug = ${profile.current_food_slug} AND is_active = true LIMIT 1`;
      food = (f[0] as unknown as Food) ?? null;
    }
    return { profile, food };
  } catch { return null; }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ share_token: string }> }): Promise<Metadata> {
  const { share_token } = await params;
  const data = await getProfile(share_token);
  if (!data) return { title: "Profil nicht gefunden | BELLA" };
  const { profile, food } = data;
  const costStr = food?.price_per_kg && profile.est_daily_grams
    ? ` · ~${((profile.est_daily_grams / 1000) * 30 * parseFloat(food.price_per_kg)).toFixed(0)} €/Monat`
    : "";
  return {
    title: `${profile.name}s Futter-Steckbrief | BELLA`,
    description: `${profile.name}${profile.breed_slug ? ` (${profile.breed_slug.replace(/-/g, " ")})` : ""} · ${profile.est_daily_grams ?? "?"}g/Tag${costStr} — erstellt mit BELLA, der KI-Hundefutterberaterin.`,
    openGraph: {
      title: `${profile.name}s Futter-Steckbrief`,
      description: `${profile.est_daily_grams ?? "?"}g Trockenfutter pro Tag${costStr}. Erstellt mit BELLA.`,
      type: "website",
    },
    robots: { index: false, follow: false },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ACTIVITY_LABELS: Record<string, string> = {
  niedrig: "Couch-Hund",
  mittel: "Normal aktiv",
  hoch: "Sehr aktiv",
  sehr_hoch: "Arbeitshund",
};

function bagProgressPercent(bagDays: number): number {
  // Visual: zeige Sack als "gerade gekauft" → voller Balken; 30 Tage Skala
  const scale = Math.max(bagDays, 7);
  return Math.min(100, Math.round((bagDays / scale) * 100));
}

function bagColor(days: number): string {
  if (days <= 5) return "bg-red-500";
  if (days <= 14) return "bg-amber-500";
  return "bg-emerald-500";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HundSteckbriefPage({ params }: { params: Promise<{ share_token: string }> }) {
  const { share_token } = await params;
  const data = await getProfile(share_token);
  if (!data) notFound();

  const { profile, food } = data;

  const pricePerKg = food?.price_per_kg ? parseFloat(food.price_per_kg) : null;
  const dailyG = profile.est_daily_grams;
  const monthlyEuro = dailyG && pricePerKg
    ? parseFloat(((dailyG / 1000) * 30 * pricePerKg).toFixed(2))
    : null;
  const bagDaysLeft = profile.est_bag_days;
  const shareUrl = `https://welches-hundefutter.today/hund/${share_token}`;

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col bg-[var(--bg)]">
      {/* Top Nav */}
      <header className="border-b border-white/5 px-5 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">B</span>
            </div>
            <span className="font-bold text-sm">welches-hundefutter<span className="text-orange-400">.today</span></span>
          </Link>
          <ShareButton url={shareUrl} name={profile.name} />
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto px-4 py-10 w-full space-y-4">

        {/* ── Hero-Karte ─────────────────────────────────────────────────── */}
        <div className="rounded-3xl bg-gradient-to-br from-orange-900/40 via-amber-900/20 to-orange-900/30 border border-orange-500/30 p-7 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,146,60,0.08),transparent_60%)]" />
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg shadow-orange-500/25">
              🐕
            </div>
            <h1 className="text-3xl font-black mb-1 tracking-tight">{profile.name}</h1>
            {profile.breed_slug && (
              <p className="text-orange-300/80 text-sm capitalize mb-5">
                {profile.breed_slug.replace(/-/g, " ")}
              </p>
            )}
            <div className="flex flex-wrap gap-2 justify-center mb-5">
              {profile.weight_kg && (
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-sm font-medium">
                  {profile.weight_kg} kg
                </span>
              )}
              {profile.activity_level && (
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-sm">
                  {ACTIVITY_LABELS[profile.activity_level] ?? profile.activity_level}
                </span>
              )}
              {profile.health_flags?.map(f => (
                <span key={f} className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-sm capitalize">{f}</span>
              ))}
            </div>

            {/* Monatskosten-Highlight */}
            {monthlyEuro && (
              <div className="inline-block rounded-2xl bg-black/30 border border-orange-500/30 px-5 py-3">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5">Futter · Monat</p>
                <p className="text-4xl font-black text-amber-400">~{monthlyEuro.toFixed(0)} €</p>
                <p className="text-[11px] text-white/35 mt-0.5">
                  {dailyG} g/Tag · {pricePerKg?.toFixed(2)} €/kg
                </p>
              </div>
            )}
            {!monthlyEuro && dailyG && (
              <div className="inline-block rounded-2xl bg-black/30 border border-white/10 px-5 py-3">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5">Tagesbedarf</p>
                <p className="text-4xl font-black text-white">{dailyG} <span className="text-xl text-white/40">g</span></p>
                <p className="text-[11px] text-white/35 mt-0.5">Trockenfutter · Orientierungswert</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Sack-Countdown ─────────────────────────────────────────────── */}
        {bagDaysLeft != null && bagDaysLeft > 0 && (
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold">Sack-Vorrat</p>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                bagDaysLeft <= 5 ? "bg-red-500/20 text-red-300" :
                bagDaysLeft <= 14 ? "bg-amber-500/20 text-amber-300" :
                "bg-emerald-500/20 text-emerald-300"
              }`}>
                noch {bagDaysLeft} Tage
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${bagColor(bagDaysLeft)}`}
                style={{ width: `${bagProgressPercent(bagDaysLeft)}%` }}
              />
            </div>
            <p className="text-[11px] text-white/35 mt-2">
              Basierend auf {dailyG}g/Tag. Abweichungen je nach Hund möglich.
            </p>
          </div>
        )}

        {/* ── Allergien ──────────────────────────────────────────────────── */}
        {(profile.allergies?.length ?? 0) > 0 && (
          <div className="card p-5">
            <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-3">Allergene vermeiden</p>
            <div className="flex flex-wrap gap-2">
              {profile.allergies!.map((a) => (
                <span key={a} className="px-3 py-1 rounded-lg bg-red-500/15 text-red-300 text-sm capitalize font-medium">
                  🚫 {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Aktuelles Futter ───────────────────────────────────────────── */}
        {food && (
          <div className="card p-5">
            <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-3">Empfohlenes Futter</p>
            <div className="flex items-center gap-4">
              {food.image_url ? (
                <img src={food.image_url} alt={food.name} className="w-16 h-16 object-contain rounded-xl bg-white/5 flex-shrink-0" loading="lazy" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 text-2xl">🥣</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm leading-tight">{food.name}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">{food.brand}</p>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(240,167,60,0.14)] text-[#ffcd8a] capitalize">{food.type}</span>
                  {food.is_grain_free && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300">getreidefrei</span>
                  )}
                  {pricePerKg && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                      {pricePerKg.toFixed(2)} €/kg
                    </span>
                  )}
                </div>
              </div>
              <a
                href={food.affiliate_url}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="flex-shrink-0 text-xs px-3 py-2 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-400 transition-colors"
              >
                Kaufen →
              </a>
            </div>
          </div>
        )}

        {/* ── Kosten-Übersicht ───────────────────────────────────────────── */}
        {monthlyEuro && dailyG && pricePerKg && (
          <div className="card p-5">
            <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-4">Kosten-Übersicht</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xl font-black text-white">{dailyG}<span className="text-sm font-normal text-white/40"> g</span></p>
                <p className="text-[10px] text-white/40 mt-0.5">pro Tag</p>
              </div>
              <div>
                <p className="text-xl font-black text-amber-400">~{(monthlyEuro / 4.3).toFixed(2)} <span className="text-sm font-normal text-white/40">€</span></p>
                <p className="text-[10px] text-white/40 mt-0.5">pro Woche</p>
              </div>
              <div>
                <p className="text-xl font-black text-amber-400">~{monthlyEuro.toFixed(0)} <span className="text-sm font-normal text-white/40">€</span></p>
                <p className="text-[10px] text-white/40 mt-0.5">pro Monat</p>
              </div>
            </div>
            <p className="text-[10px] text-white/25 mt-3 text-center">Orientierungswert · Abweichungen je nach Hund / Tierarzt abstimmen</p>
          </div>
        )}

        {/* ── Nachschub-Wecker CTA ───────────────────────────────────────── */}
        <div className="rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 p-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">⏰</span>
            <div>
              <p className="font-bold text-sm mb-1">Nachschub-Wecker für {profile.name}</p>
              <p className="text-xs text-white/50 mb-3">
                BELLA erinnert dich, wenn {profile.name}s Futter zur Neige geht — und wenn der Preis gerade stimmt.
              </p>
              <Link
                href="/mein-hund"
                className="text-xs px-4 py-2 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-400 transition-colors inline-block"
              >
                Wecker einrichten →
              </Link>
            </div>
          </div>
        </div>

        {/* ── Eigenes Profil CTA ─────────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-center">
          <p className="font-bold text-sm mb-1">Eigenes Futterprofil erstellen?</p>
          <p className="text-xs text-white/40 mb-3">
            BELLA fragt 5 Dinge über deinen Hund und findet das passende Futter aus 11.000+ Sorten.
          </p>
          <Link
            href="/#bella-advisor"
            className="text-xs px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all inline-block"
          >
            🐕 BELLA fragen — kostenlos
          </Link>
        </div>

        <p className="text-[10px] text-white/25 text-center pb-4">
          Vom Hundehalter freiwillig geteilt · keine weiteren personenbezogenen Daten ·{" "}
          <Link href="/datenschutz" className="underline">Datenschutz</Link>
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
