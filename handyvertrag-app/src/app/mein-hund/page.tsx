"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import { calcLifecycle, fmtDate, stageLabelDe } from "@/lib/lifecycle";
import { getBreedImage } from "@/lib/breed-image";
import { getVoucherForUrl, PARTNER_VOUCHERS } from "@/data/partners";

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
  gender: string | null;
  photo_data: string | null;
  food_preferences: string | null;
  conditions: string | null;
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

function RecoveryForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async () => {
    if (!email || state === "sending") return;
    setState("sending");
    try {
      await fetch("/api/auth/magic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState("sent");
    } catch {
      setState("error");
    }
  };

  if (state === "sent") return (
    <p className="text-sm text-emerald-400 mt-2">✓ Falls ein Profil für diese E-Mail existiert, schicken wir dir gleich den Link.</p>
  );

  return (
    <div className="mt-8 pt-8 border-t border-white/10">
      <p className="text-sm text-[var(--muted)] mb-3">Schon ein Profil auf einem anderen Gerät erstellt?</p>
      <div className="flex gap-2 max-w-sm mx-auto">
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
          disabled={!email || state === "sending"}
          className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-semibold disabled:opacity-50 shrink-0 hover:bg-white/15 transition-colors"
        >
          {state === "sending" ? "…" : "Link senden"}
        </button>
      </div>
      {state === "error" && <p className="text-xs text-red-400 mt-2">Fehler — bitte nochmal versuchen.</p>}
    </div>
  );
}

