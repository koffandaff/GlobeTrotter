import { z } from "zod";

export const tripIdParamSchema = z.object({
  id: z.string().uuid("trip id must be a valid UUID"),
});

export type TripIdParam = z.infer<typeof tripIdParamSchema>;