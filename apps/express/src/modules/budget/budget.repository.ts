import { Prisma } from "@prisma/client";
import { prisma } from "../../shared/prisma";

export async function findTripFinancialData(tripId: string) {
  return prisma.trip.findFirst({
    where: {
      id: tripId,
      deletedAt: null,
    },
    select: {
      id: true,
      userId: true,
      name: true,
      startDate: true,
      endDate: true,
      currency: true,
      visibility: true,
      budget: {
        select: {
          id: true,
          totalBudget: true,
          transportBudget: true,
          accommodationBudget: true,
          activitiesBudget: true,
          foodBudget: true,
          otherBudget: true,
          currency: true,
        },
      },
      stops: {
        orderBy: { sequence: "asc" },
        select: {
          arrivalDate: true,
          departureDate: true,
          itineraryItems: {
            select: {
              id: true,
              title: true,
              date: true,
              estimatedCost: true,
              currency: true,
            },
          },
        },
      },
      expenses: {
        orderBy: { expenseDate: "asc" },
        select: {
          id: true,
          category: true,
          amount: true,
          expenseDate: true,
          isEstimated: true,
          description: true,
          itineraryItemId: true,
        },
      },
    },
  });
}

export async function findTripOwnership(tripId: string) {
  return prisma.trip.findFirst({
    where: { id: tripId, deletedAt: null },
    select: { id: true, userId: true, visibility: true },
  });
}

export async function updateCategoryBudget(
  tripId: string,
  field: "transportBudget" | "accommodationBudget" | "activitiesBudget" | "foodBudget" | "otherBudget" | "totalBudget",
  value: number | null
) {
  const decimalValue = value !== null ? new Prisma.Decimal(value) : null;

  return prisma.tripBudget.upsert({
    where: { tripId },
    update: {
      [field]: decimalValue,
    },
    create: {
      tripId,
      [field]: decimalValue,
    },
  });
}
