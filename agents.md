# 🐕 BELLA BLUEPRINT — Tiefenanalyse + Vollständiger Implementierungsplan

> Zustand am Stichtag, finaler Zielzustand, exakte Migration dazwischen.
> Alles unter `agents.md` ist Strategie. Dieser Blueprint ist Mechanik.

---

# TEIL 1 — TIEFENANALYSE

## 1.1 Was IST im Repo

| Element | Status | Bemerkung |
|---|---|---|
| `README.md` | ✅ vorhanden | Auf BELLA gebrandet, klar |
| `agents.md` | ✅ vorhanden | Strategie steht, Operationen definiert |
| `netlify.toml` | ⚠️ HALB-FERTIG | Verweist noch auf `base = "handyvertrag-app"` |
| `.github/` | ✅ vorhanden | Vermutlich Copilot-Instructions |
| `handyvertrag-app/` | 🔴 FALSCHER NAME | Kompletter HANSI-Code drin |
| `.gitignore` | ✅ vorhanden | Standard |
| Domain | ⚠️ `.today` | Suboptimal aber Entscheidung getroffen |

## 1.2 Was IM `handyvertrag-app/` Ordner falsch ist

**Alles inhaltlich.** Der Code-Stack passt 1:1 — aber jeder einzelne String, jede Datenbank-Tabelle, jede Komponente, jeder System-Prompt ist auf Mobilfunkverträge ausgerichtet.

| Was | Aktuell (HANSI) | Soll (BELLA) |
|---|---|---|
| App-Folder | `handyvertrag-app/` | `bella-app/` |
| DB-Tabelle | `mobile_contracts` | `dog_foods` |
| Wrapper-Component | `HansiDecisionWrapper` | `BellaAdvisorWrapper` |
| System-Prompt | „Du bist HANSI, Handyvertrag-Berater..." | „Du bist BELLA, Hundeernährungsberaterin..." |
| API-Route | `/api/advisor/chat` (HANSI-Logik) | gleiche Route, BELLA-Logik |
| Routes | `/anbieter/*`, `/handy/*`, `/stadt/*` | `/futter/*`, `/rasse/*`, `/problem/*` |
| Metadata | Handyvertrag-Titles | Hundefutter-Titles |
| Schema-Markup | FAQ zu Schufa | FAQ zu Hundeernährung |
| UI-Strings | „Schufa", „Tarif", „Datenvolumen" | „Allergie", „Futter", „Tagesmenge" |

## 1.3 Was FEHLT für „nur noch AWIN-Feeds einfügen"

🔴 **Krasse Lücken:**

1. **AWIN-Feed-Importer** — Skript das XML/CSV-Feeds einliest und in `dog_foods` schreibt. Existiert nicht.
2. **Seed-Daten für Rassen** — 50 Rassen-Profile (Größe, Gewicht, häufige Probleme, Futter-Empfehlung). Existieren nicht.
3. **Seed-Daten für Probleme** — 14 Gesundheitsprobleme mit Erklärungen. Existieren nicht.
4. **Programmatic-Routes** — `[slug]/page.tsx` für Rassen/Probleme/Lebensphasen/Futtertypen. Existieren nicht.
5. **BELLA System-Prompt** — Der API-Route-Inhalt muss komplett ersetzt werden.
6. **Empfehlungs-Redirect** — `/empfehlung/[slug]` mit Affiliate-Tracking. Existiert nicht.
7. **Cron-Job für Feed-Updates** — Tägliche Aktualisierung der Preise. Existiert nicht.
8. **Environment-Variables-Template** — `.env.example` für AWIN-Feeds. Existiert in der Form nicht.

## 1.4 Domain-Hinweis

Du hast `.today` statt `.de` gewählt. SEO-Handicap, aber kompensierbar durch Inhalt + Backlinks. Optional: Eine `.de` parallel registrieren als Brand-Schutz.

---

# TEIL 2 — DIE EXEKUTIONSREIHENFOLGE

Diese Reihenfolge ist Befehl. Jeder Schritt ist atomar — Copilot kann ihn einzeln abarbeiten, du kannst pausieren/prüfen.

## STEP 1 — ORDNER UMBENENNEN

```bash
git mv handyvertrag-app bella-app
```

In `netlify.toml`:
```toml
[build]
base = "bella-app"
command = "npm run build"
publish = ".next"
```

In `bella-app/package.json`:
```json
{
  "name": "bella-app",
  ...
}
```

## STEP 2 — MASSEN-FIND-AND-REPLACE

Führe `scripts/migrate-from-hansi.sh` aus (siehe TEIL 3.1). Das Skript ersetzt automatisch:
- HANSI → BELLA
- handyvertrag → hundefutter
- Schufa-Begriffe → Hundefutter-Begriffe
- Datenbank-Tabellennamen
- Komponenten-Namen

## STEP 3 — DATENBANK-SCHEMA UMBAUEN

Datei: `bella-app/src/db/schema.ts` (Pfad ggf. anpassen)

