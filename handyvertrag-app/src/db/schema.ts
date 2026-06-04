import { pgTable, text, numeric, integer, boolean, timestamp, uuid, serial, index, jsonb } from "drizzle-orm/pg-core";

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

// ─── Rassen-Profile ──────────────────────────────────────────────────────────

export const dogBreeds = pgTable("dog_breeds", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  alternativeNames: text("alternative_names").array(),
  size: text("size").notNull(), // 'klein' | 'mittel' | 'gross' | 'sehrgross'
  weightMin: numeric("weight_min"),
  weightMax: numeric("weight_max"),
  lifeExpectancy: integer("life_expectancy"),
  activityLevel: text("activity_level"),
  commonHealthIssues: text("common_health_issues").array(),
  recommendedProteinPercentage: integer("recommended_protein_percentage"),
  recommendedFatPercentage: integer("recommended_fat_percentage"),
  feedingNotes: text("feeding_notes"),
  description: text("description"),
  imageUrl: text("image_url"),
  recommendedFoodIds: text("recommended_food_ids").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type DogBreed = typeof dogBreeds.$inferSelect;
export type NewDogBreed = typeof dogBreeds.$inferInsert;

// ─── Gesundheitsprobleme ─────────────────────────────────────────────────────

export const healthIssues = pgTable("health_issues", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  symptoms: text("symptoms").array(),
  feedingApproach: text("feeding_approach"),
  recommendedFoodTypes: text("recommended_food_types").array(),
  avoidIngredients: text("avoid_ingredients").array(),
  recommendedFoodIds: text("recommended_food_ids").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type HealthIssue = typeof healthIssues.$inferSelect;
export type NewHealthIssue = typeof healthIssues.$inferInsert;

// ─── Klick-Tracking ──────────────────────────────────────────────────────────

export const affiliateClicks = pgTable("affiliate_clicks", {
  id: uuid("id").defaultRandom().primaryKey(),
  foodId: uuid("food_id"),
  sourceUrl: text("source_url"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  sessionId: text("session_id"),
  bellaConversation: boolean("bella_conversation").default(false),
  clickedAt: timestamp("clicked_at").defaultNow(),
});

// ─── BELLA Chat-Sessions ─────────────────────────────────────────────────────

export const advisorSessions = pgTable("advisor_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: text("session_id").unique().notNull(),
  breedSlug: text("breed_slug"),
  dogAge: integer("dog_age"),
  dogWeight: numeric("dog_weight"),
  activityLevel: text("activity_level"),
  healthIssuesList: text("health_issues").array(),
  preferredFoodType: text("preferred_food_type"),
  recommendedFoodIds: text("recommended_food_ids").array(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});
