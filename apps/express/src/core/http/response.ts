import type { Response } from "express";

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: true;
  message?: string;
  data: T;
  pagination?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
): Response {
  const responsePayload: ApiResponse<T> = {
    success: true,
    ...(message ? { message } : {}),
    data,
  };
  return res.status(statusCode).json(responsePayload);
}

export function sendCreated<T>(
  res: Response,
  data: T,
  message = "Resource created successfully"
): Response {
  return sendSuccess(res, data, message, 201);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta,
  message?: string
): Response {
  const responsePayload: ApiResponse<T[]> = {
    success: true,
    ...(message ? { message } : {}),
    data,
    pagination,
  };
  return res.status(200).json(responsePayload);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  code = "INTERNAL_SERVER_ERROR",
  details?: unknown
): Response {
  const responsePayload: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
  };
  return res.status(statusCode).json(responsePayload);
}

export function ok<T>(res: Response, data: T, statusCode = 200): Response {
  // keep compatibility: ok() -> sendSuccess()
  return sendSuccess(res, data, undefined, statusCode);
}
