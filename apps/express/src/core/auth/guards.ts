import type { RequestHandler } from "express";
import { prisma } from "../../shared/prisma";
import { AuthenticationError } from "../errors/app-error";
import { verifyAccessToken } from "./jwt";

export const authenticate: RequestHandler = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      throw new AuthenticationError("access token required");
    }

    const token = header.slice("Bearer ".length).trim();
    if (!token) {
      throw new AuthenticationError("access token required");
    }

    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, status: true },
    });

    if (!user) {
      throw new AuthenticationError("user no longer exists");
    }

    if (user.status !== "ACTIVE") {
      throw new AuthenticationError("account is not active");
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

import { AuthorizationError } from "../errors/app-error";

export const requireRole = (requiredRole: string): RequestHandler => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AuthenticationError("Not authenticated"));
    }
    if (req.user.role !== requiredRole) {
      return next(new AuthorizationError("Forbidden"));
    }
    next();
  };
};

