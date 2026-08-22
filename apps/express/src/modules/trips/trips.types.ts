import type { TripStatus, TripVisibility } from "@prisma/client";

export interface TripSummaryDto {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  startDate: Date | null;
  endDate: Date | null;
  status: TripStatus;
  visibility: TripVisibility;
  totalEstimatedCost: number | null;
  currency: string;
  stopsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TripStopSummaryDto {
  id: string;
  tripId: string;
  cityId: string;
  sequence: number;
  arrivalDate: Date | null;
  departureDate: Date | null;
  notes: string | null;
  city: {
    id: string;
    name: string;
    country: string;
    countryCode: string;
    region: string | null;
    imageUrl: string | null;
    costIndex: number | null;
  };
  itineraryItemsCount: number;
}

export interface TripBudgetDto {
  id: string;
  totalBudget: number | null;
  transportBudget: number | null;
  accommodationBudget: number | null;
  activitiesBudget: number | null;
  foodBudget: number | null;
  otherBudget: number | null;
  currency: string;
}

export interface TripDetailDto {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  startDate: Date | null;
  endDate: Date | null;
  status: TripStatus;
  visibility: TripVisibility;
  totalEstimatedCost: number | null;
  currency: string;
  stops: TripStopSummaryDto[];
  budget: TripBudgetDto | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListTripsQuery {
  page: number;
  limit: number;
  status?: TripStatus;
  search?: string;
}

export interface CreateTripRequest {
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

export interface UpdateTripRequest {
  name?: string;
  description?: string | null;
  coverImageUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status?: TripStatus;
  visibility?: TripVisibility;
  currency?: string;
}
