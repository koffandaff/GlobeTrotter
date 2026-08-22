import { prisma } from "../../shared/prisma";
import { SharePermission, TripVisibility } from "@prisma/client";

export async function upsertTripShare(
  tripId: string,
  userId: string,
  token: string,
  data: { expiresAt?: string; sharedWithUserId?: string; permission?: SharePermission }
) {
  return prisma.$transaction(async (tx) => {
    // Find existing
    const existing = await tx.tripShare.findFirst({
      where: { tripId, createdByUserId: userId }
    });

    let share;
    if (existing) {
      share = await tx.tripShare.update({
        where: { id: existing.id },
        data: {
          shareToken: token,
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
          sharedWithUserId: data.sharedWithUserId || null,
          permission: data.permission || SharePermission.VIEW,
        }
      });
    } else {
      share = await tx.tripShare.create({
        data: {
          tripId,
          createdByUserId: userId,
          shareToken: token,
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
          sharedWithUserId: data.sharedWithUserId || null,
          permission: data.permission || SharePermission.VIEW,
        }
      });
    }

    // Update trip visibility
    await tx.trip.update({
      where: { id: tripId },
      data: { visibility: TripVisibility.SHARED },
    });

    return share;
  });
}

export async function deleteTripShare(tripId: string, userId: string) {
  return prisma.$transaction(async (tx) => {
    await tx.tripShare.deleteMany({
      where: { tripId, createdByUserId: userId },
    });

    await tx.trip.update({
      where: { id: tripId },
      data: { visibility: TripVisibility.PRIVATE },
    });
  });
}

export async function getTripShareByToken(token: string) {
  return prisma.tripShare.findUnique({
    where: { shareToken: token },
  });
}
