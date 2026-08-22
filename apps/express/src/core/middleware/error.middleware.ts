import type { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { env } from "../../config/env";
import { logger } from "../logger/logger";
import { AppError } from "../errors/app-error";
import { sendError } from "../http/response";

interface MappedError {
  message: string;
  statusCode: number;
  code: string;
  details?: unknown;
}

function mapUnknownError(err: unknown): MappedError {
  if (err instanceof AppError) {
    return { message: err.message, statusCode: err.statusCode, code: err.code, details: err.details };
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return { message: "a record with that unique value already exists", statusCode: 409, code: "CONFLICT" };
    }
    if (err.code === "P2025") {
      return { message: "requested record was not found", statusCode: 404, code: "NOT_FOUND" };
    }
    return { message: "database operation failed", statusCode: 500, code: "DATABASE_ERROR" };
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return { message: "database is unavailable", statusCode: 500, code: "DATABASE_ERROR" };
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return { message: "invalid database operation", statusCode: 500, code: "INTERNAL_SERVER_ERROR" };
  }

  if (typeof err === "object" && err !== null && "type" in err) {
    const type = (err as { type?: unknown }).type;
    if (type === "entity.too.large") {
      return { message: "request payload too large", statusCode: 413, code: "PAYLOAD_TOO_LARGE" };
    }
    if (type === "entity.parse.failed") {
      return { message: "malformed JSON in request body", statusCode: 400, code: "VALIDATION_ERROR" };
    }
  }

  return { message: "an unexpected error occurred", statusCode: 500, code: "INTERNAL_SERVER_ERROR" };
}

export const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  const mapped = mapUnknownError(err);

  if (mapped.statusCode >= 500) {
    const diagnostic: Record<string, unknown> = {
      requestId: req.requestId,
      code: mapped.code,
      message: err instanceof Error ? err.message : String(err),
    };
    if (env.NODE_ENV !== "production" && err instanceof Error) {
      diagnostic.stack = err.stack;
    }
    logger.error("request failed", diagnostic);
  }

  sendError(res, mapped.message, mapped.statusCode, mapped.code, mapped.details);
};
