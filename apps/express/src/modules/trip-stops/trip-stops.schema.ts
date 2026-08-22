import { z } from "zod";

export const tripIdParamsSchema = z.object({
  tripId: z.uuid("a valid trip id is required"),
});

export const stopIdParamsSchema = z.object({
  id: z.uuid("a valid stop id is required"),
});

export const createTripStopSchema = z.object({
  cityId: z.uuid("a valid city id is required"),
  arrivalDate: z
    .string()
    .datetime({ message: "arrivalDate must be a valid ISO datetime" })
    .optional(),
  departureDate: z
    .string()
    .datetime({ message: "departureDate must be a valid ISO datetime" })
    .optional(),
  notes: z
    .string()
    .trim()
    .max(1000, "notes must be at most 1000 characters")
    .optional(),
  sequence: z.number().int().min(1).optional(),
});

export const updateTripStopSchema = z.object({
  arrivalDate: z
    .string()
    .datetime({ message: "arrivalDate must be a valid ISO datetime" })
    .nullable()
    .optional(),
  departureDate: z
    .string()
    .datetime({ message: "departureDate must be a valid ISO datetime" })
    .nullable()
    .optional(),
  notes: z
    .string()
    .trim()
    .max(1000, "notes must be at most 1000 characters")
    .nullable()
    .optional(),
});

export const reorderTripStopSchema = z.object({
  newSequence: z
    .number()
    .int()
    .min(1, "newSequence must be at least 1"),
});