Ersetze die `mobileContracts` Tabelle komplett mit:

```typescript
import { pgTable, uuid, text, integer, numeric, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core'

// HAUPT-TABELLE: Hundefutter
export const dogFoods = pgTable('dog_foods', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').unique().notNull(),
  brand: text('brand').notNull(),
  name: text('name').notNull(),
  fullName: text('full_name').notNull(),
  type: text('type').notNull(), // 'trocken' | 'nass' | 'barf' | 'kaltgepresst' | 'snack'
  protein: text('protein').array(), // ['Huhn', 'Lachs']
  isMonoprotein: boolean('is_monoprotein').default(false),
  isGrainFree: boolean('is_grain_free').default(false),
  isHypoallergenic: boolean('is_hypoallergenic').default(false),
  isOrganic: boolean('is_organic').default(false),
  isCold: boolean('is_cold_pressed').default(false),
  meatPercentage: integer('meat_percentage'),
  proteinContent: numeric('protein_content'),
  fatContent: numeric('fat_content'),
  fiberContent: numeric('fiber_content'),
  caloriesPer100g: integer('calories_per_100g'),
  pricePerKg: numeric('price_per_kg'),
  packageSizes: jsonb('package_sizes'), // [{ size: '1kg', price: 9.99 }, ...]
  suitableFor: text('suitable_for').array(), // ['welpen', 'adult', 'senior', 'allergie']
  suitableBreeds: text('suitable_breeds').array(),
  recommendedDailyAmount: jsonb('recommended_daily_amount'), // { '5kg': '60-80g', '20kg': '200-280g' }
  imageUrl: text('image_url'),
  productUrl: text('product_url'),
  rating: numeric('rating').default('0'),
  reviewCount: integer('review_count').default(0),
  // AFFILIATE
  affiliateNetwork: text('affiliate_network').notNull(), // 'awin' | 'partnerize' | 'direct'
  affiliateId: text('affiliate_id'),
  affiliateUrl: text('affiliate_url').notNull(),
  commissionRate: numeric('commission_rate'),
  commissionFlat: numeric('commission_flat'),
  isActive: boolean('is_active').default(true),
  // META
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  lastFeedUpdate: timestamp('last_feed_update'),
})

// RASSEN-PROFILE (für /rasse/[slug] Seiten)
export const dogBreeds = pgTable('dog_breeds', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').unique().notNull(),
  name: text('name').notNull(),
  alternativeNames: text('alternative_names').array(),
  size: text('size').notNull(), // 'klein' | 'mittel' | 'gross' | 'sehrgross'
  weightMin: numeric('weight_min'),
  weightMax: numeric('weight_max'),
  lifeExpectancy: integer('life_expectancy'),
  activityLevel: text('activity_level'), // 'niedrig' | 'mittel' | 'hoch' | 'sehrhoch'
  commonHealthIssues: text('common_health_issues').array(),
  recommendedProteinPercentage: integer('recommended_protein_percentage'),
  recommendedFatPercentage: integer('recommended_fat_percentage'),
  feedingNotes: text('feeding_notes'),
  description: text('description'),
  imageUrl: text('image_url'),
  recommendedFoodIds: text('recommended_food_ids').array(), // verweist auf dogFoods
  createdAt: timestamp('created_at').defaultNow(),
})

// GESUNDHEITSPROBLEME (für /problem/[slug] Seiten)
export const healthIssues = pgTable('health_issues', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').unique().notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  symptoms: text('symptoms').array(),
  feedingApproach: text('feeding_approach'),
  recommendedFoodTypes: text('recommended_food_types').array(),
  avoidIngredients: text('avoid_ingredients').array(),
  recommendedFoodIds: text('recommended_food_ids').array(),
  createdAt: timestamp('created_at').defaultNow(),
})

// CLICK-TRACKING (für Affiliate-Performance)
export const affiliateClicks = pgTable('affiliate_clicks', {
  id: uuid('id').defaultRandom().primaryKey(),
  foodId: uuid('food_id').notNull(),
  sourceUrl: text('source_url'),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  sessionId: text('session_id'),
  bellaConversation: boolean('bella_conversation').default(false),
  clickedAt: timestamp('clicked_at').defaultNow(),
})

// BELLA-CHAT-SESSIONS
export const advisorSessions = pgTable('advisor_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: text('session_id').unique().notNull(),
  breedSlug: text('breed_slug'),
  dogAge: integer('dog_age'),
  dogWeight: numeric('dog_weight'),
  activityLevel: text('activity_level'),
  healthIssues: text('health_issues').array(),
  preferredFoodType: text('preferred_food_type'),
  recommendedFoodIds: text('recommended_food_ids').array(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
})
```

Dann Migration generieren:
```bash
cd bella-app
npx drizzle-kit generate
npx drizzle-kit push
```

## STEP 4 — BELLA SYSTEM-PROMPT

Datei: `bella-app/src/app/api/advisor/chat/route.ts`

Ersetze den `SYSTEM_PROMPT` komplett:

