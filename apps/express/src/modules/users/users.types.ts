import { UserStatus, UserRole } from "@prisma/client";

export interface ListUsersQuery {
  page: number;
  limit: number;
  search?: string;
}

export interface AdminUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
}

export interface UpdateUserRoleRequest {
  role: UserRole;
}

export interface UpdateUserStatusRequest {
  status: UserStatus;
}

export interface UpdateMeRequest {
  firstName?: string;
  lastName?: string;
  language?: string;
  avatarUrl?: string;
}
