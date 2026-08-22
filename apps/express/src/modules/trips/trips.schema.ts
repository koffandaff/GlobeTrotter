import { TripStatus, TripVisibility } from "@prisma/client";
import { z } from "zod";

export const listTripsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(TripStatus).optional(),
  search: z.string().trim().min(1).max(100).optional(),
});

export const tripIdParamsSchema = z.object({
  id: z.uuid("a valid trip id is required"),
});

export const createTripSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "trip name is required")
    .max(200, "trip name must be at most 200 characters"),
  description: z
    .string()
    .trim()
    .max(2000, "description must be at most 2000 characters")
    .optional(),
  coverImageUrl: z
    .string()
    .trim()
    .max(1000, "coverImageUrl must be at most 1000 characters")
    .optional(),
  startDate: z
    .string()
    .datetime({ message: "startDate must be a valid ISO datetime" })
    .optional(),
  endDate: z
    .string()
    .datetime({ message: "endDate must be a valid ISO datetime" })
    .optional(),
  status: z.enum(TripStatus).optional(),
  visibility: z.enum(TripVisibility).optional(),
  currency: z
    .string()
    .trim()
    .length(3, "currency must be a 3-letter ISO code")
    .default("USD")
    .optional(),
  totalBudget: z.number().positive("totalBudget must be positive").optional(),
});

export const updateTripSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "trip name cannot be empty")
    .max(200, "trip name must be at most 200 characters")
    .optional(),
  description: z
    .string()
    .trim()
    .max(2000, "description must be at most 2000 characters")
    .nullable()
    .optional(),
  coverImageUrl: z
    .string()
    .trim()
    .max(1000, "coverImageUrl must be at most 1000 characters")
    .nullable()
    .optional(),
  startDate: z
    .string()
    .datetime({ message: "startDate must be a valid ISO datetime" })
    .nullable()
    .optional(),
  endDate: z
    .string()
    .datetime({ message: "endDate must be a valid ISO datetime" })
    .nullable()
    .optional(),
  status: z.enum(TripStatus).optional(),
  visibility: z.enum(TripVisibility).optional(),
  currency: z
    .string()
    .trim()
    .length(3, "currency must be a 3-letter ISO code")
    .optional(),
});
