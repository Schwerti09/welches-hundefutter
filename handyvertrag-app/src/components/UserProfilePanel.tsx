"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { UserProfile } from "@/lib/profileStore";
import { computeHealthScore, profileLabel } from "@/lib/profileStore";

interface Props {
  profile: UserProfile;
  onClear?: () => void;
}

function ProfileRow({ label, value, icon, fresh }: { label: string; value: string; icon: string; fresh?: boolean }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0"
    >
      <span className="text-white/45 text-[11px] flex items-center gap-1.5">
        <span>{icon}</span>{label}
      </span>
      <span className={`text-[11px] font-semibold flex items-center gap-1 ${fresh ? "text-emerald-300" : "text-white/80"}`}>
        {fresh && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
        {value}
      </span>
    </motion.div>
  );
}

export default function UserProfilePanel({ profile, onClear }: Props) {
  const { score, improvements } = computeHealthScore(profile);
  const label = profileLabel(profile);
  const hasData = profile.confidence > 10;

  return (
    <div className="bg-black/25 rounded-2xl border border-white/8 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <span className="text-[10px] font-black text-white">P</span>
          </div>
          <span className="text-[11px] font-bold text-white/70 uppercase tracking-wide">Dein Profil</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-indigo-400 font-medium">{label}</span>
          {onClear && profile.interactions > 0 && (
            <button onClick={onClear} className="text-[9px] text-white/20 hover:text-white/50 transition-colors">
              zurücksetzen
            </button>
          )}
        </div>
      </div>

      {/* Confidence bar */}
      <div className="px-4 py-2.5 border-b border-white/5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-white/40">Profil-Konfidenz</span>
          <span className="text-[10px] font-black text-white">{profile.confidence}%</span>
        </div>
        <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${profile.confidence}%` }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          />
        </div>
      </div>

      {/* Profile rows */}
      <div className="px-4 py-2">
        <AnimatePresence mode="popLayout">
          {profile.budget?.max && (
            <ProfileRow key="budget" icon="💶" label="Budget" value={`bis ${profile.budget.max} €/Monat`} fresh />
          )}
          {profile.preferredNetwork && (
            <ProfileRow key="net" icon="📡" label="Netz" value={profile.preferredNetwork} fresh />
          )}
          {profile.devicePreference && profile.devicePreference !== "Any" && (
            <ProfileRow key="dev" icon="📱" label="Gerät" value={profile.devicePreference} fresh />
          )}
          {profile.dataUsage && (
            <ProfileRow key="data" icon="📊" label="Datenvolumen" value={
              profile.dataUsage === "unlimited" ? "Unlimited" :
              profile.dataUsage === "high" ? "Viel (50+ GB)" :
              profile.dataUsage === "medium" ? "Mittel (20–50 GB)" : "Wenig (<20 GB)"
            } />
          )}
          {profile.streaming && <ProfileRow key="stream" icon="🎬" label="Streaming" value="erkannt" />}
          {profile.gaming && <ProfileRow key="gaming" icon="🎮" label="Gaming" value="erkannt" />}
          {profile.travel && <ProfileRow key="travel" icon="✈️" label="Roaming" value="erkannt" />}
          {profile.savingsPriority && <ProfileRow key="save" icon="💰" label="Priorität" value="Sparen" />}
          {profile.premiumPreference && <ProfileRow key="prem" icon="⭐" label="Priorität" value="Premium" />}
        </AnimatePresence>

        {!hasData && (
          <p className="text-[11px] text-white/30 py-2 text-center">
            HANSI lernt dich mit jedem Gespräch besser kennen.
          </p>
        )}
      </div>

      {/* Health Score */}
      {hasData && (
        <div className="px-4 pb-3 pt-1 border-t border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-white/40 uppercase tracking-wide">Optimierungs-Score</span>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black text-white">{score}</span>
              <span className="text-[10px] text-white/30">/ 100</span>
            </div>
          </div>
          {/* Score bar */}
          <div className="h-2 bg-white/8 rounded-full overflow-hidden mb-2">
            <motion.div
              className={`h-full rounded-full ${score >= 80 ? "bg-emerald-400" : score >= 60 ? "bg-indigo-400" : "bg-amber-400"}`}
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
            />
          </div>
          {/* Improvements */}
          {improvements.length > 0 && (
            <div className="space-y-1">
              {improvements.map((imp, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] text-white/40">
                  <span className="text-emerald-400/70">+{imp.points}</span>
                  <span>{imp.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Memory timeline hint */}
      {(profile.sessions?.length ?? 0) > 1 && (
        <div className="px-4 py-2 border-t border-white/5 flex items-center gap-2">
          <span className="text-[10px] text-white/30">
            {profile.sessions!.length} Gespräche gespeichert ·{" "}
            {profile.recommendedDevices.length > 0 && `Zuletzt: ${profile.recommendedDevices[0]}`}
          </span>
        </div>
      )}
    </div>
  );
}
