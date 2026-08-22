import type { RequestHandler } from "express";
import { randomUUID } from "node:crypto";
import { REQUEST_ID_HEADER } from "../../config/constants";

export const requestIdMiddleware: RequestHandler = (req, res, next) => {
  const incoming = req.headers[REQUEST_ID_HEADER.toLowerCase()];
  const incomingValue = Array.isArray(incoming) ? incoming[0] : incoming;
  const requestId = incomingValue && incomingValue.length <= 128 ? incomingValue : randomUUID();

  req.headers[REQUEST_ID_HEADER.toLowerCase()] = requestId;
  res.setHeader(REQUEST_ID_HEADER, requestId);

  next();
};
