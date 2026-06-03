import { MetadataRoute } from "next";
import { products } from "@/data/products";
import { blogArticles } from "@/data/blogArticles";

const BASE = "https://handytrotzschufa.today";

const ANBIETER_SLUGS = [
  "1und1-trotz-schufa",
  "freenet-trotz-schufa",
  "congstar-trotz-schufa",
  "otelo-trotz-schufa",
  "maingau-trotz-schufa",
  "klarmobil-trotz-schufa",
  "o2-trotz-schufa",
  "vodafone-trotz-schufa",
  "telekom-trotz-schufa",
];

const HANDY_SLUGS = [
  "iphone-16-trotz-schufa",
  "iphone-15-trotz-schufa",
  "iphone-14-trotz-schufa",
  "samsung-galaxy-s24-trotz-schufa",
  "samsung-galaxy-a55-trotz-schufa",
  "samsung-galaxy-a25-trotz-schufa",
  "google-pixel-8-trotz-schufa",
  "xiaomi-redmi-12-trotz-schufa",
];

const STADT_SLUGS = [
  "berlin-handyvertrag-trotz-schufa",
  "hamburg-handyvertrag-trotz-schufa",
  "muenchen-handyvertrag-trotz-schufa",
  "koeln-handyvertrag-trotz-schufa",
  "frankfurt-handyvertrag-trotz-schufa",
  "stuttgart-handyvertrag-trotz-schufa",
  "duesseldorf-handyvertrag-trotz-schufa",
  "leipzig-handyvertrag-trotz-schufa",
];

const CITIES = ["berlin", "hamburg", "muenchen", "koeln", "frankfurt", "stuttgart", "duesseldorf", "leipzig"];

const PROVIDERS = ["telekom", "vodafone", "o2", "freenet", "otelo", "congstar"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/faq`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/guides`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/tools`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/tools/schufa-rechner`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/tools/vergleich`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${BASE}/deals`, lastModified: now, changeFrequency: "daily", priority: 0.85 },
    { url: `${BASE}/handys`, lastModified: now, changeFrequency: "daily", priority: 0.85 },
    { url: `${BASE}/ueber-uns`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/impressum`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/datenschutz`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/affiliate`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/agb`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/contract-tuev`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
  ];

  const anbieterPages: MetadataRoute.Sitemap = ANBIETER_SLUGS.map((slug) => ({
    url: `${BASE}/anbieter/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const handyPages: MetadataRoute.Sitemap = HANDY_SLUGS.map((slug) => ({
    url: `${BASE}/handy/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const stadtPages: MetadataRoute.Sitemap = STADT_SLUGS.map((slug) => ({
    url: `${BASE}/stadt/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const cityPages: MetadataRoute.Sitemap = CITIES.map((city) => ({
    url: `${BASE}/${city}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const devicePages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE}/handys/${p.id}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.85,
  }));

  const comboPages: MetadataRoute.Sitemap = products.flatMap((p) =>
    PROVIDERS.map((prov) => ({
      url: `${BASE}/handys/${p.id}/${prov}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }))
  );

  const blogPages: MetadataRoute.Sitemap = blogArticles.map((a) => ({
    url: `${BASE}/blog/${a.slug}`,
    lastModified: new Date(a.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...anbieterPages,
    ...handyPages,
    ...stadtPages,
    ...cityPages,
    ...devicePages,
    ...comboPages,
    ...blogPages,
  ];
}
