import { Router } from "express";
import { authenticate } from "../../core/auth/guards";
import { validateBody, validateParams, validateQuery } from "../../core/middleware/validate";
import { tripsController } from "./trips.controller";
import {
  createTripSchema,
  listTripsQuerySchema,
  tripIdParamsSchema,
  updateTripSchema,
} from "./trips.schema";

import { nestedTripStopsRouter } from "../trip-stops";

const router = Router();

router.use(authenticate);

router.use("/:tripId/stops", nestedTripStopsRouter);

router.get("/", validateQuery(listTripsQuerySchema), tripsController.listTrips);

router.post("/", validateBody(createTripSchema), tripsController.createTrip);

router.get("/:id", validateParams(tripIdParamsSchema), tripsController.getTrip);

router.patch(
  "/:id",
  validateParams(tripIdParamsSchema),
  validateBody(updateTripSchema),
  tripsController.updateTrip
);

router.delete("/:id", validateParams(tripIdParamsSchema), tripsController.deleteTrip);

router.post(
  "/:id/duplicate",
  validateParams(tripIdParamsSchema),
  tripsController.duplicateTrip
);

export default router;
