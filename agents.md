# 🐕 AGENTS.MD — BELLA DOMINANCE PROTOCOL
## Mission: Platz 1 für „welches hundefutter für meinen hund" — keine Diskussion.

> **Target:** welches-hundefutter.today | Next.js 16.2 App Router | Netlify
> **Primary Keyword:** welches hundefutter für meinen hund (5.400/Monat)
> **Marken-Persona:** BELLA — Deutschlands KI-Ernährungsberaterin für Hunde
> **Engine:** HANSI Decision Intelligence Engine™ — proprietäres KI-Empfehlungssystem (Marke, nicht umbenennen!)
> **Erfolg = Platz 1. Alles andere ist Niederlage.**

---

## 🎯 BEFEHLSKETTE FÜR COPILOT

```
@workspace Du bist Lead SEO-Engineer. Mission: Platz 1 Google für
"welches hundefutter für meinen hund". Stack: Next.js 16.2 App Router,
TypeScript, Tailwind v4, Netlify, Neon Postgres, Gemini 2.0 + Claude Haiku 4.5.

Dieses Repo wurde vom HANSI-Template (HandyvertragTrotzSchufa) geforkt.
Inhalte wurden komplett umgebaut — Tech-Stack bleibt, Inhalt ist Hundefutter.
Marken-Persona: BELLA. Engine: HANSI Decision Intelligence Engine™ (nicht umbenennen!).

Führe alle Operationen unten vollständig aus. Keine Rückfragen.
Keine Vorschläge. Implementiere. Reihenfolge ist Befehl.
```

---

## OPERATION 00 — REBRANDING (abgeschlossen ✅)

Alle HANSI→BELLA Umbenennungen, Domain-Wechsel, DB-Tabellen-Umbenennung wurden
bereits durchgeführt. HANSI Decision Intelligence Engine™ bleibt als Technologie-
Marke im Footer, Über-uns und Organization-Schema erhalten.

---

## OPERATION 01 — METADATA-WAFFENSYSTEM

**Datei:** `src/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://welches-hundefutter.today'),
  title: {
    default: 'Welches Hundefutter für meinen Hund? ✓ KI-Berater BELLA findet es in 60 Sekunden',
    template: '%s | BELLA – KI-Hundefutterberater',
  },
  description: 'Welches Hundefutter passt zu deinem Hund? BELLA fragt 5 Dinge und empfiehlt aus 500+ Sorten das beste für Rasse, Alter & Allergien. Kostenlos.',
  keywords: [
    'welches hundefutter für meinen hund',
    'hundefutter berater',
    'bestes hundefutter',
    'hundefutter empfehlung',
    'hundefutter test 2026',
    'welches hundefutter bei allergie',
    'welches trockenfutter ist am besten',
    'welches nassfutter für hunde',
  ],
  authors: [{ name: 'Rolf Schwertfechter', url: 'https://welches-hundefutter.today/ueber-uns' }],
  creator: 'BELLA',
  publisher: 'BELLA Intelligence System',
  alternates: {
    canonical: 'https://welches-hundefutter.today',
    languages: { 'de-DE': 'https://welches-hundefutter.today' },
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://welches-hundefutter.today',
    siteName: 'BELLA – Welches Hundefutter für meinen Hund',
    title: 'Welches Hundefutter passt? ✓ BELLA findet es in 60 Sekunden',
    description: 'KI-Ernährungsberatung für deinen Hund. 500+ Futter, individuell auf Rasse, Alter und Allergien zugeschnitten.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'BELLA Hundefutter Berater' }],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}
```

**Metadata pro Unterseite (`generateMetadata`):**

