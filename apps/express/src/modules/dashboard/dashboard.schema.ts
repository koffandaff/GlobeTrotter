import { z } from "zod";

export const getDashboardQuerySchema = z.object({
  recentTripsLimit: z.coerce.number().int().min(1).max(20).default(5),
  recommendationsLimit: z.coerce.number().int().min(1).max(20).default(6),
});

export type GetDashboardQuery = z.infer<typeof getDashboardQuerySchema>;