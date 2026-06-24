"use client";

import { useState } from "react";

export default function EmbedCodeBox({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
        <span className="text-[11px] text-white/40 font-mono">HTML</span>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(code).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            });
          }}
          className="text-xs px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[var(--honey)] hover:bg-white/10 transition-colors"
        >
          {copied ? "✓ Kopiert!" : "Code kopieren"}
        </button>
      </div>
      <pre className="px-4 py-3 text-xs text-white/80 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