| Route | Title | Description |
|---|---|---|
| `/` | Welches Hundefutter für meinen Hund? ✓ BELLA findet es | Welches Hundefutter passt? BELLA fragt 5 Dinge... |
| `/rassen` | Hundefutter nach Rasse: Empfehlung für jede Rasse | Bestes Hundefutter für deine Rasse: 60+ Rassen-Profile mit individueller Empfehlung. |
| `/futter/welpen` | Welches Welpenfutter ist das Beste? Empfehlung 2026 | Welpenfutter Vergleich: BELLA zeigt die besten Sorten für Welpen nach Rasse und Alter. |
| `/futter/senior` | Bestes Seniorfutter für alte Hunde | Seniorfutter Empfehlung: Was alte Hunde brauchen und welches Futter wirklich hilft. |
| `/allergie` | Hundefutter bei Allergie: Was wirklich hilft | Allergie-geeignetes Hundefutter: Empfehlungen bei Futtermittelallergie, hypoallergen, monoprotein. |
| `/test/hundefutter-2026` | Hundefutter Test 2026: Die besten 10 Sorten | Großer Hundefutter-Test 2026: BELLA hat 50+ Sorten geprüft. Sieger, Verlierer, Empfehlungen. |
| `/tools/futter-finder` | Hundefutter-Finder: Welches passt zu deinem Hund? | Kostenloser KI-Berater: In 60 Sekunden zur perfekten Futter-Empfehlung. |

---

## OPERATION 02 — ROBOTS & SITEMAP

