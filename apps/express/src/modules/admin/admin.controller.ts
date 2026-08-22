import { Request, Response } from "express";
import { ok } from "../../core/http/response";
import * as adminService from "./admin.service";
import type { LogsQuery, UsersQuery, UpdateUserDto } from "./admin.types";

async function getOverviewStats(req: Request, res: Response) {
  const data = await adminService.getOverviewStats();
  ok(res, data);
}

async function getTopCities(req: Request, res: Response) {
  const data = await adminService.getTopCities();
  ok(res, data);
}

async function getTopActivities(req: Request, res: Response) {
  const data = await adminService.getTopActivities();
  ok(res, data);
}

async function getUsersList(req: Request, res: Response) {
  const query = req.query as unknown as UsersQuery;
  const data = await adminService.getUsersList(query);
  ok(res, data);
}

async function updateUserStatus(req: Request, res: Response) {
  const data = await adminService.updateUserStatus(
    req.params.id as string,
    req.body as UpdateUserDto
  );
  ok(res, data);
}

async function getLogsList(req: Request, res: Response) {
  const query = req.query as unknown as LogsQuery;
  const data = await adminService.getLogsList(query);
  ok(res, data);
}

async function getLogById(req: Request, res: Response) {
  const data = await adminService.getLogById(req.params.id as string);
  ok(res, data);
}

async function exportLogsCsv(req: Request, res: Response) {
  const query = req.query as unknown as LogsQuery;
  const csvStream = await adminService.exportLogsCsv(query);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="system_logs.csv"');
  
  csvStream.pipe(res);
}

export const adminController = {
  getOverviewStats,
  getTopCities,
  getTopActivities,
  getUsersList,
  updateUserStatus,
  getLogsList,
  getLogById,
  exportLogsCsv,
};
