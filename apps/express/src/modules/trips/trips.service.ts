import { EventType } from "@prisma/client";
import { AuthorizationError, NotFoundError, ValidationError } from "../../core/errors/app-error";
import { logUserEvent } from "../../shared/utils/events";
import * as tripsRepository from "./trips.repository";
import type {
  CreateTripRequest,
  ListTripsQuery,
  TripDetailDto,
  TripSummaryDto,
  UpdateTripRequest,
} from "./trips.types";

function parsePagination(query: ListTripsQuery) {
  const page = Math.max(1, Math.floor(query.page || 1));
  const limit = Math.min(100, Math.max(1, Math.floor(query.limit || 20)));
  return { page, limit };
}

function validateDates(startDateStr?: string | null, endDateStr?: string | null) {
  if (startDateStr && endDateStr) {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    if (start > end) {
      throw new ValidationError("startDate must be before or equal to endDate");
    }
  }
}

export async function listTrips(
  userId: string,
  query: ListTripsQuery
): Promise<{ trips: TripSummaryDto[]; totalItems: number; totalPages: number }> {
  const { page, limit } = parsePagination(query);
  const { trips, totalItems } = await tripsRepository.listUserTrips(userId, {
    ...query,
    page,
    limit,
  });

  return {
    trips,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
  };
}

export async function getTrip(
  userId: string,
  tripId: string,
  userRole?: string
): Promise<TripDetailDto> {
  const trip = await tripsRepository.findTripById(tripId);
  if (!trip) {
    throw new NotFoundError("trip not found");
  }

  const isOwner = trip.userId === userId;
  const isPublic = trip.visibility === "PUBLIC" || trip.visibility === "SHARED";
  const isAdmin = userRole === "ADMIN";

  if (!isOwner && !isPublic && !isAdmin) {
    throw new AuthorizationError("you do not have permission to view this trip");
  }

  return trip;
}

export async function createTrip(
  userId: string,
  input: CreateTripRequest
): Promise<TripDetailDto> {
  validateDates(input.startDate, input.endDate);

  const trip = await tripsRepository.createTrip(userId, input);

  logUserEvent({
    userId,
    eventType: EventType.TRIP_CREATED,
    entityType: "trip",
    entityId: trip.id,
    metadata: { name: trip.name, currency: trip.currency },
  });

  return trip;
}

export async function updateTrip(
  userId: string,
  tripId: string,
  input: UpdateTripRequest,
  userRole?: string
): Promise<TripDetailDto> {
  const existing = await tripsRepository.findTripById(tripId);
  if (!existing) {
    throw new NotFoundError("trip not found");
  }

  if (existing.userId !== userId && userRole !== "ADMIN") {
    throw new AuthorizationError("you do not have permission to update this trip");
  }

  const effectiveStart = input.startDate !== undefined ? input.startDate : existing.startDate?.toISOString();
  const effectiveEnd = input.endDate !== undefined ? input.endDate : existing.endDate?.toISOString();
  validateDates(effectiveStart, effectiveEnd);

  const updated = await tripsRepository.updateTrip(tripId, input);

  logUserEvent({
    userId,
    eventType: EventType.TRIP_UPDATED,
    entityType: "trip",
    entityId: tripId,
  });

  return updated;
}

export async function deleteTrip(
  userId: string,
  tripId: string,
  userRole?: string
): Promise<void> {
  const existing = await tripsRepository.findTripOwnership(tripId);
  if (!existing) {
    throw new NotFoundError("trip not found");
  }

  if (existing.userId !== userId && userRole !== "ADMIN") {
    throw new AuthorizationError("you do not have permission to delete this trip");
  }

  await tripsRepository.deleteTrip(tripId);
}

export async function duplicateTrip(
  userId: string,
  sourceTripId: string
): Promise<TripDetailDto> {
  const source = await tripsRepository.findTripOwnership(sourceTripId);
  if (!source) {
    throw new NotFoundError("source trip not found");
  }

  const isOwner = source.userId === userId;
  const isPublic = source.visibility === "PUBLIC" || source.visibility === "SHARED";

  if (!isOwner && !isPublic) {
    throw new AuthorizationError("you do not have permission to copy this trip");
  }

  const duplicated = await tripsRepository.duplicateTrip(sourceTripId, userId);

  logUserEvent({
    userId,
    eventType: EventType.TRIP_CREATED,
    entityType: "trip",
    entityId: duplicated.id,
    metadata: { sourceTripId, name: duplicated.name },
  });

  return duplicated;
}
