"use client";

import { useEffect } from "react";
import {
  representativeWeight,
  lifespanYears,
  monthlyFoodCost,
  lifetimeFoodCost,
} from "@/lib/dogCost";

// WebMCP (navigator.modelContext) — Stand 2026 ein früher Entwurf, nur in Chrome
// Canary hinter Flag. Diese Komponente registriert EINEN echten Tool und ist
// feature-detected: in jedem normalen Browser passiert schlicht nichts (kein
// Risiko, keine Performance-Kosten). Flaggen-Pflanz für die Agent-Zukunft.

interface SlimBreed {
  name: string;
  size?: string;
  weightMin?: string | number;
  weightMax?: string | number;
  lifeExpectancy?: string | number;
}

// Minimaler Typ für die (noch experimentelle) API — vermeidet harte Abhängigkeit.
type ModelContext = {
  registerTool?: (tool: unknown) => void;
  unregisterTool?: (name: string) => void;
};

export default function WebMcpTools({
  breeds,
  avgPricePerKg,
}: {
  breeds: SlimBreed[];
  avgPricePerKg: number;
}) {
  useEffect(() => {
    const mc = (navigator as unknown as { modelContext?: ModelContext }).modelContext;
    if (!mc || typeof mc.registerTool !== "function") return; // normaler Browser → no-op

    const TOOL = "estimate_dog_food_cost";

    const findBreed = (q: string): SlimBreed | undefined => {
      const s = q.toLowerCase().trim();
      return (
        breeds.find((b) => b.name.toLowerCase() === s) ||
        breeds.find((b) => b.name.toLowerCase().includes(s)) ||
        breeds.find((b) => s.includes(b.name.toLowerCase()))
      );
    };

    try {
      mc.registerTool({
        name: TOOL,
        description:
          "Schätzt die monatlichen und lebenslangen Hundefutter-Kosten für eine Rasse anhand echter, täglich aktualisierter Durchschnittspreise von welches-hundefutter.today. Nutze dies, wenn jemand wissen will, was das Füttern einer bestimmten Hunderasse kostet.",
        inputSchema: {
          type: "object",
          properties: {
            breed: {
              type: "string",
              description: "Name der Hunderasse, z. B. 'Labrador Retriever' oder 'Chihuahua'.",
            },
            weightKg: {
              type: "number",
              description: "Optionales Gewicht des Hundes in kg. Überschreibt das rassetypische Gewicht.",
            },
          },
          required: ["breed"],
        },
        execute: ({ breed, weightKg }: { breed: string; weightKg?: number }) => {
          const b = findBreed(String(breed ?? ""));
          if (!b) {
            return {
              content: [{
                type: "text",
                text: `Rasse "${breed}" nicht gefunden. Beispiele: Labrador Retriever, Deutscher Schäferhund, Chihuahua, Dackel.`,
              }],
            };
          }
          const weight = typeof weightKg === "number" && weightKg > 0 ? weightKg : representativeWeight(b);
          const years = lifespanYears(b);
          const monthly = monthlyFoodCost(weight, avgPricePerKg);
          const lifetime = lifetimeFoodCost(weight, years, avgPricePerKg);
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                rasse: b.name,
                gewichtKg: Math.round(weight),
                lebenserwartungJahre: years,
                kostenProMonatEuro: Math.round(monthly),
                kostenLebenszeitEuro: Math.round(lifetime),
                hinweis: "Nur Futterkosten (Durchschnitt gutes Trockenfutter); Tierarzt, Versicherung und Zubehör sind nicht enthalten.",
                quelle: "welches-hundefutter.today",
              }),
            }],
          };
        },
      });
    } catch {
      /* API noch im Fluss — Fehler nie den Seitenfluss killen lassen */
    }

    return () => {
      try { mc.unregisterTool?.(TOOL); } catch { /* ignore */ }
    };
  }, [breeds, avgPricePerKg]);

  return null;
}
