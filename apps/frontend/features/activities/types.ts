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

export interface StopActivityItem {
  id: string;
  stopId: string;
  activityId?: string | null;
  title: string;
  date?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  sequence: number;
  notes?: string | null;
  estimatedCost?: number | null;
  currency: string;
  status: string;
}

export interface CreateStopActivityInput {
  activityId?: string;
  title: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  notes?: string;
  estimatedCost?: number;
  currency?: string;
  sequence?: number;
}

export interface UpdateStopActivityInput {
  title?: string;
  date?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  notes?: string | null;
  estimatedCost?: number | null;
  currency?: string;
  status?: string;
}
