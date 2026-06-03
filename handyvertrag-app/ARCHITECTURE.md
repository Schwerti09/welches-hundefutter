# handytrotzschufa.today – Enterprise Architecture

## Overview

handytrotzschufa.today is a Next.js 16.2.6 enterprise commerce platform for German mobile phone contract comparison, powered by AI-assisted recommendations, programmatic SEO, and a multi-layer data intelligence system. Deployed on Netlify at https://handytrotzschufa.today.

---

## System Architecture (ASCII Diagram)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          handytrotzschufa.today                                  │
│                     Enterprise Commerce Platform                             │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────────────────────────┐
  │  CDN / Edge Layer (Netlify Edge Network)                                  │
  │                                                                           │
  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                   │
  │  │ Static Cache │  │ Image Optim. │  │ Edge Proxy   │                   │
  │  │ (ISR/SSG)    │  │ (Unsplash)   │  │ (Security)   │                   │
  │  └──────────────┘  └──────────────┘  └──────────────┘                   │
  └──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Next.js 16 App Router (Turbopack)                                        │
  │                                                                           │
  │  ┌─────────────────────────────────────────────────────────────────────┐ │
  │  │  Proxy Layer (src/proxy.ts)                                          │ │
  │  │  • Rate limiting (60 req/min API, 200 req/min pages)                │ │
  │  │  • Security headers (CSP, HSTS, X-Frame-Options, etc.)              │ │
  │  │  • Request ID injection                                             │ │
  │  └─────────────────────────────────────────────────────────────────────┘ │
  │                                                                           │
  │  ┌──────────────────────┐  ┌──────────────────────┐                      │
  │  │  Server Components   │  │  Client Components   │                      │
  │  │  (RSC / SSG)         │  │  (Hydrated)          │                      │
  │  │                      │  │                      │                      │
  │  │  • layout.tsx        │  │  • FilteredProducts  │                      │
  │  │  • page.tsx          │  │  • ChatUIWrapper     │                      │
  │  │  • /hamburg          │  │  • AIAdvisor         │                      │
  │  │  • /berlin           │  │  • CityOfferCard     │                      │
  │  │  • /muenchen         │  │  • FaqAccordion      │                      │
  │  │  • /koeln            │  │  • ProductCard       │                      │
  │  │  • /frankfurt        │  │  • RecommendCard     │                      │
  │  │  • /stuttgart        │  │                      │                      │
  │  │  • /handys/[slug]    │  └──────────────────────┘                      │
  │  └──────────────────────┘                                                 │
  │                                                                           │
  │  ┌──────────────────────────────────────────────────────────────────────┐ │
  │  │  API Routes (/api/*)                                                  │ │
  │  │                                                                       │ │
  │  │  /api/advisor/chat     – Smart AI chat with intent parsing           │ │
  │  │  /api/advisor/recommend – Product recommendations                    │ │
  │  │  /api/advisor/refine   – Preference refinement                       │ │
  │  │  /api/products         – Product catalog                             │ │
  │  │  /api/products/[id]    – Single product                              │ │
  │  │  /api/recommendations  – Personalized recommendations                │ │
  │  │  /api/health           – Health check                                │ │
  │  └──────────────────────────────────────────────────────────────────────┘ │
  └──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Intelligence Platform (src/features/)                                    │
  │                                                                           │
  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │
  │  │ AI Advisor     │  │ Intelligence   │  │ SEO Platform   │             │
  │  │ Engine         │  │ Layer          │  │ (Entity Graph) │             │
  │  │                │  │                │  │                │             │
  │  │ • Intent       │  │ • Device       │  │ • Topic Clust. │             │
  │  │   Classifier   │  │   Intelligence │  │ • Internal     │             │
  │  │ • Scoring      │  │ • Contract     │  │   Linking      │             │
  │  │   Engine       │  │   Intelligence │  │ • Metadata     │             │
  │  │ • Profile Mgr  │  │ • Comparison   │  │   Engine       │             │
  │  │ • Recommend.   │  │   Engine       │  │ • Struct. Data │             │
  │  │   Engine       │  │ • Value Score  │  │ • EEAT         │             │
  │  └────────────────┘  └────────────────┘  └────────────────┘             │
  │                                                                           │
  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐             │
  │  │ Personalization│  │ Data Platform  │  │ Commerce OS    │             │
  │  │ Platform       │  │                │  │                │             │
  │  │                │  │ • AWIN Feed    │  │ • Market Sig.  │             │
  │  │ • Behavioral   │  │   Ingestion    │  │ • Trend Detect │             │
  │  │   Scoring      │  │ • Normalization│  │ • Prediction   │             │
  │  │ • Affinity     │  │ • Validation   │  │ • Insight Gen  │             │
  │  │   Engine       │  │ • Pricing      │  │ • Automation   │             │
  │  │ • Intent       │  │   Intelligence │  │ • Dashboard    │             │
  │  │   Evolution    │  │ • Affiliate    │  │                │             │
  │  └────────────────┘  └────────────────┘  └────────────────┘             │
  │                                                                           │
  │  ┌──────────────────────────────────────────────────────────────────────┐ │
  │  │  Platform Integration Layer (src/platform/)                           │ │
  │  │  • Unified Event Bus    • Cross-System Sync    • State Management    │ │
  │  │  • Execution Pipelines  • Caching Strategy     • Resilience          │ │
  │  └──────────────────────────────────────────────────────────────────────┘ │
  └──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │  Data Sources                                                             │
  │                                                                           │
  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐               │
  │  │ Static Data   │  │ AWIN Network  │  │ Provider APIs │               │
  │  │ (products.ts) │  │ (Live Feeds)  │  │ (Future)      │               │
  │  └───────────────┘  └───────────────┘  └───────────────┘               │
  └──────────────────────────────────────────────────────────────────────────┘
```

---

## Domain Structure

```
handytrotzschufa.today/
├── /                           # Homepage – product comparison, AI advisor
├── /hamburg                    # City page – Hamburg offers
├── /berlin                     # City page – Berlin offers
├── /muenchen                   # City page – Munich offers
├── /koeln                      # City page – Cologne offers
├── /frankfurt                  # City page – Frankfurt offers
├── /stuttgart                  # City page – Stuttgart offers
├── /handys/[slug]              # Device detail pages (SSG)
├── /sitemap.xml                # Dynamic sitemap
├── /robots.txt                 # Robots configuration
└── /api/
    ├── /advisor/chat           # AI chat endpoint
    ├── /advisor/recommend      # Recommendation engine
    ├── /advisor/refine         # Preference refinement
    ├── /products               # Product catalog
    ├── /products/[id]          # Single product
    ├── /recommendations        # Personalized recs
    └── /health                 # Health check
```

---

## Scaling Strategy

### Current (Phase 1 – Netlify Serverless)
- Static pages pre-rendered at build time (SSG) for all city + device pages
- API routes run as Netlify serverless functions
- CDN caches static assets with long TTL (1 year for immutable assets)
- Rate limiting at proxy layer (in-memory, per instance)

### Phase 2 – Edge Computing
- Move proxy logic to Netlify Edge Functions (global distribution)
- Rate limiting via Upstash Redis (distributed, persistent)
- ISR (Incremental Static Regeneration) for price-sensitive pages
- Edge-side personalization without server round-trip

### Phase 3 – Distributed Architecture
- Separate data ingestion service (Node.js workers)
- Message queue for provider feed processing (BullMQ / SQS)
- Dedicated recommendation service with caching layer
- Read replicas for analytics queries
- Multi-region deployment (EU-West + EU-Central)

### Phase 4 – Enterprise Scale
- Kubernetes + Docker for stateful services
- Event-driven architecture with Kafka
- ML model serving for personalized recommendations
- A/B testing infrastructure
- Real-time pricing updates via WebSockets

---

## Data Flow

```
Provider Feed (AWIN CSV/ZIP)
        │
        ▼
AWIN Feed Adapter
        │
        ▼
ZIP Extractor → CSV Processor
        │
        ▼
Raw Offer Storage (In-memory / DB)
        │
        ▼
Normalizer (Provider, Device, Price, Data)
        │
        ▼
Deduplication + Matching Engine
        │
        ▼
Validation (Price checks, Broken links, Duplicates)
        │
        ▼
Enrichment Pipeline
  ├── Intelligence Scores (Camera, Gaming, Value)
  ├── SEO Metadata (Title, Description)
  ├── Recommendation Tags
  └── Semantic Entities
        │
        ▼
Product Store (products.ts / Future: DB)
        │
        ▼
API Layer → Next.js Pages → CDN → User
```

---

## AI Architecture

```
User Message
     │
     ▼
Intent Parser (rule-based NLP)
  ├── Budget extraction (regex patterns)
  ├── Provider detection (keyword matching)
  ├── Brand detection (keyword matching)
  ├── Data needs detection (unlimited/high/low)
  └── Use case detection (gaming/camera/student/business)
     │
     ▼
Scoring Engine (multi-dimensional)
  ├── Budget score (within budget = pass, savings bonus)
  ├── Provider match score (+25)
  ├── Brand match score (+20)
  ├── Data needs score (+20)
  ├── Use case / tag match score (+20)
  ├── Cashback bonus (up to +10)
  ├── Rating boost (+10 per 0.1 above 4.0)
  └── One-time cost penalty (up to -5)
     │
     ▼
Top-N Recommendations (sorted by score)
     │
     ▼
Response Generator
  ├── Product-specific responses
  ├── Budget-driven recommendations
  ├── Provider-specific responses
  ├── Use-case recommendations
  └── Default helpful response
     │
     ▼
Structured JSON Response
  { reply, nextQuestion, sessionId }

Future: OpenAI/Anthropic integration
  └── Replace rule-based NLP with LLM
  └── Add vector embeddings for semantic search
  └── Personalization with user history
```

---

## Security Model

### Proxy Layer (src/proxy.ts)
- **Rate limiting**: 60 req/min for API, 200 req/min for pages (per IP)
- **429 response**: JSON with Retry-After header
- **Request ID**: UUID injected per request for tracing

### Security Headers
| Header | Value |
|--------|-------|
| Content-Security-Policy | strict CSP with allowlist |
| Strict-Transport-Security | max-age=31536000; includeSubDomains; preload |
| X-Frame-Options | DENY |
| X-Content-Type-Options | nosniff |
| Referrer-Policy | strict-origin-when-cross-origin |
| Permissions-Policy | camera=(), microphone=(), geolocation=() |
| Cross-Origin-Opener-Policy | same-origin |

### Input Validation
- All API endpoints use Zod schema validation
- Message length limits enforced (1-500 chars for chat)
- Type-safe TypeScript throughout

### Affiliate Security
- Outbound affiliate links use `rel="noopener noreferrer sponsored"`
- AWIN tracking IDs kept server-side
- No PII collected without consent

---

## SEO Strategy

### Technical SEO
- Dynamic sitemap (sitemap.ts) with all pages and priorities
- robots.ts with GPTBot block, Google-Extended allow
- JSON-LD structured data: Organization, WebSite, Product, FAQ, Breadcrumb
- Canonical URLs on all pages
- OG tags and Twitter cards
- German-language hreflang ready

### Content Strategy
- City pages for all major German cities (Hamburg, Berlin, Munich, Cologne, Frankfurt, Stuttgart)
- Device detail pages with full specs, all offers, FAQ, related products
- FAQ with structured data for rich snippets
- Breadcrumb navigation with structured data

### Programmatic SEO
- Device pages auto-generated from product catalog (`/handys/[slug]`)
- City pages with local business data and store counts
- Scalable to hundreds of cities via template system
- Quality safeguards: unique content per page, no duplication

### Keyword Strategy
- Primary: "Handyvertrag Vergleich", "Handy mit Vertrag"
- City-specific: "Handyvertrag Hamburg/Berlin/München..."
- Device-specific: "iPhone 16 Pro Vertrag", "Samsung Galaxy S25 Ultra Vertrag"
- Provider-specific: "Telekom Vertrag", "Vodafone Tarif"

---

## Performance Strategy

### Build-time Optimization
- SSG for all static pages (city pages, device pages, homepage)
- `generateStaticParams` for device pages (no server rendering needed)
- Turbopack compilation (6.5s build time)

### Runtime Optimization
- `compress: true` in next.config.ts (gzip/brotli)
- Image optimization with Unsplash remote patterns
- Long-lived cache headers for static assets (1 year, immutable)
- Dynamic imports with `ssr: true` for heavy components

### CDN Strategy
- Netlify CDN: static assets cached globally
- Cache-Control headers:
  - `_next/static/*`: `max-age=31536000, immutable`
  - Images: `max-age=86400, stale-while-revalidate=3600`
- Sitemap and robots.txt statically generated

### Core Web Vitals Targets
- LCP < 2.5s (hero section optimized, minimal JS)
- FID < 100ms (client components isolated)
- CLS < 0.1 (fixed layout, no dynamic height shifts)

---

## DevOps Approach

### CI/CD Pipeline
```
Developer → Git Push → GitHub
                          │
                          ▼
                    Netlify CI
                    ├── npm install
                    ├── npm run build (Next.js)
                    └── Deploy to CDN
```

### Deployment
- Platform: Netlify (netlify.toml configured)
- Plugin: @netlify/plugin-nextjs
- Environment: NODE_ENV=production, NEXT_TELEMETRY_DISABLED=1
- Deploy command: `netlify deploy --prod`

### Monitoring
- Health check endpoint: `/api/health`
- Request ID header for distributed tracing
- Production logging system (src/lib/environment/production-logging.ts)
- Feature flags for gradual rollout

### Environments
- Production: https://handytrotzschufa.today
- Preview: Netlify deploy previews per PR
- Development: `npm run dev` (localhost:3000)

---

## Roadmap

### Q2 2026 (Current)
- [x] Core product comparison platform
- [x] AI advisor with intent parsing
- [x] Hamburg city page
- [x] SEO infrastructure (sitemap, robots, JSON-LD)
- [x] City pages (Berlin, Munich, Cologne, Frankfurt, Stuttgart)
- [x] Device detail pages (SSG)
- [x] Security middleware (rate limiting, headers)
- [x] Performance optimization (compression, caching)

### Q3 2026
- [ ] Real AWIN feed integration (live data)
- [ ] OpenAI/Claude LLM integration for advisor
- [ ] User accounts with saved favorites
- [ ] Price alert system
- [ ] Comparison tool (A vs B)
- [ ] Additional city pages (Düsseldorf, Leipzig, Bremen)

### Q4 2026
- [ ] Mobile app (React Native)
- [ ] Partner API for resellers
- [ ] Advanced analytics dashboard
- [ ] A/B testing framework
- [ ] Multi-language support (EN)

### 2027
- [ ] Vector search for semantic product discovery
- [ ] Personalized email recommendations
- [ ] Provider direct API integration
- [ ] Real-time price tracking
- [ ] ML-powered demand forecasting
