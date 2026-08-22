import { Prisma, type TripVisibility } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import type {
  CreateTripStopRequest,
  TripStopDto,
  UpdateTripStopRequest,
} from "./trip-stops.types";

const stopSelect = {
  id: true,
  tripId: true,
  cityId: true,
  sequence: true,
  arrivalDate: true,
  departureDate: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
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
} as const;

type TripStopRecord = Prisma.TripStopGetPayload<{ select: typeof stopSelect }>;

function toDto(record: TripStopRecord): TripStopDto {
  return {
    id: record.id,
    tripId: record.tripId,
    cityId: record.cityId,
    sequence: record.sequence,
    arrivalDate: record.arrivalDate,
    departureDate: record.departureDate,
    notes: record.notes,
    city: {
      id: record.city.id,
      name: record.city.name,
      country: record.city.country,
      countryCode: record.city.countryCode,
      region: record.city.region,
      imageUrl: record.city.imageUrl,
      costIndex: record.city.costIndex ? Number(record.city.costIndex) : null,
    },
    itineraryItemsCount: record._count.itineraryItems,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export async function findStopsByTripId(tripId: string): Promise<TripStopDto[]> {
  const records = await prisma.tripStop.findMany({
    where: { tripId },
    orderBy: { sequence: "asc" },
    select: stopSelect,
  });

  return records.map(toDto);
}

export async function findStopById(id: string): Promise<TripStopDto | null> {
  const record = await prisma.tripStop.findUnique({
    where: { id },
    select: stopSelect,
  });

  return record ? toDto(record) : null;
}

export async function findStopOwnership(
  id: string
): Promise<{ id: string; tripId: string; sequence: number; userId: string; visibility: TripVisibility } | null> {
  const record = await prisma.tripStop.findUnique({
    where: { id },
    select: {
      id: true,
      tripId: true,
      sequence: true,
      trip: {
        select: {
          id: true,
          userId: true,
          visibility: true,
        },
      },
    },
  });

  if (!record) return null;

  return {
    id: record.id,
    tripId: record.tripId,
    sequence: record.sequence,
    userId: record.trip.userId,
    visibility: record.trip.visibility,
  };
}

export async function findTripOwnership(
  tripId: string
): Promise<{ id: string; userId: string; visibility: TripVisibility } | null> {
  return prisma.trip.findFirst({
    where: { id: tripId, deletedAt: null },
    select: { id: true, userId: true, visibility: true },
  });
}

export async function findCityExists(cityId: string): Promise<boolean> {
  const count = await prisma.city.count({ where: { id: cityId } });
  return count > 0;
}

export async function findStopByTripAndCity(
  tripId: string,
  cityId: string
): Promise<TripStopDto | null> {
  const record = await prisma.tripStop.findUnique({
    where: {
      tripId_cityId: {
        tripId,
        cityId,
      },
    },
    select: stopSelect,
  });

  return record ? toDto(record) : null;
}

export async function getMaxSequence(tripId: string): Promise<number> {
  const aggregate = await prisma.tripStop.aggregate({
    where: { tripId },
    _max: { sequence: true },
  });

  return aggregate._max.sequence ?? 0;
}

export async function createStop(
  tripId: string,
  input: CreateTripStopRequest,
  assignedSequence: number
): Promise<TripStopDto> {
  const record = await prisma.tripStop.create({
    data: {
      tripId,
      cityId: input.cityId,
      sequence: assignedSequence,
      arrivalDate: input.arrivalDate ? new Date(input.arrivalDate) : undefined,
      departureDate: input.departureDate ? new Date(input.departureDate) : undefined,
      notes: input.notes,
    },
    select: stopSelect,
  });

  return toDto(record);
}

export async function updateStop(
  id: string,
  input: UpdateTripStopRequest
): Promise<TripStopDto> {
  const data: Prisma.TripStopUpdateInput = {
    ...(input.arrivalDate !== undefined
      ? { arrivalDate: input.arrivalDate ? new Date(input.arrivalDate) : null }
      : {}),
    ...(input.departureDate !== undefined
      ? { departureDate: input.departureDate ? new Date(input.departureDate) : null }
      : {}),
    ...(input.notes !== undefined ? { notes: input.notes } : {}),
  };

  const record = await prisma.tripStop.update({
    where: { id },
    data,
    select: stopSelect,
  });

  return toDto(record);
}

export async function reorderStop(
  tripId: string,
  stopId: string,
  targetSequence: number
): Promise<TripStopDto[]> {
  return prisma.$transaction(async (tx) => {
    const stops = await tx.tripStop.findMany({
      where: { tripId },
      orderBy: { sequence: "asc" },
    });

    const currentIndex = stops.findIndex((s) => s.id === stopId);
    if (currentIndex === -1) {
      throw new Error("STOP_NOT_FOUND");
    }

    const clampedTarget = Math.max(1, Math.min(stops.length, targetSequence));
    const targetIndex = clampedTarget - 1;

    if (currentIndex === targetIndex) {
      const currentRecords = await tx.tripStop.findMany({
        where: { tripId },
        orderBy: { sequence: "asc" },
        select: stopSelect,
      });
      return currentRecords.map(toDto);
    }

    const [moved] = stops.splice(currentIndex, 1);
    stops.splice(targetIndex, 0, moved);

    for (let i = 0; i < stops.length; i++) {
      const newSeq = i + 1;
      if (stops[i].sequence !== newSeq) {
        await tx.tripStop.update({
          where: { id: stops[i].id },
          data: { sequence: newSeq },
        });
      }
    }

    const reorderedRecords = await tx.tripStop.findMany({
      where: { tripId },
      orderBy: { sequence: "asc" },
      select: stopSelect,
    });

    return reorderedRecords.map(toDto);
  });
}

export async function deleteStopAndCompact(
  tripId: string,
  stopId: string
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.tripStop.delete({
      where: { id: stopId },
    });

    const remaining = await tx.tripStop.findMany({
      where: { tripId },
      orderBy: { sequence: "asc" },
    });

    for (let i = 0; i < remaining.length; i++) {
      const desiredSeq = i + 1;
      if (remaining[i].sequence !== desiredSeq) {
        await tx.tripStop.update({
          where: { id: remaining[i].id },
          data: { sequence: desiredSeq },
        });
      }
    }
  });
}
