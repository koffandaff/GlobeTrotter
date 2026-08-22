import { Prisma, UserStatus, type UserRole } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import type { AdminUserDto } from "./users.types";

const adminUserSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  displayName: true,
  role: true,
  status: true,
  emailVerified: true,
  lastLoginAt: true,
  createdAt: true,
} as const;

export type AdminUserRecord = Prisma.UserGetPayload<{ select: typeof adminUserSelect }>;

function toDto(user: AdminUserRecord): AdminUserDto {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    displayName: user.displayName,
    role: user.role,
    status: user.status,
    emailVerified: user.emailVerified,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  };
}

export async function listUsers(query: {
  page: number;
  limit: number;
  search?: string;
}): Promise<{ users: AdminUserDto[]; totalItems: number }> {
  const where: Prisma.UserWhereInput = query.search
    ? {
        OR: [
          { email: { contains: query.search, mode: "insensitive" } },
          { firstName: { contains: query.search, mode: "insensitive" } },
          { lastName: { contains: query.search, mode: "insensitive" } },
          { displayName: { contains: query.search, mode: "insensitive" } },
        ],
      }
    : {};

  const [records, totalItems] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      select: adminUserSelect,
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.user.count({ where }),
  ]);

  return { users: records.map(toDto), totalItems };
}

export function findUserById(id: string): Promise<AdminUserDto | null> {
  return prisma.user
    .findUnique({ where: { id }, select: adminUserSelect })
    .then((user) => (user ? toDto(user) : null));
}

export function updateUserRole(
  id: string,
  role: UserRole,
): Promise<AdminUserDto | null> {
  return prisma.user
    .update({ where: { id }, data: { role }, select: adminUserSelect })
    .then((user) => toDto(user));
}

export function updateUserStatus(
  id: string,
  status: UserStatus,
): Promise<AdminUserDto | null> {
  const data: Prisma.UserUpdateInput =
    status === UserStatus.DELETED
      ? { status, deletedAt: new Date() }
      : { status };

  return prisma.user
    .update({ where: { id }, data, select: adminUserSelect })
    .then((user) => toDto(user));
}

export async function updateProfile(
  id: string,
  data: { firstName?: string; lastName?: string; displayName?: string; avatarUrl?: string; language?: string }
) {
  return prisma.$transaction(async (tx) => {
    const userUpdate: Prisma.UserUpdateInput = {};
    if (data.firstName !== undefined) userUpdate.firstName = data.firstName;
    if (data.lastName !== undefined) userUpdate.lastName = data.lastName;
    if (data.displayName !== undefined) userUpdate.displayName = data.displayName;
    if (data.avatarUrl !== undefined) userUpdate.avatarUrl = data.avatarUrl;

    if (Object.keys(userUpdate).length > 0) {
      await tx.user.update({
        where: { id },
        data: userUpdate,
      });
    }

    if (data.language !== undefined) {
      await tx.userPreference.upsert({
        where: { userId: id },
        update: { language: data.language },
        create: { userId: id, language: data.language, preferredCurrency: 'USD' },
      });
    }

    return tx.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        displayName: true,
        avatarUrl: true,
        role: true,
        status: true,
        emailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        preference: true,
      }
    });
  });
}

export function softDeleteUser(id: string) {
  return prisma.user.update({
    where: { id },
    data: { status: UserStatus.DELETED, deletedAt: new Date() },
  });
}

export function getSavedDestinations(userId: string) {
  return prisma.savedDestination.findMany({
    where: { userId },
    include: { city: true },
    orderBy: { createdAt: 'desc' },
  });
}

export function addSavedDestination(userId: string, cityId: string) {
  return prisma.savedDestination.create({
    data: { userId, cityId },
    include: { city: true },
  });
}

export function removeSavedDestination(userId: string, cityId: string) {
  return prisma.savedDestination.delete({
    where: {
      userId_cityId: { userId, cityId },
    },
  });
}
