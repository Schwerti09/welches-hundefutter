import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import AuthorBox from "@/components/AuthorBox";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Hundefutter FAQ 2026: 25 Fragen zur Hundeernährung beantwortet | BELLA",
  description: "Welches Hundefutter ist das beste? Was bei Allergie, Übergewicht, Welpen? Wie viel täglich? BELLA beantwortet 25 wichtige Fragen zur Hundeernährung – konkret und verständlich.",
  alternates: {
    canonical: "https://welches-hundefutter.today/faq",
    languages: {
      "de-DE": "https://welches-hundefutter.today/faq",
      "de-AT": "https://welches-hundefutter.today/faq",
      "de-CH": "https://welches-hundefutter.today/faq",
      "x-default": "https://welches-hundefutter.today/faq",
    },
  },
};

const faqs = [
  {
    kategorie: "Grundlagen",
    items: [
      {
        frage: "Welches Hundefutter ist das beste?",
        antwort: `Es gibt kein universell bestes Futter – die richtige Wahl hängt von Rasse, Alter, Gewicht, Aktivitätslevel und Gesundheitszustand ab. Als Ausgangspunkt gilt: Erstzutat sollte ein konkret benanntes Fleisch sein (z.B. 'Hühnerfilet 70 %'), kein Zucker, keine Geschmacksverstärker, keine nicht deklarierten "tierischen Nebenerzeugnisse". Marken mit konsequent hoher Fleischqualität: Anifit, Wolfsblut, Futalis, Bellfor, Animonda Carny.`,
      },
      {
        frage: "Wie erkenne ich gutes Hundefutter?",
        antwort: "Checkliste: (1) Fleisch als erste Zutat, spezifisch benannt. (2) Rohprotein ≥ 25 % bei Trockenfutter. (3) Keine Zucker, Melasse oder Karamell. (4) Keine Ethoxyquin (E324) als Konservierungsmittel. (5) Klare Deklaration – kein 'Fleisch und tierische Nebenerzeugnisse' ohne Herkunftsangabe. (6) Analysewerte auf der Packung nachvollziehbar. Der BELLA-Score bewertet diese Kriterien auf einer Skala von 35–98 für alle 11.000+ Sorten im Katalog.",
      },
      {
        frage: "Was bedeutet 'tierische Nebenerzeugnisse' auf der Packung?",
        antwort: `"Tierische Nebenerzeugnisse" ist ein Sammelbegriff für alle Nebenprodukte der Fleischverarbeitung – von Organen (Leber, Herz, Nieren – wertvoll) bis zu Knochen, Federn und Blut (minderwertig). Ohne Prozentangabe und Spezifizierung weißt du nicht, was drin ist. Formulierungen wie 'Geflügel 30 % (davon Herz 15 %, Leber 10 %)' sind transparent und akzeptabel. Der Sammelbegriff ohne Aufschlüsselung ist ein Qualitätssignal für Billigfutter.`,
      },
      {
        frage: "Trockenfutter oder Nassfutter – was ist besser?",
        antwort: "Beide haben Vorteile. Trockenfutter: günstiger pro Mahlzeit, gut für Zahngesundheit (mechanische Reinigung), einfach zu lagern. Nassfutter: höherer Wasseranteil (ca. 75–80 %) – wichtig für Hunde, die wenig trinken; besser für Nieren; schmackhafter für viele Hunde. Empfehlung: Mischfütterung. Morgens Trockenfutter für Zahnpflege, abends Nassfutter für Flüssigkeit und Palatabilität. Wichtig: Nassfutter hat ~3–4x mehr Feuchtigkeit als Trockenfutter, daher entsprechend mehr Gramm nötig.",
      },
      {
        frage: "Wie viel sollte mein Hund pro Tag fressen?",
        antwort: "Die genaue Tagesmenge berechnet sich nach dem Ruheumsatz (RER): 70 × Körpergewicht (kg)^0,75 × Aktivitätsfaktor. Für einen aktiven 25-kg-Hund ergibt das etwa 280–340 g hochwertiges Trockenfutter (bei ~3.700 kcal/kg). Packungsangaben sind oft zu hoch – Hersteller haben kommerzielles Interesse an höherem Verbrauch. Kontrolliere alle 4–6 Wochen das Körpergewicht und passe die Menge an. BELLA berechnet die Tagesmenge automatisch wenn du Gewicht und Aktivitätslevel angibst.",
      },
    ],
  },
  {
    kategorie: "Gesundheit & Allergien",
    items: [
      {
        frage: "Welches Hundefutter bei Allergie?",
        antwort: "Bei Futtermittelallergie immer erst Monoprotein-Eliminationsdiät: ein einziges, unbekanntes Protein (z.B. Pferd, Känguru, Insekten) über 8–12 Wochen. Die häufigsten Auslöser in Deutschland: Huhn (34 % aller Fälle), Rind (26 %), Weizen (15 %). Hypoallergenes Futter hilft nur wenn es tatsächlich das Allergen meidet – reine 'Hypo'-Labels sind kein Garant. Tierärztliche Diagnose vor Futterumstellung ist sinnvoll da viele Hautsymptome nicht futterbedingt sind.",
      },
      {
        frage: "Mein Hund hat Durchfall – welches Futter hilft?",
        antwort: "Akuter Durchfall (unter 2 Tage): Futterentzug für 12–24 h, dann leichte Schonkost (Reis + Hühnchen gekocht, 1:3). Danach schrittweise auf normales Futter umstellen. Anhaltender Durchfall (über 3 Tage): Tierarzt aufsuchen – Ursache kann Infektion, Parasiten, Pankreatitis oder chronische Enteropathie sein. Für Hunde mit empfindlichem Magen: Magenfreundliche Sorten mit Reis als Kohlenhydratquelle, viel Feuchtigkeit, kein Fett über 15 %. Schließe Futterwechsel als Auslöser aus – immer über 5–7 Tage einschleichen.",
      },
      {
        frage: "Welches Futter bei Gelenkproblemen / Arthrose?",
        antwort: "Drei Säulen: (1) Kalorienreduktion – jedes überschüssige Kilo erhöht die Gelenkbelastung messbar. (2) Omega-3-Fettsäuren (EPA + DHA aus Fisch) – wirken entzündungshemmend, belegt durch mehrere Studien. (3) Futter mit Glucosamin und Chondroitin – Wirksamkeit ist begrenzt, schadet aber nicht. Royal Canin, Hill's und Purina verkaufen spezielle Joint-Sorten; hochwertige Standardfutter mit Fischanteil sind oft gleichwertig. Fisch-Nassfutter oder Lachsöl als Ergänzung ist für gelenkerkrankte Hunde eine sinnvolle Maßnahme.",
      },
      {
        frage: "Welches Futter bei Nierenerkrankung?",
        antwort: "Bei chronischer Nierenerkrankung (CNE) ist tierärztlich angepasstes Nierendiätfutter notwendig: reduziertes Protein (25–28 % statt 30–35 %), reduziertes Phosphor, erhöhtes Omega-3. Marken wie Royal Canin Renal, Hill's k/d oder Eukanuba Renal werden häufig empfohlen und sind auf diese Nährstoffprofile abgestimmt. Wichtig: Kein selbst gemischtes BARF ohne tierärztliche Supervision bei Nierenkranken – Phosphorgehalt ist schwer kontrollierbar.",
      },
      {
        frage: "Mein Hund hat Übergewicht – was tun?",
        antwort: "Zuerst: Body Condition Score (BCS) bestimmen – kannst du die Rippen deines Hundes ohne Druck fühlen? Wenn nicht, ist er übergewichtig. Lösung: Kalorienmenge um 20–25 % reduzieren, nicht das Futter wechseln. 'Light'-Futter ist oft nicht die beste Lösung – viele haben weniger Fett aber mehr Füllstoffe und machen nicht satter. Besser: Normale Sorte, weniger davon. Gemüse (Möhren, Zucchini) als kalorienarmes Füllmaterial. Kein Nassfutter als Hauptfutter – zu wenig Sättigungseffekt. Gewichtsziel: maximal 1–2 % Körpergewichtsverlust pro Woche.",
      },
    ],
  },
  {
    kategorie: "Lebensphase & Rasse",
    items: [
      {
        frage: "Welches Futter für meinen Welpen?",
        antwort: "Welpenfutter muss höheres Protein (≥ 28 %), höheres Kalzium und Phosphor für Knochenwachstum sowie DHA für Gehirnentwicklung enthalten. Bei großen Rassen (> 25 kg ausgewachsen): 'Large Breed Puppy'-Futter mit kontrollierter Energiedichte – zu schnelles Wachstum belastet Gelenke. Keine normale Erwachsenen-Ernährung für Welpen – der Knochen- und Muskelaufbau braucht andere Nährstoffverhältnisse. Umstellungsdauer: 7 Tage langsam einmischen.",
      },
      {
        frage: "Ab wann sollte mein Hund Seniorenfutter bekommen?",
        antwort: "Richtwerte: Kleine Rassen (< 10 kg) ab 9–10 Jahren. Mittelgroße Rassen (10–25 kg) ab 8 Jahren. Große Rassen (> 25 kg) ab 7 Jahren. Seniorenfutter hat reduzierte Kalorien, leichter verdauliches Protein, mehr Glucosamin/Chondroitin und angepasstes Calcium-Phosphor-Verhältnis. Zeichen, dass es Zeit ist: Gewichtszunahme bei gleicher Portion, steifes Aufstehen, langsamerer Stoffwechsel.",
      },
      {
        frage: "Welches Futter für Hunde großer Rassen?",
        antwort: `Große Rassen brauchen: (1) Kontrollierte Energiedichte (nicht zu kalorienreich – verhindert überschnelles Wachstum beim Welpen). (2) Ca:P-Verhältnis 1,2:1 bis 1,4:1 für Knochenstabilität. (3) Höherer Proteingehalt (≥ 26 %) für Muskelerhalt. (4) Omega-3 für Gelenke (sie sind mehr belastet). Spezielle "Large Breed"-Varianten sind meist gut – aber nicht zwingend notwendig wenn das Standardfutter die Nährstoffprofile erfüllt.`,
      },
      {
        frage: "Welches Futter für aktive / arbeitende Hunde?",
        antwort: "Hoch aktive Hunde (Schäferhunde, Hütehunde, Schlittenhunde) brauchen deutlich mehr Energie: 1,5x bis 2x der Ruhemenge. Performance-Futter mit Protein ≥ 30 %, Fett ≥ 18 % und hoher Energiedichte (≥ 4.000 kcal/kg). Wichtig: Nicht direkt vor intensiver Aktivität füttern – 2h Pause einhalten. BARF ist für Leistungshunde geeignet, muss aber professionell berechnet werden.",
      },
      {
        frage: "Welche Lebensmittel sind giftig für Hunde?",
        antwort: "Absolut verboten: Trauben und Rosinen (Nierenversagen, auch in kleinen Mengen), Zwiebeln und Knoblauch (Blutgift, alle Formen), Schokolade (Theobromin-Vergiftung), Xylitol (Zuckerersatz in Kaugummi/Backwaren – Leberschaden), Macadamia-Nüsse, Avocado (Persin), roher Teig mit Hefe. Ebenfalls gefährlich: Alkohol, Koffein, Nüsse allgemein, Pfirsich-/Pflaumenkerne (Blausäure), rohes Schweinefleisch (Aujeszky-Virus).",
      },
    ],
  },
  {
    kategorie: "Futtertypen",
    items: [
      {
        frage: "Ist BARF besser als Fertigfutter?",
        antwort: "BARF (Biologisch Artgerechtes Rohes Futter) kann exzellent sein – wenn es professionell berechnet wird. Richtige Zusammensetzung: ca. 70 % Muskelfleisch, 15 % Knochen (roh, nie gekocht), 10 % Organe (davon max. 5 % Leber), 5 % Gemüse/Kräuter. Falsch gemacht führt BARF zu Calcium-Phosphor-Ungleichgewicht, Jod- und Vitamin-D-Mangel. Salmonellen-Risiko ist real – besonders relevant für Haushalte mit Immungeschwächten oder Kleinkindern. Für Einsteiger: Fertig-BARF aus dem Handel (tiefgekühlt) ist sicherer als selbst zusammengestellt.",
      },
      {
        frage: "Was ist kaltgepresstes Hundefutter?",
        antwort: "Kaltgepresstes Futter wird bei max. 40–45°C verarbeitet – im Gegensatz zu extrudiertem Trockenfutter (120–180°C). Vorteil: Hitzlabile Nährstoffe (Enzyme, bestimmte Vitamine) bleiben besser erhalten. Nachteil: Kürzere Haltbarkeit, teurer, weniger Marktauswahl. BELLA-Score bewertet Kaltgepresstes mit +8 Punkten als Typbonus, weil die Verarbeitungsqualität in der Regel höher ist.",
      },
      {
        frage: "Ist Insekten-Hundefutter eine gute Alternative?",
        antwort: "Insektenfutter (Hermetia illucens / Black Soldier Fly) hat eine vollständige Aminosäurenprofile, ist hypoallergen für Hunde mit bekannten Fleischallergien und hat einen deutlich niedrigeren CO2-Fußabdruck als Rind. Studien zeigen gute Verträglichkeit und Akzeptanz. Wichtig: Nicht verwechseln mit Chitinüberschuss – gute Insektenprodukte haben kontrollierte Chitingehalte. Marken: BECO, Forthglade Insect, Green Petfood. Preis: höher als konventionelles Futter.",
      },
      {
        frage: "Vegetarisches / veganes Futter für Hunde – möglich?",
        antwort: "Hunde sind biologisch Omnivoren und können pflanzliche Diäten verdauen – aber diese müssen sehr sorgfältig zusammengestellt sein. Kritische Nährstoffe: Vitamin B12 (nur synthetisch in Pflanzenkost), Taurin, L-Carnitin, Arachidonsäure. Kommerzielle vegane Futter (Green Petfood VeggieDog) decken diese Bedarfe ab. Für gesunde Erwachsenhunde mit bestimmten Allergien kann veganes Futter sinnvoll sein. Für Welpen, Trächtigkeit und Erkrankungen: nicht ohne Tierarzt.",
      },
      {
        frage: "Was ist getreidefrei – und ist es wirklich besser?",
        antwort: "Getreidefrei bedeutet: kein Weizen, Mais, Gerste, Hafer, Roggen, Reis. Kohlenhydrate kommen dann aus Kartoffel, Erbse, Linsen. Wichtig: Getreidefrei ist NICHT Low-Carb – der Gesamtkohlenhydratgehalt kann gleich hoch sein. 2018 warnte die US-FDA vor einem möglichen Zusammenhang mit Herzerkrankungen (DCM) bei Sorten mit hohem Hülsenfruchtanteil – kein kausaler Beweis bis 2024. Getreidefrei ist sinnvoll bei bestätigter Getreide-Unverträglichkeit; bei gesunden Hunden kein bewiesener Mehrwert.",
      },
    ],
  },
  {
    kategorie: "Fütterungspraxis",
    items: [
      {
        frage: "Wie wechsle ich das Hundefutter richtig?",
        antwort: "Über 7–10 Tage schrittweise einmischen: Tag 1–3: 75 % alt + 25 % neu. Tag 4–6: 50/50. Tag 7–9: 25 % alt + 75 % neu. Tag 10: 100 % neu. Bei empfindlichen Hunden noch langsamer. Zeichen, dass es zu schnell geht: weicher Stuhlgang, Blähungen, Fressunlust. Wichtig: Keine zwei Umstellungen gleichzeitig (z.B. auch keinen Typ wechseln).",
      },
      {
        frage: "Wie viele Mahlzeiten pro Tag?",
        antwort: "Welpen (< 6 Monate): 3–4 Mahlzeiten täglich. Junghunde (6–12 Monate): 2–3 Mahlzeiten. Erwachsene Hunde: 2 Mahlzeiten (morgens und abends). Für magendrehungsgefährdete Rassen (Dogge, Schäferhund, Rottweiler): 2 Mahlzeiten + keine körperliche Aktivität 1h vor und 2h nach dem Fressen. Einmal täglich füttern kann bei manchen Hunden gut funktionieren – die Forschungslage dazu ist gemischt.",
      },
      {
        frage: "Soll ich das Futter anwärmen?",
        antwort: "Nicht notwendig, aber bei wählerischen Hunden hilfreich. Raumtemperatur (18–20°C) oder leicht handwarm (35–38°C) erhöht die Palatabilität durch freigesetzte Aromen. Nie zu heiß (> 45°C) – Verbrennungsgefahr und Nährstoffverlust. Kalt gereichertes Nassfutter direkt aus dem Kühlschrank lehnen viele Hunde ab – 30 Minuten vorher rausnehmen oder kurz im Wasserbad erwärmen.",
      },
      {
        frage: "Wie lange ist angebrochenes Nassfutter haltbar?",
        antwort: "Geöffnete Nassfutterdosen oder Pouches: Im Kühlschrank 2–3 Tage. Nie offen bei Raumtemperatur stehen lassen – Bakterienwachstum (Salmonellen, Listerien) beginnt schnell. Dose mit Alufolie abdecken oder in ein Schraubglas umfüllen. Geruch und Farbe sind gute Indikatoren – riecht es säuerlich oder zeigt sich Schimmel, sofort entsorgen.",
      },
      {
        frage: "Darf ich meinem Hund Rohknochen geben?",
        antwort: "Rohe Knochen: ja, mit Einschränkungen. Geeignet: Rohe Rinderknochen (Kniescheibe, Knorpel), rohe Hühnerhälse. Verboten: Alle gekochten, gebratenen oder gegrillten Knochen – sie werden spröde und splittern, das kann innere Verletzungen verursachen. Knochen immer beaufsichtigt geben, nicht unbeaufsichtigt. Keine zu kleinen Knochen bei großen Hunden – Erstickungsgefahr. Knochen nicht als Zahnersatz für Kaustreifen sehen – Zahnfrakturen sind beim Hund häufig knochenbedingt.",
      },
    ],
  },
];

