import { Router } from "express";
import { authenticate } from "../../core/auth/guards";
import { validateBody, validateParams } from "../../core/middleware/validate";
import { sharingController } from "./sharing.controller";
import {
  tripIdParamsSchema,
  shareSlugParamsSchema,
  createShareBodySchema,
} from "./sharing.schema";

const router = Router();

// --- Protected Routes ---
router.post(
  "/trips/:id/share",
  authenticate,
  validateParams(tripIdParamsSchema),
  validateBody(createShareBodySchema),
  sharingController.createShare
);

router.delete(
  "/trips/:id/share",
  authenticate,
  validateParams(tripIdParamsSchema),
  sharingController.revokeShare
);

router.post(
  "/public/trips/:shareSlug/copy",
  authenticate,
  validateParams(shareSlugParamsSchema),
  sharingController.copySharedTrip
);

// --- Public Routes ---
router.get(
  "/public/trips/:shareSlug",
  validateParams(shareSlugParamsSchema),
  sharingController.getSharedTrip
);

export default router;
