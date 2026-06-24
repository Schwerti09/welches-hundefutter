import {
  pgTable, text, numeric, integer, boolean, timestamp,
  uuid, serial, index, jsonb,
} from "drizzle-orm/pg-core";

// ─── Legacy (Rückwärtskompatibilität) ────────────────────────────────────────
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

// ─── Hundefutter (Hauptkatalog) ───────────────────────────────────────────────
export const dogFoods = pgTable("dog_foods", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique().notNull(),
  brand: text("brand").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),               // trocken | nass | barf | kaltgepresst | snack | oel | nem
  protein: text("protein"),
  isMonoprotein: boolean("is_monoprotein").default(false),
  isGrainFree: boolean("is_grain_free").default(false),
  isHypoallergenic: boolean("is_hypoallergenic").default(false),
  meatPercentage: integer("meat_percentage"),
  pricePerKg: numeric("price_per_kg", { precision: 8, scale: 2 }),
  price: numeric("price", { precision: 8, scale: 2 }),
  packageSizes: text("package_sizes").array(),
  suitableFor: text("suitable_for").array(),
  suitableBreeds: text("suitable_breeds").array(),
  imageUrl: text("image_url"),
  rating: numeric("rating", { precision: 3, scale: 1 }),
  reviewCount: integer("review_count"),
  score: integer("score"),                    // BELLA-Score 0-100
  category: text("category"),                 // hauptfutter | snack | oel | nem | versicherung | zubehoer
  companionFor: text("companion_for").array(), // slugs für Cross-Sell
  affiliateNetwork: text("affiliate_network"),
  affiliateUrl: text("affiliate_url").notNull(),
  commissionRate: numeric("commission_rate", { precision: 5, scale: 4 }),
  commissionFlat: numeric("commission_flat", { precision: 8, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  slugIdx: index("dog_foods_slug_idx").on(table.slug),
  brandIdx: index("dog_foods_brand_idx").on(table.brand),
  typeIdx: index("dog_foods_type_idx").on(table.type),
  categoryIdx: index("dog_foods_category_idx").on(table.category),
}));

export type DogFood = typeof dogFoods.$inferSelect;
export type NewDogFood = typeof dogFoods.$inferInsert;

// ─── Preis-Historie ───────────────────────────────────────────────────────────
export const priceHistory = pgTable("price_history", {
  id: serial("id").primaryKey(),
  foodSlug: text("food_slug").notNull(),
  pricePerKg: numeric("price_per_kg", { precision: 8, scale: 2 }).notNull(),
  recordedAt: timestamp("recorded_at").defaultNow(),
}, (table) => ({
  slugTimeIdx: index("price_history_slug_time_idx").on(table.foodSlug, table.recordedAt),
}));

export type PriceHistory = typeof priceHistory.$inferSelect;

// ─── Rassen-Profile ───────────────────────────────────────────────────────────
export const dogBreeds = pgTable("dog_breeds", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  alternativeNames: text("alternative_names").array(),
  size: text("size").notNull(),               // klein | mittel | gross | sehrgross
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

// ─── Gesundheitsprobleme ──────────────────────────────────────────────────────
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

// ─── E-Mail-Audience (Double-Opt-in) ─────────────────────────────────────────
export const subscribers = pgTable("subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").unique().notNull(),
  doiToken: text("doi_token").unique().notNull(),
  doiConfirmedAt: timestamp("doi_confirmed_at"),
  consentIp: text("consent_ip"),
  consentUserAgent: text("consent_user_agent"),
  unsubscribeToken: text("unsubscribe_token").unique().notNull(),
  unsubscribedAt: timestamp("unsubscribed_at"),
  dogProfile: jsonb("dog_profile").default({}),
  source: text("source").default("advisor"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  doiTokenIdx: index("subscribers_doi_token_idx").on(table.doiToken),
  unsubTokenIdx: index("subscribers_unsub_token_idx").on(table.unsubscribeToken),
}));

export type Subscriber = typeof subscribers.$inferSelect;
export type NewSubscriber = typeof subscribers.$inferInsert;