```typescript
const SYSTEM_PROMPT = `Du bist BELLA, Deutschlands KI-Ernährungsberaterin für Hunde.

DEINE PERSÖNLICHKEIT:
- Warm, freundlich, hundeerfahren
- Sprichst Hundebesitzer wie Freunde an
- Du LIEBST Hunde und merkst das jeder Antwort an

DEINE 5 FRAGEN (immer in dieser Reihenfolge, EINE pro Nachricht):

Frage 1: "Hi! Ich bin BELLA und helfe dir, das perfekte Futter für deinen Hund zu finden. 
Lass uns starten: Welche Rasse hat dein Hund? (Mischling ist auch okay – beschreib einfach Größe/Aussehen)"

Frage 2 (nach Antwort): "Toll, [Rasse]! Wie alt ist dein Hund und wie schwer ist er ungefähr?"

Frage 3: "Verstehe. Wie aktiv ist dein Hund?
🛋️ Couch-Potato (kurze Spaziergänge)
🚶 Normal aktiv (1-2h Bewegung täglich)  
🏃 Sehr aktiv (Sport, lange Wanderungen, Joggen)"

Frage 4: "Gibt es Allergien, Unverträglichkeiten oder gesundheitliche Themen?
(z.B. sensibler Magen, Übergewicht, Gelenkprobleme, Allergie auf Huhn/Rind/Getreide)"

Frage 5: "Letzte Frage: Was bevorzugst du?
🥫 Nassfutter
🥣 Trockenfutter
🥩 BARF (Rohfütterung)
🤷 Egal, Hauptsache passt"

NACH FRAGE 5:
Empfehle GENAU 3 Futtersorten aus der Datenbank. Format pro Empfehlung:

🥇 **{Marke} {Sorte}**
✓ Tagesmenge für {Name/Rasse}: ~{X}g
✓ Preis: {X}€/kg ({X}€ pro Monat)
✓ Warum es passt: {2-3 individuelle Sätze, Rassen-/Problem-Bezug}
⭐ {Rating}/5 ({reviewCount} Bewertungen)

[👉 Jetzt ansehen]({affiliateRedirectUrl})

---

WICHTIGE REGELN:
✓ Sprich Hund mit "er/sie" an, frag ggf. nach Namen
✓ Bei Allergie auf Huhn → empfehle nur Monoprotein ohne Huhn
✓ Bei Welpen → nur Welpenfutter mit erhöhtem Protein
✓ Bei Senior (>9 J. klein, >7 J. groß) → Seniorfutter mit Gelenkstoffen
✓ Bei Übergewicht → Light-Futter mit reduzierten Kalorien
✓ Schließe immer mit: "Soll ich dir auch berechnen, wie viel dein Hund pro Tag fressen sollte?"

✗ Niemals "Ich weiß nicht"
✗ Niemals mehr als 3 Empfehlungen
✗ Niemals medizinische Diagnose → bei Krankheit: "Bitte sprich mit deinem Tierarzt"
✗ Niemals ohne Affiliate-Link empfehlen

KONTEXT-DATEN VERFÜGBAR:
- Verfügbare Futtersorten in der Datenbank (über getFoods-Tool)
- Rassen-Profile mit empfohlenen Futter-Typen
- Häufige Gesundheitsprobleme

Antworte IMMER auf Deutsch. Sei du selbst – BELLA.
`
```

## STEP 5 — ROBOTS + SITEMAP

Datei: `bella-app/src/app/robots.ts`

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/', '/_next/'] },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
    ],
    sitemap: 'https://welches-hundefutter.today/sitemap.xml',
    host: 'https://welches-hundefutter.today',
  }
}
```

Datei: `bella-app/src/app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next'
import { db } from '@/db'
import { dogBreeds, healthIssues } from '@/db/schema'

const BASE = 'https://welches-hundefutter.today'

