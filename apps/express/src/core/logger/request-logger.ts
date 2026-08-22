import type { RequestHandler } from "express";
import { performance } from "node:perf_hooks";
import { logger } from "./logger";
import { REQUEST_ID_HEADER } from "../../config/constants";

export const requestLoggerMiddleware: RequestHandler = (req, res, next) => {
  const startedAt = performance.now();

  res.on("finish", () => {
    logger.info("http request", {
      requestId: req.headers[REQUEST_ID_HEADER] || undefined,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Math.round(performance.now() - startedAt),
    });
  });

  next();
};
