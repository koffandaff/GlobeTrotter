import { EventType } from "@prisma/client";
import { AuthorizationError, NotFoundError } from "../../core/errors/app-error";
import { logUserEvent } from "../../shared/utils/events";
import * as budgetRepository from "./budget.repository";
import type {
  BudgetAlertDto,
  CategoryBreakdownDto,
  DailyExpenseSummaryDto,
  SupportedBudgetCategory,
  TripBudgetBreakdownDto,
} from "./budget.types";

function normalizeCategoryField(
  category: SupportedBudgetCategory
): "transportBudget" | "accommodationBudget" | "activitiesBudget" | "foodBudget" | "otherBudget" | "totalBudget" {
  switch (category) {
    case "transport":
      return "transportBudget";
    case "stay":
    case "accommodation":
      return "accommodationBudget";
    case "activities":
    case "activity":
      return "activitiesBudget";
    case "meals":
    case "food":
      return "foodBudget";
    case "other":
      return "otherBudget";
    case "total":
      return "totalBudget";
  }
}

function calculateDurationDays(
  startDate: Date | null,
  endDate: Date | null,
  stops: Array<{ arrivalDate: Date | null; departureDate: Date | null }>
): number {
  if (startDate && endDate) {
    const diff = endDate.getTime() - startDate.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
  }

  let minDate: Date | null = null;
  let maxDate: Date | null = null;

  for (const stop of stops) {
    if (stop.arrivalDate) {
      if (!minDate || stop.arrivalDate < minDate) minDate = stop.arrivalDate;
    }
    if (stop.departureDate) {
      if (!maxDate || stop.departureDate > maxDate) maxDate = stop.departureDate;
    }
  }

  if (minDate && maxDate) {
    const diff = maxDate.getTime() - minDate.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
  }

  return 1;
}

