export interface City {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  region: string | null;
  description: string | null;
  imageUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  costIndex: number | null; // 1-5 or scale
  popularityScore: number;
  viewCount?: number;
  saveCount?: number;
  tripCount?: number;
  activitiesCount?: number;
}

export interface ListCitiesParams {
  page?: number;
  limit?: number;
  search?: string;
  region?: string;
  country?: string;
}

export type CostCategory = "ALL" | "BUDGET" | "MID_RANGE" | "LUXURY";
