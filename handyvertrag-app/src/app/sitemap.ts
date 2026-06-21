import { MetadataRoute } from 'next'
import { CITIES } from '@/data/cities'
import { BREEDS } from '@/data/breeds'
import { TIP_CATEGORIES } from '@/data/tips'
import { getBrandsWithCounts } from '@/db/queries/foods'

const BASE = 'https://welches-hundefutter.today'

const PROBLEME = [
  'allergie', 'futtermittelunvertraeglichkeit', 'sensibler-magen', 'durchfall',
  'uebergewicht', 'untergewicht', 'gelenkprobleme', 'arthrose', 'nierenprobleme',
  'leberprobleme', 'diabetes', 'pankreatitis', 'haut-und-fell', 'zahnsteine',
]

const LEBENSPHASEN = ['welpen', 'junghund', 'adult', 'senior']

const FUTTERTYPEN = [
  'trockenfutter', 'nassfutter', 'barf', 'kaltgepresst', 'getreidefrei',
  'hypoallergen', 'monoprotein', 'insekten', 'vegetarisch', 'vegan',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const statisch: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/tools/futter-finder`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE}/rassen`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/problem/allergie`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/blog/hundefutter-test-2026`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/lebensphase/welpen`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/lebensphase/senior`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/faq`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/tipps`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/analyse/preisindex-2026`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${BASE}/analyse/methodik`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/data/hundefutter-report`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE}/data/catalog.json`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE}/vergleich`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/vergleich/trockenfutter-vs-nassfutter`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/vergleich/barf-vs-trockenfutter`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/vergleich/nassfutter-vs-barf`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/vergleich/kaltgepresst-vs-extrudiert`, lastModified: now, changeFrequency: 'monthly', priority: 0.82 },
    { url: `${BASE}/vergleich/monoprotein-vs-mehrkomponenten`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/vergleich/getreidefrei-vs-mit-getreide`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/vergleich/premium-vs-budget`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/vergleich/insektenfutter-vs-huehnchen`, lastModified: now, changeFrequency: 'monthly', priority: 0.82 },
    { url: `${BASE}/mein-hund`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/warum-bella`, lastModified: now, changeFrequency: 'monthly', priority: 0.92 },
    { url: `${BASE}/hundefutter-test`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/hundefutter-marken`, lastModified: now, changeFrequency: 'daily', priority: 0.88 },
    { url: `${BASE}/blog/preisbarometer-2026`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/blog/marken-ranking-bella-score`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/blog/marktbericht-hundefutter-2026`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/blog/barf-hund-anfaenger`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/blog/hund-uebergewicht-futter`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/blog/hundefutter-allergie-hund`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/ueber-uns`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/quellen`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/impressum`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/datenschutz`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/affiliate`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/agb`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const probleme: MetadataRoute.Sitemap = PROBLEME.map(slug => ({
    url: `${BASE}/problem/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const phasen: MetadataRoute.Sitemap = LEBENSPHASEN.map(slug => ({
    url: `${BASE}/lebensphase/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const typen: MetadataRoute.Sitemap = FUTTERTYPEN.map(slug => ({
    url: `${BASE}/futtertyp/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Nur indexierbare Großstädte (≥100k) in die Sitemap — der Rest ist noindex
  // (Doorway-Schutz) und gehört damit nicht in die Sitemap.
  const staedte: MetadataRoute.Sitemap = CITIES.filter((c) => c.population >= 100000).map((c) => ({
    url: `${BASE}/stadt/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: c.population >= 500000 ? 0.85 : c.population >= 100000 ? 0.8 : c.population >= 50000 ? 0.75 : 0.7,
  }))

  const alleRassen: MetadataRoute.Sitemap = BREEDS.map((b) => ({
    url: `${BASE}/rasse/${b.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const tipps: MetadataRoute.Sitemap = TIP_CATEGORIES.map((c) => ({
    url: `${BASE}/tipps/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  // Einzelne Tipp-Artikel (Volltext-Seiten) für Kategorien, die welche haben
  const tippArtikel: MetadataRoute.Sitemap = TIP_CATEGORIES.flatMap((c) =>
    (c.articles ?? []).map((a) => ({
      url: `${BASE}/tipps/${c.slug}/${a.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  const WISSENS_HUBS = [
    'allergien', 'barf', 'trockenfutter', 'welpen',
    'senioren', 'uebergewicht', 'verdauung', 'nachhaltigkeit',
  ]

  const GLOSSAR_SLUGS = [
    'rct', 'meta-analyse', 'mikrobiom', 'dha', 'epa', 'aafco', 'fediaf',
    'oxidativer-stress', 'praebiotika', 'probiotika', 'hydrolysiertes-protein',
    'eliminationsdiat', 'eubiosis', 'dysbiosis', 'k9pbn', 'rmbd',
    'arachidonsaeure', 'fructosamin', 'verdaulichkeit', 'in-vitro', 'in-vivo',
    'cafr', 'cds', 'mct',
  ]

  const wissensuniversum: MetadataRoute.Sitemap = [
    { url: `${BASE}/studien`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/glossar`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    ...WISSENS_HUBS.map((slug) => ({
      url: `${BASE}/studien/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.78,
    })),
    ...GLOSSAR_SLUGS.map((slug) => ({
      url: `${BASE}/glossar/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
  ]

  const meinungsnetz: MetadataRoute.Sitemap = [
    { url: `${BASE}/meinungen`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.82 },
  ]

  const brandData = await getBrandsWithCounts(3)
  const marken: MetadataRoute.Sitemap = [
    { url: `${BASE}/marke`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.85 },
    ...brandData.map((b) => ({
      url: `${BASE}/marke/${b.slug}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    })),
  ]

  return [...statisch, ...alleRassen, ...staedte, ...probleme, ...phasen, ...typen, ...tipps, ...tippArtikel, ...wissensuniversum, ...meinungsnetz, ...marken]
}
