import { prisma } from "../../shared/prisma";
import type { CommunityTripsQuery, PaginationQuery } from "./community.types";

export async function getCommunityTrips(query: CommunityTripsQuery) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;

  const whereClause = {
    visibility: "PUBLIC" as const,
    deletedAt: null,
  };

  const orderBy = query.sort === "popular" 
    ? { likes: { _count: "desc" as const } } 
    : { createdAt: "desc" as const };

  const trips = await prisma.trip.findMany({
    where: whereClause,
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      name: true,
      description: true,
      coverImageUrl: true,
      startDate: true,
      endDate: true,
      status: true,
      currency: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        }
      },
      stops: {
        orderBy: { sequence: "asc" },
        take: 3,
        select: {
          city: { select: { name: true, country: true } }
        }
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        }
      }
    }
  });

  const total = await prisma.trip.count({ where: whereClause });

  return { trips, totalItems: total };
}

export async function getPublicTripById(tripId: string) {
  return prisma.trip.findFirst({
    where: {
      id: tripId,
      visibility: "PUBLIC",
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      description: true,
      coverImageUrl: true,
      startDate: true,
      endDate: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        }
      },
      stops: {
        orderBy: { sequence: "asc" },
        select: {
          id: true,
          city: {
            select: { id: true, name: true, country: true, imageUrl: true }
          }
        }
      },
      _count: {
        select: { likes: true, comments: true }
      }
    }
  });
}

export async function getTripComments(tripId: string, query: PaginationQuery) {
  const [comments, total] = await Promise.all([
    prisma.tripComment.findMany({
      where: { tripId },
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: { id: true, username: true, displayName: true, avatarUrl: true }
        }
      }
    }),
    prisma.tripComment.count({ where: { tripId } })
  ]);
  
  return { comments, totalItems: total };
}

export async function addTripComment(tripId: string, userId: string, content: string) {
  return prisma.tripComment.create({
    data: { tripId, userId, content },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: {
        select: { id: true, username: true, displayName: true, avatarUrl: true }
      }
    }
  });
}

export async function getCommentOwnership(commentId: string) {
  return prisma.tripComment.findUnique({
    where: { id: commentId },
    select: { id: true, userId: true }
  });
}

export async function deleteTripComment(commentId: string) {
  await prisma.tripComment.delete({ where: { id: commentId } });
}

export async function toggleTripLike(tripId: string, userId: string, liked: boolean) {
  if (liked) {
    await prisma.tripLike.upsert({
      where: { tripId_userId: { tripId, userId } },
      create: { tripId, userId },
      update: {}
    });
  } else {
    await prisma.tripLike.deleteMany({
      where: { tripId, userId }
    });
  }
}

export async function getPublicProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId, status: "ACTIVE" },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
      createdAt: true,
      _count: {
        select: {
          followers: true,
          following: true,
          trips: { where: { visibility: "PUBLIC", deletedAt: null } }
        }
      }
    }
  });
}

export async function toggleFollowUser(followerId: string, followingId: string, follow: boolean) {
  if (follow) {
    await prisma.userFollow.upsert({
      where: { followerId_followingId: { followerId, followingId } },
      create: { followerId, followingId },
      update: {}
    });
  } else {
    await prisma.userFollow.deleteMany({
      where: { followerId, followingId }
    });
  }
}

export async function getPersonalizedFeed(userId: string, query: PaginationQuery) {
  const followedUsers = await prisma.userFollow.findMany({
    where: { followerId: userId },
    select: { followingId: true }
  });

  const followingIds = followedUsers.map(f => f.followingId);

  const whereClause = {
    userId: { in: followingIds },
    visibility: "PUBLIC" as const,
    deletedAt: null,
  };

  const [trips, total] = await Promise.all([
    prisma.trip.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      select: {
        id: true,
        name: true,
        description: true,
        coverImageUrl: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          }
        }
      }
    }),
    prisma.trip.count({ where: whereClause })
  ]);

  return { trips, totalItems: total };
}
