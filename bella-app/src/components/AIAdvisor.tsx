"use client";

import { useState } from "react";

// Kompaktes BELLA-Eingabe-Widget — einbettbar auf beliebigen Seiten.
// Schickt die Frage via bella:ask CustomEvent an BellaAdvisor (der
// auf der gleichen Seite gemountet ist und auf dieses Event lauscht).

interface AIAdvisorProps {
  placeholder?: string;
  buttonLabel?: string;
  className?: string;
}

export default function AIAdvisor({
  placeholder = "Erzähl BELLA von deinem Hund…",
  buttonLabel = "Frage BELLA",
  className = "",
}: AIAdvisorProps) {
  const [query, setQuery] = useState("");

  const submit = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    window.dispatchEvent(new CustomEvent("bella:ask", { detail: trimmed }));
    setQuery("");
    // Sanft zur Advisor-Sektion scrollen
    const advisor = document.getElementById("bella-advisor");
    if (advisor) advisor.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={e => e.key === "Enter" && submit()}
        placeholder={placeholder}
        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(240,167,60,0.5)] focus:border-transparent"
      />
      <button
        onClick={submit}
        disabled={!query.trim()}
        className="px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-semibold text-sm hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
