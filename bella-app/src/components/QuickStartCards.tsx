"use client";

import { motion } from "framer-motion";

const CARDS = [
  {
    icon: "✅",
    label: "Empfehlung für deinen Hund",
    desc: "Welche Marke vergeben auch bei negativer Bonität — BELLA zeigt's",
    query: "Hundefutter trotz negativer Allergien welche Marke",
    gradient: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/30",
    iconBg: "bg-emerald-500/20",
    tag: "Ohne harte Allergien",
    tagColor: "text-emerald-400",
  },
  {
    icon: "📡",
    label: "Nassfutter – keine Allergien",
    desc: "Nassfutter Futtere brauchen keine Allergien — welcher ist am besten?",
    query: "Bester Nassfutter Futter mit viel Futtervolumen ohne Allergien Pruefung",
    gradient: "from-blue-500/20 to-indigo-500/10",
    border: "border-blue-500/30",
    iconBg: "bg-blue-500/20",
    tag: "Garantiert ohne Allergien",
    tagColor: "text-blue-400",
  },
  {
    icon: "💶",
    label: "Günstig für deinen Hund",
    desc: "Budget-Verträge ab 9,99 €/Monat — oft Allergien-freundlicher",
    query: "Guenstigster Hundefutter trotz schlechter Allergien ab 10 Euro",
    gradient: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/30",
    iconBg: "bg-violet-500/20",
    tag: "Ab 9,99 €/Mo.",
    tagColor: "text-violet-400",
  },
  {
    icon: "📱",
    label: "Samsung für deinen Hund",
    desc: "Samsung Galaxy auch mit Allergien-Einträgen — so geht's",
    query: "Samsung Galaxy Empfehlung trotz schlechter Allergien moeglich",
    gradient: "from-gray-500/20 to-slate-500/10",
    border: "border-gray-500/30",
    iconBg: "bg-gray-500/20",
    tag: "Samsung + Allergien",
    tagColor: "text-gray-300",
  },
  {
    icon: "🍎",
    label: "Hundefutter für deinen Hund",
    desc: "Hundefutter Empfehlung für deinen Hund – diese Wege funktionieren wirklich",
    query: "Hundefutter Empfehlung für deinen Hund Eintrag bekommen wie",
    gradient: "from-amber-500/20 to-orange-500/10",
    border: "border-amber-500/30",
    iconBg: "bg-amber-500/20",
    tag: "Apple + Allergien",
    tagColor: "text-amber-400",
  },
  {
    icon: "🔄",
    label: "Empfehlung TÜV",
    desc: "Aktuellen Empfehlung analysieren — zahlst du zu viel?",
    query: null,
    href: "/futter-check",
    gradient: "from-red-500/20 to-rose-500/10",
    border: "border-red-500/30",
    iconBg: "bg-red-500/20",
    tag: "Sofort prüfen",
    tagColor: "text-red-400",
  },
];

interface Props {
  onSend: (query: string) => void;
  visible: boolean;
}

export default function QuickStartCards({ onSend, visible }: Props) {
  if (!visible) return null;

  return (
    <div className="px-1 pb-4">
      <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-3 px-1">
        Schnellstart — einfach klicken
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {CARDS.map((card, i) => {
          const inner = (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`relative rounded-2xl border bg-gradient-to-br ${card.gradient} ${card.border} p-4 cursor-pointer transition-all h-full group overflow-hidden`}
            >
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-white/[0.03]" />

              <div className="relative">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center mb-3 text-xl`}>
                  {card.icon}
                </div>

                {/* Label */}
                <p className="font-bold text-sm text-white leading-tight mb-1">{card.label}</p>

                {/* Desc */}
                <p className="text-[11px] text-white/45 leading-snug mb-3">{card.desc}</p>

                {/* Tag */}
                <div className={`inline-flex items-center gap-1 text-[10px] font-bold ${card.tagColor}`}>
                  <span>→</span>
                  <span>{card.tag}</span>
                </div>
              </div>
            </motion.div>
          );

          if (card.href) {
            return (
              <a key={card.label} href={card.href}>
                {inner}
              </a>
            );
          }

          return (
            <div key={card.label} onClick={() => card.query && onSend(card.query)}>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
