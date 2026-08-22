import { Router } from "express";
import { authenticate } from "../../core/auth/guards";
import { validateBody, validateParams, validateQuery } from "../../core/middleware/validate";
import { communityController } from "./community.controller";
import {
  communityTripsQuerySchema,
  uuidParamsSchema,
  addCommentBodySchema,
  paginationQuerySchema,
} from "./community.schema";

const router = Router();

// --- Public Routes ---
router.get(
  "/trips",
  validateQuery(communityTripsQuerySchema),
  communityController.getCommunityTrips
);

router.get(
  "/trips/:id",
  validateParams(uuidParamsSchema),
  communityController.getPublicTrip
);

router.get(
  "/trips/:id/comments",
  validateParams(uuidParamsSchema),
  validateQuery(paginationQuerySchema),
  communityController.getTripComments
);

router.get(
  "/users/:id",
  validateParams(uuidParamsSchema),
  communityController.getPublicProfile
);

// --- Protected Routes ---
router.post(
  "/trips/:id/like",
  authenticate,
  validateParams(uuidParamsSchema),
  communityController.likeTrip
);

router.delete(
  "/trips/:id/like",
  authenticate,
  validateParams(uuidParamsSchema),
  communityController.unlikeTrip
);

router.post(
  "/trips/:id/comments",
  authenticate,
  validateParams(uuidParamsSchema),
  validateBody(addCommentBodySchema),
  communityController.addComment
);

router.delete(
  "/comments/:id", // Re-mapped for cleanliness per REST, but matching controller
  authenticate,
  validateParams(uuidParamsSchema),
  communityController.deleteComment
);

router.post(
  "/users/:id/follow",
  authenticate,
  validateParams(uuidParamsSchema),
  communityController.followUser
);

router.delete(
  "/users/:id/follow",
  authenticate,
  validateParams(uuidParamsSchema),
  communityController.unfollowUser
);

router.get(
  "/feed",
  authenticate,
  validateQuery(paginationQuerySchema),
  communityController.getPersonalizedFeed
);

export default router;
