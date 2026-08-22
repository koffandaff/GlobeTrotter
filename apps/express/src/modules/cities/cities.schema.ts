import { z } from "zod";

export const listCitiesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().min(1).max(100).optional(),
  region: z.string().trim().min(1).max(100).optional(),
  country: z.string().trim().min(1).max(100).optional(),
});

export const cityIdParamsSchema = z.object({
  id: z.uuid("a valid city id is required"),
});

export const popularCitiesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
