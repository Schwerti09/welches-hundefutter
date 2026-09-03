export interface Futtertyp {
  slug: string;
  dbType: string;         // Wert in dog_foods.type für DB-Filter
  name: string;
  tagline: string;
  description: string;
  pros: string[];
  cons: string[];
  idealFor: string[];
  priceRange: string;
  emoji: string;
}

export const FUTTERTYPEN: Futtertyp[] = [
  {
    slug: "trockenfutter",
    dbType: "trocken",
    name: "Trockenfutter",
    tagline: "Das beliebteste Hundefutter — günstig, haltbar, zahngesund",
    description: "Trockenfutter (Kibble) ist in Deutschland die am häufigsten genutzte Futterform. Es enthält 6–10 % Feuchtigkeit, ist lange haltbar und hat durch die abrasive Wirkung beim Kauen einen positiven Effekt auf die Zahngesundheit. Worauf es ankommt: Fleisch als erster Bestandteil, Fleischanteil >60 %, keine unnötigen Füllstoffe wie Mais oder Zuckerrübenmelasse.",
    pros: ["Günstig in der Handhabung", "Lange haltbar (bis zu 18 Monate)", "Gut für die Zahngesundheit", "Einfach zu dosieren", "Vielfältige Auswahl"],
    cons: ["Geringer Feuchtigkeitsanteil", "Qualität variiert stark", "Manche wählerische Hunde bevorzugen Nass"],
    idealFor: ["Gesunde Erwachsene Hunde", "Hunde mit Zahnproblemen", "Preisbewusste Halter", "Hunde, die viel trinken"],
    priceRange: "3–15 €/kg",
    emoji: "🦴",
  },
  {
    slug: "nassfutter",
    dbType: "nass",
    name: "Nassfutter",
    tagline: "Mehr Feuchtigkeit, mehr Geschmack — ideal für wählerische Hunde",
    description: "Nassfutter enthält 70–85 % Feuchtigkeit und kommt Hunden entgegen, die wenig trinken oder an Nierenerkrankungen leiden. Es ist schmackhafter als Trockenfutter und hat oft einen höheren Fleischanteil. Nachteil: teurer pro kcal und nach dem Öffnen nur 1–2 Tage haltbar.",
    pros: ["Hoher Feuchtigkeitsanteil", "Sehr schmackhaft", "Oft hoher Fleischanteil", "Gut für Nierenpatienten", "Für alte Hunde mit Zahnschmerzen"],
    cons: ["Teurer pro kcal", "Schnell verderblich nach Öffnen", "Kann bei schlechter Qualität zu weichem Kot führen"],
    idealFor: ["Wählerische Hunde", "Senioren", "Hunde mit Nierenthemen", "Kleine Rassen"],
    priceRange: "5–20 €/kg",
    emoji: "🥩",
  },
  {
    slug: "barf",
    name: "BARF",
    dbType: "barf",
    tagline: "Rohfütterung — naturnahes, hochwertiges Futter mit Expertise",
    description: "BARF (Biologisch Artgerechtes Rohes Futter) besteht aus rohem Fleisch, Knochen, Innereien, Gemüse und Ölen. Befürworter schätzen die Naturbelassenheit, hohe Fleischanteile und die Kontrolle über jede Zutat. Für Einsteiger empfehlen wir Fertig-BARF aus dem Kühlregal als ersten Schritt.",
    pros: ["Naturbelassen", "Kein Getreide", "Volle Kontrolle über Zutaten", "Hohe Futtermotivation", "Wenig Kot"],
    cons: ["Hohes Hygiene-Risiko (Salmonellen)", "Komplexe Nährstoffbalance nötig", "Teuer und zeitaufwändig", "Nicht für jeden Hund geeignet"],
    idealFor: ["Erfahrene Hundehalter", "Hunde mit Allergien", "Fleischfresser", "Hunde ohne Immunschwäche"],
    priceRange: "4–18 €/kg",
    emoji: "🥩",
  },
  {
    slug: "kaltgepresst",
    name: "Kaltgepresstes Futter",
    dbType: "kaltgepresst",
    tagline: "Schonend verarbeitet — zwischen Trocken und Roh",
    description: "Kaltgepresstes Futter wird bei max. 45 °C verarbeitet — dadurch bleiben Enzyme, Vitamine und Nährstoffe besser erhalten als bei hocherhitztem Extrudat. Es ist leichter verdaulich und löst sich in Wasser auf (ideal für ältere Hunde). Qualitativ zwischen Trockenfutter und BARF.",
    pros: ["Schonende Verarbeitung", "Bessere Nährstoffdichte", "Leicht verdaulich", "Gut bei Magenproblemen"],
    cons: ["Teurer als normales Trockenfutter", "Kürzere Haltbarkeit", "Kleineres Sortiment"],
    idealFor: ["Hunde mit sensiblem Magen", "Senioren", "Hunde nach BARF-Einstieg"],
    priceRange: "8–20 €/kg",
    emoji: "❄️",
  },
  {
    slug: "getreidefrei",
    name: "Getreidefreies Futter",
    dbType: "trocken",
    tagline: "Ohne Weizen, Mais und Gerste — ideal bei Getreide-Unverträglichkeit",
    description: "Getreidefreies Futter ersetzt Getreide durch Kartoffel, Erbsen oder Süßkartoffel als Kohlenhydratquelle. Es ist die erste Wahl bei Getreide-Unverträglichkeit, aber nicht automatisch besser für jeden Hund. Wichtig: Getreide ≠ Allergie-Auslöser per se — die häufigsten Allergene sind tierischen Ursprungs.",
    pros: ["Keine Getreide-Allergene", "Oft höherer Fleischanteil", "Gut verträglich für sensible Hunde"],
    cons: ["Nicht automatisch kalorienärmer", "Kann bei Herzerkrankungen (DCM) problematisch sein", "Teurer"],
    idealFor: ["Hunde mit Getreide-Unverträglichkeit", "Hunde mit Hautproblemen", "Allergiker"],
    priceRange: "6–20 €/kg",
    emoji: "🌿",
  },
  {
    slug: "hypoallergen",
    name: "Hypoallergenes Futter",
    dbType: "trocken",
    tagline: "Wenige Zutaten, neue Proteinquelle — für Allergiker",
    description: "Hypoallergenes Futter enthält eine einzige, möglichst unbekannte Proteinquelle (Ente, Pferd, Insekten, Wild) und eine einfache Kohlenhydratquelle. Ziel ist es, bekannte Allergene auszuschließen. Während einer Eliminationsdiät (8–12 Wochen) sollte ausschließlich diese eine Sorte gefüttert werden.",
    pros: ["Minimale Allergene", "Klare Deklaration", "Geeignet für Eliminationsdiät"],
    cons: ["Teurer", "Weniger Auswahl", "Nicht für jeden Hund nötig"],
    idealFor: ["Hunde mit Futterallergie", "Hunde während Eliminationsdiät", "Empfindliche Hunde"],
    priceRange: "8–25 €/kg",
    emoji: "💊",
  },
  {
    slug: "monoprotein",
    name: "Monoprotein-Futter",
    dbType: "trocken",
    tagline: "Nur eine Fleischquelle — die Basis jeder Allergie-Diagnose",
    description: "Monoprotein-Futter enthält exakt eine tierische Proteinquelle. Das macht es ideal für die Ausschlussdiät: Wenn der Hund auf X reagiert, wechselst du zu Y — und weißt nach 8 Wochen, was der Auslöser ist. Beliebte Proteine: Ente, Pferd, Insekten, Känguru, Strauß.",
    pros: ["Eindeutige Zutatenliste", "Ideal für Eliminationsdiät", "Klare Verantwortung der Proteinquelle"],
    cons: ["Eingeschränkte Nährstoffvielfalt", "Teure Exoten-Proteine", "Langfristig evtl. ergänzen nötig"],
    idealFor: ["Allergiker-Hunde", "Eliminationsdiät", "Hunde mit unbekanntem Auslöser"],
    priceRange: "7–22 €/kg",
    emoji: "🦆",
  },
  {
    slug: "insekten",
    name: "Insekten-Futter",
    dbType: "trocken",
    tagline: "Nachhaltig & hypoallergen — Hundefutter aus Insektenmehl",
    description: "Insekten (z. B. Hermetia illucens / Schwarze Waffelfliege) sind ein vollwertiges, nachhaltiges Protein mit niedrigem ökologischen Fußabdruck. Da die meisten Hunde noch nie Insekten-Protein hatten, ist es eine hervorragende Wahl für die Eliminationsdiät. Keine Kreuzreaktion mit Geflügel-Allergie bekannt.",
    pros: ["Sehr hypoallergen (neue Proteinquelle)", "Nachhaltig (80% weniger CO₂)", "Vollständiges Aminosäureprofil", "Gut verträglich"],
    cons: ["Ungewöhnter Geruch", "Manche Hunde anfangs skeptisch", "Noch begrenzte Langzeitstudien"],
    idealFor: ["Allergiker mit klassischen Proteinen", "Umweltbewusste Halter", "Eliminationsdiät"],
    priceRange: "8–20 €/kg",
    emoji: "🐛",
  },
  {
    slug: "vegetarisch",
    dbType: "trocken",
    name: "Vegetarisches Hundefutter",
    tagline: "Pflanzlich — für ethisch motivierte Halter",
    description: "Vegetarisches Hundefutter enthält kein Fleisch, aber tierische Produkte wie Eier und Milch sind erlaubt. Hunde sind Fleischfresser, können aber als Omnivore mit einer gut ausgewogenen pflanzlichen Diät leben. Wichtig: Taurin, L-Carnitin und alle essenziellen Aminosäuren müssen supplementiert sein.",
    pros: ["Keine Fleisch-Allergene", "Ethische Option", "Gut bei Fleisch-Allergie"],
    cons: ["Erfordert genaue Nährstoffplanung", "Nicht artgerecht im klassischen Sinne", "Taurin-Supplementierung nötig"],
    idealFor: ["Hunde mit Fleisch-Allergie", "Ethisch motivierte Halter (mit tierärztlicher Begleitung)"],
    priceRange: "6–18 €/kg",
    emoji: "🥦",
  },
  {
    slug: "vegan",
    dbType: "trocken",
    name: "Veganes Hundefutter",
    tagline: "Komplett pflanzlich — nur mit sorgfältiger Planung",
    description: "Veganes Hundefutter enthält keine tierischen Produkte. Es ist möglich, einen Hund vegan zu ernähren — erfordert aber sehr sorgfältige Nährstoffplanung, regelmäßige Blutuntersuchungen und tierärztliche Begleitung. Taurin, B12, Vitamin D3 (als D3 aus Flechten) und Omega-3 müssen supplementiert werden.",
    pros: ["Keine tierischen Allergene", "Niedrigster ökologischer Fußabdruck", "Kann Entzündungen reduzieren"],
    cons: ["Höchste Anforderungen an Nährstoffplanung", "Risiko bei falscher Zusammensetzung", "Nicht für alle Hunde geeignet"],
    idealFor: ["Hunde mit multiplen Proteinallergie (nur mit Tierarzt)", "Ethisch motivierte Halter mit Expertise"],
    priceRange: "7–22 €/kg",
    emoji: "🌱",
  },
];

export const FUTTERTYP_BY_SLUG = Object.fromEntries(FUTTERTYPEN.map((f) => [f.slug, f]));
