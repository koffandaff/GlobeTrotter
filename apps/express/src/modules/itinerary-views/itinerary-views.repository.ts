import { Prisma } from "@prisma/client";
import { prisma } from "../../shared/prisma";

interface TripWithStopsAndItems {
  id: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  startDate: Date | null;
  endDate: Date | null;
  status: string;
  currency: string;
  stops: {
    id: string;
    sequence: number;
    arrivalDate: Date | null;
    departureDate: Date | null;
    notes: string | null;
    city: {
      id: string;
      name: string;
      country: string;
      countryCode: string;
      imageUrl: string | null;
      costIndex: Prisma.Decimal | null;
    };
    itineraryItems: {
      id: string;
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
      activity: {
        id: string;
        name: string;
        category: string;
        imageUrl: string | null;
        durationMinutes: number | null;
        estimatedCost: Prisma.Decimal | null;
      } | null;
    }[];
  }[];
}

export async function findTripItinerary(tripId: string, userId: string): Promise<TripWithStopsAndItems | null> {
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      deletedAt: null,
      OR: [
        { userId },
        { visibility: "PUBLIC" },
        { shares: { some: { sharedWithUserId: userId } } },
      ],
    },
    select: {
      id: true,
      name: true,
      description: true,
      coverImageUrl: true,
      startDate: true,
      endDate: true,
      status: true,
      currency: true,
      stops: {
        orderBy: { sequence: "asc" },
        select: {
          id: true,
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
              imageUrl: true,
              costIndex: true,
            },
          },
          itineraryItems: {
            orderBy: [{ date: "asc" }, { startTime: "asc" }, { sequence: "asc" }],
            select: {
              id: true,
              activityId: true,
              title: true,
              date: true,
              startTime: true,
              endTime: true,
              sequence: true,
              notes: true,
              estimatedCost: true,
              currency: true,
              status: true,
              activity: {
                select: {
                  id: true,
                  name: true,
                  category: true,
                  imageUrl: true,
                  durationMinutes: true,
                  estimatedCost: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return trip;
}

export async function findTripCalendar(tripId: string, userId: string): Promise<TripWithStopsAndItems | null> {
  return findTripItinerary(tripId, userId);
}