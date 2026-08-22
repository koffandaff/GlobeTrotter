export interface CalendarActivity {
  id: string;
  title: string;
  category?: string;
  startTime?: string | null;
  endTime?: string | null;
  estimatedCost?: number | null;
  currency?: string;
  cityName?: string;
  notes?: string | null;
}

export interface CalendarTrip {
  id: string;
  name: string;
  description?: string | null;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  colorTheme?: "teal" | "gold" | "rust" | "forest" | "sage";
  cityName?: string;
  activities?: CalendarActivity[];
  totalEstimatedCost?: number | null;
  currency?: string;
  coverImageUrl?: string | null;
}

export interface CalendarDayInfo {
  date: Date;
  dateString: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  trips: CalendarTrip[];
  activities: CalendarActivity[];
}

export type FilterStatus = "ALL" | "PLANNED" | "ONGOING" | "COMPLETED" | "DRAFT";
export type SortOption = "DATE_ASC" | "DATE_DESC" | "NAME_ASC";
export type GroupByOption = "NONE" | "STATUS" | "CITY";
