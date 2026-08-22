import { Prisma, type TripVisibility } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import type {
  CreateTripRequest,
  ListTripsQuery,
  TripBudgetDto,
  TripDetailDto,
  TripStopSummaryDto,
  TripSummaryDto,
  UpdateTripRequest,
} from "./trips.types";

const tripSummarySelect = {
  id: true,
  userId: true,
  name: true,
  description: true,
  coverImageUrl: true,
  startDate: true,
  endDate: true,
  status: true,
  visibility: true,
  totalEstimatedCost: true,
  currency: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      stops: true,
    },
  },
} as const;

type TripSummaryRecord = Prisma.TripGetPayload<{ select: typeof tripSummarySelect }>;

function toSummaryDto(record: TripSummaryRecord): TripSummaryDto {
  return {
    id: record.id,
    userId: record.userId,
    name: record.name,
    description: record.description,
    coverImageUrl: record.coverImageUrl,
    startDate: record.startDate,
    endDate: record.endDate,
    status: record.status,
    visibility: record.visibility,
    totalEstimatedCost: record.totalEstimatedCost ? Number(record.totalEstimatedCost) : null,
    currency: record.currency,
    stopsCount: record._count.stops,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

const tripDetailSelect = {
  id: true,
  userId: true,
  name: true,
  description: true,
  coverImageUrl: true,
  startDate: true,
  endDate: true,
  status: true,
  visibility: true,
  totalEstimatedCost: true,
  currency: true,
  createdAt: true,
  updatedAt: true,
  stops: {
    orderBy: {
      sequence: "asc",
    },
    select: {
      id: true,
      tripId: true,
      cityId: true,
      sequence: true,
      arrivalDate: true,
      departureDate: true,
      notes: true,
      city: {
        select: {
          id: true,
          name: true,
          country: true,
          countryCode: true,
          region: true,
          imageUrl: true,
          costIndex: true,
        },
      },
      _count: {
        select: {
          itineraryItems: true,
        },
      },
    },
  },
  budget: {
    select: {
      id: true,
      totalBudget: true,
      transportBudget: true,
      accommodationBudget: true,
      activitiesBudget: true,
      foodBudget: true,
      otherBudget: true,
      currency: true,
    },
  },
} as const;

type TripDetailRecord = Prisma.TripGetPayload<{ select: typeof tripDetailSelect }>;

function toDetailDto(record: TripDetailRecord): TripDetailDto {
  const stops: TripStopSummaryDto[] = record.stops.map((stop) => ({
    id: stop.id,
    tripId: stop.tripId,
    cityId: stop.cityId,
    sequence: stop.sequence,
    arrivalDate: stop.arrivalDate,
    departureDate: stop.departureDate,
    notes: stop.notes,
    city: {
      id: stop.city.id,
      name: stop.city.name,
      country: stop.city.country,
      countryCode: stop.city.countryCode,
      region: stop.city.region,
      imageUrl: stop.city.imageUrl,
      costIndex: stop.city.costIndex ? Number(stop.city.costIndex) : null,
    },
    itineraryItemsCount: stop._count.itineraryItems,
  }));

  const budget: TripBudgetDto | null = record.budget
    ? {
        id: record.budget.id,
        totalBudget: record.budget.totalBudget ? Number(record.budget.totalBudget) : null,
        transportBudget: record.budget.transportBudget ? Number(record.budget.transportBudget) : null,
        accommodationBudget: record.budget.accommodationBudget
          ? Number(record.budget.accommodationBudget)
          : null,
        activitiesBudget: record.budget.activitiesBudget ? Number(record.budget.activitiesBudget) : null,
        foodBudget: record.budget.foodBudget ? Number(record.budget.foodBudget) : null,
        otherBudget: record.budget.otherBudget ? Number(record.budget.otherBudget) : null,
        currency: record.budget.currency,
      }
    : null;

  return {
    id: record.id,
    userId: record.userId,
    name: record.name,
    description: record.description,
    coverImageUrl: record.coverImageUrl,
    startDate: record.startDate,
    endDate: record.endDate,
    status: record.status,
    visibility: record.visibility,
    totalEstimatedCost: record.totalEstimatedCost ? Number(record.totalEstimatedCost) : null,
    currency: record.currency,
    stops,
    budget,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export async function listUserTrips(
  userId: string,
  query: ListTripsQuery
): Promise<{ trips: TripSummaryDto[]; totalItems: number }> {
  const where: Prisma.TripWhereInput = {
    userId,
    deletedAt: null,
    ...(query.status ? { status: query.status } : {}),
    ...(query.search
      ? {
          name: {
            contains: query.search,
            mode: "insensitive",
          },
        }
      : {}),
  };

  const [records, totalItems] = await prisma.$transaction([
    prisma.trip.findMany({
      where,
      select: tripSummarySelect,
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.trip.count({ where }),
  ]);

  return {
    trips: records.map(toSummaryDto),
    totalItems,
  };
}

export async function findTripById(id: string): Promise<TripDetailDto | null> {
  const record = await prisma.trip.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: tripDetailSelect,
  });

  return record ? toDetailDto(record) : null;
}

export async function findTripOwnership(id: string): Promise<{ id: string; userId: string; visibility: TripVisibility } | null> {
  return prisma.trip.findFirst({
    where: { id, deletedAt: null },
    select: { id: true, userId: true, visibility: true },
  });
}

export async function createTrip(
  userId: string,
  input: CreateTripRequest
): Promise<TripDetailDto> {
  const record = await prisma.trip.create({
    data: {
      userId,
      name: input.name,
      description: input.description,
      coverImageUrl: input.coverImageUrl,
      startDate: input.startDate ? new Date(input.startDate) : undefined,
      endDate: input.endDate ? new Date(input.endDate) : undefined,
      status: input.status,
      visibility: input.visibility,
      currency: input.currency ?? "USD",
      ...(input.totalBudget !== undefined
        ? {
            budget: {
              create: {
                totalBudget: input.totalBudget,
                currency: input.currency ?? "USD",
              },
            },
          }
        : {}),
    },
    select: tripDetailSelect,
  });

  return toDetailDto(record);
}

export async function updateTrip(
  id: string,
  input: UpdateTripRequest
): Promise<TripDetailDto> {
  const data: Prisma.TripUpdateInput = {
    ...(input.name !== undefined ? { name: input.name } : {}),
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.coverImageUrl !== undefined ? { coverImageUrl: input.coverImageUrl } : {}),
    ...(input.startDate !== undefined
      ? { startDate: input.startDate ? new Date(input.startDate) : null }
      : {}),
    ...(input.endDate !== undefined
      ? { endDate: input.endDate ? new Date(input.endDate) : null }
      : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
    ...(input.visibility !== undefined ? { visibility: input.visibility } : {}),
    ...(input.currency !== undefined ? { currency: input.currency } : {}),
  };

  const record = await prisma.trip.update({
    where: { id },
    data,
    select: tripDetailSelect,
  });

  return toDetailDto(record);
}

export async function deleteTrip(id: string): Promise<void> {
  await prisma.trip.delete({
    where: { id },
  });
}

export async function duplicateTrip(
  sourceTripId: string,
  targetUserId: string
): Promise<TripDetailDto> {
  return prisma.$transaction(async (tx) => {
    const source = await tx.trip.findUnique({
      where: { id: sourceTripId },
      include: {
        stops: {
          include: {
            itineraryItems: true,
          },
          orderBy: { sequence: "asc" },
        },
        budget: true,
      },
    });

    if (!source) {
      throw new Error("SOURCE_TRIP_NOT_FOUND");
    }

    const newTrip = await tx.trip.create({
      data: {
        userId: targetUserId,
        name: `${source.name} (Copy)`,
        description: source.description,
        coverImageUrl: source.coverImageUrl,
        startDate: source.startDate,
        endDate: source.endDate,
        status: "DRAFT",
        visibility: "PRIVATE",
        totalEstimatedCost: source.totalEstimatedCost,
        currency: source.currency,
        ...(source.budget
          ? {
              budget: {
                create: {
                  totalBudget: source.budget.totalBudget,
                  transportBudget: source.budget.transportBudget,
                  accommodationBudget: source.budget.accommodationBudget,
                  activitiesBudget: source.budget.activitiesBudget,
                  foodBudget: source.budget.foodBudget,
                  otherBudget: source.budget.otherBudget,
                  currency: source.budget.currency,
                },
              },
            }
          : {}),
      },
    });

    for (const stop of source.stops) {
      const newStop = await tx.tripStop.create({
        data: {
          tripId: newTrip.id,
          cityId: stop.cityId,
          sequence: stop.sequence,
          arrivalDate: stop.arrivalDate,
          departureDate: stop.departureDate,
          notes: stop.notes,
        },
      });

      if (stop.itineraryItems.length > 0) {
        await tx.itineraryItem.createMany({
          data: stop.itineraryItems.map((item) => ({
            tripStopId: newStop.id,
            activityId: item.activityId,
            title: item.title,
            date: item.date,
            startTime: item.startTime,
            endTime: item.endTime,
            sequence: item.sequence,
            notes: item.notes,
            estimatedCost: item.estimatedCost,
            currency: item.currency,
            status: item.status,
          })),
        });
      }
    }

    const createdRecord = await tx.trip.findUniqueOrThrow({
      where: { id: newTrip.id },
      select: tripDetailSelect,
    });

    return toDetailDto(createdRecord);
  });
}
