import { prisma } from "../../shared/prisma";
import type { Prisma } from "@prisma/client";

interface ItineraryItemWithActivity {
  id: string;
  tripStopId: string;
  activityId: string | null;
  title: string;
  date: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  sequence: number;
  notes: string | null;
  estimatedCost: Prisma.Decimal | null;
  currency: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  activity: {
    id: string;
    name: string;
    category: string;
    imageUrl: string | null;
    durationMinutes: number | null;
  } | null;
}

export async function findItineraryItemsByStop(
  stopId: string,
  pagination: { page: number; limit: number }
): Promise<{ items: ItineraryItemWithActivity[]; totalItems: number }> {
  const where = { tripStopId: stopId };

  const [items, totalItems] = await Promise.all([
    prisma.itineraryItem.findMany({
      where,
      orderBy: [
        { date: "asc" },
        { startTime: "asc" },
        { sequence: "asc" },
      ],
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      include: {
        activity: {
          select: {
            id: true,
            name: true,
            category: true,
            imageUrl: true,
            durationMinutes: true,
          },
        },
      },
    }),
    prisma.itineraryItem.count({ where }),
  ]);

  return { items, totalItems };
}

export async function findItineraryItemById(id: string): Promise<ItineraryItemWithActivity | null> {
  return prisma.itineraryItem.findUnique({
    where: { id },
    include: {
      activity: {
        select: {
          id: true,
          name: true,
          category: true,
          imageUrl: true,
          durationMinutes: true,
        },
      },
    },
  });
}

export async function findActivityById(activityId: string): Promise<{ id: string } | null> {
  return prisma.activity.findUnique({
    where: { id: activityId },
    select: { id: true },
  });
}

export async function createItineraryItem(data: {
  tripStopId: string;
  activityId?: string;
  title: string;
  date?: Date | null;
  startTime?: Date | null;
  endTime?: Date | null;
  sequence?: number;
  notes?: string | null;
  estimatedCost?: Prisma.Decimal | null;
  currency?: string;
}): Promise<ItineraryItemWithActivity> {
  const maxSequence = await prisma.itineraryItem.findFirst({
    where: { tripStopId: data.tripStopId },
    orderBy: { sequence: "desc" },
    select: { sequence: true },
  });

  return prisma.itineraryItem.create({
    data: {
      tripStopId: data.tripStopId,
      activityId: data.activityId ?? null,
      title: data.title,
      date: data.date ?? null,
      startTime: data.startTime ?? null,
      endTime: data.endTime ?? null,
      sequence: data.sequence ?? (maxSequence?.sequence ?? 0) + 1,
      notes: data.notes ?? null,
      estimatedCost: data.estimatedCost ?? null,
      currency: data.currency ?? "USD",
      status: "PLANNED",
    },
    include: {
      activity: {
        select: {
          id: true,
          name: true,
          category: true,
          imageUrl: true,
          durationMinutes: true,
        },
      },
    },
  });
}

export async function updateItineraryItem(
  id: string,
  data: {
    title?: string;
    date?: Date | null;
    startTime?: Date | null;
    endTime?: Date | null;
    sequence?: number;
    notes?: string | null;
    estimatedCost?: Prisma.Decimal | null;
    status?: string;
  }
): Promise<ItineraryItemWithActivity | null> {
  return prisma.itineraryItem.update({
    where: { id },
    data,
    include: {
      activity: {
        select: {
          id: true,
          name: true,
          category: true,
          imageUrl: true,
          durationMinutes: true,
        },
      },
    },
  });
}

export async function deleteItineraryItem(id: string): Promise<void> {
  await prisma.itineraryItem.delete({ where: { id } });
}

export async function findTripStopById(stopId: string): Promise<{ id: string; tripId: string } | null> {
  return prisma.tripStop.findUnique({
    where: { id: stopId },
    select: { id: true, tripId: true },
  });
}

export async function verifyTripOwnership(tripId: string, userId: string): Promise<boolean> {
  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId, deletedAt: null },
    select: { id: true },
  });
  return !!trip;
}

export async function reorderItineraryItems(
  stopId: string,
  items: { id: string; sequence: number; date?: Date | null }[]
): Promise<void> {
  await prisma.$transaction(
    items.map((item) =>
      prisma.itineraryItem.update({
        where: { id: item.id, tripStopId: stopId },
        data: { sequence: item.sequence, ...(item.date !== undefined && { date: item.date }) },
      })
    )
  );
}