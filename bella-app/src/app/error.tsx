"use client";

import { useEffect } from "react";
import Link from "next/link";
import BellaMascot from "@/components/bella/BellaMascot";

// Fehler-Boundary für Route-Segmente (Roadmap 6.1). Next loggt den Server-Fehler
// bereits; hier nur die freundliche Oberfläche + ein Retry.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Browser-Konsole (Server-Log übernimmt Next selbst)
    console.error("[route-error]", error?.digest ?? "", error?.message);
  }, [error]);

  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5 py-20">
      <BellaMascot pose="hmm" size={132} title="BELLA stutzt" />
      <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-[var(--honey)]">Etwas ist schiefgelaufen</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight">Da hat sich BELLA verschluckt</h1>
      <p className="mt-3 max-w-md text-[var(--muted)]">
        Ein technischer Fehler — nicht deine Schuld. Versuch es gleich nochmal, oder geh zurück zur Startseite.
      </p>
      {error?.digest && (
        <p className="mt-2 text-xs text-[var(--muted)]/70 font-mono">Ref: {error.digest}</p>
      )}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button onClick={reset} className="btn-primary">Nochmal versuchen</button>
        <Link
          href="/"
          className="rounded-xl px-6 py-3 text-sm font-semibold border border-white/15 text-[var(--honey)] hover:bg-white/5 transition-colors"
        >
          Zur Startseite
        </Link>
      </div>
    </main>
  );
}
