import { apiClient } from "@/lib/api/client";
import type {
  AddActivityInput,
  AddStopInput,
  ItineraryStop,
  TripItinerary,
  UpdateStopInput,
} from "../types";

export const DEMO_ITINERARY: TripItinerary = {
  trip: {
    id: "demo-paris-1",
    name: "Summer in Paris & Nice",
    description: "Multi-city French adventure spanning iconic Paris monuments and French Riviera beaches.",
    startDate: "2026-06-10",
    endDate: "2026-06-18",
    status: "PLANNED",
    currency: "EUR",
  },
  stops: [
    {
      id: "stop-1",
      sequence: 1,
      city: {
        id: "city-paris",
        name: "Paris",
        country: "France",
        countryCode: "FR",
      },
      arrivalDate: "2026-06-10",
      departureDate: "2026-06-14",
      notes: "Staying near Saint-Germain-des-Prés",
      days: [
        {
          date: "2026-06-10",
          dayIndex: 0,
          totalEstimatedCost: 65,
          totalDurationMinutes: 180,
          items: [
            {
              id: "item-1",
              title: "Louvre Guided Masterpieces Tour",
              startTime: "10:00",
              endTime: "13:00",
              sequence: 1,
              estimatedCost: 65,
              currency: "EUR",
              notes: "Meet guide at the glass pyramid.",
            },
          ],
        },
        {
          date: "2026-06-11",
          dayIndex: 1,
          totalEstimatedCost: 145,
          totalDurationMinutes: 270,
          items: [
            {
              id: "item-2",
              title: "Eiffel Tower Summit Elevator",
              startTime: "16:00",
              endTime: "18:00",
              sequence: 1,
              estimatedCost: 35,
              currency: "EUR",
              notes: "Sunset panoramic views.",
            },
            {
              id: "item-3",
              title: "Seine River Dinner Cruise",
              startTime: "20:00",
              endTime: "22:30",
              sequence: 2,
              estimatedCost: 110,
              currency: "EUR",
              notes: "3-course dinner onboard Bateaux Parisiens.",
            },
          ],
        },
      ],
    },
    {
      id: "stop-2",
      sequence: 2,
      city: {
        id: "city-nice",
        name: "Nice",
        country: "France",
        countryCode: "FR",
      },
      arrivalDate: "2026-06-14",
      departureDate: "2026-06-18",
      notes: "TGV Train from Paris Gare de Lyon to Nice-Ville",
      days: [
        {
          date: "2026-06-15",
          dayIndex: 0,
          totalEstimatedCost: 40,
          totalDurationMinutes: 120,
          items: [
            {
              id: "item-4",
              title: "Promenade des Anglais & Old Town Walk",
              startTime: "10:00",
              endTime: "12:00",
              sequence: 1,
              estimatedCost: 0,
              currency: "EUR",
              notes: "Stroll along the Mediterranean coastline.",
            },
            {
              id: "item-5",
              title: "Cours Saleya Flower & Food Market",
              startTime: "12:30",
              endTime: "14:30",
              sequence: 2,
              estimatedCost: 40,
              currency: "EUR",
              notes: "Sample socca and local Niçoise specialties.",
            },
          ],
        },
      ],
    },
  ],
};

export async function fetchTripItinerary(tripId: string): Promise<TripItinerary> {
  try {
    const data = await apiClient<TripItinerary>(`/trips/${tripId}/itinerary`);
    return data;
  } catch {
    return DEMO_ITINERARY;
  }
}

export async function fetchTripStops(tripId: string): Promise<ItineraryStop[]> {
  try {
    const response = await apiClient<ItineraryStop[] | { stops: ItineraryStop[] }>(
      `/trips/${tripId}/stops`
    );
    return Array.isArray(response) ? response : (response as { stops: ItineraryStop[] }).stops || [];
  } catch {
    return DEMO_ITINERARY.stops;
  }
}

export async function addTripStop(tripId: string, input: AddStopInput): Promise<ItineraryStop> {
  const payload = {
    cityId: input.cityId,
    arrivalDate: input.arrivalDate ? `${input.arrivalDate}T00:00:00.000Z` : undefined,
    departureDate: input.departureDate ? `${input.departureDate}T23:59:59.000Z` : undefined,
    notes: input.notes,
    sequence: input.sequence,
  };
  return apiClient<ItineraryStop>(`/trips/${tripId}/stops`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTripStop(stopId: string, input: UpdateStopInput): Promise<ItineraryStop> {
  const payload = {
    arrivalDate: input.arrivalDate ? `${input.arrivalDate}T00:00:00.000Z` : input.arrivalDate,
    departureDate: input.departureDate ? `${input.departureDate}T23:59:59.000Z` : input.departureDate,
    notes: input.notes,
  };
  return apiClient<ItineraryStop>(`/stops/${stopId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteTripStop(stopId: string): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>(`/stops/${stopId}`, {
    method: "DELETE",
  });
}

export async function reorderTripStop(stopId: string, newSequence: number): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>(`/stops/${stopId}/reorder`, {
    method: "PATCH",
    body: JSON.stringify({ newSequence }),
  });
}

export async function addActivityToStop(stopId: string, input: AddActivityInput) {
  return apiClient(`/stops/${stopId}/activities`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function deleteTripActivity(activityId: string): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>(`/trip-activities/${activityId}`, {
    method: "DELETE",
  });
}
