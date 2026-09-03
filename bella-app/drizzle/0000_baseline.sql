CREATE TABLE "advisor_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"breed_slug" text,
	"dog_age" integer,
	"dog_weight" numeric,
	"activity_level" text,
	"health_issues" text[],
	"preferred_food_type" text,
	"recommended_food_ids" text[],
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "advisor_sessions_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
CREATE TABLE "affiliate_clicks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"food_id" uuid,
	"source_url" text,
	"user_agent" text,
	"referrer" text,
	"session_id" text,
	"bella_conversation" boolean DEFAULT false,
	"clicked_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text,
	"user_message" text,
	"bella_reply" text,
	"offers_shown" integer,
	"top_food" text,
	"had_results" boolean,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "community_insights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform" text NOT NULL,
	"source_url" text NOT NULL,
	"author" text,
	"content_excerpt" text NOT NULL,
	"sentiment" text NOT NULL,
	"mentioned_brands" text[] DEFAULT '{}',
	"mentioned_topics" text[] DEFAULT '{}',
	"related_study_slugs" text[] DEFAULT '{}',
	"related_product_slugs" text[] DEFAULT '{}',
	"upvotes" integer,
	"published_at" timestamp,
	"language" text DEFAULT 'de',
	"verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dog_breeds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"alternative_names" text[],
	"size" text NOT NULL,
	"weight_min" numeric,
	"weight_max" numeric,
	"life_expectancy" integer,
	"activity_level" text,
	"common_health_issues" text[],
	"recommended_protein_percentage" integer,
	"recommended_fat_percentage" integer,
	"feeding_notes" text,
	"description" text,
	"image_url" text,
	"recommended_food_ids" text[],
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "dog_breeds_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "dog_foods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"brand" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"protein" text,
	"is_monoprotein" boolean DEFAULT false,
	"is_grain_free" boolean DEFAULT false,
	"is_hypoallergenic" boolean DEFAULT false,
	"meat_percentage" integer,
	"price_per_kg" numeric(8, 2),
	"price" numeric(8, 2),
	"package_sizes" text[],
	"suitable_for" text[],
	"suitable_breeds" text[],
	"image_url" text,
	"rating" numeric(3, 1),
	"review_count" integer,
	"score" integer,
	"category" text,
	"companion_for" text[],
	"affiliate_network" text,
	"affiliate_url" text NOT NULL,
	"commission_rate" numeric(5, 4),
	"commission_flat" numeric(8, 2),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "dog_foods_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "dog_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscriber_id" uuid,
	"name" text NOT NULL,
	"breed_slug" text,
	"birth_or_age" text,
	"weight_kg" numeric(5, 1),
	"activity_level" text,
	"allergies" text[],
	"health_flags" text[],
	"food_preferences" text,
	"conditions" text,
	"gender" text,
	"photo_data" text,
	"current_food_slug" text,
	"current_package_g" integer,
	"last_purchase_at" timestamp,
	"est_daily_grams" integer,
	"est_bag_days" integer,
	"share_token" text,
	"share_enabled" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "dog_profiles_share_token_unique" UNIQUE("share_token")
);
--> statement-breakpoint
CREATE TABLE "glossary_terms" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"term" text NOT NULL,
	"definition" text NOT NULL,
	"explanation" text NOT NULL,
	"category" text NOT NULL,
	"related_slugs" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "glossary_terms_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "health_issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"symptoms" text[],
	"feeding_approach" text,
	"recommended_food_types" text[],
	"avoid_ingredients" text[],
	"recommended_food_ids" text[],
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "health_issues_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "offers" (
	"id" serial PRIMARY KEY NOT NULL,
	"brand" text NOT NULL,
	"device_name" text NOT NULL,
	"device_slug" text NOT NULL,
	"image_url" text,
	"provider_name" text NOT NULL,
	"futterf_name" text NOT NULL,
	"monthly_price" numeric(8, 2) NOT NULL,
	"effective_monthly_price" numeric(8, 2),
	"one_time_price" numeric(8, 2) DEFAULT '0',
	"data_volume" text,
	"data_volume_gb" numeric(8, 1),
	"is_unlimited" boolean DEFAULT false,
	"has_5g" boolean DEFAULT false,
	"contract_months" integer DEFAULT 24,
	"affiliate_link" text NOT NULL,
	"source_feed" text,
	"cashback" numeric(8, 2),
	"network_name" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "outcome_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dog_profile_id" uuid NOT NULL,
	"subscriber_id" uuid,
	"email" text NOT NULL,
	"dog_name" text,
	"food_slug" text,
	"food_name" text,
	"problem_tags" text[],
	"scheduled_at" timestamp NOT NULL,
	"sent_at" timestamp,
	"responded_at" timestamp,
	"outcome" text,
	"comment" text,
	"response_token" text NOT NULL,
	"unsubscribe_token" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "outcome_checks_response_token_unique" UNIQUE("response_token")
);
--> statement-breakpoint
CREATE TABLE "price_alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscriber_id" uuid NOT NULL,
	"food_slug" text NOT NULL,
	"food_name" text,
	"baseline_price_per_kg" numeric(8, 2),
	"target_price_per_kg" numeric(8, 2),
	"mode" text DEFAULT 'price' NOT NULL,
	"dog_profile_id" uuid,
	"refill_due_at" timestamp,
	"last_notified_at" timestamp,
	"last_notified_price" numeric(8, 2),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "price_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"food_slug" text NOT NULL,
	"price_per_kg" numeric(8, 2) NOT NULL,
	"recorded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "studies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"authors" text[] NOT NULL,
	"year" integer NOT NULL,
	"journal" text NOT NULL,
	"doi" text,
	"pubmed_link" text,
	"study_design" text NOT NULL,
	"population" text NOT NULL,
	"methodology" text NOT NULL,
	"key_findings" text NOT NULL,
	"limitations" text,
	"bella_summary" text NOT NULL,
	"evidence_strength" text NOT NULL,
	"tags" text[] NOT NULL,
	"topic_hub" text NOT NULL,
	"related_products" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "studies_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"doi_token" text NOT NULL,
	"doi_confirmed_at" timestamp,
	"consent_ip" text,
	"consent_user_agent" text,
	"unsubscribe_token" text NOT NULL,
	"unsubscribed_at" timestamp,
	"dog_profile" jsonb DEFAULT '{}'::jsonb,
	"source" text DEFAULT 'advisor',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "subscribers_email_unique" UNIQUE("email"),
	CONSTRAINT "subscribers_doi_token_unique" UNIQUE("doi_token"),
	CONSTRAINT "subscribers_unsubscribe_token_unique" UNIQUE("unsubscribe_token")
);
--> statement-breakpoint
CREATE TABLE "topic_hubs" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"icon" text NOT NULL,
	"study_count" integer DEFAULT 0,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "topic_hubs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "price_alerts" ADD CONSTRAINT "price_alerts_subscriber_id_subscribers_id_fk" FOREIGN KEY ("subscriber_id") REFERENCES "public"."subscribers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "community_platform_idx" ON "community_insights" USING btree ("platform");--> statement-breakpoint
