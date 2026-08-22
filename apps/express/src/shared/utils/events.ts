import type { EventType, Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import { logger } from "../../core/logger/logger";

export interface LogUserEventParams {
  userId: string;
  eventType: EventType;
  entityType?: string;
  entityId?: string;
  metadata?: Prisma.InputJsonValue;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export function logUserEvent(params: LogUserEventParams): void {
  prisma.userEvent
    .create({
      data: {
        userId: params.userId,
        eventType: params.eventType,
        entityType: params.entityType,
        entityId: params.entityId,
        metadata: params.metadata ?? undefined,
        sessionId: params.sessionId,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    })
    .catch((error: unknown) => {
      logger.warn("failed to record user event", {
        eventType: params.eventType,
        error: error instanceof Error ? error.message : String(error),
      });
    });
}
