export interface ItineraryItemResponseDto {
  id: string;
  tripStopId: string;
  activityId: string | null;
  title: string;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  sequence: number;
  notes: string | null;
  estimatedCost: number | null;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  activity?: {
    id: string;
    name: string;
    category: string;
    imageUrl: string | null;
    durationMinutes: number | null;
  } | null;
}

export interface CreateItineraryItemRequest {
  activityId?: string;
  title: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  sequence?: number;
  notes?: string;
  estimatedCost?: number;
  currency?: string;
}

export interface UpdateItineraryItemRequest {
  title?: string;
  date?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  sequence?: number;
  notes?: string | null;
  estimatedCost?: number | null;
  status?: string;
}

export interface ReorderItineraryItemRequest {
  sequence: number;
  date?: string | null;
}

export interface ItineraryItemListResponseDto {
  items: ItineraryItemResponseDto[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}