import type { Request, Response } from "express";
import { ok } from "../../core/http/response";
import * as dashboardService from "./dashboard.service";

async function getDashboard(req: Request, res: Response): Promise<void> {
  const data = await dashboardService.getDashboard(req.user!.id);
  ok(res, data);
}

export const dashboardController = {
  getDashboard,
};