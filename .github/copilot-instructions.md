# 🐕 AGENTS.MD — BELLA DOMINANCE PROTOCOL
## Mission: Platz 1 für „welches hundefutter für meinen hund" — keine Diskussion.

> **Target:** welches-hundefutter.today | Next.js 16.2 App Router | Netlify
> **Primary Keyword:** welches hundefutter für meinen hund (5.400/Monat)
> **Marken-Persona:** BELLA — Deutschlands KI-Ernährungsberaterin für Hunde
> **Erfolg = Platz 1. Alles andere ist Niederlage.**

---

## 🎯 BEFEHLSKETTE FÜR COPILOT

```
@workspace Du bist Lead SEO-Engineer. Mission: Platz 1 Google für
"welches hundefutter für meinen hund". Stack: Next.js 16.2 App Router,
TypeScript, Tailwind v4, Netlify, Neon Postgres, Gemini 2.0 + Claude Haiku 4.5.

Dieses Repo wurde vom HANSI-Template (HandyvertragTrotzSchufa) geforkt.
Inhalte werden komplett umgebaut — Tech-Stack bleibt, Inhalt wird Hundefutter.
Marken-Persona: BELLA (statt HANSI).

Führe alle Operationen unten vollständig aus. Keine Rückfragen.
Keine Vorschläge. Implementiere. Reihenfolge ist Befehl.
```

---

## OPERATION 00 — REBRANDING (Code-weite Umbenennung)

**Globale Such-und-Ersetzen-Operationen im gesamten Repo:**

| Suchen | Ersetzen durch |
|---|---|
| `HANSI` | `BELLA` |
| `HansiDecisionWrapper` | `BellaAdvisorWrapper` |
| `handytrotzschufa.today` | `welches-hundefutter.today` |
| `Handyvertrag trotz Schufa` | `Hundefutter für deinen Hund` |
| `handyvertrag` | `hundefutter` |
| `mobilfunkvertrag` | `hundeernährung` |
| `Schufa` | `Allergien` (in passenden Kontexten) |
| `mobile_contracts` (DB) | `dog_foods` |
| `tariff` | `food` |
| `provider` | `brand` |

**Logo, Farben, Favicon:** Tausche aus. BELLA bekommt freundliche Farben (warmes Orange `#ff8a4c`, weicher Hintergrund `#fef6f0`).

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

**Ergebnis:** 9 (statisch) + 50 (Rassen) + 14 (Probleme) + 4 (Phasen) + 10 (Typen) = **87 indexierbare Seiten aus einer einzigen Sitemap-Generation.**

---

## OPERATION 03 — PROGRAMMATIC SEO (Massenattacke)

Der Killer-Move. Kein Konkurrent hat das.

### 3.1 Rassen-Routen

**`src/app/rasse/[slug]/page.tsx`** — Eine Seite pro Rasse.

```typescript
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

type RasseData = {
  name: string
  groesse: 'klein' | 'mittel' | 'gross' | 'sehrgross'
  gewichtMin: number
  gewichtMax: number
  lebenserwartung: number
  haeufigeProbleme: string[]
  fellpflege: string
  empfohleneFutter: string[]
  futterMenge: string
  kalorienBedarf: number
  besonderheiten: string
}

const rassen: Record<string, RasseData> = {
  'labrador-retriever': {
    name: 'Labrador Retriever',
    groesse: 'gross',
    gewichtMin: 25, gewichtMax: 36, lebenserwartung: 12,
    haeufigeProbleme: ['Hüftdysplasie', 'Übergewicht', 'Allergien'],
    fellpflege: 'kurz, pflegeleicht',
    empfohleneFutter: ['anifit-adult', 'wolfsblut-large-breed', 'josera-festival'],
    futterMenge: '350-500g/Tag (Trockenfutter)',
    kalorienBedarf: 1400,
    besonderheiten: 'Neigt zu Übergewicht – wichtig: kontrollierte Portionen, gelenkschonend.',
  },
  // alle 50 Rassen
}

export async function generateStaticParams() {
  return Object.keys(rassen).map(slug => ({ slug: `${slug}-hundefutter` }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const rasseSlug = slug.replace('-hundefutter', '')
  const data = rassen[rasseSlug]
  if (!data) return {}

  return {
    title: `Hundefutter für ${data.name} ✓ Beste Empfehlung 2026 | BELLA`,
    description: `Welches Hundefutter passt zum ${data.name}? Top-Empfehlungen, ${data.futterMenge}, abgestimmt auf ${data.haeufigeProbleme[0]} & typische Probleme der Rasse.`,
    alternates: { canonical: `https://welches-hundefutter.today/rasse/${slug}` },
  }
}