CREATE INDEX "community_sentiment_idx" ON "community_insights" USING btree ("sentiment");--> statement-breakpoint
CREATE INDEX "community_topics_idx" ON "community_insights" USING btree ("mentioned_topics");--> statement-breakpoint
CREATE INDEX "dog_foods_slug_idx" ON "dog_foods" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "dog_foods_brand_idx" ON "dog_foods" USING btree ("brand");--> statement-breakpoint
CREATE INDEX "dog_foods_type_idx" ON "dog_foods" USING btree ("type");--> statement-breakpoint
CREATE INDEX "dog_foods_category_idx" ON "dog_foods" USING btree ("category");--> statement-breakpoint
CREATE INDEX "dog_profiles_subscriber_idx" ON "dog_profiles" USING btree ("subscriber_id");--> statement-breakpoint
CREATE INDEX "dog_profiles_share_token_idx" ON "dog_profiles" USING btree ("share_token");--> statement-breakpoint
CREATE INDEX "outcome_checks_scheduled_idx" ON "outcome_checks" USING btree ("scheduled_at","sent_at");--> statement-breakpoint
CREATE INDEX "outcome_checks_profile_idx" ON "outcome_checks" USING btree ("dog_profile_id");--> statement-breakpoint
CREATE INDEX "outcome_checks_food_idx" ON "outcome_checks" USING btree ("food_slug");--> statement-breakpoint
CREATE INDEX "price_alerts_sub_food_idx" ON "price_alerts" USING btree ("subscriber_id","food_slug");--> statement-breakpoint
CREATE INDEX "price_alerts_food_idx" ON "price_alerts" USING btree ("food_slug");--> statement-breakpoint
CREATE INDEX "price_history_slug_time_idx" ON "price_history" USING btree ("food_slug","recorded_at");--> statement-breakpoint
CREATE INDEX "studies_hub_idx" ON "studies" USING btree ("topic_hub");--> statement-breakpoint
CREATE INDEX "studies_year_idx" ON "studies" USING btree ("year");--> statement-breakpoint
CREATE INDEX "subscribers_doi_token_idx" ON "subscribers" USING btree ("doi_token");--> statement-breakpoint
CREATE INDEX "subscribers_unsub_token_idx" ON "subscribers" USING btree ("unsubscribe_token");