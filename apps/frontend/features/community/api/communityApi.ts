import { apiClient } from "@/lib/api/client";

export interface ApiCommunityTrip {
  id: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  createdAt: string;
  user: {
    id: string;
    username: string | null;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

export interface CommunityPostsResponse {
  trips: ApiCommunityTrip[];
  total: number;
}

export async function getCommunityTrips(page = 1, limit = 50, sort = "recent"): Promise<CommunityPostsResponse> {
  try {
    return await apiClient<CommunityPostsResponse>(`/community/trips?page=${page}&limit=${limit}&sort=${sort}`);
  } catch (error) {
    console.error("Failed to load community trips:", error);
    return { trips: [], total: 0 };
  }
}

export async function likeCommunityTrip(tripId: string): Promise<void> {
  await apiClient(`/community/trips/${tripId}/like`, { method: "POST" });
}

export async function unlikeCommunityTrip(tripId: string): Promise<void> {
  await apiClient(`/community/trips/${tripId}/like`, { method: "DELETE" });
}
