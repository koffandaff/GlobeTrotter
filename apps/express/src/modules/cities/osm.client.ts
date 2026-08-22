import { logger } from "../../core/logger/logger";
import type { OsmPlace } from "./cities.types";

export interface NormalizedOsmCity {
  osmId: string;
  name: string;
  country: string;
  countryCode: string;
  region: string | null;
  description: string;
  latitude: number | null;
  longitude: number | null;
}

export async function searchOsmCity(query: string): Promise<NormalizedOsmCity | null> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return null;
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      trimmed
    )}&format=json&addressdetails=1&limit=3`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "GlobeTrotter-TravelPlanner/1.0 (contact: demo@globetrotter.app)",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(3500),
    });

    if (!response.ok) {
      logger.warn("OSM Nominatim search non-ok response", {
        status: response.status,
        query: trimmed,
      });
      return null;
    }

    const data = (await response.json()) as OsmPlace[];
    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    const place = data[0];
    const address = place.address;

    const cityName =
      address?.city ||
      address?.town ||
      address?.village ||
      address?.municipality ||
      place.display_name.split(",")[0].trim();

    const country = address?.country || "Unknown";
    const countryCode = address?.country_code ? address.country_code.toUpperCase() : "UN";
    const region = address?.state || address?.region || null;
    const latitude = place.lat ? parseFloat(place.lat) : null;
    const longitude = place.lon ? parseFloat(place.lon) : null;

    return {
      osmId: String(place.osm_id),
      name: cityName,
      country,
      countryCode,
      region,
      description: place.display_name,
      latitude,
      longitude,
    };
  } catch (error) {
    logger.warn("OSM Nominatim search failed or timed out", {
      query: trimmed,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}
