import { UserRole, UserStatus } from "@prisma/client";

export interface PaginationQuery {
  page: number;
  limit: number;
}

export interface UsersQuery extends PaginationQuery {
  search?: string;
}

export interface LogsQuery extends PaginationQuery {
  type?: string;
  userId?: string;
  from?: string;
  to?: string;
}

export interface UpdateUserDto {
  role?: UserRole;
  status?: UserStatus;
}
