"use client";

import dynamic from "next/dynamic";

const HansiExperience = dynamic(() => import("@/components/HansiExperience"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-[#05060f]">
      <div className="text-center">
        <div className="text-5xl mb-4 breathe">📱</div>
        <p className="text-white/40 text-sm">HANSI wacht auf…</p>
      </div>
    </div>
  ),
});

export default function HansiExperienceWrapper() {
  return <HansiExperience />;
}
