import { randomBytes } from "crypto";
import { NotFoundError, AuthorizationError } from "../../core/errors/app-error";
import * as tripsRepository from "../trips/trips.repository";
import * as tripsService from "../trips/trips.service";
import * as sharingRepository from "./sharing.repository";
import type { CreateShareDto } from "./sharing.types";

function generateSlug(): string {
  return randomBytes(8).toString("hex");
}

export async function createShare(userId: string, tripId: string, data: CreateShareDto) {
  const ownership = await tripsRepository.findTripOwnership(tripId);
  if (!ownership) {
    throw new NotFoundError("Trip not found");
  }
  if (ownership.userId !== userId) {
    throw new AuthorizationError("You don't own this trip");
  }

  const token = generateSlug();
  const share = await sharingRepository.upsertTripShare(tripId, userId, token, data);

  return { shareToken: share.shareToken, expiresAt: share.expiresAt };
}

export async function revokeShare(userId: string, tripId: string) {
  const ownership = await tripsRepository.findTripOwnership(tripId);
  if (!ownership) {
    throw new NotFoundError("Trip not found");
  }
  if (ownership.userId !== userId) {
    throw new AuthorizationError("You don't own this trip");
  }

  await sharingRepository.deleteTripShare(tripId, userId);
}

export async function getSharedTrip(shareSlug: string) {
  const share = await sharingRepository.getTripShareByToken(shareSlug);
  if (!share) {
    throw new NotFoundError("Shared trip not found or link is invalid");
  }

  if (share.expiresAt && share.expiresAt < new Date()) {
    throw new AuthorizationError("This share link has expired");
  }

  const trip = await tripsRepository.findTripById(share.tripId);
  if (!trip) {
    throw new NotFoundError("Trip not found");
  }

  return trip;
}

export async function copySharedTrip(userId: string, shareSlug: string) {
  const share = await sharingRepository.getTripShareByToken(shareSlug);
  if (!share) {
    throw new NotFoundError("Shared trip not found or link is invalid");
  }

  if (share.expiresAt && share.expiresAt < new Date()) {
    throw new AuthorizationError("This share link has expired");
  }

  // Use the trips service to perform the deep copy
  const newTrip = await tripsService.duplicateTrip(userId, share.tripId);
  return newTrip;
}
