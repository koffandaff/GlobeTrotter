import * as activitiesRepository from "./activities.repository";
import { NotFoundError } from "../../core/errors/app-error";
import type {
  ActivitySearchQuery,
  ActivitySearchResponseDto,
  ActivitySummaryDto,
  ActivityDetailDto,
} from "./activities.types";

function parsePagination(query: ActivitySearchQuery) {
  const page = Math.max(1, Math.floor(query.page ?? 1));
  const limit = Math.min(50, Math.max(1, Math.floor(query.limit ?? 20)));
  return { page, limit };
}

function toActivitySummaryDto(activity: Awaited<ReturnType<typeof activitiesRepository.findActivitiesByCity>>["activities"][number]): ActivitySummaryDto {
  return {
    id: activity.id,
    name: activity.name,
    description: activity.description,
    category: activity.category,
    estimatedCost: activity.estimatedCost ? Number(activity.estimatedCost) : null,
    currency: activity.currency,
    durationMinutes: activity.durationMinutes,
    imageUrl: activity.imageUrl,
    popularityScore: Number(activity.popularityScore),
    isVerified: activity.isVerified,
    city: activity.city,
  };
}

function toActivityDetailDto(activity: NonNullable<Awaited<ReturnType<typeof activitiesRepository.findActivityById>>>): ActivityDetailDto {
  return {
    id: activity.id,
    name: activity.name,
    description: activity.description,
    category: activity.category,
    estimatedCost: activity.estimatedCost ? Number(activity.estimatedCost) : null,
    currency: activity.currency,
    durationMinutes: activity.durationMinutes,
    imageUrl: activity.imageUrl,
    popularityScore: Number(activity.popularityScore),
    isVerified: activity.isVerified,
    metadata: activity.metadata as Record<string, unknown> | null,
    city: {
      id: activity.city.id,
      name: activity.city.name,
      country: activity.city.country,
      countryCode: activity.city.countryCode,
      region: activity.city.region,
      latitude: activity.city.latitude ? Number(activity.city.latitude) : null,
      longitude: activity.city.longitude ? Number(activity.city.longitude) : null,
      costIndex: activity.city.costIndex ? Number(activity.city.costIndex) : null,
    },
    createdByUser: activity.createdByUser
      ? { id: activity.createdByUser.id, displayName: activity.createdByUser.displayName, avatarUrl: activity.createdByUser.avatarUrl }
      : null,
  };
}

export async function searchActivities(query: ActivitySearchQuery): Promise<ActivitySearchResponseDto> {
  const { page, limit } = parsePagination(query);
  const { activities, totalItems } = await activitiesRepository.findActivitiesByCity(
    query.cityId,
    { category: query.category, maxCost: query.maxCost, maxDuration: query.maxDuration },
    { page, limit }
  );

  return {
    activities: activities.map(toActivitySummaryDto),
    pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) },
  };
}

export async function getActivityDetail(activityId: string): Promise<ActivityDetailDto> {
  const activity = await activitiesRepository.findActivityById(activityId);
  if (!activity) {
    throw new NotFoundError("activity not found");
  }

  await activitiesRepository.incrementViewCount(activityId);

  return toActivityDetailDto(activity);
}