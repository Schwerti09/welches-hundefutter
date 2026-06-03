import { z } from "zod";

export const AdvisorUserProfileSchema = z.object({
  budgetRange: z.object({
    min: z.number(),
    max: z.number(),
  }).optional(),
  brandPreference: z.enum(["apple", "samsung", "google", "xiaomi", "none", "any"]).optional(),
  dataUsage: z.enum(["low", "medium", "high", "unlimited"]).optional(),
  gamingInterest: z.boolean().optional(),
  cameraImportance: z.enum(["low", "medium", "high"]).optional(),
  batteryImportance: z.enum(["low", "medium", "high"]).optional(),
  providerPreference: z.enum(["telekom", "vodafone", "o2", "none", "any"]).optional(),
  contractDuration: z.union([z.literal(12), z.literal(24), z.literal(36)]).optional(),
  refurbishedOpenness: z.boolean().optional(),
  upgradeFrequency: z.number().optional(),
});

export const RecommendRequestSchema = z.object({
  userProfile: AdvisorUserProfileSchema,
  sessionId: z.string(),
});

export type RecommendRequest = z.infer<typeof RecommendRequestSchema>;
