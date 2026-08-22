import { Router } from "express";
import { authenticate } from "../../core/auth/guards";
import { validateParams } from "../../core/middleware/validate";
import { itineraryViewsController } from "./itinerary-views.controller";
import { tripIdParamSchema } from "./itinerary-views.schema";

const router = Router();

router.get(
  "/trips/:id/itinerary",
  authenticate,
  validateParams(tripIdParamSchema),
  itineraryViewsController.getItinerary
);

router.get(
  "/trips/:id/calendar",
  authenticate,
  validateParams(tripIdParamSchema),
  itineraryViewsController.getCalendar
);

export default router;