export interface ItineraryCity {
  id: string;
  name: string;
  country: string;
  countryCode?: string;
  imageUrl?: string | null;
  costIndex?: number | null;
}

export interface ItineraryItem {
  id: string;
  stopId?: string;
  activityId?: string | null;
  title: string;
  date?: string | null; // YYYY-MM-DD
  startTime?: string | null; // HH:MM
  endTime?: string | null; // HH:MM
  sequence: number;
  notes?: string | null;
  estimatedCost?: number | null;
  currency?: string;
  status?: string;
  activity?: {
    id: string;
    name: string;
    category: string;
    imageUrl?: string | null;
    durationMinutes?: number | null;
    estimatedCost?: number | null;
  } | null;
}

export interface ItineraryDay {
  date: string;
  dayIndex: number;
  items: ItineraryItem[];
  totalEstimatedCost: number;
  totalDurationMinutes: number | null;
}

export interface ItineraryStop {
  id: string;
  tripId?: string;
  sequence: number;
  city: ItineraryCity;
  arrivalDate: string | null;
  departureDate: string | null;
  notes?: string | null;
  days?: ItineraryDay[];
  itineraryItemsCount?: number;
}

export interface TripItinerary {
  trip: {
    id: string;
    name: string;
    description?: string | null;
    coverImageUrl?: string | null;
    startDate: string | null;
    endDate: string | null;
    status: string;
    currency: string;
  };
  stops: ItineraryStop[];
}

export interface AddStopInput {
  cityId: string;
  cityName?: string;
  arrivalDate?: string;
  departureDate?: string;
  notes?: string;
  sequence?: number;
}

export interface UpdateStopInput {
  arrivalDate?: string | null;
  departureDate?: string | null;
  notes?: string | null;
}

export interface AddActivityInput {
  title: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  estimatedCost?: number;
  currency?: string;
  notes?: string;
  activityId?: string;
}