export default function FaqPage() {
  const allFaqs = faqs.flatMap((k) => k.items).map((f) => ({ question: f.frage, answer: f.antwort }));

  return (
    <div className="min-h-screen text-[var(--ink)] flex flex-col">
      <StructuredData type="faq" faqs={allFaqs} />

      <nav className="max-w-3xl mx-auto w-full px-5 pt-8 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--honey)]">Start</Link>
        <span className="mx-2">·</span>
        <span className="text-[var(--ink)]">FAQ</span>
      </nav>

      <main className="flex-1 max-w-3xl mx-auto px-5 py-10 w-full">
        <div className="mb-10">
          <span className="pill mb-4 inline-block">❓ Häufige Fragen</span>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            Hundeernährung: 25 Fragen, klare Antworten
          </h1>
          <p className="text-[var(--muted)] leading-relaxed">
            Von Grundlagen über Gesundheit bis zur Fütterungspraxis — fundiert, ohne Marketingsprech.
            Stand: Juni 2026.
          </p>
        </div>

        <div className="space-y-10">
          {faqs.map((gruppe) => (
            <div key={gruppe.kategorie}>
              <h2 className="text-xl font-extrabold tracking-tight mb-4 flex items-center gap-3">
                <span className="w-1 h-6 rounded-full bg-[var(--honey)] inline-block" />
                {gruppe.kategorie}
              </h2>
              <div className="space-y-3">
                {gruppe.items.map((f, i) => (
                  <details key={i} className="card group">
                    <summary className="flex justify-between items-start cursor-pointer list-none p-5 gap-3">
                      <h3 className="font-semibold text-sm leading-snug pr-2">{f.frage}</h3>
                      <span className="text-[var(--muted)] mt-0.5 shrink-0 text-xs group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="px-5 pb-5 text-sm text-[var(--muted)] leading-relaxed border-t border-white/5 pt-3">
                      {f.antwort}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/30 p-8 text-center">
          <h2 className="text-xl font-extrabold tracking-tight mb-2">Deine Frage nicht dabei?</h2>
          <p className="text-sm text-[var(--muted)] mb-5 max-w-md mx-auto">
            BELLA beantwortet sie persönlich — und empfiehlt gleich das passende Futter für deinen Hund.
          </p>
          <Link href="/#bella-advisor" className="btn-primary">
            BELLA fragen →
          </Link>
        </div>
      </main>

      <AuthorBox reviewedAt="2026-06-06" />
      <SiteFooter />
    </div>
  );
}
