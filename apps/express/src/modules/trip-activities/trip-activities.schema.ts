import { z } from "zod";

export const stopIdParamSchema = z.object({
  stopId: z.string().uuid("stopId must be a valid UUID"),
});

export type StopIdParam = z.infer<typeof stopIdParamSchema>;

export const itineraryItemIdParamSchema = z.object({
  id: z.string().uuid("id must be a valid UUID"),
});

export type ItineraryItemIdParam = z.infer<typeof itineraryItemIdParamSchema>;

export const createItineraryItemSchema = z.object({
  activityId: z.string().uuid("activityId must be a valid UUID").optional(),
  title: z.string().min(1, "title is required").max(200),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD").optional(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "startTime must be HH:MM").optional(),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "endTime must be HH:MM").optional(),
  sequence: z.number().int().min(1).optional(),
  notes: z.string().max(1000).optional(),
  estimatedCost: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
});

export type CreateItineraryItemRequest = z.infer<typeof createItineraryItemSchema>;

export const updateItineraryItemSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD").nullable().optional(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "startTime must be HH:MM").nullable().optional(),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "endTime must be HH:MM").nullable().optional(),
  sequence: z.number().int().min(1).optional(),
  notes: z.string().max(1000).nullable().optional(),
  estimatedCost: z.number().positive().nullable().optional(),
  status: z.string().optional(),
});

export type UpdateItineraryItemRequest = z.infer<typeof updateItineraryItemSchema>;

export const reorderItineraryItemSchema = z.object({
  sequence: z.number().int().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD").nullable().optional(),
});

export type ReorderItineraryItemRequest = z.infer<typeof reorderItineraryItemSchema>;

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type ListQuery = z.infer<typeof listQuerySchema>;