const LEBENSPHASEN = ['welpen', 'junghund', 'adult', 'senior']
const FUTTERTYPEN = ['trockenfutter', 'nassfutter', 'barf', 'kaltgepresst', 'getreidefrei', 'hypoallergen', 'monoprotein', 'insekten']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const breeds = await db.select({ slug: dogBreeds.slug }).from(dogBreeds)
  const issues = await db.select({ slug: healthIssues.slug }).from(healthIssues)

  const statisch = [
    { url: BASE, priority: 1.0, changeFrequency: 'daily' as const },
    { url: `${BASE}/tools/futter-finder`, priority: 0.95, changeFrequency: 'weekly' as const },
    { url: `${BASE}/rassen`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${BASE}/probleme`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${BASE}/test/hundefutter-2026`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${BASE}/futter/welpen`, priority: 0.85, changeFrequency: 'monthly' as const },
    { url: `${BASE}/futter/senior`, priority: 0.85, changeFrequency: 'monthly' as const },
    { url: `${BASE}/allergie`, priority: 0.85, changeFrequency: 'monthly' as const },
    { url: `${BASE}/faq`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${BASE}/blog`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${BASE}/ueber-uns`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${BASE}/impressum`, priority: 0.3, changeFrequency: 'yearly' as const },
    { url: `${BASE}/datenschutz`, priority: 0.3, changeFrequency: 'yearly' as const },
  ].map(r => ({ ...r, lastModified: new Date() }))

  const rasseRoutes = breeds.map(b => ({
    url: `${BASE}/rasse/${b.slug}-hundefutter`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const problemRoutes = issues.map(i => ({
    url: `${BASE}/problem/${i.slug}`,
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

  return [...statisch, ...rasseRoutes, ...problemRoutes, ...phasen, ...typen]
}
```

## STEP 6 — METADATA ROOT-LAYOUT

Datei: `bella-app/src/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://welches-hundefutter.today'),
  title: {
    default: 'Welches Hundefutter für meinen Hund? ✓ KI-Berater BELLA findet es in 60 Sekunden',
    template: '%s | BELLA – KI-Hundefutterberater',
  },
  description: 'Welches Hundefutter passt zu deinem Hund? BELLA fragt 5 Dinge und empfiehlt aus 500+ Sorten das beste für Rasse, Alter & Allergien. Kostenlos.',
  keywords: ['welches hundefutter für meinen hund', 'hundefutter berater', 'bestes hundefutter', 'hundefutter empfehlung', 'welches hundefutter bei allergie'],
  authors: [{ name: 'Rolf Schwertfechter', url: 'https://welches-hundefutter.today/ueber-uns' }],
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
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}
```

## STEP 7 — PROGRAMMATIC ROUTE: `/rasse/[slug]`

Datei: `bella-app/src/app/rasse/[slug]/page.tsx`

```typescript
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/db'
import { dogBreeds, dogFoods } from '@/db/schema'
import { eq, inArray } from 'drizzle-orm'
import { BellaAdvisorWrapper } from '@/components/bella-advisor-wrapper'
import { FoodCard } from '@/components/food-card'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const breeds = await db.select({ slug: dogBreeds.slug }).from(dogBreeds)
  return breeds.map(b => ({ slug: `${b.slug}-hundefutter` }))
}

async function getBreedBySlug(slug: string) {
  const breedSlug = slug.replace(/-hundefutter$/, '')
  const [breed] = await db.select().from(dogBreeds).where(eq(dogBreeds.slug, breedSlug)).limit(1)
  return breed
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const breed = await getBreedBySlug(slug)
  if (!breed) return {}

  return {
    title: `Hundefutter für ${breed.name} ✓ Beste Empfehlung 2026 | BELLA`,
    description: `Welches Hundefutter passt zum ${breed.name}? Top-Empfehlungen, ${breed.weightMin}-${breed.weightMax}kg, abgestimmt auf ${breed.commonHealthIssues?.[0] || 'rassetypische'} Probleme.`,
    alternates: { canonical: `https://welches-hundefutter.today/rasse/${slug}` },
    openGraph: {
      title: `Hundefutter für ${breed.name} – Die besten Sorten 2026`,
      description: `Was sollte ein ${breed.name} fressen? BELLA zeigt es dir.`,
      images: breed.imageUrl ? [breed.imageUrl] : [],
    },
  }
}

export default async function RasseSeite({ params }: Props) {
  const { slug } = await params
  const breed = await getBreedBySlug(slug)
  if (!breed) notFound()

  const recommendedFoods = breed.recommendedFoodIds?.length
    ? await db.select().from(dogFoods).where(inArray(dogFoods.id, breed.recommendedFoodIds))
    : []

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Hundefutter für ${breed.name}: Beste Empfehlungen 2026`,
    author: { '@type': 'Person', name: 'Rolf Schwertfechter' },
    datePublished: '2026-06-01',
    dateModified: new Date().toISOString(),
    image: breed.imageUrl,
    publisher: { '@id': 'https://welches-hundefutter.today/#organization' },
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <h1 className="text-4xl font-bold mb-4">
        Hundefutter für {breed.name}: Das passt wirklich
      </h1>

      <div className="prose max-w-none mb-8">
        <p className="text-lg">
          {breed.description}
        </p>
      </div>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 bg-orange-50 rounded-lg">
        <Stat label="Größe" value={breed.size} />
        <Stat label="Gewicht" value={`${breed.weightMin}-${breed.weightMax} kg`} />
        <Stat label="Lebenserwartung" value={`${breed.lifeExpectancy} Jahre`} />
        <Stat label="Aktivität" value={breed.activityLevel || '-'} />
      </section>

      <h2 className="text-2xl font-bold mt-12 mb-4">
        Häufige gesundheitliche Themen beim {breed.name}
      </h2>
      <ul className="list-disc list-inside mb-8">
        {breed.commonHealthIssues?.map(issue => (
          <li key={issue}>{issue}</li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mt-12 mb-4">
        Top-3-Hundefutter für {breed.name}
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {recommendedFoods.slice(0, 3).map(food => (
          <FoodCard key={food.id} food={food} breed={breed} />
        ))}
      </div>

      <section className="my-12 p-8 bg-orange-100 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">
          Noch genauer? BELLA findet das perfekte Futter
        </h2>
        <p className="mb-4">
          5 Fragen, 60 Sekunden – BELLA berücksichtigt nicht nur die Rasse,
          sondern auch Alter, Aktivität und Vorlieben deines Hundes.
        </p>
        <BellaAdvisorWrapper presetBreed={breed.slug} />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">
          Tagesmenge für deinen {breed.name}
        </h2>
        <p>{breed.feedingNotes}</p>
      </section>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  )
}
```

Analoge Files für:
- `bella-app/src/app/problem/[slug]/page.tsx`
- `bella-app/src/app/lebensphase/[slug]/page.tsx`
- `bella-app/src/app/futtertyp/[slug]/page.tsx`

## STEP 8 — AFFILIATE-REDIRECT-ROUTE

Datei: `bella-app/src/app/empfehlung/[slug]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { dogFoods, affiliateClicks } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [food] = await db.select().from(dogFoods).where(eq(dogFoods.slug, slug)).limit(1)

  if (!food || !food.isActive) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Click-Tracking (fire and forget, blockt nicht den Redirect)
  db.insert(affiliateClicks).values({
    foodId: food.id,
    sourceUrl: req.url,
    userAgent: req.headers.get('user-agent') || '',
    referrer: req.headers.get('referer') || '',
    sessionId: req.cookies.get('bella_session')?.value || '',
    bellaConversation: req.url.includes('source=bella'),
  }).catch(console.error)

  return NextResponse.redirect(food.affiliateUrl, { status: 302 })
}
```

## STEP 9 — AWIN-FEED-IMPORTER

Datei: `bella-app/src/lib/awin-importer.ts`

```typescript
import { db } from '@/db'
import { dogFoods } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { XMLParser } from 'fast-xml-parser'

type AwinFeedConfig = {
  partnerId: string
  partnerName: string
  feedUrl: string
  format: 'xml' | 'csv' | 'json'
  commissionRate?: number
  commissionFlat?: number
  fieldMapping: {
    productName: string
    brand: string
    price: string
    imageUrl: string
    productUrl: string
    description?: string
    category?: string
  }
  productFilter: (item: any) => boolean // z.B. nur Hundefutter
}

export async function importAwinFeed(config: AwinFeedConfig) {
  console.log(`[BELLA] Importing feed from ${config.partnerName}...`)

  const response = await fetch(config.feedUrl)
  if (!response.ok) throw new Error(`Feed fetch failed: ${response.status}`)

  let items: any[] = []

  if (config.format === 'xml') {
    const xml = await response.text()
    const parser = new XMLParser()
    const data = parser.parse(xml)
    items = data?.products?.product || data?.feed?.product || []
  } else if (config.format === 'csv') {
    const text = await response.text()
    items = parseCSV(text)
  } else if (config.format === 'json') {
    items = await response.json()
  }

  const dogFoodItems = items.filter(config.productFilter)
  console.log(`[BELLA] Found ${dogFoodItems.length} dog food items from ${config.partnerName}`)

  let imported = 0
  let updated = 0

  for (const item of dogFoodItems) {
    const m = config.fieldMapping
    const slug = generateSlug(`${item[m.brand]}-${item[m.productName]}`)
    const productName = String(item[m.productName] || '')
    const brand = String(item[m.brand] || '')

    const data = {
      slug,
      brand,
      name: productName,
      fullName: `${brand} ${productName}`,
      type: detectFoodType(productName, item[m.description] || ''),
      protein: detectProteins(productName, item[m.description] || ''),
      isMonoprotein: /monoprotein|single-protein/i.test(productName),
      isGrainFree: /getreidefrei|grain[- ]free/i.test(productName),
      isHypoallergenic: /hypoallergen|sensitive/i.test(productName),
      pricePerKg: extractPricePerKg(item[m.price], productName),
      imageUrl: String(item[m.imageUrl] || ''),
      productUrl: String(item[m.productUrl] || ''),
      affiliateNetwork: 'awin',
      affiliateId: config.partnerId,
      affiliateUrl: String(item[m.productUrl] || ''),
      commissionRate: config.commissionRate ? String(config.commissionRate) : null,
      commissionFlat: config.commissionFlat ? String(config.commissionFlat) : null,
      isActive: true,
      lastFeedUpdate: new Date(),
      updatedAt: new Date(),
    }

    const existing = await db.select().from(dogFoods).where(eq(dogFoods.slug, slug)).limit(1)

    if (existing.length > 0) {
      await db.update(dogFoods).set(data).where(eq(dogFoods.slug, slug))
      updated++
    } else {
      await db.insert(dogFoods).values(data)
      imported++
    }
  }

  console.log(`[BELLA] ${config.partnerName}: ${imported} new, ${updated} updated`)
  return { imported, updated }
}

// HELPERS
function generateSlug(input: string): string {
  return input.toLowerCase()
    .replace(/[äöü]/g, c => ({ ä: 'ae', ö: 'oe', ü: 'ue' }[c] || c))
    .replace(/[ß]/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

function detectFoodType(name: string, desc: string): string {
  const text = `${name} ${desc}`.toLowerCase()
  if (/nassfutter|nass futter|dose|pouch/.test(text)) return 'nass'
  if (/barf|rohfutter/.test(text)) return 'barf'
  if (/kaltgepresst/.test(text)) return 'kaltgepresst'
  if (/snack|leckerli|kausnack/.test(text)) return 'snack'
  return 'trocken'
}

function detectProteins(name: string, desc: string): string[] {
  const text = `${name} ${desc}`.toLowerCase()
  const proteins: string[] = []
  const map: Record<string, string> = {
    huhn: 'Huhn', chicken: 'Huhn', poulet: 'Huhn',
    rind: 'Rind', beef: 'Rind',
    lamm: 'Lamm', lamb: 'Lamm',
    lachs: 'Lachs', salmon: 'Lachs',
    pute: 'Pute', turkey: 'Pute',
    ente: 'Ente', duck: 'Ente',
    wild: 'Wild', hirsch: 'Hirsch', reh: 'Reh',
    kaninchen: 'Kaninchen', rabbit: 'Kaninchen',
    insekt: 'Insekten', insect: 'Insekten',
  }
  for (const [key, val] of Object.entries(map)) {
    if (text.includes(key) && !proteins.includes(val)) proteins.push(val)
  }
  return proteins
}

function extractPricePerKg(priceStr: string, productName: string): string | null {
  if (!priceStr) return null
  const price = parseFloat(String(priceStr).replace(',', '.').replace(/[^\d.]/g, ''))
  if (isNaN(price)) return null

  // Try to extract weight from product name
  const weightMatch = productName.match(/(\d+(?:[.,]\d+)?)\s*(kg|g)/i)
  if (!weightMatch) return null
  let weight = parseFloat(weightMatch[1].replace(',', '.'))
  if (weightMatch[2].toLowerCase() === 'g') weight = weight / 1000
  if (weight <= 0) return null

  return (price / weight).toFixed(2)
}

function parseCSV(text: string): any[] {
  const lines = text.split('\n').filter(Boolean)
  if (lines.length < 2) return []
  const headers = lines[0].split(/[,;\t]/).map(h => h.trim().replace(/^"|"$/g, ''))
  return lines.slice(1).map(line => {
    const values = line.split(/[,;\t]/).map(v => v.trim().replace(/^"|"$/g, ''))
    return headers.reduce((acc, h, i) => ({ ...acc, [h]: values[i] }), {})
  })
}
```

## STEP 10 — IMPORT-CONFIG + CLI-SKRIPT

Datei: `bella-app/src/lib/awin-configs.ts`

```typescript
import { AwinFeedConfig } from './awin-importer'

export const AWIN_CONFIGS: AwinFeedConfig[] = [
  {
    partnerId: process.env.AWIN_ANIFIT_ID || '',
    partnerName: 'Anifit',
    feedUrl: process.env.AWIN_ANIFIT_FEED_URL || '',
    format: 'xml',
    commissionFlat: 30,
    commissionRate: 0.08,
    fieldMapping: {
      productName: 'name',
      brand: 'brand',
      price: 'price',
      imageUrl: 'image_url',
      productUrl: 'aw_deep_link',
      description: 'description',
    },
    productFilter: (item) => /hund|dog/i.test(item.category || ''),
  },
  {
    partnerId: process.env.AWIN_FUTALIS_ID || '',
    partnerName: 'Futalis',
    feedUrl: process.env.AWIN_FUTALIS_FEED_URL || '',
    format: 'csv',
    commissionFlat: 40,
    fieldMapping: {
      productName: 'product_name',
      brand: 'merchant_name',
      price: 'search_price',
      imageUrl: 'aw_image_url',
      productUrl: 'aw_deep_link',
    },
    productFilter: () => true,
  },
  {
    partnerId: process.env.AWIN_BELLFOR_ID || '',
    partnerName: 'Bellfor',
    feedUrl: process.env.AWIN_BELLFOR_FEED_URL || '',
    format: 'xml',
    commissionFlat: 30,
    commissionRate: 0.10,
    fieldMapping: {
      productName: 'name',
      brand: 'brand',
      price: 'price',
      imageUrl: 'image_url',
      productUrl: 'aw_deep_link',
    },
    productFilter: (item) => /hund/i.test(item.category || ''),
  },
  {
    partnerId: process.env.AWIN_ZOOPLUS_ID || '',
    partnerName: 'Zooplus',
    feedUrl: process.env.AWIN_ZOOPLUS_FEED_URL || '',
    format: 'csv',
    commissionRate: 0.05,
    fieldMapping: {
      productName: 'product_name',
      brand: 'brand_name',
      price: 'search_price',
      imageUrl: 'aw_image_url',
      productUrl: 'aw_deep_link',
      category: 'merchant_category',
    },
    productFilter: (item) => /hund|trockenfutter|nassfutter|barf/i.test(item.merchant_category || ''),
  },
  {
    partnerId: process.env.AWIN_FRESSNAPF_ID || '',
    partnerName: 'Fressnapf',
    feedUrl: process.env.AWIN_FRESSNAPF_FEED_URL || '',
    format: 'csv',
    commissionRate: 0.05,
    fieldMapping: {
      productName: 'product_name',
      brand: 'brand_name',
      price: 'search_price',
      imageUrl: 'aw_image_url',
      productUrl: 'aw_deep_link',
      category: 'category_name',
    },
    productFilter: (item) => /hund/i.test(item.category_name || ''),
  },
]
```

Datei: `bella-app/scripts/import-feeds.ts`

```typescript
import 'dotenv/config'
import { AWIN_CONFIGS } from '../src/lib/awin-configs'
import { importAwinFeed } from '../src/lib/awin-importer'

async function main() {
  console.log('🐕 BELLA — Affiliate Feed Importer')
  console.log('═══════════════════════════════════════')

  for (const config of AWIN_CONFIGS) {
    if (!config.feedUrl) {
      console.log(`⏭️  ${config.partnerName}: Feed-URL nicht gesetzt, skip`)
      continue
    }
    try {
      const result = await importAwinFeed(config)
      console.log(`✅ ${config.partnerName}: +${result.imported} neu, ↻ ${result.updated} aktualisiert`)
    } catch (err) {
      console.error(`❌ ${config.partnerName}: ${err}`)
    }
  }

  console.log('═══════════════════════════════════════')
  console.log('🐕 BELLA — Import abgeschlossen')
  process.exit(0)
}

main().catch(err => { console.error(err); process.exit(1) })
```

In `bella-app/package.json` ergänzen:
```json
{
  "scripts": {
    "import-feeds": "tsx scripts/import-feeds.ts",
    "import-feeds:dry": "DRY_RUN=true tsx scripts/import-feeds.ts"
  },
  "dependencies": {
    "fast-xml-parser": "^4.5.0",
    "tsx": "^4.0.0"
  }
}
```

## STEP 11 — CRON-JOB FÜR TÄGLICHE UPDATES

Datei: `bella-app/src/app/api/cron/import-feeds/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { AWIN_CONFIGS } from '@/lib/awin-configs'
import { importAwinFeed } from '@/lib/awin-importer'

export async function GET(req: Request) {
  // Schutz via Cron-Secret
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const results: Record<string, any> = {}

  for (const config of AWIN_CONFIGS) {
    if (!config.feedUrl) {
      results[config.partnerName] = 'skipped'
      continue
    }
    try {
      results[config.partnerName] = await importAwinFeed(config)
    } catch (err: any) {
      results[config.partnerName] = { error: err.message }
    }
  }

  return NextResponse.json({ ok: true, results, timestamp: new Date().toISOString() })
}
```

In `netlify.toml` ergänzen (Scheduled Function für täglich 4 Uhr morgens):

```toml
[functions."cron-import-feeds"]
  schedule = "0 4 * * *"
```

Datei: `bella-app/netlify/functions/cron-import-feeds.ts`

```typescript
import type { Config } from '@netlify/functions'

export default async () => {
  const res = await fetch(`${process.env.URL}/api/cron/import-feeds`, {
    headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
  })
  console.log(await res.text())
}

export const config: Config = {
  schedule: '0 4 * * *',
}
```

## STEP 12 — RASSEN-SEED-DATEN

Datei: `bella-app/scripts/seed-breeds.ts` — siehe TEIL 3.2 für die 50 Rassen-Daten.

```bash
cd bella-app
npx tsx scripts/seed-breeds.ts
```

## STEP 13 — PROBLEME-SEED-DATEN

Datei: `bella-app/scripts/seed-issues.ts` — siehe TEIL 3.3.

## STEP 14 — UMGEBUNGS-VARIABLEN

Datei: `bella-app/.env.example`

```bash
# Database
DATABASE_URL="postgresql://..."

# KI
GEMINI_API_KEY=""
ANTHROPIC_API_KEY=""

# Cron
CRON_SECRET=""

# AWIN — Diese 5 Feeds eintragen, dann ist alles fertig
AWIN_ANIFIT_ID=""
AWIN_ANIFIT_FEED_URL=""

AWIN_FUTALIS_ID=""
AWIN_FUTALIS_FEED_URL=""

AWIN_BELLFOR_ID=""
AWIN_BELLFOR_FEED_URL=""

AWIN_ZOOPLUS_ID=""
AWIN_ZOOPLUS_FEED_URL=""

AWIN_FRESSNAPF_ID=""
AWIN_FRESSNAPF_FEED_URL=""
```

## STEP 15 — FAQ + STRUCTURED DATA

Datei: `bella-app/src/app/faq/page.tsx` — befülle mit den 10 Killer-Fragen aus `agents.md` Operation 12, jeweils mit FAQPage-Schema.

## STEP 16 — DEPLOYMENT

```bash
# Local Build Test
cd bella-app
pnpm install
pnpm build

# Wenn fehlerfrei: Push
git add -A
git commit -m "feat: complete BELLA migration — ready for AWIN feeds"
git push origin main
```

Netlify deployt automatisch. Domain `welches-hundefutter.today` per Netlify-DNS verbinden.

---

# TEIL 3 — AUTOMATISIERUNG (Code-Lieferung)

## 3.1 Migration-Skript (`scripts/migrate-from-hansi.sh`)

Liegt in `/mnt/user-data/outputs/migrate-from-hansi.sh`. Macht den kompletten Find-and-Replace automatisch.

## 3.2 Rassen-Seed-Daten (`scripts/seed-breeds.ts`)

Liegt in `/mnt/user-data/outputs/seed-breeds.ts`. Enthält 50 deutsche/internationale Hunderassen mit allen Daten.

## 3.3 Probleme-Seed-Daten (`scripts/seed-issues.ts`)

Liegt in `/mnt/user-data/outputs/seed-issues.ts`. Enthält 14 häufige Gesundheitsprobleme.

---

# TEIL 4 — WAS DU MANUELL TUST

Wenn alle Steps oben durchgelaufen sind, ist die einzige verbleibende Aufgabe:

## ✅ AWIN-Konto + Bewerbungen

1. Gehe auf [https://www.awin.com](https://www.awin.com) → „Publisher werden"
2. Konto erstellen, Steuerdaten hinterlegen (Kleinunternehmer/EU)
3. Im Dashboard nach diesen Programmen suchen und bewerben:
   - **Anifit** (Suche: „Anifit" oder „PROVITA Petfood")
   - **Bellfor**
   - **Futalis**
   - **Zooplus**
   - **Fressnapf**
   - Optional: Terra Canis, Wolfsblut/Pets Premium, MERA
4. Pro Programm: Kurze Bewerbung schreiben mit Hinweis auf welches-hundefutter.today + KI-Berater-Konzept
5. Warten auf Annahme (1-7 Werktage pro Programm)

## ✅ Feed-URLs einsetzen

Sobald ein Programm dich akzeptiert:

1. AWIN Dashboard → Programm öffnen → „Datafeed" oder „Produkt-Feed"
2. URL kopieren (sieht aus wie `https://productdata.awin.com/datafeed/download/apikey/.../format/xml/...`)
3. In Netlify: Site Settings → Environment Variables → eintragen:
   ```
   AWIN_ANIFIT_ID=12345
   AWIN_ANIFIT_FEED_URL=https://productdata.awin.com/...
   ```
4. Wiederholen für jeden angenommenen Partner

## ✅ Erstimport auslösen

Lokal oder via Netlify Function:
```bash
cd bella-app
pnpm import-feeds
```

Oder im Netlify-Dashboard die Function `cron-import-feeds` manuell triggern.

## ✅ Check

Öffne `welches-hundefutter.today`. Stelle Frage an BELLA. Sie sollte Empfehlungen aus den eingespielten AWIN-Produkten ausspielen. Klick auf Empfehlung → Redirect über `/empfehlung/[slug]` → AWIN-Tracking-Link → Partner-Shop.

**Wenn das funktioniert: Du verdienst Geld.**

---

# TEIL 5 — DER COPILOT MASTER-BEFEHL

Pack den folgenden Befehl in `.github/copilot-instructions.md` (überschreibt agents.md als primären Auto-Loader für Copilot):

```
Du bist Lead Developer für BELLA – welches-hundefutter.today.

Lies BELLA_BLUEPRINT.md im Repo-Root komplett.
Arbeite Step 1 bis Step 16 ab. Keine Rückfragen.
Jeder Step: alten Code zeigen, neuen Code zeigen, kurz validieren.
Bei Fehlern: ein Retry, dann weiterer Step.

Stack-Constraints:
- Next.js 16.2 App Router
- TypeScript strict
- Tailwind v4
- Drizzle ORM mit Neon Postgres
- Server Components by default, "use client" nur wenn nötig
- Keine externen UI-Libs außer was schon installiert ist

Ziel-Status nach allen Steps:
- App-Ordner heißt bella-app
- Datenbank-Schema umgebaut auf dogFoods/dogBreeds/healthIssues
- BELLA System-Prompt aktiv
- /rasse/[slug], /problem/[slug], /lebensphase/[slug], /futtertyp/[slug] Routes funktionieren
- Sitemap mit 87+ URLs auto-generiert
- AWIN-Importer als CLI + Cron-Job verfügbar
- Build läuft lokal fehlerfrei durch
- Einzige verbleibende Aufgabe: AWIN-Feed-URLs in .env eintragen
```

---

**Wenn alle 16 Steps durch sind: Du wirst BELLA starten können wie eine Wasserleitung. Hahn auf = Geld fließt.**

*BELLA Blueprint v1 – Vollständige Implementierung*
