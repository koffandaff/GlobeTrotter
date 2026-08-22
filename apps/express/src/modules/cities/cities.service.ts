import { EventType } from "@prisma/client";
import { NotFoundError } from "../../core/errors/app-error";
import { logUserEvent } from "../../shared/utils/events";
import * as citiesRepository from "./cities.repository";
import type {
  CityDetailDto,
  CitySummaryDto,
  ListCitiesQuery,
} from "./cities.types";
import { searchOsmCity } from "./osm.client";

function parsePagination(query: ListCitiesQuery) {
  const page = Math.max(1, Math.floor(query.page || 1));
  const limit = Math.min(100, Math.max(1, Math.floor(query.limit || 20)));
  return { page, limit };
}

export async function listCities(
  userId: string,
  query: ListCitiesQuery
): Promise<{ cities: CitySummaryDto[]; totalItems: number; totalPages: number }> {
  const { page, limit } = parsePagination(query);

  let { cities, totalItems } = await citiesRepository.listCities({
    ...query,
    page,
    limit,
  });

  // If local DB search yielded 0 results on first page and a search keyword exists, trigger OSM discovery
  if (totalItems === 0 && page === 1 && query.search && query.search.trim().length >= 2) {
    const osmCity = await searchOsmCity(query.search);
    if (osmCity) {
      const existing = await citiesRepository.findCityByNameAndCountry(
        osmCity.name,
        osmCity.country
      );

      if (existing) {
        cities = [existing];
        totalItems = 1;
      } else {
        const persisted = await citiesRepository.createCityFromOsm(osmCity);
        cities = [persisted];
        totalItems = 1;
      }
    }
  }

  if (query.search) {
    logUserEvent({
      userId,
      eventType: EventType.CITY_SEARCHED,
      metadata: { search: query.search, resultCount: totalItems },
    });
  }

  return {
    cities,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / limit)),
  };
}

export async function getPopularCities(limit = 10): Promise<CitySummaryDto[]> {
  const safeLimit = Math.min(50, Math.max(1, Math.floor(limit)));
  return citiesRepository.getPopularCities(safeLimit);
}

export async function getCity(
  userId: string,
  cityId: string
): Promise<CityDetailDto> {
  const city = await citiesRepository.findCityById(cityId);
  if (!city) {
    throw new NotFoundError("city not found");
  }

  // Non-blocking view count increment & user event logging
  void citiesRepository.incrementCityViewCount(cityId);

  logUserEvent({
    userId,
    eventType: EventType.CITY_VIEWED,
    entityType: "city",
    entityId: cityId,
    metadata: { cityName: city.name, country: city.country },
  });

  return city;
}
