/**
 * MOCK DATA — replace with real API calls once backend is ready. Keep the
 * same shape (interfaces) so components don't need to change, only the data
 * source does.
 */

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string; // ISO date string, e.g. "2025-03-10"
  endDate: string;
  status: "completed" | "upcoming" | "ongoing";
  coverImage?: string;
  budget?: number;
}

export const trips: Trip[] = [
  {
    id: "t1",
    name: "Florida Getaway",
    destination: "Miami, USA",
    startDate: "2024-11-02",
    endDate: "2024-11-09",
    status: "completed",
    budget: 1800,
  },
  {
    id: "t2",
    name: "West Coast Trip",
    destination: "Los Angeles, USA",
    startDate: "2025-04-15",
    endDate: "2025-04-22",
    status: "upcoming",
    budget: 2200,
  },
  {
    id: "t3",
    name: "Euro Backpacking",
    destination: "Multiple Cities, Europe",
    startDate: "2026-06-01",
    endDate: "2026-07-15",
    status: "upcoming",
    budget: 4500,
  },
];

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
}

export const currentUser: User = {
  id: "u1",
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
};

export interface CityOption {
  id: string;
  name: string;
  country: string;
  description?: string;
  imageUrl?: string;
}

export const popularCities: CityOption[] = [
  { id: "c1", name: "Tokyo", country: "Japan" },
  { id: "c2", name: "Paris", country: "France" },
  { id: "c3", name: "New York", country: "USA" },
];

export interface ActivityOption {
  id: string;
  cityId: string;
  name: string;
  category: "Sightseeing" | "Food" | "Adventure" | "Relaxation";
  priceLevel: 1 | 2 | 3 | 4; // 1 = cheap, 4 = expensive
}

export const activities: ActivityOption[] = [
  { id: "a1", cityId: "c1", name: "Tsukiji Outer Market", category: "Food", priceLevel: 2 },
  { id: "a2", cityId: "c2", name: "Eiffel Tower Tour", category: "Sightseeing", priceLevel: 3 },
];
