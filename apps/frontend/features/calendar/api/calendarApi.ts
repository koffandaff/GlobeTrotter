import { apiClient } from "@/lib/api/client";
import type { CalendarTrip } from "../types";

const THEMES: ("teal" | "gold" | "rust" | "forest" | "sage")[] = [
  "teal", "gold", "rust", "forest", "sage"
];

export async function fetchCalendarTrips(): Promise<CalendarTrip[]> {
  try {
    // 1. Fetch user's trips
    const data = await apiClient<{ trips: any[] }>("/trips?limit=10");
    const trips = data.trips || [];

    // 2. Fetch calendar details for each trip
    const calendarTrips = await Promise.all(
      trips.map(async (trip, index) => {
        try {
          const res = await apiClient<any>(`/trips/${trip.id}/calendar`);
          
          return {
            id: trip.id,
            name: trip.name,
            description: trip.description,
            startDate: trip.startDate ? trip.startDate.split("T")[0] : "",
            endDate: trip.endDate ? trip.endDate.split("T")[0] : "",
            status: trip.status,
            colorTheme: THEMES[index % THEMES.length],
            cityName: trip.stopsCount > 0 ? `${trip.stopsCount} Destination${trip.stopsCount > 1 ? "s" : ""}` : "No destinations",
            currency: trip.currency,
            totalEstimatedCost: trip.totalEstimatedCost,
            coverImageUrl: trip.coverImageUrl,
            activities: res.days?.flatMap((d: any) => d.activities || []) || [],
          } as CalendarTrip;
        } catch {
          // Fallback if calendar specific fetch fails
          return {
            id: trip.id,
            name: trip.name,
            description: trip.description,
            startDate: trip.startDate ? trip.startDate.split("T")[0] : "",
            endDate: trip.endDate ? trip.endDate.split("T")[0] : "",
            status: trip.status,
            colorTheme: THEMES[index % THEMES.length],
            currency: trip.currency,
            totalEstimatedCost: trip.totalEstimatedCost,
            coverImageUrl: trip.coverImageUrl,
            activities: [],
          } as CalendarTrip;
        }
      })
    );

    // Filter out trips without start and end dates as they can't be rendered on the calendar
    return calendarTrips.filter(t => t.startDate && t.endDate);
  } catch (error) {
    console.error("Failed to fetch calendar trips", error);
    return [];
  }
}
