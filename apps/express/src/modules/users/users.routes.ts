import { Router } from "express";
import { authenticate } from "../../core/auth/guards";
import { requirePermission } from "../../core/rbac/guards";
import { validateBody, validateParams, validateQuery } from "../../core/middleware/validate";
import { uploadAvatar } from "../../shared/upload";
import { usersController } from "./users.controller";
import {
  listUsersQuerySchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  userIdParamsSchema,
  updateMeSchema,
  cityIdParamsSchema,
} from "./users.schema";

const router = Router();

// --- Personal Profile Routes (Authenticated Only) ---
router.use(authenticate);

router.patch(
  "/me",
  uploadAvatar.single("avatar"),
  (req, res, next) => {
    if (req.file) {
      req.body.avatarUrl = req.file.path;
    }
    next();
  },
  validateBody(updateMeSchema),
  usersController.updateMe
);

router.delete("/me", usersController.deleteMe);
router.get("/me/saved-destinations", usersController.getSavedDestinations);

router.post(
  "/me/saved-destinations/:cityId",
  validateParams(cityIdParamsSchema),
  usersController.saveDestination
);

router.delete(
  "/me/saved-destinations/:cityId",
  validateParams(cityIdParamsSchema),
  usersController.removeSavedDestination
);

// --- Admin Routes (Require users:manage permission) ---
const adminRouter = Router();
adminRouter.use(requirePermission("users:manage"));

adminRouter.get("/", validateQuery(listUsersQuerySchema), usersController.listUsers);
adminRouter.get("/:id", validateParams(userIdParamsSchema), usersController.getUser);

adminRouter.patch(
  "/:id/role",
  validateParams(userIdParamsSchema),
  validateBody(updateUserRoleSchema),
  usersController.updateUserRole
);

adminRouter.patch(
  "/:id/status",
  validateParams(userIdParamsSchema),
  validateBody(updateUserStatusSchema),
  usersController.updateUserStatus
);

router.use("/", adminRouter);

export default router;
