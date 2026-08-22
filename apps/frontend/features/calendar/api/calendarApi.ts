import { apiClient } from "@/lib/api/client";
import type { CalendarTrip } from "../types";

export const DEMO_CALENDAR_TRIPS: CalendarTrip[] = [
  {
    id: "demo-paris-1",
    name: "PARIS TRIP",
    description: "Romantic getaway exploring the Eiffel Tower, Louvre museum, and Montmartre cafes.",
    startDate: "2026-01-04",
    endDate: "2026-01-09",
    status: "PLANNED",
    colorTheme: "teal",
    cityName: "Paris, France",
    currency: "EUR",
    totalEstimatedCost: 1850,
    activities: [
      {
        id: "act-1",
        title: "Eiffel Tower Sunset Ascent",
        category: "Sightseeing",
        startTime: "17:30",
        endTime: "19:30",
        estimatedCost: 35,
        currency: "EUR",
        cityName: "Paris",
        notes: "Pre-booked skip-the-line summit elevator tickets.",
      },
      {
        id: "act-2",
        title: "Louvre Guided Masterpieces Tour",
        category: "Museum & Culture",
        startTime: "10:00",
        endTime: "13:00",
        estimatedCost: 65,
        currency: "EUR",
        cityName: "Paris",
        notes: "Meet guide at Pyramide du Louvre entrance.",
      },
      {
        id: "act-3",
        title: "Seine River Dinner Cruise",
        category: "Food & Dining",
        startTime: "20:00",
        endTime: "22:30",
        estimatedCost: 110,
        currency: "EUR",
        cityName: "Paris",
        notes: "3-course gourmet dinner with live music.",
      },
    ],
  },
  {
    id: "demo-nyc-2",
    name: "NYC – GETAWAY",
    description: "Weekend in Manhattan: Broadway show, Central Park cycling, and skyline viewpoints.",
    startDate: "2026-01-14",
    endDate: "2026-01-17",
    status: "PLANNED",
    colorTheme: "gold",
    cityName: "New York, USA",
    currency: "USD",
    totalEstimatedCost: 1400,
    activities: [
      {
        id: "act-4",
        title: "Central Park Bike & Walk Tour",
        category: "Outdoor",
        startTime: "09:00",
        endTime: "11:30",
        estimatedCost: 30,
        currency: "USD",
        cityName: "New York",
        notes: "Rent tandem bikes near Columbus Circle.",
      },
      {
        id: "act-5",
        title: "Broadway Theater Show (The Lion King)",
        category: "Entertainment",
        startTime: "19:00",
        endTime: "21:45",
        estimatedCost: 185,
        currency: "USD",
        cityName: "New York",
        notes: "Minskoff Theatre orchestra seating.",
      },
      {
        id: "act-6",
        title: "Top of the Rock Observation Deck",
        category: "Sightseeing",
        startTime: "16:00",
        endTime: "17:30",
        estimatedCost: 45,
        currency: "USD",
        cityName: "New York",
        notes: "Golden hour view of the Empire State Building.",
      },
    ],
  },
  {
    id: "demo-japan-3",
    name: "JAPAN ADVENTURE",
    description: "Cultural expedition across Tokyo shrines, Kyoto bamboo groves, and Osaka street food.",
    startDate: "2026-01-16",
    endDate: "2026-01-23",
    status: "ONGOING",
    colorTheme: "rust",
    cityName: "Tokyo & Kyoto, Japan",
    currency: "USD",
    totalEstimatedCost: 3200,
    activities: [
      {
        id: "act-7",
        title: "Shibuya Crossing & Meiji Shrine",
        category: "Culture & Sightseeing",
        startTime: "09:30",
        endTime: "12:30",
        estimatedCost: 20,
        currency: "USD",
        cityName: "Tokyo",
        notes: "Morning stroll in Yoyogi park and traditional omikuji fortune.",
      },
      {
        id: "act-8",
        title: "Tsukiji Outer Market Food Crawl",
        category: "Food & Dining",
        startTime: "13:00",
        endTime: "15:00",
        estimatedCost: 55,
        currency: "USD",
        cityName: "Tokyo",
        notes: "Fresh sashimi, tamagoyaki, and wagyu skewers.",
      },
      {
        id: "act-9",
        title: "Shinkansen Bullet Train to Kyoto",
        category: "Transport",
        startTime: "16:00",
        endTime: "18:15",
        estimatedCost: 130,
        currency: "USD",
        cityName: "Kyoto",
        notes: "Nozomi express with Mount Fuji view on the right side.",
      },
    ],
  },
  {
    id: "demo-nyc-repeat",
    name: "NYC GETAWAY (PART II)",
    description: "Follow-up Soho shopping and Brooklyn Bridge sunset walk.",
    startDate: "2026-01-27",
    endDate: "2026-01-30",
    status: "PLANNED",
    colorTheme: "forest",
    cityName: "New York, USA",
    currency: "USD",
    totalEstimatedCost: 950,
    activities: [
      {
        id: "act-10",
        title: "Brooklyn Bridge Sunset Walk & DUMBO Pizza",
        category: "Sightseeing",
        startTime: "17:00",
        endTime: "20:00",
        estimatedCost: 40,
        currency: "USD",
        cityName: "New York",
        notes: "Walk from Manhattan side to Grimaldi's Pizza.",
      },
    ],
  },
];

export async function fetchCalendarTrips(): Promise<CalendarTrip[]> {
  try {
    interface BackendTrip {
      id: string;
      name: string;
      description?: string | null;
      startDate?: string | null;
      endDate?: string | null;
      status: "DRAFT" | "PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED";
      totalEstimatedCost?: number | null;
      currency?: string;
      coverImageUrl?: string | null;
    }

    const response = await apiClient<BackendTrip[] | { trips: BackendTrip[] }>("/trips?limit=50");
    const trips = Array.isArray(response) ? response : (response as { trips: BackendTrip[] }).trips || [];

    if (!trips || trips.length === 0) {
      return DEMO_CALENDAR_TRIPS;
    }

    const themes: Array<"teal" | "gold" | "rust" | "forest" | "sage"> = [
      "teal",
      "gold",
      "rust",
      "forest",
      "sage",
    ];

    const mappedTrips: CalendarTrip[] = trips
      .filter((t) => t.startDate && t.endDate)
      .map((t, index) => ({
        id: t.id,
        name: t.name.toUpperCase(),
        description: t.description,
        startDate: t.startDate ? t.startDate.split("T")[0] : "",
        endDate: t.endDate ? t.endDate.split("T")[0] : "",
        status: t.status,
        colorTheme: themes[index % themes.length],
        totalEstimatedCost: t.totalEstimatedCost,
        currency: t.currency || "USD",
        coverImageUrl: t.coverImageUrl,
        activities: [],
      }));

    // If backend trips exist, also merge with demo trips if needed so calendar is rich
    return mappedTrips.length > 0 ? mappedTrips : DEMO_CALENDAR_TRIPS;
  } catch {
    // Fallback gracefully to demo data if offline or unauthorized
    return DEMO_CALENDAR_TRIPS;
  }
}
