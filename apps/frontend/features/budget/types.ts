export type BudgetCategory =
  | "transport"
  | "accommodation"
  | "activities"
  | "food"
  | "other"
  | "total";

export interface CategoryBreakdown {
  category: BudgetCategory;
  label: string;
  allocated: number | null;
  spent: number;
  remaining: number | null;
  percentageOfTotal: number;
  isOverBudget: boolean;
}

export interface DailyExpenseSummary {
  date: string; // YYYY-MM-DD
  amount: number;
  isOverDailyAverage: boolean;
}

export interface BudgetAlert {
  type: "OVER_TOTAL_BUDGET" | "OVER_CATEGORY_BUDGET" | "OVER_DAILY_AVERAGE";
  category?: string;
  message: string;
  amountOver: number;
}

export interface TripBudgetBreakdown {
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
  categories: {
    transport: CategoryBreakdown;
    accommodation: CategoryBreakdown;
    activities: CategoryBreakdown;
    food: CategoryBreakdown;
    other: CategoryBreakdown;
  };
  dailyExpenses: DailyExpenseSummary[];
  alerts: BudgetAlert[];
}

export interface UpdateCategoryBudgetInput {
  amount?: number | null;
  budget?: number | null;
}
