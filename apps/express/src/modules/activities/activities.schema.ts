import { z } from "zod";

export const activitySearchQuerySchema = z.object({
  cityId: z.string().uuid("cityId must be a valid UUID"),
  category: z.string().optional(),
  maxCost: z.coerce.number().positive().optional(),
  maxDuration: z.coerce.number().positive().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type ActivitySearchQuery = z.infer<typeof activitySearchQuerySchema>;

export const activityIdParamSchema = z.object({
  id: z.string().uuid("id must be a valid UUID"),
});

export type ActivityIdParam = z.infer<typeof activityIdParamSchema>;