import * as itineraryRepository from "./itinerary-views.repository";
import { NotFoundError } from "../../core/errors/app-error";
import type { ItineraryResponseDto, CalendarResponseDto } from "./itinerary-views.types";

function formatDate(date: Date | null): string | null {
  return date ? date.toISOString().split("T")[0] : null;
}

function formatTime(date: Date | null): string | null {
  if (!date) return null;
  return date.toISOString().split("T")[1]?.slice(0, 5) ?? null;
}

function buildItinerary(trip: Awaited<ReturnType<typeof itineraryRepository.findTripItinerary>>): ItineraryResponseDto {
  if (!trip) {
    throw new NotFoundError("Trip not found");
  }

  const stops = trip.stops.map((stop) => {
    const itemsByDate = new Map<string, typeof stop.itineraryItems>();

    for (const item of stop.itineraryItems) {
      const dateKey = formatDate(item.date) || "unscheduled";
      if (!itemsByDate.has(dateKey)) {
        itemsByDate.set(dateKey, []);
      }
      itemsByDate.get(dateKey)!.push(item);
    }

    const sortedDates = Array.from(itemsByDate.keys()).sort();
    const days = sortedDates.map((dateKey, dayIndex) => {
      const items = itemsByDate.get(dateKey)!;
      const sortedItems = items.sort((a, b) => {
        if (a.startTime && b.startTime) return a.startTime.getTime() - b.startTime.getTime();
        return a.sequence - b.sequence;
      });

      const totalEstimatedCost = sortedItems.reduce((sum, item) => sum + (item.estimatedCost ? Number(item.estimatedCost) : 0), 0);
      const totalDurationMinutes = sortedItems.reduce((sum, item) => {
        if (item.activity?.durationMinutes) return sum + item.activity.durationMinutes;
        if (item.startTime && item.endTime) {
          return sum + (item.endTime.getTime() - item.startTime.getTime()) / (1000 * 60);
        }
        return sum;
      }, 0);

      return {
        date: dateKey === "unscheduled" ? "" : dateKey,
        dayIndex: dayIndex,
        items: sortedItems.map((item) => ({
          id: item.id,
          activityId: item.activityId,
          title: item.title,
          startTime: formatTime(item.startTime),
          endTime: formatTime(item.endTime),
          sequence: item.sequence,
          notes: item.notes,
          estimatedCost: item.estimatedCost ? Number(item.estimatedCost) : null,
          currency: item.currency,
          status: item.status,
          activity: item.activity
            ? {
                id: item.activity.id,
                name: item.activity.name,
                category: item.activity.category,
                imageUrl: item.activity.imageUrl,
                durationMinutes: item.activity.durationMinutes,
                estimatedCost: item.activity.estimatedCost ? Number(item.activity.estimatedCost) : null,
              }
            : null,
        })),
        totalEstimatedCost,
        totalDurationMinutes: totalDurationMinutes > 0 ? Math.round(totalDurationMinutes) : null,
      };
    });

    return {
      id: stop.id,
      sequence: stop.sequence,
      city: {
        id: stop.city.id,
        name: stop.city.name,
        country: stop.city.country,
        countryCode: stop.city.countryCode,
        imageUrl: stop.city.imageUrl,
        costIndex: stop.city.costIndex ? Number(stop.city.costIndex) : null,
      },
      arrivalDate: formatDate(stop.arrivalDate),
      departureDate: formatDate(stop.departureDate),
      notes: stop.notes,
      days,
    };
  });

  return {
    trip: {
      id: trip.id,
      name: trip.name,
      description: trip.description,
      coverImageUrl: trip.coverImageUrl,
      startDate: formatDate(trip.startDate),
      endDate: formatDate(trip.endDate),
      status: trip.status,
      currency: trip.currency,
    },
    stops,
  };
}

