import { EventType } from "@prisma/client";
import {
  AuthorizationError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../core/errors/app-error";
import { logUserEvent } from "../../shared/utils/events";
import * as tripStopsRepository from "./trip-stops.repository";
import type {
  CreateTripStopRequest,
  ReorderTripStopRequest,
  TripStopDto,
  UpdateTripStopRequest,
} from "./trip-stops.types";

function validateDates(arrivalDateStr?: string | null, departureDateStr?: string | null) {
  if (arrivalDateStr && departureDateStr) {
    const arrival = new Date(arrivalDateStr);
    const departure = new Date(departureDateStr);
    if (arrival > departure) {
      throw new ValidationError("arrivalDate must be before or equal to departureDate");
    }
  }
}

export async function listStops(
  userId: string,
  tripId: string,
  userRole?: string
): Promise<TripStopDto[]> {
  const trip = await tripStopsRepository.findTripOwnership(tripId);
  if (!trip) {
    throw new NotFoundError("trip not found");
  }

  const isOwner = trip.userId === userId;
  const isPublic = trip.visibility === "PUBLIC" || trip.visibility === "SHARED";
  const isAdmin = userRole === "ADMIN";

  if (!isOwner && !isPublic && !isAdmin) {
    throw new AuthorizationError("you do not have permission to view stops for this trip");
  }

  return tripStopsRepository.findStopsByTripId(tripId);
}

export async function addStop(
  userId: string,
  tripId: string,
  input: CreateTripStopRequest,
  userRole?: string
): Promise<TripStopDto> {
  const trip = await tripStopsRepository.findTripOwnership(tripId);
  if (!trip) {
    throw new NotFoundError("trip not found");
  }

  if (trip.userId !== userId && userRole !== "ADMIN") {
    throw new AuthorizationError("you do not have permission to add stops to this trip");
  }

  validateDates(input.arrivalDate, input.departureDate);

  const cityExists = await tripStopsRepository.findCityExists(input.cityId);
  if (!cityExists) {
    throw new NotFoundError("city not found");
  }

  const alreadyAdded = await tripStopsRepository.findStopByTripAndCity(tripId, input.cityId);
  if (alreadyAdded) {
    throw new ConflictError("this city is already added to this trip");
  }

  const maxSeq = await tripStopsRepository.getMaxSequence(tripId);
  const assignedSequence = input.sequence ?? maxSeq + 1;

  const stop = await tripStopsRepository.createStop(tripId, input, assignedSequence);

  logUserEvent({
    userId,
    eventType: EventType.ITINERARY_UPDATED,
    entityType: "trip_stop",
    entityId: stop.id,
    metadata: { tripId, cityId: input.cityId, sequence: stop.sequence },
  });

  return stop;
}

export async function updateStop(
  userId: string,
  stopId: string,
  input: UpdateTripStopRequest,
  userRole?: string
): Promise<TripStopDto> {
  const existing = await tripStopsRepository.findStopOwnership(stopId);
  if (!existing) {
    throw new NotFoundError("stop not found");
  }

  if (existing.userId !== userId && userRole !== "ADMIN") {
    throw new AuthorizationError("you do not have permission to update this stop");
  }

  const current = await tripStopsRepository.findStopById(stopId);
  const effectiveArrival =
    input.arrivalDate !== undefined ? input.arrivalDate : current?.arrivalDate?.toISOString();
  const effectiveDeparture =
    input.departureDate !== undefined ? input.departureDate : current?.departureDate?.toISOString();
  validateDates(effectiveArrival, effectiveDeparture);

  const updated = await tripStopsRepository.updateStop(stopId, input);

  logUserEvent({
    userId,
    eventType: EventType.ITINERARY_UPDATED,
    entityType: "trip_stop",
    entityId: stopId,
    metadata: { tripId: existing.tripId },
  });

  return updated;
}

export async function reorderStop(
  userId: string,
  stopId: string,
  input: ReorderTripStopRequest,
  userRole?: string
): Promise<TripStopDto[]> {
  const existing = await tripStopsRepository.findStopOwnership(stopId);
  if (!existing) {
    throw new NotFoundError("stop not found");
  }

  if (existing.userId !== userId && userRole !== "ADMIN") {
    throw new AuthorizationError("you do not have permission to reorder this stop");
  }

  const reordered = await tripStopsRepository.reorderStop(
    existing.tripId,
    stopId,
    input.newSequence
  );

  logUserEvent({
    userId,
    eventType: EventType.ITINERARY_UPDATED,
    entityType: "trip_stop",
    entityId: stopId,
    metadata: { tripId: existing.tripId, newSequence: input.newSequence },
  });

  return reordered;
}

export async function deleteStop(
  userId: string,
  stopId: string,
  userRole?: string
): Promise<void> {
  const existing = await tripStopsRepository.findStopOwnership(stopId);
  if (!existing) {
    throw new NotFoundError("stop not found");
  }

  if (existing.userId !== userId && userRole !== "ADMIN") {
    throw new AuthorizationError("you do not have permission to delete this stop");
  }

  await tripStopsRepository.deleteStopAndCompact(existing.tripId, stopId);

  logUserEvent({
    userId,
    eventType: EventType.ITINERARY_UPDATED,
    entityType: "trip_stop",
    entityId: stopId,
    metadata: { tripId: existing.tripId },
  });
}
