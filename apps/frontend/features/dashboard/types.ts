export interface RecentTrip {
  id: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string;
  totalEstimatedCost: number | null;
  currency: string;
  stopsCount: number;
  createdAt: string;
}

export interface RecommendedDestination {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  imageUrl: string | null;
  costIndex: number | null;
  popularityScore: number;
  reason: string | null;
}

export interface BudgetHighlights {
  totalBudget: number | null;
  totalSpent: number;
  totalEstimated: number;
  currency: string;
  byCategory: Array<{
    category: string;
    budget: number | null;
    spent: number;
    estimated: number;
  }>;
  tripsWithBudget: number;
  tripsWithoutBudget: number;
}

export interface DashboardData {
  recentTrips: RecentTrip[];
  recommendedDestinations: RecommendedDestination[];
  budgetHighlights: BudgetHighlights;
}
