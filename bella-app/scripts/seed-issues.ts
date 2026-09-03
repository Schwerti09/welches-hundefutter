// 🐕 BELLA — Gesundheitsprobleme-Seed-Daten
// 14 häufige Gesundheitsthemen für /problem/[slug] Programmatic SEO
// Ausführen: cd bella-app && pnpm tsx scripts/seed-issues.ts

import 'dotenv/config'
import { db } from '../src/db'
import { healthIssues } from '../src/db/schema'

const issues = [
  {
    slug: 'allergie',
    name: 'Futtermittelallergie',
    description: 'Eine Futtermittelallergie äußert sich oft durch Juckreiz, Hautrötungen, Ohrenentzündungen oder Verdauungsprobleme. Die häufigsten Allergie-Auslöser bei Hunden sind Huhn, Rind und Weizen.',
    symptoms: ['Juckreiz', 'Hautrötungen', 'Ohrenentzündungen', 'Durchfall', 'Erbrechen', 'Fellausfall', 'Pfotenlecken'],
    feedingApproach: 'Monoprotein-Futter mit einer exotischen Proteinquelle (z.B. Insekten, Ente, Wild oder Lachs) und getreidefrei. Eliminationsdiät über 8-12 Wochen, dann schrittweise testen.',
    recommendedFoodTypes: ['hypoallergen', 'monoprotein', 'getreidefrei', 'insekten'],
    avoidIngredients: ['Huhn', 'Rind', 'Weizen', 'Soja', 'Mais', 'künstliche Zusätze', 'tierische Nebenerzeugnisse'],
  },
  {
    slug: 'futtermittelunvertraeglichkeit',
    name: 'Futtermittelunverträglichkeit',
    description: 'Anders als bei einer echten Allergie ist die Unverträglichkeit eine nicht-immunologische Reaktion. Zeigt sich oft durch Magen-Darm-Probleme nach bestimmten Inhaltsstoffen.',
    symptoms: ['Durchfall', 'Erbrechen', 'Blähungen', 'Bauchschmerzen', 'unverdaute Bestandteile im Kot'],
    feedingApproach: 'Hochverdauliches Futter mit klar deklarierten Zutaten. Schonkost bei akuten Beschwerden.',
    recommendedFoodTypes: ['sensitive', 'kaltgepresst', 'monoprotein'],
    avoidIngredients: ['Milchprodukte', 'fettreiche Soßen', 'Konservierungsmittel', 'künstliche Aromen'],
  },
  {
    slug: 'sensibler-magen',
    name: 'Sensibler Magen',
    description: 'Hunde mit sensiblem Magen reagieren auf jede Futterumstellung empfindlich. Häufige Ursachen: stressbedingt, falsches Futter, schlechte Ernährungsumstellung.',
    symptoms: ['Häufiges Erbrechen', 'wechselhafter Kot', 'Appetitlosigkeit', 'Magengeräusche', 'gelegentliche Bauchschmerzen'],
    feedingApproach: 'Schonkost mit leichtverdaulichen Zutaten (z.B. Reis, gekochtes Hähnchen). Schrittweise Umstellung über 7-10 Tage. Kaltgepresstes Futter oft gut verträglich.',
    recommendedFoodTypes: ['sensitive', 'kaltgepresst', 'hypoallergen'],
    avoidIngredients: ['fettige Zutaten', 'rohe Eier', 'Schweinefleisch', 'Soja'],
  },
  {
    slug: 'durchfall',
    name: 'Durchfall (Diarrhoe)',
    description: 'Akuter Durchfall ist meist harmlos und vergeht nach 1-2 Tagen. Chronischer Durchfall (>2 Wochen) ist ein Tierarzt-Fall.',
    symptoms: ['Weicher bis flüssiger Kot', 'erhöhte Stuhlfrequenz', 'Blut im Kot (Achtung!)', 'Dehydration'],
    feedingApproach: 'Erste 12-24h fasten lassen, dann Schonkost: gekochtes Hähnchen + Reis. Probiotika unterstützen die Darmflora. Bei längerem Durchfall: Tierarzt.',
    recommendedFoodTypes: ['sensitive', 'kaltgepresst', 'schonkost'],
    avoidIngredients: ['fettige Zutaten', 'Knochen', 'Milchprodukte', 'Süßigkeiten'],
  },
  {
    slug: 'uebergewicht',
    name: 'Übergewicht & Adipositas',
    description: 'Über 50 % der deutschen Hunde sind übergewichtig. Übergewicht reduziert die Lebenserwartung um bis zu 2 Jahre und begünstigt Gelenk-, Herz- und Stoffwechselprobleme.',
    symptoms: ['Sichtbarer Bauch', 'Rippen nicht ertastbar', 'Atemprobleme bei Belastung', 'Lustlosigkeit', 'Schwierigkeiten beim Aufstehen'],
    feedingApproach: 'Light-Futter mit weniger Kalorien und mehr Ballaststoffen (mehr Sättigung). Tagesmenge um 20-30 % reduzieren. Leckerlies komplett streichen. Mehr Bewegung.',
    recommendedFoodTypes: ['light', 'protein-reich-fett-arm', 'ballaststoffreich'],
    avoidIngredients: ['Zucker', 'Getreide-Füllstoffe', 'hochkalorische Leckerlies'],
  },
  {
    slug: 'untergewicht',
    name: 'Untergewicht',
    description: 'Untergewicht kann viele Ursachen haben: Parasiten, Stress, Krankheit oder zu wenig Futter. Bei länger anhaltendem Untergewicht zum Tierarzt.',
    symptoms: ['Hervorstehende Rippen', 'sichtbare Wirbel', 'eingefallener Bauch', 'Antriebslosigkeit'],
    feedingApproach: 'Hochkalorisches, leicht verdauliches Futter. Mehrere kleine Mahlzeiten täglich. Ggf. Aufbaufutter mit erhöhtem Protein- und Fettgehalt.',
    recommendedFoodTypes: ['hochkalorisch', 'protein-reich', 'aufbau'],
    avoidIngredients: ['Light-Produkte', 'reine Snacks ohne Nährwert'],
  },
  {
    slug: 'gelenkprobleme',
    name: 'Gelenkprobleme & Arthrose',
    description: 'Gelenkprobleme treffen besonders große Rassen und ältere Hunde. Glucosamin, Chondroitin und Omega-3 können Beschwerden lindern.',
    symptoms: ['Steifheit nach Ruhephasen', 'Lahmen', 'Schwierigkeiten beim Treppensteigen', 'weniger Spielfreude', 'Aufstehprobleme'],
    feedingApproach: 'Gelenkfutter mit Glucosamin, Chondroitin, MSM und Omega-3-Fettsäuren. Übergewicht unbedingt vermeiden. Hochwertige Proteine für Muskelerhalt.',
    recommendedFoodTypes: ['gelenkfutter', 'senior', 'protein-reich'],
    avoidIngredients: ['entzündungsfördernde Omega-6-Überschüsse'],
  },
  {
    slug: 'arthrose',
    name: 'Arthrose',
    description: 'Arthrose ist ein chronischer Knorpelverschleiß. Häufig bei älteren oder großen Rassen. Ernährung kann Symptome lindern, aber nicht heilen.',
    symptoms: ['Bewegungsunlust', 'Steifheit', 'Schmerzen bei Berührung', 'Muskelabbau', 'Probleme beim Aufstehen'],
    feedingApproach: 'Gelenkfutter mit Glucosamin (1500mg/Tag), Chondroitin, MSM und Omega-3 (EPA/DHA). Gewichtskontrolle ist KRITISCH.',
    recommendedFoodTypes: ['gelenkfutter', 'senior', 'kaltgepresst'],
    avoidIngredients: ['Getreide-Füllstoffe', 'künstliche Zusätze'],
  },
  {
    slug: 'nierenprobleme',
    name: 'Nierenprobleme & Niereninsuffizienz',
    description: 'Nierenerkrankungen treten besonders bei älteren Hunden auf. Eine angepasste Ernährung kann den Krankheitsverlauf verlangsamen.',
    symptoms: ['Vermehrtes Trinken', 'häufiges Wasserlassen', 'Gewichtsverlust', 'Mundgeruch', 'Müdigkeit', 'Erbrechen'],
    feedingApproach: 'Renal-Diätfutter: phosphat- und proteinreduziert, aber hochwertige Proteine. Omega-3 unterstützen die Nierenfunktion. Tierarzt-Diät empfohlen.',
    recommendedFoodTypes: ['renal-diaet', 'phosphat-reduziert'],
    avoidIngredients: ['minderwertige Proteine', 'hohe Phosphatmengen', 'überschüssiges Natrium'],
  },
  {
    slug: 'leberprobleme',
    name: 'Leberprobleme',
    description: 'Lebererkrankungen können angeboren oder erworben sein. Die Ernährung spielt eine entscheidende Rolle in der Therapie.',
    symptoms: ['Gelbliche Schleimhäute', 'Gewichtsverlust', 'Erbrechen', 'Apathie', 'aufgeblähter Bauch'],
    feedingApproach: 'Leber-Diätfutter: leicht verdauliche Proteine, reduzierter Fettgehalt, Antioxidantien. Spezial-Diät vom Tierarzt empfohlen.',
    recommendedFoodTypes: ['leber-diaet', 'leichtverdaulich'],
    avoidIngredients: ['Kupferreiche Zutaten', 'überschüssiges Eiweiß'],
  },
  {
    slug: 'diabetes',
    name: 'Diabetes mellitus',
    description: 'Hunde-Diabetes ist eine chronische Erkrankung, die durch angepasstes Futter und Insulin gut kontrollierbar ist.',
    symptoms: ['Übermäßiger Durst', 'häufiges Urinieren', 'Gewichtsverlust trotz Appetit', 'Müdigkeit', 'trübe Augen'],
    feedingApproach: 'Diabetes-Diät: hoher Ballaststoffanteil, niedriger glykämischer Index, komplexe Kohlenhydrate. Feste Fütterungszeiten KRITISCH.',
    recommendedFoodTypes: ['diabetes-diaet', 'ballaststoffreich'],
    avoidIngredients: ['Zucker', 'Honig', 'Maissirup', 'Süßigkeiten', 'einfache Kohlenhydrate'],
  },
  {
    slug: 'pankreatitis',
    name: 'Pankreatitis (Bauchspeicheldrüsenentzündung)',
    description: 'Akute oder chronische Entzündung der Bauchspeicheldrüse. Häufig durch zu fettiges Essen ausgelöst.',
    symptoms: ['Erbrechen', 'starke Bauchschmerzen', 'Appetitlosigkeit', 'Fieber', 'Lethargie'],
    feedingApproach: 'Fettarmes Diätfutter (<10 % Fett), leicht verdauliche Proteine, mehrere kleine Mahlzeiten. Lebenslange Diät bei chronischer Pankreatitis.',
    recommendedFoodTypes: ['low-fat', 'sensitive', 'pankreas-diaet'],
    avoidIngredients: ['fettige Zutaten', 'Speisereste', 'Wurst', 'Snacks'],
  },
  {
    slug: 'haut-und-fell',
    name: 'Haut- und Fellprobleme',
    description: 'Stumpfes Fell, Schuppen, Juckreiz oder Haarausfall sind oft Symptome einer suboptimalen Ernährung. Mit dem richtigen Futter lässt sich viel erreichen.',
    symptoms: ['Stumpfes Fell', 'Schuppen', 'Juckreiz', 'übermäßiges Kratzen', 'Haarausfall', 'rote Hautstellen'],
    feedingApproach: 'Hochwertiges Futter mit Omega-3 (EPA/DHA), Zink, Biotin und Vitamin E. Bei Allergie-Verdacht: Monoprotein und hypoallergen.',
    recommendedFoodTypes: ['fell-und-haut', 'omega-3-reich', 'hypoallergen'],
    avoidIngredients: ['minderwertige Fette', 'künstliche Farbstoffe', 'allergene Proteine'],
  },
  {
    slug: 'zahnsteine',
    name: 'Zahnsteine & Zahnhygiene',
    description: 'Zahnsteine, Zahnfleischentzündungen und Mundgeruch betreffen 80 % der Hunde über 3 Jahre. Die Ernährung kann hier viel präventiv leisten.',
    symptoms: ['Mundgeruch', 'gelbliche Beläge an Zähnen', 'gerötetes Zahnfleisch', 'Kauen erschwert', 'verminderter Appetit'],
    feedingApproach: 'Trockenfutter mit speziellen Zahnpflegestrukturen (große Pellets mit Faserstruktur). Dentalsticks ergänzend. Bei Bedarf professionelle Zahnreinigung beim Tierarzt.',
    recommendedFoodTypes: ['dental', 'trockenfutter-special'],
    avoidIngredients: ['zuckerhaltige Snacks', 'klebrige Konsistenzen'],
  },
]

async function main() {
  console.log('🐕 BELLA — Probleme-Seed startet')
  console.log(`📊 Anzahl Probleme: ${issues.length}`)

  for (const issue of issues) {
    try {
      await db.insert(healthIssues).values(issue as any).onConflictDoUpdate({
        target: healthIssues.slug,
        set: issue as any,
      })
      console.log(`✅ ${issue.name}`)
    } catch (err: any) {
      console.error(`❌ ${issue.name}: ${err.message}`)
    }
  }

  console.log(`\n🐕 ${issues.length} Probleme erfolgreich in DB geschrieben`)
  process.exit(0)
}

main().catch(err => { console.error(err); process.exit(1) })
