import { apiClient } from "@/lib/api/client";

export interface ShareInfo {
  shareToken: string;
  shareUrl: string;
  permission: string;
  expiresAt: string | null;
}

export async function createShare(
  tripId: string,
  permission: "VIEW" | "EDIT" = "VIEW",
  expiresInDays?: number
): Promise<ShareInfo> {
  const body: Record<string, unknown> = { permission };
  if (expiresInDays) {
    const d = new Date();
    d.setDate(d.getDate() + expiresInDays);
    body.expiresAt = d.toISOString();
  }
  return apiClient<ShareInfo>(`/sharing/trips/${tripId}/share`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function revokeShare(tripId: string): Promise<void> {
  await apiClient(`/sharing/trips/${tripId}/share`, { method: "DELETE" });
}

export interface SharedTrip {
  id: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  user: { firstName: string; lastName: string; username: string | null };
  stops: Array<{
    id: string;
    sequence: number;
    arrivalDate: string | null;
    departureDate: string | null;
    notes: string | null;
    city: { id: string; name: string; country: string };
  }>;
  _count: { likes: number; comments: number };
}

export async function getSharedTrip(shareSlug: string): Promise<SharedTrip> {
  return apiClient<SharedTrip>(`/sharing/public/trips/${shareSlug}`);
}

export async function copySharedTrip(shareSlug: string): Promise<{ id: string }> {
  return apiClient<{ id: string }>(`/sharing/public/trips/${shareSlug}/copy`, { method: "POST" });
}
