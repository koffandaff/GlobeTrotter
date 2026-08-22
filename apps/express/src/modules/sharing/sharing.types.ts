import { SharePermission } from "@prisma/client";

export interface CreateShareDto {
  expiresAt?: string;
  sharedWithUserId?: string;
  permission?: SharePermission;
}
