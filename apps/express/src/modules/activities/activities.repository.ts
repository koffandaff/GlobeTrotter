import { prisma } from "../../shared/prisma";
import type { Prisma } from "@prisma/client";

interface ActivitySearchResult {
  id: string;
  name: string;
  description: string | null;
  category: string;
  estimatedCost: Prisma.Decimal | null;
  currency: string;
  durationMinutes: number | null;
  imageUrl: string | null;
  popularityScore: Prisma.Decimal;
  isVerified: boolean;
  city: {
    id: string;
    name: string;
    country: string;
  };
}

interface ActivityDetailResult {
  id: string;
  name: string;
  description: string | null;
  category: string;
  estimatedCost: Prisma.Decimal | null;
  currency: string;
  durationMinutes: number | null;
  imageUrl: string | null;
  popularityScore: Prisma.Decimal;
  isVerified: boolean;
  metadata: Prisma.JsonValue | null;
  city: {
    id: string;
    name: string;
    country: string;
    countryCode: string;
    region: string | null;
    latitude: Prisma.Decimal | null;
    longitude: Prisma.Decimal | null;
    costIndex: Prisma.Decimal | null;
  };
  createdByUser: {
    id: string;
    displayName: string | null;
    avatarUrl: string | null;
  } | null;
}

export async function findActivitiesByCity(
  cityId: string,
  filters: {
    category?: string;
    maxCost?: number;
    maxDuration?: number;
  },
  pagination: { page: number; limit: number }
): Promise<{ activities: ActivitySearchResult[]; totalItems: number }> {
  const where: Prisma.ActivityWhereInput = {
    cityId,
    ...(filters.category && { category: { contains: filters.category, mode: "insensitive" } }),
    ...(filters.maxCost !== undefined && { estimatedCost: { lte: filters.maxCost } }),
    ...(filters.maxDuration !== undefined && { durationMinutes: { lte: filters.maxDuration } }),
  };

  const [activities, totalItems] = await Promise.all([
    prisma.activity.findMany({
      where,
      orderBy: [{ popularityScore: "desc" }, { createdAt: "desc" }],
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        estimatedCost: true,
        currency: true,
        durationMinutes: true,
        imageUrl: true,
        popularityScore: true,
        isVerified: true,
        city: { select: { id: true, name: true, country: true } },
      },
    }),
    prisma.activity.count({ where }),
  ]);

  return { activities, totalItems };
}

export async function findActivityById(activityId: string): Promise<ActivityDetailResult | null> {
  return prisma.activity.findUnique({
    where: { id: activityId },
    select: {
      id: true,
      name: true,
      description: true,
      category: true,
      estimatedCost: true,
      currency: true,
      durationMinutes: true,
      imageUrl: true,
      popularityScore: true,
      isVerified: true,
      metadata: true,
      city: {
        select: {
          id: true,
          name: true,
          country: true,
          countryCode: true,
          region: true,
          latitude: true,
          longitude: true,
          costIndex: true,
        },
      },
      createdByUser: { select: { id: true, displayName: true, avatarUrl: true } },
    },
  });
}

export async function incrementViewCount(activityId: string): Promise<void> {
  await prisma.activity.update({
    where: { id: activityId },
    data: { viewCount: { increment: 1 } },
  });
}