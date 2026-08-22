import type { Request, Response } from "express";
import { ok, sendCreated, sendPaginated, sendSuccess } from "../../core/http/response";
import * as tripsService from "./trips.service";
import type {
  CreateTripRequest,
  ListTripsQuery,
  UpdateTripRequest,
} from "./trips.types";

async function listTrips(req: Request, res: Response): Promise<void> {
  const query = req.query as unknown as ListTripsQuery;
  const { trips, totalItems, totalPages } = await tripsService.listTrips(
    req.user!.id,
    query
  );

  sendPaginated(
    res,
    trips,
    {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      totalItems,
      totalPages: Math.max(1, totalPages),
    },
    "trips retrieved successfully"
  );
}

async function createTrip(req: Request, res: Response): Promise<void> {
  const data = await tripsService.createTrip(
    req.user!.id,
    req.body as CreateTripRequest
  );
  sendCreated(res, data, "trip created successfully");
}

async function getTrip(req: Request, res: Response): Promise<void> {
  const data = await tripsService.getTrip(
    req.user!.id,
    req.params.id as string,
    req.user?.role
  );
  ok(res, data);
}

async function updateTrip(req: Request, res: Response): Promise<void> {
  const data = await tripsService.updateTrip(
    req.user!.id,
    req.params.id as string,
    req.body as UpdateTripRequest,
    req.user?.role
  );
  sendSuccess(res, data, "trip updated successfully");
}

async function deleteTrip(req: Request, res: Response): Promise<void> {
  await tripsService.deleteTrip(
    req.user!.id,
    req.params.id as string,
    req.user?.role
  );
  sendSuccess(res, null, "trip deleted successfully");
}

async function duplicateTrip(req: Request, res: Response): Promise<void> {
  const data = await tripsService.duplicateTrip(
    req.user!.id,
    req.params.id as string
  );
  sendCreated(res, data, "trip duplicated successfully");
}

export const tripsController = {
  listTrips,
  createTrip,
  getTrip,
  updateTrip,
  deleteTrip,
  duplicateTrip,
};
