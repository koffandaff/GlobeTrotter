import { Router } from "express";
import { authenticate } from "../../core/auth/guards";
import { validateQuery } from "../../core/middleware/validate";
import { dashboardController } from "./dashboard.controller";
import { getDashboardQuerySchema } from "./dashboard.schema";

const router = Router();

router.get(
  "/",
  authenticate,
  validateQuery(getDashboardQuerySchema),
  dashboardController.getDashboard
);

export default router;