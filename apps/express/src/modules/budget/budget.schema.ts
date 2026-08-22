import { z } from "zod";

export const tripIdParamSchema = z.object({
  id: z.uuid("a valid trip id is required"),
});

export const categoryParamSchema = z.object({
  id: z.uuid("a valid trip id is required"),
  category: z.enum(
    [
      "transport",
      "stay",
      "accommodation",
      "activities",
      "activity",
      "meals",
      "food",
      "other",
      "total",
    ],
    {
      error: "category must be one of: transport, stay/accommodation, activities, meals/food, other, total",
    }
  ),
});

export const updateCategoryBudgetSchema = z.object({
  amount: z
    .number()
    .min(0, "amount must be greater than or equal to 0")
    .nullable()
    .optional(),
  budget: z
    .number()
    .min(0, "budget must be greater than or equal to 0")
    .nullable()
    .optional(),
}).refine((data) => data.amount !== undefined || data.budget !== undefined, {
  message: "either 'amount' or 'budget' must be provided",
});
