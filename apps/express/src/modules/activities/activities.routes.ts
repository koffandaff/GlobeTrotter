import { Router } from "express";
import { authenticate } from "../../core/auth/guards";
import { validateQuery, validateParams } from "../../core/middleware/validate";
import { activitiesController } from "./activities.controller";
import { activitySearchQuerySchema, activityIdParamSchema } from "./activities.schema";

const router = Router();

router.get(
  "/",
  authenticate,
  validateQuery(activitySearchQuerySchema),
  activitiesController.searchActivities
);

router.get(
  "/:id",
  authenticate,
  validateParams(activityIdParamSchema),
  activitiesController.getActivityDetail
);

export default router;