import { MetadataRoute } from 'next'
import { CITIES } from '@/data/cities'
import { BREEDS } from '@/data/breeds'
import { TIP_CATEGORIES } from '@/data/tips'

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

export default function sitemap(): MetadataRoute.Sitemap {
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

  const staedte: MetadataRoute.Sitemap = CITIES.map((c) => ({
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

  return [...statisch, ...alleRassen, ...staedte, ...probleme, ...phasen, ...typen, ...tipps, ...tippArtikel]
}
