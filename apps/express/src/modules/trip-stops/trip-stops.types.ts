export interface StopCityDto {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  region: string | null;
  imageUrl: string | null;
  costIndex: number | null;
}

export interface TripStopDto {
  id: string;
  tripId: string;
  cityId: string;
  sequence: number;
  arrivalDate: Date | null;
  departureDate: Date | null;
  notes: string | null;
  city: StopCityDto;
  itineraryItemsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTripStopRequest {
  cityId: string;
  arrivalDate?: string;
  departureDate?: string;
  notes?: string;
  sequence?: number;
}

export interface UpdateTripStopRequest {
  arrivalDate?: string | null;
  departureDate?: string | null;
  notes?: string | null;
}

export interface ReorderTripStopRequest {
  newSequence: number;
}
