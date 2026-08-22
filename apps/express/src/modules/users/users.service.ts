import { NotFoundError, ValidationError } from "../../core/errors/app-error";
import * as usersRepository from "./users.repository";
import type {
  AdminUserDto,
  ListUsersQuery,
  UpdateUserRoleRequest,
  UpdateUserStatusRequest,
} from "./users.types";

function parsePagination(query: ListUsersQuery) {
  const page = Math.max(1, Math.floor(query.page));
  const limit = Math.min(100, Math.max(1, Math.floor(query.limit)));
  return { page, limit };
}

export async function listUsers(
  query: ListUsersQuery,
): Promise<{ users: AdminUserDto[]; totalItems: number; totalPages: number }> {
  const { page, limit } = parsePagination(query);
  const { users, totalItems } = await usersRepository.listUsers({
    ...query,
    page,
    limit,
  });

  return { users, totalItems, totalPages: Math.ceil(totalItems / limit) };
}

export async function getUser(id: string): Promise<AdminUserDto> {
  const user = await usersRepository.findUserById(id);
  if (!user) {
    throw new NotFoundError("user not found");
  }
  return user;
}

export async function updateUserRole(
  actingUserId: string,
  targetUserId: string,
  input: UpdateUserRoleRequest,
): Promise<AdminUserDto> {
  if (actingUserId === targetUserId) {
    throw new ValidationError("you cannot change your own role");
  }

  const user = await usersRepository.updateUserRole(targetUserId, input.role);
  if (!user) {
    throw new NotFoundError("user not found");
  }
  return user;
}

export async function updateUserStatus(
  actingUserId: string,
  targetUserId: string,
  input: UpdateUserStatusRequest,
): Promise<AdminUserDto> {
  if (actingUserId === targetUserId) {
    throw new ValidationError("you cannot change your own status");
  }

  const user = await usersRepository.findUserById(targetUserId);
  if (!user) {
    throw new NotFoundError("user not found");
  }

  if (input.status === "DELETED" && user.role === "ADMIN") {
    throw new ValidationError("another admin must delete an admin account");
  }

  const updated = await usersRepository.updateUserStatus(targetUserId, input.status);
  if (!updated) {
    throw new NotFoundError("user not found");
  }
  return updated;
}

export async function updateMe(userId: string, data: { firstName?: string; lastName?: string; avatarUrl?: string; language?: string }) {
  const updated = await usersRepository.updateProfile(userId, data);
  if (!updated) {
    throw new NotFoundError("user not found");
  }
  return updated;
}

export async function deleteMe(userId: string) {
  await usersRepository.softDeleteUser(userId);
}

export async function getSavedDestinations(userId: string) {
  return usersRepository.getSavedDestinations(userId);
}

export async function saveDestination(userId: string, cityId: string) {
  try {
    return await usersRepository.addSavedDestination(userId, cityId);
  } catch (err: unknown) {
    const prismaErr = err as { code?: string };
    if (prismaErr.code === "P2002") {
      throw new ValidationError("city is already saved");
    }
    if (prismaErr.code === "P2003") {
      throw new NotFoundError("city not found");
    }
    throw err;
  }
}

export async function removeSavedDestination(userId: string, cityId: string) {
  try {
    await usersRepository.removeSavedDestination(userId, cityId);
  } catch (err: unknown) {
    const prismaErr = err as { code?: string };
    if (prismaErr.code === "P2025") {
      throw new NotFoundError("saved destination not found");
    }
    throw err;
  }
}
