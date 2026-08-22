import { apiClient } from "@/lib/api/client";
import type {
  CreateTripInput,
  ListTripsParams,
  Trip,
  UpdateTripInput,
} from "../types";

export const DEMO_TRIPS: Trip[] = [
  {
    id: "t3",
    name: "The South American Expedition",
    description: "Machu Picchu trek, Sacred Valley tour, Ceviche culinary experience.",
    coverImageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=600&auto=format&fit=crop",
    startDate: "2026-06-05",
    endDate: "2026-06-25",
    status: "ONGOING",
    visibility: "PUBLIC",
    totalEstimatedCost: 2800,
    currency: "USD",
    stopsCount: 2,
    destination: "Lima & Cusco, Peru",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "t2",
    name: "Scandinavian Winter Retreat",
    description: "Northern Lights safari, Husky sledding, Ice Hotel stay.",
    coverImageUrl: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=600&auto=format&fit=crop",
    startDate: "2025-12-15",
    endDate: "2025-12-28",
    status: "PLANNED",
    visibility: "PRIVATE",
    totalEstimatedCost: 4200,
    currency: "USD",
    stopsCount: 2,
    destination: "Norway & Finland",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "t1",
    name: "Mediterranean Summer Yacht Week",
    description: "Island hopping, Sunset sailing, Old town historical walks.",
    coverImageUrl: "https://images.unsplash.com/photo-1516483638261-f40af5a58c82?q=80&w=600&auto=format&fit=crop",
    startDate: "2024-08-10",
    endDate: "2024-08-20",
    status: "COMPLETED",
    visibility: "SHARED",
    totalEstimatedCost: 3500,
    currency: "USD",
    stopsCount: 2,
    destination: "Split & Mykonos",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function listTrips(params: ListTripsParams = {}): Promise<{ trips: Trip[]; total: number }> {
  try {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.status) query.set("status", params.status);
    if (params.search) query.set("search", params.search);

    const queryString = query.toString() ? `?${query.toString()}` : "";
    const response = await apiClient<Trip[] | { trips: Trip[]; totalItems?: number; pagination?: { total?: number } }>(
      `/trips${queryString}`
    );

    let rawList: Trip[] = [];
    let total = 0;

    if (Array.isArray(response)) {
      rawList = response;
      total = response.length;
    } else if (response && Array.isArray((response as { trips: Trip[] }).trips)) {
      rawList = (response as { trips: Trip[] }).trips;
      total =
        (response as { totalItems?: number }).totalItems ??
        (response as { pagination?: { total?: number } }).pagination?.total ??
        rawList.length;
    }

    const mappedTrips = rawList.map((t) => ({
      ...t,
      startDate: t.startDate ? t.startDate.split("T")[0] : null,
      endDate: t.endDate ? t.endDate.split("T")[0] : null,
      destination: t.destination || (t.stops && t.stops[0]?.city?.name ? `${t.stops[0].city.name}, ${t.stops[0].city.country}` : "Multi-city"),
    }));

    return { trips: mappedTrips, total: total || mappedTrips.length };
  } catch (error) {
    console.warn("Falling back to demo trips due to error:", error);
    return { trips: DEMO_TRIPS, total: DEMO_TRIPS.length };
  }
}

export async function getTrip(tripId: string): Promise<Trip> {
  return apiClient<Trip>(`/trips/${tripId}`);
}

export async function createTrip(data: CreateTripInput): Promise<Trip> {
  const payload = {
    ...data,
    startDate: data.startDate ? `${data.startDate}T00:00:00.000Z` : undefined,
    endDate: data.endDate ? `${data.endDate}T23:59:59.000Z` : undefined,
  };
  return apiClient<Trip>("/trips", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTrip(tripId: string, data: UpdateTripInput): Promise<Trip> {
  const payload = {
    ...data,
    startDate: data.startDate ? `${data.startDate}T00:00:00.000Z` : data.startDate,
    endDate: data.endDate ? `${data.endDate}T23:59:59.000Z` : data.endDate,
  };
  return apiClient<Trip>(`/trips/${tripId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteTrip(tripId: string): Promise<{ success: boolean; message: string }> {
  return apiClient<{ success: boolean; message: string }>(`/trips/${tripId}`, {
    method: "DELETE",
  });
}

export async function duplicateTrip(tripId: string): Promise<Trip> {
  return apiClient<Trip>(`/trips/${tripId}/duplicate`, {
    method: "POST",
  });
}
