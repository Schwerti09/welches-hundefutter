"use client";
import { useState } from "react";

export default function ShareButton({ url, name }: { url: string; name: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name}s Futter-Steckbrief`,
          text: `Schau dir ${name}s Futter-Steckbrief an — erstellt mit BELLA, der KI-Hundefutterberaterin!`,
          url,
        });
        return;
      } catch { /* user cancelled or unsupported — fall through to copy */ }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
    >
      {copied ? (
        <><span className="text-emerald-400">✓</span> Link kopiert!</>
      ) : (
        <><span>🔗</span> Steckbrief teilen</>
      )}
    </button>
  );
}
