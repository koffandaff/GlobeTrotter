import { apiClient } from "@/lib/api/client";
import type { DashboardData } from "../types";

export const DEMO_DASHBOARD: DashboardData = {
  recentTrips: [
    {
      id: "demo-paris-1",
      name: "Summer in Paris & Nice",
      description: "French Riviera and city sights",
      coverImageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop",
      startDate: "2026-06-10",
      endDate: "2026-06-18",
      status: "PLANNED",
      totalEstimatedCost: 1650,
      currency: "EUR",
      stopsCount: 2,
      createdAt: "2026-05-01",
    },
    {
      id: "demo-tokyo-2",
      name: "Tokyo & Kyoto Explorer",
      description: "Exploring temples and tech districts",
      coverImageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop",
      startDate: "2026-09-05",
      endDate: "2026-09-17",
      status: "PLANNED",
      totalEstimatedCost: 2800,
      currency: "USD",
      stopsCount: 2,
      createdAt: "2026-05-15",
    },
  ],
  recommendedDestinations: [
    {
      id: "city-rome",
      name: "Rome",
      country: "Italy",
      countryCode: "IT",
      imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop",
      costIndex: 3,
      popularityScore: 94,
      reason: "Popular with travelers who visited Paris",
    },
    {
      id: "city-barcelona",
      name: "Barcelona",
      country: "Spain",
      countryCode: "ES",
      imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&auto=format&fit=crop",
      costIndex: 3,
      popularityScore: 89,
      reason: "Trending Mediterranean destination",
    },
    {
      id: "city-nyc",
      name: "New York",
      country: "United States",
      countryCode: "US",
      imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&auto=format&fit=crop",
      costIndex: 5,
      popularityScore: 92,
      reason: "Top rated for culture and nightlife",
    },
    {
      id: "city-kyoto",
      name: "Kyoto",
      country: "Japan",
      countryCode: "JP",
      imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop",
      costIndex: 3,
      popularityScore: 87,
      reason: "Historic architecture and scenic gardens",
    },
  ],
  budgetHighlights: {
    totalBudget: 4500,
    totalSpent: 1650,
    totalEstimated: 3200,
    currency: "USD",
    byCategory: [
      { category: "Lodging", budget: 1800, spent: 650, estimated: 1200 },
      { category: "Transportation", budget: 1200, spent: 420, estimated: 900 },
      { category: "Activities", budget: 800, spent: 280, estimated: 650 },
      { category: "Food & Dining", budget: 700, spent: 240, estimated: 450 },
    ],
    tripsWithBudget: 2,
    tripsWithoutBudget: 0,
  },
};

export async function getDashboardData(): Promise<DashboardData> {
  try {
    return await apiClient<DashboardData>("/dashboard");
  } catch {
    return DEMO_DASHBOARD;
  }
}
