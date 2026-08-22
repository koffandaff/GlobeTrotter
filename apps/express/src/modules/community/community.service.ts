import { NotFoundError, AuthorizationError, ConflictError } from "../../core/errors/app-error";
import * as communityRepository from "./community.repository";
import type { CommunityTripsQuery, AddCommentDto, PaginationQuery } from "./community.types";

export async function getCommunityTrips(query: CommunityTripsQuery) {
  return communityRepository.getCommunityTrips(query);
}

export async function getPublicTripById(tripId: string) {
  const trip = await communityRepository.getPublicTripById(tripId);
  if (!trip) {
    throw new NotFoundError("Public trip not found");
  }
  return trip;
}

export async function getTripComments(tripId: string, query: PaginationQuery) {
  return communityRepository.getTripComments(tripId, query);
}

export async function addComment(tripId: string, userId: string, data: AddCommentDto) {
  const trip = await communityRepository.getPublicTripById(tripId);
  if (!trip) {
    throw new NotFoundError("Public trip not found");
  }
  return communityRepository.addTripComment(tripId, userId, data.content);
}

export async function deleteComment(commentId: string, userId: string, userRole: string) {
  const ownership = await communityRepository.getCommentOwnership(commentId);
  if (!ownership) {
    throw new NotFoundError("Comment not found");
  }
  
  if (ownership.userId !== userId && userRole !== "ADMIN") {
    throw new AuthorizationError("Not authorized to delete this comment");
  }

  await communityRepository.deleteTripComment(commentId);
}

export async function likeTrip(tripId: string, userId: string) {
  const trip = await communityRepository.getPublicTripById(tripId);
  if (!trip) {
    throw new NotFoundError("Public trip not found");
  }
  await communityRepository.toggleTripLike(tripId, userId, true);
}

export async function unlikeTrip(tripId: string, userId: string) {
  await communityRepository.toggleTripLike(tripId, userId, false);
}

export async function getPublicProfile(targetUserId: string) {
  const profile = await communityRepository.getPublicProfile(targetUserId);
  if (!profile) {
    throw new NotFoundError("User not found");
  }
  return profile;
}

export async function followUser(followerId: string, followingId: string) {
  if (followerId === followingId) {
    throw new ConflictError("You cannot follow yourself");
  }
  const target = await communityRepository.getPublicProfile(followingId);
  if (!target) {
    throw new NotFoundError("User not found");
  }
  await communityRepository.toggleFollowUser(followerId, followingId, true);
}

export async function unfollowUser(followerId: string, followingId: string) {
  await communityRepository.toggleFollowUser(followerId, followingId, false);
}

export async function getPersonalizedFeed(userId: string, query: PaginationQuery) {
  return communityRepository.getPersonalizedFeed(userId, query);
}
