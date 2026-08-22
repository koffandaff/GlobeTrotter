import { Router } from "express";
import { authenticate } from "../../core/auth/guards";
import { validateBody, validateParams } from "../../core/middleware/validate";
import { budgetController } from "./budget.controller";
import {
  categoryParamSchema,
  tripIdParamSchema,
  updateCategoryBudgetSchema,
} from "./budget.schema";

const router = Router();

router.use(authenticate);

// Endpoints mounted under /api/v1/trips
router.get("/:id/budget", validateParams(tripIdParamSchema), budgetController.getTripBudget);

router.patch(
  "/:id/budget/:category",
  validateParams(categoryParamSchema),
  validateBody(updateCategoryBudgetSchema),
  budgetController.updateCategoryBudget
);

export default router;
