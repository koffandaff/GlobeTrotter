import { Prisma } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import type { NormalizedOsmCity } from "./osm.client";
import type {
  CityDetailDto,
  CitySummaryDto,
  ListCitiesQuery,
} from "./cities.types";

const citySummarySelect = {
  id: true,
  sourceDataSourceId: true,
  name: true,
  country: true,
  countryCode: true,
  region: true,
  description: true,
  imageUrl: true,
  latitude: true,
  longitude: true,
  costIndex: true,
  popularityScore: true,
  viewCount: true,
  saveCount: true,
  tripCount: true,
  createdAt: true,
  updatedAt: true,
  dataSource: {
    select: {
      code: true,
    },
  },
  _count: {
    select: {
      activities: true,
    },
  },
} as const;

type CitySummaryRecord = Prisma.CityGetPayload<{ select: typeof citySummarySelect }>;

function toSummaryDto(record: CitySummaryRecord): CitySummaryDto {
  return {
    id: record.id,
    name: record.name,
    country: record.country,
    countryCode: record.countryCode,
    region: record.region,
    description: record.description,
    imageUrl: record.imageUrl,
    latitude: record.latitude ? Number(record.latitude) : null,
    longitude: record.longitude ? Number(record.longitude) : null,
    costIndex: record.costIndex ? Number(record.costIndex) : null,
    popularityScore: Number(record.popularityScore),
    viewCount: record.viewCount,
    saveCount: record.saveCount,
    tripCount: record.tripCount,
    activitiesCount: record._count.activities,
    dataSourceCode: record.dataSource.code,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

const cityDetailSelect = {
  id: true,
  sourceDataSourceId: true,
  name: true,
  country: true,
  countryCode: true,
  region: true,
  description: true,
  imageUrl: true,
  latitude: true,
  longitude: true,
  costIndex: true,
  popularityScore: true,
  viewCount: true,
  saveCount: true,
  tripCount: true,
  createdAt: true,
  updatedAt: true,
  dataSource: {
    select: {
      id: true,
      code: true,
      name: true,
    },
  },
  _count: {
    select: {
      activities: true,
    },
  },
} as const;

type CityDetailRecord = Prisma.CityGetPayload<{ select: typeof cityDetailSelect }>;

function toDetailDto(record: CityDetailRecord): CityDetailDto {
  return {
    id: record.id,
    name: record.name,
    country: record.country,
    countryCode: record.countryCode,
    region: record.region,
    description: record.description,
    imageUrl: record.imageUrl,
    latitude: record.latitude ? Number(record.latitude) : null,
    longitude: record.longitude ? Number(record.longitude) : null,
    costIndex: record.costIndex ? Number(record.costIndex) : null,
    popularityScore: Number(record.popularityScore),
    viewCount: record.viewCount,
    saveCount: record.saveCount,
    tripCount: record.tripCount,
    activitiesCount: record._count.activities,
    dataSourceCode: record.dataSource.code,
    dataSource: {
      id: record.dataSource.id,
      code: record.dataSource.code,
      name: record.dataSource.name,
    },
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export async function listCities(
  query: ListCitiesQuery
): Promise<{ cities: CitySummaryDto[]; totalItems: number }> {
  const whereConditions: Prisma.CityWhereInput[] = [];

  if (query.search) {
    whereConditions.push({
      OR: [
        { name: { contains: query.search, mode: "insensitive" } },
        { country: { contains: query.search, mode: "insensitive" } },
        { region: { contains: query.search, mode: "insensitive" } },
      ],
    });
  }

  if (query.region) {
    whereConditions.push({
      region: { contains: query.region, mode: "insensitive" },
    });
  }

  if (query.country) {
    whereConditions.push({
      OR: [
        { country: { contains: query.country, mode: "insensitive" } },
        { countryCode: { equals: query.country, mode: "insensitive" } },
      ],
    });
  }

  const where: Prisma.CityWhereInput =
    whereConditions.length > 0 ? { AND: whereConditions } : {};

  const [records, totalItems] = await prisma.$transaction([
    prisma.city.findMany({
      where,
      select: citySummarySelect,
      orderBy: [{ popularityScore: "desc" }, { viewCount: "desc" }, { name: "asc" }],
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.city.count({ where }),
  ]);

  return {
    cities: records.map(toSummaryDto),
    totalItems,
  };
}

export async function getPopularCities(limit: number): Promise<CitySummaryDto[]> {
  const records = await prisma.city.findMany({
    select: citySummarySelect,
    orderBy: [{ popularityScore: "desc" }, { tripCount: "desc" }, { viewCount: "desc" }],
    take: limit,
  });

  return records.map(toSummaryDto);
}

export async function findCityById(id: string): Promise<CityDetailDto | null> {
  const record = await prisma.city.findUnique({
    where: { id },
    select: cityDetailSelect,
  });

  return record ? toDetailDto(record) : null;
}

export async function findCityByNameAndCountry(
  name: string,
  country: string
): Promise<CitySummaryDto | null> {
  const record = await prisma.city.findFirst({
    where: {
      name: { equals: name, mode: "insensitive" },
      country: { equals: country, mode: "insensitive" },
    },
    select: citySummarySelect,
  });

  return record ? toSummaryDto(record) : null;
}

export async function incrementCityViewCount(id: string): Promise<void> {
  await prisma.city
    .update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {
      // Non-blocking background view count increment
    });
}

export async function createCityFromOsm(
  osmCity: NormalizedOsmCity
): Promise<CitySummaryDto> {
  return prisma.$transaction(async (tx) => {
    let dataSource = await tx.dataSource.findUnique({
      where: { code: "OSM" },
    });

    if (!dataSource) {
      dataSource = await tx.dataSource.create({
        data: {
          code: "OSM",
          name: "OpenStreetMap",
          type: "API",
          baseUrl: "https://nominatim.openstreetmap.org",
        },
      });
    }

    const createdCity = await tx.city.create({
      data: {
        sourceDataSourceId: dataSource.id,
        name: osmCity.name,
        country: osmCity.country,
        countryCode: osmCity.countryCode,
        region: osmCity.region,
        description: osmCity.description,
        latitude: osmCity.latitude !== null ? new Prisma.Decimal(osmCity.latitude) : null,
        longitude: osmCity.longitude !== null ? new Prisma.Decimal(osmCity.longitude) : null,
        costIndex: null,
        popularityScore: new Prisma.Decimal(30),
      },
      select: citySummarySelect,
    });

    await tx.externalResource.create({
      data: {
        dataSourceId: dataSource.id,
        entityType: "City",
        entityId: createdCity.id,
        externalId: osmCity.osmId,
        sourceUrl: `https://www.openstreetmap.org/${osmCity.osmId}`,
      },
    });

    return toSummaryDto(createdCity);
  });
}
