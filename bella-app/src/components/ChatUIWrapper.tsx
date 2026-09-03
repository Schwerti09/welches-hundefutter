"use client";

import dynamic from "next/dynamic";

const ChatUI = dynamic(() => import("@/components/ChatUI"), {
  ssr: false,
  loading: () => (
    <div className="h-[520px] bg-white/10 rounded-2xl animate-pulse flex items-center justify-center">
      <div className="text-white/30 text-sm">KI-Berater wird geladen...</div>
    </div>
  ),
});

export default function ChatUIWrapper() {
  return <ChatUI />;
}