async function compressToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const size = 200;
      const canvas = document.createElement("canvas");
      const scale = Math.min(size / img.width, size / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export default function MeinHundPage() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [noProfile, setNoProfile] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savingField, setSavingField] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);

    // Check URL for ?restore=[share_token] (magic link from email)
    const params = new URLSearchParams(window.location.search);
    const restoreToken = params.get("restore");
    if (restoreToken) {
      localStorage.setItem("bella_share_token", restoreToken);
      // Clean URL without reload
      window.history.replaceState({}, "", "/mein-hund");
    }

    const token = restoreToken || localStorage.getItem("bella_share_token");
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

  const saveField = async (fields: Record<string, string | null>) => {
    if (!data) return;
    const key = Object.keys(fields)[0];
    setSavingField(key);
    await fetch("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: data.profile.id, ...fields }),
    });
    setSavingField(null);
    setRefreshKey(k => k + 1);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const photoData = await compressToBase64(file);
    await saveField({ photoData });
  };

  const handleNameSave = async () => {
    if (!nameInput.trim()) return;
    await saveField({ name: nameInput.trim() });
    setEditingName(false);
  };

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">

      <main className="flex-1 max-w-2xl mx-auto px-5 py-12 w-full">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
          </div>
        ) : noProfile ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-6">🐕</div>
            <h1 className="text-2xl font-black mb-3">Noch kein Hunde-Profil</h1>
            <p className="text-[var(--muted)] mb-8 max-w-md mx-auto">
              Lass BELLA ein Profil für deinen Hund anlegen — sie braucht nur Rasse, Alter und Gewicht.
            </p>
            <Link
              href="/?ctx=profil#bella-advisor"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
            >
              🐾 Profil jetzt anlegen
            </Link>
            <RecoveryForm />
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* Header — Foto, Name, Geschlecht */}
            <div className="text-center">
              {/* Foto-Upload */}
              <label className="relative inline-block cursor-pointer group mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center mx-auto text-3xl ring-2 ring-white/10 group-hover:ring-orange-500/50 transition-all">
                  {data.profile.photo_data ? (
                    <img src={data.profile.photo_data} alt={data.profile.name} className="w-full h-full object-cover" />
                  ) : getBreedImage(data.profile.breed_slug) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={getBreedImage(data.profile.breed_slug)!} alt={data.profile.breed_slug ?? data.profile.name} className="w-full h-full object-cover" />
                  ) : (
                    "🐕"
                  )}
                </div>
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-semibold">📷 Foto</span>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                {savingField === "photoData" && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
                    <div className="w-5 h-5 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                  </div>
                )}
              </label>

              {/* Editierbarer Name */}
              {editingName ? (
                <div className="flex items-center justify-center gap-2 mb-1">
                  <input
                    autoFocus
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleNameSave(); if (e.key === "Escape") setEditingName(false); }}
                    className="text-2xl font-black bg-transparent border-b-2 border-orange-500 text-white text-center focus:outline-none w-40"
                  />
                  <button onClick={handleNameSave} disabled={savingField === "name"} className="text-orange-400 text-sm font-semibold hover:text-orange-300">
                    {savingField === "name" ? "…" : "✓"}
                  </button>
                  <button onClick={() => setEditingName(false)} className="text-white/40 text-sm">✕</button>
                </div>
              ) : (
                <button
                  onClick={() => { setNameInput(data.profile.name); setEditingName(true); }}
                  className="group flex items-center gap-2 mx-auto mb-1"
                >
                  <h1 className="text-3xl font-black">{data.profile.name}</h1>
                  <span className="text-white/30 group-hover:text-orange-400 transition-colors text-base">✏️</span>
                </button>
              )}

              {data.profile.breed_slug && (
                <p className="text-[var(--muted)] capitalize mb-3">{data.profile.breed_slug.replace(/-/g, " ")}</p>
              )}

              {/* Geschlecht-Toggle */}
              <div className="flex items-center justify-center gap-2 mb-3">
                {(["m", "f"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => saveField({ gender: data.profile.gender === g ? null : g })}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                      data.profile.gender === g
                        ? g === "m" ? "bg-blue-500/25 border-blue-400/50 text-blue-300" : "bg-rose-500/25 border-rose-400/50 text-rose-300"
                        : "bg-white/5 border-white/10 text-white/40 hover:text-white/70"
                    }`}
                  >
                    {g === "m" ? "♂ Rüde" : "♀ Hündin"}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
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

            <VoucherTip currentFoodUrl={data.food?.affiliate_url} />

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

            {/* Vorlieben & Krankheiten — Freitext, macht den Steckbrief erst wirklich nützlich */}
            <div className="card p-6 space-y-5">
              <h2 className="font-bold text-lg">Mehr Details für einen echten Steckbrief</h2>
              <EditableTextField
                label="🍖 Vorlieben beim Essen"
                placeholder="z.B. mag kein Huhn, liebt alles mit Lachs, frisst nur langsam aus dem Schlecknapf …"
                value={data.profile.food_preferences}
                onSave={(v) => saveField({ foodPreferences: v })}
                saving={savingField === "foodPreferences"}
              />
              <EditableTextField
                label="🩺 Krankheiten & Besonderheiten"
                placeholder="z.B. leichte Hüftdysplasie seit 2024, nimmt täglich Glucosamin …"
                value={data.profile.conditions}
                onSave={(v) => saveField({ conditions: v })}
                saving={savingField === "conditions"}
              />
              <p className="text-[11px] text-white/30">
                Sichtbar für alle, die den Steckbrief-Link bekommen (z.B. dein Tierarzt) — keine
                medizinische Beratung, nur deine eigenen Notizen.
              </p>
            </div>

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

function VoucherTip({ currentFoodUrl }: { currentFoodUrl: string | undefined }) {
  const matched = getVoucherForUrl(currentFoodUrl);
  const fallback = PARTNER_VOUCHERS.filter((v) => v.code).slice(0, 2);
  const show = matched ? [matched] : fallback;
  if (show.length === 0) return null;

  return (
    <div className="card p-6">
      <h2 className="font-bold text-lg mb-1 flex items-center gap-2">
        💡 {matched ? `Gutschein für ${matched.shopName}` : "Tipp: aktive Gutscheine"}
      </h2>
      <p className="text-xs text-[var(--muted)] mb-4">
        {matched ? "Passt zu deinem aktuellen Futter-Shop." : "Gilt nicht direkt für dein Futter, aber lohnt sich vielleicht."}
      </p>
      <div className="space-y-2">
        {show.map((v) => (
          <div key={v.slug} className="flex items-center justify-between gap-3 bg-white/5 rounded-xl p-3">
            <div>
              <p className="text-sm font-semibold">{v.shopName}</p>
              <p className="text-xs text-[var(--muted)]">{v.discount}</p>
            </div>
            {v.code ? (
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-dashed border-emerald-500/40 shrink-0">
                {v.code}
              </span>
            ) : (
              <a href={v.affiliateUrl} target="_blank" rel="sponsored nofollow noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg btn-primary shrink-0">
                Ansehen →
              </a>
            )}
          </div>
        ))}
      </div>
      <Link href="/gutscheine" className="text-xs text-[var(--honey)] hover:underline mt-3 inline-block">
        Alle Gutscheine ansehen →
      </Link>
    </div>
  );
}

function EditableTextField({ label, placeholder, value, onSave, saving }: {
  label: string;
  placeholder: string;
  value: string | null;
  onSave: (v: string) => void;
  saving: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");

  if (editing) {
    return (
      <div>
        <p className="text-xs text-[var(--muted)] mb-2 uppercase tracking-wide">{label}</p>
        <textarea
          autoFocus
          rows={2}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-orange-500/40 text-white text-sm focus:outline-none resize-none"
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => { onSave(draft.trim()); setEditing(false); }}
            disabled={saving}
            className="text-xs px-3 py-1.5 rounded-lg bg-orange-500 text-white font-semibold disabled:opacity-50"
          >
            {saving ? "…" : "Speichern"}
          </button>
          <button onClick={() => { setDraft(value ?? ""); setEditing(false); }} className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-white/50">
            Abbrechen
          </button>
        </div>
      </div>
    );
  }

  return (
    <button onClick={() => { setDraft(value ?? ""); setEditing(true); }} className="w-full text-left group">
      <p className="text-xs text-[var(--muted)] mb-1.5 uppercase tracking-wide flex items-center gap-2">
        {label}
        <span className="text-white/20 group-hover:text-orange-400 transition-colors">✏️</span>
      </p>
      <p className={`text-sm leading-relaxed ${value ? "text-white/80" : "text-white/30 italic"}`}>
        {value || placeholder}
      </p>
    </button>
  );
}
