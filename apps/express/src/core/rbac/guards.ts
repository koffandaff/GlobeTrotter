import type { RequestHandler } from "express";
import { AuthorizationError } from "../errors/app-error";
import { ROLE_PERMISSIONS, type Permission } from "./roles";

export function requirePermission(...requiredPermissions: Permission[]): RequestHandler {
  return (req, _res, next) => {
    if (req.user) {
      const userPermissions = ROLE_PERMISSIONS[req.user.role];
      if (requiredPermissions.some((permission) => userPermissions.includes(permission))) {
        next();
        return;
      }
    }

    next(new AuthorizationError("insufficient permissions"));
  };
}
