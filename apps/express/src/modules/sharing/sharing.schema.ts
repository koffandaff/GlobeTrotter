import { z } from "zod";
import { SharePermission } from "@prisma/client";

export const tripIdParamsSchema = z.object({
  id: z.string().uuid("Invalid trip ID"),
});

export const shareSlugParamsSchema = z.object({
  shareSlug: z.string().min(1, "Share slug is required"),
});

export const createShareBodySchema = z.object({
  expiresAt: z.string().datetime().optional(),
  sharedWithUserId: z.string().uuid("Invalid user ID").optional(),
  permission: z.nativeEnum(SharePermission).optional(),
});
