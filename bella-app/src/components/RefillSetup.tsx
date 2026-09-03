"use client";

import { useState } from "react";

interface Props {
  dogProfileId: string;
  dogName: string;
  foodSlug: string | null | undefined;
  foodName: string | null | undefined;
  estBagDays: number | null | undefined;
}

/**
 * Inline-Nachschub-Wecker direkt im Chat-Moment der Empfehlung — bisher gab es dafür
 * nur einen Link zu /mein-hund, was den Großteil der Konversion kostet, weil der
 * Nutzer den Moment der Empfehlung verlässt. Nimmt an, dass der Sack heute "gekauft"
 * wird (lastPurchaseAt = jetzt), exakt wie die Refill-Annahme auf /mein-hund.
 */
export default function RefillSetup({ dogProfileId, dogName, foodSlug, foodName, estBagDays }: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");

  if (!estBagDays) return null;

  const submit = async () => {
    if (!email || state === "saving") return;
    setState("saving");
    const refillDueAt = new Date(Date.now() + estBagDays * 86_400_000).toISOString();
    try {
      const res = await fetch("/api/alerts/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, foodSlug, foodName, mode: "refill", dogProfileId, refillDueAt }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return <p className="text-[11px] text-emerald-400">✓ Bestätigungsmail gesendet — bitte kurz bestätigen!</p>;
  }

  return (
    <div>
      <p className="text-[10px] text-white/40 mb-2">
        ⏰ Sack reicht ca. {estBagDays} Tage — soll ich dich erinnern, bevor er leer ist?
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="deine@email.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/50"
        />
        <button
          disabled={!email || state === "saving"}
          onClick={submit}
          className="px-3 py-1.5 rounded-lg bg-orange-500/80 text-white text-xs font-semibold disabled:opacity-40 shrink-0"
        >
          {state === "saving" ? "…" : state === "error" ? "Fehler" : "Wecker an"}
        </button>
      </div>
    </div>
  );
}
