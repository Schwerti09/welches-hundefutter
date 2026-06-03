"use client";

import dynamic from "next/dynamic";

const BellaAdvisor = dynamic(() => import("@/components/BellaAdvisor"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-5xl mx-auto h-[600px] flex items-center justify-center">
      <div className="text-white/40 text-center">
        <div className="text-6xl mb-4 animate-bounce">📱</div>
        <p className="text-sm">BELLA wird geladen...</p>
      </div>
    </div>
  ),
});

export default function BellaAdvisorWrapper() {
  return <BellaAdvisor />;
}
