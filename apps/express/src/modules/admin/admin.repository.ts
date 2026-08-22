import { prisma } from "../../shared/prisma";
import type { LogsQuery, UsersQuery, UpdateUserDto } from "./admin.types";

export async function getOverviewStats() {
  const [totalUsers, activeUsers, totalTrips, publicTrips, totalActivities] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.trip.count({ where: { deletedAt: null } }),
    prisma.trip.count({ where: { visibility: "PUBLIC", deletedAt: null } }),
    prisma.activity.count(),
  ]);

  return {
    users: { total: totalUsers, active: activeUsers },
    trips: { total: totalTrips, public: publicTrips },
    activities: { total: totalActivities },
  };
}

export async function getTopCities() {
  return prisma.city.findMany({
    orderBy: { tripCount: "desc" },
    take: 10,
    select: {
      id: true,
      name: true,
      country: true,
      tripCount: true,
      saveCount: true,
      viewCount: true,
    }
  });
}

export async function getTopActivities() {
  return prisma.activity.findMany({
    orderBy: { popularityScore: "desc" },
    take: 10,
    select: {
      id: true,
      name: true,
      category: true,
      popularityScore: true,
      saveCount: true,
      viewCount: true,
      city: {
        select: {
          name: true,
          country: true
        }
      }
    }
  });
}

export async function getUsersList(query: UsersQuery) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Number(query.limit) || 50);

  const where = query.search ? {
    OR: [
      { email: { contains: query.search, mode: "insensitive" as const } },
      { username: { contains: query.search, mode: "insensitive" as const } },
      { firstName: { contains: query.search, mode: "insensitive" as const } },
      { lastName: { contains: query.search, mode: "insensitive" as const } },
    ]
  } : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        createdAt: true,
        lastLoginAt: true,
        _count: { select: { trips: true } }
      }
    }),
    prisma.user.count({ where })
  ]);

  return { users, totalItems: total };
}

export async function updateUserStatus(userId: string, data: UpdateUserDto) {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    }
  });
}

export async function getLogsList(query: LogsQuery) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Number(query.limit) || 50);

  const where = {
    ...(query.type && { action: query.type }),
    ...(query.userId && { userId: query.userId }),
    ...((query.from || query.to) && {
      createdAt: {
        ...(query.from && { gte: new Date(query.from) }),
        ...(query.to && { lte: new Date(query.to) }),
      }
    })
  };

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { id: true, email: true } }
      }
    }),
    prisma.auditLog.count({ where })
  ]);

  return { logs, totalItems: total };
}

export async function getLogById(logId: string) {
  return prisma.auditLog.findUnique({
    where: { id: logId },
    include: {
      user: { select: { id: true, email: true } }
    }
  });
}
