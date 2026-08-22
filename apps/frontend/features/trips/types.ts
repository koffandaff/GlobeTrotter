export type TripStatus = "DRAFT" | "PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED";
export type TripVisibility = "PRIVATE" | "SHARED" | "PUBLIC";

export interface Trip {
  id: string;
  userId?: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  startDate: string | null; // ISO Date string (YYYY-MM-DD or ISO)
  endDate: string | null;
  status: TripStatus;
  visibility: TripVisibility;
  totalEstimatedCost: number | null;
  currency: string;
  stopsCount?: number;
  stops?: TripStop[];
  budget?: TripBudget | null;
  destination?: string; // computed or primary city
  createdAt?: string;
  updatedAt?: string;
}

export interface TripStop {
  id: string;
  tripId: string;
  cityId: string;
  sequence: number;
  arrivalDate: string | null;
  departureDate: string | null;
  notes: string | null;
  city: {
    id: string;
    name: string;
    country: string;
    countryCode: string;
    imageUrl?: string | null;
    costIndex?: number | null;
  };
  itineraryItemsCount?: number;
}

export interface TripBudget {
  id: string;
  totalBudget: number | null;
  transportBudget: number | null;
  accommodationBudget: number | null;
  activitiesBudget: number | null;
  foodBudget: number | null;
  otherBudget: number | null;
  currency: string;
}

export interface CreateTripInput {
  name: string;
  description?: string;
  coverImageUrl?: string;
  startDate?: string;
  endDate?: string;
  status?: TripStatus;
  visibility?: TripVisibility;
  currency?: string;
  totalBudget?: number;
}

export interface UpdateTripInput {
  name?: string;
  description?: string | null;
  coverImageUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status?: TripStatus;
  visibility?: TripVisibility;
  currency?: string;
}

export interface ListTripsParams {
  page?: number;
  limit?: number;
  status?: TripStatus;
  search?: string;
  sortBy?: "startDate" | "createdAt" | "name";
  sortOrder?: "asc" | "desc";
}
