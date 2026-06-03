"use client";
import dynamic from "next/dynamic";
const HansiDecisionUI = dynamic(() => import("@/components/HansiDecisionUI"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#05060f] flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4 breathe">📡</div>
        <p className="text-white/35 text-sm tracking-wide">Decision Intelligence wird geladen…</p>
      </div>
    </div>
  ),
});
export default function HansiDecisionWrapper() { return <HansiDecisionUI />; }
