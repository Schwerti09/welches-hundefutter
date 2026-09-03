/**
 * Zutaten-Lexikon — neue Kategorie "Zutaten" im bestehenden glossary_terms.
 * Kuratiertes Nachschlagewerk zu häufigen, oft missverstandenen Hundefutter-
 * Zutaten — KEIN Per-Produkt-Scanner (wir haben keine vollständigen
 * Zutatenlisten pro Produkt, das würde Fakten erfinden).
 * Run:  DATABASE_URL="postgres://…" node scripts/seed-zutaten-lexikon.mjs
 */
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) { console.error("❌ DATABASE_URL fehlt"); process.exit(1); }
const sql = neon(url);

const ZUTATEN = [
  {
    slug: "tierische-nebenerzeugnisse",
    term: "Tierische Nebenerzeugnisse",
    definition: "Sammelbegriff für alle nicht zum Verzehr für Menschen bestimmten Teile vom Schlachttier — Innereien, Knochen, Häute, Federn. Per Gesetz nicht weiter aufgeschlüsselt.",
    explanation: "Klingt schlimmer als es oft ist: Innereien wie Leber oder Herz sind nährstoffreich und werden von Hunden in freier Wildbahn zuerst gefressen. Das Problem ist nicht der Begriff selbst, sondern die fehlende Transparenz — du weißt nicht, WELCHE Teile drin sind und in welchem Anteil. Ein klar benannter Proteinanteil (\"Huhn 30%\") ist deshalb aussagekräftiger, nicht automatisch \"gesünder\".",
    category: "Zutaten",
  },
  {
    slug: "zuckerruebenschnitzel",
    term: "Zuckerrübenschnitzel",
    definition: "Getrocknete Rückstände aus der Zuckerproduktion. Fast zuckerfrei, aber reich an löslichen und unlöslichen Ballaststoffen.",
    explanation: "Wird oft fälschlich als \"Zucker im Futter\" gefürchtet. Tatsächlich ist der Zucker längst extrahiert — übrig bleiben Ballaststoffe, die die Darmflora füttern und den Kot fester machen. Kein Warnsignal, aber auch kein Nährwert-Highlight: ein günstiger Füllstoff mit echtem Nutzen für die Verdauung.",
    category: "Zutaten",
  },
  {
    slug: "getreide-im-hundefutter",
    term: "Getreide (Weizen, Mais, Reis)",
    definition: "Kohlenhydratquellen, die in vielen Trockenfuttern Energie liefern und die Struktur der Extrudate (Kibbles) ermöglichen.",
    explanation: "Der \"getreidefrei = automatisch besser\"-Mythos hält sich hartnäckig, ist aber wissenschaftlich nicht belegt — echte Getreideallergien sind bei Hunden selten (häufiger sind Protein-Allergien auf Huhn oder Rind). Reis ist zudem leicht verdaulich und wird oft bei empfindlichem Magen empfohlen. Relevant wird Getreide nur bei einer ärztlich bestätigten Allergie auf genau dieses Getreide.",
    category: "Zutaten",
  },
  {
    slug: "sojaprotein",
    term: "Sojaprotein / Sojaschrot",
    definition: "Pflanzliche Proteinquelle aus Sojabohnen, oft als günstiger Ersatz oder Ergänzung zu tierischem Protein eingesetzt.",
    explanation: "Vollwertiges Protein mit gutem Aminosäureprofil — kein \"Billig-Trick\" per se. Kann aber bei manchen Hunden Blähungen verursachen und ist eine der häufigeren pflanzlichen Allergiequellen. Bei einem hohen Anteil lohnt sich ein Blick auf den Gesamt-Fleischanteil des Produkts.",
    category: "Zutaten",
  },
  {
    slug: "konservierungsstoffe-bha-bht",
    term: "BHA / BHT / Ethoxyquin",
    definition: "Synthetische Antioxidantien zur Haltbarmachung von Fetten in Trockenfutter. Ethoxyquin ist in der EU für Heimtierfutter nicht mehr zugelassen.",
    explanation: "BHA und BHT stehen seit Jahren in der Kritik, auch wenn die Zulassungsbehörden sie in den erlaubten Mengen als sicher einstufen. Wer das vermeiden will: Produkte mit natürlichen Alternativen (Tocopherole = Vitamin E, Rosmarinextrakt) suchen — steht meist klar in der Deklaration.",
    category: "Zutaten",
  },
  {
    slug: "lockstoffe-aromen",
    term: "Lockstoffe & Aromen",
    definition: "Zugesetzte Geschmacksstoffe (oft Fleischhydrolysat oder Hefeextrakt), die ein Futter für den Hund attraktiver machen sollen.",
    explanation: "An sich unbedenklich — Hunde riechen Futter anders als wir und brauchen oft einen Geschmacks-Kick, besonders bei wählerischen Essern. Kritisch wird es nur, wenn ein Futter OHNE diese Lockstoffe kaum gefressen würde — das ist ein Hinweis auf eine eher unattraktive Grundrezeptur, die durch Aroma \"übertüncht\" wird.",
    category: "Zutaten",
  },
  {
    slug: "farbstoffe-hundefutter",
    term: "Farbstoffe",
    definition: "Zusatzstoffe, die ausschließlich die optische Erscheinung des Futters für den Menschen beeinflussen — braune Kroketten statt grauer.",
    explanation: "Hunde sehen Farben anders als Menschen und ihnen ist die Farbe ihres Futters komplett egal. Farbstoffe haben für den Hund null Nutzen — sie existieren rein für die Kaufentscheidung des Halters im Regal. Ein klares Signal für ein eher marketinggetriebenes statt bedarfsorientiertes Produkt.",
    category: "Zutaten",
  },
  {
    slug: "tiermehl-fleischmehl",
    term: "Tiermehl vs. Fleischmehl",
    definition: "Tiermehl ist ein Sammelbegriff für getrocknete, gemahlene tierische Bestandteile ohne Artangabe. Fleischmehl mit Artangabe (\"Hühnermehl\") bezeichnet konkret welche Tierart und meist welcher Anteil Muskelfleisch enthalten ist.",
    explanation: "Der Unterschied ist reine Transparenz, nicht zwingend Qualität: ein gutes \"Hühnermehl\" ist hochkonzentriertes Protein (durch die Trocknung sogar proteinreicher als frisches Fleisch). \"Tiermehl\" ohne Artangabe ist das Gegenteil — du weißt schlicht nicht, was drin ist. Bei Allergikern ist die Artangabe deshalb nicht optional, sondern notwendig.",
    category: "Zutaten",
  },
];

for (const z of ZUTATEN) {
  await sql`
    INSERT INTO glossary_terms (slug, term, definition, explanation, category)
    VALUES (${z.slug}, ${z.term}, ${z.definition}, ${z.explanation}, ${z.category})
    ON CONFLICT (slug) DO UPDATE SET
      term = EXCLUDED.term, definition = EXCLUDED.definition,
      explanation = EXCLUDED.explanation, category = EXCLUDED.category
  `;
}

const t = await sql`SELECT count(*)::int n FROM glossary_terms WHERE category = 'Zutaten'`;
console.log(`✅ Zutaten-Lexikon bereit. ${t[0].n} Begriffe in Kategorie "Zutaten".`);
