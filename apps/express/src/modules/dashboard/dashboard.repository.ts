import { prisma } from "../../shared/prisma";
import type { Prisma } from "@prisma/client";

interface RecentTripQueryResult {
  id: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  startDate: Date | null;
  endDate: Date | null;
  status: string;
  totalEstimatedCost: Prisma.Decimal | null;
  currency: string;
  _count: { stops: number };
  createdAt: Date;
}

interface RecommendedCityQueryResult {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  imageUrl: string | null;
  costIndex: Prisma.Decimal | null;
  popularityScore: Prisma.Decimal;
  reason: string | null;
}

interface BudgetAggregationResult {
  totalBudget: Prisma.Decimal | null;
  totalSpent: Prisma.Decimal | null;
  totalEstimated: Prisma.Decimal | null;
  currency: string;
}

interface CategoryBudgetResult {
  category: string;
  budget: Prisma.Decimal | null;
  spent: Prisma.Decimal | null;
  estimated: Prisma.Decimal | null;
}

interface TripBudgetCounts {
  tripsWithBudget: number;
  tripsWithoutBudget: number;
}

export async function findRecentTrips(userId: string, limit = 5): Promise<RecentTripQueryResult[]> {
  return prisma.trip.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      description: true,
      coverImageUrl: true,
      startDate: true,
      endDate: true,
      status: true,
      totalEstimatedCost: true,
      currency: true,
      _count: { select: { stops: true } },
      createdAt: true,
    },
  });
}

