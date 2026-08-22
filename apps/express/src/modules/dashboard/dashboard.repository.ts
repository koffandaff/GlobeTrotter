import { prisma } from "../../shared/prisma";
import { Prisma } from "@prisma/client";

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
  const trips = await prisma.trip.findMany({
    where: { userId, deletedAt: null },
    select: {
      currency: true,
      budget: { select: { totalBudget: true } },
      expenses: { select: { amount: true, isEstimated: true } },
      stops: {
        select: {
          itineraryItems: { select: { estimatedCost: true } }
        }
      }
    },
  });

  let totalBudget = new Prisma.Decimal(0);
  let totalSpent = new Prisma.Decimal(0);
  let totalEstimated = new Prisma.Decimal(0);
  const currency = trips[0]?.currency || "USD";

  for (const trip of trips) {
    if (trip.budget?.totalBudget) {
      totalBudget = totalBudget.plus(trip.budget.totalBudget);
    }
    for (const exp of trip.expenses) {
      if (exp.isEstimated) {
        totalEstimated = totalEstimated.plus(exp.amount);
      } else {
        totalSpent = totalSpent.plus(exp.amount);
      }
    }
    for (const stop of trip.stops) {
      for (const item of stop.itineraryItems) {
        if (item.estimatedCost) {
          totalEstimated = totalEstimated.plus(item.estimatedCost);
        }
      }
    }
  }

  return { totalBudget, totalSpent, totalEstimated, currency };
}

export async function getCategoryBudgetBreakdown(userId: string): Promise<CategoryBudgetResult[]> {
  const trips = await prisma.trip.findMany({
    where: { userId, deletedAt: null },
    select: {
      budget: {
        select: {
          transportBudget: true,
          accommodationBudget: true,
          activitiesBudget: true,
          foodBudget: true,
          otherBudget: true,
        },
      },
      expenses: {
        select: {
          category: true,
          amount: true,
          isEstimated: true,
        },
      },
      stops: {
        select: {
          itineraryItems: {
            select: {
              estimatedCost: true,
              activity: { select: { category: true } }
            }
          }
        }
      }
    },
  });

  const categories: Array<"TRANSPORT" | "ACCOMMODATION" | "ACTIVITY" | "FOOD" | "OTHER"> = [
    "TRANSPORT",
    "ACCOMMODATION",
    "ACTIVITY",
    "FOOD",
    "OTHER",
  ];

  const map = new Map<string, { budget: Prisma.Decimal; spent: Prisma.Decimal; estimated: Prisma.Decimal }>();
  for (const cat of categories) {
    map.set(cat, {
      budget: new Prisma.Decimal(0),
      spent: new Prisma.Decimal(0),
      estimated: new Prisma.Decimal(0),
    });
  }

  for (const trip of trips) {
    if (trip.budget) {
      if (trip.budget.transportBudget) {
        map.get("TRANSPORT")!.budget = map.get("TRANSPORT")!.budget.plus(trip.budget.transportBudget);
      }
      if (trip.budget.accommodationBudget) {
        map.get("ACCOMMODATION")!.budget = map.get("ACCOMMODATION")!.budget.plus(trip.budget.accommodationBudget);
      }
      if (trip.budget.activitiesBudget) {
        map.get("ACTIVITY")!.budget = map.get("ACTIVITY")!.budget.plus(trip.budget.activitiesBudget);
      }
      if (trip.budget.foodBudget) {
        map.get("FOOD")!.budget = map.get("FOOD")!.budget.plus(trip.budget.foodBudget);
      }
      if (trip.budget.otherBudget) {
        map.get("OTHER")!.budget = map.get("OTHER")!.budget.plus(trip.budget.otherBudget);
      }
    }

    for (const exp of trip.expenses) {
      const entry = map.get(exp.category);
      if (entry) {
        if (exp.isEstimated) {
          entry.estimated = entry.estimated.plus(exp.amount);
        } else {
          entry.spent = entry.spent.plus(exp.amount);
        }
      }
    }

    for (const stop of trip.stops) {
      for (const item of stop.itineraryItems) {
        if (item.estimatedCost) {
          let cat = "ACTIVITY";
          if (item.activity?.category) {
            const c = item.activity.category.toUpperCase();
            if (categories.includes(c as any)) {
              cat = c;
            } else if (c.includes("FOOD") || c.includes("DINING") || c.includes("RESTAURANT") || c.includes("EAT")) {
              cat = "FOOD";
            } else if (c.includes("TRANSPORT") || c.includes("FLIGHT") || c.includes("TRAIN") || c.includes("BUS")) {
              cat = "TRANSPORT";
            } else if (c.includes("ACCOMMODATION") || c.includes("HOTEL") || c.includes("STAY")) {
              cat = "ACCOMMODATION";
            } else {
              cat = "OTHER";
            }
          }
          const entry = map.get(cat);
          if (entry) {
            entry.estimated = entry.estimated.plus(item.estimatedCost);
          }
        }
      }
    }
  }

  return categories.map((category) => ({
    category,
    budget: map.get(category)!.budget,
    spent: map.get(category)!.spent,
    estimated: map.get(category)!.estimated,
  }));
}

export async function getTripBudgetCounts(userId: string): Promise<TripBudgetCounts> {
  const withBudget = await prisma.trip.count({
    where: { userId, deletedAt: null, budget: { isNot: null } },
  });
  const withoutBudget = await prisma.trip.count({
    where: { userId, deletedAt: null, budget: { is: null } },
  });

  return { tripsWithBudget: withBudget, tripsWithoutBudget: withoutBudget };
}