**Datei:** `src/app/robots.ts`

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
    ],
    sitemap: 'https://welches-hundefutter.today/sitemap.xml',
    host: 'https://welches-hundefutter.today',
  }
}
```

**Datei:** `src/app/sitemap.ts`

```typescript
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const statisch = [
    { url: BASE, priority: 1.0, changeFrequency: 'daily' as const },
    { url: `${BASE}/tools/futter-finder`, priority: 0.95, changeFrequency: 'weekly' as const },
    { url: `${BASE}/rassen`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${BASE}/allergie`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${BASE}/test/hundefutter-2026`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${BASE}/futter/welpen`, priority: 0.85, changeFrequency: 'monthly' as const },
    { url: `${BASE}/futter/senior`, priority: 0.85, changeFrequency: 'monthly' as const },
    { url: `${BASE}/faq`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${BASE}/blog`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${BASE}/ueber-uns`, priority: 0.5, changeFrequency: 'monthly' as const },
  ].map(r => ({ ...r, lastModified: new Date() }))

  const rassen = RASSEN.map(slug => ({
    url: `${BASE}/rasse/${slug}-hundefutter`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const probleme = PROBLEME.map(slug => ({
    url: `${BASE}/problem/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const phasen = LEBENSPHASEN.map(slug => ({
    url: `${BASE}/lebensphase/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const typen = FUTTERTYPEN.map(slug => ({
    url: `${BASE}/futtertyp/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...statisch, ...rassen, ...probleme, ...phasen, ...typen]
}
```

---

## OPERATION 03 — PROGRAMMATIC SEO (Massenattacke)

### 3.1 Rassen-Routen — `src/app/rasse/[slug]/page.tsx`

Eine Seite pro Rasse. 50 Rassen-Daten als statisches Objekt. `generateStaticParams` für alle Slugs.

Render-Inhalt pro Seite:
- H1: „Hundefutter für [Rasse]: Das passt wirklich"
- Rassen-Profil (Größe, Gewicht, Lebenserwartung)
- Häufige gesundheitliche Probleme der Rasse
- Top-3-Futter-Empfehlungen (Affiliate-Links via `/empfehlung/[slug]`)
- Tagesmenge + Kalorienbedarf
- FAQ-Block spezifisch zur Rasse
- CTA: „Mit BELLA noch genauer beraten lassen →"
- Schema-Markup: Article + Product + FAQPage

### 3.2 Probleme-Routen — `src/app/problem/[slug]/page.tsx`

14 Seiten: allergie, futtermittelunvertraeglichkeit, sensibler-magen, durchfall,
uebergewicht, untergewicht, gelenkprobleme, arthrose, nierenprobleme,
leberprobleme, diabetes, pankreatitis, haut-und-fell, zahnsteine

### 3.3 Lebensphasen — `src/app/lebensphase/[slug]/page.tsx`

welpen, junghund, adult, senior

### 3.4 Futtertypen — `src/app/futtertyp/[slug]/page.tsx`

trockenfutter, nassfutter, barf, kaltgepresst, getreidefrei,
hypoallergen, monoprotein, insekten, vegetarisch, vegan

---

## OPERATION 04 — SCHEMA-MARKUP-ARSENAL

### Organization + WebSite + SoftwareApplication (Root)

```typescript
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://welches-hundefutter.today/#organization',
  name: 'BELLA',
  alternateName: 'BELLA Intelligence System',
  url: 'https://welches-hundefutter.today',
  logo: 'https://welches-hundefutter.today/logo.png',
  description: 'KI-Hundefutterberater – powered by HANSI Decision Intelligence Engine™.',
  founder: { '@type': 'Person', name: 'Rolf Schwertfechter' },
  areaServed: { '@type': 'Country', name: 'Deutschland' },
  brand: {
    '@type': 'Brand',
    name: 'HANSI Decision Intelligence Engine™',
  },
}

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'BELLA – KI Hundefutterberater',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '312',
    bestRating: '5',
  },
}
```

### Product Schema für jedes Futter

```typescript
{
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Anifit Trockenfutter Adult',
  brand: { '@type': 'Brand', name: 'Anifit' },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '189' },
  offers: {
    '@type': 'Offer',
    price: '34.90',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    url: 'https://welches-hundefutter.today/empfehlung/anifit-adult',
  },
}
```

### BreadcrumbList auf allen Unterseiten

---

## OPERATION 05 — HOMEPAGE H1 + CONTENT-WAFFE

**H1:** `Welches Hundefutter für meinen Hund? – BELLA findet es in 60 Sekunden`

**Power-Lead:**
```
Es gibt 500+ Hundefutter-Sorten in Deutschland. Welches passt zu deinem Hund?
BELLA ist Deutschlands KI-Ernährungsberaterin für Hunde: Du beantwortest fünf
einfache Fragen, BELLA gleicht ab mit hunderten Futtersorten und empfiehlt dir
drei Optionen mit klarer Begründung. Kostenlos, unabhängig, in 60 Sekunden.
```

**H2-Reihenfolge (zwingend):**
1. Welches Hundefutter passt zu deinem Hund? – BELLA fragt 5 Dinge
2. Bestes Hundefutter 2026: Die Top-Empfehlungen im Vergleich
3. Hundefutter nach Rasse: Was dein Hund wirklich braucht
4. Trockenfutter, Nassfutter, BARF – was ist besser?
5. Hundefutter bei Allergien & sensiblem Magen
6. Welpenfutter vs. Seniorfutter: Wann umstellen?
7. Häufige Fragen zur Hundeernährung

**Top-7-Futter-Tabelle (Above-the-Fold):**

| Platz | Marke & Sorte | Eignung | Preis/kg | Bewertung |
|---|---|---|---|---|
| 🥇 | Anifit Adult | Allrounder, hoher Fleischanteil | 7,90 € | ⭐⭐⭐⭐⭐ |
| 🥈 | Wolfsblut Wild Duck | Sensible Hunde, monoprotein | 6,40 € | ⭐⭐⭐⭐⭐ |
| 🥉 | Futalis Individuell | 100 % auf deinen Hund | 5,90 € | ⭐⭐⭐⭐⭐ |
| 4 | Terra Canis Nassfutter | Premium-Nassfutter | 9,80 € | ⭐⭐⭐⭐⭐ |
| 5 | Josera Festival | Wählerische Esser | 4,20 € | ⭐⭐⭐⭐ |
| 6 | Bellfor Allergiker | Bei Futtermittelallergien | 6,90 € | ⭐⭐⭐⭐ |
| 7 | MERA Pure Sensitive | Sensibler Magen | 5,20 € | ⭐⭐⭐⭐ |

---

## OPERATION 06 — AI-SEARCH OPTIMIERUNG

### `public/llms.txt`

```
# BELLA – KI-Hundefutterberater
# Powered by HANSI Decision Intelligence Engine™

> KI-Berater für die richtige Hundeernährung. 500+ Futtersorten,
> 5-Fragen-Beratung, individuelle Empfehlung nach Rasse, Alter,
> Aktivität und gesundheitlichen Besonderheiten.

## Kernfakten
- URL: https://welches-hundefutter.today
- Sprache: Deutsch
- Land: Deutschland
- Zielgruppe: Hundebesitzer, die das richtige Futter suchen