// ─── Preis-Wecker (+ Nachschub-Wecker) ───────────────────────────────────────
export const priceAlerts = pgTable("price_alerts", {
  id: uuid("id").defaultRandom().primaryKey(),
  subscriberId: uuid("subscriber_id").notNull().references(() => subscribers.id, { onDelete: "cascade" }),
  foodSlug: text("food_slug").notNull(),
  foodName: text("food_name"),
  baselinePricePerKg: numeric("baseline_price_per_kg", { precision: 8, scale: 2 }),
  targetPricePerKg: numeric("target_price_per_kg", { precision: 8, scale: 2 }),
  mode: text("mode").default("price").notNull(),  // price | refill
  dogProfileId: uuid("dog_profile_id"),           // FK → dog_profiles (Nachschub-Wecker)
  refillDueAt: timestamp("refill_due_at"),        // wann wird der Sack leer?
  lastNotifiedAt: timestamp("last_notified_at"),
  lastNotifiedPrice: numeric("last_notified_price", { precision: 8, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  subFoodIdx: index("price_alerts_sub_food_idx").on(table.subscriberId, table.foodSlug),
  foodIdx: index("price_alerts_food_idx").on(table.foodSlug),
}));

export type PriceAlert = typeof priceAlerts.$inferSelect;
export type NewPriceAlert = typeof priceAlerts.$inferInsert;

// ─── Hunde-Profile (Futter-Pass / Schwungrad) ────────────────────────────────
export const dogProfiles = pgTable("dog_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  subscriberId: uuid("subscriber_id"),           // optional bis E-Mail-Bestätigung
  name: text("name").notNull(),                  // "Bello"
  breedSlug: text("breed_slug"),
  birthOrAge: text("birth_or_age"),              // "2021-03" oder "3 Jahre"
  weightKg: numeric("weight_kg", { precision: 5, scale: 1 }),
  activityLevel: text("activity_level"),         // niedrig | mittel | hoch | sehr_hoch
  allergies: text("allergies").array(),          // ['huhn', 'rind', 'weizen']
  healthFlags: text("health_flags").array(),     // ['gelenke', 'nieren', 'uebergewicht']
  currentFoodSlug: text("current_food_slug"),
  currentPackageG: integer("current_package_g"),
  lastPurchaseAt: timestamp("last_purchase_at"),
  estDailyGrams: integer("est_daily_grams"),     // Verbrauchsmathematik-Ergebnis
  estBagDays: integer("est_bag_days"),           // wie lange hält der Sack
  shareToken: text("share_token").unique(),      // für /hund/[token] Steckbrief
  shareEnabled: boolean("share_enabled").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  subscriberIdx: index("dog_profiles_subscriber_idx").on(table.subscriberId),
  shareTokenIdx: index("dog_profiles_share_token_idx").on(table.shareToken),
}));

export type DogProfile = typeof dogProfiles.$inferSelect;
export type NewDogProfile = typeof dogProfiles.$inferInsert;

// ─── Wirkungs-Tracker ─────────────────────────────────────────────────────────
// Fragt 3 Wochen nach einer Futter-Empfehlung nach, ob es geholfen hat (bei
// Allergie/empfindlichem Magen etc.). Einziger Datenpunkt, den KEIN Vergleichsportal
// hat — entsteht nur, weil BELLA echte Beratungsgespräche führt und schon E-Mail-
// Kontakt zum Halter hat. Strikt als Nutzer-Erfahrung gekennzeichnet, nie als
// medizinische Aussage (gleiches No-Fake-Health-Claims-Prinzip wie REVIEWER=null).
export const outcomeChecks = pgTable("outcome_checks", {
  id: uuid("id").defaultRandom().primaryKey(),
  dogProfileId: uuid("dog_profile_id").notNull(),
  subscriberId: uuid("subscriber_id"),
  email: text("email").notNull(),
  dogName: text("dog_name"),
  foodSlug: text("food_slug"),
  foodName: text("food_name"),
  problemTags: text("problem_tags").array(),      // z.B. ['allergie','magen'] — aus dog_profiles.allergies/health_flags
  scheduledAt: timestamp("scheduled_at").notNull(), // wann die Frage raus soll (createdAt + 21 Tage)
  sentAt: timestamp("sent_at"),
  respondedAt: timestamp("responded_at"),
  outcome: text("outcome"),                        // 'besser' | 'gleich' | 'schlechter'
  comment: text("comment"),
  responseToken: text("response_token").unique().notNull(),
  unsubscribeToken: text("unsubscribe_token"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  scheduledIdx: index("outcome_checks_scheduled_idx").on(table.scheduledAt, table.sentAt),
  profileIdx: index("outcome_checks_profile_idx").on(table.dogProfileId),
  foodIdx: index("outcome_checks_food_idx").on(table.foodSlug),
}));

