import { apiClient } from "@/lib/api/client";
import type { UpdateUserProfileInput, UserProfile } from "../types";

export const DEMO_PROFILE: UserProfile = {
  id: "demo-user-1",
  email: "alex.traveler@example.com",
  username: "alextravels",
  firstName: "Alex",
  lastName: "Morgan",
  displayName: "Alex Morgan",
  avatarUrl: null,
  role: "USER",
  status: "ACTIVE",
  preferredLanguage: "English",
  savedDestinations: [
    { id: "city-paris", name: "Paris", country: "France" },
    { id: "city-tokyo", name: "Tokyo", country: "Japan" },
    { id: "city-rome", name: "Rome", country: "Italy" },
  ],
};

export async function getCurrentUserProfile(): Promise<UserProfile> {
  try {
    const user = await apiClient<UserProfile>("/users/me");
    return user;
  } catch (err) {
    console.error("Failed to fetch user profile:", err);
    return DEMO_PROFILE;
  }
}

export async function updateUserProfile(data: UpdateUserProfileInput): Promise<UserProfile> {
  return apiClient<UserProfile>("/users/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteUserAccount(): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>("/users/me", {
    method: "DELETE",
  });
}

export async function getSavedDestinations(): Promise<Array<{ id: string; name: string; country: string }>> {
  try {
    return await apiClient<Array<{ id: string; name: string; country: string }>>(
      "/users/me/saved-destinations"
    );
  } catch {
    return DEMO_PROFILE.savedDestinations || [];
  }
}

export async function removeSavedDestination(cityId: string): Promise<{ success: boolean }> {
  return apiClient<{ success: boolean }>(`/users/me/saved-destinations/${cityId}`, {
    method: "DELETE",
  });
}
