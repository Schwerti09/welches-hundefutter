"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import { calcLifecycle, fmtDate, stageLabelDe } from "@/lib/lifecycle";

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
  last_purchase_at: string | null;
  share_enabled: boolean;
}

interface Food {
  name: string;
  brand: string;
  type: string;
  price_per_kg: string | null;
  affiliate_url: string;
}

interface ProfileData {
  profile: Profile;
  food: Food | null;
  shareToken: string;
}

const ACTIVITY_LABELS: Record<string, string> = {
  niedrig: "Ruhig",
  mittel: "Normal aktiv",
  hoch: "Sehr aktiv",
  sehr_hoch: "Arbeitshund",
};

function daysRemaining(lastPurchaseAt: string | null, bagDays: number | null): number | null {
  if (!lastPurchaseAt || !bagDays) return null;
  const due = new Date(lastPurchaseAt);
  due.setDate(due.getDate() + bagDays);
  return Math.round((due.getTime() - Date.now()) / 86_400_000);
}

function ConsumptionMeter({ days, bagDays }: { days: number; bagDays: number }) {
  const pct = Math.max(0, Math.min(100, (days / bagDays) * 100));
  const color = days < 3 ? "bg-red-500" : days < 7 ? "bg-amber-400" : "bg-emerald-500";
  const label = days < 0 ? "Sack leer!" : days === 0 ? "Heute leer" : `noch ${days} Tage`;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-white/70">Sackreichweite</span>
        <span className={`text-sm font-bold ${days < 3 ? "text-red-400" : days < 7 ? "text-amber-400" : "text-emerald-400"}`}>{label}</span>
      </div>
      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function RefillEmailForm({ profileId, foodSlug, foodName, lastPurchaseAt, bagDays }: {
  profileId: string; foodSlug: string | null; foodName: string | null;
  lastPurchaseAt: string | null; bagDays: number | null;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");

  const submit = async () => {
    if (!email || state === "saving") return;
    setState("saving");
    // refillDueAt = lastPurchaseAt + bagDays (0 Uhr des Ablauftages)
    const refillDueAt = lastPurchaseAt && bagDays
      ? new Date(new Date(lastPurchaseAt).getTime() + bagDays * 86_400_000).toISOString()
      : null;
    try {
      const res = await fetch("/api/alerts/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, foodSlug, foodName, mode: "refill", dogProfileId: profileId, refillDueAt }),
      });
      setState(res.ok ? "done" : "error");
    } catch { setState("error"); }
  };

  if (state === "done") return (
    <p className="mt-3 text-xs text-emerald-400">✓ Bestätigungsmail gesendet — bitte kurz bestätigen!</p>
  );

  return (
    <div className="mt-4">
      <p className="text-xs text-[var(--muted)] mb-2">🔔 E-Mail-Erinnerung wenn der Sack knapp wird:</p>
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="deine@email.de"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
        />
        <button
          onClick={submit}
          disabled={!email || state === "saving"}
          className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold disabled:opacity-50 shrink-0"
        >
          {state === "saving" ? "…" : state === "error" ? "Fehler" : "Wecker"}
        </button>
      </div>
    </div>
  );
}

function LastPurchaseInput({ profileId, onUpdate }: { profileId: string; onUpdate: () => void }) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await fetch("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: profileId, lastPurchaseAt: date }),
    });
    setSaving(false);
    onUpdate();
  };

  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1">
        <label className="text-xs text-white/50 mb-1 block">Letzter Kauf</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
        />
      </div>
      <button
        onClick={save}
        disabled={saving}
        className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold disabled:opacity-50"
      >
        {saving ? "…" : "Speichern"}
      </button>
    </div>
  );
}

