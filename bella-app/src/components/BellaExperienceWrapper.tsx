"use client";

import dynamic from "next/dynamic";

const BellaExperience = dynamic(() => import("@/components/BellaExperience"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-[#05060f]">
      <div className="text-center">
        <div className="text-5xl mb-4 breathe">📱</div>
        <p className="text-white/40 text-sm">BELLA wacht auf…</p>
      </div>
    </div>
  ),
});

export default function BellaExperienceWrapper() {
  return <BellaExperience />;
}
