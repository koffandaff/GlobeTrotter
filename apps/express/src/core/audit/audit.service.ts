import { prisma } from "../db/prisma";

export interface AuditLogEntry {
  userId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  oldData?: any;
  newData?: any;
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(entry: AuditLogEntry) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        oldData: entry.oldData ? JSON.parse(JSON.stringify(entry.oldData)) : undefined,
        newData: entry.newData ? JSON.parse(JSON.stringify(entry.newData)) : undefined,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
      },
    });
  } catch (error) {
    console.error("Failed to create audit log", error);
  }
}
