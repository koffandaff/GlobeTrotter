import { apiClient } from "@/lib/api/client";
import type { Activity, ListActivitiesParams } from "../types";

export const DEMO_ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    name: "Louvre Museum Guided Tour",
    description: "Explore world-famous art collections including the Mona Lisa, Venus de Milo, and Winged Victory with a master art historian.",
    category: "Sightseeing",
    estimatedCost: 65,
    currency: "EUR",
    durationMinutes: 180,
    imageUrl: "https://images.unsplash.com/photo-1565099824688-e93eb20fe527?w=600&auto=format&fit=crop",
    popularityScore: 98,
    isVerified: true,
    city: { id: "city-paris", name: "Paris", country: "France" },
  },
  {
    id: "act-2",
    name: "Eiffel Tower Sunset Summit Ascent",
    description: "Skip-the-line elevator tickets to the topmost summit platform offering 360-degree panoramic golden-hour views of Paris.",
    category: "Sightseeing",
    estimatedCost: 35,
    currency: "EUR",
    durationMinutes: 120,
    imageUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600&auto=format&fit=crop",
    popularityScore: 99,
    isVerified: true,
    city: { id: "city-paris", name: "Paris", country: "France" },
  },
  {
    id: "act-3",
    name: "Seine River Gourmet Dinner Cruise",
    description: "Luxurious 3-course French dining experience aboard an all-glass boat cruising past illuminated Parisian landmarks with live violin music.",
    category: "Food",
    estimatedCost: 110,
    currency: "EUR",
    durationMinutes: 150,
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop",
    popularityScore: 95,
    isVerified: true,
    city: { id: "city-paris", name: "Paris", country: "France" },
  },
  {
    id: "act-4",
    name: "Tsukiji Outer Market Morning Food Walk",
    description: "Taste fresh sashimi, wagyu beef skewers, tamagoyaki, and Japanese street food delicacies with a local culinary guide.",
    category: "Food",
    estimatedCost: 55,
    currency: "USD",
    durationMinutes: 120,
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop",
    popularityScore: 94,
    isVerified: true,
    city: { id: "city-tokyo", name: "Tokyo", country: "Japan" },
  },
  {
    id: "act-5",
    name: "Mount Fuji & Hakone Day Expedition",
    description: "Scenic cable car ride overlooking Lake Ashi, volcanic hot springs in Owakudani, and stunning viewpoints of Mount Fuji.",
    category: "Adventure",
    estimatedCost: 140,
    currency: "USD",
    durationMinutes: 480,
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop",
    popularityScore: 97,
    isVerified: true,
    city: { id: "city-tokyo", name: "Tokyo", country: "Japan" },
  },
  {
    id: "act-6",
    name: "Colosseum & Roman Forum Gladiator Tour",
    description: "Walk in the footsteps of Roman gladiators on the arena floor and explore the ruins of ancient temples and the Palatine Hill.",
    category: "Sightseeing",
    estimatedCost: 50,
    currency: "EUR",
    durationMinutes: 180,
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop",
    popularityScore: 96,
    isVerified: true,
    city: { id: "city-rome", name: "Rome", country: "Italy" },
  },
  {
    id: "act-7",
    name: "Traditional Kyoto Onsen & Tea Ceremony",
    description: "Relax in healing natural mineral hot springs followed by an authentic matcha tea ceremony in a historic wooden Machiya.",
    category: "Relaxation",
    estimatedCost: 75,
    currency: "USD",
    durationMinutes: 150,
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop",
    popularityScore: 91,
    isVerified: true,
    city: { id: "city-kyoto", name: "Kyoto", country: "Japan" },
  },
];

export async function searchActivities(
  params: ListActivitiesParams = {}
): Promise<{ activities: Activity[]; total: number }> {
  try {
    const query = new URLSearchParams();
    if (params.cityId) query.set("cityId", params.cityId);
    if (params.category) query.set("category", params.category);
    if (params.maxCost) query.set("maxCost", String(params.maxCost));
    if (params.maxDuration) query.set("maxDuration", String(params.maxDuration));
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    const queryString = query.toString() ? `?${query.toString()}` : "";
    const response = await apiClient<
      Activity[] | { activities: Activity[]; pagination?: { totalItems: number } }
    >(`/activities${queryString}`);

    if (Array.isArray(response)) {
      return { activities: response, total: response.length };
    }
    const list = (response as { activities: Activity[] }).activities || [];
    const total =
      (response as { pagination?: { totalItems: number } }).pagination?.totalItems ??
      list.length;
    return { activities: list, total };
  } catch {
    let list = [...DEMO_ACTIVITIES];
    if (params.category && params.category !== "all") {
      list = list.filter((a) => a.category.toLowerCase() === params.category?.toLowerCase());
    }
    if (params.maxCost) {
      list = list.filter((a) => (a.estimatedCost ?? 0) <= params.maxCost!);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          (a.description && a.description.toLowerCase().includes(q)) ||
          (a.city && a.city.name.toLowerCase().includes(q))
      );
    }
    return { activities: list, total: list.length };
  }
}

export async function getActivity(id: string): Promise<Activity> {
  return apiClient<Activity>(`/activities/${id}`);
}
