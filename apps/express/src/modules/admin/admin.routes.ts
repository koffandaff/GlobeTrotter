import { Router } from "express";
import { authenticate, requireRole } from "../../core/auth/guards";
import { validateBody, validateParams, validateQuery } from "../../core/middleware/validate";
import { adminController } from "./admin.controller";
import {
  logsQuerySchema,
  usersQuerySchema,
  updateUserBodySchema,
  uuidParamsSchema,
} from "./admin.schema";

const router = Router();

// Apply auth and admin role to all routes in this module
router.use(authenticate, requireRole("ADMIN"));

// --- Analytics / Stats ---
router.get("/stats/overview", adminController.getOverviewStats);
router.get("/stats/top-cities", adminController.getTopCities);
router.get("/stats/top-activities", adminController.getTopActivities);

// --- User Management ---
router.get("/users", validateQuery(usersQuerySchema), adminController.getUsersList);
router.patch("/users/:id", validateParams(uuidParamsSchema), validateBody(updateUserBodySchema), adminController.updateUserStatus);

// --- System Logs ---
router.get("/logs", validateQuery(logsQuerySchema), adminController.getLogsList);
router.get("/logs/export", validateQuery(logsQuerySchema), adminController.exportLogsCsv);
router.get("/logs/:id", validateParams(uuidParamsSchema), adminController.getLogById);

export default router;
