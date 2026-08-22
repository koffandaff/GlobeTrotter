import { z } from "zod";
import { UserRole, UserStatus } from "@prisma/client";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
});

export const usersQuerySchema = paginationQuerySchema.extend({
  search: z.string().optional(),
});

export const logsQuerySchema = paginationQuerySchema.extend({
  type: z.string().optional(),
  userId: z.string().uuid("Invalid User ID").optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export const updateUserBodySchema = z.object({
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
});

export const uuidParamsSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
});
