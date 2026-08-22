export interface ItineraryResponseDto {
  trip: {
    id: string;
    name: string;
    description: string | null;
    coverImageUrl: string | null;
    startDate: string | null;
    endDate: string | null;
    status: string;
    currency: string;
  };
  stops: ItineraryStopDto[];
}

export interface ItineraryStopDto {
  id: string;
  sequence: number;
  city: {
    id: string;
    name: string;
    country: string;
    countryCode: string;
    imageUrl: string | null;
    costIndex: number | null;
  };
  arrivalDate: string | null;
  departureDate: string | null;
  notes: string | null;
  days: ItineraryDayDto[];
}

export interface ItineraryDayDto {
  date: string;
  dayIndex: number;
  items: ItineraryItemDto[];
  totalEstimatedCost: number;
  totalDurationMinutes: number | null;
}

export interface ItineraryItemDto {
  id: string;
  activityId: string | null;
  title: string;
  startTime: string | null;
  endTime: string | null;
  sequence: number;
  notes: string | null;
  estimatedCost: number | null;
  currency: string;
  status: string;
  activity?: {
    id: string;
    name: string;
    category: string;
    imageUrl: string | null;
    durationMinutes: number | null;
    estimatedCost: number | null;
  } | null;
}

export interface CalendarResponseDto {
  trip: {
    id: string;
    name: string;
    startDate: string | null;
    endDate: string | null;
    currency: string;
  };
  days: CalendarDayDto[];
  summary: {
    totalDays: number;
    totalActivities: number;
    totalEstimatedCost: number;
  };
}

export interface CalendarDayDto {
  date: string;
  dayIndex: number;
  isTripDay: boolean;
  stops: {
    id: string;
    city: { id: string; name: string; country: string; imageUrl: string | null };
    arrivalDate: string | null;
    departureDate: string | null;
  }[];
  activities: CalendarActivityDto[];
  totalEstimatedCost: number;
  totalDurationMinutes: number | null;
}

export interface CalendarActivityDto {
  id: string;
  stopId: string;
  stopSequence: number;
  activityId: string | null;
  title: string;
  startTime: string | null;
  endTime: string | null;
  estimatedCost: number | null;
  currency: string;
  status: string;
  activity?: {
    id: string;
    name: string;
    category: string;
    imageUrl: string | null;
    durationMinutes: number | null;
  } | null;
}