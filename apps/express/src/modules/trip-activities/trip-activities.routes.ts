import { Router } from "express";
import { authenticate } from "../../core/auth/guards";
import { validateBody, validateParams, validateQuery } from "../../core/middleware/validate";
import { tripActivitiesController } from "./trip-activities.controller";
import {
  stopIdParamSchema,
  itineraryItemIdParamSchema,
  createItineraryItemSchema,
  updateItineraryItemSchema,
  reorderItineraryItemSchema,
  listQuerySchema,
} from "./trip-activities.schema";

const router = Router();

router.get(
  "/stops/:stopId/activities",
  authenticate,
  validateParams(stopIdParamSchema),
  validateQuery(listQuerySchema),
  tripActivitiesController.listStopActivities
);

router.post(
  "/stops/:stopId/activities",
  authenticate,
  validateParams(stopIdParamSchema),
  validateBody(createItineraryItemSchema),
  tripActivitiesController.addActivityToStop
);

router.patch(
  "/trip-activities/:id",
  authenticate,
  validateParams(itineraryItemIdParamSchema),
  validateBody(updateItineraryItemSchema),
  tripActivitiesController.updateItineraryItem
);

router.patch(
  "/trip-activities/:id/reorder",
  authenticate,
  validateParams(itineraryItemIdParamSchema),
  validateBody(reorderItineraryItemSchema),
  tripActivitiesController.reorderItineraryItem
);

router.delete(
  "/trip-activities/:id",
  authenticate,
  validateParams(itineraryItemIdParamSchema),
  tripActivitiesController.removeActivityFromTrip
);

export default router;