export interface Activity {
  id: string;
  name: string;
  description: string | null;
  category: string;
  estimatedCost: number | null;
  currency: string;
  durationMinutes: number | null;
  imageUrl: string | null;
  popularityScore: number;
  isVerified?: boolean;
  city?: {
    id: string;
    name: string;
    country: string;
  };
}

export interface ListActivitiesParams {
  cityId?: string;
  category?: string;
  maxCost?: number;
  maxDuration?: number;
  search?: string;
  page?: number;
  limit?: number;
}
