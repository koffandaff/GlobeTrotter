import * as tripActivitiesRepository from "./trip-activities.repository";
import { NotFoundError, AuthorizationError, ValidationError } from "../../core/errors/app-error";
import { Prisma } from "@prisma/client";
import type {
  ItineraryItemResponseDto,
  CreateItineraryItemRequest,
  UpdateItineraryItemRequest,
  ReorderItineraryItemRequest,
  ItineraryItemListResponseDto,
} from "./trip-activities.types";

function parsePagination(page?: number, limit?: number) {
  const p = Math.max(1, Math.floor(page ?? 1));
  const l = Math.min(50, Math.max(1, Math.floor(limit ?? 20)));
  return { page: p, limit: l };
}

function toItineraryItemDto(item: Awaited<ReturnType<typeof tripActivitiesRepository.findItineraryItemsByStop>>["items"][number]): ItineraryItemResponseDto {
  return {
    id: item.id,
    tripStopId: item.tripStopId,
    activityId: item.activityId,
    title: item.title,
    date: item.date?.toISOString().split("T")[0] ?? null,
    startTime: item.startTime?.toISOString().split("T")[1]?.slice(0, 5) ?? null,
    endTime: item.endTime?.toISOString().split("T")[1]?.slice(0, 5) ?? null,
    sequence: item.sequence,
    notes: item.notes,
    estimatedCost: item.estimatedCost ? Number(item.estimatedCost) : null,
    currency: item.currency,
    status: item.status,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    activity: item.activity
      ? {
          id: item.activity.id,
          name: item.activity.name,
          category: item.activity.category,
          imageUrl: item.activity.imageUrl,
          durationMinutes: item.activity.durationMinutes,
        }
      : null,
  };
}

async function verifyStopAccess(stopId: string, userId: string): Promise<void> {
  const stop = await tripActivitiesRepository.findTripStopById(stopId);
  if (!stop) {
    throw new NotFoundError("trip stop not found");
  }
  const ownsTrip = await tripActivitiesRepository.verifyTripOwnership(stop.tripId, userId);
  if (!ownsTrip) {
    throw new AuthorizationError("you don't have access to this trip");
  }
}

async function verifyItemAccess(itemId: string, userId: string): Promise<void> {
  const item = await tripActivitiesRepository.findItineraryItemById(itemId);
  if (!item) {
    throw new NotFoundError("itinerary item not found");
  }
  const stop = await tripActivitiesRepository.findTripStopById(item.tripStopId);
  if (!stop) {
    throw new NotFoundError("trip stop not found");
  }
  const ownsTrip = await tripActivitiesRepository.verifyTripOwnership(stop.tripId, userId);
  if (!ownsTrip) {
    throw new AuthorizationError("you don't have access to this trip");
  }
}

export async function listStopActivities(
  userId: string,
  stopId: string,
  page?: number,
  limit?: number
): Promise<ItineraryItemListResponseDto> {
  await verifyStopAccess(stopId, userId);

  const { page: p, limit: l } = parsePagination(page, limit);
  const { items, totalItems } = await tripActivitiesRepository.findItineraryItemsByStop(stopId, { page: p, limit: l });

  return {
    items: items.map(toItineraryItemDto),
    pagination: { page: p, limit: l, totalItems, totalPages: Math.ceil(totalItems / l) },
  };
}

export async function addActivityToStop(
  userId: string,
  stopId: string,
  input: CreateItineraryItemRequest
): Promise<ItineraryItemResponseDto> {
  await verifyStopAccess(stopId, userId);

  if (input.activityId) {
    const activity = await tripActivitiesRepository.findActivityById(input.activityId);
    if (!activity) {
      throw new ValidationError("activity not found");
    }
  }

  const item = await tripActivitiesRepository.createItineraryItem({
    tripStopId: stopId,
    activityId: input.activityId,
    title: input.title,
    date: input.date ? new Date(input.date) : null,
    startTime: input.startTime ? new Date(`1970-01-01T${input.startTime}:00`) : null,
    endTime: input.endTime ? new Date(`1970-01-01T${input.endTime}:00`) : null,
    sequence: input.sequence,
    notes: input.notes,
    estimatedCost: input.estimatedCost ? new Prisma.Decimal(input.estimatedCost.toString()) : null,
    currency: input.currency ?? "USD",
  });

  return toItineraryItemDto(item);
}

export async function updateItineraryItem(
  userId: string,
  itemId: string,
  input: UpdateItineraryItemRequest
): Promise<ItineraryItemResponseDto> {
  await verifyItemAccess(itemId, userId);

  const item = await tripActivitiesRepository.updateItineraryItem(itemId, {
    title: input.title,
    date: input.date ? new Date(input.date) : input.date === null ? null : undefined,
    startTime: input.startTime ? new Date(`1970-01-01T${input.startTime}:00`) : input.startTime === null ? null : undefined,
    endTime: input.endTime ? new Date(`1970-01-01T${input.endTime}:00`) : input.endTime === null ? null : undefined,
    sequence: input.sequence,
    notes: input.notes,
    estimatedCost: input.estimatedCost ? new Prisma.Decimal(input.estimatedCost.toString()) : undefined,
    status: input.status,
  });

  if (!item) {
    throw new NotFoundError("itinerary item not found");
  }

  return toItineraryItemDto(item);
}

export async function reorderItineraryItem(
  userId: string,
  itemId: string,
  input: ReorderItineraryItemRequest
): Promise<void> {
  await verifyItemAccess(itemId, userId);

  const item = await tripActivitiesRepository.findItineraryItemById(itemId);
  if (!item) {
    throw new NotFoundError("itinerary item not found");
  }

  const items = await tripActivitiesRepository.findItineraryItemsByStop(item.tripStopId, { page: 1, limit: 100 });
  
  const updatedItems = items.items.map((i) => {
    if (i.id === itemId) {
      return { id: i.id, sequence: input.sequence, date: input.date ? new Date(input.date) : i.date };
    }
    return { id: i.id, sequence: i.sequence, date: i.date };
  });

  updatedItems.sort((a, b) => a.sequence - b.sequence);

  await tripActivitiesRepository.reorderItineraryItems(item.tripStopId, updatedItems);
}

export async function removeActivityFromTrip(userId: string, itemId: string): Promise<void> {
  await verifyItemAccess(itemId, userId);
  await tripActivitiesRepository.deleteItineraryItem(itemId);
}