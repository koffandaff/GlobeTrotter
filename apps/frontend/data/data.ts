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
  preferredLanguage: string;
  savedDestinations: string[];
}

export const currentUser: User = {
  id: "u1",
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  preferredLanguage: "English",
  savedDestinations: ["Tokyo", "Paris", "New York"],
};

export interface CityOption {
  id: string;
  name: string;
  country: string;
  region: string;
  costIndex: "Budget" | "Mid-range" | "Luxury";
  popularity: number;
  description?: string;
  imageUrl?: string;
}

export const popularCities: CityOption[] = [
  { id: "c1", name: "Tokyo", country: "Japan", region: "Asia", costIndex: "Mid-range", popularity: 95 },
  { id: "c2", name: "Paris", country: "France", region: "Europe", costIndex: "Luxury", popularity: 98 },
  { id: "c3", name: "New York", country: "USA", region: "Americas", costIndex: "Luxury", popularity: 96 },
  { id: "c4", name: "Bangkok", country: "Thailand", region: "Asia", costIndex: "Budget", popularity: 90 },
  { id: "c5", name: "Prague", country: "Czech Republic", region: "Europe", costIndex: "Budget", popularity: 85 },
];

export interface ActivityOption {
  id: string;
  name: string;
  type: string;
  city: string;
  duration: string;
  cost: number;
}

export const activities: ActivityOption[] = [
  { id: "a1", name: "Tsukiji Outer Market", type: "Food", city: "Tokyo", duration: "3 hours", cost: 30 },
  { id: "a2", name: "Eiffel Tower Tour", type: "Sightseeing", city: "Paris", duration: "2 hours", cost: 45 },
  { id: "a3", name: "Statue of Liberty Cruise", type: "Sightseeing", city: "New York", duration: "4 hours", cost: 60 },
  { id: "a4", name: "Street Food Tour", type: "Food", city: "Bangkok", duration: "3 hours", cost: 15 },
  { id: "a5", name: "Prague Castle Walk", type: "Sightseeing", city: "Prague", duration: "2.5 hours", cost: 20 },
  { id: "a6", name: "Helicopter Ride", type: "Adventure", city: "New York", duration: "1 hour", cost: 250 },
];

export interface TripSuggestion {
  id: string;
  name: string;
  description: string;
}

export const tripSuggestions: TripSuggestion[] = [
  {
    id: "s1",
    name: "Kyoto, Japan",
    description: "Experience ancient temples and beautiful gardens.",
  },
  {
    id: "s2",
    name: "Santorini, Greece",
    description: "Relax by the stunning blue-domed churches and ocean views.",
  },
  {
    id: "s3",
    name: "Banff, Canada",
    description: "Explore majestic mountains and turquoise glacial lakes.",
  },
];

export interface Activity {
  id: string;
  name: string;
  type: string; // e.g. "Sightseeing", "Food", "Adventure"
  duration?: string; // e.g. "2 hours"
  cost?: number;
  day: number; // e.g. 1, 2, 3 - which day of that stop this activity is on
  category: "transport" | "stay" | "activities" | "meals";
}

export interface ItineraryStop {
  id: string;
  city: string;
  startDate: string; // ISO date string
  endDate: string;
  activities: Activity[];
}

export const dailyBudgetLimit = 250;

export const itineraryStops: ItineraryStop[] = [
  {
    id: "stop1",
    city: "Miami, USA",
    startDate: "2024-11-02",
    endDate: "2024-11-05",
    activities: [
      { id: "act1", name: "Flight to Miami", type: "Travel", cost: 150, day: 1, category: "transport" },
      { id: "act2", name: "Ocean Drive Hotel", type: "Accommodation", cost: 200, day: 1, category: "stay" },
      { id: "act3", name: "South Beach Walk", type: "Sightseeing", duration: "2 hours", cost: 0, day: 1, category: "activities" },
      { id: "act4", name: "Cuban Dinner at Versailles", type: "Food", cost: 45, day: 1, category: "meals" },
      { id: "act5", name: "Art Deco District Tour", type: "Sightseeing", duration: "3 hours", cost: 30, day: 2, category: "activities" },
      { id: "act6", name: "Lunch at Joe's Stone Crab", type: "Food", cost: 80, day: 2, category: "meals" },
    ],
  },
  {
    id: "stop2",
    city: "Key West, USA",
    startDate: "2024-11-05",
    endDate: "2024-11-09",
    activities: [
      { id: "act7", name: "Drive to Key West", type: "Travel", cost: 50, day: 1, category: "transport" },
      { id: "act8", name: "Sunset Key Guest Cottages", type: "Accommodation", cost: 300, day: 1, category: "stay" },
      { id: "act9", name: "Snorkeling Tour", type: "Adventure", duration: "4 hours", cost: 120, day: 1, category: "activities" },
      { id: "act10", name: "Duval Street Pub Crawl", type: "Food", cost: 60, day: 2, category: "meals" },
    ],
  },
];
