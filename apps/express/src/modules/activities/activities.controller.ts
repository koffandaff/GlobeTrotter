import type { Request, Response } from "express";
import { ok, sendPaginated } from "../../core/http/response";
import * as activitiesService from "./activities.service";
import type { ActivitySearchQuery } from "./activities.types";

async function searchActivities(req: Request, res: Response): Promise<void> {
  const query = req.query as unknown as ActivitySearchQuery;
  const result = await activitiesService.searchActivities(query);
  sendPaginated(res, result.activities, result.pagination);
}

async function getActivityDetail(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string;
  const data = await activitiesService.getActivityDetail(id);
  ok(res, data);
}

export const activitiesController = {
  searchActivities,
  getActivityDetail,
};