import { pgTable, text, numeric, integer, boolean, timestamp, serial, index } from "drizzle-orm/pg-core";

export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  // Device
  brand: text("brand").notNull(),
  deviceName: text("device_name").notNull(),
  deviceSlug: text("device_slug").notNull(),
  storage: text("storage"),
  storageGb: integer("storage_gb"),
  color: text("color"),
  imageUrl: text("image_url"),
  // Tariff
  providerName: text("provider_name").notNull(),
  tariffName: text("tariff_name").notNull(),
  monthlyPrice: numeric("monthly_price", { precision: 8, scale: 2 }).notNull(),
  effectiveMonthlyPrice: numeric("effective_monthly_price", { precision: 8, scale: 2 }),
  oneTimePrice: numeric("one_time_price", { precision: 8, scale: 2 }).default("0"),
  hardwareOnlyPrice: numeric("hardware_only_price", { precision: 8, scale: 2 }),
  dataVolume: text("data_volume"),
  dataVolumeGb: numeric("data_volume_gb", { precision: 8, scale: 1 }),
  isUnlimited: boolean("is_unlimited").default(false),
  has5g: boolean("has_5g").default(false),
  hasLte: boolean("has_lte").default(true),
  contractMonths: integer("contract_months").default(24),
  // Affiliate
  affiliateLink: text("affiliate_link").notNull(),
  sourceFeed: text("source_feed"),
  // Meta
  availability: text("availability").default("in stock"),
  cashback: numeric("cashback", { precision: 8, scale: 2 }),
  networkName: text("network_name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  brandIdx: index("brand_idx").on(table.brand),
  providerIdx: index("provider_idx").on(table.providerName),
  deviceSlugIdx: index("device_slug_idx").on(table.deviceSlug),
  priceIdx: index("price_idx").on(table.monthlyPrice),
  unlimitedIdx: index("unlimited_idx").on(table.isUnlimited),
}));

export type Offer = typeof offers.$inferSelect;
export type NewOffer = typeof offers.$inferInsert;