export async function getTripBudget(
  userId: string,
  tripId: string,
  userRole?: string
): Promise<TripBudgetBreakdownDto> {
  const trip = await budgetRepository.findTripFinancialData(tripId);
  if (!trip) {
    throw new NotFoundError("trip not found");
  }

  const isOwner = trip.userId === userId;
  const isPublic = trip.visibility === "PUBLIC" || trip.visibility === "SHARED";
  const isAdmin = userRole === "ADMIN";

  if (!isOwner && !isPublic && !isAdmin) {
    throw new AuthorizationError("you do not have permission to view budget for this trip");
  }

  const durationDays = calculateDurationDays(trip.startDate, trip.endDate, trip.stops);

  const categoryTotals: Record<"transport" | "accommodation" | "activities" | "food" | "other", number> = {
    transport: 0,
    accommodation: 0,
    activities: 0,
    food: 0,
    other: 0,
  };

  const dailyMap = new Map<string, number>();

  const recordedExpenseItemIds = new Set<string>();

  for (const expense of trip.expenses) {
    const amount = Number(expense.amount);
    if (expense.itineraryItemId) {
      recordedExpenseItemIds.add(expense.itineraryItemId);
    }

    switch (expense.category) {
      case "TRANSPORT":
        categoryTotals.transport += amount;
        break;
      case "ACCOMMODATION":
        categoryTotals.accommodation += amount;
        break;
      case "ACTIVITY":
        categoryTotals.activities += amount;
        break;
      case "FOOD":
        categoryTotals.food += amount;
        break;
      case "OTHER":
        categoryTotals.other += amount;
        break;
    }

    if (expense.expenseDate) {
      const dateKey = expense.expenseDate.toISOString().split("T")[0];
      dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + amount);
    }
  }

  // Include unrecorded estimated costs from itinerary activities
  for (const stop of trip.stops) {
    for (const item of stop.itineraryItems) {
      if (!recordedExpenseItemIds.has(item.id) && item.estimatedCost) {
        const cost = Number(item.estimatedCost);
        categoryTotals.activities += cost;

        if (item.date) {
          const dateKey = item.date.toISOString().split("T")[0];
          dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + cost);
        }
      }
    }
  }

  const totalSpent = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

  const totalBudget = trip.budget?.totalBudget !== null && trip.budget?.totalBudget !== undefined
    ? Number(trip.budget.totalBudget)
    : null;

  const alerts: BudgetAlertDto[] = [];

  const makeCategoryBreakdown = (
    category: "transport" | "accommodation" | "activities" | "food" | "other",
    allocatedBudgetDecimal: unknown,
    categoryName: string
  ): CategoryBreakdownDto => {
    const allocated =
      allocatedBudgetDecimal !== null && allocatedBudgetDecimal !== undefined
        ? Number(allocatedBudgetDecimal)
        : null;
    const spent = categoryTotals[category];
    const remaining = allocated !== null ? allocated - spent : null;
    const isOverBudget = allocated !== null && spent > allocated;
    const percentageOfTotal = totalSpent > 0 ? Math.round((spent / totalSpent) * 100) : 0;

    if (isOverBudget && allocated !== null) {
      alerts.push({
        type: "OVER_CATEGORY_BUDGET",
        category,
        message: `${categoryName} expenses (${trip.currency} ${spent.toFixed(2)}) exceed the allocated budget (${trip.currency} ${allocated.toFixed(2)}) by ${(spent - allocated).toFixed(2)}`,
        amountOver: Number((spent - allocated).toFixed(2)),
      });
    }

    return {
      category,
      allocated,
      spent: Number(spent.toFixed(2)),
      remaining: remaining !== null ? Number(remaining.toFixed(2)) : null,
      percentageOfTotal,
      isOverBudget,
    };
  };

  const categories = {
    transport: makeCategoryBreakdown(
      "transport",
      trip.budget?.transportBudget,
      "Transport"
    ),
    accommodation: makeCategoryBreakdown(
      "accommodation",
      trip.budget?.accommodationBudget,
      "Accommodation"
    ),
    activities: makeCategoryBreakdown(
      "activities",
      trip.budget?.activitiesBudget,
      "Activities"
    ),
    food: makeCategoryBreakdown("food", trip.budget?.foodBudget, "Food & Meals"),
    other: makeCategoryBreakdown("other", trip.budget?.otherBudget, "Other"),
  };

  const isTotalOverBudget = totalBudget !== null && totalSpent > totalBudget;
  if (isTotalOverBudget && totalBudget !== null) {
    alerts.push({
      type: "OVER_TOTAL_BUDGET",
      message: `Total expenses (${trip.currency} ${totalSpent.toFixed(2)}) exceed the total budget (${trip.currency} ${totalBudget.toFixed(2)}) by ${(totalSpent - totalBudget).toFixed(2)}`,
      amountOver: Number((totalSpent - totalBudget).toFixed(2)),
    });
  }

  const perDayAverage = Number((totalSpent / durationDays).toFixed(2));

  const dailyExpenses: DailyExpenseSummaryDto[] = Array.from(dailyMap.entries())
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, amount]) => {
      const isOverDailyAverage = durationDays > 1 && amount > perDayAverage * 1.35;
      return {
        date,
        amount: Number(amount.toFixed(2)),
        isOverDailyAverage,
      };
    });

  logUserEvent({
    userId,
    eventType: EventType.BUDGET_VIEWED,
    entityType: "trip",
    entityId: tripId,
  });

  return {
    tripId: trip.id,
    tripName: trip.name,
    currency: trip.currency,
    startDate: trip.startDate,
    endDate: trip.endDate,
    durationDays,
    totalBudget,
    totalSpent: Number(totalSpent.toFixed(2)),
    remainingBudget:
      totalBudget !== null ? Number((totalBudget - totalSpent).toFixed(2)) : null,
    perDayAverage,
    isOverBudget: isTotalOverBudget,
    categories,
    dailyExpenses,
    alerts,
  };
}

export async function updateCategoryBudget(
  userId: string,
  tripId: string,
  category: SupportedBudgetCategory,
  amount: number | null,
  userRole?: string
): Promise<TripBudgetBreakdownDto> {
  const trip = await budgetRepository.findTripOwnership(tripId);
  if (!trip) {
    throw new NotFoundError("trip not found");
  }

  if (trip.userId !== userId && userRole !== "ADMIN") {
    throw new AuthorizationError("you do not have permission to update budget for this trip");
  }

  const field = normalizeCategoryField(category);
  await budgetRepository.updateCategoryBudget(tripId, field, amount);

  return getTripBudget(userId, tripId, userRole);
}
