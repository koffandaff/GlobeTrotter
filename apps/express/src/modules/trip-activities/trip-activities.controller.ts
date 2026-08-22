import type { Request, Response } from "express";
import { ok, sendCreated, sendPaginated } from "../../core/http/response";
import * as tripActivitiesService from "./trip-activities.service";
import type { CreateItineraryItemRequest, UpdateItineraryItemRequest, ReorderItineraryItemRequest } from "./trip-activities.types";

async function listStopActivities(req: Request, res: Response): Promise<void> {
  const stopId = req.params.stopId as string;
  const page = req.query.page ? Number(req.query.page) : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const result = await tripActivitiesService.listStopActivities(req.user!.id, stopId, page, limit);
  sendPaginated(res, result.items, result.pagination);
}

async function addActivityToStop(req: Request, res: Response): Promise<void> {
  const stopId = req.params.stopId as string;
  const data = req.body as CreateItineraryItemRequest;
  const result = await tripActivitiesService.addActivityToStop(req.user!.id, stopId, data);
  sendCreated(res, result);
}

async function updateItineraryItem(req: Request, res: Response): Promise<void> {
  const itemId = req.params.id as string;
  const data = req.body as UpdateItineraryItemRequest;
  const result = await tripActivitiesService.updateItineraryItem(req.user!.id, itemId, data);
  ok(res, result);
}

async function reorderItineraryItem(req: Request, res: Response): Promise<void> {
  const itemId = req.params.id as string;
  const data = req.body as ReorderItineraryItemRequest;
  await tripActivitiesService.reorderItineraryItem(req.user!.id, itemId, data);
  ok(res, null);
}

async function removeActivityFromTrip(req: Request, res: Response): Promise<void> {
  const itemId = req.params.id as string;
  await tripActivitiesService.removeActivityFromTrip(req.user!.id, itemId);
  ok(res, null);
}

export const tripActivitiesController = {
  listStopActivities,
  addActivityToStop,
  updateItineraryItem,
  reorderItineraryItem,
  removeActivityFromTrip,
};