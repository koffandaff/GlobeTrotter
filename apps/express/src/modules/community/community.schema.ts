import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const communityTripsQuerySchema = paginationQuerySchema.extend({
  sort: z.enum(["popular", "recent"]).default("recent"),
  region: z.string().optional(),
});

export const uuidParamsSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
});

export const addCommentBodySchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment too long"),
});
