"use client";

import { motion } from "framer-motion";
import type { UserProfile } from "@/lib/profileStore";

interface Props {
  profile: UserProfile;
}

function relTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "gerade eben";
  if (diff < 3_600_000) return `vor ${Math.round(diff / 60_000)} Min.`;
  if (diff < 86_400_000) return `vor ${Math.round(diff / 3_600_000)} Std.`;
  if (diff < 604_800_000) return `vor ${Math.round(diff / 86_400_000)} Tag${Math.round(diff / 86_400_000) !== 1 ? "en" : ""}`;
  return new Date(ts).toLocaleDateString("de-DE", { day: "numeric", month: "short" });
}

export default function MemoryTimeline({ profile }: Props) {
  const sessions = profile.sessions?.slice(0, 8) ?? [];
  if (sessions.length === 0) return null;

  return (
    <div className="bg-black/20 rounded-2xl border border-white/8 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] text-white/35 uppercase tracking-widest font-semibold">BELLA erinnert sich</span>
        <div className="flex-1 h-px bg-white/5" />
      </div>
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-[5px] top-2 bottom-2 w-px bg-white/8" />
        <div className="space-y-3">
          {sessions.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 pl-4 relative"
            >
              {/* Dot */}
              <div className={`absolute left-0 top-1 w-2.5 h-2.5 rounded-full border border-white/20 ${i === 0 ? "bg-indigo-500 border-indigo-400" : "bg-white/10"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-white/70 truncate">{s.query}</p>
                {s.topDevice && (
                  <p className="text-[10px] text-indigo-300/70 mt-0.5">→ {s.topDevice}</p>
                )}
              </div>
              <span className="text-[10px] text-white/25 shrink-0 mt-0.5">{relTime(s.ts)}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
