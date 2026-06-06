import { MetadataRoute } from 'next'

const BASE = 'https://welches-hundefutter.today'

const RASSEN = [
  'labrador-retriever', 'golden-retriever', 'franzoesische-bulldogge', 'deutscher-schaeferhund',
  'jack-russell-terrier', 'chihuahua', 'beagle', 'mops', 'dackel', 'border-collie',
  'australian-shepherd', 'cocker-spaniel', 'malteser', 'rottweiler', 'boxer',
  'yorkshire-terrier', 'shih-tzu', 'havaneser', 'pudel', 'zwergpinscher',
  'cavalier-king-charles', 'berner-sennenhund', 'dobermann', 'bordeauxdogge', 'dogo-argentino',
  'rhodesian-ridgeback', 'magyar-vizsla', 'weimaraner', 'dalmatiner', 'samojede',
  'siberian-husky', 'alaskan-malamute', 'shiba-inu', 'akita-inu', 'chow-chow',
  'pekinese', 'lhasa-apso', 'bichon-frise', 'whippet', 'greyhound',
  'irish-setter', 'english-setter', 'pointer', 'spaniel', 'labradoodle',
  'goldendoodle', 'maltipoo', 'cavapoo', 'cockapoo', 'bernedoodle',
]

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
    { url: `${BASE}/allergie`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/test/hundefutter-2026`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/futter/welpen`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/futter/senior`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/faq`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/analyse/preisindex-2026`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/analyse/methodik`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/vergleich`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/vergleich/trockenfutter-vs-nassfutter`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/vergleich/barf-vs-trockenfutter`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/blog/hundefutter-test-2026`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
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

  const rassen: MetadataRoute.Sitemap = RASSEN.map(slug => ({
    url: `${BASE}/rasse/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

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

  return [...statisch, ...rassen, ...probleme, ...phasen, ...typen]
}
