"use client";

import dynamic from "next/dynamic";

const BellaAdvisor = dynamic(() => import("@/components/BellaAdvisor"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-5xl mx-auto h-[520px] flex items-center justify-center">
      <div className="text-gray-400 text-center">
        <div className="text-6xl mb-4 animate-bounce">🐕</div>
        <p className="text-sm">BELLA wird geladen...</p>
      </div>
    </div>
  ),
});

interface BellaAdvisorWrapperProps {
  introMessage?: string;
  pageQuickOptions?: Array<{ label: string; msg: string }>;
}

export default function BellaAdvisorWrapper({ introMessage, pageQuickOptions }: BellaAdvisorWrapperProps = {}) {
  return <BellaAdvisor introMessage={introMessage} pageQuickOptions={pageQuickOptions} />;
}