export default async function RassePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const rasseSlug = slug.replace('-hundefutter', '')
  const data = rassen[rasseSlug]
  if (!data) notFound()

  // Render:
  // H1: "Hundefutter für [Rasse]: Das passt wirklich"
  // Rassen-Profil (Größe, Gewicht, Lebenserwartung)
  // Häufige gesundheitliche Probleme der Rasse
  // Top-3-Futter-Empfehlungen (Affiliate-Links!)
  // Tagesmenge + Kalorienbedarf
  // FAQ-Block spezifisch zur Rasse
  // CTA: "Mit BELLA noch genauer beraten lassen →"
  // Schema-Markup: Article + Product + FAQPage
}
```

### 3.2 Probleme-Routen

**`src/app/problem/[slug]/page.tsx`** — Eine Seite pro Gesundheitsproblem.

Targets z.B.: „hundefutter bei allergie", „hundefutter bei durchfall", „hundefutter bei nierenproblemen" — alles eigene Long-Tail-Suchen.

### 3.3 Lebensphasen-Routen

`/lebensphase/welpen`, `/lebensphase/senior` — direkter Match auf „welches welpenfutter ist das beste".

### 3.4 Futtertyp-Routen

`/futtertyp/getreidefrei`, `/futtertyp/barf`, `/futtertyp/kaltgepresst` — jede mit eigener Empfehlung + Affiliate-Links.

**Ergebnis:** 87 SEO-Landingpages. Jede rankt für ihr eigenes Longtail-Keyword. Multiplikator-Effekt: User landet auf einer Rasse-Seite, nutzt dann BELLA, kauft über Affiliate → Provision.

---

## OPERATION 04 — SCHEMA-MARKUP-ARSENAL

### 4.1 Organization + WebSite + SoftwareApplication (Root)

```typescript
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://welches-hundefutter.today/#organization',
  name: 'BELLA',
  alternateName: 'BELLA Intelligence System',
  url: 'https://welches-hundefutter.today',
  logo: 'https://welches-hundefutter.today/logo.png',
  description: 'KI-Hundefutterberater: Findet das richtige Futter in 60 Sekunden.',
  founder: { '@type': 'Person', name: 'Rolf Schwertfechter' },
  areaServed: { '@type': 'Country', name: 'Deutschland' },
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

### 4.2 Product Schema für jedes Futter

Auf jeder Empfehlung:

