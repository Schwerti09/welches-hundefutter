"use client";

import { useEffect } from "react";

// WebMCP (navigator.modelContext) — registriert BELLA's Kern-Tool auf jeder Seite,
// auf der diese Komponente gemountet ist. Feature-detected: in normalen Browsern
// ohne die API passiert absolut nichts.
//
// Lighthouse "Agentisches Browsing" prüft:
//   ✓ Registrierte WebMCP-Tools  (mindestens 1 Tool vorhanden)
//   ✓ WebMCP-Formularabdeckung   (Chat-Formular durch Tool abgedeckt)
//   ✓ WebMCP-Schemas sind gültig (JSON Schema der Parameter korrekt)
//
// Endpoint: /api/mcp — gibt synchrone JSON-Antwort von BELLA zurück.

type ModelContext = {
  registerTool?: (tool: unknown) => void;
  unregisterTool?: (name: string) => void;
};

const TOOL_NAME = "ask_bella_hundefutter";

export default function BellaMcpTools() {
  useEffect(() => {
    const mc = (navigator as unknown as { modelContext?: ModelContext }).modelContext;
    if (!mc || typeof mc.registerTool !== "function") return;

    try {
      mc.registerTool({
        name: TOOL_NAME,
        description:
          "Fragt BELLA — die KI-Hundefutter-Beraterin von welches-hundefutter.today — nach einer personalisierten Futterempfehlung. Nutze dieses Tool, wenn jemand wissen möchte, welches Hundefutter am besten zu seinem Hund passt. BELLA berücksichtigt Rasse, Alter, Allergien, Budget und Lebensphase.",
        inputSchema: {
          type: "object",
          properties: {
            frage: {
              type: "string",
              description:
                "Die Frage oder Beschreibung des Hundes auf Deutsch, z. B. 'Welches Futter passt zu meinem 3-jährigen Labrador mit Hühnchen-Allergie?'",
            },
            rasse: {
              type: "string",
              description: "Hunderasse, z. B. 'Labrador Retriever', 'Dackel', 'Golden Retriever'.",
            },
            lebensphase: {
              type: "string",
              enum: ["welpen", "adult", "senior"],
              description: "Lebensphase des Hundes.",
            },
            gewichtKg: {
              type: "number",
              description: "Gewicht des Hundes in kg.",
            },
            allergien: {
              type: "string",
              description: "Bekannte Allergene oder Unverträglichkeiten, z. B. 'Huhn, Getreide'.",
            },
            budgetProKg: {
              type: "number",
              description: "Maximales Budget in €/kg.",
            },
          },
          required: ["frage"],
        },
        execute: async ({
          frage,
          rasse,
          lebensphase,
          gewichtKg,
          allergien,
          budgetProKg,
        }: {
          frage: string;
          rasse?: string;
          lebensphase?: string;
          gewichtKg?: number;
          allergien?: string;
          budgetProKg?: number;
        }) => {
          try {
            const res = await fetch("/api/mcp", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ frage, rasse, lebensphase, gewichtKg, allergien, budgetProKg }),
            });
            const data = await res.json() as { antwort?: string; empfehlungen?: unknown[]; error?: string };
            if (!res.ok || data.error) {
              return {
                content: [{ type: "text", text: `BELLA konnte keine Empfehlung geben: ${data.error ?? "Unbekannter Fehler"}` }],
              };
            }
            return {
              content: [{
                type: "text",
                text: data.antwort ?? "BELLA hat keine Antwort generiert.",
              }],
            };
          } catch {
            return {
              content: [{ type: "text", text: "BELLA ist gerade nicht erreichbar. Bitte versuche es direkt auf welches-hundefutter.today." }],
            };
          }
        },
      });
    } catch {
      /* API noch im Fluss — nie den Seitenfluss stoppen */
    }

    return () => {
      try { mc.unregisterTool?.(TOOL_NAME); } catch { /* ignore */ }
    };
  }, []);

  return null;
}
