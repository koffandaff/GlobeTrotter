import type { Request, Response } from "express";
import { sendCreated, sendSuccess } from "../../core/http/response";
import * as tripStopsService from "./trip-stops.service";
import type {
  CreateTripStopRequest,
  ReorderTripStopRequest,
  UpdateTripStopRequest,
} from "./trip-stops.types";

async function listStops(req: Request, res: Response): Promise<void> {
  const data = await tripStopsService.listStops(
    req.user!.id,
    req.params.tripId as string,
    req.user?.role
  );
  sendSuccess(res, data, "stops retrieved successfully");
}

async function addStop(req: Request, res: Response): Promise<void> {
  const data = await tripStopsService.addStop(
    req.user!.id,
    req.params.tripId as string,
    req.body as CreateTripStopRequest,
    req.user?.role
  );
  sendCreated(res, data, "stop added successfully");
}

async function updateStop(req: Request, res: Response): Promise<void> {
  const data = await tripStopsService.updateStop(
    req.user!.id,
    req.params.id as string,
    req.body as UpdateTripStopRequest,
    req.user?.role
  );
  sendSuccess(res, data, "stop updated successfully");
}

async function reorderStop(req: Request, res: Response): Promise<void> {
  const data = await tripStopsService.reorderStop(
    req.user!.id,
    req.params.id as string,
    req.body as ReorderTripStopRequest,
    req.user?.role
  );
  sendSuccess(res, data, "stops reordered successfully");
}

async function deleteStop(req: Request, res: Response): Promise<void> {
  await tripStopsService.deleteStop(
    req.user!.id,
    req.params.id as string,
    req.user?.role
  );
  sendSuccess(res, null, "stop deleted successfully");
}

export const tripStopsController = {
  listStops,
  addStop,
  updateStop,
  reorderStop,
  deleteStop,
};