export async function findRecommendedDestinations(userId: string, limit = 6): Promise<RecommendedCityQueryResult[]> {
  const recommendations = await prisma.recommendation.findMany({
    where: {
      userId,
      entityType: "City",
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    orderBy: { score: "desc" },
    take: limit,
    select: { entityId: true, reason: true },
  });

  if (recommendations.length > 0) {
    const cityIds = recommendations.map((r) => r.entityId);
    const cities = await prisma.city.findMany({
      where: { id: { in: cityIds } },
      select: {
        id: true,
        name: true,
        country: true,
        countryCode: true,
        imageUrl: true,
        costIndex: true,
        popularityScore: true,
      },
    });

    const cityMap = new Map(cities.map((c) => [c.id, c]));
    return recommendations
      .map((r) => cityMap.get(r.entityId))
      .filter((c): c is RecommendedCityQueryResult => c !== undefined)
      .map((c) => ({ ...c, reason: recommendations.find((r) => r.entityId === c.id)?.reason ?? null }));
  }

  return prisma.city.findMany({
    orderBy: { popularityScore: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      country: true,
      countryCode: true,
      imageUrl: true,
      costIndex: true,
      popularityScore: true,
    },
  }).then(cities => cities.map(c => ({ ...c, reason: null as string | null })));
}

export async function getBudgetAggregates(userId: string): Promise<BudgetAggregationResult> {
  const result = await prisma.$queryRaw<BudgetAggregationResult[]>`
    SELECT
      COALESCE(SUM(tb."totalBudget"), 0) as "totalBudget",
      COALESCE(SUM(e.amount) FILTER (WHERE e."isEstimated" = false), 0) as "totalSpent",
      COALESCE(SUM(e.amount) FILTER (WHERE e."isEstimated" = true), 0) as "totalEstimated",
      COALESCE(tb.currency, 'USD') as currency
    FROM "Trip" t
    LEFT JOIN "TripBudget" tb ON tb."tripId" = t.id
    LEFT JOIN "Expense" e ON e."tripId" = t.id
    WHERE t."userId" = ${userId} AND t."deletedAt" IS NULL
    GROUP BY tb.currency
  `;

  return result[0] ?? { totalBudget: 0, totalSpent: 0, totalEstimated: 0, currency: "USD" };
}

export async function getCategoryBudgetBreakdown(userId: string): Promise<CategoryBudgetResult[]> {
  return prisma.$queryRaw<CategoryBudgetResult[]>`
    SELECT
      e.category,
      SUM(tb."transportBudget") FILTER (WHERE e.category = 'TRANSPORT') as budget,
      SUM(e.amount) FILTER (WHERE e."isEstimated" = false AND e.category = 'TRANSPORT') as spent,
      SUM(e.amount) FILTER (WHERE e."isEstimated" = true AND e.category = 'TRANSPORT') as estimated
    FROM "Trip" t
    LEFT JOIN "TripBudget" tb ON tb."tripId" = t.id
    LEFT JOIN "Expense" e ON e."tripId" = t.id
    WHERE t."userId" = ${userId} AND t."deletedAt" IS NULL
    GROUP BY e.category
    UNION ALL
    SELECT
      e.category,
      SUM(tb."accommodationBudget") FILTER (WHERE e.category = 'ACCOMMODATION') as budget,
      SUM(e.amount) FILTER (WHERE e."isEstimated" = false AND e.category = 'ACCOMMODATION') as spent,
      SUM(e.amount) FILTER (WHERE e."isEstimated" = true AND e.category = 'ACCOMMODATION') as estimated
    FROM "Trip" t
    LEFT JOIN "TripBudget" tb ON tb."tripId" = t.id
    LEFT JOIN "Expense" e ON e."tripId" = t.id
    WHERE t."userId" = ${userId} AND t."deletedAt" IS NULL
    GROUP BY e.category
    UNION ALL
    SELECT
      e.category,
      SUM(tb."activitiesBudget") FILTER (WHERE e.category = 'ACTIVITY') as budget,
      SUM(e.amount) FILTER (WHERE e."isEstimated" = false AND e.category = 'ACTIVITY') as spent,
      SUM(e.amount) FILTER (WHERE e."isEstimated" = true AND e.category = 'ACTIVITY') as estimated
    FROM "Trip" t
    LEFT JOIN "TripBudget" tb ON tb."tripId" = t.id
    LEFT JOIN "Expense" e ON e."tripId" = t.id
    WHERE t."userId" = ${userId} AND t."deletedAt" IS NULL
    GROUP BY e.category
    UNION ALL
    SELECT
      e.category,
      SUM(tb."foodBudget") FILTER (WHERE e.category = 'FOOD') as budget,
      SUM(e.amount) FILTER (WHERE e."isEstimated" = false AND e.category = 'FOOD') as spent,
      SUM(e.amount) FILTER (WHERE e."isEstimated" = true AND e.category = 'FOOD') as estimated
    FROM "Trip" t
    LEFT JOIN "TripBudget" tb ON tb."tripId" = t.id
    LEFT JOIN "Expense" e ON e."tripId" = t.id
    WHERE t."userId" = ${userId} AND t."deletedAt" IS NULL
    GROUP BY e.category
    UNION ALL
    SELECT
      e.category,
      SUM(tb."otherBudget") FILTER (WHERE e.category = 'OTHER') as budget,
      SUM(e.amount) FILTER (WHERE e."isEstimated" = false AND e.category = 'OTHER') as spent,
      SUM(e.amount) FILTER (WHERE e."isEstimated" = true AND e.category = 'OTHER') as estimated
    FROM "Trip" t
    LEFT JOIN "TripBudget" tb ON tb."tripId" = t.id
    LEFT JOIN "Expense" e ON e."tripId" = t.id
    WHERE t."userId" = ${userId} AND t."deletedAt" IS NULL
    GROUP BY e.category
  `;
}

export async function getTripBudgetCounts(userId: string): Promise<TripBudgetCounts> {
  const [withBudget, withoutBudget] = await Promise.all([
    prisma.trip.count({
      where: { userId, deletedAt: null, budget: { isNot: null } },
    }),
    prisma.trip.count({
      where: { userId, deletedAt: null, budget: null },
    }),
  ]);

  return { tripsWithBudget: withBudget, tripsWithoutBudget: withoutBudget };
}