function buildCalendar(trip: Awaited<ReturnType<typeof itineraryRepository.findTripCalendar>>): CalendarResponseDto {
  if (!trip) {
    throw new NotFoundError("Trip not found");
  }

  const allItems: Array<{
    item: typeof trip.stops[0]["itineraryItems"][0];
    stop: typeof trip.stops[0];
  }> = [];

  for (const stop of trip.stops) {
    for (const item of stop.itineraryItems) {
      allItems.push({ item, stop });
    }
  }

  const itemsByDate = new Map<string, typeof allItems>();
  for (const { item, stop } of allItems) {
    const dateKey = formatDate(item.date) || "unscheduled";
    if (!itemsByDate.has(dateKey)) {
      itemsByDate.set(dateKey, []);
    }
    itemsByDate.get(dateKey)!.push({ item, stop });
  }

  const tripStartDate = trip.startDate ? new Date(trip.startDate.toDateString()) : null;
  const tripEndDate = trip.endDate ? new Date(trip.endDate.toDateString()) : null;

  let sortedDates: string[] = [];
  if (tripStartDate && tripEndDate) {
    const currentDate = new Date(tripStartDate);
    while (currentDate <= tripEndDate) {
      sortedDates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    const unscheduledKey = "unscheduled";
    if (itemsByDate.has(unscheduledKey)) {
      sortedDates.push(unscheduledKey);
    }
  } else {
    sortedDates = Array.from(itemsByDate.keys()).sort();
  }

  let totalActivities = 0;
  let totalEstimatedCost = 0;

  const days = sortedDates.map((dateKey, dayIndex) => {
    const entries = itemsByDate.get(dateKey) || [];
    const isTripDay = dateKey !== "unscheduled" && tripStartDate && tripEndDate
      ? new Date(dateKey) >= tripStartDate && new Date(dateKey) <= tripEndDate
      : false;

    const stopMap = new Map<string, typeof entries[0]["stop"]>();
    for (const entry of entries) {
      stopMap.set(entry.stop.id, entry.stop);
    }
    const stops = Array.from(stopMap.values()).map((stop) => ({
      id: stop.id,
      city: {
        id: stop.city.id,
        name: stop.city.name,
        country: stop.city.country,
        imageUrl: stop.city.imageUrl,
      },
      arrivalDate: formatDate(stop.arrivalDate),
      departureDate: formatDate(stop.departureDate),
    }));

    const activities = entries
      .sort((a, b) => {
        if (a.item.startTime && b.item.startTime) return a.item.startTime.getTime() - b.item.startTime.getTime();
        return a.item.sequence - b.item.sequence;
      })
      .map((entry) => {
        totalActivities++;
        const cost = entry.item.estimatedCost ? Number(entry.item.estimatedCost) : 0;
        totalEstimatedCost += cost;
        return {
          id: entry.item.id,
          stopId: entry.stop.id,
          stopSequence: entry.stop.sequence,
          activityId: entry.item.activityId,
          title: entry.item.title,
          startTime: formatTime(entry.item.startTime),
          endTime: formatTime(entry.item.endTime),
          estimatedCost: entry.item.estimatedCost ? Number(entry.item.estimatedCost) : null,
          currency: entry.item.currency,
          status: entry.item.status,
          activity: entry.item.activity
            ? {
                id: entry.item.activity.id,
                name: entry.item.activity.name,
                category: entry.item.activity.category,
                imageUrl: entry.item.activity.imageUrl,
                durationMinutes: entry.item.activity.durationMinutes,
              }
            : null,
        };
      });

    const dayTotalCost = activities.reduce((sum, a) => sum + (a.estimatedCost || 0), 0);
    const dayTotalDuration = activities.reduce((sum, a) => {
      if (a.activity?.durationMinutes) return sum + a.activity.durationMinutes;
      if (a.startTime && a.endTime) {
        const start = new Date(`1970-01-01T${a.startTime}:00`);
        const end = new Date(`1970-01-01T${a.endTime}:00`);
        return sum + (end.getTime() - start.getTime()) / (1000 * 60);
      }
      return sum;
    }, 0);

    return {
      date: dateKey,
      dayIndex: dateKey === "unscheduled" ? -1 : dayIndex,
      isTripDay,
      stops,
      activities,
      totalEstimatedCost: dayTotalCost,
      totalDurationMinutes: dayTotalDuration > 0 ? Math.round(dayTotalDuration) : null,
    };
  });

  return {
    trip: {
      id: trip.id,
      name: trip.name,
      startDate: formatDate(trip.startDate),
      endDate: formatDate(trip.endDate),
      currency: trip.currency,
    },
    days,
    summary: {
      totalDays: days.filter((d) => d.isTripDay).length,
      totalActivities,
      totalEstimatedCost,
    },
  };
}

export async function getItinerary(userId: string, tripId: string): Promise<ItineraryResponseDto> {
  const trip = await itineraryRepository.findTripItinerary(tripId, userId);
  if (!trip) {
    throw new NotFoundError("Trip not found or access denied");
  }
  return buildItinerary(trip);
}

export async function getCalendar(userId: string, tripId: string): Promise<CalendarResponseDto> {
  const trip = await itineraryRepository.findTripCalendar(tripId, userId);
  if (!trip) {
    throw new NotFoundError("Trip not found or access denied");
  }
  return buildCalendar(trip);
}