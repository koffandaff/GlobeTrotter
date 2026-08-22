export interface DashboardResponseDto {
  recentTrips: RecentTripDto[];
  recommendedDestinations: RecommendedDestinationDto[];
  budgetHighlights: BudgetHighlightsDto;
}

export interface RecentTripDto {
  id: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  startDate: Date | null;
  endDate: Date | null;
  status: string;
  totalEstimatedCost: number | null;
  currency: string;
  stopsCount: number;
  createdAt: Date;
}

export interface RecommendedDestinationDto {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  imageUrl: string | null;
  costIndex: number | null;
  popularityScore: number;
  reason: string | null;
}

export interface BudgetHighlightsDto {
  totalBudget: number | null;
  totalSpent: number;
  totalEstimated: number;
  currency: string;
  byCategory: BudgetCategoryDto[];
  tripsWithBudget: number;
  tripsWithoutBudget: number;
}

export interface BudgetCategoryDto {
  category: string;
  budget: number | null;
  spent: number;
  estimated: number;
}