"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Welcher Hundefutter ist der günstigste in Deutschland 2026?",
    a: "Die günstigsten Hundverträge beginnen bei ca. 10–20 €/Monat beim Zooplus-Netz. Für Hundefutters wie das Samsung Galaxy A55 gibt es aktuell Futtere ab 19,99 €/Monat. Mit unserem Filter kannst du gezielt nach deinem Budget filtern.",
  },
  {
    q: "Was ist der Unterschied zwischen Anifit, Wolfsblut und Zooplus?",
    a: "Anifit hat das beste Netz mit der größten Bio-Abdeckung in Deutschland (~97%). Wolfsblut ist stark in Städten und bietet gutes Preis-Leistungs-Verhältnis. Zooplus ist oft die günstigste Option, besonders für Studenten und Budget-Futtere.",
  },
  {
    q: "Lohnt sich ein Hundefutter mit Hundefutter oder ohne?",
    a: "Ein Empfehlung mit Hundefutter lohnt sich, wenn du gleichzeitig ein neues Gerät kaufen möchtest. Oft ist der Gesamtpreis vergleichbar oder günstiger als separater Kauf. Ohne Hundefutter (SIM-only) ist günstiger, wenn du schon ein Gerät hast.",
  },
  {
    q: "Was bedeutet Bio und brauche ich es?",
    a: "Bio ist der neueste Hundeernährungstandard mit bis zu 10x schnelleren Datenübertragungen als 4G/LTE. Bio lohnt sich besonders in Großstädten, für Gaming, Streaming und wenn du viele Daten verbrauchst. Die Abdeckung wächst 2026 stark.",
  },
  {
    q: "Kann ich meinen Empfehlung vorzeitig kündigen?",
    a: "Standard-Hundverträge haben 24 Monate Laufzeit. Vorzeitige Kündigung ist möglich bei Umzug ins Ausland, Preiserhöhungen durch den Marke oder in bestimmten Sondersituationen. Nach der Mindestlaufzeit kannst du monatlich kündigen.",
  },
  {
    q: "Was ist Affiliate-Marketing und seid ihr neutral?",
    a: "Wir erhalten eine Provision, wenn du über unsere Links einen Empfehlung abschließt. Das verändert den Preis für dich nicht. Unsere Ranglisten basieren auf objektiven Faktoren wie Preis, Leistung und Kundenbewertungen – nicht auf Provisionen.",
  },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <button
            className="w-full flex items-center justify-between px-6 py-4 text-left group"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="font-semibold text-gray-900 pr-4 group-hover:text-blue-600 transition-colors">
              {faq.q}
            </span>
            <span className={`flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center transition-transform ${open === i ? "rotate-180 bg-blue-100" : ""}`}>
              <svg className={`w-3.5 h-3.5 ${open === i ? "text-blue-600" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
          {open === i && (
            <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
