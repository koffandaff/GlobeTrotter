import { NotFoundError } from "../../core/errors/app-error";
import * as adminRepository from "./admin.repository";
import type { LogsQuery, UsersQuery, UpdateUserDto } from "./admin.types";
import { format } from "fast-csv";
import { PassThrough } from "stream";

export async function getOverviewStats() {
  return adminRepository.getOverviewStats();
}

export async function getTopCities() {
  return adminRepository.getTopCities();
}

export async function getTopActivities() {
  return adminRepository.getTopActivities();
}

export async function getUsersList(query: UsersQuery) {
  return adminRepository.getUsersList(query);
}

export async function updateUserStatus(userId: string, data: UpdateUserDto) {
  try {
    return await adminRepository.updateUserStatus(userId, data);
  } catch {
    throw new NotFoundError("User not found");
  }
}

export async function getLogsList(query: LogsQuery) {
  return adminRepository.getLogsList(query);
}

export async function getLogById(logId: string) {
  const log = await adminRepository.getLogById(logId);
  if (!log) {
    throw new NotFoundError("Log not found");
  }
  return log;
}

export async function exportLogsCsv(query: LogsQuery): Promise<PassThrough> {
  // Query all matching logs without pagination limit
  const fullQuery = { ...query, page: 1, limit: 100000 };
  const { logs } = await adminRepository.getLogsList(fullQuery);

  const csvStream = format({ headers: true });
  const passthrough = new PassThrough();
  
  csvStream.pipe(passthrough);

  for (const log of logs) {
    csvStream.write({
      id: log.id,
      createdAt: log.createdAt.toISOString(),
      action: log.action,
      entityType: log.entityType || "",
      entityId: log.entityId || "",
      userEmail: log.user?.email || "System",
      ipAddress: log.ipAddress || "",
    });
  }

  csvStream.end();
  return passthrough;
}
