import { apiClient } from "@/lib/api/client";
import type {
  BudgetCategory,
  TripBudgetBreakdown,
  UpdateCategoryBudgetInput,
} from "../types";

export const DEMO_BUDGET_BREAKDOWN: TripBudgetBreakdown = {
  tripId: "demo-paris-1",
  tripName: "Summer in Paris",
  currency: "EUR",
  startDate: "2026-06-10",
  endDate: "2026-06-18",
  durationDays: 8,
  totalBudget: 2200,
  totalSpent: 1650,
  remainingBudget: 550,
  perDayAverage: 206.25,
  isOverBudget: false,
  categories: {
    transport: {
      category: "transport",
      label: "Transportation",
      allocated: 500,
      spent: 420,
      remaining: 80,
      percentageOfTotal: 25.4,
      isOverBudget: false,
    },
    accommodation: {
      category: "accommodation",
      label: "Lodging & Stays",
      allocated: 800,
      spent: 650,
      remaining: 150,
      percentageOfTotal: 39.4,
      isOverBudget: false,
    },
    activities: {
      category: "activities",
      label: "Tours & Sightseeing",
      allocated: 400,
      spent: 280,
      remaining: 120,
      percentageOfTotal: 17.0,
      isOverBudget: false,
    },
    food: {
      category: "food",
      label: "Food & Dining",
      allocated: 350,
      spent: 240,
      remaining: 110,
      percentageOfTotal: 14.5,
      isOverBudget: false,
    },
    other: {
      category: "other",
      label: "Miscellaneous",
      allocated: 150,
      spent: 60,
      remaining: 90,
      percentageOfTotal: 3.7,
      isOverBudget: false,
    },
  },
  dailyExpenses: [
    { date: "2026-06-10", amount: 165, isOverDailyAverage: false },
    { date: "2026-06-11", amount: 285, isOverDailyAverage: true },
    { date: "2026-06-12", amount: 190, isOverDailyAverage: false },
    { date: "2026-06-13", amount: 240, isOverDailyAverage: true },
    { date: "2026-06-14", amount: 180, isOverDailyAverage: false },
    { date: "2026-06-15", amount: 220, isOverDailyAverage: true },
    { date: "2026-06-16", amount: 190, isOverDailyAverage: false },
    { date: "2026-06-17", amount: 180, isOverDailyAverage: false },
  ],
  alerts: [
    {
      type: "OVER_DAILY_AVERAGE",
      message: "Daily expenses on June 11 exceeded the daily average by €78.75.",
      amountOver: 78.75,
    },
  ],
};

export async function fetchTripBudget(tripId: string): Promise<TripBudgetBreakdown> {
  try {
    const rawData = await apiClient<{
      tripId: string;
      tripName: string;
      currency: string;
      startDate: string | null;
      endDate: string | null;
      durationDays: number;
      totalBudget: number | null;
      totalSpent: number;
      remainingBudget: number | null;
      perDayAverage: number;
      isOverBudget: boolean;
      categories: Record<string, {
        category: BudgetCategory;
        allocated: number | null;
        spent: number;
        remaining: number | null;
        percentageOfTotal: number;
        isOverBudget: boolean;
      }>;
      dailyExpenses: Array<{ date: string; amount: number; isOverDailyAverage: boolean }>;
      alerts: Array<{ type: "OVER_TOTAL_BUDGET" | "OVER_CATEGORY_BUDGET" | "OVER_DAILY_AVERAGE"; category?: string; message: string; amountOver: number }>;
    }>(`/trips/${tripId}/budget`);

    const categoryLabels: Record<string, string> = {
      transport: "Transportation",
      accommodation: "Lodging & Stays",
      activities: "Tours & Sightseeing",
      food: "Food & Dining",
      other: "Miscellaneous",
    };

    const categoriesWithLabels = {
      transport: {
        ...rawData.categories.transport,
        label: categoryLabels.transport,
      },
      accommodation: {
        ...rawData.categories.accommodation,
        label: categoryLabels.accommodation,
      },
      activities: {
        ...rawData.categories.activities,
        label: categoryLabels.activities,
      },
      food: {
        ...rawData.categories.food,
        label: categoryLabels.food,
      },
      other: {
        ...rawData.categories.other,
        label: categoryLabels.other,
      },
    };

    return {
      ...rawData,
      categories: categoriesWithLabels,
    };
  } catch {
    return DEMO_BUDGET_BREAKDOWN;
  }
}

export async function updateCategoryBudget(
  tripId: string,
  category: BudgetCategory,
  amount: number | null
): Promise<{ success: boolean; message?: string }> {
  return apiClient(`/trips/${tripId}/budget/${category}`, {
    method: "PATCH",
    body: JSON.stringify({ amount, budget: amount }),
  });
}
