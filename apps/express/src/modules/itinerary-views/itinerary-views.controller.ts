import type { Request, Response } from "express";
import { ok } from "../../core/http/response";
import * as itineraryService from "./itinerary-views.service";

async function getItinerary(req: Request, res: Response): Promise<void> {
  const tripId = req.params.id as string;
  const data = await itineraryService.getItinerary(req.user!.id, tripId);
  ok(res, data);
}

async function getCalendar(req: Request, res: Response): Promise<void> {
  const tripId = req.params.id as string;
  const data = await itineraryService.getCalendar(req.user!.id, tripId);
  ok(res, data);
}

export const itineraryViewsController = {
  getItinerary,
  getCalendar,
};