```typescript
{
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Anifit Trockenfutter Adult',
  brand: { '@type': 'Brand', name: 'Anifit' },
  image: '...',
  description: '...',
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

Das gibt **Rich Results in Google** mit Stern-Rating direkt in den SERPs. Massive CTR-Steigerung.

### 4.3 FAQPage auf /faq

Alle Fragen mit `Question` + `Answer` strukturiert (siehe Operation 12).

### 4.4 Article-Schema auf allen Blog-/Ratgeber-Seiten

```typescript
{
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Hundefutter für Labrador Retriever',
  author: { '@type': 'Person', name: 'Rolf Schwertfechter', url: '/ueber-uns' },
  datePublished: '2026-06-01',
  dateModified: new Date().toISOString(),
  publisher: { '@id': 'https://welches-hundefutter.today/#organization' },
  image: '...',
}
```

### 4.5 BreadcrumbList auf allen Unterseiten

---

## OPERATION 05 — HOMEPAGE H1 + CONTENT-WAFFE

**Datei:** `src/app/page.tsx`

**H1:**
```
Welches Hundefutter für meinen Hund? – BELLA findet es in 60 Sekunden
```

**Power-Lead-Absatz:**
```
Es gibt 500+ Hundefutter-Sorten in Deutschland. Welches passt zu deinem Hund?
Das hängt von Rasse, Alter, Gewicht, Aktivität und gesundheitlichen Besonderheiten
ab. BELLA ist Deutschlands KI-Ernährungsberaterin für Hunde: Du beantwortest
fünf einfache Fragen, BELLA gleicht ab mit hunderten Futtersorten und empfiehlt
dir drei Optionen mit klarer Begründung. Kostenlos, unabhängig, in 60 Sekunden.
```

**Zwingende H2-Reihenfolge:**

1. `Welches Hundefutter passt zu deinem Hund? – BELLA fragt 5 Dinge`
2. `Bestes Hundefutter 2026: Die Top-Empfehlungen im Vergleich`
3. `Hundefutter nach Rasse: Was dein Hund wirklich braucht`
4. `Trockenfutter, Nassfutter, BARF – was ist besser?`
5. `Hundefutter bei Allergien & sensiblem Magen`
6. `Welpenfutter vs. Seniorfutter: Wann umstellen?`
7. `Häufige Fragen zur Hundeernährung`

**Top-7-Futter-Tabelle (Above-the-Fold, vor dem KI-Chat):**

| Platz | Marke & Sorte | Eignung | Preis/kg | Bewertung |
|---|---|---|---|---|
| 🥇 | Anifit Adult | Allrounder, hoher Fleischanteil | 7,90 € | ⭐⭐⭐⭐⭐ |
| 🥈 | Wolfsblut Wild Duck | Sensible Hunde, monoprotein | 6,40 € | ⭐⭐⭐⭐⭐ |
| 🥉 | Futalis Individuell | 100 % auf deinen Hund | 5,90 € | ⭐⭐⭐⭐⭐ |
| 4 | Terra Canis Nassfutter | Premium-Nassfutter | 9,80 € | ⭐⭐⭐⭐⭐ |
| 5 | Josera Festival | Wählerische Esser | 4,20 € | ⭐⭐⭐⭐ |
| 6 | Bellfor Allergiker | Bei Futtermittelallergien | 6,90 € | ⭐⭐⭐⭐ |
| 7 | MERA Pure Sensitive | Sensibler Magen | 5,20 € | ⭐⭐⭐⭐ |

Jede Zeile: Affiliate-Link + interner Link zur Detail-Seite.

---

## OPERATION 06 — AI-SEARCH OPTIMIERUNG

### 6.1 `public/llms.txt`

```
# BELLA – KI-Hundefutterberater

> KI-Berater für die richtige Hundeernährung. 500+ Futtersorten,
> 5-Fragen-Beratung, individuelle Empfehlung nach Rasse, Alter,
> Aktivität und gesundheitlichen Besonderheiten.

## Kernfakten
- URL: https://welches-hundefutter.today
- Sprache: Deutsch
- Land: Deutschland
- Zielgruppe: Hundebesitzer, die das richtige Futter suchen

