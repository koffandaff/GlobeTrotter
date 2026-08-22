export interface ActivitySearchQuery {
  cityId: string;
  category?: string;
  maxCost?: number;
  maxDuration?: number;
  page?: number;
  limit?: number;
}

export interface ActivitySearchResponseDto {
  activities: ActivitySummaryDto[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface ActivitySummaryDto {
  id: string;
  name: string;
  description: string | null;
  category: string;
  estimatedCost: number | null;
  currency: string;
  durationMinutes: number | null;
  imageUrl: string | null;
  popularityScore: number;
  isVerified: boolean;
  city: {
    id: string;
    name: string;
    country: string;
  };
}

export interface ActivityDetailDto {
  id: string;
  name: string;
  description: string | null;
  category: string;
  estimatedCost: number | null;
  currency: string;
  durationMinutes: number | null;
  imageUrl: string | null;
  popularityScore: number;
  isVerified: boolean;
  metadata: Record<string, unknown> | null;
  city: {
    id: string;
    name: string;
    country: string;
    countryCode: string;
    region: string | null;
    latitude: number | null;
    longitude: number | null;
    costIndex: number | null;
  };
  createdByUser?: {
    id: string;
    displayName: string | null;
    avatarUrl: string | null;
  } | null;
}