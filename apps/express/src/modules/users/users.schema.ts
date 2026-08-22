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
  role: z.nativeEnum(UserRole),
});

export const updateUserStatusSchema = z.object({
  status: z.nativeEnum(UserStatus),
});

export const updateMeSchema = z.object({
  firstName: z.string().trim().min(1, "firstName cannot be empty").max(100).optional(),
  lastName: z.string().trim().min(1, "lastName cannot be empty").max(100).optional(),
  displayName: z.string().trim().max(100).optional(),
  language: z.string().trim().max(20).optional(),
  // avatarUrl is handled by multer, but we can accept it if sent as string (e.g. they uploaded it elsewhere)
  avatarUrl: z.string().url("avatarUrl must be a valid URL").optional(),
});

export const cityIdParamsSchema = z.object({
  cityId: z.uuid("a valid city id is required"),
});
