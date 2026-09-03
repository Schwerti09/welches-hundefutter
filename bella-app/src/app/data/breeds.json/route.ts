import { BREEDS } from "@/data/breeds";

export const revalidate = 86400;

export function GET() {
  const payload = {
    source: "welches-hundefutter.today",
    license: "CC-BY-4.0",
    description: "Alle Rassenprofile mit Ernährungsempfehlungen und Gesundheitsrisiken — täglich neu generiert.",
    generatedAt: new Date().toISOString(),
    totalBreeds: BREEDS.length,
    fields: {
      slug: "URL-Slug für /rasse/[slug]",
      name: "Rassenname (Deutsch)",
      size: "Größenkategorie: winzig | klein | mittel | gross | sehrgross",
      weightMin: "Mindestgewicht in kg",
      weightMax: "Maximalgewicht in kg",
      lifeExpectancy: "Durchschnittliche Lebenserwartung in Jahren",
      activityLevel: "Aktivitätslevel: niedrig | mittel | hoch | sehrhoch",
      commonHealthIssues: "Häufige Gesundheitsprobleme der Rasse",
      recommendedProteinPercentage: "Empfohlener Mindest-Proteingehalt im Trockenfutter (%)",
      recommendedFatPercentage: "Empfohlener Mindest-Fettgehalt im Trockenfutter (%)",
      feedingNotes: "Rassenspezifische Fütterungshinweise",
      url: "Seite auf welches-hundefutter.today",
    },
    breeds: BREEDS.map((b) => ({
      slug: b.slug,
      name: b.name,
      alternativeNames: b.alternativeNames ?? [],
      size: b.size,
      weightMin: b.weightMin ?? null,
      weightMax: b.weightMax ?? null,
      lifeExpectancy: b.lifeExpectancy ?? null,
      activityLevel: b.activityLevel ?? null,
      commonHealthIssues: b.commonHealthIssues ?? [],
      recommendedProteinPercentage: b.recommendedProteinPercentage ?? null,
      recommendedFatPercentage: b.recommendedFatPercentage ?? null,
      feedingNotes: b.feedingNotes ?? null,
      url: `https://welches-hundefutter.today/rasse/${b.slug}`,
    })),
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
