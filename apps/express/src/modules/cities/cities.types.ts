export interface CitySummaryDto {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  region: string | null;
  description: string | null;
  imageUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  costIndex: number | null;
  popularityScore: number;
  viewCount: number;
  saveCount: number;
  tripCount: number;
  activitiesCount: number;
  dataSourceCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CityDetailDto extends CitySummaryDto {
  dataSource: {
    id: string;
    code: string;
    name: string;
  };
}

export interface ListCitiesQuery {
  page: number;
  limit: number;
  search?: string;
  region?: string;
  country?: string;
}

export interface PopularCitiesQuery {
  limit?: number;
}

export interface OsmPlace {
  place_id: number;
  osm_id: number;
  osm_type: string;
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    state?: string;
    region?: string;
    country?: string;
    country_code?: string;
  };
}
