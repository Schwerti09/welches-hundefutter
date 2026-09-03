"use client";
import { useState } from "react";

const QUESTIONS = [
  {
    id: "rippen",
    text: "Kannst du die Rippen deines Hundes ertasten?",
    options: [
      { label: "Sofort, ohne Druck", score: 1 },
      { label: "Mit leichtem Druck", score: 2 },
      { label: "Erst mit stärkerem Druck", score: 3 },
      { label: "Kaum spürbar", score: 4 },
    ],
  },
  {
    id: "taille",
    text: "Ist die Taille von oben erkennbar (Einschnürung hinter den Rippen)?",
    options: [
      { label: "Sehr deutlich — fast knochig", score: 1 },
      { label: "Klar erkennbar", score: 2 },
      { label: "Kaum erkennbar", score: 3 },
      { label: "Nicht erkennbar", score: 4 },
    ],
  },
  {
    id: "bauch",
    text: "Wie sieht der Bauch von der Seite aus?",
    options: [
      { label: "Stark eingezogen (hängende Flanken)", score: 1 },
      { label: "Leicht eingezogen", score: 2 },
      { label: "Flach / gerade", score: 3 },
      { label: "Deutlich gewölbt", score: 4 },
    ],
  },
];

interface BCSResult {
  score: number;
  label: string;
  color: string;
  icon: string;
  tip: string;
}

function calcResult(answers: number[]): BCSResult {
  const sum = answers.reduce((a, b) => a + b, 0);
  if (sum <= 4) return {
    score: 2,
    label: "Untergewicht",
    color: "text-blue-400",
    icon: "🥺",
    tip: "Dein Hund braucht mehr Kalorien. Erhöhe die Tagesration um 10–15 % und beobachte die Entwicklung über 2–3 Wochen. Beim Tierarzt die Ursache abklären.",
  };
  if (sum <= 6) return {
    score: 4,
    label: "Leicht unter Idealgewicht",
    color: "text-cyan-400",
    icon: "🙂",
    tip: "Fast perfekt — erhöhe die Ration leicht (5–8 %) und kontrolliere das Gewicht wöchentlich.",
  };
  if (sum <= 8) return {
    score: 5,
    label: "Idealgewicht",
    color: "text-emerald-400",
    icon: "✅",
    tip: "Super! Dein Hund ist im optimalen Konditionsbereich. Aktuelle Futtermenge beibehalten.",
  };
  if (sum <= 10) return {
    score: 6,
    label: "Leichtes Übergewicht",
    color: "text-amber-400",
    icon: "⚠️",
    tip: "Reduziere die Tagesration um 10–15 %. Snacks und Leckerlis konsequent einrechnen. Mehr Bewegung.",
  };
  return {
    score: 8,
    label: "Übergewicht",
    color: "text-red-400",
    icon: "🔴",
    tip: "Klarer Handlungsbedarf. Reduktionsdiät beginnen (−20 % Kalorien), regelmäßige Gewichtskontrolle und Tierarzt einbeziehen — Übergewicht verkürzt die Lebenserwartung messbar.",
  };
}

export default function BCSChecker() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);

  const currentStep = QUESTIONS.findIndex((q) => !(q.id in answers));
  const result = done ? calcResult(Object.values(answers)) : null;

  function answer(questionId: string, score: number) {
    const next = { ...answers, [questionId]: score };
    setAnswers(next);
    if (Object.keys(next).length === QUESTIONS.length) {
      setDone(true);
    }
  }

  function reset() {
    setAnswers({});
    setDone(false);
  }

  if (done && result) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{result.icon}</span>
          <div>
            <p className="text-xs text-[var(--muted)] mb-0.5">BCS-Score (1–9)</p>
            <p className={`text-xl font-bold ${result.color}`}>{result.score}/9 — {result.label}</p>
          </div>
        </div>
        <p className="text-sm text-[var(--muted)] leading-relaxed bg-white/5 rounded-xl p-4">
          {result.tip}
        </p>
        <div className="flex items-center justify-between text-xs text-[var(--muted)]">
          <span>Kein Ersatz für Tierarzt-Diagnose</span>
          <button onClick={reset} className="text-[var(--honey)] hover:underline">
            Neu starten →
          </button>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[currentStep >= 0 ? currentStep : 0];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white text-sm">🐕 Body-Condition-Check</h3>
        <span className="text-xs text-[var(--muted)]">Frage {Math.min(currentStep + 1, 3)} / 3</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1">
        <div
          className="bg-[var(--honey)] h-1 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / 3) * 100}%` }}
        />
      </div>
      <p className="text-white/90 text-sm font-medium">{q.text}</p>
      <div className="grid grid-cols-1 gap-2">
        {q.options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => answer(q.id, opt.score)}
            className="text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 hover:border-[var(--honey)]/40 text-sm text-white/80 transition-all"
          >
            {opt.label}
          </button>
        ))}
      </div>
      <p className="text-[11px] text-[var(--muted)]">Ergebnis in Sekunden — kein Login, keine Daten gespeichert.</p>
    </div>
  );
}
