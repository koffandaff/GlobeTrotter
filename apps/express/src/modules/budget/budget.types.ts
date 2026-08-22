export type SupportedBudgetCategory =
  | "transport"
  | "stay"
  | "accommodation"
  | "activities"
  | "activity"
  | "meals"
  | "food"
  | "other"
  | "total";

export interface CategoryBreakdownDto {
  category: "transport" | "accommodation" | "activities" | "food" | "other";
  allocated: number | null;
  spent: number;
  remaining: number | null;
  percentageOfTotal: number;
  isOverBudget: boolean;
}

export interface DailyExpenseSummaryDto {
  date: string; // YYYY-MM-DD
  amount: number;
  isOverDailyAverage: boolean;
}

export interface BudgetAlertDto {
  type: "OVER_TOTAL_BUDGET" | "OVER_CATEGORY_BUDGET" | "OVER_DAILY_AVERAGE";
  category?: string;
  message: string;
  amountOver: number;
}

export interface TripBudgetBreakdownDto {
  tripId: string;
  tripName: string;
  currency: string;
  startDate: Date | null;
  endDate: Date | null;
  durationDays: number;
  totalBudget: number | null;
  totalSpent: number;
  remainingBudget: number | null;
  perDayAverage: number;
  isOverBudget: boolean;
  categories: {
    transport: CategoryBreakdownDto;
    accommodation: CategoryBreakdownDto;
    activities: CategoryBreakdownDto;
    food: CategoryBreakdownDto;
    other: CategoryBreakdownDto;
  };
  dailyExpenses: DailyExpenseSummaryDto[];
  alerts: BudgetAlertDto[];
}

export interface UpdateCategoryBudgetRequest {
  amount: number | null;
}
