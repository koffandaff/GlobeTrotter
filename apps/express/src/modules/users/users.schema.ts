import { UserStatus, UserRole } from "@prisma/client";
import { z } from "zod";

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().min(1).max(100).optional(),
});

export const userIdParamsSchema = z.object({
  id: z.uuid("a valid user id is required"),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(UserRole),
});

export const updateUserStatusSchema = z.object({
  status: z.enum(UserStatus),
});
