import { pgTable, text, numeric, integer, boolean, timestamp, uuid, serial, index } from "drizzle-orm/pg-core";

// Legacy-Tabelle (für Rückwärtskompatibilität mit alten Imports)
export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  brand: text("brand").notNull(),
  deviceName: text("device_name").notNull(),
  deviceSlug: text("device_slug").notNull(),
  imageUrl: text("image_url"),
  providerName: text("provider_name").notNull(),
  futterfName: text("futterf_name").notNull(),
  monthlyPrice: numeric("monthly_price", { precision: 8, scale: 2 }).notNull(),
  effectiveMonthlyPrice: numeric("effective_monthly_price", { precision: 8, scale: 2 }),
  oneTimePrice: numeric("one_time_price", { precision: 8, scale: 2 }).default("0"),
  dataVolume: text("data_volume"),
  dataVolumeGb: numeric("data_volume_gb", { precision: 8, scale: 1 }),
  isUnlimited: boolean("is_unlimited").default(false),
  has5g: boolean("has_5g").default(false),
  contractMonths: integer("contract_months").default(24),
  affiliateLink: text("affiliate_link").notNull(),
  sourceFeed: text("source_feed"),
  cashback: numeric("cashback", { precision: 8, scale: 2 }),
  networkName: text("network_name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Offer = typeof offers.$inferSelect;
export type NewOffer = typeof offers.$inferInsert;

// ─── Neue Haupttabelle: Hundefutter ─────────────────────────────────────────

export const dogFoods = pgTable("dog_foods", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique().notNull(),
  brand: text("brand").notNull(),               // 'Anifit', 'Wolfsblut'
  name: text("name").notNull(),                 // 'Adult Trockenfutter'
  type: text("type").notNull(),                 // 'trocken' | 'nass' | 'barf' | 'kaltgepresst'
  protein: text("protein").notNull(),            // 'Huhn', 'Lachs', 'Wild'
  isMonoprotein: boolean("is_monoprotein").default(false),
  isGrainFree: boolean("is_grain_free").default(false),
  isHypoallergenic: boolean("is_hypoallergenic").default(false),
  meatPercentage: integer("meat_percentage"),    // 92
  pricePerKg: numeric("price_per_kg", { precision: 8, scale: 2 }),
  packageSizes: text("package_sizes").array(),  // ['1kg', '5kg', '12kg']
  suitableFor: text("suitable_for").array(),    // ['welpen', 'adult', 'senior', 'allergie']
  suitableBreeds: text("suitable_breeds").array(), // ['labrador', 'all']
  imageUrl: text("image_url"),
  rating: numeric("rating", { precision: 3, scale: 1 }),
  reviewCount: integer("review_count"),
  affiliateNetwork: text("affiliate_network"),  // 'awin' | 'direct'
  affiliateUrl: text("affiliate_url").notNull(),
  commissionRate: numeric("commission_rate", { precision: 5, scale: 4 }),  // 0.08
  commissionFlat: numeric("commission_flat", { precision: 8, scale: 2 }),  // 30.00
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  slugIdx: index("dog_foods_slug_idx").on(table.slug),
  brandIdx: index("dog_foods_brand_idx").on(table.brand),
  typeIdx: index("dog_foods_type_idx").on(table.type),
}));

export type DogFood = typeof dogFoods.$inferSelect;
export type NewDogFood = typeof dogFoods.$inferInsert;

// ─── Klick-Tracking ──────────────────────────────────────────────────────────

export const affiliateClicks = pgTable("affiliate_clicks", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull(),
  referer: text("referer"),
  clickedAt: timestamp("clicked_at").defaultNow(),
});
