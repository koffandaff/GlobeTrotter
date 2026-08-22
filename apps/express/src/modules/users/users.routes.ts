import { Router } from "express";
import { authenticate } from "../../core/auth/guards";
import { requirePermission } from "../../core/rbac/guards";
import { validateBody, validateParams, validateQuery } from "../../core/middleware/validate";
import { usersController } from "./users.controller";
import {
  listUsersQuerySchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  userIdParamsSchema,
} from "./users.schema";

const router = Router();

router.use(authenticate, requirePermission("users:manage"));

router.get("/", validateQuery(listUsersQuerySchema), usersController.listUsers);

router.get("/:id", validateParams(userIdParamsSchema), usersController.getUser);

router.patch(
  "/:id/role",
  validateParams(userIdParamsSchema),
  validateBody(updateUserRoleSchema),
  usersController.updateUserRole
);

router.patch(
  "/:id/status",
  validateParams(userIdParamsSchema),
  validateBody(updateUserStatusSchema),
  usersController.updateUserStatus
);

export default router;