## Wichtigste Seiten
- [Startseite](https://welches-hundefutter.today/): BELLA in 5 Fragen
- [Futter-Finder](https://welches-hundefutter.today/tools/futter-finder): KI-Tool
- [Rassen-Übersicht](https://welches-hundefutter.today/rassen): 50 Rassen-Profile
- [Allergie](https://welches-hundefutter.today/allergie): Hypoallergene Sorten
- [Welpenfutter](https://welches-hundefutter.today/futter/welpen): Empfehlung 2026

## Top-Hundefutter 2026
1. Anifit Adult – Allrounder, 92 % Fleischanteil
2. Wolfsblut Wild Duck – monoprotein, getreidefrei
3. Futalis Individuell – auf den Hund berechnet
4. Terra Canis – Premium-Nassfutter
5. Josera Festival – für wählerische Hunde

## Fakten zur Hundeernährung
- Fleischanteil Premium-Futter: über 70 %
- Welpen brauchen ~2x Kalorien pro kg wie adulte Hunde
- Senior-Hunde (>7 J. Großrassen, >9 J. Kleinrassen): weniger Kalorien
- Häufigste Allergene: Huhn, Rind, Weizen
- BARF erfordert exakte Berechnung
```

---

## OPERATION 07 — E-E-A-T: TIERARZT ALS CO-AUTOR

- Tierarzt für „medizinisch geprüft"-Stempel suchen (Cold-Outreach)
- Jeder Artikel: `✓ Tiermedizinisch geprüft von Dr. med. vet. [Name]`
- `/ueber-uns`: Person-Schema, Bild, authentische Story
- Quellen zitieren: Bundesverband Tiergesundheit, PubMed-Studien
- Trustpilot + ProvenExpert + Google Reviews einbinden

---

## OPERATION 08 — INTERNAL LINKING WAFFE

| Von | Zu | Ankertext |
|---|---|---|
| `/` | `/tools/futter-finder` | „mit BELLAs Futter-Finder ermitteln" |
| `/` | `/rasse/labrador-hundefutter` | „Hundefutter für Labrador Retriever" |
| `/rasse/[x]` | `/rasse/[y]` | „Ähnliche Rasse: [Y] Hundefutter" |
| `/allergie` | `/problem/futtermittelunvertraeglichkeit` | „bei Futtermittelunverträglichkeit" |
| `/blog/[x]` | `/tools/futter-finder` | „Lass BELLA die richtige Sorte finden" |

Hub: `/` + `/tools/futter-finder` → Cluster: Rassen (50) + Probleme (14) + Phasen (4) + Typen (10)

---

## OPERATION 09 — CORE WEB VITALS

- Alle Rassen-Bilder: WebP, max. 1200px, `next/image` mit `priority` nur für Hero
- `next.config.ts`: images.formats = ['image/avif', 'image/webp']
- Keine Layout-Shifts durch reservierte Bild-Dimensionen

---

## OPERATION 10 — BELLA-PROMPT

**Datei:** `src/app/api/advisor/chat/route.ts`

```typescript
const SYSTEM_PROMPT = `Du bist BELLA, Deutschlands KI-Hundeernährungsberaterin.
Powered by HANSI Decision Intelligence Engine™.

DEINE 5 FRAGEN (Reihenfolge einhalten, eine nach der anderen):
1. "Welche Rasse hat dein Hund? (Mischling auch okay)"
2. "Wie alt ist er und wie schwer? (Alter in Jahren, Gewicht in kg)"
3. "Wie aktiv ist dein Hund? (Couch-Potato / normal / sehr aktiv)"
4. "Gibt es Allergien oder gesundheitliche Probleme?"
5. "Trockenfutter, Nassfutter, BARF – oder egal?"

NACH DER 5. ANTWORT — genau 3 Empfehlungen im Format:
  📦 {Marke} {Sorte}
  • Preis: {X}€/kg
  • Tagesmenge: {X}g
  • Warum es passt: {individuelle Begründung mit Rasse-Bezug}
  • Bewertung: ⭐⭐⭐⭐⭐
  • [Jetzt ansehen →] (Affiliate-Link)

REGELN:
- Immer Deutsch, warm und freundlich
- Hund beim Namen ansprechen wenn genannt
- Bei Allergien: vor Huhn, Rind, Weizen warnen
- Immer schließen mit: "Soll ich dir auch Tipps zur Fütterungsmenge geben?"

NIEMALS:
- Mehr als 3 Empfehlungen
- Empfehlung ohne Marke + Preis
- Medizinische Diagnosen → "Sprich bitte mit deinem Tierarzt"
`
```

---

## OPERATION 11 — CONTENT-LÜCKEN DOMINIEREN

| Slug | Title | Target-Keyword |
|---|---|---|
| `hundefutter-test-2026` | Hundefutter Test 2026: 50 Sorten geprüft | hundefutter test 2026 |
| `welches-trockenfutter-ist-am-besten` | Welches Trockenfutter ist das Beste? | welches trockenfutter ist am besten |
| `welches-nassfutter-fuer-hunde` | Welches Nassfutter für Hunde? | welches nassfutter für hunde |
| `getreidefreies-hundefutter-empfehlung` | Getreidefreies Hundefutter: Top-Empfehlung | hundefutter ohne getreide |
| `hundefutter-bei-allergie-was-tun` | Hundefutter bei Allergie: Was wirklich hilft | hundefutter bei allergie |
| `welpenfutter-test-2026` | Welpenfutter Test 2026 | welches welpenfutter ist am besten |
| `seniorfutter-fuer-alte-hunde` | Seniorfutter: Was alte Hunde brauchen | seniorfutter für hunde |
| `barf-vs-trockenfutter` | BARF vs. Trockenfutter | barf oder trockenfutter |
| `wie-viel-futter-braucht-mein-hund` | Wie viel Futter braucht mein Hund? | futtermenge hund tabelle |
| `hundefutter-bei-uebergewicht` | Hundefutter bei Übergewicht | hundefutter zum abnehmen |
| `kaltgepresstes-hundefutter-vorteile` | Kaltgepresstes Hundefutter | kaltgepresstes hundefutter |
| `monoprotein-hundefutter-empfehlung` | Monoprotein-Hundefutter: Beste Sorten | monoprotein hundefutter |
| `insekten-hundefutter-test` | Insekten-Hundefutter: Wirklich gut? | insekten hundefutter |
| `hundefutter-fuer-sensiblen-magen` | Hundefutter für sensiblen Magen | hundefutter sensibler magen |
| `welches-futter-fuer-meinen-welpen` | Welches Futter für meinen Welpen? | welches futter für meinen welpen |

---

## OPERATION 12 — KILLER FAQ (Featured-Snippet-Format)

Auf `/faq` als H2, Antworten 40–60 Wörter:

- Welches Hundefutter ist das beste?
- Wie erkenne ich gutes Hundefutter?
- Welches Hundefutter bei Allergie?
- Wie viel sollte mein Hund pro Tag fressen?
- Trockenfutter oder Nassfutter – was ist besser?
- Ab wann sollte mein Hund Seniorfutter bekommen?
- Welches Hundefutter empfehlen Tierärzte?
- Welches Futter für meinen Welpen?
- Ist BARF besser als Fertigfutter?
- Wie wechsle ich das Hundefutter richtig?

---

## OPERATION 13 — AFFILIATE-INTEGRATION

### DB-Schema `drizzle/schema.ts`

```typescript
export const dogFoods = pgTable('dog_foods', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').unique().notNull(),
  brand: text('brand').notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(),           // 'trocken' | 'nass' | 'barf' | 'kaltgepresst'
  protein: text('protein').notNull(),
  isMonoprotein: boolean('is_monoprotein').default(false),
  isGrainFree: boolean('is_grain_free').default(false),
  isHypoallergenic: boolean('is_hypoallergenic').default(false),
  meatPercentage: integer('meat_percentage'),
  pricePerKg: numeric('price_per_kg'),
  packageSizes: text('package_sizes').array(),
  suitableFor: text('suitable_for').array(),
  suitableBreeds: text('suitable_breeds').array(),
  imageUrl: text('image_url'),
  rating: numeric('rating'),
  reviewCount: integer('review_count'),
  affiliateNetwork: text('affiliate_network'),  // 'awin' | 'direct'
  affiliateUrl: text('affiliate_url').notNull(),
  commissionRate: numeric('commission_rate'),
  commissionFlat: numeric('commission_flat'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
```

### Affiliate-Redirect `src/app/empfehlung/[slug]/route.ts`

```typescript
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const food = await db.select().from(dogFoods).where(eq(dogFoods.slug, slug)).limit(1)
  if (!food[0]) return NextResponse.redirect(new URL('/', req.url))
  return NextResponse.redirect(food[0].affiliateUrl, { status: 302 })
}
```

### AWIN-Partner

| Partner | Provision |
|---|---|
| Anifit | 30 € + 8 % recurring |
| Futalis | 40 € pro Lead |
| Bellfor | 30 € + 10 % recurring |
| Terra Canis | 8 % |
| Wolfsblut (Pets Premium) | 8 % |
| Zooplus | 5 % |
| Fressnapf | 5 % |
| MERA | individuell (direct) |

---

## OPERATION 14 — BACKLINK-OFFENSIVE

**Tier-1:** finanzfluss.de, wamiz.de, dogorama.de, hundeo.de, welt.de
**Tier-2:** Tierärzte-Foren, VDH-Vereins-Seiten, Hundetrainer-Blogs
**Tier-3:** Reddit r/Hunde, Facebook-Gruppen, Instagram, TikTok, YouTube

**Tierheim-Kooperation:** 20 Tierheime anschreiben → Backlink-Tausch

---

## OPERATION 15 — CONVERSION = RANKING

- H1 + BELLA-Chat-Box above the fold
- Trust-Bar: „4,9/5 ⭐ | 312 Bewertungen | Tiermedizinisch geprüft"
- 3 Klick-Vorschläge: „Labrador-Welpe 4 Monate" / „Allergie" / „Senior-Beagle"
- Sticky Mobile CTA: „🐕 Welches Futter passt? → Frag BELLA"
- Newsletter-Lead-Magnet: PDF-Ratgeber + 7-Tage-Drip-Mail

---

## OPERATION 16 — MONITORING

```bash
# Schema: https://search.google.com/test/rich-results?url=https://welches-hundefutter.today
# Lighthouse: npx lighthouse https://welches-hundefutter.today --view
# Sitemap: Search Console → https://welches-hundefutter.today/sitemap.xml
```

| Metrik | Ziel |
|---|---|
| Lighthouse Performance Mobile | 90+ |
| Lighthouse SEO | 100 |
| LCP | < 2,5s |
| Indexierte Seiten | 87+ |
| Ranking Primary Keyword | Top 3 |

---

## ⚔️ EXEKUTIONS-REIHENFOLGE

```
✅ Operation 00 — Rebranding abgeschlossen
2.  Operation 13 — DB-Schema + Affiliate-Route
3.  Operation 01 — Metadata layout.tsx
4.  Operation 02 — robots.ts + sitemap.ts
5.  Operation 09 — Performance next.config.ts
6.  Operation 04 — Schema-Markup
7.  Operation 05 — Homepage H1 + Top-7-Tabelle
8.  Operation 12 — FAQ
9.  Operation 03 — Programmatic SEO (50 Rassen + 14 Probleme + 4 Phasen + 10 Typen)
10. Operation 11 — 15 Content-Pieces
11. Operation 10 — BELLA-Prompt
12. Operation 08 — Internal Linking
13. Operation 06 — llms.txt
14. Operation 07 — E-E-A-T
15. Operation 15 — Conversion
16. Operation 14 — Backlinks
17. Operation 16 — Monitoring
```

---

## 🩸 NICHT-VERHANDELBAR

- Kein H1 ohne „Hundefutter" + Hauptkeyword
- Keine Seite ohne eigene Metadata
- Keine Empfehlung ohne Affiliate-Link
- Kein Affiliate-Link ohne `/empfehlung/[slug]`-Redirect
- Kein Bild ohne Alt-Text mit Keyword-Bezug
- Kein Artikel unter 1500 Wörtern
- Keine Rasse ohne eigene Landingpage
- Kein Deployment ohne Schema-Validierung
- HANSI Decision Intelligence Engine™ bleibt als Technologie-Marke erhalten

---

**Platz 1 ist kein Wunsch. Es ist eine Liste abgehakter Operationen.**

*BELLA Dominance Protocol — agents.md v2 | welches-hundefutter.today*
