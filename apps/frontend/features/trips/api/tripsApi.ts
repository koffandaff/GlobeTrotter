import { apiClient } from "@/lib/api/client";
import type {
  CreateTripInput,
  ListTripsParams,
  Trip,
  UpdateTripInput,
} from "../types";

export const DEMO_TRIPS: Trip[] = [
  {
    id: "trip-paris-1",
    name: "Summer in Paris",
    description: "Exploring the City of Light, cafes, museums, and historic streets.",
    coverImageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop",
    startDate: "2026-06-10",
    endDate: "2026-06-18",
    status: "PLANNED",
    visibility: "PRIVATE",
    totalEstimatedCost: 1850,
    currency: "EUR",
    stopsCount: 2,
    destination: "Paris, France",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "trip-tokyo-2",
    name: "Tokyo & Kyoto Explorer",
    description: "High-speed rail, ancient shrines, ramen tours, and neon nights.",
    coverImageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop",
    startDate: "2026-04-05",
    endDate: "2026-04-16",
    status: "ONGOING",
    visibility: "PUBLIC",
    totalEstimatedCost: 3200,
    currency: "USD",
    stopsCount: 3,
    destination: "Tokyo, Japan",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "trip-nyc-3",
    name: "New York City Escape",
    description: "Broadway shows, Central Park strolls, and rooftop viewpoints.",
    coverImageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&auto=format&fit=crop",
    startDate: "2025-11-20",
    endDate: "2025-11-25",
    status: "COMPLETED",
    visibility: "SHARED",
    totalEstimatedCost: 1400,
    currency: "USD",
    stopsCount: 1,
    destination: "New York, USA",
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
