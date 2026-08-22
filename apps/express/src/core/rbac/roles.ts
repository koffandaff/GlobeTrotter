import type { UserRole } from "@prisma/client";

export type Permission = "users:manage";

export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  USER: [],
  ADMIN: ["users:manage"],
};