export type OutcomeCheck = typeof outcomeChecks.$inferSelect;
export type NewOutcomeCheck = typeof outcomeChecks.$inferInsert;

// ─── Klick-Tracking ───────────────────────────────────────────────────────────
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

// ─── Wissensuniversum: Themen-Hubs ───────────────────────────────────────────
export const topicHubs = pgTable("topic_hubs", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  studyCount: integer("study_count").default(0),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export type TopicHub = typeof topicHubs.$inferSelect;
export type NewTopicHub = typeof topicHubs.$inferInsert;

// ─── Wissensuniversum: Peer-Reviewed-Studien ─────────────────────────────────
export const studies = pgTable("studies", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  authors: text("authors").array().notNull(),
  year: integer("year").notNull(),
  journal: text("journal").notNull(),
  doi: text("doi"),
  pubmedLink: text("pubmed_link"),
  studyDesign: text("study_design").notNull(),
  population: text("population").notNull(),
  methodology: text("methodology").notNull(),
  keyFindings: text("key_findings").notNull(),
  limitations: text("limitations"),
  bellaSummary: text("bella_summary").notNull(),
  evidenceStrength: text("evidence_strength").notNull(), // hoch | mittel | niedrig
  tags: text("tags").array().notNull(),
  topicHub: text("topic_hub").notNull(),
  relatedProducts: text("related_products").array().default([]), // dog_foods slugs
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  hubIdx: index("studies_hub_idx").on(table.topicHub),
  yearIdx: index("studies_year_idx").on(table.year),
}));

export type Study = typeof studies.$inferSelect;
export type NewStudy = typeof studies.$inferInsert;

// ─── Wissensuniversum: Glossar ────────────────────────────────────────────────
export const glossaryTerms = pgTable("glossary_terms", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  term: text("term").notNull(),
  definition: text("definition").notNull(),
  explanation: text("explanation").notNull(),
  category: text("category").notNull(), // Methodik | Ernährung | Gesundheit | Standards
  relatedSlugs: text("related_slugs").array().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export type GlossaryTerm = typeof glossaryTerms.$inferSelect;
export type NewGlossaryTerm = typeof glossaryTerms.$inferInsert;

// ─── Meinungsnetz: Community-Insights ────────────────────────────────────────
export const communityInsights = pgTable("community_insights", {
  id: uuid("id").defaultRandom().primaryKey(),
  platform: text("platform").notNull(),        // reddit | zooplus | amazon | forum | youtube | google
  sourceUrl: text("source_url").notNull(),
  author: text("author"),                      // öffentlicher Username
  contentExcerpt: text("content_excerpt").notNull(), // authentisches Kurz-Zitat ≤200 Zeichen
  sentiment: text("sentiment").notNull(),      // positiv | negativ | gemischt
  mentionedBrands: text("mentioned_brands").array().default([]),
  mentionedTopics: text("mentioned_topics").array().default([]),
  relatedStudySlugs: text("related_study_slugs").array().default([]),
  relatedProductSlugs: text("related_product_slugs").array().default([]),
  upvotes: integer("upvotes"),
  publishedAt: timestamp("published_at"),
  language: text("language").default("de"),
  verified: boolean("verified").default(false), // URL manuell geprüft
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  platformIdx: index("community_platform_idx").on(table.platform),
  sentimentIdx: index("community_sentiment_idx").on(table.sentiment),
  topicsIdx: index("community_topics_idx").on(table.mentionedTopics),
}));

export type CommunityInsight = typeof communityInsights.$inferSelect;
export type NewCommunityInsight = typeof communityInsights.$inferInsert;

// ─── BELLA Chat-Sessions ──────────────────────────────────────────────────────
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
