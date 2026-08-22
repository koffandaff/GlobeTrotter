import type { RequestHandler } from "express";
import { z } from "zod";
import { ValidationError } from "../errors/app-error";

function formatZodIssues(error: z.ZodError): { field: string; message: string }[] {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || issue.code,
    message: issue.message,
  }));
}

export function validateBody<TSchema extends z.ZodType>(schema: TSchema): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(new ValidationError("invalid request body", formatZodIssues(result.error)));
      return;
    }

    req.body = result.data;
    next();
  };
}

export function validateParams<TSchema extends z.ZodType<Record<string, string>>>(
  schema: TSchema
): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      next(new ValidationError("invalid route parameters", formatZodIssues(result.error)));
      return;
    }

    (req.params as Record<string, string>) = result.data;
    next();
  };
}

export function validateQuery<TSchema extends z.ZodType<Record<string, string | string[] | undefined>>>(
  schema: TSchema
): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      next(new ValidationError("invalid query parameters", formatZodIssues(result.error)));
      return;
    }

    (req.query as Record<string, string | string[] | undefined>) = result.data;
    next();
  };
}