function LifecycleEmailForm({ profileId, transitionAt, dogName }: {
  profileId: string; transitionAt: Date; dogName: string;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");

  const submit = async () => {
    if (!email || state === "saving") return;
    setState("saving");
    try {
      const res = await fetch("/api/alerts/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email, mode: "lifecycle", dogProfileId: profileId,
          lifecycleDueAt: transitionAt.toISOString(),
          foodName: `Senior-Futter für ${dogName}`,
        }),
      });
      setState(res.ok ? "done" : "error");
    } catch { setState("error"); }
  };

  if (state === "done") return (
    <p className="mt-3 text-xs text-emerald-400">✓ Bestätigungsmail gesendet — bitte kurz bestätigen!</p>
  );

  return (
    <div className="mt-4">
      <p className="text-xs text-[var(--muted)] mb-2">🔔 Erinnere mich rechtzeitig vor der Senior-Phase:</p>
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="deine@email.de"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
        />
        <button
          onClick={submit}
          disabled={!email || state === "saving"}
          className="px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold disabled:opacity-50 shrink-0"
        >
          {state === "saving" ? "…" : state === "error" ? "Fehler" : "Wecker"}
        </button>
      </div>
    </div>
  );
}

function LifecycleCard({ profile }: { profile: { id: string; name: string; birth_or_age: string | null; weight_kg: string | null } }) {
  const lc = calcLifecycle(profile.birth_or_age, profile.weight_kg);
  const stageLabel = stageLabelDe(lc.stage);

  if (!profile.birth_or_age) return null;

  if (lc.stage === "senior") {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🐾</span>
          <h2 className="font-bold text-lg">Lebensphase: Senior</h2>
          <span className="ml-auto text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-medium">SENIOR</span>
        </div>
        <p className="text-sm text-[var(--muted)] mb-3">
          {profile.name} ist in der Senior-Phase — jetzt zahlt sich gelenk-schonendes Futter mit Omega-3 und reduziertem Phosphor aus.
        </p>
        <div className="flex flex-col gap-2">
          <Link href="/#bella-advisor" className="text-xs text-[var(--honey)] hover:underline">
            Senior-Futter von BELLA empfehlen lassen →
          </Link>
          <Link href="/versicherung" className="text-xs text-amber-400 hover:underline">
            🛡️ Noch keine Versicherung? Jetzt informieren →
          </Link>
        </div>
      </div>
    );
  }

  if (!lc.nextStageAt) return null;

  const isImminentSenior = lc.nextStage === "senior" && lc.daysUntilTransition !== null && lc.daysUntilTransition <= 180;

  return (
    <div className={`card p-6 ${isImminentSenior ? "ring-2 ring-amber-500/40" : ""}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🗓</span>
        <h2 className="font-bold text-lg">Lebensphase</h2>
        <span className="ml-auto text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full">{stageLabel}</span>
      </div>

      <div className="p-4 rounded-xl bg-white/5 mb-4">
        <p className="text-xs text-[var(--muted)] mb-1">Nächster Meilenstein</p>
        <p className="font-semibold text-white">{lc.nextStageName}</p>
        <p className="text-sm text-[var(--honey)] mt-0.5">
          ca. {fmtDate(lc.nextStageAt)}
          {lc.daysUntilTransition !== null && (
            <span className="text-[var(--muted)] ml-2">(noch {lc.daysUntilTransition} Tage)</span>
          )}
        </p>
      </div>

      {lc.nextStage === "senior" && (
        <p className="text-xs text-[var(--muted)] mb-3">
          Ab dem {lc.nextStageName ? lc.nextStageName.replace("-Hund", "") : "Senior"} empfiehlt sich
          ein Wechsel auf gelenk-schonendes Futter mit höherem Omega-3-Anteil — BELLA erinnert dich rechtzeitig.
        </p>
      )}

      <LifecycleEmailForm
        profileId={profile.id}
        transitionAt={lc.nextStageAt}
        dogName={profile.name}
      />
    </div>
  );
}

export default function MeinHundPage() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [noProfile, setNoProfile] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const load = async () => {
    setLoading(true);
    const token = localStorage.getItem("bella_share_token");
    const profileId = localStorage.getItem("bella_profile_id");

    if (!token && !profileId) {
      setNoProfile(true);
      setLoading(false);
      return;
    }

    try {
      const url = token
        ? `/api/profiles?token=${token}&full=1`
        : `/api/profiles?id=${profileId}&full=1`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("not found");
      const json = await res.json();
      setData({ ...json, shareToken: token ?? "" });
    } catch {
      setNoProfile(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [refreshKey]);

  const days = data ? daysRemaining(data.profile.last_purchase_at, data.profile.est_bag_days) : null;

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">

      <main className="flex-1 max-w-2xl mx-auto px-5 py-12 w-full">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
          </div>
        ) : noProfile ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-6">🐕</div>
            <h1 className="text-2xl font-black mb-3">Noch kein Hunde-Profil</h1>
            <p className="text-[var(--muted)] mb-8 max-w-md mx-auto">
              Lass BELLA ein Profil für deinen Hund anlegen — sie braucht nur Rasse, Alter und Gewicht.
            </p>
            <Link
              href="/#bella-advisor"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
            >
              🐾 BELLA fragen
            </Link>
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center mx-auto mb-4 text-3xl">
                🐕
              </div>
              <h1 className="text-3xl font-black mb-1">{data.profile.name}</h1>
              {data.profile.breed_slug && (
                <p className="text-[var(--muted)] capitalize">{data.profile.breed_slug.replace(/-/g, " ")}</p>
              )}
              <div className="flex flex-wrap gap-2 justify-center mt-3">
                {data.profile.weight_kg && (
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-sm">{parseFloat(data.profile.weight_kg)} kg</span>
                )}
                {data.profile.activity_level && (
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-sm">
                    {ACTIVITY_LABELS[data.profile.activity_level] ?? data.profile.activity_level}
                  </span>
                )}
                {data.profile.birth_or_age && (
                  <span className="px-3 py-1 rounded-full bg-orange-500/15 text-orange-300 text-sm">{data.profile.birth_or_age}</span>
                )}
              </div>
            </div>

            {/* Nachschub-Wecker — das Herzstück */}
            {data.profile.est_daily_grams && (
              <div className={`card p-6 ${days !== null && days < 7 ? "ring-2 ring-amber-500/50" : ""}`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">⏰</span>
                  <h2 className="font-bold text-lg">Nachschub-Wecker</h2>
                  {days !== null && days < 3 && (
                    <span className="ml-auto text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full animate-pulse font-medium">BALD LEER</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="text-center p-3 rounded-xl bg-white/5">
                    <p className="text-2xl font-black text-[var(--honey)]">{data.profile.est_daily_grams} g</p>
                    <p className="text-xs text-[var(--muted)] mt-1">Tagesration</p>
                  </div>
                  {data.profile.est_bag_days && (
                    <div className="text-center p-3 rounded-xl bg-white/5">
                      <p className="text-2xl font-black text-emerald-400">{data.profile.est_bag_days} Tage</p>
                      <p className="text-xs text-[var(--muted)] mt-1">hält ein Sack</p>
                    </div>
                  )}
                </div>

                {days !== null && data.profile.est_bag_days ? (
                  <div className="mb-4">
                    <ConsumptionMeter days={days} bagDays={data.profile.est_bag_days} />
                  </div>
                ) : null}

                <LastPurchaseInput
                  profileId={data.profile.id}
                  onUpdate={() => setRefreshKey(k => k + 1)}
                />

                <RefillEmailForm
                  profileId={data.profile.id}
                  foodSlug={data.profile.current_food_slug}
                  foodName={data.food?.name ?? null}
                  lastPurchaseAt={data.profile.last_purchase_at}
                  bagDays={data.profile.est_bag_days}
                />

                {days !== null && days <= 5 && data.food && (
                  <div className="mt-4 p-3 rounded-xl bg-orange-500/10 border border-orange-500/25">
                    <p className="text-xs text-orange-300 font-semibold mb-1">🛒 Jetzt nachbestellen?</p>
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm text-white font-medium">{data.food.brand} · {data.food.name}</p>
                        {data.food.price_per_kg && (
                          <p className="text-xs text-[var(--muted)]">{parseFloat(data.food.price_per_kg).toFixed(2)} €/kg</p>
                        )}
                      </div>
                      <a
                        href={data.food.affiliate_url}
                        target="_blank"
                        rel="sponsored nofollow noopener noreferrer"
                        className="shrink-0 px-3 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-semibold"
                      >
                        Bestellen →
                      </a>
                    </div>
                  </div>
                )}

                <p className="text-[11px] text-[var(--muted)] mt-3">
                  Orientierungswert (RER-Formel). Exakte Menge je nach Kondition und Futter.
                </p>
              </div>
            )}

            {/* Lebensphasen-Trigger — Stufe 4 */}
            <LifecycleCard profile={data.profile} />

            {/* Aktuelles Futter */}
            {data.food && (
              <div className="card p-6">
                <h2 className="font-bold text-lg mb-4">Aktuelles Futter</h2>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{data.food.brand}</p>
                    <p className="text-sm text-[var(--muted)]">{data.food.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-[var(--muted)] capitalize mt-1 inline-block">{data.food.type}</span>
                  </div>
                  <div className="text-right shrink-0">
                    {data.food.price_per_kg && (
                      <p className="text-xl font-black text-[var(--honey)]">{parseFloat(data.food.price_per_kg).toFixed(2)} €/kg</p>
                    )}
                    <a
                      href={data.food.affiliate_url}
                      target="_blank"
                      rel="sponsored nofollow noopener noreferrer"
                      className="text-xs px-3 py-1.5 rounded-lg btn-primary mt-1 inline-block"
                    >
                      Zum Angebot →
                    </a>
                  </div>
                </div>
                <Link
                  href="/#bella-advisor"
                  className="text-xs text-[var(--honey)] hover:underline mt-3 inline-block"
                >
                  Anderes Futter ausprobieren? BELLA fragen →
                </Link>
              </div>
            )}

            {/* Allergien */}
            {((data.profile.allergies?.length ?? 0) > 0 || (data.profile.health_flags?.length ?? 0) > 0) && (
              <div className="card p-6">
                <h2 className="font-bold text-lg mb-4">Gesundheit & Unverträglichkeiten</h2>
                {(data.profile.allergies?.length ?? 0) > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-[var(--muted)] mb-2 uppercase tracking-wide">Allergene vermeiden</p>
                    <div className="flex flex-wrap gap-2">
                      {data.profile.allergies!.map(a => (
                        <span key={a} className="px-2.5 py-1 rounded-lg bg-red-500/15 text-red-300 text-sm capitalize">{a}</span>
                      ))}
                    </div>
                  </div>
                )}
                {(data.profile.health_flags?.length ?? 0) > 0 && (
                  <div>
                    <p className="text-xs text-[var(--muted)] mb-2 uppercase tracking-wide">Gesundheitshinweise</p>
                    <div className="flex flex-wrap gap-2">
                      {data.profile.health_flags!.map(h => (
                        <span key={h} className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 text-sm capitalize">{h}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Steckbrief teilen */}
            {data.shareToken && (
              <div className="card p-6">
                <h2 className="font-bold text-lg mb-2">Steckbrief teilen</h2>
                <p className="text-sm text-[var(--muted)] mb-4">
                  Teile {data.profile.name}s Futterprofil mit anderen Hundehaltern oder deinem Tierarzt.
                </p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={`https://welches-hundefutter.today/hund/${data.shareToken}`}
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(`https://welches-hundefutter.today/hund/${data.shareToken}`)}
                    className="px-3 py-2 rounded-xl bg-white/10 text-white/70 text-xs hover:bg-white/20 transition-colors shrink-0"
                  >
                    Kopieren
                  </button>
                </div>
                <Link
                  href={`/hund/${data.shareToken}`}
                  target="_blank"
                  className="text-xs text-[var(--honey)] hover:underline mt-2 inline-block"
                >
                  Steckbrief ansehen →
                </Link>
              </div>
            )}

            {/* CTA: Neues Futter */}
            <div className="rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 p-6 text-center">
              <p className="font-bold text-lg mb-2">Futter wechseln?</p>
              <p className="text-[var(--muted)] text-sm mb-4">
                BELLA findet aus 11.000+ Sorten neue Alternativen für {data.profile.name}.
              </p>
              <Link
                href="/#bella-advisor"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all text-sm"
              >
                🐕 BELLA fragen
              </Link>
            </div>
          </div>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
