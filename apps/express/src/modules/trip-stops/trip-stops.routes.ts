import { Router } from "express";
import { authenticate } from "../../core/auth/guards";
import { validateBody, validateParams } from "../../core/middleware/validate";
import { tripStopsController } from "./trip-stops.controller";
import {
  createTripStopSchema,
  reorderTripStopSchema,
  stopIdParamsSchema,
  tripIdParamsSchema,
  updateTripStopSchema,
} from "./trip-stops.schema";

const router = Router();

router.use(authenticate);

// Top-level stops routes: /api/v1/stops/:id
router.patch(
  "/:id",
  validateParams(stopIdParamsSchema),
  validateBody(updateTripStopSchema),
  tripStopsController.updateStop
);

router.patch(
  "/:id/reorder",
  validateParams(stopIdParamsSchema),
  validateBody(reorderTripStopSchema),
  tripStopsController.reorderStop
);

router.delete(
  "/:id",
  validateParams(stopIdParamsSchema),
  tripStopsController.deleteStop
);

export const nestedTripStopsRouter = Router({ mergeParams: true });
nestedTripStopsRouter.use(authenticate);

nestedTripStopsRouter.get(
  "/",
  validateParams(tripIdParamsSchema),
  tripStopsController.listStops
);

nestedTripStopsRouter.post(
  "/",
  validateParams(tripIdParamsSchema),
  validateBody(createTripStopSchema),
  tripStopsController.addStop
);

export default router;
