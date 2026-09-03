import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import ShareButton from "./ShareButton";
import { getBreedImage } from "@/lib/breed-image";
import { getSharedDogProfile, buildCardNumber } from "@/lib/dog-profile";
import { BREED_BY_SLUG } from "@/data/breeds";

const getProfile = getSharedDogProfile;

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

const SUITABILITY_LABELS: { key: "suitabilityFamily" | "suitabilityApartment" | "suitabilityBeginner" | "suitabilityChildren" | "suitabilityDogs"; label: string; icon: string }[] = [
  { key: "suitabilityFamily", label: "Familientauglich", icon: "👨‍👩‍👧" },
  { key: "suitabilityChildren", label: "Kinderfreundlich", icon: "🧒" },
  { key: "suitabilityBeginner", label: "Anfänger-geeignet", icon: "🎓" },
  { key: "suitabilityApartment", label: "Wohnungstauglich", icon: "🏠" },
  { key: "suitabilityDogs", label: "Verträglich mit Hunden", icon: "🐕‍🦺" },
];

function toNum(v: string | number | undefined | null): number | null {
  if (v == null) return null;
  const n = typeof v === "number" ? v : parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

function weightRangeCheck(weightKg: number, min: number, max: number) {
  const span = max - min;
  const lo = min - span * 0.6;
  const hi = max + span * 0.6;
  const pct = Math.min(100, Math.max(0, ((weightKg - lo) / (hi - lo)) * 100));
  const minPct = ((min - lo) / (hi - lo)) * 100;
  const maxPct = ((max - lo) / (hi - lo)) * 100;
  const status: "unter" | "im" | "ueber" =
    weightKg < min ? "unter" : weightKg > max ? "ueber" : "im";
  return { pct, minPct, maxPct, status };
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

  const breed = profile.breed_slug ? BREED_BY_SLUG[profile.breed_slug] : undefined;
  const cardNumber = buildCardNumber(profile.id);
  const issueDate = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })
    : null;

  const suitabilityRows = breed
    ? SUITABILITY_LABELS.filter((s) => toNum(breed[s.key]) != null)
    : [];

  const weightKgNum = toNum(profile.weight_kg);
  const breedMin = breed ? toNum(breed.weightMin) : null;
  const breedMax = breed ? toNum(breed.weightMax) : null;
  const weightCheck =
    weightKgNum != null && breedMin != null && breedMax != null
      ? weightRangeCheck(weightKgNum, breedMin, breedMax)
      : null;

  const achievements = [
    { icon: "📸", label: "Eigenes Foto", done: !!profile.photo_data },
    { icon: "🚫", label: "Allergie-Profi", done: (profile.allergies?.length ?? 0) > 0 },
    { icon: "🩺", label: "Gesundheits-Check", done: !!profile.conditions || (profile.health_flags?.length ?? 0) > 0 },
    { icon: "🍖", label: "Vorlieben bekannt", done: !!profile.food_preferences },
    { icon: "🥣", label: "Futter gefunden", done: !!food },
    { icon: "📦", label: "Vorrat im Blick", done: bagDaysLeft != null },
  ];
  const achievementsDone = achievements.filter((a) => a.done).length;

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

        {/* ── Hundepass / ID-Karte ──────────────────────────────────────────
            Optik wie ein echter Pass: Holo-Rahmen, Kartennummer, Ausstellungsdatum.
            Soll als Screenshot/Share-Bild für sich stehen. */}
        <div className="rounded-[26px] p-[2px] bg-[linear-gradient(135deg,#f0a73c,#ff8a4c,#a855f7,#f0a73c)] shadow-[0_30px_70px_-30px_rgba(240,167,60,0.45)]">
          <div className="rounded-[24px] bg-gradient-to-br from-[#1a1410] via-[#15110f] to-[#1a1410] relative overflow-hidden p-6">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,146,60,0.12),transparent_55%)]" />
            <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-purple-500/10 blur-2xl" />

            {/* Pass-Kopfzeile */}
            <div className="relative flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <span className="text-white font-black text-[10px]">B</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">BELLA Hundepass</span>
              </div>
              <span className="text-[10px] font-mono text-orange-300/70 tracking-wider">{cardNumber}</span>
            </div>

            <div className="relative flex items-center gap-4">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-3xl shadow-lg shadow-orange-500/25 overflow-hidden flex-shrink-0 ring-2 ring-white/10">
                {profile.photo_data ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.photo_data} alt={profile.name} className="w-full h-full object-cover" />
                ) : getBreedImage(profile.breed_slug) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={getBreedImage(profile.breed_slug)!} alt={profile.breed_slug ?? profile.name} className="w-full h-full object-cover" />
                ) : (
                  "🐕"
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-black tracking-tight leading-tight truncate">
                  {profile.name}
                  {profile.gender && <span className="ml-1.5 text-lg">{profile.gender === "m" ? "♂" : "♀"}</span>}
                </h1>
                {profile.breed_slug && (
                  <p className="text-orange-300/80 text-sm capitalize truncate">
                    {profile.breed_slug.replace(/-/g, " ")}
                  </p>
                )}
                <p className="text-white/40 text-xs mt-1">
                  {profile.birth_or_age ? `${profile.birth_or_age} · ` : ""}
                  {profile.weight_kg ? `${profile.weight_kg} kg` : ""}
                </p>
              </div>
            </div>

            <div className="relative flex flex-wrap gap-2 mt-4">
              {profile.activity_level && (
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs">
                  {ACTIVITY_LABELS[profile.activity_level] ?? profile.activity_level}
                </span>
              )}
              {profile.health_flags?.map(f => (
                <span key={f} className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs capitalize">{f}</span>
              ))}
            </div>

            {/* Monatskosten / Tagesbedarf */}
            {(monthlyEuro || dailyG) && (
              <div className="relative mt-5 rounded-2xl bg-black/30 border border-orange-500/20 px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5">
                    {monthlyEuro ? "Futter · Monat" : "Tagesbedarf"}
                  </p>
                  {monthlyEuro ? (
                    <>
                      <p className="text-3xl font-black text-amber-400">~{monthlyEuro.toFixed(0)} €</p>
                      <p className="text-[11px] text-white/35 mt-0.5">{dailyG} g/Tag · {pricePerKg?.toFixed(2)} €/kg</p>
                    </>
                  ) : (
                    <p className="text-3xl font-black text-white">{dailyG} <span className="text-lg text-white/40">g/Tag</span></p>
                  )}
                </div>
                <span className="text-3xl">🥣</span>
              </div>
            )}

            {/* Mikroprint-Fußzeile wie auf einem echten Ausweis */}
            <div className="relative flex items-center justify-between mt-5 pt-3 border-t border-dashed border-white/10">
              <p className="text-[9px] text-white/30 uppercase tracking-wider">
                {issueDate ? `Ausgestellt am ${issueDate}` : "Ausgestellt"} · welches-hundefutter.today
              </p>
              <p className="text-[9px] text-white/30">✓ verifiziert</p>
            </div>
          </div>
        </div>

        {/* ── Achievement-Badges ────────────────────────────────────────── */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Profil-Fortschritt</p>
            <span className="text-xs font-semibold text-amber-400">{achievementsDone}/{achievements.length}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {achievements.map((a) => (
              <div
                key={a.label}
                className={`flex flex-col items-center gap-1 rounded-xl py-2.5 px-1 text-center ${
                  a.done ? "bg-amber-500/10 border border-amber-500/25" : "bg-white/[0.02] border border-white/5"
                }`}
              >
                <span className={`text-lg ${a.done ? "" : "opacity-25"}`}>{a.icon}</span>
                <span className={`text-[10px] leading-tight ${a.done ? "text-white/80" : "text-white/30"}`}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Charakter-Werte (Rasse-Eigenschaften) ────────────────────────── */}
        {suitabilityRows.length > 0 && (
          <div className="card p-5">
            <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-4">
              Charakter-Werte {breed?.name ? `· ${breed.name}` : ""}
            </p>
            <div className="space-y-3">
              {suitabilityRows.map((s) => {
                const val = toNum(breed![s.key]) ?? 0;
                return (
                  <div key={s.key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-white/70">{s.icon} {s.label}</span>
                      <span className="text-[10px] text-white/30">{val}/5</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-full ${i <= val ? "bg-gradient-to-r from-orange-400 to-amber-500" : "bg-white/5"}`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            {breed?.characterTraits && breed.characterTraits.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/5">
                {breed.characterTraits.map((t) => (
                  <span key={t} className="text-[10px] px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 capitalize">{t}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Gewicht-Check vs. Rasse-Normbereich ──────────────────────────── */}
        {weightCheck && weightKgNum != null && (
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Gewicht-Check</p>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                weightCheck.status === "im" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
              }`}>
                {weightCheck.status === "im" ? "im Normbereich" : weightCheck.status === "unter" ? "unter Norm" : "über Norm"}
              </span>
            </div>
            <div className="relative h-2.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="absolute inset-y-0 bg-emerald-500/25"
                style={{ left: `${weightCheck.minPct}%`, width: `${weightCheck.maxPct - weightCheck.minPct}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-400 shadow shadow-amber-400/50 border-2 border-[var(--bg)]"
                style={{ left: `calc(${weightCheck.pct}% - 6px)` }}
              />
            </div>
            <p className="text-[11px] text-white/35 mt-2">
              {profile.name}: {weightKgNum} kg · Normbereich {breed?.name ?? "Rasse"}: {breedMin}–{breedMax} kg
            </p>
          </div>
        )}

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

        {/* ── Vorlieben & Krankheiten ─────────────────────────────────────── */}
        {(profile.food_preferences || profile.conditions) && (
          <div className="card p-5 space-y-3">
            {profile.food_preferences && (
              <div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-1.5">🍖 Vorlieben beim Essen</p>
                <p className="text-sm text-white/80 leading-relaxed">{profile.food_preferences}</p>
              </div>
            )}
            {profile.conditions && (
              <div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-1.5">🩺 Krankheiten & Besonderheiten</p>
                <p className="text-sm text-white/80 leading-relaxed">{profile.conditions}</p>
              </div>
            )}
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
            href="/?ctx=profil#bella-advisor"
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