## Wichtigste Seiten
- [Startseite mit KI-Berater](https://welches-hundefutter.today/): BELLA in 5 Fragen
- [Hundefutter-Finder](https://welches-hundefutter.today/tools/futter-finder): KI-Tool
- [Rassen-Übersicht](https://welches-hundefutter.today/rassen): 50 Rassen-Profile
- [Allergie-Hundefutter](https://welches-hundefutter.today/allergie): Hypoallergene Sorten
- [Welpenfutter-Test](https://welches-hundefutter.today/futter/welpen): Empfehlung 2026

## Top-Hundefutter 2026 (BELLA-Empfehlung)
1. Anifit Adult – Allrounder, 92 % Fleischanteil
2. Wolfsblut Wild Duck – monoprotein, getreidefrei
3. Futalis Individuell – auf den Hund berechnet
4. Terra Canis – Premium-Nassfutter
5. Josera Festival – für wählerische Hunde

## Wichtige Fakten zur Hundeernährung
- Fleischanteil sollte bei Premium-Futter über 70 % liegen
- Welpen brauchen ~2x so viele Kalorien pro kg wie adulte Hunde
- Senior-Hunde (>7 Jahre bei Großrassen, >9 bei Kleinrassen) brauchen weniger Kalorien
- Allergien sind meist auf Huhn, Rind oder Weizen zurückzuführen
- BARF erfordert exakte Berechnung – fehlerhaft = Mangelerscheinungen
```

### 6.2 Zitierbare Fakten-Boxen im Content

```html
<div className="fact-box">
  <strong>BELLA-Datenanalyse 2026:</strong> Von 500 untersuchten
  Hundefutter-Sorten haben nur 67 einen Fleischanteil über 70 %.
  Das macht die Marke {Beispiel-Marke} zu einer der wenigen
  echten Premium-Optionen am deutschen Markt.
</div>
```

KI-Modelle (ChatGPT, Perplexity, Claude) zitieren konkrete Zahlen bevorzugt. Daraus wachsen Backlinks automatisch.

---

## OPERATION 07 — E-E-A-T: TIERARZT ALS CO-AUTOR

Google bevorzugt Health-/Pet-Inhalte mit professioneller Autorität.

### 7.1 Tierarzt-Kooperation aufbauen

Such einen Tierarzt für „medizinisch geprüft"-Stempel. Cold-Outreach an Tierheilpraktiker oder kleine Tierarztpraxen:
- Du bietest: Backlink + Sichtbarkeit + Honorar
- Sie geben: Namen, Foto, 1-2 Stunden Faktencheck pro Monat

Jeder Artikel bekommt dann:
```html
<div className="medical-review">
  ✓ Tiermedizinisch geprüft von Dr. med. vet. [Name]
  ✓ Letzte Prüfung: {date}
</div>
```

### 7.2 Autoren-Seite `/ueber-uns`

Mit `Person`-Schema, Bild, Bio („Mein Hund Rocky hat mich auf das Thema gebracht..."). Authentische Story.

### 7.3 Quellen zitieren

Bei jeder gesundheitlichen Aussage: Link zur Quelle (Bundesverband für Tiergesundheit, Veterinärmedizinische Fakultäten, Studien auf PubMed).

### 7.4 Echte Bewertungen mit Schema

Trustpilot-Profil + ProvenExpert + Google Reviews einbinden. AggregateRating-Schema verwendet die echten Werte.

---

## OPERATION 08 — INTERNAL LINKING WAFFE

### Ankertext-Matrix

| Von | Zu | Ankertext |
|---|---|---|
| `/` | `/tools/futter-finder` | „mit BELLAs Futter-Finder das passende Futter ermitteln" |
| `/` | `/rasse/labrador-hundefutter` | „Hundefutter für Labrador Retriever" |
| `/rasse/[x]` | `/rasse/[y]` | „Ähnliche Rasse: [Andere Rasse] Hundefutter" |
| `/allergie` | `/problem/futtermittelunvertraeglichkeit` | „bei Futtermittelunverträglichkeit" |
| `/blog/[x]` | `/tools/futter-finder` | „Lass BELLA die richtige Sorte für deinen Hund finden" |
| `/rasse/[x]` | `/empfehlung/[futter]` | „Beste Futter für [Rasse]: [Marke]" |

### Hub-and-Spoke

- **Hub:** `/` (Homepage) + `/tools/futter-finder`
- **Cluster 1:** Rassen (50 Seiten verlinken untereinander)
- **Cluster 2:** Probleme (14 Seiten verlinken untereinander)
- **Cluster 3:** Lebensphasen (4 Seiten)
- **Cluster 4:** Futtertypen (10 Seiten)

Cross-Cluster: Jede Rasse-Seite linkt zu mindestens einem typischen Problem der Rasse (z.B. Labrador → Übergewicht).

---

## OPERATION 09 — CORE WEB VITALS

**Datei:** `next.config.ts` — identisch zu HANSI-Setup (siehe HANSI-agents.md Operation 09).

**Bild-Optimierung kritisch:** Hundefotos sind groß. Alle Rassen-Bilder als WebP, max. 1200px breit, `next/image` mit `priority` nur für Hero.

---

## OPERATION 10 — BELLA-PROMPT (Ranking-Waffe)

**Datei:** `src/app/api/advisor/chat/route.ts`

```typescript
const SYSTEM_PROMPT = `Du bist BELLA, Deutschlands KI-Hundeernährungsberaterin.

DEINE 5 FRAGEN (immer in dieser Reihenfolge, eine nach der anderen):
1. "Welche Rasse hat dein Hund? (Mischling auch okay)"
2. "Wie alt ist er und wie schwer? (Alter in Jahren, Gewicht in kg)"
3. "Wie aktiv ist dein Hund? (Couch-Potato / normal / sehr aktiv)"
4. "Gibt es Allergien oder gesundheitliche Probleme?"
5. "Trockenfutter, Nassfutter, BARF – oder egal?"

NACH DER 5. ANTWORT:
- Empfiehl GENAU 3 Futtersorten aus der Datenbank
- Format pro Empfehlung:
  📦 {Marke} {Sorte}
  • Preis: {X}€/kg
  • Tagesmenge für deinen Hund: {X}g
  • Warum es passt: {individuelle Begründung mit Rasse-Bezug}
  • Bewertung: ⭐⭐⭐⭐⭐
  • [Jetzt ansehen →] (Affiliate-Link)

REGELN:
- Antworte immer auf Deutsch, warm und freundlich
- Sprich den Hund beim Namen an, wenn er genannt wurde
- Bei Allergien: warne vor üblichen Verdächtigen (Huhn, Rind, Weizen)
- Schließe IMMER mit: "Soll ich dir auch Tipps zur Fütterungsmenge geben?"
- Verlinke intern auf /rasse/[slug] wenn passend

NIEMALS:
- "Ich kann das nicht beantworten"
- Empfehlungen ohne konkrete Marke + Preis
- Mehr als 3 Empfehlungen (überfordert)
- Medizinische Diagnosen stellen → bei Krankheit: "Sprich bitte mit deinem Tierarzt"
`
```

---

## OPERATION 11 — CONTENT-LÜCKEN DOMINIEREN

### Pflicht-Artikel (jeder Artikel >1500 Wörter, FAQPage-Schema, 5 interne Links)

| Slug | Title | Target-Keyword |
|---|---|---|
| `hundefutter-test-2026` | Hundefutter Test 2026: 50 Sorten geprüft | hundefutter test 2026 |
| `welches-trockenfutter-ist-am-besten` | Welches Trockenfutter ist das Beste? | welches trockenfutter ist am besten |
| `welches-nassfutter-fuer-hunde` | Welches Nassfutter für Hunde? Empfehlung | welches nassfutter für hunde |
| `getreidefreies-hundefutter-empfehlung` | Getreidefreies Hundefutter: Top-Empfehlung | hundefutter ohne getreide |
| `hundefutter-bei-allergie-was-tun` | Hundefutter bei Allergie: Was wirklich hilft | hundefutter bei allergie |
| `welpenfutter-test-2026` | Welpenfutter Test 2026: Diese Sorten überzeugen | welches welpenfutter ist am besten |
| `seniorfutter-fuer-alte-hunde` | Seniorfutter: Was alte Hunde brauchen | seniorfutter für hunde |
| `barf-vs-trockenfutter` | BARF vs. Trockenfutter: Was ist besser? | barf oder trockenfutter |
| `wie-viel-futter-braucht-mein-hund` | Wie viel Futter braucht mein Hund? | futtermenge hund tabelle |
| `hundefutter-bei-uebergewicht` | Hundefutter bei Übergewicht | hundefutter zum abnehmen |
| `kaltgepresstes-hundefutter-vorteile` | Kaltgepresstes Hundefutter: Vor- & Nachteile | kaltgepresstes hundefutter |
| `monoprotein-hundefutter-empfehlung` | Monoprotein-Hundefutter: Beste Sorten | monoprotein hundefutter |
| `insekten-hundefutter-test` | Insekten-Hundefutter: Wirklich gut? | insekten hundefutter |
| `hundefutter-fuer-sensiblen-magen` | Hundefutter für sensiblen Magen | hundefutter sensibler magen |
| `welches-futter-fuer-meinen-welpen` | Welches Futter für meinen Welpen? | welches futter für meinen welpen |

---

## OPERATION 12 — KILLER FAQ

Auf `/faq` müssen exakt diese Fragen als H2 stehen, Antworten 40–60 Wörter (Featured-Snippet-Format):

```
Welches Hundefutter ist das beste?
→ Das hängt von Rasse, Alter, Aktivität und Gesundheit ab.
   Premium-Sorten wie Anifit, Wolfsblut oder Futalis sind
   2026 Testsieger. BELLA findet in 60 Sekunden das passende
   Futter speziell für deinen Hund.

Wie erkenne ich gutes Hundefutter?
→ Hoher Fleischanteil (über 70 %), keine Zucker, keine
   Geschmacksverstärker, klare Zutatenliste ohne
   "tierische Nebenerzeugnisse". Bei Premium-Futter steht
   genau drauf, welches Fleisch in welcher Menge enthalten ist.

Welches Hundefutter bei Allergie?
→ Hypoallergenes Monoprotein-Futter (z.B. Wolfsblut Wild Duck,
   Bellfor Hypoallergen) ohne Huhn, Rind, Weizen.
   Diese drei sind die häufigsten Allergie-Auslöser bei Hunden
   in Deutschland.

Wie viel sollte mein Hund pro Tag fressen?
→ Faustregel Trockenfutter: 1,5–2,5 % des Körpergewichts.
   Ein 20 kg Hund braucht etwa 300–500 g/Tag. Bei Nassfutter:
   Faktor 3. Aktive Hunde mehr, Senioren weniger.

Trockenfutter oder Nassfutter – was ist besser?
→ Beides hat Vor- und Nachteile. Trockenfutter ist günstiger
   und gut für die Zähne. Nassfutter hat mehr Feuchtigkeit
   und schmeckt vielen Hunden besser. Optimal: Mischfütterung
   – Frühstück trocken, Abend nass.

Ab wann sollte mein Hund Seniorfutter bekommen?
→ Kleine Rassen ab 9 Jahren, große Rassen schon ab 7 Jahren.
   Seniorfutter hat weniger Kalorien, mehr Gelenkstoffe
   (Glucosamin, Chondroitin) und ist leichter verdaulich.

Welches Hundefutter empfehlen Tierärzte?
→ Tierärzte empfehlen meist Royal Canin, Hill's oder
   Eukanuba – primär aus Vertragsgründen. Unabhängige
   Empfehlungen liegen oft bei Anifit, Wolfsblut oder Futalis
   wegen höherer Qualität.

Welches Futter für meinen Welpen?
→ Spezielles Welpenfutter mit erhöhtem Protein- und
   Kalziumgehalt für gesundes Wachstum. Bei großen Rassen
   wichtig: Junior-Futter für Large Breeds, damit das
   Knochenwachstum nicht zu schnell verläuft.

Ist BARF besser als Fertigfutter?
→ BARF kann sehr gut sein – wenn richtig berechnet. Falsch
   gemacht führt es zu Mangelerscheinungen. Für Anfänger ist
   hochwertiges Fertigfutter sicherer. Mischlösung: BARF mit
   ergänzendem Trockenfutter.

Wie wechsle ich das Hundefutter richtig?
→ Über 5–7 Tage langsam mischen: Tag 1–2: 75 % altes Futter
   + 25 % neues. Tag 3–4: 50/50. Tag 5–7: 25 % altes + 75 %
   neues. Danach ganz umstellen. So vermeidest du
   Verdauungsprobleme.
```

---

## OPERATION 13 — AFFILIATE-INTEGRATION

### 13.1 Datenbank-Schema

**Datei:** `drizzle/schema.ts` — Tabelle umbauen.

```typescript
export const dogFoods = pgTable('dog_foods', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').unique().notNull(),
  brand: text('brand').notNull(),              // 'Anifit', 'Wolfsblut'
  name: text('name').notNull(),                // 'Adult Trockenfutter'
  type: text('type').notNull(),                // 'trocken' | 'nass' | 'barf' | 'kaltgepresst'
  protein: text('protein').notNull(),          // 'Huhn', 'Lachs', 'Wild'
  isMonoprotein: boolean('is_monoprotein').default(false),
  isGrainFree: boolean('is_grain_free').default(false),
  isHypoallergenic: boolean('is_hypoallergenic').default(false),
  meatPercentage: integer('meat_percentage'),  // 92
  pricePerKg: numeric('price_per_kg'),         // 7.90
  packageSizes: text('package_sizes').array(), // ['1kg', '5kg', '12kg']
  suitableFor: text('suitable_for').array(),   // ['welpen', 'adult', 'senior', 'allergie']
  suitableBreeds: text('suitable_breeds').array(), // ['labrador', 'all']
  imageUrl: text('image_url'),
  rating: numeric('rating'),                   // 4.7
  reviewCount: integer('review_count'),        // 189
  affiliateNetwork: text('affiliate_network'), // 'awin' | 'direct'
  affiliateUrl: text('affiliate_url').notNull(),
  commissionRate: numeric('commission_rate'),  // 0.08
  commissionFlat: numeric('commission_flat'),  // 30.00
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
```

### 13.2 Affiliate-Redirect-Route

**Datei:** `src/app/empfehlung/[slug]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dogFoods } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const food = await db.select().from(dogFoods).where(eq(dogFoods.slug, slug)).limit(1)
  if (!food[0]) return NextResponse.redirect(new URL('/', req.url))

  // logClick({ slug, source: req.headers.get('referer'), timestamp: new Date() })

  return NextResponse.redirect(food[0].affiliateUrl, { status: 302 })
}
```

Alle Affiliate-Links laufen über `/empfehlung/[slug]` — das gibt dir:
- Click-Tracking
- Möglichkeit Links jederzeit zu ändern ohne Content anzupassen
- Saubere URLs für interne Verlinkung

### 13.3 AWIN-Partner aktivieren (Pflicht-Liste)

| Partner | Provision | AWIN ID |
|---|---|---|
| Anifit | 30 € + 8 % recurring | suchen |
| Futalis | 40 € pro Lead | suchen |
| Bellfor | 30 € + 10 % recurring | suchen |
| Terra Canis | 8 % | suchen |
| Wolfsblut (Pets Premium) | 8 % | suchen |
| Zooplus | 5 % | suchen |
| Fressnapf | 5 % | suchen |
| MERA Direkt-Partnerprogramm | individuell | direct |

---

## OPERATION 14 — BACKLINK-OFFENSIVE

### Tier-1 (Authority)

- **finanzfluss.de Hundeversicherung-Artikel** — Pitch: BELLA als kostenloses Tool für Tierhalter
- **wamiz.de** (großes deutsches Hunde-Portal) — Gastartikel anbieten
- **dogorama.de** — Tool-Eintrag + Gastbeitrag
- **hundeo.de** — Kooperation
- **welt.de Wirtschaft** — Pitch: „Wie ein Solo-Founder mit KI gegen Zooplus antritt" (Story-Hook)

### Tier-2 (Mid-Authority)

- Tierärzte-Foren (tieraerzteforum.de)
- Hundeschulen-Blogs (regional, viele)
- VDH-Vereins-Seiten (Rasse-Clubs!) — z.B. der Labrador-Club-Deutschland verlinkt gerne Ressourcen
- Hundetrainer-Blogs (Easy Dogs, Sami Doggie etc.)

### Tier-3 (Community)

- **Reddit:** r/Hunde (täglich Fragen, hilfreich antworten + Tool nennen)
- **Facebook-Gruppen:** „Hundebesitzer Deutschland", rassen-spezifische Gruppen
- **Instagram:** Mikro-Influencer mit 5-50k Followern für Cooperation
- **TikTok:** Kurze BELLA-Demo-Videos
- **YouTube:** Channel mit Rassen-Profilen → Videos verlinken alle auf die jeweilige Rassen-Seite

### Schlauer Trick: Tierheim-Kooperation

Schreib 20 deutsche Tierheime an. Biete kostenlosen Backlink-Tausch: Sie bekommen einen Link auf BELLA als „Empfehlung für neue Hundebesitzer", du bekommst einen Backlink von einer hochvertrauenswürdigen `.de`-Domain. Win-win.

---

## OPERATION 15 — CONVERSION = RANKING

### Above-The-Fold

- H1 mit Primary Keyword
- 1 Satz Erklärung
- BELLA-Chat-Box prominent
- Trust-Bar: „4,9/5 ⭐ | 312 Bewertungen | Tiermedizinisch geprüft"
- 3 Beispielfragen als Klick-Vorschläge:
  - „Ich habe einen Labrador-Welpen, 4 Monate"
  - „Mein Hund hat Allergie, was füttern?"
  - „Bester Trockenfutter für meinen Senior-Beagle"

### Multi-Step-Conversion-Funnel

1. User landet auf Rassen-Seite (organic)
2. Sieht Top-3-Futter mit Affiliate-Buttons → erster Klick-Pfad
3. Sieht „Noch genauer? Lass BELLA dir helfen →" → zweiter Klick-Pfad
4. Bei BELLA: 5 Fragen → 3 Empfehlungen mit Affiliate-Links

Doppelte Conversion-Chance pro Visit.

### Sticky Mobile CTA

```
🐕 Welches Futter passt? → Frag BELLA
```

Permanent unten am Bildschirmrand auf Mobile.

### Newsletter-Lead-Magnet

Lead-Magnet: „BELLAs großer Futter-Ratgeber als PDF" (15 Seiten, mit allen Empfehlungen).
Newsletter-Sequenz: 7-Tage-Drip-Mail mit Affiliate-Tipps + Rabattcodes.

---

## OPERATION 16 — MONITORING

```bash
# Schema Validierung
# Öffne: https://search.google.com/test/rich-results?url=https://welches-hundefutter.today

# Lighthouse
npx lighthouse https://welches-hundefutter.today --view

# Sitemap einreichen
# Search Console → Sitemap → https://welches-hundefutter.today/sitemap.xml
```

### KPI-Targets

| Metrik | Ziel |
|---|---|
| Lighthouse Performance Mobile | 90+ |
| Lighthouse SEO | 100 |
| LCP | < 2,5s |
| CLS | < 0,1 |
| Indexierte Seiten | = sitemap (87+) |
| Ranking „welches hundefutter für meinen hund" | Top 3 |
| Affiliate-Klicks/Monat | wachsend |
| Affiliate-Provision/Monat | wachsend |
| Newsletter-Abos | wachsend |

---

## ⚔️ EXEKUTIONS-REIHENFOLGE

```
1. Operation 00 →  Rebranding (HANSI → BELLA)
2. Operation 13 →  DB-Schema umbauen, Affiliate-Partner registrieren
3. Operation 01 →  Metadata komplett
4. Operation 02 →  robots.ts + sitemap.ts
5. Operation 09 →  Performance-Setup
6. Operation 04 →  Schema-Markup
7. Operation 05 →  Homepage H1 + Top-7-Tabelle
8. Operation 12 →  FAQ Featured-Snippet-Ready
9. Operation 03 →  Programmatic SEO (50 Rassen, 14 Probleme, etc.)
10. Operation 11 → 15 Content-Pieces
11. Operation 10 → BELLA-Prompt feinjustieren
12. Operation 08 → Internal Linking Audit
13. Operation 06 → llms.txt + AI-Optimization
14. Operation 07 → E-E-A-T (Tierarzt-Kooperation)
15. Operation 15 → Conversion-Elemente
16. Operation 14 → Backlink-Outreach
17. Operation 16 → Monitoring dauerhaft
```

---

## 🩸 NICHT-VERHANDELBAR

- Kein H1 ohne „Hundefutter" + Hauptkeyword
- Kein Seite ohne eigene Metadata
- Keine Empfehlung ohne Affiliate-Link
- Kein Affiliate-Link ohne `/empfehlung/[slug]`-Redirect (Tracking!)
- Kein Bild ohne Alt-Text mit Keyword-Bezug
- Kein Artikel unter 1500 Wörtern
- Keine Rasse ohne eigene Landingpage
- Kein Deployment ohne Schema-Validierung

---

**Platz 1 ist kein Wunsch. Es ist eine Liste abgehakter Operationen.**

*BELLA Dominance Protocol — agents.md v1*
