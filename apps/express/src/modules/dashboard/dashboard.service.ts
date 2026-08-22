import * as dashboardRepository from "./dashboard.repository";
import type { DashboardResponseDto, RecentTripDto, RecommendedDestinationDto, BudgetHighlightsDto, BudgetCategoryDto } from "./dashboard.types";

type RecentTripRaw = Awaited<ReturnType<typeof dashboardRepository.findRecentTrips>>[number];
type RecommendedCityRaw = Awaited<ReturnType<typeof dashboardRepository.findRecommendedDestinations>>[number];
type CategoryBudgetRaw = Awaited<ReturnType<typeof dashboardRepository.getCategoryBudgetBreakdown>>[number];

interface RecommendedCityWithReason extends RecommendedCityRaw {
  reason: string | null;
}

function toRecentTripDto(trip: RecentTripRaw): RecentTripDto {
  return {
    id: trip.id,
    name: trip.name,
    description: trip.description,
    coverImageUrl: trip.coverImageUrl,
    startDate: trip.startDate,
    endDate: trip.endDate,
    status: trip.status,
    totalEstimatedCost: trip.totalEstimatedCost ? Number(trip.totalEstimatedCost) : null,
    currency: trip.currency,
    stopsCount: trip._count.stops,
    createdAt: trip.createdAt,
  };
}

function toRecommendedDestinationDto(city: RecommendedCityWithReason): RecommendedDestinationDto {
  return {
    id: city.id,
    name: city.name,
    country: city.country,
    countryCode: city.countryCode,
    imageUrl: city.imageUrl,
    costIndex: city.costIndex ? Number(city.costIndex) : null,
    popularityScore: Number(city.popularityScore),
    reason: city.reason ?? null,
  };
}

function toBudgetCategoryDto(cat: CategoryBudgetRaw): BudgetCategoryDto {
  return {
    category: cat.category,
    budget: cat.budget ? Number(cat.budget) : null,
    spent: cat.spent ? Number(cat.spent) : 0,
    estimated: cat.estimated ? Number(cat.estimated) : 0,
  };
}

export async function getDashboard(userId: string): Promise<DashboardResponseDto> {
  const [recentTrips, recommendedDestinations, budgetAggregates, categoryBreakdown, budgetCounts] = await Promise.all([
    dashboardRepository.findRecentTrips(userId, 5),
    dashboardRepository.findRecommendedDestinations(userId, 6),
    dashboardRepository.getBudgetAggregates(userId),
    dashboardRepository.getCategoryBudgetBreakdown(userId),
    dashboardRepository.getTripBudgetCounts(userId),
  ]);

  const budgetHighlights: BudgetHighlightsDto = {
    totalBudget: budgetAggregates.totalBudget ? Number(budgetAggregates.totalBudget) : null,
    totalSpent: budgetAggregates.totalSpent ? Number(budgetAggregates.totalSpent) : 0,
    totalEstimated: budgetAggregates.totalEstimated ? Number(budgetAggregates.totalEstimated) : 0,
    currency: budgetAggregates.currency,
    byCategory: categoryBreakdown.map(toBudgetCategoryDto),
    tripsWithBudget: budgetCounts.tripsWithBudget,
    tripsWithoutBudget: budgetCounts.tripsWithoutBudget,
  };

  return {
    recentTrips: recentTrips.map(toRecentTripDto),
    recommendedDestinations: recommendedDestinations.map(toRecommendedDestinationDto),
    budgetHighlights,
  };
}