import { apiClient } from "@/lib/api/client";
import type { City, ListCitiesParams } from "../types";

export const DEMO_POPULAR_CITIES: City[] = [
  {
    id: "city-paris",
    name: "Paris",
    country: "France",
    countryCode: "FR",
    region: "Europe",
    description: "The City of Light, famous for its romantic atmosphere, world-class art, fashion, and gastronomy.",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop",
    latitude: 48.8566,
    longitude: 2.3522,
    costIndex: 4,
    popularityScore: 98,
    tripCount: 42,
    activitiesCount: 18,
  },
  {
    id: "city-tokyo",
    name: "Tokyo",
    country: "Japan",
    countryCode: "JP",
    region: "Asia",
    description: "A bustling metropolis blending ultra-modern skyscrapers and neon lights with historic temples.",
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop",
    latitude: 35.6762,
    longitude: 139.6503,
    costIndex: 3,
    popularityScore: 96,
    tripCount: 38,
    activitiesCount: 24,
  },
  {
    id: "city-rome",
    name: "Rome",
    country: "Italy",
    countryCode: "IT",
    region: "Europe",
    description: "The Eternal City, home to ancient ruins including the Colosseum and Vatican treasures.",
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop",
    latitude: 41.9028,
    longitude: 12.4964,
    costIndex: 3,
    popularityScore: 94,
    tripCount: 29,
    activitiesCount: 15,
  },
  {
    id: "city-nyc",
    name: "New York",
    country: "United States",
    countryCode: "US",
    region: "Americas",
    description: "The Big Apple, iconic for its Manhattan skyline, Central Park, Broadway shows, and cultural diversity.",
    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&auto=format&fit=crop",
    latitude: 40.7128,
    longitude: -74.006,
    costIndex: 5,
    popularityScore: 92,
    tripCount: 35,
    activitiesCount: 21,
  },
  {
    id: "city-barcelona",
    name: "Barcelona",
    country: "Spain",
    countryCode: "ES",
    region: "Europe",
    description: "Catalan capital famed for Antoni Gaudí architecture, vibrant tapas culture, and Mediterranean beaches.",
    imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&auto=format&fit=crop",
    latitude: 41.3851,
    longitude: 2.1734,
    costIndex: 3,
    popularityScore: 89,
    tripCount: 22,
    activitiesCount: 14,
  },
  {
    id: "city-kyoto",
    name: "Kyoto",
    country: "Japan",
    countryCode: "JP",
    region: "Asia",
    description: "Former imperial capital famous for classical Buddhist temples, gardens, imperial palaces, and wooden houses.",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop",
    latitude: 35.0116,
    longitude: 135.7681,
    costIndex: 3,
    popularityScore: 87,
    tripCount: 19,
    activitiesCount: 12,
  },
];

export async function listCities(params: ListCitiesParams = {}): Promise<{ cities: City[]; total: number }> {
  try {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.search) query.set("search", params.search);
    if (params.region) query.set("region", params.region);
    if (params.country) query.set("country", params.country);

    const queryString = query.toString() ? `?${query.toString()}` : "";
    const response = await apiClient<City[] | { cities: City[]; total?: number; totalItems?: number }>(
      `/cities${queryString}`
    );

    if (Array.isArray(response)) {
      return { cities: response, total: response.length };
    }
    const list = (response as { cities: City[] }).cities || [];
    const total =
      (response as { total?: number }).total ??
      (response as { totalItems?: number }).totalItems ??
      list.length;
    return { cities: list, total };
  } catch {
    let filtered = [...DEMO_POPULAR_CITIES];
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
      );
    }
    if (params.region && params.region !== "all") {
      filtered = filtered.filter((c) => c.region?.toLowerCase() === params.region?.toLowerCase());
    }
    return { cities: filtered, total: filtered.length };
  }
}

export async function getPopularCities(limit = 10): Promise<City[]> {
  try {
    const response = await apiClient<City[] | { cities: City[] }>(`/cities/popular?limit=${limit}`);
    return Array.isArray(response) ? response : (response as { cities: City[] }).cities || [];
  } catch {
    return DEMO_POPULAR_CITIES.slice(0, limit);
  }
}

export async function getCity(cityId: string): Promise<City> {
  return apiClient<City>(`/cities/${cityId}`);
}
